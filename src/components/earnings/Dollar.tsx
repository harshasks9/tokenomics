"use client";

import {
  CIRCULARITY,
  CIRCULARITY_WARNING,
  CROSS_SELL,
  DOLLAR_COST,
  DOLLAR_SPLIT,
  TOKEN_DEFLATION,
} from "@/lib/earnings/data";
import { Pill, Reveal, ZoneHead } from "./primitives";

const pct = (v: number) => `${Math.round(v * 100)}¢`;

const SEG_COLOR: Record<string, string> = {
  provider: "var(--models)",
  hyperscaler: "var(--hyperscalers)",
};

export default function Dollar() {
  const mid = (b: { lo: number; hi: number }) => (b.lo + b.hi) / 2;
  const providerMid = mid(DOLLAR_SPLIT[0]);
  const hyperMid = mid(DOLLAR_SPLIT[1]);
  const total = providerMid + hyperMid;
  // The two bands are a bounded scenario and need not sum to exactly $1.00;
  // normalise for the bar while showing the true ranges in the labels.
  const widths = [providerMid / total, hyperMid / total];

  return (
    <>
      <ZoneHead
        n={6}
        kicker="Follow the dollar"
        title="Where $1.00 of model spend goes"
        lede="A bounded scenario for enterprise spend on a third-party model run through a hyperscaler's managed service."
      />

      <Reveal>
        <div className="ea-dollar-bar" data-c="hypothesis">
          {DOLLAR_SPLIT.map((b, i) => (
            <div
              key={b.id}
              className="ea-dollar-seg ea-grow"
              style={{
                width: `${widths[i] * 100}%`,
                background: SEG_COLOR[b.id],
                color: "#fff",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <span className="ea-figure" style={{ fontSize: 20 }}>
                {pct(b.lo)}–{pct(b.hi)}
              </span>
              <span style={{ fontSize: 11, opacity: 0.9, lineHeight: 1.25 }}>{b.label}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          {[...DOLLAR_SPLIT, DOLLAR_COST].map((b) => (
            <div
              key={b.id}
              data-c={b.c}
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: 12,
                alignItems: "baseline",
                borderTop: "1px solid var(--rule-soft)",
                paddingTop: 8,
              }}
            >
              <span
                className="ea-figure"
                style={{
                  fontSize: 15,
                  color: b.id === "infra" ? "var(--muted)" : SEG_COLOR[b.id],
                  minWidth: 88,
                }}
              >
                {pct(b.lo)}–{pct(b.hi)}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--ink)" }}>{b.label}.</strong> {b.note} <Pill c={b.c} />
              </span>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Cross-sell multiplier */}
      <Reveal style={{ marginTop: 26 }}>
        <div
          className="ea-card"
          data-c={CROSS_SELL.c}
          style={{
            padding: 18,
            borderLeft: "3px solid var(--economics)",
            display: "grid",
            gridTemplateColumns: "auto minmax(0,1fr)",
            gap: 20,
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center", minWidth: 118 }}>
            <p className="ea-figure" style={{ fontSize: "2.6rem", color: "var(--economics)", lineHeight: 1 }}>
              {CROSS_SELL.lo}–{CROSS_SELL.hi}x
            </p>
            <p style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginTop: 6 }}>
              cross-sell
            </p>
          </div>
          <div>
            <p className="ea-h3">
              {CROSS_SELL.headline} <Pill c={CROSS_SELL.c} />
            </p>
            <p style={{ fontSize: 12.5, marginTop: 7, color: "var(--muted)", lineHeight: 1.55 }}>
              {CROSS_SELL.note}
            </p>
            <p style={{ fontSize: 12, marginTop: 8, fontWeight: 600, color: "var(--economics)" }}>
              {CROSS_SELL.target}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Token deflation */}
      <Reveal style={{ marginTop: 26 }}>
        <div className="ea-card" style={{ padding: 18 }} data-c={TOKEN_DEFLATION.c}>
          <p className="ea-h3">
            {TOKEN_DEFLATION.headline} <Pill c={TOKEN_DEFLATION.c} />
          </p>
          <div className="ea-scroll" style={{ border: 0, marginTop: 12 }}>
            <svg viewBox="0 0 620 96" role="img" aria-label="Token price decline from about $20 per million tokens in late 2022 to about $0.40 in early 2026">
              <defs>
                <marker id="ea-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="var(--muted)" />
                </marker>
              </defs>

              <line className="ea-axis" x1={20} x2={600} y1={62} y2={62} />

              <text x={355} y={20} textAnchor="middle" className="ea-cap" fill="var(--muted)">
                ~10x annual decline
              </text>

              {/* Both endpoint labels sit inside their bars, so the connecting
                  arrow has the whole middle of the band to itself. */}
              <g>
                <rect x={20} y={28} width={182} height={24} fill="var(--models)" />
                <text x={30} y={44} fill="#fff" style={{ fontSize: 12, fontWeight: 650 }}>
                  ~$20 / M
                </text>
                <text className="ea-tick" x={20} y={80}>
                  Late 2022
                </text>
              </g>

              <path
                d="M 212 40 L 496 40"
                stroke="var(--muted)"
                strokeWidth={1}
                strokeDasharray="4 4"
                markerEnd="url(#ea-arrow)"
              />

              <g>
                <rect x={508} y={28} width={92} height={24} fill="var(--economics)" />
                <text x={517} y={44} fill="#fff" style={{ fontSize: 12, fontWeight: 650 }}>
                  ~$0.40 / M
                </text>
                <text className="ea-tick" x={600} y={80} textAnchor="end">
                  Early 2026
                </text>
              </g>
            </svg>
          </div>
          <p style={{ fontSize: 12.5, marginTop: 8, color: "var(--muted)", lineHeight: 1.55 }}>
            {TOKEN_DEFLATION.note}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
            {TOKEN_DEFLATION.levers.map((l) => (
              <span key={l.k} style={{ fontSize: 12, color: "var(--ink-2)" }} data-c={l.c}>
                <strong>{l.k}:</strong> {l.v}
              </span>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Circularity warning */}
      <Reveal style={{ marginTop: 34 }}>
        <div className="ea-zone-head">
          <span className="ea-kicker" style={{ color: "var(--sev-3)" }}>
            Circularity warning
          </span>
        </div>
        <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 14 }}>
          The equity-gain loop
        </h3>

        <div className="ea-loop">
          {CIRCULARITY.map((s, i) => (
            <div className="ea-loop-step" key={s.n} data-c={s.c}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="ea-loop-n">{s.n}</span>
                {i < CIRCULARITY.length - 1 ? (
                  <span aria-hidden="true" style={{ marginLeft: "auto", color: "var(--sev-3)", fontSize: 15 }}>
                    →
                  </span>
                ) : (
                  <span aria-hidden="true" style={{ marginLeft: "auto", color: "var(--sev-3)", fontSize: 15 }}>
                    ↺
                  </span>
                )}
              </div>
              <p className="ea-h3" style={{ marginTop: 8, fontSize: 13 }}>
                {s.label}
              </p>
              <p style={{ fontSize: 11.5, marginTop: 5, color: "var(--muted)", lineHeight: 1.5 }}>
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        <p
          className="ea-note"
          style={{
            marginTop: 12,
            borderLeft: "3px solid var(--sev-3)",
            paddingLeft: 12,
            color: "var(--ink-2)",
          }}
          data-c="fact"
        >
          <Pill c="fact" /> {CIRCULARITY_WARNING}
        </p>
      </Reveal>
    </>
  );
}
