import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { mcpHandler, MCP_PATH, SERVER_INFO, DATASET } from './api/_lib/mcp-server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON body parser for /api routes
  app.use('/api', express.json({ limit: '1mb' }));

  // Health endpoint reporting MCP info & dataset
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      mcpPath: MCP_PATH,
      serverInfo: SERVER_INFO,
      dataset: DATASET,
      timestamp: new Date().toISOString()
    });
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
