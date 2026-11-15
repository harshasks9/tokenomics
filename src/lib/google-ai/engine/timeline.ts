/**
 * Timeline engine — one unified, dated event list and the snapshot diff.
 *
 * Everything here is a pure function of its arguments (the knowledge base is
 * only the default argument), so each piece can be unit-tested with fixtures.
 *
 *  - `buildTimeline` merges the three canonical dated sources (curated timeline
 *    milestones, the announcement feed, lifecycle records) into one list.
 *  - `timeTicks`, `placeDots`, `placeLabels` are the chart's layout maths.
 *  - `diffSnapshots` compares two as-of snapshots from `engine/asof`.
 */
import { addDays, daysBetween } from "../dates";
import { ANNOUNCEMENTS, ENTITIES, ENTITY_BY_ID, LIFECYCLE, PRICES, TIMELINE } from "../kb";
import type { Announcement, AnnouncementType, Entity, EvidenceLabel, LifecycleEvent, PriceMeter, PriceRecord, PriceSurface, PriceUnit, TimelineEvent, TimelineTrack } from "../types";
import { effectiveOn, pricesAt, scheduledAt, type Snapshot, type StatusAt } from "./asof";

// ───────────────────────── unified events ─────────────────────────

export type UnifiedOrigin = "timeline" | "announcement" | "lifecycle";

export interface UnifiedEvent {
  /** Unique across sources: `tl:<id>`, `an:<id>` or `lc:<id>`. */
  id: string;
  origin: UnifiedOrigin;
  /** Id of the canonical record this row was built from. */
  refId: string;
  /** Ids of other canonical records folded into this row by de-duplication. */
  alsoIds: string[];
  /** Where the event sits in time, normalised to YYYY-MM-DD. Lifecycle records sit on their effective date. */
  date: string;
  precision: "day" | "month" | "year";
  /** Lifecycle records: the day it was made public, when that differs from `date`. */
  announcedAt?: string;
  /** Announcements: the day it takes effect, when that differs from `date`. */
  effectiveDate?: string;
  track: TimelineTrack;
  providerId: string;
  title: string;
  detail: string;
  significance: 1 | 2 | 3;
  /** Announcement detail page or entity page; absent when there is nowhere canonical to link. */
  href?: string;
  entityIds: string[];
  sourceIds: string[];
  /** Evidence label of the underlying record; absent when the record carries none. */
  label?: EvidenceLabel;
  /** True when it takes effect after `today` — announced, not yet in force. */
  scheduled: boolean;
}

export const TRACKS: { id: TimelineTrack; label: string; blurb: string }[] = [
  { id: "macro", label: "Macro", blurb: "Industry-wide turning points" },
  { id: "model", label: "Models", blurb: "Model launches, updates and retirements" },
  { id: "platform", label: "Platform", blurb: "Products, developer and enterprise platforms" },
  { id: "infrastructure", label: "Infrastructure", blurb: "Chips, data centers and compute deals" },
  { id: "research", label: "Research", blurb: "Papers and research results" },
  { id: "pricing", label: "Pricing", blurb: "Price announcements and changes" },
  { id: "competitive", label: "Competitors", blurb: "What rival providers did" },
];
export const TRACK_LABEL = Object.fromEntries(TRACKS.map((t) => [t.id, t.label])) as Record<TimelineTrack, string>;

const TYPE_TRACK: Partial<Record<AnnouncementType, TimelineTrack>> = {
  pricing: "pricing",
  "model-launch": "model",
  "model-update": "model",
  infrastructure: "infrastructure",
  research: "research",
};

/**
 * Track for an announcement. Anything from a provider other than Google is
 * competitive; otherwise the first of its own types that names a track wins
 * (types are listed primary first), and everything else is platform.
 */
