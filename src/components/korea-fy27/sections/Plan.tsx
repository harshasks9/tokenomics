"use client";

import { useSite } from "../context";
import { Block, DataTable, Fig, MOTION_COLOR, Section, Src } from "../ui";
import { Dumbbell, Waterfall } from "../charts";
import Equation from "../plan/Equation";
import MotionBridge from "../plan/MotionBridge";
import LeverBridge from "../plan/LeverBridge";
import TopAccounts from "../plan/TopAccounts";
import { money } from "@/lib/korea-fy27/format";

export default function PlanSection() {
  const { model } = useSite();
  const { marketVsShare: mvs, headline: h, plan } = model;
  const { motionMix } = plan;

  return (
    <Section
      id="plan"
      num="04"
      label="The plan"
      question="Where does the +$675M come from?"
      exec
      headline="Market growth carries us to ~$435M. The other ~$465M has to be won as share, through three motions and eight levers."
      lead="The plan reads in four steps: the equation that makes ~$900M plausible, what the market gives us versus what we must win, where the +$675M lands by motion and segment, and how much of it is base case versus levers."
    >
      <Block title="1 · Why ~$900M is plausible but not automatic">
        <Equation />
      </Block>

      <Block>
        <div className="k-grid k-g2">
          <Fig
            title="What the market gives us vs what we must win"
            sub="Hold today's share in every segment and FY26 grows with each segment's TAM. Everything above that is share gain."
            src={{ part: "A", slides: "45, 49" }}
            basis={["stated"]}
            note={`${mvs.note} The deck also shows an "organic floor" of ~$305M (FY26 × 1.35, market growth ~35%) on slide 3. The two floors use different market-growth assumptions; both are shown, neither is reconciled in the deck.`}
            table={
              <DataTable
                columns={["Step", "$M", "Meaning"]}
                numeric={[1]}
                rows={[
                  ["FY26 actual", 226, "Year to date + run-rate"],
                  ["Market growth", "+209", "FY26 × segment TAM growth (hold share) = ~$435M"],
                  ["Share gain", "+465", `${mvs.dnShareOfGain}% of it in Digital Natives`],
                ]}
                total={["FY27 plan", "~900", "~4x"]}
              />
            }
          >
            <Waterfall
              height={240}
              steps={[
                { key: "fy26", label: "FY26", value: 226, kind: "start", color: "var(--navy-ink)", valueLabel: "$226M", ariaLabel: "FY26 $226M", tip: <><b>$226M</b><div className="mut">FY26 actual</div></> },
                { key: "mkt", label: "Market growth", sub: "hold today's share", value: mvs.marketGrowth, kind: "add", color: "var(--context)", valueLabel: `+$${mvs.marketGrowth}M`, ariaLabel: "Market growth plus $209M", tip: <><b>+${mvs.marketGrowth}M</b><div className="mut">Hold share: FY26 × segment TAM growth gets ~${mvs.holdShare}M</div></> },
                { key: "gain", label: "Share gain", sub: `${mvs.dnShareOfGain}% in DN`, value: mvs.shareGain, kind: "add", color: "var(--deepen)", valueLabel: `+$${mvs.shareGain}M`, ariaLabel: "Share gain plus $465M", tip: <><b>+${mvs.shareGain}M</b><div className="mut">Must be won as share; ~73% in Digital Natives</div></> },
                { key: "fy27", label: "FY27 plan", value: 900, kind: "end", color: "var(--navy-ink)", valueLabel: "~$900M", ariaLabel: "FY27 plan about $900M", tip: <><b>~$900M</b><div className="mut">~34% of FY27 TAM</div></> },
              ]}
            />
          </Fig>
          <Fig
            title="Every pillar must gain share"
            sub="Google share of each segment's wallet, FY26 → FY27 at plan. Digital Natives carry ~73% of the share gain."
            src={{ part: "A", slides: "45, 49" }}
            basis={["stated"]}
            table={
              <DataTable
                columns={["Segment", "Share FY26", "TAM growth", "Share at plan", "Change", "FY27 plan"]}
                numeric={[5]}
                rows={model.market.segments.map((s) => [s.name, `${s.shareFY26}%`, `${s.tamGrowth}x`, `${s.sharePlan}%`, `+${s.sharePlan - s.shareFY26} pts`, money(s.planFY27, { approx: true })])}
                total={["Total", "17%", "2.0x", "34%", "+17 pts", "~$900M"]}
              />
            }
          >
            <Dumbbell
              max={42}
              fromName="Share FY26"
              toName="Share at FY27 plan"
              rows={model.market.segments.map((s) => ({
                key: s.id,
                label: s.name,
                sub: `TAM ${s.tamGrowth}x · plan ${money(s.planFY27, { approx: true })}`,
                from: s.shareFY26,
                to: s.sharePlan,
                fromLabel: `${s.shareFY26}%`,
                toLabel: `${s.sharePlan}%`,
                tip: (
                  <>
                    <b>
                      {s.shareFY26}% → {s.sharePlan}%
                    </b>
                    <div className="mut">
                      {s.name}: +{s.sharePlan - s.shareFY26} pts; plan is {s.planPctOfTam} of FY27 TAM across the range
                    </div>
                  </>
                ),
              }))}
            />
          </Fig>
        </div>
      </Block>

      <Block title="2 · Three motions across four segments" sub={`Three cohorts carry ~70% of the growth: big existing AI spenders, AI startups and Samsung. Digital Natives carry +$449M, about two-thirds.`}>
        <MotionBridge />
        <div className="k-grid k-g2" style={{ marginTop: 14 }}>
          <div className="k-card flat">
            <h4>The mix has to change</h4>
            <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
              {[
                { name: "FY26 actual", parts: [{ id: "deepen", v: motionMix.fy26DeepenPct, label: "Deepen 87%" }, { id: "rest", v: 100 - motionMix.fy26DeepenPct, label: "Penetrate + Acquire 13%" }] },
                { name: "FY27 plan", parts: plan.motions.map((m) => ({ id: m.id, v: m.sharePct, label: `${m.name} ${m.sharePct}%` })) },
              ].map((bar) => (
                <div key={bar.name}>
                  <div className="k-small" style={{ fontWeight: 650, marginBottom: 4 }}>{bar.name}</div>
                  <div style={{ display: "flex", gap: 2, height: 22, borderRadius: 5, overflow: "hidden" }}>
                    {bar.parts.map((p) => (
                      <span key={p.id} title={p.label} style={{ width: `${p.v}%`, background: p.id === "rest" ? "var(--context)" : MOTION_COLOR[p.id as "deepen"], color: p.id === "deepen" ? "#fff" : "var(--ink)", fontSize: 11.5, fontWeight: 750, display: "flex", alignItems: "center", paddingLeft: 6, whiteSpace: "nowrap", overflow: "hidden" }}>
                        {p.v >= 18 ? p.label : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
              {motionMix.note} The FY26 split between Penetrate and Acquire is not labelled in the deck.
            </p>
          </div>
          <div className="k-card flat">
            <h4>Acquire has two different jobs</h4>
            <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
              {motionMix.acquireSplit.map((a) => (
                <div key={a.label} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 12, alignItems: "baseline" }}>
                  <b style={{ fontSize: 24, letterSpacing: "-0.02em" }}>+{money(a.value)}</b>
                  <span>
                    <span style={{ fontWeight: 650 }}>{a.label}</span>
                    <span className="k-small k-muted" style={{ display: "block" }}>{a.who}</span>
                  </span>
                </div>
              ))}
            </div>
            <p className="k-small" style={{ marginTop: 10, color: "var(--ink-2)" }}>
              Same customers will not get us to 4x: sell more to existing customers, convert GCP into AI and land new buyers at the same time.
            </p>
          </div>
        </div>
        <Src src={{ part: "main", slides: "11" }} basis={["stated"]} />
      </Block>

      <Block title="3 · Base case, levers and upside" sub={`~$725M base case + eight levers (+$175M) = ~$900M plan of record. Whales stay upside. ${h.multipleLabel} needs every lever.`}>
        <LeverBridge />
      </Block>

      <Block title="4 · Named accounts: what the top 13 cover">
        <TopAccounts />
      </Block>
    </Section>
  );
}
