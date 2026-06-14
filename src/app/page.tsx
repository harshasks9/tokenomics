"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  Landmark,
  Factory,
  Home,
  Plus,
  Eye,
  Network,
  ArrowRight,
} from "lucide-react";

const industries = [
  {
    id: "wealthai",
    name: "WealthAI",
    href: "/wealthai",
    icon: TrendingUp,
    accent: "#1A73E8",
    accentLight: "#4285F4",
    gradient: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)",
    roiTeaser: "61% query savings vs Sonnet",
    enabled: true,
  },
  {
    id: "shopos",
    name: "ShopOS",
    href: "/shopos",
    icon: ShoppingBag,
    accent: "#188038",
    accentLight: "#34A853",
    gradient: "linear-gradient(135deg, #188038 0%, #34A853 100%)",
    roiTeaser: "57% savings vs all-Claude",
    enabled: true,
  },
  {
    id: "pulseai",
    name: "PulseAI",
    href: "/pulseai",
    icon: Heart,
    accent: "#E11D48",
    accentLight: "#FB7185",
    gradient: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
    roiTeaser: "36% build savings · Opus where it counts",
    enabled: true,
  },
  {
    id: "civicos",
    name: "CivicOS",
    href: "/civicos",
    icon: Landmark,
    accent: "#4F46E5",
    accentLight: "#818CF8",
    gradient: "linear-gradient(135deg, #312E81 0%, #4F46E5 100%)",
    roiTeaser: "56% build savings · 78% query savings",
    enabled: true,
  },
  {
    id: "factoryos",
    name: "FactoryOS",
    href: "/factoryos",
    icon: Factory,
    accent: "#E37400",
    accentLight: "#F97316",
    gradient: "linear-gradient(135deg, #92400e 0%, #E37400 100%)",
    roiTeaser: "64% build savings · floor-safe routing",
    enabled: true,
  },
];

function SquircleIcon({
  industry,
  index,
  sellerMode,
}: {
  industry: (typeof industries)[0];
  index: number;
  sellerMode: boolean;
}) {
  const Icon = industry.icon;
  const isDisabled = !industry.enabled;

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.2 + index * 0.12,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      whileHover={industry.enabled ? { scale: 1.08, y: -4 } : undefined}
      whileTap={industry.enabled ? { scale: 0.92 } : undefined}
      className="flex flex-col items-center gap-3 group"
    >
      {/* Squircle icon */}
      <div className="relative">
        <div
          className={`w-[88px] h-[88px] flex items-center justify-center transition-shadow duration-200 ${
            isDisabled
              ? "opacity-40"
              : "shadow-lg group-hover:shadow-xl"
          }`}
          style={{
            borderRadius: "22.37%",
            background: isDisabled
              ? "rgba(100, 116, 139, 0.15)"
              : industry.gradient,
            border: isDisabled
              ? "1.5px solid rgba(100,116,139,0.2)"
              : "1.5px solid rgba(255,255,255,0.2)",
          }}
        >
          <Icon
            size={36}
            className={isDisabled ? "text-slate-500" : "text-white"}
            strokeWidth={1.5}
          />
        </div>
        {isDisabled && (
          <div className="absolute -top-1.5 -right-1.5 rounded-full bg-slate-600 border border-slate-500 px-2 py-0.5 text-[9px] font-bold text-slate-300 uppercase tracking-wide">
            Soon
          </div>
        )}
      </div>

      {/* Label */}
      <span
        className={`text-sm font-semibold ${
          isDisabled ? "text-white/30" : "text-white/90"
        }`}
      >
        {industry.name}
      </span>

      {/* Seller mode ROI teaser */}
      {sellerMode && industry.enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="text-[11px] font-medium text-emerald-400/80 -mt-1"
        >
          {industry.roiTeaser}
        </motion.div>
      )}
    </motion.div>
  );

  if (isDisabled) return content;

  return (
    <Link href={industry.href} className="outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-2xl">
      {content}
    </Link>
  );
}

export default function SpringboardHome() {
  const [sellerMode, setSellerMode] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden py-12 pb-28"
      style={{
        background:
          "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1a2332 100%)",
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-10"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-9 z-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
          AI Tokenomics — Industry Demos
        </h1>
        <p className="text-sm text-white/40 font-medium">
          Right model, right task — across the lifecycle.
        </p>
      </motion.div>

      {/* App Grid — 3 top row + 2 bottom row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="z-10 w-full max-w-3xl px-6 mb-11"
      >
        <Link
          href="/agent-economics"
          className="group flex flex-col gap-5 rounded-3xl border border-blue-300/20 bg-gradient-to-br from-blue-500/20 via-white/10 to-emerald-400/10 p-6 shadow-2xl backdrop-blur-xl transition hover:border-blue-300/40 hover:bg-white/[0.13] sm:flex-row sm:items-center"
        >
          <div className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-950/30">
            <Network size={27} />
          </div>
          <div className="flex-1">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">CXO decision experience</div>
            <h2 className="text-xl font-extrabold text-white">Enterprise Agent Economics</h2>
            <p className="mt-1 text-sm leading-relaxed text-white/55">Define your agent estate, reveal the production stack, and compare integrated versus assembled total economics.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-white/75 transition group-hover:text-white">Open analysis<ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></div>
        </Link>
      </motion.div>

      <div className="z-10 px-8 mb-24 flex flex-col items-center gap-10 md:gap-12">
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {industries.slice(0, 3).map((ind, i) => (
            <SquircleIcon key={ind.id} industry={ind} index={i} sellerMode={sellerMode} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-12 md:gap-16">
          {industries.slice(3).map((ind, i) => (
            <SquircleIcon key={ind.id} industry={ind} index={i + 3} sellerMode={sellerMode} />
          ))}
        </div>
      </div>

      {/* Dock */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10"
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          {/* Home pill */}
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <Home size={13} className="text-white/90" />
            <span className="text-xs font-semibold text-white/90">Home</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Add Industry */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 opacity-40 cursor-default"
            title="More industries coming"
          >
            <Plus size={13} className="text-white/60" />
            <span className="text-xs font-medium text-white/60">
              Add Industry
            </span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          {/* Seller Mode toggle */}
          <button
            onClick={() => setSellerMode(!sellerMode)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              sellerMode
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            <Eye size={13} />
            <span className="text-xs font-semibold">Seller Mode</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