export function trackForAnnouncement(a: Pick<Announcement, "providerId" | "types">): TimelineTrack {
  if (a.providerId !== "google") return "competitive";
  for (const t of a.types) {
    const track = TYPE_TRACK[t];
    if (track) return track;
  }
  return "platform";
}

/** Announcement importance (1–5, editorial) on the timeline's 1–3 scale. */
export function significanceOf(importance: number): 1 | 2 | 3 {
  return importance >= 5 ? 3 : importance >= 4 ? 2 : 1;
}

/** Pad a partial ISO date (YYYY or YYYY-MM) to a full day; undefined when it is not a date. */
export function isoDay(d: string | undefined | null): string | undefined {
  if (!d) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(d);
  if (!m) return undefined;
  const iso = `${m[1]}-${m[2] ?? "01"}-${m[3] ?? "01"}`;
  return Number.isNaN(Date.parse(iso + "T00:00:00Z")) ? undefined : iso;
}

/** Where to draw an event: the middle of the month or year when that is all we know. */
export function plotDate(e: Pick<UnifiedEvent, "date" | "precision">): string {
  if (e.precision === "year") return `${e.date.slice(0, 4)}-07-01`;
  if (e.precision === "month") return `${e.date.slice(0, 7)}-15`;
  return e.date;
}

const STOP = new Set(["a", "an", "the", "and", "of", "to", "for", "in", "on", "with", "its", "is", "as", "at", "by"]);

