"use client";

import { ArrowRight, ChevronLeft, ChevronRight, Clock, Maximize2, MessageSquare, Play, StickyNote, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AGENDA, DISCUSSION, NEXT_STEPS, SESSION, SLIDES } from "@/lib/clicks-to-delegation/breakout";
import type { Slide, SlideBody } from "@/lib/clicks-to-delegation/breakout-types";
import { Cite, CitationLayer, Ev } from "../ui";

type Tab = "narrative" | "present" | "discussion";

export default function Breakout() {
  const [tab, setTab] = useState<Tab>("narrative");
  const [presenting, setPresenting] = useState<number | null>(null);
  const total = SLIDES.reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="ctd-bo">
      <header className="ctd-top">
        <a href="/clicks-to-delegation" className="ctd-masthead"><b>From Clicks to Delegation</b><span>Breakout companion</span></a>
        <span className="ctd-spacer" />
        <button type="button" className="ctd-btn dark" onClick={() => setPresenting(0)}><Play size={14} />Present</button>
      </header>

      <main className="ctd-bo-main">
        <section className="ctd-bo-hero">
          <div className="ctd-kicker">{SESSION.kicker}</div>
          <h1>{SESSION.title}</h1>
          <p className="ctd-dek">{SESSION.dek}</p>
          <div className="ctd-byline"><span><b>Talk</b> {SESSION.talk}</span><span><b>Speaker</b> {SESSION.speaker}</span><span><b>Length</b> {total} min, {SLIDES.length} slides</span></div>
        </section>

        <section aria-label="Breakout agenda" className="ctd-bo-agenda">
          {AGENDA.map((a) => (
            <div key={a.title} className={`ctd-bo-ag ${a.mine ? "mine" : ""}`} style={{ flexGrow: a.minutes }}>
              <span className="ctd-mono">{a.minutes} min</span>
              <b>{a.title}</b>
              <span className="ctd-bo-ag-who">{a.speaker}{a.role ? `, ${a.role}` : ""}</span>
              <p>{a.link}</p>
            </div>
          ))}
        </section>

        <div className="ctd-seg ctd-bo-tabs" role="tablist" aria-label="View">
          {([["narrative", "Talk track"], ["present", "Slides"], ["discussion", "Discussion & next steps"]] as [Tab, string][]).map(([id, l]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{l}</button>
          ))}
        </div>

        {tab === "narrative" && (
          <ol className="ctd-bo-track">
            {SLIDES.map((s, i) => (
              <li key={s.id} className="ctd-bo-beat">
                <div className="ctd-bo-beat-time"><span className="ctd-mono">{s.minute}</span><small>{s.minutes} min</small></div>
                <div className="ctd-bo-beat-body">
                  <div className="ctd-bo-beat-head">
                    <span className="ctd-h4">{String(i + 1).padStart(2, "0")} · {s.title}</span>
                    <button type="button" className="ctd-link-btn" onClick={() => setPresenting(i)}><Maximize2 size={13} />Present from here</button>
                  </div>
                  <p className="ctd-bo-headline">{s.headline}<Cite ids={s.sourceIds} /></p>
                  <SlideContent body={s.body} variant="doc" />
                  <div className="ctd-bo-notes"><span className="ctd-h4"><StickyNote size={12} /> Say</span>{s.notes.map((n, k) => <p key={k}>{n}</p>)}</div>
                </div>
              </li>
            ))}
          </ol>
        )}

        {tab === "present" && (
          <div className="ctd-bo-thumbs">
            {SLIDES.map((s, i) => (
              <button key={s.id} type="button" className="ctd-bo-thumb" onClick={() => setPresenting(i)} aria-label={`Present slide ${i + 1}: ${s.title}`}>
                <Scaled className="ctd-bo-thumb-inner"><SlideFrame slide={s} index={i} /></Scaled>
                <span><span className="ctd-mono">{i + 1}</span> · {s.title}</span>
              </button>
            ))}
          </div>
        )}

        {tab === "discussion" && (
          <div className="ctd-bo-disc">
            <div className="ctd-card">
              <div className="ctd-h4"><MessageSquare size={13} /> Questions to put to the room (10 min)</div>
              <ol className="ctd-bo-qs">{DISCUSSION.map((q) => <li key={q.q}><b>{q.q}</b><span>{q.why}</span></li>)}</ol>
            </div>
            <div className="ctd-card">
              <div className="ctd-h4">Proposed next steps</div>
              <ol className="ctd-bo-qs">{NEXT_STEPS.map((n) => <li key={n.step}><b>{n.step}</b><span>{n.owner} · {n.when}</span></li>)}</ol>
            </div>
          </div>
        )}

        <p className="ctd-small ctd-muted" style={{ margin: "32px 0 48px" }}>
          Evidence is drawn from the <a href="/clicks-to-delegation">From Clicks to Delegation</a> research report (as of 10 November 2026) and a Sea Limited fact base compiled 13 November 2026. Numbered markers open the source. <Ev kind="company-claim" /> figures are as reported by the company.
        </p>
      </main>

      {presenting !== null && <Presenter start={presenting} onClose={() => setPresenting(null)} />}
      <CitationLayer />
    </div>
  );
}

