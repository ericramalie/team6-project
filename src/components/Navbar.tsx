import React from 'react';
import { Activity, ShieldCheck, Terminal, Zap, Flame, Clock } from 'lucide-react';
import { useMcpStatus } from '../services/mcpClient.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openInspector: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openInspector
}) => {
  const mcpStatus = useMcpStatus();

  const navLinks = [
    { id: 'additives', label: 'Additives & Toxins' },
    { id: 'scanner', label: 'Ingredient Scanner' },
    { id: 'pesticides', label: 'Pesticide MRL' },
    { id: 'nutrition', label: 'Sports Nutrition' },
    { id: 'activesg', label: 'ActiveSG & Vending' }
  ];

  const isOnline = mcpStatus.status === 'online';
  const isOffline = mcpStatus.status === 'offline';
  const latencyDisplay = mcpStatus.latency !== null && isOnline ? `${mcpStatus.latency}ms` : '--';

  return (
    <header className="sticky top-0 z-40 bg-black border-b-2 border-lime-400 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand title, single element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('additives')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 bg-lime-400 text-black font-black text-xl flex items-center justify-center rounded-none border-2 border-white shadow-[2px_2px_0px_#ffffff] group-hover:bg-white group-hover:text-black transition-colors">
              <Zap className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
                NUTRISAFE <span className="text-lime-400 font-extrabold">ACTIVEFUEL</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-6 nav links, 1-2 words, single line */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer border-b-2 ${
                  isActive
                    ? 'border-lime-400 text-lime-400 bg-neutral-900/90'
                    : 'border-transparent text-neutral-300 hover:text-white hover:border-neutral-700'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-700 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline
                  ? 'bg-lime-400 animate-pulse'
                  : isOffline
                  ? 'bg-red-500'
                  : 'bg-yellow-400'
              }`}
            />
            <span className="font-mono text-neutral-300 text-[11px] uppercase">
              MCP {isOnline ? 'LIVE' : isOffline ? 'OFFLINE' : 'IDLE'}
            </span>
            <span className="text-neutral-500">·</span>
            <span className="font-mono tabular-nums text-lime-400 text-[11px]">
              {latencyDisplay}
            </span>
          </div>

          <button
            onClick={openInspector}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-lime-400 text-black text-xs font-black uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
            title="Inspect Streamable HTTP MCP JSON-RPC connection"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">MCP</span> INSPECTOR
          </button>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="lg:hidden flex overflow-x-auto border-t border-neutral-800 bg-neutral-950 px-2 py-1.5 scrollbar-none gap-1">
        {navLinks.map((link) => {
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-bold whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-lime-400 text-black'
                  : 'text-neutral-300 bg-neutral-900 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
