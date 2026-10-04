"use client";

import { Fragment, useState } from "react";
import { useSite } from "../context";
import { DataTable, Fig, MOTION_COLOR, TipRow } from "../ui";
import { Waterfall } from "../charts";
import { money, MOTION_LABEL, SEGMENT_LABEL, SEGMENT_SHORT } from "@/lib/korea-fy27/format";
import type { MotionId } from "@/lib/korea-fy27/types";

export default function MotionBridge() {
  const { model, openCohort } = useSite();
  const { motions, matrix, segmentFY27 } = model.plan;
  const [hl, setHl] = useState<MotionId | null>(null);
  const cohortName = (id: string) => model.cohorts.find((c) => c.id === id)?.name ?? id;
  const segAdds = model.market.segments.map((s) => s.added);

  const steps = [
    {
      key: "fy26",
      label: "FY26",
      sub: "Google AI",
      value: model.headline.fy26Ai,
      kind: "start" as const,
      color: "var(--navy-ink)",
      valueLabel: money(model.headline.fy26Ai),
      ariaLabel: "FY26: $226M",
      tip: (
        <>
          <b>$226M</b>
          <div className="mut">FY26 Google AI (year to date + run-rate)</div>
        </>
      ),
    },
    ...motions.map((m) => {
      const row = matrix.find((r) => r.motion === m.id)!;
      return {
        key: m.id,
        label: m.name,
        sub: `${m.sharePct}% of growth`,
        value: m.added,
        kind: "add" as const,
        color: MOTION_COLOR[m.id],
        valueLabel: `+${money(m.added)}`,
        dim: hl !== null && hl !== m.id,
        ariaLabel: `${m.name}: plus ${money(m.added)}`,
        tip: (
          <>
            <b>+{money(m.added)}</b>
            <div className="mut">
              {m.name} · {m.sharePct}% of growth · FY26 {money(m.fy26)} → FY27 ~{money(m.fy27)}
            </div>
            {row.cells
              .filter((c) => c.value !== null)
              .map((c) => (
                <TipRow key={c.segment} color={MOTION_COLOR[m.id]} label={`${SEGMENT_SHORT[c.segment]}: ${c.cohorts.map(cohortName).join(", ")}`} value={`+$${c.value}M`} />
              ))}
          </>
        ),
      };
    }),
    {
      key: "fy27",
      label: "FY27 plan",
      sub: "~4x",
      value: model.headline.fy27Plan,
      kind: "end" as const,
      color: "var(--navy-ink)",
      valueLabel: "~$900M",
      ariaLabel: "FY27 plan: about $900M",
      tip: (
        <>
          <b>~$900M</b>
          <div className="mut">Base case ~$725M + eight levers +$175M; no whales</div>
        </>
      ),
    },
  ];

  return (
    <Fig
      title="$226M → ~$900M by motion, and where each motion lands"
      sub="Hover a bar for its cohorts; hover or focus a matrix row to highlight its bar; select a cell to open the cohort."
      src={[{ part: "main", slides: "11–13" }, { part: "B", slides: "91, 94" }]}
      basis={["stated"]}
      note="Cells are rounded, so totals may differ by ±1 (the deck's own note): adds sum to +$676M and bars close at $902M. Conglomerates & Enterprise FY27 includes Hyundai AutoEver held flat at $13.4M, which is in no motion's add."
      table={
        <DataTable
          columns={["Motion", ...model.market.segments.map((s) => s.name), "Total add", "FY26 → FY27"]}
          numeric={[1, 2, 3, 4, 5]}
          rows={matrix.map((r) => {
            const m = motions.find((x) => x.id === r.motion)!;
            return [MOTION_LABEL[r.motion], ...r.cells.map((c) => (c.value === null ? "–" : `+${c.value}`)), `+${m.added}`, `${money(m.fy26)} → ~${money(m.fy27)}`];
          })}
          total={["Segment add", ...segAdds.map((v) => `+${v}`), "~+675", "$226M → ~$900M"]}
        />
      }
    >
      <Waterfall steps={steps} height={280} />
      <div className="k-divider" />
      <div className="k-matrix-wrap">
        <div className="k-matrix" role="table" aria-label="Motion by segment, FY27 added AI ($M)">
          <div className="h" role="columnheader">Motion</div>
          {model.market.segments.map((s) => (
            <div className="h" key={s.id} role="columnheader">
              {SEGMENT_LABEL[s.id]}
            </div>
          ))}
          <div className="h num" role="columnheader">Total</div>
          {matrix.map((r) => {
            const m = motions.find((x) => x.id === r.motion)!;
            return (
              <Fragment key={r.motion}>
                <div className="rowh" role="rowheader" onPointerEnter={() => setHl(r.motion)} onPointerLeave={() => setHl(null)}>
                  <span className="k-swatch" style={{ background: MOTION_COLOR[r.motion] }} />
                  {MOTION_LABEL[r.motion]}
                </div>
                {r.cells.map((c) =>
                  c.value === null ? (
                    <div className="cell empty" key={c.segment} role="cell" aria-label="Not in this motion">
                      –
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={`cell ${hl === r.motion ? "hl" : ""}`}
                      key={c.segment}
                      role="cell"
                      onClick={() => openCohort(c.cohorts[0])}
                      onPointerEnter={() => setHl(r.motion)}
                      onPointerLeave={() => setHl(null)}
                      onFocus={() => setHl(r.motion)}
                      onBlur={() => setHl(null)}
                      aria-label={`${MOTION_LABEL[r.motion]}, ${SEGMENT_LABEL[c.segment]}: plus $${c.value}M, ${c.cohorts.map(cohortName).join(", ")}. Open cohort.`}
                      style={{ borderLeft: `4px solid ${MOTION_COLOR[r.motion]}` }}
                    >
                      <span className="v">+{c.value}</span>
                      <span className="c">{c.cohorts.map(cohortName).join(" · ")}</span>
                    </button>
                  ),
                )}
                <div className="tot" role="cell">
                  +{m.added}
                </div>
              </Fragment>
            );
          })}
          <div className="foot lab" role="rowheader">Segment add</div>
          {segAdds.map((v, i) => (
            <div className="foot" key={i} role="cell">
              +{v}
            </div>
          ))}
          <div className="foot" role="cell">~+675</div>
          <div className="foot lab" role="rowheader">FY27 AI</div>
          {segmentFY27.map((s) => (
            <div className="foot" key={s.segment} role="cell">
              ~{Math.round(s.value)}
            </div>
          ))}
          <div className="foot" role="cell">~900</div>
        </div>
      </div>
    </Fig>
  );
}
