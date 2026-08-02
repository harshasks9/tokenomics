"use client";

import { useState } from "react";
import { COMPILED_ON, KPIS } from "@/lib/modelcomp/data";
import Gate from "./Gate";
import MainChart from "./MainChart";
import InflectionRail from "./InflectionRail";
import FlashChart from "./FlashChart";
import Ledger from "./Ledger";

function Nav() {
  return (
    <nav className="mc-nav">
      <div className="mc-shell mc-nav-inner">
        <span className="mc-wordmark">
          Aitokenomics <span>/</span> Modelcomp
        </span>
        <div className="mc-nav-right">
          <span className="mc-badge">Verified &amp; compiled {COMPILED_ON}</span>
          <a
            className="mc-nav-link"
            href="https://aitokenomics.app"
            target="_blank"
            rel="noreferrer"
          >
            aitokenomics.app
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="mc-section mc-section-first">
      <p className="mc-eyebrow">Frontier watch · Aug 2025 – Aug 2026</p>

      <h1 className="mc-h1" style={{ marginTop: 16, maxWidth: "18ch" }}>
        The frontier moved.{" "}
        <span style={{ color: "var(--lab-google)" }}>Gemini</span>
        {" didn’t follow."}
      </h1>

      <p className="mc-lede" style={{ marginTop: 20 }}>
        Every model that set the intelligence frontier in the past 12 months, against the Google
        flagship available at that moment. Google held or shared #1 for 62 of 366 days — then Gemini
        3.5 Pro slipped three times while rivals raised the bar 15 points.
      </p>

      <div className="mc-kpis" style={{ marginTop: 32 }}>
        {KPIS.map((kpi) => (
          <div className="mc-kpi" key={kpi.label}>
            <p
              className={
                kpi.tone === "lead"
                  ? "mc-kpi-figure mc-tone-lead"
                  : kpi.tone === "trail"
                    ? "mc-kpi-figure mc-tone-trail"
                    : "mc-kpi-figure"
              }
            >
              {kpi.figure}
              {kpi.unit ? <span className="mc-kpi-unit">{kpi.unit}</span> : null}
            </p>
            <p className="mc-kpi-label">{kpi.label}</p>
            <p className="mc-kpi-detail">{kpi.detail}</p>
          </div>
        ))}
      </div>
    </header>
  );
}

function Methodology() {
  return (
    <section className="mc-section" id="methodology">
      <p className="mc-eyebrow">S5 · Methodology &amp; sources</p>
      <h2 className="mc-h2" style={{ marginTop: 6, marginBottom: 20 }}>
        How these numbers were built
      </h2>

      <div className="mc-prose">
        <p>
          Capability here means one thing: the{" "}
          <strong>Artificial Analysis Intelligence Index</strong> on the current v4.1 basis. AA
          re-baselined the index in June 2026 with heavier agentic weighting, which means published
          scores across index versions are not comparable to each other — a 71 on the December 2025
          basis and a 50 on v4.1 can describe the same model. Every figure on this page has been
          brought onto the v4.1 basis so the lines can be read as one continuous series.
        </p>
        <p>
          Solid markers use published v4.1 scores. Hollow markers are v4.1-equivalent estimates for
          models that were only ever scored on an earlier basis. Those estimates are anchored on the
          models published on both scales — Gemini 3.1 Pro at 57 on the old basis and 46 on v4.1,
          Gemini 3.5 Flash at 55 and 50 — and are constrained so that they preserve the live-index
          rankings recorded at the time. Where a model&rsquo;s live-index standing is the more telling
          number, it is quoted in that model&rsquo;s tooltip and in the ledger note rather than
          substituted into the chart.
        </p>
        <p>
          <strong>&ldquo;Frontier&rdquo;</strong> means the highest-scoring generally available model at
          each date, so the black line is a running maximum and never falls. Claude Mythos Preview
          (Apr 7) is excluded on that test: it was restricted access, not generally available.
          Prices are per 1M input and output tokens at launch, and are the list figures at the time
          rather than any negotiated rate.
        </p>
        <p>
          Source conflicts are disclosed rather than silently resolved. Grok 4.5 is reported as both
          Jul 8 and Jul 9; the Gemini 3.1 Flash-Lite date is reported as both Mar 3 and May 19; the
          Claude Opus 5 rollout spans Jul 23–24. In each case the earlier date is plotted and the
          conflict is noted on the point. Gemini 3.5 Pro remains unreleased as of {COMPILED_ON}, and
          Google announced Gemini 4 pretraining on Jul 21, 2026.
        </p>
        <p>
          Sources: Artificial Analysis model pages and launch analyses; Anthropic announcements;
          Wikipedia release infoboxes; vals.ai; llm-stats; and Bloomberg and 9to5Google reporting on
          the Gemini 3.5 Pro delay.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mc-footer">
      <div className="mc-shell">
        MODELCOMP · an aitokenomics.app microsite · internal analysis, not affiliated with any AI
        lab · scores © their respective benchmark publishers · compiled {COMPILED_ON}
      </div>
    </footer>
  );
}

export default function Site() {
  const [unlocked, setUnlocked] = useState(false);
  const [activeInflection, setActiveInflection] = useState<number | null>(null);

  if (!unlocked) return <Gate onUnlock={() => setUnlocked(true)} />;

  return (
    <>
      <Nav />
      <main>
        <div className="mc-shell">
          <Hero />

          <section className="mc-section">
            <MainChart
              activeInflection={activeInflection}
              onHoverInflection={setActiveInflection}
            />
          </section>

          <section className="mc-section">
            <InflectionRail active={activeInflection} onHover={setActiveInflection} />
          </section>

          <section className="mc-section">
            <FlashChart />
          </section>

          <section className="mc-section">
            <Ledger />
          </section>

          <Methodology />
        </div>
      </main>
      <Footer />
    </>
  );
}
