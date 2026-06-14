"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Layers3, TrendingUp, ShoppingBag, Heart, Landmark, Factory } from "lucide-react";
import CapabilityBlueprint from "./CapabilityBlueprint";
import BOSOFramework from "./BOSOFramework";
import CustomerTransformationStories from "./CustomerTransformationStories";
import DeliveryStackComparison from "./DeliveryStackComparison";
import DecisionBrief from "./DecisionBrief";
import { deriveCapabilities } from "@/lib/agent-economics/capabilities";
import { buildDecisionBrief, calculateEconomics, DEFAULT_ASSUMPTIONS } from "@/lib/agent-economics/economics";
import { ESTATE_PRESETS } from "./AgentEstateProfiler";

const INDUSTRY_LINKS = [
  { href: "/wealthai",  label: "WealthAI",  icon: TrendingUp,  color: "#4285F4" },
  { href: "/shopos",    label: "ShopOS",    icon: ShoppingBag, color: "#34A853" },
  { href: "/pulseai",   label: "PulseAI",   icon: Heart,       color: "#FB7185" },
  { href: "/civicos",   label: "CivicOS",   icon: Landmark,    color: "#818CF8" },
  { href: "/factoryos", label: "FactoryOS", icon: Factory,     color: "#F97316" },
];

const FIXED_PROFILE = ESTATE_PRESETS.mixed;

export default function AgentEconomicsExperience() {
  const capabilities = useMemo(() => deriveCapabilities(FIXED_PROFILE), []);
  const economics = useMemo(() => calculateEconomics(FIXED_PROFILE, capabilities, DEFAULT_ASSUMPTIONS), [capabilities]);
  const brief = useMemo(() => buildDecisionBrief(economics, FIXED_PROFILE), [economics]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#F8FAFC] text-slate-950">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #2563EB 0, transparent 32%), radial-gradient(circle at 10% 80%, #0F766E 0, transparent 30%)" }} />
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-6 lg:px-10 lg:pb-24">
          <div className="flex flex-wrap items-center gap-2">
            {INDUSTRY_LINKS.map(({ href, label, icon: Icon, color }) => (
              <Link key={href} href={href}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 backdrop-blur transition hover:bg-white/10 hover:text-white/90">
                <Icon size={12} style={{ color }} />
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-10 max-w-4xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1.5 text-xs font-bold text-blue-200">
              <Building2 size={14} />Enterprise Agent Decision Framework
            </div>
            <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-7xl">The production agent stack is the decision.</h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 lg:text-xl">Every enterprise agent needs 22 production capabilities across five layers. The platform you choose determines how many of those you get — and how many your team has to build and operate.</p>
            <a href="#capabilities" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-lg hover:bg-blue-50">
              See the full stack<ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 lg:px-10">
          {[
            ['capabilities', '1. Production stack'],
            ['boso',         '2. Platform comparison'],
            ['customer-journeys', '3. Customer journeys'],
            ['stacks',       '4. Delivery stacks'],
            ['recommend',    '5. Decision guide'],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="whitespace-nowrap rounded-full px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-950">{label}</a>
          ))}
          <div className="ml-auto hidden items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white md:flex">
            <Layers3 size={13} />Enterprise Agent Decision Framework
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl space-y-24 px-6 py-16 lg:px-10 lg:py-24">

        <CapabilityBlueprint capabilities={capabilities} />

        <BOSOFramework />

        <CustomerTransformationStories />

        <DeliveryStackComparison />

        <section id="recommend" className="scroll-mt-28">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">05 / Decision guide</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">What are the platform components that matter most in your decision?</h2>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500">Platform fit comes down to which production capabilities your team is willing to own versus which need to ship out of the box.</p>
          </div>
          <DecisionBrief brief={brief} />
        </section>

      </div>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-xs leading-relaxed text-slate-500 lg:px-10">
          <strong className="text-slate-700">Decision-support framework:</strong> platform fit is derived from production capability requirements and assembly complexity across the Build → Operate → Scale → Optimize lifecycle. Validate against your architecture scope and contracted rates before a purchase decision.
        </div>
      </footer>
    </main>
  );
}
