import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { mcpHandler, MCP_PATH, SERVER_INFO, DATASET } from './api/_lib/mcp-server.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON body parser for /api routes
  app.use('/api', express.json({ limit: '1mb' }));

  // Health endpoint reporting MCP info, dataset & upstream status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      mcpPath: MCP_PATH,
      serverInfo: SERVER_INFO,
      dataset: DATASET,
      nutribalanceConnected: Boolean(process.env.NUTRITION_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Upstream NutriBalance proxy route utilizing NUTRITION_API_KEY
  app.all('/api/nutribalance', async (req, res) => {
    const apiKey = process.env.NUTRITION_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'NUTRITION_API_KEY is not configured on the server.',
        message: 'Set NUTRITION_API_KEY in environment variables to enable the upstream NutriBalance/nutribalance-mcp bridge.'
      });
    }

    const upstreamUrl = process.env.NUTRIBALANCE_URL || 'https://api.nutribalance.io/mcp';

    try {
      const upstreamRes = await fetch(upstreamUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey,
          'Accept': 'application/json, text/event-stream'
        },
        body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
      });

      const data = await upstreamRes.json().catch(() => null);
      return res.status(upstreamRes.status).json(data || { status: upstreamRes.statusText });
    } catch (err: any) {
      return res.status(502).json({
        error: 'Failed to connect to upstream NutriBalance/nutribalance-mcp server.',
        details: err.message
      });
    }
  });

  // MCP endpoint handler
  app.all(['/api/mcp', '/api'], (req, res, next) => {
    mcpHandler(req, res).catch(next);
  });

  // Express error handler for /api: returns JSON-RPC errors
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32700, message: 'Parse error: Invalid JSON payload.' },
        id: null
      });
    }
    if (err) {
      return res.status(400).json({
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request: Malformed payload or parameter error.' },
        id: null
      });
    }
    next();
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
    console.log(`MCP server mounted at ${MCP_PATH}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
