"use client";

import {
  ArrowRight, BadgeCheck, CalendarDays, Check, CheckCheck, ChevronDown, ClipboardList, Clock, Coffee, FileCode2, FileText, Gauge,
  HardDrive, ListChecks, Lock, Mail, MessageSquare, PenLine, Play, PlugZap, ShieldCheck, Sparkles, Table2, Users, UtensilsCrossed, Video,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "@/lib/live-by-lunch/tracks";

const DAY_URL = (fn: string) => `/agentify#/day/${fn}`;
const SURFACE_ICON: Record<string, typeof Mail> = { Gmail: Mail, Calendar: CalendarDays, Chat: MessageSquare, Docs: FileText, Sheets: Table2, Meet: Video, Drive: HardDrive };

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

/* ── Nav ─────────────────────────────────────────────────── */
function Nav() {
  return (
    <header className="lbl-nav">
      <a href="#top" className="lbl-brand" aria-label="Live by Lunch, Google Workspace">
        <span className="lbl-wordmark">Google Workspace</span>
        <span className="lbl-brand-div" aria-hidden />
        <span className="lbl-brand-name"><Sparkles size={15} />Live by Lunch</span>
      </a>
      <nav className="lbl-nav-links" aria-label="Sections">
        <a href="#morning">The morning</a>
        <a href="#tracks">Tracks</a>
        <a href="#leave">What you leave with</a>
        <a href="#faq">FAQ</a>
      </nav>
      <a href="#register" className="lbl-btn primary sm">Register your team</a>
    </header>
  );
}

/* ── Hero: the morning, playing out ──────────────────────── */
const STEPS = [
  { t: "09:00", label: "Pick", title: "Pick the task that eats your week" },
  { t: "09:45", label: "Describe", title: "Describe it in plain language" },
  { t: "10:30", label: "Connect", title: "Connect your files, set approvals" },
  { t: "12:30", label: "Live", title: "Approve the first send — it's live" },
];

function MorningDemo() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (reduced || paused) return;
    const id = setTimeout(() => setI((x) => (x + 1) % STEPS.length), i === STEPS.length - 1 ? 5200 : 3400);
    return () => clearTimeout(id);
  }, [i, reduced, paused]);

  return (
    <div className="lbl-demo" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="lbl-clock" role="tablist" aria-label="The morning, step by step">
        <div className="lbl-clock-track"><i style={{ width: `${(i / (STEPS.length - 1)) * 100}%` }} /></div>
        {STEPS.map((s, k) => (
          <button key={s.t} type="button" role="tab" aria-selected={k === i} className={k <= i ? "done" : ""} onClick={() => { setI(k); setPaused(true); }}>
            <span className="lbl-clock-dot">{k === STEPS.length - 1 ? <UtensilsCrossed size={12} /> : <Check size={12} />}</span>
            <b>{s.t}</b><span>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="lbl-window" aria-live="polite">
        <div className="lbl-window-bar">
          <span className="lbl-dots" aria-hidden><i /><i /><i /></span>
          <span className="lbl-window-title"><Sparkles size={13} />Gemini agent · Fernhill Foods FP&amp;A</span>
          {i === 3 && <span className="lbl-live-pill"><span className="lbl-pulse" />Live</span>}
        </div>
        <div className="lbl-window-body" key={i}>
          <div className="lbl-step-title"><span className="lbl-mono">{STEPS[i].t}</span>{STEPS[i].title}</div>
          {i === 0 && (
            <div className="lbl-pick">
              <p className="lbl-muted">Your three recurring tasks</p>
              {["Chase late forecast inputs", "Explain month-end variances", "Answer budget questions in Chat"].map((x, k) => (
                <div key={x} className={`lbl-pick-row ${k === 0 ? "on" : ""}`}><span className="lbl-check">{k === 0 && <Check size={12} />}</span>{x}{k === 0 && <em>going live today</em>}</div>
              ))}
            </div>
          )}
          {i === 1 && (
            <div className="lbl-prompt">
              <div className="lbl-bubble">Every Monday, find blank owner tabs in the Q1 forecast Sheet. Email each owner a short, friendly reminder that names the missing rows and links their tab. Copy me. <b>Never send without my OK.</b></div>
              <div className="lbl-plan">
                <div className="lbl-plan-head"><ListChecks size={14} />Agent plan</div>
                <ol><li>Read <b>Q1 Forecast</b> owner tabs</li><li>Draft one reminder per missing owner</li><li>Wait for your approval, then send</li></ol>
              </div>
            </div>
          )}
          {i === 2 && (
            <div className="lbl-connect">
              <div className="lbl-conn"><Table2 size={16} /><span><b>Sheets</b> · Q1 Forecast (read)</span><BadgeCheck size={16} className="ok" /></div>
              <div className="lbl-conn"><Mail size={16} /><span><b>Gmail</b> · drafts only</span><BadgeCheck size={16} className="ok" /></div>
              <div className="lbl-conn"><Lock size={16} /><span><b>Approval</b> · required before any send</span><BadgeCheck size={16} className="ok" /></div>
              <div className="lbl-conn dry"><Play size={16} /><span>Dry run on last week: <b>2 owners</b> missing rows</span><Check size={16} className="ok" /></div>
            </div>
          )}
          {i === 3 && (
            <div className="lbl-mail">
              <div className="lbl-mail-head"><b>Q1 forecast: freight tab still open</b><span className="lbl-tag ok"><CheckCheck size={12} />Sent after you approved</span></div>
              <div className="lbl-mail-meta">To sanjay.patel@ · Cc maya.okonkwo@</div>
              <p>Hi Sanjay — your Q1 freight tab is nearly there. Only the February and March volume rows are blank. If the diesel surcharge is staying, a note in column F would save us a call.</p>
              <div className="lbl-mail-foot"><Clock size={13} />Next run: Monday 08:00 · you&apos;ll get the drafts first</div>
            </div>
          )}
        </div>
      </div>
      <p className="lbl-demo-cap">A real morning, compressed. Hover to pause, or pick a time.</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="lbl-hero" id="top">
      <div className="lbl-hero-copy">
        <div className="lbl-eyebrow"><Coffee size={14} />A morning workshop with your Google Workspace partner</div>
        <h1>Live by <span className="lbl-grad">Lunch.</span></h1>
        <p className="lbl-lede">Bring three tasks that eat your team&apos;s week. By lunch, agents are running them in your own Gmail, Docs, Sheets and Chat, and nothing goes out until you approve it.</p>
        <ul className="lbl-chips">
          <li><Clock size={14} />09:00–12:30, one morning</li>
          <li><Users size={14} />Your team, your real files</li>
          <li><ShieldCheck size={14} />On the Workspace plan you already have</li>
        </ul>
        <div className="lbl-cta-row">
          <a href="#register" className="lbl-btn primary lg">Register your team <ArrowRight size={16} /></a>
          <a href={DAY_URL("fpa")} className="lbl-btn lg">See a day, before and after</a>
        </div>
        <div className="lbl-gbar" aria-hidden><i /><i /><i /><i /></div>
      </div>
      <MorningDemo />
    </section>
  );
}

function Strip() {
  const items = [
    { icon: PlugZap, b: "Runs on what you own", s: "The Gemini agent already included in your Workspace plan. Nothing to buy in the session." },
    { icon: Lock, b: "You approve every send", s: "Emails, edits and bookings wait as drafts until someone on your team says yes." },
    { icon: HardDrive, b: "Your data stays put", s: "Agents read only what the people in the room can already open in Workspace." },
  ];
  return (
    <section className="lbl-strip" aria-label="Why it's safe to start">
      {items.map((x) => <div key={x.b}><x.icon size={20} /><div><b>{x.b}</b><span>{x.s}</span></div></div>)}
    </section>
  );
}

/* ── The morning, hour by hour ────────────────────────────── */
const AGENDA = [
  { t: "09:00", icon: ClipboardList, title: "Pick your three", body: "Your partner helps you choose tasks that repeat every week, touch Workspace, and can go live in a morning. One goes live today; two get a plan.", out: "A ranked shortlist" },
  { t: "09:45", icon: PenLine, title: "Describe it like you'd brief a colleague", body: "Write what good looks like in plain language: who it's for, what to check, when to stop and ask. No code, no flowcharts.", out: "Your agent's instructions" },
  { t: "10:30", icon: PlugZap, title: "Connect your real files", body: "Point the agent at the Sheets, Docs, inboxes and Chat spaces it needs. Your Workspace admin joins for 30 minutes to switch on access and approvals.", out: "Scoped access, approvals on" },
  { t: "11:15", icon: Play, title: "Dry-run on last week's work", body: "Run it against real recent work. Compare its drafts with what you actually sent. Tighten the instructions until you'd sign it.", out: "A tested agent" },
  { t: "12:30", icon: UtensilsCrossed, title: "Approve the first send. Lunch.", body: "The first live run lands in your queue. You approve it, it goes out, and the agent is on a schedule from Monday.", out: "An agent live on your work" },
];

function Morning() {
  return (
    <section className="lbl-section" id="morning">
      <div className="lbl-head">
        <div className="lbl-kicker">The morning</div>
        <h2>Five steps. One agent live. Back for lunch.</h2>
        <p>Every session follows the same shape, so a partner can run it for a team of three or thirty.</p>
      </div>
      <ol className="lbl-agenda">
        {AGENDA.map((a, k) => (
          <li key={a.t} className={k === AGENDA.length - 1 ? "last" : ""}>
            <div className="lbl-agenda-time"><span className="lbl-mono">{a.t}</span></div>
            <div className="lbl-agenda-node"><a.icon size={18} /></div>
            <div className="lbl-agenda-card">
              <h3>{a.title}</h3>
              <p>{a.body}</p>
              <span className="lbl-out"><Check size={13} />{a.out}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ── Tracks ───────────────────────────────────────────────── */
function Tracks({ tracks, track, setTrack }: { tracks: Track[]; track: Track; setTrack: (id: Track["id"]) => void }) {
  return (
    <section className="lbl-section" id="tracks">
      <div className="lbl-head">
        <div className="lbl-kicker">Tracks</div>
        <h2>Start with the team that carries the most busywork.</h2>
        <p>Each track comes with a ready agent to take live in the morning, and three more for the weeks after.</p>
      </div>
      <div className="lbl-tabs" role="tablist" aria-label="Choose a track">
        {tracks.map((t) => (
          <button key={t.id} type="button" role="tab" aria-selected={t.id === track.id} data-fn={t.id} onClick={() => setTrack(t.id)}>
            <b>{t.name}</b><span>{t.roles[0]}</span>
          </button>
        ))}
      </div>
      <div className="lbl-track" data-fn={track.id} key={track.id}>
        <div className="lbl-track-main">
          <p className="lbl-track-tag">{track.tagline}</p>
          <div className="lbl-live-card">
            <div className="lbl-live-label"><UtensilsCrossed size={14} />Goes live by lunch</div>
            <h3>{track.live.title}</h3>
            <p>{track.live.summary}</p>
            <div className="lbl-surfaces">{track.live.surfaces.map((s) => { const I = SURFACE_ICON[s] ?? FileText; return <span key={s}><I size={13} />{s}</span>; })}</div>
          </div>
          <div className="lbl-next">
            <div className="lbl-next-label">Next 30 days</div>
            {track.next.map((a) => <div key={a.title} className="lbl-next-row"><b>{a.title}</b><span>{a.summary}</span></div>)}
          </div>
        </div>
        <aside className="lbl-track-side">
          <div className="lbl-day">
            <div className="lbl-day-who"><span className="lbl-av">{track.persona.initials}</span><div><b>{track.persona.name}</b><span>{track.persona.role} · {track.persona.company}</span></div></div>
            <div className="lbl-day-row"><span>Day ends today</span><s>{track.before.end}</s></div>
            <div className="lbl-day-row strong"><span>With agents</span><b>{track.after.end}</b></div>
            <div className="lbl-day-row"><span>Hours back</span><b>{track.after.back} h</b></div>
            <div className="lbl-day-row"><span>Approvals {track.persona.first} gives</span><b>{track.after.approvals}</b></div>
            <a href={DAY_URL(track.id)} className="lbl-btn block">See {track.persona.first}&apos;s day, before and after <ArrowRight size={14} /></a>
          </div>
          <div className="lbl-outcomes">{track.outcomes.map((o) => <div key={o.label}><b>{o.value}</b><span>{o.label}</span></div>)}</div>
          <p className="lbl-fine">Modeled day with a synthetic team.</p>
        </aside>
      </div>
    </section>
  );
}

/* ── What you leave with ──────────────────────────────────── */
function LeaveWith() {
  const items = [
    { icon: Sparkles, title: "An agent live on your real work", body: "Not a sandbox demo. It runs on your inboxes, Sheets and Docs from Monday, on a schedule you chose." },
    { icon: Lock, title: "Approval rules you wrote", body: "What it may draft, what needs a yes, and who gives it. Written down and enforced in Workspace." },
    { icon: FileCode2, title: "A skill file your team can copy", body: "The agent's instructions as a reusable SKILL.md, so the next person starts from your version, not a blank page." },
    { icon: Gauge, title: "A 30-day check-in on real usage", body: "Your partner reviews how your median user is using it, not the average, and helps take the next two tasks live." },
  ];
  return (
    <section className="lbl-section" id="leave">
      <div className="lbl-head">
        <div className="lbl-kicker">What you leave with</div>
        <h2>Not slides. Things that keep working after lunch.</h2>
      </div>
      <div className="lbl-grid4">
        {items.map((x) => <div key={x.title} className="lbl-card"><span className="lbl-card-icon"><x.icon size={20} /></span><h3>{x.title}</h3><p>{x.body}</p></div>)}
      </div>
    </section>
  );
}

/* ── Control, who, bring ──────────────────────────────────── */
function Control({ track }: { track: Track }) {
  return (
    <section className="lbl-section lbl-two">
      <div className="lbl-panel dark">
        <div className="lbl-kicker light">You stay in control</div>
        <h2>Agents draft. People decide.</h2>
        <ul className="lbl-ticks">
          <li><CheckCheck size={16} />Nothing is sent, booked, edited or shared without an approval from your team.</li>
          <li><CheckCheck size={16} />Agents act with the access the people in the room already have. No new data stores.</li>
          <li><CheckCheck size={16} />Every action is attributed and can be traced back to the source it used.</li>
          {track.trust.slice(0, 1).map((t) => <li key={t}><CheckCheck size={16} /><span><em>{track.name}:</em> {t}</span></li>)}
        </ul>
      </div>
      <div className="lbl-panel">
        <div className="lbl-kicker">Who comes, what to bring</div>
        <div className="lbl-bring">
          <div><Users size={18} /><div><b>2–6 people from one team</b><span>The people who actually do the recurring work, plus their manager.</span></div></div>
          <div><ClipboardList size={18} /><div><b>Three recurring tasks</b><span>Ones that repeat weekly and live in Gmail, Docs, Sheets or Chat.</span></div></div>
          <div><ShieldCheck size={18} /><div><b>Your Workspace admin, 30 minutes</b><span>At 10:30, to switch on agent access and approval settings.</span></div></div>
          <div><CalendarDays size={18} /><div><b>A morning with no other meetings</b><span>In the room or on Meet. Laptops open, real files ready.</span></div></div>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────── */
const FAQ = [
  { q: "Is this a sales pitch for something new?", a: "No. Live by Lunch runs on the Gemini agent already included in your Workspace plan. Nothing is sold in the session; your partner checks your edition beforehand so there are no surprises." },
  { q: "Will an agent send anything without us?", a: "No. Every agent you build in the morning drafts first. Emails, edits, bookings and shares wait in an approval queue until someone on your team approves them. You decide later whether anything should ever run without a review." },
  { q: "What can the agent see?", a: "Only what the people in the room can already open in Workspace, and only the files, inboxes and spaces you point it at during the 10:30 step." },
  { q: "What if our task can't go live in a morning?", a: "At 09:00 your partner helps you pick a task that can. Bigger ones leave with written instructions and a date to take them live, usually inside the 30-day check-in." },
  { q: "Who runs the session?", a: "A Google Workspace partner who has delivered it before, using the same five-step format every time. Google provides the agent packages, labs and the before/after walkthrough." },
  { q: "Do we need to be technical?", a: "No. You describe the work in plain language, the way you would brief a new colleague. If you can write a good email, you can write the instructions." },
];

function Faq() {
  return (
    <section className="lbl-section" id="faq">
      <div className="lbl-head"><div className="lbl-kicker">FAQ</div><h2>Questions teams ask before they book.</h2></div>
      <div className="lbl-faq">
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}<ChevronDown size={18} /></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ── Register ─────────────────────────────────────────────── */
function Register({ tracks, track, setTrack }: { tracks: Track[]; track: Track; setTrack: (id: Track["id"]) => void }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", size: "2–6", when: "This month", tasks: ["", "", ""] });
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLFormElement>(null);
  const filled = form.tasks.filter((t) => t.trim()).length;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim()) return setErr("Add your name and company.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setErr("Use a valid work email.");
    if (filled < 1) return setErr("Add at least one recurring task. Three is ideal.");
    setErr(null);
    setDone(true);
  };

  return (
    <section className="lbl-section lbl-register" id="register">
      <div className="lbl-register-copy">
        <div className="lbl-kicker light">Register your team</div>
        <h2>Pick a morning. Bring three tasks.</h2>
        <p>Your partner confirms the date, checks your Workspace edition and sends a 15-minute prep call invite.</p>
        <div className="lbl-summary">
          <div className="lbl-summary-head"><UtensilsCrossed size={16} />Your morning</div>
          <div><span>Track</span><b>{track.name}</b></div>
          <div><span>Goes live by lunch</span><b>{track.live.title}</b></div>
          <div><span>Tasks so far</span><b>{filled} of 3</b></div>
          <div><span>When</span><b>{form.when} · 09:00–12:30</b></div>
        </div>
      </div>
      <div className="lbl-form-wrap">
        {done ? (
          <div className="lbl-done" role="status">
            <span className="lbl-done-icon"><Check size={26} /></span>
            <h3>Request received, {form.name.split(" ")[0]}.</h3>
            <p>A {track.name} Live by Lunch morning for {form.company}, {form.when.toLowerCase()}. Your partner will confirm the date and send the prep call invite to {form.email}.</p>
            <ul>{form.tasks.filter((t) => t.trim()).map((t) => <li key={t}><Check size={14} />{t}</li>)}</ul>
            <p className="lbl-fine">Demo page: nothing was sent or stored.</p>
            <button type="button" className="lbl-btn" onClick={() => setDone(false)}>Edit request</button>
          </div>
        ) : (
          <form ref={ref} className="lbl-form" onSubmit={submit} noValidate>
            <div className="lbl-field-row">
              <label>Your name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label>
              <label>Work email<input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" /></label>
            </div>
            <div className="lbl-field-row">
              <label>Company<input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoComplete="organization" /></label>
              <label>Team<select value={track.id} onChange={(e) => setTrack(e.target.value as Track["id"])}>{tracks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
            </div>
            <div className="lbl-field-row">
              <label>People attending<select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })}><option>2–6</option><option>7–15</option><option>16–30</option></select></label>
              <label>When<select value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })}><option>This month</option><option>Next month</option><option>Later this quarter</option></select></label>
            </div>
            <fieldset>
              <legend>Three tasks that eat your week</legend>
              {form.tasks.map((t, k) => (
                <input key={k} aria-label={`Task ${k + 1}`} value={t} placeholder={track.taskIdeas[k]} onChange={(e) => { const tasks = [...form.tasks]; tasks[k] = e.target.value; setForm({ ...form, tasks }); }} />
              ))}
              <button type="button" className="lbl-link" onClick={() => setForm({ ...form, tasks: [...track.taskIdeas] })}>Use the {track.name} examples</button>
            </fieldset>
            {err && <p className="lbl-err" role="alert">{err}</p>}
            <button type="submit" className="lbl-btn primary lg block">Request a morning <ArrowRight size={16} /></button>
            <p className="lbl-fine">Demo page: nothing you type here is sent anywhere.</p>
          </form>
        )}
      </div>
    </section>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function LiveByLunch({ tracks }: { tracks: Track[] }) {
  const [trackId, setTrackId] = useState<Track["id"]>("fpa");
  const track = useMemo(() => tracks.find((t) => t.id === trackId) ?? tracks[0], [tracks, trackId]);
  return (
    <>
      <Nav />
      <main className="lbl-main">
        <Hero />
        <Strip />
        <Morning />
        <Tracks tracks={tracks} track={track} setTrack={setTrackId} />
        <LeaveWith />
        <Control track={track} />
        <Faq />
        <Register tracks={tracks} track={track} setTrack={setTrackId} />
      </main>
      <footer className="lbl-foot">
        <div className="lbl-gbar" aria-hidden><i /><i /><i /><i /></div>
        <p><b>Live by Lunch</b> · a Google Workspace partner workshop. <a href={DAY_URL("fpa")}>See one day, twice <ArrowRight size={12} /></a></p>
        <p className="lbl-fine">Synthetic people, companies and numbers. Session format and outcomes are illustrative.</p>
      </footer>
    </>
  );
}
