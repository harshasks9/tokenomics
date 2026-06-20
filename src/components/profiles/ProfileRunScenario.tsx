"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTally } from "@/lib/tally-context";
import { pctSavings } from "@/lib/pricing";
import { runCosts } from "@/lib/profiles/calculator";
import type { CustomerProfile, ProfileQA } from "@/lib/profiles/types";

const CATEGORY_COLOR = {
  routine:  { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  standard: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"    },
  complex:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200"  },
};

function ScoreBar({ score, max = 5, color }: { score: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-1.5 w-5 rounded-full"
          style={{ backgroundColor: i < score ? color : "#E8EAED" }}
        />
      ))}
    </div>
  );
}

const fmtMoney = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `$${(v / 1_000).toFixed(0)}K`
  : `$${v.toFixed(2)}`;

const fmtQty = (v: number) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M`
  : v >= 1_000   ? `${(v / 1_000).toFixed(0)}K`
  : `${v}`;

export default function ProfileRunScenario({ profile }: { profile: CustomerProfile }) {
  const [volume, setVolume] = useState(profile.run.defaultQueriesPerMonth);
  const [selectedQA, setSelectedQA] = useState<ProfileQA>(profile.run.qa[0]);
  const { updateResult } = useTally();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const costs = runCosts(profile, volume);
  const savings = costs.allOpusAnnual - costs.tieredAnnual;

  useEffect(() => {
    updateResult("s2", {
      label: "Run",
      allFrontier: costs.allOpusAnnual,
      tiered: costs.tieredAnnual,
      savings,
      period: "annual",
    });
  }, [costs.allOpusAnnual, costs.tieredAnnual, savings]);

  return (
    <section id="run" ref={ref} className="bg-[#F8F9FA] border-b border-[#E8EAED]">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-[#202124] mb-2">{profile.run.title}</h2>
          <p className="text-[#5F6368] text-lg max-w-2xl mb-10">{profile.run.description}</p>

          {/* Volume slider */}
          <div className="mb-10">
            <label className="block text-sm font-semibold text-[#202124] mb-3">
              {profile.run.queriesLabel}: <span className="font-extrabold">{fmtQty(volume)}</span>
            </label>
            <input
              type="range"
              min={profile.run.queriesStepSize}
              max={profile.run.maxQueriesPerMonth}
              step={profile.run.queriesStepSize}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full max-w-lg"
              style={{ accentColor: profile.color }}
            />
            <div className="flex justify-between text-[10px] text-[#9AA0A6] mt-1 max-w-lg">
              <span>{fmtQty(profile.run.queriesStepSize)}</span>
              <span>{fmtQty(profile.run.maxQueriesPerMonth)}</span>
            </div>
          </div>

          {/* Per-query cost breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {[
              { label: "All-Opus/query",       value: costs.perQueryOpus,      color: "#E37400" },
              { label: "Flash-Lite/query",      value: costs.perQueryFlashLite, color: "#059669" },
              { label: "Flash/query",           value: costs.perQueryFlash,     color: "#0284C7" },
              { label: "Tiered blend/query",    value: costs.perQueryTiered,    color: profile.color },
            ].map((c) => (
              <div key={c.label} className="card text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9AA0A6] mb-1">{c.label}</p>
                <p className="text-xl font-extrabold" style={{ color: c.color }}>
                  ${costs.perQueryOpus < 0.01 ? (c.value * 1000).toFixed(3) + "m" : c.value.toFixed(4)}
                </p>
              </div>
            ))}
          </div>

          {/* Annual cost savings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[
              { label: "All-Opus Annual", value: costs.allOpusAnnual, color: "#E37400" },
              { label: "Tiered Annual",   value: costs.tieredAnnual,  color: "#188038" },
              { label: "Annual Savings",  value: savings,             color: profile.color },
            ].map((c) => (
              <div key={c.label} className="card">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5F6368] mb-2">{c.label}</p>
                <p className="text-3xl font-extrabold" style={{ color: c.color }}>{fmtMoney(c.value)}</p>
                {c.label === "Annual Savings" && costs.allOpusAnnual > 0 && (
                  <p className="text-xs text-[#9AA0A6] mt-1">{pctSavings(costs.allOpusAnnual, costs.tieredAnnual).toFixed(0)}% reduction</p>
                )}
              </div>
            ))}
          </div>

          {/* Q&A comparison */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Q&A selector */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#202124] mb-3">Sample Queries</h3>
              {profile.run.qa.map((qa) => {
                const cat = CATEGORY_COLOR[qa.category];
                const isSelected = selectedQA.id === qa.id;
                return (
                  <button
                    key={qa.id}
                    onClick={() => setSelectedQA(qa)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected ? "border-[#E8EAED] bg-white shadow-sm" : "border-transparent hover:border-[#E8EAED] hover:bg-white/60"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${cat.bg} ${cat.text} ${cat.border}`}>
                        {qa.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F6368] leading-snug line-clamp-2">{qa.question}</p>
                  </button>
                );
              })}
            </div>

            {/* Response comparison */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-[#202124] mb-3">Response Quality Comparison</h3>
              <p className="text-xs text-[#5F6368] italic mb-4">&ldquo;{selectedQA.question}&rdquo;</p>

              <AnimatePresence mode="wait">
                {[
                  { key: "flashLite", label: "Flash-Lite", color: "#059669", answer: selectedQA.answers.flashLite, score: selectedQA.scores.flashLite },
                  { key: "flash",     label: "Flash",      color: "#0284C7", answer: selectedQA.answers.flash,     score: selectedQA.scores.flash     },
                  { key: "opus",      label: "Opus",       color: "#7C3AED", answer: selectedQA.answers.opus,      score: selectedQA.scores.opus      },
                ].map((m) => (
                  <motion.div
                    key={`${selectedQA.id}-${m.key}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold" style={{ color: m.color }}>{m.label}</span>
                      <ScoreBar score={m.score} color={m.color} />
                    </div>
                    <p className="text-xs text-[#5F6368] leading-relaxed">{m.answer}</p>
                  </motion.div>
                ))}
              </AnimatePresence>

              {selectedQA.sellerNote && (
                <div className="rounded-xl p-3 border border-amber-200 bg-amber-50">
                  <p className="text-[11px] font-semibold text-amber-800 mb-1">Seller Insight</p>
                  <p className="text-xs text-amber-700 leading-relaxed">{selectedQA.sellerNote}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
