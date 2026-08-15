"use client";

import { ReactNode, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { KIND_META, SOURCES, type Kind } from "./data";

export const CANVAS = "#F7F8FA";
export const SURFACE = "#FFFFFF";
export const BORDER = "#E3E6EB";
// Every text colour below clears 4.5:1 against SURFACE — including the two
// greys, which is why they sit closer together than a typical grey ramp.
export const INK = "#111827";      // 16.1:1
export const MUTED = "#5A6270";    //  6.2:1
export const FAINT = "#6E7480";    //  4.7:1
export const BRAND = "#2563EB";    //  5.2:1
export const GREEN = "#047857";    //  5.5:1
export const AMBER = "#B45309";    //  5.0:1
export const RED = "#DC2626";      //  4.8:1
export const PURPLE = "#6D28D9";   //  7.0:1

export function Section({ id, children, tint }: { id?: string; children: ReactNode; tint?: string }) {
  return (
    <section id={id} className="py-14 md:py-20 scroll-mt-14" style={tint ? { backgroundColor: tint } : undefined}>
      <div className="max-w-[1180px] mx-auto px-5 md:px-8">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, color = BRAND }: { children: ReactNode; color?: string }) {
  return (
    <div className="text-[11px] font-semibold uppercase mb-2.5" style={{ color, letterSpacing: "0.1em" }}>
      {children}
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="text-[26px] md:text-[36px] font-bold tracking-[-0.025em] leading-[1.15]" style={{ color: INK }}>{children}</h2>;
}

export function Sub({ children }: { children: ReactNode }) {
  return <p className="text-[15px] md:text-[16px] leading-[1.6] mt-3 max-w-[68ch]" style={{ color: MUTED }}>{children}</p>;
}

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return (
    <div className={`rounded-xl ${pad ? "p-5" : ""} ${className}`} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
      {children}
    </div>
  );
}

/** Product panel with a title bar — the recurring "screen" chrome. */
export function Panel({ title, right, children, className = "" }: { title: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden ${className}`} style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
      <div className="px-4 py-2.5 flex items-center justify-between gap-3" style={{ borderBottom: `1px solid ${BORDER}`, backgroundColor: "#FCFCFD" }}>
        <div className="text-[12px] font-semibold" style={{ color: INK }}>{title}</div>
        {right}
      </div>
      {children}
    </div>
  );
}

export function Pill({ children, color = MUTED, solid = false }: { children: ReactNode; color?: string; solid?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10.5px] font-medium rounded-md px-1.5 py-[2px] whitespace-nowrap"
      style={solid ? { backgroundColor: color, color: "#fff" } : { backgroundColor: `${color}14`, color }}
    >
      {children}
    </span>
  );
}

/** Evidence label. Links to the source when there is one. */
export function Tag({ kind, src }: { kind: Kind; src?: string }) {
  const m = KIND_META[kind];
  const s = src ? SOURCES[src] : undefined;
  const inner = (
    <span
      className="inline-flex items-center gap-1 text-[9.5px] font-semibold rounded px-1.5 py-[2px] align-middle whitespace-nowrap"
      style={{ backgroundColor: `${m.color}14`, color: m.color }}
      title={s ? `${m.note} — ${s.label}` : m.note}
    >
      {m.label}
      {s && <ExternalLink size={8.5} strokeWidth={2.5} />}
    </span>
  );
  return s ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">{inner}</a>
  ) : inner;
}

export function Note({ text, kind, src }: { text: string; kind: Kind; src?: string }) {
  return (
    <p className="text-[12.5px] leading-[1.6]" style={{ color: MUTED }}>
      {text} <Tag kind={kind} src={src} />
    </p>
  );
}

export function Stat({ value, label, kind, src, color = INK }: { value: string; label: string; kind?: Kind; src?: string; color?: string }) {
  return (
    <div>
      <div className="text-[22px] md:text-[26px] font-bold tracking-tight tabular-nums leading-none" style={{ color }}>{value}</div>
      <div className="text-[12px] leading-[1.5] mt-1.5" style={{ color: MUTED }}>
        {label} {kind && <Tag kind={kind} src={src} />}
      </div>
    </div>
  );
}

export function Disclosure({ label, children, defaultOpen = false }: { label: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#FCFCFD] transition-colors"
        aria-expanded={open}
      >
        <span className="text-[14px] font-semibold" style={{ color: INK }}>{label}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: MUTED }} />
      </button>
      {open && <div className="px-5 pb-5" style={{ borderTop: `1px solid ${BORDER}` }}>{children}</div>}
    </div>
  );
}

export function Slider({ label, value, min, max, step, format, onChange, note }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (n: number) => string; onChange: (n: number) => void; note?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <label className="text-[12px]" style={{ color: INK }}>{label}</label>
        <span className="text-[12.5px] font-semibold tabular-nums" style={{ color: BRAND }}>{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#2563EB]" aria-label={label}
      />
      {note && <div className="text-[10.5px] mt-0.5" style={{ color: FAINT }}>{note}</div>}
    </div>
  );
}

export const fmtINR = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} lakh`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
export const fmtNum = (n: number) => Math.round(n).toLocaleString("en-IN");
