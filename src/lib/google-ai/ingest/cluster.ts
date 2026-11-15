/** De-duplication and clustering of raw items into candidate developments. */
import { norm } from "../engine/search";
import { canonicalUrl } from "./parse";
import type { RawItem } from "./types";

const STOP = new Set("a an and are as at be by for from how in into is it its new of on or our that the this to we what with you your now more".split(" "));

export function tokens(title: string): Set<string> {
  return new Set(norm(title).split(" ").filter((w) => w.length > 1 && !STOP.has(w)));
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

export interface Cluster {
  lead: RawItem;
  members: RawItem[];
}

/**
 * Same URL → same item. Otherwise two items join one cluster when their titles
 * overlap strongly and they were published within three days of each other.
 * The earliest item leads the cluster.
 */
export function cluster(items: RawItem[], threshold = 0.6): Cluster[] {
  const byUrl = new Map<string, RawItem>();
  for (const it of items) {
    const key = canonicalUrl(it.url);
    const prev = byUrl.get(key);
    if (!prev || (it.summary.length > prev.summary.length && !prev.published)) byUrl.set(key, { ...it, url: key });
  }
  const unique = [...byUrl.values()].sort((a, b) => (a.published ?? "9999").localeCompare(b.published ?? "9999"));
  const clusters: (Cluster & { toks: Set<string> })[] = [];
  for (const it of unique) {
    const toks = tokens(it.title);
    const home = clusters.find((c) => jaccard(c.toks, toks) >= threshold && closeInTime(c.lead.published, it.published));
    if (home) home.members.push(it);
    else clusters.push({ lead: it, members: [it], toks });
  }
  return clusters.map(({ lead, members }) => ({ lead, members }));
}

function closeInTime(a?: string, b?: string): boolean {
  if (!a || !b) return true;
  return Math.abs(Date.parse(a) - Date.parse(b)) <= 3 * 86400000;
}

/** Short stable id for a detected item, from its canonical URL. */
export function itemId(url: string): string {
  let h = 2166136261;
  const s = canonicalUrl(url);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return "det-" + (h >>> 0).toString(36);
}
