"use client";

import { useState } from "react";
import { creditCliff, lifetime, type RouteId } from "@/lib/subsidy-math/model";
import { BASE_INCENTIVE, BASE_LIFETIME, baseRoute } from "@/lib/subsidy-math/params";
import { matchThreshold } from "@/lib/subsidy-math/sensitivity";
import { Explain, fmtPct, Seg, Slider } from "./ui";

const RULES: { title: string; body: string }[] = [
  { title: "Don’t answer a coupon with a price cut", body: "A competitor’s one-time credit costs them once. A permanent price cut from us costs us every year. Never trade a recurring discount for a one-time incentive — compare like with like over the customer’s real lifetime." },
  { title: "Match only when it changes the outcome", body: "An incentive is worth paying only if it raises our chance of winning by enough to cover its cost. Use the calculator: on Gemini the bar is low; on Claude resold through Vertex it is high, because our slice is the same thin seller’s fee AWS earns." },
  { title: "Sell the year-two bill, not the year-one coupon", body: "Put the customer’s 3-year cost side by side — credits, list prices, expected price cuts, and the jump when the credit ends. A 35% year-one credit is roughly a 6–11% discount over the life of a growing workload." },
  { title: "Compete on what lasts", body: "Price-performance from our own chips and models, capacity we can guarantee, data residency in-region, and model choice on one platform. These survive the end of a promotion; credits don’t." },
  { title: "Be honest about model choice", body: "If the customer wants Claude, Vertex is a good place to run it — and it is still Google revenue. Win the workload, then earn the right to route the high-volume steps to Gemini, where our economics are strongest." },
  { title: "Don’t call their model broken", body: "AWS’s cloud margin is 38.7% and growing; Amazon’s Anthropic stake is worth ~$289B. Telling customers the competitor’s economics will collapse is not supported by the evidence — and they will check." },
];

const INTEL: string[] = [
  "Exact incentive form: one-time credit, credits on growth (MAP), recurring discount, or a commit-linked credit?",
  "Who funds it: AWS, Anthropic (private offer), a partner (SI pass-back), or a mix? Ask for the paperwork, not the headline %.",
  "Measurement base: list or net, all spend or only growth above a baseline, capped at what?",
  "Term and expiry date — and what renewal terms were promised for year two.",
  "Conditions: minimum commit, exclusivity, tagged workloads, migration partner, Marketplace drawdown limits.",
  "Which model and endpoint (global vs regional pricing), and whether the customer’s AWS commit discount applies to Claude.",
  "The workload’s adjacent footprint: data, storage, databases, networking that move with it.",
  "Where the customer is in its commit cycle: who is burning down an EDP/MACC, and when it renews.",
];

/** Section: what JAPAC leaders and sellers should do. */
export default function Playbook() {
  const [route, setRoute] = useState<RouteId>("vertex-gemini");
  const [pct, setPct] = useState(0.35);
  const [win, setWin] = useState(0.5);
  const p = baseRoute(route);
  const lt = { ...BASE_LIFETIME, years: 5 };
  const withInc = lifetime(p, { ...BASE_INCENTIVE, pct, type: "one-time" }, lt).npv;
  const without = lifetime(p, { ...BASE_INCENTIVE, pct: 0 }, lt).npv;
  const need = matchThreshold(withInc, without, win);
  const cliff = creditCliff(0, pct);

  return (
    <>
      <div className="sm-grid c3">
        {RULES.map((r, i) => (
          <div key={r.title} className="sm-card">
            <h3><span style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{i + 1}</span> {r.title}</h3>
            <p>{r.body}</p>
          </div>
        ))}
      </div>

      <div className="sm-panel" style={{ marginTop: 18 }}>
        <h3>Should we match? The win-probability test</h3>
        <p style={{ color: "var(--ink-2)", fontSize: 15 }}>Matching a one-time incentive pays only if it lifts our chance of winning by at least the amount below. Five-year value, base-case assumptions.</p>
        <div className="sm-grid c2" style={{ alignItems: "center" }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <Seg label="What we would sell" value={route} onChange={setRoute} options={[{ v: "vertex-gemini", l: "Gemini on Vertex" }, { v: "vertex-claude", l: "Claude on Vertex" }]} />
            </div>
            <Slider label="Incentive we would match (one-time)" value={pct} min={0.05} max={0.5} step={0.01} onChange={setPct} format={(v) => fmtPct(v)} />
            <Slider label="Our win chance without matching" value={win} min={0.1} max={0.9} step={0.05} onChange={setWin} format={(v) => fmtPct(v)} />
          </div>
          <div className="sm-stat">
            <span>Matching pays only if it raises our win chance by at least</span>
            <div className="sm-big">{Number.isFinite(need) ? `+${(need * 100).toFixed(0)} pts` : "never"}</div>
            <span>{Number.isFinite(need) && win + need > 1 ? "— more than is possible: don't match on price." : route === "vertex-gemini" ? "A low bar: our own model leaves room to compete." : "A high bar: on resold Claude our slice is a thin seller's fee."}</span>
          </div>
        </div>
      </div>

      <div className="sm-grid c2" style={{ marginTop: 18 }}>
        <div className="sm-card">
          <h3>Find the customers about to hit the cliff</h3>
          <p>When a {fmtPct(pct)} one-time credit ends, the bill for the same usage rises <b>{fmtPct(cliff)}</b> at constant prices — less if list prices keep falling. Either way the customer re-decides at month 13. Flag accounts where:</p>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 15, color: "var(--ink-2)" }}>
            <li>credits were sized on year-one spend and expire within 6 months;</li>
            <li>AI spend is growing fast, so growth-based credits run out of headroom;</li>
            <li>the workload is mostly inference with little data gravity (easy to move);</li>
            <li>finance teams track unit cost per task, not just the invoice.</li>
          </ul>
        </div>
        <div className="sm-card">
          <h3>Field intelligence to collect (deal by deal)</h3>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 14.5, color: "var(--ink-2)" }}>
            {INTEL.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </div>
      </div>
      <Explain>
        <b>The one-line version for sellers:</b> competitor coupons are a rational, time-limited cost of winning customers — not proof their business is broken. We beat them by selling the customer&apos;s three-year bill and what lasts after the coupon ends, and we match only where it moves the deal and our own economics can carry it.
      </Explain>
    </>
  );
}
