"use client";

import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { TallyProvider } from "@/lib/tally-context";
import { AUSRETAIL_PROFILE } from "@/lib/profiles/ausretail";
import ProfileStickyNav from "@/components/profiles/ProfileStickyNav";
import ProfileHero from "@/components/profiles/ProfileHero";
import ProfileBuildScenario from "@/components/profiles/ProfileBuildScenario";
import ProfileRunScenario from "@/components/profiles/ProfileRunScenario";
import ProfileAgentScenario from "@/components/profiles/ProfileAgentScenario";
import ProfileSummary from "@/components/profiles/ProfileSummary";

export default function AusRetailPage() {
  return (
    <TallyProvider>
      <Link
        href="/"
        className="fixed top-4 left-4 lg:left-60 z-[100] flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-white transition-colors"
      >
        <ChevronLeft size={14} />
        Home
      </Link>
      <ProfileStickyNav profile={AUSRETAIL_PROFILE} />
      <main className="overflow-x-hidden lg:ml-56">
        <ProfileHero profile={AUSRETAIL_PROFILE} Icon={ShoppingCart} />
        <ProfileBuildScenario profile={AUSRETAIL_PROFILE} />
        <ProfileRunScenario profile={AUSRETAIL_PROFILE} />
        <ProfileAgentScenario profile={AUSRETAIL_PROFILE} />
        <ProfileSummary profile={AUSRETAIL_PROFILE} />
      </main>
    </TallyProvider>
  );
}
