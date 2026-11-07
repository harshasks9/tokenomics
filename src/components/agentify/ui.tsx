"use client";

import { CircleCheck, CircleDashed, CircleDot, CircleHelp, Rocket, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { PersonaId, Stage } from "@/lib/agentify/types";
import type { Play, UsageStats } from "@/lib/agentify/model";
import type { Status } from "@/lib/agentify/plan";

export const usd = (n: number) => (n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e4 ? `$${Math.round(n / 1e3)}k` : `$${Math.round(n).toLocaleString("en-US")}`);
export const pct = (x: number) => `${Math.round(x * 100)}%`;
export const num = (n: number) => Math.round(n).toLocaleString("en-US");

export const PERSONA_NAME: Record<PersonaId, string> = { customer: "Workspace customer", partner: "Partner", google: "Google — central team" };

export function Avatar({ initials, kind }: { initials: string; kind: PersonaId }) {
  const k = kind === "google" ? "google" : kind === "partner" ? "partner" : "customer";
  return <span className="ag-avatar" data-k={k} aria-hidden>{initials}</span>;
}

export function Metric({ label, value, sub, tone }: { label: string; value: ReactNode; sub?: ReactNode; tone?: "internal" }) {
  return (
    <div className={`ag-card ag-metric ${tone === "internal" ? "internal" : ""}`}>
      <div className="ag-metric-label">{label}</div>
      <div className="ag-metric-value">{value}</div>
      {sub && <div className="ag-metric-sub">{sub}</div>}
    </div>
  );
}

export function Head({ eyebrow, title, lede, right }: { eyebrow: string; title: string; lede?: ReactNode; right?: ReactNode }) {
  return (
    <div className="ag-page-head">
      <div style={{ flex: 1, minWidth: 260 }}>
        <div className="ag-eyebrow">{eyebrow}</div>
        <h1 className="ag-h1">{title}</h1>
        {lede && <p className="ag-lede">{lede}</p>}
      </div>
      {right}
    </div>
  );
}

export function SectionHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="ag-section-head">
      <h2 className="ag-h2">{title}</h2>
      {sub && <span className="ag-muted" style={{ fontSize: 13 }}>{sub}</span>}
      {right && <><span className="ag-spacer" />{right}</>}
    </div>
  );
}

const STAGE_TONE: Record<Stage, string> = { qualified: "", scheduled: "v-workspace", agentified: "t-field", using: "ok", expanding: "t-verified" };
const STAGE_ICON: Record<Stage, typeof CircleDot> = { qualified: CircleDashed, scheduled: CircleDot, agentified: Sparkles, using: CircleCheck, expanding: TrendingUp };
export const STAGE_LABEL: Record<Stage, string> = { qualified: "Qualified", scheduled: "Workshop booked", agentified: "Agentified", using: "Using", expanding: "Expanding" };

export function StageTag({ s }: { s: Stage }) {
  const Icon = STAGE_ICON[s];
  return <span className={`ag-tag ${STAGE_TONE[s]}`}><Icon size={11} />{STAGE_LABEL[s]}</span>;
}

const PLAY_TONE: Record<Play, string> = { activate: "warn", deepen: "v-workspace", expand: "ok", "upgrade-first": "v-org", "not-now": "" };
const PLAY_ICON: Record<Play, typeof Zap> = { activate: Zap, deepen: CircleDot, expand: Rocket, "upgrade-first": TrendingUp, "not-now": CircleDashed };

export function PlayTag({ play, label }: { play: Play; label: string }) {
  const Icon = PLAY_ICON[play];
  return <span className={`ag-tag ${PLAY_TONE[play]}`}><Icon size={11} />{label}</span>;
}

export function StatusTag({ s }: { s: Status }) {
  if (s === "decided") return <span className="ag-tag ok"><CircleCheck size={11} />Decided</span>;
  if (s === "proposed") return <span className="ag-tag warn"><CircleHelp size={11} />Proposed — confirm</span>;
  return <span className="ag-tag"><CircleDashed size={11} />Open</span>;
}

/**
 * Users by agentic tasks per week. One hue (magnitude); median and mean drawn
 * as labeled rules so the gap between them is the story.
 */
export function Histogram({ u, height = 150 }: { u: UsageStats; height?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...u.histogram.map((h) => h.users));
  const total = u.histogram.reduce((s, h) => s + h.users, 0);
  const bucketOf = (v: number) => (v === 0 ? 0 : v < 1 ? 1 : v < 2 ? 2 : v < 5 ? 3 : v < 10 ? 4 : 5);
  const marker = (v: number, label: string, cls: string) => {
    const i = bucketOf(v);
    const left = ((i + 0.5) / u.histogram.length) * 100;
    return <div className={`ag-hist-mark ${cls}`} style={{ left: `${left}%` }}><span>{label} {v}</span></div>;
  };
  return (
    <figure className="ag-hist" style={{ margin: 0 }}>
      <div className="ag-hist-plot" style={{ height }} role="img" aria-label={`Users by agentic tasks per week. Median ${u.median}, mean ${u.mean}.`}>
        {u.histogram.map((h, i) => (
          <div key={h.bucket} className="ag-hist-col" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} tabIndex={0}>
            <div className="ag-hist-bar" style={{ height: `${(h.users / max) * 100}%` }} data-zero={h.bucket === "0" || undefined} />
            {hover === i && <div className="ag-tip">{h.bucket} tasks/week<br /><b>{num(h.users)}</b> users · {pct(h.users / Math.max(1, total))}</div>}
          </div>
        ))}
        {marker(u.median, "median", "median")}
        {marker(u.mean, "mean", "mean")}
      </div>
      <div className="ag-hist-axis">{u.histogram.map((h) => <span key={h.bucket}>{h.bucket}</span>)}</div>
      <figcaption className="ag-muted" style={{ fontSize: 12, marginTop: 4 }}>Users by agentic tasks per week (sample of up to 2,000 seats)</figcaption>
    </figure>
  );
}

/** Horizontal single-series bars with value labels in ink. */
export function Bars({ rows, max, format = (v: number) => String(v), threshold }: { rows: { label: string; value: number; sub?: string }[]; max?: number; format?: (v: number) => string; threshold?: { value: number; label: string } }) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value), threshold?.value ?? 0);
  return (
    <div className="ag-bars">
      {rows.map((r) => (
        <div key={r.label} className="ag-bars-row" title={`${r.label}: ${format(r.value)}${r.sub ? ` · ${r.sub}` : ""}`}>
          <span className="ag-bars-label">{r.label}</span>
          <span className="ag-bars-track">
            <i style={{ width: `${Math.max(1.5, (r.value / m) * 100)}%` }} />
            {threshold && <b style={{ left: `${(threshold.value / m) * 100}%` }} title={threshold.label} />}
          </span>
          <span className="ag-bars-value ag-num">{format(r.value)}</span>
        </div>
      ))}
      {threshold && <div className="ag-muted" style={{ fontSize: 11.5, marginTop: 4 }}>┃ {threshold.label}</div>}
    </div>
  );
}
