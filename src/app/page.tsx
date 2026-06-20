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
  Wifi,
  Home,
  Eye,
  Layers,
} from "lucide-react";
import PolicyRouter from "@/components/router/PolicyRouter";

const industries = [
  {
    id: "wealthai",
    name: "WealthAI",
    href: "/wealthai",
    icon: TrendingUp,
    gradient: "linear-gradient(135deg, #1A73E8 0%, #4285F4 100%)",
    roiTeaser: "52% build · 61% query savings",
    enabled: true,
  },
  {
    id: "shopos",
    name: "ShopOS",
    href: "/shopos",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #188038 0%, #34A853 100%)",
    roiTeaser: "58% build savings · 3-tier routing",
    enabled: true,
  },
  {
    id: "pulseai",
    name: "PulseAI",
    href: "/pulseai",
    icon: Heart,
    gradient: "linear-gradient(135deg, #E11D48 0%, #FB7185 100%)",
    roiTeaser: "55% build savings · clinical-safe",
    enabled: true,
  },
  {
    id: "civicos",
    name: "CivicOS",
    href: "/civicos",
    icon: Landmark,
    gradient: "linear-gradient(135deg, #312E81 0%, #4F46E5 100%)",
    roiTeaser: "56% build · 78% query savings",
    enabled: true,
  },
  {
    id: "factoryos",
    name: "FactoryOS",
    href: "/factoryos",
    icon: Factory,
    gradient: "linear-gradient(135deg, #92400e 0%, #E37400 100%)",
    roiTeaser: "64% build savings · floor-safe",
    enabled: true,
  },
  {
    id: "signalos",
    name: "SignalOS",
    href: "/signalos",
    icon: Wifi,
    gradient: "linear-gradient(135deg, #075985 0%, #0284C7 100%)",
    roiTeaser: "52% build savings · network automation",
    enabled: true,
  },
  {
    id: "geminiplus",
    name: "Gemini Plus",
    href: "/gemini-plus",
    icon: Layers,
    gradient: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
    roiTeaser: "100% credit offset · Value Map",
    enabled: true,
  },
];

type TileItem = {
  id: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  gradient: string;
  roiTeaser: string;
  enabled: boolean;
};

function SquircleIcon({
  item,
  index,
  sellerMode,
}: {
  item: TileItem;
  index: number;
  sellerMode: boolean;
}) {
  const Icon = item.icon;

  const tile = (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.15 + index * 0.08,
        type: "spring",
        stiffness: 300,
        damping: 22,
      }}
      whileHover={item.enabled ? { scale: 1.08, y: -4 } : undefined}
      whileTap={item.enabled ? { scale: 0.92 } : undefined}
      className={`flex flex-col items-center gap-3 group ${item.enabled ? "" : "opacity-45 cursor-not-allowed"}`}
    >
      <div
        className="w-[80px] h-[80px] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200"
        style={{ borderRadius: "22.37%", background: item.gradient, border: "1.5px solid rgba(255,255,255,0.15)" }}
      >
        <Icon size={32} className="text-white" strokeWidth={1.5} />
      </div>
      <span className="text-[13px] font-semibold text-white/85">{item.name}</span>
      {!item.enabled && (
        <span className="-mt-2 text-[9px] font-bold uppercase tracking-wider text-white/40">
          Coming soon
        </span>
      )}
      {sellerMode && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[10px] font-medium text-emerald-400/80 -mt-1 text-center max-w-[90px] leading-tight"
        >
          {item.roiTeaser}
        </motion.div>
      )}
    </motion.div>
  );

  return item.enabled ? (
    <Link href={item.href} className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      {tile}
    </Link>
  ) : (
    <div aria-disabled="true" title={`${item.name} is coming soon`}>
      {tile}
    </div>
  );
}

export default function SpringboardHome() {
  const [sellerMode, setSellerMode] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1a2332 100%)" }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] opacity-8"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 pt-14 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
          AI Tokenomics
        </h1>
        <p className="text-xs text-white/35 font-medium tracking-wide uppercase">
          Right model · Right task · Across the lifecycle
        </p>
      </motion.div>

      <div className="z-10 mb-12 flex w-full justify-center px-4 sm:px-8">
        <PolicyRouter />
      </div>

      <div className="z-10 px-8 flex flex-col items-center gap-12 mb-10">
        {/* Industry Showcases */}
        <div className="flex flex-col items-center gap-3">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1"
          >
            Industry Showcases
          </motion.p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-12">
            {industries.slice(0, 3).map((ind, i) => (
              <SquircleIcon key={ind.id} item={ind} index={i} sellerMode={sellerMode} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-12">
            {industries.slice(3).map((ind, i) => (
              <SquircleIcon key={ind.id} item={ind} index={i + 3} sellerMode={sellerMode} />
            ))}
          </div>
        </div>

      </div>

      {/* Subtle secondary links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="z-10 mb-24"
      >
        <div className="flex flex-wrap items-center justify-center gap-5">
        <Link
          href="/smc"
          className="text-[11px] text-white/30 hover:text-white/65 transition-colors tracking-wide"
        >
          SMC Executive AI Brief &rarr;
        </Link>
        <Link
          href="/agent-economics"
          className="text-[11px] text-white/20 hover:text-white/50 transition-colors tracking-wide"
        >
          Enterprise Agent Decision Framework ↗
        </Link>
        </div>
      </motion.div>

      {/* Dock */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div
          className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10"
          style={{
            background: "rgba(30, 41, 59, 0.65)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <Home size={13} className="text-white/90" />
            <span className="text-xs font-semibold text-white/90">Home</span>
          </div>

          <div className="w-px h-5 bg-white/10" />

          <button
            onClick={() => setSellerMode(!sellerMode)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
              sellerMode ? "bg-emerald-500/20 text-emerald-400" : "text-white/45 hover:text-white/70"
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
