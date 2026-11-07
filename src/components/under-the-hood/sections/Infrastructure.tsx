"use client";

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COMMITMENTS } from "@/lib/under-the-hood/data";
import { impliedQuarterlyGrowth, obligationProfile, quarterly } from "@/lib/under-the-hood/calc";
import { pct, usdM } from "@/lib/under-the-hood/format";
import { ChartFrame, Cite, ClassBadge, DataTable, makeTip, PALETTE, Section, Seg, Slider } from "../ui";

type Filter = "all" | "TPU" | "NVIDIA" | "AMD" | "other";

export default function Infrastructure() {
  const agg = COMMITMENTS.aggregate;
  // waterfall
  const bucketBars: { label: string; value: number; range: [number, number]; kind: string; note: string }[] = [];
  for (let i = 0, run = 0; i < COMMITMENTS.buckets.length; i++) {
    const b = COMMITMENTS.buckets[i];
    const short: Record<string, string> = { table: "Contractual table", shortterm: "Short-term", "leases-not-commenced": "Leases not commenced", "post-q3": "Post-Q3 commitments", "post-q3-short": "Post-Q3 short-term" };
    bucketBars.push({ label: short[b.id] ?? b.label, value: b.amount, range: [run, run + b.amount], kind: "add", note: b.detail });
    run += b.amount;
  }
  const wf = [
    ...bucketBars,
    { label: "Aggregate", value: agg.total, range: [0, agg.total] as [number, number], kind: "total", note: "Disclosed total; buckets do not overlap" },
    { label: "Contingent / terminable", value: -agg.contingentOrTerminable, range: [agg.total - agg.contingentOrTerminable, agg.total] as [number, number], kind: "sub", note: "Counterparty financing, facilities or approvals; exercisable termination rights" },
    { label: "Not contingent", value: agg.total - agg.contingentOrTerminable, range: [0, agg.total - agg.contingentOrTerminable] as [number, number], kind: "total2", note: "Calculated" },
    { label: "Excluded (est. midpoint)", value: (agg.excludedEstimateLow + agg.excludedEstimateHigh) / 2, range: [agg.total, agg.total + (agg.excludedEstimateLow + agg.excludedEstimateHigh) / 2] as [number, number], kind: "excl", note: "Additional Google TPU ($125–150B) and AMD (>$20B); payable after delivery; not liabilities today" },
  ];
  const wfColor: Record<string, string> = { add: PALETTE.s1, total: PALETTE.accent, sub: PALETTE.s2, total2: PALETTE.s3, excl: PALETTE.s4 };

  const prof = obligationProfile();
  const timeline = prof.map((p) => ({ year: String(p.year), table: p.table, other: p.other, total: p.total }));
  const [horizon, setHorizon] = useState<"2030" | "2045">("2030");
  const tl = horizon === "2030" ? timeline.slice(0, 5) : timeline;

  // ledger
  const [filter, setFilter] = useState<Filter>("all");
  const fam = (chip: string): Filter => (chip.includes("TPU") ? "TPU" : chip.includes("NVIDIA") ? "NVIDIA" : chip.includes("AMD") ? "AMD" : "other");
  const ledger = useMemo(() => COMMITMENTS.counterparties.filter((c) => filter === "all" || fam(c.chip) === filter).sort((a, b) => b.amount - a.amount), [filter]);
  const SHORT: Record<string, string> = { broadcom: "Broadcom TPU leases", "google-tpu-addl": "Add’l TPU (est.)", google: "Google Cloud", amazon: "Amazon (AWS)", spacexai: "SpaceXAI", microsoft: "Microsoft Azure", nscale: "Nscale", lambda: "Lambda", amd: "AMD (est.)" };
  const exposure = COMMITMENTS.counterparties.map((c) => ({ name: SHORT[c.id] ?? c.name, amount: c.amount, excluded: c.inAggregate.startsWith("No"), basis: c.amountBasis })).sort((a, b) => b.amount - a.amount);
  const tpu = COMMITMENTS.counterparties.filter((c) => fam(c.chip) === "TPU");
  const tpuLo = tpu.reduce((s, c) => s + (c.amountLow ?? c.amount), 0), tpuHi = tpu.reduce((s, c) => s + (c.amountHigh ?? c.amount), 0);

  // stress
  const r0 = quarterly()[6].revenue;
  const [g, setG] = useState(0.15);
  const x = 1 + g;
  const next4 = r0 * (x + x * x + x ** 3 + x ** 4);
  const ratio = agg.next12Months / next4;
  const needed58 = impliedQuarterlyGrowth(0.58), needed48 = impliedQuarterlyGrowth(0.48);

  return (
    <Section id="infrastructure">
      <div className="uth-card">
        <ChartFrame
          title="From buckets to the headline: $895.4B, what is conditional, what is excluded"
          summary="Five non-overlapping buckets sum to the $895.4B aggregate: contractual obligations table $320.0B, short-term commitments $17.4B, leases not yet commenced $451.2B, commitments after Sep 30 $100.2B and post-Q3 short-term $6.6B. $213.8B is subject to termination rights or contingent conditions, leaving $681.6B. Another $150–175B of arrangements without fixed amounts is excluded."
          rows={wf.map((w) => ({ step: w.label, amount: w.value, note: w.note }))}
          cols={[{ key: "step", label: "Step" }, { key: "amount", label: "$M", num: true, render: (r) => usdM(r.amount as number) }, { key: "note", label: "Note" }]}
          filename="uth-commitments-waterfall.csv"
          note={<span>MD&A — Contractual Obligations <Cite id="commit-total" /> <Cite id="commit-contingent" /> <Cite id="commit-excluded" /></span>}
        >
          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
              <BarChart data={wf} margin={{ top: 24, right: 12, bottom: 40, left: 8 }}>
                <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                <XAxis dataKey="label" interval={0} angle={-20} textAnchor="end" height={64} tick={{ fontSize: 10.5 }} stroke={PALETTE.axis} tickLine={false} />
                <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={64} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,.04)" }} content={({ active, payload }) => active && payload?.[0] ? (
                  <div className="uth-tip"><div className="t">{String(payload[0].payload.label)}</div><div className="r"><span>Amount</span><b>{usdM(Number(payload[0].payload.value))}</b></div><div className="uth-xs" style={{ maxWidth: 260 }}>{String(payload[0].payload.note)}</div></div>) : null} />
                <Bar dataKey="range" isAnimationActive={false} maxBarSize={46} radius={[3, 3, 3, 3]}>
                  {wf.map((w, i) => <Cell key={i} fill={wfColor[w.kind]} />)}
                  <LabelList dataKey="value" position="top" style={{ fontSize: 11, fill: PALETTE.ink, fontWeight: 600 }} formatter={(v: unknown) => usdM(Number(v), { digits: 1 })} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartFrame>
        <p className="uth-xs" style={{ marginTop: 6 }}>{COMMITMENTS._meta.doubleCountingRule}</p>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <ChartFrame
            title="Annual obligation profile"
            summary="Disclosed contractual-table payments by year (2026 Q4 $5.2B, 2027 $29.2B, 2028 $44.4B, 2029 $47.8B, 2030 $45.1B) plus an illustrative allocation of the other buckets calibrated to the disclosed anchors: $69.8B in the next 12 months and $447.5B before 2031."
            legend={[{ label: "Disclosed contractual table", color: PALETTE.s1 }, { label: "Other buckets — illustrative timing", color: PALETTE.s4 }]}
            rows={timeline.map((t) => ({ year: t.year, disclosedTable: t.table, otherIllustrative: Math.round(t.other), total: Math.round(t.total) }))}
            cols={[{ key: "year", label: "Year" }, { key: "disclosedTable", label: "Disclosed table", num: true, render: (r) => usdM(r.disclosedTable as number) }, { key: "otherIllustrative", label: "Other (illustrative)", num: true, render: (r) => usdM(r.otherIllustrative as number) }, { key: "total", label: "Total", num: true, render: (r) => usdM(r.total as number) }]}
            filename="uth-obligation-profile.csv"
            controls={<Seg label="Horizon" value={horizon} onChange={setHorizon} options={[{ value: "2030", label: "To 2030" }, { value: "2045", label: "To 2045" }]} />}
            note={<span><ClassBadge kind="assumption" /> timing of non-table buckets · table <Cite id="commit-total" /></span>}
          >
            <div style={{ height: 290 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart data={tl} margin={{ top: 18, right: 8, bottom: 4, left: 8 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="year" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={56} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                  <Tooltip content={makeTip((v) => usdM(v))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <ReferenceLine y={quarterly()[6].compute * 4} stroke={PALETTE.ink2} strokeDasharray="4 4" label={{ value: "Q3’26 compute × 4", position: "insideTopRight", fill: PALETTE.ink2, fontSize: 11 }} />
                  <Bar dataKey="table" name="Disclosed table" stackId="o" fill={PALETTE.s1} isAnimationActive={false} stroke="#fff" strokeWidth={1} maxBarSize={36} />
                  <Bar dataKey="other" name="Other buckets (illustrative)" stackId="o" fill={PALETTE.s4} isAnimationActive={false} stroke="#fff" strokeWidth={1} radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">Stress test: what growth do the commitments assume?</h3>
          <p className="uth-p" style={{ fontSize: 14 }}>To keep compute at Q3’s 58% of revenue while paying the next 12 months of obligations ({usdM(agg.next12Months)}), revenue over the next four quarters must reach {usdM(agg.next12Months / 0.58)} — about <b>{pct(needed58, 0)}</b> sequential growth per quarter from Q3 (at Q2’s 48% ratio: {pct(needed48, 0)}). <ClassBadge kind="calculated" /></p>
          <Slider label="Assumed QoQ revenue growth, next four quarters" value={g} min={0} max={0.5} step={0.01} onChange={setG} format={(v) => pct(v, 0)} />
          <dl className="uth-kv" style={{ marginTop: 12 }}>
            <dt>Next-4-quarter revenue</dt><dd><b>{usdM(next4)}</b></dd>
            <dt>Obligations ÷ revenue</dt><dd><b style={{ color: ratio > 0.8 ? "var(--bad)" : ratio > 0.6 ? "var(--warn)" : "var(--good)" }}>{pct(ratio, 0)}</b> (Q3 compute ratio: 58%)</dd>
            <dt>Liquidity cover</dt><dd>{usdM(146600)} liquidity = {(146600 / agg.next12Months).toFixed(1)}× next-12-month obligations; {usdM(agg.next12MonthsContingent)} of those are contingent <Cite id="liquidity" /></dd>
          </dl>
          <p className="uth-xs" style={{ margin: "10px 0 0" }}>Obligations include research and internal-use compute and some capex-like prepayments; payment timing differs from expense recognition (finance leases). See the Scenario Lab for a multi-year version.</p>
        </div>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Obligation ledger — named arrangements</h3>
          <div className="uth-chips" role="group" aria-label="Filter by chip family">
            {(["all", "TPU", "NVIDIA", "AMD", "other"] as Filter[]).map((f) => <button key={f} type="button" className="uth-chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === "all" ? "All" : f === "other" ? "Chip not specified" : f}</button>)}
          </div>
        </div>
        {ledger.length === 0 ? <div className="uth-empty">No arrangements in this category.</div> : (
          <DataTable
            minWidth={1180}
            caption="Named infrastructure arrangements"
            rows={ledger as unknown as Record<string, unknown>[]}
            cols={[
              { key: "name", label: "Counterparty", render: (r) => <strong>{String(r.name)}</strong> },
              { key: "amount", label: "Headline $", num: true, render: (r) => (r.amountLow ? `${usdM(r.amountLow as number)}–${usdM(r.amountHigh as number)}` : usdM(r.amount as number)) },
              { key: "amountBasis", label: "Basis" },
              { key: "period", label: "Term / delivery" },
              { key: "chip", label: "Chip" },
              { key: "cancelability", label: "Cancelability" },
              { key: "financing", label: "Financing" },
              { key: "inAggregate", label: "In $895.4B?" },
              { key: "page", label: "S-1/A p." },
            ]}
          />
        )}
        <p className="uth-xs" style={{ marginTop: 8 }}>Headline amounts mix minimums, “up to” amounts and estimates and overlap with the buckets above — do not add them to the $895.4B. TPU-linked arrangements: {usdM(tpuLo)}–{usdM(tpuHi)}. <ClassBadge kind="calculated" /></p>
      </div>

      <div className="uth-block uth-split rev">
        <div className="uth-card sunk">
          <h3 className="uth-h4">Compute moat or long-duration bet?</h3>
          <p className="uth-p" style={{ fontSize: 14 }}><b>Moat reading:</b> secured capacity through 2033+, four chip families, Anthropic Direct separating cheap data-center commitments from expensive accelerators, partner financing ($77.0B conditional) <Cite id="npa-capacity" />.</p>
          <p className="uth-p" style={{ fontSize: 14 }}><b>Bet reading:</b> obligations jump from {usdM(54559)} (Dec 2025) to {usdM(313819)} of purchase commitments in nine months <Cite id="commit-dec25" />; leases carry cross-defaults; Broadcom rent may be financed with 9% PIK notes (13% if revenue tests fail); a $5.0B liquidity covenant applies <Cite id="credit-covenant" />.</p>
          <p className="uth-p" style={{ fontSize: 14, margin: 0 }}><b>For competitors:</b> if demand keeps outrunning supply, Anthropic has locked in capacity rivals can’t buy; if it doesn’t, the $213.8B contingent layer and SpaceXAI’s 90-day exits are the release valves — and surplus capacity would come back to market cheaply. <ClassBadge kind="inference" /></p>
        </div>
        <div className="uth-card">
          <ChartFrame
            title="Supplier exposure by headline amount"
            summary="Headline amounts by counterparty: Broadcom TPU leases $161.2B, additional TPU estimate $137.5B midpoint (excluded), Google Cloud $121.3B, SpaceXAI up to $120.5B, Amazon $110.0B, Microsoft $44.9B, Nscale up to $44.6B, Lambda $41.3B, AMD over $20B (excluded)."
            legend={[{ label: "Within aggregate (fixed/min. or 'up to')", color: PALETTE.s1 }, { label: "Excluded from aggregate (estimate)", color: PALETTE.s4 }]}
            rows={exposure.map((e) => ({ counterparty: e.name, amount: e.amount, excludedFromAggregate: e.excluded, basis: e.basis }))}
            cols={[{ key: "counterparty", label: "Counterparty" }, { key: "amount", label: "$M", num: true, render: (r) => usdM(r.amount as number) }, { key: "excludedFromAggregate", label: "Excluded?", render: (r) => (r.excludedFromAggregate ? "Yes" : "No") }, { key: "basis", label: "Basis" }]}
            filename="uth-supplier-exposure.csv"
          >
            <div style={{ height: 330 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart layout="vertical" data={exposure} margin={{ top: 4, right: 56, bottom: 4, left: 8 }}>
                  <CartesianGrid horizontal={false} stroke={PALETTE.grid} />
                  <XAxis type="number" stroke={PALETTE.axis} tickFormatter={(v: number) => usdM(v, { digits: 0 })} />
                  <YAxis type="category" dataKey="name" width={130} stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} />
                  <Tooltip content={makeTip((v) => usdM(v))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <Bar dataKey="amount" name="Headline amount" radius={[0, 4, 4, 0]} maxBarSize={18} isAnimationActive={false}>
                    {exposure.map((e, i) => <Cell key={i} fill={e.excluded ? PALETTE.s4 : PALETTE.s1} />)}
                    <LabelList dataKey="amount" position="right" style={{ fontSize: 11, fill: PALETTE.ink }} formatter={(v: unknown) => usdM(Number(v))} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
      </div>
    </Section>
  );
}
