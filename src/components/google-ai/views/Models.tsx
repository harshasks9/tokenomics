"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { fmtDate, yearFrac } from "@/lib/google-ai/dates";
import { surfaceLabel } from "@/lib/google-ai/engine/answer";
import { GOOGLE_ID, STAGE_BUCKETS, familyTree, matchesText, modelRows, priceSourceIds, type FamilyTree, type ModelRow, type StageBucket, type TreeLane, type TreeNode } from "@/lib/google-ai/engine/compare";
import { ENTITY_BY_ID, MODELS, RESULTS, providerName } from "@/lib/google-ai/kb";
import type { EvidenceLabel, ModelCategory, PriceRecord } from "@/lib/google-ai/types";
import { Cites, EV_HELP, Empty, EntityLink, Ev, Sec, Seg, Status, compact, providerColor, usd, useHub } from "../ui";
import "./models.css";

const MAX_PICKS = 4;
const WEIGHTS = [
  { id: "all", label: "All" },
  { id: "open", label: "Open weights" },
  { id: "proprietary", label: "Proprietary" },
] as const;
type Weights = (typeof WEIGHTS)[number]["id"];

type SortKey = "name" | "provider" | "introduced" | "context" | "input" | "output" | "stage";
const SORT_VALUE: Record<SortKey, (r: ModelRow) => string | number | undefined> = {
  name: (r) => r.e.name.toLowerCase(),
  provider: (r) => providerName(r.e.providerId).toLowerCase(),
  introduced: (r) => r.e.introducedAt,
  context: (r) => r.spec?.contextTokens ?? undefined,
  input: (r) => r.price.input?.price,
  output: (r) => r.price.output?.price,
  stage: (r) => STAGE_BUCKETS.findIndex((s) => s.id === r.bucket),
};
const ASC_FIRST: SortKey[] = ["name", "provider", "stage"];

const EVIDENCE: EvidenceLabel[] = ["verified-fact", "provider-claim", "independent-measurement", "analyst-interpretation"];

const NR = <span className="gai-muted">not recorded</span>;
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** A token price with its unit named when it is not the usual per-1M-tokens. */
function priceText(p?: PriceRecord) {
  if (!p) return NR;
  return <>{usd(p.price)}{p.unit !== "usd-per-1m-tokens" && <span className="gai-muted gai-small"> ({p.unit.replace(/-/g, " ")})</span>}</>;
}

