"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { annual, BASE_PREMIUM, COMPUTE_SIM_DEFAULTS, computeSim, computeTornado, profitabilityBridge, quarterly, type BridgePeriod, type ComputeSimInputs } from "@/lib/under-the-hood/calc";
import { COMMITMENTS } from "@/lib/under-the-hood/data";
import { mult, pct, usdM } from "@/lib/under-the-hood/format";
import { ChartFrame, Cite, ClassBadge, makeTip, PALETTE, Section, Seg, Slider, Toggle } from "../ui";

export default function Economics() {
  const q = quarterly();
  const a = annual();
  const [intMode, setIntMode] = useState<"pct" | "rpc">("pct");
  const intData = q.map((r) => ({ label: r.q.replace(" 20", " ’"), pct: r.computePct, rpc: r.revPerCompute, exst: r.q === "Q3 2026" ? (r.compute - 5000) / r.revenue : r.q === "Q2 2026" ? r.computePct : null }));

  // bridge
  const [period, setPeriod] = useState<BridgePeriod>("Q3 2026");
  const [tg, setTg] = useState({ sbc: true, donation: true, fairValue: true, shortTermPremium: false });
  const [prem, setPrem] = useState(1.6);
  const steps = profitabilityBridge(period, tg, prem);
  const bridge: (typeof steps[number] & { range: [number, number] })[] = [];
  for (let i = 0, run = 0; i < steps.length; i++) {
    const s = steps[i];
    if (s.kind === "total") { bridge.push({ ...s, range: [Math.min(0, s.value), Math.max(0, s.value)] }); run = s.value; }
    else { const next = run + s.value; bridge.push({ ...s, range: [Math.min(run, next), Math.max(run, next)] }); run = next; }
  }

  // compute simulator
  const [sim, setSim] = useState<ComputeSimInputs>(COMPUTE_SIM_DEFAULTS);
  const out = computeSim(sim);
  const q3 = q[6];
  const tornado = useMemo(() => computeTornado(sim), [sim]);
  const set = (k: keyof ComputeSimInputs) => (v: number) => setSim((s) => ({ ...s, [k]: v }));

  const functional = a.slice(1).map((r) => ({ period: r.period.replace("FY", "FY ").replace("9M", "9M "), cor: r.costOfRevenue / r.revenue, rnd: r.rnd / r.revenue, sm: r.salesMarketing / r.revenue, gna: r.gna / r.revenue, gm: r.impliedGrossMargin }));

  const chips = [
    { fam: "Google TPU", via: "Broadcom-financed leases (~$161.2B), Google Cloud minimum ($121.3B), additional TPU estimate ($125–150B, excluded)", note: "Largest share of named commitments; Google also competes via Gemini.", color: PALETTE.s1 },
    { fam: "NVIDIA GPU", via: "SpaceXAI (≤$120.5B), Nscale (≤$44.6B), Lambda ($41.3B); Microsoft Azure (chip not specified in filing)", note: "Neocloud and competitor-supplied capacity; shorter or conditional terms.", color: PALETTE.s3 },
    { fam: "AWS Trainium", via: "Amazon minimum spend $110.0B (chip mix not specified in the agreement description)", note: "Amazon says most of Bedrock already runs on Trainium (earnings call).", color: PALETTE.s2 },
    { fam: "AMD GPU", via: "Helios / MI450 framework; >$20B if full initial capacity procured (excluded from aggregate)", note: "First tranche 2027; AMD can buy up to $5.0B of Class N stock on milestones.", color: PALETTE.s7 },
  ];
  return (
    <Section id="economics">
      <div className="uth-split">
        <div className="uth-card">
          <ChartFrame
            title={intMode === "pct" ? "Compute & infrastructure as % of revenue" : "Revenue per $1 of compute & infrastructure"}
            summary="Compute and infrastructure expense fell from 251% of revenue in Q1 2025 to 48% in Q2 2026 and rose to 58% in Q3 2026. Excluding $5.0B of short-term compute, Q3 would have been about 29%. Revenue per dollar of compute rose from $0.40 to $2.08 and fell to $1.72 in Q3 2026."
            rows={intData.map((d) => ({ quarter: d.label, computePctOfRevenue: d.pct, revenuePerComputeDollar: d.rpc, q3ExShortTerm: d.label.startsWith("Q3 ’26") ? d.exst : null }))}
            cols={[{ key: "quarter", label: "Quarter" }, { key: "computePctOfRevenue", label: "Compute % revenue", num: true, render: (r) => pct(r.computePctOfRevenue as number, 0) }, { key: "revenuePerComputeDollar", label: "Revenue per $ compute", num: true, render: (r) => `$${(r.revenuePerComputeDollar as number).toFixed(2)}` }, { key: "q3ExShortTerm", label: "Ex short-term (Q3)", num: true, render: (r) => (r.q3ExShortTerm == null ? "" : pct(r.q3ExShortTerm as number, 0)) }]}
            filename="uth-compute-intensity.csv"
            controls={<Seg label="Compute metric" value={intMode} onChange={setIntMode} options={[{ value: "pct", label: "% of revenue" }, { value: "rpc", label: "Revenue per $" }]} />}
            legend={intMode === "pct" ? [{ label: "Reported", color: PALETTE.s2 }, { label: "Q3 ex short-term compute (calculated)", color: PALETTE.s3 }] : undefined}
            note={<span>Reported <Cite id="compute-pct-q3" /> · ex short-term <Cite id="compute-ex-st-q3" /></span>}
          >
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <LineChart data={intData} margin={{ top: 18, right: 40, bottom: 4, left: 4 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => (intMode === "pct" ? pct(v, 0) : `$${v.toFixed(1)}`)} />
                  <Tooltip content={makeTip((v) => (intMode === "pct" ? pct(v, 0) : `$${v.toFixed(2)}`))} />
                  {intMode === "pct" && <ReferenceLine y={1} stroke={PALETTE.axis} label={{ value: "100%", position: "right", fill: PALETTE.muted, fontSize: 11 }} />}
                  <Line dataKey={intMode} name={intMode === "pct" ? "Compute % of revenue" : "Revenue per $ compute"} stroke={PALETTE.s2} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, stroke: "#fff" }} isAnimationActive={false} />
                  {intMode === "pct" && <Line dataKey="exst" name="Q3 ex short-term compute" stroke={PALETTE.s3} strokeWidth={2} dot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} isAnimationActive={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">The Q3 compute spike, read carefully</h3>
          <ul className="uth-list" style={{ fontSize: 14 }}>
            <li><span><b>What happened:</b> $5.0B of Q3 compute (51% of the quarter’s $9.9B) came under short-term commitments that “currently cost significantly more” <Cite id="shortterm-q3" />.</span></li>
            <li><span><b>Why it was needed:</b> “When customer demand or research needs exceed this long-term capacity, we procure short-term compute” — the filing does not say which drove Q3 <Cite id="procure-lead" />.</span></li>
            <li><span><b>Temporary or recurring?</b> Management expects short-term use “to continue to increase in the near term” and to backfill it with Anthropic Direct capacity later. <ClassBadge kind="inference" /></span></li>
            <li><span><b>Utilization risk:</b> $69.8B of obligations fall due in the next 12 months vs ≈$39.5B of Q3 compute annualized — capacity is about to arrive in a large step <Cite id="commit-total" />.</span></li>
            <li><span><b>Alternative reading:</b> a shortage does not by itself prove demand strength — front-loaded research runs or late delivery of committed capacity would produce the same purchases.</span></li>
          </ul>
        </div>
      </div>

      <div className="uth-block uth-card">
        <ChartFrame
          title={`Profitability bridge — ${period}`}
          summary={`Bridge from revenue to adjusted operating income, GAAP operating income and GAAP net income for ${period}. Toggle adjustments to see each item's weight.`}
          rows={steps.map((s) => ({ step: s.label, value: s.value, type: s.kind, classification: s.classification, note: s.note }))}
          cols={[{ key: "step", label: "Step" }, { key: "value", label: "$M", num: true, render: (r) => usdM(r.value as number) }, { key: "type", label: "Type" }, { key: "classification", label: "Basis" }, { key: "note", label: "Note" }]}
          filename={`uth-bridge-${period.replace(/\s/g, "")}.csv`}
          controls={<Seg label="Period" value={period} onChange={setPeriod} options={[{ value: "Q2 2026", label: "Q2 2026" }, { value: "Q3 2026", label: "Q3 2026" }, { value: "9M 2026", label: "9M 2026" }]} />}
          note={<span>Reconciles to reported adjusted and GAAP figures <Cite id="adj-oi-q3" /> <Cite id="netloss-9m" /></span>}
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "0 0 10px" }}>
            <Toggle label="Stock-based compensation" checked={tg.sbc} onChange={(v) => setTg({ ...tg, sbc: v })} />
            <Toggle label="Donation matching" checked={tg.donation} onChange={(v) => setTg({ ...tg, donation: v })} />
            <Toggle label="Fair-value & mark-to-market" checked={tg.fairValue} onChange={(v) => setTg({ ...tg, fairValue: v })} />
            <Toggle label="Show ex short-term premium (assumption)" checked={tg.shortTermPremium} onChange={(v) => setTg({ ...tg, shortTermPremium: v })} />
            {tg.shortTermPremium && <div style={{ minWidth: 220 }}><Slider label="Assumed premium" value={prem} min={1.1} max={3} step={0.1} onChange={setPrem} format={(v) => mult(v)} /></div>}
          </div>
          <div style={{ height: 380 }}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
              <BarChart data={bridge} margin={{ top: 22, right: 12, bottom: 64, left: 8 }}>
                <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} interval={0} tick={{ fontSize: 10.5 }} angle={-28} textAnchor="end" height={70} />
                <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                <ReferenceLine y={0} stroke={PALETTE.axis} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,.04)" }} content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="uth-tip"><div className="t">{String(payload[0].payload.label)}</div><div className="r"><span>Amount</span><b>{usdM(payload[0].payload.value as number)}</b></div><div className="uth-xs" style={{ maxWidth: 240 }}>{String(payload[0].payload.note)}</div></div>) : null} />
                <Bar dataKey="range" isAnimationActive={false} radius={[3, 3, 3, 3]} maxBarSize={40}>
                  {bridge.map((b, i) => <Cell key={i} fill={b.kind === "total" ? (b.classification === "assumption" ? PALETTE.s4 : b.value >= 0 ? PALETTE.accent : PALETTE.s8) : b.value >= 0 ? PALETTE.s3 : PALETTE.s2} />)}
                  <LabelList dataKey="value" position="top" style={{ fontSize: 10.5, fill: PALETTE.ink }} formatter={(v: unknown) => usdM(Number(v))} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
        <div className="uth-grid uth-g2" style={{ marginTop: 12 }}>
          <div className="uth-card sunk"><h4 className="uth-h4">The case that true profitability is stronger</h4><p className="uth-p" style={{ fontSize: 14 }}>Operating cash flow was +$6.6B for nine months <Cite id="ocf-9m" />; the $104B net loss is ~90% non-cash fair-value marks <Cite id="fv-notes-9m" />; Q3 compute ex short-term was ~29% of revenue; implied serving gross margin ~85% <Cite id="gm-9m" />.</p></div>
          <div className="uth-card sunk"><h4 className="uth-h4">The case that adjusted profit understates the cost of the frontier</h4><p className="uth-p" style={{ fontSize: 14 }}>SBC ($3.3B for 9M) and the donation match ($2.1B) are recurring, dilutive economics <Cite id="sbc-9m" />; $32.3B of unrecognized RSU expense awaits <Cite id="unrecognized-sbc" />; research compute (≥74% of compute) keeps rising; ≈$105B/yr of obligations through 2030 are fixed <Cite id="commit-total" />.</p></div>
        </div>
      </div>

      <div className="uth-block uth-split rev">
        <div className="uth-card">
          <ChartFrame
            title="Where the money goes — functional expenses as % of revenue"
            summary="Anthropic's functional expense note shows cost of revenue (customer-serving compute) at 14.5% of 9M 2026 revenue, versus R&D at 58%, sales and marketing at 20% and G&A at 12%."
            legend={[{ label: "Cost of revenue", color: PALETTE.s1 }, { label: "R&D (incl. research & internal-use compute)", color: PALETTE.s7 }, { label: "Sales & marketing", color: PALETTE.s2 }, { label: "G&A", color: PALETTE.s4 }]}
            rows={functional.map((f) => ({ period: f.period, costOfRevenue: f.cor, rnd: f.rnd, salesMarketing: f.sm, gna: f.gna, impliedGrossMargin: f.gm }))}
            cols={[{ key: "period", label: "Period" }, { key: "costOfRevenue", label: "Cost of revenue", num: true, render: (r) => pct(r.costOfRevenue as number, 0) }, { key: "rnd", label: "R&D", num: true, render: (r) => pct(r.rnd as number, 0) }, { key: "salesMarketing", label: "S&M", num: true, render: (r) => pct(r.salesMarketing as number, 0) }, { key: "gna", label: "G&A", num: true, render: (r) => pct(r.gna as number, 0) }, { key: "impliedGrossMargin", label: "Implied GM", num: true, render: (r) => pct(r.impliedGrossMargin as number, 1) }]}
            filename="uth-functional-expenses.csv"
            note={<span>Note 8 functional presentation <Cite id="cor-9m" /> <Cite id="rd-9m" /></span>}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart data={functional} margin={{ top: 8, right: 8, bottom: 4, left: 4 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="period" stroke={PALETTE.axis} tickLine={false} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => pct(v, 0)} domain={[0, 4]} allowDataOverflow />
                  <Tooltip content={makeTip((v) => pct(v, 1))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <Bar dataKey="cor" name="Cost of revenue" stackId="a" fill={PALETTE.s1} isAnimationActive={false} stroke="#fff" strokeWidth={1} />
                  <Bar dataKey="rnd" name="R&D" stackId="a" fill={PALETTE.s7} isAnimationActive={false} stroke="#fff" strokeWidth={1} />
                  <Bar dataKey="sm" name="Sales & marketing" stackId="a" fill={PALETTE.s2} isAnimationActive={false} stroke="#fff" strokeWidth={1} />
                  <Bar dataKey="gna" name="G&A" stackId="a" fill={PALETTE.s4} isAnimationActive={false} stroke="#fff" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
          <p className="uth-xs">FY2024 values exceed the axis (pre-scale year; total opex 872% of revenue). Axis capped at 400% for legibility; see “View data”.</p>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">Serving is cheap; the frontier is expensive</h3>
          <p className="uth-p" style={{ fontSize: 14.5 }}>Cost of revenue — “substantially all” customer-serving compute — was <b>{usdM(a[4].costOfRevenue)}</b> against <b>{usdM(a[4].compute)}</b> of total compute in 9M 2026. So at most <b>{pct(a[4].servingShareMax, 0)}</b> of compute served paying customers; at least ~74% went to research, model development, internal Claude usage and free access <Cite id="serving-share-bound" />.</p>
          <p className="uth-p" style={{ fontSize: 14.5 }}>Implied gross margin: <b>{pct(a[4].impliedGrossMargin, 1)}</b> (9M 2026) vs {pct(a[2].impliedGrossMargin, 1)} (FY2025). <ClassBadge kind="calculated" /></p>
          <p className="uth-xs" style={{ margin: 0 }}>Caveat: the allocation of a “single fungible pool” across functions is a management judgment; Anthropic does not report gross margin.</p>
        </div>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Compute economics simulator — one quarter forward from Q3 2026</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}><ClassBadge kind="assumption" /><button type="button" className="uth-btn" onClick={() => setSim(COMPUTE_SIM_DEFAULTS)}>Reset to Q3 actuals</button></div>
        </div>
        <div className="uth-split">
          <div className="uth-grid uth-g2" style={{ alignContent: "start" }}>
            <Slider label="Usage growth (QoQ)" value={sim.volumeGrowth} min={-0.2} max={0.6} step={0.01} onChange={set("volumeGrowth")} format={(v) => pct(v, 0, true)} hint="Tokens / workloads served" />
            <Slider label="Price change" value={sim.priceChange} min={-0.4} max={0.1} step={0.01} onChange={set("priceChange")} format={(v) => pct(v, 0, true)} hint="Q3 price cuts ≈ −3.5% of revenue" />
            <Slider label="Compute efficiency gain" value={sim.efficiency} min={0} max={0.5} step={0.01} onChange={set("efficiency")} format={(v) => pct(v, 0)} hint="Less compute per unit of work" />
            <Slider label="Agentic workload intensity" value={sim.intensity} min={-0.2} max={0.5} step={0.01} onChange={set("intensity")} format={(v) => pct(v, 0, true)} hint="More compute per unit of usage" />
            <Slider label="Utilization of paid capacity" value={sim.utilization} min={0.5} max={1} step={0.01} onChange={set("utilization")} format={(v) => pct(v, 0)} hint="Idle committed capacity still costs" />
            <Slider label="Short-term share of capacity" value={sim.shortTermShare} min={0} max={0.8} step={0.01} onChange={set("shortTermShare")} format={(v) => pct(v, 0)} hint={`Q3 ≈ ${pct(COMPUTE_SIM_DEFAULTS.shortTermShare, 0)} if premium ${mult(BASE_PREMIUM)}`} />
            <Slider label="Short-term price premium" value={sim.premium} min={1} max={3} step={0.05} onChange={set("premium")} format={(v) => mult(v, 2)} hint="Not disclosed — 'significantly more'" />
          </div>
          <div>
            <div className="uth-grid uth-g2">
              <div className="uth-card sunk"><div className="uth-kpi-label">Modeled revenue</div><div className="uth-kpi-value">{usdM(out.revenue)}</div><div className="uth-xs">Q3 actual {usdM(q3.revenue)}</div></div>
              <div className="uth-card sunk"><div className="uth-kpi-label">Modeled compute</div><div className="uth-kpi-value">{usdM(out.compute)}</div><div className="uth-xs">{pct(out.computePct, 0)} of revenue (Q3 {pct(q3.computePct, 0)})</div></div>
              <div className="uth-card sunk"><div className="uth-kpi-label">Revenue per $ compute</div><div className="uth-kpi-value">${out.revPerCompute.toFixed(2)}</div><div className="uth-xs">Q3 ${q3.revPerCompute.toFixed(2)}</div></div>
              <div className="uth-card sunk"><div className="uth-kpi-label">Modeled adjusted op. margin</div><div className="uth-kpi-value" style={{ color: out.adjMargin < 0 ? "var(--bad)" : "var(--ink)" }}>{pct(out.adjMargin, 1)}</div><div className="uth-xs">Q3 {pct(q3.adjMargin, 1)} · other costs held at Q3 ratio</div></div>
            </div>
            <div style={{ marginTop: 14 }}>
              <div className="uth-h4">Sensitivity: margin change from each input’s range</div>
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                  <BarChart layout="vertical" data={tornado.map((t) => ({ ...t, range: [Math.min(t.lo, t.hi), Math.max(t.lo, t.hi)] }))} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                    <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
                    <XAxis type="number" stroke={PALETTE.axis} tickFormatter={(v: number) => `${v > 0 ? "+" : ""}${Math.round(v * 100)}pt`} />
                    <YAxis type="category" dataKey="label" width={150} stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} />
                    <ReferenceLine x={0} stroke={PALETTE.ink2} />
                    <Tooltip cursor={{ fill: "rgba(0,0,0,.04)" }} content={({ active, payload }) => active && payload?.[0] ? (
                      <div className="uth-tip"><div className="t">{String(payload[0].payload.label)}</div><div className="r"><span>At {String(payload[0].payload.loLabel)}</span><b>{`${Math.round(Number(payload[0].payload.lo) * 1000) / 10}pt`}</b></div><div className="r"><span>At {String(payload[0].payload.hiLabel)}</span><b>{`${Math.round(Number(payload[0].payload.hi) * 1000) / 10}pt`}</b></div></div>) : null} />
                    <Bar dataKey="range" fill={PALETTE.s1} radius={[3, 3, 3, 3]} maxBarSize={16} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>Model: Q3 compute restated at committed prices with an assumed {mult(BASE_PREMIUM)} Q3 premium; capacity needed = usage × intensity ÷ efficiency ÷ utilization; non-compute costs held at Q3’s {pct(1 - q3.computePct - q3.adjMargin, 0)} of revenue (adjusted basis). Defaults reproduce Q3 exactly. Not a forecast.</p>
      </div>

      <div className="uth-block">
        <h3 className="uth-h4">Multi-chip: portability is real — the commitments are concentrated</h3>
        <div className="uth-grid uth-g4">
          {chips.map((c) => (
            <div key={c.fam} className="uth-card" style={{ borderTop: `4px solid ${c.color}` }}>
              <div className="uth-h3" style={{ fontSize: 19 }}>{c.fam}</div>
              <p className="uth-p" style={{ fontSize: 13.5 }}>{c.via}</p>
              <p className="uth-xs" style={{ margin: 0 }}>{c.note}</p>
            </div>
          ))}
        </div>
        <p className="uth-small" style={{ marginTop: 10 }}>Anthropic trains and serves natively on all four families through a proprietary orchestration layer <Cite id="multichip" />. Portability lowers supplier bargaining power at the margin and lets Anthropic onboard new chips quickly — but ≈52–53% of the dollar value of named arrangements is TPU-linked (incl. excluded estimates) <ClassBadge kind="calculated" />. Named counterparty amounts: {COMMITMENTS.counterparties.length} arrangements.</p>
      </div>
    </Section>
  );
}
