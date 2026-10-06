"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Model } from "@/lib/pricing/types";
import { PROVIDERS, RUNGS, providerById, providerColor } from "@/lib/pricing/presets";
import { fmtPerM } from "@/lib/pricing/calc";
import { useTip } from "./Tooltip";

/**
 * Dumbbell price chart: each model is one row on a shared log axis — a
 * filled marker at the input price, a hollow marker at the output price,
 * connected by a bar in the provider's color, and a small tick for the
 * cached-input price when published. One glance shows level and spread.
 */

type SortKey = "input" | "output" | "spread" | "cachedInput" | "provider";
const SORTS: { id: SortKey; label: string; hint: string }[] = [
  { id: "input", label: "Input price", hint: "cheapest input first" },
  { id: "output", label: "Output price", hint: "cheapest output first" },
  { id: "spread", label: "Output ÷ input", hint: "smallest output premium first" },
  { id: "cachedInput", label: "Cached input", hint: "cheapest cache reads first" },
  { id: "provider", label: "Provider · tier", hint: "grouped by provider, flagship first" },
];

const LOG_MIN = Math.log10(0.004);
const LOG_MAX = Math.log10(120);
const pos = (v: number) => Math.min(1, Math.max(0, (Math.log10(Math.max(v, 0.004)) - LOG_MIN) / (LOG_MAX - LOG_MIN)));
const TICKS = [0.01, 0.1, 1, 10, 100];
const RUNG_ORDER: Record<string, number> = { flagship: 0, mid: 1, light: 2 };

