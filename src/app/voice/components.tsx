"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { computeRoi, fmtMoney, fmtNum, ARCH_LAYERS, LIFECYCLE, PALETTE } from "./data";

// ─── Primitives ─────────────────────────────────────────────────────────────

export function Section({ id, children, alt = false, className = "" }: { id?: string; children: ReactNode; alt?: boolean; className?: string }) {
  return (
    <section id={id} className={`py-16 md:py-24 ${alt ? "bg-[#F8F9FA]" : "bg-white"} ${className}`}>
      <div className="max-w-6xl mx-auto px-5 md:px-8">{children}</div>
    </section>
  );
}

export function Kicker({ children, color = PALETTE.blue }: { children: ReactNode; color?: string }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ color }}>
      {children}
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#202124] mb-4 max-w-3xl">{children}</h2>;
}

export function Lead({ children }: { children: ReactNode }) {
  return <p className="text-base md:text-lg text-[#5F6368] max-w-3xl leading-relaxed">{children}</p>;
}

export function FadeIn({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function StatCard({ value, label, source, color = PALETTE.blue }: { value: string; label: string; source?: string; color?: string }) {
  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-6 flex flex-col">
      <div className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color }}>{value}</div>
      <div className="text-sm text-[#202124] mt-2 leading-snug flex-1">{label}</div>
      {source && <div className="text-[11px] text-[#9AA0A6] mt-3 leading-snug">{source}</div>}
    </div>
  );
}

export function Pill({ children, color = PALETTE.blue }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: `${color}14`, color }}
    >
      {children}
    </span>
  );
}

