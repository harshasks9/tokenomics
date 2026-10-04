"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import { useSite } from "../context";
import { MOTION_COLOR, Section, Src, Tag } from "../ui";
import { billions, money } from "@/lib/korea-fy27/format";

export default function SummarySection() {
  const { model } = useSite();
  const { headline: h, facts, fragility, ladder, plan, asks } = model;
  const scaleMax = 1200;
  const at = (v: number) => `${(v / scaleMax) * 100}%`;

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
      </div>

      <div className="k-block">
        <div className="k-block-title">
          <h3>Three motions create +$675M</h3>
          <p>{plan.motionMix.note}</p>
        </div>
        <div className="k-grid k-g3">
          {plan.motions.map((m) => (
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
        <Src src={{ part: "main", slides: "4, 11" }} basis={["stated"]} extra={<span>Digital Natives carry two-thirds of the growth (+$449M).</span>} />
      </div>

      <div className="k-block">
        <div className="k-block-title">
          <h3>Three decisions today</h3>
          <a className="k-small k-nowrap" href="#asks">
            Decision panel <ArrowRight size={12} style={{ verticalAlign: "-2px" }} />
          </a>
        </div>
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
        <Src src={{ part: "main", slides: "3, 38" }} />
      </div>
    </Section>
  );
}
