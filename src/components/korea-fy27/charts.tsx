"use client";

import type { ReactNode } from "react";
import { useTip } from "./ui";

/* All charts are HTML so labels reflow on small screens. Specs follow the
   dataviz method: ≤24px bars, 4px rounded data ends square at the baseline,
   2px surface gaps between touching fills, hairline axes, selective labels,
   and a hover / focus tooltip on every mark. */

export type WaterfallStep = {
  key: string;
  label: ReactNode;
  sub?: ReactNode;
  value: number;
  kind: "start" | "add" | "end";
  color: string;
  valueLabel: string;
  tip: ReactNode;
  dim?: boolean;
  onActivate?: () => void;
  ariaLabel: string;
};

/** Bar geometry for a waterfall: start / end bars rise from zero, adds float on the running total. */
function waterfallGeometry(steps: WaterfallStep[]) {
  const geo: { from: number; to: number; prev: number }[] = [];
  let running = 0;
  for (const step of steps) {
    if (step.kind === "add") {
      geo.push({ from: running, to: running + step.value, prev: running });
      running += step.value;
    } else {
      geo.push({ from: 0, to: step.value, prev: running });
      running = step.value;
    }
  }
  return geo;
}

export function Waterfall({ steps, height = 300, headroom = 1.12 }: { steps: WaterfallStep[]; height?: number; headroom?: number }) {
  const { bind, node } = useTip();
  const geo = waterfallGeometry(steps);
  const max = Math.max(...geo.map((g) => g.to)) * headroom;
  const pctOf = (v: number) => (v / max) * 100;

  return (
    <div style={{ position: "relative" }}>
      <div className="k-wf" style={{ ["--h" as string]: `${height}px` }} role="list">
        {steps.map((step, i) => {
          const g = geo[i];
          const bottom = pctOf(g.from);
          const h = Math.max(pctOf(g.to - g.from), 0.6);
          const Tag = step.onActivate ? "button" : "div";
          return (
            <div className="k-wf-col" key={step.key} role="listitem">
              <div className="k-wf-plot">
                {i > 0 ? (
                  <span
                    className="k-wf-link"
                    aria-hidden="true"
                    style={{ bottom: `${pctOf(step.kind === "end" ? g.to : g.prev)}%`, left: "calc(-50% + 2px)", width: "calc(100% - 14px)" }}
                  />
                ) : null}
                <Tag
                  type={step.onActivate ? "button" : undefined}
                  className={`k-wf-bar ${step.dim ? "dim" : ""}`}
                  style={{
                    bottom: `${bottom}%`,
                    height: `${h}%`,
                    background: step.color,
                    border: 0,
                    padding: 0,
                    borderRadius: step.kind === "add" ? "4px" : "4px 4px 0 0",
                  }}
                  aria-label={step.ariaLabel}
                  tabIndex={0}
                  onClick={step.onActivate}
                  {...bind(step.tip)}
                />
                <span className="k-wf-val" style={{ bottom: `calc(${bottom + h}% + 6px)` }}>
                  {step.valueLabel}
                </span>
              </div>
              <div className="k-wf-lab">
                {step.label}
                {step.sub ? <small>{step.sub}</small> : null}
              </div>
            </div>
          );
        })}
      </div>
      {node}
    </div>
  );
}

export type HBarRow = {
  key: string;
  label: ReactNode;
  sub?: ReactNode;
  value?: number;
  range?: [number, number];
  color: string;
  hatch?: boolean;
  valueLabel: ReactNode;
  tip: ReactNode;
  marker?: number;
};

export function HBars({ rows, max }: { rows: HBarRow[]; max?: number }) {
  const { bind, node } = useTip();
  const top = max ?? Math.max(...rows.map((r) => (r.range ? r.range[1] : r.value ?? 0))) * 1.05;
  const pct = (v: number) => `${(v / top) * 100}%`;
  return (
    <div className="k-bars" role="list">
      {rows.map((row) => (
        <div className="k-bar-row" key={row.key} role="listitem">
          <div className="lab">
            {row.label}
            {row.sub ? <small>{row.sub}</small> : null}
          </div>
          <div className="k-track" tabIndex={0} aria-label={typeof row.label === "string" ? `${row.label}: ${typeof row.valueLabel === "string" ? row.valueLabel : ""}` : undefined} {...bind(row.tip)}>
            {row.range ? (
              <>
                <span className={`bar ${row.hatch ? "k-hatch" : ""}`} style={{ width: pct(row.range[0]), background: row.hatch ? undefined : row.color }} />
                <span className="range" style={{ left: pct(row.range[0]), width: pct(row.range[1] - row.range[0]), background: row.color, opacity: 0.35 }} />
              </>
            ) : (
              <span className={`bar ${row.hatch ? "k-hatch" : ""}`} style={{ width: pct(row.value ?? 0), background: row.hatch ? undefined : row.color }} />
            )}
            {row.marker !== undefined ? <span className="tick" style={{ left: pct(row.marker) }} /> : null}
          </div>
          <div className="val">{row.valueLabel}</div>
        </div>
      ))}
      {node}
    </div>
  );
}

