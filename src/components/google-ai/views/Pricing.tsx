"use client";

import "./pricing.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { addDays, daysBetween, fmtDate, inEffect } from "@/lib/google-ai/dates";
import { SCENARIOS } from "@/lib/google-ai/editorial";
import { estimate, upcomingChanges, type CostEstimate } from "@/lib/google-ai/engine/pricing";
import {
  LINE_KIND_LABEL,
  METER_LABEL,
  PRICE_BY_ID,
  SURFACE_FILTER_LABEL,
  TIER_LABEL,
  UNIT_LABEL,
  bestHistory,
  buildPriceRows,
  changePct,
  costMix,
  dateTicks,
  defaultHistoryModels,
  formFromScenario,
  groupUpcoming,
  historyCandidates,
  infrastructureEconomics,
  isInfraRecord,
  isPlanRecord,
  isTokenRecord,
  lineKind,
  linearTicks,
  logTicks,
  otherMeterRecords,
  parseSavedRuns,
  priceFacts,
  pricedEntities,
  recordsByEntity,
  scenarioFromForm,
  segmentOn,
  sortPriceRows,
  spreadLabels,
  stepSegments,
  surfaceName,
  tableOptions,
  tokenPoints,
  tokenSurfacesFor,
  type BatchDiscount,
  type EntityRecords,
  type HistoryMeter,
  type PricedEntity,
  type SavedRun,
  type SortKey,
  type StepSegment,
  type WorkloadForm,
} from "@/lib/google-ai/engine/pricing-view";
import { ENTITY_BY_ID, PRICES, PRICES_BY_ENTITY, entityName, providerName } from "@/lib/google-ai/kb";
import type { EvidenceLabel, PriceRecord, PriceSurface, ServiceTier } from "@/lib/google-ai/types";
import { Cites, Claims, Empty, Ev, Sec, Seg, compact, usd, useHub } from "../ui";

const TABS = [
  { id: "prices", label: "Prices" },
  { id: "calculator", label: "Calculator" },
  { id: "history", label: "Price history" },
  { id: "plans", label: "Plans and licences" },
  { id: "infrastructure", label: "Infrastructure" },
] as const;
type Tab = (typeof TABS)[number]["id"];

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const STORE_KEY = "gai-pricing-scenarios";
const MAX_CALC_MODELS = 4;
const UPCOMING_ITEMS = 2;
const UPCOMING_GROUPS = 4;
const MAX_HISTORY_MODELS = 5;
/** Fixed categorical slots for chart series: a model keeps its colour while it stays selected. */
const SLOT_COLOR = ["var(--s1)", "var(--s2)", "var(--s3)", "var(--s4)", "var(--s7)"];
const FALLBACK_FORM: WorkloadForm = { requestsPerMonth: "100000", inputTokens: "2000", outputTokens: "500", cachedPct: "0", batchPct: "0", thinkingRatio: "0", attemptsPerTask: "1" };

