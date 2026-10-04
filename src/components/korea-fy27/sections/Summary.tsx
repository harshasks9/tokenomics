"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import { useSite } from "../context";
import { Section, Src } from "../ui";
import { CertaintyLadder, DecisionCards, EquationStrip, MotionCards } from "../blocks";

export default function SummarySection() {
  const { model } = useSite();
  const { headline: h, facts, fragility, plan } = model;

  return (
    <Section
      id="summary"
      num="01"
      label="Summary"
      question="What is the plan, and why does it matter?"
      exec
      top={
        <div className="k-hero">
          <p className="k-hero-top">
            <span>Korea AI · FY27 plan</span>
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
      lead="It starts with three decisions today: people, money and cross-team support."
    >
      <EquationStrip />
      <Src src={{ part: "main", slides: "3–4" }} basis={["stated"]} extra={<a href="#plan" className="k-small k-nowrap">Test the equation <ArrowRight size={12} style={{ verticalAlign: "-2px" }} /></a>} />

      <div className="k-block">
        <div className="k-block-title">
          <h3>Four facts from FY26</h3>
          <p>{h.fy26Definition}</p>
        </div>
        <div className="k-grid k-g4">
          {facts.map((f) => (
            <div className="k-card k-stat" key={f.label}>
              <span className="l">{f.label}</span>
              <span className="v">{f.headline}</span>
              <span className="d">{f.detail}</span>
            </div>
          ))}
        </div>
        <p className="k-src" style={{ color: "var(--risk)" }}>
          <TriangleAlert size={14} aria-hidden="true" style={{ flex: "none" }} />
          <span style={{ color: "var(--ink-2)" }}>{fragility.text}</span>
        </p>
        <div className="k-callout">
          {h.insight}
          <small>FY26 proved demand. FY27 must prove repeatability beyond Samsung and existing accounts.</small>
        </div>
      </div>

      <div className="k-block">
        <div className="k-block-title">
          <h3>How sure is ~$900M? Given · Commit · Stretch · Upside</h3>
          <p>The plan is not simply $226M × 4. It is a base case plus eight sized levers; the whales sit outside it.</p>
        </div>
        <CertaintyLadder />
      </div>

      <div className="k-block">
        <div className="k-block-title">
          <h3>Three motions create +$675M</h3>
          <p>{plan.motionMix.note}</p>
        </div>
        <MotionCards />
        <Src src={{ part: "main", slides: "4, 11" }} basis={["stated"]} extra={<span>Digital Natives carry two-thirds of the growth (+$449M).</span>} />
      </div>

      <div className="k-block">
        <div className="k-block-title">
          <h3>Three decisions today</h3>
          <a className="k-small k-nowrap" href="#asks">
            Decision panel <ArrowRight size={12} style={{ verticalAlign: "-2px" }} />
          </a>
        </div>
        <DecisionCards />
        <Src src={{ part: "main", slides: "3, 38" }} />
      </div>
    </Section>
  );
}
