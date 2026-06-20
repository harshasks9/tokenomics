"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { SIG_S2, SIG_S2_QA, sigS2Costs, type SigS2QAPair } from "@/lib/industries/signalos";
import { useTally } from "@/lib/tally-context";

const SKY   = "#0284C7";
const TEAL  = "#00ACC1";
const BLUE  = "#1A73E8";
const AMBER = "#E37400";

const CATEGORY_COLOR: Record<SigS2QAPair["category"], string> = {
  routine: TEAL,
  faq:     BLUE,
  complex: AMBER,
};

function ScoreBar({ score, max = 5, color }: { score: number; max?: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className="h-1.5 flex-1 rounded-full"
          style={{ backgroundColor: i < score ? color : color + "20" }} />
      ))}
    </div>
  );
}

export default function SignalRunScenario() {
  const { updateResult } = useTally();
  const [selected, setSelected] = useState<SigS2QAPair>(SIG_S2_QA[0]);
  const [queries, setQueries] = useState(SIG_S2.defaults.queriesPerMonth);

  const costs = sigS2Costs(queries);

  useEffect(() => {
    updateResult("s2", {
      label: "Customer Support AI",
      allFrontier: costs.allOpusAnnual,
      tiered: costs.tieredAnnual,
      savings: costs.allOpusAnnual - costs.tieredAnnual,
      period: "annual",
    });
  }, [costs.allOpusAnnual, costs.tieredAnnual, updateResult]);

  const fmtQueries = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${(n / 1_000).toFixed(0)}K`;

  const perQueryChartData = [
    { name: "Flash-Lite", cost: costs.perQueryFlashLite * 1000 },
    { name: "Flash",      cost: costs.perQueryFlash     * 1000 },
    { name: "Opus",       cost: costs.perQueryOpus      * 1000 },
  ];

  return (
    <section id="sig-support" className="relative py-24 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
              style={{ background: SKY + "15", color: SKY }}>Scenario 2</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Run Phase</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Customer Support AI</h2>
          <p className="mt-3 max-w-2xl text-lg text-slate-600">
            60% of subscriber queries are routine — bill dates, data usage, basic troubleshooting.
            Flash-Lite handles those at a fraction of Opus cost. Billing disputes and enterprise SLA
            negotiations stay on Opus, where the wrong answer means churn.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          {/* LEFT: query selector */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Select a subscriber query</p>
            <div className="space-y-2">
              {SIG_S2_QA.map((qa) => {
                const catColor = CATEGORY_COLOR[qa.category];
                return (
                  <button key={qa.id} onClick={() => setSelected(qa)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      selected.id === qa.id ? "shadow-md" : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    style={selected.id === qa.id ? { borderColor: SKY, background: SKY + "06" } : {}}>
                    <div className="flex items-start gap-3">
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                        style={{ backgroundColor: catColor + "15", color: catColor }}>
                        {qa.category}
                      </span>
                      <p className="text-sm font-medium text-gray-800">{qa.question}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: model responses + cost */}
          <div className="space-y-5">
            <AnimatePresence mode="wait">
              <motion.div key={selected.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3">
                {([
                  { key: "flashLite" as const, label: "Flash-Lite", color: TEAL,  model: "Gemini 3.1 Flash-Lite" },
                  { key: "flash"     as const, label: "Flash",      color: BLUE,  model: "Gemini 3.5 Flash"      },
                  { key: "opus"      as const, label: "Opus",       color: AMBER, model: "Claude Opus 4.8"       },
                ]).map((m) => (
                  <div key={m.key} className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold" style={{ color: m.color }}>{m.model}</span>
                      <div className="flex items-center gap-2">
                        <ScoreBar score={selected.scores[m.key]} color={m.color} />
                        <span className="text-[10px] text-gray-400">{selected.scores[m.key]}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{selected.answers[m.key]}</p>
                  </div>
                ))}
                {selected.sellerNote && (
                  <div className="rounded-xl border p-4" style={{ borderColor: SKY + "40", background: SKY + "08" }}>
                    <p className="text-xs italic leading-relaxed" style={{ color: "#075985" }}>
                      &ldquo;{selected.sellerNote}&rdquo;
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Queries / Month</p>
                <span className="text-lg font-bold tabular-nums" style={{ color: SKY }}>{fmtQueries(queries)}</span>
              </div>
              <input type="range" min={500_000} max={20_000_000} step={500_000} value={queries}
                onChange={(e) => setQueries(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-sky-600 mb-2" />
              <div className="flex justify-between text-[10px] text-gray-400"><span>500K</span><span>20M</span></div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-4">Per-Query Cost (×1000 = $/K queries)</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={perQueryChartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9AA0A6" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `$${v.toFixed(3)}`} width={44} />
                  <Tooltip formatter={(v: unknown) => [`$${Number(v).toFixed(4)}/K`, "Cost per 1K"]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={48} fill={SKY} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={{ background: `linear-gradient(135deg, ${SKY} 0%, #075985 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-200 mb-1">Annual Savings vs All-Opus</p>
              <p className="text-4xl font-extrabold text-white tabular-nums mb-1">
                {fmtUSD(costs.allOpusAnnual - costs.tieredAnnual)}
              </p>
              <p className="text-sky-200 text-sm">
                {pctSavings(costs.allOpusAnnual, costs.tieredAnnual).toFixed(0)}% reduction ·
                60% of queries on Flash-Lite at {fmtUSD(costs.perQueryFlashLite, 4)}/query
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
