"use client";

import { useActiveSection } from "@/lib/hooks";
import { Heart, Brain, Zap, Eye, Bot, BarChart3 } from "lucide-react";

const sections = [
  { id: "overview",     label: "Overview",         icon: Heart },
  { id: "hc-build",    label: "Build",            icon: Brain },
  { id: "hc-inapp",    label: "Run: Assistant",   icon: Zap },
  { id: "hc-imaging",  label: "Run: Documents",   icon: Eye },
  { id: "hc-agent",    label: "Extend: Agent",    icon: Bot },
  { id: "hc-summary",  label: "Summary",          icon: BarChart3 },
];

export default function HcStickyNav() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8EAED] z-50 hidden lg:flex flex-col py-8 px-4">
      <div className="mb-10 px-3">
        <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-1">Healthcare</div>
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
                isActive ? "bg-rose-50 text-rose-700" : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
              }`}
            >
              <s.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-rose-600" : "text-[#9AA0A6] group-hover:text-[#5F6368]"}`} />
              <span>{s.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-600" />}
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
