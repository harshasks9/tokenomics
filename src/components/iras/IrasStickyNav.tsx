"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Landmark,
  Sparkles,
  LayoutGrid,
  Users,
  Layers,
  Route,
  Boxes,
  ShieldCheck,
  TrendingUp,
  Award,
  Flag,
} from "lucide-react";

const BLUE = "#1A73E8";

const navItems = [
  { id: "iras-hero", label: "Overview", Icon: Landmark },
  { id: "iras-whynow", label: "Why Now", Icon: Sparkles },
  { id: "iras-usecases", label: "Use Cases", Icon: LayoutGrid },
  { id: "iras-day", label: "Day in the Life", Icon: Users },
  { id: "iras-optionality", label: "Optionality", Icon: Layers },
  { id: "iras-router", label: "Model Router", Icon: Route },
  { id: "iras-architecture", label: "Architecture", Icon: Boxes },
  { id: "iras-trust", label: "Trust", Icon: ShieldCheck },
  { id: "iras-agentic", label: "Agentic Path", Icon: TrendingUp },
  { id: "iras-why", label: "Why Google", Icon: Award },
  { id: "iras-start", label: "Getting Started", Icon: Flag },
];

export default function IrasStickyNav() {
  const [active, setActive] = useState("iras-hero");

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
      <div className="rounded-2xl border border-[#E8EAED] bg-white/85 backdrop-blur-md py-3 px-2 pointer-events-auto shadow-[0_4px_24px_rgba(32,33,36,0.08)]">
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium text-[#5F6368]/70 hover:text-[#202124] transition-colors"
        >
          ← Home
        </Link>
        <p className="text-[9px] font-bold uppercase tracking-widest text-[#5F6368]/60 px-3 mb-2 mt-1">
          IRAS × Google Cloud
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, Icon }, i) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <button
                  onClick={() =>
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="w-full flex items-center gap-2.5 rounded-xl px-3 py-[7px] text-left text-xs font-medium transition-all"
                  style={{
                    color: isActive ? BLUE : "#5F6368",
                    background: isActive ? `${BLUE}14` : "transparent",
                  }}
                >
                  <span
                    className="text-[9px] font-bold w-4 tabular-nums"
                    style={{ color: isActive ? BLUE : "#BDC1C6" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
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
