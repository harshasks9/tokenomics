"use client";

import { motion } from "framer-motion";
import { Building2, Shield, Users, Cpu } from "lucide-react";
import { MODELS } from "@/lib/pricing";

const INDIGO = "#4F46E5";
const INDIGO_LIGHT = "#818CF8";
const TEAL = "#00ACC1";
const BLUE = "#1A73E8";
const AMBER = "#E37400";

const phases = [
  { label: "Build",  sub: "SDLC",                  color: INDIGO,       icon: Building2 },
  { label: "Run",    sub: "Citizen Services",       color: BLUE,         icon: Users     },
  { label: "Run",    sub: "Document Processing",    color: TEAL,         icon: Shield    },
  { label: "Extend", sub: "Procurement Agent",      color: "#7C3AED",    icon: Cpu       },
];

const modelCards = [
  {
    model: "opus",
    role: "Orchestrator & Compliance",
    tasks: ["FedRAMP architecture", "Benefits appeals logic", "Procurement risk analysis"],
    color: AMBER,
    badge: "Frontier Reasoning",
  },
  {
    model: "flash",
    role: "Citizen Services & Processing",
    tasks: ["FAQ & policy questions", "FOIA redaction flagging", "Contract data pulls"],
    color: BLUE,
    badge: "AA Score 81",
  },
  {
    model: "flashLite",
    role: "High-Volume Lookups",
    tasks: ["Status checks & refunds", "Form scaffolding & CRUD", "Notification templates"],
    color: TEAL,
    badge: "AA Score 68",
  },
];

export default function PsHero() {
  return (
    <section
      id="ps-overview"
      className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 45%, #0f172a 100%)" }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] opacity-15 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${INDIGO} 0%, transparent 70%)` }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tag */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold"
            style={{ borderColor: INDIGO + "50", color: INDIGO_LIGHT, background: INDIGO + "15" }}
          >
            <Building2 size={14} /> Public Sector AI — GovTech ISV Tokenomics
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none mb-6">
            56% dev cost savings.{" "}
            <span style={{ color: INDIGO_LIGHT }}>No capability compromise.</span>
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            Government codebases skew routine — 80% of tasks are CRUD, legacy wrappers, and boilerplate.
            Reserve Opus for FedRAMP compliance and fraud logic. Run everything else on Gemini Flash.
          </p>
        </motion.div>

        {/* Phase pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {phases.map(({ label, sub, color, icon: Icon }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5"
              style={{ borderColor: color + "30", background: color + "12" }}
            >
              <Icon size={14} style={{ color }} />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color }}>{label}</span>
                <span className="ml-1.5 text-xs text-white/60">{sub}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Model cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {modelCards.map(({ model, role, tasks, color, badge }) => (
            <div
              key={model}
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ borderColor: color + "30", background: color + "0D" }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{MODELS[model as keyof typeof MODELS].name}</p>
                  <p className="text-[11px] text-white/40">{role}</p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                  style={{ background: color + "20", color }}
                >
                  {badge}
                </span>
              </div>
              <ul className="space-y-1.5">
                {tasks.map((t) => (
                  <li key={t} className="flex items-center gap-1.5 text-[11px] text-white/55">
                    <span className="w-1 h-1 rounded-full shrink-0" style={{ background: color + "80" }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
