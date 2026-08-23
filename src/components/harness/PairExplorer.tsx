"use client";

import { useState } from "react";
import {
  MODEL_POSTURES,
  HARNESS_POSTURES,
  PAIR_VERDICTS,
  PORTABILITY_FORMS,
} from "@/lib/harness/pairing";

const TONE_STYLE: Record<string, React.CSSProperties> = {
  good: { borderColor: "rgba(24,128,56,0.4)", color: "var(--hx-green)", background: "rgba(24,128,56,0.06)" },
  warn: { borderColor: "rgba(176,96,0,0.4)", color: "var(--hx-amber)", background: "rgba(176,96,0,0.06)" },
  info: { borderColor: "rgba(26,115,232,0.35)", color: "var(--hx-blue-deep)", background: "rgba(26,115,232,0.06)" },
};

const COUPLING_STYLE: Record<string, React.CSSProperties> = {
  low: TONE_STYLE.good,
  medium: TONE_STYLE.info,
  high: TONE_STYLE.warn,
};

/** §08 — posture pairing + the six forms of portability (PRD §13). */
export default function PairExplorer() {
  const [model, setModel] = useState("routed");
  const [harness, setHarness] = useState("platform");
  const verdict = PAIR_VERDICTS.find((v) => v.model === model && v.harness === harness)!;
  const [openForm, setOpenForm] = useState<string | null>(null);

  return (
    <>
      <div className="hx-pair">
        <div className="hx-pair-col">
          <h5>Model posture</h5>
          <div className="hx-pair-opts">
            {MODEL_POSTURES.map((m) => (
              <button key={m.id} className={`hx-pair-opt ${model === m.id ? "on" : ""}`} onClick={() => setModel(m.id)}>
                <div className="nm">{m.name}</div>
                <div className="ds">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="hx-pair-col">
          <h5>Harness posture</h5>
          <div className="hx-pair-opts">
            {HARNESS_POSTURES.map((h) => (
              <button
                key={h.id}
                className={`hx-pair-opt ${harness === h.id ? "on" : ""}`}
                onClick={() => setHarness(h.id)}
              >
                <div className="nm">{h.name}</div>
                <div className="ds">{h.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="hx-card hx-pair-verdict">
        <div className="vh">{verdict.title}</div>
        <p>{verdict.body}</p>
        <div className="hx-pair-flags">
          {verdict.flags.map((f) => (
            <span key={f.text} className="hx-pill" style={TONE_STYLE[f.tone]}>
              {f.text}
            </span>
          ))}
        </div>
      </div>

      <h3
        className="hx-display"
        style={{ fontSize: 19, fontWeight: 700, margin: "36px 0 6px", letterSpacing: "-0.02em" }}
      >
        “If models keep changing, how do we avoid rebuilding everything?”
      </h3>
      <p style={{ fontSize: 14, color: "var(--hx-ink-soft)", maxWidth: 720, margin: "0 0 16px" }}>
        Portability isn&apos;t one property — it&apos;s six, and they behave very differently. Click each to see where
        coupling actually occurs.
      </p>
      <div className="hx-grid c3">
        {PORTABILITY_FORMS.map((f) => (
          <div
            key={f.id}
            className="hx-card"
            style={{ padding: "14px 16px", cursor: "pointer" }}
            onClick={() => setOpenForm(openForm === f.id ? null : f.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpenForm(openForm === f.id ? null : f.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>{f.name}</span>
              <span className="hx-pill" style={{ ...COUPLING_STYLE[f.coupling], fontSize: 10 }}>
                {f.coupling} coupling
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--hx-ink-faint)", marginTop: 3, fontStyle: "italic" }}>
              {f.question}
            </div>
            {openForm === f.id && (
              <div style={{ fontSize: 12.5, color: "var(--hx-ink-soft)", marginTop: 10, borderTop: "1px dashed var(--hx-line)", paddingTop: 8 }}>
                {f.reality}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
