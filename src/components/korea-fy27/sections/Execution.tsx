"use client";

import { useState } from "react";
import { useSite } from "../context";
import { Block, DataTable, Details, Fig, MotionTag, Section, Src, Tag, useTip } from "../ui";
import { money, PLAY_STATE_LABEL } from "@/lib/korea-fy27/format";
import type { PlayId, PlayState } from "@/lib/korea-fy27/types";

const PHASE_SHADES = ["#86b6ef", "#3987e5", "#184f95"];

export default function ExecutionSection() {
  const { model, openCohort } = useSite();
  const ex = model.execution;
  const [view, setView] = useState<"current" | "page">("current");
  const { bind, node } = useTip();
  const stateOf = (c: (typeof model.cohorts)[number], p: PlayId): PlayState => (view === "current" ? c.plays[p] : c.playsOnCohortPage[p]);
  const leads = (p: PlayId) => model.cohorts.filter((c) => stateOf(c, p) === "lead").length;

  return (
    <Section
      id="execution"
      num="06"
      label="Execution"
      question="What do we sell, and how do we move customers from pilot to production?"
      headline="Six plays, one delivery system: land technically, engineer to production, then scale consumption."
      lead={ex.engines}
    >
      <Block title="What we sell: six plays" sub="Five model-platform plays and one Gemini Enterprise play. Two enablers sit under all six.">
        <div className="k-grid k-g3">
          {ex.plays.map((p) => (
            <div className="k-card" key={p.id}>
              <h4>{p.family}</h4>
              <h3 style={{ marginTop: 2 }}>{p.name}</h3>
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{p.what}</p>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {p.detail.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className="k-small" style={{ marginTop: 10, fontWeight: 650 }}>Leads in {p.leadCount} of 8 cohorts</p>
            </div>
          ))}
        </div>
        <div className="k-grid k-g2" style={{ marginTop: 12 }}>
          {ex.enablers.map((e) => (
            <div className="k-card flat" key={e.name} style={{ background: "var(--surface-2)" }}>
              <h4>Enabler under every play</h4>
              <h3 style={{ marginTop: 2 }}>
                {e.name} <span className="k-muted" style={{ fontWeight: 600 }}>· {e.tagline}</span>
              </h3>
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{e.detail}</p>
            </div>
          ))}
        </div>
        <Src src={[{ part: "main", slides: "16" }, { part: "C", slides: "96, 133" }]} basis={["stated"]} extra={<span>{ex.enablerNote}</span>} />
      </Block>

      <Block>
        <Fig
          title="Which plays lead in which cohort"
          sub="● lead play · ○ second line · – not a focus. States only: the deck attributes no revenue by play."
          src={[{ part: "main", slides: "17" }, { part: "main", slides: "25–35" }]}
          basis={["wip"]}
          note={ex.heatmapNote}
          actions={
            <div className="k-toggle k-noprint" role="group" aria-label="Which view">
              <button type="button" aria-pressed={view === "current"} onClick={() => setView("current")}>
                Slide 17 (1 Oct)
              </button>
              <button type="button" aria-pressed={view === "page"} onClick={() => setView("page")}>
                Cohort pages
              </button>
            </div>
          }
        >
          <div className="k-table-wrap" style={{ border: 0 }}>
            <table className="k-heat">
              <colgroup>
                <col className="l" />
                {ex.plays.map((p) => (
                  <col key={p.id} />
                ))}
              </colgroup>
              <thead>
                <tr>
                  <th className="l" scope="col">Cohort</th>
                  {ex.plays.map((p) => (
                    <th key={p.id} scope="col">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {model.cohorts.map((c) => (
                  <tr key={c.id}>
                    <td className="l">
                      <button type="button" onClick={() => openCohort(c.id, "plays")} style={{ background: "none", border: 0, padding: 0, textAlign: "left", fontWeight: 650 }}>
                        {c.name}
                      </button>
                      <small>
                        <MotionTag motion={c.motion} /> +{money(c.added)}
                      </small>
                    </td>
                    {ex.plays.map((p) => {
                      const s = stateOf(c, p.id);
                      const changed = c.plays[p.id] !== c.playsOnCohortPage[p.id];
                      return (
                        <td key={p.id}>
                          <span
                            className={`k-hcell ${s} ${changed ? "changed" : ""}`}
                            tabIndex={0}
                            aria-label={`${c.name}, ${p.name}: ${PLAY_STATE_LABEL[s]}${changed ? ", differs between the two views" : ""}`}
                            {...bind(
                              <>
                                <b>{PLAY_STATE_LABEL[s]}</b>
                                <div className="mut">
                                  {c.name} · {p.name}
                                </div>
                                {changed ? (
                                  <div style={{ marginTop: 4 }}>
                                    Slide 17: {PLAY_STATE_LABEL[c.plays[p.id]]} · cohort page: {PLAY_STATE_LABEL[c.playsOnCohortPage[p.id]]}
                                  </div>
                                ) : null}
                              </>,
                            )}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="l">Cohorts where the play leads</td>
                  {ex.plays.map((p) => (
                    <td key={p.id}>{leads(p.id)} of 8</td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          {node}
          <p className="k-legend" style={{ marginTop: 10 }}>
            <span>
              <i className="k-swatch" style={{ background: "var(--deepen)", borderRadius: "50%" }} /> Lead play
            </span>
            <span>
              <i className="k-swatch" style={{ border: "2px solid var(--deepen)", borderRadius: "50%" }} /> Second line
            </span>
            <span>
              <i className="k-swatch" style={{ height: 2, background: "var(--context)" }} /> Not a focus
            </span>
            <span>
              <i className="k-swatch" style={{ width: 14, height: 14, boxShadow: "inset 0 0 0 1.5px var(--ink-2)", borderRadius: 4 }} /> Differs between the two views
            </span>
          </p>
        </Fig>
      </Block>

      <Block title="How we deliver: one three-phase model" sub="Every phase has an owner. FDE time is spent only where it moves the number.">
        <div className="k-phases">
          {ex.phases.map((p, i) => (
            <div className="k-phase" key={p.num}>
              <span className="bar" style={{ background: PHASE_SHADES[i] }} />
              <span className="ph">Phase {p.num}</span>
              <h3>{p.name}</h3>
              <span className="own">Owner: {p.owner}</span>
              <ul className="k-list tight">
                {p.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Details title="The same three phases, play by play" sub="slide 18 · WIP · Security placeholders kept" className="k-exec-hide">
          <DataTable
            columns={["Play", "Phase 1 · Technical land (AI CE)", "Phase 2 · Production engineering (FDE)", "Phase 3 · Consumption scale (AI CE + FDE)"]}
            rows={ex.phaseGrid.map((r) => [r.play, r.land, r.build, r.scale])}
            wrapCols={[1, 2, 3]}
          />
          <Src src={{ part: "main", slides: "18" }} basis={["wip", "placeholder"]} />
        </Details>
        <Src src={[{ part: "main", slides: "18–22" }, { part: "C", slides: "96, 133" }]} basis={["wip"]} />
      </Block>

      <Block title="Rules of the system">
        <div className="k-grid k-g2">
          <div className="k-card flat">
            <h4>Governance principles</h4>
            <div className="k-build" style={{ marginTop: 10 }}>
              {ex.governance.map((g) => (
                <div className="k-build-row" key={g.title} style={{ display: "block" }}>
                  <b>{g.title}.</b> <span style={{ color: "var(--ink-2)" }}>{g.detail}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            <div className="k-card flat">
              <h4>The same KPIs in every cohort</h4>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {ex.kpis.map((k) => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </div>
            <div className="k-card flat">
              <h4>Commercial programs: four buckets</h4>
              <div className="k-build" style={{ marginTop: 10 }}>
                {ex.commercialBuckets.map((b) => (
                  <div className="k-build-row" key={b.name}>
                    <b>{b.name}</b>
                    <span className="k-small" style={{ textAlign: "right", color: "var(--ink-2)" }}>{b.items}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="k-card flat">
              <h4>Gemini Enterprise activation cadence</h4>
              <div className="k-build" style={{ marginTop: 10 }}>
                {ex.activation.map((a) => (
                  <div className="k-build-row" key={a.day}>
                    <b>{a.day}</b>
                    <span className="k-small" style={{ textAlign: "right", color: "var(--ink-2)" }}>{a.what}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Src src={[{ part: "main", slides: "3, 20" }, { part: "C", slides: "96, 133" }]} basis={["stated"]} />
      </Block>

      <Block title="Solution deep dives" sub="Working detail behind each play. All four slides are marked WIP; individual names are replaced by roles.">
        {ex.deepDives.map((d) => (
          <Details
            key={d.id}
            className="k-exec-hide"
            title={
              <>
                {d.title} {d.wip ? <Tag basis="wip" /> : null}
              </>
            }
            sub={d.cohorts}
          >
            <p className="k-sub" style={{ marginBottom: 12 }}>
              <b>Pod:</b> {d.pod}
            </p>
            {d.tracks.map((t) => (
              <div key={t.name} style={{ marginBottom: 16 }}>
                <h4 className="k-h3" style={{ fontSize: 15 }}>
                  {t.name}
                </h4>
                <p className="k-small k-muted" style={{ marginTop: 2 }}>
                  Focus: {t.focus}
                </p>
                <div className="k-grid k-g3" style={{ marginTop: 8 }}>
                  {[
                    { h: "Technical land", items: t.land, c: PHASE_SHADES[0] },
                    { h: "Production engineering", items: t.build, c: PHASE_SHADES[1] },
                    { h: "Consumption scale", items: t.scale, c: PHASE_SHADES[2] },
                  ].map((col) => (
                    <div className="k-card flat" key={col.h} style={{ borderTop: `3px solid ${col.c}` }}>
                      <h4>{col.h}</h4>
                      <ul className="k-list tight" style={{ marginTop: 8 }}>
                        {col.items.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <h4 className="k-h3" style={{ fontSize: 15 }}>
              Accountability and cadence
            </h4>
            <ul className="k-list tight" style={{ marginTop: 8 }}>
              {d.cadence.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Details>
        ))}
        <Src src={{ part: "main", slides: "19–22" }} basis={["wip"]} />
      </Block>
    </Section>
  );
}
