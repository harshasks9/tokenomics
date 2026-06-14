"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import CivicHero from "@/components/civicos/CivicHero";
import CivicStickyNav from "@/components/civicos/CivicStickyNav";
import CivicBuildScenario from "@/components/civicos/CivicBuildScenario";
import CivicCitizenScenario from "@/components/civicos/CivicCitizenScenario";
import CivicDocumentScenario from "@/components/civicos/CivicDocumentScenario";
import CivicAgentScenario from "@/components/civicos/CivicAgentScenario";
import CivicSummaryDashboard from "@/components/civicos/CivicSummaryDashboard";

export default function CivicOSPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <CivicStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <CivicHero />
        <CivicBuildScenario />
        <CivicCitizenScenario />
        <CivicDocumentScenario />
        <CivicAgentScenario />
        <CivicSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
