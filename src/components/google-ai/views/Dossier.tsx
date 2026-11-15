"use client";

import Link from "next/link";
import { useMemo, type ReactNode } from "react";
import { fmtDate, inEffect } from "@/lib/google-ai/dates";
import { effectiveOn, statusAt } from "@/lib/google-ai/engine/asof";
import { surfaceLabel } from "@/lib/google-ai/engine/answer";
import { TYPE_LABEL } from "@/lib/google-ai/engine/brief";
import { lineage, neighbors } from "@/lib/google-ai/engine/graph";
import { AVAILABILITY_BY_ENTITY, BENCHMARK_BY_ID, ENTITY_BY_ID, LAYER_BY_ID, LIFECYCLE_BY_ENTITY, PRICES_BY_ENTITY, RESULTS_BY_MODEL, SOURCE_BY_ID, announcementsFor, providerName } from "@/lib/google-ai/kb";
import type { DossierKey, PriceRecord } from "@/lib/google-ai/types";
import { EgoGraph, RelationList } from "../viz";
import { ACCESS_LABEL, Cites, Claims, Empty, EntityLink, Ev, Status, compact, usd, useHub } from "../ui";

const UNIT: Record<string, string> = { "usd-per-1m-tokens": "/ 1M tokens", "usd-per-image": "/ image", "usd-per-second": "/ second", "usd-per-user-month": "/ user / month", "usd-per-1k-requests": "/ 1K requests", "usd-per-hour": "/ hour", "usd-other": "" };

