"use client";

import Link from "next/link";
import { Wifi, Wrench, MessageSquare, FileText, Bot, BarChart3 } from "lucide-react";
import { useActiveSection } from "@/lib/hooks";

const SKY = "#0284C7";

const sections = [
  { id: "sig-overview",  label: "Overview",        icon: Wifi         },
  { id: "sig-build",     label: "Build",           icon: Wrench       },
  { id: "sig-support",   label: "Run: Support AI", icon: MessageSquare },
  { id: "sig-contracts", label: "Run: Contracts",  icon: FileText     },
  { id: "sig-agent",     label: "Extend: NetOps",  icon: Bot          },
  { id: "sig-summary",   label: "Summary",         icon: BarChart3    },
];

export default function SignalStickyNav() {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <nav className="fixed top-0 left-0 z-40 hidden lg:flex flex-col w-56 h-screen border-r border-[#E8EAED] bg-white pt-6 pb-4 overflow-y-auto">
      <Link href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors mb-1 mx-2">
        ← Home
      </Link>

      <p className="px-4 mt-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">SignalOS</p>
      <div className="flex flex-col gap-0.5 px-2">
        {sections.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors group ${
                isActive ? "text-sky-700" : "text-gray-600 hover:text-gray-900"
              }`}
              style={{ backgroundColor: isActive ? SKY + "12" : undefined }}
            >
              <Icon
                size={14}
                className="shrink-0"
                style={{ color: isActive ? SKY : undefined }}
              />
              {s.label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SKY }} />}
            </a>
          );
        })}
      </div>

      <div className="mt-auto px-4 pt-4 border-t border-[#E8EAED] mx-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: SKY }} />
          <span className="text-[10px] text-gray-400">Telecom · Tiered AI</span>
        </div>
      </div>
    </nav>
  );
}
