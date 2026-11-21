"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { daysBetween, fmtDate } from "@/lib/google-ai/dates";
import type { Answer } from "@/lib/google-ai/engine/answer";
import { search, type Hit } from "@/lib/google-ai/engine/search";
import type { Digest } from "@/lib/google-ai/ingest/digest";
import type { PipelineState } from "@/lib/google-ai/ingest/types";
import { ANNOUNCEMENT_BY_ID, ENTITY_BY_ID, META } from "@/lib/google-ai/kb";
import { SECTIONS, SECTION_BY_SLUG } from "@/lib/google-ai/sections";
import { LANGUAGES, REGIONS, REGION_BY_ID, type LangId } from "@/lib/google-ai/taxonomy";
import type { RegionId } from "@/lib/google-ai/types";
import LanguageMirror from "./LanguageMirror";
import { Cites, Ev, HubContext, type DisplayMode } from "./ui";
import Cases from "./views/Cases";
import Compare from "./views/Compare";
import Dossier from "./views/Dossier";
import Enterprise from "./views/Enterprise";
import Graph from "./views/Graph";
import Industries from "./views/Industries";
import Latest, { AnnouncementDetail } from "./views/Latest";
import Models from "./views/Models";
import Overview from "./views/Overview";
import Pricing from "./views/Pricing";
import Quiz from "./views/Quiz";
import Research from "./views/Research";
import Stack from "./views/Stack";
import Timeline from "./views/Timeline";
import Today from "./views/Today";

export interface StatusPayload {
  pipeline: (Omit<PipelineState, "items" | "alerts" | "digest"> & { durable: boolean; configured: boolean; sources: { key: string; name: string; publisher: string; url: string; category: string; format: string }[] }) | null;
  items: PipelineState["items"];
  alerts: PipelineState["alerts"];
  digest?: Digest;
  error?: string;
}

const MODES: { id: DisplayMode; label: string }[] = [
  { id: "executive", label: "Executive" },
  { id: "analyst", label: "Analyst" },
  { id: "technical", label: "Technical" },
];

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode */
  }
}

