"use client";

import { useMemo, useState } from "react";
import type { Model } from "@/lib/pricing/types";
import { PROVIDERS, providerById, providerColor } from "@/lib/pricing/presets";
import { fmtPerM } from "@/lib/pricing/calc";
import { useTip } from "./Tooltip";

type Metric = "input" | "output" | "cachedInput" | "blended";
const METRICS: { id: Metric; label: string; hint: string }[] = [
  { id: "input", label: "Input $/1M", hint: "Standard-tier input price" },
  { id: "output", label: "Output $/1M", hint: "Standard-tier output price" },
  { id: "cachedInput", label: "Cached input $/1M", hint: "Price of input tokens served from cache" },
  { id: "blended", label: "Blended (3:1)", hint: "Weighted 75% input / 25% output — a typical chat mix" },
];

function metricValue(m: Model, k: Metric): number | null {
  const p = m.pricing;
  if (k === "blended") return p.input != null && p.output != null ? p.input * 0.75 + p.output * 0.25 : null;
  const v = p[k];
  return v == null ? null : v;
}

/** Log-scale position (0..1) across a fixed $0.005–$100 domain so bars stay comparable between metrics. */
const LOG_MIN = Math.log10(0.005);
const LOG_MAX = Math.log10(100);
const pos = (v: number) => Math.min(1, Math.max(0.02, (Math.log10(Math.max(v, 0.005)) - LOG_MIN) / (LOG_MAX - LOG_MIN)));
const TICKS = [0.01, 0.1, 1, 10, 100];

