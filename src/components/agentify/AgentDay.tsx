"use client";

import {
  ArrowRight, Calculator, CalendarCheck, CheckCheck, ChevronLeft, ChevronRight, Moon, Pause, Play, Server, ShieldCheck, Sparkles, Sunset, Timer, TrendingUp, Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FunctionId, PersonaDay } from "@/lib/agentify/functions-types";
import { useAgentify } from "./state";
import { SURFACE_ICON, SurfaceFrame } from "./Frames";

export const FUNCTION_ICON: Record<FunctionId, typeof Calculator> = { fpa: Calculator, devops: Server, secops: ShieldCheck, revops: TrendingUp };

const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + (m || 0); };
const DAY_START = 6 * 60;
const DAY_END = 20 * 60;
const pos = (t: string) => `${((Math.min(DAY_END, Math.max(DAY_START, toMin(t))) - DAY_START) / (DAY_END - DAY_START)) * 100}%`;
const KIND: Record<string, { label: string; icon: typeof Moon }> = {
  overnight: { label: "Overnight", icon: Moon }, agent: { label: "Agent", icon: Sparkles }, approval: { label: "Your approval", icon: CheckCheck }, handoff: { label: "Handoff", icon: ArrowRight },
};

/** Two day tracks on one time axis: the manual day vs the same day with agents. */
function Tracks({ d }: { d: PersonaDay }) {
  const [tip, setTip] = useState<string | null>(null);
  const hours = Array.from({ length: (DAY_END - DAY_START) / 60 + 1 }, (_, i) => 6 + i);
  return (
    <div className="ag-tracks" onMouseLeave={() => setTip(null)}>
      <div className="ag-track-row">
        <div className="ag-track-label"><b>Without agents</b><span>{d.before.stats.hoursOnBusywork} h of busywork</span></div>
        <div className="ag-track">
          {d.before.blocks.map((b, i) => (
            <button key={i} type="button" className="ag-track-block" style={{ left: pos(b.start), width: `calc(${pos(b.end)} - ${pos(b.start)} - 2px)` }}
              onMouseEnter={() => setTip(`${b.start}–${b.end} · ${b.task} — ${b.pain}`)} onFocus={() => setTip(`${b.start}–${b.end} · ${b.task} — ${b.pain}`)} aria-label={`${b.start} to ${b.end}: ${b.task}. ${b.pain}`} />
          ))}
          <span className="ag-track-end" style={{ left: pos(d.before.stats.endOfDay) }}><Sunset size={12} />{d.before.stats.endOfDay}</span>
        </div>
      </div>
      <div className="ag-track-row">
        <div className="ag-track-label"><b>With agents</b><span>{d.after.stats.hoursReturned} h returned</span></div>
        <div className="ag-track after">
          <span className="ag-track-free" style={{ left: pos(d.after.stats.endOfDay), width: `calc(${pos(d.before.stats.endOfDay)} - ${pos(d.after.stats.endOfDay)})` }} />
          {d.after.moments.map((m, i) => {
            const Icon = SURFACE_ICON[m.surface];
            return (
              <button key={i} type="button" className={`ag-track-dot ${m.kind}`} style={{ left: pos(m.time) }}
                onMouseEnter={() => setTip(`${m.time} · ${m.title}`)} onFocus={() => setTip(`${m.time} · ${m.title}`)} aria-label={`${m.time}: ${m.title}`}>
                <Icon size={11} />
              </button>
            );
          })}
          <span className="ag-track-end after" style={{ left: pos(d.after.stats.endOfDay) }}><Sunset size={12} />{d.after.stats.endOfDay}</span>
        </div>
      </div>
      <div className="ag-track-axis">{hours.map((h) => <span key={h} style={{ left: pos(`${h}:00`) }}>{h}</span>)}</div>
      <div className="ag-track-tip" aria-live="polite">{tip ?? "Point at, tap or tab to any block to see what happens when."}</div>
    </div>
  );
}

