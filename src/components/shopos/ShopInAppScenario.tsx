"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { ShoppingBag, Star, ChevronRight } from "lucide-react";
import { callCost, fmtUSD, pctSavings, MODELS } from "@/lib/pricing";
import { SHOP_S2, SHOP_S2_QA, shopS2Costs, type ShopS2Baseline, type ShopS2QAPair } from "@/lib/industries/shopos";
import { useTally } from "@/lib/tally-context";

const GREEN  = "#188038";
const AMBER  = "#E37400";
const BLUE   = "#1A73E8";
const PURPLE = "#9B59D1";
const TEAL   = "#00ACC1";
const GEM_GREEN = "#34A853";

const CATEGORY_LABELS: Record<ShopS2QAPair["category"], string> = {
  routine: "Routine Lookup",
  faq: "FAQ",
  complex: "Complex",
};
const CATEGORY_COLORS: Record<ShopS2QAPair["category"], string> = {
  routine: "bg-emerald-100 text-emerald-800",
  faq: "bg-blue-100 text-blue-800",
  complex: "bg-amber-100 text-amber-800",
};

type ModelKey4 = "flashLite" | "flash" | "sonnet" | "opus";
const MODEL_COLORS: Record<ModelKey4, string> = {
  flashLite: TEAL,
  flash: BLUE,
  sonnet: PURPLE,
  opus: AMBER,
};
const MODEL_LABELS: Record<ModelKey4, string> = {
  flashLite: "Flash-Lite",
  flash: "Flash",
  sonnet: "Sonnet",
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

export default function ShopInAppScenario() {
  const { updateResult } = useTally();
  const [selectedQ, setSelectedQ] = useState<string | null>(null);
  const [volume, setVolume] = useState(SHOP_S2.defaults.queriesPerMonth);
  const [baseline, setBaseline] = useState<ShopS2Baseline>("opus");

  const currentQ = useMemo(() => SHOP_S2_QA.find((q) => q.id === selectedQ) ?? null, [selectedQ]);

  const costs = useMemo(() => shopS2Costs(volume), [volume]);

  const baselineCost = baseline === "opus" ? costs.allOpus : baseline === "sonnet" ? costs.allSonnet : costs.allGeminiPro;
  const savingsPct   = pctSavings(baselineCost, costs.tiered);
  const savingsAnnual = (baselineCost - costs.tiered) * 12;

  useEffect(() => {
    updateResult("s2", {
      label: "In-App Shopping Assistant",
      allFrontier: costs.allOpus * 12,
      tiered: costs.tiered * 12,
      savings: (costs.allOpus - costs.tiered) * 12,
      period: "annual",
    });
  }, [costs, updateResult]);

  const fmtVolume = (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : `${(v / 1_000).toFixed(0)}K`;

  const chartData = [
    { name: "Flash-Lite", cost: costs.allFlashLite, color: TEAL     },
    { name: "Flash",      cost: costs.allFlash,     color: BLUE     },
    { name: "Gemini Pro", cost: costs.allGeminiPro, color: GEM_GREEN},
    { name: "Sonnet",     cost: costs.allSonnet,    color: PURPLE   },
    { name: "Opus",       cost: costs.allOpus,      color: AMBER    },
    { name: "Tiered",     cost: costs.tiered,       color: GREEN    },
  ].map((d) => ({
    ...d,
    highlighted: d.name === "Tiered",
    isBaseline: (baseline === "opus" && d.name === "Opus") || (baseline === "sonnet" && d.name === "Sonnet") || (baseline === "geminiPro" && d.name === "Gemini Pro"),
  }));

  return (
    <section id="shop-inapp" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="relative max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <ShoppingBag size={16} /> Scenario 2 — Run Phase
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">In-App Shopping Assistant</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            The full model ladder — Flash-Lite to Opus — on real retail queries. Routine and FAQ categories reach parity
            from Flash-Lite up; complex queries (gifting, styling) are the basket-size moments.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* LEFT: Q&A panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
            {/* Question list */}
            <div className="bg-gray-900 rounded-t-2xl px-6 py-3 flex items-center gap-2">
              <ShoppingBag size={16} className="text-emerald-400" />
              <span className="text-sm font-medium text-gray-300">Ask your shopping assistant</span>
            </div>
            <div className="bg-gray-50 border-x border-gray-200 px-4 py-3">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Select a question</p>
              <div className="space-y-1.5">
                {SHOP_S2_QA.map((qa) => (
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
                      <div className="bg-emerald-600 text-white px-3 py-2 rounded-2xl rounded-br-md max-w-[80%] text-sm">
                        {currentQ.question}
                      </div>
                    </div>

                    {/* 2×2 model grid */}
                    <div className="grid grid-cols-2 gap-2.5">
                      {(["flashLite", "flash", "sonnet", "opus"] as ModelKey4[]).map((mk) => (
                        <ModelCard key={mk} label={MODEL_LABELS[mk]} color={MODEL_COLORS[mk]}
                          answer={currentQ.answers[mk]} score={currentQ.scores[mk]}
                          selected={false} onClick={() => {}} />
                      ))}
                    </div>

                    {/* Complex insight */}
                    {currentQ.category === "complex" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.1 }}
                        className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                        <p className="text-xs font-semibold text-emerald-800 mb-1">Gemini Pro earns its cost here (AA Score 92)</p>
                        <p className="text-xs text-emerald-700">
                          {currentQ.sellerNote ?? "Complex queries grow basket size. Routing the complex 12% to Gemini Pro (AA #1) is a margin investment at 60% lower cost than Claude Opus."}
                        </p>
                      </motion.div>
                    )}
                    {currentQ.category !== "complex" && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ delay: 0.1 }}
                        className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3">
                        <p className="text-xs font-semibold text-emerald-800 mb-1">Near-parity from Flash-Lite upward</p>
                        <p className="text-xs text-emerald-700">
                          Routine and FAQ queries show equivalent quality across all tiers. These make up ~85% of traffic — route them to the cheapest model that answers correctly.
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <div className="p-10 text-center">
                    <ShoppingBag size={36} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-sm text-gray-400">Select a question above to see the model ladder</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* RIGHT: Cost analysis */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6">
            {/* Volume slider */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Monthly Query Volume</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Adjust for your retailer's traffic</p>
                </div>
                <span className="text-2xl font-bold text-gray-900 tabular-nums">{fmtVolume(volume)}<span className="text-sm text-gray-400 ml-1 font-normal">queries/mo</span></span>
              </div>
              <input type="range" min={1_000_000} max={50_000_000} step={1_000_000} value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${GREEN} 0%, ${GREEN} ${((volume - 1_000_000) / 49_000_000) * 100}%, #e5e7eb ${((volume - 1_000_000) / 49_000_000) * 100}%, #e5e7eb 100%)` }} />
              <div className="flex justify-between mt-1 text-[10px] text-gray-400"><span>1M</span><span>50M</span></div>
            </div>

            {/* Baseline selector */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Compare tiered routing vs.</p>
              <div className="flex gap-2 flex-wrap">
                {([
                  { key: "opus"      as const, label: "All-Opus",        color: AMBER    },
                  { key: "sonnet"    as const, label: "All-Sonnet",      color: PURPLE   },
                  { key: "geminiPro" as const, label: "All-Gemini 3.1 Pro", color: GEM_GREEN },
                ] as const).map((b) => (
                  <button key={b.key} onClick={() => setBaseline(b.key)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all"
                    style={{
                      backgroundColor: baseline === b.key ? b.color + "15" : "transparent",
                      borderColor: baseline === b.key ? b.color : "#e2e8f0",
                      color: baseline === b.key ? b.color : "#64748b",
                    }}>{b.label}</button>
                ))}
              </div>
            </div>

            {/* Full-ladder chart */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-medium text-gray-700 mb-1 font-semibold">Monthly Cost — Full Ladder</p>
              <p className="text-[10px] text-gray-400 mb-4">Tiered (green) vs each single-model option · selected baseline in amber</p>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => fmtUSD(v)} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={56} />
                    <Tooltip formatter={(v: unknown) => [fmtUSD(Number(v)) + "/mo", ""]} contentStyle={{ borderRadius: 8, fontSize: 11, border: "1px solid #e5e7eb" }} />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]} maxBarSize={48}>
                      {chartData.map((d, i) => (
                        <Cell key={i}
                          fill={d.highlighted ? GREEN : d.isBaseline ? AMBER : d.color}
                          opacity={d.highlighted || d.isBaseline ? 1 : 0.55} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: GREEN }} /> Tiered (selected)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: AMBER }} /> Baseline</span>
              </div>
            </div>

            {/* Savings callout */}
            <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #14662d 100%)` }}>
              <p className="text-xs font-medium text-emerald-200 uppercase tracking-wider mb-2">Annual Savings vs {baseline === "opus" ? "All-Opus" : baseline === "sonnet" ? "All-Sonnet" : "Gemini 3.1 Pro"}</p>
              <p className="text-4xl font-bold text-white tabular-nums mb-1">{fmtUSD(savingsAnnual)}<span className="text-xl text-emerald-200">/yr</span></p>
              <div className="flex items-center gap-3 mt-3">
                <span className="inline-flex px-3 py-1 rounded-full bg-white/15 text-white text-sm font-semibold tabular-nums">{savingsPct.toFixed(0)}% reduction</span>
                <span className="text-sm text-emerald-200/80">{fmtVolume(volume)} queries/mo</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/15 text-xs text-emerald-100/80">
                Tiered: <strong className="text-white">{fmtUSD(costs.tiered)}/mo</strong> · {baseline === "opus" ? "All-Opus" : baseline === "sonnet" ? "All-Sonnet" : "Gemini Pro"}: <strong className="text-white">{fmtUSD(baselineCost)}/mo</strong>
              </div>
            </div>

            {/* Routing breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-xs text-gray-600">
              <p className="font-semibold text-gray-700 mb-2">Gemini-only tiered routing mix</p>
              <div className="flex gap-1 h-2.5 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${SHOP_S2.tieredMix.flashLitePct * 100}%`, backgroundColor: TEAL }} title="Flash-Lite" />
                <div style={{ width: `${SHOP_S2.tieredMix.flashPct * 100}%`, backgroundColor: BLUE }} title="Flash" />
                <div style={{ width: `${SHOP_S2.tieredMix.geminiProPct * 100}%`, backgroundColor: GEM_GREEN }} title="Gemini Pro" />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400">
                <span>Flash-Lite {SHOP_S2.tieredMix.flashLitePct * 100}% — FAQ/order-status</span>
                <span>Flash {SHOP_S2.tieredMix.flashPct * 100}% — catalog lookups</span>
                <span>Gemini Pro {SHOP_S2.tieredMix.geminiProPct * 100}% — gifting/styling (AA Score 92)</span>
              </div>
              <p className="mt-3 text-[11px] italic text-gray-500">
                "60/28/12 Gemini-only tiered split — no competitor models. Gemini Pro (AA Score 92) handles the 12% that grows the basket."
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
