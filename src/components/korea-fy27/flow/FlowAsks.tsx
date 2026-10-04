"use client";

import { useSite } from "../context";
import { Block, MOTION_COLOR, Section, Src } from "../ui";
import { AskPanels } from "../sections/Asks";
import { srcText } from "@/lib/korea-fy27/format";
import type { FlowModel } from "@/lib/korea-fy27/flow";

const CIRCLED = ["①", "②", "③", "④"];

export default function FlowAsks({ flow }: { flow: FlowModel }) {
  const { model } = useSite();

  return (
    <Section
      id="f-asks"
      num="9"
      label="Asks & follow-ups"
      question="What do we need, and what is still open?"
      exec
      headline={`Three decisions today, then ${flow.followUps.length} follow-ups to close before Q1.`}
      lead="The asks are the deck's. The follow-ups are what it leaves open; none of them is filled in here."
    >
      <Block>
        <AskPanels />
        <p className="k-small k-muted" style={{ marginTop: 10 }}>{model.asks.linkNote}</p>
        <Src src={{ part: "main", slides: "3, 29, 38" }} basis={["stated", "to-confirm", "placeholder"]} />
      </Block>

      <Block title="Follow-ups the deck leaves open">
        <div className="k-table-wrap">
          <table className="k-table">
            <thead>
              <tr>
                <th scope="col">Follow-up</th>
                <th scope="col">What is open</th>
                <th scope="col">Where in this flow</th>
                <th scope="col">Source</th>
              </tr>
            </thead>
            <tbody>
              {flow.followUps.map((f) => (
                <tr key={f.item}>
                  <th scope="row">{f.item}</th>
                  <td className="wrap">{f.open}</td>
                  <td>{f.where}</td>
                  <td className="wrap k-small">{srcText(f.src)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block title="Decisions in the room, by vertical" sub="Three per cohort page. Each is a Q4 decision in that vertical's plan.">
        <div className="k-grid k-ins">
          {flow.verticals.map((v) => {
            const c = model.cohorts.find((x) => x.id === v.cohort)!;
            return (
              <div className="k-card flat" key={v.id} style={{ borderTop: `3px solid ${MOTION_COLOR[v.motion]}` }}>
                <h4>
                  {v.num} · {v.label}
                </h4>
                <h3 style={{ marginTop: 2 }}>{c.name}</h3>
                <ol className="k-decide" style={{ marginTop: 10 }}>
                  {c.decisions.map((d, i) => (
                    <li key={d}>
                      <span aria-hidden="true">{CIRCLED[i]}</span> {d}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
        <Src src={{ part: "C", slides: "102, 105, 109, 116, 119" }} basis={["stated"]} />
      </Block>

      <div className="k-callout" style={{ fontSize: 22 }}>{model.asks.closing}</div>
    </Section>
  );
}
