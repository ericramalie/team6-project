import React from 'react';
import { Database, Server, AlertTriangle, RefreshCw } from 'lucide-react';
import { useMcpStatus } from '../services/mcpClient.ts';

interface StatusBannerProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({ onRefresh, isRefreshing }) => {
  const mcp = useMcpStatus();
  const latencyStr = mcp.status === 'online' && mcp.latency !== null ? `${mcp.latency}ms` : '--';

  return (
    <div className="bg-neutral-900 border-b-2 border-neutral-700 text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          {/* Left: Real counts and server status */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-lime-400">
              <Server className="w-3.5 h-3.5 text-lime-400" />
              <span>MCP Server (/api/mcp):</span>
              <span className={`font-mono text-[11px] ${
                mcp.status === 'online' ? 'text-lime-400' : mcp.status === 'offline' ? 'text-red-400' : 'text-neutral-400'
              }`}>
                {mcp.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2 text-neutral-400">
              <span>Latency: <strong className="font-mono text-white tabular-nums">{latencyStr}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Database className="w-3 h-3 text-neutral-400" />
                <span>Dataset: <strong className="text-white font-mono">22</strong> Additives / <strong className="text-white font-mono">12</strong> Nutrition / <strong className="text-white font-mono">8</strong> Pesticides (<strong className="text-white font-mono">42</strong> total)</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="hidden lg:inline text-lime-400 font-bold uppercase tracking-wider">
                Objective: Food Delivery to Vending Pods at All Gyms & Venues
              </span>
            </div>
          </div>

          {/* Right: Mandatory Demo Sentence & Refresh Button */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/60 border border-amber-600/60 px-2.5 py-1">
              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Demo dataset: illustrative values, not verified against JECFA, EFSA or Israeli MoH sources.</span>
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider border border-neutral-600 active:bg-neutral-600 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                title="Re-run check_additive on current query"
              >
                <RefreshCw className={`w-3 h-3 text-lime-400 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh from MCP</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