export type DumbbellRow = { key: string; label: ReactNode; sub?: ReactNode; from: number; to: number; fromLabel: string; toLabel: string; tip: ReactNode };

/** Before → after per item: one hue, two shades. */
export function Dumbbell({ rows, max, fromName, toName, color = "var(--deepen)", soft = "#86b6ef" }: { rows: DumbbellRow[]; max?: number; fromName: string; toName: string; color?: string; soft?: string }) {
  const { bind, node } = useTip();
  const top = max ?? Math.max(...rows.map((r) => Math.max(r.from, r.to))) * 1.08;
  const pct = (v: number) => (v / top) * 100;
  return (
    <div>
      <div className="k-legend" style={{ marginBottom: 12 }}>
        <span>
          <i className="k-swatch" style={{ background: soft, borderRadius: "50%" }} /> {fromName}
        </span>
        <span>
          <i className="k-swatch" style={{ background: color, borderRadius: "50%" }} /> {toName}
        </span>
      </div>
      <div className="k-bars" role="list">
        {rows.map((r) => (
          <div className="k-bar-row" key={r.key} role="listitem">
            <div className="lab">
              {r.label}
              {r.sub ? <small>{r.sub}</small> : null}
            </div>
            <div className="k-track" tabIndex={0} {...bind(r.tip)} aria-label={`${typeof r.label === "string" ? r.label : ""}: ${r.fromLabel} to ${r.toLabel}`}>
              <span style={{ position: "absolute", top: 8, height: 2, left: `${pct(Math.min(r.from, r.to))}%`, width: `${Math.abs(pct(r.to) - pct(r.from))}%`, background: "var(--context)" }} />
              <span style={{ position: "absolute", top: 3, width: 12, height: 12, marginLeft: -6, borderRadius: "50%", left: `${pct(r.from)}%`, background: soft, boxShadow: "0 0 0 2px var(--surface)" }} />
              <span style={{ position: "absolute", top: 3, width: 12, height: 12, marginLeft: -6, borderRadius: "50%", left: `${pct(r.to)}%`, background: color, boxShadow: "0 0 0 2px var(--surface)" }} />
            </div>
            <div className="val">
              <span className="k-muted" style={{ fontWeight: 600 }}>{r.fromLabel}</span> → {r.toLabel}
            </div>
          </div>
        ))}
      </div>
      {node}
    </div>
  );
}

export function Meter({ pct, low, label, right }: { pct: number; low?: boolean; label?: ReactNode; right?: ReactNode }) {
  return (
    <div className={`k-meter ${low ? "low" : ""}`}>
      <div className="t" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} aria-label={typeof label === "string" ? label : "Line of sight"}>
        <span className="f" style={{ width: `${Math.min(100, Math.max(pct, 1.5))}%` }} />
      </div>
      {label || right ? (
        <div className="l">
          <span>{label}</span>
          <span>{right}</span>
        </div>
      ) : null}
    </div>
  );
}

export function StackBar({ parts, total, height = 12 }: { parts: { key: string; value: number; color: string; label: string }[]; total: number; height?: number }) {
  const { bind, node } = useTip();
  return (
    <div style={{ position: "relative" }}>
      <div className="k-build-bar" style={{ height }}>
        {parts.map((p) => (
          <span
            key={p.key}
            tabIndex={0}
            aria-label={`${p.label}: ${p.value}`}
            style={{ width: `${(p.value / total) * 100}%`, background: p.color }}
            {...bind(
              <>
                <b>${p.value}M</b>
                <div className="mut">{p.label}</div>
              </>,
            )}
          />
        ))}
      </div>
      {node}
    </div>
  );
}
