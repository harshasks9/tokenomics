"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Download, ExternalLink, Table2, BarChart3 } from "lucide-react";
import { evidenceById, section, SOURCES, type Classification } from "@/lib/under-the-hood/data";
import { toCsv } from "@/lib/under-the-hood/format";

export const PALETTE = {
  s1: "#2a78d6", s2: "#eb6834", s3: "#1baf7a", s4: "#eda100", s5: "#e87ba4", s6: "#008300", s7: "#6250d6", s8: "#e34948",
  grid: "#e1e0d9", axis: "#c3c2b7", muted: "#767b83", ink: "#121417", ink2: "#464b53", paper: "#fbfaf7", card: "#ffffff",
  accent: "#183b63", good: "#0ca30c", warn: "#fab219", bad: "#d03b3b",
};

/* ------------------------------------------------------------------ layout */
export function Section({ id, children }: { id: string; children: ReactNode }) {
  const s = section(id);
  return (
    <section id={id} className="uth-section" aria-labelledby={`${id}-h`}>
      <div className="uth-wrap">
        <header className="uth-sec-head">
          <div className="uth-sec-num" aria-hidden>{s.n}</div>
          <div>
            <div className="uth-kicker">Section {s.n} · {s.kicker}</div>
            <h2 id={`${id}-h`} className="uth-h2">{s.headline}</h2>
            <p className="uth-dek">{s.dek}</p>
          </div>
        </header>
        {children}
        <aside className="uth-implication" aria-label="What this means">
          <div className="uth-h4">What this means for the AI industry and its competitors</div>
          <p>{s.implication}</p>
        </aside>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ badges */
const CLASS_LABEL: Record<Classification, string> = {
  reported: "Reported fact", calculated: "Calculated", inference: "Inference", assumption: "Assumption", hypothesis: "Hypothesis",
};
export function ClassBadge({ kind }: { kind: Classification }) {
  return <span className={`uth-badge ${kind}`} title={CLASS_LABEL[kind]}>{CLASS_LABEL[kind]}</span>;
}
export function ConfBadge({ level }: { level: string }) {
  const k = level.toLowerCase().startsWith("h") ? "high" : level.toLowerCase().startsWith("m") ? "medium" : "low";
  return <span className={`uth-badge ${k}`}>Confidence: {level}</span>;
}
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`uth-badge ${tone}`}>{children}</span>;
}

