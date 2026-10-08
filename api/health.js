import { MCP_PATH, SERVER_INFO, DATASET } from './_lib/mcp-server.js';

export default function handler(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    mcpPath: MCP_PATH,
    serverInfo: SERVER_INFO,
    dataset: DATASET,
    nutribalanceConnected: Boolean(process.env.NUTRITION_API_KEY),
    timestamp: new Date().toISOString()
  }));
}
