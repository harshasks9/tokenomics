"use client";

import { useState } from "react";
import { OTHER_MARKETS, REGIONS } from "@/lib/clicks-to-delegation/research";
import { SOURCE_BY_ID } from "@/lib/clicks-to-delegation/sources";
import { Cite, Ev, Fig, Section } from "../ui";

/** Schematic tile positions (column, row) — a cartogram, not a map. */
const TILE: Record<string, { c: number; r: number }> = { us: { c: 1, r: 1 }, europe: { c: 2, r: 1 }, china: { c: 3, r: 1 }, japan: { c: 4, r: 1 }, latam: { c: 1, r: 2 }, india: { c: 2, r: 2 }, sea: { c: 3, r: 2 } };

type HistPoint = { year: number; pct: number | null; metric: string; sourceIds: string[] };
/** Numeric share-of-retail points; China prefers the series verified against NBS releases in the history stream. */
function series(r: (typeof REGIONS)[number]): HistPoint[] {
  const pts = (r.ecomHistory as HistPoint[]).filter((h) => h.pct != null);
  if (r.id !== "china") return pts.sort((a, b) => a.year - b.year);
  const cn = OTHER_MARKETS.find((m) => m.geo === "China");
  if (!cn) return pts;
  const verified = cn.series.map((x) => ({ year: x.year, pct: x.pct, metric: cn.metric, sourceIds: x.sourceIds ?? cn.sourceIds ?? [] }));
  const years = new Set(verified.map((v) => v.year));
  return [...pts.filter((p) => !years.has(p.year)), ...verified].sort((a, b) => a.year - b.year);
}

export const provisional = (ids?: string[]) => Boolean(ids?.length) && ids!.every((id) => SOURCE_BY_ID[id]?.verification === "prior-knowledge");

