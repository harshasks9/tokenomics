"use client";

import { motion } from "framer-motion";
import { Brain, Zap, Eye, Bot, ArrowRight, Layers } from "lucide-react";

const phases = [
  { icon: Brain, label: "Build", sub: "AI-Assisted Dev", color: "#1A73E8" },
  { icon: Zap, label: "Run", sub: "In-App Intelligence", color: "#188038" },
  { icon: Eye, label: "Run", sub: "Multimodal & Latency", color: "#00ACC1" },
  { icon: Bot, label: "Extend", sub: "Agentic Orchestration", color: "#7B61FF" },
];

const MODELS = [
  { name: "Claude Opus 4.8",       role: "Architecture, judgment, final review", price: "$5 / $25 per 1M", color: "#A78BFA", badge: "Keep for the hard work", highlight: true },
  { name: "Gemini 3.5 Flash",      role: "Fast execution and multimodal work", price: "$1.50 / $9 per 1M", color: "#1A73E8", badge: "Replace Sonnet here" },
  { name: "Gemini 3.1 Flash-Lite", role: "High-volume lookups and transforms", price: "$0.25 / $1.50 per 1M", color: "#00ACC1", badge: "Cheapest bounded work" },
  { name: "Claude Sonnet 4.6",     role: "The conventional mid-tier pairing", price: "$3 / $15 per 1M", color: "#94A3B8", badge: "Comparison baseline", baseline: true },
];

export default function Hero() {
  return (
    <section id="overview" className="relative overflow-hidden bg-[#202124] text-white min-h-[90vh] flex items-center">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="section-container relative z-10 w-full">
        <div className="max-w-4xl">
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <Layers className="w-5 h-5 text-[#4285F4]" />
            <span className="text-sm font-semibold tracking-widest uppercase text-[#8AB4F8]">
              WealthAI — Practical Model Routing
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
          >
            Keep Opus.{" "}
            <span className="bg-gradient-to-r from-[#34A853] via-[#1A73E8] to-[#00ACC1] bg-clip-text text-transparent">
              Route the rest.
            </span>
            <br />
            Across the whole lifecycle.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg lg:text-xl text-gray-400 max-w-2xl mb-4 leading-relaxed"
          >
            Opus is the strongest choice for the work that genuinely needs deep judgment.
            The mistake is paying for that level on every task. Pair Opus with Gemini Flash
            and Flash-Lite for routine execution, and the stack is cheaper and faster than
            pairing Opus with Sonnet.
          </motion.p>
        </div>

        {/* Architecture flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center gap-3 lg:gap-4"
        >
          {phases.map((phase, i) => (
            <div key={i} className="flex items-center gap-3 lg:gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.15, type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: phase.color + "20" }}>
                  <phase.icon className="w-5 h-5" style={{ color: phase.color }} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">{phase.label}</div>
                  <div className="text-sm font-semibold text-white">{phase.sub}</div>
                </div>
              </motion.div>
              {i < phases.length - 1 && <ArrowRight className="w-4 h-4 text-gray-600 hidden lg:block" />}
            </div>
          ))}
        </motion.div>

        {/* Model role cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl"
        >
          {MODELS.map((m, i) => (
            <div
              key={i}
              className={`relative rounded-xl p-5 transition-colors ${
                !m.baseline
                  ? "bg-white/5 border border-white/10 hover:bg-white/8"
                  : "bg-white/[0.02] border border-white/5 opacity-60"
              }`}
            >
              {m.highlight && (
                <div className="absolute -top-2 left-4 rounded-full bg-[#34A853] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Recommended anchor
                </div>
              )}
              {m.baseline && (
                <div className="absolute -top-2 left-4 rounded-full bg-slate-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                  Baseline
                </div>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: m.color }}>
                  {m.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 leading-tight">{m.name}</h3>
              <p className="text-xs text-gray-400 mb-3 leading-snug">{m.role}</p>
              <p className="text-[10px] text-gray-500 font-mono">{m.price}</p>
            </div>
          ))}
        </motion.div>

        {/* AA citation footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-4 text-[10px] text-gray-600 max-w-5xl"
        >
          Gemini 3.1 Pro scores 92 on the Artificial Analysis (AA) Intelligence Index vs Claude Opus 4.8 at 89.
          AA Intelligence Index scores as of Q2 2026. See <span className="underline underline-offset-2">artificialanalysis.ai</span> for current rankings.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 bg-gray-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