/** Dollars, without ever rounding a real cost down to zero. */
function money(n: number): string {
  if (n > 0 && n < 0.0001) return "< $0.0001";
  return usd(n);
}
function pct(x: number): string {
  return `${(x * 100).toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}
function signedPct(x: number): string {
  return `${x > 0 ? "+" : x < 0 ? "−" : ""}${pct(Math.abs(x))}`;
}
function tokensM(n: number): string {
  return `${n.toLocaleString("en-US", { maximumFractionDigits: n >= 100 ? 0 : n >= 1 ? 2 : 4 })}M`;
}
function uniq<T>(xs: T[]): T[] {
  return [...new Set(xs)];
}
const r1 = (n: number) => Math.round(n * 10) / 10;

// ───────────────────────── shared parts ─────────────────────────

/** Link to a dossier; an id that is not in the knowledge base stays plain text so nothing links to a dead page. */
function ModelLink({ id }: { id: string }) {
  if (!ENTITY_BY_ID[id]) return <span title="Not yet in the knowledge base">{id}</span>;
  return <Link className="gai-link" href={`/google-ai/entity/${id}`}>{ENTITY_BY_ID[id].name}</Link>;
}

function EvCell({ labels, sourceIds, checked, align }: { labels: EvidenceLabel[]; sourceIds: string[]; checked?: string; align?: "right" }) {
  return (
    <span className="gai-pr-evcell">
      {labels.map((l) => <Ev key={l} label={l} short />)}
      <Cites ids={sourceIds} align={align} />
      {checked && <span className="gai-muted gai-small">checked {fmtDate(checked)}</span>}
    </span>
  );
}

/** A researcher's note on a record. Long notes are cut to one line with a control to read the rest. */
function NoteText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 96;
  return (
    <span className="gai-pr-cond gai-pr-notetext">
      {long && !open ? `${text.slice(0, 84).trimEnd()}… ` : `${text} `}
      {long && <button type="button" className="gai-link" aria-expanded={open} onClick={() => setOpen((v) => !v)}>{open ? "less" : "more"}</button>}
    </span>
  );
}

/** Conditions attached to a price, in the provider's words, shown under the number. */
function Terms({ rec, wantRegion, notes = true }: { rec: PriceRecord; wantRegion?: "global" | "regional"; notes?: boolean }) {
  const have = rec.region ?? "global";
  return (
    <>
      {rec.condition && <span className="gai-pr-cond">{rec.condition}</span>}
      {rec.effectiveTo && <span className="gai-pr-cond">until {fmtDate(rec.effectiveTo)}</span>}
      {notes && rec.note && <NoteText text={rec.note} />}
      {wantRegion && have !== wantRegion && <span className="gai-pr-cond">{have} endpoint rate — no {wantRegion} price recorded</span>}
    </>
  );
}

function PriceCell({ rec, wantRegion, threshold }: { rec?: PriceRecord; wantRegion?: "global" | "regional"; threshold?: number }) {
  if (!rec) return <span className="gai-muted" title="No price published for this meter">—<span className="gai-sr"> not published</span></span>;
  return (
    <>
      <span className="gai-pr-price">{usd(rec.price)}</span>
      {threshold != null && <span className="gai-pr-cond">prompts above {compact(threshold)} tokens</span>}
      <Terms rec={rec} wantRegion={wantRegion} notes={false} />
    </>
  );
}

function DateField({ id, label, date, setDate, today, max }: { id: string; label: string; date: string; setDate: (d: string) => void; today: string; max: string }) {
  return (
    <div className="gai-pr-field">
      <label htmlFor={id}>{label}</label>
      <div className="gai-row">
        <input
          id={id}
          className="gai-input"
          type="date"
          value={date}
          max={max}
          onChange={(e) => {
            const v = e.target.value;
            if (ISO.test(v)) setDate(v > max ? max : v);
          }}
        />
        {date !== today && <button type="button" className="gai-btn" onClick={() => setDate(today)}>Back to today</button>}
      </div>
    </div>
  );
}

function AsOfBanner({ date, today }: { date: string; today: string }) {
  if (date === today) return null;
  return (
    <div className="gai-warn gai-pr-banner" role="status">
      Showing prices in effect on <b>{fmtDate(date)}</b>.{" "}
      {date > today
        ? "That is a future date: only prices already published for it are applied. Changes not yet announced cannot be known."
        : `That is ${daysBetween(date, today).toLocaleString("en-US")} days before today; later prices are left out.`}
    </div>
  );
}

/** Generic list of price records: one row per record, with its terms, dates, evidence and sources. */
function RecordTable({ rows, showEntity }: { rows: PriceRecord[]; showEntity?: boolean }) {
  return (
    <div className="gai-tablewrap">
      <table className="gai-table">
        <thead>
          <tr>
            {showEntity && <th>Product</th>}
            <th>Where</th>
            <th>What is priced</th>
            <th>Tier</th>
            <th className="num">List price</th>
            <th>In effect</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id}>
              {showEntity && <td className="gai-pr-model"><ModelLink id={p.entityId} /><div className="gai-small gai-muted">{providerName(p.providerId)}</div></td>}
              <td>{surfaceName(p.surface, p.providerId)}{p.region === "regional" ? " · regional endpoint" : ""}</td>
              <td>
                {METER_LABEL[p.meter]}
                {p.aboveContextTokens != null ? ` · prompts above ${compact(p.aboveContextTokens)} tokens` : ""}
                <Terms rec={p} />
              </td>
              <td>{TIER_LABEL[p.tier]}</td>
              <td className="num"><span className="gai-pr-price">{usd(p.price)}</span> <span className="gai-small gai-muted">{UNIT_LABEL[p.unit]}</span></td>
              <td className="gai-small">
                {fmtDate(p.effectiveFrom)}{p.effectiveTo ? ` – ${fmtDate(p.effectiveTo)}` : " onward"}
                {p.publishedAt && p.publishedAt !== p.effectiveFrom ? <div className="gai-muted">published {fmtDate(p.publishedAt)}</div> : null}
              </td>
              <td><EvCell labels={[p.label]} sourceIds={p.sourceIds} checked={p.lastCheckedAt} align="right" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ───────────────────────── page ─────────────────────────

export default function Pricing() {
  const { today } = useHub();
  const sp = useSearchParams();
  const qTab = sp.get("tab");
  const qScenario = sp.get("scenario");
  const qModel = sp.get("model");
  const [tab, setTab] = useState<Tab>(() => (TABS.some((t) => t.id === qTab) ? (qTab as Tab) : qScenario || qModel ? "calculator" : "prices"));
  const [date, setDate] = useState(today);
  const [allUpcoming, setAllUpcoming] = useState(false);
  const maxDate = addDays(today, 365);

  const facts = useMemo(() => priceFacts(today), [today]);
  const upcoming = useMemo(() => groupUpcoming(upcomingChanges(today), today), [today]);

  return (
    <div className="gai-pr">
      <div className="gai-hero">
        <span className="gai-kicker">Pricing and AI economics</span>
        <h1 className="gai-h1">What it costs, and from which date.</h1>
        <p className="gai-lede">
          Published list prices for Google&apos;s AI models and the alternatives. Every price carries the date it takes effect, the evidence behind it and the day it was last checked, so a price that is announced is never confused with a price that applies.
        </p>
      </div>

      <div className="gai-grid gai-g4 keep2">
        <div className="gai-card gai-stat"><span className="v">{facts.total.toLocaleString("en-US")}</span><span className="l">price records{facts.entities ? ` across ${facts.entities} products` : ""}</span></div>
        <div className="gai-card gai-stat"><span className="v">{facts.inEffect.toLocaleString("en-US")}</span><span className="l">in effect today, {fmtDate(today)}</span></div>
        <div className="gai-card gai-stat"><span className="v">{facts.scheduled.toLocaleString("en-US")}</span><span className="l">published with a future effective date</span></div>
        <div className="gai-card gai-stat"><span className="v">{facts.lastChecked ? fmtDate(facts.lastChecked) : "—"}</span><span className="l">{facts.lastChecked ? "most recent check of a price against its source" : "no price has been checked yet"}</span></div>
      </div>
      {facts.total === 0 && (
        <div className="gai-warn" style={{ marginTop: 12 }}>
          No price is recorded in the knowledge base yet. Every section below says so rather than showing an example figure.
        </div>
      )}

      {upcoming.length > 0 && (
        <Sec
          id="upcoming"
          title="Upcoming price changes"
          sub="Prices that are published but not yet in effect. Until the effective date, the current price applies — a quote or a budget for today should use the left-hand figure."
        >
          <div className="gai-grid gai-g2">
            {(allUpcoming ? upcoming : upcoming.slice(0, UPCOMING_GROUPS)).map((g) => (
              <section key={g.entityId} className="gai-card">
                <div className="gai-pr-card-head">
                  <h3 className="gai-h3"><ModelLink id={g.entityId} /></h3>
                  <span className="gai-small gai-muted">{g.items.length} scheduled {g.items.length === 1 ? "change" : "changes"} · first on {fmtDate(g.first)}</span>
                </div>
                <UpcomingList items={g.items} />
              </section>
            ))}
          </div>
          {upcoming.length > UPCOMING_GROUPS && (
            <button type="button" className="gai-btn" aria-expanded={allUpcoming} onClick={() => setAllUpcoming((v) => !v)} style={{ marginTop: 12 }}>
              {allUpcoming ? "Show fewer products" : `Show all ${upcoming.length} products with a scheduled change`}
            </button>
          )}
        </Sec>
      )}

      <div className="gai-pr-tabs">
        <Seg value={tab} onChange={setTab} options={TABS} label="Pricing sections" />
      </div>

      <div className="gai-pr-panel">
        {tab === "prices" && <PricesTab date={date} setDate={setDate} today={today} maxDate={maxDate} />}
        {tab === "calculator" && <CalculatorTab date={date} setDate={setDate} today={today} maxDate={maxDate} qScenario={qScenario} qModel={qModel} />}
        {tab === "history" && <HistoryTab today={today} />}
        {tab === "plans" && <PlansTab date={date} setDate={setDate} today={today} maxDate={maxDate} />}
        {tab === "infrastructure" && <InfrastructureTab date={date} setDate={setDate} today={today} maxDate={maxDate} />}
      </div>

      <Sec id="how-to-read" title="How to read these prices">
        <dl className="gai-card pad-lg gai-pr-read">
          <div>
            <dt>List price, not negotiated price</dt>
            <dd>These are the prices providers publish. Committed-spend discounts, enterprise agreements and credits are private and are not shown, so a large buyer may pay less.</dd>
          </div>
          <div>
            <dt>Published date and effective date</dt>
            <dd>A price can be announced weeks before it applies. Each record keeps both dates; a price counts as in effect only from its effective date.</dd>
          </div>
          <div>
            <dt>Global and regional endpoints</dt>
            <dd>Some models are priced apart when served from a specific region instead of the global endpoint. Where no regional price is recorded, the table says which rate it is showing.</dd>
          </div>
          <div>
            <dt>Reasoning tokens bill as output</dt>
            <dd>Tokens a model spends thinking are normally charged at the output rate even though they are not in the answer. They can outweigh the visible output.</dd>
          </div>
          <div>
            <dt>Caching and batch have conditions</dt>
            <dd>Cache-read rates apply only to the part of a prompt that is reused, and writing or storing a cache can be metered separately. Batch rates trade a lower price for delayed results.</dd>
          </div>
          <div>
            <dt>Checked on the date shown</dt>
            <dd>Each record shows the day it was last verified against its source. A price may have changed since; open the source before relying on it.</dd>
          </div>
        </dl>
      </Sec>
    </div>
  );
}

function UpcomingList({ items }: { items: { next: PriceRecord; current?: PriceRecord; days: number }[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? items : items.slice(0, UPCOMING_ITEMS);
  return (
    <>
      <ul className="gai-claims" style={{ marginTop: 8 }}>
        {shown.map((c) => {
          const { next, current, days } = c;
          const delta = changePct(c);
          return (
            <li key={next.id}>
              <span className="gai-small">
                <b>{METER_LABEL[next.meter]}</b> · {surfaceName(next.surface, next.providerId)} · {TIER_LABEL[next.tier]} tier
                {next.region === "regional" ? " · regional endpoint" : ""}
                {next.aboveContextTokens != null ? ` · prompts above ${compact(next.aboveContextTokens)} tokens` : ""}
              </span>
              <span className="gai-pr-change">
                {current ? usd(current.price) : <span className="gai-muted">no current price recorded</span>} → <b>{usd(next.price)}</b>{" "}
                <span className="gai-small gai-muted">{UNIT_LABEL[next.unit]}{delta != null ? ` · ${signedPct(delta)}` : ""}</span>
              </span>
              <span className="gai-small">
                <span className="gai-pr-when">{fmtDate(next.effectiveFrom)} · in {days} {days === 1 ? "day" : "days"}</span>{" "}
                {current ? `${usd(current.price)} applies until then.` : "Nothing is recorded as in effect before then."}
                {next.publishedAt ? ` Published ${fmtDate(next.publishedAt)}.` : ""}
              </span>
              {(next.condition || next.note) && (
                <span>
                  {next.condition && <span className="gai-pr-cond">{next.condition}</span>}
                  {next.note && <NoteText text={next.note} />}
                </span>
              )}
              <span className="gai-claim-meta">
                <Ev label={next.label} short />
                <Cites ids={uniq([...next.sourceIds, ...(current?.sourceIds ?? [])])} />
                <span className="gai-muted gai-small">checked {fmtDate(next.lastCheckedAt)}</span>
              </span>
            </li>
          );
        })}
      </ul>
      {items.length > UPCOMING_ITEMS && (
        <button type="button" className="gai-link gai-small" aria-expanded={all} onClick={() => setAll((v) => !v)} style={{ marginTop: 8 }}>
          {all ? "Show fewer" : `Show all ${items.length} scheduled changes`}
        </button>
      )}
    </>
  );
}

interface DateProps {
  date: string;
  setDate: (d: string) => void;
  today: string;
  maxDate: string;
}

// ───────────────────────── 3. token price table ─────────────────────────

function SortTh({ k, label, sort, onSort, num }: { k: SortKey; label: ReactNode; sort: { key: SortKey; dir: "asc" | "desc" }; onSort: (k: SortKey) => void; num?: boolean }) {
  const on = sort.key === k;
  return (
    <th className={num ? "num" : undefined} aria-sort={on ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
      <button type="button" className="sort" onClick={() => onSort(k)}>
        {label} <span aria-hidden>{on ? (sort.dir === "asc" ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );
}

function BatchCell({ batch }: { batch?: BatchDiscount }) {
  if (!batch) return <span className="gai-muted" title="No batch price published alongside a standard price">—<span className="gai-sr"> not derivable</span></span>;
  const { input, output } = batch;
  const same = input != null && output != null && Math.abs(input - output) < 0.005;
  return (
    <>
      <span className="gai-pr-price">
        {same || output == null ? signedPct(-(input as number)) : input == null ? signedPct(-output) : `in ${signedPct(-input)} · out ${signedPct(-output)}`}
      </span>
      {!same && (input == null || output == null) && <span className="gai-pr-cond">{input == null ? "output only" : "input only"}</span>}
      <span className="gai-pr-cond" title="Not a published figure: the published batch rate divided by the published standard rate, same endpoint and date.">
        derived <Cites ids={uniq(batch.records.flatMap((r) => r.sourceIds))} align="right" />
      </span>
    </>
  );
}

function PricesTab({ date, setDate, today, maxDate }: DateProps) {
  const [surface, setSurface] = useState<PriceSurface | "all">("all");
  const [tier, setTier] = useState<ServiceTier>("standard");
  const [region, setRegion] = useState<"global" | "regional">("global");
  const [providers, setProviders] = useState<string[]>([]);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "default", dir: "asc" });

  const opts = useMemo(() => tableOptions(date), [date]);
  // A filter value that has no data on this date falls back instead of producing a silently empty table.
  const surfaceOn = surface !== "all" && opts.surfaces.includes(surface) ? surface : "all";
  const tierOn = opts.tiers.includes(tier) ? tier : opts.tiers[0] ?? "standard";
  const regionOn = opts.regional ? region : "global";
  const providerKey = providers.filter((p) => opts.providers.includes(p)).join("|");

  const rows = useMemo(
    () => sortPriceRows(buildPriceRows({ date, surface: surfaceOn, tier: tierOn, region: regionOn, providers: providerKey ? providerKey.split("|") : [] }), sort.key, sort.dir),
    [date, surfaceOn, tierOn, regionOn, providerKey, sort],
  );
  const others = useMemo(() => otherMeterRecords(date), [date]);
  const hasLong = rows.some((r) => r.long.length > 0);
  const hasBatch = rows.some((r) => r.batch);
  const tokenRecords = useMemo(() => PRICES.filter(isTokenRecord).length, []);

  const onSort = (k: SortKey) => setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "asc" }));
  const toggleProvider = (p: string) => setProviders((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  return (
    <Sec id="prices" title="Token prices" sub="List prices in US dollars per one million tokens, for the surface, tier and date you choose. A dash means no price is published for that meter — it does not mean free.">
      <div className="gai-pr-controls">
        <DateField id="gai-pr-asof" label="Prices as of" date={date} setDate={setDate} today={today} max={maxDate} />
        {opts.surfaces.length > 1 && (
          <div className="gai-pr-field">
            <span className="gai-pr-lab">Surface</span>
            <Seg value={surfaceOn} onChange={setSurface} options={[{ id: "all" as const, label: "All" }, ...opts.surfaces.map((s) => ({ id: s, label: SURFACE_FILTER_LABEL[s] }))]} label="Surface" />
          </div>
        )}
        {opts.tiers.length > 1 && (
          <div className="gai-pr-field">
            <span className="gai-pr-lab">Service tier</span>
            <Seg value={tierOn} onChange={setTier} options={opts.tiers.map((t) => ({ id: t, label: TIER_LABEL[t] }))} label="Service tier" />
          </div>
        )}
        {opts.regional && (
          <div className="gai-pr-field">
            <span className="gai-pr-lab">Endpoint</span>
            <Seg value={regionOn} onChange={setRegion} options={[{ id: "global" as const, label: "Global" }, { id: "regional" as const, label: "Regional" }]} label="Endpoint" />
          </div>
        )}
      </div>
      {opts.providers.length > 1 && (
        <div className="gai-chipset" role="group" aria-label="Providers" style={{ marginBottom: 12 }}>
          <button type="button" className="gai-chip" aria-pressed={!providerKey} onClick={() => setProviders([])}>All providers</button>
          {opts.providers.map((p) => (
            <button key={p} type="button" className="gai-chip" aria-pressed={providerKey.split("|").includes(p)} onClick={() => toggleProvider(p)}>
              {providerName(p)}
            </button>
          ))}
        </div>
      )}
      <AsOfBanner date={date} today={today} />

      {opts.surfaces.length === 0 ? (
        <Empty title={`No token price in effect on ${fmtDate(date)}`}>
          {tokenRecords === 0
            ? "No per-token price is recorded in the knowledge base yet."
            : `The knowledge base holds ${tokenRecords} per-token price records, but none applies on this date. Try another date.`}
        </Empty>
      ) : rows.length === 0 ? (
        <Empty title="No model matches these filters">No input or output price is in effect on {fmtDate(date)} for this combination of surface, tier and provider.</Empty>
      ) : (
        <>
          <div className="gai-tablewrap">
            <table className="gai-table">
              <thead>
                <tr>
                  <SortTh k="name" label="Model" sort={sort} onSort={onSort} />
                  <SortTh k="provider" label="Provider" sort={sort} onSort={onSort} />
                  <th>Surface</th>
                  <SortTh k="input" label="Input" sort={sort} onSort={onSort} num />
                  <SortTh k="output" label="Output" sort={sort} onSort={onSort} num />
                  <SortTh k="cache" label="Cache read" sort={sort} onSort={onSort} num />
                  {hasLong && <th className="num">Long-context input</th>}
                  {hasLong && <th className="num">Long-context output</th>}
                  {hasBatch && <th className="num">Batch discount</th>}
                  <SortTh k="since" label="Effective since" sort={sort} onSort={onSort} />
                  <th>Evidence</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td className="gai-pr-model"><ModelLink id={r.entityId} /></td>
                    <td>{providerName(r.providerId)}</td>
                    <td className="gai-pr-surface">{surfaceName(r.surface, r.providerId)}</td>
                    <td className="num"><PriceCell rec={r.input} wantRegion={regionOn} /></td>
                    <td className="num"><PriceCell rec={r.output} wantRegion={regionOn} /></td>
                    <td className="num"><PriceCell rec={r.cacheRead} wantRegion={regionOn} /></td>
                    {hasLong && (
                      <td className="num">
                        {r.long.some((l) => l.input) ? r.long.filter((l) => l.input).map((l) => <div key={l.threshold}><PriceCell rec={l.input} threshold={l.threshold} wantRegion={regionOn} /></div>) : <PriceCell />}
                      </td>
                    )}
                    {hasLong && (
                      <td className="num">
                        {r.long.some((l) => l.output) ? r.long.filter((l) => l.output).map((l) => <div key={l.threshold}><PriceCell rec={l.output} threshold={l.threshold} wantRegion={regionOn} /></div>) : <PriceCell />}
                      </td>
                    )}
                    {hasBatch && <td className="num"><BatchCell batch={r.batch} /></td>}
                    <td className="gai-small">
                      {r.since ? fmtDate(r.since) : "—"}
                      {uniq(r.records.map((x) => x.note).filter((n): n is string => !!n)).map((n) => <NoteText key={n} text={n} />)}
                    </td>
                    <td><EvCell labels={r.labels} sourceIds={r.sourceIds} checked={r.lastChecked} align="right" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gai-small gai-muted gai-pr-caption">
            {rows.length} {rows.length === 1 ? "row" : "rows"} · US dollars per 1M tokens · {TIER_LABEL[tierOn]} tier{opts.regional ? ` · ${regionOn} endpoint` : ""} · base context window unless a long-context rate is shown · list prices in effect on {fmtDate(date)}.
          </p>
        </>
      )}

      {others.length > 0 && (
        <details className="gai-pr-details">
          <summary>Other metered prices in effect on {fmtDate(date)} ({others.length})</summary>
          <p className="gai-small gai-muted" style={{ marginBottom: 8 }}>Meters the table above has no column for: audio, images, video, grounding, cache writes and storage. Units differ, so they are listed and not ranked.</p>
          <RecordTable rows={others} showEntity />
        </details>
      )}
    </Sec>
  );
}

// ───────────────────────── 4. calculator ─────────────────────────

interface Slot {
  id: string;
  surface: PriceSurface | "auto";
}

const FORM_FIELDS: { key: keyof WorkloadForm; label: string; hint: string; step: string; min: string; max?: string }[] = [
  { key: "requestsPerMonth", label: "Requests per month", hint: "tasks to complete, before retries", step: "1000", min: "0" },
  { key: "inputTokens", label: "Input tokens per request", hint: "prompt, context and tool results", step: "100", min: "0" },
  { key: "outputTokens", label: "Output tokens per request", hint: "visible answer only", step: "50", min: "0" },
  { key: "cachedPct", label: "Cached share of input, %", hint: "input read from cache", step: "5", min: "0", max: "100" },
  { key: "batchPct", label: "Batch share of requests, %", hint: "requests that can wait", step: "5", min: "0", max: "100" },
  { key: "thinkingRatio", label: "Reasoning-token ratio", hint: "reasoning tokens per output token", step: "0.25", min: "0" },
  { key: "attemptsPerTask", label: "Model calls per completed task", hint: "retries and tool loops", step: "1", min: "1" },
];

function defaultSlots(priced: PricedEntity[], qModel: string | null): Slot[] {
  if (qModel) return [{ id: qModel, surface: "auto" }];
  const google = priced.filter((p) => p.providerId === "google").slice(0, 2);
  const rival = priced.find((p) => p.providerId !== "google");
  const pick = [...google, ...(rival ? [rival] : [])];
  return (pick.length ? pick : priced.slice(0, 2)).map((p) => ({ id: p.id, surface: "auto" as const }));
}

function CalculatorTab({ date, setDate, today, maxDate, qScenario, qModel }: DateProps & { qScenario: string | null; qModel: string | null }) {
  const priced = useMemo(() => pricedEntities(date), [date]);
  const initial = SCENARIOS.find((s) => s.id === qScenario) ?? SCENARIOS[0];
  const [preset, setPreset] = useState<string | null>(initial?.id ?? null);
  const [form, setForm] = useState<WorkloadForm>(() => (initial ? formFromScenario(initial) : FALLBACK_FORM));
  const [slots, setSlots] = useState<Slot[]>(() => defaultSlots(pricedEntities(today), qModel));
  const [label, setLabel] = useState("");
  const [saved, setSaved] = useState<SavedRun[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = window.localStorage.getItem(STORE_KEY);
        if (raw) setSaved(parseSavedRuns(JSON.parse(raw)));
      } catch {
        /* storage unavailable or unreadable: start with no saved runs */
      }
    });
  }, []);
  const persist = (runs: SavedRun[]) => {
    setSaved(runs);
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(runs));
    } catch {
      /* storage unavailable: the run stays for this visit only */
    }
  };

  const presetDef = SCENARIOS.find((s) => s.id === preset);
  const scenario = useMemo(() => scenarioFromForm(form, preset ?? "custom", SCENARIOS.find((s) => s.id === preset)?.name ?? "Custom workload"), [form, preset]);
  const results = useMemo(
    () =>
      slots.map((slot) => {
        const surfaces = tokenSurfacesFor(slot.id, date);
        const surface = slot.surface !== "auto" && surfaces.includes(slot.surface) ? slot.surface : surfaces[0];
        return { slot, surfaces, surface, est: estimate(scenario, slot.id, date, { surface }) };
      }),
    [slots, scenario, date],
  );
  const okResults = results.filter((r) => r.est.ok);
  const lowest = okResults.length ? Math.min(...okResults.map((r) => r.est.monthly)) : 0;

  const setField = (key: keyof WorkloadForm, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setPreset(null);
  };
  const applyPreset = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setPreset(id);
    setForm(formFromScenario(s));
  };
  const setSlot = (i: number, patch: Partial<Slot>) => setSlots((cur) => cur.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const unused = priced.filter((p) => !slots.some((s) => s.id === p.id));
  const addSlot = () => {
    const next = unused[0] ?? priced[0];
    if (next) setSlots((cur) => (cur.length >= MAX_CALC_MODELS ? cur : [...cur, { id: next.id, surface: "auto" }]));
  };
  const save = () => {
    const run: SavedRun = {
      id: `run-${Date.now().toString(36)}`,
      label: label.trim() || presetDef?.name || "Custom workload",
      savedOn: today,
      priceDate: date,
      form,
      results: results.map((r) => ({ entityId: r.slot.id, name: entityName(r.slot.id), surface: r.est.surface, ok: r.est.ok, monthly: r.est.monthly, perRequest: r.est.perRequest, perTask: r.est.perTask, notes: r.est.notes })),
    };
    persist([run, ...saved].slice(0, 40));
    setLabel("");
  };

  const providerIds = uniq(priced.map((p) => p.providerId));

  return (
    <Sec id="calculator" title="Workload cost calculator" sub="Estimate what a workload costs at published list prices on a date. Every figure is arithmetic on the price records cited beside it; every assumption and every gap is listed with the result.">
      <div className="gai-note" style={{ marginBottom: 14 }}>
        <b>Per-token price is not cost per completed task.</b> A cheaper model that needs more calls, more reasoning tokens or more retries to finish the job can cost more per task. Set the calls-per-task and reasoning inputs from your own measurements before comparing models.
      </div>

      <div className="gai-split">
        <div className="gai-card">
          <h3 className="gai-h3">Workload</h3>
          {SCENARIOS.length > 0 && (
            <>
              <div className="gai-chipset" role="group" aria-label="Example workloads" style={{ margin: "8px 0" }}>
                {SCENARIOS.map((s) => (
                  <button key={s.id} type="button" className="gai-chip" aria-pressed={preset === s.id} onClick={() => applyPreset(s.id)}>{s.name}</button>
                ))}
              </div>
              <p className="gai-small gai-muted" style={{ marginBottom: 10 }}>
                {presetDef ? presetDef.description : "Custom inputs."} <Ev label="analyst-interpretation" short /> The example workloads are illustrative assumptions, not measurements.
              </p>
            </>
          )}
          <div className="gai-pr-form">
            {FORM_FIELDS.map((f) => (
              <div key={f.key} className="gai-pr-field">
                <label htmlFor={`gai-pr-f-${f.key}`}>{f.label}</label>
                <input id={`gai-pr-f-${f.key}`} className="gai-input" type="number" inputMode="decimal" min={f.min} max={f.max} step={f.step} value={form[f.key]} onChange={(e) => setField(f.key, e.target.value)} />
                <small>{f.hint}</small>
              </div>
            ))}
            <DateField id="gai-pr-calc-date" label="Prices as of" date={date} setDate={setDate} today={today} max={maxDate} />
          </div>
        </div>

        <div className="gai-card">
          <h3 className="gai-h3">Models to compare</h3>
          <p className="gai-small gai-muted" style={{ margin: "4px 0 10px" }}>Up to {MAX_CALC_MODELS}. The list holds every model with a per-token price in effect on {fmtDate(date)}.</p>
          {priced.length === 0 && slots.length === 0 ? (
            <p className="gai-muted gai-small">No model has a per-token price in effect on this date, so there is nothing to cost.</p>
          ) : (
            <div className="gai-pr-slots">
              {results.map((r, i) => (
                <div key={i} className="gai-pr-slot">
                  <div className="gai-pr-field">
                    <label htmlFor={`gai-pr-m-${i}`}>Model {i + 1}</label>
                    <select id={`gai-pr-m-${i}`} className="gai-select" value={r.slot.id} onChange={(e) => setSlot(i, { id: e.target.value, surface: "auto" })}>
                      {!priced.some((p) => p.id === r.slot.id) && <option value={r.slot.id}>{entityName(r.slot.id)} — no price on this date</option>}
                      {providerIds.map((pid) => (
                        <optgroup key={pid} label={providerName(pid)}>
                          {priced.filter((p) => p.providerId === pid).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  <div className="gai-pr-field">
                    <label htmlFor={`gai-pr-s-${i}`}>Surface</label>
                    <select id={`gai-pr-s-${i}`} className="gai-select" value={r.slot.surface !== "auto" && r.surfaces.includes(r.slot.surface) ? r.slot.surface : "auto"} onChange={(e) => setSlot(i, { surface: e.target.value as Slot["surface"] })}>
                      <option value="auto">Auto{r.surfaces[0] ? ` — ${surfaceName(r.surfaces[0], ENTITY_BY_ID[r.slot.id]?.providerId)}` : ""}</option>
                      {r.surfaces.map((s) => <option key={s} value={s}>{surfaceName(s, ENTITY_BY_ID[r.slot.id]?.providerId)}</option>)}
                    </select>
                  </div>
                  <button type="button" className="gai-btn" onClick={() => setSlots((cur) => cur.filter((_, k) => k !== i))} aria-label={`Remove ${entityName(r.slot.id)}`}>Remove</button>
                </div>
              ))}
            </div>
          )}
          {slots.length < MAX_CALC_MODELS && priced.length > 0 && (
            <button type="button" className="gai-btn" onClick={addSlot} style={{ marginTop: 10 }}>Add a model</button>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14 }}><AsOfBanner date={date} today={today} /></div>

      {results.length === 0 ? (
        <Empty title="No model selected">
          {priced.length ? "Add a model to see its estimated cost." : `No model has a per-token price in effect on ${fmtDate(date)}. Nothing is estimated rather than assumed.`}
        </Empty>
      ) : (
        <>
          {okResults.length > 1 && (
            <div className="gai-tablewrap" style={{ marginBottom: 14 }}>
              <table className="gai-table">
                <thead><tr><th>Model</th><th>Surface</th><th className="num">Per month</th><th className="num">Per model call</th><th className="num">Per completed task</th><th className="num">Against the lowest</th></tr></thead>
                <tbody>
                  {okResults.slice().sort((a, b) => a.est.monthly - b.est.monthly).map((r, i) => (
                    <tr key={`${r.slot.id}-${r.surface}-${i}`}>
                      <td><ModelLink id={r.slot.id} /></td>
                      <td>{r.est.surface ? surfaceName(r.est.surface, ENTITY_BY_ID[r.slot.id]?.providerId) : "—"}</td>
                      <td className="num">{money(r.est.monthly)}</td>
                      <td className="num">{money(r.est.perRequest)}</td>
                      <td className="num">{money(r.est.perTask)}</td>
                      <td className="num">{lowest > 0 ? `${(r.est.monthly / lowest).toLocaleString("en-US", { maximumFractionDigits: 2 })}×` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="gai-grid gai-g2">
            {results.map((r, i) => <EstimateCard key={`${i}-${r.slot.id}`} est={r.est} date={date} />)}
          </div>
        </>
      )}

      <div className="gai-card" style={{ marginTop: 14 }}>
        <h3 className="gai-h3">Saved scenarios</h3>
        <p className="gai-small gai-muted" style={{ margin: "4px 0 10px" }}>Saved in this browser only. A saved run is a snapshot of the result on the day it was saved; it is not recalculated when prices change.</p>
        <div className="gai-pr-controls">
          <div className="gai-pr-field">
            <label htmlFor="gai-pr-save-label">Name for this run</label>
            <input id="gai-pr-save-label" className="gai-input" type="text" maxLength={60} value={label} placeholder={presetDef?.name ?? "Custom workload"} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <button type="button" className="gai-btn primary" onClick={save} disabled={results.length === 0}>Save scenario</button>
        </div>
        {saved.length === 0 ? (
          <p className="gai-muted gai-small">No scenario saved yet.</p>
        ) : (
          <SavedTable saved={saved} onDelete={(id) => persist(saved.filter((s) => s.id !== id))} onLoad={(run) => { setForm(run.form); setPreset(null); }} />
        )}
      </div>
    </Sec>
  );
}

function SavedTable({ saved, onDelete, onLoad }: { saved: SavedRun[]; onDelete: (id: string) => void; onLoad: (run: SavedRun) => void }) {
  return (
    <div className="gai-tablewrap">
      <table className="gai-table">
        <thead><tr><th>Run</th><th>Model</th><th>Surface</th><th className="num">Per month</th><th className="num">Per model call</th><th className="num">Per completed task</th><th><span className="gai-sr">Actions</span></th></tr></thead>
        <tbody>
          {saved.flatMap((run) => {
            const s = scenarioFromForm(run.form);
            const span = Math.max(1, run.results.length);
            const runCell = (
              <td rowSpan={span}>
                <b>{run.label}</b>
                <div className="gai-small gai-muted">Prices as of {fmtDate(run.priceDate)} · saved {fmtDate(run.savedOn)}</div>
                <div className="gai-small gai-muted">
                  {compact(s.requestsPerMonth)} requests · {compact(s.inputTokens)} in / {compact(s.outputTokens)} out · {pct(s.cachedShare)} cached · {pct(s.batchShare)} batch · reasoning ×{s.thinkingRatio} · {s.attemptsPerTask} calls per task
                </div>
              </td>
            );
            const actions = (
              <td rowSpan={span}>
                <div className="gai-row">
                  <button type="button" className="gai-btn" onClick={() => onLoad(run)}>Load inputs</button>
                  <button type="button" className="gai-btn" onClick={() => onDelete(run.id)} aria-label={`Delete saved run ${run.label}`}>Delete</button>
                </div>
              </td>
            );
            if (!run.results.length) return [<tr key={run.id}>{runCell}<td colSpan={5} className="gai-muted">No model was selected.</td>{actions}</tr>];
            return run.results.map((r, i) => (
              <tr key={`${run.id}-${i}`}>
                {i === 0 && runCell}
                <td><ModelLink id={r.entityId} />{!ENTITY_BY_ID[r.entityId] && r.name !== r.entityId ? ` (${r.name})` : ""}</td>
                <td>{r.surface ? surfaceName(r.surface, ENTITY_BY_ID[r.entityId]?.providerId) : "—"}</td>
                {r.ok ? (
                  <>
                    <td className="num">{money(r.monthly)}</td>
                    <td className="num">{money(r.perRequest)}</td>
                    <td className="num">{money(r.perTask)}{r.notes.length ? <span className="gai-pr-cond">{r.notes.length} {r.notes.length === 1 ? "assumption" : "assumptions"} noted</span> : null}</td>
                  </>
                ) : (
                  <td colSpan={3} className="gai-muted">No published price on that date — not costed.</td>
                )}
                {i === 0 && actions}
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

function EstimateCard({ est, date }: { est: CostEstimate; date: string }) {
  const name = entityName(est.entityId);
  const providerId = ENTITY_BY_ID[est.entityId]?.providerId;
  if (!est.ok) {
    const own = (PRICES_BY_ENTITY[est.entityId] ?? []).filter((p) => isTokenRecord(p) && p.meter === "input");
    const later = own.map((p) => p.effectiveFrom).filter((d) => d > date).sort()[0];
    const earlier = own.some((p) => p.effectiveFrom <= date && !inEffect(date, p.effectiveFrom, p.effectiveTo));
    return (
      <Empty title={`No price for ${name} on ${fmtDate(date)}`}>
        {est.notes.join(" ")}{" "}
        {later ? `A price is on record from ${fmtDate(later)}. ` : earlier ? "Its recorded prices ended before this date. " : own.length === 0 ? "No per-token price is recorded for it. " : ""}
        It is left out of the comparison and is not costed at zero.
      </Empty>
    );
  }
  const total = est.monthly;
  return (
    <article className="gai-card">
      <div className="gai-pr-card-head">
        <h3 className="gai-h3"><ModelLink id={est.entityId} /></h3>
        <span className="gai-small gai-muted">{est.surface ? surfaceName(est.surface, providerId) : ""} · list prices on {fmtDate(est.date)}</span>
      </div>
      <div className="gai-pr-figs">
        <div className="gai-pr-fig main"><span className="v">{money(est.monthly)}</span><span className="l">per month</span></div>
        <div className="gai-pr-fig"><span className="v">{money(est.perRequest)}</span><span className="l">per model call</span></div>
        <div className="gai-pr-fig"><span className="v">{money(est.perTask)}</span><span className="l">per completed task</span></div>
      </div>

      {total > 0 ? <CostBar est={est} name={name} /> : <p className="gai-small gai-muted">The inputs give no billable tokens, so there is no cost mix to draw.</p>}

      {est.notes.length > 0 && (
        <div className="gai-warn gai-pr-notes">
          <b>Assumptions and gaps in this estimate</b>
          <ul>{est.notes.map((n, i) => <li key={`${i}-${n}`}>{n}</li>)}</ul>
        </div>
      )}

      {est.lines.length > 0 && (
        <div className="gai-tablewrap" style={{ marginTop: 12 }}>
          <table className="gai-table">
            <thead><tr><th>Cost line</th><th className="num">Tokens</th><th className="num">Rate / 1M</th><th className="num">Cost</th><th className="num">Share</th><th>Price record</th></tr></thead>
            <tbody>
              {est.lines.map((l, i) => {
                const rec = l.recordId ? PRICE_BY_ID[l.recordId] : undefined;
                return (
                  <tr key={`${l.label}-${i}`}>
                    <td><i className={`gai-pr-sw ${lineKind(l)}`} aria-hidden />{l.label}</td>
                    <td className="num">{tokensM(l.tokensM)}</td>
                    <td className="num">{usd(l.rate)}</td>
                    <td className="num">{money(l.cost)}</td>
                    <td className="num">{total > 0 ? pct(l.cost / total) : "—"}</td>
                    <td>
                      {rec ? <EvCell labels={[rec.label]} sourceIds={rec.sourceIds} checked={rec.lastCheckedAt} align="right" /> : <span className="gai-muted gai-small">record not found</span>}
                      {rec && <span className="gai-pr-cond">in effect from {fmtDate(rec.effectiveFrom)}{rec.effectiveTo ? ` to ${fmtDate(rec.effectiveTo)}` : ""}{rec.condition ? ` · ${rec.condition}` : ""}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

/** Where the money goes: one bar, four cost families in one hue; reasoning (billed as output) is hatched. */
function CostBar({ est, name }: { est: CostEstimate; name: string }) {
  const [tip, setTip] = useState<number | null>(null);
  const pid = `gai-pr-h-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const parts = costMix(est.lines);
  const on = tip != null ? parts[tip] : undefined;
  return (
    <div className="gai-pr-mix">
      <div className="gai-pr-seglabels" aria-hidden>
        {parts.filter((p) => p.share >= 0.22).map((p) => (
          <span key={p.kind} style={{ left: `${p.start * 100}%` }}><b>{p.kind === "cached" ? "Cached" : p.label}</b>{pct(p.share)}</span>
        ))}
      </div>
      <svg className="gai-chart gai-pr-stack" role="img" aria-label={`Monthly cost of ${name} by cost line: ${parts.map((p) => `${p.label} ${money(p.cost)}, ${pct(p.share)}`).join("; ")}. The table below lists every line.`}>
        <defs>
          <pattern id={pid} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect className="gai-pr-hatch-bg" width="6" height="6" />
            <line className="gai-pr-hatch-line" x1="1" y1="0" x2="1" y2="6" />
          </pattern>
        </defs>
        {parts.map((p, i) => (
          <rect
            key={p.kind}
            x={`${p.start * 100}%`}
            width={`${p.share * 100}%`}
            height="24"
            rx="4"
            className={p.kind === "reasoning" ? undefined : `gai-pr-k-${p.kind}`}
            fill={p.kind === "reasoning" ? `url(#${pid})` : undefined}
            tabIndex={0}
            aria-label={`${p.label}: ${money(p.cost)}, ${pct(p.share)} of the monthly cost`}
            onMouseEnter={() => setTip(i)}
            onMouseLeave={() => setTip(null)}
            onFocus={() => setTip(i)}
            onBlur={() => setTip(null)}
          />
        ))}
      </svg>
      {on && (
        <div className="gai-tip" style={{ left: `${(on.start + on.share / 2) * 100}%`, bottom: "100%", transform: `translateX(${on.start + on.share / 2 > 0.7 ? "-90%" : on.start + on.share / 2 < 0.3 ? "-10%" : "-50%"})`, whiteSpace: "nowrap" }}>
          <b>{money(on.cost)}</b> · {on.label} · {pct(on.share)}
        </div>
      )}
      <div className="gai-pr-key">
        {parts.map((p) => (
          <span key={p.kind}><i className={`gai-pr-sw ${p.kind}`} aria-hidden />{LINE_KIND_LABEL[p.kind]} <b>{money(p.cost)}</b></span>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────── 5. price history ─────────────────────────

interface Picked {
  id: string;
  slot: number;
}
interface ChartSeries extends Picked {
  name: string;
  providerId?: string;
  surface?: PriceSurface;
  segments: StepSegment[];
}

function useWidth<T extends HTMLElement>(fallback: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setWidth(Math.round(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function HistoryTab({ today }: { today: string }) {
  const candidates = useMemo(() => historyCandidates(today), [today]);
  const [picked, setPicked] = useState<Picked[]>(() => defaultHistoryModels(historyCandidates(today), MAX_HISTORY_MODELS).map((id, slot) => ({ id, slot })));
  const [meter, setMeter] = useState<HistoryMeter>("input");
  const [scale, setScale] = useState<"linear" | "log">("linear");
  const [surface, setSurface] = useState<PriceSurface | "auto">("auto");

  const surfaces = useMemo(() => uniq(candidates.flatMap((c) => c.surfaces)), [candidates]);
  const surfaceOn = surface !== "auto" && surfaces.includes(surface) ? surface : "auto";

  const view = useMemo(() => {
    const raw = picked.map((p) => {
      const h = surfaceOn === "auto" ? bestHistory(p.id, meter, today) : { surface: surfaceOn, points: tokenPoints(p.id, meter, today, surfaceOn) };
      return { ...p, name: entityName(p.id), providerId: ENTITY_BY_ID[p.id]?.providerId, surface: h?.points.length ? h.surface : undefined, points: h?.points ?? [] };
    });
    const dates = raw.flatMap((s) => s.points.map((pt) => pt.date));
    if (!dates.length) return { series: raw.map((s) => ({ ...s, segments: [] as StepSegment[] })), start: today, horizon: today };
    const first = dates.reduce((a, b) => (a < b ? a : b));
    const last = dates.reduce((a, b) => (a > b ? a : b), today);
    const span = Math.max(1, daysBetween(first, last));
    const horizon = last > today ? addDays(last, Math.max(21, Math.round(span * 0.08))) : today;
    const start = addDays(first, -Math.max(7, Math.round(span * 0.03)));
    const series: ChartSeries[] = raw.map((s) => ({ ...s, segments: stepSegments(s.points, today, horizon) }));
    return { series, start, horizon };
  }, [picked, meter, surfaceOn, today]);

  const anyChange = candidates.some((c) => c.inputPoints > 1 || c.outputPoints > 1);
  const drawn = view.series.filter((s) => s.segments.length > 0);
  const free = candidates.filter((c) => !picked.some((p) => p.id === c.entityId));
  const add = (id: string) =>
    setPicked((cur) => {
      if (!id || cur.length >= MAX_HISTORY_MODELS || cur.some((p) => p.id === id)) return cur;
      const slot = [0, 1, 2, 3, 4].find((n) => !cur.some((p) => p.slot === n)) ?? 0;
      return [...cur, { id, slot }];
    });

  return (
    <Sec id="history" title="Pricing evolution" sub="How the standard-tier list price of a model has moved, drawn as steps: a price holds until the day the next one takes effect. Global endpoint, base context window.">
      {candidates.length === 0 ? (
        <Empty title="No dated token price recorded">There is no standard-tier input or output price in the knowledge base yet, so there is no history to draw.</Empty>
      ) : (
        <>
          <div className="gai-pr-controls">
            <div className="gai-pr-field">
              <span className="gai-pr-lab">Meter</span>
              <Seg value={meter} onChange={setMeter} options={[{ id: "input" as const, label: "Input" }, { id: "output" as const, label: "Output" }]} label="Meter" />
            </div>
            <div className="gai-pr-field">
              <span className="gai-pr-lab">Scale</span>
              <Seg value={scale} onChange={setScale} options={[{ id: "linear" as const, label: "Linear" }, { id: "log" as const, label: "Log" }]} label="Price scale" />
            </div>
            {surfaces.length > 1 && (
              <div className="gai-pr-field">
                <label htmlFor="gai-pr-h-surface">Surface</label>
                <select id="gai-pr-h-surface" className="gai-select" value={surfaceOn} onChange={(e) => setSurface(e.target.value as PriceSurface | "auto")}>
                  <option value="auto">Auto — longest record per model</option>
                  {surfaces.map((s) => <option key={s} value={s}>{SURFACE_FILTER_LABEL[s]}</option>)}
                </select>
              </div>
            )}
            {picked.length < MAX_HISTORY_MODELS && free.length > 0 && (
              <div className="gai-pr-field">
                <label htmlFor="gai-pr-h-add">Add a model (up to {MAX_HISTORY_MODELS})</label>
                <select id="gai-pr-h-add" className="gai-select" value="" onChange={(e) => add(e.target.value)}>
                  <option value="">Choose…</option>
                  {free.map((c) => {
                    const n = meter === "input" ? c.inputPoints : c.outputPoints;
                    return <option key={c.entityId} value={c.entityId}>{c.name} — {n} {n === 1 ? "record" : "records"}</option>;
                  })}
                </select>
              </div>
            )}
          </div>

          <div className="gai-chipset" style={{ marginBottom: 10 }} role="group" aria-label="Models on the chart">
            {view.series.map((s) => (
              <span key={s.id} className="gai-pr-picked">
                <i style={{ background: SLOT_COLOR[s.slot] }} aria-hidden />
                <span>{s.name}{s.surface ? ` · ${surfaceName(s.surface, s.providerId)}` : " · no record"}</span>
                <button type="button" aria-label={`Remove ${s.name} from the chart`} onClick={() => setPicked((cur) => cur.filter((p) => p.id !== s.id))}>×</button>
              </span>
            ))}
            {picked.length === 0 && <span className="gai-muted gai-small">No model selected.</span>}
          </div>

          {!anyChange ? (
            <Empty title="No price change to chart yet">
              No model has more than one dated price on record, so there is no movement over time to draw. The records that do exist are listed below.
            </Empty>
          ) : drawn.length === 0 ? (
            <Empty title="Nothing to draw for this selection">
              {picked.length === 0 ? "Add a model to draw its price history." : `None of the selected models has a standard-tier ${meter} price recorded${surfaceOn === "auto" ? "" : ` on ${SURFACE_FILTER_LABEL[surfaceOn]}`}.`}
            </Empty>
          ) : (
            <div className="gai-card">
              <HistoryChart series={drawn} start={view.start} horizon={view.horizon} today={today} scale={scale} meter={meter} />
              <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
                <span className="gai-pr-linekey" aria-hidden />in effect{" "}
                <span className="gai-pr-linekey sched" aria-hidden style={{ marginLeft: 12 }} />scheduled: published, not yet in effect. US dollars per 1M {meter} tokens. A line stops at today unless a later price is already published.
              </p>
            </div>
          )}

          <HistoryRecords series={view.series} today={today} meter={meter} />
        </>
      )}
    </Sec>
  );
}

function HistoryChart({ series, start, horizon, today, scale, meter }: { series: ChartSeries[]; start: string; horizon: string; today: string; scale: "linear" | "log"; meter: HistoryMeter }) {
  const [boxRef, W] = useWidth<HTMLDivElement>(720);
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<string | null>(null);

  const narrow = W < 560;
  const H = narrow ? 300 : 340;
  const m = { l: 50, r: narrow ? 60 : 176, t: 22, b: 30 };
  const pw = Math.max(40, W - m.l - m.r);
  const ph = H - m.t - m.b;
  const total = Math.max(1, daysBetween(start, horizon));
  const x = (d: string) => r1(m.l + (Math.min(total, Math.max(0, daysBetween(start, d))) / total) * pw);

  const usable = series.map((s) => ({ ...s, segments: scale === "log" ? s.segments.filter((g) => g.price > 0) : s.segments })).filter((s) => s.segments.length > 0);
  const dropped = series.reduce((n, s) => n + s.segments.filter((g) => scale === "log" && !(g.price > 0)).length, 0);
  const prices = usable.flatMap((s) => s.segments.map((g) => g.price));
  if (!prices.length) return <p className="gai-muted gai-small">Every recorded price here is zero, which a log scale cannot show. Switch to the linear scale.</p>;

  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  let ticks: number[];
  let y: (v: number) => number;
  if (scale === "log") {
    ticks = logTicks(lo / 1.3, hi * 1.3);
    const d0 = Math.log10(Math.min(lo / 1.3, ticks[0] ?? lo));
    const d1 = Math.log10(Math.max(hi * 1.3, ticks[ticks.length - 1] ?? hi));
    y = (v) => r1(m.t + ph - ((Math.log10(v) - d0) / (d1 - d0 || 1)) * ph);
  } else {
    ticks = linearTicks(hi * 1.05);
    const top = ticks[ticks.length - 1] || 1;
    y = (v) => r1(m.t + ph - (v / top) * ph);
  }
  const xt = dateTicks(start, horizon, narrow ? 4 : 7);
  const xToday = x(today);
  const hasFuture = horizon > today;

  const ends = usable.map((s) => {
    const e = s.segments[s.segments.length - 1];
    return { s, e, x: x(e.to), y: y(e.price) };
  });
  const labelY = spreadLabels(ends.map((e) => e.y), 15, m.t + 4, m.t + ph);
  const nameRoom = Math.max(0, Math.floor((m.r - 70) / 6));

  const onMove = (clientX: number) => {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || !box.width) return;
    const px = ((clientX - box.left) / box.width) * W;
    const f = Math.min(1, Math.max(0, (px - m.l) / pw));
    setHover(addDays(start, Math.round(f * total)));
  };
  const hx = hover ? x(hover) : 0;

  return (
    <div className="gai-pr-chartbox" ref={boxRef}>
      <svg
        ref={svgRef}
        className="gai-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Step chart of the standard-tier ${meter} list price per 1M tokens over time for ${usable.map((s) => s.name).join(", ")}, ${fmtDate(start)} to ${fmtDate(horizon)}${hasFuture ? ", including published prices that are not yet in effect, drawn dashed" : ""}. The table below lists every record.`}
        onPointerMove={(e) => onMove(e.clientX)}
        onPointerLeave={() => setHover(null)}
      >
        {hasFuture && <rect className="gai-pr-future" x={xToday} y={m.t} width={Math.max(0, m.l + pw - xToday)} height={ph} />}
        {ticks.map((t) => (
          <g key={t}>
            <line className="grid" x1={m.l} x2={m.l + pw} y1={y(t)} y2={y(t)} />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end">{usd(t)}</text>
          </g>
        ))}
        <line className="axis" x1={m.l} x2={m.l + pw} y1={m.t + ph} y2={m.t + ph} />
        {xt.map((t) => (
          <g key={t.date}>
            <line className="axis" x1={x(t.date)} x2={x(t.date)} y1={m.t + ph} y2={m.t + ph + 4} />
            <text x={x(t.date)} y={m.t + ph + 18} textAnchor="middle">{fmtDate(t.date, t.precision)}</text>
          </g>
        ))}

        <line className="gai-pr-today" x1={xToday} x2={xToday} y1={m.t - 6} y2={m.t + ph} />
        <text x={xToday - 5} y={m.t - 9} textAnchor="end" className="lbl">today</text>
        {hasFuture && <text x={xToday + 5} y={m.t - 9}>scheduled</text>}

        {usable.map((s) => {
          let solid = "";
          let dashed = "";
          s.segments.forEach((g, i) => {
            const d = `M${x(g.from)},${y(g.price)}H${x(g.to)}`;
            if (g.scheduled) dashed += d;
            else solid += d;
            const n = s.segments[i + 1];
            if (n && g.joins && n.from === g.to) {
              const riser = `M${x(g.to)},${y(g.price)}V${y(n.price)}`;
              if (n.scheduled) dashed += riser;
              else solid += riser;
            }
          });
          const color = SLOT_COLOR[s.slot];
          return (
            <g key={s.id}>
              {solid && <path className="gai-pr-line" d={solid} stroke={color} />}
              {dashed && <path className="gai-pr-line sched" d={dashed} stroke={color} />}
            </g>
          );
        })}

        {hover && <line className="gai-pr-cross" x1={hx} x2={hx} y1={m.t} y2={m.t + ph} />}

        {usable.map((s) =>
          s.segments.map((g) => (
            <circle
              key={`${s.id}-${g.recordId}`}
              className="gai-pr-dot"
              cx={x(g.from)}
              cy={y(g.price)}
              r={4}
              fill={g.scheduled ? "var(--surface)" : SLOT_COLOR[s.slot]}
              stroke={g.scheduled ? SLOT_COLOR[s.slot] : "var(--surface)"}
              strokeWidth={2}
              tabIndex={0}
              aria-label={`${s.name}: ${usd(g.price)} per 1M ${meter} tokens from ${fmtDate(g.from)}${g.scheduled ? ", scheduled, not yet in effect" : ""}`}
              onFocus={() => setHover(g.from)}
              onBlur={() => setHover(null)}
            />
          )),
        )}

        {ends.map((e, i) => {
          const lx = m.l + pw + 12;
          const ly = labelY[i];
          const short = nameRoom >= 6 ? (e.s.name.length > nameRoom ? e.s.name.slice(0, nameRoom - 1) + "…" : e.s.name) : "";
          return (
            <g key={e.s.id}>
              <path className="gai-pr-leader" d={`M${e.x + 3},${e.y}L${lx - 6},${ly}`} />
              <circle cx={lx} cy={ly} r={4} fill={e.e.scheduled ? "var(--surface)" : SLOT_COLOR[e.s.slot]} stroke={e.e.scheduled ? SLOT_COLOR[e.s.slot] : "var(--surface)"} strokeWidth={e.e.scheduled ? 2 : 0} />
              <text x={lx + 8} y={ly + 4} className="lbl">{usd(e.e.price)}{short ? <tspan fontWeight={400} fill="var(--ink-2)"> {short}</tspan> : null}</text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div className="gai-tip gai-pr-tip" style={{ left: hx, transform: hx > W * 0.55 ? "translateX(calc(-100% - 10px))" : "translateX(10px)" }}>
          <b>{fmtDate(hover)}</b>{hover > today ? " · after today" : ""}
          {series.map((s) => {
            const g = segmentOn(s.segments, hover);
            return (
              <div key={s.id} className="gai-pr-tiprow">
                <i style={{ background: SLOT_COLOR[s.slot] }} />
                <b>{g ? usd(g.price) : "—"}</b>
                <span>{s.name}{g?.scheduled ? " · scheduled" : ""}{!g ? " · no price recorded" : ""}</span>
              </div>
            );
          })}
        </div>
      )}
      {dropped > 0 && <p className="gai-small gai-muted">{dropped} zero-price {dropped === 1 ? "record is" : "records are"} left off the log scale; the table below lists {dropped === 1 ? "it" : "them"}.</p>}
    </div>
  );
}

function HistoryRecords({ series, today, meter }: { series: ChartSeries[]; today: string; meter: HistoryMeter }) {
  const rows = series.flatMap((s) => {
    const live = s.segments.filter((g) => !g.scheduled);
    const currentId = live.length ? live[live.length - 1].recordId : undefined;
    return s.segments.map((g) => ({ s, g, rec: PRICE_BY_ID[g.recordId] as PriceRecord | undefined, current: g.recordId === currentId }));
  });
  if (!rows.length) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="gai-group-name">Every record behind the chart — standard-tier {meter} price, US dollars per 1M tokens</div>
      <div className="gai-tablewrap">
        <table className="gai-table">
          <thead><tr><th>Model</th><th>Surface</th><th className="num">{meter === "input" ? "Input" : "Output"} price</th><th>Effective from – to</th><th>Status</th><th>Evidence</th></tr></thead>
          <tbody>
            {rows.map(({ s, g, rec, current }) => (
              <tr key={`${s.id}-${g.recordId}`}>
                <td className="gai-pr-model"><i className="gai-pr-sw" style={{ background: SLOT_COLOR[s.slot] }} aria-hidden /><ModelLink id={s.id} /></td>
                <td>{s.surface ? surfaceName(s.surface, s.providerId) : "—"}</td>
                <td className="num"><span className="gai-pr-price">{usd(g.price)}</span>{rec && <Terms rec={{ ...rec, effectiveTo: undefined }} />}</td>
                <td className="gai-small">
                  {fmtDate(g.from)} – {rec?.effectiveTo ? fmtDate(rec.effectiveTo) : g.joins ? `${fmtDate(addDays(g.to, -1))}` : "open"}
                  {rec?.publishedAt && rec.publishedAt !== rec.effectiveFrom ? <div className="gai-muted">published {fmtDate(rec.publishedAt)}</div> : null}
                </td>
                <td>
                  {g.scheduled ? <span className="gai-pill announced">Scheduled · in {daysBetween(today, g.from)} days</span> : current && (!rec?.effectiveTo || rec.effectiveTo >= today) ? <span className="gai-pill ga">In effect</span> : <span className="gai-pill">Earlier price</span>}
                </td>
                <td>{rec ? <EvCell labels={[rec.label]} sourceIds={rec.sourceIds} checked={rec.lastCheckedAt} align="right" /> : <span className="gai-muted gai-small">record not found</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ───────────────────────── 6. plans and licences ─────────────────────────

function GroupedRecords({ groups }: { groups: EntityRecords[] }) {
  return (
    <div className="gai-stack">
      {groups.map((g) => (
        <section key={g.entityId} className="gai-card">
          <div className="gai-pr-card-head" style={{ marginBottom: 8 }}>
            <h3 className="gai-h3"><ModelLink id={g.entityId} /></h3>
            <span className="gai-small gai-muted">{providerName(g.records[0].providerId)}{ENTITY_BY_ID[g.entityId] ? ` · ${ENTITY_BY_ID[g.entityId].kind.replace(/-/g, " ")}` : ""}</span>
          </div>
          <RecordTable rows={g.records} />
        </section>
      ))}
    </div>
  );
}

function PlansTab({ date, setDate, today, maxDate }: DateProps) {
  const groups = useMemo(() => recordsByEntity(date, isPlanRecord), [date]);
  return (
    <Sec id="plans" title="Plans and licences" sub="Subscriptions and per-seat licences with a price on record for the chosen date. The evidence label on each row says whether the figure comes from the provider or from third-party reporting.">
      <div className="gai-pr-controls">
        <DateField id="gai-pr-plans-date" label="Prices as of" date={date} setDate={setDate} today={today} max={maxDate} />
      </div>
      <AsOfBanner date={date} today={today} />
      <div className="gai-note" style={{ marginBottom: 14 }}>
        Enterprise pricing is often negotiated. The list prices here are the published ceiling: what a provider asks before volume discounts, bundles and multi-year commitments. They say what a seat can cost at most, not what a given customer pays. <Ev label="analyst-interpretation" short />
      </div>
      {groups.length === 0 ? (
        <Empty title={`No plan or licence price in effect on ${fmtDate(date)}`}>
          No subscription or per-seat price is recorded for this date. That can mean the plan is sold by quote, bundled, or not yet captured here — it is not shown as free.
        </Empty>
      ) : (
        <GroupedRecords groups={groups} />
      )}
    </Sec>
  );
}

// ───────────────────────── 7. infrastructure economics ─────────────────────────

function InfrastructureTab({ date, setDate, today, maxDate }: DateProps) {
  const groups = useMemo(() => recordsByEntity(date, isInfraRecord), [date]);
  const economics = useMemo(() => infrastructureEconomics(), []);
  return (
    <Sec id="infrastructure" title="Infrastructure economics" sub="What the compute underneath costs, where a price is published, and what the record says about cost, performance per dollar and capital spending.">
      {groups.length === 0 && economics.length === 0 ? (
        <Empty title="No infrastructure economics recorded">
          The knowledge base holds no infrastructure price and no sourced statement about infrastructure cost, performance per dollar or capital expenditure. Nothing is estimated in its place.
        </Empty>
      ) : (
        <>
          <h3 className="gai-h3" style={{ marginBottom: 8 }}>Published infrastructure prices</h3>
          <div className="gai-pr-controls">
            <DateField id="gai-pr-infra-date" label="Prices as of" date={date} setDate={setDate} today={today} max={maxDate} />
          </div>
          <AsOfBanner date={date} today={today} />
          {groups.length === 0 ? (
            <Empty title={`No infrastructure price in effect on ${fmtDate(date)}`}>Compute is often sold by quote or through cloud instance pricing that is not captured here.</Empty>
          ) : (
            <GroupedRecords groups={groups} />
          )}

          <h3 className="gai-h3" style={{ margin: "22px 0 4px" }}>What the record says about cost</h3>
          <p className="gai-small gai-muted" style={{ marginBottom: 10 }}>
            Statements from the dossiers of infrastructure-layer products that mention cost, price, performance per dollar or capital expenditure, picked by keyword. Each keeps its own evidence label: a provider&apos;s efficiency claim is not an independent measurement.
          </p>
          {economics.length === 0 ? (
            <Empty title="No sourced cost statement recorded">No infrastructure dossier contains a statement about cost, price, performance per dollar or capital expenditure.</Empty>
          ) : (
            <div className="gai-grid gai-g2">
              {economics.map(({ entity, claims }) => (
                <section key={entity.id} className="gai-card">
                  <h4 className="gai-h3" style={{ marginBottom: 8 }}><ModelLink id={entity.id} /></h4>
                  <Claims claims={claims} />
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </Sec>
  );
}
