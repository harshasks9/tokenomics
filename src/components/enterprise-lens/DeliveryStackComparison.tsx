"use client";

import { Lock, Layers3, ShieldCheck, Zap, GitBranch } from "lucide-react";

const INTEGRATED_LAYERS = [
  "Models + routing",
  "Context + tools",
  "Runtime + scale",
  "Trust + policy",
  "Evals + ops",
];

type AssembledLayer = { label: string; color: string; gap?: boolean };

const ASSEMBLED_LAYERS: AssembledLayer[] = [
  { label: "Model API", color: "#0F766E" },
  { label: "integrate", color: "#94A3B8", gap: true },
  { label: "Cloud runtime", color: "#7C3AED" },
  { label: "integrate", color: "#94A3B8", gap: true },
  { label: "Context / RAG", color: "#B45309" },
  { label: "integrate", color: "#94A3B8", gap: true },
  { label: "Trust tooling", color: "#B45309" },
  { label: "integrate", color: "#94A3B8", gap: true },
  { label: "Ops / FinOps", color: "#B45309" },
];

export default function DeliveryStackComparison() {
  return (
    <section id="stacks" className="scroll-mt-28">
      <div className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">04 / Delivery stacks</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">One platform. Three advantages.</h2>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-500">An integrated stack isn&apos;t just cheaper to run — it ships faster, gives you tighter control, and scales securely without wiring together multiple vendors.</p>
      </div>

      {/* 3 benefit pillars */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <Pillar
          icon={Zap}
          color="blue"
          title="Quicker delivery"
          body="Skip the integration sprint. Models, runtime, context, and ops ship together — go from build to production in weeks, not quarters."
        />
        <Pillar
          icon={Lock}
          color="violet"
          title="Tighter control"
          body="Policy, audit, identity, and approval live in one control plane. No drift between systems, no gaps at integration seams."
        />
        <Pillar
          icon={ShieldCheck}
          color="emerald"
          title="Scale & security"
          body="Unified autoscaling, sandboxing, and compliance across every agent — not bolted on per-service after the fact."
        />
      </div>

      {/* Visual stack comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Integrated */}
        <div className="overflow-hidden rounded-3xl border-2 border-blue-500 bg-white shadow-md">
          <div className="border-b border-blue-100 bg-blue-600 px-6 py-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Integrated platform</p>
            <p className="mt-0.5 text-lg font-black">Gemini Enterprise Agent Platform</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-1.5">
              {INTEGRATED_LAYERS.map((label) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-blue-800">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2 rounded-2xl bg-blue-50 p-4">
              <Layers3 size={15} className="mt-0.5 shrink-0 text-blue-600" />
              <p className="text-xs leading-relaxed text-blue-800"><strong>One vendor. One control plane.</strong> Unified governance from day one.</p>
            </div>
          </div>
        </div>

        {/* Assembled */}
        <div className="overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-900 px-6 py-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assembled stack</p>
            <p className="mt-0.5 text-lg font-black">e.g. Claude Enterprise, OpenAI APIs</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-1">
              {ASSEMBLED_LAYERS.map((layer, i) =>
                layer.gap ? (
                  <div key={i} className="flex items-center gap-2 px-3 py-0.5">
                    <GitBranch size={11} className="text-amber-400" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">wire + test integration</span>
                  </div>
                ) : (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: layer.color }} />
                    <span className="text-sm font-semibold text-slate-700">{layer.label}</span>
                  </div>
                )
              )}
            </div>
            <div className="mt-5 flex gap-2 rounded-2xl bg-amber-50 p-4">
              <GitBranch size={15} className="mt-0.5 shrink-0 text-amber-600" />
              <p className="text-xs leading-relaxed text-amber-800"><strong>Multiple vendors. Multiple seams.</strong> Each integration gap is yours to own, test, and operate.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pillar({ icon: Icon, color, title, body }: { icon: typeof Zap; color: "blue" | "violet" | "emerald"; title: string; body: string }) {
  const styles = {
    blue:    { ring: "border-blue-200 bg-blue-50",    icon: "text-blue-600"    },
    violet:  { ring: "border-violet-200 bg-violet-50", icon: "text-violet-600"  },
    emerald: { ring: "border-emerald-200 bg-emerald-50", icon: "text-emerald-600" },
  }[color];

  return (
    <div className={`rounded-2xl border p-5 ${styles.ring}`}>
      <Icon size={20} className={styles.icon} />
      <p className="mt-4 text-base font-extrabold text-slate-950">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{body}</p>
    </div>
  );
}
