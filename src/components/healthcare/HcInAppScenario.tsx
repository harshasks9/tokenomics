"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { HeartPulse, Star, ChevronRight } from "lucide-react";
import { fmtUSD, pctSavings } from "@/lib/pricing";
import { HC_S2, HC_S2_QA, hcS2Costs, type HcS2QAPair } from "@/lib/industries/healthcare";
import { useTally } from "@/lib/tally-context";

const GREEN  = "#188038";
const AMBER  = "#E37400";
const BLUE   = "#1A73E8";
const TEAL   = "#00ACC1";

const CATEGORY_LABELS: Record<HcS2QAPair["category"], string> = {
  routine: "Routine",
  faq: "FAQ",
  complex: "Complex",
};
const CATEGORY_COLORS: Record<HcS2QAPair["category"], string> = {
  routine: "bg-rose-100 text-rose-800",
  faq: "bg-blue-100 text-blue-800",
  complex: "bg-amber-100 text-amber-800",
};

type HcModelKey = "flashLite" | "flash" | "opus";
const MODEL_COLORS: Record<HcModelKey, string> = {
  flashLite: TEAL,
  flash: BLUE,
  opus: AMBER,
};
const MODEL_LABELS: Record<HcModelKey, string> = {
  flashLite: "Flash-Lite",
  flash: "Flash",
  opus: "Opus",
};

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} size={10} className={i <= score ? "" : "text-gray-200"}
            style={i <= score ? { fill: color, color } : { fill: "#e5e7eb" }} />
        ))}
      </div>
      <span className="text-[10px] text-gray-400 tabular-nums">{score}/5</span>
    </div>
  );
}

function RenderAnswer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="text-xs text-gray-700 leading-relaxed space-y-0.5">
      {lines.map((line, i) => {
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

function ModelCard({ label, color, answer, score, selected, onClick }: {
  label: string; color: string; answer: string; score: number; selected: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`text-left rounded-xl border-2 p-3 transition-all w-full ${selected ? "" : "border-gray-200 hover:border-gray-300"}`}
      style={selected ? { borderColor: color, boxShadow: `0 0 0 2px ${color}20` } : {}}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color }}>{label}</span>
        <div className="ml-auto"><ScoreBar score={score} color={color} /></div>
      </div>
      <div className="max-h-24 overflow-y-auto">
        <RenderAnswer text={answer} />
      </div>
    </button>
  );
}

