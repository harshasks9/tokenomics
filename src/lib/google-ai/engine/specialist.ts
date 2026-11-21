/** Selection logic for the specialist pages: must-know developments, case studies and workloads by industry and sub-region. */
import { addDays } from "../dates";
import { WORKLOADS } from "../editorial";
import { ANNOUNCEMENTS, CASES, NOTE_BY_ANNOUNCEMENT, TIMELINE } from "../kb";
import { SUB_VERTICAL_BY_ID } from "../taxonomy";
import type { Announcement, CaseStudy, EnterpriseWorkload, RegionId, SegmentId, SpecialistNote, TimelineEvent } from "../types";

export interface MustKnow {
  a: Announcement;
  note?: SpecialistNote;
}

export interface Scope {
  region?: RegionId | "all";
  /** Selected sub-vertical ids. Empty = every industry. */
  subVerticals?: string[];
}

/** A note applies to a region when it names it, or names none (it applies everywhere). */
export function inRegion(regions: RegionId[] | undefined, region: RegionId | "all" | undefined): boolean {
  if (!region || region === "all") return true;
  return !regions || regions.length === 0 || regions.includes(region);
}

function inVerticals(tagged: string[] | undefined, selected: string[] | undefined): boolean {
  if (!selected || selected.length === 0) return true;
  // An untagged item is general: it is relevant to every industry.
  if (!tagged || tagged.length === 0) return true;
  return tagged.some((t) => selected.includes(t));
}

/**
 * Developments a specialist should know, newest window first. Ranked: flagged must-know, then editorial weight,
 * then recency. `days` widens automatically (14 → 30 → 60) until at least `min` items are found, and reports the window used.
 */
export function mustKnow(today: string, scope: Scope = {}, opts: { days?: number; min?: number; limit?: number; onlyFlagged?: boolean } = {}, rows: Announcement[] = ANNOUNCEMENTS, notes: Record<string, SpecialistNote> = NOTE_BY_ANNOUNCEMENT): { items: MustKnow[]; days: number } {
  const windows = opts.days ? [opts.days] : [14, 30, 60];
  const pick = (days: number) => {
    const from = addDays(today, -days);
    return rows
      .filter((a) => a.date > from && a.date <= today)
      .map((a) => ({ a, note: notes[a.id] }))
      .filter((x) => inRegion(x.note?.regions, scope.region) && inVerticals(x.note?.subVerticals, scope.subVerticals))
      .filter((x) => (opts.onlyFlagged ? x.note?.mustKnow : x.note?.mustKnow || x.a.importance >= 3))
      .sort((x, y) => Number(!!y.note?.mustKnow) - Number(!!x.note?.mustKnow) || y.a.importance - x.a.importance || y.a.date.localeCompare(x.a.date));
  };
  let days = windows[0];
  let items = pick(days);
  for (const d of windows.slice(1)) {
    if (items.length >= (opts.min ?? 5)) break;
    days = d;
    items = pick(d);
  }
  return { items: items.slice(0, opts.limit ?? 12), days };
}

export interface CaseFilter extends Scope {
  platform?: "all" | "google-cloud" | "other";
  segment?: SegmentId | "all";
  q?: string;
}

export function casesFor(f: CaseFilter = {}, rows: CaseStudy[] = CASES): CaseStudy[] {
  const needle = f.q?.trim().toLowerCase();
  return rows.filter((c) => {
    if (f.platform && f.platform !== "all" && c.platform !== f.platform) return false;
    if (f.segment && f.segment !== "all" && c.segment !== f.segment) return false;
    if (f.region && f.region !== "all" && !c.regions.includes(f.region)) return false;
    if (f.subVerticals?.length && !c.subVerticals.some((s) => f.subVerticals!.includes(s))) return false;
    if (needle && !`${c.customer} ${c.title} ${c.country} ${c.products.join(" ")} ${c.providers.join(" ")}`.toLowerCase().includes(needle)) return false;
    return true;
  });
}

/** Which sub-verticals each reference workload speaks to. Editorial mapping. */
export const WORKLOAD_VERTICALS: Record<string, string[]> = {
  "secure-voice-agent": ["ent-banking", "ent-insurance", "ent-telecom", "ent-healthcare", "ps-central", "ps-health", "ent-travel", "dn-fintech"],
  "employee-knowledge-assistant": ["ent-banking", "ent-insurance", "ent-manufacturing", "ent-conglomerate", "ent-energy", "ps-central", "ps-local", "edu-higher", "ent-healthcare"],
  "software-engineering-agents": ["dn-saas", "dn-ai-native", "dn-gaming", "dn-fintech", "dn-ecommerce", "ent-banking", "ent-telecom", "dn-mobility"],
  "agentic-commerce": ["dn-ecommerce", "ent-retail", "ent-travel", "dn-mobility", "dn-adtech", "dn-fintech"],
  "document-processing": ["ent-banking", "ent-insurance", "ps-central", "ps-local", "ps-health", "ent-healthcare", "ent-conglomerate"],
  "governed-multi-agent": ["ent-banking", "ent-telecom", "ent-manufacturing", "ent-conglomerate", "dn-saas", "ent-energy"],
  "sovereign-regulated": ["ps-central", "ps-defence", "ps-local", "ent-banking", "ps-health"],
  "data-analytics-agent": ["ent-retail", "ent-manufacturing", "ent-media", "dn-ecommerce", "dn-media", "dn-gaming", "edu-research", "ent-energy", "ent-travel"],
};

export function workloadsFor(subVerticals: string[], rows: EnterpriseWorkload[] = WORKLOADS): EnterpriseWorkload[] {
  if (!subVerticals.length) return rows;
  return rows.filter((w) => (WORKLOAD_VERTICALS[w.id] ?? []).some((v) => subVerticals.includes(v)));
}

/** Competitor moves in the last `days`. */
export function rivalMoves(today: string, days = 21, rows: TimelineEvent[] = TIMELINE): TimelineEvent[] {
  const from = addDays(today, -days);
  return rows.filter((t) => t.providerId !== "google" && t.date > from && t.date <= today).sort((a, b) => b.date.localeCompare(a.date));
}

/** How many notes and cases each sub-vertical has: shown beside each checkbox. */
export function verticalCounts(today: string, region: RegionId | "all" = "all"): Record<string, { news: number; cases: number }> {
  const out: Record<string, { news: number; cases: number }> = {};
  for (const id of Object.keys(SUB_VERTICAL_BY_ID)) {
    out[id] = {
      news: mustKnow(today, { region, subVerticals: [id] }, { days: 60, limit: 99 }).items.filter((x) => x.note?.subVerticals.includes(id)).length,
      cases: casesFor({ region, subVerticals: [id] }).length,
    };
  }
  return out;
}