export default function Models() {
  const { today } = useHub();
  const sp = useSearchParams();
  const rows = useMemo(() => modelRows(today), [today]);
  const providerIds = useMemo(() => {
    const count: Record<string, number> = {};
    for (const e of MODELS) count[e.providerId] = (count[e.providerId] ?? 0) + 1;
    return Object.keys(count).sort((a, b) => (a === GOOGLE_ID ? -1 : b === GOOGLE_ID ? 1 : count[b] - count[a] || a.localeCompare(b)));
  }, []);
  const withIndependent = useMemo(() => new Set(RESULTS.filter((r) => r.reporter === "independent").map((r) => r.modelId)).size, []);
  const wantProvider = sp.get("provider");

  return (
    <>
      <div className="gai-hero">
        <span className="gai-kicker">Models</span>
        <h1 className="gai-h1">Every tracked model, with what is known and what is not</h1>
        <p className="gai-lede">
          Identifiers, limits, modalities and list prices for Google&apos;s models and the competing models they are measured against. Prices are the ones in effect on {fmtDate(today)}; a gap means the fact has not been confirmed, not that it is zero.
        </p>
      </div>

      <div className="gai-grid gai-g4 keep2">
        <div className="gai-card gai-stat"><span className="v">{rows.length}</span><span className="l">models tracked</span></div>
        <div className="gai-card gai-stat"><span className="v">{providerIds.length}</span><span className="l">providers</span></div>
        <div className="gai-card gai-stat"><span className="v">{rows.filter((r) => r.price.input).length}</span><span className="l">with a token list price in effect today</span></div>
        <div className="gai-card gai-stat"><span className="v">{withIndependent}</span><span className="l">with at least one independent benchmark result</span></div>
      </div>

      <Sec id="catalog" title="Model catalog" sub="Filter, sort, and pick up to four models to compare side by side. Each model name opens its dossier.">
        {rows.length === 0 ? (
          <Empty title="No model recorded">The knowledge base holds no model yet, so there is nothing to list.</Empty>
        ) : (
          <Catalog rows={rows} providerIds={providerIds} initialQuery={sp.get("q") ?? ""} />
        )}
      </Sec>

      <Sec id="family-tree" title="Model family tree" sub="One lane per model family. Each model sits at the date it was introduced and is joined to the model it succeeds.">
        {providerIds.length === 0 ? (
          <Empty title="No model recorded">A family tree needs at least one model with an introduction date.</Empty>
        ) : (
          <FamilyTreeView providerIds={providerIds} initial={wantProvider && providerIds.includes(wantProvider) ? wantProvider : providerIds[0]} today={today} />
        )}
      </Sec>

      <Sec id="reading" title="How to read model facts" sub="Four evidence labels are used across the site. They say who is behind a statement, not how likely it is to be true.">
        <div className="gai-grid gai-g2">
          <div className="gai-card">
            <ul className="gai-claims">
              {EVIDENCE.map((l) => (
                <li key={l}>
                  <span><Ev label={l} /></span>
                  <span className="gai-small">{EV_HELP[l]}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="gai-card gai-stack">
            <p>
              <b>Context windows, output limits and knowledge cutoffs are provider-stated.</b> They come from the provider&apos;s own model documentation. They are the published ceiling, not a measurement of how well a model uses a long prompt.
            </p>
            <p>
              <b>List prices are dated.</b> The catalog shows the standard-tier, base-context price in effect today and names the surface it is quoted on. Long-context, batch, regional and cached rates are on each dossier and in Pricing.
            </p>
            <p>
              <b>Stage is as of today.</b> It comes from dated lifecycle events where they exist, otherwise from the stage recorded when the entry was last checked.
            </p>
            <p>
              <b>Gaps are shown as gaps.</b> &ldquo;Not recorded&rdquo; means the fact was not confirmed from a source. Benchmark scores are not in this table because they are only comparable within one benchmark version; see <Link className="gai-link" href="/google-ai/compare">Compare</Link>.
            </p>
          </div>
        </div>
      </Sec>
    </>
  );
}

// ───────────────────────── catalog ─────────────────────────

function Catalog({ rows, providerIds, initialQuery }: { rows: ModelRow[]; providerIds: string[]; initialQuery: string }) {
  const [providers, setProviders] = useState<string[]>([]);
  const [cats, setCats] = useState<ModelCategory[]>([]);
  const [weights, setWeights] = useState<Weights>("all");
  const [stages, setStages] = useState<StageBucket[]>(["ga", "preview"]);
  const [q, setQ] = useState(initialQuery);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "introduced", dir: -1 });
  const [picks, setPicks] = useState<string[]>([]);

  const categories = useMemo(() => [...new Set(rows.flatMap((r) => (r.spec ? [r.spec.category] : [])))].sort(), [rows]);

  const { shown, hidden } = useMemo(() => {
    const tests: { label: string; pass: (r: ModelRow) => boolean }[] = [
      { label: "stage", pass: (r) => stages.includes(r.bucket) },
      { label: "provider", pass: (r) => !providers.length || providers.includes(r.e.providerId) },
      { label: "category", pass: (r) => !cats.length || (!!r.spec && cats.includes(r.spec.category)) },
      { label: "weights", pass: (r) => weights === "all" || (weights === "open" ? r.spec?.openWeights === true : r.spec?.openWeights !== true) },
      { label: "text", pass: (r) => matchesText(r.e, q) },
    ];
    const pass = rows.filter((r) => tests.every((t) => t.pass(r)));
    const value = SORT_VALUE[sort.key];
    pass.sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      // Missing values sort last in either direction: a gap is not a low number.
      if (va == null || vb == null) return va == null ? (vb == null ? 0 : 1) : -1;
      const c = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return c * sort.dir || a.e.name.localeCompare(b.e.name);
    });
    return { shown: pass, hidden: tests.map((t) => ({ label: t.label, n: rows.filter((r) => !t.pass(r)).length })).filter((h) => h.n > 0) };
  }, [rows, stages, providers, cats, weights, q, sort]);

  const sortBy = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: ASC_FIRST.includes(key) ? 1 : -1 }));
  const th = (key: SortKey, label: string, num?: boolean) => (
    <th className={num ? "num" : undefined} aria-sort={sort.key === key ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button type="button" className="sort" onClick={() => sortBy(key)}>
        {label} <span aria-hidden>{sort.key === key ? (sort.dir === 1 ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );
  const retiredHidden = !stages.includes("retired");
  const full = picks.length >= MAX_PICKS;
  const reset = () => {
    setProviders([]);
    setCats([]);
    setWeights("all");
    setStages(["ga", "preview"]);
    setQ("");
  };

  return (
    <>
      <div className="gai-card gai-stack">
        <div className="gai-mc-filter">
          <label htmlFor="gai-mc-q">Find</label>
          <input id="gai-mc-q" className="gai-input gai-mc-search" placeholder="Name, alias or API id" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="gai-mc-filter">
          <span>Provider</span>
          <div className="gai-chipset" role="group" aria-label="Provider">
            {providerIds.map((p) => (
              <button key={p} type="button" className="gai-chip" aria-pressed={providers.includes(p)} onClick={() => setProviders(toggle(providers, p))}>
                <i className="gai-mc-swatch" style={{ background: providerColor(p) }} aria-hidden />{providerName(p)}
              </button>
            ))}
          </div>
        </div>
        {categories.length > 0 && (
          <div className="gai-mc-filter">
            <span>Category</span>
            <div className="gai-chipset" role="group" aria-label="Model category">
              {categories.map((c) => <button key={c} type="button" className="gai-chip" aria-pressed={cats.includes(c)} onClick={() => setCats(toggle(cats, c))}>{c}</button>)}
            </div>
          </div>
        )}
        <div className="gai-mc-filter">
          <span>Weights</span>
          <div><Seg value={weights} onChange={setWeights} options={WEIGHTS} label="Open weights or proprietary" /></div>
        </div>
        <div className="gai-mc-filter">
          <span>Stage</span>
          <div className="gai-chipset" role="group" aria-label="Stage today">
            {STAGE_BUCKETS.map((s) => <button key={s.id} type="button" className="gai-chip" aria-pressed={stages.includes(s.id)} onClick={() => setStages(toggle(stages, s.id))}>{s.label}</button>)}
          </div>
        </div>
      </div>

      <div className="gai-mc-bar">
        <p className="gai-small gai-muted" aria-live="polite">
          <b>{shown.length}</b> of {rows.length} models shown.
          {hidden.length > 0 && (
            <>
              {" "}Filters hide: {hidden.map((h) => `${h.n} by ${h.label}`).join(", ")}
              {hidden.length > 1 ? " (a model can be counted under more than one filter)" : ""}.
              {retiredHidden ? " Deprecated and retired models are hidden by default." : ""}{" "}
              <button type="button" className="gai-link" onClick={reset}>Reset filters</button>
            </>
          )}
        </p>
        <div>
          {picks.map((id) => (
            <button key={id} type="button" className="gai-chip gai-mc-x" aria-label={`Remove ${ENTITY_BY_ID[id]?.name ?? id} from the comparison`} onClick={() => setPicks(picks.filter((x) => x !== id))}>
              {ENTITY_BY_ID[id]?.name ?? id} <b aria-hidden>×</b>
            </button>
          ))}
          {picks.length >= 2 ? (
            <Link className="gai-btn primary" href={`/google-ai/compare?models=${picks.join(",")}`}>Compare selected ({picks.length})</Link>
          ) : (
            <span className="gai-btn gai-mc-off" aria-disabled="true" title="Tick two to four models in the table">Compare selected ({picks.length} of {MAX_PICKS})</span>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <Empty title="No model matches these filters">Clear a filter or the text search. Nothing is hidden other than what the filter line above reports.</Empty>
      ) : (
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead>
              <tr>
                <th><span className="gai-sr">Select for comparison</span></th>
                {th("name", "Model")}
                {th("provider", "Provider")}
                {th("introduced", "Introduced")}
                {th("context", "Context", true)}
                <th>Modalities in → out</th>
                {th("input", "Input / 1M", true)}
                {th("output", "Output / 1M", true)}
                <th>Price basis</th>
                {th("stage", "Stage")}
                <th>Sources</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const { e, spec, price } = r;
                const picked = picks.includes(e.id);
                return (
                  <tr key={e.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="gai-mc-check"
                        checked={picked}
                        disabled={!picked && full}
                        aria-label={`Select ${e.name} for comparison`}
                        title={!picked && full ? `At most ${MAX_PICKS} models can be compared` : undefined}
                        onChange={() => setPicks(picked ? picks.filter((x) => x !== e.id) : [...picks, e.id])}
                      />
                    </td>
                    <td>
                      <Link className="gai-link gai-mc-name" href={`/google-ai/entity/${e.id}`}>{e.name}</Link>
                      {spec?.apiIds[0] && <span className="gai-mc-sub gai-mono">{spec.apiIds[0]}</span>}
                      <span className="gai-mc-meta">
                        {spec && <span className="gai-tag">{spec.category}{spec.tier ? ` · ${spec.tier}` : ""}</span>}
                        {spec?.openWeights && <span className="gai-tag">open weights</span>}
                        {e.verification !== "verified" && <span className="gai-tag">{e.verification.replace("-", " ")}</span>}
                      </span>
                    </td>
                    <td className="gai-mc-nowrap"><i className="gai-mc-swatch" style={{ background: providerColor(e.providerId) }} aria-hidden />{providerName(e.providerId)}</td>
                    <td className="gai-mc-nowrap">{e.introducedAt ? fmtDate(e.introducedAt) : NR}</td>
                    <td className="num">{spec?.contextTokens ? compact(spec.contextTokens) : NR}</td>
                    <td className="gai-small">{spec?.modalitiesIn.length ? spec.modalitiesIn.join(", ") : "not recorded"} → {spec?.modalitiesOut.length ? spec.modalitiesOut.join(", ") : "not recorded"}</td>
                    <td className="num">{priceText(price.input)}</td>
                    <td className="num">{priceText(price.output)}</td>
                    <td className="gai-small">
                      {price.surface && (price.input || price.output) ? (
                        <>
                          {surfaceLabel(price.surface)}{price.surface === "third-party-host" ? " — not the developer's own price" : ""}
                          {price.input?.condition ? ` · ${price.input.condition}` : ""}
                          <span className="gai-mc-meta"><Ev label={(price.input ?? price.output)!.label} short /><Cites ids={priceSourceIds(price)} /></span>
                        </>
                      ) : (
                        <span className="gai-muted">no token price in effect today</span>
                      )}
                    </td>
                    <td><Status status={r.status} short /></td>
                    <td className="gai-mc-nowrap"><Cites ids={e.sourceIds} align="right" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
        Prices are standard-tier list prices in US dollars per 1M tokens at the base context tier, in effect today. Where a model is priced on more than one surface, the first recorded surface is shown and named.
      </p>
    </>
  );
}

// ───────────────────────── family tree ─────────────────────────

const W = 960;
const LEFT = 150;
/** Inner margins of the time axis, so a label centred over the first or last model stays inside the plot. */
const INSET = 56;
const RIGHT = 64;
const TOP = 30;
const BOTTOM = 26;
const SUB = 36;
const PAD = 6;
const MAX_ROWS = 7;
const MAX_CH = 22;
const VIEWS = [
  { id: "chart", label: "Chart" },
  { id: "table", label: "Table" },
] as const;

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/** A lane name on at most two lines of about `n` characters. */
function twoLines(name: string, n = 22): string[] {
  if (name.length <= n) return [name];
  const cut = name.lastIndexOf(" ", n);
  const at = cut > 6 ? cut : n;
  return [name.slice(0, at), clip(name.slice(at).trim(), n)];
}

interface Placed {
  node: TreeNode;
  lane: TreeLane;
  x: number;
  y: number;
  labelled: boolean;
}

/** Pixel layout: time on x, one band per lane, models that would collide stacked on sub-rows inside the band. */
function layoutTree(tree: FamilyTree, today: string) {
  const now = yearFrac(today);
  const ts = tree.lanes.flatMap((l) => l.nodes.map((n) => n.t));
  const t0 = Math.floor(Math.min(now, ...ts));
  const t1 = Math.max(t0 + 1, Math.ceil(Math.max(now, ...ts)));
  const x = (t: number) => LEFT + INSET + ((t - t0) / (t1 - t0)) * (W - LEFT - INSET - RIGHT);
  const span = t1 - t0;
  const step = span <= 10 ? 1 : span <= 24 ? 2 : 5;
  const years: number[] = [];
  for (let y = Math.ceil(t0 / step) * step; y <= t1; y += step) years.push(y);

  const placed: Record<string, Placed> = {};
  const bands: { lane: TreeLane; top: number; height: number }[] = [];
  let top = TOP;
  for (const lane of tree.lanes) {
    const ends: number[] = [];
    for (const node of lane.nodes) {
      const px = x(node.t);
      // The name sits centred above its marker, so succession lines along the row never run through it.
      const half = (Math.min(node.e.name.length, MAX_CH) * 6.3) / 2 + 5;
      let row = ends.findIndex((end) => end <= px - half);
      let labelled = true;
      if (row < 0) {
        if (ends.length < MAX_ROWS) row = ends.push(0) - 1;
        else {
          row = ends.indexOf(Math.min(...ends));
          labelled = false;
        }
      }
      ends[row] = labelled ? px + half : Math.max(ends[row], px + 10);
      placed[node.e.id] = { node, lane, x: px, y: top + PAD + row * SUB + 25, labelled };
    }
    const height = PAD * 2 + Math.max(1, ends.length) * SUB;
    bands.push({ lane, top, height });
    top += height;
  }
  return { placed, bands, years, x, nowX: x(now), H: top + BOTTOM, t0, t1, bottom: top };
}

function NodeMark({ bucket, color, r = 6 }: { bucket: StageBucket; color: string; r?: number }) {
  return (
    <>
      <circle r={r + 1} fill="var(--surface)" />
      {bucket === "preview" ? <circle r={r - 1} fill="var(--surface)" stroke={color} strokeWidth="2" /> : <circle r={r} fill={color} fillOpacity={bucket === "retired" ? 0.3 : 1} />}
    </>
  );
}

function LaneLabel({ name, y, strong }: { name: string; y: number; strong?: boolean }) {
  const lines = twoLines(name);
  return (
    <text className={strong ? "lbl" : undefined} x={6} y={y + 4 - (lines.length - 1) * 7}>
      {lines.map((l, i) => <tspan key={i} x={6} dy={i ? 14 : 0}>{l}</tspan>)}
    </text>
  );
}

function FamilyTreeView({ providerIds, initial, today }: { providerIds: string[]; initial: string; today: string }) {
  const [pid, setPid] = useState(initial);
  const [view, setView] = useState<"chart" | "table">("chart");
  const [hover, setHover] = useState<string | null>(null);
  const tree = useMemo(() => familyTree(pid, today), [pid, today]);
  const lay = useMemo(() => layoutTree(tree, today), [tree, today]);
  const color = providerColor(pid);
  const dated = tree.lanes.reduce((n, l) => n + l.nodes.length, 0);
  const succeeds = (id: string) => tree.edges.filter((x) => x.from === id);
  const tip = hover ? lay.placed[hover] : undefined;
  // On a narrow screen the chart scrolls sideways; start at the recent end, where most models are.
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [pid, view]);

  return (
    <>
      <div className="gai-mc-bar" style={{ marginTop: 0 }}>
        <div>
          <label className="gai-small gai-row" htmlFor="gai-mc-tree-provider">
            Provider
            <select id="gai-mc-tree-provider" className="gai-select" value={pid} onChange={(e) => { setPid(e.target.value); setHover(null); }}>
              {providerIds.map((p) => <option key={p} value={p}>{providerName(p)}</option>)}
            </select>
          </label>
          <span className="gai-small gai-muted">{dated} dated {dated === 1 ? "model" : "models"} in {tree.lanes.length} {tree.lanes.length === 1 ? "lane" : "lanes"} · {tree.edges.length} succession {tree.edges.length === 1 ? "link" : "links"}</span>
        </div>
        <Seg value={view} onChange={setView} options={VIEWS} label="Family tree view" />
      </div>

      {dated === 0 ? (
        <Empty title={`No dated model recorded for ${providerName(pid)}`}>
          {tree.models === 0 ? "No model is recorded for this provider." : "None of this provider's models has an introduction date, so none can be placed on a time axis. They are listed below."}
        </Empty>
      ) : view === "chart" ? (
        <div className="gai-card">
          <p className="gai-small gai-muted gai-mc-hint">Scroll sideways for earlier years.</p>
          <div className="gai-mc-scroll" ref={scroller}>
            <div className="gai-mc-plot">
              <svg className="gai-chart" viewBox={`0 0 ${W} ${lay.H}`} role="img" aria-label={`Model family timeline for ${providerName(pid)}: ${dated} models in ${tree.lanes.length} lanes, ${lay.t0} to ${lay.t1}, placed by introduction date. The table view lists every model and what it succeeds.`}>
                {lay.years.map((y) => (
                  <g key={y}>
                    <line className="grid" x1={lay.x(y)} x2={lay.x(y)} y1={TOP - 8} y2={lay.bottom} />
                    <text x={lay.x(y)} y={14} textAnchor="middle">{y}</text>
                  </g>
                ))}
                {lay.bands.map((b) => (
                  <g key={b.lane.id}>
                    <line className="grid" x1={0} x2={W} y1={b.top} y2={b.top} />
                    {b.lane.entityId ? (
                      <a href={`/google-ai/entity/${b.lane.entityId}`} aria-label={`${b.lane.name} family dossier`}>
                        <LaneLabel name={b.lane.name} y={b.top + b.height / 2} strong />
                      </a>
                    ) : (
                      <LaneLabel name={b.lane.name} y={b.top + b.height / 2} />
                    )}
                  </g>
                ))}
                <line className="axis" x1={0} x2={W} y1={lay.bottom} y2={lay.bottom} />
                <line x1={lay.nowX} x2={lay.nowX} y1={TOP - 8} y2={lay.bottom + 6} stroke="var(--ink-2)" strokeWidth="1" />
                <text className="lbl" x={lay.nowX} y={lay.bottom + 19} textAnchor="middle">today · {fmtDate(today)}</text>
                {tree.edges.map((ed) => {
                  const a = lay.placed[ed.to];
                  const b = lay.placed[ed.from];
                  const on = hover === ed.from || hover === ed.to;
                  const mx = (a.x + b.x) / 2;
                  return <path key={ed.rel.id} d={`M${a.x} ${a.y} C${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`} fill="none" stroke={on ? "var(--ink-2)" : "var(--line-2)"} strokeWidth={on ? 2 : 1.5} />;
                })}
                {Object.values(lay.placed).map((p) => {
                  const { e } = p.node;
                  const on = hover === e.id;
                  return (
                    <a
                      key={e.id}
                      className="gai-mc-node"
                      href={`/google-ai/entity/${e.id}`}
                      aria-label={`${e.name}, introduced ${fmtDate(e.introducedAt)}, ${STAGE_BUCKETS.find((s) => s.id === p.node.bucket)?.label}. Open dossier.`}
                      onMouseEnter={() => setHover(e.id)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(e.id)}
                      onBlur={() => setHover(null)}
                    >
                      <g transform={`translate(${p.x} ${p.y})`}>
                        <circle className="gai-mc-ring" r={11} />
                        <NodeMark bucket={p.node.bucket} color={color} r={on ? 7 : 6} />
                      </g>
                      {(p.labelled || on) && <text className={on ? "lbl" : "gai-mc-nlabel"} x={p.x} y={p.y - 11} textAnchor="middle">{clip(e.name, MAX_CH)}</text>}
                    </a>
                  );
                })}
              </svg>
              {tip && (
                <div
                  className="gai-tip"
                  style={{
                    left: `${(tip.x / W) * 100}%`,
                    top: `${(tip.y / lay.H) * 100}%`,
                    transform: `translate(${tip.x > W * 0.75 ? "-100%" : tip.x < W * 0.25 ? "0" : "-50%"}, ${tip.y < 100 ? "14px" : "calc(-100% - 26px)"})`,
                  }}
                >
                  <b>{tip.node.e.name}</b>
                  <span className="gai-mc-tip-line">Introduced {fmtDate(tip.node.e.introducedAt)} · {STAGE_BUCKETS.find((s) => s.id === tip.node.bucket)?.label} today</span>
                  <span className="gai-mc-tip-line">{tip.lane.name}</span>
                  {succeeds(tip.node.e.id).map((s) => <span key={s.rel.id} className="gai-mc-tip-line">Succeeds {ENTITY_BY_ID[s.to]?.name ?? s.to}</span>)}
                </div>
              )}
            </div>
          </div>
          <div className="gai-mc-keys" aria-label="Legend">
            {STAGE_BUCKETS.map((s) => (
              <span key={s.id}>
                <svg width="16" height="16" viewBox="-8 -8 16 16" aria-hidden><NodeMark bucket={s.id} color={color} /></svg>
                {s.label}
              </span>
            ))}
            <span>
              <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden><path d="M1 12 C11 12, 11 4, 21 4" fill="none" stroke="var(--line-2)" strokeWidth="1.5" /></svg>
              succeeds (newer model on the right)
            </span>
          </div>
          <p className="gai-small gai-muted" style={{ marginTop: 6 }}>
            Horizontal position is the introduction date in the knowledge base; vertical position inside a lane only separates models that would overlap. Stage is as of today. Hover or focus a model for details; click to open its dossier.
            {Object.values(lay.placed).some((p) => !p.labelled) ? " Some names are omitted where models are too close together; the table view lists all of them." : ""}
          </p>
        </div>
      ) : (
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead><tr><th>Family</th><th>Model</th><th>Introduced</th><th>Stage today</th><th>Succeeds</th><th>Sources</th></tr></thead>
            <tbody>
              {tree.lanes.flatMap((lane) =>
                lane.nodes.map((n) => {
                  const prev = succeeds(n.e.id);
                  return (
                    <tr key={n.e.id}>
                      <td>{lane.entityId ? <Link className="gai-link" href={`/google-ai/entity/${lane.entityId}`}>{lane.name}</Link> : <span className="gai-muted">{lane.name}</span>}</td>
                      <td><Link className="gai-link" href={`/google-ai/entity/${n.e.id}`}>{n.e.name}</Link></td>
                      <td className="gai-mc-nowrap">{fmtDate(n.e.introducedAt)}</td>
                      <td><Status status={n.status} short /></td>
                      <td>
                        {prev.length === 0 ? <span className="gai-muted">no predecessor recorded</span> : prev.map((s) => (
                          <span key={s.rel.id} className="gai-mc-meta" style={{ marginTop: 0 }}>
                            <Link className="gai-link" href={`/google-ai/entity/${s.to}`}>{ENTITY_BY_ID[s.to]?.name ?? s.to}</Link>
                            <Ev label={s.rel.label} short /><Cites ids={s.rel.sourceIds} />
                          </span>
                        ))}
                      </td>
                      <td className="gai-mc-nowrap"><Cites ids={n.e.sourceIds} align="right" /></td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>
      )}

      {tree.undated.length > 0 && (
        <div className="gai-card" style={{ marginTop: 12 }}>
          <h3 className="gai-h3">Undated — not placed on the timeline ({tree.undated.length})</h3>
          <p className="gai-small gai-muted" style={{ margin: "2px 0 8px" }}>No introduction date is recorded for these models, so they are listed rather than given a guessed position.</p>
          <div className="gai-chipset">{tree.undated.map((e) => <EntityLink key={e.id} id={e.id} />)}</div>
        </div>
      )}
      {(tree.undrawn.length > 0 || tree.emptyFamilies.length > 0) && (
        <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
          {tree.undrawn.length > 0 && `${tree.undrawn.length} succession ${tree.undrawn.length === 1 ? "link is" : "links are"} not drawn because one of the two models is undated. `}
          {tree.emptyFamilies.length > 0 && <>Families with no dated model, not drawn as lanes: {tree.emptyFamilies.map((f, i) => <span key={f.id}>{i ? ", " : ""}<Link className="gai-link" href={`/google-ai/entity/${f.id}`}>{f.name}</Link></span>)}.</>}
        </p>
      )}
    </>
  );
}
