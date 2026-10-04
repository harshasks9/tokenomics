"use client";

import { useSite } from "../context";
import { Block, DataTable, Fig, MOTION_COLOR, Section, Src } from "../ui";
import { MotionCards } from "../blocks";
import { Waterfall } from "../charts";
import { money, MOTION_LABEL, SEGMENT_LABEL, SEGMENT_SHORT } from "@/lib/korea-fy27/format";
import { FLOW_MOTIONS } from "@/lib/korea-fy27/flow-labels";
import type { FlowModel } from "@/lib/korea-fy27/flow";
import type { MotionId } from "@/lib/korea-fy27/types";

export default function FlowMotions({ flow }: { flow: FlowModel }) {
  const { model, openCohort } = useSite();
  const { motions, matrix, motionMix } = model.plan;
  const motion = (id: MotionId) => motions.find((m) => m.id === id)!;
  const cohortName = (id: string) => model.cohorts.find((c) => c.id === id)?.name ?? id;
  const verticalOf = (cohortId: string) => flow.verticals.find((v) => v.cohort === cohortId);
  const segments = model.market.segments.map((s) => s.id);
  const addsSum = FLOW_MOTIONS.reduce((s, id) => s + motion(id).added, 0);
  const fy26Sum = FLOW_MOTIONS.reduce((s, id) => s + motion(id).fy26, 0);
  const fy27Sum = FLOW_MOTIONS.reduce((s, id) => s + motion(id).fy27, 0);

  const steps = [
    {
      key: "fy26",
      label: "FY26",
      sub: "Google AI",
      value: model.headline.fy26Ai,
      kind: "start" as const,
      color: "var(--navy-ink)",
      valueLabel: money(model.headline.fy26Ai),
      ariaLabel: `FY26: ${money(model.headline.fy26Ai)}`,
      tip: (
        <>
          <b>{money(model.headline.fy26Ai)}</b>
          <div className="mut">FY26 Google AI (year to date + run-rate)</div>
        </>
      ),
    },
    ...FLOW_MOTIONS.map((id) => {
      const m = motion(id);
      return {
        key: id,
        label: m.name,
        sub: `${m.sharePct}% of growth`,
        value: m.added,
        kind: "add" as const,
        color: MOTION_COLOR[id],
        valueLabel: `+${money(m.added)}`,
        ariaLabel: `${m.name}: plus ${money(m.added)}`,
        tip: (
          <>
            <b>+{money(m.added)}</b>
            <div className="mut">
              {m.name} · {m.muscle.toLowerCase()} · FY26 {money(m.fy26)} → FY27 ~{money(m.fy27)}
            </div>
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
    <Section
      id="f-motions"
      num="4"
      label="Three broad motions"
      question="How do we grow the number?"
      headline={`Three motions add +$675M: Acquire +${money(motion("acquire").added)}, Deepen +${money(motion("deepen").added)}, Penetrate +${money(motion("penetrate").added)}.`}
      lead={motionMix.note}
    >
      <Block>
        <Fig
          title="$226M → ~$900M by motion"
          sub={`Adds sum to +${money(addsSum)}; the deck rounds to +$675M. Deepen includes Hyundai AutoEver held flat at ${money(model.autoEver.fy27)}.`}
          src={[{ part: "main", slides: "4, 11, 13" }, { part: "B", slides: "91, 94" }]}
          basis={["stated"]}
          table={
            <DataTable
              columns={["Motion", "FY26 ($M)", "Added ($M)", "FY27 ($M)", "Share of growth", "Today"]}
              numeric={[1, 2, 3]}
              rows={FLOW_MOTIONS.map((id) => {
                const m = motion(id);
                return [m.name, m.fy26, m.added, m.fy27, `${m.sharePct}%`, m.muscle];
              })}
              total={["Total", fy26Sum, addsSum, fy27Sum, "100%", ""]}
            />
          }
        >
          <Waterfall steps={steps} />
        </Fig>
      </Block>

      <Block title="Acquire · Deepen · Penetrate">
        <MotionCards order={FLOW_MOTIONS} />
        <Src src={{ part: "main", slides: "4, 11" }} basis={["stated"]} />
      </Block>

      <Block title="Where each motion lands: three motions × four segments" sub="Select a cell to go to its vertical, or to open a cohort that sits outside the five verticals.">
        <div className="k-table-wrap">
          <table className="k-table k-mx">
            <thead>
              <tr>
                <th scope="col">Motion</th>
                {segments.map((s) => (
                  <th scope="col" key={s}>
                    {SEGMENT_LABEL[s]}
                  </th>
                ))}
                <th scope="col" className="num">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {FLOW_MOTIONS.map((id) => {
                const row = matrix.find((r) => r.motion === id)!;
                return (
                  <tr key={id}>
                    <th scope="row">
                      <span className="k-swatch" style={{ background: MOTION_COLOR[id], borderRadius: 3 }} /> {MOTION_LABEL[id]}
                    </th>
                    {segments.map((s) => {
                      const cell = row.cells.find((c) => c.segment === s);
                      if (!cell || cell.value === null) return <td key={s} className="k-muted">–</td>;
                      return (
                        <td key={s}>
                          {cell.cohorts.map((c) => {
                            const v = verticalOf(c);
                            return v ? (
                              <a key={c} className="k-mx-cell in" href={`#${v.id}`} style={{ ["--c" as string]: MOTION_COLOR[id] }}>
                                <b>+{money(cell.value ?? 0)}</b>
                                <span>
                                  {v.num} · {cohortName(c)}
                                </span>
                              </a>
                            ) : (
                              <button key={c} type="button" className="k-mx-cell" onClick={() => openCohort(c)}>
                                <b>+{money(cell.value ?? 0)}</b>
                                <span>{cohortName(c)}</span>
                              </button>
                            );
                          })}
                        </td>
                      );
                    })}
                    <td className="num">
                      <b>+{money(motion(id).added)}</b>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="k-small k-muted" style={{ marginTop: 8 }}>
          Outlined cells are the five verticals ({SEGMENT_SHORT.dn} and conglomerates). The other three Acquire cohorts add +{money(flow.reconciliation.othersAdded)} and sit in the full plan.
        </p>
        <div className="k-grid k-g2" style={{ marginTop: 14 }}>
          {motionMix.acquireSplit.map((a) => (
            <div className="k-card flat" key={a.label}>
              <h4>Acquire · {a.label}</h4>
              <p style={{ marginTop: 4, fontSize: 24, fontWeight: 780, letterSpacing: "-0.02em" }}>+{money(a.value)}</p>
              <p className="k-small k-muted">{a.who}</p>
            </div>
          ))}
        </div>
        <Src src={[{ part: "main", slides: "11, 13" }, { part: "B", slides: "93, 94" }]} basis={["stated"]} />
      </Block>
    </Section>
  );
}
