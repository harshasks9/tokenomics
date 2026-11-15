/** Briefing and change-radar logic over the announcement feed. */
import { addDays } from "../dates";
import { ANNOUNCEMENTS, LIFECYCLE, entityName } from "../kb";
import type { Announcement, AnnouncementType, LifecycleEvent, RadarArea } from "../types";

export const WINDOWS = [
  { id: "7d", days: 7, label: "7 days" },
  { id: "30d", days: 30, label: "30 days" },
  { id: "90d", days: 90, label: "90 days" },
  { id: "12m", days: 365, label: "12 months" },
] as const;
export type WindowId = (typeof WINDOWS)[number]["id"];

export function inWindow(today: string, days: number, rows: Announcement[] = ANNOUNCEMENTS): Announcement[] {
  const from = addDays(today, -days);
  return rows.filter((a) => a.date > from && a.date <= today);
}

/** Top developments: editorial importance first, then recency. */
export function top(today: string, days: number, n = 5, rows: Announcement[] = ANNOUNCEMENTS): Announcement[] {
  return inWindow(today, days, rows)
    .slice()
    .sort((a, b) => b.importance - a.importance || b.date.localeCompare(a.date))
    .slice(0, n);
}

export const AREAS: { id: RadarArea; label: string }[] = [
  { id: "models", label: "Models" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "developer-platforms", label: "Developer platforms" },
  { id: "enterprise-agents", label: "Enterprise agents" },
  { id: "workspace", label: "Workspace" },
  { id: "search-consumer", label: "Search & consumer" },
  { id: "multimodal", label: "Multimodal" },
  { id: "safety-governance", label: "Safety & governance" },
  { id: "research", label: "Research" },
];

export interface RadarCell {
  area: RadarArea;
  label: string;
  /** Number of canonical developments. Volume, not leadership. */
  count: number;
  /** Developments rated 4–5 by the editors. */
  major: number;
  /** Count in the preceding window of equal length, for a like-for-like trend. */
  previous: number;
  items: Announcement[];
}

export function radar(today: string, days: number, rows: Announcement[] = ANNOUNCEMENTS): RadarCell[] {
  const now = inWindow(today, days, rows);
  const before = inWindow(addDays(today, -days), days, rows);
  return AREAS.map(({ id, label }) => {
    const items = now.filter((a) => a.areas.includes(id));
    return { area: id, label, count: items.length, major: items.filter((a) => a.importance >= 4).length, previous: before.filter((a) => a.areas.includes(id)).length, items };
  });
}

export const TYPE_LABEL: Record<AnnouncementType, string> = {
  "model-launch": "Model launch",
  "model-update": "Model update",
  pricing: "Pricing",
  availability: "Availability",
  deprecation: "Deprecation",
  "product-launch": "Product launch",
  "product-update": "Product update",
  rename: "Rename",
  infrastructure: "Infrastructure",
  research: "Research",
  benchmark: "Benchmark",
  partnership: "Partnership",
  customer: "Customer",
  acquisition: "Acquisition",
  "safety-governance": "Safety & governance",
  "policy-regulatory": "Policy & regulation",
  "open-source": "Open source",
  event: "Event",
  financial: "Financial",
};

export interface Deadline {
  event: LifecycleEvent;
  on: string;
  days: number;
  name: string;
}

/** Dated things that have been announced and take effect after today. */
export function deadlines(today: string, rows: LifecycleEvent[] = LIFECYCLE): Deadline[] {
  return rows
    .filter((l) => (l.effectiveDate ?? "") > today)
    .map((event) => {
      const on = event.effectiveDate as string;
      return { event, on, days: Math.round((Date.parse(on) - Date.parse(today)) / 86400000), name: entityName(event.entityId) };
    })
    .sort((a, b) => a.on.localeCompare(b.on));
}
