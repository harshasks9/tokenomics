"use client";

import { useMemo, useState } from "react";
import { creditCliff, lifetime, type Incentive, type IncentiveType, type Lifetime, type RouteId } from "@/lib/subsidy-math/model";
import { BASE_LIFETIME, baseRoute, ROUTE_IDS, ROUTE_META } from "@/lib/subsidy-math/params";
import { Explain, fmt$, fmtMonths, fmtPct, LineChart, Seg, Slider } from "./ui";

const TYPES: { v: IncentiveType; l: string }[] = [
  { v: "one-time", l: "One-time (year 1)" },
  { v: "recurring", l: "Every year (permanent)" },
  { v: "consumption", l: "On new growth only" },
  { v: "commit", l: "Tied to a bigger commit" },
];

/** Section: one coupon vs a forever discount, over 1, 3 and 5 years. */
export default function CouponTime() {
  const [route, setRoute] = useState<RouteId>("bedrock-claude");
  const [pct, setPct] = useState(0.35);
  const [lt, setLt] = useState<Lifetime>({ ...BASE_LIFETIME });
  const [withAdj, setWithAdj] = useState(false);
  const p = baseRoute(route);
  const L: Lifetime = { ...lt, years: 5, includeAdjacency: withAdj };

  const runs = useMemo(() => {
    const mk = (type: IncentiveType, c = pct): Incentive => ({ pct: c, type, partnerFunded: 0, providerFunded: 0 });
    return {
      none: lifetime(p, mk("one-time", 0), L),
      oneTime: lifetime(p, mk("one-time"), L),
      recurring: lifetime(p, mk("recurring"), L),
      consumption: lifetime(p, mk("consumption"), L),
      commit: lifetime(p, mk("commit"), L),
    };
  }, [p, pct, L]);

  const x = ["Start", "Yr 1", "Yr 2", "Yr 3", "Yr 4", "Yr 5"];
  const cum = (r: typeof runs.none) => [0, ...r.rows.map((row) => row.cumulative)];
  const by = (type: IncentiveType) => (type === "one-time" ? runs.oneTime : type === "recurring" ? runs.recurring : type === "consumption" ? runs.consumption : runs.commit);
  const npvAt = (type: IncentiveType, years: number) => lifetime(p, { pct, type, partnerFunded: 0, providerFunded: 0 }, { ...L, years }).npv;
  const effDisc = (type: IncentiveType, years: number) => lifetime(p, { pct, type, partnerFunded: 0, providerFunded: 0 }, { ...L, years }).effectiveCustomerDiscount;
  const cliff = creditCliff(p.customerDiscount, pct);
  const meta = ROUTE_META[route];

  return (
    <div className="sm-panel">
      <div className="sm-tabs" role="group" aria-label="Choose a route">
        {ROUTE_IDS.map((id) => (
          <button key={id} type="button" aria-pressed={id === route} onClick={() => setRoute(id)}>
            <span className="sm-dot" style={{ background: ROUTE_META[id].color }} />{ROUTE_META[id].short}
          </button>
        ))}
      </div>
      <div className="sm-grid c2" style={{ alignItems: "start" }}>
        <div>
          <h3>{meta.cloud}&apos;s running profit from one customer (started at $100 a year)</h3>
          <LineChart
            ariaLabel="Cumulative cloud contribution over five years by coupon type"
            x={x}
            yFormat={(v) => fmt$(v)}
            zeroLine
            series={[
              { key: "none", label: "No coupon", color: "var(--other)", values: cum(runs.none), dash: true },
              { key: "one", label: "One-time", color: "var(--google)", values: cum(runs.oneTime) },
              { key: "rec", label: "Every year", color: "var(--aws)", values: cum(runs.recurring) },
            ]}
          />
          <p className="sm-caveat">Contribution = what the cloud keeps after paying the model maker (or royalty), chips, power and selling costs. Same customer, same model, same growth in every line — only the coupon changes.</p>
        </div>
        <div>
          <Slider label="Coupon size" value={pct} min={0} max={0.5} step={0.01} onChange={setPct} format={(v) => fmtPct(v)} />
          <Slider label="Customer's AI spend growth per year" value={lt.growth} min={0} max={0.8} step={0.05} onChange={(v) => setLt({ ...lt, growth: v })} format={(v) => fmtPct(v)} />
          <Slider label="Chance the customer stays each year" value={lt.retention} min={0.6} max={1} step={0.01} onChange={(v) => setLt({ ...lt, retention: v })} format={(v) => fmtPct(v)} />
          <Slider label="Price cuts per year (list price per unit)" value={lt.priceDeflation} min={0} max={0.6} step={0.05} onChange={(v) => setLt({ ...lt, priceDeflation: v })} format={(v) => fmtPct(v)} help="Faster price cuts than cost cuts squeeze the margin." />
          <Slider label="Serving-cost cuts per year (better chips & software)" value={lt.efficiencyGain} min={0} max={0.6} step={0.05} onChange={(v) => setLt({ ...lt, efficiencyGain: v })} format={(v) => fmtPct(v)} />
          <Seg label="Include other cloud services" value={withAdj ? 1 : 0} onChange={(v) => setWithAdj(v === 1)} options={[{ v: 0, l: "AI only" }, { v: 1, l: "+ storage, database, etc." }]} />
        </div>
      </div>

      <div className="sm-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Coupon type</th>
              <th className="num">Value to {meta.cloud}, 1 yr</th>
              <th className="num">3 yrs</th>
              <th className="num">5 yrs</th>
              <th className="num">Payback</th>
              <th className="num">Customer&apos;s real discount over 3 yrs</th>
              <th className="num">over 5 yrs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>No coupon</td>
              {[1, 3, 5].map((y) => <td key={y} className="num">{fmt$(lifetime(p, { pct: 0, type: "one-time", partnerFunded: 0, providerFunded: 0 }, { ...L, years: y }).npv)}</td>)}
              <td className="num">—</td><td className="num">0%</td><td className="num">0%</td>
            </tr>
            {TYPES.map((t) => (
              <tr key={t.v} className={t.v === "one-time" || t.v === "recurring" ? "hl" : undefined}>
                <td>{t.l}</td>
                {[1, 3, 5].map((y) => {
                  const v = npvAt(t.v, y);
                  return <td key={y} className={`num ${v < 0 ? "sm-neg" : ""}`}>{fmt$(v)}</td>;
                })}
                <td className="num">{fmtMonths(by(t.v).paybackMonths)}</td>
                <td className="num">{fmtPct(effDisc(t.v, 3), 1)}</td>
                <td className="num">{fmtPct(effDisc(t.v, 5), 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sm-caveat">Values are present values (10% discount rate) per $100 of year-one list spend. &ldquo;Customer&apos;s real discount&rdquo; = coupons received ÷ total list spend over the period.</p>

      <Explain>
        A {fmtPct(pct)} <b>one-time</b> coupon is not a {fmtPct(pct)} price cut. Spread over three years of a growing customer it is worth about <b>{fmtPct(effDisc("one-time", 3), 0)}</b> to the customer, and over five years about <b>{fmtPct(effDisc("one-time", 5), 0)}</b>. And when it ends, the customer&apos;s bill for the same usage jumps by <b>{fmtPct(cliff, 0)}</b> — that is the &ldquo;year-two cliff&rdquo; your sellers should plan for.
      </Explain>
    </div>
  );
}
