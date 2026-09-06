import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PolicyRouter from "@/components/router/PolicyRouter";

export const metadata: Metadata = {
  title: "Routing Policy — AI Tokenomics",
  description: "Interactive model-routing policy simulator: watch requests route across tiers and edit the policy live.",
};

export default function RouterPage() {
  return (
    <div
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 40%, #0f172a 70%, #1a2332 100%)" }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-10 blur-[120px]"
        style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}
      />
      <header className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={13} />
          Home
        </Link>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Routing policy simulator</span>
      </header>
      <main className="relative z-10 flex w-full justify-center px-4 pb-16 pt-4 sm:px-8">
        <PolicyRouter />
      </main>
    </div>
  );
}
