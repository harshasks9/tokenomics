"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Target } from "lucide-react";
import { opportunities } from "@/lib/korea/opportunities";

const phases = ["All phases", "Phase 1 · 60 days", "Phase 2 · Q4 2026", "Phase 3 · 2027"] as const;

export default function OpportunityExplorer() {
  const [phase, setPhase] = useState<(typeof phases)[number]>("All phases");
  const [activeId, setActiveId] = useState(opportunities[0].id);

  const visible = useMemo(
    () => (phase === "All phases" ? opportunities : opportunities.filter((item) => item.horizon === phase)),
    [phase],
  );

  const active = opportunities.find((item) => item.id === activeId) ?? opportunities[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {phases.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setPhase(option)}
            className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
              phase === option
                ? "border-[#0047A0] bg-[#0047A0] text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
              Modelled value vs implementation effort
            </p>
            <span className="text-[11px] font-semibold text-slate-400">{visible.length} shown</span>
          </div>

          <div className="relative mt-6 aspect-square w-full rounded-xl bg-[#f6f7f9]">
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
              <div className="border-b border-r border-dashed border-slate-300" />
              <div className="border-b border-dashed border-slate-300" />
              <div className="border-r border-dashed border-slate-300" />
              <div />
            </div>
            <span className="absolute left-3 top-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#188038]">
              Do first
            </span>
            <span className="absolute right-3 top-3 text-[10px] font-black uppercase tracking-[0.14em] text-[#E37400]">
              Plan carefully
            </span>
            <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Quick wins
            </span>
            <span className="absolute bottom-3 right-3 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Defer
            </span>

            {visible.map((item) => {
              const left = ((item.effort - 0.5) / 5) * 100;
              const top = 100 - ((item.value - 0.5) / 5) * 100;
              const isActive = item.id === active.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  style={{ left: `${left}%`, top: `${top}%`, backgroundColor: item.accent }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full text-[10px] font-black text-white transition ${
                    isActive ? "h-11 w-11 ring-4 ring-white" : "h-8 w-8 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={item.name}
                >
                  {item.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex justify-between text-[11px] font-semibold text-slate-400">
            <span>← lower effort</span>
            <span>higher effort →</span>
          </div>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: active.accent }} />
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">{active.subsidiary}</p>
              <h3 className="mt-1 text-2xl font-black leading-tight tracking-tight text-slate-950">{active.name}</h3>
            </div>
          </div>

          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-700">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">The problem today</p>
              <p className="mt-1.5">{active.problem}</p>
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">What we would build</p>
              <p className="mt-1.5">{active.solution}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {active.googleStack.map((tool) => (
              <span
                key={tool}
                className="rounded-full bg-[#e8f0fe] px-2.5 py-1 text-[11px] font-bold text-[#174ea6]"
              >
                {tool}
              </span>
            ))}
          </div>

          <dl className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                <Target size={12} /> Metric that decides it
              </dt>
              <dd className="mt-1 text-[13px] font-semibold text-slate-800">{active.metric}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">Sequenced for</dt>
              <dd className="mt-1 text-[13px] font-semibold text-slate-800">{active.horizon}</dd>
            </div>
          </dl>

          {active.honesty ? (
            <div className="mt-5 flex gap-3 rounded-xl bg-[#fef7e0] p-4">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#E37400]" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B06000]">Where we are being honest</p>
                <p className="mt-1 text-[13px] leading-5 text-slate-700">{active.honesty}</p>
              </div>
            </div>
          ) : null}
        </article>
      </div>
    </div>
  );
}
