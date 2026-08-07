"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ExternalLink, Info } from "lucide-react";
import { APPLIC_META, ECON_META, AUDIENCE_META, type Applicability, type Confidence, type EconType, type Audience } from "./schema";

export const INK = "#0C1116";
export const MUTED = "#5B6673";
export const LINE = "#E4E8EC";
export const CANVAS = "#F6F7F9";

// ─── Primitives ─────────────────────────────────────────────────────────────

export function Kicker({ children, color = "#1A73E8" }: { children: ReactNode; color?: string }) {
  return <div className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2.5" style={{ color }}>{children}</div>;
}

export function SectionHead({ kicker, title, lead, color }: { kicker: string; title: string; lead?: string; color?: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <Kicker color={color}>{kicker}</Kicker>
      <h2 className="text-2xl md:text-[34px] font-extrabold tracking-[-0.02em] leading-[1.1]" style={{ color: INK }}>{title}</h2>
      {lead && <p className="text-[15px] mt-3 leading-relaxed" style={{ color: MUTED }}>{lead}</p>}
    </div>
  );
}

export function Fade({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4, delay }}>
      {children}
    </motion.div>
  );
}

export function Chip({ children, color = MUTED, solid = false }: { children: ReactNode; color?: string; solid?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5 whitespace-nowrap"
      style={solid ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}14`, color }}
    >
      {children}
    </span>
  );
}

export function EvidenceTag({ kind }: { kind: Confidence }) {
  const fact = kind === "fact";
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-px shrink-0"
      style={{ backgroundColor: fact ? "#18803814" : "#D9770614", color: fact ? "#188038" : "#B26A00" }}
      title={fact ? "Drawn from public filings, earnings commentary, company announcements or reputable press" : "Reasoned opportunity hypothesis built on public facts — not a stated company figure"}
    >
      {fact ? "Fact" : "Inference"}
    </span>
  );
}

export function EconTag({ econ }: { econ: EconType }) {
  const m = ECON_META[econ];
  return <Chip color={m.color}>{m.label}</Chip>;
}

export function AudienceTag({ audience }: { audience: Audience }) {
  const m = AUDIENCE_META[audience];
  return <Chip color={m.color}>{m.label}</Chip>;
}

// ─── Score visuals ──────────────────────────────────────────────────────────

export function ScoreRing({ score, size = 44, color = "#1A73E8" }: { score: number; size?: number; color?: string }) {
  const r = (size - 5) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0" role="img" aria-label={`Opportunity score ${score} out of 100`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LINE} strokeWidth="3.5" />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={`${(score / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize={size * 0.3} fontWeight="800" fill={INK}>{score}</text>
    </svg>
  );
}

export function ScoreBars({ scores, labels }: { scores: Record<string, number>; labels: { key: string; label: string; hint: string }[] }) {
  return (
    <div className="space-y-1.5">
      {labels.map((l) => (
        <div key={l.key} className="flex items-center gap-2" title={l.hint}>
          <span className="text-[10px] w-[104px] shrink-0" style={{ color: MUTED }}>{l.label}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="w-4 h-1.5 rounded-sm" style={{ backgroundColor: i <= scores[l.key] ? "#1A73E8" : LINE }} />
            ))}
          </div>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: INK }}>{scores[l.key]}</span>
        </div>
      ))}
    </div>
  );
}

export function ApplicDot({ level }: { level: Applicability }) {
  const m = APPLIC_META[level];
  return (
    <span className="inline-flex items-center justify-center" title={m.label}>
      <span className="rounded-full" style={{ width: level === "strong" ? 11 : level === "medium" ? 8 : 5, height: level === "strong" ? 11 : level === "medium" ? 8 : 5, backgroundColor: m.color }} />
    </span>
  );
}

// ─── Disclosure ─────────────────────────────────────────────────────────────

export function Expandable({ summary, children, defaultOpen = false, accent = "#1A73E8" }: {
  summary: ReactNode; children: ReactNode; defaultOpen?: boolean; accent?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border bg-white overflow-hidden transition-shadow hover:shadow-sm" style={{ borderColor: open ? `${accent}44` : LINE }}>
      <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">{summary}</div>
        <ChevronDown size={16} className={`shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: MUTED }} />
      </button>
      {open && <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: LINE }}>{children}</div>}
    </div>
  );
}

export function Field({ label, children, color = MUTED }: { label: string; children: ReactNode; color?: string }) {
  return (
    <div>
      <div className="text-[9px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color }}>{label}</div>
      <div className="text-[12.5px] leading-relaxed" style={{ color: INK }}>{children}</div>
    </div>
  );
}

export function SourceLinks({ sources }: { sources: { label: string; url: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {sources.map((s, i) => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] hover:underline" style={{ color: MUTED }}>
          <span className="font-mono opacity-60">[{i + 1}]</span> {s.label} <ExternalLink size={9} />
        </a>
      ))}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border px-4 py-3 flex gap-2.5 items-start" style={{ borderColor: LINE, backgroundColor: "#FBFCFD" }}>
      <Info size={13} className="shrink-0 mt-0.5" style={{ color: MUTED }} />
      <p className="text-[11px] leading-relaxed" style={{ color: MUTED }}>{children}</p>
    </div>
  );
}
