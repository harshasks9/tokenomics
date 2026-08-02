"use client";

import { useMemo, useState } from "react";
import { NADELLA_QUOTE, NADELLA_SECONDARY, SWITCHING_NOTE } from "@/lib/earnings/data";
import { SANKEY_H, SANKEY_W, sankey } from "@/lib/earnings/layout";
import { Pill, Reveal, ZoneHead, useReveal } from "./primitives";

/** Ribbon colour follows the model it ends at, so identity reads left to right. */
const MODEL_COLOR: Record<string, string> = {
  "m-claude": "var(--models)",
  "m-gemini": "var(--hyperscalers)",
  "m-gpt": "var(--platforms)",
  "m-open": "var(--economics)",
};

const COL_LABEL = ["Enterprise workloads", "Selection factors", "Models"];

export default function Choose() {
  const { boxes, ribbons } = useMemo(() => sankey(), []);
  const { ref, shown } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);

  /** A node is lit if it is hovered, or if a lit ribbon touches it. */
  const litRibbon = (r: (typeof ribbons)[number]) =>
    active === null || r.from === active || r.to === active;

  const colorOf = (r: (typeof ribbons)[number]) => {
    const box = boxes.find((b) => b.id === r.to);
    if (box?.col === 2) return MODEL_COLOR[r.to] ?? "var(--prussian)";
    // Mid-column ribbons inherit from their source workload for legibility.
    return "var(--prussian)";
  };

  return (
    <>
      <ZoneHead
        n={4}
        kicker="How enterprises choose"
        title="The single-model enterprise is dead"
        lede="Workloads flow through selection factors into models. Hover any band to trace one path."
      />

      <Reveal>
        <div
          className="ea-pull"
          data-c={NADELLA_QUOTE.c}
          style={{ display: "grid", gap: 18, gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center" }}
        >
          <div>
            <p className="ea-pull-text">&ldquo;{NADELLA_QUOTE.text}&rdquo;</p>
            <p className="ea-pull-who">
              {NADELLA_QUOTE.who} <Pill c={NADELLA_QUOTE.c} onDark />
            </p>
          </div>
          <div
            style={{
              borderLeft: "1px solid rgba(255,255,255,.22)",
              paddingLeft: 22,
              minWidth: 132,
            }}
          >
            <p
              className="ea-figure"
              style={{ fontSize: "3rem", lineHeight: 1, color: "#f0b429" }}
            >
              5x
            </p>
            <p style={{ fontSize: 11.5, marginTop: 8, color: "rgba(255,255,255,.78)", lineHeight: 1.4 }}>
              increase in multi-provider customers since the start of 2026
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal style={{ marginTop: 12 }}>
        <p className="ea-note" data-c={NADELLA_SECONDARY.c}>
          &ldquo;{NADELLA_SECONDARY.text}&rdquo; — {NADELLA_SECONDARY.who} <Pill c={NADELLA_SECONDARY.c} />
        </p>
      </Reveal>

      <Reveal style={{ marginTop: 26 }}>
        <div className="ea-scroll" ref={ref} data-shown={shown}>
          <svg viewBox={`0 0 ${SANKEY_W} ${SANKEY_H}`} role="img" aria-labelledby="ea-sk-t ea-sk-d">
            <title id="ea-sk-t">How enterprise workloads flow through selection factors into models</title>
            <desc id="ea-sk-d">
              Coding, agents, analytics and high-volume batch workloads flow through six selection
              factors — task-specific quality, price and inference efficiency, latency, context
              length, residency and security, and existing cloud commitment — into Claude, Gemini,
              GPT-5.x and open weights. Band widths are an inference anchored on disclosed shares.
            </desc>

            {COL_LABEL.map((label, i) => (
              <text
                key={label}
                className="ea-cap"
                x={i === 0 ? 40 : i === 1 ? 430 : 830}
                y={14}
                fill="var(--muted)"
              >
                {label}
              </text>
            ))}

            <g>
              {ribbons.map((r) => {
                const lit = litRibbon(r);
                return (
                  <path
                    key={`${r.from}-${r.to}`}
                    d={r.d}
                    fill={colorOf(r)}
                    opacity={lit ? (active ? 0.55 : 0.28) : 0.07}
                    style={{ transition: "opacity 240ms" }}
                    onPointerEnter={() => setDetail(r.note)}
                    onPointerLeave={() => setDetail(null)}
                  />
                );
              })}
            </g>

            <g>
              {boxes.map((b) => (
                <g
                  key={b.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`${b.label}${b.note ? ` — ${b.note}` : ""}`}
                  onPointerEnter={() => {
                    setActive(b.id);
                    if (b.note) setDetail(b.note);
                  }}
                  onPointerLeave={() => {
                    setActive(null);
                    setDetail(null);
                  }}
                  onFocus={() => {
                    setActive(b.id);
                    if (b.note) setDetail(b.note);
                  }}
                  onBlur={() => {
                    setActive(null);
                    setDetail(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <rect
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    fill={b.col === 2 ? MODEL_COLOR[b.id] : "var(--prussian)"}
                    opacity={active === null || active === b.id ? 1 : 0.4}
                    rx={2}
                  />
                  <text
                    x={b.x + 10}
                    y={b.y + 17}
                    fill="#fff"
                    style={{ fontSize: 11.5, fontWeight: 650 }}
                  >
                    {b.label}
                  </text>
                  {b.h > 34 && b.note ? (
                    <text
                      x={b.x + 10}
                      y={b.y + 31}
                      fill="rgba(255,255,255,.72)"
                      style={{ fontSize: 9.5 }}
                    >
                      {b.note.length > 30 ? `${b.note.slice(0, 29)}…` : b.note}
                    </text>
                  ) : null}
                </g>
              ))}
            </g>
          </svg>
        </div>
        <p className="ea-hint">Scroll the diagram sideways →</p>
      </Reveal>

      <Reveal style={{ marginTop: 12 }}>
        <div
          className="ea-card"
          style={{ padding: "12px 14px", minHeight: 58 }}
          aria-live="polite"
          data-c="inference"
        >
          <p className="ea-kicker">
            Evidence <Pill c="inference" />
          </p>
          <p style={{ fontSize: 13, marginTop: 5, color: detail ? "var(--ink)" : "var(--muted)" }}>
            {detail ??
              "Hover a band or a node. Band widths are an inference anchored on the disclosed shares — Claude ~54% of enterprise coding, open weights ~61% of OpenRouter tokens — and on the report's ranking of selection factors by frequency in management commentary."}
          </p>
        </div>
      </Reveal>

      <Reveal style={{ marginTop: 14 }}>
        <p className="ea-note" data-c="inference">
          <Pill c="inference" /> {SWITCHING_NOTE}
        </p>
      </Reveal>
    </>
  );
}
