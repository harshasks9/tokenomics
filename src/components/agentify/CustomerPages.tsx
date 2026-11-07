"use client";

import { ArrowRight, CalendarCheck, CircleCheck, Info, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import type { AccountView, UseCaseView } from "@/lib/agentify/views";
import { useAgentify } from "./state";
import { Bars, Head, Histogram, Metric, SectionHead, StageTag, num, pct, usd } from "./ui";

export const weekDate = (w: number) => {
  const d = new Date(Date.UTC(2027, 0, 4 + (w - 1) * 7));
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", timeZone: "UTC" });
};

/** Use cases that fit an account's busiest teams and aren't live yet. */
export function recommend(a: AccountView, ucs: UseCaseView[]): UseCaseView[] {
  const live = new Set([...a.enabled, ...a.useCases.map((u) => u.id)]);
  const teams = a.usage.byTeam.map((t) => t.team.toLowerCase()).join(" ");
  const fit = (u: UseCaseView) =>
    (u.id === "uc-monthend" && teams.includes("finance") ? 2 : 0) + (u.id === "uc-rfp" && /sales|consult|delivery/.test(teams) ? 2 : 0) +
    (u.id === "uc-escalation" && /service|customer/.test(teams) ? 2 : 0) + (u.id === "uc-status" && /operations|delivery/.test(teams) ? 1.5 : 0) +
    (u.id === "uc-delegate" && /leadership|sales/.test(teams) ? 1.5 : 0) + (u.id === "uc-meeting" ? 1 : 0) + (u.ownerKind === "google" ? 0.3 : 0);
  return ucs.filter((u) => !live.has(u.id)).sort((x, y) => fit(y) - fit(x)).slice(0, 3);
}

function UseCaseMini({ u }: { u: UseCaseView }) {
  const { navigate } = useAgentify();
  return (
    <button type="button" className="ag-asset" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "overview" })}>
      <div className="ag-asset-name">{u.title}</div>
      <div className="ag-asset-slug">{u.slug}</div>
      <p className="ag-asset-sum">{u.summary}</p>
      <div className="ag-asset-foot"><span>{u.surfaces.join(" · ")}</span><span>≈ {usd(u.monthlyPerUser)}/user/mo of your entitlement</span></div>
    </button>
  );
}

export function CustomerHome() {
  const { view, navigate } = useAgentify();
  if (!view) return null;
  const a = view.accounts[0];
  if (!a) return <div className="ag-empty">No account.</div>;
  const ent = a.edition.entitlement;
  const recs = recommend(a, view.useCases);
  return (
    <div>
      <section className="ag-hero" data-p="customer">
        <div className="ag-hero-tag"><Sparkles size={13} />{a.name} · {a.edition.name}</div>
        <h1>Your Workspace already includes a Gemini agent. Let&apos;s put it to work on your day.</h1>
        <p>Every one of your {num(a.seats)} users has ${ent} of Gemini agent capacity a month inside Gmail, Docs, Chat and Meet — included in your plan. The agents below keep working after you close the tab: chasing follow-ups, coordinating people, turning meetings into actions.</p>
        <div className="ag-row" style={{ marginTop: 16 }}>
          <button type="button" className="ag-btn primary lg" onClick={() => navigate({ page: "workshop" })}><CalendarCheck size={15} />{a.stage === "qualified" ? "Book Agentify your Day" : "Your workshop"}</button>
          <button type="button" className="ag-btn lg" onClick={() => navigate({ page: "usecases" })}>See the long-running agents <ArrowRight size={15} /></button>
        </div>
      </section>

      <div className="ag-section ag-grid c4">
        <Metric label="Included agent capacity" value={`${usd(ent * a.seats)}/mo`} sub={`$${ent} per user · per user, not pooled`} />
        <Metric label="Median user" value={`${a.usage.median} tasks/wk`} sub={`uses ${usd(a.usage.medianDraw)} of $${ent} a month`} />
        <Metric label="People using it" value={pct(a.usage.activeShare)} sub={`${num(a.seats * (1 - a.usage.activeShare))} haven't run an agentic task`} />
        <Metric label="Where you are" value={<StageTag s={a.stage} />} sub={a.workshopWeek ? `Workshop week of ${weekDate(a.workshopWeek)}` : a.partner ? `With ${a.partner.name}` : ""} />
      </div>

      <div className="ag-section ag-split">
        <div>
          <SectionHead title="Agents worth switching on for your teams" sub="Long-running, multi-surface — picked from where your people spend time" />
          <div className="ag-grid c3">{recs.map((u) => <UseCaseMini key={u.id} u={u} />)}</div>
          <div className="ag-section">
            <SectionHead title="How your people use it today" right={<button type="button" className="ag-btn sm" onClick={() => navigate({ page: "usage" })}>Details <ArrowRight size={13} /></button>} />
            <div className="ag-card"><Histogram u={a.usage} height={130} /></div>
          </div>
        </div>
        <div className="ag-stack">
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>What&apos;s included</div>
            <ul className="ag-bullets">
              <li>Gemini agent in Gmail (incl. “Delegate to Gemini”), Docs, Chat, Meet and Drive</li>
              <li>AI Inbox, collaborating with agents in Chat and Docs, image and video generation</li>
              <li>Chat questions don&apos;t draw down your capacity; agentic tasks do</li>
              <li>Nothing is sent or booked without your approval</li>
            </ul>
            <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>Entitlement values are indicative and may be revised (January 30, 2027).</p>
          </div>
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>Gemini Beta setting</div>
            <p style={{ fontSize: 13, color: "var(--ink-2)" }}>
              {a.edition.betaFirstWave ? (a.geminiBeta ? "On — you're in the first wave for the new Gemini agent." : "Your edition is in the first wave. An admin can switch the Gemini Beta setting on in the admin console — we'll do it together in the workshop.")
                : `${a.edition.name} isn't in the first beta wave (Business Plus and Enterprise Plus go first). Everything above works today; new capabilities arrive as rollout expands.`}
            </p>
          </div>
          {a.partner && (
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 6 }}><Users size={14} /> Your partner</div>
              <p style={{ fontSize: 13 }}><b>{a.partner.name}</b> — {a.partner.lead} runs your Agentify your Day session and the week-1 and week-4 check-ins.</p>
            </div>
          )}
          {a.newUsers > 0 && <div className="ag-banner ok"><CircleCheck size={15} /><div>{a.newUsers} new colleagues joined on POC credits for 90 days.</div></div>}
        </div>
      </div>
    </div>
  );
}

