"use client";

import type { Dataset, Model, WorkloadGuide } from "@/lib/llm-landscape/types";
import Compare from "./Compare";
import { GradeBadge } from "./ui";

function GuideCard({
  rm,
  onOpenRecord,
  onStartCompare,
}: {
  rm: WorkloadGuide["representative_models"][number];
  onOpenRecord: (id: string) => void;
  onStartCompare: (id: string) => void;
}) {
  return (
    <article className="gcard">
      <div className="gcard-head">
        {rm.model_id ? (
          <button className="gcard-name link" onClick={() => onOpenRecord(rm.model_id!)}>
            {rm.label}
          </button>
        ) : (
          <span className="gcard-name">{rm.label}</span>
        )}
        <span className="gcard-access">{rm.access_note}</span>
      </div>
      <div className="gcard-block gcard-choose">
        <span className="gcard-tag">choose it when</span>
        <p>{rm.choose_when}</p>
      </div>
      <div className="gcard-block gcard-avoid">
        <span className="gcard-tag">think twice when</span>
        <p>{rm.avoid_when}</p>
      </div>
      <div className="gcard-block gcard-trade">
        <span className="gcard-tag">trade-offs</span>
        <p>{rm.trade_offs}</p>
      </div>
      {rm.model_id && (
        <button className="btn-compare" onClick={() => onStartCompare(rm.model_id!)}>
          head-to-head from here →
        </button>
      )}
    </article>
  );
}

/**
 * Advisor: workload-first buyer's guides plus a symmetric any-vs-any
 * head-to-head. Guides are labeled analyst judgment; no vendor is the
 * house answer.
 */
export default function Advisor({
  data,
  a,
  b,
  workload,
  candidates,
  onChangeA,
  onChangeB,
  onPickWorkload,
  onOpenRecord,
  onExitCompare,
}: {
  data: Dataset;
  a: Model | null;
  b: Model | null;
  workload: string | null;
  candidates: Model[];
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  onPickWorkload: (w: string) => void;
  onOpenRecord: (id: string) => void;
  onExitCompare: () => void;
}) {
  const guides = data.meta.workload_guides ?? [];
  const wlLabel = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;
  const active: WorkloadGuide | null =
    guides.find((g) => g.workload === workload) ?? guides[0] ?? null;

  // Head-to-head mode: a model A is selected.
  if (a) {
    return (
      <div className="advisor">
        <div className="advisor-modes">
          <button className="seg-btn" onClick={onExitCompare}>
            ← buyer&apos;s guides
          </button>
          <span className="advisor-mode-on">head-to-head</span>
        </div>
        <Compare
          a={a}
          b={b}
          data={data}
          candidates={candidates}
          onChangeA={onChangeA}
          onChangeB={onChangeB}
          onOpenRecord={onOpenRecord}
        />
      </div>
    );
  }

  return (
    <div className="advisor">
      <div className="advisor-intro">
        <h2>Buyer&apos;s guides, by workload</h2>
        <p>
          Analyst shortlists with the reasoning shown — every card carries a
          &ldquo;choose it when&rdquo; and a &ldquo;think twice when&rdquo;, and nothing here is a
          score. Every judgment on this page is labeled <GradeBadge grade="analyst-inference" />.
        </p>
      </div>

      <div className="guide-rail" role="tablist" aria-label="Workloads">
        {guides.map((g) => (
          <button
            key={g.workload}
            role="tab"
            aria-selected={active?.workload === g.workload}
            className={`guide-tab ${active?.workload === g.workload ? "on" : ""}`}
            onClick={() => onPickWorkload(g.workload)}
          >
            {wlLabel(g.workload)}
          </button>
        ))}
      </div>

      {active && (
        <section className="guide" aria-label={wlLabel(active.workload)}>
          <div className="guide-direction">
            <h3>{wlLabel(active.workload)}</h3>
            <p className="guide-market">
              <span className="gcard-tag">where this market is</span> {active.market_direction}
            </p>
            <div className="guide-factors">
              <span className="gcard-tag">what should drive the decision</span>
              <ol>
                {active.decision_factors.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="guide-grid">
            {active.representative_models.map((rm, i) => (
              <GuideCard
                key={i}
                rm={rm}
                onOpenRecord={onOpenRecord}
                onStartCompare={onChangeA}
              />
            ))}
          </div>
          <p className="guide-note">
            Shortlists are representative, not exhaustive — the timeline holds the full universe.
            Start a head-to-head from any card, or pick any two models directly below.
          </p>
        </section>
      )}

      <div className="advisor-start">
        <label htmlFor="advisor-start-a">or start a head-to-head with any model:</label>
        <select
          id="advisor-start-a"
          value=""
          onChange={(e) => e.target.value && onChangeA(e.target.value)}
        >
          <option value="">— pick model A —</option>
          {candidates.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.vendor})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
