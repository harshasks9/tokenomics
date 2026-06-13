"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import HcHero from "@/components/healthcare/HcHero";
import HcStickyNav from "@/components/healthcare/HcStickyNav";
import HcBuildScenario from "@/components/healthcare/HcBuildScenario";
import HcInAppScenario from "@/components/healthcare/HcInAppScenario";
import HcDocumentAnalysis from "@/components/healthcare/HcDocumentAnalysis";
import HcAgentScenario from "@/components/healthcare/HcAgentScenario";
import HcSummaryDashboard from "@/components/healthcare/HcSummaryDashboard";

export default function HealthcarePage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <HcStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <HcHero />
        <HcBuildScenario />
        <HcInAppScenario />
        <HcDocumentAnalysis />
        <HcAgentScenario />
        <HcSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
