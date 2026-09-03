"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import IrasStickyNav from "@/components/iras/IrasStickyNav";
import IrasHero from "@/components/iras/IrasHero";
import WhyNow from "@/components/iras/WhyNow";
import UseCases from "@/components/iras/UseCases";
import DayInTheLife from "@/components/iras/DayInTheLife";
import Optionality from "@/components/iras/Optionality";
import ModelRouter from "@/components/iras/ModelRouter";
import Architecture from "@/components/iras/Architecture";
import Trust from "@/components/iras/Trust";
import AgenticJourney from "@/components/iras/AgenticJourney";
import WhyGoogle from "@/components/iras/WhyGoogle";
import StartSmall from "@/components/iras/StartSmall";
import SourcesSection from "@/components/iras/SourcesSection";

export default function IrasPage() {
  return (
    <>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:hidden z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <IrasStickyNav />
      <main className="overflow-x-hidden lg:ml-56">
        <IrasHero />
        <WhyNow />
        <UseCases />
        <DayInTheLife />
        <Optionality />
        <ModelRouter />
        <Architecture />
        <Trust />
        <AgenticJourney />
        <WhyGoogle />
        <StartSmall />
        <SourcesSection />
      </main>
    </>
  );
}
