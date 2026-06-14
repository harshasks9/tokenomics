"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import FactHero from "@/components/factoryos/FactHero";
import FactStickyNav from "@/components/factoryos/FactStickyNav";
import FactBuildScenario from "@/components/factoryos/FactBuildScenario";
import FactInAppScenario from "@/components/factoryos/FactInAppScenario";
import FactDocAnalysisScenario from "@/components/factoryos/FactDocAnalysisScenario";
import FactAgentScenario from "@/components/factoryos/FactAgentScenario";
import FactSummaryDashboard from "@/components/factoryos/FactSummaryDashboard";

export default function FactoryOSPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <FactStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <FactHero />
        <FactBuildScenario />
        <FactInAppScenario />
        <FactDocAnalysisScenario />
        <FactAgentScenario />
        <FactSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
