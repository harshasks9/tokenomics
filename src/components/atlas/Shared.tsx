"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Download, ExternalLink, X } from "lucide-react";
import type { Assertion, Cohort, Evidence, ThesisStatus, Verdict } from "@/lib/atlas/types";
import { evidenceById, thinkerById } from "@/lib/atlas/data";
import { THESIS_STATUS_META, VERDICT_META, cohortById, layerById } from "@/lib/atlas/taxonomy";
import { exportCSV, exportJSON, exportSVG } from "@/lib/atlas/export";

/* ---------- global navigation / inspector context ---------- */

export type ViewId = "big-picture" | "timeline" | "minds" | "graph" | "courtroom" | "leaderboard" | "debates" | "future" | "synthesis" | "method";

export type Drawer =
  | { kind: "thinker"; id: string }
  | { kind: "claim"; id: string }
  | { kind: "evidence"; ids: string[]; title: string; context?: string }
  | null;

type Ctx = {
  go: (view: ViewId, params?: Record<string, string>) => void;
  open: (d: Drawer) => void;
};
export const AtlasCtx = createContext<Ctx>({ go: () => {}, open: () => {} });
export const useAtlas = () => useContext(AtlasCtx);

/* ---------- identity ---------- */

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

export function Avatar({ id, size }: { id: string; size?: "lg" }) {
  const t = thinkerById(id);
  if (!t) return null;
  return (
    <span className={`at-avatar ${t.cohort} ${size ?? ""}`} aria-hidden="true">
      <span>{initials(t.name)}</span>
    </span>
  );
}

export function CohortTag({ cohort }: { cohort: Cohort }) {
  const c = cohortById(cohort);
  const shape = c.shape === "circle" ? "●" : c.shape === "square" ? "■" : "◆";
  return (
    <span className="at-tag" style={{ color: c.color }}>
      <span aria-hidden="true">{shape}</span> {c.short}
    </span>
  );
}

