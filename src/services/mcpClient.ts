import { useSyncExternalStore } from 'react';

export class McpNotFoundError extends Error {
  payload: any;
  constructor(message: string, payload?: any) {
    super(message);
    this.name = 'McpNotFoundError';
    this.payload = payload;
  }
}

export function describeMcpError(err: unknown): string {
  if (err instanceof McpNotFoundError) {
    return err.message;
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError' || err.message.includes('timeout')) {
      return 'The MCP server request timed out after 15 seconds.';
    }
    if (err.message.includes('500') || err.message.includes('502') || err.message.includes('503') || err.message.includes('504')) {
      return 'The embedded MCP server responded with a server error (5xx).';
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return 'Connection dropped or could not reach embedded MCP server at /api/mcp.';
    }
    return err.message;
  }
  return 'An unexpected error occurred while communicating with the MCP server.';
}

export interface McpState {
  status: 'idle' | 'online' | 'offline';
  latency: number | null; // null represents "--"
  lastTool: string | null;
  lastCallTime: number | null;
  error: string | null;
  callCount: number;
}

let currentState: McpState = {
  status: 'idle',
  latency: null,
  lastTool: null,
  lastCallTime: null,
  error: null,
  callCount: 0
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function updateState(partial: Partial<McpState>) {
  currentState = { ...currentState, ...partial };
  notify();
}

export function getMcpSnapshot(): McpState {
  return currentState;
}

export function subscribeMcp(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMcpStatus(): McpState {
  return useSyncExternalStore(subscribeMcp, getMcpSnapshot, getMcpSnapshot);
}

let initialized = false;
let negotiatedProtocolVersion = '2025-11-25';
let reqCounter = 1;

async function postWithTimeout(url: string, headers: Record<string, string>, body: any, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        ...headers
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function ensureMcpInitialized(): Promise<void> {
  if (initialized) return;

  const initBody = {
    jsonrpc: '2.0',
    id: reqCounter++,
    method: 'initialize',
    params: {
      protocolVersion: '2025-11-25',
      capabilities: {},
      clientInfo: {
        name: 'nutrisafe-web-client',
        version: '3.0.0'
      }
    }
  };

  const initRes = await postWithTimeout('/api/mcp', {}, initBody);
  if (!initRes.ok) {
    throw new Error(`MCP initialization failed with HTTP status ${initRes.status}`);
  }

  const initData = await initRes.json();
  const serverVersion = initRes.headers.get('mcp-protocol-version') || initData.result?.protocolVersion;
  if (serverVersion) {
    negotiatedProtocolVersion = serverVersion;
  }

  // Send notifications/initialized (202 Accepted with no body)
  const notifBody = {
    jsonrpc: '2.0',
    method: 'notifications/initialized'
  };

  await postWithTimeout('/api/mcp', {
    'MCP-Protocol-Version': negotiatedProtocolVersion
  }, notifBody);

  initialized = true;
}

export interface McpCallResult<T = any> {
  data: T;
  rawPayload: any;
  latency: number;
}

export async function callMcp<T = any>(tool: string, args: Record<string, any>): Promise<McpCallResult<T>> {
  const startTime = performance.now();

  try {
    // 1. Ensure handshake sequence is complete
    await ensureMcpInitialized();

    // 2. tools/call
    const callBody = {
      jsonrpc: '2.0',
      id: reqCounter++,
      method: 'tools/call',
      params: {
        name: tool,
        arguments: args
      }
    };

    const res = await postWithTimeout('/api/mcp', {
      'MCP-Protocol-Version': negotiatedProtocolVersion
    }, callBody);

    const latency = Math.round(performance.now() - startTime);

    if (res.status >= 500) {
      initialized = false;
      updateState({
        status: 'offline',
        latency: null,
        error: `Server responded with ${res.status}`,
        lastTool: tool,
        lastCallTime: Date.now(),
        callCount: currentState.callCount + 1
      });
      throw new Error(`MCP Server Error (${res.status})`);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.error?.message || `HTTP ${res.status} from MCP server`;
      updateState({
        status: 'offline',
        latency: null,
        error: msg,
        lastTool: tool,
        lastCallTime: Date.now(),
        callCount: currentState.callCount + 1
      });
      throw new Error(msg);
    }

    const json = await res.json();
    const result = json.result || {};
    const structured = result.structuredContent;

    // Check if MCP returned isError or found: false
    if (result.isError) {
      const message = structured?.message ||
        (Array.isArray(result.content) ? result.content[0]?.text : null) ||
        `No match found for tool ${tool}.`;

      updateState({
        status: 'online',
        latency,
        error: null,
        lastTool: tool,
        lastCallTime: Date.now(),
        callCount: currentState.callCount + 1
      });

      throw new McpNotFoundError(message, structured);
    }

    updateState({
      status: 'online',
      latency,
      error: null,
      lastTool: tool,
      lastCallTime: Date.now(),
      callCount: currentState.callCount + 1
    });

    return {
      data: (structured?.result !== undefined ? structured.result : result) as T,
      rawPayload: json,
      latency
    };
  } catch (err: any) {
    const isNotFound = err instanceof McpNotFoundError;
    if (!isNotFound) {
      // Offline on timeout, connection drop, 5xx
      initialized = false;
      updateState({
        status: 'offline',
        latency: null,
        error: err.message,
        lastTool: tool,
        lastCallTime: Date.now(),
        callCount: currentState.callCount + 1
      });
    }
    throw err;
  }
}