export default function Geography() {
  const [rid, setRid] = useState("china");
  const r = REGIONS.find((x) => x.id === rid) ?? REGIONS[0];
  const hist = series(r) as (HistPoint & { pct: number })[];
  const facts = (r.ecomHistory as HistPoint[]).filter((h) => h.pct == null);
  const metricLabel = hist.find((h) => !/^same/i.test(h.metric))?.metric;
  const maxPct = Math.max(30, ...hist.map((h) => h.pct));
  const W = 420, H = 170, L = 34, Rr = 10, T = 12, B = 26;
  const years = hist.map((h) => h.year);
  const y0 = Math.min(...years, 2015), y1 = Math.max(...years, 2026);
  const sx = (y: number) => L + ((y - y0) / Math.max(1, y1 - y0)) * (W - L - Rr);
  const sy = (v: number) => T + (1 - v / maxPct) * (H - T - B);

  return (
    <Section id="geography" num="10" title="One transition, many geographies"
      dek="E-commerce took different paths in different markets: escrow in China, cash on delivery in India, marketplaces in Latin America. Agentic commerce will too."
      takeaway={<>The largest claimed agentic volume in 2026 is in <strong>China</strong> (Alipay&apos;s AI Pay, inside an integrated super-app and payments stack), not the US, though the figure is an unaudited company claim from a subsidized campaign week. Markets with <strong>integrated wallets and super-apps</strong> may delegate faster; markets with <strong>strong authentication rules</strong> (Europe) or <strong>cash and price sensitivity</strong> (parts of India, Latin America) face different hurdles.</>}>
      <Fig title="Regional comparison" sub="Select a region. E-commerce history is plotted only where a sourced figure exists; indicators mix measured data and expert judgment, labeled."
        foot={<><Ev kind="expert-judgment" /> Hypotheses are this report&apos;s, with the evidence for and against. No country ranking is implied; the tile map is schematic.</>}>
        <div className="ctd-geo">
          <div className="ctd-tiles" role="tablist" aria-label="Region">
            {REGIONS.map((x) => {
              const t = TILE[x.id] ?? { c: 1, r: 3 };
              const sx2 = series(x); const last = sx2[sx2.length - 1];
              return (
                <button key={x.id} type="button" role="tab" aria-selected={x.id === rid} className="ctd-tile" style={{ gridColumn: t.c, gridRow: t.r }} onClick={() => setRid(x.id)}>
                  <b>{x.name}</b>
                  {last ? <span className="ctd-mono">{last.pct}%<small> of retail online, {last.year}</small></span> : <span className="ctd-small ctd-tile-none">No comparable share series</span>}
                </button>
              );
            })}
          </div>
          <div className="ctd-geo-detail">
            <h3 className="ctd-h3">{r.name}</h3>
            <p style={{ margin: "6px 0 12px" }}>{r.howEcomDeveloped}</p>
            {hist.length > 1 ? (
              <svg viewBox={`0 0 ${W} ${H}`} className="ctd-geo-chart" role="img" aria-label={`E-commerce share history for ${r.name}`}>
                {[0, maxPct / 2, maxPct].map((v) => <g key={v}><line x1={L} x2={W - Rr} y1={sy(v)} y2={sy(v)} stroke="#e2ddd2" /><text x={L - 6} y={sy(v) + 4} fontSize={10} textAnchor="end" fill="#6b7285">{Math.round(v)}%</text></g>)}
                <polyline fill="none" stroke="#eb6834" strokeWidth={2} points={hist.map((h) => `${sx(h.year)},${sy(h.pct)}`).join(" ")} />
                {hist.map((h) => { const pv = provisional(h.sourceIds); return <g key={`${h.year}-${h.pct}`}><circle cx={sx(h.year)} cy={sy(h.pct)} r={4} fill={pv ? "#fcfbf8" : "#eb6834"} stroke="#eb6834" strokeWidth={2}><title>{`${h.year}: ${h.pct}%${pv ? " (not re-verified)" : ""} · ${h.metric}`}</title></circle><text x={sx(h.year)} y={H - 8} fontSize={10} textAnchor="middle" fill="#6b7285">{h.year}</text></g>; })}
                {hist.length > 0 && <text x={sx(hist[hist.length - 1].year) - 4} y={sy(hist[hist.length - 1].pct) - 8} fontSize={11} textAnchor="end" fill="#b4461b" fontWeight={600}>{hist[hist.length - 1].pct}%</text>}
              </svg>
            ) : <p className="ctd-small ctd-muted">No sourced multi-year e-commerce share series was found for this region in this research pass.</p>}
            {hist.length > 0 && <p className="ctd-small ctd-muted">Metric: {metricLabel}<Cite ids={[...new Set(hist.flatMap((h) => h.sourceIds))]} />{hist.some((h) => provisional(h.sourceIds)) && <> · hollow points are not re-verified</>}</p>}
            {facts.length > 0 && (
              <ul className="ctd-list ctd-geo-facts">
                {facts.map((f) => <li key={f.metric}><b>{f.year}:</b> {f.metric}<Cite ids={f.sourceIds} />{provisional(f.sourceIds) && <span className="ctd-unv">not re-verified</span>}</li>)}
              </ul>
            )}
            <div className="ctd-indicators">
              {r.indicators.map((ind) => (
                <div key={ind.label} className="ctd-ind"><span>{ind.label}</span><b>{ind.value}<Cite ids={ind.sourceIds} />{provisional(ind.sourceIds) && <span className="ctd-unv">not re-verified</span>}</b></div>
              ))}
            </div>
          </div>
        </div>
        <div className="ctd-hyps">
          {r.hypotheses.map((h, i) => (
            <div key={i} className="ctd-hyp">
              <span className="ctd-h4">Hypothesis {i + 1}</span>
              <p className="ctd-hyp-text">{h.text}</p>
              <div className="ctd-grid2"><div><span className="ctd-h4 good">For</span><p>{h.for}</p></div><div><span className="ctd-h4 bad">Against</span><p>{h.against}</p></div></div>
            </div>
          ))}
        </div>
      </Fig>
    </Section>
  );
}
