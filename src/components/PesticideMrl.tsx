import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, CheckCircle2, ShieldCheck, AlertTriangle, Layers, RefreshCw } from 'lucide-react';
import { callMcp, describeMcpError } from '../services/mcpClient.ts';

interface PesticideMrlProps {
  initialQuery?: string;
}

export const PesticideMrl: React.FC<PesticideMrlProps> = ({ initialQuery }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'glyphosate');
  const [pesticideData, setPesticideData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = initialQuery || 'glyphosate';
    setSearchQuery(q);
    executeSearch(q);
  }, [initialQuery]);

  async function executeSearch(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setPesticideData(null);

    try {
      const res = await callMcp('check_pesticide_mrl', { query: query.trim() });
      setPesticideData(res.data);
    } catch (err: any) {
      setError(describeMcpError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    executeSearch(searchQuery);
  }

  const demoSuggestions = [
    { label: 'Glyphosate', query: 'glyphosate' },
    { label: 'Chlorpyrifos', query: 'chlorpyrifos' },
    { label: 'CAS 1071-83-6', query: '1071-83-6' },
    { label: 'Banana (Crop lookup)', query: 'banana' },
    { label: 'Mancozeb', query: 'mancozeb' },
    { label: 'Imidacloprid', query: 'imidacloprid' },
    { label: 'Wheat (Returns null)', query: 'wheat' }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="border-2 border-neutral-700 bg-neutral-950 p-6 sm:p-10">
        <div className="inline-block px-3 py-1 bg-lime-400 text-black text-xs font-black uppercase tracking-widest mb-3">
          TAB 3 · PESTICIDE MRL SAFETY
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          PESTICIDE MAXIMUM RESIDUE LIMIT (MRL) CHECKER
        </h1>
        <p className="mt-2 text-sm text-neutral-300 max-w-3xl leading-relaxed">
          Verify agricultural chemical tolerances, Codex Alimentarius & Singapore SFA benchmarks, CAS numbers, and crop tolerances. Every search resolves directly against the local MCP server.
        </p>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pesticide (e.g. Glyphosate, Chlorpyrifos), CAS (2921-88-2), or crop..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-600 focus:border-lime-400 text-white placeholder-neutral-500 text-sm font-semibold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'CHECKING...' : 'CHECK MRL'}
          </button>
        </form>

        {/* Suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold uppercase text-[11px] text-neutral-400">Pesticide Targets:</span>
          {demoSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(s.query);
                executeSearch(s.query);
              }}
              className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-lime-400 text-neutral-200 hover:text-white font-mono text-[11px] cursor-pointer transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 border-2 border-neutral-700 bg-neutral-900 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-4 border-lime-400 border-t-transparent animate-spin" />
          <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">
            Querying check_pesticide_mrl tool on embedded MCP server...
          </p>
        </div>
      )}

      {/* Error / No Match state */}
      {error && !loading && (
        <div className="p-6 border-2 border-red-500 bg-red-950/80 text-red-200">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm uppercase">Pesticide MRL Not Found</p>
              <p className="text-xs mt-1 font-mono text-red-300">{error}</p>
              <p className="text-[11px] text-neutral-400 mt-2">
                Tip: If multiple crops or pesticides tie, the tool strictly returns null to avoid ambiguous dosage matches.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pesticide Record Dossier */}
      {pesticideData && !loading && (
        <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-700 gap-3">
            <div>
              <span className="text-[11px] font-black tracking-widest uppercase text-lime-400">
                PESTICIDE ASSAY RECORD
              </span>
              <h2 className="text-2xl font-black uppercase text-white tracking-tight">
                {pesticideData.pesticide} ({pesticideData.type})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 font-black text-xs uppercase tracking-wider ${
                pesticideData.status === 'Within demo limits'
                  ? 'bg-lime-400 text-black'
                  : 'bg-red-600 text-white'
              }`}>
                {pesticideData.status}
              </span>
            </div>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-black border border-neutral-700">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">CAS Registry</span>
              <p className="text-sm font-bold font-mono text-white">{pesticideData.casNumber}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Regulatory MRL Limit</span>
              <p className="text-lg font-black font-mono text-lime-400 tabular-nums">
                {pesticideData.mrlLimitMgKg} mg/kg
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Detected Demo Assay Level</span>
              <p className={`text-lg font-black font-mono tabular-nums ${
                pesticideData.detectedLevelMgKg > pesticideData.mrlLimitMgKg ? 'text-red-500' : 'text-neutral-200'
              }`}>
                {pesticideData.detectedLevelMgKg} mg/kg
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Agency Standard</span>
              <p className="text-xs font-bold text-neutral-300">{pesticideData.regulatoryAgency}</p>
            </div>
          </div>

          {/* Crops and Health Impact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-950 border border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Monitored Agricultural Crops
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {pesticideData.crops.map((crop: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 text-neutral-200 font-mono text-xs uppercase"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Toxicology & Health Implications
              </h3>
              <p className="text-xs text-amber-200 leading-relaxed font-medium">
                {pesticideData.healthImpact}
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
            <span>Standard: Singapore SFA / Codex Alimentarius MRL Database</span>
            <span className="text-neutral-500 italic">Demo record: illustrative values only</span>
          </div>
        </div>
      )}

      {/* Pesticide Reference Matrix */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">
          PESTICIDE REGULATORY MATRIX (DEMO DATASET)
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          Click any chemical or crop to trigger a live call to the embedded MCP server:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="border-b-2 border-neutral-700 text-neutral-400 uppercase text-[11px]">
                <th className="py-2.5 px-3">Chemical</th>
                <th className="py-2.5 px-3">CAS</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Crops</th>
                <th className="py-2.5 px-3 tabular-nums">MRL Limit</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {[
                { name: 'Glyphosate', cas: '1071-83-6', type: 'Herbicide', crops: 'soybean, corn, wheat, oat, barley', limit: '5.0 mg/kg', status: 'Within demo limits' },
                { name: 'Chlorpyrifos', cas: '2921-88-2', type: 'Insecticide', crops: 'apple, orange, strawberry, grape', limit: '0.01 mg/kg', status: 'Above demo limit' },
                { name: 'Mancozeb', cas: '8018-01-7', type: 'Fungicide', crops: 'potato, tomato, onion, apple', limit: '3.0 mg/kg', status: 'Within demo limits' },
                { name: 'Imidacloprid', cas: '138261-41-3', type: 'Insecticide', crops: 'tomato, lettuce, cotton, rice', limit: '1.0 mg/kg', status: 'Within demo limits' },
                { name: 'Malathion', cas: '121-75-5', type: 'Insecticide', crops: 'strawberry, cherry, blueberry', limit: '8.0 mg/kg', status: 'Within demo limits' },
                { name: 'Azoxystrobin', cas: '131860-33-8', type: 'Fungicide', crops: 'banana, grape, tomato', limit: '2.0 mg/kg', status: 'Within demo limits' },
                { name: 'Cypermethrin', cas: '52315-07-8', type: 'Insecticide', crops: 'cabbage, cotton, soybean, spinach', limit: '2.0 mg/kg', status: 'Within demo limits' },
                { name: 'DDT', cas: '50-29-3', type: 'Legacy Insecticide', crops: 'carrot, beet, peanut', limit: '0.05 mg/kg', status: 'Above demo limit' }
              ].map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => {
                    setSearchQuery(row.name);
                    executeSearch(row.name);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:bg-neutral-800/60 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-white font-mono">{row.name}</td>
                  <td className="py-2.5 px-3 text-neutral-400 font-mono">{row.cas}</td>
                  <td className="py-2.5 px-3 text-neutral-300">{row.type}</td>
                  <td className="py-2.5 px-3 text-neutral-400">{row.crops}</td>
                  <td className="py-2.5 px-3 font-mono text-lime-400 font-bold tabular-nums">{row.limit}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                      row.status === 'Within demo limits' ? 'bg-lime-400/20 text-lime-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