export function CTAButton({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all ${
        secondary
          ? "border border-[#DADCE0] text-[#1A73E8] hover:bg-[#F8F9FA]"
          : "bg-[#1A73E8] text-white hover:bg-[#174EA6] shadow-sm"
      }`}
    >
      {children}
      <ArrowRight size={15} />
    </Link>
  );
}

// ─── FAQ accordion ──────────────────────────────────────────────────────────

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[#E8EAED] border border-[#E8EAED] rounded-2xl bg-white overflow-hidden">
      {items.map((f, i) => (
        <div key={i}>
          <button
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-[#202124] hover:bg-[#F8F9FA]"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {f.q}
            <ChevronDown size={16} className={`shrink-0 text-[#5F6368] transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && <div className="px-5 pb-5 text-sm text-[#5F6368] leading-relaxed">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

// ─── Interaction lifecycle strip ────────────────────────────────────────────

export function LifecycleStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {LIFECYCLE.map((s, i) => (
        <FadeIn key={s.step} delay={i * 0.05}>
          <div className="rounded-xl border border-[#E8EAED] bg-white p-4 h-full">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center text-white" style={{ backgroundColor: PALETTE.blue }}>
                {i + 1}
              </span>
              <span className="text-sm font-bold text-[#202124]">{s.step}</span>
            </div>
            <p className="text-xs text-[#5F6368] leading-relaxed">{s.desc}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ─── Architecture explorer ──────────────────────────────────────────────────

export function ArchitectureExplorer() {
  const [active, setActive] = useState(1);
  const layer = ARCH_LAYERS[active];
  return (
    <div className="grid lg:grid-cols-[1.1fr_1fr] gap-6 items-start">
      <div className="space-y-2">
        {ARCH_LAYERS.map((l, i) => (
          <button
            key={l.name}
            onClick={() => setActive(i)}
            className={`w-full text-left rounded-xl border px-5 py-4 transition-all ${
              active === i ? "border-transparent shadow-md" : "border-[#E8EAED] bg-white hover:border-[#DADCE0]"
            }`}
            style={active === i ? { backgroundColor: `${l.color}0D`, borderLeft: `4px solid ${l.color}` } : {}}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-[#202124]">{l.name}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: l.color }}>{l.owner}</span>
            </div>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-[#E8EAED] bg-white p-6 lg:sticky lg:top-24">
        <Pill color={layer.color}>{layer.owner}</Pill>
        <h3 className="text-lg font-extrabold text-[#202124] mt-3 mb-2">{layer.name}</h3>
        <p className="text-sm text-[#5F6368] leading-relaxed mb-4">{layer.detail}</p>
        <div className="flex flex-wrap gap-2">
          {layer.items.map((it) => (
            <span key={it} className="text-xs border border-[#E8EAED] rounded-full px-3 py-1.5 text-[#202124] bg-[#F8F9FA]">{it}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ROI calculator ─────────────────────────────────────────────────────────

function SliderRow({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (n: number) => string; onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-[#5F6368]">{label}</label>
        <span className="text-xs font-bold text-[#202124] tabular-nums">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#1A73E8]"
      />
    </div>
  );
}

export function RoiCalculator({ defaults, accent = PALETTE.blue, showFormula = true }: {
  defaults: { monthlyInteractions: number; avgMinutes: number; humanCostPerMin: number; aiCostPerMin: number; containment: number; revenuePerResolved?: number };
  accent?: string;
  showFormula?: boolean;
}) {
  const [monthly, setMonthly] = useState(defaults.monthlyInteractions);
  const [avgMin, setAvgMin] = useState(defaults.avgMinutes);
  const [humanCost, setHumanCost] = useState(defaults.humanCostPerMin);
  const [aiCost, setAiCost] = useState(defaults.aiCostPerMin);
  const [containment, setContainment] = useState(defaults.containment);
  const [implCost, setImplCost] = useState(250000);
  const revenuePerResolved = defaults.revenuePerResolved ?? 0;

  const r = computeRoi({ monthlyInteractions: monthly, avgMinutes: avgMin, humanCostPerMin: humanCost, aiCostPerMin: aiCost, containment, implementationCost: implCost, revenuePerResolved });

  // sensitivity: containment ±15pts
  const low = computeRoi({ monthlyInteractions: monthly, avgMinutes: avgMin, humanCostPerMin: humanCost, aiCostPerMin: aiCost, containment: Math.max(10, containment - 15), implementationCost: implCost, revenuePerResolved });
  const high = computeRoi({ monthlyInteractions: monthly, avgMinutes: avgMin, humanCostPerMin: humanCost, aiCostPerMin: aiCost, containment: Math.min(90, containment + 15), implementationCost: implCost, revenuePerResolved });

  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white overflow-hidden">
      <div className="grid md:grid-cols-[1fr_1.1fr]">
        <div className="p-6 space-y-4 border-b md:border-b-0 md:border-r border-[#E8EAED]">
          <div className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>Your inputs</div>
          <SliderRow label="Monthly interactions" value={monthly} min={10000} max={10000000} step={10000} format={fmtNum} onChange={setMonthly} />
          <SliderRow label="Avg interaction length (min)" value={avgMin} min={1} max={15} step={0.5} format={(n) => `${n} min`} onChange={setAvgMin} />
          <SliderRow label="Human cost per minute" value={humanCost} min={0.1} max={2} step={0.05} format={(n) => `$${n.toFixed(2)}`} onChange={setHumanCost} />
          <SliderRow label="AI cost per minute (blended)" value={aiCost} min={0.01} max={0.5} step={0.01} format={(n) => `$${n.toFixed(2)}`} onChange={setAiCost} />
          <SliderRow label="Containment rate" value={containment} min={20} max={90} step={5} format={(n) => `${n}%`} onChange={setContainment} />
          <SliderRow label="Implementation cost (one-time)" value={implCost} min={50000} max={2000000} step={25000} format={fmtMoney} onChange={setImplCost} />
        </div>
        <div className="p-6">
          <div className="text-xs font-bold tracking-widest uppercase text-[#5F6368] mb-4">Modelled impact</div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="text-2xl font-extrabold tabular-nums" style={{ color: PALETTE.green }}>{fmtMoney(r.monthlySavings)}</div>
              <div className="text-xs text-[#5F6368] mt-0.5">monthly cost savings</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold tabular-nums text-[#202124]">
                {r.paybackMonths === Infinity ? "—" : `${r.paybackMonths.toFixed(1)} mo`}
              </div>
              <div className="text-xs text-[#5F6368] mt-0.5">payback period</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold tabular-nums" style={{ color: accent }}>{fmtMoney(r.threeYear)}</div>
              <div className="text-xs text-[#5F6368] mt-0.5">three-year net value</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold tabular-nums text-[#202124]">{fmtNum(r.contained)}</div>
              <div className="text-xs text-[#5F6368] mt-0.5">interactions resolved by agents / month</div>
            </div>
          </div>
          <div className="rounded-xl bg-[#F8F9FA] border border-[#E8EAED] p-4 mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#5F6368] mb-2">Sensitivity — containment ±15 points</div>
            <div className="flex items-center gap-2 text-xs text-[#202124]">
              <span className="tabular-nums font-semibold">{fmtMoney(low.monthlySavings)}</span>
              <div className="flex-1 h-2 rounded-full bg-[#E8EAED] relative overflow-hidden">
                <div className="absolute inset-y-0 rounded-full" style={{ left: "8%", right: "8%", backgroundColor: `${accent}55` }} />
                <div className="absolute inset-y-0 w-1.5 rounded-full" style={{ left: "50%", backgroundColor: accent }} />
              </div>
              <span className="tabular-nums font-semibold">{fmtMoney(high.monthlySavings)}</span>
            </div>
            <div className="text-[11px] text-[#9AA0A6] mt-1.5">monthly savings range across containment scenarios</div>
          </div>
          {showFormula && (
            <details className="text-xs text-[#5F6368]">
              <summary className="cursor-pointer font-semibold text-[#202124]">Assumptions &amp; formulas (no hidden numbers)</summary>
              <ul className="mt-2 space-y-1 leading-relaxed list-disc pl-4">
                <li>Baseline cost = interactions × minutes × human $/min</li>
                <li>Contained interactions cost AI $/min only; escalated interactions incur AI cost + 60% of human handle time (triage saves the rest)</li>
                <li>{revenuePerResolved > 0 ? `Revenue uplift = contained volume × $${revenuePerResolved}/resolved × 2% incremental outcome lift (conservative default — replace with pilot data)` : "No revenue uplift modelled for this scenario"}</li>
                <li>Containment is the pilot&apos;s job to prove — the sensitivity band shows the stakes. These are modelling defaults, not claims.</li>
              </ul>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Before / After journey ─────────────────────────────────────────────────

export function BeforeAfter({ title, before, after, accent = PALETTE.blue }: { title: string; before: string[]; after: string[]; accent?: string }) {
  return (
    <div>
      <h3 className="text-lg font-extrabold text-[#202124] mb-5">{title}</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#E8EAED] bg-[#F8F9FA] p-6">
          <div className="text-[11px] font-bold tracking-widest uppercase text-[#9AA0A6] mb-4">Today</div>
          <ol className="space-y-3">
            {before.map((b, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#5F6368] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-[#E8EAED] text-[#9AA0A6] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {b}
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-2xl border p-6" style={{ borderColor: `${accent}44`, backgroundColor: `${accent}08` }}>
          <div className="text-[11px] font-bold tracking-widest uppercase mb-4" style={{ color: accent }}>With the agentic layer</div>
          <ol className="space-y-3">
            {after.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#202124] leading-relaxed">
                <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: accent }}>{i + 1}</span>
                {a}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

export function VoiceFooter() {
  return (
    <footer className="border-t border-[#E8EAED] bg-white">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-[#202124]">Gemini Enterprise Communications</div>
          <div className="text-xs text-[#9AA0A6] mt-1">
            A GTM concept exploration. Not an official Google Cloud product page. Figures are modelling defaults or cited third-party research — validate before customer use.
          </div>
        </div>
        <div className="flex items-center gap-5 text-xs text-[#5F6368]">
          <Link href="/voice" className="hover:text-[#1A73E8]">Overview</Link>
          <Link href="/voice/internal" className="hover:text-[#1A73E8]">Googler? Internal GTM →</Link>
        </div>
      </div>
    </footer>
  );
}
