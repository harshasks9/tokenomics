"use client";

import type { ReactNode } from "react";
import { ACTION_CLASS, type ActionClass } from "@/lib/ge-citizen/data";

export const INK = "#202124";
export const MUTED = "#5F6368";
export const BORDER = "#E8EAED";
export const ACCENT = "#1A73E8";

export function Section({
  id,
  eyebrow,
  title,
  lede,
  alt,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  alt?: boolean;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-4 px-4 py-16 sm:px-8 sm:py-20 ${alt ? "bg-[#F8F9FA]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1A73E8]">{eyebrow}</p>
        <h2 className="mt-2 text-[26px] font-semibold leading-tight tracking-[-0.01em] text-[#202124] sm:text-[32px]">{title}</h2>
        {lede && <div className="mt-3 max-w-3xl text-[15px] leading-relaxed text-[#5F6368]">{lede}</div>}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function ClassBadge({ c, size = "sm" }: { c: ActionClass; size?: "sm" | "xs" }) {
  const a = ACTION_CLASS[c];
  return (
    <span
      title={a.rule}
      className={`inline-flex items-center whitespace-nowrap rounded-full font-semibold ${size === "xs" ? "px-2 py-[1px] text-[10px]" : "px-2.5 py-0.5 text-[11px]"}`}
      style={{ color: a.color, background: a.bg }}
    >
      {size === "xs" ? a.short : a.label}
    </span>
  );
}

/** Basis tag: every figure on the page says whether it is illustrative or from project material. */
export function Basis({ kind }: { kind: "illustrative" | "project" | "assumption" | "requirement" }) {
  const map = {
    illustrative: { t: "Illustrative", c: "#5F6368", b: "#F1F3F4" },
    assumption: { t: "Editable assumption", c: "#5F6368", b: "#F1F3F4" },
    project: { t: "From project material", c: "#137333", b: "#E6F4EA" },
    requirement: { t: "Requirement — not yet in place", c: "#B06000", b: "#FEF7E0" },
  }[kind];
  return (
    <span className="inline-flex items-center rounded px-1.5 py-[1px] text-[10px] font-semibold uppercase tracking-wide" style={{ color: map.c, background: map.b }}>
      {map.t}
    </span>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-medium text-[#3C4043]">{label}</span>
        <span className="tabular-nums text-[13px] font-semibold text-[#202124]">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 w-full accent-[#1A73E8]"
        aria-label={label}
      />
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-[#80868B]">{hint}</p>}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  prefix,
  step = 1,
  min = 0,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  step?: number;
  min?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-[#3C4043]">{label}</span>
      <div className="mt-1 flex items-center rounded-lg border border-[#DADCE0] bg-white px-2.5 focus-within:border-[#1A73E8]">
        {prefix && <span className="mr-1 text-[13px] text-[#80868B]">{prefix}</span>}
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v) && v >= min) onChange(v);
          }}
          className="tabular-nums w-full bg-transparent py-1.5 text-[13px] font-semibold text-[#202124] outline-none"
        />
      </div>
      {hint && <p className="mt-0.5 text-[11px] leading-snug text-[#80868B]">{hint}</p>}
    </label>
  );
}
