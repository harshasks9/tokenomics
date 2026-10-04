"use client";

import { useSite } from "../context";
import { Block, Section, Src, Tag } from "../ui";
import { CompetitorFig, SignalsGrid, WalletFig } from "../blocks";
import { money } from "@/lib/korea-fy27/format";

export default function MarketSection() {
  const { model } = useSite();
  const { segments, totals, competitors, sizingMethods } = model.market;

  return (
    <Section
      id="market"
      num="02"
      label="Market"
      question="Is the market large enough to support the plan?"
      headline="Korea's AI wallet doubles from ~$1.3B to ~$2.6B. The market is there; the question is how much of it Google wins."
      lead="Korea is one of the most AI-intense markets in the world, and the money sits in four segments that buy differently. Digital Natives and Conglomerates & Enterprise are ~90% of the wallet, so each segment needs its own route to market."
    >
      <Block>
        <WalletFig />
      </Block>

      <Block title="Four segments, four buying patterns" sub="Google's share today and at plan sits on each card; the plan section shows how each share moves.">
        <div className="k-grid k-g4">
          {segments.map((s) => (
            <div className="k-card" key={s.id}>
              <h4>{s.short}</h4>
              <h3 style={{ marginTop: 2 }}>{s.name}</h3>
              <p style={{ marginTop: 8, fontSize: 26, fontWeight: 780, letterSpacing: "-0.02em" }}>
                {money(s.marketFY26, { approx: true })} <span className="k-muted" style={{ fontSize: 16, fontWeight: 600 }}>→ {money(s.marketFY27, { approx: true })}</span>
              </p>
              <p className="k-sub">{s.growthLabel} · {s.tokensPct}% tokens / {s.seatsPct}% seats</p>
              <ul className="k-list tight" style={{ marginTop: 12 }}>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="k-divider" style={{ margin: "14px 0 10px" }} />
              <p className="k-small">
                <b>Google:</b> {money(s.googleFY26)} · {s.shareFY26}% share today → {s.sharePlan}% at plan
              </p>
              <p className="k-small k-muted" style={{ marginTop: 4 }}>
                Sizing confidence: {s.confidence}
              </p>
            </div>
          ))}
        </div>
        <Src src={[{ part: "main", slides: "6" }, { part: "A", slides: "41, 45, 48" }]} basis={["estimate"]} />
      </Block>

      <Block title="Sized three independent ways" sub={totals.rule}>
        <div className="k-grid k-g3">
          {sizingMethods.map((m, i) => (
            <div className="k-card flat" key={m.name}>
              <h4>Method {String.fromCharCode(65 + i)}</h4>
              <h3 style={{ marginTop: 2 }}>{m.name}</h3>
              <p style={{ marginTop: 8, fontSize: 14, color: "var(--ink-2)" }}>{m.what}</p>
              <p className="k-small k-muted" style={{ marginTop: 8 }}>
                Data: {m.data}
              </p>
            </div>
          ))}
        </div>
        <div className="k-callout light">
          {totals.agreement} {totals.crossCheck}
          <small>
            In scope: {totals.inScope} Out of scope: {totals.outOfScope} {totals.projection} {totals.dataPoints} external data points. Football fields per segment are in the appendix.
          </small>
        </div>
        <Src src={[{ part: "main", slides: "7" }, { part: "A", slides: "42–44" }]} basis={["estimate"]} />
      </Block>

      <Block>
        <CompetitorFig />
        <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
          <Tag basis="directional" /> {competitors.soWhat}
        </p>
      </Block>

      <Block title="Signals that the demand is real">
        <SignalsGrid />
        <Src src={{ part: "A", slides: "41" }} basis={["stated"]} extra={<span>External sources as cited in the deck; not independently re-verified here.</span>} />
      </Block>
    </Section>
  );
}

