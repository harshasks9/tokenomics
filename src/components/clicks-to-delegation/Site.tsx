"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "@/lib/clicks-to-delegation/sections";
import { RESEARCH_DATE } from "@/lib/clicks-to-delegation/meta";
import { CitationLayer } from "./ui";
import Transition from "./sections/Transition";
import Timelines from "./sections/Timelines";
import Adoption from "./sections/Adoption";
import Cases from "./sections/Cases";
import Analogies from "./sections/Analogies";
import Ladder from "./sections/Ladder";
import Money from "./sections/Money";
import Gatekeepers from "./sections/Gatekeepers";
import Categories from "./sections/Categories";
import Geography from "./sections/Geography";
import Futures from "./sections/Futures";
import Playbook from "./sections/Playbook";
import Contrarian from "./sections/Contrarian";
import Insights from "./sections/Insights";
import Method from "./sections/Method";

type Mode = "summary" | "deep";

export default function Site() {
  const [mode, setMode] = useState<Mode>("deep");
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search).get("mode");
      const saved = q === "summary" || q === "deep" ? q : localStorage.getItem("ctd-mode");
      if (saved === "summary" || saved === "deep") queueMicrotask(() => setMode(saved));
    } catch { /* storage unavailable */ }
  }, []);
  const choose = (m: Mode) => { setMode(m); try { localStorage.setItem("ctd-mode", m); } catch { /* ignore */ } };

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(vis[0].target.id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div data-mode={mode} className="ctd-root-inner" style={{ display: "contents" }}>
      <ModeScope mode={mode} />
      <header className="ctd-top">
        <a href="#top" className="ctd-masthead"><b>From Clicks to Delegation</b><span>A research report on agentic commerce · as of {RESEARCH_DATE}</span></a>
        <span className="ctd-spacer" />
        <div className="ctd-jump">
          <label className="ctd-sr" htmlFor="ctd-jump">Jump to section</label>
          <select id="ctd-jump" value={active} onChange={(e) => { location.hash = e.target.value; }}>
            {SECTIONS.map((s) => <option key={s.id} value={s.id}>{s.num} {s.nav}</option>)}
          </select>
        </div>
        <div className="ctd-mode" role="group" aria-label="Reading mode">
          <button type="button" aria-pressed={mode === "summary"} onClick={() => choose("summary")}>Executive summary</button>
          <button type="button" aria-pressed={mode === "deep"} onClick={() => choose("deep")}>Deep research</button>
        </div>
        <span className="ctd-progress" style={{ width: `${progress * 100}%` }} aria-hidden />
      </header>
      <div className="ctd-layout">
        <nav className="ctd-rail" aria-label="Sections">
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}><span className="ctd-mono">{s.num}</span><span>{s.nav}</span></a></li>
            ))}
          </ol>
          <div className="ctd-rail-foot">
            {mode === "summary" ? "Executive summary: takeaways and the main exhibit in each section. Switch to Deep research for evidence, methods and every case." : "Deep research: every exhibit, evidence panel and source. Switch to Executive summary for a 3-minute read."}
          </div>
        </nav>
        <main className="ctd-main" id="top">
          <Hero />
          <Transition />
          <Timelines />
          <Adoption />
          <Cases />
          <Analogies />
          <Ladder />
          <Money />
          <Gatekeepers />
          <Categories />
          <Geography />
          <Futures />
          <Playbook />
          <Contrarian />
          <Insights />
          <Method />
        </main>
      </div>
      <CitationLayer />
    </div>
  );
}

/** The mode attribute lives on .ctd-root (rendered by the layout); mirror it there. */
function ModeScope({ mode }: { mode: Mode }) {
  useEffect(() => {
    const root = document.querySelector(".ctd-root");
    root?.setAttribute("data-mode", mode);
  }, [mode]);
  return null;
}

function Hero() {
  return (
    <header className="ctd-hero">
      <div className="ctd-kicker">Research report · Retail, platforms & AI</div>
      <h1>From clicks to <em>delegation</em>.</h1>
      <p className="ctd-dek">What thirty years of e-commerce reveal about agentic commerce, and what they would get dangerously wrong.</p>
      <div className="ctd-byline">
        <span><b>Research as of</b> {RESEARCH_DATE}</span>
        <span><b>Scope</b> 1994–2035 · US first, seven regions</span>
        <span><b>Reading time</b> 3 min (summary) · 30+ min (deep)</span>
      </div>
    </header>
  );
}
