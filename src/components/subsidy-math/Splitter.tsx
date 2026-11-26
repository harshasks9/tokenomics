"use client";

import { useState } from "react";
import { breakEvenIncentive, waterfall, type RouteId, type RouteParams } from "@/lib/subsidy-math/model";
import { baseRoute, ROUTE_IDS, ROUTE_META } from "@/lib/subsidy-math/params";
import { Explain, fmt$, fmtPct, Slider, StackBar, Tag } from "./ui";

/** Section: follow the $100 — who keeps what, and how big the coupon is next to the cloud's slice. */
export default function Splitter() {
  const [route, setRoute] = useState<RouteId>("bedrock-claude");
  const [overrides, setOverrides] = useState<Partial<Record<RouteId, Partial<RouteParams>>>>({});
  const [coupon, setCoupon] = useState(0.35);
  const p: RouteParams = { ...baseRoute(route), ...(overrides[route] ?? {}) };
  const set = (k: keyof RouteParams, v: number) => setOverrides((o) => ({ ...o, [route]: { ...(o[route] ?? {}), [k]: v } }));
  const meta = ROUTE_META[route];
  const agent = p.structure === "agent";

  const w0 = waterfall(p, { pct: 0, partnerFunded: 0, providerFunded: 0 });
  const wc = waterfall(p, { pct: coupon, partnerFunded: 0, providerFunded: 0 });
  const be = breakEvenIncentive(p, { partnerFunded: 0, providerFunded: 0 });

  const cloudSlice = w0.cloudContribution;
  const modelDev = agent ? 0 : p.modelDevCost * w0.cloudNetRevenue;
  const segments = agent
    ? [
        { key: "disc", label: "Customer's negotiated discount", value: p.customerDiscount * 100, color: "#c9ced5", light: true },
        { key: "prov", label: "Model maker (Anthropic) keeps", value: w0.providerContribution, color: "var(--provider)" },
        { key: "infra", label: "Chips, power & buildings to run it", value: w0.providerServing - w0.computeContribution, color: "var(--infra)", light: true },
        { key: "dist", label: "Cloud's selling & support cost", value: w0.distribution, color: "var(--other)" },
        { key: "keep", label: `${meta.cloud} keeps`, value: Math.max(0, cloudSlice), color: "var(--keep)" },
      ]
    : [
        { key: "disc", label: "Customer's negotiated discount", value: p.customerDiscount * 100, color: "#c9ced5", light: true },
        ...(p.revenueShare > 0 ? [{ key: "prov", label: "Revenue share to OpenAI", value: w0.revenueSharePaid, color: "var(--provider)" }] : []),
        { key: "infra", label: "Chips, power & buildings to run it", value: w0.infra, color: "var(--infra)", light: true },
        { key: "dist", label: "Cloud's selling & support cost", value: w0.distribution, color: "var(--other)" },
        ...(modelDev > 0 ? [{ key: "dev", label: "Paying back the cost of building Gemini", value: Math.min(modelDev, Math.max(0, cloudSlice)), color: "#9dc8f7", light: true }] : []),
        { key: "keep", label: modelDev > 0 ? `${meta.cloud} keeps (after model cost)` : `${meta.cloud} keeps`, value: Math.max(0, cloudSlice - modelDev), color: "var(--keep)" },
      ];

  const underwater = wc.cloudContribution < 0;
  const couponDollars = coupon * 100;

  return (
    <div className="sm-panel">
      <div className="sm-tabs" role="group" aria-label="Choose a route">
        {ROUTE_IDS.map((id) => (
          <button key={id} type="button" aria-pressed={id === route} onClick={() => setRoute(id)}>
            <span className="sm-dot" style={{ background: ROUTE_META[id].color }} />{ROUTE_META[id].label}
          </button>
        ))}
      </div>

      <div className="sm-grid c2" style={{ alignItems: "start" }}>
        <div>
          <div className="sm-stat" style={{ marginBottom: 12 }}>
            <span>Before any coupon, of every $100 the customer would pay at list price, {meta.cloud} keeps</span>
            <div className="sm-big">{fmt$(cloudSlice, 0)}<small>{agent ? "as a seller's fee (plus a little compute margin)" : modelDev > 0 ? `before paying for the model · ${fmt$(cloudSlice - modelDev)} after` : "after paying OpenAI and the chips"}</small></div>
          </div>
          <StackBar ariaLabel={`Where $100 of ${meta.label} goes`} segments={segments} />
          <div className="sm-legend">
            {segments.map((s) => <span key={s.key}><span className="sm-dot" style={{ background: s.color }} />{s.label} · {fmt$(s.value, 1)}</span>)}
          </div>

          <h3 style={{ marginTop: 22 }}>Now add a coupon</h3>
          <Slider label="Coupon (credits) paid by the cloud, % of list" value={coupon} min={0} max={0.5} step={0.01} onChange={setCoupon} format={(v) => fmtPct(v)} />
          <div style={{ display: "grid", gridTemplateColumns: `${Math.max(cloudSlice, 0.1)}fr ${Math.max(couponDollars, 0.1)}fr`, gap: 8, alignItems: "end" }}>
            <div>
              <div className="sm-src">The cloud&apos;s slice</div>
              <div style={{ height: 34, background: "var(--keep)", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", paddingLeft: 8 }}>{fmt$(cloudSlice)}</div>
            </div>
            <div>
              <div className="sm-src">The coupon</div>
              <div style={{ height: 34, background: "var(--coupon)", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", paddingLeft: 8 }}>{fmt$(couponDollars)}</div>
            </div>
          </div>
          <Explain>
            {underwater ? (
              <>With a {fmtPct(coupon)} coupon, {meta.cloud} is <b>{fmt$(-wc.cloudContribution)} under water</b> on this $100 in year one. It only makes that back if the customer stays, grows, or buys other cloud services. The most it could give away and still break even this year is about <b>{fmtPct(be)}</b>.</>
            ) : (
              <>With a {fmtPct(coupon)} coupon, {meta.cloud} still keeps <b>{fmt$(wc.cloudContribution)}</b> of this $100 in year one. It could give up to about <b>{fmtPct(be)}</b> before this deal loses money in year one.</>
            )}
          </Explain>
        </div>

        <div>
          <h3>Why the slices differ</h3>
          {agent ? (
            <p>
              On {meta.cloud}, <b>Anthropic is the seller</b>. Its IPO filing says that when Claude is sold through a cloud marketplace it is the &ldquo;principal&rdquo;, sets the price, and the cloud acts as a &ldquo;collection agent&rdquo; <Tag b="D" />. So the cloud collects the money, keeps a fee, and passes the rest to Anthropic. Anthropic pays for the chips — although some of those chips are rented from the same cloud.
            </p>
          ) : route === "azure-openai" ? (
            <p>
              On Azure, <b>Microsoft is the seller</b> of Azure OpenAI Service: it books the revenue, pays for the chips, and pays OpenAI a reported revenue share <Tag b="R" />. Bigger slice per $100 — but Microsoft also carries a share of OpenAI&apos;s losses through its stake, which sits outside the cloud business.
            </p>
          ) : (
            <p>
              On Vertex AI, <b>Google sells its own model</b>. No royalty to anyone, and it runs on Google&apos;s own TPU chips. But &ldquo;no royalty&rdquo; is not &ldquo;free&rdquo;: Google pays to build and train Gemini, which we spread over each $100 as the light-blue slice <Tag b="A" />.
            </p>
          )}

          <h3 style={{ marginTop: 18 }}>Try your own numbers</h3>
          <Slider label="Negotiated discount (recurring)" value={p.customerDiscount} min={0} max={0.3} step={0.01} onChange={(v) => set("customerDiscount", v)} format={(v) => fmtPct(v)} />
          {agent ? (
            <>
              <Slider label="Cloud's seller fee (share of Anthropic's price)" value={p.channelFee} min={0.05} max={0.4} step={0.01} onChange={(v) => set("channelFee", v)} format={(v) => fmtPct(v)} help="Not disclosed per cloud. Anthropic's filing lets us bound the average — see the Evidence section." />
              <Slider label="Share of the discount Anthropic pays for" value={p.discountFundedByProvider} min={0} max={1} step={0.05} onChange={(v) => set("discountFundedByProvider", v)} format={(v) => fmtPct(v)} />
              <Slider label="Compute Anthropic buys that is truly extra (beyond its existing commitment)" value={p.incrementalComputeShare} min={0} max={1} step={0.05} onChange={(v) => set("incrementalComputeShare", v)} format={(v) => fmtPct(v)} help="If Anthropic already pre-paid for the capacity, serving this customer earns the cloud nothing new." />
            </>
          ) : (
            <>
              <Slider label="Chips, power & buildings per $100 of list" value={p.infraCost} min={0.05} max={0.5} step={0.01} onChange={(v) => set("infraCost", v)} format={(v) => fmt$(v * 100)} />
              {route === "azure-openai" && <Slider label="Revenue share paid to OpenAI" value={p.revenueShare} min={0} max={0.35} step={0.01} onChange={(v) => set("revenueShare", v)} format={(v) => fmtPct(v)} />}
              {route === "vertex-gemini" && <Slider label="Cost of building the model, per $ of revenue" value={p.modelDevCost} min={0} max={0.7} step={0.01} onChange={(v) => set("modelDevCost", v)} format={(v) => fmtPct(v)} help="Not disclosed. Anthropic spends ~58% of revenue on R&D; a mature, multi-product Google spreads it wider." />}
              <Slider label="How busy the chips are (utilization)" value={p.utilization} min={0.3} max={0.9} step={0.05} onChange={(v) => set("utilization", v)} format={(v) => fmtPct(v)} help="Busier chips spread the same depreciation over more tokens." />
            </>
          )}
          <button type="button" className="sm-btn ghost" onClick={() => setOverrides((o) => ({ ...o, [route]: {} }))}>Reset to base case</button>
        </div>
      </div>
    </div>
  );
}
