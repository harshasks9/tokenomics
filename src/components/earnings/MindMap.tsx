"use client";

import { useMemo, useState } from "react";
import {
  MAP_CENTER,
  MAP_EDGES,
  MAP_NODES,
  ZONES,
  type Layer,
  type MapNode,
} from "@/lib/earnings/data";
import { MAP_CX, MAP_CY, MAP_H, MAP_W, arc, placeMap, trim } from "@/lib/earnings/layout";
import { Pill, Reveal, ZoneHead, layerClass, useReveal } from "./primitives";

const ACCENT: Record<Layer, string> = {
  models: "var(--models)",
  hyperscalers: "var(--hyperscalers)",
  platforms: "var(--platforms)",
  economics: "var(--economics)",
};

const ACCENT_SOFT: Record<Layer, string> = {
  models: "var(--models-soft)",
  hyperscalers: "var(--hyperscalers-soft)",
  platforms: "var(--platforms-soft)",
  economics: "var(--economics-soft)",
};

/**
 * Explicit line breaks for the labels that no balanced split gets inside its
 * circle. Everything else goes through `wrap`.
 */
const LINES: Record<string, string[]> = {
  models: ["Model", "providers"],
  hyperscalers: ["Hyper-", "scalers"],
  platforms: ["Data & app", "platforms"],
  control: ["Control", "points"],
  openweights: ["Chinese", "open weights"],
  orchestration: ["Orchestration", "& routing"],
};

