import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, AlertOctagon, Terminal } from 'lucide-react';
import { callMcp, describeMcpError } from '../services/mcpClient.ts';

interface IngredientScannerProps {
  initialQuery?: string;
}

export const IngredientScanner: React.FC<IngredientScannerProps> = ({ initialQuery }) => {
  const [ingredientsText, setIngredientsText] = useState(
    initialQuery || 'Carbonated Water, High Fructose Corn Syrup, Sodium Benzoate (E211), Ascorbic Acid (Vitamin C), Tartrazine (E102), Soy Lecithin, Palm Oil'
  );
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setIngredientsText(initialQuery);
      runScan(initialQuery);
    } else {
      runScan(ingredientsText);
    }
  }, [initialQuery]);

  async function runScan(text: string) {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const res = await callMcp('check_ingredient_list', { ingredients: text.trim() });
      setScanResult(res.data);
    } catch (err: any) {
      setError(describeMcpError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runScan(ingredientsText);
  }

  const sampleCocktails = [
    {
      title: 'Carcinogenic Cocktail (E211 + Vit C)',
      text: 'Water, Sugar, Sodium Benzoate (E211), Ascorbic Acid (Vitamin C), Citric Acid, Flavor'
    },
    {
      title: 'Workout Energy Gel Cocktail',
      text: 'Maltodextrin, High Fructose Corn Syrup (INGR-HFCS), Sucralose, Acesulfame Potassium, Brilliant Blue (E133)'
    },
    {
      title: 'Banned Trans Fat Bakery Formulation',
      text: 'Enriched Wheat Flour, Partially Hydrogenated Vegetable Oil (Trans Fat), Potassium Bromate (E924a), Mono- and Diglycerides (E471)'
    },
    {
      title: 'Allergen Boundary Test (Eggplant & Soy)',
      text: 'Grilled eggplant, extra virgin olive oil, soy lecithin, sea salt, garlic, black pepper'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-2 border-neutral-700 bg-neutral-950 p-6 sm:p-10">
        <div className="inline-block px-3 py-1 bg-lime-400 text-black text-xs font-black uppercase tracking-widest mb-3">
          TAB 2 · INGREDIENT COCKTAIL SCANNER
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          MULTI-INGREDIENT COCKTAIL & ALLERGEN SCANNER
        </h1>
        <p className="mt-2 text-sm text-neutral-300 max-w-3xl leading-relaxed">
          Paste complete package ingredients lists or sports supplement recipes. The MCP engine inspects whole-word additive matches, synergistic toxicological interactions (e.g. Benzene generation), strict allergen declarations, and dietary conformance.
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Ingredient List (Separated by commas)
            </label>
            <textarea
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="e.g. Water, Sugar, Sodium Benzoate, Ascorbic Acid, Soy Lecithin..."
              className="w-full p-4 bg-neutral-900 border-2 border-neutral-700 focus:border-lime-400 text-white font-mono text-sm leading-relaxed focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-neutral-400 self-center uppercase text-[11px]">Load Test Matrix:</span>
              {sampleCocktails.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIngredientsText(c.text);
                    runScan(c.text);
                  }}
                  className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 hover:border-lime-400 text-neutral-300 hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  {c.title}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-lime-400 text-black font-black uppercase tracking-wider text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'SCANNING VIA MCP...' : 'SCAN INGREDIENT LIST'}
            </button>
          </div>
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="p-12 border-2 border-neutral-700 bg-neutral-900 text-center space-y-3">
          <div className="w-8 h-8 mx-auto border-4 border-lime-400 border-t-transparent animate-spin" />
          <p className="text-xs uppercase font-mono tracking-wider text-neutral-400">
            Executing check_ingredient_list tool on embedded MCP server...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="p-6 border-2 border-red-500 bg-red-950/80 text-red-200">
          <div className="flex items-start gap-3">
            <AlertOctagon className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm uppercase">MCP Scanner Report</p>
              <p className="text-xs mt-1 font-mono text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results breakdown */}
      {scanResult && !loading && (
        <div className="space-y-6">
          {/* Summary Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-2 border-neutral-700 bg-neutral-900">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Banned Substances</span>
              <p className="text-2xl font-black font-mono text-red-500">{scanResult.riskSummary?.bannedCount || 0}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">High Risk Additives</span>
              <p className="text-2xl font-black font-mono text-orange-400">{scanResult.riskSummary?.highRiskCount || 0}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Moderate Additives</span>
              <p className="text-2xl font-black font-mono text-yellow-400">{scanResult.riskSummary?.moderateRiskCount || 0}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">Allergens Detected</span>
              <p className="text-2xl font-black font-mono text-lime-400">{scanResult.allergens?.length || 0}</p>
            </div>
          </div>

          {/* Warnings & Cocktail Hazards */}
          {scanResult.warnings && scanResult.warnings.length > 0 && (
            <div className="border-2 border-amber-500 bg-amber-950/50 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black uppercase text-amber-300 tracking-tight">
                  CRITICAL COCKTAIL & HAZARD ALERTS ({scanResult.warnings.length})
                </h3>
              </div>
              <div className="space-y-3">
                {scanResult.warnings.map((w: any, idx: number) => (
                  <div key={idx} className="p-4 bg-black/60 border border-amber-600/60">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase text-amber-400">
                      <span className="px-2 py-0.5 bg-amber-500 text-black font-mono text-[10px] font-black">
                        {w.type}
                      </span>
                      <span>{w.title}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-200 leading-relaxed font-medium">
                      {w.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detected Additives List */}
          <div className="border-2 border-neutral-700 bg-neutral-900 p-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4">
              IDENTIFIED FOOD ADDITIVES ({scanResult.detectedAdditives?.length || 0})
            </h3>
            {(!scanResult.detectedAdditives || scanResult.detectedAdditives.length === 0) ? (
              <p className="text-xs text-neutral-400 font-mono">No regulated food additives detected in this formulation.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scanResult.detectedAdditives.map((add: any) => (
                  <div key={add.id} className="p-4 bg-neutral-950 border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-sm text-lime-400">{add.id}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${
                        add.riskLevel === 'BANNED'
                          ? 'bg-red-600 text-white'
                          : add.riskLevel === 'HIGH'
                          ? 'bg-orange-500 text-black'
                          : add.riskLevel === 'MODERATE'
                          ? 'bg-yellow-400 text-black'
                          : 'bg-lime-400 text-black'
                      }`}>
                        {add.riskLevel}
                      </span>
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-white">{add.name}</h4>
                    <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{add.function}</p>
                    <p className="mt-2 text-xs text-amber-200/90 leading-tight">
                      <strong className="text-neutral-400">Biological Impact:</strong> {add.potentialEffects}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Allergens & Dietary compliance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allergens box */}
            <div className="border-2 border-neutral-700 bg-neutral-900 p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">
                WHOLE-WORD ALLERGEN DETECTION
              </h3>
              {(!scanResult.allergens || scanResult.allergens.length === 0) ? (
                <div className="p-3 bg-neutral-950 border border-neutral-800 text-xs text-lime-400 font-semibold">
                  No major common allergens detected (whole-word verified).
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {scanResult.allergens.map((alg: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-950 text-amber-300 font-mono text-xs font-bold border border-amber-600/70"
                    >
                      ⚠️ {alg}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-[11px] text-neutral-500 italic">
                Notice: whole-word matching prevents false flags (e.g. eggplant never triggers an egg allergen).
              </p>
            </div>

            {/* Dietary certification */}
            <div className="border-2 border-neutral-700 bg-neutral-900 p-6">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-400 mb-3">
                DIETARY COMPLIANCE FLAGS
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Vegan</span>
                  <p className={`text-base font-black ${scanResult.dietary?.vegan ? 'text-lime-400' : 'text-red-500'}`}>
                    {scanResult.dietary?.vegan ? 'COMPLIANT' : 'NON-VEGAN'}
                  </p>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Halal</span>
                  <p className={`text-base font-black ${scanResult.dietary?.halal ? 'text-lime-400' : 'text-red-500'}`}>
                    {scanResult.dietary?.halal ? 'COMPLIANT' : 'NON-HALAL'}
                  </p>
                </div>
                <div className="p-3 bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">Kosher</span>
                  <p className={`text-base font-black ${scanResult.dietary?.kosher ? 'text-lime-400' : 'text-red-500'}`}>
                    {scanResult.dietary?.kosher ? 'COMPLIANT' : 'NON-KOSHER'}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[11px] text-neutral-500 font-mono">
                {scanResult.dietary?.traceability || 'Demo record: no batch or certification data'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