export function PersonLink({ id, showAvatar = false }: { id: string; showAvatar?: boolean }) {
  const { open } = useAtlas();
  const t = thinkerById(id);
  if (!t) return <span>{id}</span>;
  return (
    <button className="at-link" style={{ display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none", color: "var(--ink)" }} onClick={() => open({ kind: "thinker", id })}>
      {showAvatar && <Avatar id={id} />}
      <span style={{ textDecoration: "underline", textDecorationColor: "var(--line-2)", textUnderlineOffset: 3 }}>{t.name}</span>
    </button>
  );
}

/* ---------- verdicts ---------- */

export function VerdictBadge({ v, solid }: { v: Verdict; solid?: boolean }) {
  const m = VERDICT_META[v];
  return (
    <span className={`at-badge ${solid ? "solid" : ""}`} style={solid ? { background: m.color } : { color: v === "unresolved" ? "var(--unresolved-text)" : m.color }}>
      <span aria-hidden="true">{m.glyph}</span> {m.label}
    </span>
  );
}

export function StatusBadge({ s }: { s: ThesisStatus }) {
  const m = THESIS_STATUS_META[s];
  return (
    <span className="at-badge" style={{ color: s === "unresolved" ? "var(--unresolved-text)" : m.color }}>
      <span aria-hidden="true">{m.glyph}</span> {m.label}
    </span>
  );
}

export function KindLabel({ k }: { k: "fact" | "interp" | "forecast" }) {
  return <span className={`at-label-${k}`}>{k === "fact" ? "Observed fact" : k === "interp" ? "Interpretation" : "Forecast"}</span>;
}

export function LayerTags({ layers }: { layers: string[] }) {
  return (
    <>
      {layers.map((l) => {
        const L = layerById(l as never);
        return L ? <span key={l} className="at-tag" title={L.name}>L{L.n} {L.short}</span> : null;
      })}
    </>
  );
}

const confDot = { high: "●●●", medium: "●●○", low: "●○○" } as const;
export function ConfidenceMeter({ c }: { c: "high" | "medium" | "low" }) {
  return <span className="at-tag" title={`Evidence & interpretation confidence: ${c}`}><span aria-hidden="true" style={{ letterSpacing: 1 }}>{confDot[c]}</span> {c}</span>;
}

/* ---------- evidence ---------- */

const verLabel = { fetched: "Source opened", snippet: "Search-verified", recalled: "Unverified recall" } as const;

export function EvidenceCard({ e }: { e: Evidence }) {
  const speaker = thinkerById(e.speaker)?.name ?? (e.speaker === "outcome" ? "Outcome source" : e.speaker);
  return (
    <div className="at-ev">
      <div className="at-between">
        <div className="at-row at-xs at-muted">
          <span className="at-mono">{e.date}</span>
          <span>·</span>
          <span>{e.publisher}</span>
          <span className="at-tag">{e.type}</span>
          {e.primary ? <span className="at-tag" style={{ color: "var(--agree)" }}>primary</span> : <span className="at-tag">secondary</span>}
        </div>
        <span className="at-tag" style={{ color: e.verification === "recalled" ? "var(--unresolved-text)" : "var(--ink-2)" }}
          title={e.verification === "recalled" ? "Attributed from background knowledge; not re-confirmed against the source during research." : undefined}>
          {verLabel[e.verification]}
        </span>
      </div>
      <div className="at-small" style={{ fontWeight: 600, marginTop: 4 }}>{e.title}</div>
      <blockquote className={e.verbatim ? "" : "para"}>
        {e.verbatim ? <>“{e.passage}”</> : <>{e.passage}</>}
        <span className="at-sr">{e.verbatim ? " (verbatim quote)" : " (paraphrase)"}</span>
      </blockquote>
      <div className="at-between at-xs at-faint">
        <span>{speaker}{e.verbatim ? "" : " · paraphrase"}</span>
        {e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer" className="at-row" style={{ gap: 4 }}>
            Open source <ExternalLink size={12} aria-hidden="true" />
          </a>
        ) : <span style={{ color: "var(--unresolved-text)" }}>citation URL not confirmed</span>}
      </div>
      {e.note && <div className="at-xs at-muted" style={{ marginTop: 4 }}>Context: {e.note}</div>}
    </div>
  );
}

export function EvidenceList({ ids, empty = "No source recorded." }: { ids: string[]; empty?: string }) {
  const list = ids.map((id) => evidenceById(id)).filter(Boolean) as Evidence[];
  if (!list.length) return <div className="at-xs at-faint">{empty}</div>;
  return <div className="at-stack">{list.map((e) => <EvidenceCard key={e.id} e={e} />)}</div>;
}

export function SourcesButton({ ids, title, context, label }: { ids: string[]; title: string; context?: string; label?: string }) {
  const { open } = useAtlas();
  if (!ids.length) return <span className="at-xs at-faint">no source</span>;
  return (
    <button className="at-btn sm" onClick={() => open({ kind: "evidence", ids, title, context })}>
      {label ?? `${ids.length} source${ids.length > 1 ? "s" : ""}`}
    </button>
  );
}

/* ---------- claim summary row ---------- */

export function ClaimLine({ a, showPerson = true }: { a: Assertion; showPerson?: boolean }) {
  const { open } = useAtlas();
  return (
    <button onClick={() => open({ kind: "claim", id: a.id })} style={{ all: "unset", cursor: "pointer", display: "block", width: "100%" }} aria-label={`Open claim: ${a.claim}`}>
      <div className="at-row at-xs at-muted" style={{ marginBottom: 2 }}>
        <span className="at-mono">{a.date}</span>
        {showPerson && <span style={{ fontWeight: 600, color: "var(--ink)" }}>{thinkerById(a.thinkerId)?.name}</span>}
        <span className="at-tag">{a.kind}</span>
        <VerdictBadge v={a.verdict} />
      </div>
      <div className="at-small" style={{ lineHeight: 1.45 }}>{a.claimIsQuote ? `“${a.claim}”` : a.claim}</div>
    </button>
  );
}

/* ---------- drawer ---------- */

export function DrawerShell({ title, sub, onClose, children }: { title: ReactNode; sub?: ReactNode; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); prev?.focus?.(); };
  }, [onClose]);
  return (
    <>
      <div className="at-scrim" onClick={onClose} />
      <div className="at-drawer" role="dialog" aria-modal="true" tabIndex={-1} ref={ref}>
        <header>
          <div style={{ minWidth: 0 }}>
            {sub && <div className="at-eyebrow" style={{ marginBottom: 4 }}>{sub}</div>}
            <div className="at-h3" style={{ fontSize: 18 }}>{title}</div>
          </div>
          <button className="at-btn ghost" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </header>
        <div className="body">{children}</div>
      </div>
    </>
  );
}

