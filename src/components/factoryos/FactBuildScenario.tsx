"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { FACT_S1, FACT_S1_TASKS, factS1Costs, type FactS1Task, type FactS1Baseline } from "@/lib/industries/factoryos";
import { useTally } from "@/lib/tally-context";

const AMBER  = "#E37400";
const BLUE   = "#1A73E8";
const TEAL   = "#00ACC1";
const GREEN  = "#188038";
const PURPLE = "#7C3AED";

const TIER_META = {
  flashLite: { color: TEAL,   label: "Flash-Lite", desc: "Boilerplate & tests" },
  flash:     { color: BLUE,   label: "Flash",      desc: "Adapters & dashboards" },
  opus:      { color: AMBER,  label: "Opus",        desc: "Safety-critical & architecture" },
} as const;

function TaskRow({ task, baseline }: { task: FactS1Task; baseline: FactS1Baseline }) {
  const effectiveTier: "flashLite" | "flash" | "opus" =
    baseline === "allOpus"   ? "opus" :
    baseline === "allSonnet" && task.tier !== "opus" ? "flash" :
    task.tier;
  const meta = TIER_META[effectiveTier];

  return (
    <motion.div
      layout
      className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:border-gray-200 transition-colors"
    >
      <span
        className="mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
        style={{ backgroundColor: meta.color + "15", color: meta.color }}
      >
        {meta.label}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-gray-800 leading-tight">{task.title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{task.why}</p>
      </div>
    </motion.div>
  );
}

export default function FactBuildScenario() {
  const { updateResult } = useTally();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });

  const [devs,    setDevs]    = useState(FACT_S1.defaults.devs);
  const [sprints, setSprints] = useState(FACT_S1.defaults.sprints);
  const [baseline, setBaseline] = useState<FactS1Baseline>("geminiTiered");

  const costs = factS1Costs(devs, sprints, baseline);
  const savingsPct = pctSavings(costs.allOpusTotal, costs.geminiTieredTotal);

  useEffect(() => {
    updateResult("s1", {
      label: "IoT Platform Build",
      allFrontier: costs.allOpusTotal,
      tiered: costs.geminiTieredTotal,
      savings: costs.allOpusTotal - costs.geminiTieredTotal,
      period: "one-time",
    });
  }, [costs.allOpusTotal, costs.geminiTieredTotal, updateResult]);

  const chartData = [
    { name: "All Opus",        cost: costs.allOpusTotal      },
    { name: "All Sonnet",      cost: costs.allSonnetTotal    },
    { name: "Gemini Tiered",   cost: costs.geminiTieredTotal },
  ];

  const BASELINE_META: Record<FactS1Baseline, { label: string; color: string }> = {
    allOpus:     { label: "All Opus",      color: AMBER  },
    allSonnet:   { label: "All Sonnet",    color: PURPLE },
    geminiTiered:{ label: "Gemini Tiered", color: GREEN  },
  };

  return (
    <section id="fact-build" ref={sectionRef} className="relative py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ background: AMBER + "15", color: AMBER }}>Scenario 1</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Build Phase</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Industrial IoT Platform SDLC</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            Factory codebases are 55% boilerplate — unit tests, CRUD endpoints, Dockerfiles.
            Flash-Lite handles those at $0.025/task. Opus handles safety interlocks and SCADA integration.
          </p>
          {costs.geminiTieredTotal > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold"
              style={{ background: GREEN + "12", color: GREEN, border: `1px solid ${GREEN}30` }}>
              {savingsPct.toFixed(0)}% savings vs all-Opus — {fmtUSD(costs.allOpusTotal - costs.geminiTieredTotal)} saved
            </div>
          )}
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* LEFT: task list */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5">
            {/* Baseline selector */}
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(BASELINE_META) as FactS1Baseline[]).map((b) => {
                const m = BASELINE_META[b];
                const isRec = b === "geminiTiered";
                return (
                  <button key={b} onClick={() => setBaseline(b)}
                    className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-all border flex items-center gap-1.5"
                    style={{
                      backgroundColor: baseline === b ? m.color + "15" : "transparent",
                      borderColor: baseline === b ? m.color : "#e2e8f0",
                      color: baseline === b ? m.color : "#64748b",
                    }}>
                    {m.label}
                    {isRec && <span className="text-[9px] font-bold uppercase" style={{ color: GREEN }}>Rec</span>}
                  </button>
                );
              })}
            </div>

            {/* Tasks */}
            <div className="grid gap-2 sm:grid-cols-2">
              {FACT_S1_TASKS.map((t) => (
                <TaskRow key={t.title} task={t} baseline={baseline} />
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 pt-2">
              {(Object.entries(TIER_META) as [keyof typeof TIER_META, typeof TIER_META[keyof typeof TIER_META]][]).map(([k, m]) => (
                <span key={k} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} />
                  {m.label} — {m.desc}
                </span>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: controls + chart */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-5">
            {/* Sliders */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-5">
              {[
                { label: "Developers", value: devs,    min: 1,  max: 50, step: 1,  set: setDevs,    unit: "devs"    },
                { label: "Sprints",    value: sprints, min: 4,  max: 26, step: 1,  set: setSprints, unit: "sprints" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{s.label}</p>
                    <span className="text-lg font-bold tabular-nums" style={{ color: AMBER }}>{s.value} {s.unit}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 cursor-pointer accent-orange-600" />
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Total Project Cost Comparison</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barGap={6}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v}`} width={48} />
                  <Tooltip formatter={(v: unknown) => [fmtUSD(Number(v))]} contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #E8EAED" }} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={48}
                    fill={baseline === "allOpus" ? AMBER : baseline === "allSonnet" ? PURPLE : GREEN} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cost breakdown */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Selected: {BASELINE_META[baseline].label}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Per sprint</span>
                  <span className="font-bold" style={{ color: BASELINE_META[baseline].color }}>{fmtUSD(costs.chosenPerSprint)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-700 font-semibold">Total project</span>
                  <span className="font-extrabold" style={{ color: BASELINE_META[baseline].color }}>{fmtUSD(costs.chosenTotal)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
