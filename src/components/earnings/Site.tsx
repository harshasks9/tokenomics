"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  COMPILED_ON,
  CONFIDENCE_BLURB,
  HERO_COUNTERS,
  REPORT_WINDOW,
  THESIS,
  TLDR,
  ZONES,
  type Confidence,
} from "@/lib/earnings/data";
import { Pill, Reveal, layerClass, useCountUp, useReveal } from "./primitives";
import MindMap from "./MindMap";
import Demand from "./Demand";
import Choose from "./Choose";
import Scoreboard from "./Scoreboard";
import Dollar from "./Dollar";
import { Playbook, Risks } from "./Playbook";

function Counter({ i }: { i: number }) {
  const c = HERO_COUNTERS[i];
  const { ref, shown } = useReveal<HTMLDivElement>();
  const n = useCountUp(c.value, shown);

  return (
    <div className={`ea-counter ${layerClass(c.layer)}`} ref={ref} data-c={c.c}>
      <p className="ea-counter-v">
        {c.prefix}
        {n.toFixed(c.decimals)}
        {c.suffix}
      </p>
      <p className="ea-counter-l">
        {c.label} <Pill c={c.c} />
      </p>
      <p className="ea-counter-d">{c.detail}</p>
      <p className="ea-counter-d" style={{ fontSize: 10.5, marginTop: 6, opacity: 0.85 }}>
        {c.source}
      </p>
    </div>
  );
}

export default function Site() {
  const [zone, setZone] = useState(1);
  const [progress, setProgress] = useState(0);
  const [factsOnly, setFactsOnly] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  /** Track reading progress and which zone owns the viewport. */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setProgress(max > 0 ? Math.min(doc.scrollTop / max, 1) : 0);

        // The zone whose top is closest to just under the sticky bar wins.
        let best = 1;
        let bestTop = -Infinity;
        for (const z of ZONES) {
          const el = document.getElementById(`ea-${z.id}`);
          if (!el) continue;
          const top = el.getBoundingClientRect().top - 90;
          if (top <= 0 && top > bestTop) {
            bestTop = top;
            best = z.n;
          }
        }
        setZone(best);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const jump = useCallback((n: number) => {
    const z = ZONES.find((x) => x.n === n);
    if (!z) return;
    document.getElementById(`ea-${z.id}`)?.scrollIntoView({
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
  }, []);

  return (
    <div className="ea-root" ref={root} data-facts-only={factsOnly}>
      {/* Top bar */}
      <div className="ea-top">
        <div className="ea-shell ea-top-inner">
          <span className="ea-wordmark">
            Aitokenomics <span>/</span> Earnings
          </span>

          <div className="ea-top-right">
            {(["fact", "inference", "hypothesis"] as Confidence[]).map((c) => (
              <span
                key={c}
                title={CONFIDENCE_BLURB[c]}
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <Pill c={c} onDark />
              </span>
            ))}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,.7)", whiteSpace: "nowrap" }}>
              {REPORT_WINDOW}
            </span>
          </div>
        </div>

        <div className="ea-shell">
          <div className="ea-strip" role="tablist" aria-label="Zones">
            {ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                className="ea-strip-item"
                aria-current={zone === z.n}
                onClick={() => jump(z.n)}
              >
                {String(z.n).padStart(2, "0")} {z.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ea-progress" style={{ width: `${progress * 100}%` }} aria-hidden="true" />
      </div>

      {/* Sticky rail */}
      <nav className="ea-rail" aria-label="Sections">
        {ZONES.map((z) => (
          <button
            key={z.id}
            type="button"
            className="ea-rail-item"
            aria-current={zone === z.n}
            onClick={() => jump(z.n)}
          >
            <span className="ea-rail-n">{String(z.n).padStart(2, "0")}</span>
            <span>
              <span className="ea-rail-label">{z.label}</span>
              <br />
              <span className="ea-rail-kicker">{z.kicker}</span>
            </span>
          </button>
        ))}
      </nav>

      <main className="ea-main">
        <div className="ea-shell">
          {/* 1 · Hero */}
          <section className="ea-zone ea-zone-first" id="ea-hero">
            <div className="ea-zone-head">
              <span className="ea-zone-num">01</span>
              <span className="ea-kicker">State of Model-as-a-Service · {REPORT_WINDOW}</span>
            </div>

            <h1 className="ea-h1" style={{ maxWidth: "17ch" }}>
              The State of Model-as-a-Service
            </h1>

            <p className="ea-thesis" style={{ marginTop: 18 }}>
              {THESIS}
            </p>

            <p className="ea-lede" style={{ marginTop: 14 }}>
              Google Cloud is winning the cloud growth race but not the frontier-model race. The
              strategic control point is migrating to the agent harness and the data platform — not
              the raw model.
            </p>

            <div className="ea-counters" style={{ marginTop: 30 }}>
              {HERO_COUNTERS.map((_, i) => (
                <Counter key={HERO_COUNTERS[i].label} i={i} />
              ))}
            </div>

            <Reveal style={{ marginTop: 34 }}>
              <div className="ea-tldr">
                {TLDR.map((t) => (
                  <div className="ea-tldr-item" key={t.n} data-c={t.c}>
                    <p className="ea-zone-num" style={{ color: "var(--prussian)" }}>
                      {String(t.n).padStart(2, "0")}
                    </p>
                    <h3 className="ea-h3" style={{ marginTop: 6 }}>
                      {t.title} <Pill c={t.c} />
                    </h3>
                    <p style={{ fontSize: 12.5, marginTop: 6, color: "var(--muted)", lineHeight: 1.55 }}>
                      {t.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>

          {/* 2 · Mind map */}
          <section className="ea-zone" id="ea-map">
            <MindMap onJump={jump} />
          </section>

          {/* 3 · Demand */}
          <section className="ea-zone" id="ea-demand">
            <Demand />
          </section>

          {/* 4 · Choose */}
          <section className="ea-zone" id="ea-choose">
            <Choose />
          </section>

          {/* 5 · Scoreboard */}
          <section className="ea-zone" id="ea-scoreboard">
            <Scoreboard />
          </section>

          {/* 6 · Dollar */}
          <section className="ea-zone" id="ea-dollar">
            <Dollar />
          </section>

          {/* 7 · Playbook */}
          <section className="ea-zone" id="ea-playbook">
            <Playbook />
          </section>

          {/* 8 · Risks */}
          <section className="ea-zone" id="ea-risks">
            <Risks />
          </section>
        </div>

        <footer className="ea-footer">
          <div className="ea-shell">
            EARNINGS · an aitokenomics.app microsite · Model-as-a-Service competitive intelligence,{" "}
            {REPORT_WINDOW} · compiled {COMPILED_ON} · internal analysis, not affiliated with any AI
            lab or cloud provider · figures are as disclosed by their sources and carry a
            fact/inference/hypothesis tag throughout
          </div>
        </footer>
      </main>

      {/* Facts-only filter */}
      <button
        type="button"
        className="ea-float"
        aria-pressed={factsOnly}
        onClick={() => setFactsOnly((v) => !v)}
        title="Dim everything that is not a disclosed fact"
      >
        <span className="ea-switch" aria-hidden="true" />
        Facts only
      </button>
    </div>
  );
}