/** Balanced two-line split, so no line exceeds the node's inner width. */
function wrap(node: MapNode): string[] {
  if (LINES[node.id]) return LINES[node.id];
  const label = node.label;
  if (label.length <= 11) return [label];
  const words = label.split(" ");
  if (words.length === 1) return [label];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export default function MindMap({ onJump }: { onJump: (zone: number) => void }) {
  const placed = useMemo(() => placeMap(), []);
  const byId = useMemo(() => new Map(placed.map((p) => [p.node.id, p])), [placed]);
  const [selected, setSelected] = useState<string>("control");
  const [hover, setHover] = useState<string | null>(null);
  const { ref, shown } = useReveal<HTMLDivElement>();

  const node: MapNode = useMemo(
    () => MAP_NODES.find((n) => n.id === selected) ?? MAP_NODES[0],
    [selected],
  );

  const edges = useMemo(
    () =>
      MAP_EDGES.map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const t = trim(a.x, a.y, a.r + 4, b.x, b.y, b.r + 4);
        const { d, mx, my } = arc(t.x1, t.y1, t.x2, t.y2, e.bend, e.labelT);
        return { ...e, d, mx, my };
      }).filter((e): e is NonNullable<typeof e> => e !== null),
    [byId],
  );

  const zone = ZONES.find((z) => z.n === node.jump);

  return (
    <>
      <ZoneHead
        n={2}
        kicker="The stack"
        title="Four branches, one control point"
        lede="Click any node for its metrics and quotes. The curved links are the money and dependency edges that bind the layers together."
      />

      <div className="ea-map-wrap" ref={ref} data-shown={shown}>
        <div>
          <div className="ea-scroll">
            <svg
              viewBox={`0 0 ${MAP_W} ${MAP_H}`}
              role="img"
              aria-labelledby="ea-map-t ea-map-d"
            >
              <title id="ea-map-t">The enterprise AI stack as a hub-and-spoke map</title>
              <desc id="ea-map-d">
                Four branches radiate from the enterprise AI stack: model providers, hyperscalers,
                data and app platforms, and control points. Four labelled links show the major money
                and dependency flows: Google commits up to 1M TPUs to Anthropic, AWS holds a $53.4B
                unrealized Anthropic equity gain, ~45% of Microsoft&rsquo;s $625B commercial RPO is
                tied to OpenAI, and OpenAI has committed $300B over five years to Oracle. Every
                figure is also listed in the panel beside the map.
              </desc>

              {/* Spokes: centre → hub, hub → leaf */}
              <g aria-hidden="true">
                {placed
                  .filter((p) => p.node.kind === "hub")
                  .map((p) => {
                    const t = trim(MAP_CX, MAP_CY, 62, p.x, p.y, p.r);
                    return (
                      <line
                        key={`spoke-${p.node.id}`}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={ACCENT[p.node.layer]}
                        strokeWidth={1.5}
                        opacity={0.55}
                      />
                    );
                  })}
                {placed
                  .filter((p) => p.node.kind === "leaf")
                  .map((p) => {
                    const hub = byId.get(p.node.hub as string);
                    if (!hub) return null;
                    const t = trim(hub.x, hub.y, hub.r, p.x, p.y, p.r);
                    return (
                      <line
                        key={`twig-${p.node.id}`}
                        x1={t.x1}
                        y1={t.y1}
                        x2={t.x2}
                        y2={t.y2}
                        stroke={ACCENT[p.node.layer]}
                        strokeWidth={1}
                        opacity={0.32}
                      />
                    );
                  })}
              </g>

              {/* Money / dependency edges — strokes under the nodes… */}
              <g>
                {edges.map((e) => {
                  const active =
                    hover === e.from || hover === e.to || selected === e.from || selected === e.to;
                  return (
                    <path
                      key={`${e.from}-${e.to}`}
                      d={e.d}
                      data-c={e.c}
                      fill="none"
                      stroke="var(--prussian)"
                      strokeWidth={active ? 2.2 : 1.4}
                      strokeDasharray="5 4"
                      opacity={active ? 0.95 : 0.45}
                    />
                  );
                })}
              </g>

              {/* Centre */}
              <g aria-hidden="true">
                <circle cx={MAP_CX} cy={MAP_CY} r={62} fill="var(--prussian)" />
                <text
                  x={MAP_CX}
                  y={MAP_CY - 6}
                  textAnchor="middle"
                  fill="#fff"
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  Enterprise
                </text>
                <text
                  x={MAP_CX}
                  y={MAP_CY + 9}
                  textAnchor="middle"
                  fill="#fff"
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  AI stack
                </text>
                <text
                  x={MAP_CX}
                  y={MAP_CY + 26}
                  textAnchor="middle"
                  fill="rgba(255,255,255,.62)"
                  style={{ fontSize: 9, letterSpacing: "0.06em" }}
                >
                  {MAP_CENTER.sub.split(" ").slice(0, 3).join(" ")}
                </text>
              </g>

              {/* Nodes */}
              <g>
                {placed.map((p) => {
                  const isHub = p.node.kind === "hub";
                  const on = selected === p.node.id;
                  const lines = wrap(p.node);
                  return (
                    <g
                      key={p.node.id}
                      className="ea-node"
                      role="button"
                      tabIndex={0}
                      aria-label={`${p.node.label} — ${p.node.blurb}`}
                      aria-pressed={on}
                      onClick={() => setSelected(p.node.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(p.node.id);
                        }
                      }}
                      onPointerEnter={() => setHover(p.node.id)}
                      onPointerLeave={() => setHover(null)}
                      onFocus={() => setHover(p.node.id)}
                      onBlur={() => setHover(null)}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.r}
                        fill={isHub ? ACCENT[p.node.layer] : ACCENT_SOFT[p.node.layer]}
                        stroke={ACCENT[p.node.layer]}
                        strokeWidth={on ? 3 : 1.25}
                      />
                      {on ? (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={p.r + 5}
                          fill="none"
                          stroke={ACCENT[p.node.layer]}
                          strokeWidth={1}
                          opacity={0.5}
                        />
                      ) : null}
                      {lines.map((line, i) => (
                        <text
                          key={i}
                          className={isHub ? "ea-hub-label" : "ea-node-label"}
                          x={p.x}
                          y={p.y + 4 + (i - (lines.length - 1) / 2) * 12}
                          textAnchor="middle"
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  );
                })}
              </g>

              {/* …and their labels over the top, so a node can never bury one. */}
              <g>
                {edges.map((e) => {
                  const active =
                    hover === e.from || hover === e.to || selected === e.from || selected === e.to;
                  const w = e.label.length * 6.2 + 12;
                  return (
                    <g key={`${e.from}-${e.to}-label`} data-c={e.c}>
                      <rect
                        x={e.mx - w / 2}
                        y={e.my - 9}
                        width={w}
                        height={17}
                        rx={2}
                        fill="var(--paper)"
                        stroke={active ? "var(--prussian)" : "var(--rule)"}
                        strokeWidth={active ? 1 : 0.75}
                      />
                      <text className="ea-edge-label" x={e.mx} y={e.my + 3.5} textAnchor="middle">
                        {e.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
          <p className="ea-hint">Scroll the map sideways →</p>
        </div>

        {/* Detail panel */}
        <aside className={`ea-panel ${layerClass(node.layer)}`} aria-live="polite">
          <p className="ea-kicker" style={{ color: "var(--accent)" }}>
            {node.kind === "hub" ? "Branch" : "Node"}
          </p>
          <h3 className="ea-h2" style={{ fontSize: "1.35rem", marginTop: 4 }}>
            {node.label}
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 8, lineHeight: 1.5 }}>
            {node.blurb}
          </p>

          <div style={{ marginTop: 14 }}>
            {node.metrics.map((m) => (
              <div className="ea-metric-row" key={m.k} data-c={m.c}>
                <span className="ea-metric-k">
                  {m.k} <Pill c={m.c} />
                </span>
                <span className="ea-metric-v">{m.v}</span>
              </div>
            ))}
          </div>

          {node.quote ? (
            <div style={{ marginTop: 16 }} data-c={node.quote.c}>
              <p className="ea-quote">&ldquo;{node.quote.text}&rdquo;</p>
              <p className="ea-quote-who">
                {node.quote.who} <Pill c={node.quote.c} />
              </p>
            </div>
          ) : null}

          {zone ? (
            <button
              type="button"
              className="ea-btn"
              style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
              onClick={() => onJump(zone.n)}
            >
              Go to {String(zone.n).padStart(2, "0")} · {zone.label} →
            </button>
          ) : null}
        </aside>
      </div>

      <Reveal style={{ marginTop: 16 }}>
        <p className="ea-note">
          Branch colour is the layer accent used site-wide: amber for model providers, teal for
          hyperscalers, violet for data and app platforms, green for economics and control points.
          Dashed links carry a disclosed money or dependency figure.
        </p>
      </Reveal>
    </>
  );
}