export function titleKey(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Near-identical titles: equal once normalised, one contained in the other, or ≥ 75% of their words shared. */
export function nearSameTitle(a: string, b: string): boolean {
  const x = titleKey(a);
  const y = titleKey(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  if (short.length >= 12 && long.includes(short)) return true;
  const ta = new Set(x.split(" ").filter((w) => !STOP.has(w)));
  const tb = new Set(y.split(" ").filter((w) => !STOP.has(w)));
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  const union = ta.size + tb.size - shared;
  return union > 0 && shared / union >= 0.75;
}

/** Shared title words as a share of the shorter title — looser than nearSameTitle, used only alongside other evidence. */
function titleOverlap(a: string, b: string): number {
  const ta = new Set(titleKey(a).split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
  const tb = new Set(titleKey(b).split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
  let shared = 0;
  for (const w of ta) if (tb.has(w)) shared++;
  return Math.min(ta.size, tb.size) ? shared / Math.min(ta.size, tb.size) : 0;
}

/** Within one day of each other (a blog post is often dated the day after the release). */
function withinADay(a: string, b: string): boolean {
  return Math.abs(Date.parse(a) - Date.parse(b)) <= 86400000;
}

/**
 * The same development recorded twice: near-identical titles on the same date, or — within a day, for the same
 * provider — titles that share at least half their words and name the same product.
 */
function sameDevelopment(t: UnifiedEvent, a: Announcement, date: string): boolean {
  if (sameDate(t, date) && nearSameTitle(t.title, a.title)) return true;
  if (t.precision !== "day" || t.providerId !== a.providerId || !withinADay(t.date, date)) return false;
  const overlap = titleOverlap(t.title, a.title);
  const sharesEntity = t.entityIds.some((id) => a.entityIds.includes(id));
  return overlap >= 0.6 || (overlap >= 0.4 && sharesEntity);
}

function sameDate(t: { date: string; precision: "day" | "month" | "year" }, date: string): boolean {
  const n = t.precision === "year" ? 4 : t.precision === "month" ? 7 : 10;
  return t.date.slice(0, n) === date.slice(0, n);
}

function union(a: string[], b: string[]): string[] {
  return [...new Set([...a, ...b])];
}

export interface TimelineSources {
  timeline: TimelineEvent[];
  announcements: Announcement[];
  lifecycle: LifecycleEvent[];
  entities: Record<string, Entity>;
}

const LIFECYCLE_ON_TIMELINE: LifecycleEvent["type"][] = ["price-change", "retired", "retirement-scheduled"];

/**
 * The unified event list, oldest first.
 *
 * De-duplication: an announcement that shares a date and a near-identical title
 * with a curated timeline event is folded into that event (the event keeps its
 * curated track and wording, gains the announcement's detail page, sources and
 * entities, and takes the higher significance). A scheduled retirement is
 * dropped when a "retired" record exists for the same entity and day.
 * Records without a readable date are left out rather than placed by guesswork.
 */
export function buildTimeline(today: string, src: Partial<TimelineSources> = {}): UnifiedEvent[] {
  const timeline = src.timeline ?? TIMELINE;
  const announcements = src.announcements ?? ANNOUNCEMENTS;
  const lifecycle = src.lifecycle ?? LIFECYCLE;
  const entities = src.entities ?? ENTITY_BY_ID;
  const out: UnifiedEvent[] = [];

  const curated: UnifiedEvent[] = [];
  for (const t of timeline) {
    const date = isoDay(t.date);
    if (!date) continue;
    const firstEntity = t.entityIds.find((id) => entities[id]);
    curated.push({
      id: `tl:${t.id}`,
      origin: "timeline",
      refId: t.id,
      alsoIds: [],
      date,
      precision: t.precision,
      track: t.track,
      providerId: t.providerId,
      title: t.title,
      detail: t.detail,
      significance: t.significance,
      href: firstEntity ? `/google-ai/entity/${firstEntity}` : undefined,
      entityIds: t.entityIds,
      sourceIds: t.sourceIds,
      label: t.label,
      scheduled: date > today,
    });
  }
  out.push(...curated);

  for (const a of announcements) {
    const date = isoDay(a.date);
    if (!date) continue;
    const effective = isoDay(a.effectiveDate);
    const significance = significanceOf(a.importance);
    const href = `/google-ai/latest/${a.id}`;
    const scheduled = (effective ?? date) > today;
    const twin = curated.find((t) => sameDevelopment(t, a, date));
    if (twin) {
      twin.alsoIds.push(a.id);
      twin.href = href;
      twin.significance = Math.max(twin.significance, significance) as 1 | 2 | 3;
      twin.sourceIds = union(twin.sourceIds, a.sourceIds);
      twin.entityIds = union(twin.entityIds, a.entityIds);
      if (effective && effective !== twin.date) twin.effectiveDate = effective;
      twin.scheduled = twin.scheduled || scheduled;
      continue;
    }
    out.push({
      id: `an:${a.id}`,
      origin: "announcement",
      refId: a.id,
      alsoIds: [],
      date,
      precision: "day",
      effectiveDate: effective && effective !== date ? effective : undefined,
      track: trackForAnnouncement(a),
      providerId: a.providerId,
      title: a.title,
      detail: a.summary[0]?.text ?? "",
      significance,
      href,
      entityIds: a.entityIds,
      sourceIds: a.sourceIds.length ? a.sourceIds : (a.summary[0]?.sourceIds ?? []),
      label: a.summary[0]?.label,
      scheduled,
    });
  }

  const retiredOn = new Set(lifecycle.filter((l) => l.type === "retired").map((l) => `${l.entityId}|${isoDay(effectiveOn(l))}`));
  for (const l of lifecycle) {
    if (!LIFECYCLE_ON_TIMELINE.includes(l.type)) continue;
    const date = isoDay(effectiveOn(l));
    const announced = isoDay(l.date);
    if (!date) continue;
    if (l.type === "retirement-scheduled" && retiredOn.has(`${l.entityId}|${date}`)) continue;
    const e = entities[l.entityId];
    const name = e?.name ?? l.entityId;
    const providerId = e?.providerId ?? "unknown";
    const scheduled = date > today;
    let track: TimelineTrack;
    let title: string;
    if (providerId !== "google" && providerId !== "unknown") track = "competitive";
    else if (l.type === "price-change") track = "pricing";
    else track = e && (e.kind === "model" || e.kind === "model-family") ? "model" : "platform";
    if (l.type === "price-change") title = scheduled ? `${name}: price change scheduled` : `${name}: price change`;
    else if (l.type === "retired") title = scheduled ? `${name}: retirement scheduled` : `${name} retired`;
    else if (!l.effectiveDate) title = `${name}: retirement announced, no date given`;
    else title = scheduled ? `${name}: retirement scheduled` : `${name}: scheduled retirement date`;
    out.push({
      id: `lc:${l.id}`,
      origin: "lifecycle",
      refId: l.id,
      alsoIds: [],
      date,
      precision: "day",
      announcedAt: announced && announced !== date ? announced : undefined,
      track,
      providerId,
      title,
      detail: l.detail,
      // Lifecycle records carry no editorial weight, so they are never promoted above the lowest size.
      significance: 1,
      href: e ? `/google-ai/entity/${e.id}` : undefined,
      entityIds: [l.entityId],
      sourceIds: l.sourceIds,
      label: l.label,
      scheduled,
    });
  }

  return out.sort((a, b) => a.date.localeCompare(b.date) || b.significance - a.significance || a.id.localeCompare(b.id));
}

/** Find the unified event for a `?focus=` value: a unified id, a source record id, or a record folded into another. */
export function findEvent(events: UnifiedEvent[], focus: string | null | undefined): UnifiedEvent | undefined {
  if (!focus) return undefined;
  return (
    events.find((e) => e.id === focus) ??
    events.find((e) => e.origin === "timeline" && e.refId === focus) ??
    events.find((e) => e.refId === focus) ??
    events.find((e) => e.alsoIds.includes(focus))
  );
}

/** First and last plotted date of a list, or null when it is empty. */
export function extent(events: UnifiedEvent[]): { min: string; max: string } | null {
  if (!events.length) return null;
  let min = events[0].date;
  let max = events[0].date;
  for (const e of events) {
    if (e.date < min) min = e.date;
    if (e.date > max) max = e.date;
  }
  return { min, max };
}

/** Events whose plotted position falls inside [from, to]. */
export function inRange(events: UnifiedEvent[], from: string, to: string): UnifiedEvent[] {
  return events.filter((e) => {
    const d = plotDate(e);
    return d >= from && d <= to;
  });
}

/**
 * Landmark dates for quick navigation: n events from the highest significance
 * level(s), dated on or before today, one per date. When a level holds more
 * candidates than there is room for, they are sampled evenly across time
 * (always keeping the oldest and the newest) rather than all taken from the
 * most recent weeks. Returned oldest first.
 */
export function landmarkEvents(events: UnifiedEvent[], today: string, n = 6): UnifiedEvent[] {
  const seen = new Set<string>();
  const pool = events
    .filter((e) => e.date <= today && !e.scheduled)
    .sort((a, b) => b.significance - a.significance || a.date.localeCompare(b.date))
    .filter((e) => (seen.has(e.date) ? false : (seen.add(e.date), true)));
  const out: UnifiedEvent[] = [];
  for (const level of [3, 2, 1] as const) {
    const room = n - out.length;
    if (room <= 0) break;
    const tier = pool.filter((e) => e.significance === level);
    if (tier.length <= room) out.push(...tier);
    else if (room === 1) out.push(tier[tier.length - 1]);
    else for (let i = 0; i < room; i++) out.push(tier[Math.round((i * (tier.length - 1)) / (room - 1))]);
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

// ───────────────────────── chart maths ─────────────────────────

/** Position of a date inside [from, to] as a fraction 0–1 (can fall outside for dates out of range). */
export function xFrac(date: string, from: string, to: string): number {
  const span = daysBetween(from, to);
  return span > 0 ? daysBetween(from, date) / span : 0.5;
}

export interface Tick {
  date: string;
  /** Empty for an unlabelled minor tick. */
  label: string;
  major: boolean;
}
export type TickUnit = "year" | "quarter" | "month";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Axis ticks for a window. Long windows get years (thinned to at most
 * `maxLabels` labels), medium windows quarters, short windows months.
 */
export function timeTicks(from: string, to: string, maxLabels = 12): { unit: TickUnit; ticks: Tick[] } {
  const span = daysBetween(from, to);
  const y0 = Number(from.slice(0, 4));
  const y1 = Number(to.slice(0, 4));
  const ticks: Tick[] = [];
  if (!(span > 0) || !Number.isFinite(y0) || !Number.isFinite(y1)) return { unit: "month", ticks };
  const inside = (d: string) => d >= from && d <= to;

  if (span > 2200) {
    const years = y1 - y0 + 1;
    const step = [1, 2, 5, 10, 20, 50, 100].find((s) => years / s <= maxLabels) ?? 100;
    for (let y = y0; y <= y1; y++) {
      const d = `${y}-01-01`;
      if (!inside(d)) continue;
      const major = y % step === 0;
      ticks.push({ date: d, label: major ? String(y) : "", major });
    }
    return { unit: "year", ticks };
  }

  const stepMonths = span > 550 ? 3 : 1;
  const unit: TickUnit = stepMonths === 3 ? "quarter" : "month";
  let first = true;
  for (let y = y0; y <= y1; y++) {
    for (let m = 0; m < 12; m += stepMonths) {
      const d = `${y}-${String(m + 1).padStart(2, "0")}-01`;
      if (!inside(d)) continue;
      const jan = m === 0;
      const short = unit === "quarter" ? `Q${m / 3 + 1}` : MONTHS[m];
      const label = jan ? String(y) : first ? `${short} ${y}` : short;
      ticks.push({ date: d, label, major: jan });
      first = false;
    }
  }
  // Too many month labels to read: keep every other minor label.
  if (ticks.length > maxLabels * 1.6) {
    let k = 0;
    for (const t of ticks) if (!t.major && k++ % 2 === 1) t.label = "";
  }
  return { unit, ticks };
}

export interface PlacedDot<T> {
  item: T;
  x: number;
  r: number;
  row: number;
}

/**
 * Stack dots that would overlap into rows. Greedy left to right: each dot takes
 * the first row with room; when every row is full it goes in the emptiest one.
 */
export function placeDots<T>(items: { item: T; x: number; r: number }[], rows: number, gap = 2): PlacedDot<T>[] {
  const right: number[] = Array.from({ length: Math.max(1, rows) }, () => -Infinity);
  return items
    .slice()
    .sort((a, b) => a.x - b.x)
    .map(({ item, x, r }) => {
      let row = right.findIndex((edge) => x - r >= edge + gap);
      if (row < 0) row = right.indexOf(Math.min(...right));
      right[row] = x + r;
      return { item, x, r, row };
    });
}

export interface PlacedLabel<T> {
  item: T;
  x: number;
  anchor: "start" | "end";
  text: string;
}

/**
 * Direct labels for one lane. Highest priority first; a label that would
 * overlap one already placed is skipped, so the most significant events keep
 * their names and the rest stay reachable by hover, focus and the list.
 */
export function placeLabels<T>(
  cands: { item: T; x: number; text: string; priority: number }[],
  bounds: { min: number; max: number },
  opts: { charWidth?: number; pad?: number; maxChars?: number; maxLabels?: number } = {},
): PlacedLabel<T>[] {
  const charWidth = opts.charWidth ?? 6.4;
  const pad = opts.pad ?? 10;
  const maxChars = opts.maxChars ?? 30;
  const maxLabels = opts.maxLabels ?? Infinity;
  const taken: [number, number][] = [];
  const out: PlacedLabel<T>[] = [];
  const order = cands.slice().sort((a, b) => b.priority - a.priority || a.x - b.x);
  for (const c of order) {
    if (out.length >= maxLabels) break;
    const text = c.text.length > maxChars ? c.text.slice(0, maxChars - 1).trimEnd() + "…" : c.text;
    const w = text.length * charWidth;
    let lo = c.x - 3;
    let hi = lo + w;
    let anchor: "start" | "end" = "start";
    if (hi > bounds.max) {
      hi = c.x + 3;
      lo = hi - w;
      anchor = "end";
    }
    if (lo < bounds.min) continue;
    if (taken.some(([a, b]) => lo < b + pad && hi > a - pad)) continue;
    taken.push([lo, hi]);
    out.push({ item: c.item, x: anchor === "start" ? lo : hi, anchor, text });
  }
  return out;
}

/** Event counts in equal slices of [from, to] — the density strip above the time-machine slider. */
export function density(events: UnifiedEvent[], from: string, to: string, bins: number): number[] {
  const out: number[] = Array.from({ length: Math.max(1, bins) }, () => 0);
  const span = daysBetween(from, to);
  if (!(span > 0)) return out;
  for (const e of events) {
    const f = daysBetween(from, e.date) / span;
    if (f < 0 || f > 1) continue;
    out[Math.min(out.length - 1, Math.floor(f * out.length))]++;
  }
  return out;
}

// ───────────────────────── time machine ─────────────────────────

/** Clamp any input to a real date inside [min, max]; unreadable input gives `fallback`. */
export function clampDate(input: string | null | undefined, min: string, max: string, fallback: string = max): string {
  const d = input && /^\d{4}-\d{2}-\d{2}$/.test(input) ? isoDay(input) : undefined;
  if (!d) return fallback;
  if (d > max) return max;
  if (d < min) return min;
  return d;
}

export interface DatedSources {
  entities: Entity[];
  announcements: Announcement[];
  timeline: TimelineEvent[];
  lifecycle: LifecycleEvent[];
  prices: PriceRecord[];
}

/** The earliest date carried by any record, capped at today; today when nothing is dated. */
export function earliestRecord(today: string, src: Partial<DatedSources> = {}): string {
  const dates: (string | undefined)[] = [
    ...(src.entities ?? ENTITIES).map((e) => e.introducedAt),
    ...(src.announcements ?? ANNOUNCEMENTS).map((a) => a.date),
    ...(src.timeline ?? TIMELINE).map((t) => t.date),
    ...(src.lifecycle ?? LIFECYCLE).map((l) => l.date),
    ...(src.prices ?? PRICES).map((p) => p.effectiveFrom),
  ];
  let min = today;
  for (const raw of dates) {
    const d = isoDay(raw);
    if (d && d < min) min = d;
  }
  return min;
}

export interface Coverage {
  /** Existed on the date. */
  existed: number;
  /** In today's knowledge base but introduced after the date. A count only: naming them would leak the future. */
  notYet: number;
  /** Retired on or before the date. */
  retired: number;
  /** No introduction date recorded, so never placed in the past. */
  undated: number;
  total: number;
}

/** How today's knowledge base maps onto a date. Provider entities are not counted. */
export function coverageAt(date: string, entities: Entity[] = ENTITIES): Coverage {
  const c: Coverage = { existed: 0, notYet: 0, retired: 0, undated: 0, total: 0 };
  for (const e of entities) {
    if (e.kind === "provider") continue;
    c.total++;
    if (!e.introducedAt) c.undated++;
    else if (date < e.introducedAt) c.notYet++;
    else if (e.retiredAt && date >= e.retiredAt) c.retired++;
    else c.existed++;
  }
  return c;
}

/** Records that describe the same priced thing: entity, surface, meter, tier, region and context tier. */
export function samePriceLine(a: PriceRecord, b: PriceRecord): boolean {
  return (
    a.entityId === b.entityId &&
    a.surface === b.surface &&
    a.meter === b.meter &&
    a.tier === b.tier &&
    (a.region ?? "global") === (b.region ?? "global") &&
    (a.aboveContextTokens ?? null) === (b.aboveContextTokens ?? null)
  );
}

/** How we know a future-dated price had been made public by the as-of date. */
export type KnownBy =
  | { basis: "published"; on: string } // the record carries its publication date
  | { basis: "lifecycle"; on: string } // a dated price-change record for the same entity and effective date
  | { basis: "source-read"; on: string }; // the source was last read on or before the date and already carried it

export interface Pending {
  /** Prices known on or before the date that take effect after it, with the price they replace. */
  prices: { next: PriceRecord; current?: PriceRecord; known: KnownBy }[];
  /** Later prices we cannot show were public by the date: no publication date, no dated lifecycle record, source read later. Counted, never listed. */
  undatedPrices: number;
  lifecycle: LifecycleEvent[];
  announcements: Announcement[];
}

/**
 * What had been announced by a date but was not yet in effect on it.
 * `scheduledAt` lets through price records with no publication date; those are
 * only listed here when something dated shows they were public by then.
 */
export function pendingAt(date: string, src: { prices?: PriceRecord[]; lifecycle?: LifecycleEvent[]; announcements?: Announcement[] } = {}): Pending {
  const prices = src.prices ?? PRICES;
  const lifecycle = src.lifecycle ?? LIFECYCLE;
  const scheduled = scheduledAt(date, prices);
  const current = pricesAt(date, prices);
  const listed: Pending["prices"] = [];
  for (const next of scheduled) {
    let known: KnownBy | undefined;
    if (next.publishedAt) known = { basis: "published", on: next.publishedAt };
    else {
      const l = lifecycle.find((x) => x.type === "price-change" && x.entityId === next.entityId && x.date <= date && x.effectiveDate === next.effectiveFrom);
      if (l) known = { basis: "lifecycle", on: l.date };
      else if (next.lastCheckedAt && next.lastCheckedAt <= date) known = { basis: "source-read", on: next.lastCheckedAt };
    }
    if (known) listed.push({ next, current: current.find((p) => p.id !== next.id && samePriceLine(p, next)), known });
  }
  const rank = (p: PriceRecord) => (isHeadlinePrice(p) && (p.meter === "input" || p.meter === "output" || p.meter === "seat-month") ? 0 : 1);
  return {
    prices: listed.sort((a, b) => a.next.effectiveFrom.localeCompare(b.next.effectiveFrom) || rank(a.next) - rank(b.next) || a.next.entityId.localeCompare(b.next.entityId)),
    undatedPrices: scheduled.length - listed.length,
    lifecycle: lifecycle
      .filter((l) => l.date <= date && !!l.effectiveDate && l.effectiveDate > date)
      .sort((a, b) => (a.effectiveDate ?? "").localeCompare(b.effectiveDate ?? "")),
    announcements: (src.announcements ?? ANNOUNCEMENTS)
      .filter((a) => a.date <= date && !!a.effectiveDate && a.effectiveDate > date)
      .sort((a, b) => (a.effectiveDate ?? "").localeCompare(b.effectiveDate ?? "")),
  };
}

// ───────────────────────── snapshot diff ─────────────────────────

export interface SnapshotEntity {
  entity: Entity;
  name: string;
  status: StatusAt;
}

export interface PriceChange {
  entityId: string;
  providerId: string;
  surface: PriceSurface;
  meter: PriceMeter;
  unit: PriceUnit;
  condition?: string;
  before: PriceRecord;
  after: PriceRecord;
  /** after − before, in the record's unit. */
  delta: number;
  /** Relative change, or null when the earlier price was zero. */
  pct: number | null;
}

export interface SnapshotDiff {
  /** The earlier of the two dates. */
  from: string;
  /** The later of the two dates. */
  to: string;
  /** Present on the later date, not on the earlier one. Named as on the later date. */
  added: SnapshotEntity[];
  /** Present and not retired on the earlier date; gone or retired by the later one. Named as on the earlier date. */
  retired: { entity: Entity; name: string; on?: string }[];
  /** Present on both dates under different names. */
  renamed: { entity: Entity; before: string; after: string }[];
  /** Headline list-price lines in effect on both dates at different prices. */
  priceChanges: PriceChange[];
}

/** Headline list price: standard tier, global endpoint, base context window. */
export function isHeadlinePrice(p: PriceRecord): boolean {
  return p.tier === "standard" && p.aboveContextTokens == null && (p.region ?? "global") === "global";
}

function headlineIndex(rows: PriceRecord[]): Map<string, PriceRecord> {
  const out = new Map<string, PriceRecord>();
  for (const p of rows) {
    if (!isHeadlinePrice(p)) continue;
    const key = [p.entityId, p.surface, p.meter, p.unit, p.condition ?? ""].join("|");
    const prev = out.get(key);
    // Two records for one line on one day should not happen; if they do, the later-dated one wins.
    if (!prev || p.effectiveFrom > prev.effectiveFrom) out.set(key, p);
  }
  return out;
}

/**
 * What changed between two as-of snapshots. Order of the arguments does not
 * matter: the earlier date is always "before". Works on whatever the
 * snapshots contain, so a provider-scoped pair gives a provider-scoped diff
 * (price records are not provider-scoped by `snapshotAt`; filter the result).
 * An entity both introduced and retired strictly between the two dates is in
 * neither snapshot and therefore in neither list.
 */
export function diffSnapshots(a: Snapshot, b: Snapshot): SnapshotDiff {
  const [early, late] = a.date <= b.date ? [a, b] : [b, a];
  const real = (x: SnapshotEntity) => x.entity.kind !== "provider";
  const before = new Map(early.entities.filter(real).map((x) => [x.entity.id, x]));
  const after = new Map(late.entities.filter(real).map((x) => [x.entity.id, x]));

  const added = [...after.values()]
    .filter((x) => !before.has(x.entity.id))
    .sort((x, y) => (y.entity.introducedAt ?? "").localeCompare(x.entity.introducedAt ?? ""));

  const retired: SnapshotDiff["retired"] = [];
  const renamed: SnapshotDiff["renamed"] = [];
  for (const x of before.values()) {
    if (x.status.status === "retired") continue;
    const now = after.get(x.entity.id);
    if (!now || now.status.status === "retired") {
      retired.push({ entity: x.entity, name: x.name, on: now?.status.since ?? x.entity.retiredAt });
      continue;
    }
    if (now.name !== x.name) renamed.push({ entity: x.entity, before: x.name, after: now.name });
  }

  const pa = headlineIndex(early.prices);
  const pb = headlineIndex(late.prices);
  const priceChanges: PriceChange[] = [];
  for (const [key, was] of pa) {
    const is = pb.get(key);
    if (!is || Math.abs(is.price - was.price) < 1e-12) continue;
    priceChanges.push({
      entityId: was.entityId,
      providerId: is.providerId,
      surface: was.surface,
      meter: was.meter,
      unit: was.unit,
      condition: was.condition,
      before: was,
      after: is,
      delta: is.price - was.price,
      pct: was.price !== 0 ? (is.price - was.price) / was.price : null,
    });
  }
  priceChanges.sort(
    (x, y) =>
      Number(y.providerId === "google") - Number(x.providerId === "google") ||
      x.providerId.localeCompare(y.providerId) ||
      x.entityId.localeCompare(y.entityId) ||
      x.surface.localeCompare(y.surface) ||
      x.meter.localeCompare(y.meter),
  );

  return { from: early.date, to: late.date, added, retired, renamed, priceChanges };
}

/** Window start for a "last N days" preset. */
export function windowStart(today: string, days: number): string {
  return addDays(today, -days);
}
