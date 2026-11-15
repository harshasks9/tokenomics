"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import { LIMITATIONS, REVIEW } from "@/lib/google-ai/editorial";
import { TYPE_LABEL } from "@/lib/google-ai/engine/brief";
import { ANNOUNCEMENTS, AVAILABILITY, BATTLEGROUNDS, ENTITIES, ENTITY_BY_ID, LIFECYCLE, META, PRICES, RELATIONSHIPS, RESULTS, SOURCES, TIMELINE } from "@/lib/google-ai/kb";
import type { SourceAccess } from "@/lib/google-ai/types";
import type { StatusPayload } from "../Hub";
import { ACCESS_LABEL, EV_HELP, EV_LABEL, Empty, Ev, Sec, Status } from "../ui";

const ACCESS_ORDER: SourceAccess[] = ["primary", "search-excerpt", "secondary", "prior-knowledge"];
const ACCESS_HELP: Record<SourceAccess, string> = {
  primary: "We fetched the page itself and read it.",
  "search-excerpt": "The page could not be fetched from the research environment; we read search-engine extracts of it.",
  secondary: "We know it only through someone else's reporting.",
  "prior-knowledge": "Well-known history that was not re-read in this research cycle.",
};

export default function Research({ status, statusFailed }: { status: StatusPayload | null; statusFailed: boolean }) {
  const research = useMemo(() => ENTITIES.filter((e) => e.providerId === "google" && e.layer === "research"), []);
  const lineage = useMemo(() => RELATIONSHIPS.filter((r) => r.type === "derived-from" && ENTITY_BY_ID[r.from] && ENTITY_BY_ID[r.to]), []);
  const papers = useMemo(() => ANNOUNCEMENTS.filter((a) => a.types.includes("research")).slice(0, 8), []);
  const byAccess = useMemo(() => ACCESS_ORDER.map((a) => ({ a, n: SOURCES.filter((s) => s.access === a).length })), []);
  const verif = useMemo(() => ["verified", "partially-verified", "unverified", "disputed"].map((v) => ({ v, n: ENTITIES.filter((e) => e.verification === v).length })), []);
  const counts: [string, number][] = [
    ["Entities (companies, models, products, components)", ENTITIES.length],
    ["Relationships", RELATIONSHIPS.length],
    ["Price records", PRICES.length],
    ["Benchmark results", RESULTS.length],
    ["Availability records", AVAILABILITY.length],
    ["Lifecycle events", LIFECYCLE.length],
    ["Canonical developments", ANNOUNCEMENTS.length],
    ["Timeline events", TIMELINE.length],
    ["Competitive battlegrounds", BATTLEGROUNDS.length],
    ["Sources", SOURCES.length],
  ];

  return (
    <>
      <div className="gai-hero">
        <span className="gai-kicker">Research</span>
        <h1 className="gai-h1">The science behind the products, and the method behind this site</h1>
        <p className="gai-lede">Where Google&apos;s research turns into product — and how every statement on this site is sourced, labelled, dated and checked.</p>
      </div>
      <div className="gai-chipset">
        {[["#lab", "Research to product"], ["#method", "Method"], ["#pipeline", "Pipeline status"], ["#sources", "Source library"], ["#review", "Independent review"], ["#limits", "Limitations"]].map(([h, l]) => <a key={h} className="gai-chip" href={h}>{l}</a>)}
      </div>

      <Sec id="lab" title="Research to product" sub="Layer 2 of the stack: the labs, their landmark systems, and the products that descend from them.">
        {research.length === 0 ? <Empty title="No research entity recorded yet" /> : (
          <div className="gai-grid gai-g3">
            {research.map((e) => (
              <Link key={e.id} href={`/google-ai/entity/${e.id}`} className="gai-card link">
                <div className="gai-row"><Status status={e.status} short />{e.group && <span className="gai-small gai-muted">{e.group}</span>}</div>
                <h3 className="gai-h3" style={{ marginTop: 6 }}>{e.name}</h3>
                <p className="gai-small gai-muted">{e.summary.length > 170 ? e.summary.slice(0, 168) + "…" : e.summary}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="gai-grid gai-g2" style={{ marginTop: 14 }}>
          <div className="gai-card">
            <h3 className="gai-h3">From research to product</h3>
            {lineage.length === 0 ? <p className="gai-small gai-muted">No research-to-product link is recorded with a source yet.</p> : (
              <ul className="gai-claims">
                {lineage.map((r) => (
                  <li key={r.id}>
                    <span><Link className="gai-link" href={`/google-ai/entity/${r.to}`}>{ENTITY_BY_ID[r.to].name}</Link> <span className="gai-muted">led to</span> <Link className="gai-link" href={`/google-ai/entity/${r.from}`}>{ENTITY_BY_ID[r.from].name}</Link>{r.note ? ` — ${r.note}` : ""}</span>
                    <span className="gai-claim-meta"><Ev label={r.label} short /></span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="gai-card">
            <h3 className="gai-h3">Recent research developments</h3>
            {papers.length === 0 ? <p className="gai-small gai-muted">No development labelled research in the feed.</p> : (
              <ul className="gai-claims">
                {papers.map((a) => <li key={a.id}><span><span className="gai-mono gai-muted">{fmtDate(a.date)}</span> · <Link className="gai-link" href={`/google-ai/latest/${a.id}`}>{a.title}</Link></span></li>)}
              </ul>
            )}
          </div>
        </div>
      </Sec>

      <Sec id="method" title="Method" sub="Four rules decide what appears here and how it is labelled.">
        <div className="gai-grid gai-g2">
          <div className="gai-card gai-stack">
            <h3 className="gai-h3">1. Every statement carries one of four labels</h3>
            <ul className="gai-claims">
              {(Object.keys(EV_LABEL) as (keyof typeof EV_LABEL)[]).map((k) => <li key={k}><span><Ev label={k} /></span><span className="gai-small">{EV_HELP[k]}</span></li>)}
            </ul>
          </div>
          <div className="gai-card gai-stack">
            <h3 className="gai-h3">2. How we read a source is recorded separately</h3>
            <p className="gai-small gai-muted">An official page read through a search extract is weaker evidence than the page itself, so each source also carries how it was accessed.</p>
            <ul className="gai-claims">
              {byAccess.map(({ a, n }) => <li key={a}><span><span className={`gai-acc ${a}`}>{ACCESS_LABEL[a]}</span> · <b>{n}</b> of {SOURCES.length} sources</span><span className="gai-small">{ACCESS_HELP[a]}</span></li>)}
            </ul>
          </div>
          <div className="gai-card gai-stack">
            <h3 className="gai-h3">3. Publication date and effective date are different things</h3>
            <p className="gai-small">A price change or retirement announced today may apply next quarter. Every price, availability and lifecycle record stores both. The current price stays in force until the effective date; the time machine and the calculator both honour this.</p>
            <h3 className="gai-h3">4. One canonical record per thing</h3>
            <p className="gai-small">Products, models, prices and developments each exist once, with one id. Pages, search, the analyst and charts all read the same records, so a correction made once appears everywhere. Renames keep the old name as a dated alias, which is why searching an old name still finds the product.</p>
          </div>
          <div className="gai-card gai-stack">
            <h3 className="gai-h3">What we don&apos;t do</h3>
            <ul className="gai-small gai-stack">
              <li>No superlatives without a cited measurement, and no ranking that mixes provider-reported and independent scores.</li>
              <li>No roadmap speculation presented as fact. Announced-but-not-shipped is labelled as announced.</li>
              <li>No automatic publishing: items detected by monitoring stay labelled unreviewed until an editor verifies them.</li>
              <li>No bulk copying of proprietary leaderboards. A small number of results are cited, with date, version and source.</li>
              <li>No answers from a language model&apos;s memory. The analyst answers only from these records.</li>
            </ul>
          </div>
        </div>
        <div className="gai-grid gai-g2" style={{ marginTop: 14 }}>
          <div className="gai-tablewrap">
            <table className="gai-table">
              <thead><tr><th>In the knowledge base</th><th className="num">Records</th></tr></thead>
              <tbody>{counts.map(([l, n]) => <tr key={l}><td>{l}</td><td className="num">{n.toLocaleString("en-US")}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="gai-card gai-stack">
            <h3 className="gai-h3">Verification state of entities</h3>
            <ul className="gai-claims">{verif.filter((x) => x.n > 0).map(({ v, n }) => <li key={v}><span><b>{n}</b> {v.replace("-", " ")}</span></li>)}</ul>
            <p className="gai-small gai-muted">Dataset version {META.version}. Verified end to end on {fmtDate(META.curatedAt)}; the announcement feed is densest from {fmtDate(META.coverageFrom)} to {fmtDate(META.coverageTo)}.</p>
          </div>
        </div>
      </Sec>

      <Pipeline status={status} failed={statusFailed} />
      <SourceLibrary />

      <Sec id="review" title="Independent review" sub="Before release the build was reviewed from five roles. Findings are listed with what was done about each — including the ones that were not fixed.">
        {REVIEW.length === 0 ? <Empty title="Review not yet recorded" /> : (
          <div className="gai-stack">
            {REVIEW.map((r) => (
              <details key={r.role} className="gai-card">
                <summary style={{ cursor: "pointer" }}><b>{r.role}</b> <span className="gai-muted gai-small">— {r.lens}</span></summary>
                <p style={{ margin: "8px 0" }}>{r.verdict}</p>
                <div className="gai-tablewrap">
                  <table className="gai-table">
                    <thead><tr><th>Severity</th><th>Finding</th><th>What was done</th><th>Status</th></tr></thead>
                    <tbody>{r.findings.map((f, i) => <tr key={i}><td>{f.severity}</td><td>{f.finding}</td><td>{f.resolution}</td><td><span className={`gai-pill ${f.status === "fixed" ? "ga" : f.status === "open" ? "deprecated" : "preview"}`}>{f.status.replace("-", " ")}</span></td></tr>)}</tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        )}
      </Sec>

      <Sec id="limits" title="Limitations" sub="What this product does not do, or does not do yet. Stated so nobody has to discover it.">
        {LIMITATIONS.length + META.notes.length === 0 ? <Empty title="None recorded" /> : (
          <div className="gai-card">
            <ul className="gai-claims">
              {LIMITATIONS.map((l) => <li key={l.area + l.text}><span><b>{l.area}.</b> {l.text}</span></li>)}
              {META.notes.map((n) => <li key={n}><span><b>Research note.</b> {n}</span></li>)}
            </ul>
          </div>
        )}
      </Sec>
    </>
  );
}

function Pipeline({ status, failed }: { status: StatusPayload | null; failed: boolean }) {
  const p = status?.pipeline ?? null;
  const run = p?.lastRun ?? null;
  const byKey = new Map((run?.feeds ?? []).map((f) => [f.sourceKey, f]));
  return (
    <Sec id="pipeline" title="Pipeline status" sub="The monitoring pipeline reads official feeds and pages on a schedule, clusters and classifies what it finds, compares the official pricing page with the knowledge base, and queues everything for editorial review. This panel shows what it actually did.">
      {failed ? (
        <div className="gai-warn">The status service did not respond, so the state of monitoring is unknown. The verified knowledge base is unaffected and its date is shown at the top of every page.</div>
      ) : !p ? (
        <p className="gai-muted">Loading status…</p>
      ) : (
        <>
          <div className="gai-grid gai-g4 keep2">
            <div className="gai-card gai-stat"><span className="v">{p.lastSuccessAt ? fmtDate(p.lastSuccessAt.slice(0, 10)) : "Never"}</span><span className="l">last successful run{p.lastSuccessAt ? ` · ${p.lastSuccessAt.slice(11, 16)} UTC` : " recorded in this deployment"}</span></div>
            <div className="gai-card gai-stat"><span className="v">{run ? `${run.fetched}/${run.feeds.length}` : "—"}</span><span className="l">sources reached in the last run</span></div>
            <div className="gai-card gai-stat"><span className="v">{status?.items.filter((i) => !i.knownAs).length ?? 0}</span><span className="l">detected items awaiting review</span></div>
            <div className="gai-card gai-stat"><span className="v">{p.store}</span><span className="l">{p.durable ? "state store (durable)" : "state store — not durable: run history is lost on restart"}</span></div>
          </div>
          {!run && <div className="gai-warn" style={{ marginTop: 12 }}>No run is on record. The schedule is a daily job at <span className="gai-mono">/api/google-ai/cron</span>; it needs the <span className="gai-mono">CRON_SECRET</span> environment variable in production and a Redis-compatible store to keep history between runs. Until a run succeeds, nothing on this site claims to be fresher than the knowledge-base date.</div>}
          {run && !run.ok && <div className="gai-warn" style={{ marginTop: 12 }}>The last run ({fmtDate(run.finishedAt.slice(0, 10))}) reached no source. {p.lastSuccessAt ? `The last successful run was ${fmtDate(p.lastSuccessAt.slice(0, 10))}.` : "There is no successful run on record."}</div>}
          <div className="gai-tablewrap" style={{ marginTop: 12 }}>
            <table className="gai-table">
              <thead><tr><th>Source</th><th>Kind</th><th>Last result</th><th className="num">Items</th><th>robots.txt</th></tr></thead>
              <tbody>
                {p.sources.map((s) => {
                  const f = byKey.get(s.key);
                  return (
                    <tr key={s.key}>
                      <td><a className="gai-link" href={s.url} target="_blank" rel="noreferrer noopener">{s.name}</a><div className="gai-small gai-muted">{s.publisher}</div></td>
                      <td>{s.category.replace("-", " ")} · {s.format}</td>
                      <td>{!f ? <span className="gai-muted">not run</span> : f.ok ? <span className="gai-pill ga">ok{f.changed ? " · changed" : ""}</span> : <span className="gai-pill deprecated" title={f.error}>failed{f.httpStatus ? ` ${f.httpStatus}` : ""}</span>}{f && !f.ok && f.error ? <div className="gai-small gai-muted">{f.error.slice(0, 80)}</div> : null}</td>
                      <td className="num">{f?.ok ? f.items : "—"}</td>
                      <td>{f?.robots ?? "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {run && run.priceChecks.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <h3 className="gai-h3">Price check against the official pricing page</h3>
              <p className="gai-small gai-muted" style={{ marginBottom: 6 }}>For each model with a current Google Cloud list price in the knowledge base, the price read from the live page. A difference raises an alert for an editor; it never changes the knowledge base by itself.</p>
              <div className="gai-tablewrap">
                <table className="gai-table">
                  <thead><tr><th>Model</th><th>Meter</th><th className="num">Knowledge base</th><th className="num">Page</th><th>Result</th></tr></thead>
                  <tbody>{run.priceChecks.map((c) => <tr key={c.entityId + c.meter}><td>{c.name}</td><td>{c.meter}</td><td className="num">${c.expected}</td><td className="num">{c.found == null ? "—" : `$${c.found}`}</td><td><span className={`gai-pill ${c.status === "match" ? "ga" : c.status === "changed" ? "deprecated" : "preview"}`}>{c.status === "not-found" ? "not found on page" : c.status}</span></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          )}
          {(status?.alerts.length ?? 0) > 0 && (
            <div className="gai-card" style={{ marginTop: 14 }}>
              <h3 className="gai-h3">Alerts</h3>
              <ul className="gai-claims">{status!.alerts.slice(0, 12).map((a) => <li key={a.id}><span><span className="gai-tag">{a.kind.replace("-", " ")}</span> <b>{a.title}</b></span><span className="gai-small gai-muted">{a.detail} · raised {fmtDate(a.at.slice(0, 10))}</span></li>)}</ul>
            </div>
          )}
          {(status?.items.length ?? 0) > 0 && <p className="gai-small" style={{ marginTop: 10 }}><Link className="gai-link" href="/google-ai/latest">See detected items in Latest →</Link> <span className="gai-muted">Kinds seen: {[...new Set(status!.items.flatMap((i) => i.types))].slice(0, 6).map((t) => TYPE_LABEL[t]).join(", ")}</span></p>}
        </>
      )}
    </Sec>
  );
}

function SourceLibrary() {
  const [q, setQ] = useState("");
  const [access, setAccess] = useState<SourceAccess | "all">("all");
  const [n, setN] = useState(40);
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SOURCES.filter((s) => (access === "all" || s.access === access) && (!needle || (s.title + " " + s.publisher + " " + s.url).toLowerCase().includes(needle))).sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
  }, [q, access]);
  return (
    <Sec id="sources" title="Source library" sub={`All ${SOURCES.length} sources cited anywhere on the site, with how each was read.`}>
      <div className="gai-row" style={{ marginBottom: 10 }}>
        <input className="gai-input" placeholder="Filter sources" value={q} onChange={(e) => { setQ(e.target.value); setN(40); }} aria-label="Filter sources by text" />
        <select className="gai-select" value={access} onChange={(e) => { setAccess(e.target.value as SourceAccess | "all"); setN(40); }} aria-label="Filter by how the source was read">
          <option value="all">Any access</option>
          {ACCESS_ORDER.map((a) => <option key={a} value={a}>{ACCESS_LABEL[a]}</option>)}
        </select>
        <span className="gai-small gai-muted">{rows.length} shown</span>
      </div>
      {rows.length === 0 ? <Empty title="No source matches" /> : (
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead><tr><th>Source</th><th>Publisher</th><th>Kind</th><th>Published</th><th>Read</th></tr></thead>
            <tbody>
              {rows.slice(0, n).map((s) => (
                <tr key={s.id}>
                  <td><a className="gai-link" href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a></td>
                  <td>{s.publisher}{s.firstParty ? "" : <span className="gai-muted"> · third-party</span>}</td>
                  <td>{s.kind.replace("-", " ")}</td>
                  <td>{s.published ? fmtDate(s.published) : "—"}</td>
                  <td><span className={`gai-acc ${s.access}`}>{ACCESS_LABEL[s.access]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > n && <button type="button" className="gai-btn" style={{ marginTop: 10 }} onClick={() => setN(n + 80)}>Show more</button>}
    </Sec>
  );
}
