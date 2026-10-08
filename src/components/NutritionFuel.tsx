import React, { useState, useEffect } from 'react';
import { Search, Flame, Dumbbell, Zap, AlertOctagon, Clock, MapPin, HeartPulse } from 'lucide-react';
import { callMcp, describeMcpError } from '../services/mcpClient.ts';

interface NutritionFuelProps {
  initialQuery?: string;
  onReserveMeal?: (mealName: string, venue: string) => void;
}

export const NutritionFuel: React.FC<NutritionFuelProps> = ({ initialQuery, onReserveMeal }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery || 'hummus');
  const [foodData, setFoodData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = initialQuery || 'hummus';
    setSearchQuery(q);
    executeSearch(q);
  }, [initialQuery]);

  async function executeSearch(query: string) {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setFoodData(null);

    try {
      const res = await callMcp('check_nutrition', { query: query.trim() });
      setFoodData(res.data);
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

  const suggestions = [
    { label: 'Hummus (חומוס)', query: 'hummus' },
    { label: 'Tahini (טחינה)', query: 'tahini' },
    { label: 'Greek Yogurt (יוגורט יווני)', query: 'Greek Yogurt' },
    { label: 'Chicken Breast (חזה עוף)', query: 'Chicken Breast' },
    { label: 'Salmon Fillet', query: 'Salmon Fillet' },
    { label: 'Whey Isolate Shake', query: 'Protein Shake' },
    { label: 'Post-Workout Rice Bowl', query: 'Post-Workout Rice Bowl' },
    { label: 'Electrolyte Hydration', query: 'Electrolyte' }
  ];

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="border-2 border-neutral-700 bg-neutral-950 p-6 sm:p-10">
        <div className="inline-block px-3 py-1 bg-lime-400 text-black text-xs font-black uppercase tracking-widest mb-3">
          TAB 4 · SPORTS NUTRITION & RECOVERY INDEX
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          PRE & POST EXERCISE MACRO INDEX
        </h1>
        <p className="mt-2 text-sm text-neutral-300 max-w-3xl leading-relaxed">
          Look up board-certified athletic recovery foods in English or Hebrew. Calculates glycemic index, optimal nutrient timing window, and recovery suitability scores via our embedded MCP server.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food in English or Hebrew (e.g. Hummus, חומוס, Chicken, Salmon)..."
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-neutral-600 focus:border-lime-400 text-white placeholder-neutral-500 text-sm font-semibold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'CALCULATING...' : 'QUERY MACROS'}
          </button>
        </form>

        {/* Food suggestions */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold uppercase text-[11px] text-neutral-400">Recovery Staples:</span>
          {suggestions.map((s, idx) => (
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
            Querying check_nutrition tool on embedded MCP server...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 border-2 border-red-500 bg-red-950/80 text-red-200">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm uppercase">Food Record Not Found</p>
              <p className="text-xs mt-1 font-mono text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Food Result Card */}
      {foodData && !loading && (
        <div className="border-2 border-neutral-700 bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-700 gap-3">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  {foodData.name}
                </h2>
                {foodData.hebrewName && (
                  <span className="px-2.5 py-1 bg-neutral-800 text-lime-400 font-bold text-sm font-mono border border-neutral-700">
                    {foodData.hebrewName}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 uppercase font-semibold mt-1">
                Category: {foodData.category} · Serving: {foodData.servingSize}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Recovery Index</span>
                <p className="text-2xl font-black font-mono text-lime-400 tabular-nums">
                  {foodData.recoveryScore}/100
                </p>
              </div>
            </div>
          </div>

          {/* Macros Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 p-4 bg-black border border-neutral-700">
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Calories</span>
              <p className="text-xl font-black font-mono text-white tabular-nums">{foodData.calories} kcal</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Protein</span>
              <p className="text-xl font-black font-mono text-lime-400 tabular-nums">{foodData.protein}g</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Carbs</span>
              <p className="text-xl font-black font-mono text-amber-400 tabular-nums">{foodData.carbs}g</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Fats</span>
              <p className="text-xl font-black font-mono text-cyan-400 tabular-nums">{foodData.fat}g</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Dietary Fiber</span>
              <p className="text-xl font-black font-mono text-neutral-300 tabular-nums">{foodData.fiber}g</p>
            </div>
            <div className="text-center p-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Sodium</span>
              <p className="text-xl font-black font-mono text-neutral-300 tabular-nums">{foodData.sodium}mg</p>
            </div>
          </div>

          {/* Exercise Timing & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
                <Clock className="w-4 h-4" />
                <span>Exercise Timing & GI Profile</span>
              </div>
              <p className="text-sm font-bold text-white">
                {foodData.exerciseTiming}
              </p>
              <p className="text-xs text-neutral-400">
                Glycemic Index: <strong className="text-neutral-200">{foodData.glycemicIndex}</strong>
              </p>
              <p className="text-xs text-neutral-300 leading-relaxed pt-1">
                {foodData.recommendedFor}
              </p>
            </div>

            <div className="p-4 bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-lime-400">
                <MapPin className="w-4 h-4" />
                <span>ActiveSG Vending Pod Availability</span>
              </div>
              <p className="text-sm font-bold text-white">
                {foodData.vendingAvailability}
              </p>
              <p className="text-xs text-neutral-400">
                Freshly stocked by central kitchen partners. Hot & chilled ready-to-eat options.
              </p>
              {onReserveMeal && (
                <button
                  type="button"
                  onClick={() => onReserveMeal(foodData.name, foodData.vendingAvailability)}
                  className="mt-2 px-3 py-1.5 bg-lime-400 text-black text-xs font-black uppercase tracking-wider cursor-pointer hover:bg-white transition-colors"
                >
                  Reserve at Vending Locker &rarr;
                </button>
              )}
            </div>
          </div>

          <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
            <span>Verified Nutritionist Formulations · Singapore HPB Healthier Choice</span>
            <span className="italic">{foodData.dietary?.traceability || 'Demo record: no batch or certification data'}</span>
          </div>
        </div>
      )}

      {/* Quick Recovery Comparison Grid */}
      <div className="border-2 border-neutral-700 bg-neutral-900 p-6">
        <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">
          POPULAR ATHLETIC RECOVERY MATRICES (CLICK TO INSPECT)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Hummus', hebrew: 'חומוס', cal: '166 kcal', prot: '7.9g', timing: 'Pre-workout (2hr)', score: 88 },
            { name: 'Greek Yogurt', hebrew: 'יוגורט יווני', cal: '100 kcal', prot: '18g', timing: 'Post-workout (<45m)', score: 95 },
            { name: 'Chicken Breast', hebrew: 'חזה עוף', cal: '247 kcal', prot: '46.5g', timing: 'Post-workout (<45m)', score: 96 },
            { name: 'Salmon Fillet', hebrew: 'סלמון', cal: '312 kcal', prot: '34g', timing: 'Anti-inflammatory', score: 98 }
          ].map((item, i) => (
            <div
              key={i}
              onClick={() => {
                setSearchQuery(item.name);
                executeSearch(item.name);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 bg-neutral-950 border border-neutral-800 hover:border-lime-400 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-lime-400">{item.hebrew}</span>
                <span className="text-xs font-black font-mono text-white tabular-nums">{item.score}/100</span>
              </div>
              <h4 className="mt-1 text-sm font-bold text-white group-hover:text-lime-300">
                {item.name}
              </h4>
              <div className="mt-2 flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>{item.cal}</span>
                <span className="text-lime-400 font-bold">{item.prot} PRO</span>
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">{item.timing}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
