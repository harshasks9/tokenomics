"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Layer, MaturityStage, ReadinessQuestion } from "@/lib/governance/types";

type Answers = Record<string, 1 | 2 | 3 | 4 | undefined>;

/**
 * Governance readiness diagnostic. Runs entirely in the browser — nothing the
 * customer selects is stored or transmitted, which is worth saying out loud in
 * a governance conversation.
 */
export function ReadinessQuiz({
  layers,
  questions,
  stages,
}: {
  layers: Layer[];
  questions: ReadinessQuestion[];
  stages: MaturityStage[];
}) {
  const steps = useMemo(
    () =>
      layers
        .map((layer) => ({
          layer,
          questions: questions.filter((q) => q.layerId === layer.id),
        }))
        .filter((s) => s.questions.length > 0),
    [layers, questions],
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const answeredCount = Object.values(answers).filter(Boolean).length;
  const step = steps[stepIndex];

  const layerScores = useMemo(() => {
    return steps.map(({ layer, questions: qs }) => {
      const vals = qs.map((q) => answers[q.id]).filter((v): v is 1 | 2 | 3 | 4 => Boolean(v));
      const score = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
      return { layer, score, answered: vals.length, total: qs.length };
    });
  }, [steps, answers]);

  const scored = layerScores.filter((s) => s.score !== null) as {
    layer: Layer;
    score: number;
    answered: number;
    total: number;
  }[];
  const overall = scored.length ? scored.reduce((a, s) => a + s.score, 0) / scored.length : null;
  const stage =
    overall === null
      ? null
      : stages.find((s) => s.level === Math.min(4, Math.max(1, Math.round(overall)))) ?? null;
  const priorities = [...scored].sort((a, b) => a.score - b.score).slice(0, 3);

  if (showResults) {
    return (
      <div>
        <div className="g-card" style={{ padding: 28 }}>
          <div className="g-block-title">Your readiness snapshot</div>
          {overall === null ? (
            <p className="g-prose">
              No questions answered yet — go back and select the description closest to your
              organization today.
            </p>
          ) : (
            <>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 28, alignItems: "baseline" }}>
                <div>
                  <div className="g-stat">{overall.toFixed(1)} / 4</div>
                  <div className="g-stat-label">
                    Overall maturity · {answeredCount} of {questions.length} questions answered
                  </div>
                </div>
                {stage ? (
                  <div style={{ maxWidth: 420 }}>
                    <div className="g-h3" style={{ marginBottom: 4 }}>
                      Stage {stage.level} — {stage.name}
                    </div>
                    <p className="g-small">{stage.meaning}</p>
                  </div>
                ) : null}
              </div>

              <hr className="g-rule" />

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {layerScores.map(({ layer, score, answered, total }) => (
                  <div key={layer.id} data-hue={layer.hue}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>
                        {layer.num} · {layer.name}
                      </span>
                      <span className="g-micro">
                        {score === null ? `not answered` : `${score.toFixed(1)} / 4 · ${answered}/${total}`}
                      </span>
                    </div>
                    <div className="g-meter">
                      <span style={{ width: `${((score ?? 0) / 4) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {priorities.length > 0 ? (
          <div style={{ marginTop: 20 }}>
            <h3 className="g-h3" style={{ marginBottom: 12 }}>
              Where to focus first
            </h3>
            <div className="g-grid-3">
              {priorities.map(({ layer, score }, i) => (
                <div key={layer.id} className="g-card g-card-hover" data-hue={layer.hue}>
                  <div className="g-kicker" style={{ marginBottom: 8 }}>
                    <span className="g-kicker-num">P{i + 1}</span>
                    {layer.short} · {score.toFixed(1)}/4
                  </div>
                  <p className="g-small" style={{ color: "var(--ink-2)" }}>{layer.executive.riskLine}</p>
                  <div style={{ marginTop: 12 }}>
                    <Link href={`/governance/stack/${layer.id}`} className="g-btn" style={{ fontSize: 12.5, padding: "7px 13px" }}>
                      See the controls →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {priorities.length > 0 ? (
          <div className="g-google-band" style={{ marginTop: 20 }}>
            <div className="g-block-title">Bring to your Google Cloud team</div>
            <ul className="g-list g-list-q">
              {priorities.flatMap(({ layer }) => layer.discovery.slice(0, 2)).map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="g-no-print" style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button
            className="g-btn"
            onClick={() => {
              setShowResults(false);
              setStepIndex(0);
            }}
          >
            Revisit answers
          </button>
          <button
            className="g-btn"
            onClick={() => {
              setAnswers({});
              setShowResults(false);
              setStepIndex(0);
            }}
          >
            Start over
          </button>
          <button className="g-btn primary" onClick={() => window.print()}>
            Print snapshot
          </button>
        </div>
        <p className="g-micro" style={{ marginTop: 14 }}>
          Answers never leave this browser — nothing is stored or transmitted.
        </p>
      </div>
    );
  }

  if (!step) return null;

  return (
    <div>
      <div
        className="g-no-print"
        style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, flexWrap: "wrap" }}
      >
        <div style={{ display: "flex", gap: 5 }} aria-label={`Step ${stepIndex + 1} of ${steps.length}`}>
          {steps.map((s, i) => (
            <button
              key={s.layer.id}
              data-hue={s.layer.hue}
              onClick={() => setStepIndex(i)}
              title={s.layer.name}
              aria-current={i === stepIndex ? "step" : undefined}
              style={{
                width: i === stepIndex ? 22 : 8,
                height: 8,
                borderRadius: 999,
                background: i === stepIndex ? "var(--hue)" : i < stepIndex ? "var(--hue-line)" : "var(--line)",
                transition: "all .2s",
              }}
            />
          ))}
        </div>
        <span className="g-micro">
          {stepIndex + 1} of {steps.length} · {answeredCount}/{questions.length} answered
        </span>
      </div>

      <div data-hue={step.layer.hue}>
        <div className="g-kicker">
          <span className="g-kicker-num">{step.layer.num}</span>
          {step.layer.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24, marginTop: 6 }}>
          {step.questions.map((q) => (
            <div key={q.id}>
              <h3 className="g-h3" style={{ marginBottom: 12, maxWidth: "40em" }}>
                {q.question}
              </h3>
              <div style={{ display: "grid", gap: 8 }}>
                {q.levels.map((desc, i) => {
                  const lvl = (i + 1) as 1 | 2 | 3 | 4;
                  const on = answers[q.id] === lvl;
                  return (
                    <button
                      key={lvl}
                      className={`g-quiz-opt${on ? " on" : ""}`}
                      aria-pressed={on}
                      onClick={() =>
                        setAnswers((prev) => ({ ...prev, [q.id]: prev[q.id] === lvl ? undefined : lvl }))
                      }
                    >
                      <span className="lvl-pip">{lvl}</span>
                      <span>{desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
        {stepIndex > 0 ? (
          <button className="g-btn" onClick={() => setStepIndex((i) => Math.max(0, i - 1))}>
            ← Back
          </button>
        ) : null}
        {stepIndex < steps.length - 1 ? (
          <button className="g-btn primary" onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}>
            Next layer →
          </button>
        ) : (
          <button className="g-btn accent" onClick={() => setShowResults(true)}>
            See my readiness snapshot
          </button>
        )}
        {stepIndex < steps.length - 1 ? (
          <button className="g-btn" style={{ marginLeft: "auto" }} onClick={() => setShowResults(true)}>
            Skip to results
          </button>
        ) : null}
      </div>
    </div>
  );
}
