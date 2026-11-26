"use client";

import { useId, useState, type ReactNode } from "react";

export const fmt$ = (v: number, dp = 0) => {
  if (!Number.isFinite(v)) return "—";
  const s = Math.abs(v).toFixed(dp);
  return `${v < 0 ? "−" : ""}$${s}`;
};
export const fmtPct = (v: number | null, dp = 0) => (v === null || !Number.isFinite(v) ? "—" : `${v < 0 ? "−" : ""}${Math.abs(v * 100).toFixed(dp)}%`);
export const fmtX = (v: number, dp = 1) => (Number.isFinite(v) ? `${v.toFixed(dp)}×` : "never");
export const fmtMonths = (m: number) => {
  if (!Number.isFinite(m)) return "never";
  if (m <= 0.05) return "instant";
  if (m < 24) return `${Math.round(m)} mo`;
  return `${(m / 12).toFixed(1)} yrs`;
};

export type Basis = "D" | "R" | "A" | "C";
const BASIS_LABEL: Record<Basis, string> = { D: "Disclosed", R: "Reported", A: "Assumption", C: "Calculated" };
const BASIS_TITLE: Record<Basis, string> = {
  D: "Disclosed in a company filing",
  R: "Reported estimate — company statement or credible press, not audited",
  A: "Our assumption — change it and watch the answer move",
  C: "Our arithmetic on disclosed or reported numbers",
};
export function Tag({ b }: { b: Basis }) {
  return <span className={`sm-tag ${b.toLowerCase()}`} title={BASIS_TITLE[b]}>{BASIS_LABEL[b]}</span>;
}

export function Section({ id, n, kicker, title, lede, children }: { id: string; n: string; kicker: string; title: ReactNode; lede?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} className="sm-section" aria-labelledby={`${id}-h`}>
      <div className="sm-wrap">
        <div className="sm-kicker"><i>{n}</i>{kicker}</div>
        <h2 id={`${id}-h`} className="sm-h2">{title}</h2>
        {lede && <p className="sm-lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function Explain({ children }: { children: ReactNode }) {
  return <div className="sm-explain">{children}</div>;
}

export function Slider({ label, value, min, max, step, onChange, format, help }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string; help?: string;
}) {
  const id = useId();
  return (
    <div className="sm-slider">
      <label htmlFor={id}><span>{label}</span><b>{format(value)}</b></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      {help && <small>{help}</small>}
    </div>
  );
}

export function Seg<T extends string | number>({ options, value, onChange, label }: { options: { v: T; l: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="sm-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={String(o.v)} type="button" aria-pressed={o.v === value} onClick={() => onChange(o.v)}>{o.l}</button>
      ))}
    </div>
  );
}

/** Hover tooltip anchored inside a .sm-rel container. */
export function useTip() {
  const [tip, setTip] = useState<{ x: number; y: number; html: ReactNode } | null>(null);
  const node = tip ? <div className="sm-tip" style={{ left: tip.x, top: tip.y }}>{tip.html}</div> : null;
  return { tip, setTip, node };
}

export interface Series { key: string; label: string; short?: string; color: string; values: (number | null)[]; dash?: boolean }

