"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Model, ProviderId, Rung } from "@/lib/pricing/types";
import { PROVIDERS, RUNGS, providerById, providerColor } from "@/lib/pricing/presets";
import { fmtPerM } from "@/lib/pricing/calc";
import { useTip } from "./Tooltip";

/**
 * Market ladder: providers as rows, their lineup rungs as columns, so
 * Pro / Flash / Flash-Lite lines up against Astra / Sol / Luna and
 * Fable+Opus / Sonnet / Haiku. With exactly two providers selected, a
 * head-to-head strip prices each rung against the other.
 */

function ctx(k: number) {
  return k >= 1000 ? `${(k / 1000).toFixed(k % 1000 ? 2 : 0)}M` : `${k}k`;
}

export default function Ladder({
  models,
  providers,
  rungs,
  compare,
  onToggleCompare,
}: {
  models: Model[];
  providers: Set<ProviderId>;
  rungs: Set<Rung>;
  compare: string[];
  onToggleCompare: (id: string) => void;
}) {
  const tip = useTip();
  const rows = PROVIDERS.filter((p) => providers.has(p.id) && models.some((m) => m.provider === p.id));
  const lanes = RUNGS.filter((r) => rungs.has(r.id));

  // Cheapest input price per lane across the visible providers, for the "best in lane" mark.
  const laneBest = useMemo(() => {
    const best: Partial<Record<Rung, string>> = {};
    for (const r of lanes) {
      const cands = models.filter((m) => m.series.rung === r.id && m.pricing.input != null && m.status !== "legacy");
      if (cands.length) best[r.id] = cands.reduce((a, b) => (b.pricing.input! < a.pricing.input! ? b : a)).id;
    }
    return best;
  }, [models, lanes]);

  const h2h = rows.length === 2 ? rows : null;

  return (
    <div className="px-card px-ladder">
      <div className="px-ladder-grid" style={{ gridTemplateColumns: `150px repeat(${lanes.length}, minmax(0, 1fr))` }}>
        <div className="px-lane-head corner">Provider ↓ · tier →</div>
        {lanes.map((r) => (
          <div key={r.id} className={`px-lane-head ${r.id}`} title={r.desc}>
            <span className="nm">{r.label}</span>
            <span className="ds">{r.desc.split("(")[1]?.replace(")", "")}</span>
          </div>
        ))}

        {rows.map((p) => (
          <div key={p.id} style={{ display: "contents" }}>
            <div className="px-ladder-prov">
              <span className="sw" style={{ background: providerColor(p.id) }} aria-hidden />
              <span className="g" aria-hidden>{p.glyph}</span>
              <span className="n">{p.name}</span>
            </div>
            {lanes.map((r) => {
              const cell = models
                .filter((m) => m.provider === p.id && m.series.rung === r.id)
                .sort((a, b) => (a.status === "legacy" ? 1 : 0) - (b.status === "legacy" ? 1 : 0) || (a.pricing.input ?? 0) - (b.pricing.input ?? 0));
              return (
                <div key={r.id} className={`px-lane ${r.id}`}>
                  <AnimatePresence initial={false}>
                    {cell.map((m) => {
                      const on = compare.includes(m.id);
                      const best = laneBest[r.id] === m.id;
                      return (
                        <motion.button
                          key={m.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.92 }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          className={`px-mchip ${on ? "on" : ""} ${m.status === "legacy" ? "legacy" : ""}`}
                          style={{ ["--pc" as string]: providerColor(p.id) }}
                          onClick={() => onToggleCompare(m.id)}
                          onMouseEnter={(e) =>
                            tip.show(
                              {
                                title: `${m.name} · ${m.series.name}`,
                                rows: [
                                  { label: "Input", value: fmtPerM(m.pricing.input) },
                                  { label: "Output", value: fmtPerM(m.pricing.output) },
                                  { label: "Cached input", value: fmtPerM(m.pricing.cachedInput) },
                                  { label: "Context", value: ctx(m.contextK) },
                                  { label: "AA Index v4.3", value: m.benchmarks["aa-index"] ? String(m.benchmarks["aa-index"].score) : "n/a" },
                                ],
                                note: on ? "In your comparison — click to remove" : compare.length >= 4 ? "Comparison is full (4)" : "Click to add to the comparison",
                              },
                              e.clientX,
                              e.clientY,
                            )
                          }
                          onMouseMove={(e) => tip.move(e.clientX, e.clientY)}
                          onMouseLeave={tip.hide}
                          aria-pressed={on}
                        >
                          <span className="t">
                            <span className="sn">{m.series.name}</span>
                            {best && <span className="best" title="Cheapest input price in this tier among visible models">cheapest</span>}
                            {m.status === "preview" && <span className="px-badge prev">preview</span>}
                            {m.thirdPartyPricing && <span className="px-badge tp">3rd-party</span>}
                          </span>
                          <span className="mn">{m.name}</span>
                          <span className="pr">
                            <strong>{fmtPerM(m.pricing.input)}</strong> in · <strong>{fmtPerM(m.pricing.output)}</strong> out
                          </span>
                          <span className="meta">
                            {ctx(m.contextK)} ctx{m.benchmarks["aa-index"] ? ` · AA ${m.benchmarks["aa-index"].score}` : ""}
                          </span>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                  {cell.length === 0 && <span className="px-lane-empty">—</span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {h2h && (
        <div className="px-h2h">
          <div className="px-h2h-head">
            Head-to-head · <span style={{ color: providerColor(h2h[0].id) }}>{h2h[0].name}</span> vs <span style={{ color: providerColor(h2h[1].id) }}>{h2h[1].name}</span>
            <span className="sub">per tier, using each provider&apos;s cheapest current model in that tier</span>
          </div>
          {lanes.map((r) => {
            const pick = (pid: ProviderId) =>
              models
                .filter((m) => m.provider === pid && m.series.rung === r.id && m.pricing.input != null && m.status !== "legacy")
                .sort((a, b) => a.pricing.input! - b.pricing.input!)[0];
            const a = pick(h2h[0].id);
            const b = pick(h2h[1].id);
            if (!a || !b) {
              return (
                <div key={r.id} className="px-h2h-row">
                  <div className="lane">{r.label}</div>
                  <div className="cell muted">{a ? a.name : "no model in this tier"}</div>
                  <div className="verdict muted">—</div>
                  <div className="cell muted">{b ? b.name : "no model in this tier"}</div>
                </div>
              );
            }
            const ratio = (x: number, y: number) => (x === y ? "same" : x < y ? `${(y / x).toFixed(1)}× cheaper` : `${(x / y).toFixed(1)}× pricier`);
            const aWinsIn = a.pricing.input! <= b.pricing.input!;
            const aWinsOut = a.pricing.output! <= b.pricing.output!;
            return (
              <div key={r.id} className="px-h2h-row">
                <div className="lane">{r.label}</div>
                <div className={`cell ${aWinsIn && aWinsOut ? "win" : ""}`}>
                  <span className="nm" style={{ color: providerColor(a.provider) }}>{providerById(a.provider).glyph}</span> {a.name}
                  <div className="pr">{fmtPerM(a.pricing.input)} in · {fmtPerM(a.pricing.output)} out</div>
                </div>
                <div className="verdict">
                  <div>input: {h2h[0].name} {ratio(a.pricing.input!, b.pricing.input!)}</div>
                  <div>output: {h2h[0].name} {ratio(a.pricing.output!, b.pricing.output!)}</div>
                  {a.benchmarks["aa-index"] && b.benchmarks["aa-index"] && (
                    <div className="sub">AA Index {a.benchmarks["aa-index"].score} vs {b.benchmarks["aa-index"].score}</div>
                  )}
                </div>
                <div className={`cell ${!aWinsIn && !aWinsOut ? "win" : ""}`}>
                  <span className="nm" style={{ color: providerColor(b.provider) }}>{providerById(b.provider).glyph}</span> {b.name}
                  <div className="pr">{fmtPerM(b.pricing.input)} in · {fmtPerM(b.pricing.output)} out</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="px-ladder-foot">
        Rungs are each provider&apos;s own tiers normalized (flagship / mid / light); &quot;cheapest&quot; marks the lowest input price in that tier among visible,
        non-legacy models. Click any model to add it to the comparison. {rows.length !== 2 && "Select exactly two providers above for a rung-by-rung head-to-head."}
      </div>
    </div>
  );
}
