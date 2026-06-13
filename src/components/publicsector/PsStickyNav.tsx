"use client";

import { useState, useEffect } from "react";
import { Building2, Users, FileText, Bot, BarChart2, Shield } from "lucide-react";

const INDIGO = "#4F46E5";

const navItems = [
  { id: "ps-overview",  label: "Overview",          Icon: Building2 },
  { id: "ps-build",     label: "S1 Build",          Icon: Shield    },
  { id: "ps-citizen",   label: "S2 Citizen",        Icon: Users     },
  { id: "ps-document",  label: "S3 Documents",      Icon: FileText  },
  { id: "ps-agent",     label: "S4 Procurement",    Icon: Bot       },
  { id: "ps-summary",   label: "Summary",           Icon: BarChart2 },
];

export default function PsStickyNav() {
  const [active, setActive] = useState("ps-overview");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="hidden lg:flex fixed left-0 top-0 h-full w-56 flex-col justify-center z-40 px-4 pointer-events-none">
      <div
        className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm py-4 px-2 pointer-events-auto"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.04)" }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20 px-3 mb-3">Public Sector</p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium transition-all"
                  style={{
                    color: isActive ? INDIGO : "rgba(255,255,255,0.35)",
                    background: isActive ? INDIGO + "18" : "transparent",
                  }}
                >
                  <Icon size={13} />
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
