"use client";

import { ArrowRight } from "lucide-react";
import { useSite } from "../context";
import { Block, MOTION_COLOR, MotionTag, Section, Src, Tag } from "../ui";
import { StackBar } from "../charts";
import { money, num, SEGMENT_LABEL } from "@/lib/korea-fy27/format";
import { WHEN_LABEL, WHEN_ORDER } from "@/lib/korea-fy27/flow-labels";
import type { FlowModel, FlowVertical } from "@/lib/korea-fy27/flow";

const BUILD_SHADES = ["var(--navy-ink)", "#4f74a6", "#86b6ef", "#b7d3f6"];
const CIRCLED = ["①", "②", "③", "④"];

export default function FlowVerticals({ flow }: { flow: FlowModel }) {
  const { model } = useSite();
  const r = flow.reconciliation;
  const growth = model.headline.growth;
  const cohort = (id: string) => model.cohorts.find((c) => c.id === id)!;
  const maxPct = Math.max(...flow.verticals.map((v) => v.growthPct));

  return (
    <Section
      id="f-verticals"
      num="5"
      label="Five-vertical approach (by revenue)"
      question="Where do the motions meet the money, and how do we run each one?"
      headline={`Five verticals carry +${money(r.verticalsAdded)} of the +${money(growth)}: three in Digital Natives, two in conglomerates.`}
      lead="Each vertical is one segment × one motion, owned as one cohort. For each one: the overall approach with its exec sponsor and Q4 plan into FY27, then one example account."
    >
      <Block title="The five verticals by revenue" sub={`FY27 Google AI and what each vertical adds. Bars compare each vertical's share of the +${money(growth)}.`}>
        <div className="k-vgrid">
          {flow.verticals.map((v) => {
            const c = cohort(v.cohort);
            return (
              <a key={v.id} className="k-vcard" href={`#${v.id}`} style={{ ["--c" as string]: MOTION_COLOR[v.motion] }}>
                <span className="num">{v.num}</span>
                <b className="lab">{v.label}</b>
                <span className="name">{c.name}</span>
                <span className="v">~{money(c.fy27)}</span>
                <span className="d">
                  +{money(c.added)} · {v.growthPct}% of growth
                </span>
                <span className="bar" aria-hidden="true">
                  <i style={{ width: `${(v.growthPct / maxPct) * 100}%` }} />
                </span>
                <span className="los">Line of sight today ~{c.losPct}%</span>
              </a>
            );
          })}
        </div>
        <div className="k-callout light" style={{ marginTop: 14 }}>
          {flow.verticals.map((v, i) => (
            <span key={v.id}>
              {i ? " + " : ""}
              {money(cohort(v.cohort).added)}
            </span>
          ))}{" "}
          = <b>+{money(r.verticalsAdded)}</b>, {Math.round((r.verticalsAdded / growth) * 100)}% of the +{money(growth)}.
          <small>
            The other +{money(r.othersAdded)} sits in three Acquire cohorts outside the five verticals:{" "}
            {flow.others
              .slice()
              .sort((a, b) => b.added - a.added)
              .map((o) => `${o.name} +${money(o.added)}`)
              .join(", ")}
            . Hyundai AutoEver is held flat at {money(r.autoEver)}. Together the cohorts add +{money(r.addedTotal)}, which the deck rounds to +{money(growth)}; FY27 closes at ~{money(r.fy27Total)} against ~{money(r.statedFy27)}.
          </small>
        </div>
        <Src src={[{ part: "main", slides: "12–13" }, { part: "B", slides: "94" }]} basis={["stated", "derived"]} />
      </Block>

      {flow.verticals.map((v) => (
        <VerticalBlock key={v.id} v={v} />
      ))}
    </Section>
  );
}

