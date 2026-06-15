"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import PulseHero from "@/components/pulseai/PulseHero";
import PulseStickyNav from "@/components/pulseai/PulseStickyNav";
import PulseBuildScenario from "@/components/pulseai/PulseBuildScenario";
import PulseInAppScenario from "@/components/pulseai/PulseInAppScenario";
import PulseDocumentAnalysis from "@/components/pulseai/PulseDocumentAnalysis";
import PulseAgentScenario from "@/components/pulseai/PulseAgentScenario";
import PulseSummaryDashboard from "@/components/pulseai/PulseSummaryDashboard";
import FrontierChart from "@/components/frontier/FrontierChart";

export default function PulseAIPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <PulseStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <PulseHero />
        <PulseBuildScenario />
        <PulseInAppScenario />
        <PulseDocumentAnalysis />
        <PulseAgentScenario />
        <FrontierChart workflow="pulseai" />
        <PulseSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