/* ── Present mode ─────────────────────────────────────────── */
function Presenter({ start, onClose }: { start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const [notes, setNotes] = useState(false);
  const [t0] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const ref = useRef<HTMLDivElement>(null);
  const n = SLIDES.length;
  const go = useCallback((d: number) => setI((x) => Math.max(0, Math.min(n - 1, x + d))), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      if (["ArrowLeft", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "n") setNotes((v) => !v);
      if (e.key.toLowerCase() === "f") ref.current?.requestFullscreen?.().catch(() => {});
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(n - 1);
    };
    window.addEventListener("keydown", onKey);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); clearInterval(tick); document.body.style.overflow = ""; };
  }, [go, n, onClose]);

  const s = SLIDES[i];
  const elapsed = Math.floor((now - t0) / 1000);
  const planned = SLIDES.slice(0, i).reduce((a, x) => a + x.minutes, 0) * 60;
  const mmss = (v: number) => `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
  const drift = elapsed - planned;

  return (
    <div ref={ref} className="ctd-bo-present ctd-root" role="dialog" aria-label="Presentation">
      <div className="ctd-bo-stage">
        <Scaled className="ctd-bo-slide-wrap"><SlideFrame slide={s} index={i} /></Scaled>
        {notes && <aside className="ctd-bo-pnotes"><b>Speaker notes · {s.minute} ({s.minutes} min)</b>{s.notes.map((x, k) => <p key={k}>{x}</p>)}</aside>}
      </div>
      <div className="ctd-bo-bar">
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide" disabled={i === 0}><ChevronLeft size={18} /></button>
        <span className="ctd-mono">{i + 1} / {n}</span>
        <button type="button" onClick={() => go(1)} aria-label="Next slide" disabled={i === n - 1}><ChevronRight size={18} /></button>
        <span className="ctd-bo-prog"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></span>
        <span className={`ctd-mono ctd-bo-timer ${drift > 60 ? "late" : ""}`}><Clock size={13} />{mmss(elapsed)} <small>plan {mmss(planned)}</small></span>
        <button type="button" onClick={() => setNotes((v) => !v)} aria-pressed={notes}><StickyNote size={15} />Notes</button>
        <button type="button" onClick={() => ref.current?.requestFullscreen?.().catch(() => {})}><Maximize2 size={15} />Full screen</button>
        <button type="button" onClick={onClose} aria-label="Exit presentation"><X size={18} /></button>
        <span className="ctd-bo-keys">← → move · N notes · F full screen · Esc exit</span>
      </div>
    </div>
  );
}

/** Scales the fixed 1280×720 slide canvas to fit its container. */
function Scaled({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => { const { width, height } = e.contentRect; setScale(Math.min(width / 1280, height / 720)); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ ["--s" as string]: scale }}>{children}</div>;
}

/* ── Slide rendering (shared by thumbnails, present mode) ─── */
function SlideFrame({ slide, index }: { slide: Slide; index: number }) {
  const isTitle = slide.body.type === "title";
  return (
    <article className={`ctd-bo-slide ${isTitle ? "title" : ""}`}>
      {!isTitle && (
        <header className="ctd-bo-slide-head">
          <span className="ctd-mono">{String(index + 1).padStart(2, "0")} · {slide.title}</span>
          <h2>{slide.headline}</h2>
        </header>
      )}
      <div className="ctd-bo-slide-body"><SlideContent body={slide.body} variant="slide" /></div>
      <footer className="ctd-bo-slide-foot"><span>Cloud for Agentic Commerce &amp; Digital Banking</span><span>Breakout 1 · Agentic Commerce</span></footer>
    </article>
  );
}

function SlideContent({ body, variant }: { body: SlideBody; variant: "doc" | "slide" }) {
  const doc = variant === "doc";
  switch (body.type) {
    case "title":
      return (
        <div className="ctd-bo-titleslide">
          <span className="ctd-kicker">{body.kicker}</span>
          <h1>{body.title}</h1>
          <p>{body.subtitle}</p>
        </div>
      );
    case "stats":
      return (
        <div>
          <div className="ctd-bo-stats">
            {body.stats.map((s) => (
              <div key={s.label} className="ctd-bo-stat"><b>{s.value}</b><span>{s.label}{doc && <Cite ids={s.sourceIds} />}</span>{doc ? <Ev kind={s.kind} /> : <small className="ctd-bo-ev">{s.kind === "company-claim" ? "Company-reported" : s.kind === "survey" ? "Survey" : s.kind === "analyst-estimate" ? "Analyst estimate" : ""}</small>}</div>
            ))}
          </div>
          {body.caption && <p className="ctd-bo-caption">{body.caption}</p>}
        </div>
      );
    case "bundle":
      return (
        <div className="ctd-bo-bundle">
          {body.items.map((b) => (
            <div key={b.need} className="ctd-bo-bun"><span className="ctd-h4">{b.need}</span><b>{b.sea}</b><p>{b.detail}{doc && <Cite ids={b.sourceIds} />}</p></div>
          ))}
        </div>
      );
    case "planes":
      return (
        <div className="ctd-bo-planes">
          {body.planes.map((p, k) => (
            <div key={p.name} className={`ctd-bo-plane p${k}`}>
              <div className="ctd-bo-plane-name"><b>{p.name}</b><span>{p.job}</span></div>
              <ul>{p.items.map((x) => <li key={x}>{x}</li>)}</ul>
              {p.handoff && <span className="ctd-bo-hand"><ArrowRight size={12} />{p.handoff}</span>}
            </div>
          ))}
        </div>
      );
    case "cases":
      return (
        <div className="ctd-bo-cases">
          {body.cases.map((c) => (
            <div key={c.name} className="ctd-bo-case">
              <span className="ctd-bo-rung">{c.rung}</span>
              <b>{c.name}</b>
              <p>{c.what}</p>
              <dl><div><dt>Cloud&apos;s job</dt><dd>{c.cloud}</dd></div><div><dt>Measure</dt><dd>{c.kpi}</dd></div></dl>
            </div>
          ))}
        </div>
      );
    case "points":
      return (
        <ul className="ctd-bo-points">
          {body.points.map((p) => <li key={p.head}><b>{p.head}</b><span>{p.text}{doc && <Cite ids={p.sourceIds} />}</span></li>)}
        </ul>
      );
    case "pilots":
      return (
        <div className="ctd-bo-pilots">
          {body.pilots.map((p, k) => (
            <div key={p.name} className="ctd-bo-pilot"><span className="ctd-mono">{k + 1}</span><b>{p.name}</b><p>{p.scope}</p><dl><div><dt>Success metric</dt><dd>{p.kpi}</dd></div><div><dt>Go / no-go gate</dt><dd>{p.gate}</dd></div></dl></div>
          ))}
        </div>
      );
    case "handoff":
      return (
        <div className="ctd-bo-handoff">
          {body.next.map((h) => <div key={h.who}><span className="ctd-h4">Next · {h.who}</span><b>{h.topic}</b><p>{h.bridge}</p></div>)}
        </div>
      );
  }
}
