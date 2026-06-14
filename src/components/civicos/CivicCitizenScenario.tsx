"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Users, Star } from "lucide-react";
import { callCost, fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { PS_S2, PS_S2_QA, psS2Costs, type PsS2QAPair } from "@/lib/industries/civicos";
import { useTally } from "@/lib/tally-context";

const INDIGO = "#4F46E5";
const BLUE   = "#1A73E8";
const TEAL   = "#00ACC1";
const AMBER  = "#E37400";
const GREEN  = "#188038";

const CATEGORY_LABELS: Record<PsS2QAPair["category"], string> = {
  routine: "Routine Lookup",
  faq: "Policy FAQ",
  complex: "Complex Case",
};
const CATEGORY_COLORS: Record<PsS2QAPair["category"], string> = {
  routine: "bg-emerald-100 text-emerald-800",
  faq: "bg-blue-100 text-blue-800",
  complex: "bg-amber-100 text-amber-800",
};

type ModelKey = "flashLite" | "flash" | "opus";
const MODEL_COLORS: Record<ModelKey, string> = { flashLite: TEAL, flash: BLUE, opus: AMBER };
const MODEL_LABELS: Record<ModelKey, string> = { flashLite: "Flash-Lite", flash: "Flash", opus: "Opus" };

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={10} style={i <= score ? { fill: color, color } : { fill: "#e5e7eb", color: "#e5e7eb" }} />
        ))}
      </div>
      <span className="text-[10px] text-gray-400 tabular-nums">{score}/5</span>
    </div>
  );
}

