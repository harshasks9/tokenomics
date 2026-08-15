"use client";

import { ReactNode, useState } from "react";
import { ExternalLink } from "lucide-react";
import { KIND_META, SOURCES, type Kind } from "./data";

export const PAPER = "#F6F3EE";
export const INK = "#16130F";
export const MUTED = "#6B6259";
export const RULE = "#E2DBD0";
export const STALL = "#B4413C";
export const AGENT = "#0F766E";
export const GATE = "#9A6B12";

export const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

export function Kicker({ children, color = MUTED }: { children: ReactNode; color?: string }) {
  return (
    <div className="text-[10px] font-bold uppercase mb-3" style={{ color, letterSpacing: "0.22em" }}>
      {children}
    </div>
  );
}

export function Display({ children, size = "lg" }: { children: ReactNode; size?: "sm" | "lg" | "xl" }) {
  const cls = size === "xl" ? "text-[34px] md:text-[56px]" : size === "lg" ? "text-[26px] md:text-[40px]" : "text-[20px] md:text-[27px]";
  return (
    <h2 className={`${cls} leading-[1.08] tracking-[-0.02em]`} style={{ fontFamily: SERIF, color: INK }}>
      {children}
    </h2>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="text-[14.5px] md:text-[16px] leading-[1.65] max-w-[62ch]" style={{ color: MUTED }}>{children}</p>;
}

export function Rule() {
  return <div className="h-px w-full" style={{ backgroundColor: RULE }} />;
}

export function Section({ id, children, tint }: { id?: string; children: ReactNode; tint?: string }) {
  return (
    <section id={id} className="py-16 md:py-24 scroll-mt-16" style={tint ? { backgroundColor: tint } : undefined}>
      <div className="max-w-[1120px] mx-auto px-5 md:px-8">{children}</div>
    </section>
  );
}

/** Evidence chip — every factual claim on this page carries one. */
export function Tag({ kind, src }: { kind: Kind; src?: string }) {
  const m = KIND_META[kind];
  const s = src ? SOURCES[src] : undefined;
  const body = (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold uppercase rounded-[3px] px-1.5 py-[3px] align-middle whitespace-nowrap"
      style={{ backgroundColor: `${m.color}16`, color: m.color, letterSpacing: "0.08em" }}
      title={s ? `${m.note} — ${s.label}` : m.note}
    >
      {m.label}
      {s && <ExternalLink size={8} strokeWidth={2.5} />}
    </span>
  );
  return s ? (
    <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">{body}</a>
  ) : body;
}

export function Claim({ text, kind, src }: { text: string; kind: Kind; src?: string }) {
  return (
    <p className="text-[12.5px] leading-[1.6]" style={{ color: INK }}>
      {text} <Tag kind={kind} src={src} />
    </p>
  );
}

export function Chip({ children, color = MUTED, filled = false }: { children: ReactNode; color?: string; filled?: boolean }) {
  return (
    <span
      className="inline-block text-[10px] font-semibold rounded-full px-2 py-[3px] whitespace-nowrap"
      style={filled ? { backgroundColor: color, color: PAPER } : { backgroundColor: `${color}14`, color }}
    >
      {children}
    </span>
  );
}

export function Card({ children, accent, className = "" }: { children: ReactNode; accent?: string; className?: string }) {
  return (
    <div
      className={`rounded-[3px] bg-white ${className}`}
      style={{ border: `1px solid ${RULE}`, borderTop: accent ? `2px solid ${accent}` : undefined }}
    >
      {children}
    </div>
  );
}

export function Disclose({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="text-[11px] font-bold uppercase inline-flex items-center gap-1.5 hover:opacity-70"
        style={{ color: MUTED, letterSpacing: "0.14em" }}
        aria-expanded={open}
      >
        <span style={{ color: AGENT }}>{open ? "−" : "+"}</span> {label}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
