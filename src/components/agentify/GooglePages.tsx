"use client";

import { ArrowRight, Info, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import type { AccountView } from "@/lib/agentify/views";
import type { Play } from "@/lib/agentify/model";
import { useAgentify } from "./state";
import { Bars, Head, Metric, PlayTag, SectionHead, ShiftCard, StageTag, StatusTag, STAGE_LABEL, num, pct, usd } from "./ui";

function InternalBanner() {
  return <div className="ag-banner internal" style={{ marginBottom: 16 }}><ShieldCheck size={15} /><div><b>Google internal.</b> Plan, revenue and accountability content is returned by the server only to the Google persona — the customer and partner views never receive it.</div></div>;
}

export function Plan() {
  const { view } = useAgentify();
  const p = view?.plan;
  if (!view || !p) return null;
  return (
    <div>
      <InternalBanner />
      <section className="ag-hero" data-p="google">
        <div className="ag-hero-tag"><Lock size={13} />Q1 FY27 · workstream shortlist · slot 1</div>
        <h1>{p.thesis.title}</h1>
        <p>{p.thesis.oneLiner}</p>
      </section>

      <div className="ag-section"><ShiftCard shift={view.shift} /></div>
      <div className="ag-section ag-grid c3">
        <Metric label="Revenue mix target" value={pct(p.thesis.revenueTarget)} sub="of revenue from Google Workspace" tone="internal" />
        <Metric label="POC credits" value={usd(p.program.pocCreditPool)} sub={`buys new users — ${p.program.pocMonths}-month POC seats`} tone="internal" />
        <Metric label="Run rate at full scale" value={`${p.subRegions.length * 4 * 5}/wk`} sub={`customer workshops · ${p.subRegions.length} sub-regions × 4 partners × 5`} tone="internal" />
      </div>

      <div className="ag-section">
        <SectionHead title="Principles" sub="what this workstream is — and isn't" />
        <div className="ag-grid c2">
          {p.principles.map((x) => (
            <div key={x.title} className="ag-card">
              <div className="ag-row between"><b style={{ fontSize: 14.5 }}>{x.title}</b><StatusTag s={x.status} /></div>
              <p style={{ marginTop: 6, color: "var(--ink-2)", fontSize: 13.5 }}>{x.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ag-section ag-split">
        <div className="ag-card">
          <SectionHead title="Q1 FY27 shortlist" sub="5–6 workstreams at scale" />
          <p className="ag-muted" style={{ fontSize: 13, marginBottom: 10 }}>{p.shortlist.note}</p>
          <ul className="ag-list">
            {p.shortlist.slots.map((s) => (
              <li key={s.n}><span className="ag-step-n">{s.n}</span><div style={{ flex: 1 }}><b style={{ color: s.status === "open" ? "var(--ink-3)" : undefined }}>{s.name}</b>{s.why && <div className="ag-muted" style={{ fontSize: 12.5 }}>{s.why}</div>}</div><StatusTag s={s.status} /></li>
            ))}
          </ul>
        </div>
        <div className="ag-stack">
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>Selection criteria</div>
            <ul className="ag-bullets">{p.shortlist.criteria.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
          <div className="ag-banner warn"><TriangleAlert size={15} /><div><b>Revenue recognition caveat.</b> {p.copy.revenueCaveat}</div></div>
        </div>
      </div>

      <div className="ag-section ag-card">
        <SectionHead title="What customers already own" sub="Workspace base seats — indicative from Q1, subject to revision Jan 30, 2027" />
        <div className="ag-table-wrap"><table className="ag-table">
          <thead><tr><th>Edition</th><th className="num">List PUPM</th><th className="num">Gemini agent entitlement</th><th>Beta first wave</th></tr></thead>
          <tbody>{view.editions.map((e) => <tr key={e.id}><td>{e.name}</td><td className="num">${e.pupm}</td><td className="num">${e.entitlement}/user/mo</td><td>{e.betaFirstWave ? "Yes" : "—"}</td></tr>)}</tbody>
        </table></div>
        <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>Entitlement is per user and not pooled. Covers AI Inbox, agents in Chat/Docs, image and video generation; chat queries don&apos;t draw it down. Frontline, Essentials, Education and Nonprofit SKUs have no entitlement. Sovereign Controls customers are out of the initial beta.</p>
      </div>
    </div>
  );
}

function Num({ label, value, set, min = 0, max = 100, step = 1, suffix }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number; suffix?: string }) {
  return (
    <div className="ag-field">
      <label className="ag-label">{label}: <b>{value}{suffix}</b></label>
      <input className="ag-range" type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label} />
    </div>
  );
}

export function Execution() {
  const { view } = useAgentify();
  const p = view?.plan;
  const [subs, setSubs] = useState(p?.subRegions.length ?? 5);
  const [partners, setPartners] = useState(4);
  const [perWeek, setPerWeek] = useState(5);
  const [weeks, setWeeks] = useState(12);
  const [show, setShow] = useState(85);
  const [activate, setActivate] = useState(60);
  const [using, setUsing] = useState(40);
  const [seats, setSeats] = useState(900);
  const [newUsers, setNewUsers] = useState(15);
  const [convert, setConvert] = useState(50);
  const [seatPrice, setSeatPrice] = useState(22);
  if (!view || !p) return null;

  const pool = p.program.pocCreditPool;
  const workshops = subs * partners * perWeek * weeks;
  const held = Math.round(workshops * (show / 100));
  const activated = Math.round(held * (activate / 100));
  const usingN = Math.round(activated * (using / 100));
  const wantedNew = usingN * newUsers;
  const creditPerUser = seatPrice * p.program.pocMonths;
  const fundedNew = Math.min(wantedNew, Math.floor(pool / creditPerUser));
  const paid = Math.round(fundedNew * (convert / 100));
  const arr = paid * seatPrice * 12;
  const binding = wantedNew > fundedNew;

  return (
    <div>
      <InternalBanner />
      <Head eyebrow="Execution model" title="1 → 4 → 5: the weekly machine" lede={p.execution.inspiration} />
      <div className="ag-flow">
        {p.execution.model.map((m, i) => (
          <div key={m.level} style={{ display: "contents" }}>
            <div className="ag-flow-step"><div className="ag-eyebrow">{m.level}</div><div className="n">{m.count}</div><p className="ag-muted" style={{ fontSize: 12.5, marginTop: 4 }}>{m.does}</p></div>
            {i < p.execution.model.length - 1 && <span className="ag-flow-arrow"><ArrowRight size={16} /></span>}
          </div>
        ))}
      </div>

      <div className="ag-section ag-calc">
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>Assumptions <span className="ag-muted" style={{ fontWeight: 400, fontSize: 12 }}>· move them</span></div>
          <Num label="Sub-regions" value={subs} set={setSubs} min={1} max={10} />
          <Num label="Partners per sub-region" value={partners} set={setPartners} min={1} max={8} />
          <Num label="Customers per partner per week" value={perWeek} set={setPerWeek} min={1} max={10} />
          <Num label="Delivery weeks in Q1" value={weeks} set={setWeeks} min={4} max={13} />
          <Num label="Sessions that actually happen" value={show} set={setShow} min={40} max={100} suffix="%" />
          <Num label="Agentified → median ≥ 2 by week 4" value={activate} set={setActivate} min={10} max={90} suffix="%" />
          <Num label="Of those, reach ‘Using’" value={using} set={setUsing} min={10} max={90} suffix="%" />
          <Num label="Avg seats per account" value={seats} set={setSeats} min={100} max={5000} step={50} />
          <Num label="New users asked per ‘Using’ account" value={newUsers} set={setNewUsers} min={0} max={100} />
          <Num label="POC users who convert to paid" value={convert} set={setConvert} min={10} max={90} suffix="%" />
          <Num label="Avg seat price (PUPM)" value={seatPrice} set={setSeatPrice} min={7} max={35} suffix=" $" />
        </div>
        <div className="ag-stack">
          <div className="ag-grid c2">
            <Metric label="Partners in motion" value={num(subs * partners)} sub={`${num(subs * partners * perWeek)} workshops a week`} tone="internal" />
            <Metric label="Customer workshops in Q1" value={num(held)} sub={`${num(workshops)} booked × ${show}% held`} tone="internal" />
            <Metric label="Accounts agentified" value={num(activated)} sub={`${num(activated * seats * 0.35)} users brought into a routine (est.)`} tone="internal" />
            <Metric label="Accounts ‘Using’" value={num(usingN)} sub="median ≥ 5 tasks/wk, 3+ use cases" tone="internal" />
          </div>
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 8 }}>Where revenue comes from</div>
            <Bars rows={[
              { label: "New users wanted", value: wantedNew },
              { label: `Funded by ${usd(pool)} credits`, value: fundedNew },
              { label: "Converted to paid seats", value: paid },
            ]} format={(v) => num(v)} />
            <p style={{ marginTop: 10, fontSize: 14 }}>≈ <b>{usd(arr)}</b> new annual seat revenue from POC conversions alone, before edition upgrades and renewals.</p>
            {binding && <div className="ag-banner warn" style={{ marginTop: 10 }}><TriangleAlert size={15} /><div>The <b>{usd(pool)} credit pool is the binding constraint</b>: it funds {num(fundedNew)} of {num(wantedNew)} new users at {usd(creditPerUser)} each ({p.program.pocMonths} months × ${seatPrice}). Either prioritize credits to the highest-converting accounts or size the pool to the pipeline.</div></div>}
            <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>{p.copy.calcExclusion}</p>
          </div>
        </div>
      </div>

      <div className="ag-section ag-split even">
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>Weekly cadence</div>
          <ul className="ag-list">{p.execution.cadence.map((c) => <li key={c.when}><b style={{ minWidth: 80 }}>{c.when}</b><span style={{ fontSize: 13.5 }}>{c.what}</span></li>)}</ul>
        </div>
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>Sub-regions <span className="ag-muted" style={{ fontWeight: 400, fontSize: 12 }}>· assumed — confirm</span></div>
          <ul className="ag-list">{p.subRegions.map((s) => <li key={s}><b style={{ flex: 1 }}>{s}</b><span className="ag-muted" style={{ fontSize: 12.5 }}>{view.partners.filter((x) => x.subRegion === s).map((x) => x.name).join(" · ")}</span></li>)}</ul>
        </div>
      </div>
    </div>
  );
}

export function Squad() {
  const { view } = useAgentify();
  const p = view?.plan;
  if (!view || !p) return null;
  return (
    <div>
      <InternalBanner />
      <Head eyebrow="Squad & accountability" title="Who owns which number" lede="Every outcome has one accountable owner, a metric they can move, and a weekly moment where it's read out. Rows marked “proposed” need the owners' agreement." />
      <div className="ag-card">
        <div className="ag-table-wrap"><table className="ag-table">
          <thead><tr><th>Who</th><th>Accountable for</th><th>Metric</th><th>Cadence</th><th /></tr></thead>
          <tbody>{p.raci.map((r) => (
            <tr key={r.who}><td><b>{r.who}</b><div className="ag-muted" style={{ fontSize: 12 }}>{r.role}</div></td><td style={{ maxWidth: 360 }}>{r.accountableFor}</td><td style={{ maxWidth: 260 }}>{r.metric}</td><td>{r.cadence}</td><td><StatusTag s={r.status} /></td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <div className="ag-section ag-split even">
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>The squad</div>
          <ul className="ag-list">{p.squad.map((s) => <li key={s.seat}><div style={{ flex: 1 }}><b>{s.seat}</b><div className="ag-muted" style={{ fontSize: 12.5 }}>{s.note}</div></div><span className="ag-tag type" style={{ textTransform: "none" }}>{s.fte}</span></li>)}</ul>
        </div>
        <div className="ag-stack">
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>Holding it together</div>
            <ul className="ag-bullets">
              {p.copy.holding.map((h) => <li key={h.lead}><b>{h.lead}:</b> {h.body}</li>)}
            </ul>
          </div>
          <div className="ag-banner info"><Info size={15} /><div>{p.copy.placeholderNote}</div></div>
        </div>
      </div>
    </div>
  );
}

const PLAYS: (Play | "all")[] = ["all", "activate", "deepen", "expand", "upgrade-first", "not-now"];

export function Qualify({ mine }: { mine?: boolean }) {
  const { view, navigate } = useAgentify();
  const [region, setRegion] = useState("all");
  const [play, setPlay] = useState<Play | "all">("all");
  const rows = useMemo(() => (view?.accounts ?? []).filter((a) => (region === "all" || a.subRegion === region) && (play === "all" || a.internal?.play === play)).sort((x, y) => (y.internal?.score ?? 0) - (x.internal?.score ?? 0)), [view, region, play]);
  if (!view) return null;
  const regions = [...new Set(view.accounts.map((a) => a.subRegion))];
  const must = view.plan?.qualify.mustKnow ?? [
    { q: "Which Workspace edition?", why: "Sets the entitlement and beta eligibility." },
    { q: "Median Gemini usage per user?", why: "The median user — not the average — is what activation moves." },
    { q: "Which use cases are live?", why: "Pick the lab that fits." },
  ];
  return (
    <div>
      <Head eyebrow={mine ? "My accounts" : "Account qualification"} title="Is this account worth our while?" lede="Three facts decide it: the edition they're on, how much the median user actually uses the agent, and which use cases are already live." />
      <div className="ag-grid c3">
        {must.map((m, i) => <div key={i} className="ag-card"><b>{m.q}</b><p className="ag-muted" style={{ fontSize: 13, marginTop: 4 }}>{m.why}</p></div>)}
      </div>
      <div className="ag-section ag-row" style={{ gap: 10 }}>
        <select className="ag-select" style={{ width: "auto" }} value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Sub-region"><option value="all">All sub-regions</option>{regions.map((r) => <option key={r}>{r}</option>)}</select>
        <div className="ag-chips">{PLAYS.map((p) => <button key={p} type="button" className="ag-chip" aria-pressed={play === p} onClick={() => setPlay(p)}>{p === "all" ? "All plays" : p.replace("-", " ")}</button>)}</div>
      </div>
      <div className="ag-card">
        <div className="ag-table-wrap"><table className="ag-table">
          <thead><tr><th>Account</th><th>Edition</th><th className="num">Seats</th><th className="num">Median</th><th className="num">Mean</th><th className="num">Active</th><th>Use cases</th><th className="num">Score</th><th>Play</th><th>Stage</th></tr></thead>
          <tbody>
            {rows.map((a: AccountView) => (
              <tr key={a.id} style={{ cursor: "pointer" }} onClick={() => navigate({ page: "account", id: a.id })}>
                <td><b>{a.name}</b><div className="ag-muted" style={{ fontSize: 12 }}>{a.subRegion} · {a.industry}{!mine && a.partner ? ` · ${a.partner.name}` : ""}</div></td>
                <td>{a.edition.name}{a.edition.betaFirstWave && <div className="ag-muted" style={{ fontSize: 11.5 }}>beta first wave{a.geminiBeta ? " · on" : ""}</div>}{a.sovereign && <div style={{ fontSize: 11.5, color: "var(--bad)" }}>Sovereign</div>}</td>
                <td className="num">{num(a.seats)}</td>
                <td className="num"><b>{a.usage.median}</b></td>
                <td className="num ag-muted">{a.usage.mean}</td>
                <td className="num">{pct(a.usage.activeShare)}</td>
                <td style={{ fontSize: 12.5 }}>{a.useCases.length ? a.useCases.map((u) => u.title).join(", ") : <span className="ag-muted">none</span>}</td>
                <td className="num"><b>{a.internal?.score}</b></td>
                <td>{a.internal && <PlayTag play={a.internal.play} label={a.internal.playLabel} />}</td>
                <td><StageTag s={a.stage} /></td>
              </tr>
            ))}
          </tbody>
        </table></div>
        <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>Median and mean are agentic tasks per user per week. When the median is 0 and the mean isn&apos;t, a few power users are hiding an idle majority — that gap is the activation prize.</p>
      </div>
    </div>
  );
}

export function Scorecard() {
  const { view } = useAgentify();
  if (!view) return null;
  const a = view.accounts;
  const stages = view.stages.map((s) => ({ label: s.label, value: a.filter((x) => x.stage === s.id).length, sub: s.rule }));
  const regions = [...new Set(a.map((x) => x.subRegion))];
  return (
    <div>
      <Head eyebrow="Weekly scorecard" title="Friday read-out" lede="Activation → usage → expansion, read from median telemetry. Stages can't be claimed ahead of the data — the server refuses it." />
      <div className="ag-grid c4">
        <Metric label="Accounts in program" value={a.length} sub={`${a.filter((x) => x.internal?.play !== "not-now").length} in scope`} />
        <Metric label="Agentified or beyond" value={a.filter((x) => ["agentified", "using", "expanding"].includes(x.stage)).length} sub="workshop done, agents running" />
        <Metric label="Expanding" value={a.filter((x) => x.stage === "expanding").length} sub="seat / edition conversation open" />
        <Metric label="POC credits used" value={view.credits ? usd(view.credits.used) : "—"} sub={view.credits ? `${usd(view.credits.remaining)} left · ${num(a.reduce((s, x) => s + x.newUsers, 0))} new users` : ""} tone="internal" />
      </div>
      <div className="ag-section ag-split even">
        <div className="ag-card"><div className="ag-h3" style={{ marginBottom: 8 }}>Funnel by stage</div><Bars rows={stages} format={(v) => String(v)} /></div>
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>By sub-region</div>
          <div className="ag-table-wrap"><table className="ag-table">
            <thead><tr><th>Sub-region</th><th className="num">Accounts</th><th className="num">Agentified+</th><th className="num">Median of medians</th></tr></thead>
            <tbody>{regions.map((r) => {
              const rs = a.filter((x) => x.subRegion === r);
              const meds = rs.map((x) => x.usage.median).sort((x, y) => x - y);
              return <tr key={r}><td>{r}</td><td className="num">{rs.length}</td><td className="num">{rs.filter((x) => ["agentified", "using", "expanding"].includes(x.stage)).length}</td><td className="num">{meds[Math.floor((meds.length - 1) / 2)] ?? 0}</td></tr>;
            })}</tbody>
          </table></div>
        </div>
      </div>
      <div className="ag-section ag-card">
        <div className="ag-h3" style={{ marginBottom: 8 }}>This week&apos;s activity</div>
        {view.log.length ? <ul className="ag-activity">{view.log.map((l) => <li key={l.seq}><span className="ag-dot" data-p={l.actor} style={{ marginTop: 6 }} /><span>{l.text}</span></li>)}</ul> : <p className="ag-muted">Nothing yet this week — book a workshop from the partner view.</p>}
      </div>
      <p className="ag-muted" style={{ fontSize: 12, marginTop: 10 }}>{Object.keys(STAGE_LABEL).length} stages · synthetic accounts and telemetry.</p>
    </div>
  );
}
