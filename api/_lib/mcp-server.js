import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { DATASET, DEMO_SENTENCE } from './ingredients-data.js';
import {
  checkAdditive,
  scanIngredientList,
  searchAdditives,
  checkNutrition,
  checkPesticideMrl
} from './mcp-engine.js';

export const MCP_PATH = '/api/mcp';

export const SERVER_INFO = {
  name: 'nutrisafe-food-mcp',
  title: 'NutriSafe Food Safety MCP (demo dataset)',
  version: '3.0.0'
};

export { DATASET };

const SOURCE_STRING = 'NutriSafe demo dataset bundled with this app';

export async function mcpHandler(req, res) {
  // 1. Origin header check for every method
  const originHeader = req.headers['origin'];
  if (originHeader) {
    let originHost = '';
    try {
      const url = new URL(originHeader);
      originHost = url.host.toLowerCase();
    } catch {
      originHost = originHeader.replace(/^https?:\/\//, '').split('/')[0].toLowerCase();
    }

    const hostHeader = (req.headers['host'] || '').toLowerCase();
    const xForwardedHost = (req.headers['x-forwarded-host'] || '').split(',')[0].trim().toLowerCase();

    const isMatch = (hostHeader && originHost === hostHeader) ||
                    (xForwardedHost && originHost === xForwardedHost);

    if (!isMatch) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32000, message: 'Forbidden: Origin does not match request Host or X-Forwarded-Host.' },
        id: null
      }));
      return;
    }
  }

  // 2. On GET without "text/event-stream" in the Accept header
  const accept = req.headers['accept'] || '';
  if (req.method === 'GET' && !accept.includes('text/event-stream')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      server: SERVER_INFO,
      mcpPath: MCP_PATH,
      tools: [
        'check_additive',
        'check_ingredient_list',
        'search_additives',
        'check_nutrition',
        'check_pesticide_mrl'
      ],
      dataset: DATASET,
      connect: {
        transport: 'StreamableHTTP',
        protocolVersion: '2025-11-25',
        endpoint: MCP_PATH,
        instructions: DEMO_SENTENCE
      }
    }));
    return;
  }

  // 3. On any other method except POST
  if (req.method !== 'POST') {
    res.writeHead(405, {
      'Allow': 'POST, GET',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Method not allowed. Send MCP messages with POST.' },
      id: null
    }));
    return;
  }

  // 4. On POST: read req.body inside try
  let body;
  try {
    if (req.body !== undefined) {
      if (typeof req.body === 'string') {
        body = req.body.trim() ? JSON.parse(req.body) : undefined;
      } else {
        body = req.body;
      }
    } else {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      body = raw.trim() ? JSON.parse(raw) : undefined;
    }
  } catch {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32700, message: 'Parse error: Malformed JSON payload.' },
      id: null
    }));
    return;
  }

  // Create fresh server and transport for this request
  const server = new McpServer(SERVER_INFO, { instructions: DEMO_SENTENCE });

  // Tool 1: check_additive
  server.registerTool('check_additive', {
    title: 'Check Food Additive Safety (demo dataset)',
    description: 'Returns safety assessment, chemical taxonomy, E-number details, regulatory restrictions, and biological health impacts for an additive. Read strictly from the demo dataset bundled with this app. Use this tool when verifying individual food additives, E-numbers, or chemical preservatives. It does not cover laboratory batch testing or unverified industrial codices.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('Additive name, common alias, chemical name, CAS number, or E-number (e.g. E211, MSG, BHA)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async ({ query }) => {
    const result = checkAdditive(query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: SOURCE_STRING, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `The bundled demo dataset of ${DATASET.additivesCount} additives contains no single match for '${query}'.`;
    const payload = { found: false, dataset: 'demo', source: SOURCE_STRING, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  // Tool 2: check_ingredient_list
  server.registerTool('check_ingredient_list', {
    title: 'Scan Ingredient Cocktail & Allergens (demo dataset)',
    description: 'Parses a multi-ingredient product label to detect food additives, hazardous chemical interactions (e.g. benzene formation), major allergens, and dietary suitability. Read strictly from the demo dataset bundled with this app. Use this tool when checking whole packaged food ingredient labels or recipes. It does not cover microbiological pathogen assays or unlisted agricultural residues.',
    inputSchema: {
      ingredients: z.string().trim().min(1).max(4000).describe('Full ingredient list text separated by commas (e.g. Water, Sugar, E211, Citric Acid, Soy Lecithin)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async ({ ingredients }) => {
    const result = scanIngredientList(ingredients);
    if (result.detectedAdditives.length > 0 || result.allergens.length > 0) {
      const payload = { found: true, dataset: 'demo', source: SOURCE_STRING, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `The bundled demo dataset of ${DATASET.additivesCount} additives contains no matched additives or allergens in the provided ingredient list.`;
    const payload = { found: false, dataset: 'demo', source: SOURCE_STRING, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  // Tool 3: search_additives
  server.registerTool('search_additives', {
    title: 'Search Additive Directory (demo dataset)',
    description: 'Searches the catalogue of food additives with optional text keywords and safety category filters. Read strictly from the demo dataset bundled with this app. Use this tool when browsing additives, listing banned substances, or filtering by functional categories like colour or preservative. It does not cover live supply chain trade prices.',
    inputSchema: {
      query: z.string().trim().max(200).optional().describe('Search query keyword for additive names, functions, or E-numbers'),
      category: z.string().trim().max(100).optional().describe('Category filter such as banned, colour, preservative, antioxidant, sweetener, or emulsifier')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async ({ query = '', category = '' }) => {
    const result = searchAdditives(query, category);
    const payload = { found: true, dataset: 'demo', source: SOURCE_STRING, result };
    return {
      content: [{ type: 'text', text: JSON.stringify(payload) }],
      structuredContent: payload
    };
  });

  // Tool 4: check_nutrition
  server.registerTool('check_nutrition', {
    title: 'Check Athletic Nutrition & Recovery Foods (demo dataset)',
    description: 'Provides macronutrient profiles, glycemic indices, pre/post exercise timing recommendations, and athletic recovery scores for foods. Read strictly from the demo dataset bundled with this app. Use this tool when planning sports nutrition meals or looking up whole recovery foods in English or Hebrew. It does not cover clinical enteral hospital diets.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('Food name in English or Hebrew (e.g. Hummus, חומוס, Greek Yogurt, Chicken Breast, Oats)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async ({ query }) => {
    const result = checkNutrition(query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: SOURCE_STRING, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `The bundled demo dataset of ${DATASET.nutritionCount} nutrition records contains no single match for '${query}'.`;
    const payload = { found: false, dataset: 'demo', source: SOURCE_STRING, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  // Tool 5: check_pesticide_mrl
  server.registerTool('check_pesticide_mrl', {
    title: 'Check Pesticide Maximum Residue Limits (demo dataset)',
    description: 'Retrieves maximum residue limits (MRLs), detected demo test quantities, agricultural crops, and chemical classes for agricultural pesticides. Read strictly from the demo dataset bundled with this app. Use this tool when checking pesticide chemicals, CAS numbers, or crop agricultural safety tolerances. It does not cover residential municipal tap water plumbing analysis.',
    inputSchema: {
      query: z.string().trim().min(1).max(200).describe('Pesticide name, CAS number, or agricultural crop name (e.g. Glyphosate, Chlorpyrifos, 1071-83-6, banana)')
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false }
  }, async ({ query }) => {
    const result = checkPesticideMrl(query);
    if (result) {
      const payload = { found: true, dataset: 'demo', source: SOURCE_STRING, result };
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload
      };
    }
    const message = `The bundled demo dataset of ${DATASET.pesticidesCount} pesticide MRL records contains no single match for '${query}'.`;
    const payload = { found: false, dataset: 'demo', source: SOURCE_STRING, message };
    return {
      isError: true,
      content: [
        { type: 'text', text: message },
        { type: 'text', text: JSON.stringify(payload) }
      ],
      structuredContent: payload
    };
  });

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  await transport.handleRequest(req, res, body);

  res.on('close', async () => {
    try {
      await transport.close();
    } catch {}
    try {
      await server.close();
    } catch {}
  });
}
