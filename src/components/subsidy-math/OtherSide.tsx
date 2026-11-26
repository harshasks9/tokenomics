"use client";

import { useState } from "react";
import { equityUplift, lifetime, requiredAttach, waterfall, type IncentiveType, type RouteId } from "@/lib/subsidy-math/model";
import { BASE_EQUITY, BASE_LIFETIME, baseRoute, ROUTE_META } from "@/lib/subsidy-math/params";
import { Explain, fmt$, fmtPct, fmtX, Seg, Slider } from "./ui";

const ROUTES: RouteId[] = ["bedrock-claude", "azure-openai", "vertex-claude"];

/** Stake and value-per-revenue defaults by pair (see params.json equity notes). */
const EQUITY_DEFAULTS: Record<string, { stake: number; mult: number; note: string }> = {
  "bedrock-claude": { stake: BASE_EQUITY.stake, mult: BASE_EQUITY.revenueMultiple, note: "Amazon ≈23% of Anthropic (incl. rollover notes); Anthropic ≈14× its $81B run-rate at the $83 IPO price." },
  "azure-openai": { stake: 0.24, mult: 17, note: "Microsoft ≈24% of OpenAI (reported); OpenAI ≈17× run-rate ($852B post-money vs ~$50B run-rate, press)." },
  "vertex-claude": { stake: 0.13, mult: BASE_EQUITY.revenueMultiple, note: "Google ≈13% of Anthropic at the IPO (424B4 holdings ÷ shares outstanding)." },
};

/** Section: the opposing case — adjacent cloud profit and equity upside needed to justify a coupon. */
export default function OtherSide() {
  const [route, setRoute] = useState<RouteId>("bedrock-claude");
  const [pct, setPct] = useState(0.35);
  const [type, setType] = useState<IncentiveType>("one-time");
  const [attach, setAttach] = useState(BASE_LIFETIME.adjacencyAttach);
  const [incr, setIncr] = useState(BASE_LIFETIME.adjacencyIncremental);
  const [stake, setStake] = useState(BASE_EQUITY.stake);
  const [mult, setMult] = useState(BASE_EQUITY.revenueMultiple);
  const pick = (id: RouteId) => { setRoute(id); setStake(EQUITY_DEFAULTS[id].stake); setMult(EQUITY_DEFAULTS[id].mult); };
  const [newRev, setNewRev] = useState(BASE_EQUITY.incrementalToProvider);
  const p = baseRoute(route);
  const inc = { pct, type, partnerFunded: 0, providerFunded: 0 };
  const lt = { ...BASE_LIFETIME, years: 5, adjacencyAttach: attach, adjacencyIncremental: incr, includeAdjacency: true };
  const need = requiredAttach(p, inc, lt);
  const aiOnly = lifetime(p, inc, { ...lt, includeAdjacency: false }).npv;
  const withAdj = lifetime(p, inc, lt).npv;
  const w = waterfall(p, { pct, partnerFunded: 0, providerFunded: 0 });
  // Agent routes: the provider books the sale. Principal (Azure OpenAI): the provider's revenue is the revenue share.
  const eq = equityUplift(stake, mult, newRev, w.providerRevenue);
  const couponCost = pct * 100;
  const meta = ROUTE_META[route];

  return (
    <div className="sm-panel">
      <div className="sm-tabs" role="group" aria-label="Choose a route">
        {ROUTES.map((id) => (
          <button key={id} type="button" aria-pressed={id === route} onClick={() => pick(id)}>
            <span className="sm-dot" style={{ background: ROUTE_META[id].color }} />{ROUTE_META[id].short}
          </button>
        ))}
      </div>
      <div className="sm-grid c2" style={{ alignItems: "start" }}>
        <div>
          <h3>1 · The coupon buys more than AI</h3>
          <p>An AI app needs storage, databases, networking and security. If the coupon wins the whole app, the cloud earns on all of it.</p>
          <Slider label="Coupon size" value={pct} min={0} max={0.5} step={0.01} onChange={setPct} format={(v) => fmtPct(v)} />
          <div style={{ marginBottom: 12 }}>
            <Seg label="Coupon type" value={type} onChange={setType} options={[{ v: "one-time", l: "One-time" }, { v: "recurring", l: "Every year" }]} />
          </div>
          <Slider label="Other cloud spend per $1 of AI" value={attach} min={0} max={2} step={0.05} onChange={setAttach} format={(v) => `$${v.toFixed(2)}`} />
          <Slider label="…of which truly new (would not exist otherwise)" value={incr} min={0} max={1} step={0.05} onChange={setIncr} format={(v) => fmtPct(v)} />
          <div className="sm-grid c2">
            <div className="sm-stat"><span>5-yr value, AI only</span><div className="sm-big" style={{ fontSize: 34 }}>{fmt$(aiOnly)}</div></div>
            <div className="sm-stat"><span>…with other services</span><div className="sm-big" style={{ fontSize: 34 }}>{fmt$(withAdj)}</div></div>
          </div>
          <Explain>
            {need === 0
              ? <>Even with no other services, this coupon pays for itself over five years on {meta.short}.</>
              : Number.isFinite(need)
                ? <>To break even over five years, each $1 of AI needs about <b>${need.toFixed(2)}</b> of other cloud spend (before the &ldquo;truly new&rdquo; haircut, at a 60% margin). Typical AI apps attach some — so the question is whether this customer&apos;s does.</>
                : <>No realistic amount of other spend rescues this coupon.</>}
          </Explain>
        </div>
        <div>
          <h3>2 · The cloud owns part of the model maker</h3>
          <p>Amazon and Google each own a slice of Anthropic; Microsoft owns a big slice of OpenAI. If a coupon creates <i>new</i> revenue for the model maker, the stake grows in value — a gain that never shows up in the cloud&apos;s operating profit.</p>
          <Slider label="Stake in the model maker" value={stake} min={0} max={0.35} step={0.01} onChange={setStake} format={(v) => fmtPct(v)} />
          <Slider label="Model maker's value per $1 of yearly revenue" value={mult} min={2} max={30} step={1} onChange={setMult} format={(v) => fmtX(v, 0)} />
          <Slider label="Share of the subsidized usage that is new to the model maker" value={newRev} min={0} max={1} step={0.05} onChange={setNewRev} format={(v) => fmtPct(v)} help="If the customer would have used the model anyway — directly or on another cloud — the stake gains nothing." />
          <p className="sm-caveat" style={{ marginTop: 0 }}>{EQUITY_DEFAULTS[route].note}</p>
          <div className="sm-grid c2">
            <div className="sm-stat"><span>Coupon cost per $100</span><div className="sm-big" style={{ fontSize: 34 }}>{fmt$(couponCost)}</div></div>
            <div className="sm-stat"><span>Stake value created</span><div className="sm-big" style={{ fontSize: 34 }}>{fmt$(eq)}</div></div>
          </div>
          <Explain>
            {eq > couponCost
              ? <>At these settings the paper gain on the stake (<b>{fmt$(eq)}</b>) is bigger than the coupon (<b>{fmt$(couponCost)}</b>). That is the strongest case for subsidizing: <b>it can be rational for the company even when it hurts the cloud&apos;s margin</b>. But the gain is not cash, depends on the model maker&apos;s valuation, and only counts for genuinely new usage.</>
              : <>At these settings the stake gain (<b>{fmt$(eq)}</b>) does not cover the coupon (<b>{fmt$(couponCost)}</b>). The equity argument works only when the coupon creates usage the model maker would not otherwise have had.</>}
          </Explain>
        </div>
      </div>
    </div>
  );
}