/* ------------------------------------------------------------------ citations */
/** Inline evidence chip. Click (or focus + Enter) to see the verbatim quote, page and source link. */
export function Cite({ id, label }: { id: string; label?: string }) {
  const e = evidenceById(id);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const pid = useId();
  useEffect(() => {
    if (!open) return;
    const close = (ev: MouseEvent) => { if (ref.current && !ref.current.contains(ev.target as Node)) setOpen(false); };
    const esc = (ev: KeyboardEvent) => { if (ev.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);
  if (!e) return null;
  const src = SOURCES[e.sourceId];
  const text = label ?? `${e.sourceId === "s1a" ? "S-1/A" : "S-1"} p.${e.page ?? "—"}`;
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <button type="button" className="uth-cite" aria-expanded={open} aria-controls={pid} onClick={() => setOpen((o) => !o)}>
        {text}
      </button>
      {open && (
        <span id={pid} role="dialog" aria-label={`Source for ${e.metric}`} className="uth-pop">
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <ClassBadge kind={e.classification} /> <span className="uth-xs">{e.period}</span>
          </span>
          <strong style={{ display: "block", marginTop: 6 }}>{e.metric}</strong>
          <q>{e.quote}</q>
          {e.formula && <span style={{ display: "block" }}><b>Formula:</b> {e.formula}</span>}
          {e.caveat && <span style={{ display: "block", marginTop: 4, color: "#767b83" }}><b>Caveat:</b> {e.caveat}</span>}
          <span style={{ display: "block", marginTop: 8 }}>
            {e.section} · p.{e.page} · <a href={src.url} target="_blank" rel="noreferrer">{src.label} <ExternalLink size={11} style={{ verticalAlign: -1 }} /></a>
          </span>
        </span>
      )}
    </span>
  );
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer">{children}<ExternalLink size={11} style={{ marginLeft: 3, verticalAlign: -1 }} aria-hidden /></a>;
}

/* ------------------------------------------------------------------ KPI */
export function Kpi({ label, value, delta, tone, period, cite, kind = "reported", note }: {
  label: string; value: string; delta?: string; tone?: "up" | "down"; period: string; cite?: string; kind?: Classification; note?: string;
}) {
  return (
    <div className="uth-card uth-kpi">
      <div className="uth-kpi-label">{label}</div>
      <div className="uth-kpi-value tnum">{value}</div>
      {delta && <div className={`uth-kpi-delta ${tone ?? ""}`}>{delta}</div>}
      {note && <div className="uth-xs">{note}</div>}
      <div className="uth-kpi-meta">
        <span>{period}</span>
        {kind !== "reported" && <ClassBadge kind={kind} />}
        {cite && <Cite id={cite} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ controls */
export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="uth-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}
export function Slider({ label, value, min, max, step, onChange, format, hint }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string; hint?: string;
}) {
  const id = useId();
  return (
    <div className="uth-slider">
      <label htmlFor={id}><span>{label}</span><b>{format(value)}</b></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-valuetext={format(value)} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="uth-toggle"><input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />{label}</label>
  );
}

/* ------------------------------------------------------------------ data table / download */
export interface Col<R> { key: string; label: string; num?: boolean; render?: (r: R) => ReactNode }
export function DataTable<R extends Record<string, unknown>>({ cols, rows, caption, totalRow, minWidth }: { cols: Col<R>[]; rows: R[]; caption?: string; totalRow?: (r: R) => boolean; minWidth?: number }) {
  return (
    <div className="uth-tablewrap">
      <table className="uth-table" style={minWidth ? { minWidth } : undefined}>
        {caption && <caption className="uth-sr">{caption}</caption>}
        <thead><tr>{cols.map((c) => <th key={c.key} className={c.num ? "num" : ""} scope="col">{c.label}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={totalRow?.(r) ? "total" : ""}>
              {cols.map((c) => <td key={c.key} className={c.num ? "num" : ""}>{c.render ? c.render(r) : String(r[c.key] ?? "")}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function downloadText(filename: string, text: string, type = "text/csv") {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function DownloadCsv({ filename, rows, label = "Download CSV" }: { filename: string; rows: Record<string, unknown>[]; label?: string }) {
  return (
    <button type="button" className="uth-btn" onClick={() => downloadText(filename, toCsv(rows))}>
      <Download size={14} aria-hidden /> {label}
    </button>
  );
}

/** Wraps a chart with: accessible summary, legend, "view data" table toggle, CSV download, source note. */
export function ChartFrame({ title, summary, legend, children, rows, cols, filename, note, controls }: {
  title?: string; summary: string; legend?: { label: string; color: string; dashed?: boolean }[]; children: ReactNode;
  rows: Record<string, unknown>[]; cols: Col<Record<string, unknown>>[]; filename: string; note?: ReactNode; controls?: ReactNode;
}) {
  const [table, setTable] = useState(false);
  return (
    <figure className="uth-chart" style={{ margin: 0 }}>
      {(title || controls) && (
        <div className="uth-toolbar">
          {title && <figcaption className="uth-h4" style={{ margin: 0 }}>{title}</figcaption>}
          {controls}
        </div>
      )}
      <p className="uth-sr">{summary}</p>
      {legend && legend.length > 1 && !table && (
        <div className="uth-legend" aria-hidden>
          {legend.map((l) => <span key={l.label}><i className={l.dashed ? "dash" : ""} style={{ background: l.color, color: l.color }} />{l.label}</span>)}
        </div>
      )}
      {table ? <DataTable cols={cols} rows={rows} caption={summary} /> : children}
      <div className="uth-chart-foot">
        <span>{note}</span>
        <span style={{ display: "flex", gap: 8 }}>
          <button type="button" className="uth-btn" onClick={() => setTable((t) => !t)} aria-pressed={table}>
            {table ? <BarChart3 size={14} aria-hidden /> : <Table2 size={14} aria-hidden />} {table ? "View chart" : "View data"}
          </button>
          <DownloadCsv filename={filename} rows={rows} />
        </span>
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ recharts tooltip */
type TipPayload = { name?: string; value?: number | string; color?: string; dataKey?: string | number; payload?: Record<string, unknown> };
export function makeTip(fmt: (v: number, key: string) => string, title?: (label: string, p?: Record<string, unknown>) => string) {
  return function Tip(props: unknown) {
    const { active, payload, label } = props as { active?: boolean; payload?: TipPayload[]; label?: string | number };
    if (!active || !payload || !payload.length) return null;
    const p0 = payload[0]?.payload;
    return (
      <div className="uth-tip">
        <div className="t">{title ? title(String(label ?? ""), p0) : String(label ?? "")}</div>
        {payload.filter((p) => p.value !== null && p.value !== undefined).map((p) => (
          <div className="r" key={String(p.dataKey)}>
            <span><i style={{ background: p.color }} />{p.name}</span>
            <b>{typeof p.value === "number" ? fmt(p.value, String(p.dataKey)) : p.value}</b>
          </div>
        ))}
      </div>
    );
  };
}

/** Classification legend used near analytical charts. */
export function KindsLegend({ kinds }: { kinds: Classification[] }) {
  return <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>{kinds.map((k) => <ClassBadge key={k} kind={k} />)}</span>;
}
