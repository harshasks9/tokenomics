"use client";

import { ChevronDown, ExternalLink, Link2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SOURCE_BY_ID, SOURCE_NUMBER } from "@/lib/clicks-to-delegation/sources";
import type { EvidenceKind } from "@/lib/clicks-to-delegation/types";

export const EV_LABEL: Record<EvidenceKind, string> = {
  measured: "Measured",
  survey: "Survey",
  "company-claim": "Company claim",
  "analyst-estimate": "Analyst estimate",
  "expert-judgment": "Our judgment",
  illustrative: "Illustrative",
  projection: "Projection",
};

const EV_HELP: Record<EvidenceKind, string> = {
  measured: "Government statistics, regulatory filings or measured panel data.",
  survey: "Self-reported attitudes or intentions; people often do less than they say.",
  "company-claim": "Reported by the company itself and not independently verified.",
  "analyst-estimate": "A third-party estimate built on partial data.",
  "expert-judgment": "This report's researched judgment, with the reasoning shown.",
  illustrative: "A modeled or hypothetical figure for exploring logic. Not a fact or a forecast.",
  projection: "A third-party forecast of the future.",
};

export function Ev({ kind }: { kind: EvidenceKind }) {
  return <span className={`ctd-ev ${kind}`} title={EV_HELP[kind]}>{EV_LABEL[kind]}</span>;
}

/* ── Citations ───────────────────────────────────────────── */
type PopState = { id: string; x: number; y: number; sy?: number } | null;
let openPop: ((p: PopState) => void) | null = null;

export function CitationLayer() {
  const [pop, setPop] = useState<PopState>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    openPop = setPop;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && ref.current?.contains(e.target as Node)) return;
      if (e instanceof MouseEvent && (e.target as HTMLElement).closest?.(".ctd-cite")) return;
      setPop(null);
    };
    const onScroll = () => setPop((p) => (p && Math.abs(window.scrollY - (p.sy ?? 0)) > 160 ? null : p));
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", close);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { openPop = null; window.removeEventListener("mousedown", close); window.removeEventListener("keydown", close); window.removeEventListener("scroll", onScroll); };
  }, []);
  if (!pop) return null;
  const s = SOURCE_BY_ID[pop.id];
  if (!s) return null;
  // Document coordinates: the popover scrolls with its citation.
  const left = Math.max(12, Math.min(pop.x - 20, window.innerWidth - 372)) + window.scrollX;
  const top = pop.y + 12 + (pop.sy ?? 0);
  return (
    <div ref={ref} className="ctd-pop" role="dialog" aria-label="Source" style={{ left, top }}>
      <b>{s.title}</b>
      <div className="ctd-muted">{s.publisher} · {s.published} · {TYPE_LABEL[s.type]}</div>
      <a href={s.url} target="_blank" rel="noreferrer noopener" style={{ display: "inline-flex", gap: 4, alignItems: "center", marginTop: 6 }}>Open source <ExternalLink size={12} /></a>
      <div style={{ marginTop: 6 }}><a href={`#src-${s.id}`} onClick={() => setPop(null)}>See in source library</a></div>
    </div>
  );
}

const TYPE_LABEL: Record<string, string> = {
  government: "Government data", filing: "Filing / annual report", academic: "Academic", survey: "Survey", analyst: "Analyst", press: "Press", "company-claim": "Company statement",
};
export { TYPE_LABEL };

export function Cite({ ids }: { ids?: string[] }) {
  const valid = (ids ?? []).filter((id) => SOURCE_BY_ID[id]);
  if (!valid.length) return null;
  return (
    <span className="ctd-cite">
      {valid.map((id) => (
        <button key={id} type="button" aria-label={`Source ${SOURCE_NUMBER[id]}: ${SOURCE_BY_ID[id].title}`}
          onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); openPop?.({ id, x: r.left, y: r.bottom, sy: window.scrollY }); }}>
          {SOURCE_NUMBER[id]}
        </button>
      ))}
    </span>
  );
}

/* ── Section frame ───────────────────────────────────────── */
export function Section({ id, num, title, dek, takeaway, children }: { id: string; num: string; title: string; dek?: string; takeaway?: React.ReactNode; children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const url = `${location.origin}${location.pathname}#${id}`;
    navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {});
  }, [id]);
  return (
    <section id={id} className="ctd-section" aria-labelledby={`${id}-h`}>
      <header className="ctd-sec-head">
        <span className="ctd-sec-num">{num}</span>
        <h2 id={`${id}-h`}>{title}<a href={`#${id}`} className="ctd-anchor" onClick={copy} aria-label={`Copy link to section ${num}`}>{copied ? "Copied" : <Link2 size={15} />}</a></h2>
        {dek && <p className="ctd-sec-dek">{dek}</p>}
      </header>
      {takeaway && <div className="ctd-takeaway"><b>Takeaway</b><p>{takeaway}</p></div>}
      {children}
    </section>
  );
}

export function Details({ title, children, deep = true, open = false }: { title: React.ReactNode; children: React.ReactNode; deep?: boolean; open?: boolean }) {
  return (
    <details className={`ctd-details ${deep ? "ctd-deep" : ""}`} open={open}>
      <summary>{title}<ChevronDown size={16} /></summary>
      <div className="ctd-details-body">{children}</div>
    </details>
  );
}

export function Fig({ title, sub, controls, foot, children, className = "" }: { title: string; sub?: React.ReactNode; controls?: React.ReactNode; foot?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`ctd-figure ${className}`}>
      <div className="ctd-fig-head">
        <div><div className="ctd-fig-title">{title}</div>{sub && <div className="ctd-fig-sub">{sub}</div>}</div>
        {controls}
      </div>
      {children}
      {foot && <figcaption className="ctd-fig-foot">{foot}</figcaption>}
    </figure>
  );
}

export function Slider({ label, value, min, max, step = 1, unit = "", onChange, help, fmt }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; onChange: (v: number) => void; help?: string; fmt?: (v: number) => string }) {
  const id = `s-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="ctd-slider">
      <div className="ctd-slider-top"><label htmlFor={id}>{label}</label><b>{fmt ? fmt(value) : `${value}${unit}`}</b></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {help && <small>{help}</small>}
    </div>
  );
}

export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="ctd-seg" role="group" aria-label={label}>
      {options.map((o) => <button key={o.id} type="button" aria-pressed={o.id === value} onClick={() => onChange(o.id)}>{o.label}</button>)}
    </div>
  );
}

/** Small "show as table" toggle used by every chart (relief rule for low-contrast hues). */
export function useTableToggle() {
  const [table, setTable] = useState(false);
  const toggle = <button type="button" className="ctd-chip" aria-pressed={table} onClick={() => setTable((t) => !t)}>{table ? "Show chart" : "Show table"}</button>;
  return { table, toggle };
}
