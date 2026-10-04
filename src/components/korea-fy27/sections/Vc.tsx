"use client";

import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { useSite } from "../context";
import { Block, DataTable, Details, Fig, Section, Src, Tag } from "../ui";
import { HBars } from "../charts";
import { money } from "@/lib/korea-fy27/format";

export default function VcSection() {
  const { model, openCohort } = useSite();
  const vc = model.vc;
  const startups = model.cohorts.find((c) => c.id === "startups")!;

  return (
    <Section
      id="vc"
      num="08"
      label="VC engine"
      question="How do we build the new-logo machine FY26 did not have?"
      headline="The startup engine is both the largest dependency and the largest new capability: ~$114M of the cohort's FY27 AI runs through investors."
      lead="FY26 growth came almost entirely from existing accounts. Breakout startups pick a cloud by Series B, and a few investors see most of the pipeline, so investors become the sourcing channel: a channel, not a contact list."
    >
      <Block>
        <div className="k-grid k-g4">
          <div className="k-card k-stat">
            <span className="l">VC-led FY27 AI</span>
            <span className="v">~{money(vc.vcLed)}</span>
            <span className="d">~{vc.vcLedPctStated}% of the cohort&rsquo;s +{money(startups.added)}: 50 scaleups via clinics (~$90M) + 1K+ program (~$24M)</span>
          </div>
          <div className="k-card k-stat">
            <span className="l">Investor partners</span>
            <span className="v">
              {vc.partners.live} → {vc.partners.goal}
            </span>
            <span className="d">{vc.partners.label}</span>
          </div>
          <div className="k-card k-stat risk">
            <span className="l">New logos in FY26</span>
            <span className="v">$0.8M</span>
            <span className="d">added by 167 new logos, against +$175M of AI growth</span>
          </div>
          <div className="k-card k-stat risk">
            <span className="l">Line of sight today</span>
            <span className="v">~{startups.losPct}%</span>
            <span className="d">
              {money(startups.runRate)} run-rate against ~{money(startups.fy27)}
            </span>
          </div>
        </div>
        <Src src={[{ part: "main", slides: "27–29" }, { part: "C", slides: "109" }]} basis={["stated"]} />
      </Block>

      <Block title="Why a VC channel">
        <div className="k-grid k-g3">
          {vc.why.map((w) => (
            <div className="k-card flat" key={w.title}>
              <h3>{w.title}</h3>
              <p style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)" }}>{w.detail}</p>
            </div>
          ))}
        </div>
        <div className="k-fig" style={{ marginTop: 14 }}>
          <h3 className="k-h3" style={{ fontSize: 15.5 }}>How it works</h3>
          <div className="k-flow" style={{ marginTop: 12 }} aria-label="Partner portfolio to first paid spend">
            {vc.flow.map((step, i) => (
              <Fragment key={step}>
                <span className={`s ${i < 3 ? "partner" : "google"}`}>{step}</span>
                {i < vc.flow.length - 1 ? <ArrowRight className="arrow" size={16} aria-hidden="true" /> : null}
              </Fragment>
            ))}
          </div>
          <p className="k-small k-muted" style={{ marginTop: 10 }}>
            {vc.flowNote}
          </p>
          <div className="k-grid k-g4" style={{ marginTop: 12 }}>
            {vc.plays.map((p) => (
              <div key={p.title}>
                <b style={{ fontSize: 14 }}>{p.title}</b>
                <p className="k-small" style={{ color: "var(--ink-2)", marginTop: 2 }}>{p.detail}</p>
              </div>
            ))}
          </div>
          <Src src={{ part: "main", slides: "28" }} basis={["stated"]} />
        </div>
      </Block>

      <Block>
        <Fig
          title={`How the cohort reaches ~${money(startups.fy27)}`}
          sub={`56 named + the 1K+ program = ~$174M; the 194-account long tail takes it to ~$203M. ${vc.funnelToday}`}
          src={[{ part: "main", slides: "12, 27" }, { part: "C", slides: "111" }]}
          basis={["stated", "estimate"]}
          table={<DataTable columns={["Tier", "FY27 AI ($M)", "Basis"]} numeric={[1]} rows={vc.funnel.map((f) => [f.tier, f.value, f.basis === "estimate" ? "Estimate (tier split)" : "Stated"])} total={["Cohort total", 203, ""]} />}
        >
          <HBars
            rows={vc.funnel.map((f, i) => ({
              key: f.tier,
              label: f.tier,
              sub: f.basis === "estimate" ? "Tier split est." : i === 4 ? "Partner-led (Megazone, Bespin)" : i < 2 ? "Named, direct" : "Named, via VC clinics",
              value: f.value,
              color: "var(--acquire)",
              valueLabel: `~${money(f.value)}`,
              tip: (
                <>
                  <b>~{money(f.value)}</b>
                  <div className="mut">{f.tier}</div>
                </>
              ),
            }))}
          />
        </Fig>
        <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
          {vc.tier1}{" "}
          <button type="button" className="k-pill" onClick={() => openCohort("startups", "accounts")}>
            See the 23 Tier-1 targets
          </button>
        </p>
      </Block>

      <Block title="Competitors run startups as a vertical" sub={vc.benchmark.soWhat}>
        <DataTable columns={vc.benchmark.columns} rows={vc.benchmark.rows} wrapCols={[1, 2, 3]} />
        <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
          <b>Implication:</b> {vc.benchmark.implication}
        </p>
        <Src src={{ part: "main", slides: "28, 30" }} basis={["directional"]} extra={<span>{vc.benchmark.note} The ~40 AWS headcount itemizes to 27 on the slide.</span>} />
      </Block>

      <Block title="The first two investor partners">
        <div className="k-grid k-g2">
          {vc.investors.map((inv) => (
            <div className="k-card" key={inv.name}>
              <h4>{inv.status}</h4>
              <h3 style={{ marginTop: 2 }}>{inv.name}</h3>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {inv.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Src src={{ part: "main", slides: "28" }} basis={["stated", "to-confirm", "proposed"]} />
      </Block>

      <Block title="The 90-day plan (Q4 '26)" sub="Proposed targets: 5 diagnostics by December; portfolio screen and first office hour in Q4.">
        <div className="k-grid k-g3">
          {vc.plan90.map((m) => (
            <div className="k-card flat" key={m.month}>
              <h4>{m.month}</h4>
              <ul className="k-list tight" style={{ marginTop: 10 }}>
                {m.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Src src={{ part: "main", slides: "28, 30" }} basis={["proposed"]} />
      </Block>

      <Block title="Three asks to scale the engine" sub={vc.status}>
        <div className="k-grid k-g3">
          {vc.asks.map((a) => (
            <div className="k-decision" key={a.title}>
              <h3>{a.title}</h3>
              <p style={{ fontWeight: 650, color: "var(--ink)" }}>Net-new headcount: {a.netNew}</p>
              <p>
                <b>Decision:</b> {a.decision}
              </p>
              <p className="k-small k-muted">Today: {a.today}</p>
              <p className="k-small k-muted">
                Benchmark: {a.benchmark} <Tag basis="directional" />
              </p>
            </div>
          ))}
        </div>
        <div className="k-callout">{vc.inReturn}</div>
        <Details title="Where startup capital is moving" sub="four double-down micro-verticals, Tracxn 31 Aug 2026" className="k-exec-hide">
          <DataTable
            columns={["Micro-vertical", "Companies funded Jan–Aug '25 → '26", "Multiple", "2026 funding est. ($M)", "Tier-1 targets"]}
            numeric={[3, 4]}
            rows={vc.capital.map((c) => [c.mv, c.funded, c.multiple, c.usd, c.tier1])}
            total={["Four double-downs", "50 → 88", "1.8x", 433, 23]}
          />
          <p className="k-tfoot-note">{vc.capitalNote}</p>
          <Src src={{ part: "C", slides: "111" }} basis={["estimate"]} />
        </Details>
        <Src src={{ part: "main", slides: "29" }} basis={["stated", "to-confirm"]} />
      </Block>
    </Section>
  );
}
