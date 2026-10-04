"use client";

import { TriangleAlert } from "lucide-react";
import { useSite } from "../context";
import { Block, DataTable, Fig, MotionTag, Section, Src, Tag, useTip } from "../ui";
import { money } from "@/lib/korea-fy27/format";

export default function RisksSection() {
  const { model, openCohort } = useSite();
  const { bind, node } = useTip();
  const rows = [...model.los.rows].sort((a, b) => b.losPct - a.losPct);
  const name = (id: string) => model.cohorts.find((c) => c.id === id)!;
  const totalGap = rows.reduce((s, r) => s + r.gap, 0);

  return (
    <Section
      id="risks"
      num="09"
      label="Risks"
      question="What could break the number?"
      exec
      headline="Today's run-rate covers ~59% of Samsung's target but ~4% of the startups'. The plan is a bet on new engines, not on today's base."
      lead={`${model.risks.notes.los} ${model.risks.notes.levers}`}
    >
      <Block>
        <Fig
          title="Line of sight by cohort: today's run-rate as a share of the FY27 target"
          sub={`The dark fill is today's run-rate; the rest of the bar is not yet in run-rate (${money(totalGap)} across the eight cohorts, derived). Digital Natives overall: ~${model.los.dnPct.toFixed(0)}%.`}
          src={[{ part: "B", slides: "92" }, { part: "C", slides: "99–132" }]}
          basis={["stated", "derived"]}
          table={
            <DataTable
              columns={["Cohort", "Run-rate today ($M)", "FY27 target ($M)", "Line of sight (deck)", "Computed", "Not yet in run-rate ($M)"]}
              numeric={[1, 2, 5]}
              rows={rows.map((r) => [name(r.cohort).name, r.runRate, r.fy27, `~${r.losPct}%`, `${r.computedPct}%`, r.gap])}
              total={["Eight cohorts", rows.reduce((s, r) => s + r.runRate, 0).toFixed(1), rows.reduce((s, r) => s + r.fy27, 0), "", "", totalGap.toFixed(1)]}
            />
          }
        >
          <div className="k-bars" role="list">
            {rows.map((r) => {
              const c = name(r.cohort);
              const low = r.losPct < 10;
              return (
                <div className="k-bar-row los" key={r.cohort} role="listitem">
                  <div className="lab">
                    <button type="button" onClick={() => openCohort(r.cohort)} style={{ background: "none", border: 0, padding: 0, fontWeight: 650, textAlign: "left" }}>
                      {c.name}
                    </button>
                    <small>
                      <MotionTag motion={c.motion} /> {money(r.runRate)} of ~{money(r.fy27)}
                    </small>
                  </div>
                  <div
                    className="k-track"
                    tabIndex={0}
                    aria-label={`${c.name}: line of sight ${r.losPct}%`}
                    style={{ background: "var(--context-soft)", height: 22 }}
                    {...bind(
                      <>
                        <b>~{r.losPct}% line of sight</b>
                        <div className="mut">
                          {c.name}: {money(r.runRate)} run-rate today of ~{money(r.fy27)}
                        </div>
                        <div>{money(r.gap)} not yet in run-rate (derived)</div>
                      </>,
                    )}
                  >
                    <span className="bar" style={{ width: `${Math.max(r.losPct, 1)}%`, background: low ? "var(--risk-mark)" : "var(--deepen)" }} />
                  </div>
                  <div className="val">
                    ~{r.losPct}%{" "}
                    {low ? (
                      <span className="k-tag risk">
                        <TriangleAlert aria-hidden="true" />
                        Low
                      </span>
                    ) : null}
                    <div className="k-small k-muted" style={{ fontWeight: 600 }}>
                      {money(r.gap)} to find
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {node}
        </Fig>
      </Block>

      <Block title="The six highest-risk assumptions" sub="Ranked as the deck ranks them: the largest single bet first.">
        <div className="k-grid k-g3">
          {model.risks.items.map((r) => (
            <div className="k-card" key={r.rank} style={{ borderTop: r.rank <= 2 ? "3px solid var(--risk-mark)" : undefined }}>
              <h4>Risk {r.rank}</h4>
              <h3 style={{ marginTop: 2 }}>{r.title}</h3>
              <p style={{ marginTop: 6, fontWeight: 700, color: r.rank <= 2 ? "var(--risk)" : "var(--ink)" }}>{r.exposure}</p>
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{r.detail}</p>
              {r.cohort ? (
                <button type="button" className="k-pill" style={{ marginTop: 10 }} onClick={() => openCohort(r.cohort!, "decisions")}>
                  Open the cohort&rsquo;s open decisions
                </button>
              ) : null}
              <p className="k-small k-muted" style={{ marginTop: 8 }}>Slides {r.src.slides}</p>
            </div>
          ))}
        </div>
        <p className="k-small" style={{ marginTop: 12, color: "var(--ink-2)" }}>
          <Tag basis="stated" /> {model.risks.notes.churn}
        </p>
      </Block>

      <Block title="What must be true">
        <div className="k-grid k-g5">
          {model.mustBeTrue.map((m) => (
            <div className="k-card flat" key={m.title}>
              <h3>{m.title}</h3>
              <p style={{ marginTop: 6, fontSize: 13.5, color: "var(--ink-2)" }}>{m.detail}</p>
            </div>
          ))}
        </div>
        <Src src={{ part: "main", slides: "3" }} basis={["stated"]} />
      </Block>
    </Section>
  );
}
