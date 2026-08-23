"use client";

import { useMemo, useState } from "react";
import { LAB_COLORS, LABS, LEDGER, type Lab } from "@/lib/modelcomp/data";
import { formatDate } from "@/lib/modelcomp/scales";
import { exportCsv } from "@/lib/modelcomp/export";
import ExportMenu from "./ExportMenu";

type SortKey = "d" | "s" | "m";
type Direction = "asc" | "desc";

const CSV_HEADER = [
  "Date",
  "Model",
  "Lab",
  "Index (v4.1)",
  "Estimate",
  "Price /M in-out",
  "Frontier-setter",
  "Note",
];

export default function Ledger() {
  const [sortKey, setSortKey] = useState<SortKey>("d");
  const [direction, setDirection] = useState<Direction>("asc");
  const [labs, setLabs] = useState<Set<Lab>>(new Set());

  const rows = useMemo(() => {
    const filtered = labs.size === 0 ? LEDGER : LEDGER.filter((row) => labs.has(row.lab));
    const sign = direction === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === "s") {
        // Unscored releases sort to the bottom whichever way the column points.
        if (a.s === null && b.s === null) return a.d.localeCompare(b.d);
        if (a.s === null) return 1;
        if (b.s === null) return -1;
        return a.s === b.s ? a.d.localeCompare(b.d) : sign * (a.s - b.s);
      }
      if (sortKey === "m") return sign * a.m.localeCompare(b.m);
      return a.d === b.d ? a.m.localeCompare(b.m) : sign * a.d.localeCompare(b.d);
    });
  }, [sortKey, direction, labs]);

  function sortBy(key: SortKey) {
    if (key === sortKey) {
      setDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setDirection(key === "s" ? "desc" : "asc");
    }
  }

  function toggleLab(lab: Lab) {
    setLabs((current) => {
      const next = new Set(current);
      if (next.has(lab)) next.delete(lab);
      else next.add(lab);
      return next;
    });
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (direction === "asc" ? "▲" : "▼") : "▲▼";

  const csvRows = () => [
    ["MODELCOMP — release ledger"],
    ["Compiled", "Aug 3, 2026 · extended Aug 23, 2026"],
    ["Basis", "Artificial Analysis Intelligence Index, v4.1"],
    [],
    CSV_HEADER,
    ...rows.map((row) => [
      row.d,
      row.m,
      row.lab,
      row.s,
      row.s === null ? "not scored" : row.est ? "estimate" : "published",
      row.price,
      row.frontier ? "yes" : "no",
      row.note,
    ]),
  ];

  return (
    <>
      <div className="mc-chart-head">
        <div>
          <p className="mc-eyebrow">S4 · Release ledger</p>
          <h2 className="mc-h2" style={{ marginTop: 6 }}>
            Every release in the window
          </h2>
          <p className="mc-muted" style={{ fontSize: 13, marginTop: 6 }}>
            {rows.length} of {LEDGER.length} releases shown
            {labs.size > 0 ? ` · filtered to ${Array.from(labs).join(", ")}` : ""}.
          </p>
        </div>
        <div className="mc-controls">
          <ExportMenu
            label="Download"
            extra={[
              {
                label: "CSV · current view",
                hint: "Exactly the rows and order on screen",
                run: () => exportCsv(csvRows(), "modelcomp-release-ledger.csv"),
              },
              {
                label: "CSV · all releases",
                hint: "Every row, sorted by date",
                run: () =>
                  exportCsv(
                    [
                      ["MODELCOMP — release ledger (complete)"],
                      ["Compiled", "Aug 3, 2026 · extended Aug 23, 2026"],
                      ["Basis", "Artificial Analysis Intelligence Index, v4.1"],
                      [],
                      CSV_HEADER,
                      ...LEDGER.map((row) => [
                        row.d,
                        row.m,
                        row.lab,
                        row.s,
                        row.s === null ? "not scored" : row.est ? "estimate" : "published",
                        row.price,
                        row.frontier ? "yes" : "no",
                        row.note,
                      ]),
                    ],
                    "modelcomp-release-ledger-all.csv",
                  ),
              },
              {
                label: "Print / PDF",
                hint: "Opens the browser print dialog",
                run: () => window.print(),
              },
            ]}
          />
        </div>
      </div>

      <div className="mc-controls" style={{ marginBottom: 14 }}>
        <button
          type="button"
          className="mc-pill"
          aria-pressed={labs.size === 0}
          onClick={() => setLabs(new Set())}
        >
          All labs
        </button>
        {LABS.map((lab) => (
          <button
            key={lab}
            type="button"
            className="mc-pill"
            aria-pressed={labs.has(lab)}
            onClick={() => toggleLab(lab)}
          >
            <span
              className="mc-pill-dot"
              aria-hidden="true"
              style={{ background: LAB_COLORS[lab], color: LAB_COLORS[lab] }}
            />
            {lab}
          </button>
        ))}
      </div>

      <div className="mc-table-wrap">
        <table className="mc-table">
          <caption className="sr-only">
            Every model release between August 2025 and August 2026, with its Artificial Analysis
            Intelligence Index score on the v4.1 basis, launch price and whether it set the
            capability frontier.
          </caption>
          <thead>
            <tr>
              <th scope="col" aria-sort={sortKey === "d" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                <button type="button" onClick={() => sortBy("d")}>
                  Date <span aria-hidden="true">{arrow("d")}</span>
                </button>
              </th>
              <th scope="col" aria-sort={sortKey === "m" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                <button type="button" onClick={() => sortBy("m")}>
                  Model <span aria-hidden="true">{arrow("m")}</span>
                </button>
              </th>
              <th scope="col">Lab</th>
              <th scope="col" aria-sort={sortKey === "s" ? (direction === "asc" ? "ascending" : "descending") : "none"}>
                <button type="button" onClick={() => sortBy("s")}>
                  Index v4.1 <span aria-hidden="true">{arrow("s")}</span>
                </button>
              </th>
              <th scope="col">Price /M in · out</th>
              <th scope="col">Frontier</th>
              <th scope="col">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.d}-${row.m}`}>
                <td style={{ whiteSpace: "nowrap" }}>{formatDate(row.d)}</td>
                <td className="mc-td-model">{row.m}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <span className="mc-chip">
                    <span className="mc-chip-swatch" style={{ background: LAB_COLORS[row.lab] }} />
                    {row.lab}
                  </span>
                </td>
                <td className="mc-td-num">
                  {row.s === null ? (
                    <span className="mc-est">—</span>
                  ) : (
                    <>
                      {row.est ? <span className="mc-est">~</span> : null}
                      {row.s}
                    </>
                  )}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {row.price ?? <span className="mc-est">—</span>}
                </td>
                <td>
                  {row.frontier ? (
                    <span className="mc-check" title="Set the capability frontier on release">
                      ✓
                    </span>
                  ) : (
                    <span className="mc-est">—</span>
                  )}
                </td>
                <td className="mc-td-note">{row.note ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mc-legend-note" style={{ paddingTop: 10 }}>
        ~ marks a v4.1-equivalent estimate rather than a published v4.1 score. — means the figure
        was never published. Rows are deduplicated across the frontier series, the Flash lane and
        the rival value tier.
      </p>
    </>
  );
}
