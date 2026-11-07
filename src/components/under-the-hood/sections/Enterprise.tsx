"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CUSTOMERS } from "@/lib/under-the-hood/data";
import { customerTierSummary, nrr, nrrCohortBounds, type NrrCohort } from "@/lib/under-the-hood/calc";
import { num, pct, usdM } from "@/lib/under-the-hood/format";
import { ChartFrame, Cite, ClassBadge, makeTip, PALETTE, Section, Seg, Slider } from "../ui";

const PRESETS: Record<string, { label: string; cohorts: NrrCohort[] }> = {
  early: { label: "Early adoption (illustrative ~900%)", cohorts: [
    { label: "Micro developers ($300/qtr base)", customers: 300000, baseSpend: 300, multiple: 12 },
    { label: "Startups & SMB ($10K/qtr)", customers: 20000, baseSpend: 10000, multiple: 11 },
    { label: "Mid enterprise ($150K/qtr)", customers: 2000, baseSpend: 150000, multiple: 8 },
    { label: "Large & AI-native ($10M/qtr)", customers: 50, baseSpend: 10000000, multiple: 8.6 },
  ] },
  maturing: { label: "Maturing (illustrative)", cohorts: [
    { label: "Micro developers ($300/qtr base)", customers: 300000, baseSpend: 300, multiple: 1.6 },
    { label: "Startups & SMB ($10K/qtr)", customers: 20000, baseSpend: 10000, multiple: 2.2 },
    { label: "Mid enterprise ($150K/qtr)", customers: 2000, baseSpend: 150000, multiple: 2.0 },
    { label: "Large & AI-native ($10M/qtr)", customers: 50, baseSpend: 10000000, multiple: 1.8 },
  ] },
  mature: { label: "Mature, SaaS-like (illustrative)", cohorts: [
    { label: "Micro developers ($300/qtr base)", customers: 300000, baseSpend: 300, multiple: 0.9 },
    { label: "Startups & SMB ($10K/qtr)", customers: 20000, baseSpend: 10000, multiple: 1.1 },
    { label: "Mid enterprise ($150K/qtr)", customers: 2000, baseSpend: 150000, multiple: 1.25 },
    { label: "Large & AI-native ($10M/qtr)", customers: 50, baseSpend: 10000000, multiple: 1.3 },
  ] },
};

