"use client";

import { useMemo, useState } from "react";
import type { CaseStudy, Source } from "@/lib/governance/types";

/** Filterable case-study library with expandable governance detail. */
export function ExampleLibrary({
  examples,
  sourceMap,
}: {
  examples: CaseStudy[];
  sourceMap: Record<string, Source>;
}) {
  const industries = useMemo(
    () => [...new Set(examples.map((e) => e.industry))],
    [examples],
  );
  const [industry, setIndustry] = useState<string | "all">("all");
  const [lens, setLens] = useState<"all" | "google" | "market">("all");
  const [openId, setOpenId] = useState<string | null>(examples[0]?.id ?? null);

  const visible = examples.filter(
    (e) => (industry === "all" || e.industry === industry) && (lens === "all" || e.lens === lens),
  );

  return (
    <div>
      <div className="g-no-print" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 8 }}>
        <button className="g-chip" aria-pressed={lens === "all"} onClick={() => setLens("all")}>
          All stories
        </button>
        <button className="g-chip" aria-pressed={lens === "google"} onClick={() => setLens(lens === "google" ? "all" : "google")}>
          Google Cloud customers
        </button>
        <button className="g-chip" aria-pressed={lens === "market"} onClick={() => setLens(lens === "market" ? "all" : "market")}>
          Market patterns
        </button>
      </div>
      <div className="g-no-print" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
        <button className="g-chip" aria-pressed={industry === "all"} onClick={() => setIndustry("all")}>
          All industries
        </button>
        {industries.map((ind) => (
          <button
            key={ind}
            className="g-chip"
            aria-pressed={industry === ind}
            onClick={() => setIndustry(industry === ind ? "all" : ind)}
          >
            {ind}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visible.map((ex) => {
          const open = openId === ex.id;
          return (
            <div key={ex.id} className="g-expand">
              <button className="g-expand-head" aria-expanded={open} onClick={() => setOpenId(open ? null : ex.id)}>
                <span style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "baseline" }}>
                  <span className="g-h3">{ex.company}</span>
                  <span className="g-micro">{ex.industry}</span>
                  <span className={`g-badge ${ex.lens === "google" ? "google" : ""}`}>
                    {ex.lens === "google" ? "Google Cloud" : "Market"}
                  </span>
                  {ex.confidence === "directional" ? (
                    <span className="g-badge hypo" title="Real deployment; public governance detail is thinner — present as direction of travel.">
                      Directional
                    </span>
                  ) : null}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ color: "var(--faint)", transform: open ? "rotate(180deg)" : "none", transition: "transform .18s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {open ? (
                <div className="g-expand-body">
                  <p className="g-micro" style={{ marginBottom: 12 }}>{ex.system}</p>
                  <div className="g-grid-2" style={{ gap: 18 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div className="g-block-title" style={{ marginBottom: 4 }}>Situation</div>
                        <p className="g-small">{ex.situation}</p>
                      </div>
                      <div>
                        <div className="g-block-title" style={{ marginBottom: 4 }}>Governance challenge</div>
                        <p className="g-small">{ex.challenge}</p>
                      </div>
                      <div>
                        <div className="g-block-title" style={{ marginBottom: 4 }}>Architecture / approach</div>
                        <p className="g-small">{ex.architecture}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div>
                        <div className="g-block-title" style={{ marginBottom: 4 }}>Controls introduced</div>
                        <ul className="g-list" style={{ gap: 5 }}>
                          {ex.controls.map((c, i) => (
                            <li key={i} style={{ fontSize: 13 }}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="g-block-title" style={{ marginBottom: 4 }}>Outcome</div>
                        <p className="g-small">{ex.outcome}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid var(--line-soft)", marginTop: 16, paddingTop: 12 }}>
                    <div className="g-block-title" style={{ marginBottom: 6 }}>What it teaches</div>
                    <ul className="g-list g-list-check" style={{ gap: 5 }}>
                      {ex.lessons.map((l, i) => (
                        <li key={i} style={{ fontSize: 13.5 }}>{l}</li>
                      ))}
                    </ul>
                    <p className="g-footnote-src" style={{ marginTop: 10 }}>
                      Sources:{" "}
                      {ex.sourceIds.map((sid, i) => {
                        const src = sourceMap[sid];
                        if (!src) return null;
                        return (
                          <span key={sid}>
                            {i > 0 ? " · " : ""}
                            <a href={src.url} target="_blank" rel="noreferrer">
                              {src.org} ({src.date})
                            </a>
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
