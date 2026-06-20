"use client";

import { CAPABILITY_LAYERS } from "@/lib/agent-economics/capabilities";
import type { CapabilityAssessment } from "@/lib/agent-economics/types";

export default function CapabilityBlueprint({ capabilities }: { capabilities: CapabilityAssessment[] }) {
  return (
    <section id="capabilities" className="scroll-mt-28">
      <div className="mb-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">01 / Production stack requirements</p>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">A production agent is not just a model call.</h2>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-slate-600">Every agent that operates at enterprise scale needs five layers working together. The model is the intelligence layer — context, runtime, trust, and operations are the rest of the stack.</p>
      </div>

      <div className="space-y-3">
        {CAPABILITY_LAYERS.map((layer, layerIndex) => {
          const items = capabilities.filter((cap) => cap.layer === layer);
          return (
            <div key={layer} className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-[180px_1fr]">
              <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-950 px-5 py-4 text-white md:block md:border-b-0 md:border-r">
                <span className="text-[10px] font-bold text-blue-300">LAYER {layerIndex + 1}</span>
                <h3 className="mt-0 text-sm font-bold md:mt-1">{layer}</h3>
              </div>
              <div className="grid gap-3 p-3 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((cap) => (
                  <div key={cap.id} className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-800">{cap.shortName}</p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{cap.customerOutcome}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
                      <span className="font-bold text-slate-500">Example:</span> {cap.example}
                    </p>
                    <div className="mt-3 border-t border-slate-200 pt-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600">Why it matters here</p>
                      <p className="mt-1 text-[10px] leading-relaxed text-slate-500">{cap.reasons[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
