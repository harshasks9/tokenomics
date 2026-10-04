"use client";

import { useSite } from "../context";
import { Block, DataTable, MOTION_COLOR, Section, Src, Tag } from "../ui";
import { COMMERCIAL_BUCKETS } from "@/lib/korea-fy27/flow-labels";
import type { FlowModel } from "@/lib/korea-fy27/flow";

const arrow = (from: number | string | null, to: number | string | null) => `${from ?? "–"} → ${to ?? "–"}`;

export default function FlowQ4({ flow }: { flow: FlowModel }) {
  const { model } = useSite();
  const h = flow.hiring;
  const ex = model.execution;
  const moneyAsk = model.asks.items.find((a) => a.id === "money");
  const bucketItems = (name: string) => ex.commercialBuckets.find((b) => b.name === name)?.items ?? "";

  return (
    <Section
      id="f-q4"
      num="7"
      label="Q4 execution plan"
      question="What do we do this quarter so FY27 starts on time?"
      headline="Q4 sets FY27 up: staff the pods, train every team on the six plays, and pre-approve the commercial offers."
      lead="The deck's 90-day plan slide (36) is an empty divider. This section collects what the deck dates to Q4 '26 and Q1 '27 under three headings: resources, skilling and commercials."
    >
      <Block title="This quarter, across the plan">
        <div className="k-grid k-g4">
          {flow.q4Overview.map((item) => (
            <div className="k-card flat" key={item.text}>
              <p style={{ fontSize: 14.5, fontWeight: 600 }}>{item.text}</p>
              <Src src={item.src} basis={[item.basis]} />
            </div>
          ))}
        </div>
      </Block>

      <div className="k-subsec" id="q4-resources">
        <h3 className="k-subhead">
          <span>7.1</span> Resources
        </h3>
        <p className="k-sub">Hiring and squad formation. Headcount is the deck&rsquo;s target with asks; the latest headline is the executive summary&rsquo;s.</p>

        <Block title={`Hiring: from ${h.current.aiSs} AI SS and ${h.current.aiCe} AI CE today to ${h.target.aiSs} and ${h.target.aiCe}`}>
          <dl className="k-kv">
            <div>
              <dt>AI SS</dt>
              <dd>
                {arrow(h.current.aiSs, h.target.aiSs)} <small>+{h.target.aiSs - h.current.aiSs}</small>
              </dd>
            </div>
            <div>
              <dt>AI CE</dt>
              <dd>
                {arrow(h.current.aiCe, h.target.aiCe)} <small>+{h.target.aiCe - h.current.aiCe}</small>
              </dd>
            </div>
            <div>
              <dt>FDE</dt>
              <dd>
                {h.current.fde.split(" ")[0]} → {h.target.fde.split(" ")[0]} <small>split still open</small>
              </dd>
            </div>
            <div>
              <dt>VCBD</dt>
              <dd>
                {arrow(h.current.vcbd, h.target.vcbd)} <small>the one net-new hire in the startup asks</small>
              </dd>
            </div>
          </dl>
          <div style={{ marginTop: 14 }}>
            <DataTable
              columns={["Cohort", "Vertical", "AI SS today → target", "AI CE today → target", "FDE (plan)"]}
              rows={h.rows.map((r) => [r.name, r.vertical ?? "Outside the five", arrow(r.current.aiSs, r.target.aiSs), arrow(r.current.aiCe, r.target.aiCe), r.plan.fde])}
              total={["Total", "", arrow(h.cohortSsNow, h.cohortSsTarget), `${arrow(h.cohortCeNow, h.cohortCeTarget)} (+4 in pools today)`, h.target.fde]}
            />
          </div>
          <ul className="k-list tight" style={{ marginTop: 12 }}>
            <li>The deck does not split the adds into new hires and re-allocations, except in the startup asks: one net-new VCBD and two re-allocations.</li>
            <li>Today 6 AI CE sit in cohorts and 4 in specialty pools (2 DN, 2 ENT). The 15 target AI CE are cohort seats; the deck does not say whether the pool CEs move into them, and its pod model still shows pool CEs.</li>
            <li>{model.resourcing.fdeConflict} The security pod&rsquo;s FDE is still to be hired.</li>
          </ul>
          <Src src={[{ part: "main", slides: "3, 12, 22–24, 29" }, { part: "C", slides: "97" }]} basis={["stated", "to-confirm"]} />
        </Block>

        <Block title="Squad formation: one team per vertical" sub="As the deck sets each one up, with the shared pod behind it.">
          <div className="k-grid k-ins">
            {flow.verticals.map((v) => (
              <div className="k-card flat" key={v.id} style={{ borderTop: `3px solid ${MOTION_COLOR[v.motion]}` }}>
                <h4>
                  {v.num} · {v.label}
                </h4>
                <h3 style={{ marginTop: 2 }}>{v.squad.name}</h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{v.squad.makeup}</p>
                <p className="k-small k-muted" style={{ marginTop: 6 }}>
                  Pod behind it: {v.squad.pod}
                </p>
                <Src src={v.squad.src} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <DataTable
              columns={["Shared pod", "Make-up", "Focus", "Covers"]}
              rows={model.resourcing.pods.map((p) => [p.name, p.makeup, p.focus, p.cohorts])}
              wrapCols={[1, 2, 3]}
            />
          </div>
          <Src src={{ part: "main", slides: "23" }} basis={["stated"]} />
        </Block>
      </div>

      <div className="k-subsec" id="q4-skilling">
        <h3 className="k-subhead">
          <span>7.2</span> Skilling
        </h3>
        <div className="k-callout light">
          The deck has no skilling plan.
          <small>
            The map below is a proposed curriculum built only from the deck: its six plays (slide 16), where each play leads (slide 17) and the solution deep dives (slides 19–22, marked WIP). Format, owners and dates are to define.
          </small>
        </div>

        <Block title="Deep-dive training for Tech and AISS, one per play" sub="Ordered as the deck lists the plays. “Leads in” shows slide 17 first and the cohort pages second; they disagree most on Security.">
          <div className="k-table-wrap">
            <table className="k-table">
              <thead>
                <tr>
                  <th scope="col">Play</th>
                  <th scope="col">Leads in</th>
                  <th scope="col">AISS: what to sell</th>
                  <th scope="col">Tech (AI CE / FDE): deep-dive tracks</th>
                  <th scope="col">Pod that teaches it</th>
                </tr>
              </thead>
              <tbody>
                {flow.training.map((t) => (
                  <tr key={t.play}>
                    <th scope="row" style={{ whiteSpace: "nowrap" }}>
                      {t.name}
                    </th>
                    <td>
                      <b>{t.leadsSlide17} of 8</b> · {t.leadsCohortPages} of 8
                      {t.verticalsLeading.length ? <span className="k-small k-muted" style={{ display: "block" }}>{t.verticalsLeading.join(", ")}</span> : null}
                    </td>
                    <td className="wrap">{t.what}</td>
                    <td className="wrap">
                      {t.tracks.map((tr) => (
                        <span key={tr.name} style={{ display: "block", marginBottom: 4 }}>
                          <b>{tr.name}</b>: {tr.focus}
                        </span>
                      ))}
                    </td>
                    <td className="wrap">{t.pod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Src src={{ part: "main", slides: "16–22" }} basis={["proposed", "wip"]} />
        </Block>

        <Block title="Common to every deep dive">
          <div className="k-grid k-g3">
            {ex.enablers.map((e) => (
              <div className="k-card flat" key={e.name} style={{ background: "var(--surface-2)" }}>
                <h4>Enabler under every play</h4>
                <h3 style={{ marginTop: 2 }}>{e.name}</h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{e.detail}</p>
              </div>
            ))}
            <div className="k-card flat">
              <h4>One delivery model</h4>
              <ol className="k-list tight" style={{ marginTop: 8 }}>
                {ex.phases.map((p) => (
                  <li key={p.num}>
                    <b>
                      {p.num}. {p.name}
                    </b>{" "}
                    · owner {p.owner}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <Src src={{ part: "main", slides: "16, 18" }} basis={["stated", "wip"]} />
        </Block>
      </div>

      <div className="k-subsec" id="q4-commercials">
        <h3 className="k-subhead">
          <span>7.3</span> Commercials deep dive
        </h3>
        <p className="k-sub">Every offer in the plan sits in one of four buckets. The pricing approvals are the Q4 decisions; the amounts are still open.</p>

        <Block title="Four buckets">
          <div className="k-grid k-g4">
            {COMMERCIAL_BUCKETS.map((b) => (
              <div className="k-card flat" key={b}>
                <h3>{b}</h3>
                <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{bucketItems(b)}</p>
              </div>
            ))}
          </div>
          <Src src={{ part: "C", slides: "96" }} basis={["stated"]} />
        </Block>

        <Block title="Offers by vertical">
          <div className="k-table-wrap">
            <table className="k-table k-cm">
              <thead>
                <tr>
                  <th scope="col">Vertical</th>
                  {COMMERCIAL_BUCKETS.map((b) => (
                    <th scope="col" key={b}>
                      {b}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flow.commercial.map((row) => (
                  <tr key={row.vertical}>
                    <th scope="row">
                      <span className="k-swatch" style={{ background: MOTION_COLOR[row.motion], borderRadius: 3 }} /> {row.label}
                    </th>
                    {COMMERCIAL_BUCKETS.map((b) => (
                      <td key={b} className="wrap">
                        {row.cells[b].length ? row.cells[b].map((x) => <span key={x} style={{ display: "block", marginBottom: 3 }}>{x}</span>) : <span className="k-muted">–</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Src src={[{ part: "main", slides: "25–32" }, { part: "C", slides: "103–120" }]} basis={["stated"]} />
        </Block>

        <Block title="Approvals to take in Q4">
          <div className="k-grid k-g2">
            <div className="k-card flat">
              <h4>The commercial decision in each vertical</h4>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {flow.commercial.map((row) => (
                  <li key={row.vertical}>
                    <b>{row.label}:</b> {row.decision}
                  </li>
                ))}
              </ul>
              <Src src={{ part: "C", slides: "102, 105, 109, 116, 119" }} basis={["stated"]} />
            </div>
            <div className="k-card flat">
              <h4>The money ask</h4>
              <p style={{ marginTop: 8, fontWeight: 600 }}>
                {moneyAsk?.decision} {moneyAsk ? <Tag basis={moneyAsk.decisionBasis} /> : null}
              </p>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {moneyAsk?.items.map((it) => (
                  <li key={it.text}>
                    {it.text} {it.basis !== "stated" ? <Tag basis={it.basis} /> : null}
                    <span className="k-small k-muted" style={{ display: "block" }}>
                      Unlocks: {it.unlocks}
                    </span>
                  </li>
                ))}
              </ul>
              <Src src={{ part: "main", slides: "3, 29, 38" }} basis={["to-confirm"]} />
            </div>
          </div>
        </Block>
      </div>
    </Section>
  );
}
