"use client";

import { Fragment, useMemo, useState, type MouseEvent } from "react";
import { ArrowLeft, ArrowRight, Link2, Search } from "lucide-react";
import {
  EVIDENCE, GTM, GTM_RANKS, NARRATIVE, SOURCES, evidenceById, marketById,
  type GtmItem, type GtmRank, type MarketFact,
} from "@/lib/under-the-hood/data";
import { Badge, Cite, ClassBadge, DownloadCsv, Ext, Seg } from "./ui";

const AREA = Object.fromEntries(GTM.areas.map((a) => [a.id, a.label])) as Record<string, string>;
const SEC = Object.fromEntries(NARRATIVE.sections.map((s) => [s.id, s])) as Record<string, (typeof NARRATIVE.sections)[number]>;
const ITEM = Object.fromEntries(GTM.items.map((i) => [i.id, i])) as Record<string, GtmItem>;
const anchor = (id: string) => `gtm-${id}`;

const NAV = [
  { id: "example", label: "The example, checked" },
  { id: "moves", label: "Six moves" },
  { id: "ledger", label: "Pays vs costs Google" },
  { id: "map", label: "Implication map" },
  { id: "implications", label: "All implications" },
  { id: "method", label: "Method" },
];

export function RankBadge({ rank }: { rank: GtmRank }) {
  return <span className={`gtm-rank ${rank.toLowerCase()}`}>{rank}</span>;
}

function DeepDive({ section }: { section: string }) {
  const s = SEC[section];
  if (!s) return null;
  return (
    <a className="gtm-deep" href={`/under-the-hood#${section}`}>
      Deep dive: §{s.n} {s.kicker} <ArrowRight size={13} aria-hidden />
    </a>
  );
}

function Cites({ ids }: { ids: string[] }) {
  return <>{ids.map((id) => <Cite key={id} id={id} />)}</>;
}

function MarketLine({ m }: { m: MarketFact }) {
  return (
    <li>
      <span>
        <b>{m.entity}</b> — {m.metric}: {m.value} <span className="uth-xs">({m.period}; {m.basis}; confidence {m.confidence})</span>{" "}
        <Ext href={m.url}>source</Ext>
      </span>
    </li>
  );
}

