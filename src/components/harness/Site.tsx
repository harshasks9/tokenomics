"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Eye } from "lucide-react";
import type { Lens } from "@/lib/harness/types";
import { KEY_SOURCES, RESEARCH_DATE, FRESHNESS_NOTE } from "@/lib/harness/sources";
import { SectionHeader, Idea, Seller, LENS_LABEL } from "./ui";
import StackDiagram from "./StackDiagram";
import CapabilityExplorer from "./CapabilityExplorer";
import EvidencePanel from "./EvidencePanel";
import WorkloadSelector from "./WorkloadSelector";
import Landscape from "./Landscape";
import BuildVsBuy from "./BuildVsBuy";
import PairExplorer from "./PairExplorer";
import GoogleMap from "./GoogleMap";
import EconomicsLab from "./EconomicsLab";
import RefArchGallery from "./RefArchGallery";
import Readiness from "./Readiness";

const NAV = [
  { id: "s01", label: "The System" },
  { id: "s02", label: "The Harness" },
  { id: "s03", label: "Inside" },
  { id: "s04", label: "Evidence" },
  { id: "s05", label: "Workloads" },
  { id: "s06", label: "Landscape" },
  { id: "s07", label: "Build vs Buy" },
  { id: "s08", label: "Pairing" },
  { id: "s09", label: "Google" },
  { id: "s10", label: "Economics" },
  { id: "s11", label: "Architectures" },
  { id: "s12", label: "Readiness" },
];

const EQ_TERMS: { id: string; t: string; s: string; note: string }[] = [
  {
    id: "model",
    t: "Model",
    s: "the intelligence",
    note: "Necessary, not sufficient. The same frontier model scores measurably differently depending on everything to its right.",
  },
  {
    id: "harness",
    t: "Harness",
    s: "the operating system",
    note: "Context, tools, memory, orchestration, permissions, verification, recovery, cost control — the multiplier this site is about.",
  },
  {
    id: "context",
    t: "Context",
    s: "what it knows",
    note: "Your data, assembled per step under an attention budget. Two context strategies on one model produce two different products.",
  },
  {
    id: "tools",
    t: "Tools",
    s: "what it can do",
    note: "The verbs. An agent's usefulness — and its blast radius — is the tool surface the harness grants and governs.",
  },
  {
    id: "env",
    t: "Environment",
    s: "where it runs",
    note: "Sandboxes, identity, networks, data boundaries. The environment decides what failure costs.",
  },
];

