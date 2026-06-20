"use client";

import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import { BLINKMART_PROFILE } from "@/lib/profiles/blinkmart";
import ProfileStickyNav from "@/components/profiles/ProfileStickyNav";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileBuildScenario from "@/components/profiles/ProfileBuildScenario";
import ProfileRunScenario from "@/components/profiles/ProfileRunScenario";
import ProfileAgentScenario from "@/components/profiles/ProfileAgentScenario";
import ProfileSummary from "@/components/profiles/ProfileSummary";

export default function BlinkMartPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <ProfileStickyNav profile={BLINKMART_PROFILE} />
      <main className="overflow-x-hidden lg:ml-56">
        <ProfileHero profile={BLINKMART_PROFILE} Icon={Zap} />
        <ProfileBuildScenario profile={BLINKMART_PROFILE} />
        <ProfileRunScenario profile={BLINKMART_PROFILE} />
        <ProfileAgentScenario profile={BLINKMART_PROFILE} />
        <ProfileSummary profile={BLINKMART_PROFILE} />
      </main>
    </TallyProvider>
  );
}
