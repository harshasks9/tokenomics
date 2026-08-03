"use client";

import { useState } from "react";
import {
  METRIC_COLS,
  METRICS_CAVEAT,
  METRICS_TABLE,
  type Layer,
} from "@/lib/earnings/data";
import { Reveal } from "./primitives";

const LAYER_LABEL: Record<Layer, string> = {
  models: "Model provider",
  hyperscalers: "Hyperscaler",
  platforms: "Data & app platform",
  economics: "Economics",
};

const LAYER_ORDER: Layer[] = ["models", "hyperscalers", "platforms"];

/**
 * The numbers — one row per company, ten normalized metrics.
 *
 * Everything in this table is also somewhere else on the page, but there it is
 * one click deep inside a node panel or a scoreboard cell. This is the flat,
 * scannable view: no interaction required to read any figure.
 */
export default function Metrics() {
  const [layer, setLayer] = useState<Layer | null>(null);

  const rows = layer ? METRICS_TABLE.filter((r) => r.layer === layer) : METRICS_TABLE;

  const count = (l: Layer) => METRICS_TABLE.filter((r) => r.layer === l).length;

  return (
    <Reveal style={{ marginTop: 46 }}>
      <div className="ea-zone-head">
        <span className="ea-kicker">The numbers</span>
      </div>
      <h3 className="ea-h2" style={{ fontSize: "1.4rem", marginBottom: 6 }}>
        Ten metrics, every company, one table
      </h3>
      <p className="ea-note" style={{ marginBottom: 14 }}>
        {METRICS_CAVEAT}
      </p>

      <div className="ea-controls" style={{ marginBottom: 12 }}>
        <button
          type="button"
          className="ea-btn"
          aria-pressed={layer === null}
          onClick={() => setLayer(null)}
        >
          All {METRICS_TABLE.length}
        </button>
        {LAYER_ORDER.map((l) => (
          <button
            key={l}
            type="button"
            className="ea-btn"
            aria-pressed={layer === l}
            onClick={() => setLayer(layer === l ? null : l)}
          >
            {LAYER_LABEL[l]}s {count(l)}
          </button>
        ))}
      </div>

      <div className="ea-scroll">
        <table className="ea-matrix ea-metrics" aria-label="Normalized Top-10 AI business metrics by company">
          <thead>
            <tr>
              <th scope="col">Company</th>
              {METRIC_COLS.map((c) => (
                <th scope="col" key={c.k} title={c.hint}>
                  {c.k}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.company}>
                <td>
                  {r.company}
                  <span className="ea-metrics-layer">{LAYER_LABEL[r.layer]}</span>
                </td>
                {r.cells.map((cell, i) => (
                  <td
                    key={METRIC_COLS[i].k}
                    className="ea-metrics-cell"
                    data-c={cell?.c}
                    data-conf={cell?.c}
                  >
                    {cell ? (
                      <>
                        <span className="ea-metrics-v">{cell.v}</span>
                        {cell.d ? <span className="ea-metrics-d">{cell.d}</span> : null}
                      </>
                    ) : (
                      <span className="ea-metrics-empty" aria-label="no credibly sourced figure">
                        —
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ea-hint">Scroll the table sideways → · cell underline colour = confidence tag</p>
    </Reveal>
  );
}
