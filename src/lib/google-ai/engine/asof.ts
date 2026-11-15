/**
 * Time machine — reconstruct the ecosystem as it stood on a date.
 *
 * Rules (acceptance test E):
 *  - Only records whose EFFECTIVE date is on or before the date are used.
 *    Something announced but not yet in effect shows as "announced", not live.
 *  - Names are the names in use on that date (formerNames with from/to).
 *  - Entities with no introduction date are never guessed into the past; they
 *    are returned separately as `undated`.
 */
import { inEffect } from "../dates";
import { ANNOUNCEMENTS, ENTITIES, LIFECYCLE_BY_ENTITY, PRICES, TIMELINE } from "../kb";
import type { Announcement, Entity, EntityStatus, LifecycleEvent, PriceRecord, TimelineEvent } from "../types";

/** The name an entity carried on a date. */
export function nameAt(e: Entity, date: string): string {
  for (const f of e.formerNames ?? []) {
    if (f.to && date < f.to && (!f.from || date >= f.from)) return f.name;
  }
  return e.name;
}

const STATUS_FROM_EVENT: Partial<Record<LifecycleEvent["type"], EntityStatus>> = {
  announced: "announced",
  preview: "preview",
  ga: "ga",
  deprecated: "deprecated",
  retired: "retired",
};

/** Date a lifecycle event actually bites. */
export function effectiveOn(l: LifecycleEvent): string {
  return l.effectiveDate ?? l.date;
}

export interface StatusAt {
  status: EntityStatus | "not-yet" | "unknown";
  /** True when the status comes from dated lifecycle evidence rather than inference. */
  evidenced: boolean;
  since?: string;
}

export function statusAt(e: Entity, date: string, lifecycle: LifecycleEvent[] = LIFECYCLE_BY_ENTITY[e.id] ?? []): StatusAt {
  if (e.introducedAt && date < e.introducedAt) return { status: "not-yet", evidenced: true };
  if (e.retiredAt && date >= e.retiredAt) return { status: "retired", evidenced: true, since: e.retiredAt };
  let best: { status: EntityStatus; on: string } | null = null;
  for (const l of lifecycle) {
    // A scheduled retirement only becomes "retired" on its effective date.
    const type = l.type === "retirement-scheduled" ? "retired" : l.type;
    const mapped = STATUS_FROM_EVENT[type];
    if (!mapped) continue;
    const on = l.type === "retirement-scheduled" ? l.effectiveDate : effectiveOn(l);
    if (!on || on > date) continue;
    if (!best || on >= best.on) best = { status: mapped, on };
  }
  if (best) {
    // "Announced" is only trusted as the stage while nothing says it later shipped. If the product is known to have
    // moved on but no dated preview or GA event is recorded, its stage on this date is unknown — not "announced".
    const laterStage = lifecycle.some((l) => (l.type === "preview" || l.type === "ga") && effectiveOn(l) > date);
    if (best.status === "announced" && !laterStage && e.status !== "announced") return { status: "unknown", evidenced: false, since: best.on };
    return { status: best.status, evidenced: true, since: best.on };
  }
  if (!e.introducedAt) return { status: "unknown", evidenced: false };
  // Introduced before the date but no dated stage change recorded: we know it existed, not its stage.
  return { status: e.status === "retired" || e.status === "deprecated" ? "unknown" : e.status, evidenced: false, since: e.introducedAt };
}

export function existedAt(e: Entity, date: string): boolean {
  if (!e.introducedAt) return false;
  if (date < e.introducedAt) return false;
  if (e.retiredAt && date >= e.retiredAt) return false;
  return true;
}

/** Price records in effect on a date. Future-dated records are excluded. */
export function pricesAt(date: string, rows: PriceRecord[] = PRICES): PriceRecord[] {
  return rows.filter((p) => inEffect(date, p.effectiveFrom, p.effectiveTo));
}

/** Price records published on or before a date that take effect after it. */
export function scheduledAt(date: string, rows: PriceRecord[] = PRICES): PriceRecord[] {
  return rows.filter((p) => p.effectiveFrom > date && (!p.publishedAt || p.publishedAt <= date));
}

export interface Snapshot {
  date: string;
  entities: { entity: Entity; name: string; status: StatusAt }[];
  undated: Entity[];
  prices: PriceRecord[];
  announcements: Announcement[];
  timeline: TimelineEvent[];
  /** What changed in the 90 days up to the date. */
  recent: Announcement[];
}

export function snapshotAt(date: string, opts: { providerId?: string } = {}): Snapshot {
  const pool = opts.providerId ? ENTITIES.filter((e) => e.providerId === opts.providerId) : ENTITIES;
  const entities = pool
    .filter((e) => existedAt(e, date))
    .map((e) => ({ entity: e, name: nameAt(e, date), status: statusAt(e, date) }));
  const undated = pool.filter((e) => !e.introducedAt && e.kind !== "provider");
  const announcements = ANNOUNCEMENTS.filter((a) => a.date <= date);
  const from = new Date(Date.parse(date + "T00:00:00Z") - 90 * 86400000).toISOString().slice(0, 10);
  return {
    date,
    entities,
    undated,
    prices: pricesAt(date),
    announcements,
    timeline: TIMELINE.filter((t) => t.date <= date),
    recent: announcements.filter((a) => a.date >= from),
  };
}

/** Flagship text models of a provider that existed on a date, newest first. */
export function currentModelsAt(date: string, providerId: string): Entity[] {
  return ENTITIES.filter((e) => e.kind === "model" && e.providerId === providerId && existedAt(e, date)).sort((a, b) =>
    (b.introducedAt ?? "").localeCompare(a.introducedAt ?? ""),
  );
}
