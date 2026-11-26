"use client";

import { useState } from "react";
import { breakEvenIncentive, subsidyGrid, type RouteId } from "@/lib/subsidy-math/model";
import { BASE_LIFETIME, baseRoute, ROUTE_IDS, ROUTE_META } from "@/lib/subsidy-math/params";
import { Explain, fmt$, fmtMonths, fmtPct, fmtX, Slider } from "./ui";

/** Section: how big a coupon can each route afford? The 0–50% grid. */
export default function AffordGrid() {
  const [route, setRoute] = useState<RouteId>("bedrock-claude");
  const [partner, setPartner] = useState(0);
  const [provider, setProvider] = useState(0);
  const p = baseRoute(route);
  const funding = { partnerFunded: partner, providerFunded: provider };
  const rows = subsidyGrid(p, funding, { ...BASE_LIFETIME, includeAdjacency: false });
  const be = breakEvenIncentive(p, funding);
  const beEcon = breakEvenIncentive(p, funding, true);
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

      <div className="sm-grid c3" style={{ marginBottom: 8 }}>
        <div className="sm-stat"><span>Break-even coupon (year one)</span><div className="sm-big">{fmtPct(be)}</div></div>
        {route === "vertex-gemini" && <div className="sm-stat"><span>…after paying for building the model</span><div className="sm-big">{fmtPct(beEcon)}</div></div>}
        <div>
          <Slider label="Share of coupon a partner pays" value={partner} min={0} max={0.5} step={0.05} onChange={setPartner} format={(v) => fmtPct(v)} />
          <Slider label="Share of coupon the model maker pays" value={provider} min={0} max={0.5} step={0.05} onChange={setProvider} format={(v) => fmtPct(v)} />
        </div>
      </div>

      <div className="sm-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Coupon</th>
              <th className="num">Customer pays</th>
              <th className="num">{meta.cloud} keeps, yr 1</th>
              <th className="num">Margin</th>
              <th className="num">Extra usage needed if it&apos;s every year</th>
              <th className="num">Payback if one-time</th>
              <th className="num">5-yr value, one-time</th>
              <th className="num">5-yr value, every year</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.level} className={r.level === 0.35 ? "hl" : undefined}>
                <td><b>{fmtPct(r.level)}</b></td>
                <td className="num">{fmt$(r.customerPays)}</td>
                <td className={`num ${r.contribution < 0 ? "sm-neg" : ""}`}>{fmt$(r.contribution, 1)}</td>
                <td className="num">{r.contributionPct === null ? "—" : fmtPct(r.contributionPct)}</td>
                <td className="num">{r.level === 0 ? "—" : Number.isFinite(r.volumeMultiple) ? fmtX(r.volumeMultiple) : "can't recover"}</td>
                <td className="num">{r.level === 0 ? "—" : fmtMonths(r.paybackMonths)}</td>
                <td className={`num ${r.npv5 < 0 ? "sm-neg" : ""}`}>{fmt$(r.npv5)}</td>
                <td className={`num ${r.npvRecurring5 < 0 ? "sm-neg" : ""}`}>{fmt$(r.npvRecurring5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="sm-caveat">Per $100 of year-one list spend; AI line only (no storage, database or equity benefits — those are in the &ldquo;other side&rdquo; section). &ldquo;Margin&rdquo; is on what the cloud books for this deal: the seller&apos;s fee for agent routes, net revenue for its own services. Base-case assumptions; growth {fmtPct(BASE_LIFETIME.growth)}/yr, {fmtPct(BASE_LIFETIME.retention)} yearly retention.</p>
      <Explain>
        {p.structure === "agent"
          ? <>When {meta.cloud} sells someone else&apos;s model, its slice is a seller&apos;s fee — so any coupon bigger than about <b>{fmtPct(be)}</b> loses money in year one, and a coupon that size <b>every year</b> can never be earned back by more usage. A one-time coupon is different: it is a customer-acquisition cost that pays back if the customer stays.</>
          : <>When {meta.cloud} sells its own service, its slice is much bigger, so it can afford far larger coupons — up to about <b>{fmtPct(be)}</b> in year one{route === "vertex-gemini" ? <> (about <b>{fmtPct(beEcon)}</b> once you charge Gemini its share of model-building costs)</> : null}. Bigger slice, bigger fixed bill behind it.</>}
      </Explain>
    </div>
  );
}
