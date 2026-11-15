"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { addDays, fmtDate } from "@/lib/google-ai/dates";
import { AREAS, TYPE_LABEL, WINDOWS, deadlines, inWindow, radar, top, type WindowId } from "@/lib/google-ai/engine/brief";
import { upcomingChanges } from "@/lib/google-ai/engine/pricing";
import { ANNOUNCEMENTS, ENTITIES, LAYERS, META, entityName } from "@/lib/google-ai/kb";
import type { Announcement, AnnouncementType } from "@/lib/google-ai/types";
import type { StatusPayload } from "../Hub";
import { Cites, Empty, Ev, Imp, Sec, Seg, usd, useHub } from "../ui";

const DEPTHS = [
  { id: "30s", label: "30 seconds" },
  { id: "3m", label: "3 minutes" },
  { id: "15m", label: "15 minutes" },
] as const;
type Depth = (typeof DEPTHS)[number]["id"];

const BUCKETS: { id: string; label: string; types: AnnouncementType[] }[] = [
  { id: "models", label: "New and updated models", types: ["model-launch", "model-update"] },
  { id: "launches", label: "Product launches", types: ["product-launch", "product-update", "rename"] },
  { id: "pricing", label: "Pricing changes", types: ["pricing"] },
  { id: "availability", label: "Availability changes", types: ["availability"] },
  { id: "benchmarks", label: "Benchmark shifts", types: ["benchmark"] },
  { id: "research", label: "Research", types: ["research"] },
  { id: "deprecations", label: "Deprecations", types: ["deprecation"] },
  { id: "infra", label: "Infrastructure and deals", types: ["infrastructure", "partnership", "acquisition", "financial"] },
];

const PERSONAS = [
  { who: "AI industry executive", need: "Where Google stands against rivals, by battleground", href: "/google-ai/compare#battlegrounds" },
  { who: "Google Cloud go-to-market leader", need: "What to say to a customer, by workload", href: "/google-ai/enterprise" },
  { who: "Enterprise CIO / CTO", need: "What to buy, what it costs, what is still preview", href: "/google-ai/pricing" },
  { who: "AI engineer / architect", need: "Model IDs, limits, the agent stack and how parts connect", href: "/google-ai/stack" },
  { who: "AI researcher", need: "Research lineage and what reached product", href: "/google-ai/research" },
  { who: "Financial / industry analyst", need: "Dated history, prices over time, effective dates", href: "/google-ai/timeline" },
];

