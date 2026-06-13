"use client";

import { TallyProvider } from "@/lib/tally-context";
import Hero from "@/components/Hero";
import StickyNav from "@/components/StickyNav";
import BuildScenario from "@/components/BuildScenario";
import InAppScenario from "@/components/InAppScenario";
import MultimodalScenario from "@/components/MultimodalScenario";
import AgentScenario from "@/components/AgentScenario";
import SummaryDashboard from "@/components/SummaryDashboard";

export default function Home() {
  return (
    <TallyProvider>
      <StickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <Hero />
        <BuildScenario />
        <InAppScenario />
        <MultimodalScenario />
        <AgentScenario />
        <SummaryDashboard />
      </main>
    </TallyProvider>
  );
}