function Compare({ d }: { d: PersonaDay }) {
  const rows = [
    { label: "Hours on busywork", before: `${d.before.stats.hoursOnBusywork} h`, after: `${Math.max(0, Math.round((d.before.stats.hoursOnBusywork - d.after.stats.hoursReturned) * 10) / 10)} h`, note: `${d.after.stats.hoursReturned} h back` },
    { label: "Context switches", before: String(d.before.stats.contextSwitches), after: String(d.after.moments.length), note: "one review per agent moment" },
    { label: "Things that slipped", before: String(d.before.stats.slipped), after: "0", note: `${d.after.stats.approvals} approvals instead` },
    { label: "Day ends", before: d.before.stats.endOfDay, after: d.after.stats.endOfDay, note: "same work done" },
  ];
  return (
    <div className="ag-compare">
      {rows.map((r) => (
        <div key={r.label} className="ag-compare-card">
          <div className="ag-metric-label">{r.label}</div>
          <div className="ag-compare-vals"><s>{r.before}</s><ArrowRight size={16} /><b>{r.after}</b></div>
          <div className="ag-metric-sub">{r.note}</div>
        </div>
      ))}
    </div>
  );
}

function BeforeDay({ d, onSwitch }: { d: PersonaDay; onSwitch: () => void }) {
  const max = Math.max(...d.before.blocks.map((b) => toMin(b.end) - toMin(b.start)));
  return (
    <div className="ag-before">
      <p className="ag-lede" style={{ marginBottom: 14 }}>{d.before.summary}</p>
      <ol className="ag-before-list">
        {d.before.blocks.map((b, i) => {
          const Icon = SURFACE_ICON[b.surface];
          const mins = toMin(b.end) - toMin(b.start);
          return (
            <li key={i}>
              <span className="ag-mono ag-before-time">{b.start}–{b.end}</span>
              <span className="ag-before-surface" title={b.surface}><Icon size={14} /></span>
              <div className="ag-before-body">
                <b>{b.task}</b>
                <span className="ag-before-pain">{b.pain}</span>
                <span className="ag-before-bar"><i style={{ width: `${(mins / max) * 100}%` }} /><em>{mins} min</em></span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="ag-before-foot">
        <span><b>{d.before.stats.hoursOnBusywork} h</b> of busywork · <b>{d.before.stats.slipped}</b> things slipped · day ends <b>{d.before.stats.endOfDay}</b></span>
        <button type="button" className="ag-btn primary" onClick={onSwitch}><Sparkles size={14} />Now the same day with agents <ArrowRight size={14} /></button>
      </div>
    </div>
  );
}

function AfterDay({ d, fnName }: { d: PersonaDay; fnName: string }) {
  const { navigate, view } = useAgentify();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const n = d.after.moments.length;
  const done = i >= n;
  const m = d.after.moments[Math.min(i, n - 1)];
  const uc = view?.useCases.find((u) => u.id === m.useCaseId);

  useEffect(() => {
    if (!playing) return;
    if (i >= n) return;
    const t = setTimeout(() => setI((x) => x + 1), 5200);
    return () => clearTimeout(t);
  }, [playing, i, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") setI((x) => Math.min(n, x + 1));
      if (e.key === "ArrowLeft") setI((x) => Math.max(0, x - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  const dailyOwned = 6 / 21;
  return (
    <div className="ag-after">
      <p className="ag-lede" style={{ marginBottom: 14 }}>{d.after.summary}</p>
      <div className="ag-player">
        <ol className="ag-rail" aria-label="Moments of the day">
          {d.after.moments.map((x, k) => {
            const K = KIND[x.kind];
            return (
              <li key={k}>
                <button type="button" aria-current={k === i ? "step" : undefined} className={k < i ? "past" : ""} onClick={() => { setI(k); setPlaying(false); }}>
                  <span className="ag-mono ag-rail-time">{x.time}</span>
                  <span className={`ag-rail-kind ${x.kind}`}><K.icon size={11} /></span>
                  <span className="ag-rail-title">{x.title}</span>
                </button>
              </li>
            );
          })}
          <li><button type="button" aria-current={done ? "step" : undefined} onClick={() => { setI(n); setPlaying(false); }}><span className="ag-mono ag-rail-time">{d.after.stats.endOfDay}</span><span className="ag-rail-kind end"><Sunset size={11} /></span><span className="ag-rail-title">Day done</span></button></li>
        </ol>

        <div className="ag-stage">
          {done ? (
            <div className="ag-total" key="total">
              <div className="ag-eyebrow" style={{ color: "rgba(255,255,255,.75)" }}>{d.persona.name}&apos;s day with agents</div>
              <div className="ag-total-grid">
                <div><b>{d.after.stats.hoursReturned} h</b><span>returned</span></div>
                <div><b>{d.after.stats.approvals}</b><span>approvals given</span></div>
                <div><b>{d.after.stats.tasksCompleted}</b><span>tasks completed</span></div>
                <div><b>${d.after.stats.entitlementUsed.toFixed(2)}</b><span>used of ~${dailyOwned.toFixed(2)}/day already in your plan</span></div>
              </div>
              <p>Done at {d.after.stats.endOfDay} instead of {d.before.stats.endOfDay}. Every send, booking and change was approved by {d.persona.name.split(" ")[0]}.</p>
              <div className="ag-row" style={{ marginTop: 14 }}>
                <button type="button" className="ag-btn lg solid-light" onClick={() => navigate({ page: "collection", id: d.functionId })}>See the {fnName} collection <ArrowRight size={14} /></button>
                <button type="button" className="ag-btn lg ghost-light" onClick={() => navigate({ page: "workshop" })}><CalendarCheck size={14} />Book Agentify your Day</button>
              </div>
            </div>
          ) : (
            <div className="ag-moment" key={i}>
              <div className="ag-row between" style={{ marginBottom: 10 }}>
                <div className="ag-row nowrap" style={{ gap: 8 }}>
                  <span className="ag-mono ag-moment-time">{m.time}</span>
                  <span className={`ag-tag ag-kind-${m.kind}`}>{KIND[m.kind].label}</span>
                  <b className="ag-moment-title">{m.title}</b>
                </div>
              </div>
              <SurfaceFrame surface={m.surface} frame={m.frame} />
              <div className="ag-moment-notes">
                <div><span className="ag-note-k"><Sparkles size={12} />Agent</span><span>{m.agent}</span></div>
                <div><span className="ag-note-k you">You</span><span>{m.human}</span></div>
                {m.approval && <div><span className="ag-note-k ok"><CheckCheck size={12} />Approved</span><span>{m.approval}</span></div>}
              </div>
              <div className="ag-row" style={{ marginTop: 10 }}>
                <span className="ag-chip-stat"><Timer size={12} />{m.minutesSaved} min saved</span>
                <span className="ag-chip-stat"><Zap size={12} />${m.entitlementUsd.toFixed(2)} of included entitlement</span>
                {uc && <button type="button" className="ag-link" onClick={() => navigate({ page: "usecase", slug: uc.slug, tab: "overview" })}>{uc.title} <ArrowRight size={12} /></button>}
              </div>
            </div>
          )}
          <div className="ag-controls">
            <button type="button" className="ag-btn sm ghost" onClick={() => { setI((x) => Math.max(0, x - 1)); setPlaying(false); }} aria-label="Previous moment" disabled={i === 0}><ChevronLeft size={16} /></button>
            <button type="button" className="ag-btn sm primary" onClick={() => { if (done) setI(0); setPlaying(!playing || done); }}>{playing && !done ? <><Pause size={14} />Pause</> : <><Play size={14} />{done ? "Replay the day" : i === 0 ? "Play the day" : "Resume"}</>}</button>
            <button type="button" className="ag-btn sm ghost" onClick={() => { setI((x) => Math.min(n, x + 1)); setPlaying(false); }} aria-label="Next moment" disabled={done}><ChevronRight size={16} /></button>
            <span className="ag-progress" aria-hidden>{Array.from({ length: n + 1 }, (_, k) => <i key={k} className={k <= i ? "on" : ""} />)}</span>
            <span className="ag-muted" style={{ fontSize: 12 }}>← → keys</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AgentDay() {
  const { view, route, navigate } = useAgentify();
  const initial = (route.page === "day" && route.fn) || "fpa";
  const [fn, setFn] = useState<FunctionId>(initial as FunctionId);
  const [mode, setMode] = useState<"before" | "after">("after");
  const d = useMemo(() => view?.days.find((x) => x.functionId === fn), [view, fn]);
  const col = view?.functions.find((f) => f.id === fn);
  if (!view || !d || !col) return null;
  const pick = (f: FunctionId) => { setFn(f); setMode("after"); navigate({ page: "day", fn: f }); };

  return (
    <div>
      <section className="ag-dayhero">
        <div className="ag-dayhero-copy">
          <div className="ag-hero-tag"><Sparkles size={13} />Agent in a Day · runs on the Gemini agent already in your Workspace</div>
          <h1>Same day. Same work.<br />Hours back.</h1>
          <p>Pick a team and watch one real working day twice — the way it runs today, and the way it runs with long-running agents in Gmail, Docs, Sheets, Chat and Meet. You approve every send, booking and change.</p>
          <div className="ag-fnpick" role="tablist" aria-label="Choose a team">
            {view.functions.map((f) => {
              const Icon = FUNCTION_ICON[f.id];
              return (
                <button key={f.id} type="button" role="tab" aria-selected={f.id === fn} onClick={() => pick(f.id)}>
                  <Icon size={16} /><span><b>{f.name}</b><small>{view.days.find((x) => x.functionId === f.id)?.persona.role}</small></span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="ag-persona">
          <span className="ag-persona-av">{d.persona.initials}</span>
          <div>
            <b>{d.persona.name}</b>
            <span>{d.persona.role} · {d.persona.company}</span>
          </div>
          <p className="ag-persona-headline">“{d.headline}”</p>
          <p className="ag-persona-scenario">{d.scenario}</p>
        </div>
      </section>

      <section className="ag-section">
        <div className="ag-section-head"><h2 className="ag-h2">Before and after, on one clock</h2><span className="ag-muted" style={{ fontSize: 13 }}>{d.persona.name.split(" ")[0]}&apos;s day, 06:00–20:00</span></div>
        <div className="ag-card pad-lg"><Tracks d={d} /></div>
        <div style={{ marginTop: 14 }}><Compare d={d} /></div>
        <div className="ag-trustbar" aria-label="You stay in control">
          <span className="ag-trustbar-k"><ShieldCheck size={15} />You stay in control</span>
          {col.trust.slice(0, 3).map((t) => <span key={t} className="ag-trustbar-i"><CheckCheck size={14} />{t}</span>)}
        </div>
      </section>

      <section className="ag-section">
        <div className="ag-section-head">
          <h2 className="ag-h2">Walk through the day</h2>
          <span className="ag-spacer" />
          <div className="ag-seg" role="tablist" aria-label="Before or after">
            <button type="button" role="tab" aria-selected={mode === "before"} onClick={() => setMode("before")}>Without agents</button>
            <button type="button" role="tab" aria-selected={mode === "after"} onClick={() => setMode("after")}><Sparkles size={13} />With agents</button>
          </div>
        </div>
        {mode === "before" ? <div className="ag-card pad-lg"><BeforeDay d={d} onSwitch={() => setMode("after")} /></div> : <AfterDay key={fn} d={d} fnName={col.name} />}
      </section>

      <section className="ag-section ag-cta-band">
        <div>
          <h2 className="ag-h2">Run {d.persona.name.split(" ")[0]}&apos;s day on your team&apos;s real Workspace</h2>
          <p>A half-day Agentify your Day session with your partner sets up these {col.name} agents on your own inboxes, docs and sheets — on the plan you already have.</p>
        </div>
        <div className="ag-row">
          <button type="button" className="ag-btn lg primary" onClick={() => navigate({ page: "workshop" })}><CalendarCheck size={15} />Book Agentify your Day</button>
          <button type="button" className="ag-btn lg" onClick={() => navigate({ page: "collection", id: fn })}>See the {col.name} collection <ArrowRight size={14} /></button>
        </div>
      </section>

      <p className="ag-muted" style={{ fontSize: 12, marginTop: 14 }}><Timer size={11} /> A modeled day with synthetic people and data. Times saved are estimates from the use-case packages; entitlement figures are per user and come out of the agent entitlement included in your Workspace plan.</p>
    </div>
  );
}
