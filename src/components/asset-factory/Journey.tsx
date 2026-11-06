"use client";

import { ArrowRight, Check, CircleCheck, EyeOff, Lock, Play, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { DEMO_CONFIG, JOURNEY, journeyContext, journeyProgress, nextTask, type JourneyStep, type JourneyTask } from "@/lib/asset-factory/journey";
import type { Config, PersonaId } from "@/lib/asset-factory/types";
import type { WorkspaceView } from "@/lib/asset-factory/views";
import { useFactory } from "./state";
import Lifecycle from "./Lifecycle";
import { SprintTimeline } from "./Workspaces";
import { AssetCard, AssetIcon, Avatar, EvalList, OrgName, PERSONA_NAME, PersonaTag, ReadinessList, TrustTag, VisibilityTag, num, usd } from "./ui";

const CAST: { p: PersonaId; name: string; org: string; initials: string }[] = [
  { p: "customer", name: "Dana Whitfield", org: "Kestrel Industrial", initials: "DW" },
  { p: "google", name: "Priya Raman", org: "Google Cloud", initials: "PR" },
  { p: "partner", name: "Marcus Oyelaran", org: "Lattice Systems Integrators", initials: "MO" },
];

function Lanes({ doneSteps, current, onPick }: { doneSteps: boolean[]; current: number; onPick: (i: number) => void }) {
  const { events } = useFactory();
  const ctx = journeyContext(events);
  return (
    <div className="af-lanes">
      <table>
        <thead>
          <tr>
            <th scope="col">Who acts at each step</th>
            {JOURNEY.map((s, i) => (
              <th key={s.id} scope="col" className={i === current ? "cur" : ""}>
                <button type="button" className="af-btn ghost sm" style={{ padding: "0 6px", fontWeight: 650 }} onClick={() => onPick(i)} aria-label={`Step ${s.n}: ${s.title}`}>{s.n}</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CAST.map((c) => (
            <tr key={c.p}>
              <th scope="row" style={{ fontWeight: 500 }}><span className="af-row nowrap" style={{ gap: 6 }}><Avatar initials={c.initials} kind={c.p} size="sm" />{PERSONA_NAME[c.p]}</span></th>
              {JOURNEY.map((s) => {
                const tasks = s.tasks.filter((t) => t.persona === c.p);
                if (!tasks.length) return <td key={s.id}><span className="af-muted">·</span></td>;
                const done = tasks.every((t) => t.done(ctx));
                return (
                  <td key={s.id}>
                    <span className={`af-lane-dot ${done ? "done" : ""} ${s.lead === c.p ? "lead" : ""}`} data-p={c.p} title={`${PERSONA_NAME[c.p]}: ${tasks.map((t) => t.label).join("; ")}${s.lead === c.p ? " (leads)" : ""}`}>
                      {done ? <Check size={12} /> : tasks.length > 1 ? <span style={{ fontSize: 10, color: "var(--ink-2)" }}>{tasks.length}</span> : null}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="af-muted" style={{ fontSize: 12, marginTop: 6 }}>Every step is performed by a real persona through the same API as the rest of the product — the server authorizes each action. {doneSteps.filter(Boolean).length} of {JOURNEY.length} steps complete.</p>
    </div>
  );
}

function NotVisible({ persona, why }: { persona: PersonaId; why: string }) {
  return (
    <div className="af-banner warn">
      <EyeOff size={16} />
      <div><b>Nothing to show you as {PERSONA_NAME[persona]}.</b> {why} The server didn&apos;t send it — this isn&apos;t a hidden UI element.</div>
    </div>
  );
}

function Focus({ step, ws, config, setConfig }: { step: JourneyStep; ws: WorkspaceView | undefined; config: Config; setConfig: (c: Config) => void }) {
  const { view, persona, setTab, openAsset, events } = useFactory();
  if (!view) return null;
  const byId = new Map(view.assets.map((a) => [a.id, a]));
  const ctx = journeyContext(events);
  const noWs = !ws && ctx.wsId
    ? <NotVisible persona={persona} why={`Kestrel's workspace is private until Dana invites ${persona === "google" ? "Google Cloud" : "Lattice"}.`} />
    : !ws ? <div className="af-empty">The workspace appears here once Dana creates it.</div> : null;

  switch (step.focus) {
    case "asset": {
      const a = byId.get("a-scer-blueprint");
      return a ? (
        <div className="af-grid c2">
          <AssetCard a={a} />
          <div className="af-card flat">
            <div className="af-h3">What Dana sees before talking to anyone</div>
            <ul className="af-bullets">
              <li>{a.deployments} production deployments · {a.rating}★ from {a.ratingCount} ratings</li>
              <li>Prerequisites: {a.prerequisites.slice(0, 2).join("; ")}…</li>
              <li>Security: {a.security[0]}</li>
              <li>Modeled run cost: ${a.costPerExecution.toFixed(2)} per exception resolved</li>
            </ul>
          </div>
        </div>
      ) : null;
    }
    case "workspace":
      if (!ws) return noWs;
      return (
        <div className="af-card flat">
          <div className="af-h3" style={{ marginBottom: 6 }}>Collaborators and their access</div>
          <ul className="af-list">
            {ws.members.map((m) => (
              <li key={m.person.id}>
                <Avatar initials={m.person.initials} kind={m.person.org.kind} size="sm" />
                <div style={{ flex: 1 }}><b>{m.person.name}</b> <span className="af-muted">· <OrgName org={m.person.org} /></span></div>
                <span className="af-tag">{m.responsibilities.join(" + ")}</span>
              </li>
            ))}
          </ul>
          {ws.members.length < 3 && <p className="af-muted" style={{ fontSize: 12.5, marginTop: 8 }}><Lock size={11} /> Switch to Google FDE or Partner FDE now and this workspace simply isn&apos;t in their data.</p>}
        </div>
      );
    case "assembly":
      if (!ws) return noWs;
      return (
        <div className="af-stack">
          {step.id === "assemble" && (
            <div className="af-card flat">
              <div className="af-h3" style={{ marginBottom: 8 }}>Kestrel&apos;s thresholds <span className="af-muted" style={{ fontWeight: 400, fontSize: 12 }}>(applied by the “Apply” task)</span></div>
              <label className="af-label" htmlFor="j-limit">Auto-resolve limit: ${config.autoResolveLimit.toLocaleString("en-US")} {config.autoResolveLimit > 3500 && <span style={{ color: "var(--bad)" }}>— above the safety threshold</span>}</label>
              <input id="j-limit" className="af-range" type="range" min={500} max={8000} step={250} value={config.autoResolveLimit} onChange={(e) => setConfig({ ...config, autoResolveLimit: Number(e.target.value) })} />
              <div className="af-grid c2" style={{ marginTop: 8 }}>
                <div><label className="af-label" htmlFor="j-pl">Plants</label><input id="j-pl" className="af-input" type="number" min={1} max={12} value={config.plants} onChange={(e) => setConfig({ ...config, plants: Number(e.target.value) })} /></div>
                <div><label className="af-label" htmlFor="j-vol">Exceptions / month</label><input id="j-vol" className="af-input" type="number" min={100} step={100} value={config.exceptionsPerMonth} onChange={(e) => setConfig({ ...config, exceptionsPerMonth: Number(e.target.value) })} /></div>
              </div>
            </div>
          )}
          <div className="af-grid c2">
            <div className="af-card flat">
              <div className="af-h3" style={{ marginBottom: 4 }}>Assembled components</div>
              <ul className="af-list">
                {[ws.blueprintId, ...ws.componentIds].filter((x): x is string => Boolean(x)).map((id) => {
                  const a = byId.get(id);
                  if (!a) return <li key={id} className="af-muted">Hidden component</li>;
                  return (
                    <li key={id}>
                      <AssetIcon type={a.type} size={24} />
                      <button type="button" className="af-btn ghost" style={{ padding: 0, flex: 1, justifyContent: "flex-start", whiteSpace: "normal", textAlign: "left" }} onClick={() => openAsset(a.id)}>{a.name}</button>
                      <span className="af-muted" style={{ fontSize: 11.5 }}>{a.ownerLabel.split(" ")[0]}</span>
                      {a.visibility !== "public" && <VisibilityTag v={a.visibility} compact />}
                    </li>
                  );
                })}
                {!ws.blueprintId && !ws.componentIds.length && <li className="af-muted">Empty — waiting for a blueprint.</li>}
              </ul>
            </div>
            <div className="af-card flat">
              <div className="af-h3" style={{ marginBottom: 4 }}>Live evaluation results</div>
              <EvalList evals={ws.evals} />
            </div>
          </div>
        </div>
      );
    case "readiness":
      if (!ws) return noWs;
      return (
        <div className="af-grid c2">
          <div className="af-card flat"><div className="af-h3">Readiness gate</div><ReadinessList checks={ws.readiness} /></div>
          <div className="af-card flat">
            <div className="af-h3">Sign-offs</div>
            <ul className="af-list">
              {ws.members.map((m) => <li key={m.person.id}><Avatar initials={m.person.initials} kind={m.person.org.kind} size="sm" /><span style={{ flex: 1 }}>{m.person.name} · {m.person.org.name}</span>{m.approved ? <span className="af-tag ok">Signed off</span> : <span className="af-tag">Pending</span>}</li>)}
            </ul>
            <div className="af-h3" style={{ marginTop: 12 }}>Evaluations</div>
            <EvalList evals={ws.evals} />
          </div>
        </div>
      );
    case "sprint":
      if (!ws) return noWs;
      return (
        <div className="af-card flat">
          <SprintTimeline ws={ws} />
          {ws.sprint.blockers.map((b) => (
            <div key={b.id} className={`af-banner ${b.resolved ? "ok" : "warn"}`} style={{ marginTop: 10 }}>
              {b.resolved ? <CircleCheck size={15} /> : <Lock size={15} />}
              <div>Day {b.day}: {b.text} — {b.resolved ? "resolved by Lattice" : "owned by Lattice; only Lattice can clear it"}</div>
            </div>
          ))}
        </div>
      );
    case "outcomes":
      if (!ws) return noWs;
      return (
        <div className="af-stack">
          <div className="af-grid c4">
            <div className="af-card flat af-metric"><div className="af-metric-label">Exceptions resolved</div><div className="af-metric-value">{num(ws.economics.executionsPerMonth)}<span className="af-muted" style={{ fontSize: 13 }}>/mo</span></div><div className="af-metric-sub">recurring agent runs</div></div>
            <div className="af-card flat af-metric"><div className="af-metric-label">Planner hours returned</div><div className="af-metric-value">{num(ws.economics.hoursSavedPerMonth)}</div><div className="af-metric-sub">per month, modeled</div></div>
            <div className="af-card flat af-metric"><div className="af-metric-label">Business value</div><div className="af-metric-value">{usd(ws.economics.valuePerMonth)}</div><div className="af-metric-sub">per month incl. expedite avoided</div></div>
            <div className="af-card flat af-metric"><div className="af-metric-label">ROI</div><div className="af-metric-value">{ws.economics.roi.toFixed(1)}×</div><div className="af-metric-sub">on {usd(ws.economics.consumptionPerMonth)}/mo run cost</div></div>
          </div>
          {persona === "google" && view.gtm && (
            <div className="af-banner internal"><ShieldCheck size={15} /><div><b>Google internal:</b> this activation adds {usd(ws.economics.consumptionPerMonth * 12)} annualized recurring consumption; portfolio run-rate is now {usd(view.gtm.runRate)}. Customers and partners never receive these figures.</div></div>
          )}
          {persona === "partner" && <div className="af-banner info"><Sparkles size={15} /><div>Lattice delivered this in 12 days instead of a ~60-day custom build, reusing 3 of its own assets.</div></div>}
          {persona === "customer" && <p className="af-muted" style={{ fontSize: 12.5 }}>Kestrel sees value and its own run cost. Vendor revenue and account plans are not part of the customer view.</p>}
        </div>
      );
    case "contribution": {
      const c = view.contributions.find((x) => x.id === ctx.contributionId);
      const published = c?.publishedAssetId ? byId.get(c.publishedAssetId) : undefined;
      if (!c) {
        if (ctx.contributionId) return <NotVisible persona={persona} why="Google's review board only sees a contribution after the customer permits it to leave the workspace." />;
        return <div className="af-empty">Marcus hasn&apos;t proposed anything yet.</div>;
      }
      const keys = [
        { label: "Customer permission", who: "Kestrel Industrial", done: Boolean(c.customerApprovedBy), by: c.customerApprovedBy },
        { label: "Marketplace review", who: "Google Asset Review Board", done: Boolean(c.reviewedBy), by: c.reviewedBy },
        { label: "Published", who: "Lattice Systems Integrators", done: c.status === "published", by: c.status === "published" ? c.proposer.name : null },
      ];
      return (
        <div className="af-stack">
          <div className="af-grid c2">
            <div className="af-card flat">
              <div className="af-h3">{c.title}</div>
              <p className="af-muted" style={{ fontSize: 13, marginTop: 4 }}>{c.summary}</p>
              <ul className="af-bullets">{c.changes.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="af-card flat">
              <div className="af-h3">Automatic publication scan</div>
              <ul className="af-list">{c.scan.map((s) => <li key={s.id}>{s.passed ? <CircleCheck size={15} color="var(--ok)" /> : <Lock size={15} color="var(--bad)" />}<span style={{ fontSize: 13 }}>{s.label}</span></li>)}</ul>
              <div className="af-h3" style={{ marginTop: 10 }}>Three keys</div>
              <ul className="af-list">{keys.map((k) => <li key={k.label}>{k.done ? <CircleCheck size={15} color="var(--ok)" /> : <span className="af-step-n" style={{ width: 15, height: 15 }} />}<span style={{ flex: 1, fontSize: 13 }}>{k.label} <span className="af-muted">· {k.who}</span></span>{k.by && <span className="af-muted" style={{ fontSize: 12 }}>{k.by}</span>}</li>)}</ul>
            </div>
          </div>
          {published && (
            <div className="af-banner ok"><Sparkles size={15} /><div style={{ flex: 1 }}><b>Live in the shared marketplace</b> as a <TrustTag t={published.trust} /> asset credited to Lattice — visible to every persona, and clearly not a Google certification.</div><button type="button" className="af-btn sm" onClick={() => openAsset(published.id)}>View listing</button><button type="button" className="af-btn sm" onClick={() => setTab("market")}>Marketplace <ArrowRight size={12} /></button></div>
          )}
        </div>
      );
    }
  }
}

function TaskRow({ task, ctx, isNext, config }: { task: JourneyTask; ctx: ReturnType<typeof journeyContext>; isNext: boolean; config: Config }) {
  const { act, persona, busy } = useFactory();
  const [consent, setConsent] = useState(false);
  const done = task.done(ctx);
  const action = task.action({ ...ctx, config });
  const mismatch = persona !== task.persona;
  const run = (switchTo?: PersonaId) => action && act(action, { as: switchTo, success: `${PERSONA_NAME[switchTo ?? persona]}: ${task.label}` });
  return (
    <div className={`af-task ${done ? "done" : isNext ? "active" : ""}`}>
      <span className={`af-step-n ${done ? "done" : ""}`}>{done ? <Check size={12} /> : <span className="af-dot" data-p={task.persona} />}</span>
      <div className="af-task-body">
        <div className="af-row between">
          <div style={{ fontWeight: 580 }}>{task.label}</div>
          <PersonaTag p={task.persona} />
        </div>
        {isNext && !done && task.consent && (
          <label className="af-check af-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span><b>Explicit permission:</b> {task.consent}</span>
          </label>
        )}
        {isNext && !done && (
          <div className="af-row" style={{ marginTop: 10 }}>
            <button type="button" className="af-btn primary" data-p={task.persona} disabled={busy || !action || (Boolean(task.consent) && !consent)} onClick={() => run(mismatch ? task.persona : undefined)}>
              <Play size={13} />{mismatch ? `Switch to ${PERSONA_NAME[task.persona]} & run` : "Run"}
            </button>
            {mismatch && action && task.guarded && (
              <button type="button" className="af-btn ghost sm" disabled={busy} onClick={() => run()} title={`${task.guarded} Send the same request as ${PERSONA_NAME[persona]} to see the server refuse it.`}>
                <Lock size={12} />Try it as {PERSONA_NAME[persona]}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Journey() {
  const { events, view, reset, persona } = useFactory();
  const ctx = useMemo(() => journeyContext(events), [events]);
  const progress = useMemo(() => journeyProgress(ctx), [ctx]);
  const [picked, setPicked] = useState<number | null>(null);
  const [config, setConfig] = useState<Config>(DEMO_CONFIG);
  if (!view) return null;

  const idx = Math.min(picked ?? progress.current, JOURNEY.length - 1);
  const step = JOURNEY[idx];
  const next = nextTask(ctx);
  const ws = view.workspaces.find((w) => w.id === ctx.wsId);
  const stage = progress.complete ? 8 : JOURNEY[Math.min(progress.current, JOURNEY.length - 1)].stage;

  return (
    <div>
      <div className="af-page-head">
        <div style={{ flex: 1, minWidth: 260 }}>
          <div className="af-eyebrow">Executive demo · one shared Gemini 10 journey</div>
          <h1 className="af-h1">Kestrel Industrial deploys a Supply Chain Exception Resolution Agent</h1>
          <p className="af-lede">A customer, a Google FDE and a partner FDE take it from discovery to a production agent — and a reusable improvement back to the marketplace — in ten steps. You&apos;re viewing as <b>{view.actor.person.name}</b> ({PERSONA_NAME[persona]}); each step switches to whoever acts.</p>
        </div>
        <div className="af-row">
          <span className="af-tag">{progress.complete ? "Complete" : `Step ${progress.current + 1} of ${JOURNEY.length}`}</span>
          <button type="button" className="af-btn sm" onClick={() => { if (window.confirm("Restart the demo from the beginning?")) { setPicked(null); setConfig(DEMO_CONFIG); void reset(); } }}><RotateCcw size={13} />Restart</button>
        </div>
      </div>

      <div className="af-card" style={{ marginBottom: 16 }}>
        <Lifecycle stage={stage} />
        <hr className="af-divider" />
        <Lanes doneSteps={progress.steps.map((s) => s.done)} current={idx} onPick={(i) => setPicked(i)} />
      </div>

      <div className="af-split" style={{ gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)" }}>
        <div className="af-card" style={{ padding: 8 }}>
          <ol className="af-steps">
            {JOURNEY.map((s, i) => (
              <li key={s.id}>
                <button type="button" aria-current={i === idx ? "step" : undefined} onClick={() => setPicked(i === progress.current ? null : i)}>
                  <span className={`af-step-n ${progress.steps[i].done ? "done" : ""}`}>{progress.steps[i].done ? <Check size={12} /> : s.n}</span>
                  <span>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="af-stack" style={{ gap: 14 }}>
          <div className="af-card pad-lg">
            <div className="af-row between">
              <div className="af-eyebrow">Step {step.n} · led by {PERSONA_NAME[step.lead]}</div>
              {picked !== null && picked !== progress.current && <button type="button" className="af-btn sm" onClick={() => setPicked(null)}>Jump to current step</button>}
            </div>
            <h2 className="af-h1" style={{ fontSize: 21, marginTop: 4 }}>{step.title}</h2>
            <p style={{ color: "var(--ink-2)", marginTop: 8, fontSize: 14.5 }}>{step.story}</p>
            <div className="af-grid c3" style={{ marginTop: 14 }}>
              {CAST.map((c) => (
                <div key={c.p} className="af-card flat" style={{ padding: 10, opacity: step.collaboration[c.p] ? 1 : 0.55 }}>
                  <div className="af-row nowrap" style={{ gap: 8 }}><Avatar initials={c.initials} kind={c.p} size="sm" /><b style={{ fontSize: 12.5 }}>{PERSONA_NAME[c.p]}</b></div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4 }}>{step.collaboration[c.p] ?? "Not involved in this step"}</div>
                </div>
              ))}
            </div>
            <div className="af-stack" style={{ marginTop: 16, gap: 8 }}>
              {step.tasks.map((t) => <TaskRow key={t.id} task={t} ctx={ctx} config={config} isNext={next?.task.id === t.id && next.step.id === step.id} />)}
            </div>
          </div>

          <div>
            <div className="af-eyebrow" style={{ marginBottom: 8 }}>What {view.actor.person.name} can see right now</div>
            <Focus step={step} ws={ws} config={config} setConfig={setConfig} />
          </div>

          {progress.complete && (
            <div className="af-banner ok"><CircleCheck size={16} /><div><b>Journey complete.</b> One ecosystem, three audiences: Kestrel runs a production agent, Google landed it in 10 days on reused IP, and Lattice turned the engagement into a marketplace asset — with permission, review and clear attribution at every hand-off.</div></div>
          )}
        </div>
      </div>
    </div>
  );
}
