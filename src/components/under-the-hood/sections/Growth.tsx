"use client";

import { useMemo, useState } from "react";
import { Bar, CartesianGrid, Cell, ComposedChart, LabelList, Line, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from "recharts";
import { CUSTOMERS, SCENARIOS } from "@/lib/under-the-hood/data";
import { quarterly, runScenario } from "@/lib/under-the-hood/calc";
import { num, pct, usdM } from "@/lib/under-the-hood/format";
import { ChartFrame, Cite, ClassBadge, makeTip, PALETTE, Section, Seg, Slider, Toggle } from "../ui";

type Mode = "revenue" | "qoq" | "add";

export default function Growth() {
  const q = quarterly();
  const [mode, setMode] = useState<Mode>("revenue");
  const [overlay, setOverlay] = useState(false);
  const proj = useMemo(() => {
    const out: Record<string, Record<string, number>> = {};
    (["bull", "base", "bear"] as const).forEach((k) => {
      runScenario(SCENARIOS.presets[k]).quarters.slice(0, 5).forEach((x, i, arr) => {
        const prev = i === 0 ? q[6].revenue : arr[i - 1].revenue;
        out[x.label] ??= {};
        out[x.label][k] = mode === "revenue" ? x.revenue : mode === "qoq" ? x.revenue / prev - 1 : x.revenue - prev;
      });
    });
    return out;
  }, [mode, q]);

  const val = (r: (typeof q)[number]) => (mode === "revenue" ? r.revenue : mode === "qoq" ? r.qoq : r.add);
  const data = [
    ...q.map((r) => ({ label: r.q.replace(" 20", " ’"), actual: val(r), yoy: r.yoy, projected: false as boolean, bull: null as number | null, base: null as number | null, bear: null as number | null })),
    ...(overlay ? Object.entries(proj).map(([l, v]) => ({ label: l.replace(" 20", " ’"), actual: null, yoy: null, projected: true, bull: v.bull, base: v.base, bear: v.bear })) : []),
  ];
  if (overlay) { const last = data[q.length - 1]; last.bull = last.base = last.bear = last.actual as number; }
  const fmt = (v: number) => (mode === "qoq" ? pct(v, 0) : usdM(v));

  const cohort = CUSTOMERS.cohort100k;
  const [violShare, setViolShare] = useState(0.06);
  const [enforced, setEnforced] = useState(0.5);
  const nineM = 33242;
  const q3 = q[6].revenue;
  const viol9 = nineM * violShare;
  const q3Viol = q3 * violShare;
  const headwind = q3Viol * (1 - enforced);

  return (
    <Section id="growth">
      <div className="uth-card">
        <ChartFrame
          title="Quarterly revenue, Q1 2025 – Q3 2026"
          summary={`Revenue rose from $376M in Q1 2025 to $16,956M in Q3 2026. Sequential growth was 109%, 76%, 48%, 132%, 144% and 47%. The dollar addition fell from $6,824M in Q2 2026 to $5,401M in Q3 2026.`}
          legend={overlay ? [{ label: "Reported", color: PALETTE.s1 }, { label: "Bull (scenario)", color: PALETTE.s3, dashed: true }, { label: "Base (scenario)", color: PALETTE.s7, dashed: true }, { label: "Bear (scenario)", color: PALETTE.s2, dashed: true }] : undefined}
          rows={data.map((d) => ({ quarter: d.label, type: d.projected ? "scenario" : "reported", value: d.actual, bull: d.bull, base: d.base, bear: d.bear }))}
          cols={[{ key: "quarter", label: "Quarter" }, { key: "type", label: "Type" }, { key: "value", label: "Reported", num: true, render: (r) => (r.value == null ? "" : fmt(r.value as number)) }, { key: "bull", label: "Bull", num: true, render: (r) => (r.bull == null ? "" : fmt(r.bull as number)) }, { key: "base", label: "Base", num: true, render: (r) => (r.base == null ? "" : fmt(r.base as number)) }, { key: "bear", label: "Bear", num: true, render: (r) => (r.bear == null ? "" : fmt(r.bear as number)) }]}
          filename="uth-quarterly-revenue.csv"
          controls={
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Seg label="Measure" value={mode} onChange={setMode} options={[{ value: "revenue", label: "Revenue" }, { value: "qoq", label: "QoQ growth" }, { value: "add", label: "Incremental $" }]} />
              <Toggle label="Scenario overlay" checked={overlay} onChange={setOverlay} />
            </div>
          }
          note={<span>Source: S-1/A quarterly results <Cite id="rev-q3-26" />{overlay && <> · <span className="uth-scenario-note">Shaded quarters are illustrative scenarios, not forecasts</span></>}</span>}
        >
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
              <ComposedChart data={data} margin={{ top: 22, right: 12, bottom: 4, left: 4 }}>
                <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} interval={0} tick={{ fontSize: 11 }} />
                <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={56} tickFormatter={(v: number) => (mode === "qoq" ? pct(v, 0) : usdM(v, { digits: 0 }))} />
                {overlay && <ReferenceArea x1="Q4 ’26" x2="Q4 ’27" fill="#f4f2ed" fillOpacity={0.9} label={{ value: "Scenario", position: "insideTop", fill: PALETTE.muted, fontSize: 11 }} />}
                <Tooltip content={makeTip((v) => fmt(v))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                <Bar dataKey="actual" name="Reported" fill={PALETTE.s1} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
                  {data.map((d, i) => <Cell key={i} fill={i === q.length - 1 ? PALETTE.accent : PALETTE.s1} />)}
                  <LabelList dataKey="actual" position="top" content={(p) => {
                    const { x, y, width, value, index } = p as { x: number; y: number; width: number; value: number | null; index: number };
                    if (value == null || (index !== q.length - 1 && index !== q.length - 2)) return null;
                    return <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fill={PALETTE.ink} fontWeight={600}>{fmt(value)}</text>;
                  }} />
                </Bar>
                {overlay && (["bull", "base", "bear"] as const).map((k, i) => (
                  <Line key={k} dataKey={k} name={`${k[0].toUpperCase()}${k.slice(1)} (scenario)`} stroke={[PALETTE.s3, PALETTE.s7, PALETTE.s2][i]} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} connectNulls isAnimationActive={false} />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
      </div>

      <div className="uth-block uth-grid uth-g3">
        <div className="uth-card">
          <h3 className="uth-h4">Percentage growth fell — and so did dollar additions</h3>
          <p className="uth-p" style={{ fontSize: 14.5 }}>Q3 added <b>{usdM(q[6].add ?? 0)}</b> versus <b>{usdM(q[5].add ?? 0)}</b> in Q2 — the first decline in seven quarters <Cite id="rev-add-q3" />. Adding back the disclosed <b>~$600M</b> price drag still leaves Q3 below Q2 <Cite id="price-cuts-q3" />.</p>
          <ClassBadge kind="calculated" />
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">What the filing supports as drivers</h3>
          <ul className="uth-list" style={{ fontSize: 14 }}>
            <li><span><b>Model releases:</b> &gt;80% of Q3 revenue from versions released in the prior six months <Cite id="new-models-share" /></span></li>
            <li><span><b>Price elasticity:</b> after Opus 4.5, QoQ growth went 48% → 132% <Cite id="elasticity-opus45" /></span></li>
            <li><span><b>Expansion:</b> ~900% NRR; ≥$100K customers &gt;950 → &gt;11,900 <Cite id="nrr" /></span></li>
            <li><span><b>Drags:</b> ~$600M price cuts; enforcement vs policy violators in Aug–Sep <Cite id="violations" /></span></li>
          </ul>
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">What cannot be determined</h3>
          <ul className="uth-list minus" style={{ fontSize: 14 }}>
            <li><span>Split of growth between new customers and expansion (NRR is a ratio, not a decomposition).</span></li>
            <li><span>Whether Q3 was capacity-constrained (short-term buying suggests demand pressure, but research needs also qualify).</span></li>
            <li><span>Product mix — Claude Code, Cowork, API — is not disclosed.</span></li>
          </ul>
        </div>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <ChartFrame
            title="Customers with ≥ $100K TTM revenue"
            summary="Counts of customers with at least $100,000 of trailing-twelve-month revenue: about 20 at Dec 2023, 200 at Dec 2024, 400 at Mar 2025, more than 600 at Jun 2025, more than 950 at Sep 2025, about 1,500 at Dec 2025, more than 6,000 at Jun 2026 and more than 11,900 at Sep 2026."
            rows={cohort.map((c) => ({ asOf: c.label, count: c.count, qualifier: c.qualifier, source: `${c.sourceId === "s1" ? "S-1" : "S-1/A"} p.${c.page}` }))}
            cols={[{ key: "asOf", label: "As of" }, { key: "count", label: "Customers", num: true, render: (r) => num(r.count as number) }, { key: "qualifier", label: "Qualifier" }, { key: "source", label: "Source" }]}
            filename="uth-100k-customers.csv"
            note={<span>Jun 2025 / Jun 2026 counts from the Oct 26 S-1; others S-1/A <Cite id="cust-100k" /></span>}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart data={cohort} margin={{ top: 22, right: 8, bottom: 4, left: 4 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}K` : String(v))} />
                  <Tooltip content={makeTip((v) => num(v))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <Bar dataKey="count" name="≥$100K customers" fill={PALETTE.s1} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
                    <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: PALETTE.ink }} formatter={(v: unknown) => (Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(1)}K` : String(v))} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">Revenue-quality explorer</h3>
          <p className="uth-p" style={{ fontSize: 14 }}>Anthropic estimates <b>5–7%</b> of nine-month revenue came from customers later found violating its usage policy or commercial terms <Cite id="violations" />. Revenue was recognized; it is not fraud or non-payment by definition. Explore what it means for the run-rate.</p>
          <div style={{ display: "grid", gap: 14 }}>
            <Slider label="Share of revenue from violating customers" value={violShare} min={0.05} max={0.07} step={0.005} onChange={setViolShare} format={(v) => pct(v, 1)} hint="Disclosed range 5–7% (9M 2026)" />
            <Slider label="Share already removed by Aug–Sep enforcement" value={enforced} min={0} max={1} step={0.05} onChange={setEnforced} format={(v) => pct(v, 0)} hint="Assumption — not disclosed" />
          </div>
          <dl className="uth-kv" style={{ marginTop: 14 }}>
            <dt>9M revenue implicated</dt><dd><b>{usdM(viol9)}</b> of {usdM(nineM)} <ClassBadge kind="calculated" /></dd>
            <dt>If evenly spread, Q3 share</dt><dd><b>{usdM(q3Viol)}</b> of {usdM(q3)}</dd>
            <dt>Remaining quarterly headwind</dt><dd><b>{usdM(headwind)}</b> ≈ {pct(headwind / q3, 1)} of Q3 revenue <ClassBadge kind="assumption" /></dd>
            <dt>Recurring vs not</dt><dd>Revenue from terminated accounts is not expected to recur; the filing expects the share to decline.</dd>
          </dl>
          <p className="uth-xs" style={{ marginTop: 10 }}>Other revenue-quality markers: consumption is 79% of revenue (usage can fall without churn) <Cite id="rev-consumption-9m" />; RPO is only $13.8B <Cite id="rpo" />; holiday spend dropped ~20% in two weeks <Cite id="seasonality" />.</p>
        </div>
      </div>
    </Section>
  );
}
