"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import PsHero from "@/components/publicsector/PsHero";
import PsStickyNav from "@/components/publicsector/PsStickyNav";
import PsBuildScenario from "@/components/publicsector/PsBuildScenario";
import PsCitizenScenario from "@/components/publicsector/PsCitizenScenario";
import PsDocumentScenario from "@/components/publicsector/PsDocumentScenario";
import PsAgentScenario from "@/components/publicsector/PsAgentScenario";
import PsSummaryDashboard from "@/components/publicsector/PsSummaryDashboard";

export default function PublicSectorPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <PsStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <PsHero />
        <PsBuildScenario />
        <PsCitizenScenario />
        <PsDocumentScenario />
        <PsAgentScenario />
        <PsSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
