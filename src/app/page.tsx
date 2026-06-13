"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  ShoppingBag,
  Heart,
  Plus,
  Home,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

// ─── Pre-computed ROI teasers (run-phase savings vs all-Opus at defaults) ─
const ROI_TEASERS: Record<string, string> = {
  wealthai: "$8.8M/yr potential",
  shopos:   "$4.5M/yr potential",
};

// ─── App tile definitions ──────────────────────────────────────────────────
const APPS = [
  {
    id: "wealthai",
    label: "WealthAI",
    sublabel: "Wealth Management",
    href: "/wealthai",
    icon: TrendingUp,
    accent: "#1A73E8",
    accentBg: "rgba(26,115,232,0.12)",
    live: true,
  },
  {
    id: "shopos",
    label: "ShopOS",
    sublabel: "Retail Commerce",
    href: "/shopos",
    icon: ShoppingBag,
    accent: "#188038",
    accentBg: "rgba(24,128,56,0.12)",
    live: true,
  },
  {
    id: "healthcare",
    label: "Healthcare",
    sublabel: "Clinical AI",
    href: "/healthcare",
    icon: Heart,
    accent: "#9AA0A6",
    accentBg: "rgba(154,160,166,0.10)",
    live: false,
  },
] as const;

// ─── App Icon tile ─────────────────────────────────────────────────────────
function AppTile({
  app,
  index,
  sellerMode,
}: {
  app: typeof APPS[number];
  index: number;
  sellerMode: boolean;
}) {
  const Icon = app.icon;

  const inner = (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={app.live ? { y: -4, scale: 1.03 } : {}}
      whileTap={app.live ? { scale: 0.92, opacity: 0.85 } : {}}
      className="flex flex-col items-center gap-2 select-none"
    >
      {/* Squircle icon */}
      <div className="relative">
        <div
          className="w-24 h-24 flex items-center justify-center shadow-lg"
          style={{
            background: app.live
              ? `linear-gradient(135deg, ${app.accentBg}, ${app.accent}22)`
              : "rgba(154,160,166,0.08)",
            borderRadius: "22.37%",
            border: `1.5px solid ${app.live ? app.accent + "30" : "#9AA0A6"}20`,
            boxShadow: app.live
              ? `0 4px 20px ${app.accent}25, 0 1px 4px rgba(0,0,0,0.08)`
              : "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Icon
            size={38}
            style={{ color: app.live ? app.accent : "#9AA0A6" }}
            strokeWidth={1.5}
          />
        </div>
        {!app.live && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gray-400 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
            Coming Soon
          </div>
        )}
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-semibold text-white leading-tight">{app.label}</p>
        <p className="text-[10px] text-white/50 mt-0.5">{app.sublabel}</p>
      </div>

      {/* Seller mode ROI teaser */}
      {sellerMode && app.live && ROI_TEASERS[app.id] && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[10px] font-semibold text-emerald-300 bg-emerald-950/60 rounded-full px-2 py-0.5"
        >
          {ROI_TEASERS[app.id]}
        </motion.p>
      )}
    </motion.div>
  );

  if (!app.live) {
    return <div className="cursor-not-allowed">{inner}</div>;
  }

  return <Link href={app.href}>{inner}</Link>;
}

// ─── Frosted dock ──────────────────────────────────────────────────────────
function Dock({ sellerMode, onToggleSeller }: { sellerMode: boolean; onToggleSeller: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Home pill (active) */}
        <div className="flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5">
          <Home size={14} className="text-white" />
          <span className="text-xs font-semibold text-white">Home</span>
        </div>

        <div className="w-px h-5 bg-white/15" />

        {/* Add industry (disabled) */}
        <button
          disabled
          title="More industries coming"
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 opacity-40 cursor-not-allowed"
        >
          <Plus size={14} className="text-white" />
          <span className="text-xs font-medium text-white">Add Industry</span>
        </button>

        <div className="w-px h-5 bg-white/15" />

        {/* Seller mode toggle */}
        <button
          onClick={onToggleSeller}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 transition-colors hover:bg-white/10"
        >
          {sellerMode
            ? <ToggleRight size={16} className="text-emerald-400" />
            : <ToggleLeft size={16} className="text-white/50" />
          }
          <span className={`text-xs font-medium ${sellerMode ? "text-emerald-400" : "text-white/70"}`}>
            Seller Mode
          </span>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function SpringboardPage() {
  const [sellerMode, setSellerMode] = useState(false);
  const toggleSeller = useCallback(() => setSellerMode((v) => !v), []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f1824 0%, #1a2a3a 40%, #0d1f2d 70%, #0a1520 100%)",
      }}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
      />

      {/* Ambient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-emerald-600/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 px-6 relative z-10"
      >
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-white/30 mb-3">
          AI Tokenomics
        </p>
        <h1 className="text-3xl font-bold text-white mb-2">Industry Demos</h1>
        <p className="text-sm text-white/40">Right model, right task — across the lifecycle.</p>
      </motion.div>

      {/* App grid */}
      <div className="relative z-10 flex flex-wrap justify-center gap-10 px-8 pb-32">
        {APPS.map((app, i) => (
          <AppTile key={app.id} app={app} index={i} sellerMode={sellerMode} />
        ))}
      </div>

      {/* Dock */}
      <Dock sellerMode={sellerMode} onToggleSeller={toggleSeller} />
    </div>
  );
}
