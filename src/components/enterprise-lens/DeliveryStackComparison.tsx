"use client";

import { ArrowRight, Cable, CheckCircle2, Clock3, DollarSign, Layers3, ShieldCheck, UsersRound } from "lucide-react";
import {
  accuracyControlSummary,
  APPROACHES,
  APPROACH_META,
  ownershipFor,
  stackSummary,
} from "@/lib/agent-economics/approaches";
import type { Approach, ApproachEconomics, CapabilityAssessment, OwnershipState } from "@/lib/agent-economics/types";

const OWNERSHIP_META: Record<OwnershipState, { marker: string; className: string }> = {
  "Platform-provided": { marker: "P", className: "border-blue-200 bg-blue-50 text-blue-700" },
  "First-party component": { marker: "1P", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  "Hyperscaler service": { marker: "H", className: "border-violet-200 bg-violet-50 text-violet-700" },
  "Third-party product": { marker: "3P", className: "border-amber-200 bg-amber-50 text-amber-700" },
  "Customer build/integration": { marker: "C", className: "border-rose-200 bg-rose-50 text-rose-700" },
  "Quote required": { marker: "?", className: "border-slate-200 bg-slate-50 text-slate-600" },
};

const STACK_PATHS: Record<Approach, string[]> = {
  geap: ["Models + routing", "Grounding + tools", "Runtime + scale", "Trust + policy", "Evals + operations"],
  claude: ["Claude models", "Cloud runtime", "Context products", "Trust products", "Ops tooling"],
  openai: ["OpenAI models", "Cloud runtime", "Context products", "Trust products", "Ops tooling"],
};

const fmtK = (value: number) => value >= 1000 ? `$${(value / 1000).toFixed(2)}M` : `$${Math.round(value)}K`;

interface Props {
  capabilities: CapabilityAssessment[];
  economics: ApproachEconomics[];
}

export default function DeliveryStackComparison({ capabilities, economics }: Props) {
  const inScope = capabilities.filter((capability) => capability.status !== "optional");
  const geap = economics.find((item) => item.approach === "geap")!;
  const bestAssembled = economics
    .filter((item) => item.approach !== "geap")
    .sort((a, b) => a.yearOneK - b.yearOneK)[0];
  const gap = bestAssembled.yearOneK - geap.yearOneK;
  const gapPercent = Math.round((Math.abs(gap) / Math.max(1, bestAssembled.yearOneK)) * 100);
  const maxCost = Math.max(...economics.map((item) => item.yearOneK));

  return (
    <section id="stacks" className="scroll-mt-28">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">03 / Compare delivery stacks</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">What must be added to preserve production accuracy?</h2>
        <p className="mt-2 max-w-4xl text-base leading-relaxed text-slate-600">A model-only price is not an equivalent comparison. Every path below is costed to the same required grounding, evaluation, policy, observability, runtime, and governance outcome.</p>
      </div>

      <div className="mb-6 grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white shadow-xl lg:grid-cols-[1.1fr_0.9fr]">
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300"><ShieldCheck size={15} />Equivalent accuracy target</div>
          <h3 className="mt-3 text-2xl font-black">No required control is removed to make an option look cheaper.</h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">GEAP supplies most controls within one platform. Claude- and OpenAI-centered approaches remain feasible, but only after the missing runtime, context, trust, and operations layers are assembled and operated.</p>
        </div>
        <div className="border-t border-white/10 bg-white/5 p-6 md:p-8 lg:border-l lg:border-t-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Year-1 full-stack difference</p>
          <p className={`mt-2 text-4xl font-black tabular-nums ${gap >= 0 ? "text-emerald-300" : "text-amber-300"}`}>{fmtK(Math.abs(gap))}</p>
          <p className="mt-2 text-sm font-semibold text-white">{gap >= 0 ? `GEAP lower than ${APPROACH_META[bestAssembled.approach].shortName}` : `GEAP premium over ${APPROACH_META[bestAssembled.approach].shortName}`} ({gapPercent}%)</p>
          <p className="mt-3 text-xs leading-relaxed text-slate-400">Includes model usage, platform/runtime, infrastructure, external products, integration, and ongoing operations.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {APPROACHES.map((approach) => {
          const meta = APPROACH_META[approach];
          const summary = stackSummary(approach, capabilities);
          const accuracy = accuracyControlSummary(approach, capabilities);
          const economic = economics.find((item) => item.approach === approach)!;
          const assemblyPoints = summary.total - summary.platformProvided;
          const integratedPercent = Math.round((accuracy.integrated / Math.max(1, accuracy.total)) * 100);
          const isGeap = approach === "geap";

          return (
            <article key={approach} className={`relative overflow-hidden rounded-3xl border-2 p-5 shadow-sm ${isGeap ? "border-blue-500 bg-gradient-to-b from-blue-50 to-white" : "border-slate-200 bg-white"}`}>
              {isGeap && <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-[9px] font-black uppercase tracking-wide text-white">Integrated platform</span>}
              <div className="mb-4 h-1.5 w-14 rounded-full" style={{ backgroundColor: meta.color }} />
              <h3 className="pr-24 text-lg font-extrabold text-slate-950">{meta.shortName}</h3>
              <p className="mt-1 min-h-10 text-xs leading-relaxed text-slate-500">{meta.description}</p>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-end justify-between gap-3">
                  <div><p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">Year-1 full stack</p><p className="mt-1 text-3xl font-black tabular-nums text-slate-950">{fmtK(economic.yearOneK)}</p></div>
                  <p className="text-right text-[10px] font-semibold text-slate-500">{economic.weeksToProduction} weeks<br />to production</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${Math.max(8, (economic.yearOneK / maxCost) * 100)}%`, backgroundColor: meta.color }} /></div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Production stack</p><p className="text-[10px] font-bold text-slate-400">{isGeap ? "One control plane" : "Multi-provider assembly"}</p></div>
                <div className={`flex ${isGeap ? "flex-col" : "flex-wrap"} gap-1.5`}>
                  {STACK_PATHS[approach].map((item, index) => <div key={item} className="flex items-center gap-1.5">
                    <span className={`rounded-lg border px-2 py-1.5 text-[9px] font-bold ${isGeap ? "w-full border-blue-200 bg-blue-50 text-blue-800" : "border-slate-200 bg-slate-50 text-slate-600"}`}>{item}</span>
                    {!isGeap && index < STACK_PATHS[approach].length - 1 && <span className="text-slate-300">+</span>}
                  </div>)}
                </div>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-white">
                <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Accuracy-control delivery</p><p className="text-xs font-black">{accuracy.integrated}/{accuracy.total} integrated</p></div>
                <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-white/10"><div className="bg-emerald-400" style={{ width: `${integratedPercent}%` }} /><div className="bg-amber-400" style={{ width: `${100 - integratedPercent}%` }} /></div>
                <div className="mt-2 flex justify-between text-[9px]"><span className="text-emerald-300">Integrated controls</span><span className="text-amber-300">{accuracy.assemble} to assemble</span></div>
                <p className="mt-3 text-[10px] leading-relaxed text-slate-300">{accuracy.assemble === 0 ? "Feasible without adding a separate accuracy-control layer." : `Feasible at the same target accuracy after ${accuracy.assemble} ${accuracy.assemble === 1 ? "control is" : "controls are"} integrated.`}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <Metric icon={Layers3} value={String(summary.vendors)} label="Providers" />
                <Metric icon={Cable} value={String(summary.integrationBoundaries)} label="Boundaries" />
                <Metric icon={UsersRound} value={String(summary.operatingTeams)} label="Teams" />
              </div>
              <p className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-slate-500"><CheckCircle2 size={13} style={{ color: meta.color }} />{summary.platformProvided}/{summary.total} in-scope capabilities first-party; {assemblyPoints} assembled.</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 md:grid-cols-3">
        <Outcome icon={ShieldCheck} title="Grounded responses" text="Grounding, routing, session context, and evaluation remain in scope for every option." />
        <Outcome icon={Clock3} title="Safe action-taking" text="Identity, authorization, policy, audit, and escalation are included before agents act." />
        <Outcome icon={DollarSign} title="Comparable dollars" text="The cost comparison includes the stack required to reach that outcome, not model tokens alone." />
      </div>

      <details className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-bold text-slate-800">Inspect capability-by-capability ownership <ArrowRight size={16} /></summary>
        <div className="border-t border-slate-200">
          <div className="hidden grid-cols-[220px_repeat(3,1fr)] border-b border-slate-200 bg-slate-50 lg:grid">
            <div className="p-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">In-scope capability</div>
            {APPROACHES.map((approach) => <div key={approach} className="border-l border-slate-200 p-4 text-xs font-bold" style={{ color: APPROACH_META[approach].color }}>{APPROACH_META[approach].shortName}</div>)}
          </div>
          <div className="divide-y divide-slate-100">
            {inScope.map((capability) => (
              <div key={capability.id} className="p-4 lg:grid lg:grid-cols-[220px_repeat(3,1fr)] lg:p-0">
                <div className="pb-3 lg:p-4"><p className="text-xs font-bold text-slate-800">{capability.shortName}</p><p className="mt-1 text-[10px] text-slate-400">{capability.layer} / {capability.status}</p></div>
                <div className="grid gap-2 sm:grid-cols-3 lg:contents">
                  {APPROACHES.map((approach) => {
                    const state = ownershipFor(approach, capability.id);
                    const ownership = OWNERSHIP_META[state];
                    return <div key={approach} className="lg:border-l lg:border-slate-100 lg:p-3"><div className={`flex h-full items-center gap-2 rounded-xl border px-3 py-2 ${ownership.className}`}><span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-white/70 px-1 text-[9px] font-extrabold">{ownership.marker}</span><span className="text-[10px] font-semibold leading-tight">{state}</span></div></div>;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </details>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900"><strong>Fair comparison:</strong> integrated does not mean free, and assembled does not mean inaccurate. The assembled paths can reach the same target only when their additional context, runtime, trust, evaluation, and operating layers are funded and integrated. Enterprise pricing remains adjustable or quote-required.</div>
    </section>
  );
}

function Metric({ icon: Icon, value, label }: { icon: typeof Cable; value: string; label: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><div className="flex items-center gap-1 text-slate-400"><Icon size={11} /><span className="text-[8px] font-bold uppercase tracking-wide">{label}</span></div><div className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{value}</div></div>;
}

function Outcome({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return <div className="rounded-xl bg-white/70 p-4"><Icon size={17} className="text-blue-600" /><p className="mt-3 text-xs font-extrabold text-slate-900">{title}</p><p className="mt-1 text-[10px] leading-relaxed text-slate-600">{text}</p></div>;
}
