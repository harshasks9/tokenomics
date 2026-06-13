"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import ShopHero from "@/components/shopos/ShopHero";
import ShopStickyNav from "@/components/shopos/ShopStickyNav";
import ShopBuildScenario from "@/components/shopos/ShopBuildScenario";
import ShopInAppScenario from "@/components/shopos/ShopInAppScenario";
import ShopVisualSearchScenario from "@/components/shopos/ShopVisualSearchScenario";
import ShopAgentScenario from "@/components/shopos/ShopAgentScenario";
import ShopSummaryDashboard from "@/components/shopos/ShopSummaryDashboard";

export default function ShopOSPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <ShopStickyNav />
      <main className="lg:ml-56">
        <ShopHero />
        <ShopBuildScenario />
        <ShopInAppScenario />
        <ShopVisualSearchScenario />
        <ShopAgentScenario />
        <ShopSummaryDashboard />
      </main>
    </TallyProvider>
  );
}
