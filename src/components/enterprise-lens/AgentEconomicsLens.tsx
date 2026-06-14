"use client";

import { useState } from "react";
import AgentEconFunctionTaxonomy from "./AgentEconFunctionTaxonomy";
import AgentEconSharedVsRepeated from "./AgentEconSharedVsRepeated";
import AgentEconTCOChart from "./AgentEconTCOChart";
import AgentEconRecommender from "./AgentEconRecommender";

const DEFAULT_N_AGENTS   = 25;
const DEFAULT_ENG_RATE_K = 18;   // $K/engineer-month
const DEFAULT_MODEL_K    = 12;   // $K/agent/year token cost

export default function AgentEconomicsLens() {
  const [nAgents,   setNAgents]   = useState(DEFAULT_N_AGENTS);
  const [engRateK,  setEngRateK]  = useState(DEFAULT_ENG_RATE_K);
  const [modelCostK, setModelCostK] = useState(DEFAULT_MODEL_K);

  return (
    <div className="mt-10 border-t-2 border-blue-100 pt-8">
      {/* Lens header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 uppercase tracking-wide">Beta lens</span>
          <span className="inline-block rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700 uppercase tracking-wide">Claims labeled [VERIFIED]/[ASSUMPTION]/[UNCONFIRMED]</span>
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-1">Total Cost to Outcome — Enterprise Agent Economics</h2>
        <p className="text-sm text-gray-500 max-w-2xl">
          A credible model for CFO/CIO/architect audiences. Four approaches compared fairly at the same token cost.
          Every input is adjustable; every claim is labeled. The thesis to test, not assume.
        </p>
      </div>

      {/* Global controls */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 mb-8">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Global inputs — change these to stress-test the model</p>
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Engineering rate */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600">Engineering rate</label>
              <span className="text-sm font-bold text-gray-800 tabular-nums">${engRateK}K/mo</span>
            </div>
            <input type="range" min={8} max={35} step={1} value={engRateK}
              onChange={(e) => setEngRateK(Number(e.target.value))}
              className="w-full h-2 cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>$8K (low-cost offshore)</span><span>$35K (SF senior)</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">[ASSUMPTION] $18K base = blended US mid-market. [VERIFIED from BLS/Levels.fyi]</p>
          </div>

          {/* Model cost per agent */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600">Model cost per agent/year</label>
              <span className="text-sm font-bold text-gray-800 tabular-nums">${modelCostK}K/yr</span>
            </div>
            <input type="range" min={1} max={50} step={1} value={modelCostK}
              onChange={(e) => setModelCostK(Number(e.target.value))}
              className="w-full h-2 cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>$1K (Flash Lite, low vol)</span><span>$50K (Opus, heavy)</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Held equal across all 4 approaches — isolates platform economics.</p>
          </div>

          {/* Agent count */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-gray-600">Agent estate size (N)</label>
              <span className="text-sm font-bold text-gray-800 tabular-nums">{nAgents} agents</span>
            </div>
            <input type="range" min={1} max={250} step={1} value={nAgents}
              onChange={(e) => setNAgents(Number(e.target.value))}
              className="w-full h-2 cursor-pointer accent-blue-600" />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>1 pilot</span><span>250 enterprise-wide</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Cross-check with the TCO chart crossovers at N=10/50/200.</p>
          </div>
        </div>
      </div>

      {/* Four visuals */}
      <div className="space-y-10">
        {/* Visual 1 — Function taxonomy */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <AgentEconFunctionTaxonomy />
        </div>

        {/* Visual 2 — Shared vs repeated */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <AgentEconSharedVsRepeated nAgents={nAgents} engRateK={engRateK} />
        </div>

        {/* Visual 3 — TCO vs scale */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <AgentEconTCOChart
            nAgents={nAgents}
            setNAgents={setNAgents}
            engRateK={engRateK}
            modelCostK={modelCostK}
          />
        </div>

        {/* Visual 4 — Recommender */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <AgentEconRecommender />
        </div>
      </div>

      {/* Lens footer */}
      <div className="mt-8 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          <strong className="text-gray-500">Model assumptions:</strong> Year-1 TCO, base engineering rate $18K/engineer-month (adjustable above).
          Labor-priced components (build, integration) scale with eng rate; license and runtime costs do not.
          Model/token cost held equal across all approaches to isolate platform economics.
          Sources: Google Cloud pricing pages [VERIFIED], BLS/Levels.fyi salary data [VERIFIED],
          Langfuse enterprise pricing [ASSUMPTION from public pricing page], Pinecone enterprise estimates [ASSUMPTION],
          build-week estimates [ASSUMPTION from practitioner surveys]. All crossovers verified at base rate.
          This is a decision-support model — validate with your actual vendor quotes before committing.
        </p>
      </div>
    </div>
  );
}
