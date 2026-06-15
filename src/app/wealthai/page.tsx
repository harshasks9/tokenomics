"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import Hero from "@/components/Hero";
import StickyNav from "@/components/StickyNav";
import BuildScenario from "@/components/BuildScenario";
import InAppScenario from "@/components/InAppScenario";
import MultimodalScenario from "@/components/MultimodalScenario";
import AgentScenario from "@/components/AgentScenario";
import SummaryDashboard from "@/components/SummaryDashboard";
import FrontierChart from "@/components/frontier/FrontierChart";

export default function WealthAIPage() {
  return (
    <TallyProvider>
      {/* iOS-style back button */}
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <StickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <Hero />
        <BuildScenario />
        <InAppScenario />
        <MultimodalScenario />
        <AgentScenario />
        <FrontierChart workflow="wealthai" />
        <SummaryDashboard />
      </main>
    </TallyProvider>
  );
}