export default function HcInAppScenario() {
  const { updateResult } = useTally();
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [volume, setVolume] = useState(HC_S2.defaults.queriesPerMonth);

  const currentQ = useMemo(() => HC_S2_QA.find((q) => q.id === selectedQ) ?? null, [selectedQ]);

  const costs = useMemo(() => hcS2Costs(volume), [volume]);

  const baselineCost = costs.allOpus;
  const savingsPct   = pctSavings(baselineCost, costs.tiered);
  const savingsAnnual = (baselineCost - costs.tiered) * 12;

  useEffect(() => {
    updateResult("s2", {
      label: "In-App Clinical Assistant",
      allFrontier: costs.allOpus * 12,
      tiered: costs.tiered * 12,
      savings: (costs.allOpus - costs.tiered) * 12,
      period: "annual",
    });
  }, [costs, updateResult]);

  const fmtVolume = (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`;

  const chartData = [
    { name: "All-Frontier", cost: costs.allOpus, color: AMBER },
    { name: "Tiered Routing", cost: costs.tiered, color: GREEN },
  ];

  return (
    <section id="hc-inapp" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-sm font-medium mb-6">
            <HeartPulse size={16} /> Scenario 2 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">In-App Clinical Assistant</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Clinical accuracy matters on the hard questions. But appointment checks don&apos;t need a PhD.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT: Q&A panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="min-w-0">
            {/* Question list */}
            <div className="bg-gray-900 rounded-t-2xl px-6 py-3 flex items-center gap-2">
              <HeartPulse size={16} className="text-rose-400" />
              <span className="text-sm font-medium text-gray-300">Ask your care assistant</span>
            </div>
            <div className="bg-gray-50 border-x border-gray-200 px-4 py-3">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Select a question</p>
              <div className="space-y-1.5">
                {HC_S2_QA.map((qa) => (
                  <button key={qa.id} onClick={() => setSelectedQ(qa.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2.5 group ${
                      selectedQ === qa.id ? "bg-white shadow-sm border border-gray-200 text-gray-900" : "bg-white/60 hover:bg-white border border-transparent text-gray-600"
                    }`}>
                    <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[qa.category]}`}>
                      {CATEGORY_LABELS[qa.category]}
                    </span>
                    <span className="flex-1 truncate">{qa.question}</span>
                    <ChevronRight size={13} className="text-gray-300 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Answers */}
            <div className="border-x border-b border-gray-200 rounded-b-2xl bg-white overflow-hidden">
              <AnimatePresence mode="wait">
                {currentQ ? (
                  <motion.div key={currentQ.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }} className="p-4">
                    {/* User bubble */}
                    <div className="flex justify-end mb-4">
                      <div className="bg-rose-600 text-white px-3 py-2 rounded-2xl rounded-br-md max-w-[80%] text-sm">
                        {currentQ.question}
                      </div>
                    </div>

                    {/* Model comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {(["flashLite", "flash", "opus"] as HcModelKey[]).map((mk) => (
                        <ModelCard key={mk} label={MODEL_LABELS[mk]} color={MODEL_COLORS[mk]}
                          answer={currentQ.answers[mk]} score={currentQ.scores[mk]}
                          selected={false} onClick={() => {}} />
                      ))}
                    </div>

                    {/* Complex insight */}
                    {currentQ.category === "complex" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.1 }}
                        className="mt-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                        <p className="text-xs font-semibold text-amber-800 mb-1">Opus earns its cost here</p>
                        <p className="text-xs text-amber-700">
                          {currentQ.sellerNote ?? "Drug interactions and care navigation are patient-safety moments. Routing the hardest 20% to Opus is clinical risk management, not overhead."}
                        </p>
                      </motion.div>
                    )}
                    {currentQ.category !== "complex" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.1 }}
                        className="mt-3 rounded-xl border border-rose-200 bg-rose-50/70 px-4 py-3">
                        <p className="text-xs font-semibold text-rose-800 mb-1">Near-parity from Flash-Lite upward</p>
                        <p className="text-xs text-rose-700">
                          Routine and FAQ queries show equivalent quality across the three tiers. These make up 80% of traffic — route them to the cheapest model that answers correctly.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="p-10 text-center">
                    <HeartPulse size={36} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400">Select a question above to see the model ladder</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT: Cost analysis */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="min-w-0 space-y-6">
            {/* Volume slider */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Monthly Query Volume</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Adjust for your health system&apos;s traffic</p>
                </div>
                <span className="text-2xl font-bold text-gray-900 tabular-nums">{fmtVolume(volume)}<span className="text-sm text-gray-400 ml-1 font-normal">queries/mo</span></span>
              </div>
              <input type="range" min={1_000_000} max={20_000_000} step={1_000_000} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${GREEN} 0%, ${GREEN} ${((volume - 1_000_000) / 19_000_000) * 100}%, #e5e7eb ${((volume - 1_000_000) / 19_000_000) * 100}%, #e5e7eb 100%)` }} />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400"><span>1M</span><span>20M</span></div>
            </div>

            {/* Cost comparison */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-700 mb-1 font-semibold">Monthly Cost Comparison</p>
              <p className="text-[10px] text-gray-400 mb-4">All-Frontier versus tiered routing at the selected query volume</p>
              <div className="h-56 min-w-0 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} initialDimension={{ width: 600, height: 224 }}>
                  <BarChart data={chartData} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => fmtUSD(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={56} />
                    <Tooltip formatter={(v: unknown) => [fmtUSD(Number(v)) + "/mo", ""]} contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      {chartData.map((d, i) => (
                        <Cell key={i}
                          fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: GREEN }} /> Tiered</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: AMBER }} /> All-Frontier</span>
              </div>
            </div>

            {/* Savings callout */}
            <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #14662d 100%)` }}>
              <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider mb-2">Annual Savings vs All-Frontier</p>
              <p className="text-4xl font-bold text-white tabular-nums mb-1">{fmtUSD(savingsAnnual)}<span className="text-xl text-emerald-200">/yr</span></p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex px-3 py-1 rounded-full bg-white/15 text-white text-sm font-semibold tabular-nums">{savingsPct.toFixed(0)}% reduction</span>
                <span className="text-sm text-emerald-200/80">{fmtVolume(volume)} queries/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/15 text-xs text-emerald-100/80">
                Tiered: <strong className="text-white">{fmtUSD(costs.tiered)}/mo</strong> · All-Frontier: <strong className="text-white">{fmtUSD(baselineCost)}/mo</strong>
              </div>
            </div>

            {/* Routing breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-700 mb-2">Tiered routing mix</p>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${HC_S2.tieredMix.flashLitePct * 100}%`, backgroundColor: TEAL }} title="Flash-Lite" />
                <div style={{ width: `${HC_S2.tieredMix.flashPct * 100}%`, backgroundColor: BLUE }} title="Flash" />
                <div style={{ width: `${HC_S2.tieredMix.opusPct * 100}%`, backgroundColor: AMBER }} title="Opus" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400">
                <span>Flash-Lite {HC_S2.tieredMix.flashLitePct * 100}% — appointments/refills</span>
                <span>Flash {HC_S2.tieredMix.flashPct * 100}% — copays/prior-auth</span>
                <span>Opus {HC_S2.tieredMix.opusPct * 100}% — drug interactions/care navigation</span>
              </div>
              <p className="mt-3 text-[11px] italic text-gray-500">
                &ldquo;Patients cannot tell the difference on appointment checks and refill requests — pay frontier rates only when clinical accuracy is a patient safety issue.&rdquo;
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
