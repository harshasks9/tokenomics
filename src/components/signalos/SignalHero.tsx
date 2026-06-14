"use client";

import { motion } from "framer-motion";
import { Wifi } from "lucide-react";

const SKY = "#0284C7";

const phases = [
  { label: "Build",  sub: "Network Automation SDLC" },
  { label: "Run",    sub: "Customer Support AI" },
  { label: "Run",    sub: "Contract Analysis" },
  { label: "Extend", sub: "NetOps Agent" },
];

const modelCards = [
  { name: "Claude Opus 4.8",       role: "Orchestrator — SLA disputes, architecture, churn", vendor: "Anthropic", aaScore: 89, color: SKY },
  { name: "Gemini 3.5 Flash",      role: "Executor — provisioning, billing adapters, NOC",   vendor: "Google",    aaScore: 81, color: "#1A73E8" },
  { name: "Gemini 3.1 Flash-Lite", role: "Routine — status lookups, CRUD, tests, docs",      vendor: "Google",    aaScore: 68, color: "#188038" },
];

export default function SignalHero() {
  return (
    <section
      id="sig-overview"
      className="relative min-h-[520px] flex flex-col justify-center overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0c1528 0%, #091e35 40%, #0c1528 70%, #071325 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")` }}
      />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[140px] opacity-10"
        style={{ background: `radial-gradient(circle, ${SKY} 0%, transparent 70%)` }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-20">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="mb-6 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: SKY + "20", color: SKY, border: `1px solid ${SKY}40` }}>
            <Wifi size={12} /> SignalOS
          </span>
          <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-[10px] font-medium text-white/40 uppercase tracking-wider">
            Telecom Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4"
        >
          52% build savings.
          <br />
          <span style={{ color: SKY }}>Network-safe at every layer.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-white/50 max-w-2xl mb-10"
        >
          Telecom codebases are 50% boilerplate — CRUD endpoints, provisioning wrappers, test harnesses.
          Tiered routing pushes that volume to Flash-Lite. 5G architecture, anomaly detection,
          and SLA disputes stay on Opus. Right model, right task.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-12">
          {phases.map((p, i) => (
            <span key={i} className="flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/70">
              {p.label}
              <span className="ml-1.5 text-xs text-white/50">{p.sub}</span>
            </span>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
          {modelCards.map((m) => (
            <div key={m.name} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: m.color }}>{m.vendor}</span>
                <span className="text-[10px] font-mono text-white/30">AA {m.aaScore}</span>
              </div>
              <p className="text-sm font-bold text-white mb-1">{m.name}</p>
              <p className="text-xs text-white/40 leading-tight">{m.role}</p>
            </div>
          ))}
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 text-[10px] text-white/20">
          AA scores from Artificial Analysis Intelligence Index (Jun 2026). Higher = stronger reasoning.
        </motion.p>
      </div>
    </section>
  );
}
