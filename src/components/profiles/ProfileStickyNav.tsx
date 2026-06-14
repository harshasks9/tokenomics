"use client";

import { useActiveSection } from "@/lib/hooks";
import { Home, Layers, Cpu, Bot, BarChart3 } from "lucide-react";
import type { CustomerProfile } from "@/lib/profiles/types";

const SECTIONS = [
  { id: "overview", label: "Overview",  Icon: Home    },
  { id: "build",    label: "Build",     Icon: Layers  },
  { id: "run",      label: "Run",       Icon: Cpu     },
  { id: "agent",    label: "Agent",     Icon: Bot     },
  { id: "summary",  label: "Summary",   Icon: BarChart3 },
];

export default function ProfileStickyNav({ profile }: { profile: CustomerProfile }) {
  const active = useActiveSection(SECTIONS.map((s) => s.id));

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-[#E8EAED] z-50 hidden lg:flex flex-col py-8 px-4">
      {/* Back to home — same pattern as other navs */}
      <a href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-[#5F6368]/50 hover:text-[#5F6368] transition-colors mb-1">
        ← Home
      </a>

      {/* Brand — show profile.name + country */}
      <div className="mb-10 px-3">
        <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-1">{profile.name}</div>
        <div className="text-[10px] font-semibold tracking-wider uppercase text-[#BDC1C6]">{profile.country} · {profile.industry}</div>
      </div>

      {/* Nav links */}
      <div className="flex-1 space-y-1">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          // active bg uses profile.color at 10% opacity, text uses profile.color
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive ? "text-[#202124]" : "text-[#5F6368] hover:bg-[#F8F9FA] hover:text-[#202124]"
              }`}
              style={isActive ? { backgroundColor: `${profile.color}18` } : undefined}
            >
              <s.Icon
                className="w-4 h-4 shrink-0"
                style={isActive ? { color: profile.color } : undefined}
                // fallback color when not active
                color={isActive ? undefined : "#9AA0A6"}
              />
              <span>{s.label}</span>
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: profile.color }}
                />
              )}
            </a>
          );
        })}
      </div>

      {/* Footer */}
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
