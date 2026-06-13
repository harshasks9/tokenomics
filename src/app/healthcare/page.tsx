"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ChevronLeft, Clock } from "lucide-react";

export default function HealthcarePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{ background: "linear-gradient(160deg, #0f1824 0%, #1a2a3a 60%, #0a1520 100%)" }}
    >
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-sm font-medium text-white/70 hover:bg-white/15 transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-8"
      >
        <div
          className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
          style={{ borderRadius: "22.37%", background: "rgba(154,160,166,0.12)", border: "1.5px solid rgba(154,160,166,0.2)" }}
        >
          <Heart size={40} className="text-gray-400" strokeWidth={1.5} />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-gray-700/50 border border-gray-600/30 px-4 py-1.5 mb-6">
          <Clock size={12} className="text-gray-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Coming Soon</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Healthcare</h1>
        <p className="text-white/50 text-lg mb-2">Clinical AI Tokenomics</p>
        <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">
          Prior-auth automation, clinical documentation, drug interaction checking, and care-navigation agents.
          Built on the same tiered architecture — coming soon.
        </p>
      </motion.div>
    </div>
  );
}
