"use client";

import { useSite } from "../context";
import { Block, DataTable, Fig, Section, Src } from "../ui";
import { HBars } from "../charts";
import { money } from "@/lib/korea-fy27/format";

export default function BusinessSection() {
  const { model } = useSite();
  const { business, market } = model;

  return (
    <Section
      id="business"
      num="03"
      label="Our business"
      question="What did FY26 prove, and what is fragile about it?"
      headline="FY26 was a breakout year, but it was built on a handful of accounts and almost nothing new."
      lead="AI drove ~81% of GCP growth and grew from $50M to $226M. Almost all of it came from accounts already buying AI; Samsung alone was half. That proves demand, not repeatability."
    >
      <Block>
        <div className="k-grid k-g4">
          {business.kpis.map((k) => (
            <div className="k-card k-stat" key={k.label}>
              <span className="l">{k.label}</span>
              <span className="v">{k.value}</span>
              <span className="d">{k.note}</span>
            </div>
          ))}
        </div>
        <Src src={[{ part: "main", slides: "3, 9" }, { part: "B", slides: "83" }]} basis={["stated"]} />
      </Block>

      <Block>
        <div className="k-grid k-g2">
          <Fig
            title="Where FY26 AI growth came from"
            sub="Each bar is a share of FY26 AI growth on its own basis. They overlap and do not add to 100%."
            src={{ part: "main", slides: "3, 9" }}
            basis={["stated"]}
            note={business.growthSourcesNote}
            table={<DataTable columns={["Source of growth", "Share", "Basis"]} rows={business.growthSources.map((g) => [g.label, `${g.label === "New logos" ? "~" : ""}${g.pct}%`, g.basis])} />}
          >
            <HBars
              max={100}
              rows={business.growthSources.map((g) => ({
                key: g.label,
                label: g.label,
                sub: g.basis,
                value: g.pct,
                color: g.label === "New logos" ? "var(--risk-mark)" : "var(--deepen)",
                valueLabel: `${g.label === "New logos" || g.label.startsWith("AutoEver") ? "~" : ""}${g.pct}%`,
                tip: (
                  <>
                    <b>{g.pct}%</b>
                    <div className="mut">
                      {g.label} · {g.basis}
                    </div>
                  </>
                ),
              }))}
            />
          </Fig>

          <Fig
            title="Our share of each segment's wallet, FY26"
            sub="Bars show the share at the TAM midpoint; the lighter band is the range. 17% overall (14–22%)."
            src={{ part: "A", slides: "48" }}
            basis={["estimate"]}
            table={
              <DataTable
                columns={["Segment", "Google FY26", "Segment wallet (mid)", "Share", "Range"]}
                numeric={[1, 2]}
                rows={market.segments.map((s) => [s.name, money(s.googleFY26), money(s.midFY26, { approx: true }), `${s.shareFY26}%`, `${s.shareRange[0]}–${s.shareRange[1]}%`])}
                total={["Total", "$226M", "~$1.33B", "~17%", "14–22%"]}
              />
            }
          >
            <HBars
              max={35}
              rows={market.segments.map((s) => ({
                key: s.id,
                label: s.name,
                sub: `${money(s.googleFY26)} of ~${money(s.midFY26)}`,
                value: s.shareFY26,
                color: "var(--deepen)",
                valueLabel: `${s.shareFY26}%`,
                marker: s.shareRange[1],
                tip: (
                  <>
                    <b>{s.shareFY26}%</b>
                    <div className="mut">
                      {s.name}: range {s.shareRange[0]}–{s.shareRange[1]}% (tick marks the top of the range)
                    </div>
                  </>
                ),
              }))}
            />
          </Fig>
        </div>
      </Block>

      <Block title="What worked, what did not">
        <div className="k-grid k-g2">
          <div className="k-card">
            <h4 style={{ color: "var(--good)" }}>Worked</h4>
            <ul className="k-list good" style={{ marginTop: 10 }}>
              {business.worked.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
          <div className="k-card">
            <h4 style={{ color: "var(--risk)" }}>Did not</h4>
            <ul className="k-list risk" style={{ marginTop: 10 }}>
              {business.didnt.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
        <Src
          src={[business.src, business.srcDetail]}
          basis={["stated"]}
          extra={<span>Slide 9 lists Coupang under &ldquo;worked&rdquo;; slide 100 lists it as flat-ish. Both shown.</span>}
        />
        <div className="k-callout">{business.conclusion}</div>
      </Block>
    </Section>
  );
}
