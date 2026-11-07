"use client";

import { ArrowLeft, CalendarPlus, CircleCheck, Coins, Lock, Rocket, UserCog } from "lucide-react";
import { useState } from "react";
import type { Stage } from "@/lib/agentify/types";
import { useAgentify } from "./state";
import { recommend, weekDate } from "./CustomerPages";
import { Bars, Histogram, Metric, PlayTag, SectionHead, StageTag, STAGE_LABEL, num, pct, usd } from "./ui";

const NEXT: Partial<Record<Stage, Stage>> = { agentified: "using", using: "expanding" };

export default function AccountPage({ id }: { id: string }) {
  const { view, act, navigate, persona } = useAgentify();
  const [week, setWeek] = useState(2);
  const [picked, setPicked] = useState<string[]>([]);
  const [users, setUsers] = useState(20);
  const [partnerId, setPartnerId] = useState("");
  if (!view) return null;
  const a = view.accounts.find((x) => x.id === id);
  if (!a) return <div className="ag-empty"><Lock size={16} /> Not in your book — the server didn&apos;t return this account.</div>;
  const recs = recommend(a, view.useCases);
  const next = NEXT[a.stage];
  const creditCost = users * a.edition.pupm * (view.credits?.months ?? 3);
  const sameRegion = view.partners.filter((p) => p.subRegion === a.subRegion);

  return (
    <div>
      <button type="button" className="ag-link" style={{ marginBottom: 12 }} onClick={() => navigate({ page: persona === "partner" ? "accounts" : "qualify" })}><ArrowLeft size={13} /> Accounts</button>
      <div className="ag-row between" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="ag-eyebrow">{a.subRegion} · {a.industry}{a.partner ? ` · ${a.partner.name}` : " · no partner"}</div>
          <h1 className="ag-h1">{a.name}</h1>
          <div className="ag-row" style={{ marginTop: 6 }}>
            <StageTag s={a.stage} />{a.internal && <PlayTag play={a.internal.play} label={a.internal.playLabel} />}
            <span className="ag-tag type" style={{ textTransform: "none" }}>{a.edition.name} · ${a.edition.entitlement}/user/mo</span>
            {a.edition.betaFirstWave && <span className={`ag-tag ${a.geminiBeta ? "ok" : "warn"}`}>Beta first wave · {a.geminiBeta ? "on" : "off"}</span>}
            {a.sovereign && <span className="ag-tag bad">Sovereign Controls</span>}
          </div>
        </div>
        {a.internal && <div className="ag-card" style={{ minWidth: 200, textAlign: "center" }}><div className="ag-metric-label" style={{ justifyContent: "center" }}>Worth-it score</div><div className="ag-metric-value">{a.internal.score}</div></div>}
      </div>

      <div className="ag-section ag-grid c4">
        <Metric label="Seats" value={num(a.seats)} sub={`${usd(a.seats * a.edition.entitlement)}/mo agent capacity owned`} />
        <Metric label="Median user" value={`${a.usage.median}/wk`} sub={`mean ${a.usage.mean} · p90 ${a.usage.p90}`} />
        <Metric label="Active" value={pct(a.usage.activeShare)} sub={`${num(a.internal?.headroomUsers ?? 0)} idle seats = activation prize`} />
        <Metric label="At entitlement cap" value={pct(a.usage.atCap)} sub="users drawing the full $/month" />
      </div>

      <div className="ag-section ag-split">
        <div className="ag-stack">
          <div className="ag-card"><div className="ag-h3" style={{ marginBottom: 8 }}>Usage distribution</div><Histogram u={a.usage} /></div>
          <div className="ag-card"><div className="ag-h3" style={{ marginBottom: 8 }}>Median by team</div><Bars rows={a.usage.byTeam.map((t) => ({ label: t.team, value: t.median, sub: `${pct(t.activeShare)} active` }))} format={(v) => `${v}/wk`} threshold={{ value: 2, label: "activation line: 2 tasks/week" }} /></div>
          {a.internal && (
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 6 }}>Why this play</div>
              <ul className="ag-bullets">{a.internal.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
              <p style={{ marginTop: 8, fontSize: 13.5 }}><b>Next:</b> {a.internal.next}</p>
              {a.internal.notes && <p className="ag-quote">{a.internal.notes}</p>}
            </div>
          )}
        </div>

        <div className="ag-stack">
          <div className="ag-card">
            <SectionHead title="Move it forward" />
            {a.stage === "qualified" && !a.sovereign && (
              <>
                <label className="ag-label" htmlFor="aw">Book Agentify your Day</label>
                <div className="ag-row nowrap">
                  <select id="aw" className="ag-select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>{Array.from({ length: 12 }, (_, i) => i + 2).map((w) => <option key={w} value={w}>Week {w} · {weekDate(w)}</option>)}</select>
                  <button type="button" className="ag-btn primary" onClick={() => act({ type: "workshop.register", accountId: a.id, week }, { success: `Booked week ${week}` })}><CalendarPlus size={14} />Book</button>
                </div>
              </>
            )}
            {a.stage === "scheduled" && (
              <>
                <div className="ag-label">Mark the workshop done — which agents did champions build?</div>
                <div className="ag-chips" style={{ margin: "6px 0 10px" }}>
                  {view.useCases.map((u) => <button key={u.id} type="button" className="ag-chip" aria-pressed={picked.includes(u.id)} onClick={() => setPicked(picked.includes(u.id) ? picked.filter((x) => x !== u.id) : [...picked, u.id])}>{u.title}</button>)}
                </div>
                <button type="button" className="ag-btn primary" disabled={!picked.length} onClick={() => act({ type: "workshop.complete", accountId: a.id, useCaseIds: picked }, { success: "Workshop recorded — agentified" })}><CircleCheck size={14} />Workshop done</button>
              </>
            )}
            {next && (
              <div style={{ marginTop: 10 }}>
                <button type="button" className="ag-btn" onClick={() => act({ type: "account.advance", accountId: a.id, to: next }, { success: `Moved to ${STAGE_LABEL[next]}` })}><Rocket size={14} />Move to “{STAGE_LABEL[next]}”</button>
                <p className="ag-muted" style={{ fontSize: 12, marginTop: 6 }}>{view.stages.find((s) => s.id === next)?.rule}. Telemetry supports: <b>{a.internal ? STAGE_LABEL[a.internal.earned] : "—"}</b>.</p>
              </div>
            )}
            {a.stage === "expanding" && <p style={{ fontSize: 13.5 }}>Expansion conversation open — new seats, edition upgrade or renewal. No Gemini add-on pitch.</p>}
          </div>

          {["agentified", "using", "expanding"].includes(a.stage) && view.credits && (
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 6 }}><Coins size={14} /> New users on POC credits</div>
              <label className="ag-label">New users: <b>{users}</b> · {usd(creditCost)} ({view.credits.months} months × ${a.edition.pupm})</label>
              <input className="ag-range" type="range" min={1} max={200} value={users} onChange={(e) => setUsers(Number(e.target.value))} aria-label="New users" />
              <button type="button" className="ag-btn primary sm" style={{ marginTop: 8 }} onClick={() => act({ type: "credits.allocate", accountId: a.id, newUsers: users }, { success: `${users} new users funded for ${view.credits!.months} months` })}>Allocate</button>
              <p className="ag-muted" style={{ fontSize: 12, marginTop: 6 }}>{usd(view.credits.remaining)} left in the {usd(view.credits.pool)} pool{persona === "partner" ? ` · partner cap ${usd(view.credits.partnerCap)} per account` : ""}. Already here: {a.newUsers} users, {usd(a.credits)}.</p>
            </div>
          )}

          {persona === "google" && (
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 6 }}><UserCog size={14} /> Partner</div>
              <div className="ag-row nowrap">
                <select className="ag-select" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} aria-label="Assign partner"><option value="">{a.partner ? `Currently ${a.partner.name}` : "Assign a partner…"}</option>{sameRegion.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.accounts} accounts)</option>)}</select>
                <button type="button" className="ag-btn" disabled={!partnerId} onClick={() => act({ type: "account.assign", accountId: a.id, partnerId }, { success: "Partner assigned" })}>Assign</button>
              </div>
            </div>
          )}

          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>Lead with</div>
            <ul className="ag-list">{recs.map((u) => <li key={u.id}><button type="button" className="ag-link" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "lab" })}>{u.title}</button><span className="ag-spacer" /><span className="ag-muted" style={{ fontSize: 12 }}>{u.surfaces.join(" · ")}</span></li>)}</ul>
            {a.useCases.length > 0 && <p className="ag-muted" style={{ fontSize: 12.5, marginTop: 6 }}>Live today: {a.useCases.map((u) => `${u.title} (${pct(u.share)})`).join(", ")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
