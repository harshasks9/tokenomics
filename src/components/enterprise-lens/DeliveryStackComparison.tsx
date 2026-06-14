"use client";

import { Cable, CheckCircle2, Layers3, UsersRound } from "lucide-react";
import { APPROACHES, APPROACH_META, ownershipFor, stackSummary } from "@/lib/agent-economics/approaches";
import type { CapabilityAssessment, OwnershipState } from "@/lib/agent-economics/types";

const OWNERSHIP_META: Record<OwnershipState, { marker: string; className: string }> = {
  "Platform-provided": { marker: "P", className: "bg-blue-50 text-blue-700 border-blue-200" },
  "First-party component": { marker: "1P", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  "Hyperscaler service": { marker: "H", className: "bg-violet-50 text-violet-700 border-violet-200" },
  "Third-party product": { marker: "3P", className: "bg-amber-50 text-amber-700 border-amber-200" },
  "Customer build/integration": { marker: "C", className: "bg-rose-50 text-rose-700 border-rose-200" },
  "Quote required": { marker: "?", className: "bg-slate-50 text-slate-600 border-slate-200" },
};

export default function DeliveryStackComparison({ capabilities }: { capabilities: CapabilityAssessment[] }) {
  const inScope = capabilities.filter((capability) => capability.status !== "optional");
  return (
    <section id="stacks" className="scroll-mt-28">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">03 / Compare delivery stacks</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Same production outcome. Different ownership burden.</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">The question is not whether a capability is billed. It is whether the capability, controls, and operating model arrive integrated or must be assembled across providers.</p>
      </div>

      <div className="mb-5 grid gap-4 lg:grid-cols-3">
        {APPROACHES.map((approach) => {
          const meta = APPROACH_META[approach];
          const summary = stackSummary(approach, capabilities);
          return (
            <article key={approach} className="rounded-3xl border-2 bg-white p-5 shadow-sm" style={{ borderColor: `${meta.color}35` }}>
              <div className="mb-4 h-1.5 w-14 rounded-full" style={{ backgroundColor: meta.color }} />
              <h3 className="text-lg font-extrabold text-slate-950">{meta.name}</h3>
              <p className="mt-2 min-h-12 text-xs leading-relaxed text-slate-500">{meta.description}</p>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Metric icon={CheckCircle2} value={`${summary.platformProvided}/${summary.total}`} label="First-party" />
                <Metric icon={Layers3} value={String(summary.vendors)} label="Providers" />
                <Metric icon={Cable} value={String(summary.integrationBoundaries)} label="Boundaries" />
                <Metric icon={UsersRound} value={String(summary.operatingTeams)} label="Owner teams" />
              </div>
            </article>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[220px_repeat(3,1fr)] border-b border-slate-200 bg-slate-50 lg:grid">
          <div className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Required capability</div>
          {APPROACHES.map((approach) => <div key={approach} className="border-l border-slate-200 p-4 text-xs font-bold" style={{ color: APPROACH_META[approach].color }}>{APPROACH_META[approach].shortName}</div>)}
        </div>
        <div className="divide-y divide-slate-100">
          {inScope.map((capability) => (
            <div key={capability.id} className="p-4 lg:grid lg:grid-cols-[220px_repeat(3,1fr)] lg:p-0">
              <div className="pb-3 lg:p-4"><p className="text-xs font-bold text-slate-800">{capability.shortName}</p><p className="mt-1 text-[10px] text-slate-400">{capability.layer} · {capability.status}</p></div>
              <div className="grid gap-2 sm:grid-cols-3 lg:contents">
                {APPROACHES.map((approach) => {
                  const state = ownershipFor(approach, capability.id);
                  const ownership = OWNERSHIP_META[state];
                  return <div key={approach} className="lg:border-l lg:border-slate-100 lg:p-3">
                    <div className={`flex h-full items-center gap-2 rounded-xl border px-3 py-2 ${ownership.className}`}>
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-white/70 px-1 text-[9px] font-extrabold">{ownership.marker}</span>
                      <span className="text-[10px] font-semibold leading-tight">{state}</span>
                    </div>
                  </div>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
        <strong>Fair comparison:</strong> integrated does not mean free. GEAP concentrates metered services and controls on one platform. OpenAI Frontier is a more integrated, separately contracted alternative to the API-centered stack; public economics are quote-required. Anthropic Managed Agents can reduce runtime assembly for supported workloads, but public evidence does not establish the full governance stack. Existing cloud and tooling commitments can materially improve assembled-stack economics.
      </div>
    </section>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Cable; value: string; label: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-1.5 text-slate-400"><Icon size={12} /><span className="text-[9px] font-bold uppercase tracking-wide">{label}</span></div><div className="mt-1 text-xl font-extrabold text-slate-900 tabular-nums">{value}</div></div>;
}