export default function Hub({ slug, today }: { slug: string[]; today: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mode, setModeState] = useState<DisplayMode>("analyst");
  const [region, setRegionState] = useState<RegionId | "all">("all");
  const [lang, setLangState] = useState<LangId>("en");
  const [trStatus, setTrStatus] = useState<"idle" | "working" | "unavailable">("idle");
  const [status, setStatus] = useState<StatusPayload | null | "error">(null);
  const [askOpen, setAskOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const t = read("gai-theme");
      setTheme(t === "dark" || t === "light" ? t : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const m = read("gai-mode");
      if (m === "executive" || m === "analyst" || m === "technical") setModeState(m);
      const r = read("gai-region");
      if (r && (r === "all" || REGION_BY_ID[r])) setRegionState(r as RegionId | "all");
      const l = read("gai-lang");
      if (l && LANGUAGES.some((x) => x.id === l)) setLangState(l as LangId);
    });
    fetch("/api/google-ai/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: StatusPayload) => setStatus(j))
      .catch(() => setStatus("error"));
  }, []);

  const setMode = useCallback((m: DisplayMode) => {
    setModeState(m);
    write("gai-mode", m);
  }, []);
  const setRegion = useCallback((r: RegionId | "all") => {
    setRegionState(r);
    write("gai-region", r);
  }, []);
  const setLang = useCallback((l: LangId) => {
    setLangState(l);
    write("gai-lang", l);
  }, []);
  const ask = useCallback((q: string) => {
    setQuestion(q);
    setAskOpen(true);
  }, []);
  const ctx = useMemo(() => ({ today, mode, setMode, ask, region, setRegion, lang }), [today, mode, setMode, ask, region, setRegion, lang]);

  const first = slug[0] ?? "";
  const section = first === "entity" ? SECTION_BY_SLUG.stack : SECTION_BY_SLUG[first];
  const payload = status && status !== "error" ? status : null;
  const leaf = first === "entity" && slug[1] ? ENTITY_BY_ID[slug[1]]?.name : first === "latest" && slug[1] ? ANNOUNCEMENT_BY_ID[slug[1]]?.title : undefined;
  // Languages of the chosen region first, then the rest.
  const langs = useMemo(() => {
    const pref = region === "all" ? [] : REGION_BY_ID[region].languages;
    return [...LANGUAGES.filter((l) => pref.includes(l.id)), ...LANGUAGES.filter((l) => !pref.includes(l.id))];
  }, [region]);

  return (
    <HubContext.Provider value={ctx}>
      <div className="gai-root" ref={rootRef} data-theme={theme} data-mode={mode} data-wide={section?.wide || first === "entity" ? 1 : 0} data-menu={menu ? 1 : 0}>
        <LanguageMirror lang={lang} root={rootRef} onStatus={setTrStatus} />
        <div className="gai-scrim" onClick={() => setMenu(false)} aria-hidden />
        <aside className="gai-side" aria-label="Navigation">
          <Link href="/google-ai" className="gai-brand" aria-label="Google AI Intelligence Hub — today" translate="no" onClick={() => setMenu(false)}>
            <span className="gai-mark" aria-hidden><i /><i /><i /><i /></span>
            <span>
              <b>Google AI Hub</b>
              <small>Independent · not affiliated with Google</small>
            </span>
          </Link>
          <SearchBox onAsk={ask} onGo={() => setMenu(false)} />
          <nav aria-label="Pages">
            {SECTIONS.filter((s) => s.group === "daily").map((s) => (
              <Link key={s.slug} className="item" href={s.slug ? `/google-ai/${s.slug}` : "/google-ai"} aria-current={section?.slug === s.slug ? "page" : undefined} onClick={() => setMenu(false)} title={s.blurb}>
                <span className="ico" aria-hidden>{s.icon}</span>{s.label}
              </Link>
            ))}
            <div className="gai-side-label">Reference</div>
            {SECTIONS.filter((s) => s.group === "reference").map((s) => (
              <Link key={s.slug} className="item" href={`/google-ai/${s.slug}`} aria-current={section?.slug === s.slug ? "page" : undefined} onClick={() => setMenu(false)} title={s.blurb}>
                <span className="ico" aria-hidden>{s.icon}</span>{s.label}
              </Link>
            ))}
          </nav>
          <div className="gai-side-foot">
            <label>
              Region
              <select value={region} onChange={(e) => setRegion(e.target.value as RegionId | "all")}>
                <option value="all">All of Asia-Pacific</option>
                {REGIONS.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </label>
            <label>
              Language
              <select value={lang} onChange={(e) => setLang(e.target.value as LangId)} translate="no">
                {langs.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </label>
            <label>
              Detail
              <select value={mode} onChange={(e) => setMode(e.target.value as DisplayMode)}>
                {MODES.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </label>
          </div>
        </aside>

        <div className="gai-col">
          <div className="gai-bar">
            <button type="button" className="gai-icon-btn gai-menu-btn" aria-label="Open navigation" onClick={() => setMenu(true)}>
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
            <div className="gai-crumbs">
              <Link href="/google-ai" translate="no">Google AI Hub</Link>
              {section && section.slug !== "" && (<><span className="sep">/</span><Link href={`/google-ai/${section.slug}`}>{section.label}</Link></>)}
              {leaf && (<><span className="sep">/</span><span translate="no">{leaf.length > 48 ? leaf.slice(0, 47) + "…" : leaf}</span></>)}
            </div>
            <div className="gai-bar-right">
              <button type="button" className="gai-btn" onClick={() => setAskOpen(true)}>Ask</button>
              <button
                type="button"
                className="gai-icon-btn"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={() => {
                  const next = theme === "dark" ? "light" : "dark";
                  setTheme(next);
                  write("gai-theme", next);
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                  {theme === "dark" ? <circle cx="8" cy="8" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /> : <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3 5.5 5.5 0 1 0 13 9.5z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />}
                  {theme === "dark" && <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3 3l1.1 1.1M11.9 11.9 13 13M3 13l1.1-1.1M11.9 4.1 13 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>

          <main className="gai-main">
            {lang !== "en" && (
              <p className="gai-small gai-muted" style={{ marginBottom: 10 }}>
                {trStatus === "unavailable" ? "Translation is unavailable right now, so parts of this page are in English." : "Machine translation. The English text is authoritative."}
              </p>
            )}
            {first === "" && <Today status={payload} />}
            {first === "industries" && <Industries />}
            {first === "cases" && <Cases />}
            {first === "quiz" && <Quiz />}
            {first === "graph" && <Graph />}
            {first === "briefing" && <Overview status={payload} />}
            {first === "latest" && (slug[1] ? <AnnouncementDetail id={slug[1]} /> : <Latest status={payload} />)}
            {first === "stack" && <Stack />}
            {first === "entity" && slug[1] && <Dossier id={slug[1]} />}
            {first === "models" && <Models />}
            {first === "compare" && <Compare />}
            {first === "pricing" && <Pricing />}
            {first === "enterprise" && <Enterprise />}
            {first === "timeline" && <Timeline />}
            {first === "research" && <Research status={payload} statusFailed={status === "error"} />}
            <Freshness today={today} status={status} />
          </main>

          <footer className="gai-foot">
            <span>Independent analysis. Not affiliated with, endorsed by or sponsored by Google. Product names are trademarks of their owners and are used only to identify the products discussed.</span>
            <span>
              Every statement carries a label — verified fact, provider claim, independent measurement or analyst interpretation — and its sources. <Link className="gai-link" href="/google-ai/research#method">How this site works</Link>
            </span>
          </footer>
        </div>

        {askOpen && <AskPanel initial={question} onClose={() => setAskOpen(false)} />}
      </div>
    </HubContext.Provider>
  );
}

/** The freshness strip never infers freshness: it reports the curated date and what the pipeline last did. */
function Freshness({ today, status }: { today: string; status: StatusPayload | null | "error" }) {
  const age = daysBetween(META.curatedAt, today);
  const p = status && status !== "error" ? status.pipeline : null;
  const last = p?.lastSuccessAt ?? null;
  const lastRun = p?.lastRun ?? null;
  let live: { cls: string; text: string };
  if (status === null) live = { cls: "", text: "Checking the monitoring pipeline…" };
  else if (status === "error" || !p) live = { cls: "bad", text: "Monitoring status unavailable — the status service did not respond." };
  else if (!lastRun) live = { cls: "warn", text: p.durable ? "Source monitoring has not run yet in this deployment." : "Source monitoring has no recorded run (no durable store is configured, so run history is not kept)." };
  else if (!lastRun.ok) live = { cls: "bad", text: `Last monitoring run failed (${fmtDate(lastRun.finishedAt.slice(0, 10))}). ${last ? `Last successful run: ${fmtTime(last)}.` : "No successful run on record."}` };
  else live = { cls: lastRun.failed ? "warn" : "ok", text: `Sources last checked ${fmtTime(last ?? lastRun.finishedAt)} — ${lastRun.fetched} of ${lastRun.feeds.length} reachable${lastRun.failed ? `, ${lastRun.failed} failed` : ""}.` };
  return (
    <div className="gai-fresh" role="status" style={{ marginTop: 40 }}>
      <span>
        <i className={`dot ${age <= 7 ? "ok" : age <= 30 ? "warn" : "bad"}`} />
        Knowledge base updated through <b>{fmtDate(META.curatedAt)}</b>
        {age > 0 ? ` (${age} ${age === 1 ? "day" : "days"} ago)` : " (today)"}
      </span>
      <span>
        <i className={`dot ${live.cls}`} />
        {live.text}
      </span>
      <Link href="/google-ai/research#pipeline">Pipeline status</Link>
    </div>
  );
}
function fmtTime(iso: string): string {
  return `${fmtDate(iso.slice(0, 10))} ${iso.slice(11, 16)} UTC`;
}

function SearchBox({ onAsk, onGo }: { onAsk: (q: string) => void; onGo?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const hits: Hit[] = useMemo(() => (q.trim().length >= 2 ? search(q, { limit: 8 }) : []), [q]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) {
        e.preventDefault();
        input.current?.focus();
      }
    };
    const click = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("mousedown", click);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("mousedown", click);
    };
  }, []);

  const go = (i: number) => {
    setOpen(false);
    onGo?.();
    if (i < hits.length) router.push(hits[i].href);
    else if (q.trim()) onAsk(q.trim());
    input.current?.blur();
  };

  return (
    <div className="gai-search" ref={box}>
      <svg className="ic" width="16" height="16" viewBox="0 0 16 16" aria-hidden><circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m10.5 10.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
      <input
        ref={input}
        type="search"
        value={q}
        placeholder="Search"
        aria-label="Search the knowledge base"
        role="combobox"
        aria-expanded={open && q.trim().length >= 2}
        aria-controls="gai-search-results"
        onChange={(e) => {
          setQ(e.target.value);
          setSel(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, hits.length)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); go(sel); }
          else if (e.key === "Escape") setOpen(false);
        }}
      />
      {open && q.trim().length >= 2 && (
        <div className="gai-search-pop" id="gai-search-results" role="listbox">
          {hits.map((h, i) => (
            <Link key={h.kind + h.id} href={h.href} role="option" aria-selected={sel === i} data-on={sel === i ? 1 : 0} onClick={() => { setOpen(false); onGo?.(); }} onMouseEnter={() => setSel(i)}>
              <span className="t">{h.title}</span>
              {h.via && <span className="v">{h.via}</span>}
              <span className="s">{h.subtitle}</span>
            </Link>
          ))}
          {!hits.length && <div className="gai-small gai-muted" style={{ padding: "8px 10px" }}>No product, model or development matches “{q}”.</div>}
          <button type="button" className="row" role="option" aria-selected={sel === hits.length} data-on={sel === hits.length ? 1 : 0} onClick={() => go(hits.length)} onMouseEnter={() => setSel(hits.length)}>
            <span className="t">Ask the analyst: “{q.trim()}”</span>
            <span className="s">answers from the knowledge base</span>
          </button>
        </div>
      )}
    </div>
  );
}

