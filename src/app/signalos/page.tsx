"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import SignalStickyNav from "@/components/signalos/SignalStickyNav";
import SignalHero from "@/components/signalos/SignalHero";
import SignalBuildScenario from "@/components/signalos/SignalBuildScenario";
import SignalRunScenario from "@/components/signalos/SignalRunScenario";
import SignalDocScenario from "@/components/signalos/SignalDocScenario";
import SignalAgentScenario from "@/components/signalos/SignalAgentScenario";
import SignalSummary from "@/components/signalos/SignalSummary";

export default function SignalOSPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <SignalStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <SignalHero />
        <SignalBuildScenario />
        <SignalRunScenario />
        <SignalDocScenario />
        <SignalAgentScenario />
        <SignalSummary />
      </main>
    </TallyProvider>
  );
}
