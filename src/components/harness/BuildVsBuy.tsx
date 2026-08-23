"use client";

import { useState } from "react";
import { APPROACHES, DIMENSIONS } from "@/lib/harness/frameworks";

const TRADEOFF_LABELS: { key: keyof (typeof APPROACHES)[0]["tradeoffs"]; label: string }[] = [
  { key: "control", label: "Control" },
  { key: "speed", label: "Speed" },
  { key: "portability", label: "Portability" },
  { key: "reliability", label: "Reliability" },
  { key: "opsBurden", label: "Ops burden" },
];

function Segs({ value }: { value: number }) {
  return (
    <div className="tr">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`seg ${i <= value ? "f" : ""}`} />
      ))}
    </div>
  );
}

/** §07 — build vs framework vs platform vs application-specific. */
export default function BuildVsBuy() {
  const [sel, setSel] = useState(APPROACHES[2].id);
  const a = APPROACHES.find((x) => x.id === sel)!;
  const [showDims, setShowDims] = useState(false);

  return (
    <>
      <div className="hx-bvb-grid">
        {APPROACHES.map((x) => (
          <div
            key={x.id}
            className={`hx-bvb-card ${sel === x.id ? "on" : ""}`}
            onClick={() => setSel(x.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(x.id)}
          >
            <h4>{x.name}</h4>
            <div className="sub">{x.subtitle}</div>
            {TRADEOFF_LABELS.map((t) => (
              <div key={t.key} className="hx-tbar">
                <span>{t.label}</span>
                <Segs value={x.tradeoffs[t.key]} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hx-card hx-bvb-detail">
        <div>
          <h5>Best when</h5>
          <ul>
            {a.bestWhen.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <h5 style={{ marginTop: 14 }}>In the market</h5>
          <ul>
            {a.examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
        <div>
          <h5>Watch out</h5>
          <div className="warn">{a.watchOut}</div>
          <p style={{ fontSize: 13, color: "var(--hx-ink-soft)", marginTop: 14 }}>
            The house view: this is not one decision but eleven. Build the loop only where it differentiates; buy
            identity, observability and policy everywhere; and let workloads with mature dedicated harnesses (coding)
            use them — under shared governance.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <button
          onClick={() => setShowDims((s) => !s)}
          className="hx-pill"
          style={{ cursor: "pointer", fontSize: 12, padding: "7px 14px" }}
        >
          {showDims ? "Hide" : "Show"} the full 14-dimension evaluation checklist
        </button>
        {showDims && (
          <div className="hx-grid c2" style={{ marginTop: 14 }}>
            {DIMENSIONS.map((d) => (
              <div key={d.id} className="hx-card" style={{ padding: "13px 16px" }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{d.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--hx-ink-soft)", margin: "2px 0 7px" }}>{d.question}</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--hx-ink-faint)" }}>
                  {d.probes.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
