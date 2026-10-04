"use client";

import { useSite } from "../context";
import { Block, MOTION_COLOR, Section, Src, Tag } from "../ui";
import { Meter } from "../charts";
import { money } from "@/lib/korea-fy27/format";
import type { FlowModel } from "@/lib/korea-fy27/flow";

export default function FlowAccountability({ flow }: { flow: FlowModel }) {
  const { model, openCohort } = useSite();
  const ex = model.execution;
  const rows = flow.accountability;
  const fy27 = rows.reduce((s, r) => s + r.fy27, 0);
  const runRate = rows.reduce((s, r) => s + r.runRate, 0);

  return (
    <Section
      id="f-accountability"
      num="8"
      label="Accountability"
      question="Who owns which number, and how do we track it?"
      headline="One owner, one number: every cohort gets a named owner, a $ target and a quarterly run-rate KPI."
      lead="The deck sets the targets, the KPIs and the operating rhythm. It does not yet name the owners or the exec sponsors, so they stay blank here."
    >
      <Block title="Who owns which number" sub="The five verticals first, then the three cohorts outside them. Line of sight is today's run-rate against the FY27 target.">
        <div className="k-table-wrap">
          <table className="k-table k-acc">
            <thead>
              <tr>
                <th scope="col">Cohort</th>
                <th scope="col">Owner</th>
                <th scope="col">Exec sponsor</th>
                <th scope="col" className="num">
                  FY27 target
                </th>
                <th scope="col" className="num">
                  Run-rate today
                </th>
                <th scope="col">Line of sight</th>
                <th scope="col">Milestones · owners</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.cohort}>
                  <th scope="row">
                    <span className="k-swatch" style={{ background: MOTION_COLOR[r.motion], borderRadius: 3 }} />{" "}
                    {r.verticalId ? (
                      <a href={`#${r.verticalId}`}>{r.vertical}</a>
                    ) : (
                      <button type="button" className="k-linkbtn" onClick={() => openCohort(r.cohort)}>
                        {r.name}
                      </button>
                    )}
                    {r.verticalId ? <span className="k-small k-muted" style={{ display: "block" }}>{r.name}</span> : <span className="k-small k-muted" style={{ display: "block" }}>Outside the five verticals</span>}
                  </th>
                  <td>{r.owner}</td>
                  <td className="wrap">{r.sponsor ?? <span className="k-muted">Not asked in the deck</span>}</td>
                  <td className="num">~{money(r.fy27)}</td>
                  <td className="num">{money(r.runRate)}</td>
                  <td style={{ minWidth: 150 }}>
                    <Meter pct={r.losPct} low={r.losPct < 10} label={`~${r.losPct}%`} />
                  </td>
                  <td className="wrap">
                    {r.milestones} · {r.roles.join(", ") || "owners not named"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Eight cohorts + AutoEver held flat</td>
                <td />
                <td />
                <td className="num">~{money(Math.round((fy27 + model.autoEver.fy27) * 10) / 10)}</td>
                <td className="num">{money(Math.round((runRate + model.autoEver.runRate) * 10) / 10)}</td>
                <td colSpan={2} className="k-small">
                  Deck: ~{money(model.headline.fy27Plan)}. AutoEver runs at ~{money(model.autoEver.runRate)} against {money(model.autoEver.fy27)} in the plan.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Src src={[{ part: "main", slides: "3, 12, 25–35" }, { part: "C", slides: "102–132" }]} basis={["stated", "placeholder", "derived"]} />
      </Block>

      <Block title="The same KPIs in every cohort">
        <p className="k-pill-row">
          {ex.kpis.map((k) => (
            <span className="k-pill" key={k}>
              {k}
            </span>
          ))}
        </p>
        <div className="k-grid k-g5" style={{ marginTop: 14 }}>
          {ex.governance.map((g) => (
            <div className="k-card flat" key={g.title}>
              <h3 style={{ fontSize: 15 }}>{g.title}</h3>
              <p style={{ marginTop: 6, fontSize: 13.5, color: "var(--ink-2)" }}>{g.detail}</p>
            </div>
          ))}
        </div>
        <Src src={[{ part: "main", slides: "3, 16, 20" }, { part: "C", slides: "96, 133" }]} basis={["stated"]} />
      </Block>

      <Block title="Operating rhythm" sub="How often each number is reviewed, and the gates that release FDE time and seats.">
        <div className="k-cad">
          {flow.cadence.map((c) => (
            <div className="k-cad-col" key={c.rhythm}>
              <h4>{c.rhythm}</h4>
              <ul>
                {c.items.map((it) => (
                  <li key={it.text}>
                    {it.text} {it.basis !== "stated" ? <Tag basis={it.basis} /> : null}
                    <span className="src">slide {it.src.slides}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Src src={{ part: "main", slides: "3, 16, 19–23, 28–30, 34" }} basis={["stated", "wip", "proposed"]} />
      </Block>
    </Section>
  );
}
