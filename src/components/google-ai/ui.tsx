"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import { ENTITY_BY_ID, SOURCE_BY_ID } from "@/lib/google-ai/kb";
import type { LangId } from "@/lib/google-ai/taxonomy";
import type { Claim, EntityStatus, EvidenceLabel, RegionId, SourceAccess } from "@/lib/google-ai/types";

export type DisplayMode = "executive" | "analyst" | "technical";

export interface HubCtx {
  /** Today's date (server clock), ISO. */
  today: string;
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;
  ask: (question: string) => void;
  /** Sub-region the reader works in; "all" shows everything. */
  region: RegionId | "all";
  setRegion: (r: RegionId | "all") => void;
  lang: LangId;
}
export const HubContext = createContext<HubCtx>({ today: "2026-11-15", mode: "analyst", setMode: () => {}, ask: () => {}, region: "all", setRegion: () => {}, lang: "en" });
export const useHub = () => useContext(HubContext);

export const EV_LABEL: Record<EvidenceLabel, string> = {
  "verified-fact": "Verified fact",
  "provider-claim": "Provider claim",
  "independent-measurement": "Independent measurement",
  "analyst-interpretation": "Analyst interpretation",
};
export const EV_HELP: Record<EvidenceLabel, string> = {
  "verified-fact": "Stated in a primary document about something only that party decides: a list price, a model id, a date.",
  "provider-claim": "The provider's own statement about quality, performance, scale or intent. Not independently confirmed.",
  "independent-measurement": "Measured or reported by a party other than the provider.",
  "analyst-interpretation": "This site's judgment. Reasoned from the cited facts, but an opinion.",
};
export const ACCESS_LABEL: Record<SourceAccess, string> = {
  primary: "Read directly",
  "search-excerpt": "Read via search extract",
  secondary: "Third-party report",
  "prior-knowledge": "Not re-read this cycle",
};

const EV_ICON: Record<EvidenceLabel, ReactNode> = {
  "verified-fact": <path d="M2.5 6.2 5 8.6l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  "provider-claim": <path d="M2 3h8v5H6L3.5 10V8H2z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />,
  "independent-measurement": <path d="M2 10V6m4 4V2m4 8V4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  "analyst-interpretation": <path d="M6 1.5 7.3 4.6l3.2.3-2.4 2.2.7 3.2L6 8.6 3.2 10.3l.7-3.2L1.5 4.9l3.2-.3z" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />,
};

export function Ev({ label, short }: { label: EvidenceLabel; short?: boolean }) {
  return (
    <span className={`gai-ev ${label}`} title={EV_HELP[label]}>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>{EV_ICON[label]}</svg>
      {short ? EV_LABEL[label].split(" ")[0] : EV_LABEL[label]}
    </span>
  );
}

