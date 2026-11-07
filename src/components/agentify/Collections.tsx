"use client";

import { ArrowLeft, ArrowRight, CheckCheck, Play, ShieldCheck } from "lucide-react";
import type { FunctionId } from "@/lib/agentify/functions-types";
import { useAgentify } from "./state";
import { FUNCTION_ICON } from "./AgentDay";
import { Head, usd } from "./ui";

export function CollectionsIndex() {
  const { view, navigate } = useAgentify();
  if (!view) return null;
  return (
    <div>
      <Head eyebrow="Collections" title="Agents for the teams that carry the most busywork" lede="Four ready-made collections. Each one is a set of long-running agents with real instructions, approvals and a workshop lab — running on the Gemini agent already in your Workspace plan." />
      <div className="ag-grid c2">
        {view.functions.map((f) => {
          const Icon = FUNCTION_ICON[f.id];
          const day = view.days.find((d) => d.functionId === f.id);
          return (
            <button key={f.id} type="button" className="ag-fncard" data-fn={f.id} onClick={() => navigate({ page: "collection", id: f.id })}>
              <div className="ag-row nowrap" style={{ gap: 12 }}>
                <span className="ag-fncard-icon"><Icon size={22} /></span>
                <div><div className="ag-h2">{f.name}</div><div className="ag-muted" style={{ fontSize: 13 }}>{f.personas.join(" · ")}</div></div>
              </div>
              <p className="ag-fncard-tag">{f.tagline}</p>
              <div className="ag-fncard-outcomes">{f.outcomes.map((o) => <div key={o.label}><b>{o.value}</b><span>{o.label}</span></div>)}</div>
              {day && <div className="ag-fncard-day"><s>Day ends {day.before.stats.endOfDay}</s><ArrowRight size={13} /><b>{day.after.stats.endOfDay}</b><span className="ag-muted"> · {day.after.stats.hoursReturned} h back</span></div>}
              <span className="ag-link">Open the collection <ArrowRight size={13} /></span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CollectionPage({ id }: { id: FunctionId }) {
  const { view, navigate } = useAgentify();
  if (!view) return null;
  const f = view.functions.find((x) => x.id === id);
  if (!f) return <div className="ag-empty">Collection not found.</div>;
  const day = view.days.find((d) => d.functionId === id);
  const ucs = f.useCaseIds.map((u) => view.useCases.find((x) => x.id === u)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const hero = ucs[0];
  const Icon = FUNCTION_ICON[f.id];
  const monthly = ucs.reduce((s, u) => s + u.monthlyPerUser, 0);
  const ent = view.accounts[0]?.edition.entitlement ?? 6;
  return (
    <div>
      <button type="button" className="ag-link" style={{ marginBottom: 12 }} onClick={() => navigate({ page: "collections" })}><ArrowLeft size={13} /> Collections</button>
      <section className="ag-colhero" data-fn={f.id}>
        <span className="ag-fncard-icon lg"><Icon size={28} /></span>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="ag-eyebrow" style={{ color: "rgba(255,255,255,.8)" }}>{f.personas.join(" · ")}</div>
          <h1>{f.name}: {f.tagline}</h1>
          <div className="ag-row" style={{ marginTop: 14 }}>
            <button type="button" className="ag-btn primary lg" onClick={() => navigate({ page: "day", fn: f.id })}><Play size={15} />See {day?.persona.name.split(" ")[0] ?? "a"}&apos;s day, before and after</button>
            {hero && <button type="button" className="ag-btn lg ghost-light" onClick={() => navigate({ page: "usecase", slug: hero.slug, tab: "run" })}>Try {hero.title}</button>}
          </div>
        </div>
        <div className="ag-colhero-outcomes">{f.outcomes.map((o) => <div key={o.label}><b>{o.value}</b><span>{o.label}</span></div>)}</div>
      </section>

      {day && (
        <div className="ag-section ag-beforeafter">
          <div className="ag-ba before"><div className="ag-eyebrow">Today</div><p>{day.before.summary}</p><div className="ag-ba-stats"><span><b>{day.before.stats.hoursOnBusywork} h</b> busywork</span><span><b>{day.before.stats.slipped}</b> slipped</span><span>ends <b>{day.before.stats.endOfDay}</b></span></div></div>
          <ArrowRight className="ag-ba-arrow" size={22} />
          <div className="ag-ba after"><div className="ag-eyebrow">With agents</div><p>{day.after.summary}</p><div className="ag-ba-stats"><span><b>{day.after.stats.hoursReturned} h</b> back</span><span><b>{day.after.stats.approvals}</b> approvals</span><span>ends <b>{day.after.stats.endOfDay}</b></span></div></div>
        </div>
      )}

      <div className="ag-section ag-split">
        <div>
          <div className="ag-section-head"><h2 className="ag-h2">The agents</h2><span className="ag-muted" style={{ fontSize: 13 }}>≈ {usd(monthly)}/user/month if one person runs all four{monthly <= ent ? " — inside the agent entitlement your plan already includes" : ""}</span></div>
          <div className="ag-grid c2">
            {ucs.map((u) => (
              <button key={u.id} type="button" className="ag-asset" onClick={() => navigate({ page: "usecase", slug: u.slug, tab: "overview" })}>
                <div className="ag-asset-name">{u.title}</div>
                <div className="ag-asset-slug">{u.ref}</div>
                <p className="ag-asset-sum">{u.summary}</p>
                <div className="ag-asset-foot"><span>{u.surfaces.join(" · ")}</span><span>≈ {usd(u.monthlyPerUser)}/user/mo</span></div>
              </button>
            ))}
          </div>
        </div>
        <aside className="ag-stack">
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 8 }}><ShieldCheck size={15} /> Built for trust</div>
            <ul className="ag-list">{f.trust.map((t) => <li key={t}><CheckCheck size={15} color="var(--ok)" style={{ flex: "none", marginTop: 2 }} /><span style={{ fontSize: 13.5 }}>{t}</span></li>)}</ul>
          </div>
          <div className="ag-card">
            <div className="ag-h3" style={{ marginBottom: 6 }}>Get your team running</div>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>A half-day Agentify your Day session with your partner gets these agents working on your team&apos;s real inboxes, docs and sheets.</p>
            <button type="button" className="ag-btn primary" style={{ marginTop: 10, width: "100%" }} onClick={() => navigate({ page: "workshop" })}>Book the workshop</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