export default function Site() {
  const [lens, setLens] = useState<Lens>("architect");
  const [sellerOn, setSellerOn] = useState(false);
  const [activeNav, setActiveNav] = useState("s01");
  const [eqSel, setEqSel] = useState("harness");
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveNav(e.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sectionsRef.current?.querySelectorAll("section[id]").forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const eqNote = EQ_TERMS.find((t) => t.id === eqSel)!.note;

  return (
    <div>
      {/* ---------- top bar ---------- */}
      <div className="hx-topbar">
        <div className="hx-topbar-in">
          <a className="hx-brand" href="#s01" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            HARNESS<em>CHOICE</em>
          </a>
          <nav className="hx-nav" aria-label="Sections">
            {NAV.map((n) => (
              <button key={n.id} className={activeNav === n.id ? "on" : ""} onClick={() => jump(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
          <div className="hx-lens" role="tablist" aria-label="Audience lens">
            {(["exec", "architect", "developer"] as Lens[]).map((l) => (
              <button key={l} className={lens === l ? "on" : ""} onClick={() => setLens(l)} role="tab" aria-selected={lens === l}>
                {LENS_LABEL[l]}
              </button>
            ))}
          </div>
          <button className={`hx-seller-toggle ${sellerOn ? "on" : ""}`} onClick={() => setSellerOn((s) => !s)}>
            <Eye size={13} />
            Seller
          </button>
        </div>
      </div>

      {/* ---------- hero / §01 ---------- */}
      <header className="hx-hero" id="s01">
        <div className="hx-hero-grid" />
        <div className="hx-wrap" style={{ position: "relative" }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="hx-hero-tag">
              <span className="dot" />
              An architecture conversation · research snapshot {RESEARCH_DATE}
            </div>
            <h1 className="hx-h1 hx-display">
              Models aren&apos;t the whole system.
              <br />
              <span className="dim">You&apos;re also choosing a</span> <span className="hl">harness</span>
              <span className="dim">.</span>
            </h1>
            <p className="hx-hero-lede">
              The industry has spent two years comparing models. Meanwhile, two applications running the{" "}
              <strong>same model</strong> deliver measurably different outcomes — different success rates, different
              costs, different failure modes — because of the system wrapped around it.{" "}
              <strong>That system now has a name, a discipline, and a market.</strong> This is a framework for choosing
              yours.
            </p>

            <div className="hx-equation" role="group" aria-label="Outcome equation">
              {EQ_TERMS.map((t, i) => (
                <span key={t.id} style={{ display: "contents" }}>
                  {i > 0 && <span className="hx-eq-op">×</span>}
                  <button
                    className={`hx-eq-term ${eqSel === t.id ? "on" : ""}`}
                    onClick={() => setEqSel(t.id)}
                    style={{ appearance: "none", font: "inherit", color: "inherit" }}
                  >
                    <span className="t">{t.t}</span>
                    <span className="s">{t.s}</span>
                  </button>
                </span>
              ))}
              <span className="hx-eq-op">=</span>
              <span className="hx-eq-term hx-eq-out" role="presentation">
                <span className="t">Outcome</span>
                <span className="s">reliable work</span>
              </span>
            </div>
            <div className="hx-eq-note">{eqNote}</div>

            <div style={{ marginTop: 34 }}>
              <button className="hx-hero-scroll" onClick={() => jump("s02")}>
                Start with the boundary <ChevronDown size={15} />
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      <div ref={sectionsRef}>
        {/* ---------- §02 ---------- */}
        <section className="hx-section" id="s02">
          <div className="hx-wrap">
            <SectionHeader
              num="02"
              label="Definition"
              title="What is a harness?"
              lede={
                <>
                  Between the application your users see and the model you rent sits a layer most architecture diagrams
                  leave blank. Microsoft now ships a product called an <strong>Agent Harness</strong>; OpenAI named the
                  discipline <strong>harness engineering</strong>; Anthropic&apos;s Agent SDK <em>is</em> one. Click
                  each layer to place the boundary.
                </>
              }
            />
            <StackDiagram lens={lens} sellerOn={sellerOn} />
            <Idea>
              The model provides intelligence. The harness determines how that intelligence operates. The application
              determines where it creates value.
            </Idea>
            <Seller sectionId="s02" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §03 ---------- */}
        <section className="hx-section" id="s03">
          <div className="hx-wrap">
            <SectionHeader
              num="03"
              label="Taxonomy"
              title="Inside the harness: eleven capabilities"
              lede={
                <>
                  A production-grade harness answers eleven questions — from <em>what does the model need to know?</em>{" "}
                  to <em>what does a successful task cost?</em> Every team that ships an agent answers all eleven,
                  deliberately or by accident. Explore each layer at your altitude.
                </>
              }
            />
            <CapabilityExplorer lens={lens} />
            <Idea>
              Your teams are already answering these eleven questions — one improvised answer per team. Harness choice
              is deciding which answers become shared infrastructure.
            </Idea>
            <Seller sectionId="s03" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §04 ---------- */}
        <section className="hx-section" id="s04">
          <div className="hx-wrap">
            <SectionHeader
              num="04"
              label="Evidence"
              title="Same model, different harness, different outcome"
              lede={
                <>
                  This stopped being a hunch in 2026: benchmarks now score <strong>model + harness pairs</strong>, and a
                  cluster of research measured what happens when you hold the model constant and swap only the harness.
                  The exhibits below carry their sources and their caveats.
                </>
              }
            />
            <EvidencePanel />
            <Idea>
              A model benchmark that doesn&apos;t disclose its harness is quoting a different test — and a
              cost-per-token comparison that ignores harness efficiency can be wrong by an order of magnitude.
            </Idea>
            <Seller sectionId="s04" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §05 ---------- */}
        <section className="hx-section" id="s05">
          <div className="hx-wrap">
            <SectionHeader
              num="05"
              label="Workloads"
              title="Choose your workload — watch the requirements move"
              lede={
                <>
                  &quot;Which harness?&quot; is a workload question before it is a vendor question. Coding lives on
                  verification loops; enterprise search lives on identity-aware retrieval; business process agents need
                  nearly everything at full strength. Select a workload to see which capabilities carry it.
                </>
              }
            />
            <WorkloadSelector />
            <Idea>
              Workloads disagree about what matters. A single enterprise harness standard either over-constrains your
              easy workloads or under-protects your hard ones — standardize the control plane, vary the harness.
            </Idea>
            <Seller sectionId="s05" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §06 ---------- */}
        <section className="hx-section" id="s06">
          <div className="hx-wrap">
            <SectionHeader
              num="06"
              label="Landscape"
              title="Six philosophies of the harness"
              lede={
                <>
                  The major ecosystems are not interchangeable products with different logos — they occupy different
                  layers and encode different bets. Facts below are sourced; interpretation is labeled as ours.
                  Snapshot: {RESEARCH_DATE}.
                </>
              }
            />
            <Landscape />
            <Idea>
              Don&apos;t ask &quot;which vendor wins.&quot; Ask which layers each vendor wants to own, and whether that
              matches the layers you want to keep.
            </Idea>
            <Seller sectionId="s06" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §07 ---------- */}
        <section className="hx-section" id="s07">
          <div className="hx-wrap">
            <SectionHeader
              num="07"
              label="Sourcing"
              title="Build, framework, platform — or borrow a specialist"
              lede={
                <>
                  &quot;Should we build our own harness?&quot; is really eleven questions wearing one coat. Four
                  sourcing postures dominate; none is universally right. Compare their trade-offs, then open the full
                  evaluation checklist.
                </>
              }
            />
            <BuildVsBuy />
            <Idea>
              Build the loop only where it differentiates you. Buy identity, observability and policy everywhere. And
              when a workload has a world-class dedicated harness — coding — adopt it under shared governance instead
              of rebuilding it worse.
            </Idea>
            <Seller sectionId="s07" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §08 ---------- */}
        <section className="hx-section" id="s08">
          <div className="hx-wrap">
            <SectionHeader
              num="08"
              label="Pairing"
              title="Model + harness: evaluate the pair, plan the divorce"
              lede={
                <>
                  The frontier is re-fusing model and harness — vendors now train models <em>inside</em> their own
                  harnesses — while the middle of the market goes model-agnostic. Pick your posture on each axis and see
                  what the combination commits you to. Then: the six forms of portability, honestly.
                </>
              }
            />
            <PairExplorer />
            <Idea>
              Evaluate models together with their harnesses — that pair is what you actually deploy. Then engineer your
              exit paths deliberately: portability is six different properties, and only some of them are cheap.
            </Idea>
            <Seller sectionId="s08" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §09 ---------- */}
        <section className="hx-section" id="s09">
          <div className="hx-wrap">
            <SectionHeader
              num="09"
              label="Google Cloud"
              title="The harness stack, mapped to Google Cloud"
              lede={
                <>
                  Requirement first, product second: each of the eleven capabilities, Google&apos;s architectural
                  approach to it, and the services involved — including where third-party models, open frameworks and
                  custom harnesses are first-class citizens rather than workarounds.
                </>
              }
            />
            <GoogleMap />
            <Idea>
              The question isn&apos;t &quot;does Google have an agent product&quot; — everyone does. It&apos;s whether
              you can adopt the layers you need, keep the layers you have, and swap the layers you&apos;ll regret. Open
              seams are the differentiator.
            </Idea>
            <Seller sectionId="s09" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §10 ---------- */}
        <section className="hx-section" id="s10">
          <div className="hx-wrap">
            <SectionHeader
              num="10"
              label="Economics"
              title="The cheapest model is not the cheapest task"
              lede={
                <>
                  Procurement compares dollars per million tokens. Production pays for context re-sent every turn, cache
                  misses, extra turns, retries and failures. Move the sliders — the interesting moment is when the
                  cheaper-per-token profile loses on cost per successful task.
                </>
              }
            />
            <EconomicsLab />
            <Idea>
              Buy outcomes, not tokens: cost per successful task — across turns, retries and cache economics — is the
              metric that survives contact with production.
            </Idea>
            <Seller sectionId="s10" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §11 ---------- */}
        <section className="hx-section" id="s11">
          <div className="hx-wrap">
            <SectionHeader
              num="11"
              label="Patterns"
              title="Reference architectures"
              lede={
                <>
                  Four hypothetical but realistic enterprise patterns. Each flow highlights which harness capabilities
                  do the heavy lifting — the boxes that turn a demo into a system you can audit, afford and trust.
                </>
              }
            />
            <RefArchGallery />
            <Idea>
              In every one of these diagrams the model is one box. The reliability, the safety and the economics live in
              the boxes around it.
            </Idea>
            <Seller sectionId="s11" on={sellerOn} />
          </div>
        </section>

        {/* ---------- §12 ---------- */}
        <section className="hx-section" id="s12">
          <div className="hx-wrap">
            <SectionHeader
              num="12"
              label="Assessment"
              title="Where does your harness stand today?"
              lede={
                <>
                  Eleven questions, four maturity levels each. Score your current architecture honestly — the profile on
                  the right shows where you&apos;re engineered and where you&apos;re improvising. Nothing you click
                  leaves this page.
                </>
              }
            />
            <Readiness />
            <Idea>
              You&apos;ve been deciding which model to standardize on. You should also be deciding what harness
              architecture you&apos;re standardizing around — and this profile is where that conversation starts.
            </Idea>
            <Seller sectionId="s12" on={sellerOn} />
          </div>
        </section>
      </div>

      {/* ---------- footer ---------- */}
      <footer className="hx-footer">
        <div className="hx-wrap">
          <div className="cols">
            <div>
              <h4>Sources &amp; snapshot</h4>
              <ul>
                {KEY_SOURCES.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.label}
                    </a>{" "}
                    · {s.date} — {s.note}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>About this site</h4>
              <p>
                A conversation tool for architecture discussions about AI harness choice — built to be shown on a
                screen, argued with, and revisited. Use the lens switch for your audience; Seller mode adds discovery
                questions per section.
              </p>
              <p style={{ marginTop: 10 }}>
                Research snapshot: <strong style={{ color: "#fff" }}>{RESEARCH_DATE}</strong>
              </p>
            </div>
          </div>
          <div className="stamp">{FRESHNESS_NOTE}</div>
        </div>
      </footer>
    </div>
  );
}