function VerticalBlock({ v }: { v: FlowVertical }) {
  const { model, openCohort } = useSite();
  const c = model.cohorts.find((x) => x.id === v.cohort)!;
  const buildTotal = c.buildUp.reduce((s, b) => s + b.value, 0);
  const plays = model.execution.plays;
  const lead = plays.filter((p) => c.plays[p.id] === "lead");
  const second = plays.filter((p) => c.plays[p.id] === "second");
  const roles = [...new Set(c.targets.map((t) => t.owner).filter(Boolean))];
  const topNotes = v.top?.footnotes
    ? model.plan.topAccounts.notes.filter((n) => v.top!.footnotes!.split(" ").some((mark) => mark && n.startsWith(mark)))
    : [];
  const s = v.staffing;

  return (
    <article className="k-vert" id={v.id} aria-labelledby={`${v.id}-h`} style={{ ["--c" as string]: MOTION_COLOR[v.motion] }}>
      <div className="k-vert-head">
        <span className="num">{v.num}</span>
        <h3 id={`${v.id}-h`}>{v.label}</h3>
        <span className="who">
          {SEGMENT_LABEL[v.segment]} · <MotionTag motion={v.motion} /> · {c.name}
        </span>
      </div>

      <dl className="k-kv" style={{ marginTop: 14 }}>
        <div>
          <dt>FY26 → FY27</dt>
          <dd>
            {money(c.fy26)} → ~{money(c.fy27)} {c.multiple ? <small>{c.multiple}</small> : null}
          </dd>
        </div>
        <div>
          <dt>Added in FY27</dt>
          <dd>
            +{money(c.added)} <small>{v.growthPct}% of growth</small>
          </dd>
        </div>
        <div>
          <dt>Line of sight today</dt>
          <dd style={{ color: c.losPct < 10 ? "var(--risk)" : undefined }}>
            ~{c.losPct}% <small>{money(c.runRate)} run-rate</small>
          </dd>
        </div>
        <div>
          <dt>Accounts</dt>
          <dd style={{ fontSize: 15, lineHeight: 1.3 }}>{c.accounts}</dd>
        </div>
        <div>
          <dt>Coverage</dt>
          <dd style={{ fontSize: 15, lineHeight: 1.3 }}>{c.coverage}</dd>
        </div>
      </dl>

      <h4 className="k-vsub">Overall approach for this cohort</h4>
      <div className="k-vert-grid">
        <div className="k-card">
          <h4>The big move</h4>
          <p style={{ marginTop: 6, fontSize: 15.5, fontWeight: 600 }}>{c.bigMove}</p>
          <p className="k-sub" style={{ marginTop: 8 }}>
            Deck assumption: {c.assumption}
          </p>
          <h4 style={{ marginTop: 16 }}>How the number is built</h4>
          <StackBar total={buildTotal} parts={c.buildUp.map((b, i) => ({ key: b.label, value: b.value, label: b.label, color: BUILD_SHADES[i % BUILD_SHADES.length] }))} />
          <div className="k-build">
            {c.buildUp.map((b, i) => (
              <div className="k-build-row" key={b.label}>
                <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <i className="k-swatch" style={{ background: BUILD_SHADES[i % BUILD_SHADES.length] }} />
                  {b.label} <Tag basis={b.basis} />
                </span>
                <b>{money(b.value)}</b>
              </div>
            ))}
            <div className="k-build-row total">
              <span>FY27 target (deck: ~{money(c.fy27)})</span>
              <b>{money(Math.round(buildTotal * 10) / 10)}</b>
            </div>
          </div>
          <div className="k-callout light" style={{ marginTop: 14 }}>
            {c.callout}
          </div>
        </div>

        <div className="k-card">
          <h4>What we sell</h4>
          <p className="k-pill-row" style={{ marginTop: 8 }}>
            {lead.map((p) => (
              <span key={p.id} className="k-dot lead">
                <i aria-hidden="true" /> {p.name}
              </span>
            ))}
            {second.map((p) => (
              <span key={p.id} className="k-dot">
                <i aria-hidden="true" /> {p.name}
              </span>
            ))}
          </p>
          <p className="k-small k-muted" style={{ marginTop: 6 }}>
            Filled dot = lead play, ring = second line (slide 17).
          </p>
          <h4 style={{ marginTop: 16 }}>How we deliver</h4>
          {[
            { h: "Tech + FDE", items: c.tech },
            { h: "Commercial", items: c.commercial },
            { h: "Partner", items: c.partner },
          ].map((col) => (
            <div key={col.h} style={{ marginTop: 10 }}>
              <b style={{ fontSize: 13.5 }}>{col.h}</b>
              <ul className="k-list tight" style={{ marginTop: 6 }}>
                {col.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Src src={[c.srcMain, c.srcAppendix]} basis={["stated", "derived"]} />

      <div className="k-sponsor">
        <div>
          <h4>Exec sponsor</h4>
          <p className="name">
            {v.sponsor.text} <Tag basis={v.sponsor.basis} />
          </p>
          <p className="k-small k-muted">{v.sponsor.note}</p>
        </div>
        <dl>
          <div>
            <dt>Cohort owner</dt>
            <dd>
              {c.owner} <Tag basis="placeholder" />
            </dd>
          </div>
          {s ? (
            <div>
              <dt>Team today → target</dt>
              <dd>
                AI SS {s.current.aiSs} → {s.target.aiSs} · AI CE {s.current.aiCe} → {s.target.aiCe ?? "–"} · FDE {s.plan.fde.toLowerCase()}
              </dd>
            </div>
          ) : null}
          <div>
            <dt>Milestone owners</dt>
            <dd>{roles.length ? roles.join(" · ") : "Not named"}</dd>
          </div>
        </dl>
        <Src src={[v.sponsor.src, { part: "main", slides: "23–24" }]} />
      </div>

      <div className="k-fig" style={{ marginTop: 14 }}>
        <div className="k-fig-head">
          <div>
            <h3>Q4 execution plan for FY27</h3>
            <p>What the deck sets for this quarter, then the dated milestones into FY27 with the role that owns each.</p>
          </div>
        </div>
        <div className="k-time">
          {WHEN_ORDER.map((w) => {
            const items = v.milestones.filter((m) => m.when === w);
            return (
              <div key={w} className={`k-time-col ${w === "q4" ? "now" : ""}`}>
                <h4>{w === "fy27" ? `${WHEN_LABEL[w]} · no date in the deck` : WHEN_LABEL[w]}</h4>
                <ul>
                  {w === "q4" ? (
                    <>
                      {v.top ? (
                        <li>
                          <b>Activate (top-13 list):</b> {v.top.accounts}. {money(v.top.googleToday)} of their {money(v.top.totalAiSpend)} total AI spend{v.top.footnotes ? <sup>{v.top.footnotes}</sup> : null} is with us today; FY27 account plan {money(v.top.planBase)}–{money(v.top.planStretch)}.
                        </li>
                      ) : null}
                      {v.q4.map((item) => (
                        <li key={item.text}>
                          {item.text} {item.basis !== "stated" ? <Tag basis={item.basis} /> : null}
                        </li>
                      ))}
                      <li>
                        <b>Decide in the room:</b>
                        <ol className="k-decide">
                          {c.decisions.map((d, i) => (
                            <li key={d}>
                              <span aria-hidden="true">{CIRCLED[i]}</span> {d}
                            </li>
                          ))}
                        </ol>
                      </li>
                    </>
                  ) : items.length ? (
                    items.map((m) => (
                      <li key={m.text}>
                        {m.text}
                        <span className="who">{m.owner ? `Owner: ${m.owner}` : "Owner not named"}</span>
                      </li>
                    ))
                  ) : (
                    <li className="k-muted">Nothing dated here in the deck.</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
        {topNotes.length ? <p className="k-tfoot-note">{topNotes.join(" ")}</p> : null}
        <Src src={[{ part: "main", slides: "14" }, c.srcMain, c.srcAppendix]} basis={["stated"]} />
      </div>

      <div className="k-card k-xa-card" style={{ marginTop: 14 }}>
        <h4>Key example account</h4>
        <h3 style={{ marginTop: 4, fontSize: 20 }}>{v.example.display}</h3>
        <p style={{ marginTop: 6, color: "var(--ink-2)" }}>{v.example.why}</p>
        {v.exampleRow ? (
          <>
            <dl className="k-xa">
              {v.exampleRow.columns.map((col, i) => {
                const cell = v.exampleRow!.cells[i];
                if (i === 0 || cell === null || cell === undefined || cell === "") return null;
                return (
                  <div key={col}>
                    <dt>{col}</dt>
                    <dd>{typeof cell === "number" ? num(cell) : cell}</dd>
                  </div>
                );
              })}
            </dl>
            <p className="k-small k-muted" style={{ marginTop: 8 }}>
              From &ldquo;{v.exampleRow.tableTitle}&rdquo;. Account figures in $M, as printed in the deck.
            </p>
          </>
        ) : null}
        <Src src={v.example.src} basis={[v.example.basis]} />
      </div>

      <button type="button" className="k-pill" style={{ marginTop: 12 }} onClick={() => openCohort(c.id, "economics")}>
        Open the full cohort plan <ArrowRight size={12} aria-hidden="true" />
      </button>
    </article>
  );
}