/** Source list behind a small button. Unknown ids are shown as such, never hidden. */
export function Cites({ ids, align }: { ids: string[]; align?: "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);
  if (!ids?.length) return <span className="gai-tag" title="No source recorded">no source</span>;
  return (
    <span className="gai-cite" ref={ref}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {ids.length} {ids.length === 1 ? "source" : "sources"}
      </button>
      {open && (
        <span className={`gai-cite-pop${align === "right" ? " right" : ""}`} role="dialog" aria-label="Sources">
          <ul>
            {ids.map((id) => {
              const s = SOURCE_BY_ID[id];
              if (!s) return <li key={id}>Source <span className="gai-mono">{id}</span> is missing from the library.</li>;
              return (
                <li key={id}>
                  <a href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a>
                  <div className="gai-muted">
                    {s.publisher}{s.published ? ` · ${fmtDate(s.published)}` : ""}{s.firstParty ? " · first-party" : " · third-party"}
                  </div>
                  <div style={{ marginTop: 3 }}>
                    <span className={`gai-acc ${s.access}`}>{ACCESS_LABEL[s.access]}</span> <span className="gai-muted">checked {fmtDate(s.lastChecked)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </span>
      )}
    </span>
  );
}

export function Claims({ claims, empty }: { claims?: Claim[]; empty?: string }) {
  if (!claims?.length) return <p className="gai-muted gai-small">{empty ?? "Not documented yet. Nothing is shown rather than guessed."}</p>;
  return (
    <ul className="gai-claims">
      {claims.map((c, i) => (
        <li key={i}>
          <span>{c.text}</span>
          <span className="gai-claim-meta">
            <Ev label={c.label} />
            <Cites ids={c.sourceIds} />
            {c.asOf && <span className="gai-muted gai-small">as of {fmtDate(c.asOf)}</span>}
            {c.confidence && c.confidence !== "high" && <span className="gai-muted gai-small">{c.confidence} confidence</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

const STATUS_LABEL: Record<string, string> = { ga: "Generally available", preview: "Preview", experimental: "Experimental", announced: "Announced", research: "Research", deprecated: "Deprecated", retired: "Retired", "not-yet": "Not yet released", unknown: "Stage not recorded" };
export function Status({ status, short }: { status: EntityStatus | "not-yet" | "unknown"; short?: boolean }) {
  const label = short && status === "ga" ? "GA" : STATUS_LABEL[status] ?? status;
  return <span className={`gai-pill ${status}`}>{label}</span>;
}

export function Seg<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: readonly { id: T; label: string }[]; label: string }) {
  return (
    <div className="gai-seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="gai-empty">
      <b>{title}</b>
      {children}
    </div>
  );
}

export function Sec({ id, title, sub, right, children }: { id?: string; title: string; sub?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <section className="gai-sec" id={id}>
      <div className="gai-sec-head">
        <div>
          <h2 className="gai-h2">{title}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Imp({ n }: { n: number }) {
  return (
    <span className="gai-imp" title={`Editorial weight ${n} of 5 — an editorial judgment`} aria-label={`Editorial weight ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

/** Link to a canonical entity. Unknown ids render as plain text so nothing links to a dead page. */
export function EntityLink({ id, children }: { id: string; children?: ReactNode }) {
  const e = ENTITY_BY_ID[id];
  if (!e) return <span className="gai-tag" translate="no" title="Not yet in the knowledge base">{children ?? id}</span>;
  return <Link className="gai-tag" translate="no" href={`/google-ai/entity/${id}`}>{children ?? e.name}</Link>;
}

/** Page header: an icon, a title and one sentence. Every page starts the same way. */
export function PageHead({ icon, title, lede, children }: { icon: string; title: string; lede?: ReactNode; children?: ReactNode }) {
  return (
    <header className="gai-hero">
      <div className="gai-page-ico" aria-hidden>{icon}</div>
      <h1 className="gai-h1">{title}</h1>
      {lede && <p className="gai-lede">{lede}</p>}
      {children}
    </header>
  );
}

export function Callout({ icon, children, tone }: { icon: string; children: ReactNode; tone?: "talk" }) {
  return (
    <div className={`gai-callout${tone ? ` ${tone}` : ""}`}>
      <span className="ico" aria-hidden>{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function usd(n: number | undefined | null, digits?: number): string {
  if (n == null || !Number.isFinite(n)) return "—";
  const d = digits ?? (Math.abs(n) >= 100 ? 0 : Math.abs(n) >= 1 ? 2 : Math.abs(n) >= 0.01 ? 3 : 4);
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: Math.min(d, 2), maximumFractionDigits: d });
}
export function compact(n: number | undefined | null): string {
  if (n == null) return "—";
  if (n >= 1e6) return (n / 1e6).toLocaleString("en-US", { maximumFractionDigits: 1 }) + "M";
  if (n >= 1e3) return (n / 1e3).toLocaleString("en-US", { maximumFractionDigits: 0 }) + "K";
  return String(n);
}

/** Provider → categorical colour slot. Fixed so a provider keeps its colour on every chart. */
export const PROVIDER_COLOR: Record<string, string> = { google: "var(--s1)", anthropic: "var(--s2)", openai: "var(--s3)", xai: "var(--s7)", meta: "var(--s5)", deepseek: "var(--s4)", alibaba: "var(--s6)" };
export const providerColor = (id: string) => PROVIDER_COLOR[id] ?? "var(--s0)";
