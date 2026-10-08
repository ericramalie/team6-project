/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { StatusBanner } from './components/StatusBanner.tsx';
import { AdditiveDirectory } from './components/AdditiveDirectory.tsx';
import { IngredientScanner } from './components/IngredientScanner.tsx';
import { PesticideMrl } from './components/PesticideMrl.tsx';
import { NutritionFuel } from './components/NutritionFuel.tsx';
import { ActiveSportsHub } from './components/ActiveSportsHub.tsx';
import { McpInspectorModal } from './components/McpInspectorModal.tsx';
import { callMcp } from './services/mcpClient.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState('additives');
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Cross-tab query routing states
  const [scannerQuery, setScannerQuery] = useState('');
  const [pesticideQuery, setPesticideQuery] = useState('');
  const [nutritionQuery, setNutritionQuery] = useState('');

  function handleRouteTab(targetTab: string, query?: string) {
    if (targetTab === 'scanner') {
      if (query) setScannerQuery(query);
      setActiveTab('scanner');
    } else if (targetTab === 'pesticides') {
      if (query) setPesticideQuery(query);
      setActiveTab('pesticides');
    } else if (targetTab === 'nutrition') {
      if (query) setNutritionQuery(query);
      setActiveTab('nutrition');
    } else {
      setActiveTab(targetTab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Global "Refresh from MCP" re-runs check_additive on default or active query
  async function handleGlobalRefresh() {
    setIsRefreshing(true);
    try {
      await callMcp('check_additive', { query: 'E211' });
    } catch {
      // status will update automatically
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-400 selection:text-black">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openInspector={() => setInspectorOpen(true)}
      />

      {/* Live Status & Mandatory Disclaimer Banner */}
      <StatusBanner
        onRefresh={handleGlobalRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {activeTab === 'additives' && (
          <AdditiveDirectory onRouteTab={handleRouteTab} />
        )}

        {activeTab === 'scanner' && (
          <IngredientScanner initialQuery={scannerQuery} />
        )}

        {activeTab === 'pesticides' && (
          <PesticideMrl initialQuery={pesticideQuery} />
        )}

        {activeTab === 'nutrition' && (
          <NutritionFuel
            initialQuery={nutritionQuery}
            onReserveMeal={() => {
              setActiveTab('activesg');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'activesg' && (
          <ActiveSportsHub
            onSelectMealForNutrition={(mealName) => {
              setNutritionQuery(mealName);
              setActiveTab('nutrition');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Clean, Non-ornamental Footer */}
      <footer className="border-t-2 border-neutral-800 bg-neutral-950 mt-16 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold uppercase text-white tracking-wider">
              NutriSafe ToxiScan & ActiveFuel · Embedded MCP Server Architecture
            </p>
            <p className="text-[11px] text-neutral-500 font-mono">
              Streamable HTTP Protocol 2025-11-25 · Serving /api/mcp demo dataset (22 Additives · 12 Nutrition · 8 Pesticides)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('additives');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-lime-400 cursor-pointer transition-colors"
            >
              Additives
            </button>
            <button
              onClick={() => {
                setActiveTab('scanner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-lime-400 cursor-pointer transition-colors"
            >
              Scanner
            </button>
            <button
              onClick={() => {
                setActiveTab('pesticides');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-lime-400 cursor-pointer transition-colors"
            >
              Pesticides
            </button>
            <button
              onClick={() => {
                setActiveTab('nutrition');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-lime-400 cursor-pointer transition-colors"
            >
              Nutrition
            </button>
            <button
              onClick={() => {
                setActiveTab('activesg');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-lime-400 cursor-pointer transition-colors"
            >
              ActiveSG & Vending
            </button>
          </div>
        </div>
      </footer>

      {/* Live Streamable HTTP MCP Inspector Modal */}
      <McpInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
      />
    </div>
  );
}