export default function Enterprise() {
  const tiers = CUSTOMERS.tiers;
  const ts = customerTierSummary();
  const [preset, setPreset] = useState<keyof typeof PRESETS>("early");
  const [cohorts, setCohorts] = useState<NrrCohort[]>(PRESETS.early.cohorts);
  const [micro, setMicro] = useState(0);
  const all = [...cohorts, ...(micro > 0 ? [{ label: "‘$1 entrants’ ($5 base → $50K)", customers: micro, baseSpend: 5, multiple: 10000 }] : [])];
  const r = nrr(all);
  const r25 = nrr(all, 25000);
  const r1m = nrr(all, 1000000);
  const b = nrrCohortBounds();
  const choose = (k: keyof typeof PRESETS) => { setPreset(k); setCohorts(PRESETS[k].cohorts); };
  const setMult = (i: number) => (v: number) => setCohorts((cs) => cs.map((c, j) => (j === i ? { ...c, multiple: v } : c)));

  return (
    <Section id="enterprise">
      <div className="uth-split">
        <div className="uth-card">
          <h3 className="uth-h4">Customer tiers (TTM to Sep 30, 2026)</h3>
          <div className="uth-pyr" role="list" aria-label="Customer tier pyramid">
            {[
              { w: "38%", bg: "#104281", t: tiers[0] },
              { w: "56%", bg: "#1c5cab", t: tiers[1] },
              { w: "76%", bg: "#2a78d6", t: tiers[2] },
              { w: "100%", bg: "#5598e7", t: tiers[3] },
            ].map(({ w, bg, t }) => (
              <div key={t.id} role="listitem" style={{ width: w, background: bg }}>
                <b>{t.qualifier === "approximately" ? "~" : ">"}{num(t.count)}</b> · {t.label}<br />
                <span style={{ opacity: .85, fontSize: 12 }}>{t.revenue ? `${usdM(t.revenue)} TTM` : t.floorRevenue ? `≥ ${usdM(t.floorRevenue)} TTM (floor)` : ""}</span>
              </div>
            ))}
          </div>
          <ul className="uth-list" style={{ fontSize: 13.5, marginTop: 16 }}>
            {tiers.map((t) => <li key={t.id}><span><b>{t.label}:</b> {t.note}</span></li>)}
          </ul>
          <p className="uth-xs" style={{ marginTop: 8 }}>TTM revenue {usdM(ts.ttm)} (calculated from four quarters). ≥$100K customers average ≈{usdM(ts.avgPer100k, { digits: 1 })} each (upper bound); the long tail averages ≈${num(ts.tailAvg * 1e6)} per customer per year. <Cite id="cust-100k-rev" /> <Cite id="cust-long-tail" /></p>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">What the cohorts prove — and what they don’t</h3>
          <ul className="uth-list plus" style={{ fontSize: 14 }}>
            <li><span><b>Commercial scale:</b> &gt;11,900 customers ≥$100K, &gt;50% of the Fortune 500, every Fortune 10 company <Cite id="f500" /></span></li>
            <li><span><b>Diversification:</b> no customer ≥10% of 9M revenue; top five ≈25% (9M), ≈21% in Q3 vs ≈36% in Q1 <Cite id="top5" /></span></li>
          </ul>
          <ul className="uth-list minus" style={{ fontSize: 14, marginTop: 10 }}>
            <li><span><b>Not standardization:</b> revenue averages &lt;0.1% of Fortune 500 customers’ total expenses (&lt;1% for the top 10) <Cite id="f500-wallet" /></span></li>
            <li><span><b>“Enterprise” = spend threshold:</b> AI-native startups and platforms embedding Claude count the same as banks <Cite id="cust-def" /></span></li>
            <li><span><b>Customers ≠ seats:</b> a $100K account may be one team or one product integration.</span></li>
            <li><span><b>Embedded vs direct:</b> the filing doesn’t split customers using Claude internally from those reselling it in products.</span></li>
          </ul>
          <hr className="uth-rule" />
          <p className="uth-small" style={{ margin: 0 }}>Concentration history: one customer was <b>43%</b> of 2023 revenue and still <b>11%</b> of H1 2026 (Oct 26 S-1) before falling below 10% for nine months <Cite id="top-customer-2023" /> <Cite id="top-customer-h1" />.</p>
        </div>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>NRR explainer — why ~900% is real, and why it will normalize</h3>
          <Seg label="Illustrative cohort preset" value={preset} onChange={choose} options={[{ value: "early", label: "Early adoption" }, { value: "maturing", label: "Maturing" }, { value: "mature", label: "Mature" }]} />
        </div>
        <p className="uth-p" style={{ fontSize: 14 }}>Anthropic’s NRR = Q3 2026 revenue ÷ Q3 2025 revenue of every customer who paid at least <b>$1</b> in Q3 2025 (excluding Pro/Max/Ultra subscribers) <Cite id="nrr-def" />. It is <b>dollar-weighted</b>: each cohort counts in proportion to its base-period dollars. Adjust the illustrative cohorts — they are not Anthropic data.</p>
        <div className="uth-split">
          <div className="uth-grid" style={{ alignContent: "start" }}>
            {cohorts.map((c, i) => (
              <Slider key={c.label} label={`${c.label} · ${num(c.customers)} customers`} value={c.multiple} min={0.5} max={20} step={0.1} onChange={setMult(i)} format={(v) => `${v.toFixed(1)}× expansion`} />
            ))}
            <Slider label="Add ‘$1 entrants’: customers who spent $5 in the base quarter and $50,000 now" value={micro} min={0} max={20000} step={500} onChange={setMicro} format={(v) => num(v)} hint="Each one expands 10,000× — watch how little the total moves until they are numerous" />
          </div>
          <div>
            <div className="uth-grid uth-g3">
              <div className="uth-card sunk"><div className="uth-kpi-label">NRR as Anthropic defines it (≥$1 base)</div><div className="uth-kpi-value">{pct(r.nrr, 0)}</div></div>
              <div className="uth-card sunk"><div className="uth-kpi-label">If base had to be ≥$25K/qtr (~$100K/yr)</div><div className="uth-kpi-value">{pct(r25.nrr, 0)}</div></div>
              <div className="uth-card sunk"><div className="uth-kpi-label">Only ≥$1M/qtr base accounts</div><div className="uth-kpi-value">{pct(r1m.nrr, 0)}</div></div>
            </div>
            <ChartFrame
              summary="Contribution of each illustrative cohort to base-period and current-period revenue."
              legend={[{ label: "Base quarter revenue", color: PALETTE.s7 }, { label: "Current quarter revenue", color: PALETTE.s1 }]}
              rows={r.contrib.map((c) => ({ cohort: c.label, base: c.base, current: c.current }))}
              cols={[{ key: "cohort", label: "Cohort" }, { key: "base", label: "Base $", num: true, render: (x) => usdM((x.base as number) / 1e6, { digits: 1 }) }, { key: "current", label: "Current $", num: true, render: (x) => usdM((x.current as number) / 1e6, { digits: 1 }) }]}
              filename="uth-nrr-illustration.csv"
              note={<ClassBadge kind="assumption" />}
            >
              <div style={{ height: 230 }}>
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                  <BarChart data={r.contrib.map((c) => ({ ...c, label: c.label.split(" (")[0] }))} margin={{ top: 8, right: 8, bottom: 4, left: 8 }}>
                    <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                    <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} interval={0} />
                    <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={56} tickFormatter={(v: number) => usdM(v / 1e6, { digits: 0 })} />
                    <Tooltip content={makeTip((v) => usdM(v / 1e6, { digits: 1 }))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                    <Bar dataKey="base" name="Base quarter" fill={PALETTE.s7} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                    <Bar dataKey="current" name="Current quarter" fill={PALETTE.s1} radius={[4, 4, 0, 0]} maxBarSize={22} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartFrame>
          </div>
        </div>
        <div className="uth-grid uth-g3" style={{ marginTop: 16 }}>
          <div className="uth-card sunk"><h4 className="uth-h4">Bounding Anthropic’s own cohort</h4><p className="uth-p" style={{ fontSize: 14, margin: 0 }}>Base ≤ Q3 2025 revenue ({usdM(b.baseHi)}) and ≥ that minus all 9M 2025 subscriptions ({usdM(b.baseLo)}). At 850–950%, the cohort produced <b>{usdM(b.cohortLo)}–{usdM(b.cohortHi)}</b> of Q3 2026’s {usdM(b.q3Revenue)} — <b>{pct(b.shareLo, 0)}–{pct(b.shareHi, 0)}</b>. The rest came from new customers and prosumer subscriptions. <ClassBadge kind="calculated" /></p></div>
          <div className="uth-card sunk"><h4 className="uth-h4">Not comparable to SaaS NRR</h4><p className="uth-p" style={{ fontSize: 14, margin: 0 }}>SaaS NRR typically measures annual recurring contracts of established customers (often ~110–130% for strong vendors). Anthropic’s measures quarterly consumption against a base quarter when revenue was {usdM(b.baseHi)} — 1/12 of today’s. Price cuts lower it; account consolidation and subscription-to-API migration can raise it.</p></div>
          <div className="uth-card sunk"><h4 className="uth-h4">What disclosure would settle it</h4><p className="uth-p" style={{ fontSize: 14, margin: 0 }}>Gross dollar retention; NRR for customers already ≥$100K in the base period; cohort revenue by vintage. Watch NRR at Dec 31, 2026 (base quarter revenue {usdM(2040)}) and Sep 30, 2027 (base {usdM(16956)}) — the denominator grows ~12× within a year. <ClassBadge kind="inference" /></p></div>
        </div>
      </div>
    </Section>
  );
}