export default function PricingBars({ models }: { models: Model[] }) {
  const [metric, setMetric] = useState<Metric>("input");
  const [asc, setAsc] = useState(true);
  const [table, setTable] = useState(false);
  const tip = useTip();

  const rows = useMemo(() => {
    const withV = models.map((m) => ({ m, v: metricValue(m, metric) }));
    const priced = withV.filter((r) => r.v != null) as { m: Model; v: number }[];
    const unpriced = withV.filter((r) => r.v == null);
    priced.sort((a, b) => (asc ? a.v - b.v : b.v - a.v));
    return { priced, unpriced };
  }, [models, metric, asc]);

  const showTip = (m: Model, e: React.MouseEvent | React.FocusEvent) => {
    const x = "clientX" in e ? e.clientX : (e.target as HTMLElement).getBoundingClientRect().left;
    const y = "clientY" in e ? e.clientY : (e.target as HTMLElement).getBoundingClientRect().top;
    tip.show(
      {
        title: `${m.name} · ${providerById(m.provider).name}`,
        rows: [
          { label: "Input", value: fmtPerM(m.pricing.input) },
          { label: "Output", value: fmtPerM(m.pricing.output) },
          { label: "Cached input", value: fmtPerM(m.pricing.cachedInput) },
          { label: "Batch", value: m.pricing.batchDiscount ? `−${Math.round(m.pricing.batchDiscount * 100)}%` : "none" },
          { label: "Context", value: `${m.contextK >= 1000 ? (m.contextK / 1000).toFixed(m.contextK % 1000 ? 2 : 0) + "M" : m.contextK + "k"}` },
        ],
        note: m.thirdPartyPricing ? `Third-party hosting price (${m.servedBy})` : m.pricing.notes?.[0],
      },
      x,
      y,
    );
  };

  return (
    <div className="px-card px-bars">
      <div className="px-bars-head">
        <div className="t">
          {METRICS.find((x) => x.id === metric)!.label}
          <span style={{ fontWeight: 500, color: "var(--ink-3)", fontSize: 12, marginLeft: 8 }}>{METRICS.find((x) => x.id === metric)!.hint} · log scale</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="px-sortrow" role="tablist" aria-label="Metric">
            {METRICS.map((k) => (
              <button key={k.id} className={metric === k.id ? "on" : ""} onClick={() => setMetric(k.id)} role="tab" aria-selected={metric === k.id}>
                {k.label}
              </button>
            ))}
          </div>
          <button className="px-table-toggle" onClick={() => setAsc((a) => !a)} aria-label="Toggle sort direction">
            {asc ? "cheapest first ↑" : "priciest first ↓"}
          </button>
          <button className={`px-table-toggle ${table ? "on" : ""}`} onClick={() => setTable((t) => !t)} aria-pressed={table}>
            table
          </button>
        </div>
      </div>

      {table ? (
        <table className="px-plain" aria-label="Pricing table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Provider</th>
              <th style={{ textAlign: "right" }}>Input</th>
              <th style={{ textAlign: "right" }}>Output</th>
              <th style={{ textAlign: "right" }}>Cached in</th>
              <th style={{ textAlign: "right" }}>Batch</th>
              <th>Served by</th>
            </tr>
          </thead>
          <tbody>
            {[...rows.priced.map((r) => r.m), ...rows.unpriced.map((r) => r.m)].map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{providerById(m.provider).name}</td>
                <td className="n">{fmtPerM(m.pricing.input)}</td>
                <td className="n">{fmtPerM(m.pricing.output)}</td>
                <td className="n">{fmtPerM(m.pricing.cachedInput)}</td>
                <td className="n">{m.pricing.batchDiscount ? `−${Math.round(m.pricing.batchDiscount * 100)}%` : "—"}</td>
                <td>{m.servedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          {/* axis ticks */}
          <div className="px-brow" style={{ borderTop: 0, padding: "0 0 4px" }} aria-hidden>
            <span />
            <div style={{ position: "relative", height: 14 }}>
              {TICKS.map((t) => (
                <span key={t} style={{ position: "absolute", left: `${pos(t) * 100}%`, transform: "translateX(-50%)", fontSize: 10, color: "var(--ink-3)" }}>
                  ${t}
                </span>
              ))}
            </div>
            <span />
          </div>
          {rows.priced.map(({ m, v }) => (
            <div
              key={m.id}
              className="px-brow"
              tabIndex={0}
              onMouseEnter={(e) => showTip(m, e)}
              onMouseMove={(e) => tip.move(e.clientX, e.clientY)}
              onMouseLeave={tip.hide}
              onFocus={(e) => showTip(m, e)}
              onBlur={tip.hide}
            >
              <div className="nm">
                <span className="g" style={{ color: providerColor(m.provider) }} aria-hidden>
                  {providerById(m.provider).glyph}
                </span>
                <span className="n">{m.name}</span>
                {m.thirdPartyPricing && <span className="px-badge tp">3rd-party</span>}
                {m.status === "preview" && <span className="px-badge prev">preview</span>}
                {m.status === "legacy" && <span className="px-badge legacy">legacy</span>}
              </div>
              <div className="tr">
                {TICKS.map((t) => (
                  <span key={t} aria-hidden style={{ position: "absolute", left: `${pos(t) * 100}%`, top: 0, bottom: 0, width: 1, background: "var(--grid)" }} />
                ))}
                <div className="seg" style={{ width: `${pos(v) * 100}%`, background: providerColor(m.provider), position: "relative" }} />
              </div>
              <div className="vals">
                <strong>{fmtPerM(v)}</strong>
                <span style={{ color: "var(--ink-3)" }}> · in {fmtPerM(m.pricing.input)} / out {fmtPerM(m.pricing.output)}</span>
              </div>
            </div>
          ))}
          {rows.unpriced.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--ink-3)", padding: "8px 0 0" }}>
              Not shown (no published value for this metric): {rows.unpriced.map((r) => r.m.name).join(", ")}
            </div>
          )}
          <div className="px-legend" aria-label="Provider legend">
            {PROVIDERS.filter((p) => models.some((m) => m.provider === p.id)).map((p) => (
              <span key={p.id} className="k">
                <span className="sw" style={{ background: providerColor(p.id) }} aria-hidden />
                <span aria-hidden>{p.glyph}</span> {p.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