export default function Overview({ status }: { status: StatusPayload | null }) {
  const { today, mode } = useHub();
  const [depth, setDepth] = useState<Depth>(mode === "executive" ? "30s" : "3m");
  const [win, setWin] = useState<WindowId>("30d");
  const days = WINDOWS.find((w) => w.id === win)!.days;

  // The brief uses the last 30 days; if that holds fewer than five developments it widens, and says so.
  const brief = useMemo(() => {
    for (const d of [30, 90, 365]) {
      const rows = top(today, d, 5);
      if (rows.length >= 5 || d === 365) return { rows, days: d };
    }
    return { rows: [] as Announcement[], days: 30 };
  }, [today]);

  const windowRows = useMemo(() => inWindow(today, days), [today, days]);
  const last24 = useMemo(() => inWindow(today, 1), [today]);
  const week = useMemo(() => inWindow(today, 7), [today]);
  const dl = useMemo(() => deadlines(today).slice(0, 6), [today]);
  const priceChanges = useMemo(() => upcomingChanges(today).filter((u) => u.next.meter === "input" || u.next.meter === "output" || u.next.meter === "seat-month").slice(0, 6), [today]);
  const detected = (status?.items ?? []).filter((i) => !i.knownAs && i.providerId === "google").slice(0, 5);
  const latest = ANNOUNCEMENTS[0];

  return (
    <>
      <div className="gai-hero">
        <span className="gai-kicker">Living intelligence system</span>
        <h1 className="gai-h1">Understand everything Google is doing in AI — and why it matters.</h1>
        <p className="gai-lede">
          One connected, dated and sourced picture of Google&apos;s AI ecosystem: <b>what</b> changed, <b>how</b> it works and fits together, and <b>so what</b> for buyers, builders and competitors.
        </p>
      </div>

      <div className="gai-grid gai-g4 keep2">
        <div className="gai-card gai-stat"><span className="v">{last24.length}</span><span className="l">verified developments in the last 24 hours</span></div>
        <div className="gai-card gai-stat"><span className="v">{week.length}</span><span className="l">in the last 7 days</span></div>
        <div className="gai-card gai-stat"><span className="v">{dl.length ? dl[0].days : "—"}</span><span className="l">{dl.length ? `days to the next deadline: ${dl[0].name}` : "no upcoming deadline on record"}</span></div>
        <div className="gai-card gai-stat"><span className="v">{latest ? fmtDate(latest.date).replace(/ \d{4}$/, "") : "—"}</span><span className="l">most recent verified development</span></div>
      </div>
      {week.length === 0 && (
        <div className="gai-warn" style={{ marginTop: 12 }}>
          No verified development is dated in the last 7 days. The knowledge base was last verified on {fmtDate(META.curatedAt)}; anything newer appears below only as an unreviewed detection, if the monitoring pipeline has run.
        </div>
      )}

      <Sec
        id="brief"
        title="Executive intelligence brief"
        sub={`The five developments that matter most from the last ${brief.days === 365 ? "12 months" : `${brief.days} days`}, ranked by editorial weight and then recency.${brief.days > 30 ? " The 30-day window held fewer than five, so it was widened." : ""}`}
        right={<Seg value={depth} onChange={setDepth} options={DEPTHS} label="Reading time" />}
      >
        {brief.rows.length === 0 ? (
          <Empty title="No developments in the knowledge base yet">The announcement feed is empty.</Empty>
        ) : (
          <ol className="gai-card">
            {brief.rows.map((a, i) => (
              <li key={a.id} className="gai-item">
                <time dateTime={a.date}>{fmtDate(a.date)}</time>
                <div>
                  <h3 className="gai-h3">
                    <span className="gai-muted">{i + 1}. </span>
                    <Link href={`/google-ai/latest/${a.id}`}>{a.title}</Link> <Imp n={a.importance} />
                  </h3>
                  {depth !== "30s" && a.summary[0] && (
                    <p>
                      {a.summary[0].text} <Ev label={a.summary[0].label} short /> <Cites ids={a.summary[0].sourceIds} />
                    </p>
                  )}
                  {depth !== "30s" && a.implications?.[0] && (
                    <p>
                      <b>So what: </b>
                      {a.implications[0].text} <Ev label="analyst-interpretation" short />
                    </p>
                  )}
                  {depth === "15m" && (
                    <div className="gai-stack" style={{ marginTop: 6 }}>
                      {a.beforeAfter && <p><b>Before:</b> {a.beforeAfter.before} <b>After:</b> {a.beforeAfter.after}</p>}
                      {a.technical?.[0] && <p><b>How it works:</b> {a.technical[0].text} <Cites ids={a.technical[0].sourceIds} /></p>}
                      {a.pricingAvailability?.[0] && <p><b>Price and availability:</b> {a.pricingAvailability[0].text} <Cites ids={a.pricingAvailability[0].sourceIds} /></p>}
                      {a.uncertainty?.[0] && <p><b>Not confirmed:</b> {a.uncertainty[0]}</p>}
                    </div>
                  )}
                  <div className="gai-chipset" style={{ marginTop: 6 }}>
                    {a.types.map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Sec>

      <Sec id="changed" title="What changed" sub="Canonical developments by kind. One development can carry several labels, so the tiles can add up to more than the total." right={<Seg value={win} onChange={setWin} options={WINDOWS.map((w) => ({ id: w.id, label: w.label }))} label="Time window" />}>
        <div className="gai-grid gai-g4 keep2">
          {BUCKETS.map((b) => {
            const rows = windowRows.filter((a) => a.types.some((t) => b.types.includes(t)));
            return (
              <Link key={b.id} href={`/google-ai/latest?types=${b.types.join(",")}&window=${win}`} className="gai-card link">
                <div className="gai-stat"><span className="v">{rows.length}</span><span className="l">{b.label}</span></div>
                {rows[0] && <p className="gai-small gai-muted" style={{ marginTop: 6 }}>Latest: {rows[0].title}</p>}
              </Link>
            );
          })}
        </div>
      </Sec>

      <Sec id="radar" title="Change radar" sub="Each dot is one development: the spoke is the area, the distance from the centre is how long ago, the size is editorial weight. Counting dots measures activity, not leadership.">
        <div className="gai-split">
          <div className="gai-card"><Radar today={today} days={days} /></div>
          <div className="gai-tablewrap">
            <table className="gai-table">
              <thead><tr><th>Area</th><th className="num">Developments</th><th className="num">Rated 4–5</th><th className="num">Previous {WINDOWS.find((w) => w.id === win)!.label}</th></tr></thead>
              <tbody>
                {radar(today, days).map((c) => (
                  <tr key={c.area}>
                    <td><Link className="gai-link" href={`/google-ai/latest?areas=${c.area}&window=${win}`}>{c.label}</Link></td>
                    <td className="num">{c.count}</td>
                    <td className="num">{c.major}</td>
                    <td className="num">{c.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Sec>

      <div className="gai-grid gai-g2" style={{ marginTop: 30 }}>
        <section className="gai-card">
          <h2 className="gai-h3">Deadlines ahead</h2>
          <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Announced changes that take effect after today.</p>
          {dl.length === 0 ? <p className="gai-muted gai-small">No upcoming effective date is on record.</p> : (
            <ul className="gai-claims">
              {dl.map((d) => (
                <li key={d.event.id}>
                  <span><b>{fmtDate(d.on)}</b> · in {d.days} days · <Link className="gai-link" href={`/google-ai/entity/${d.event.entityId}`}>{d.name}</Link></span>
                  <span className="gai-small">{d.event.detail}</span>
                  <span className="gai-claim-meta"><Ev label={d.event.label} short /><Cites ids={d.event.sourceIds} /></span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="gai-card">
          <h2 className="gai-h3">Price changes already published</h2>
          <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Prices with a future effective date. Until that date the current price still applies.</p>
          {priceChanges.length === 0 ? <p className="gai-muted gai-small">No scheduled price change is on record.</p> : (
            <ul className="gai-claims">
              {priceChanges.map(({ next, current }) => (
                <li key={next.id}>
                  <span>
                    <b>{fmtDate(next.effectiveFrom)}</b> · <Link className="gai-link" href={`/google-ai/entity/${next.entityId}`}>{entityName(next.entityId)}</Link> {next.meter.replace("-", " ")}: {current ? `${usd(current.price)} → ` : ""}{usd(next.price)}
                    {next.region === "regional" ? " (regional)" : ""}
                  </span>
                  <span className="gai-claim-meta"><Ev label={next.label} short /><Cites ids={next.sourceIds} /></span>
                </li>
              ))}
            </ul>
          )}
          <Link className="gai-link gai-small" href="/google-ai/pricing">Pricing and economics →</Link>
        </section>
      </div>

      <Sec id="detected" title="Detected by monitoring, not yet reviewed" sub="Items the pipeline found in official feeds that are not in the verified knowledge base. They are leads, not facts.">
        {detected.length === 0 ? (
          <Empty title={status?.pipeline?.lastRun ? "Nothing new is waiting for review" : "No monitoring run to show"}>
            {status?.pipeline?.lastRun ? "The last run found no Google item that isn't already covered." : "The monitoring pipeline has not recorded a run in this deployment, so there are no live detections. The verified knowledge base above is unaffected."}
          </Empty>
        ) : (
          <ul className="gai-card">
            {detected.map((d) => (
              <li key={d.id} className="gai-item">
                <time>{d.published ? fmtDate(d.published) : "undated"}</time>
                <div>
                  <h3 className="gai-h3"><a href={d.url} target="_blank" rel="noreferrer noopener">{d.title}</a></h3>
                  <p className="gai-small">{d.publisher} · <span className="gai-tag">unreviewed</span> {d.types.map((t) => <span key={t} className="gai-tag">{TYPE_LABEL[t]}</span>)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Sec>

      <Sec id="stack" title="The stack in one view" sub="Eight layers, from silicon to distribution. Each product is counted once, in its home layer.">
        <div className="gai-grid gai-g4 keep2">
          {LAYERS.map((l) => {
            const n = ENTITIES.filter((e) => e.providerId === "google" && e.layer === l.id).length;
            return (
              <Link key={l.id} href={`/google-ai/stack#${l.id}`} className="gai-card link">
                <span className="gai-layer-n">Layer {l.n}</span>
                <h3 className="gai-h3">{l.name}</h3>
                <p className="gai-small gai-muted">{l.question}</p>
                <p className="gai-small" style={{ marginTop: 6 }}><b>{n}</b> tracked</p>
              </Link>
            );
          })}
        </div>
      </Sec>

      <Sec id="personas" title="Start from your question" sub="Six ways in. Every view reads the same facts; only the emphasis changes.">
        <div className="gai-grid gai-g3">
          {PERSONAS.map((p) => (
            <Link key={p.who} href={p.href} className="gai-card link">
              <h3 className="gai-h3">{p.who}</h3>
              <p className="gai-small gai-muted">{p.need}</p>
            </Link>
          ))}
        </div>
      </Sec>
    </>
  );
}

/** AI Release Radar: angle = area, radius = age inside the window, size = editorial weight. */
function Radar({ today, days }: { today: string; days: number }) {
  const [tip, setTip] = useState<{ x: number; y: number; a: Announcement } | null>(null);
  const size = 440;
  const c = size / 2;
  const R = 170;
  const from = addDays(today, -days);
  const dots = useMemo(() => {
    const out: { a: Announcement; x: number; y: number; r: number }[] = [];
    AREAS.forEach((area, i) => {
      const rows = inWindow(today, days).filter((a) => a.areas[0] === area.id || (a.areas.includes(area.id) && !AREAS.some((x) => x.id === a.areas[0])));
      rows.forEach((a, k) => {
        const age = (Date.parse(today) - Date.parse(a.date)) / (Date.parse(today) - Date.parse(from));
        const spread = ((k % 5) - 2) * 0.07;
        const ang = (i / AREAS.length) * Math.PI * 2 - Math.PI / 2 + spread;
        const rad = 22 + age * (R - 26);
        out.push({ a, x: c + Math.cos(ang) * rad, y: c + Math.sin(ang) * rad, r: 2.5 + a.importance * 1.3 });
      });
    });
    return out;
  }, [today, days, from, c]);
  return (
    <div style={{ position: "relative" }}>
      <svg className="gai-chart" viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Release radar: ${dots.length} developments in the last ${days} days by area. The table beside it gives the counts.`}>
        {[0.33, 0.66, 1].map((f) => <circle key={f} cx={c} cy={c} r={22 + f * (R - 26)} fill="none" className="grid" />)}
        {AREAS.map((area, i) => {
          const ang = (i / AREAS.length) * Math.PI * 2 - Math.PI / 2;
          const lx = c + Math.cos(ang) * (R + 14);
          const ly = c + Math.sin(ang) * (R + 14);
          return (
            <g key={area.id}>
              <line x1={c} y1={c} x2={c + Math.cos(ang) * R} y2={c + Math.sin(ang) * R} className="grid" />
              <text x={lx} y={ly} textAnchor={Math.abs(Math.cos(ang)) < 0.3 ? "middle" : Math.cos(ang) > 0 ? "start" : "end"} dominantBaseline="middle" className="lbl">{area.label}</text>
            </g>
          );
        })}
        <text x={c} y={c + 4} textAnchor="middle">today</text>
        {dots.map(({ a, x, y, r }) => (
          <a key={a.id} href={`/google-ai/latest/${a.id}`} aria-label={`${a.title}, ${fmtDate(a.date)}`}>
            <circle cx={x} cy={y} r={r} fill="var(--s1)" fillOpacity={a.importance >= 4 ? 0.95 : 0.5} stroke="var(--surface)" strokeWidth="1" onMouseEnter={() => setTip({ x, y, a })} onMouseLeave={() => setTip(null)} onFocus={() => setTip({ x, y, a })} onBlur={() => setTip(null)} />
          </a>
        ))}
      </svg>
      {tip && (
        <div className="gai-tip" style={{ left: `${(tip.x / size) * 100}%`, top: `${(tip.y / size) * 100}%`, transform: "translate(-50%, calc(-100% - 10px))" }}>
          <b>{fmtDate(tip.a.date)}</b> · {tip.a.title}
        </div>
      )}
      {dots.length === 0 && <p className="gai-small gai-muted" style={{ textAlign: "center" }}>No verified development in this window.</p>}
      <p className="gai-small gai-muted">Centre is today; the outer ring is {days === 365 ? "12 months" : `${days} days`} ago. Darker dots are rated 4–5 by the editors.</p>
    </div>
  );
}
