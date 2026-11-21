"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { addDays, fmtDate } from "@/lib/google-ai/dates";
import { AREAS, TYPE_LABEL, WINDOWS, inWindow, type WindowId } from "@/lib/google-ai/engine/brief";
import { ANNOUNCEMENTS, ANNOUNCEMENT_BY_ID, ENTITY_BY_ID, LAYERS, LAYER_BY_ID, LIFECYCLE, PRICES, SOURCE_BY_ID } from "@/lib/google-ai/kb";
import type { Announcement, AnnouncementType, RadarArea } from "@/lib/google-ai/types";
import type { StatusPayload } from "../Hub";
import { ACCESS_LABEL, Cites, Claims, Empty, EntityLink, Imp, Sec, Seg, usd, useHub } from "../ui";

const WIN_OPTS = [...WINDOWS.map((w) => ({ id: w.id as string, label: w.label })), { id: "all", label: "All" }];
const FEEDS = [
  { id: "verified", label: "Verified developments" },
  { id: "detected", label: "Auto-detected, unreviewed" },
] as const;

export default function Latest({ status }: { status: StatusPayload | null }) {
  const { today } = useHub();
  const sp = useSearchParams();
  const [feed, setFeed] = useState<"verified" | "detected">("verified");
  const [win, setWin] = useState<string>(sp.get("window") ?? "90d");
  const [types, setTypes] = useState<AnnouncementType[]>((sp.get("types")?.split(",").filter((t) => t in TYPE_LABEL) as AnnouncementType[]) ?? []);
  const [areas, setAreas] = useState<RadarArea[]>((sp.get("areas")?.split(",") as RadarArea[]) ?? []);
  const [minImp, setMinImp] = useState(1);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const days = WINDOWS.find((w) => w.id === (win as WindowId))?.days;
    let r = days ? inWindow(today, days) : ANNOUNCEMENTS.filter((a) => a.date <= today);
    if (types.length) r = r.filter((a) => a.types.some((t) => types.includes(t)));
    if (areas.length) r = r.filter((a) => a.areas.some((t) => areas.includes(t)));
    if (minImp > 1) r = r.filter((a) => a.importance >= minImp);
    const needle = q.trim().toLowerCase();
    if (needle) r = r.filter((a) => (a.title + " " + a.summary.map((c) => c.text).join(" ")).toLowerCase().includes(needle));
    return r;
  }, [today, win, types, areas, minImp, q]);

  const usedTypes = useMemo(() => (Object.keys(TYPE_LABEL) as AnnouncementType[]).filter((t) => ANNOUNCEMENTS.some((a) => a.types.includes(t))), []);
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const detected = status?.items ?? [];

  return (
    <>
      <header className="gai-hero">
        <div className="gai-page-ico" aria-hidden>📰</div>
        <h1 className="gai-h1">All developments</h1>
        <p className="gai-lede">Every recorded development, newest first. Several posts about the same thing are merged into one entry.</p>
      </header>
      <Seg value={feed} onChange={setFeed} options={FEEDS} label="Feed" />

      {feed === "verified" ? (
        <>
          <div className="gai-card gai-stack" style={{ marginTop: 12 }}>
            <div className="gai-row">
              <Seg value={win} onChange={setWin} options={WIN_OPTS} label="Time window" />
              <input className="gai-input" placeholder="Filter by text" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter developments by text" />
              <label className="gai-small gai-row">
                Minimum weight
                <select className="gai-select" value={minImp} onChange={(e) => setMinImp(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                </select>
              </label>
            </div>
            <div className="gai-chipset" role="group" aria-label="Kind of development">
              {usedTypes.map((t) => <button key={t} type="button" className="gai-chip" aria-pressed={types.includes(t)} onClick={() => setTypes(toggle(types, t))}>{TYPE_LABEL[t]}</button>)}
            </div>
            <div className="gai-chipset" role="group" aria-label="Area">
              {AREAS.map((a) => <button key={a.id} type="button" className="gai-chip" aria-pressed={areas.includes(a.id)} onClick={() => setAreas(toggle(areas, a.id))}>{a.label}</button>)}
            </div>
          </div>
          <p className="gai-small gai-muted" style={{ margin: "10px 0" }}>{rows.length} of {ANNOUNCEMENTS.length} developments</p>
          {rows.length === 0 ? (
            <Empty title="No verified development matches">Widen the window or clear a filter. Windows are measured back from today, {fmtDate(today)}.</Empty>
          ) : (
            <ul className="gai-card">
              {rows.map((a) => <FeedRow key={a.id} a={a} />)}
            </ul>
          )}
        </>
      ) : (
        <Sec title="Auto-detected items" sub="Found by the monitoring pipeline in official feeds. Classified by rules, not reviewed by an editor, and not part of the verified knowledge base. Items already covered link to the verified development.">
          {detected.length === 0 ? (
            <Empty title="No detections to show">
              {status?.pipeline?.lastRun ? `The last run (${fmtDate(status.pipeline.lastRun.finishedAt.slice(0, 10))}) recorded no items.` : "The monitoring pipeline has not recorded a run in this deployment. See Research → Pipeline status for the source list and how to enable it."}
            </Empty>
          ) : (
            <ul className="gai-card">
              {detected.map((d) => (
                <li key={d.id} className="gai-item">
                  <time>{d.published ? fmtDate(d.published) : "undated"}</time>
                  <div>
                    <h3 className="gai-h3"><a href={d.url} target="_blank" rel="noreferrer noopener">{d.title}</a></h3>
                    <p>{d.excerpt}</p>
                    <div className="gai-chipset" style={{ marginTop: 6 }}>
                      <span className="gai-tag">{d.publisher}</span>
                      {d.knownAs ? <Link className="gai-tag" href={`/google-ai/latest/${d.knownAs}`}>covered: verified development →</Link> : <span className="gai-tag">{d.review.state.replace("-", " ")}</span>}
                      {d.types.map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}
                      {d.entityIds.slice(0, 4).map((id) => <EntityLink key={id} id={id} />)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Sec>
      )}
    </>
  );
}

function FeedRow({ a }: { a: Announcement }) {
  return (
    <li className="gai-item">
      <time dateTime={a.date}>{fmtDate(a.date)}</time>
      <div>
        <h3 className="gai-h3"><Link href={`/google-ai/latest/${a.id}`}>{a.title}</Link> <Imp n={a.importance} /></h3>
        {a.summary[0] && <p>{a.summary[0].text}</p>}
        <div className="gai-chipset" style={{ marginTop: 6 }}>
          {a.types.map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}
          {a.effectiveDate && a.effectiveDate !== a.date && <span className="gai-tag">effective {fmtDate(a.effectiveDate)}</span>}
          {a.verification !== "verified" && <span className="gai-tag">{a.verification.replace("-", " ")}</span>}
          <Cites ids={a.sourceIds} />
        </div>
      </div>
    </li>
  );
}

/** Announcement detail: sections A–J. A section with no content says so. */
export function AnnouncementDetail({ id }: { id: string }) {
  const { today, mode } = useHub();
  const a = ANNOUNCEMENT_BY_ID[id];
  const related = useMemo(() => {
    if (!a) return [];
    return ANNOUNCEMENTS.filter((b) => b.id !== a.id && b.entityIds.some((e) => a.entityIds.includes(e)))
      .sort((x, y) => Math.abs(Date.parse(x.date) - Date.parse(a.date)) - Math.abs(Date.parse(y.date) - Date.parse(a.date)))
      .slice(0, 6);
  }, [a]);
  if (!a) return <Empty title="Development not found" />;

  const known = a.entityIds.filter((e) => ENTITY_BY_ID[e]);
  const prices = PRICES.filter((p) => a.entityIds.includes(p.entityId) && (p.publishedAt === a.date || p.effectiveFrom === a.date || p.effectiveFrom === a.effectiveDate));
  const later = [
    ...(a.followUps ?? []).map((f) => ({ date: f.date, note: f.note, sourceIds: f.sourceIds })),
    ...LIFECYCLE.filter((l) => a.entityIds.includes(l.entityId) && l.date > a.date && l.date <= today).map((l) => ({ date: l.date, note: `${ENTITY_BY_ID[l.entityId]?.name ?? l.entityId}: ${l.detail}`, sourceIds: l.sourceIds })),
  ].sort((x, y) => x.date.localeCompare(y.date)).slice(0, 8);
  const pending = a.effectiveDate && a.effectiveDate > today;

  return (
    <article>
      <p className="gai-small"><Link className="gai-link" href="/google-ai/latest">← Latest</Link></p>
      <div className="gai-hero" style={{ marginTop: 8 }}>
        <div className="gai-chipset">
          {a.types.map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}
          {a.layers.map((l) => <Link key={l} className="gai-tag" href={`/google-ai/stack#${l}`}>Layer {LAYER_BY_ID[l]?.n}: {LAYER_BY_ID[l]?.short}</Link>)}
        </div>
        <h1 className="gai-h1" style={{ maxWidth: "34ch" }}>{a.title}</h1>
        <div className="gai-row gai-small">
          <span>Made public <b>{fmtDate(a.date)}</b></span>
          {a.effectiveDate && a.effectiveDate !== a.date && <span>· takes effect <b>{fmtDate(a.effectiveDate)}</b>{pending ? " (not yet in effect)" : ""}</span>}
          <span>· editorial weight <Imp n={a.importance} /></span>
          <span>· {a.verification.replace("-", " ")}</span>
          <span className="gai-muted">· last checked {fmtDate(a.lastCheckedAt)}</span>
        </div>
      </div>

      <div className="gai-split">
        <div>
          <Part letter="A" title="What is confirmed"><Claims claims={a.summary} /></Part>
          <Part letter="B" title="Before and after">
            {a.beforeAfter ? (
              <div className="gai-grid gai-g2">
                <div className="gai-card"><span className="gai-kicker">Before</span><p>{a.beforeAfter.before}</p></div>
                <div className="gai-card"><span className="gai-kicker">After</span><p>{a.beforeAfter.after}</p></div>
              </div>
            ) : <p className="gai-muted gai-small">No before-and-after comparison recorded for this development.</p>}
          </Part>
          {mode !== "executive" && <Part letter="C" title="How it works"><Claims claims={a.technical} empty="No technical detail recorded." /></Part>}
          <Part letter="D" title="Where it sits in the ecosystem">
            {known.length ? (
              <div className="gai-chipset">{a.entityIds.map((e) => <EntityLink key={e} id={e} />)}</div>
            ) : <p className="gai-muted gai-small">Not yet linked to a product in the knowledge base.</p>}
            <p className="gai-small gai-muted" style={{ marginTop: 6 }}>Layers: {a.layers.map((l) => LAYERS.find((x) => x.id === l)?.name).join(" · ") || "not assigned"}</p>
          </Part>
          <Part letter="E" title="Related developments">
            {related.length ? (
              <ul className="gai-claims">{related.map((r) => <li key={r.id}><span><span className="gai-mono gai-muted">{fmtDate(r.date)}</span> · <Link className="gai-link" href={`/google-ai/latest/${r.id}`}>{r.title}</Link></span></li>)}</ul>
            ) : <p className="gai-muted gai-small">No other development shares a product with this one.</p>}
          </Part>
          <Part letter="F" title="Competitive positioning"><Claims claims={a.competitive} empty="No competitive comparison recorded. See Compare for the standing picture." /></Part>
          <Part letter="G" title="So what">
            <Claims claims={a.implications} empty="No analyst interpretation written yet." />
          </Part>
          <Part letter="H" title="Pricing and availability">
            <Claims claims={a.pricingAvailability} empty="No pricing or availability detail recorded for this development." />
            {prices.length > 0 && (
              <div className="gai-tablewrap" style={{ marginTop: 8 }}>
                <table className="gai-table">
                  <thead><tr><th>Product</th><th>Meter</th><th className="num">Price</th><th>Effective</th></tr></thead>
                  <tbody>{prices.slice(0, 10).map((p) => <tr key={p.id}><td>{ENTITY_BY_ID[p.entityId]?.name}</td><td>{p.meter} · {p.tier}{p.region === "regional" ? " · regional" : ""}</td><td className="num">{usd(p.price)}</td><td>{fmtDate(p.effectiveFrom)}{p.effectiveTo ? ` – ${fmtDate(p.effectiveTo)}` : ""}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </Part>
          <Part letter="I" title="Evidence and uncertainty">
            {a.uncertainty?.length ? <ul className="gai-claims">{a.uncertainty.map((u) => <li key={u}><span>{u}</span></li>)}</ul> : <p className="gai-muted gai-small">No open question recorded.</p>}
          </Part>
          <Part letter="J" title="What happened next">
            {later.length ? (
              <ul className="gai-claims">{later.map((f, i) => <li key={i}><span><span className="gai-mono gai-muted">{fmtDate(f.date)}</span> · {f.note}</span><span className="gai-claim-meta"><Cites ids={f.sourceIds} /></span></li>)}</ul>
            ) : <p className="gai-muted gai-small">Nothing recorded since {fmtDate(a.date)}.</p>}
          </Part>
        </div>
        <aside className="gai-card gai-stack">
          <h2 className="gai-h3">Sources clustered into this development</h2>
          <ul className="gai-claims">
            {a.sourceIds.map((sid) => {
              const s = SOURCE_BY_ID[sid];
              if (!s) return <li key={sid}><span className="gai-muted">Missing source {sid}</span></li>;
              return (
                <li key={sid}>
                  <a className="gai-link" href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a>
                  <span className="gai-small gai-muted">{s.publisher}{s.published ? ` · ${fmtDate(s.published)}` : ""} · {s.firstParty ? "first-party" : "third-party"}</span>
                  <span><span className={`gai-acc ${s.access}`}>{ACCESS_LABEL[s.access]}</span></span>
                </li>
              );
            })}
          </ul>
          <p className="gai-small gai-muted">First seen {fmtDate(a.firstSeenAt)} · last checked {fmtDate(a.lastCheckedAt)}. Window for &ldquo;related&rdquo;: developments sharing a product, nearest in time first ({fmtDate(addDays(a.date, -90))} onward shown first).</p>
        </aside>
      </div>
    </article>
  );
}

function Part({ letter, title, children }: { letter: string; title: string; children: React.ReactNode }) {
  return (
    <section className="gai-part">
      <h2 className="gai-h3"><span>{letter}</span>{title}</h2>
      {children}
    </section>
  );
}
