"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { COMMITMENTS } from "@/lib/under-the-hood/data";
import { annual, quarterly, TTM_REVENUE_SEP26 } from "@/lib/under-the-hood/calc";
import { pct, usdM } from "@/lib/under-the-hood/format";
import { Kpi, PALETTE, Section } from "../ui";

function Spark({ data, color }: { data: number[]; color: string }) {
  return (
    <div style={{ height: 36 }} aria-hidden>
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
        <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.1} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Numbers() {
  const q = quarterly();
  const q3 = q[6], q2 = q[5];
  const a = annual();
  const nine = a[4];
  return (
    <Section id="numbers">
      <h3 className="uth-h4">Revenue and growth</h3>
      <div className="uth-grid uth-g4">
        <Kpi label="Revenue, Q3 2026" value={usdM(q3.revenue)} delta={`${pct(q3.qoq, 1, true)} QoQ · ${pct(q3.yoy, 0, true)} YoY`} tone="up" period="3 months ended Sep 30, 2026" cite="rev-q3-26" />
        <Kpi label="Revenue, nine months 2026" value={usdM(nine.revenue)} delta={`vs ${usdM(a[3].revenue)} in 9M 2025`} tone="up" period="9M ended Sep 30, 2026" cite="rev-9m-26" />
        <Kpi label="Sequential revenue added" value={usdM(q3.add ?? 0, { sign: true })} delta={`Q2 added ${usdM(q2.add ?? 0, { sign: true })}`} tone="down" period="Q3 vs Q2 2026" cite="rev-add-q3" kind="calculated" />
        <Kpi label="TTM revenue" value={usdM(TTM_REVENUE_SEP26)} period="Q4 2025 – Q3 2026" kind="calculated" note="Sum of four reported quarters" cite="cust-100k-rev" />
      </div>
      <div style={{ marginTop: 8 }} className="uth-card flat"><Spark data={q.map((r) => r.revenue)} color={PALETTE.s1} /><div className="uth-xs">Quarterly revenue, Q1 2025 – Q3 2026 ($376M → $16,956M)</div></div>

      <h3 className="uth-h4 uth-block">Operating performance</h3>
      <div className="uth-grid uth-g4">
        <Kpi label="GAAP operating income (loss)" value={usdM(q3.opIncome)} delta={`Q2: ${usdM(q2.opIncome, { sign: true })}`} tone="down" period="Q3 2026" cite="opinc-q3" />
        <Kpi label="Adjusted operating margin" value={pct(q3.adjMargin, 0)} delta={`Q2: ${pct(q2.adjMargin, 0)} · 9M: ${pct(nine.adjOpIncome / nine.revenue, 0)}`} tone="down" period="Q3 2026 (non-GAAP)" cite="adj-om-q3" />
        <Kpi label="Operating cash flow" value={usdM(6569)} delta="vs −$2.0B in 9M 2025" tone="up" period="9M 2026" cite="ocf-9m" />
        <Kpi label="GAAP net loss" value={usdM(nine.netLoss)} note="$94.3B is non-cash fair-value change on convertible notes" period="9M 2026" cite="netloss-9m" />
      </div>

      <h3 className="uth-h4 uth-block">Compute</h3>
      <div className="uth-grid uth-g4">
        <Kpi label="Compute & infrastructure expense" value={usdM(q3.compute)} delta={`${pct(q3.computePct, 0)} of revenue (Q2: ${pct(q2.computePct, 0)})`} tone="down" period="Q3 2026" cite="compute-q3" />
        <Kpi label="Short-term (premium) compute" value={usdM(5000)} delta="51% of Q3 compute expense" tone="down" period="Q3 2026" cite="shortterm-q3" />
        <Kpi label="Implied gross margin (functional)" value={pct(nine.impliedGrossMargin, 1)} delta={`FY2025: ${pct(a[2].impliedGrossMargin, 1)}`} tone="up" period="9M 2026" cite="gm-9m" kind="calculated" />
        <Kpi label="Revenue per $ of compute" value={`$${q3.revPerCompute.toFixed(2)}`} delta={`Q2: $${q2.revPerCompute.toFixed(2)} · Q1 2025: $${q[0].revPerCompute.toFixed(2)}`} tone="down" period="Q3 2026" kind="calculated" cite="compute-q3" />
      </div>

      <h3 className="uth-h4 uth-block">Customers and revenue mix</h3>
      <div className="uth-grid uth-g4">
        <Kpi label="Customers ≥ $100K TTM" value=">11,900" delta=">950 a year earlier · >6,000 at Jun 30" tone="up" period="As of Sep 30, 2026" cite="cust-100k" />
        <Kpi label="Net Revenue Retention" value="~900%" note="Dollar-weighted; base = Q3 2025 customers with ≥$1, ex Pro/Max/Ultra" period="As of Sep 30, 2026" cite="nrr" />
        <Kpi label="Consumption share of revenue" value="79%" delta="Subscription 21%" period="9M 2026" cite="rev-consumption-9m" />
        <Kpi label="Sold via CSP marketplaces" value="44%" delta="≈40% implied for Q3 alone" tone="down" period="9M 2026 (H1: 48%)" cite="csp-marketplace-share" />
      </div>

      <h3 className="uth-h4 uth-block">Commitments and liquidity</h3>
      <div className="uth-grid uth-g4">
        <Kpi label="Aggregate committed spend" value={usdM(COMMITMENTS.aggregate.total)} delta={`${usdM(COMMITMENTS.aggregate.before2031)} before 2031`} period="As of and after Sep 30, 2026" cite="commit-total" />
        <Kpi label="Due in next 12 months" value={usdM(COMMITMENTS.aggregate.next12Months)} delta="vs ≈$39.5B Q3 compute annualized" period="12 months after Sep 30, 2026" cite="commit-total" />
        <Kpi label="Liquidity (pre-IPO)" value={usdM(146600)} delta="+ up to $77.0B conditional partner financing" period="As of Sep 30, 2026" cite="liquidity" />
        <Kpi label="Revenue from policy-violating customers" value="5–7%" delta="≈$1.7–2.3B of 9M revenue" tone="down" period="9M 2026" cite="violations" />
      </div>
    </Section>
  );
}
