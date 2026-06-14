"use client";

import Link from "next/link";
import { Factory, Wrench, MessageSquare, ScanLine, Bot, BarChart3 } from "lucide-react";

const AMBER = "#E37400";

const sections = [
  { id: "fact-overview",  label: "Overview",          icon: Factory    },
  { id: "fact-build",     label: "Build — IoT SDLC",  icon: Wrench     },
  { id: "fact-assistant", label: "Floor Assistant",    icon: MessageSquare },
  { id: "fact-quality",   label: "Quality Inspection", icon: ScanLine   },
  { id: "fact-agent",     label: "Predictive Maint.",  icon: Bot        },
  { id: "fact-summary",   label: "Lifecycle Summary",  icon: BarChart3  },
];

export default function FactStickyNav() {
  return (
    <nav className="fixed top-0 left-0 z-40 hidden lg:flex flex-col w-56 h-screen border-r border-[#E8EAED] bg-white pt-6 pb-4 overflow-y-auto">
      <Link href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors mb-1 mx-2">
        ← Home
      </Link>

      <p className="px-4 mt-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">FactoryOS</p>
      <div className="flex flex-col gap-0.5 px-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <a key={s.id} href={`#${s.id}`}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-700 transition-colors group">
              <Icon size={14} className="text-gray-400 group-hover:text-orange-500 shrink-0" style={{ color: undefined }} />
              {s.label}
            </a>
          );
        })}
      </div>

      <div className="mt-auto px-4 pt-4 border-t border-[#E8EAED] mx-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: AMBER }} />
          <span className="text-[10px] text-gray-400">Manufacturing · Tiered AI</span>
        </div>
      </div>
    </nav>
  );
}
