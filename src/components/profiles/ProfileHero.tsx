"use client";

import { motion } from "framer-motion";
import type { CustomerProfile } from "@/lib/profiles/types";
import type { LucideIcon } from "lucide-react";

const MODELS = [
  { name: "Flash-Lite", tagline: "Routine tasks", color: "#059669", price: "$0.25 / $1.50" },
  { name: "Flash",      tagline: "Standard tasks", color: "#0284C7", price: "$1.50 / $9.00" },
  { name: "Opus",       tagline: "Complex tasks",  color: "#7C3AED", price: "$5.00 / $25.00" },
];

export default function ProfileHero({
  profile,
  Icon,
}: {
  profile: CustomerProfile;
  Icon: LucideIcon;
}) {
  return (
    <section
      id="overview"
      className="relative overflow-hidden min-h-screen flex flex-col justify-center"
      style={{ background: profile.heroGradient }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 section-container py-24 lg:py-32">
        <div className="max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 mb-8"
            style={{ borderColor: `${profile.color}50`, backgroundColor: `${profile.color}15` }}
          >
            <Icon size={14} style={{ color: profile.color }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: profile.color }}>
              {profile.country} · {profile.industry}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight"
          >
            {profile.tagline}
          </motion.h1>

          {/* Savings sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-semibold mb-6"
            style={{ color: profile.color }}
          >
            {profile.savingsHeadline}
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-white/65 text-base max-w-2xl mb-12 leading-relaxed"
          >
            {profile.description}
          </motion.p>

          {/* KPIs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            {profile.kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-xl px-5 py-3 border"
                style={{ borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <p className="text-2xl font-extrabold text-white">{kpi.value}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45 mt-0.5">{kpi.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Model tier cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl"
          >
            {MODELS.map((m) => (
              <div
                key={m.name}
                className="rounded-xl p-4 border"
                style={{ borderColor: `${m.color}40`, backgroundColor: `${m.color}12` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-xs font-bold text-white">{m.name}</span>
                </div>
                <p className="text-[10px] text-white/50 mb-1">{m.tagline}</p>
                <p className="text-[10px] font-mono text-white/35">{m.price} /M tok</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
