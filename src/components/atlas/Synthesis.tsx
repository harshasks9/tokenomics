"use client";

import { SYNTHESIS } from "@/lib/atlas/data";
import { ExportMenu, KindLabel, PersonLink, SectionHead } from "./Shared";

export default function Synthesis() {
  const S = SYNTHESIS;
  const M = S.mentalModel;
  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Final synthesis" title="The intelligence behind the intelligence"
        right={<ExportMenu name="atlas-synthesis" json={() => S} />}>
        Ten questions answered from the evidence base, then a unified mental model for 2030 that keeps the most historically reliable ideas —
        and states its own assumptions. <KindLabel k="interp" />
      </SectionHead>

      {S.questions.length === 0 && <div className="at-empty">Synthesis not loaded.</div>}
      <div className="at-stack" style={{ gap: 14 }}>
        {S.questions.filter((q) => q.id !== "headline").map((q, i) => (
          <details key={q.id} className="at-card at-pad" open={i < 2}>
            <summary style={{ cursor: "pointer", listStyle: "none" }}>
              <div className="at-row" style={{ flexWrap: "nowrap", alignItems: "baseline" }}>
                <span className="at-mono at-faint" style={{ width: 28 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="at-serif" style={{ fontSize: 21, lineHeight: 1.25 }}>{q.question}</span>
              </div>
            </summary>
            <div style={{ paddingLeft: 28, marginTop: 10 }}>
              <p className="at-small" style={{ marginTop: 0 }}>{q.answer}</p>
              {q.items && (
                <div className="at-grid at-g2" style={{ gap: 10 }}>
                  {q.items.map((it, k) => (
                    <div key={k} className="at-ev" style={{ background: "#fff" }}>
                      <div className="at-small" style={{ fontWeight: 650 }}>{it.title}</div>
                      <div className="at-xs at-muted" style={{ margin: "3px 0" }}>{it.body}</div>
                      {it.thinkers && it.thinkers.length > 0 && <div className="at-xs">{it.thinkers.map((t, j) => <span key={t}>{j ? ", " : ""}<PersonLink id={t} /></span>)}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </details>
        ))}
      </div>

      {M.principles.length > 0 && (
        <section style={{ marginTop: 44 }}>
          <div className="at-hero" style={{ borderRadius: 18, padding: "34px 30px" }}>
            <p className="at-eyebrow">Unified AI mental model for 2030</p>
            <h2 className="at-serif" style={{ fontSize: "clamp(28px,3.4vw,42px)", margin: "0 0 10px", lineHeight: 1.1, color: "#fff" }}>{M.title}</h2>
            <p className="lede" style={{ color: "#b9c3d9", margin: 0 }}>Each principle names the thinkers whose historical record earned it a place, and how confident the evidence lets us be.</p>
          </div>
          <div className="at-grid at-g2" style={{ marginTop: 16 }}>
            {M.principles.map((p, i) => (
              <div key={p.id} className="at-card at-pad">
                <div className="at-between"><span className="at-mono at-faint">P{i + 1}</span>
                  <span className="at-badge" style={{ color: p.confidence === "high" ? "var(--agree)" : p.confidence === "medium" ? "var(--unresolved-text)" : "var(--disagree)" }}>{p.confidence} confidence</span></div>
                <div className="at-h3" style={{ fontSize: 17, marginTop: 6 }}>{p.title}</div>
                <p className="at-small" style={{ margin: "4px 0 8px" }}>{p.body}</p>
                <div className="at-xs at-muted">From: {p.from.map((t, j) => <span key={t}>{j ? ", " : ""}<PersonLink id={t} /></span>)}</div>
              </div>
            ))}
          </div>
          <div className="at-grid at-g3" style={{ marginTop: 16 }}>
            <div className="at-card at-pad">
              <div className="at-h3" style={{ color: "var(--disagree)" }}>Discard</div>
              {M.discard.map((d, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div className="at-small" style={{ fontWeight: 600 }}>{d.idea}</div>
                  <div className="at-xs at-muted">{d.why}</div>
                  <div className="at-xs">{d.heldBy.map((t, j) => <span key={t}>{j ? ", " : ""}<PersonLink id={t} /></span>)}</div>
                </div>
              ))}
            </div>
            <div className="at-card at-pad">
              <div className="at-h3">Assumptions this model makes</div>
              <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{M.assumptions.map((a, i) => <li key={i} style={{ margin: "4px 0" }}>{a}</li>)}</ul>
            </div>
            <div className="at-card at-pad">
              <div className="at-h3" style={{ color: "var(--unresolved-text)" }}>Biggest uncertainties</div>
              <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{M.uncertainties.map((a, i) => <li key={i} style={{ margin: "4px 0" }}>{a}</li>)}</ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
