"use client";

import Link from "next/link";
import { ChevronLeft, Banknote } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import { MIZUBANK_PROFILE } from "@/lib/profiles/mizubank";
import ProfileStickyNav from "@/components/profiles/ProfileStickyNav";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileBuildScenario from "@/components/profiles/ProfileBuildScenario";
import ProfileRunScenario from "@/components/profiles/ProfileRunScenario";
import ProfileAgentScenario from "@/components/profiles/ProfileAgentScenario";
import ProfileSummary from "@/components/profiles/ProfileSummary";

export default function MizuBankPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <ProfileStickyNav profile={MIZUBANK_PROFILE} />
      <main className="overflow-x-hidden lg:ml-56">
        <ProfileHero profile={MIZUBANK_PROFILE} Icon={Banknote} />
        <ProfileBuildScenario profile={MIZUBANK_PROFILE} />
        <ProfileRunScenario profile={MIZUBANK_PROFILE} />
        <ProfileAgentScenario profile={MIZUBANK_PROFILE} />
        <ProfileSummary profile={MIZUBANK_PROFILE} />
      </main>
    </TallyProvider>
  );
}
