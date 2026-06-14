"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Building2, Layers3 } from "lucide-react";
import AgentEstateProfiler, { ESTATE_PRESETS } from "./AgentEstateProfiler";
import CapabilityBlueprint from "./CapabilityBlueprint";
import DeliveryStackComparison from "./DeliveryStackComparison";
import EconomicsComparison from "./EconomicsComparison";
import DecisionBrief from "./DecisionBrief";
import { deriveCapabilities, estateSummary } from "@/lib/agent-economics/capabilities";
import { buildDecisionBrief, calculateEconomics, DEFAULT_ASSUMPTIONS } from "@/lib/agent-economics/economics";

export default function AgentEconomicsExperience() {
  const [profile, setProfile] = useState(ESTATE_PRESETS.mixed);
  const [assumptions, setAssumptions] = useState(DEFAULT_ASSUMPTIONS);
  const capabilities = useMemo(() => deriveCapabilities(profile), [profile]);
  const economics = useMemo(() => calculateEconomics(profile, capabilities, assumptions), [profile, capabilities, assumptions]);
  const brief = useMemo(() => buildDecisionBrief(economics, profile), [economics, profile]);
  const summary = estateSummary(profile);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-950">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #2563EB 0, transparent 32%), radial-gradient(circle at 10% 80%, #0F766E 0, transparent 30%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10 lg:pb-24">
          <Link href="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur hover:bg-white/10"><ArrowLeft size={14} />Home</Link>
          <div className="mt-14 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200"><Building2 size={14} />Enterprise Agent Economics</div>
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-7xl">The economic unit is the production agent stack.</h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 lg:text-xl">Define the estate. Reveal the capabilities it requires. Then compare an integrated platform with the infrastructure, products, and operating work behind API-centered alternatives.</p>
            <a href="#define" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-blue-50">Build the estate profile<ArrowRight size={16} /></a>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 lg:px-10">
          {[['define','1. Estate'],['capabilities','2. Capabilities'],['stacks','3. Delivery stacks'],['economics','4. Economics']].map(([id,label]) => <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-950">{label}</a>)}
          <div className="ml-auto hidden items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white md:flex"><Layers3 size={13} />{summary.total} agents · {profile.sensitivity} · {profile.activity} activity</div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16 lg:px-10 lg:py-24">
        <AgentEstateProfiler profile={profile} onChange={setProfile} />
        <CapabilityBlueprint capabilities={capabilities} />
        <DeliveryStackComparison capabilities={capabilities} economics={economics} />
        <div><EconomicsComparison profile={profile} capabilities={capabilities} assumptions={assumptions} onAssumptionsChange={setAssumptions} /><DecisionBrief brief={brief} /></div>
      </div>

      <footer className="border-t border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-6 py-8 text-xs leading-relaxed text-slate-500 lg:px-10"><strong className="text-slate-700">Decision-support model:</strong> public list prices are used where available; enterprise platform, license, labor, and usage figures remain adjustable assumptions or quote-required. Validate against architecture scope and contracted rates before a purchase decision.</div></footer>
    </main>
  );
}
