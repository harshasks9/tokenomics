"use client";

import { useEffect, useState } from "react";
import { NARRATIVE, SOURCES } from "@/lib/under-the-hood/data";
import Verdict from "./sections/Verdict";
import Numbers from "./sections/Numbers";
import Changes from "./sections/Changes";
import Growth from "./sections/Growth";
import Economics from "./sections/Economics";
import Infrastructure from "./sections/Infrastructure";
import Enterprise from "./sections/Enterprise";
import Agents from "./sections/Agents";
import Distribution from "./sections/Distribution";
import Moat from "./sections/Moat";
import { Surprises, Confirmations } from "./sections/Insights";
import Gaps from "./sections/Gaps";
import ScenarioLab from "./sections/ScenarioLab";
import Playbook from "./sections/Playbook";
import Sources from "./sections/Sources";

const SHORT: Record<string, string> = {
  verdict: "Verdict", numbers: "Numbers", changes: "What changed", growth: "Growth", economics: "Economics",
  infrastructure: "Infrastructure", enterprise: "Enterprise", agents: "Claude Code & agents", distribution: "Distribution",
  moat: "Moat matrix", surprises: "Surprises", confirmations: "Confirmations", gaps: "Gaps", scenarios: "Scenario lab",
  playbook: "Playbook", sources: "Sources",
};

export default function Site() {
  const [active, setActive] = useState("verdict");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const ids = NARRATIVE.sections.map((s) => s.id);
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = document.documentElement;
      setProgress(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
      const line = window.innerHeight * 0.3;
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) cur = id;
      }
      setActive(cur);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (frame) cancelAnimationFrame(frame); };
  }, []);
  useEffect(() => {
    const el = document.querySelector(`.uth-nav a[href="#${active}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  const { site } = NARRATIVE;
  return (
    <div className="uth-root">
      <header className="uth-mast">
        <div className="uth-wrap">
          <div className="uth-mast-top">
            <span><b>Industry intelligence</b> · Research cutoff {site.cutoff}</span>
            <span className="uth-hide-sm">Primary sources: <a href={SOURCES.s1.url} target="_blank" rel="noreferrer">S-1</a> · <a href={SOURCES.s1a.url} target="_blank" rel="noreferrer">S-1/A</a></span>
          </div>
          <div className="uth-hero">
            <div className="uth-eyebrow">The S-1 Teardown</div>
            <h1 className="uth-title">ANTHROPIC: <em>Under the Hood</em></h1>
            <p className="uth-subtitle">{site.subtitle.replace("The S-1 Teardown — ", "")}</p>
            <div className="uth-hero-meta">
              <span>{site.positioning}</span>
              <span>Built from the Oct 26 S-1 and Nov 2 S-1/A, verified line by line</span>
              <span>Not investment advice — an analysis of industry economics</span>
            </div>
            <a className="uth-gtm-callout" href="/under-the-hood/google-cloud-gtm">Companion brief: What it means for Google Cloud AI GTM →</a>
          </div>
        </div>
      </header>
      <nav className="uth-nav" aria-label="Sections">
        <div className="uth-wrap">
          <div className="uth-nav-inner">
            {NARRATIVE.sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} aria-current={active === s.id}><span>{s.n}</span>{SHORT[s.id]}</a>
            ))}
          </div>
        </div>
        <div className="uth-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      </nav>
      <main>
        <Verdict />
        <Numbers />
        <Changes />
        <Growth />
        <Economics />
        <Infrastructure />
        <Enterprise />
        <Agents />
        <Distribution />
        <Moat />
        <Surprises />
        <Confirmations />
        <Gaps />
        <ScenarioLab />
        <Playbook />
        <Sources />
      </main>
      <footer className="uth-foot">
        <div className="uth-wrap">
          <p style={{ margin: 0 }}><b>ANTHROPIC: UNDER THE HOOD</b> — {site.positioning} Research cutoff {site.cutoff}. Sources: {site.sources}</p>
          <p style={{ margin: "8px 0 0" }}>Every financial figure is drawn from the SEC filings and verified by automated checks (Section 16). Analytical scores, scenarios and inferences are labelled as such. This is not investment advice and is not affiliated with Anthropic or any company discussed.</p>
        </div>
      </footer>
    </div>
  );
}