/** Line chart with crosshair tooltip. One y-axis. */
export function LineChart({ x, series, yFormat, height = 260, yMin, yMax, ariaLabel, zeroLine, width = 720 }: {
  x: string[]; series: Series[]; yFormat: (v: number) => string; height?: number; yMin?: number; yMax?: number; ariaLabel: string; zeroLine?: boolean; width?: number;
}) {
  const W = width, H = height, padL = 52, padR = 96, padT = 14, padB = 34;
  const all = series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const lo = yMin ?? Math.min(0, ...all);
  const hi = yMax ?? Math.max(...all) * 1.08;
  const xs = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, x.length - 1);
  const ys = (v: number) => padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo || 1));
  const ticks = 4;
  const [hover, setHover] = useState<number | null>(null);
  // End labels: nudge apart so close series stay readable.
  const ends = series
    .map((s) => {
      const i = s.values.reduce<number>((acc, v, k) => (v !== null ? k : acc), -1);
      return { key: s.key, i, y: i >= 0 ? ys(s.values[i] as number) : 0 };
    })
    .filter((e) => e.i >= 0)
    .sort((a, b) => a.y - b.y);
  for (let k = 1; k < ends.length; k += 1) if (ends[k].y - ends[k - 1].y < 14) ends[k].y = ends[k - 1].y + 14;
  const labelY = Object.fromEntries(ends.map((e) => [e.key, e.y]));
  return (
    <div className="sm-rel">
      <svg viewBox={`0 0 ${W} ${H}`} className="sm-chart" role="img" aria-label={ariaLabel}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * W;
          const i = Math.round(((px - padL) / (W - padL - padR)) * (x.length - 1));
          setHover(Math.max(0, Math.min(x.length - 1, i)));
        }}>
        {Array.from({ length: ticks + 1 }, (_, k) => lo + ((hi - lo) * k) / ticks).map((t) => (
          <g key={t}>
            <line className="grid" x1={padL} x2={W - padR} y1={ys(t)} y2={ys(t)} />
            <text x={padL - 8} y={ys(t) + 4} textAnchor="end" className="mut">{yFormat(t)}</text>
          </g>
        ))}
        {zeroLine && lo < 0 && <line className="axis" x1={padL} x2={W - padR} y1={ys(0)} y2={ys(0)} />}
        {x.map((l, i) => (i % Math.ceil(x.length / 9) === 0 || i === x.length - 1) && (
          <text key={l} x={xs(i)} y={H - 10} textAnchor="middle" className="mut">{l}</text>
        ))}
        {series.map((s) => {
          const pts = s.values.map((v, i) => (v === null ? null : `${xs(i)},${ys(v)}`));
          const segs: string[] = [];
          let cur: string[] = [];
          pts.forEach((p) => { if (p) cur.push(p); else if (cur.length) { segs.push(cur.join(" ")); cur = []; } });
          if (cur.length) segs.push(cur.join(" "));
          const lastIdx = s.values.reduce<number>((acc, v, i) => (v !== null ? i : acc), -1);
          return (
            <g key={s.key}>
              {segs.map((d, k) => <polyline key={k} points={d} fill="none" stroke={s.color} strokeWidth={2} strokeDasharray={s.dash ? "5 4" : undefined} strokeLinejoin="round" strokeLinecap="round" />)}
              {lastIdx >= 0 && (
                <>
                  <circle cx={xs(lastIdx)} cy={ys(s.values[lastIdx] as number)} r={4} fill={s.color} stroke="var(--card)" strokeWidth={2} />
                  <text x={xs(lastIdx) + 8} y={(labelY[s.key] ?? ys(s.values[lastIdx] as number)) + 4} className="lbl">{s.short ?? s.label}</text>
                </>
              )}
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <line x1={xs(hover)} x2={xs(hover)} y1={padT} y2={H - padB} stroke="var(--axis)" strokeDasharray="3 3" />
            {series.map((s) => s.values[hover] !== null && (
              <circle key={s.key} cx={xs(hover)} cy={ys(s.values[hover] as number)} r={4.5} fill={s.color} stroke="var(--card)" strokeWidth={2} />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="sm-tip" style={{ left: `${(xs(hover) / W) * 100}%`, top: 8, transform: "translate(-50%, 0)" }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>{x[hover]}</div>
          {series.map((s) => (
            <div key={s.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="sm-dot" style={{ background: s.color }} />{s.label}: <b>{s.values[hover] === null ? "n/a" : yFormat(s.values[hover] as number)}</b>
            </div>
          ))}
        </div>
      )}
      {series.length > 1 && (
        <div className="sm-legend">
          {series.map((s) => <span key={s.key}><span className="sm-dot" style={{ background: s.color }} />{s.label}</span>)}
        </div>
      )}
    </div>
  );
}

/** Horizontal stacked bar summing to `total` (the $100). Segments carry their own label. */
export function StackBar({ segments, total = 100, ariaLabel }: { segments: { key: string; label: string; value: number; color: string; light?: boolean }[]; total?: number; ariaLabel: string }) {
  const { node, setTip } = useTip();
  const shown = segments.filter((s) => s.value > 0.05);
  return (
    <div className="sm-rel" aria-label={ariaLabel} role="img">
      <div className="sm-bar">
        {shown.map((s) => (
          <div key={s.key} className={s.light ? "lt" : undefined}
            style={{ flex: `0 0 calc(${(s.value / total) * 100}% - 2px)`, background: s.color }}
            onMouseMove={(e) => {
              const host = (e.currentTarget.parentElement?.parentElement as HTMLElement).getBoundingClientRect();
              setTip({ x: e.clientX - host.left, y: e.clientY - host.top, html: <span>{s.label}: <b>${s.value.toFixed(1)}</b></span> });
            }}
            onMouseLeave={() => setTip(null)}>
            {s.value / total > 0.07 ? `$${s.value.toFixed(0)}` : ""}
          </div>
        ))}
      </div>
      {node}
    </div>
  );
}
