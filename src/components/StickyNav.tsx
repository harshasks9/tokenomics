"use client";

import { useActiveSection } from "@/lib/hooks";
import { Brain, Zap, Eye, Bot, BarChart3, Layers } from "lucide-react";

const sections = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "build", label: "Build", icon: Brain },
  { id: "inapp", label: "Run: In-App", icon: Zap },
  { id: "multimodal", label: "Run: Multimodal", icon: Eye },
  { id: "agent", label: "Extend: Agent", icon: Bot },
  { id: "summary", label: "Summary", icon: BarChart3 },
];

export default function StickyNav() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8EAED] z-50 hidden lg:flex flex-col py-8 px-4">
      <div className="mb-10 px-3">
        <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-1">
          WealthAI
        </div>
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#BDC1C6]">
          Tokenomics Showcase
        </div>
      </div>

      <div className="flex-1 space-y-1">
        {sections.map((s) => {
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-[#E8F0FE] text-[#1A73E8]"
                  : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
              }`}
            >
              <s.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1A73E8]" : "text-[#9AA0A6] group-hover:text-[#5F6368]"}`} />
              <span>{s.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1A73E8]" />
              )}
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
