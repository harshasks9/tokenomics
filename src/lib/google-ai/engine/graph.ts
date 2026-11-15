/** Knowledge-graph helpers over canonical relationships. */
import { inEffect } from "../dates";
import { ENTITY_BY_ID, RELATIONSHIPS } from "../kb";
import type { Entity, Relationship, RelationType } from "../types";

export const RELATION_LABEL: Record<RelationType, [forward: string, reverse: string]> = {
  "part-of": ["is part of", "includes"],
  powers: ["powers", "is powered by"],
  "runs-on": ["runs on", "runs"],
  "served-via": ["is served through", "serves"],
  succeeds: ["succeeds", "was succeeded by"],
  "renamed-from": ["was renamed from", "was renamed to"],
  "competes-with": ["competes with", "competes with"],
  integrates: ["integrates with", "integrates with"],
  "depends-on": ["depends on", "is a dependency of"],
  implements: ["implements", "is implemented by"],
  "derived-from": ["derives from", "led to"],
  "partnered-with": ["is partnered with", "is partnered with"],
};

export interface Neighbor {
  edge: Relationship;
  other: Entity;
  /** Phrase read from the focus entity's side. */
  phrase: string;
  outgoing: boolean;
}

/** Edges around an entity, optionally as of a date; edges to unknown ids are dropped (and caught by tests). */
export function neighbors(id: string, asOf?: string, edges: Relationship[] = RELATIONSHIPS): Neighbor[] {
  const out: Neighbor[] = [];
  for (const edge of edges) {
    if (edge.from !== id && edge.to !== id) continue;
    if (asOf && !inEffect(asOf, edge.effectiveFrom, edge.effectiveTo)) continue;
    const outgoing = edge.from === id;
    const other = ENTITY_BY_ID[outgoing ? edge.to : edge.from];
    if (!other) continue;
    out.push({ edge, other, outgoing, phrase: RELATION_LABEL[edge.type][outgoing ? 0 : 1] });
  }
  return out;
}

/** Follow `succeeds` / `renamed-from` back to the origin: the lineage of a product or model. */
export function lineage(id: string, edges: Relationship[] = RELATIONSHIPS): Entity[] {
  const chain: Entity[] = [];
  const seen = new Set<string>([id]);
  let cur = id;
  for (;;) {
    const e = edges.find((r) => r.from === cur && (r.type === "succeeds" || r.type === "renamed-from") && !seen.has(r.to));
    if (!e || !ENTITY_BY_ID[e.to]) break;
    chain.push(ENTITY_BY_ID[e.to]);
    seen.add(e.to);
    cur = e.to;
  }
  return chain;
}

/** Shortest undirected path between two entities (breadth-first), as entity ids. */
export function path(from: string, to: string, edges: Relationship[] = RELATIONSHIPS, maxDepth = 5): string[] | null {
  if (from === to) return [from];
  const adj: Record<string, string[]> = {};
  for (const e of edges) {
    (adj[e.from] ??= []).push(e.to);
    (adj[e.to] ??= []).push(e.from);
  }
  const prev: Record<string, string> = {};
  let frontier = [from];
  const seen = new Set(frontier);
  for (let d = 0; d < maxDepth && frontier.length; d++) {
    const next: string[] = [];
    for (const n of frontier) {
      for (const m of adj[n] ?? []) {
        if (seen.has(m)) continue;
        seen.add(m);
        prev[m] = n;
        if (m === to) {
          const out = [to];
          let c = to;
          while (prev[c]) out.unshift((c = prev[c]));
          return out;
        }
        next.push(m);
      }
    }
    frontier = next;
  }
  return null;
}