export default function PricingBars({ models }: { models: Model[] }) {
  const [sort, setSort] = useState<SortKey>("input");
  const [asc, setAsc] = useState(true);
  const [table, setTable] = useState(false);
  const tip = useTip();

  const rows = useMemo(() => {
    const priced = models.filter((m) => m.pricing.input != null && m.pricing.output != null);
    const unpriced = models.filter((m) => m.pricing.input == null || m.pricing.output == null);
    const key = (m: Model): number | null => {
      switch (sort) {
        case "input": return m.pricing.input;
        case "output": return m.pricing.output;
        case "spread": return m.pricing.output! / m.pricing.input!;
        case "cachedInput": return m.pricing.cachedInput ?? null;
        case "provider": return PROVIDERS.findIndex((p) => p.id === m.provider) * 10 + RUNG_ORDER[m.series.rung] + (m.pricing.input! / 1000);
      }
    };
    priced.sort((a, b) => {
      const ka = key(a);
      const kb = key(b);
      if (ka == null && kb == null) return 0;
      if (ka == null) return 1;
      if (kb == null) return -1;
      return asc ? ka - kb : kb - ka;
    });
    return { priced, unpriced };
  }, [models, sort, asc]);

  const showTip = (m: Model, x: number, y: number) =>
    tip.show(
      {
        title: `${m.name} · ${providerById(m.provider).name} ${m.series.name}`,
        rows: [
          { label: "Input", value: fmtPerM(m.pricing.input) },
          { label: "Output", value: fmtPerM(m.pricing.output) },
          { label: "Output premium", value: `${(m.pricing.output! / m.pricing.input!).toFixed(1)}×` },
          { label: "Cached input", value: fmtPerM(m.pricing.cachedInput) },
          { label: "Batch", value: m.pricing.batchDiscount ? `−${Math.round(m.pricing.batchDiscount * 100)}%` : "none" },
        ],
        note: m.thirdPartyPricing ? `Third-party hosting price (${m.servedBy})` : m.pricing.notes?.[0],
      },
      x,
      y,
    );

  return (
    <div className="px-card px-bars">
      <div className="px-bars-head">
        <div className="t">
          Input → output price per 1M tokens
          <span style={{ fontWeight: 500, color: "var(--ink-3)", fontSize: 12, marginLeft: 8 }}>log scale · {SORTS.find((s) => s.id === sort)!.hint}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <div className="px-sortrow" role="tablist" aria-label="Sort">
            {SORTS.map((s) => (
              <button key={s.id} className={sort === s.id ? "on" : ""} onClick={() => setSort(s.id)} role="tab" aria-selected={sort === s.id}>
                {s.label}
              </button>
            ))}
          </div>
          <button className="px-table-toggle" onClick={() => setAsc((a) => !a)} aria-label="Toggle sort direction">
            {asc ? "↑ asc" : "↓ desc"}
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
              <th>Provider · tier</th>
              <th style={{ textAlign: "right" }}>Input</th>
              <th style={{ textAlign: "right" }}>Output</th>
              <th style={{ textAlign: "right" }}>Out ÷ in</th>
              <th style={{ textAlign: "right" }}>Cached in</th>
              <th style={{ textAlign: "right" }}>Batch</th>
              <th>Served by</th>
            </tr>
          </thead>
          <tbody>
            {[...rows.priced, ...rows.unpriced].map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{providerById(m.provider).name} · {m.series.name}</td>
                <td className="n">{fmtPerM(m.pricing.input)}</td>
                <td className="n">{fmtPerM(m.pricing.output)}</td>
                <td className="n">{m.pricing.input && m.pricing.output ? `${(m.pricing.output / m.pricing.input).toFixed(1)}×` : "n/a"}</td>
                <td className="n">{fmtPerM(m.pricing.cachedInput)}</td>
                <td className="n">{m.pricing.batchDiscount ? `−${Math.round(m.pricing.batchDiscount * 100)}%` : "—"}</td>
                <td>{m.servedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>
          <div className="px-drow axis" aria-hidden>
            <span />
            <div className="tr">
              {TICKS.map((t) => (
                <span key={t} className="tick-lbl" style={{ left: `${pos(t) * 100}%` }}>
                  ${t}
                </span>
              ))}
            </div>
            <span />
          </div>
          <AnimatePresence initial={false}>
            {rows.priced.map((m) => {
              const col = providerColor(m.provider);
              const x1 = pos(m.pricing.input!) * 100;
              const x2 = pos(m.pricing.output!) * 100;
              const xc = m.pricing.cachedInput != null ? pos(m.pricing.cachedInput) * 100 : null;
              return (
                <motion.div
                  key={m.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 32 }}
                  className="px-drow"
                  tabIndex={0}
                  onMouseEnter={(e) => showTip(m, e.clientX, e.clientY)}
                  onMouseMove={(e) => tip.move(e.clientX, e.clientY)}
                  onMouseLeave={tip.hide}
                  onFocus={(e) => {
                    const r = (e.target as HTMLElement).getBoundingClientRect();
                    showTip(m, r.left + 200, r.top);
                  }}
                  onBlur={tip.hide}
                >
                  <div className="nm">
                    <span className="g" style={{ color: col }} aria-hidden>{providerById(m.provider).glyph}</span>
                    <span className="n">{m.name}</span>
                    <span className={`px-rung rung-${m.series.rung}`}>{m.series.name}</span>
                    {m.thirdPartyPricing && <span className="px-badge tp">3rd-party</span>}
                    {m.status === "preview" && <span className="px-badge prev">preview</span>}
                    {m.status === "legacy" && <span className="px-badge legacy">legacy</span>}
                  </div>
                  <div className="tr">
                    {TICKS.map((t) => (
                      <span key={t} className="tick" style={{ left: `${pos(t) * 100}%` }} aria-hidden />
                    ))}
                    <span className="bar" style={{ left: `${x1}%`, width: `${Math.max(0.4, x2 - x1)}%`, background: col }} />
                    {xc != null && <span className="cache" style={{ left: `${xc}%`, borderColor: col }} title="cached input" />}
                    <span className="dot in" style={{ left: `${x1}%`, background: col }} />
                    <span className="dot out" style={{ left: `${x2}%`, borderColor: col }} />
                  </div>
                  <div className="vals">
                    <strong>{fmtPerM(m.pricing.input)}</strong>
                    <span className="arr"> → </span>
                    <strong>{fmtPerM(m.pricing.output)}</strong>
                    <span className="sp"> {(m.pricing.output! / m.pricing.input!).toFixed(0)}×</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {rows.unpriced.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--ink-3)", padding: "8px 0 0" }}>
              Not shown (no published price): {rows.unpriced.map((m) => m.name).join(", ")}
            </div>
          )}
          <div className="px-legend" aria-label="Legend">
            <span className="k"><span className="dot-in" /> input $/1M</span>
            <span className="k"><span className="dot-out" /> output $/1M</span>
            <span className="k"><span className="cache-k" /> cached input $/1M</span>
            <span className="px-sep" />
            {PROVIDERS.filter((p) => models.some((m) => m.provider === p.id)).map((p) => (
              <span key={p.id} className="k">
                <span className="sw" style={{ background: providerColor(p.id) }} aria-hidden />
                <span aria-hidden>{p.glyph}</span> {p.name}
              </span>
            ))}
            <span className="px-sep" />
            {RUNGS.map((r) => (
              <span key={r.id} className={`px-rung rung-${r.id}`}>{r.label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
