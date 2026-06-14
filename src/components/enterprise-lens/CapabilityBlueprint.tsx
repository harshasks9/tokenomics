"use client";

import { Check, CircleDot, Minus } from "lucide-react";
import { CAPABILITY_LAYERS, capabilityCounts } from "@/lib/agent-economics/capabilities";
import type { CapabilityAssessment, Requirement } from "@/lib/agent-economics/types";

const STATUS_META: Record<Requirement, { label: string; color: string; bg: string; icon: typeof Check }> = {
  required: { label: "Required", color: "#B91C1C", bg: "#FEF2F2", icon: Check },
  recommended: { label: "Recommended", color: "#B45309", bg: "#FFF7ED", icon: CircleDot },
  optional: { label: "Optional", color: "#64748B", bg: "#F8FAFC", icon: Minus },
};

export default function CapabilityBlueprint({ capabilities }: { capabilities: CapabilityAssessment[] }) {
  const counts = capabilityCounts(capabilities);
  return (
    <section id="capabilities" className="scroll-mt-28">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">02 / Required capabilities</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Your estate expands the production stack.</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">The model is only the intelligence layer. Autonomy and exposure add context, runtime, trust, and operational obligations.</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {(["required", "recommended", "optional"] as Requirement[]).map((status) => {
          const meta = STATUS_META[status];
          return <div key={status} className="rounded-2xl border p-4" style={{ backgroundColor: meta.bg, borderColor: `${meta.color}25` }}>
            <div className="text-3xl font-extrabold tabular-nums" style={{ color: meta.color }}>{counts[status]}</div>
            <div className="mt-1 text-xs font-bold uppercase tracking-wide" style={{ color: meta.color }}>{meta.label} capabilities</div>
          </div>;
        })}
      </div>

      <div className="space-y-3">
        {CAPABILITY_LAYERS.map((layer, layerIndex) => {
          const items = capabilities.filter((capability) => capability.layer === layer);
          const requiredCount = items.filter((item) => item.status === "required").length;
          return (
            <div key={layer} className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[180px_1fr]">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 px-5 py-4 text-white md:block md:border-b-0 md:border-r">
                <div><span className="text-[10px] font-bold text-blue-300">LAYER {layerIndex + 1}</span><h3 className="mt-1 text-sm font-bold">{layer}</h3></div>
                <div className="mt-0 text-xs text-slate-400 md:mt-3">{requiredCount}/{items.length} required</div>
              </div>
              <div className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
                {items.map((capability) => {
                  const meta = STATUS_META[capability.status];
                  const Icon = meta.icon;
                  return (
                    <div key={capability.id} className="group rounded-xl border p-3" style={{ backgroundColor: meta.bg, borderColor: `${meta.color}20` }}>
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full" style={{ color: meta.color, backgroundColor: `${meta.color}12` }}><Icon size={12} /></span>
                        <div><p className="text-xs font-bold text-slate-800">{capability.shortName}</p><p className="mt-0.5 text-[10px] font-semibold" style={{ color: meta.color }}>{meta.label} · {capability.reuse}</p></div>
                      </div>
                      <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{capability.reasons[0]}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
