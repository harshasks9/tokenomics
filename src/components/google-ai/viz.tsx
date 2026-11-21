"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { neighbors, RELATION_LABEL } from "@/lib/google-ai/engine/graph";
import { ENTITY_BY_ID } from "@/lib/google-ai/kb";
import type { RelationType } from "@/lib/google-ai/types";
import { providerColor } from "./ui";

const REL_GROUPS: { label: string; types: RelationType[] }[] = [
  { label: "Structure", types: ["part-of"] },
  { label: "Runs on / served through", types: ["runs-on", "served-via", "depends-on"] },
  { label: "Powers", types: ["powers"] },
  { label: "Lineage", types: ["succeeds", "renamed-from", "derived-from"] },
  { label: "Works with", types: ["integrates", "implements", "partnered-with"] },
  { label: "Competes with", types: ["competes-with"] },
];

/**
 * Knowledge-graph neighbourhood of one entity. Deterministic radial layout:
 * the entity in the centre, every directly related entity on a ring, grouped by
 * kind of relationship. Each line is one canonical relationship with its evidence.
 */
export function EgoGraph({ id, asOf, onPick, max = 22 }: { id: string; asOf?: string; onPick?: (id: string) => void; max?: number }) {
  const [hover, setHover] = useState<string | null>(null);
  const focus = ENTITY_BY_ID[id];
  const all = useMemo(() => neighbors(id, asOf), [id, asOf]);
  const nodes = useMemo(() => {
    const seen = new Set<string>();
    const ordered = REL_GROUPS.flatMap((g) => all.filter((n) => g.types.includes(n.edge.type)).map((n) => ({ n, group: g.label })));
    return ordered.filter(({ n }) => (seen.has(n.other.id) ? false : (seen.add(n.other.id), true))).slice(0, max);
  }, [all, max]);
  const W = 640;
  const H = 440;
  const cx = W / 2;
  const cy = H / 2;
  if (!focus) return null;
  if (!nodes.length) return <p className="gai-muted gai-small">No relationship is recorded for {focus.name} yet.</p>;
  const hovered = nodes.find(({ n }) => n.other.id === hover);
  return (
    <div>
      <svg className="gai-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Relationships of ${focus.name}: ${nodes.length} directly connected entities. The list below gives each one in words.`}>
        {nodes.map(({ n }, i) => {
          const ang = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
          const rx = 240;
          const ry = 165;
          const x = Math.round((cx + Math.cos(ang) * rx) * 100) / 100;
          const y = Math.round((cy + Math.sin(ang) * ry) * 100) / 100;
          const on = hover === n.other.id;
          const right = Math.cos(ang) > 0.15;
          const left = Math.cos(ang) < -0.15;
          const label = n.other.name.length > 26 ? n.other.name.slice(0, 25) + "…" : n.other.name;
          return (
            <g key={n.other.id} onMouseEnter={() => setHover(n.other.id)} onMouseLeave={() => setHover(null)}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke={on ? "var(--accent)" : "var(--line-2)"} strokeWidth={on ? 2 : 1} strokeDasharray={n.edge.type === "competes-with" ? "4 3" : undefined} />
              <a
                href={`/google-ai/entity/${n.other.id}`}
                onClick={(e) => {
                  if (onPick) {
                    e.preventDefault();
                    onPick(n.other.id);
                  }
                }}
                onFocus={() => setHover(n.other.id)}
                onBlur={() => setHover(null)}
                aria-label={`${focus.name} ${n.phrase} ${n.other.name}`}
              >
                <circle cx={x} cy={y} r={on ? 8 : 6} fill={providerColor(n.other.providerId)} stroke="var(--surface)" strokeWidth="2" />
                <text x={x + (right ? 11 : left ? -11 : 0)} y={y + (right || left ? 4 : Math.sin(ang) > 0 ? 20 : -12)} textAnchor={right ? "start" : left ? "end" : "middle"} className={on ? "lbl" : undefined}>{label}</text>
              </a>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={13} fill="var(--ink)" />
        <text x={cx} y={cy + 30} textAnchor="middle" className="lbl">{focus.name.length > 34 ? focus.name.slice(0, 33) + "…" : focus.name}</text>
      </svg>
      <p className="gai-small" style={{ minHeight: 22 }}>
        {hovered ? (
          <>
            <b>{focus.name}</b> {hovered.n.phrase} <b>{hovered.n.other.name}</b>
            {hovered.n.edge.note ? ` — ${hovered.n.edge.note}` : ""}
          </>
        ) : (
          <span className="gai-muted">Hover or focus a node to read the relationship. Dashed lines are competitors. {all.length > nodes.length ? `Showing ${nodes.length} of ${all.length}.` : ""}</span>
        )}
      </p>
    </div>
  );
}

/** The same relationships as a readable list, grouped. This is the accessible equivalent of the graph. */
export function RelationList({ id, asOf, types }: { id: string; asOf?: string; types?: RelationType[] }) {
  const all = neighbors(id, asOf).filter((n) => !types || types.includes(n.edge.type));
  if (!all.length) return <p className="gai-muted gai-small">None recorded.</p>;
  return (
    <ul className="gai-claims">
      {all.map((n) => (
        <li key={n.edge.id}>
          <span>
            <span className="gai-muted">{RELATION_LABEL[n.edge.type][n.outgoing ? 0 : 1]}</span>{" "}
            <Link className="gai-link" href={`/google-ai/entity/${n.other.id}`}>{n.other.name}</Link>
            {n.edge.note ? ` — ${n.edge.note}` : ""}
            {n.edge.conditions ? ` (${n.edge.conditions})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}
