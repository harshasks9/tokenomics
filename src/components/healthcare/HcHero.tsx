"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight, ShieldCheck } from "lucide-react";

const phases = [
  { label: "Build",  sub: "SDLC Coding",        color: "#1A73E8" },
  { label: "Run",    sub: "Clinical Assistant",  color: "#E11D48" },
  { label: "Run",    sub: "Document Analysis",   color: "#00ACC1" },
  { label: "Extend", sub: "Care Agent",          color: "#7B61FF" },
];

export default function HcHero() {
  return (
    <section id="overview" className="relative overflow-hidden bg-[#0a1520] text-white min-h-[85vh] flex items-center">
      {/* Grid background — rose-tinted */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(225,29,72,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(225,29,72,.4) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="section-container relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-400" />
            <span className="text-sm font-semibold tracking-widest uppercase text-rose-400/80">Healthcare Tokenomics</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-5">
            Right model.{" "}
            <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Right task.
            </span>
            <br />
            For clinical-grade AI.
          </motion.h1>

          {/* Healthcare banner */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-6 rounded-full border border-rose-500/30 bg-rose-900/30 px-4 py-1.5">
            <ShieldCheck size={13} className="text-rose-400" />
            <span className="text-sm text-rose-300 font-medium">
              Healthcare runs on trust — clinical safety, HIPAA compliance, patient outcomes. Tiering delivers quality where it matters most.
            </span>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            className="text-lg lg:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            A tiered architecture with Claude Opus for reasoning and Gemini Flash for volume delivers
            clinical-grade AI at a fraction of the cost — from clinical documentation and prior-auth automation
            to drug-interaction checking and care-navigation agents.
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

        {/* Model cards */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {[
            { name: "Claude Opus 4.8", role: "Frontier reasoning", price: "$5 / $25 per 1M tokens", color: "#7B61FF", badge: "Complex tasks" },
            { name: "Gemini 3.5 Flash", role: "Fast, native multimodal", price: "$1.50 / $9 per 1M tokens", color: "#1A73E8", badge: "Standard tasks" },
            { name: "Gemini 3.1 Flash-Lite", role: "High-volume routing", price: "$0.25 / $1.50 per 1M tokens", color: "#00ACC1", badge: "Simple lookups" },
          ].map((m, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: m.color }}>{m.badge}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">{m.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{m.role}</p>
              <p className="text-xs text-gray-500 font-mono">{m.price}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