/* ---------- export menu ---------- */

export function ExportMenu({ name, rows, columns, json, svg }: {
  name: string;
  rows?: () => Record<string, unknown>[];
  columns?: string[];
  json?: () => unknown;
  svg?: () => SVGSVGElement | null;
}) {
  const [openM, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button className="at-btn sm" onClick={() => setOpen((o) => !o)} aria-expanded={openM} aria-haspopup="menu">
        <Download size={13} aria-hidden="true" /> Export
      </button>
      {openM && (
        <div role="menu" className="at-card" style={{ position: "absolute", right: 0, top: 32, zIndex: 30, padding: 6, display: "flex", flexDirection: "column", minWidth: 150 }}
          onMouseLeave={() => setOpen(false)}>
          {rows && <button role="menuitem" className="at-btn ghost sm" onClick={() => { exportCSV(name, rows(), columns); setOpen(false); }}>Table (CSV)</button>}
          {(json || rows) && <button role="menuitem" className="at-btn ghost sm" onClick={() => { exportJSON(name, json ? json() : rows!()); setOpen(false); }}>Data (JSON)</button>}
          {svg && <button role="menuitem" className="at-btn ghost sm" onClick={() => { exportSVG(name, svg()); setOpen(false); }}>Chart (SVG)</button>}
        </div>
      )}
    </div>
  );
}

export function SectionHead({ eyebrow, title, children, right }: { eyebrow: string; title: ReactNode; children?: ReactNode; right?: ReactNode }) {
  return (
    <div className="at-head">
      <div>
        <p className="at-eyebrow">{eyebrow}</p>
        <h2 className="at-h2">{title}</h2>
        {children && <p>{children}</p>}
      </div>
      {right}
    </div>
  );
}

/** Toggle helper with "focus" semantics: clicking one item when all are on isolates it. */
export function focusToggle<T>(set: Set<T>, item: T, all: T[]): Set<T> {
  if (set.size === all.length) return new Set([item]);
  const next = new Set(set);
  if (next.has(item)) { next.delete(item); return next.size === 0 ? new Set(all) : next; }
  next.add(item);
  return next;
}

/* ---------- inline citations ---------- */

const CITE_RE = /\s*\(?((?:ev-[a-z0-9-]+)(?:\s*,\s*ev-[a-z0-9-]+)*)\)?/g;

/** Renders research prose, turning embedded evidence ids like "(ev-ctx-2, ev-ctx-1)" into clickable source markers. */
export function Rich({ text }: { text: string }) {
  const { open } = useAtlas();
  const parts: ReactNode[] = [];
  let last = 0;
  let k = 0;
  for (const m of text.matchAll(CITE_RE)) {
    const ids = m[1].split(/\s*,\s*/).filter((id) => evidenceById(id));
    parts.push(text.slice(last, m.index));
    if (ids.length) {
      parts.push(
        <button key={k++} className="at-link" style={{ fontSize: "0.8em", verticalAlign: "super", textDecoration: "none", marginLeft: 1 }}
          onClick={() => open({ kind: "evidence", ids, title: "Sources", context: text.slice(Math.max(0, (m.index ?? 0) - 160), m.index).trim() + "…" })}
          aria-label={`${ids.length} source${ids.length > 1 ? "s" : ""}`}>[{ids.length > 1 ? `${ids.length} src` : "src"}]</button>,
      );
    }
    last = (m.index ?? 0) + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
