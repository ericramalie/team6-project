import React, { useState, useEffect } from 'react';
import { Search, AlertOctagon, CheckCircle2, ShieldAlert, Sparkles, Filter, ChevronRight, Info, RefreshCw } from 'lucide-react';
import { callMcp, describeMcpError } from '../services/mcpClient.ts';

interface AdditiveDirectoryProps {
  onRouteTab: (tab: string, query?: string) => void;
}

export const AdditiveDirectory: React.FC<AdditiveDirectoryProps> = ({ onRouteTab }) => {
  const [searchQuery, setSearchQuery] = useState('E211');
  const [currentAdditive, setCurrentAdditive] = useState<any>(null);
  const [additiveLoading, setAdditiveLoading] = useState(false);
  const [additiveError, setAdditiveError] = useState<string | null>(null);

  // Directory catalogue state
  const [categoryFilter, setCategoryFilter] = useState('');
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [catalogueList, setCatalogueList] = useState<any[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState(false);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);

  // Initial load: fetch first result via callMcp('check_additive', { query: 'E211' })
  useEffect(() => {
    executeAdditiveCheck('E211');
    fetchCatalogue('', '');
  }, []);

  async function executeAdditiveCheck(query: string) {
    if (!query.trim()) return;

    // Check intelligent suggestion routing rules:
    // 1. Two or more ", " separators (e.g. "Water, Sugar, E211, Citric Acid")
    // but not commas between digits (e.g. "2,4-Hexadienoic Acid")
    const commaSpaceMatches = query.match(/,\s+/g);
    if (commaSpaceMatches && commaSpaceMatches.length >= 2) {
      onRouteTab('scanner', query);
      return;
    }

    const lower = query.trim().toLowerCase();
    // 2. Glyphosate & Chlorpyrifos -> Pesticide MRL tab
    if (lower === 'glyphosate' || lower === 'chlorpyrifos') {
      onRouteTab('pesticides', query);
      return;
    }

    // 3. Hummus / חומוס -> Nutrition tab
    if (lower === 'hummus' || lower === 'חומוס') {
      onRouteTab('nutrition', query);
      return;
    }

    setAdditiveLoading(true);
    setAdditiveError(null);
    setCurrentAdditive(null);

    try {
      const res = await callMcp('check_additive', { query: query.trim() });
      setCurrentAdditive(res.data);
    } catch (err: any) {
      setAdditiveError(describeMcpError(err));
    } finally {
      setAdditiveLoading(false);
    }
  }

  async function fetchCatalogue(query: string, category: string) {
    setCatalogueLoading(true);
    setCatalogueError(null);

    try {
      const args: { query?: string; category?: string } = {};
      if (query.trim()) args.query = query.trim();
      if (category.trim()) args.category = category.trim();

      const res = await callMcp('search_additives', args);
      setCatalogueList(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setCatalogueError(describeMcpError(err));
      setCatalogueList([]);
    } finally {
      setCatalogueLoading(false);
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    executeAdditiveCheck(searchQuery);
  }

  function handleCatalogueCategoryChange(cat: string) {
    setCategoryFilter(cat);
    fetchCatalogue(catalogueSearch, cat);
  }

  function handleCatalogueSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchCatalogue(catalogueSearch, categoryFilter);
  }

  const suggestions = [
    { label: 'E211 (Sodium Benzoate)', query: 'E211' },
    { label: 'E171 (Banned Titanium Dioxide)', query: 'E171' },
    { label: 'MSG (E621)', query: 'MSG' },
    { label: 'Scan Ingredients Cocktail', query: 'Water, Sugar, E211, Citric Acid, Soy Lecithin' },
    { label: 'Glyphosate', query: 'glyphosate' },
    { label: 'Chlorpyrifos', query: 'chlorpyrifos' },
    { label: 'Hummus (חומוס)', query: 'hummus' }
  ];

  return (
    <div className="space-y-10">
      {/* Core Platform Objective: Food Delivery to Vending Machines at All Gyms & Venues */}
      <div className="relative border-2 border-lime-400 bg-neutral-950 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-30 mix-blend-luminosity">
          <img
            src="/src/assets/images/istock_healthy_meal_prep.jpg"
            alt="Healthy Sports Nutrition Meal Prep (iStockphoto)"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/60" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-5xl">
          {/* Main Objective Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime-400 text-black text-xs font-black uppercase tracking-widest mb-4 border border-white shadow-[2px_2px_0px_#ffffff]">
            <span>★ CORE OBJECTIVE</span>
            <span>·</span>
            <span>FOOD DELIVERY TO SMART VENDING MACHINES AT ALL EXERCISE VENUES & GYMS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-none">
            HEALTHY FOOD DELIVERY TO <span className="text-lime-400">VENDING MACHINES</span> AT ALL EXERCISE VENUES & GYMS
          </h1>

          <p className="mt-4 text-sm sm:text-base lg:text-lg text-neutral-200 max-w-3xl leading-relaxed font-medium">
            Healthy food at your fingertips, without the hassle of meal prepping alone. Nutritionist-designed hot and cold post-workout meals, prepared fresh in certified central kitchens and delivered directly to automated smart vending lockers situated at every ActiveSG sports complex, arena, and gym in Singapore.
          </p>

          {/* 3 Core Objective Pillars */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-900/90 border-2 border-neutral-700 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-mono font-bold text-lime-400">01 · VENUE DISPATCH</span>
              <h3 className="text-sm font-black uppercase text-white mt-1">Delivery to All Gyms</h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Central kitchens dispatch fresh hot & chilled recovery meals daily to ActiveSG sports halls, gym entrances, and court venues.
              </p>
            </div>

            <div className="p-4 bg-neutral-900/90 border-2 border-neutral-700 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-mono font-bold text-lime-400">02 · GRAB-AND-GO LOCKERS</span>
              <h3 className="text-sm font-black uppercase text-white mt-1">Contactless Pod Pickup</h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Hot thermal warming lockers and cold shakers. Reserve with your court booking and pick up via PIN/QR immediately after training.
              </p>
            </div>

            <div className="p-4 bg-neutral-900/90 border-2 border-neutral-700 backdrop-blur-sm">
              <span className="text-[10px] uppercase font-mono font-bold text-lime-400">03 · MCP TOXISCAN & MACROS</span>
              <h3 className="text-sm font-black uppercase text-white mt-1">Zero Toxins, Pure Macros</h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                Every meal formulation is audited against additive toxicity, banned substances, and sports recovery macros via local MCP.
              </p>
            </div>
          </div>

          {/* Quick Objective CTAs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onRouteTab('activesg')}
              className="px-6 py-3.5 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[3px_3px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
            >
              LOCATE & RESERVE AT GYM VENDING LOCKER &rarr;
            </button>
            <button
              type="button"
              onClick={() => onRouteTab('nutrition')}
              className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-black uppercase tracking-wider text-xs border-2 border-neutral-600 transition-colors cursor-pointer"
            >
              EXPLORE PRE/POST EXERCISE MACROS &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Live Venue Vending Machine Network Status Bar */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-lime-400 animate-pulse rounded-full shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-white">
                LIVE EXERCISE VENUE VENDING NETWORK · SINGAPORE
              </p>
              <p className="text-[11px] text-neutral-400">
                Fresh restock synchronized with certified cloud kitchens & OneMap delivery routing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[
              { venue: 'Clementi ActiveSG', stock: '24 Meals' },
              { venue: 'Bishan Sports Hall', stock: '18 Meals' },
              { venue: 'Our Tampines Hub', stock: '32 Meals' },
              { venue: 'Jurong West Gym', stock: '20 Meals' },
              { venue: 'Bedok Sports Complex', stock: '15 Meals' }
            ].map((v, i) => (
              <div
                key={i}
                onClick={() => onRouteTab('activesg')}
                className="px-2.5 py-1 bg-black border border-neutral-700 hover:border-lime-400 text-neutral-300 hover:text-white font-mono text-[11px] cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span>{v.venue}</span>
                <span className="text-lime-400 font-bold">({v.stock})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MCP Additive Toxicity & Ingredient Inspection Search */}
      <div className="border-2 border-neutral-700 bg-neutral-950 p-6 sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-block px-2.5 py-1 bg-neutral-800 text-lime-400 text-[11px] font-mono font-bold uppercase tracking-wider mb-2 border border-neutral-700">
            MCP PURITY AUDIT · TOXISCAN ENGINE
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            INSPECT ADDITIVES & MEAL INGREDIENTS VIA MCP
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Verify every food additive, chemical stabilizer, and sweetener found in commercial foods or sports supplements against regulatory bans and toxicological mechanisms via our embedded Streamable HTTP MCP server.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search E-number (e.g. E211, E171), CAS (532-32-1), or name (MSG, Palm Oil)..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-600 focus:border-lime-400 text-white placeholder-neutral-500 text-sm font-semibold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={additiveLoading}
            className="px-6 py-3 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {additiveLoading ? 'INSPECTING...' : 'RUN MCP CHECK'}
          </button>
        </form>

        {/* Smart Suggestions with intelligent router */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-neutral-400">
          <span className="font-bold uppercase text-[11px] text-neutral-300">Quick Query:</span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(s.query);
                executeAdditiveCheck(s.query);
              }}
              className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-lime-400 text-neutral-200 hover:text-white font-mono text-[11px] cursor-pointer transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Single Additive Inspection Result Card */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-700 gap-3">
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-lime-400">
              MCP ACTIVE DOSSIER
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              {currentAdditive ? currentAdditive.name : 'Additive Inspection Report'}
            </h2>
          </div>
          <button
            onClick={() => executeAdditiveCheck(searchQuery)}
            disabled={additiveLoading}
            className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            title="Re-run check_additive on current query"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${additiveLoading ? 'animate-spin' : ''}`} />
            <span>Refresh from MCP</span>
          </button>
        </div>

        {additiveLoading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-8 h-8 border-4 border-lime-400 border-t-transparent animate-spin" />
            <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">
              Querying /api/mcp via Streamable HTTP...
            </p>
          </div>
        )}

        {additiveError && !additiveLoading && (
          <div className="my-6 p-4 bg-red-950/80 border-2 border-red-500 text-red-200">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm uppercase">MCP Query Unsuccessful</p>
                <p className="text-xs mt-1 text-red-300 font-mono">{additiveError}</p>
                <p className="text-[11px] text-neutral-400 mt-2">
                  Check spelling or browse the catalogue below. Every search resolves strictly via the embedded MCP server.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentAdditive && !additiveLoading && (
          <div className="mt-6 space-y-6">
            {/* Top specs block */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-black p-4 border border-neutral-700">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">E-Number / ID</span>
                <p className="text-lg font-black font-mono text-lime-400">{currentAdditive.id}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">CAS Registry</span>
                <p className="text-sm font-bold font-mono text-white">{currentAdditive.casNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Category</span>
                <p className="text-sm font-bold uppercase text-neutral-200">{currentAdditive.category}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Toxicity Risk Level</span>
                <div className="mt-0.5">
                  <span className={`inline-block px-2.5 py-0.5 text-xs font-black uppercase tracking-wider ${
                    currentAdditive.riskLevel === 'BANNED'
                      ? 'bg-red-600 text-white'
                      : currentAdditive.riskLevel === 'HIGH'
                      ? 'bg-orange-500 text-black'
                      : currentAdditive.riskLevel === 'MODERATE'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-lime-400 text-black'
                  }`}>
                    {currentAdditive.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-neutral-950 border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Chemical Taxonomy</h3>
                  <p className="text-sm font-semibold text-white font-mono">{currentAdditive.chemicalName || currentAdditive.name}</p>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{currentAdditive.function}</p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Common Food Matrices</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentAdditive.commonFoods || 'Commercial packaged food and beverages'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-neutral-950 border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Toxicological Mechanism & Hazards</h3>
                  <p className="text-xs text-amber-200 leading-relaxed font-medium">{currentAdditive.potentialEffects}</p>
                </div>

                <div className="p-4 bg-neutral-950 border border-neutral-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">Regulatory Status (SFA / EFSA / Codex)</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{currentAdditive.regulatoryStatus}</p>
                </div>
              </div>
            </div>

            {/* Compliance & Verification line */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-neutral-950 border-t border-neutral-800 text-xs text-neutral-400">
              <div className="flex items-center gap-3">
                <span>Dietary: Vegan {currentAdditive.dietary?.vegan ? '✓' : '✗'}</span>
                <span aria-hidden="true">·</span>
                <span>Halal {currentAdditive.dietary?.halal ? '✓' : '✗'}</span>
                <span aria-hidden="true">·</span>
                <span>Kosher {currentAdditive.dietary?.kosher ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-lime-400">
                  Pesticide Status: {currentAdditive.pesticideStatus || 'Within demo limits'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-neutral-500 italic">
                  {currentAdditive.dietary?.traceability || 'Demo record: no batch or certification data'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* E-Number Directory Catalogue (Loaded via search_additives) */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-neutral-700 gap-4">
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-lime-400">
              LOCAL MCP REGISTRY
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              E-NUMBER DIRECTORY CATALOGUE
            </h2>
          </div>

          {/* Catalogue filter & search */}
          <form onSubmit={handleCatalogueSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={catalogueSearch}
              onChange={(e) => setCatalogueSearch(e.target.value)}
              placeholder="Filter additives..."
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-lime-400"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase cursor-pointer border border-neutral-600"
            >
              Filter
            </button>
          </form>
        </div>

        {/* Category Filter Buttons */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[
            { label: 'ALL ADDITIVES', val: '' },
            { label: 'BANNED', val: 'banned' },
            { label: 'COLOURS', val: 'colour' },
            { label: 'PRESERVATIVES', val: 'preservative' },
            { label: 'SWEETENERS', val: 'sweetener' },
            { label: 'EMULSIFIERS', val: 'emulsifier' },
            { label: 'ANTIOXIDANTS', val: 'antioxidant' },
            { label: 'INDUSTRIAL FATS', val: 'industrial fat' }
          ].map((cat) => (
            <button
              key={cat.val}
              type="button"
              onClick={() => handleCatalogueCategoryChange(cat.val)}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                categoryFilter === cat.val
                  ? 'bg-lime-400 text-black border-white'
                  : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {catalogueLoading && (
          <div className="py-8 text-center text-xs text-neutral-400 font-mono uppercase">
            Loading directory from search_additives MCP tool...
          </div>
        )}

        {catalogueError && !catalogueLoading && (
          <div className="my-4 p-3 bg-red-950/60 border border-red-500 text-red-200 text-xs">
            {catalogueError}
          </div>
        )}

        {!catalogueLoading && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogueList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSearchQuery(item.id);
                  executeAdditiveCheck(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-4 bg-neutral-950 border border-neutral-800 hover:border-lime-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-lime-400 group-hover:text-white">
                      {item.id}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                      item.riskLevel === 'BANNED'
                        ? 'bg-red-600 text-white'
                        : item.riskLevel === 'HIGH'
                        ? 'bg-orange-500 text-black'
                        : item.riskLevel === 'MODERATE'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-lime-400 text-black'
                    }`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-white group-hover:text-lime-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="mt-1 text-xs text-neutral-400 line-clamp-2">
                    {item.function}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
                  <span className="uppercase">{item.category}</span>
                  <span className="text-lime-400 group-hover:translate-x-1 transition-transform flex items-center">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
