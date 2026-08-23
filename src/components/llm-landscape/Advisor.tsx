"use client";

import { useState } from "react";
import type { Dataset, Model, WorkloadGuide } from "@/lib/llm-landscape/types";
import {
  ACCESS_LABEL,
  CTX_OPTIONS,
  ORIGIN_OPTIONS,
  checkConstraints,
  fmtTokens,
  parseReleased,
  type ConstraintVerdict,
} from "@/lib/llm-landscape/model";
import Compare from "./Compare";

type Constraints = { cOpen: boolean; cOrigin: string | null; cCtx: number | null };

function constraintsActive(c: Constraints): boolean {
  return c.cOpen || Boolean(c.cOrigin) || Boolean(c.cCtx);
}

function constraintsLine(c: Constraints): string {
  const parts: string[] = [];
  if (c.cOpen) parts.push("open weights only");
  if (c.cOrigin) parts.push(ORIGIN_OPTIONS.find((o) => o.value === c.cOrigin)?.label ?? c.cOrigin);
  if (c.cCtx) parts.push(`context ≥ ${fmtTokens(c.cCtx)}`);
  return parts.length ? parts.join(" · ") : "none";
}

function chooseClaim(m: Model) {
  return m.best_use_cases?.[0] ?? m.known_for?.[0] ?? null;
}

function GuideCard({
  rm,
  verdict,
  ready,
  onOpenRecord,
  onStartCompare,
}: {
  rm: WorkloadGuide["representative_models"][number];
  verdict: ConstraintVerdict | null;
  ready: boolean;
  onOpenRecord: (id: string) => void;
  onStartCompare: (id: string) => void;
}) {
  const [showAnyway, setShowAnyway] = useState(false);

  if (verdict?.kind === "fail" && !showAnyway) {
    return (
      <article className="gcard gcard-x">
        <div className="gcard-head">
          <span className="gcard-name">{rm.label}</span>
          <span className="gcard-access">{rm.access_note}</span>
        </div>
        <p className="gcard-xwhy">Excluded — {verdict.reasons.join("; ")}</p>
        <button className="link" onClick={() => setShowAnyway(true)}>
          Show anyway
        </button>
      </article>
    );
  }

  return (
    <article className="gcard">
      <div className="gcard-head">
        {rm.model_id ? (
          <button
            className="gcard-name link"
            onClick={() => onOpenRecord(rm.model_id!)}
            disabled={!ready}
          >
            {rm.label}
          </button>
        ) : (
          <span className="gcard-name">{rm.label}</span>
        )}
        <span className="gcard-access">{rm.access_note}</span>
      </div>
      {verdict?.kind === "fail" && (
        <p className="gcard-xwhy">Fails your constraints — {verdict.reasons.join("; ")}</p>
      )}
      {verdict?.kind === "pass" && verdict.unknowns.length > 0 && (
        <p className="flag-verify">{verdict.unknowns.join(" · ")}</p>
      )}
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
        <button className="btn-compare" onClick={() => onStartCompare(rm.model_id!)} disabled={!ready}>
          Compare from here →
        </button>
      )}
    </article>
  );
}

/**
 * Advisor — the front door. Opens with the buyer's question, filters the
 * shortlists by declared constraints (exclusions shown with reasons, unknowns
 * flagged, never dropped), and hands the user a brief to take away.
 */