export function CustomerUsage() {
  const { view } = useAgentify();
  if (!view) return null;
  const a = view.accounts[0];
  if (!a) return null;
  return (
    <div>
      <Head eyebrow="Who's using it" title={`How ${a.name} uses the Gemini agent`} lede="We look at the median person, not the average. A handful of power users can make the average look healthy while most people haven't started." />
      <div className="ag-grid c4">
        <Metric label="Median user" value={`${a.usage.median}`} sub="agentic tasks per week" />
        <Metric label="Average (for comparison)" value={`${a.usage.mean}`} sub="pulled up by power users" />
        <Metric label="Top 10% of users" value={`${a.usage.p90}+`} sub="tasks per week" />
        <Metric label="Using it at all" value={pct(a.usage.activeShare)} sub={`of ${num(a.seats)} seats`} />
      </div>
      <div className="ag-section ag-split even">
        <div className="ag-card"><div className="ag-h3" style={{ marginBottom: 8 }}>Distribution</div><Histogram u={a.usage} /></div>
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>Median by team</div>
          <Bars rows={a.usage.byTeam.map((t) => ({ label: t.team, value: t.median, sub: `${pct(t.activeShare)} active of ${num(t.seats)}` }))} format={(v) => `${v}/wk`} threshold={{ value: 2, label: "2 tasks/week — the point where an agent is part of someone's routine" }} />
        </div>
      </div>
      <div className="ag-section ag-card">
        <div className="ag-h3" style={{ marginBottom: 8 }}>Long-running agents in use</div>
        {a.useCases.length || a.enabled.length ? (
          <Bars rows={[...a.useCases.map((u) => ({ label: u.title, value: Math.round(u.share * 100) })), ...a.enabled.filter((id) => !a.useCases.some((u) => u.id === id)).map((id) => ({ label: view.useCases.find((u) => u.id === id)?.title ?? id, value: 0, sub: "just switched on" }))]} max={100} format={(v) => (v ? `${v}%` : "new")} />
        ) : <p className="ag-muted">None yet — the workshop gets your first three running.</p>}
        <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>Share of active users running each agent. Synthetic telemetry for this demo.</p>
      </div>
    </div>
  );
}

export function Workshop() {
  const { view, act, navigate, persona } = useAgentify();
  const [week, setWeek] = useState(2);
  if (!view) return null;
  const a = persona === "customer" ? view.accounts[0] : null;
  return (
    <div>
      <Head eyebrow="Agentify your Day" title="Half a day. Three agents that keep working after you leave." lede="A hands-on session run by your partner. Your people bring their real inbox, documents and meetings; they leave with long-running agents set up on their own work — and a check-in a week later to see they stuck." />
      <div className="ag-split">
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>The agenda</div>
          <ul className="ag-list">
            {view.workshop.map((b) => (
              <li key={b.time}><span className="ag-tag type ag-mono" style={{ textTransform: "none", minWidth: 50, justifyContent: "center" }}>{b.time}</span><div><b>{b.block}</b><div className="ag-muted" style={{ fontSize: 13 }}>{b.detail}</div></div></li>
            ))}
          </ul>
        </div>
        <div className="ag-stack">
          {a && (
            <div className="ag-card">
              <div className="ag-h3" style={{ marginBottom: 8 }}>{a.stage === "qualified" ? "Book your session" : "Your session"}</div>
              {a.stage === "qualified" ? (
                <>
                  <label className="ag-label" htmlFor="wk">Week (Q1 2027)</label>
                  <select id="wk" className="ag-select" value={week} onChange={(e) => setWeek(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => i + 2).map((w) => <option key={w} value={w}>Week {w} — from {weekDate(w)}</option>)}
                  </select>
                  <button type="button" className="ag-btn primary" style={{ marginTop: 10, width: "100%" }} onClick={() => act({ type: "workshop.register", accountId: a.id, week }, { success: "Booked — your partner will confirm attendees" })}><CalendarCheck size={14} />Book week {week}</button>
                  <p className="ag-muted" style={{ fontSize: 12, marginTop: 8 }}>Bring 10–20 champions across teams plus one Workspace admin.</p>
                </>
              ) : (
                <div className="ag-row"><StageTag s={a.stage} />{a.workshopWeek && <span>Week of {weekDate(a.workshopWeek)}</span>}</div>
              )}
            </div>
          )}
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 8 }}>Labs</div>
            <ul className="ag-list">
              {view.useCases.slice(0, 6).map((u) => (
                <li key={u.id}><button type="button" className="ag-link" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "lab" })}>{u.title}</button><span className="ag-spacer" /><span className="ag-muted" style={{ fontSize: 12 }}>{u.surfaces.join(" · ")}</span></li>
              ))}
            </ul>
          </div>
          <div className="ag-banner info"><Info size={15} /><div>No new licences to buy. Everything in the session uses the Gemini agent capacity already in your Workspace plan.</div></div>
        </div>
      </div>
    </div>
  );
}
