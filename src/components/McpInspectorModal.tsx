import React, { useState } from 'react';
import { X, Terminal, CheckCircle2, AlertOctagon, Send, Copy, ArrowRight } from 'lucide-react';
import { callMcp, useMcpStatus, describeMcpError } from '../services/mcpClient.ts';

interface McpInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const McpInspectorModal: React.FC<McpInspectorModalProps> = ({ isOpen, onClose }) => {
  const mcpStatus = useMcpStatus();

  const [selectedTool, setSelectedTool] = useState('check_additive');
  const [toolArgs, setToolArgs] = useState('{\n  "query": "E211"\n}');
  const [executing, setExecuting] = useState(false);
  const [responseLog, setResponseLog] = useState<any>(null);
  const [execError, setExecError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSendToolCall() {
    setExecuting(true);
    setExecError(null);
    setResponseLog(null);

    let parsedArgs: any = {};
    try {
      parsedArgs = JSON.parse(toolArgs);
    } catch {
      setExecError('Invalid JSON in arguments field.');
      setExecuting(false);
      return;
    }

    try {
      const res = await callMcp(selectedTool, parsedArgs);
      setResponseLog({
        status: 200,
        latency: res.latency,
        tool: selectedTool,
        args: parsedArgs,
        rawPayload: res.rawPayload,
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      setExecError(describeMcpError(err));
      setResponseLog({
        status: 'Error / No match',
        error: describeMcpError(err),
        tool: selectedTool,
        args: parsedArgs,
        timestamp: new Date().toISOString()
      });
    } finally {
      setExecuting(false);
    }
  }

  function handleSelectTool(tool: string) {
    setSelectedTool(tool);
    if (tool === 'check_additive') {
      setToolArgs('{\n  "query": "E211"\n}');
    } else if (tool === 'check_ingredient_list') {
      setToolArgs('{\n  "ingredients": "Water, Sugar, E211, Citric Acid, Soy Lecithin"\n}');
    } else if (tool === 'search_additives') {
      setToolArgs('{\n  "query": "",\n  "category": "banned"\n}');
    } else if (tool === 'check_nutrition') {
      setToolArgs('{\n  "query": "hummus"\n}');
    } else if (tool === 'check_pesticide_mrl') {
      setToolArgs('{\n  "query": "glyphosate"\n}');
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-neutral-950 border-2 border-lime-400 shadow-2xl flex flex-col text-white font-sans">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b-2 border-neutral-800 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-lime-400 text-black flex items-center justify-center font-bold">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white">
                MCP INSPECTOR 2025-11-25 · STREAMABLE HTTP
              </h2>
              <p className="text-[11px] font-mono text-neutral-400">
                Endpoint: <span className="text-lime-400">/api/mcp</span> · Server: nutrisafe-food-mcp v3.0.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Live Handshake Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-neutral-900 border border-neutral-800 font-mono text-[11px]">
            <div>
              <span className="text-neutral-500 uppercase">Status</span>
              <p className={`font-bold ${mcpStatus.status === 'online' ? 'text-lime-400' : 'text-red-400'}`}>
                {mcpStatus.status.toUpperCase()}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">Measured Latency</span>
              <p className="font-bold text-white tabular-nums">
                {mcpStatus.latency !== null ? `${mcpStatus.latency} ms` : '--'}
              </p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">Protocol Version</span>
              <p className="font-bold text-white">2025-11-25</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase">Total Calls</span>
              <p className="font-bold text-lime-400 tabular-nums">{mcpStatus.callCount}</p>
            </div>
          </div>

          {/* Interactive Tester */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Execute Live MCP Tool Call
            </span>

            {/* Tool selector */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'check_additive',
                'check_ingredient_list',
                'search_additives',
                'check_nutrition',
                'check_pesticide_mrl'
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleSelectTool(t)}
                  className={`px-3 py-1 font-mono text-xs font-bold uppercase border cursor-pointer ${
                    selectedTool === t
                      ? 'bg-lime-400 text-black border-white'
                      : 'bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Arguments Editor */}
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                JSON-RPC Arguments (params.arguments):
              </label>
              <textarea
                rows={4}
                value={toolArgs}
                onChange={(e) => setToolArgs(e.target.value)}
                className="w-full p-3 bg-black border border-neutral-700 font-mono text-xs text-lime-300 focus:border-lime-400 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSendToolCall}
              disabled={executing}
              className="flex items-center gap-2 px-5 py-2.5 bg-lime-400 text-black font-black uppercase text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{executing ? 'DISPATCHING...' : 'DISPATCH TOOLS/CALL VIA STREAMABLE HTTP'}</span>
            </button>
          </div>

          {/* Response payload viewer */}
          {responseLog && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-neutral-400 uppercase">Live Server Response Payload:</span>
                <span className="text-lime-400 tabular-nums">
                  Latency: {responseLog.latency ? `${responseLog.latency} ms` : 'N/A'}
                </span>
              </div>
              <pre className="p-4 bg-black border border-neutral-800 font-mono text-[11px] text-lime-300 overflow-x-auto max-h-64 leading-relaxed">
                {JSON.stringify(responseLog, null, 2)}
              </pre>
            </div>
          )}

          {/* Notice */}
          <div className="p-3 bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <p className="font-bold text-neutral-300">MCP Streamable HTTP Protocol Conformance:</p>
            <p>
              External MCP agents (Claude Code, MCP Inspector, Gemini SDK) connect directly to{' '}
              <code className="text-lime-400 font-mono">POST /api/mcp</code> using JSON-RPC 2.0 with header{' '}
              <code className="text-lime-400 font-mono">MCP-Protocol-Version: 2025-11-25</code>.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-black flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
