"use client";

import { useSite } from "../context";
import { Block, DataTable, Fig, Section, Src, Tag, TipRow } from "../ui";
import { Dumbbell, HBars } from "../charts";
import { money } from "@/lib/korea-fy27/format";

export default function MarketSection() {
  const { model } = useSite();
  const { segments, totals, competitors, signals, sizingMethods } = model.market;
  const fy26Sum = segments.reduce((s, x) => s + x.marketFY26, 0);
  const fy27Sum = segments.reduce((s, x) => s + x.marketFY27, 0);

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
        <Fig
          title="Korea AI wallet by segment, FY26 → FY27 ($M, est.)"
          sub={`Segments sum to ${money(fy26Sum)} → ${money(fy27Sum)}; the deck rounds the headline to ${totals.fy26Label} → ${totals.fy27Label} (${totals.fy27AppendixLabel} in Appendix A). ${totals.tokensSeats}.`}
          src={[{ part: "main", slides: "6–7" }, { part: "A", slides: "43–44" }]}
          basis={["estimate"]}
          table={
            <DataTable
              columns={["Segment", "FY26 ($M)", "FY27 ($M)", "Growth", "FY26 TAM range", "FY27 TAM range", "Tokens / seats", "Confidence"]}
              numeric={[1, 2]}
              rows={segments.map((s) => [s.name, s.marketFY26, s.marketFY27, s.growthLabel, `$${s.tamFY26[0]}–${s.tamFY26[1]}M`, `$${s.tamFY27[0].toLocaleString()}–${s.tamFY27[1].toLocaleString()}M`, `${s.tokensPct} / ${s.seatsPct}`, s.confidence])}
              total={["Total", fy26Sum, fy27Sum, "~2.0x", `$${totals.fy26Range[0].toLocaleString()}–${totals.fy26Range[1].toLocaleString()}M`, `$${totals.fy27Range[0].toLocaleString()}–${totals.fy27Range[1].toLocaleString()}M`, "~65 / 35", ""]}
            />
          }
        >
          <Dumbbell
            fromName="FY26 market (est.)"
            toName="FY27 market (est.)"
            rows={segments.map((s) => ({
              key: s.id,
              label: s.name,
              sub: s.buyingPattern,
              from: s.marketFY26,
              to: s.marketFY27,
              fromLabel: money(s.marketFY26, { approx: true }),
              toLabel: money(s.marketFY27, { approx: true }),
              tip: (
                <>
                  <b>
                    {money(s.marketFY26, { approx: true })} → {money(s.marketFY27, { approx: true })}
                  </b>
                  <div className="mut">{s.name} · {s.growthLabel.toLowerCase()}</div>
                  <TipRow label="FY26 TAM range" value={`$${s.tamFY26[0]}–${s.tamFY26[1]}M`} />
                  <TipRow label="FY27 TAM range" value={`$${s.tamFY27[0].toLocaleString()}–${s.tamFY27[1].toLocaleString()}M`} />
                  <TipRow label="Confidence" value={s.confidence} />
                </>
              ),
            }))}
          />
        </Fig>
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
        <Fig
          title="Cross-check: what vendors earn in Korea today ($M, annual)"
          sub={`${competitors.totals.slide7} Anthropic is ${competitors.totals.anthropicVsGoogle} our spend on this intel.`}
          src={[{ part: "main", slides: "7" }, { part: "A", slides: "46" }]}
          basis={["directional", "placeholder"]}
          note={competitors.note}
          table={
            <DataTable
              columns={["Vendor", "Spend in Korea", "Share of ~$1.25B", "Basis", "Confidence"]}
              rows={competitors.rows.map((r) => [r.vendor, r.spendLabel, r.share, r.basis, r.confidence])}
              total={["Implied total", competitors.totals.implied, "100%", `Excl. open weight: ${competitors.totals.impliedExOpenWeight}`, ""]}
            />
          }
        >
          <HBars
            max={760}
            rows={competitors.rows.map((r) => ({
              key: r.vendor,
              label: r.vendor,
              sub: r.status === "placeholder" ? "Placeholder, not validated" : r.status === "directional" ? `Directional · ${r.confidence.toLowerCase()} confidence` : "Internal · high confidence",
              value: r.spend[0] === r.spend[1] ? r.spend[0] : undefined,
              range: r.spend[0] === r.spend[1] ? undefined : r.spend,
              color: r.isGoogle ? "var(--deepen)" : "var(--context)",
              hatch: r.status === "placeholder",
              valueLabel: r.spendLabel,
              tip: (
                <>
                  <b>{r.spendLabel}</b>
                  <div className="mut">
                    {r.vendor} · {r.share} of the intel-implied total
                  </div>
                  <div style={{ marginTop: 4 }}>{r.basis}</div>
                </>
              ),
            }))}
          />
        </Fig>
        <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
          <Tag basis="directional" /> {competitors.soWhat}
        </p>
      </Block>

      <Block title="Signals that the demand is real">
        <div className="k-grid k-g5">
          {signals.map((s) => (
            <div className="k-card flat k-stat" key={s.label}>
              <span className="v" style={{ fontSize: 30 }}>{s.value}</span>
              <span className="d">{s.label}</span>
              <span className="k-small k-muted">{s.note}</span>
            </div>
          ))}
        </div>
        <Src src={{ part: "A", slides: "41" }} basis={["stated"]} extra={<span>External sources as cited in the deck; not independently re-verified here.</span>} />
      </Block>
    </Section>
  );
}