function RenderAnswer({ text }: { text: string }) {
  return (
    <div className="text-xs text-gray-700 leading-relaxed space-y-0.5">
      {text.split("\n").map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line === "" ? "h-2" : ""}>
            {parts.map((part, j) =>
              part.startsWith("**") && part.endsWith("**")
                ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                : <span key={j}>{part}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function PsCitizenScenario() {
  const { updateResult } = useTally();
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [volume, setVolume] = useState(PS_S2.defaults.queriesPerMonth);

  const currentQ = useMemo(() => PS_S2_QA.find((q) => q.id === selectedQ) ?? null, [selectedQ]);
  const costs = useMemo(() => psS2Costs(volume), [volume]);

  useEffect(() => {
    updateResult("s2", {
      label: "Citizen Services Chatbot",
      allFrontier: costs.allOpusAnnual,
      tiered: costs.tieredAnnual,
      savings: costs.allOpusAnnual - costs.tieredAnnual,
      period: "annual",
    });
  }, [costs, updateResult]);

  const fmtVol = (v: number) =>
    v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`;

  const perQueryChart = [
    { name: "Flash-Lite", cost: costs.perQueryFlashLite, color: TEAL  },
    { name: "Flash",      cost: costs.perQueryFlash,     color: BLUE  },
    { name: "Opus",       cost: costs.perQueryOpus,      color: AMBER },
    { name: "Tiered",     cost: costs.perQueryTiered,    color: GREEN },
  ];

  const { flashLitePct, flashPct, opusPct } = PS_S2.tieredMix;

  return (
    <section id="ps-citizen" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: INDIGO + "12", color: INDIGO }}>
            <Users size={16} /> Scenario 2 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">Citizen Services Chatbot</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            65% of citizen queries are simple status lookups — route them on Flash-Lite.
            Reserve Opus for SNAP appeals and federal contract disputes where the stakes are highest.
          </p>
        </motion.div>

        <div className="grid min-w-0 lg:grid-cols-2 gap-10">
          {/* LEFT: Q&A panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="min-w-0">
            <div className="bg-gray-900 rounded-t-2xl px-6 py-3 flex items-center gap-2">
              <Users size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-gray-300">Ask your citizen services portal</span>
            </div>
            <div className="bg-gray-50 border-x border-gray-200 px-4 py-3">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Select a question</p>
              <div className="space-y-1.5">
                {PS_S2_QA.map((qa) => (
                  <button key={qa.id} onClick={() => setSelectedQ(qa.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 ${
                      selectedQ === qa.id ? "bg-white shadow-sm border border-gray-200 text-gray-900" : "bg-white/60 hover:bg-white border border-transparent text-gray-600"
                    }`}>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[qa.category]}`}>
                      {CATEGORY_LABELS[qa.category]}
                    </span>
                    <span className="text-xs">{qa.question}</span>
                  </button>
                ))}
              </div>
            </div>

            {currentQ && (
              <div className="border border-t-0 border-gray-200 rounded-b-2xl bg-white p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3">"{currentQ.question}"</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["flashLite", "flash", "opus"] as ModelKey[]).map((mk) => (
                    <div key={mk} className="rounded-xl border-2 p-2.5"
                      style={{ borderColor: MODEL_COLORS[mk] + "40", background: MODEL_COLORS[mk] + "08" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase" style={{ color: MODEL_COLORS[mk] }}>{MODEL_LABELS[mk]}</span>
                        <ScoreBar score={currentQ.scores[mk]} color={MODEL_COLORS[mk]} />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <RenderAnswer text={currentQ.answers[mk]} />
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-400 tabular-nums">
                        {fmtUSD(callCost(mk === "flashLite" ? "flashLite" : mk === "flash" ? "flash" : "opus",
                          PS_S2.query.inTok, PS_S2.query.outTok), 6)}/query
                      </div>
                    </div>
                  ))}
                </div>
                {currentQ.sellerNote && (
                  <div className="mt-3 rounded-xl p-3 text-xs leading-relaxed" style={{ background: INDIGO + "0D", color: "#3730A3" }}>
                    <strong>Seller note:</strong> {currentQ.sellerNote}
                  </div>
                )}
              </div>
            )}
            {!currentQ && (
              <div className="border border-t-0 border-gray-200 rounded-b-2xl bg-white/50 p-8 text-center text-sm text-gray-400">
                Select a question above to compare model responses
              </div>
            )}
          </motion.div>

          {/* RIGHT: cost panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6">
            {/* Volume slider */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-gray-700">Monthly Query Volume</p>
                <span className="text-xl font-bold tabular-nums" style={{ color: INDIGO }}>{fmtVol(volume)}</span>
              </div>
              <input type="range" min={500_000} max={50_000_000} step={500_000} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 cursor-pointer accent-indigo-600 mb-2" />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>500K</span><span>50M</span>
              </div>
            </div>

            {/* Tiered routing mix */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Tiered Routing Mix</p>
              <div className="h-4 rounded-full overflow-hidden flex mb-3">
                <div style={{ width: `${flashLitePct * 100}%`, background: TEAL }} title="Flash-Lite" />
                <div style={{ width: `${flashPct * 100}%`, background: BLUE }} title="Flash" />
                <div style={{ width: `${opusPct * 100}%`, background: AMBER }} title="Opus" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: "Flash-Lite", pct: flashLitePct, desc: "Status checks, refund lookups", color: TEAL },
                  { label: "Flash",      pct: flashPct,     desc: "Policy FAQ, permit info",        color: BLUE },
                  { label: "Opus",       pct: opusPct,      desc: "Appeals, contract disputes",     color: AMBER },
                ].map((r) => (
                  <div key={r.label}>
                    <span className="font-bold" style={{ color: r.color }}>{(r.pct * 100).toFixed(0)}% {r.label}</span>
                    <p className="text-gray-400 mt-0.5 text-[10px]">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Per-query cost chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-3">Per-Query Cost</p>
              <ResponsiveContainer width="100%" height={160} minWidth={0} initialDimension={{ width: 400, height: 160 }}>
                <BarChart data={perQueryChart} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `$${v.toFixed(4)}`} width={52} />
                  <Tooltip formatter={(v: unknown) => [`$${Number(v).toFixed(6)}/query`, ""]} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {perQueryChart.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Annual savings */}
            <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${INDIGO} 0%, #312E81 100%)` }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1">Annual Savings vs All-Opus</p>
              <p className="text-4xl font-extrabold text-white tabular-nums mb-1">
                {fmtUSD(costs.allOpusAnnual - costs.tieredAnnual)}
              </p>
              <p className="text-indigo-300 text-sm">
                {pctSavings(costs.allOpusAnnual, costs.tieredAnnual).toFixed(0)}% reduction on {fmtVol(volume)}/mo ·{" "}
                {fmtUSD(costs.allOpusAnnual)}/yr → {fmtUSD(costs.tieredAnnual)}/yr
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
