/**
 * Search — one index over entities, announcements and timeline events.
 * Matches canonical names, aliases, historical names and exact model ids.
 */
import { ANNOUNCEMENTS, ENTITIES, TIMELINE, providerName } from "../kb";
import type { Announcement, Entity, TimelineEvent } from "../types";

export type HitKind = "entity" | "announcement" | "event";

export interface Hit {
  kind: HitKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  score: number;
  /** Why it matched, when the match was not on the current name ("formerly Vertex AI"). */
  via?: string;
  date?: string;
}

interface Doc {
  kind: HitKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  date?: string;
  /** [text, weight, label shown as `via`] */
  fields: [string, number, string?][];
  boost: number;
}

export function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
/** Collapses separators so "gemini-3.1-pro", "gemini 3.1 pro" and "Gemini3.1Pro" meet. */
export function squash(s: string): string {
  return norm(s).replace(/[\s.]+/g, "");
}

const KIND_LABEL: Record<Entity["kind"], string> = {
  provider: "Company",
  "model-family": "Model family",
  model: "Model",
  product: "Product",
  component: "Component",
  infrastructure: "Infrastructure",
  research: "Research",
  protocol: "Protocol",
  plan: "Plan",
  partner: "Partner",
};

function entityDoc(e: Entity): Doc {
  const fields: Doc["fields"] = [[e.name, 10]];
  for (const a of e.aliases) fields.push([a, 8, a]);
  for (const f of e.formerNames ?? []) fields.push([f.name, 8, `formerly ${f.name}`]);
  for (const id of e.model?.apiIds ?? []) fields.push([id, 9, `model id ${id}`]);
  fields.push([e.summary, 1]);
  return {
    kind: "entity",
    id: e.id,
    title: e.name,
    subtitle: `${KIND_LABEL[e.kind]} · ${providerName(e.providerId)}`,
    href: `/google-ai/entity/${e.id}`,
    date: e.introducedAt,
    fields,
    boost: (e.providerId === "google" ? 1.15 : 1) * (e.status === "retired" ? 0.8 : 1),
  };
}
function announcementDoc(a: Announcement): Doc {
  return {
    kind: "announcement",
    id: a.id,
    title: a.title,
    subtitle: `Development · ${a.date}`,
    href: `/google-ai/latest/${a.id}`,
    date: a.date,
    fields: [[a.title, 6], [a.summary.map((c) => c.text).join(" "), 1]],
    boost: 0.9 + a.importance * 0.04,
  };
}
function eventDoc(t: TimelineEvent): Doc {
  return {
    kind: "event",
    id: t.id,
    title: t.title,
    subtitle: `Timeline · ${t.date.slice(0, 4)}`,
    href: `/google-ai/timeline?focus=${t.id}`,
    date: t.date,
    fields: [[t.title, 5], [t.detail, 1]],
    boost: 0.75,
  };
}

let DOCS: Doc[] | null = null;
function docs(): Doc[] {
  return (DOCS ??= [...ENTITIES.map(entityDoc), ...ANNOUNCEMENTS.map(announcementDoc), ...TIMELINE.map(eventDoc)]);
}

function scoreField(text: string, q: string, qs: string, terms: string[]): number {
  const n = norm(text);
  if (!n) return 0;
  const s = squash(text);
  if (n === q || s === qs) return 1;
  if (n.startsWith(q) || (qs.length >= 3 && s.startsWith(qs))) return 0.8;
  if (qs.length >= 4 && s.includes(qs)) return 0.6;
  const words = n.split(" ");
  let hit = 0;
  for (const t of terms) if (words.some((w) => w === t || (t.length >= 3 && w.startsWith(t)))) hit++;
  return hit === terms.length ? 0.5 : terms.length > 1 ? (hit / terms.length) * 0.3 : 0;
}

export interface SearchOptions {
  limit?: number;
  kinds?: HitKind[];
  /** Only return things that existed / were published on or before this date. */
  asOf?: string;
}

export function search(query: string, opts: SearchOptions = {}): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const qs = squash(query);
  const terms = q.split(" ").filter(Boolean);
  const hits: Hit[] = [];
  for (const d of docs()) {
    if (opts.kinds && !opts.kinds.includes(d.kind)) continue;
    if (opts.asOf && d.date && d.date > opts.asOf) continue;
    let best = 0;
    let via: string | undefined;
    for (const [text, weight, label] of d.fields) {
      const sc = scoreField(text, q, qs, terms) * weight;
      if (sc > best) {
        best = sc;
        via = label;
      }
    }
    if (best <= 0) continue;
    hits.push({ kind: d.kind, id: d.id, title: d.title, subtitle: d.subtitle, href: d.href, score: best * d.boost, via, date: d.date });
  }
  return hits.sort((a, b) => b.score - a.score || (b.date ?? "").localeCompare(a.date ?? "")).slice(0, opts.limit ?? 12);
}

/** Resolve free text to one canonical entity (exact name, alias, former name or model id). */
export function resolveEntity(text: string): Entity | undefined {
  const s = squash(text);
  if (!s) return undefined;
  return ENTITIES.find((e) => squash(e.name) === s || e.aliases.some((a) => squash(a) === s) || (e.formerNames ?? []).some((f) => squash(f.name) === s) || (e.model?.apiIds ?? []).some((a) => squash(a) === s));
}
