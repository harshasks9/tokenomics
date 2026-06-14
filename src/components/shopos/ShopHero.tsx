"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight, Tag } from "lucide-react";

const phases = [
  { label: "Build", sub: "SDLC Coding", color: "#1A73E8" },
  { label: "Run",   sub: "Shopping Assistant", color: "#188038" },
  { label: "Run",   sub: "Visual Search", color: "#00ACC1" },
  { label: "Extend",sub: "Merch Agent", color: "#7B61FF" },
];

const MODELS = [
  { name: "Claude Opus 4.8",       role: "Pricing, fraud, architecture", price: "$5 / $25", color: "#A78BFA", badge: "Complex (15%)", highlight: true },
  { name: "Gemini 3.5 Flash",      role: "Features and multimodal", price: "$1.50 / $9", color: "#1A73E8", badge: "Mid (30%)" },
  { name: "Gemini 3.1 Flash-Lite", role: "Lookups and scaffolding", price: "$0.25 / $1.50", color: "#00ACC1", badge: "Routine (55%)" },
  { name: "Claude Sonnet 4.6",     role: "Conventional executor tier", price: "$3 / $15", color: "#94A3B8", badge: "Baseline", baseline: true },
];

export default function ShopHero() {
  return (
    <section id="overview" className="relative overflow-hidden bg-[#0d1a0f] text-white min-h-[85vh] flex items-center">
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(24,128,56,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(24,128,56,.4) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="section-container relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-semibold tracking-widest uppercase text-emerald-400/80">ShopOS — Practical Model Routing</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5">
            Opus where it matters.{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Flash everywhere else.
            </span>
            <br />
            Built for retail scale.
          </motion.h1>

          {/* Retail banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4 rounded-full border border-emerald-500/30 bg-emerald-900/30 px-4 py-1.5">
            <Tag size={13} className="text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">
              Retail runs at scale. Small routing decisions compound across millions of sessions and SKUs.
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg lg:text-xl text-gray-400 max-w-2xl mb-4 leading-relaxed">
            Keep Opus on pricing, fraud, nuanced recommendations, and final review.
            Route bounded execution to Flash or Flash-Lite. The result preserves the best model
            on the hard 15% while outperforming an Opus + Sonnet stack on cost and latency.
          </motion.p>
        </div>

        {/* Phases */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 lg:gap-4 mb-16">
          {phases.map((p, i) => (
            <div key={i} className="flex items-center gap-3 lg:gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4"
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{p.label}</div>
                  <div className="text-sm font-semibold text-white">{p.sub}</div>
                </div>
              </motion.div>
              {i < phases.length - 1 && <ArrowRight className="w-4 h-4 text-gray-600 hidden lg:block" />}
            </div>
          ))}
        </motion.div>

        {/* Model role cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl">
          {MODELS.map((m, i) => (
            <div key={i} className={`relative rounded-xl p-4 transition-all ${
              !m.baseline
                ? "bg-white/5 border border-white/10"
                : "bg-white/[0.02] border border-white/5 opacity-50"
            }`}>
              {m.highlight && (
                <div className="absolute -top-2 left-3 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Keep for judgment
                </div>
              )}
              {m.baseline && (
                <div className="absolute -top-2 left-3 rounded-full bg-slate-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Baseline
                </div>
              )}
              <div className="w-2 h-2 rounded-full mb-2" style={{ backgroundColor: m.color }} />
              <h3 className="text-xs font-bold text-white mb-1 leading-tight">{m.name}</h3>
              <p className="text-[10px] text-gray-400 mb-2 leading-snug">{m.role}</p>
              <p className="text-[10px] text-gray-500 font-mono">{m.price} /1M</p>
              <div className="mt-1.5 rounded-full border px-1.5 py-0.5 inline-block text-[8px] font-semibold uppercase tracking-wide"
                style={{
                  borderColor: !m.baseline ? m.color + "40" : "#475569",
                  color: !m.baseline ? m.color : "#64748B"
                }}>
                {m.badge}
              </div>
            </div>
          ))}
        </motion.div>

        {/* AA citation footnote */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-6 text-[10px] text-gray-600 max-w-5xl">
          Gemini 3.1 Pro scores 92 on the Artificial Analysis (AA) Intelligence Index vs Claude Opus 4.8 at 89.
          AA Intelligence Index scores as of Q2 2026. See <span className="underline underline-offset-2">artificialanalysis.ai</span> for current rankings.
        </motion.p>
      </div>
    </section>
  );
}
