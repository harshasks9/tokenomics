"use client";

import { ArrowRight } from "lucide-react";
import { useSite } from "../context";
import { Block, Section, Src } from "../ui";
import { CertaintyLadder, DecisionCards, EquationStrip } from "../blocks";
import { money } from "@/lib/korea-fy27/format";
import type { FlowModel } from "@/lib/korea-fy27/flow";

export default function FlowSummary({ flow }: { flow: FlowModel }) {
  const { model } = useSite();
  const h = model.headline;
  const mvs = model.marketVsShare;
  const added = (id: string) => model.plan.motions.find((m) => m.id === id)?.added ?? 0;
  const startups = model.cohorts.find((c) => c.id === "startups");
  const target = model.resourcing.snapshots.find((s) => s.id === "target");

  const steps = [
    { href: "#f-insights", n: "2", title: "Market intel", text: `Korea's AI wallet doubles, ${model.market.totals.fy26Label} → ${model.market.totals.fy27Label}. We hold ${h.shareFY26}% of it today.` },
    { href: "#f-takeaways", n: "3", title: "GTM takeaways", text: `Market growth takes us to ~${money(mvs.holdShare)}. The other ~${money(mvs.shareGain)} has to be won as share.` },
    { href: "#f-motions", n: "4", title: "Three motions", text: `Acquire +${money(added("acquire"))} · Deepen +${money(added("deepen"))} · Penetrate +${money(added("penetrate"))}.` },
    { href: "#f-verticals", n: "5", title: "Five verticals", text: `Three Digital Native and two conglomerate verticals carry +${money(flow.reconciliation.verticalsAdded)} of the +${money(h.growth)}.` },
    { href: "#f-startups", n: "6", title: "Startup engine", text: `~${money(model.vc.vcLed)} of the startups' FY27 runs through investors; line of sight is ~${startups?.losPct}% today.` },
    { href: "#f-q4", n: "7", title: "Q4 plan", text: `Staff to ${target?.aiSs} AI SS · ${target?.aiCe} AI CE · ${target?.fde.split(" ")[0]} FDE · ${target?.vcbd} VCBD, train on the six plays, pre-approve pricing.` },
    { href: "#f-accountability", n: "8", title: "Accountability", text: "One owner, one $ target and one quarterly run-rate KPI per cohort." },
    { href: "#f-asks", n: "9", title: "Asks & follow-ups", text: `Three decisions today: people, money and cross-team. ${flow.followUps.length} items the deck leaves open.` },
  ];

  return (
    <Section
      id="f-summary"
      num="1"
      label="Executive summary"
      question="What is the plan, and what do we need?"
      exec
      top={
        <div className="k-hero">
          <p className="k-hero-top">
            <span>Korea AI · FY27 plan · flow version</span>
            <span>Executive review · {model.meta.date}</span>
            <span className="k-conf">{model.meta.status}</span>
          </p>
          <div className="k-hero-num">
            <b>~$900M</b>
            <span>
              Google AI in FY27 <em>· ~4x FY26&rsquo;s $226M</em>
            </span>
          </div>
        </div>
      }
      headline={h.oneLiner}
      lead="This version follows the review flow, from market intel to the asks. Every number is the one in the full plan."
    >
      <EquationStrip />
      <Src src={{ part: "main", slides: "3–4" }} basis={["stated"]} />

      <Block title="The flow at a glance" sub="One line per step. Select a step to go to it.">
        <div className="k-steps">
          {steps.map((s) => (
            <a className="k-step-card" href={s.href} key={s.href}>
              <span className="n">{s.n}</span>
              <b>{s.title}</b>
              <span className="t">{s.text}</span>
            </a>
          ))}
        </div>
      </Block>

      <Block title="How sure is ~$900M? Given · Commit · Stretch · Upside" sub="The plan is not simply $226M × 4. It is a base case plus eight sized levers; the whales sit outside it.">
        <CertaintyLadder />
      </Block>

      <Block
        title="Three decisions today"
        sub={
          <a className="k-nowrap" href="#f-asks">
            Asks & follow-ups <ArrowRight size={12} style={{ verticalAlign: "-2px" }} />
          </a>
        }
      >
        <DecisionCards />
        <Src src={{ part: "main", slides: "3, 38" }} />
      </Block>
    </Section>
  );
}
