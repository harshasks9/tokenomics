"use client";

import { CalendarPlus, Coins, Info } from "lucide-react";
import { useState } from "react";
import type { Stage } from "@/lib/agentify/types";
import { useAgentify } from "./state";
import { weekDate } from "./CustomerPages";
import { Head, Metric, PlayTag, SectionHead, ShiftCard, STAGE_LABEL, StageTag, num, usd } from "./ui";

const THIS_WEEK = 2;

export function Board() {
  const { view, act, navigate } = useAgentify();
  const [pick, setPick] = useState("");
  if (!view) return null;
  const mine = view.accounts;
  const thisWeek = mine.filter((a) => a.workshopWeek === THIS_WEEK);
  const bookable = mine.filter((a) => a.stage === "qualified" && !a.sovereign).sort((x, y) => (y.internal?.score ?? 0) - (x.internal?.score ?? 0));
  const cols: Stage[] = ["qualified", "scheduled", "agentified", "using", "expanding"];
  return (
    <div>
      <Head eyebrow={`${view.person.org} · week ${THIS_WEEK} of Q1 (from ${weekDate(THIS_WEEK)})`} title="This week: five customers, one Agentify your Day each" lede="Book from your qualified accounts — highest-value first. Mark each session done with the agents the champions built; stages after that move only when the median-usage telemetry supports them." />
      <ShiftCard shift={view.shift} />
      <div className="ag-grid c4">
        <Metric label="Booked this week" value={`${thisWeek.length} / 5`} sub="target: 5 customers per partner per week" />
        <Metric label="Accounts in my book" value={mine.length} sub={`${mine.filter((a) => ["agentified", "using", "expanding"].includes(a.stage)).length} agentified or beyond`} />
        <Metric label="POC credits left (program)" value={view.credits ? usd(view.credits.remaining) : "—"} sub={view.credits ? `I can allocate up to ${usd(view.credits.partnerCap)} per account` : ""} />
        <Metric label="Week-4 check-ins due" value={mine.filter((a) => a.stage === "agentified").length} sub="median ≥ 5 tasks/wk to reach ‘Using’" />
      </div>

      <div className="ag-section">
        <SectionHead title={`Week ${THIS_WEEK} sessions`} />
        <div className="ag-week">
          {Array.from({ length: 5 }, (_, i) => {
            const a = thisWeek[i];
            return a ? (
              <button key={i} type="button" className="ag-slot filled" style={{ textAlign: "left" }} onClick={() => navigate({ page: "account", id: a.id })}>
                <b>{a.name}</b>
                <div className="ag-muted" style={{ fontSize: 12 }}>{a.edition.name} · {num(a.seats)} seats</div>
                <div className="ag-row" style={{ marginTop: 8 }}><StageTag s={a.stage} />{a.internal && <PlayTag play={a.internal.play} label={a.internal.playLabel} />}</div>
              </button>
            ) : (
              <div key={i} className="ag-slot">
                <div className="ag-muted" style={{ fontSize: 12.5, marginBottom: 8 }}>Open slot {i + 1}</div>
                {i === thisWeek.length && bookable.length > 0 && (
                  <>
                    <select className="ag-select" value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Account to book">
                      <option value="">Choose an account…</option>
                      {bookable.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.internal?.playLabel} ({b.internal?.score})</option>)}
                    </select>
                    <button type="button" className="ag-btn primary sm" style={{ marginTop: 8 }} disabled={!pick} onClick={() => act({ type: "workshop.register", accountId: pick, week: THIS_WEEK }, { success: "Booked for this week" }).then(() => setPick(""))}><CalendarPlus size={13} />Book</button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {bookable.length === 0 && thisWeek.length < 5 && <div className="ag-banner info" style={{ marginTop: 10 }}><Info size={15} /><div>No qualified accounts left to book. Ask the central team for next week&apos;s list — it&apos;s published every Monday.</div></div>}
      </div>

      <div className="ag-section">
        <SectionHead title="My pipeline" sub="activation → usage → expansion" />
        <div className="ag-board">
          {cols.map((c) => (
            <div key={c} className="ag-col">
              <div className="ag-col-head"><span>{STAGE_LABEL[c]}</span><span className="ag-count">{mine.filter((a) => a.stage === c).length}</span></div>
              {mine.filter((a) => a.stage === c).map((a) => (
                <button key={a.id} type="button" className="ag-tile" onClick={() => navigate({ page: "account", id: a.id })}>
                  <b>{a.name}</b>
                  <span className="ag-muted" style={{ fontSize: 12 }}>median {a.usage.median}/wk · {Math.round(a.usage.activeShare * 100)}% active</span>
                  {a.credits > 0 && <div style={{ fontSize: 12, marginTop: 4 }}><Coins size={11} /> {a.newUsers} new users on credits</div>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Kit() {
  const { view, navigate } = useAgentify();
  if (!view) return null;
  return (
    <div>
      <Head eyebrow="Workshop kit" title="Agentify your Day — the run sheet" lede="One repeatable hands-on day, a fixed kit, run by partners at volume — the “Dashboard in a Day” model applied to Workspace agents." />
      <div className="ag-split">
        <div className="ag-card">
          <div className="ag-h3" style={{ marginBottom: 8 }}>Run sheet (3.5 hours)</div>
          <ul className="ag-list">
            {view.workshop.map((b) => <li key={b.time}><span className="ag-tag type ag-mono" style={{ textTransform: "none", minWidth: 50, justifyContent: "center" }}>{b.time}</span><div><b>{b.block}</b><div className="ag-muted" style={{ fontSize: 13 }}>{b.detail}</div></div></li>)}
          </ul>
        </div>
        <div className="ag-stack">
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 8 }}>Before · during · after</div>
            <ul className="ag-bullets">
              <li><b>Before:</b> pull edition, median usage and live use cases for the account (Account qualification). Confirm 10–20 champions + 1 admin.</li>
              <li><b>During:</b> every attendee leaves with 3 long-running agents running on their own work, and names the one they&apos;ll use daily.</li>
              <li><b>Week 1:</b> 20-minute check-in — fix blockers, add a second team.</li>
              <li><b>Week 4:</b> read the median. ≥ 2 tasks/week = agentified stuck; ≥ 5 with 3 use cases = Using.</li>
              <li><b>Then:</b> who else should be on it? New users can join on POC credits for 90 days.</li>
            </ul>
          </div>
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 8 }}>Labs</div>
            <ul className="ag-list">
              {view.useCases.map((u) => <li key={u.id}><button type="button" className="ag-link" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "lab" })}>{u.title}</button><span className="ag-spacer" /><span className="ag-muted ag-mono" style={{ fontSize: 11.5 }}>{u.ref}</span></li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
