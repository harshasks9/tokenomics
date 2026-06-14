"use client";

import Link from "next/link";
import { useActiveSection } from "@/lib/hooks";
import { Brain, Zap, Eye, Bot, BarChart3, ShoppingBag } from "lucide-react";

const sections = [
  { id: "overview",    label: "Overview",         icon: ShoppingBag },
  { id: "shop-build",  label: "Build",            icon: Brain },
  { id: "shop-inapp",  label: "Run: Assistant",   icon: Zap },
  { id: "shop-visual", label: "Run: Visual",      icon: Eye },
  { id: "shop-agent",  label: "Extend: Agent",    icon: Bot },
  { id: "shop-summary",label: "Summary",          icon: BarChart3 },
];

const GREEN = "#188038";
const SLATE = "#5F6368";

export default function ShopStickyNav() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8EAED] z-50 hidden lg:flex flex-col py-8 px-4">
      <Link href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#5F6368]/50 hover:text-[#5F6368] transition-colors mb-1">
        ← Home
      </Link>
      <div className="mb-10 px-3">
        <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-1">ShopOS</div>
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#BDC1C6]">Tokenomics Showcase</div>
      </div>

      <div className="flex-1 space-y-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive ? "bg-emerald-50 text-emerald-700" : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
              }`}
            >
              <s.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-600" : "text-[#9AA0A6] group-hover:text-[#5F6368]"}`} />
              <span>{s.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-600" />}
            </a>
          );
        })}
      </div>

      <div className="mt-auto px-3">
        <div className="text-[10px] text-[#9AA0A6] leading-relaxed">
          Pricing: June 2026 list rates
          <br />
          All data pre-seeded
        </div>
      </div>
    </nav>
  );
}