export default function GtmPage() {
  const [rank, setRank] = useState<"All" | GtmRank>("All");
  const [area, setArea] = useState<string>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => Object.fromEntries(GTM_RANKS.map((r) => [r, GTM.items.filter((i) => i.rank === r).length])) as Record<GtmRank, number>, []);
  const items = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GTM.items
      .filter((i) => (rank === "All" || i.rank === rank) && (area === "all" || i.area === area))
      .filter((i) => !needle || [i.title, i.stat, i.reading, i.implication, i.play, i.owner, i.metric, AREA[i.area]].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => GTM_RANKS.indexOf(a.rank) - GTM_RANKS.indexOf(b.rank));
  }, [rank, area, q]);

  const citedIds = useMemo(() => new Set([...GTM.items.flatMap((i) => i.evidenceIds), ...GTM.example.evidenceIds]), []);
  const citedPages = useMemo(() => new Set([...citedIds].map((id) => evidenceById(id)?.page).filter(Boolean)), [citedIds]);
  const verified = EVIDENCE.filter((e) => citedIds.has(e.id) && e.classification === "reported" && e.quoteVerified).length;

  /** Jump to an implication, clearing any filter that would hide it. */
  const goTo = (id: string) => (ev: MouseEvent) => {
    ev.preventDefault();
    setRank("All"); setArea("all"); setQ("");
    requestAnimationFrame(() => {
      const el = document.getElementById(anchor(id));
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${anchor(id)}`);
      el?.focus({ preventScroll: true });
    });
  };
  /** Apply a rank × area filter from the map and jump to the list. */
  const filterTo = (r: GtmRank, a: string) => {
    setRank(r); setArea(a); setQ("");
    requestAnimationFrame(() => document.getElementById("implications")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const csvRows = GTM.items.map((i) => ({
    rank: i.rank, area: AREA[i.area], implication: i.title, statistic: i.stat, statistic_kind: i.statKind,
    reading: i.reading, what_it_means: i.implication, play: i.play, owner: i.owner, leading_metric: i.metric, horizon: i.horizon,
    why_this_rank: i.rankWhy,
    filing_refs: i.evidenceIds.map((id) => { const e = evidenceById(id); return e ? `${e.sourceId === "s1a" ? "S-1/A" : "S-1"} p.${e.page}` : id; }).join("; "),
    deep_dive: `/under-the-hood#${i.deepDive}`,
  }));

  const ex = GTM.example;
  return (
    <div className="uth-root">
      <header className="uth-mast">
        <div className="uth-wrap">
          <div className="uth-mast-top">
            <a href="/under-the-hood" className="gtm-back"><ArrowLeft size={14} aria-hidden /> ANTHROPIC: Under the Hood</a>
            <span className="uth-hide-sm">Primary sources: <a href={SOURCES.s1.url} target="_blank" rel="noreferrer">S-1</a> · <a href={SOURCES.s1a.url} target="_blank" rel="noreferrer">S-1/A</a></span>
          </div>
          <div className="uth-hero">
            <div className="uth-eyebrow">Companion brief · Research cutoff {GTM._meta.asOf}</div>
            <h1 className="uth-title">What it means for <em>Google Cloud AI GTM</em></h1>
            <p className="uth-subtitle">{GTM._meta.subtitle}</p>
            <div className="uth-hero-meta">
              <span>{GTM.items.length} implications, each tied to a verbatim filing quote</span>
              <span>Ranked High / Medium / Low for go-to-market impact</span>
              <span>Independent analysis — not affiliated with Google or Anthropic</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="uth-nav" aria-label="Page sections">
        <div className="uth-wrap">
          <div className="uth-nav-inner">
            {NAV.map((n, i) => <a key={n.id} href={`#${n.id}`}><span>{String(i + 1).padStart(2, "0")}</span>{n.label}</a>)}
            <a href="/under-the-hood"><span>↩</span>Full teardown</a>
          </div>
        </div>
      </nav>

      <main>
        {/* ---------------------------------------------------------- summary */}
        <section className="uth-section gtm-first" aria-label="Summary">
          <div className="uth-wrap">
            <div className="gtm-summary">
              {GTM_RANKS.map((r) => (
                <button key={r} type="button" className={`uth-card gtm-sum ${r.toLowerCase()}`} onClick={() => filterTo(r, "all")} aria-label={`Show ${counts[r]} ${r} implications`}>
                  <RankBadge rank={r} />
                  <span className="gtm-sum-n tnum">{counts[r]}</span>
                  <span className="uth-xs">{GTM._meta.rubric[r]}</span>
                </button>
              ))}
              <div className="uth-card sunk gtm-sum">
                <span className="uth-kpi-label">Evidence</span>
                <span className="gtm-sum-n tnum">{verified}</span>
                <span className="uth-xs">verbatim S-1 and S-1/A quotes cited, across {citedPages.size} filing pages. Click any blue page chip to read the quote.</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- example */}
        <section id="example" className="uth-section" aria-labelledby="example-h">
          <div className="uth-wrap">
            <div className="uth-kicker">01 · The example, checked</div>
            <h2 id="example-h" className="uth-h2">“50% of app customers drive API token share”: right direction, narrower stat</h2>
            <div className="uth-split uth-block">
              <div className="uth-card">
                <div className="uth-h4">The claim we were asked to verify</div>
                <blockquote className="uth-quote">{ex.claim}</blockquote>
                <p style={{ margin: "14px 0 0" }}><Badge tone="medium">Verdict: {ex.verdict}</Badge></p>
                <div className="uth-h4" style={{ marginTop: 18 }}>What the filing actually says</div>
                <p className="uth-p" style={{ margin: 0 }}>{ex.says} <Cites ids={["platform-plus-app"]} /></p>
                <div className="uth-h4" style={{ marginTop: 18 }}>What it does not say</div>
                <ul className="uth-list minus">{ex.doesNotSay.map((d) => <li key={d}><span>{d}</span></li>)}</ul>
                <p className="uth-xs" style={{ marginTop: 10 }}>Supporting figures: ≥$100K cohort <Cite id="cust-100k" /> and its revenue share <Cite id="cust-100k-rev" />; long tail <Cite id="cust-long-tail" />.</p>
              </div>
              <div className="uth-card sunk">
                <div className="uth-h4">So what for Google Cloud</div>
                <p className="uth-p" style={{ marginTop: 0 }}>{ex.soWhat}</p>
                <p className="uth-small" style={{ margin: "0 0 12px" }}>Top-of-funnel evidence: prosumers <Cite id="prosumer-funnel" /> · Claude “often already in use” <Cite id="direct-teams-late" /></p>
                <div className="uth-h4">Google context</div>
                <ul className="uth-list" style={{ fontSize: 13.5 }}>{ex.marketIds.map((id) => marketById(id)).filter((m): m is MarketFact => !!m).map((m) => <MarketLine key={m.id} m={m} />)}</ul>
                <p style={{ margin: "14px 0 0", display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <a href={`#${anchor("app-platform-bundle")}`} onClick={goTo("app-platform-bundle")}>Ranked implication: High →</a>
                  <DeepDive section={ex.deepDive} />
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- moves */}
        <section id="moves" className="uth-section" aria-labelledby="moves-h">
          <div className="uth-wrap">
            <div className="uth-kicker">02 · If you only do six things</div>
            <h2 id="moves-h" className="uth-h2">Six moves the statistics argue for</h2>
            <p className="uth-dek">Each move links to the implications behind it. The moves are analytical recommendations, not facts.</p>
            <ol className="gtm-moves uth-block">
              {GTM.moves.map((m, i) => (
                <li key={m.title} className="uth-card">
                  <div className="gtm-move-n">{i + 1}</div>
                  <h3 className="uth-h3">{m.title}</h3>
                  <p className="uth-small" style={{ margin: "0 0 10px" }}>{m.body}</p>
                  <div className="gtm-refs">
                    {m.refs.map((r) => (
                      <a key={r} href={`#${anchor(r)}`} onClick={goTo(r)}><RankBadge rank={ITEM[r].rank} /> {ITEM[r].title}</a>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------------------------------------------------------- ledger */}
        <section id="ledger" className="uth-section" aria-labelledby="ledger-h">
          <div className="uth-wrap">
            <div className="uth-kicker">03 · Two scorecards</div>
            <h2 id="ledger-h" className="uth-h2">Where Anthropic’s growth pays Google, and where it costs Google</h2>
            <p className="uth-dek">Google Cloud captures Anthropic’s compute spend while Gemini competes with Claude for API dollars and knowledge-work seats. Keep the two columns separate, and don’t add the amounts together: they mix minimums, estimates and amounts outside the $895.4B aggregate.</p>
            <div className="uth-split uth-block">
              {(["pays", "costs"] as const).map((side) => (
                <div key={side} className={`uth-card gtm-ledger ${side}`}>
                  <h3 className="uth-h3">{side === "pays" ? "Pays Google (infrastructure, channel, capital)" : "Costs Google (models, seats, coding, control)"}</h3>
                  <ul className={`uth-list ${side === "pays" ? "plus" : "minus"}`}>
                    {GTM.ledger[side].map((row) => (
                      <li key={row.item}>
                        <span>
                          {row.item} <Cites ids={row.evidenceIds} />
                          {(row.marketIds ?? []).map((id) => { const m = marketById(id); return m ? <span key={id} className="uth-xs"> · <Ext href={m.url}>{m.entity} context</Ext> ({m.basis})</span> : null; })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="uth-xs" style={{ marginTop: 10 }}>Commitment math and double-counting rules: <a href="/under-the-hood#infrastructure">§06 The Infrastructure Bet</a> · channel mix: <a href="/under-the-hood#distribution">§09 Distribution</a>.</p>
          </div>
        </section>

        {/* ---------------------------------------------------------- map */}
        <section id="map" className="uth-section" aria-labelledby="map-h">
          <div className="uth-wrap">
            <div className="uth-kicker">04 · Implication map</div>
            <h2 id="map-h" className="uth-h2">Where the High-ranked implications cluster</h2>
            <p className="uth-dek">Rows are GTM areas, columns are ranks. Click a count to filter the list below.</p>
            <div className="uth-tablewrap uth-block">
              <table className="uth-table gtm-map" style={{ minWidth: 560 }}>
                <caption className="uth-sr">Number of implications by GTM area and rank</caption>
                <thead><tr><th scope="col">GTM area</th>{GTM_RANKS.map((r) => <th key={r} scope="col" className="num">{r}</th>)}<th scope="col" className="num">Total</th></tr></thead>
                <tbody>
                  {GTM.areas.map((a) => {
                    const inArea = GTM.items.filter((i) => i.area === a.id);
                    return (
                      <tr key={a.id}>
                        <th scope="row" className="gtm-rowh">{a.label}</th>
                        {GTM_RANKS.map((r) => {
                          const n = inArea.filter((i) => i.rank === r).length;
                          return (
                            <td key={r} className="num">
                              {n ? <button type="button" className={`gtm-cell ${r.toLowerCase()}`} onClick={() => filterTo(r, a.id)} aria-label={`${n} ${r} implications in ${a.label}`}>{n}</button> : <span className="uth-xs">—</span>}
                            </td>
                          );
                        })}
                        <td className="num"><strong>{inArea.length}</strong></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- list */}
        <section id="implications" className="uth-section" aria-labelledby="imp-h">
          <div className="uth-wrap">
            <div className="uth-kicker">05 · All implications</div>
            <h2 id="imp-h" className="uth-h2">{GTM.items.length} statistics, ranked by what they mean for Google Cloud AI GTM</h2>
            <p className="uth-dek">Every statistic links to its verbatim quote (blue page chip) and to the teardown section that analyzes it. The reading notes say what the number does <em>not</em> mean.</p>

            <div className="gtm-filters uth-block">
              <Seg
                label="Filter by rank"
                value={rank}
                onChange={setRank}
                options={[{ value: "All", label: `All ${GTM.items.length}` }, ...GTM_RANKS.map((r) => ({ value: r, label: `${r} ${counts[r]}` }))]}
              />
              <label className="gtm-search">
                <Search size={14} aria-hidden />
                <span className="uth-sr">Search implications</span>
                <input type="search" className="uth-input" placeholder="Search: TPU, coding, pricing, Japan…" value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
              <DownloadCsv filename="google-cloud-ai-gtm-implications.csv" rows={csvRows} />
            </div>
            <div className="uth-chips" role="group" aria-label="Filter by GTM area" style={{ marginTop: 10 }}>
              <button type="button" className="uth-chip" aria-pressed={area === "all"} onClick={() => setArea("all")}>All areas</button>
              {GTM.areas.map((a) => (
                <button key={a.id} type="button" className="uth-chip" aria-pressed={area === a.id} onClick={() => setArea(a.id)}>
                  {a.label}<span className="ct">{GTM.items.filter((i) => i.area === a.id && (rank === "All" || i.rank === rank)).length}</span>
                </button>
              ))}
            </div>
            <p className="uth-xs" aria-live="polite" style={{ marginTop: 10 }}>
              Showing {items.length} of {GTM.items.length}
              {(rank !== "All" || area !== "all" || q) && <> · <button type="button" className="gtm-link" onClick={() => { setRank("All"); setArea("all"); setQ(""); }}>clear filters</button></>}
            </p>

            {items.length === 0 ? (
              <div className="uth-empty" style={{ marginTop: 16 }}>No implications match these filters.</div>
            ) : (
              <div className="gtm-items">
                {items.map((i, idx) => {
                  const prev = items[idx - 1];
                  return (
                    <div key={i.id}>
                      {(!prev || prev.rank !== i.rank) && (
                        <div className={`gtm-tier ${i.rank.toLowerCase()}`}>
                          <RankBadge rank={i.rank} /> <span>{GTM._meta.rubric[i.rank]}</span>
                        </div>
                      )}
                      <ImplicationCard item={i} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------- method */}
        <section id="method" className="uth-section" aria-labelledby="method-h">
          <div className="uth-wrap">
            <div className="uth-kicker">06 · Method</div>
            <h2 id="method-h" className="uth-h2">How the ranking works</h2>
            <div className="uth-split uth-block">
              <div className="uth-card">
                <div className="uth-h4">Rubric</div>
                <dl className="uth-kv">
                  {GTM_RANKS.map((r) => (<Fragment key={r}><dt><RankBadge rank={r} /></dt><dd>{GTM._meta.rubric[r]}</dd></Fragment>))}
                </dl>
                <p className="uth-small" style={{ marginTop: 14 }}>{GTM._meta.method}</p>
              </div>
              <div className="uth-card sunk">
                <div className="uth-h4">Labels used</div>
                <p className="uth-small" style={{ marginTop: 0 }}><ClassBadge kind="reported" /> a figure or statement in the filing, verified verbatim. <ClassBadge kind="calculated" /> our arithmetic on reported figures, formula in the citation. Ranks, implications and plays are analytical judgment.</p>
                <p className="uth-small">{GTM._meta.disclaimer}</p>
                <p className="uth-small" style={{ marginBottom: 0 }}>Assumptions and limits: <a href="/under-the-hood#sources">§16 Sources and Methodology</a> · data gaps: <a href="/under-the-hood#gaps">§13 What the Filing Is Not Telling Us</a> · competitor playbook: <a href="/under-the-hood#playbook">§15</a>.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="uth-foot">
        <div className="uth-wrap">
          <p style={{ margin: 0 }}><b>What it means for Google Cloud AI GTM</b> — a companion brief to <a href="/under-the-hood">ANTHROPIC: UNDER THE HOOD</a>. Research cutoff {GTM._meta.asOf}. Sources: <a href={SOURCES.s1.url} target="_blank" rel="noreferrer">{SOURCES.s1.label}</a>; <a href={SOURCES.s1a.url} target="_blank" rel="noreferrer">{SOURCES.s1a.label}</a>; external context as linked.</p>
          <p style={{ margin: "8px 0 0" }}>{GTM._meta.disclaimer} Not investment advice.</p>
        </div>
      </footer>
    </div>
  );
}

function ImplicationCard({ item: i }: { item: GtmItem }) {
  const market = i.marketIds.map((id) => marketById(id)).filter((m): m is MarketFact => !!m);
  return (
    <article id={anchor(i.id)} className={`uth-card gtm-item ${i.rank.toLowerCase()}`} tabIndex={-1} aria-labelledby={`${anchor(i.id)}-h`}>
      <div className="gtm-item-head">
        <RankBadge rank={i.rank} />
        <span className="gtm-area">{AREA[i.area]}</span>
        <a className="gtm-perma" href={`#${anchor(i.id)}`} aria-label={`Link to: ${i.title}`}><Link2 size={14} aria-hidden /></a>
      </div>
      <h3 id={`${anchor(i.id)}-h`} className="uth-h3">{i.title}</h3>
      <p className="gtm-stat">
        <ClassBadge kind={i.statKind} /> {i.stat} <Cites ids={i.evidenceIds} />
      </p>
      <div className="gtm-cols">
        <div>
          <div className="uth-h4">What it means for Google Cloud</div>
          <p className="uth-small" style={{ margin: 0 }}>{i.implication}</p>
        </div>
        <div>
          <div className="uth-h4">The play</div>
          <p className="uth-small" style={{ margin: 0 }}>{i.play}</p>
        </div>
      </div>
      <details className="uth-details gtm-more">
        <summary>Reading notes, owner, metric and context</summary>
        <dl className="uth-kv" style={{ marginTop: 10 }}>
          <dt>Read it precisely</dt><dd>{i.reading}</dd>
          <dt>Why {i.rank}</dt><dd>{i.rankWhy}</dd>
          <dt>Owner</dt><dd>{i.owner}</dd>
          <dt>Leading metric</dt><dd>{i.metric}</dd>
          <dt>Horizon</dt><dd>{i.horizon}</dd>
        </dl>
        {market.length > 0 && (
          <>
            <div className="uth-h4" style={{ marginTop: 12 }}>External context</div>
            <ul className="uth-list" style={{ fontSize: 13 }}>{market.map((m) => <MarketLine key={m.id} m={m} />)}</ul>
          </>
        )}
      </details>
      <div className="gtm-item-foot">
        <DeepDive section={i.deepDive} />
        <span className="uth-xs">Horizon: {i.horizon} · Owner: {i.owner}</span>
      </div>
    </article>
  );
}