const SUGGESTED = [
  "What changed in Google AI this month?",
  "What was Vertex AI renamed to?",
  "How much does the newest Gemini model cost?",
  "Which Gemini models are being retired?",
  "What did Gemini pricing look like in March 2026?",
];

function AskPanel({ initial, onClose }: { initial: string | null; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<(Answer | { question: string; error: string })[]>([]);
  const [busy, setBusy] = useState(false);
  const asked = useRef<string | null>(null);

  const run = useCallback(async (question: string) => {
    if (!question.trim()) return;
    setBusy(true);
    try {
      const r = await fetch("/api/google-ai/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      const j = (await r.json()) as Answer & { error?: string };
      setLog((l) => [...l, r.ok && !j.error ? j : { question, error: j.error ?? `Request failed (${r.status})` }]);
    } catch {
      setLog((l) => [...l, { question, error: "The analyst service could not be reached." }]);
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (initial && asked.current !== initial) {
      asked.current = initial;
      queueMicrotask(() => run(initial));
    }
  }, [initial, run]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);

  return (
    <aside className="gai-ask" role="dialog" aria-label="Ask the analyst">
      <div className="gai-ask-head">
        <div>
          <h2 className="gai-h3">Ask the analyst</h2>
          <p className="gai-small gai-muted">Answers come only from this site&apos;s knowledge base, with sources. It will say when it doesn&apos;t know.</p>
        </div>
        <button type="button" className="gai-icon-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>
      <div className="gai-ask-body">
        {!log.length && !busy && (
          <div className="gai-stack">
            <p className="gai-small gai-muted">Try:</p>
            <div className="gai-chipset">
              {SUGGESTED.map((s) => <button key={s} type="button" className="gai-chip" onClick={() => run(s)}>{s}</button>)}
            </div>
          </div>
        )}
        {log.map((a, i) => (
          <div key={i} className="gai-stack">
            <p className="gai-q">{a.question}</p>
            {"error" in a ? (
              <div className="gai-warn">{a.error}</div>
            ) : (
              <>
                <p className="gai-small gai-muted">
                  {a.historical ? `Answer as of ${fmtDate(a.asOf)} — later information is excluded.` : `Answer as of today, ${fmtDate(a.asOf)}.`} {a.mode === "generated" ? "Wording by a language model, restricted to the facts below." : "Assembled directly from knowledge-base records."}
                </p>
                {a.summary && <p>{a.summary}</p>}
                {a.facts.length > 0 && (
                  <ol className="gai-claims">
                    {a.facts.map((f, k) => (
                      <li key={k}>
                        <span><span className="gai-mono gai-muted">[{k + 1}]</span> {f.text}</span>
                        <span className="gai-claim-meta"><Ev label={f.label} /><Cites ids={f.sourceIds} /></span>
                      </li>
                    ))}
                  </ol>
                )}
                {a.gaps.map((g) => <div key={g} className="gai-warn">{g}</div>)}
                {(a.entities.length > 0 || a.developments.length > 0) && (
                  <div className="gai-chipset">
                    {a.entities.map((e) => <Link key={e.id} className="gai-tag" href={`/google-ai/entity/${e.id}`} onClick={onClose}>{e.name}</Link>)}
                    {a.developments.slice(0, 4).map((d) => <Link key={d.id} className="gai-tag" href={`/google-ai/latest/${d.id}`} onClick={onClose}>{fmtDate(d.date)} · {d.title.slice(0, 48)}{d.title.length > 48 ? "…" : ""}</Link>)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {busy && <p className="gai-muted">Looking it up…</p>}
      </div>
      <form
        className="gai-ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          const v = q;
          setQ("");
          run(v);
        }}
      >
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about a product, price, date or change" aria-label="Your question" autoFocus />
        <button type="submit" className="gai-btn primary" disabled={busy}>Ask</button>
      </form>
    </aside>
  );
}
