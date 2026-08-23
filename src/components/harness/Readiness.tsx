"use client";

import { useMemo, useState } from "react";
import { ASSESSMENT } from "@/lib/harness/frameworks";
import { capById } from "@/lib/harness/capabilities";
import { Icon } from "./ui";

/** §12 — 11-layer maturity self-assessment. Local state only; nothing leaves the page. */
export default function Readiness() {
  const [scores, setScores] = useState<Record<string, number>>({});
  const answered = Object.keys(scores).length;

  const { avg, weakest, strongest } = useMemo(() => {
    const entries = Object.entries(scores);
    if (!entries.length) return { avg: 0, weakest: [] as string[], strongest: [] as string[] };
    const avg = entries.reduce((s, [, v]) => s + v, 0) / entries.length;
    const min = Math.min(...entries.map(([, v]) => v));
    const max = Math.max(...entries.map(([, v]) => v));
    return {
      avg,
      weakest: entries.filter(([, v]) => v === min).map(([k]) => k),
      strongest: entries.filter(([, v]) => v === max && max > min).map(([k]) => k),
    };
  }, [scores]);

  const verdict = () => {
    if (answered < ASSESSMENT.length) return `Answer all ${ASSESSMENT.length} to see your profile (${answered} done).`;
    const weakNames = weakest.map((id) => capById(id).name).join(", ");
    if (avg >= 2.4)
      return `Strong platform posture (avg ${avg.toFixed(1)}/3). Your leverage now is standardizing what works — and pressure-testing ${weakNames} before agent traffic scales.`;
    if (avg >= 1.4)
      return `Mid-transition (avg ${avg.toFixed(1)}/3): real capabilities, unevenly distributed. Prioritize ${weakNames} — gaps there compound fastest as agents multiply.`;
    return `Early (avg ${avg.toFixed(1)}/3): most layers are per-team improvisation. Start with identity, observability and evaluation — the layers that make everything else governable.`;
  };

  return (
    <div className="hx-ready">
      <div>
        {ASSESSMENT.map((item) => {
          const cap = capById(item.capabilityId);
          return (
            <div key={item.capabilityId} className="hx-card hx-ritem">
              <div className="ph">
                <span style={{ color: `hsl(${cap.hue} 70% 40%)`, display: "inline-flex" }}>
                  <Icon name={cap.icon} size={14} />
                </span>
                {item.prompt}
              </div>
              <div className="opts">
                {item.levels.map((lvl, i) => (
                  <button
                    key={lvl}
                    className={scores[item.capabilityId] === i ? "on" : ""}
                    onClick={() => setScores((s) => ({ ...s, [item.capabilityId]: i }))}
                  >
                    <strong>{i}</strong> · {lvl}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hx-card hx-ready-out">
        <h4>Your harness profile</h4>
        <div className="sub">0 = improvised · 3 = engineered. Scores stay in your browser.</div>
        {ASSESSMENT.map((item) => {
          const cap = capById(item.capabilityId);
          const v = scores[item.capabilityId];
          return (
            <div key={item.capabilityId} className="hx-rbar">
              <span className="nm">{cap.name}</span>
              <div className="tr">
                <div
                  className="fl"
                  style={{
                    width: v === undefined ? "0%" : `${Math.max(6, (v / 3) * 100)}%`,
                    background: `hsl(${cap.hue} 68% 48%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
        <div className="hx-ready-verdict">
          <strong>Reading: </strong>
          {verdict()}
          {answered === ASSESSMENT.length && strongest.length > 0 && (
            <>
              {" "}
              Strongest today: {strongest.map((id) => capById(id).name).join(", ")}.
            </>
          )}
        </div>
      </div>
    </div>
  );
}
