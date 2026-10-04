"use client";

import { useSite } from "../context";
import { Block, Details, MotionTag, Section, Src, Tag } from "../ui";
import { money } from "@/lib/korea-fy27/format";

export default function AsksSection() {
  const { model, openCohort } = useSite();
  const name = (id: string) => model.cohorts.find((c) => c.id === id)?.name ?? id;

  const open = [
    { what: "Cohort owners", state: "[name] on all 8 cohort pages" },
    { what: "Cohort targets", state: "[team to fill] on 5 cohort pages (Appendix C fills them)" },
    { what: "Money asks", state: "[$ to confirm] on custom pricing, startup credits, campus fund, VCBD credit pool" },
    { what: "General asks slide", state: "\"xx\", \"xxx\", \"Decisionxxx\" placeholders" },
    { what: "Google Play owner", state: "to confirm" },
    { what: "FDE model", state: "3 anchor + 11 pool vs 6 dedicated + 8 pool" },
  ];

  return (
    <Section
      id="asks"
      num="10"
      label="Asks"
      question="What must leadership decide now?"
      exec
      headline="Three decisions today let the eight cohort plans start in Q1."
      lead="Each ask is tied to the line of the plan it unlocks. Where the deck leaves an amount or a name open, it stays open here."
    >
      <Block>
        <div className="k-grid" style={{ gap: 14 }}>
          {model.asks.items.map((a) => (
            <div className="k-card" key={a.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 0 }}>
                <div style={{ padding: "18px 20px", background: "var(--navy-ink)", color: "#fff", display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, opacity: 0.8 }}>DECISION {a.num}</span>
                  <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
                    {a.name}: {a.headline}
                  </h3>
                </div>
                <div style={{ padding: "16px 20px 18px" }}>
                  <p style={{ fontSize: 15.5, fontWeight: 600 }}>
                    {a.decision} <Tag basis={a.decisionBasis} />
                  </p>
                  <div className="k-table-wrap" style={{ marginTop: 12 }}>
                    <table className="k-table">
                      <thead>
                        <tr>
                          <th scope="col">What we ask</th>
                          <th scope="col">What it unlocks</th>
                          <th scope="col">Cohorts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {a.items.map((it) => (
                          <tr key={it.text}>
                            <td className="wrap" style={{ color: "var(--ink)", fontWeight: 600 }}>
                              {it.text} {it.basis !== "stated" ? <Tag basis={it.basis} /> : null}
                            </td>
                            <td className="wrap">{it.unlocks}</td>
                            <td>
                              <span className="k-pill-row">
                                {it.cohorts.length === 8 ? (
                                  <span className="k-pill">All 8 cohorts</span>
                                ) : (
                                  it.cohorts.map((c) => (
                                    <button key={c} type="button" className="k-pill" onClick={() => openCohort(c, "decisions")}>
                                      {name(c)}
                                    </button>
                                  ))
                                )}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="k-small k-muted" style={{ marginTop: 10 }}>
                    Source state: {a.sourceState}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="k-small k-muted" style={{ marginTop: 10 }}>{model.asks.linkNote}</p>
        <Src src={{ part: "main", slides: "3, 29, 38" }} basis={["stated", "to-confirm", "placeholder"]} />
      </Block>

      <Block title="Still open in the deck" sub="Nothing below is filled in on this site.">
        <div className="k-grid k-g3">
          {open.map((o) => (
            <div className="k-card flat" key={o.what}>
              <h4>{o.what}</h4>
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{o.state}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Cohort-level decisions" sub="Each cohort's appendix page lists three decisions to take in the room.">
        {model.cohorts.map((c) => (
          <Details
            key={c.id}
            className="k-exec-hide"
            title={
              <>
                {c.name} <MotionTag motion={c.motion} />
              </>
            }
            sub={`~${money(c.fy27)} · ~${c.losPct}% line of sight`}
          >
            <ol style={{ paddingLeft: 20, display: "grid", gap: 6 }}>
              {c.decisions.map((d) => (
                <li key={d} style={{ color: "var(--ink-2)" }}>
                  {d}
                </li>
              ))}
            </ol>
            <button type="button" className="k-pill" style={{ marginTop: 10 }} onClick={() => openCohort(c.id, "economics")}>
              Open the cohort plan
            </button>
          </Details>
        ))}
        <Src src={{ part: "C", slides: "102, 105, 109, 116, 119, 122, 126, 130" }} basis={["stated"]} />
      </Block>

      <div className="k-callout" style={{ fontSize: 22 }}>{model.asks.closing}</div>
    </Section>
  );
}