export default function Advisor({
  data,
  ready,
  a,
  b,
  workload,
  candidates,
  constraints,
  onChangeA,
  onChangeB,
  onPickWorkload,
  onOpenRecord,
  onExitCompare,
  onMaturity,
  onConstraint,
  onToast,
}: {
  data: Dataset;
  ready: boolean;
  a: Model | null;
  b: Model | null;
  workload: string | null;
  candidates: Model[];
  constraints: Constraints;
  onChangeA: (id: string) => void;
  onChangeB: (id: string) => void;
  onPickWorkload: (w: string) => void;
  onOpenRecord: (id: string) => void;
  onExitCompare: () => void;
  onMaturity?: () => void;
  onConstraint: (patch: Partial<Constraints>) => void;
  onToast: (msg: string) => void;
}) {
  const guides = data.meta.workload_guides ?? [];
  const wlLabel = (id: string) => data.meta.workloads.find((w) => w.id === id)?.label ?? id;
  const active: WorkloadGuide | null =
    guides.find((g) => g.workload === workload) ?? guides[0] ?? null;
  const cActive = constraintsActive(constraints);

  const verdictFor = (rm: WorkloadGuide["representative_models"][number]): ConstraintVerdict | null => {
    if (!cActive) return null;
    if (!rm.model_id || !ready) {
      return { kind: "pass", unknowns: rm.model_id ? [] : ["off-dataset option — verify constraints yourself"] };
    }
    const rec = data.models.find((m) => m.id === rm.model_id);
    return rec ? checkConstraints(rec, constraints) : null;
  };

  const copy = (text: string, done: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => onToast(done))
      .catch(() => onToast("Couldn't copy — your browser blocked clipboard access."));
  };

  const copyGuideBrief = () => {
    if (!active) return;
    const lines: string[] = [];
    lines.push(`# ${wlLabel(active.workload)} — model shortlist`);
    lines.push(`Independent advisory, verified ${data.meta.snapshot_date}. Constraints: ${constraintsLine(constraints)}.`);
    lines.push("");
    lines.push(`**Where this market is:** ${active.market_direction}`);
    lines.push("");
    lines.push("## Shortlist");
    for (const rm of active.representative_models) {
      const v = verdictFor(rm);
      const flag = v?.kind === "fail" ? ` — EXCLUDED by constraints (${v.reasons.join("; ")})` : "";
      const unknown = v?.kind === "pass" && v.unknowns.length ? ` — verify: ${v.unknowns.join("; ")}` : "";
      lines.push(`### ${rm.label} (${rm.access_note})${flag}${unknown}`);
      lines.push(`- **Choose it when:** ${rm.choose_when}`);
      lines.push(`- **Think twice when:** ${rm.avoid_when}`);
      lines.push(`- **Trade-offs:** ${rm.trade_offs}`);
    }
    lines.push("");
    lines.push("## What should drive the decision");
    active.decision_factors.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
    lines.push("");
    lines.push(`Evidence and full records: ${window.location.origin}${window.location.pathname}?cmp=${active.workload}`);
    copy(lines.join("\n"), "Brief copied — paste it into your doc.");
  };

  const copyPairBrief = () => {
    if (!a || !b) return;
    const pairing =
      (a.alternatives ?? []).find((x) => x.model_id === b.id) ??
      (b.alternatives ?? []).find((x) => x.model_id === a.id);
    const specLine = (m: Model) =>
      [
        parseReleased(m.released).display,
        m.access ? (ACCESS_LABEL[m.access] ?? m.access) : "access not on file",
        m.license ?? "license not on file",
        `context in ${fmtTokens(m.context?.input_tokens)}`,
      ].join(" · ");
    const claimLine = (m: Model) => {
      const c = chooseClaim(m);
      return c ? `${c.claim} [${c.evidence_grade}]` : "no graded use-case claim on file";
    };
    const lines = [
      `# ${a.name} vs ${b.name} — head-to-head`,
      `Independent advisory, verified ${data.meta.snapshot_date}.`,
      "",
      `**Choose ${a.name} when:** ${claimLine(a)}`,
      `**Choose ${b.name} when:** ${claimLine(b)}`,
      ...(pairing ? ["", `**Trade-offs, both ways:** ${pairing.trade_offs}`] : []),
      "",
      `**${a.name}:** ${specLine(a)}`,
      `**${b.name}:** ${specLine(b)}`,
      "",
      `Full evidence: ${window.location.origin}${window.location.pathname}?pa=${a.id}&b=${b.id}`,
    ];
    copy(lines.join("\n"), "Brief copied — paste it into your doc.");
  };

  // Head-to-head mode: a model A is on the table.
  if (a) {
    return (
      <div className="advisor">
        <div className="advisor-modes">
          <button className="seg-btn" onClick={onExitCompare}>
            ← buyer&apos;s guides
          </button>
          <span className="advisor-mode-on">head-to-head</span>
          {b && (
            <button className="btn-compare brief-btn" onClick={copyPairBrief}>
              Copy brief
            </button>
          )}
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

  const survivors = active
    ? active.representative_models.filter((rm) => verdictFor(rm)?.kind !== "fail")
    : [];
  const firstFail = active
    ? active.representative_models
        .map((rm) => ({ rm, v: verdictFor(rm) }))
        .find((x) => x.v?.kind === "fail")
    : undefined;

  return (
    <div className="advisor">
      <section className="ask">
        <h2 className="ask-title">
          What are you choosing a <em>model</em> for?
        </h2>
        <p className="ask-sub">
          Pick the workload. Every shortlist shows its reasoning, every claim carries its evidence
          grade — and no vendor is the house answer.
        </p>
      </section>

      <div className="guide-rail rail-big" role="tablist" aria-label="Workloads">
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

      <div className="cbar" role="group" aria-label="Constraints">
        <span className="flabel">your constraints</span>
        <label className="cbar-check">
          <input
            type="checkbox"
            checked={constraints.cOpen}
            onChange={(e) => onConstraint({ cOpen: e.target.checked })}
          />
          Open weights only
        </label>
        <select
          aria-label="Vendor origin"
          value={constraints.cOrigin ?? ""}
          onChange={(e) => onConstraint({ cOrigin: e.target.value || null })}
        >
          {ORIGIN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Minimum context window"
          value={constraints.cCtx ?? 0}
          onChange={(e) => onConstraint({ cCtx: Number(e.target.value) || null })}
        >
          {CTX_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {cActive && (
          <button
            className="chip-clear"
            onClick={() => onConstraint({ cOpen: false, cOrigin: null, cCtx: null })}
          >
            Clear constraints
          </button>
        )}
      </div>

      {active && (
        <section className="guide" aria-label={wlLabel(active.workload)}>
          <div className="guide-direction">
            <div className="guide-head-row">
              <h3>{wlLabel(active.workload)}</h3>
              <button className="btn-compare brief-btn" onClick={copyGuideBrief}>
                Copy brief
              </button>
            </div>
            <p className="guide-market">
              <span className="gcard-tag">where this market is</span>{" "}
              <span className="judgment">{active.market_direction}</span>
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

          {cActive && survivors.length === 0 && (
            <div className="cbar-empty">
              <p>
                <b>No shortlisted option passes these constraints.</b>
                {firstFail && (
                  <>
                    {" "}
                    Closest miss: {firstFail.rm.label} — fails on{" "}
                    {firstFail.v?.kind === "fail" ? firstFail.v.reasons.join("; ") : ""}.
                  </>
                )}{" "}
                The market may genuinely not offer this yet — that is an answer too.
              </p>
            </div>
          )}

          <div className="guide-grid">
            {active.representative_models.map((rm, i) => (
              <GuideCard
                key={`${active.workload}-${i}`}
                rm={rm}
                verdict={verdictFor(rm)}
                ready={ready}
                onOpenRecord={onOpenRecord}
                onStartCompare={onChangeA}
              />
            ))}
          </div>
          <p className="guide-note">
            Shortlists are representative, not exhaustive — the timeline holds all{" "}
            {ready ? data.models.length : "276"} models. Start a comparison from any card, or pick
            any two models below.
          </p>
          <div className="flow-next">
            <span className="flabel">next in the flow</span>
            {(() => {
              const first = active.representative_models.find((rm) => rm.model_id);
              return first ? (
                <button
                  className="chip jr-c3"
                  onClick={() => onChangeA(first.model_id!)}
                  disabled={!ready}
                >
                  <i aria-hidden>3</i> put two head-to-head
                </button>
              ) : null;
            })()}
            {onMaturity && (
              <button className="chip jr-c4" onClick={onMaturity}>
                <i aria-hidden>4</i> check market maturity
              </button>
            )}
          </div>
        </section>
      )}

      <div className="advisor-start">
        <label htmlFor="advisor-start-a">Compare any two models:</label>
        <select
          id="advisor-start-a"
          value=""
          disabled={!ready}
          onChange={(e) => e.target.value && onChangeA(e.target.value)}
        >
          <option value="">{ready ? "Choose model A…" : "Loading the universe…"}</option>
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
