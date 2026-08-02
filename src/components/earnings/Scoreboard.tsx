"use client";

import { useState } from "react";
import { SCOREBOARDS, SCORE_SCALE, type Layer, type Score } from "@/lib/earnings/data";
import { Pill, Reveal, ZoneHead, layerClass } from "./primitives";

/**
 * Four-step colour intensity per layer. Step 0 is a near-empty wash rather than
 * white, so an absent capability still reads as a deliberate cell.
 */
const RAMP: Record<Layer, string[]> = {
  models: ["#faf6ef", "#f5e3c6", "#e8b878", "#b45309"],
  hyperscalers: ["#f0f7f5", "#cfe9e4", "#7fc4ba", "#0f766e"],
  platforms: ["#f6f2fd", "#e0d3f8", "#b299ea", "#6d28d9"],
  economics: ["#f1f8f2", "#d2ecd8", "#84c894", "#15803d"],
};

/** White text once the fill is dark enough to need it. */
const INK_ON: Record<number, string> = { 0: "#4b5563", 1: "#374151", 2: "#1f2937", 3: "#ffffff" };

export default function Scoreboard() {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const board = SCOREBOARDS[tab];

  return (
    <>
      <ZoneHead
        n={5}
        kicker="The scoreboard"
        title="Three matrices, one snapshot"
        lede="Colour intensity is the score. Tap any cell for the evidence behind it."
      />

      <Reveal>
        <div className="ea-tabs" role="tablist" aria-label="Scorecards">
          {SCOREBOARDS.map((b, i) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              className="ea-btn"
              aria-selected={tab === i}
              onClick={() => {
                setTab(i);
                setOpen(null);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </Reveal>

      <Reveal style={{ marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          <span className="ea-kicker">Scale</span>
          {SCORE_SCALE.map((label, s) => (
            <span
              key={label}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 16,
                  height: 12,
                  background: RAMP[board.layer][s],
                  border: "1px solid var(--rule)",
                  display: "inline-block",
                }}
              />
              {label}
            </span>
          ))}
          <Pill c={board.c} />
        </div>

        <div className={`ea-matrix-wrap ${layerClass(board.layer)}`}>
          <table className="ea-matrix">
            <caption className="sr-only">
              {board.label} scorecard. {board.note}
            </caption>
            <thead>
              <tr>
                <th scope="col">{board.label}</th>
                {board.cols.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {board.rows.map((row) => (
                <tr key={row.name}>
                  <td className="ea-cell-name">{row.name}</td>
                  {row.cells.map((cell, i) => {
                    const key = `${row.name}-${i}`;
                    const s = cell.s as Score;
                    return (
                      <td key={key} style={{ background: RAMP[board.layer][s] }}>
                        <button
                          type="button"
                          className="ea-cell"
                          data-open={open === key}
                          style={{ color: INK_ON[s] }}
                          aria-label={`${row.name}, ${board.cols[i]}: ${cell.t}. ${cell.e}`}
                          onClick={() => setOpen(open === key ? null : key)}
                          onPointerEnter={() => setOpen(key)}
                          onFocus={() => setOpen(key)}
                        >
                          {cell.t}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className="ea-card"
          style={{ padding: "12px 14px", marginTop: 10, minHeight: 56 }}
          aria-live="polite"
        >
          <p className="ea-kicker">Evidence</p>
          <p style={{ fontSize: 13, marginTop: 5, color: open ? "var(--ink)" : "var(--muted)" }}>
            {open
              ? (() => {
                  const [name, idx] = [open.slice(0, open.lastIndexOf("-")), Number(open.slice(open.lastIndexOf("-") + 1))];
                  const row = board.rows.find((r) => r.name === name);
                  return row ? `${row.name} · ${board.cols[idx]} — ${row.cells[idx].e}` : "";
                })()
              : "Hover or tap a cell to see the supporting evidence sentence."}
          </p>
        </div>

        <p className="ea-note" style={{ marginTop: 10 }}>
          {board.note}
        </p>
      </Reveal>
    </>
  );
}
