"use client";

import { useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Line, LineChart, ReferenceArea, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SCENARIOS, type ScenarioParams } from "@/lib/under-the-hood/data";
import { quarterly, runScenario } from "@/lib/under-the-hood/calc";
import { mult, pct, usdM } from "@/lib/under-the-hood/format";
import { ChartFrame, ClassBadge, DataTable, makeTip, PALETTE, Section, Seg, Slider, Toggle } from "../ui";

type Preset = "bull" | "base" | "bear";

export default function ScenarioLab() {
  const [preset, setPreset] = useState<Preset>("base");
  const [p, setP] = useState<ScenarioParams>(SCENARIOS.presets.base);
  const choose = (k: Preset) => { setPreset(k); setP(SCENARIOS.presets[k]); };
  const set = <K extends keyof ScenarioParams>(k: K) => (v: ScenarioParams[K]) => setP((x) => ({ ...x, [k]: v }));
  const res = useMemo(() => runScenario(p), [p]);
  const hist = quarterly();
  const data = [
    ...hist.map((h) => ({ label: h.q.replace(" 20", " ’"), actualRevenue: h.revenue, actualCompute: h.compute, revenue: null as number | null, compute: null as number | null, committed: null as number | null, margin: null as number | null, actualMargin: h.adjMargin, utilization: null as number | null, liquidity: null as number | null })),
    ...res.quarters.map((x) => ({ label: x.label.replace(" 20", " ’"), actualRevenue: null, actualCompute: null, revenue: x.revenue, compute: x.compute, committed: x.committed, margin: x.margin, actualMargin: null, utilization: x.utilization, liquidity: x.liquidity })),
  ];
  const last = data[hist.length - 1];
  last.revenue = last.actualRevenue; last.compute = last.actualCompute; last.margin = last.actualMargin;
  const changed = JSON.stringify(p) !== JSON.stringify(SCENARIOS.presets[preset]);
  const firstProj = res.quarters[0].label.replace(" 20", " ’");
  const lastProj = res.quarters[res.quarters.length - 1].label.replace(" 20", " ’");

  return (
    <Section id="scenarios">
      <div className="uth-card">
        <div className="uth-toolbar">
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Seg label="Scenario preset" value={preset} onChange={choose} options={[{ value: "bull", label: "Bull" }, { value: "base", label: "Base" }, { value: "bear", label: "Bear" }]} />
            {changed && <span className="uth-badge assumption">Custom assumptions</span>}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className="uth-scenario-note">Model outputs — not forecasts, not management guidance</span>
            <button type="button" className="uth-btn" onClick={() => setP(SCENARIOS.presets[preset])}>Reset to preset</button>
          </div>
        </div>
        <p className="uth-p" style={{ fontSize: 14.5 }}><b>{SCENARIOS.presets[preset].label} narrative:</b> {SCENARIOS.presets[preset].narrative}</p>
        <div className="uth-split rev">
          <div className="uth-grid" style={{ alignContent: "start" }}>
            <Slider label="Starting QoQ revenue growth (Q4 2026)" value={p.g0} min={0} max={0.45} step={0.01} onChange={set("g0")} format={(v) => pct(v, 0)} hint="Q3 2026 actual: 47%" />
            <Slider label="Quarterly growth decay" value={p.decay} min={0.7} max={1} step={0.01} onChange={set("decay")} format={(v) => `×${v.toFixed(2)} / qtr`} hint="Each quarter's growth = previous × decay" />
            <Slider label="Price change per year" value={p.priceChange} min={-0.6} max={0.1} step={0.01} onChange={set("priceChange")} format={(v) => pct(v, 0, true)} hint="Lower prices mean more usage per $ of revenue" />
            <Slider label="Compute efficiency gain per year" value={p.efficiency} min={0} max={0.8} step={0.01} onChange={set("efficiency")} format={(v) => pct(v, 0)} hint="Less serving compute per unit of usage" />
            <Slider label="Research compute growth per year" value={p.researchGrowth} min={0} max={1.2} step={0.01} onChange={set("researchGrowth")} format={(v) => pct(v, 0)} hint="The frontier tax" />
            <Slider label="Serving share of Q3 compute" value={p.servingShare} min={0.15} max={0.6} step={0.01} onChange={set("servingShare")} format={(v) => pct(v, 0)} hint="Filing implies ≤26% is paid-customer serving" />
            <Slider label="Short-term premium on shortfalls" value={p.premium} min={1} max={3} step={0.05} onChange={set("premium")} format={(v) => mult(v, 2)} />
            <Slider label="Other cash costs (% of revenue)" value={p.otherOpex} min={0.15} max={0.45} step={0.01} onChange={set("otherOpex")} format={(v) => pct(v, 0)} hint="9M 2026: ≈31% (S&M incl. channel fees, cash personnel, G&A)" />
            <Slider label="IPO / new equity proceeds" value={p.ipoProceeds} min={0} max={100000} step={5000} onChange={set("ipoProceeds")} format={(v) => usdM(v)} hint="Offering size not yet disclosed" />
            <Toggle label="Draw conditional partner financing (+$77.0B)" checked={p.partnerFinancing} onChange={set("partnerFinancing")} />
            <Toggle label="Exit contingent commitments from 2028 (−24%)" checked={p.exitContingent} onChange={set("exitContingent")} />
          </div>
          <div>
            <div className="uth-grid uth-g4">
              {res.years.map((y) => (
                <div key={y.year} className="uth-card sunk">
                  <div className="uth-kpi-label">{y.year} revenue</div>
                  <div className="uth-kpi-value" style={{ fontSize: 24 }}>{usdM(y.revenue)}</div>
                  <div className="uth-xs">{y.growth === null ? "vs 2026E n/a" : `${pct(y.growth, 0, true)} YoY`} · margin <b style={{ color: y.margin < 0 ? "var(--bad)" : "var(--ink)" }}>{pct(y.margin, 0)}</b></div>
                </div>
              ))}
            </div>
            <div className="uth-card" style={{ marginTop: 12, borderColor: res.covenantBreach ? "var(--bad)" : "var(--rule)" }}>
              <b>{res.covenantBreach ? `Liquidity falls below the $5.0B covenant in ${res.covenantBreach}` : `Liquidity stays above the $5.0B covenant (low point ${usdM(res.minLiquidity)})`}</b>
              <div className="uth-xs">Starting liquidity $146.6B (Sep 30, 2026){p.partnerFinancing ? " + $77.0B partner financing" : ""}{p.ipoProceeds ? ` + ${usdM(p.ipoProceeds)} new equity` : ""}. Cash generation = revenue × (1 − other costs) − compute.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="uth-block uth-card">
        <ChartFrame
          title="Revenue vs compute — reported history, then scenario"
          summary={`Reported quarterly revenue and compute expense from Q1 2025 to Q3 2026, followed by the ${preset} scenario from Q4 2026 to Q4 2030 including committed obligations.`}
          legend={[{ label: "Revenue — reported", color: PALETTE.s1 }, { label: "Compute — reported", color: PALETTE.s2 }, { label: "Revenue — scenario", color: PALETTE.s1, dashed: true }, { label: "Compute expense — scenario", color: PALETTE.s2, dashed: true }, { label: "Committed obligations (illustrative timing)", color: PALETTE.s4 }]}
          rows={data.map((d) => ({ quarter: d.label, revenueReported: d.actualRevenue, computeReported: d.actualCompute, revenueScenario: d.revenue, computeScenario: d.compute, committed: d.committed }))}
          cols={[{ key: "quarter", label: "Quarter" }, ...(["revenueReported", "computeReported", "revenueScenario", "computeScenario", "committed"].map((k) => ({ key: k, label: k.replace(/([A-Z])/g, " $1").toLowerCase(), num: true, render: (r: Record<string, unknown>) => (r[k] == null ? "" : usdM(r[k] as number)) })))]}
          filename={`uth-scenario-${preset}.csv`}
          note={<ClassBadge kind="assumption" />}
        >
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
              <ComposedChart data={data} margin={{ top: 12, right: 12, bottom: 4, left: 8 }}>
                <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 10.5 }} interval={1} />
                <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                <ReferenceArea x1={firstProj} x2={lastProj} fill="#f4f2ed" fillOpacity={0.8} label={{ value: "Scenario (illustrative)", position: "insideTopLeft", fill: PALETTE.muted, fontSize: 11 }} />
                <Tooltip content={makeTip((v) => usdM(v))} />
                <Area dataKey="committed" name="Committed obligations" fill={PALETTE.s4} fillOpacity={0.12} stroke={PALETTE.s4} strokeWidth={2} type="stepAfter" isAnimationActive={false} />
                <Line dataKey="actualRevenue" name="Revenue (reported)" stroke={PALETTE.s1} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                <Line dataKey="actualCompute" name="Compute (reported)" stroke={PALETTE.s2} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
                <Line dataKey="revenue" name="Revenue (scenario)" stroke={PALETTE.s1} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
                <Line dataKey="compute" name="Compute expense (scenario)" stroke={PALETTE.s2} strokeWidth={2} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
      </div>

      <div className="uth-block uth-grid uth-g2">
        <div className="uth-card">
          <ChartFrame
            title="Cash operating margin and capacity utilization"
            summary="Scenario cash operating margin (revenue minus compute and other cash costs) and utilization of committed capacity by quarter."
            legend={[{ label: "Cash operating margin", color: PALETTE.s7 }, { label: "Utilization of committed capacity", color: PALETTE.s3 }]}
            rows={data.filter((d) => d.margin !== null || d.utilization !== null).map((d) => ({ quarter: d.label, margin: d.margin, utilization: d.utilization }))}
            cols={[{ key: "quarter", label: "Quarter" }, { key: "margin", label: "Margin", num: true, render: (r) => pct(r.margin as number, 1) }, { key: "utilization", label: "Utilization", num: true, render: (r) => (r.utilization == null ? "" : pct(r.utilization as number, 0)) }]}
            filename={`uth-scenario-margin-${preset}.csv`}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <LineChart data={data.slice(hist.length - 1)} margin={{ top: 12, right: 12, bottom: 4, left: 4 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 10.5 }} interval={1} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={48} tickFormatter={(v: number) => pct(v, 0)} domain={[-1, 1]} allowDataOverflow />
                  <ReferenceLine y={0} stroke={PALETTE.ink2} />
                  <Tooltip content={makeTip((v) => pct(v, 1))} />
                  <Line dataKey="margin" name="Cash operating margin" stroke={PALETTE.s7} strokeWidth={2} dot={false} isAnimationActive={false} />
                  <Line dataKey="utilization" name="Utilization" stroke={PALETTE.s3} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card">
          <ChartFrame
            title="Liquidity path"
            summary="Scenario liquidity by quarter, starting from $146.6B at Sep 30, 2026, against the $5.0B minimum-liquidity covenant."
            rows={res.quarters.map((x) => ({ quarter: x.label, liquidity: x.liquidity, cashGeneration: x.fcf }))}
            cols={[{ key: "quarter", label: "Quarter" }, { key: "liquidity", label: "Liquidity", num: true, render: (r) => usdM(r.liquidity as number) }, { key: "cashGeneration", label: "Cash generation", num: true, render: (r) => usdM(r.cashGeneration as number) }]}
            filename={`uth-scenario-liquidity-${preset}.csv`}
          >
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <LineChart data={res.quarters.map((x) => ({ label: x.label.replace(" 20", " ’"), liquidity: x.liquidity }))} margin={{ top: 12, right: 12, bottom: 4, left: 8 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="label" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 10.5 }} interval={1} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={60} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                  <ReferenceLine y={5000} stroke={PALETTE.bad} label={{ value: "$5B covenant", position: "insideBottomRight", fill: PALETTE.bad, fontSize: 11 }} />
                  <Tooltip content={makeTip((v) => usdM(v))} />
                  <Line dataKey="liquidity" name="Liquidity" stroke={PALETTE.s1} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
      </div>

      <div className="uth-block">
        <DataTable
          caption="Annual scenario outputs"
          rows={res.years as unknown as Record<string, unknown>[]}
          cols={[
            { key: "year", label: "Year" },
            { key: "revenue", label: "Revenue", num: true, render: (r) => usdM(r.revenue as number) },
            { key: "growth", label: "YoY", num: true, render: (r) => (r.growth == null ? "—" : pct(r.growth as number, 0, true)) },
            { key: "committed", label: "Committed obligations", num: true, render: (r) => usdM(r.committed as number) },
            { key: "required", label: "Compute needed", num: true, render: (r) => usdM(r.required as number) },
            { key: "utilization", label: "Utilization", num: true, render: (r) => pct(r.utilization as number, 0) },
            { key: "compute", label: "Compute expense", num: true, render: (r) => usdM(r.compute as number) },
            { key: "margin", label: "Cash op. margin", num: true, render: (r) => pct(r.margin as number, 0) },
            { key: "coverage", label: "Revenue ÷ obligations", num: true, render: (r) => mult(r.coverage as number, 2) },
            { key: "liquidityEnd", label: "Liquidity (year-end)", num: true, render: (r) => usdM(r.liquidityEnd as number) },
          ]}
        />
        <p className="uth-xs" style={{ marginTop: 8 }}>{SCENARIOS._meta.description}</p>
      </div>
    </Section>
  );
}
