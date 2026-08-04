"use client";

import { useMemo, useState } from "react";
import {
  ANTHROPIC_RUNRATE,
  DEMAND_QUALITY,
  OPENAI_RUNRATE,
  RUNRATE_CAVEAT,
  WORKLOAD_CAVEAT,
  WORKLOAD_MIX,
  type WorkloadTile,
} from "@/lib/earnings/data";
import { logScale, logTicks, treemap } from "@/lib/earnings/layout";
import { Pill, Reveal, ZoneHead, useReveal } from "./primitives";

const W = 940;
const H = 400;
const L = 78;
const R = 132;
const T = 30;
const B = 52;

const DOMAIN: [number, number] = [7, 60];

export default function Demand() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [tip, setTip] = useState<{ label: string; body: string; x: number; y: number } | null>(null);
  const [tile, setTile] = useState<WorkloadTile>(WORKLOAD_MIX[0]);

  const y = useMemo(() => logScale(DOMAIN, [H - B, T]), []);
  const step = (W - L - R) / (ANTHROPIC_RUNRATE.length - 1);
  const x = (i: number) => L + i * step;

  /** stepAfter path — a run-rate holds until the next disclosure. */
  const path = useMemo(() => {
    const parts: string[] = [];
    ANTHROPIC_RUNRATE.forEach((p, i) => {
      const px = x(i);
      const py = y(p.value);
      if (i === 0) parts.push(`M ${px} ${py}`);
      else {
        parts.push(`L ${px} ${y(ANTHROPIC_RUNRATE[i - 1].value)}`);
        parts.push(`L ${px} ${py}`);
      }
    });
    return parts.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [y]);

  const openaiY = y(OPENAI_RUNRATE[0].value);

  const cells = useMemo(
    () => treemap(WORKLOAD_MIX, (t) => t.weight, { x: 0, y: 0, w: 620, h: 300 }),
    [],
  );

  const TILE_FILL: Record<string, string> = {
    coding: "var(--models)",
    agents: "var(--platforms)",
    analytics: "var(--hyperscalers)",
    chat: "var(--muted)",
  };

  return (
    <>
      <ZoneHead
        n={3}
        kicker="Where demand lives"
        title="Production, not pilots"
        lede="Anthropic's run-rate rose nearly 5x in five months. The tokens behind it are concentrated in coding and agents."
      />

      {/* (a) Run-rate trajectory */}
      <Reveal>
        <div className="ea-scroll" ref={ref} data-shown={shown}>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="ea-rr-t ea-rr-d">
            <title id="ea-rr-t">Anthropic run-rate trajectory against OpenAI</title>
            <desc id="ea-rr-d">
              On a logarithmic axis, Anthropic&rsquo;s run-rate steps from $9B at end-2025 to $14B in
              February, $19B in March, $30B in April and $47B in May 2026. OpenAI sits at
              approximately $25B ARR mid-2026. The two are not directly comparable: Anthropic reports
              gross, OpenAI net.
            </desc>

            <g aria-hidden="true">
              {logTicks(DOMAIN).map((t) => (
                <g key={t}>
                  <line className="ea-grid" x1={L} x2={W - R} y1={y(t)} y2={y(t)} />
                  <text className="ea-tick" x={L - 9} y={y(t) + 3.5} textAnchor="end">
                    ${t}B
                  </text>
                </g>
              ))}
              <line className="ea-axis" x1={L} x2={W - R} y1={H - B} y2={H - B} />
              <text
                className="ea-cap"
                transform={`translate(18 ${(T + H - B) / 2}) rotate(-90)`}
                textAnchor="middle"
                fill="var(--muted)"
              >
                Run-rate, log scale
              </text>
            </g>

            {/* OpenAI reference */}
            <g data-c="fact">
              <line
                x1={L}
                x2={W - R}
                y1={openaiY}
                y2={openaiY}
                stroke="var(--hyperscalers)"
                strokeWidth={1.5}
                strokeDasharray="6 5"
              />
              <text className="ea-val" x={W - R + 10} y={openaiY + 4} fill="var(--hyperscalers)">
                ~$25B
              </text>
              <text x={W - R + 10} y={openaiY + 19} style={{ fontSize: 10 }} fill="var(--muted)">
                OpenAI ARR, net
              </text>
            </g>

            {/* Anthropic step line */}
            <path
              d={path}
              fill="none"
              stroke="var(--models)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              className="ea-draw"
              style={{ ["--len" as string]: "1600" }}
            />

            {ANTHROPIC_RUNRATE.map((p, i) => (
              <g
                key={p.label}
                tabIndex={0}
                role="button"
                aria-label={`${p.label}: $${p.value}B run-rate`}
                onPointerEnter={(e) =>
                  setTip({
                    label: `${p.label} · $${p.value}B`,
                    body: p.note ?? "Disclosed in Anthropic fundraise materials.",
                    x: e.clientX,
                    y: e.clientY,
                  })
                }
                onPointerLeave={() => setTip(null)}
                onFocus={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setTip({
                    label: `${p.label} · $${p.value}B`,
                    body: p.note ?? "Disclosed in Anthropic fundraise materials.",
                    x: r.left + r.width / 2,
                    y: r.bottom,
                  });
                }}
                onBlur={() => setTip(null)}
              >
                <circle cx={x(i)} cy={y(p.value)} r={5} fill="var(--models)" stroke="#fff" strokeWidth={1.5} />
                {i < ANTHROPIC_RUNRATE.length - 1 ? (
                  <text
                    className="ea-val"
                    x={i === 0 ? x(i) - 2 : x(i)}
                    y={y(p.value) - 14}
                    textAnchor={i === 0 ? "start" : "middle"}
                    fill="var(--models)"
                  >
                    ${p.value}B
                  </text>
                ) : null}
                <text className="ea-tick" x={x(i)} y={H - B + 18} textAnchor="middle">
                  {p.label.split(" ")[0]}
                </text>
                <text className="ea-tick" x={x(i)} y={H - B + 31} textAnchor="middle" opacity={0.7}>
                  {p.label.split(" ")[1]}
                </text>
                <circle className="ea-hit" cx={x(i)} cy={y(p.value)} r={16} />
              </g>
            ))}

            <text
              className="ea-val"
              x={W - R + 10}
              y={y(47) + 4}
              fill="var(--models)"
            >
              $47B
            </text>
            <text x={W - R + 10} y={y(47) + 19} style={{ fontSize: 10 }} fill="var(--muted)">
              Anthropic, gross
            </text>
          </svg>
        </div>
        <p className="ea-hint">Scroll the chart sideways →</p>
      </Reveal>

      {tip ? (
        <div
          style={{
            position: "fixed",
            left: Math.min(tip.x + 12, (typeof window !== "undefined" ? window.innerWidth : 900) - 300),
            top: tip.y + 12,
            zIndex: 70,
            width: 280,
            pointerEvents: "none",
            background: "var(--card)",
            border: "1px solid var(--rule)",
            borderRadius: 2,
            boxShadow: "0 6px 20px rgba(20,24,29,.14)",
            padding: "9px 11px",
            fontSize: 12,
            display: tip.x === 0 ? "none" : "block",
          }}
        >
          <strong style={{ fontSize: 12.5 }}>{tip.label}</strong>
          <p style={{ marginTop: 4, color: "var(--muted)", lineHeight: 1.45 }}>{tip.body}</p>
        </div>
      ) : null}

      <Reveal style={{ marginTop: 10 }}>
        <p className="ea-note" data-c="fact">
          <Pill c="fact" /> {RUNRATE_CAVEAT}
        </p>
      </Reveal>

      {/* (b) Workload treemap */}
      <Reveal style={{ marginTop: 44 }}>
        <div className="ea-zone-head">
          <span className="ea-kicker">Workload mix</span>
        </div>
        <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 14 }}>
          Coding and agents own the token volume
        </h3>

        <div className="ea-tm-grid">
          <div className="ea-scroll">
            <svg viewBox="0 0 620 300" role="img" aria-labelledby="ea-tm-t ea-tm-d">
              <title id="ea-tm-t">Workload mix by share of token volume</title>
              <desc id="ea-tm-d">
                Four workload pools sized by inferred share of token volume: coding largest, then
                agentic workflows, analytics and RAG, then chat and content. The disclosed figures
                behind each are listed beside the chart.
              </desc>
              {cells.map((c) => {
                const on = tile.id === c.item.id;
                return (
                  <g
                    key={c.item.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`${c.item.label}: ${c.item.headline}`}
                    onPointerEnter={() => setTile(c.item)}
                    onFocus={() => setTile(c.item)}
                    onClick={() => setTile(c.item)}
                    style={{ cursor: "pointer" }}
                    data-c={c.item.c}
                  >
                    <rect
                      x={c.x + 1}
                      y={c.y + 1}
                      width={Math.max(c.w - 2, 0)}
                      height={Math.max(c.h - 2, 0)}
                      fill={TILE_FILL[c.item.id]}
                      opacity={on ? 1 : 0.82}
                      stroke="#fff"
                      strokeWidth={on ? 3 : 0}
                    />
                    {c.w > 92 && c.h > 44 ? (
                      <>
                        <text className="ea-tm-label" x={c.x + 12} y={c.y + 24}>
                          {c.item.label}
                        </text>
                        <text className="ea-tm-sub" x={c.x + 12} y={c.y + 40}>
                          {c.item.weight}% of tokens
                        </text>
                      </>
                    ) : null}
                  </g>
                );
              })}
            </svg>
          </div>

          <aside className="ea-card" style={{ padding: 14 }} aria-live="polite" data-c={tile.c}>
            <p className="ea-kicker">{tile.label}</p>
            <p className="ea-h3" style={{ marginTop: 6 }}>
              {tile.headline} <Pill c={tile.c} />
            </p>
            <ul style={{ marginTop: 10, paddingLeft: 0, listStyle: "none" }}>
              {tile.evidence.map((e) => (
                <li
                  key={e}
                  style={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--ink-2)",
                    paddingTop: 7,
                    marginTop: 7,
                    borderTop: "1px solid var(--rule-soft)",
                  }}
                >
                  {e}
                </li>
              ))}
            </ul>
          </aside>
        </div>
        <p className="ea-note" style={{ marginTop: 10 }}>
          {WORKLOAD_CAVEAT}
        </p>
      </Reveal>

      {/* (c) Traffic-light strip */}
      <Reveal style={{ marginTop: 44 }}>
        <div className="ea-zone-head">
          <span className="ea-kicker">Quality of demand</span>
        </div>
        <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 14 }}>
          Incremental, displaced, or subsidised?
        </h3>
        <div className="ea-lights">
          {DEMAND_QUALITY.map((d) => (
            <div className="ea-light" key={d.verdict} data-c={d.c}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className={`ea-dot ea-dot-${d.tone}`} aria-hidden="true" />
                <span className="ea-h3">{d.verdict}</span>
                <Pill c={d.c} />
              </div>
              <p style={{ fontSize: 13, marginTop: 8, fontWeight: 550 }}>{d.body}</p>
              <p style={{ fontSize: 12, marginTop: 6, color: "var(--muted)", lineHeight: 1.5 }}>
                {d.evidence}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </>
  );
}