export default function Dossier({ id }: { id: string }) {
  const { today, mode, ask } = useHub();
  const e = ENTITY_BY_ID[id];
  const data = useMemo(() => {
    if (!e) return null;
    const ns = neighbors(e.id);
    const prices = PRICES_BY_ENTITY[e.id] ?? [];
    return {
      ns,
      deps: ns.filter((n) => (n.outgoing && ["runs-on", "depends-on", "served-via", "part-of", "implements"].includes(n.edge.type)) || (!n.outgoing && n.edge.type === "powers")),
      related: ns.filter((n) => n.other.providerId === e.providerId && n.edge.type !== "competes-with"),
      rivals: ns.filter((n) => n.edge.type === "competes-with"),
      current: prices.filter((p) => inEffect(today, p.effectiveFrom, p.effectiveTo)),
      scheduled: prices.filter((p) => p.effectiveFrom > today),
      past: prices.filter((p) => p.effectiveTo && p.effectiveTo < today),
      life: (LIFECYCLE_BY_ENTITY[e.id] ?? []).slice().sort((a, b) => effectiveOn(a).localeCompare(effectiveOn(b))),
      avail: AVAILABILITY_BY_ENTITY[e.id] ?? [],
      news: announcementsFor(e.id),
      results: RESULTS_BY_MODEL[e.id] ?? [],
      line: lineage(e.id),
    };
  }, [e, today]);
  if (!e || !data) return <Empty title="Not in the knowledge base" />;

  const d = e.dossier ?? {};
  const has = (k: DossierKey) => (d[k]?.length ?? 0) > 0;
  const st = statusAt(e, today);
  const m = e.model;
  const technical = mode !== "executive";
  const parts: { n: number; id: string; title: string; filled: boolean; tech?: boolean; body: ReactNode }[] = [
    { n: 1, id: "what", title: "What it is", filled: true, body: (
      <>
        <p>{e.summary} <Cites ids={e.sourceIds} /></p>
        {m && (
          <dl className="gai-kv" style={{ marginTop: 10 }}>
            <dt>Model ID{m.apiIds.length > 1 ? "s" : ""}</dt><dd>{m.apiIds.length ? m.apiIds.map((a) => <code key={a} className="gai-mono" style={{ marginRight: 8 }}>{a}</code>) : <span className="gai-muted">not recorded</span>}</dd>
            <dt>Kind</dt><dd>{m.category}{m.tier ? ` · ${m.tier}` : ""}{m.openWeights ? ` · open weights${m.license ? ` (${m.license})` : ""}` : ""}</dd>
          </dl>
        )}
      </>
    ) },
    { n: 2, id: "why", title: "Why it exists", filled: has("whyItExists"), body: <Claims claims={d.whyItExists} /> },
    { n: 3, id: "problem", title: "The problem it solves", filled: has("problem"), body: <Claims claims={d.problem} /> },
    { n: 4, id: "how", title: "How it works", filled: has("howItWorks"), tech: true, body: <Claims claims={d.howItWorks} /> },
    { n: 5, id: "io", title: "Inputs and outputs", filled: has("inputsOutputs") || !!m, tech: true, body: (
      <>
        {m && (
          <dl className="gai-kv" style={{ marginBottom: 8 }}>
            <dt>Accepts</dt><dd>{m.modalitiesIn.join(", ") || "not recorded"}</dd>
            <dt>Produces</dt><dd>{m.modalitiesOut.join(", ") || "not recorded"}</dd>
            <dt>Context window</dt><dd>{m.contextTokens ? `${compact(m.contextTokens)} tokens` : <span className="gai-muted">not confirmed</span>}</dd>
            <dt>Maximum output</dt><dd>{m.maxOutputTokens ? `${compact(m.maxOutputTokens)} tokens` : <span className="gai-muted">not confirmed</span>}</dd>
            <dt>Reasoning</dt><dd>{m.reasoning ?? <span className="gai-muted">not recorded</span>}</dd>
            <dt>Tool use</dt><dd>{m.toolUse == null ? <span className="gai-muted">not recorded</span> : m.toolUse ? "yes" : "no"}</dd>
            {m.knowledgeCutoff && (<><dt>Knowledge cutoff</dt><dd>{m.knowledgeCutoff}</dd></>)}
          </dl>
        )}
        {(has("inputsOutputs") || !m) && <Claims claims={d.inputsOutputs} />}
        {m?.unverified?.length ? <div className="gai-warn"><b>Looked for and not confirmed:</b> {m.unverified.join(" · ")}</div> : null}
      </>
    ) },
    { n: 6, id: "architecture", title: "Architecture", filled: has("architecture"), tech: true, body: <Claims claims={d.architecture} /> },
    { n: 7, id: "dependencies", title: "Dependencies", filled: data.deps.length > 0, tech: true, body: data.deps.length ? (
      <ul className="gai-claims">{data.deps.map((n) => <li key={n.edge.id}><span><span className="gai-muted">{n.phrase}</span> <Link className="gai-link" href={`/google-ai/entity/${n.other.id}`}>{n.other.name}</Link>{n.edge.note ? ` — ${n.edge.note}` : ""}</span><span className="gai-claim-meta"><Ev label={n.edge.label} short /><Cites ids={n.edge.sourceIds} /></span></li>)}</ul>
    ) : <p className="gai-muted gai-small">No dependency recorded.</p> },
    { n: 8, id: "users", title: "Who uses it", filled: has("users"), body: <Claims claims={d.users} /> },
    { n: 9, id: "use-cases", title: "Use cases", filled: has("useCases"), body: <Claims claims={d.useCases} /> },
    { n: 10, id: "availability", title: "Availability", filled: true, body: (
      <>
        <p className="gai-small">Stage today: <Status status={st.status} /> {st.since ? `since ${fmtDate(st.since)}` : ""}{!st.evidenced ? " — no dated stage change is recorded, so this is the catalogue status" : ""}</p>
        {data.avail.length > 0 && (
          <div className="gai-tablewrap" style={{ marginTop: 8 }}>
            <table className="gai-table">
              <thead><tr><th>Where</th><th>Stage</th><th>Who</th><th>From</th><th>Evidence</th></tr></thead>
              <tbody>{data.avail.map((a) => <tr key={a.id}><td>{ENTITY_BY_ID[a.surface]?.name ?? a.surface}</td><td><Status status={a.stage === "waitlist" ? "preview" : a.stage} short /></td><td>{a.audience ?? "—"}{a.regions ? ` · ${a.regions}` : ""}</td><td>{fmtDate(a.effectiveFrom)}{a.effectiveTo ? ` – ${fmtDate(a.effectiveTo)}` : ""}</td><td><Cites ids={a.sourceIds} align="right" /></td></tr>)}</tbody>
            </table>
          </div>
        )}
      </>
    ) },
    { n: 11, id: "pricing", title: "Pricing", filled: data.current.length + data.scheduled.length > 0, body: data.current.length + data.scheduled.length + data.past.length === 0 ? (
      <p className="gai-muted gai-small">No public price is recorded. That can mean it is bundled, sold by quote, free, or simply not yet captured — it is not shown as free.</p>
    ) : (
      <div className="gai-stack">
        {data.current.length > 0 && <PriceTable title={`In effect today (${fmtDate(today)})`} rows={data.current} />}
        {data.scheduled.length > 0 && <PriceTable title="Published, not yet in effect" rows={data.scheduled} />}
        {data.past.length > 0 && technical && <PriceTable title="Earlier prices" rows={data.past} />}
        <Link className="gai-link gai-small" href={`/google-ai/pricing?model=${e.id}`}>Estimate a workload with this price →</Link>
      </div>
    ) },
    { n: 12, id: "history", title: "History", filled: data.life.length > 0 || !!e.formerNames?.length || !!e.introducedAt, body: (
      <>
        {e.formerNames?.length ? <p className="gai-small" style={{ marginBottom: 6 }}>Names over time: {e.formerNames.map((f) => `${f.name}${f.from || f.to ? ` (${f.from ? fmtDate(f.from, "month") : "…"} – ${f.to ? fmtDate(f.to, "month") : "…"})` : ""}`).join(" → ")} → <b>{e.name}</b></p> : null}
        {data.line.length > 0 && <p className="gai-small" style={{ marginBottom: 6 }}>Lineage: <b>{e.name}</b> ← {data.line.map((x, i) => <span key={x.id}>{i ? " ← " : ""}<Link className="gai-link" href={`/google-ai/entity/${x.id}`}>{x.name}</Link></span>)}</p>}
        {data.life.length ? (
          <ul className="gai-claims">{data.life.map((l) => <li key={l.id}><span><span className="gai-mono gai-muted">{fmtDate(effectiveOn(l))}</span> · <b>{l.type.replace(/-/g, " ")}</b>{effectiveOn(l) > today ? " (scheduled)" : ""} — {l.detail}{l.effectiveDate && l.effectiveDate !== l.date ? ` Announced ${fmtDate(l.date)}.` : ""}</span><span className="gai-claim-meta"><Ev label={l.label} short /><Cites ids={l.sourceIds} /></span></li>)}</ul>
        ) : <p className="gai-muted gai-small">{e.introducedAt ? `First introduced ${fmtDate(e.introducedAt)}. No further dated events recorded.` : "No dated history recorded."}</p>}
      </>
    ) },
    { n: 13, id: "related", title: `Related ${providerName(e.providerId)} products`, filled: data.related.length > 0, body: <><div className="gai-card" style={{ marginBottom: 10 }}><EgoGraph id={e.id} /></div><RelationList id={e.id} types={["part-of", "powers", "runs-on", "served-via", "integrates", "depends-on", "implements", "derived-from", "partnered-with", "succeeds", "renamed-from"]} /></> },
    { n: 14, id: "competitors", title: "Competitors", filled: data.rivals.length > 0 || has("competitorNotes"), body: (
      <>
        {data.rivals.length > 0 && <div className="gai-chipset" style={{ marginBottom: 8 }}>{data.rivals.map((n) => <EntityLink key={n.edge.id} id={n.other.id}>{n.other.name} · {providerName(n.other.providerId)}</EntityLink>)}</div>}
        <Claims claims={d.competitorNotes} empty={data.rivals.length ? "No further comparison notes." : "No direct competitor is mapped yet. See Compare for the battleground view."} />
        {e.kind === "model" && data.rivals.length > 0 && <Link className="gai-link gai-small" href={`/google-ai/compare?models=${[e.id, ...data.rivals.slice(0, 2).map((n) => n.other.id)].join(",")}`}>Compare side by side →</Link>}
      </>
    ) },
    { n: 15, id: "differentiators", title: "What sets it apart", filled: has("differentiators") || data.results.length > 0, body: (
      <>
        <Claims claims={d.differentiators} empty="No differentiator recorded with a source." />
        {data.results.length > 0 && (
          <div className="gai-tablewrap" style={{ marginTop: 10 }}>
            <table className="gai-table">
              <thead><tr><th>Benchmark</th><th className="num">Score</th><th>Reported by</th><th>Date</th><th>Setup</th><th>Source</th></tr></thead>
              <tbody>{data.results.map((r) => { const b = BENCHMARK_BY_ID[r.benchmarkId]; return <tr key={r.id}><td>{b?.name ?? r.benchmarkId}{r.benchmarkVersion ? ` ${r.benchmarkVersion}` : ""}</td><td className="num">{r.score}{b?.unit === "%" ? "%" : ""}</td><td><Ev label={r.reporter === "independent" ? "independent-measurement" : "provider-claim"} short /></td><td>{fmtDate(r.date)}</td><td className="gai-small">{[r.modelVersion, r.reasoningConfig, r.scaffold].filter(Boolean).join(" · ") || "not stated"}</td><td><Cites ids={r.sourceIds} align="right" /></td></tr>; })}</tbody>
            </table>
          </div>
        )}
      </>
    ) },
    { n: 16, id: "limitations", title: "Limitations", filled: has("limitations"), body: <Claims claims={d.limitations} empty="No limitation recorded with a source. That is a gap in the record, not a claim that there are none." /> },
    { n: 17, id: "sources", title: "Sources", filled: e.sourceIds.length > 0, body: (
      <ul className="gai-claims">{e.sourceIds.map((sid) => { const s = SOURCE_BY_ID[sid]; return s ? <li key={sid}><a className="gai-link" href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a><span className="gai-small gai-muted">{s.publisher}{s.published ? ` · ${fmtDate(s.published)}` : ""} · <span className={`gai-acc ${s.access}`}>{ACCESS_LABEL[s.access]}</span> · checked {fmtDate(s.lastChecked)}</span></li> : <li key={sid} className="gai-muted">Missing source {sid}</li>; })}</ul>
    ) },
    { n: 18, id: "recent", title: "What changed recently", filled: data.news.length > 0, body: data.news.length ? (
      <ul className="gai-claims">{data.news.slice(0, 8).map((a) => <li key={a.id}><span><span className="gai-mono gai-muted">{fmtDate(a.date)}</span> · <Link className="gai-link" href={`/google-ai/latest/${a.id}`}>{a.title}</Link></span><span className="gai-claim-meta">{a.types.slice(0, 3).map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}</span></li>)}</ul>
    ) : <p className="gai-muted gai-small">No development in the feed mentions this yet.</p> },
  ];
  const shown = parts.filter((p) => technical || !p.tech);

  return (
    <article>
      <p className="gai-small"><Link className="gai-link" href={e.providerId === "google" ? `/google-ai/stack${e.layer ? `#${e.layer}` : ""}` : "/google-ai/models"}>← {e.providerId === "google" ? "AI Stack" : "Models"}</Link></p>
      <div className="gai-hero" style={{ marginTop: 8 }}>
        <div className="gai-row">
          <Status status={st.status} />
          <span className="gai-tag">{providerName(e.providerId)}</span>
          {e.layer && <Link className="gai-tag" href={`/google-ai/stack#${e.layer}`}>Layer {LAYER_BY_ID[e.layer].n} · {LAYER_BY_ID[e.layer].name}</Link>}
          {e.parentId && <EntityLink id={e.parentId} />}
          {e.verification !== "verified" && <span className="gai-tag">{e.verification.replace("-", " ")}</span>}
        </div>
        <h1 className="gai-h1">{e.name}</h1>
        {e.formerNames?.length ? <p className="gai-muted">Formerly {e.formerNames.map((f) => f.name).join(", ")}</p> : null}
        <div className="gai-row gai-small gai-muted">
          {e.introducedAt && <span>Introduced {fmtDate(e.introducedAt)}</span>}
          {e.retiredAt && <span>· {e.retiredAt > today ? "retires" : "retired"} {fmtDate(e.retiredAt)}</span>}
          <span>· last checked {fmtDate(e.lastCheckedAt)}</span>
          <button type="button" className="gai-link" onClick={() => ask(`What changed recently for ${e.name}?`)}>Ask about this</button>
        </div>
      </div>
      <div className="gai-dossier">
        <nav className="gai-toc" aria-label="Dossier sections">
          {shown.map((p) => <a key={p.id} href={`#${p.id}`} data-empty={p.filled ? 0 : 1}>{p.n}. {p.title}</a>)}
          {!technical && <span className="gai-small gai-muted" style={{ padding: "6px 8px" }}>Parts 4–7 (how it works) are shown in Analyst and Technical depth.</span>}
        </nav>
        <div>
          {shown.map((p) => (
            <section key={p.id} id={p.id} className="gai-part">
              <h2 className="gai-h3"><span>{String(p.n).padStart(2, "0")}</span>{p.title}</h2>
              {p.body}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function PriceTable({ title, rows }: { title: string; rows: PriceRecord[] }) {
  const sorted = rows.slice().sort((a, b) => a.surface.localeCompare(b.surface) || a.tier.localeCompare(b.tier) || a.meter.localeCompare(b.meter) || (a.aboveContextTokens ?? 0) - (b.aboveContextTokens ?? 0));
  return (
    <div>
      <div className="gai-group-name">{title}</div>
      <div className="gai-tablewrap">
        <table className="gai-table">
          <thead><tr><th>Where</th><th>Meter</th><th>Tier</th><th className="num">Price</th><th>Applies</th><th>Evidence</th></tr></thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td>{surfaceLabel(p.surface)}{p.region === "regional" ? " · regional" : ""}</td>
                <td>{p.meter.replace(/-/g, " ")}{p.aboveContextTokens ? ` · prompts > ${compact(p.aboveContextTokens)}` : ""}{p.condition ? ` · ${p.condition}` : ""}</td>
                <td>{p.tier}</td>
                <td className="num">{usd(p.price)} <span className="gai-muted gai-small">{UNIT[p.unit]}</span></td>
                <td className="gai-small">{fmtDate(p.effectiveFrom)}{p.effectiveTo ? ` – ${fmtDate(p.effectiveTo)}` : " onward"}</td>
                <td><Ev label={p.label} short /> <Cites ids={p.sourceIds} align="right" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
