"use client";

import { useSite } from "./context";
import { DataTable, Fig, MOTION_COLOR, Src, Tag, TipRow } from "./ui";
import { Dumbbell, HBars } from "./charts";
import { billions, money } from "@/lib/korea-fy27/format";
import type { MotionId } from "@/lib/korea-fy27/types";

/** Blocks shared by the full plan and the flow version. */

/** $226M × market 2x × share 2x = ~$900M. */
export function EquationStrip() {
  const h = useSite().model.headline;
  return (
    <div className="k-eq" role="group" aria-label="The equation: FY26 times market growth times share growth">
      <div className="term">
        <span>Google AI, FY26</span>
        <b>{money(h.fy26Ai)}</b>
        <small>of {money(h.gcpFY26)} GCP</small>
      </div>
      <div className="op" aria-hidden="true">×</div>
      <div className="term" data-op="×">
        <span>Market grows</span>
        <b>{h.marketMultiple}x</b>
        <small>
          {billions(h.marketFY26, { approx: true })} → {billions(h.marketFY27, { approx: true })}
        </small>
      </div>
      <div className="op" aria-hidden="true">×</div>
      <div className="term" data-op="×">
        <span>Share of wallet grows</span>
        <b>{h.shareMultiple}x</b>
        <small>
          {h.shareFY26}% → {h.shareFY27}%
        </small>
      </div>
      <div className="op" aria-hidden="true">=</div>
      <div className="term result" data-op="=">
        <span>Google AI, FY27</span>
        <b>~$900M</b>
        <small>{money(h.growth, { sign: true })} · ~4x</small>
      </div>
    </div>
  );
}

/** Given · Commit · Stretch · Upside: how sure ~$900M is. */
export function CertaintyLadder() {
  const { headline: h, ladder } = useSite().model;
  const scaleMax = 1200;
  const at = (v: number) => `${(v / scaleMax) * 100}%`;
  return (
    <div className="k-fig">
      <div className="k-ladder" aria-label="Base case ~$725M plus eight levers +$175M makes ~$900M; whales $100–300M are upside outside the plan; the organic floor is ~$305M">
        <div className="k-ladder-track">
          <div className="k-ladder-seg commit" style={{ left: 0, width: at(ladder.commit.value) }}>
            Commit ~$725M
          </div>
          <div className="k-ladder-seg stretch" style={{ left: at(ladder.commit.value), width: at(ladder.stretch.value) }}>
            <span className="k-seg-label">+$175M</span>
          </div>
          <div className="k-ladder-seg upside k-hatch" style={{ left: at(h.fy27Plan), width: at(ladder.upside.range[1]) }}>
            <span className="k-seg-label">Whales $100–300M</span>
          </div>
          <div className="k-ladder-mark" style={{ left: at(ladder.given.value), background: "var(--ink)" }}>
            <span style={{ color: "var(--ink)" }}>Organic floor ~$305M</span>
          </div>
        </div>
        <div className="k-ladder-axis" aria-hidden="true">
          <span style={{ left: "0%", transform: "none" }}>$0</span>
          <span style={{ left: at(ladder.commit.range[0]) }}>$650M</span>
          <span style={{ left: at(ladder.commit.range[1]) }}>$805M</span>
          <span style={{ left: at(h.fy27Plan), fontWeight: 700, color: "var(--ink)", top: 16 }}>~$900M plan</span>
          <span style={{ left: "100%", transform: "translateX(-100%)" }}>$1.2B</span>
        </div>
      </div>
      <div className="k-ladder-cards">
        <div className="k-ladder-card">
          <span className="k-step">{ladder.given.label}</span>
          <b>~{money(ladder.given.value)}</b>
          <p>
            <strong>{ladder.given.name}.</strong> {ladder.given.detail}
          </p>
        </div>
        <div className="k-ladder-card" style={{ borderColor: "var(--navy-ink)" }}>
          <span className="k-step">{ladder.commit.label}</span>
          <b>~{money(ladder.commit.value)}</b>
          <p>
            <strong>{ladder.commit.name}</strong> ({money(ladder.commit.range[0])}–{money(ladder.commit.range[1])}, {ladder.commit.multipleRange}). {ladder.commit.detail.replace(/ Range.*$/, "")}
          </p>
        </div>
        <div className="k-ladder-card">
          <span className="k-step">{ladder.stretch.label}</span>
          <b>+{money(ladder.stretch.value)}</b>
          <p>
            <strong>{ladder.stretch.name}.</strong> {ladder.stretch.detail}
          </p>
        </div>
        <div className="k-ladder-card">
          <span className="k-step">{ladder.upside.label}</span>
          <b>
            {money(ladder.upside.range[0])}–{money(ladder.upside.range[1])}
          </b>
          <p>
            <strong>{ladder.upside.name}.</strong> {ladder.upside.detail}
          </p>
        </div>
      </div>
      <Src src={{ part: "main", slides: "3" }} basis={["stated"]} extra={<span>Line of sight today: Samsung ~59% · big AI spenders ~38% · new logos ~4% · public &amp; EDU ~1%.</span>} />
    </div>
  );
}

/** The three motions as cards, in the order given. */
export function MotionCards({ order }: { order?: MotionId[] }) {
  const { motions } = useSite().model.plan;
  const list = order ? order.map((id) => motions.find((m) => m.id === id)!) : motions;
  return (
    <div className="k-grid k-g3">
      {list.map((m) => (
        <div className="k-motion" key={m.id} style={{ ["--c" as string]: MOTION_COLOR[m.id] }}>
          <div className="name">
            <span>{m.name}</span>
            <span className="k-tag">{m.muscle}</span>
          </div>
          <div className="amt">
            +{money(m.added)}
            <small>{m.sharePct}% of growth</small>
          </div>
          <p>{m.tagline}</p>
          <p className="who">{m.appliesTo}</p>
        </div>
      ))}
    </div>
  );
}

/** People · money · cross-team, one card each. */
export function DecisionCards() {
  const { asks } = useSite().model;
  return (
    <div className="k-grid k-g3">
      {asks.items.map((a) => (
        <div className="k-decision" key={a.id}>
          <span className="n">{a.num}</span>
          <h3>
            {a.name}: {a.headline.toLowerCase()}
          </h3>
          <p>{a.decision}</p>
          <span>
            <Tag basis={a.decisionBasis} />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Korea AI wallet by segment, FY26 → FY27, with its table twin. */
export function WalletFig() {
  const { segments, totals } = useSite().model.market;
  const fy26Sum = segments.reduce((s, x) => s + x.marketFY26, 0);
  const fy27Sum = segments.reduce((s, x) => s + x.marketFY27, 0);
  return (
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
    </Fig>  );
}

/** What vendors earn in Korea today: directional field intel. */
export function CompetitorFig() {
  const { competitors } = useSite().model.market;
  return (
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
    </Fig>  );
}

/** External signals that the demand is real. */
export function SignalsGrid() {
  const { signals } = useSite().model.market;
  return (
    <div className="k-grid k-g5">
      {signals.map((s) => (
        <div className="k-card flat k-stat" key={s.label}>
          <span className="v" style={{ fontSize: 30 }}>{s.value}</span>
          <span className="d">{s.label}</span>
          <span className="k-small k-muted">{s.note}</span>
        </div>
      ))}
    </div>  );
}
