"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Landmark, Sun, LayoutGrid, Map, Calculator, Flag, ShieldCheck, FileCheck2, BookOpen } from "lucide-react";

const BLUE = "#1A73E8";

export const NAV_ITEMS = [
  { id: "gec-hero", label: "Proposition", Icon: Landmark },
  { id: "gec-day", label: "Day in the life", Icon: Sun },
  { id: "gec-usecases", label: "Use cases", Icon: LayoutGrid },
  { id: "gec-markets", label: "Market map", Icon: Map },
  { id: "gec-economics", label: "$2 economics", Icon: Calculator },
  { id: "gec-pilot", label: "Pilot & roadmap", Icon: Flag },
  { id: "gec-trust", label: "Trust & requirements", Icon: ShieldCheck },
  { id: "gec-summary", label: "Executive summary", Icon: FileCheck2 },
  { id: "gec-sources", label: "Sources & gaps", Icon: BookOpen },
];

export default function GecNav() {
  const [active, setActive] = useState("gec-hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="pointer-events-none fixed left-0 top-0 z-40 hidden h-full w-56 flex-col justify-center px-4 lg:flex">
      <div className="pointer-events-auto rounded-2xl border border-[#E8EAED] bg-white/90 px-2 py-3 shadow-[0_4px_24px_rgba(32,33,36,0.08)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#5F6368]/70 transition-colors hover:text-[#202124]">
          ← Home
        </Link>
        <p className="mb-2 mt-1 px-3 text-[9px] font-bold uppercase tracking-widest text-[#5F6368]/60">GE for Citizen</p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const on = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-[7px] text-left text-xs font-medium transition-all"
                  style={{ color: on ? BLUE : "#5F6368", background: on ? `${BLUE}14` : "transparent" }}
                >
                  <Icon size={14} />
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
