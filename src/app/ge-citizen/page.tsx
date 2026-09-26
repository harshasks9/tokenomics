"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EconProvider } from "@/components/ge-citizen/EconContext";
import GecNav from "@/components/ge-citizen/GecNav";
import GecHero from "@/components/ge-citizen/GecHero";
import DayInLife from "@/components/ge-citizen/DayInLife";
import PlatformFit from "@/components/ge-citizen/PlatformFit";
import UseCaseExplorer from "@/components/ge-citizen/UseCaseExplorer";
import MarketMap from "@/components/ge-citizen/MarketMap";
import Economics from "@/components/ge-citizen/Economics";
import Pilot from "@/components/ge-citizen/Pilot";
import Trust from "@/components/ge-citizen/Trust";
import Summary from "@/components/ge-citizen/Summary";
import Sources from "@/components/ge-citizen/Sources";

export default function GeCitizenPage() {
  return (
    <EconProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:hidden z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <GecNav />
      <main className="overflow-x-hidden lg:ml-56">
        <GecHero />
        <DayInLife />
        <PlatformFit />
        <UseCaseExplorer />
        <MarketMap />
        <Economics />
        <Pilot />
        <Trust />
        <Summary />
        <Sources />
      </main>
    </EconProvider>
  );
}
