"use client";

import { useMemo, useRef, useState } from "react";
import { ASSERTIONS, JUDGMENTS, THINKERS, thinkerById } from "@/lib/atlas/data";
import {
  DEFAULT_WEIGHTS, DIMENSIONS, MIN_SCORED, WEIGHT_PRESETS, accuracyBetween, claimValue, claimWeight, isScorable, scoreAll, sensitivity,
  type ClaimFilter, type ScoreRow, type Weights,
} from "@/lib/atlas/scoring";
import { cohortById } from "@/lib/atlas/taxonomy";
import type { Cohort } from "@/lib/atlas/types";
import { Avatar, ExportMenu, KindLabel, SectionHead, VerdictBadge, useAtlas } from "./Shared";

type RankId = "overall" | "builders" | "researchers" | "investors" | "technical" | "economic" | "commercial" | "contrarian" | "improved" | "influential-miss";

const RANKINGS: { id: RankId; name: string; desc: string; filter?: ClaimFilter; cohort?: Cohort }[] = [
  { id: "overall", name: "Most accurate overall", desc: "Composite foresight score across all scorable claims." },
  { id: "builders", name: "Best CEO / builder", desc: "Composite score, CEOs & builders only.", cohort: "builders" },
  { id: "researchers", name: "Best researcher", desc: "Composite score, researchers only.", cohort: "researchers" },
  { id: "investors", name: "Best investor", desc: "Composite score, investors only.", cohort: "investors" },
  { id: "technical", name: "Best technical forecaster", desc: "Only technical claims (architecture, scaling, capabilities).", filter: { categories: ["technical"] } },
  { id: "economic", name: "Best economic & market forecaster", desc: "Only economic and market claims.", filter: { categories: ["economic", "market"] } },
  { id: "commercial", name: "Best grasp of commercialization", desc: "Claims on commoditization, moats, enterprise ROI, coding, hyperscalers and value capture.", filter: { topics: ["commoditization", "app-moats", "enterprise-roi", "value-accrual", "hyperscalers", "coding"] } },
  { id: "contrarian", name: "Most insightful contrarian", desc: "Ranked by the originality dimension: correct calls that went against the consensus of their time." },
  { id: "improved", name: "Most improved thinker", desc: "Updating judgment plus the change in accuracy between pre-2022 and 2022+ claims (needs claims in both eras)." },
  { id: "influential-miss", name: "Most influential thesis that has not held up", desc: "Selection influence × share of scored weight that proved incorrect (min. 3 scored claims). Not a ranking of people's overall worth." },
];

export default function Leaderboard({ who }: { who?: string }) {
  const { open } = useAtlas();
  const [weights, setWeights] = useState<Weights>(DEFAULT_WEIGHTS);
  const [rank, setRank] = useState<RankId>("overall");
  const [sel, setSel] = useState<string | null>(who ?? null);
  const listRef = useRef<HTMLDivElement>(null);
  const R = RANKINGS.find((r) => r.id === rank)!;

  const base = useMemo(() => scoreAll(THINKERS, ASSERTIONS, JUDGMENTS, weights, R.filter ?? {}, 300), [weights, R.filter]);
  const sens = useMemo(() => sensitivity(THINKERS, ASSERTIONS, JUDGMENTS), []);

  const rows: (ScoreRow & { metric?: number; metricLabel?: string })[] = useMemo(() => {
    let r = base.map((x) => ({ ...x }));
    if (R.cohort) {
      r = r.filter((x) => thinkerById(x.thinkerId)?.cohort === R.cohort);
      const ranked = r.filter((x) => !x.insufficient).sort((a, b) => b.score - a.score);
      ranked.forEach((x, i) => { x.rank = i + 1; x.tieAbove = i > 0 && x.hi >= ranked[i - 1].lo; });
      r = [...ranked, ...r.filter((x) => x.insufficient)];
    }
    if (rank === "contrarian" || rank === "improved" || rank === "influential-miss") {
      const withMetric = r.map((x) => {
        const t = thinkerById(x.thinkerId)!;
        let metric: number | undefined;
        if (rank === "contrarian") metric = x.insufficient ? undefined : x.dims.originality;
        if (rank === "improved") {
          const mine = ASSERTIONS.filter((a) => a.thinkerId === x.thinkerId);
          const early = accuracyBetween(mine, 2000, 2021), late = accuracyBetween(mine, 2022, 2026);
          metric = early && late ? 0.5 * x.dims.updating + 0.5 * Math.max(0, Math.min(1, 0.5 + (late.value - early.value))) : undefined;
        }
        if (rank === "influential-miss") {
          let w = 0, bad = 0;
          for (const a of x.scored) { const cw = claimWeight(a); w += cw; if (a.verdict === "incorrect") bad += cw; else if (a.verdict === "partial") bad += cw * 0.25; }
          metric = x.scored.length >= MIN_SCORED && w > 0 ? (t.selection.influence[0] / 5) * (bad / w) : undefined;
        }
        return { ...x, metric };
      });
      const ranked = withMetric.filter((x) => x.metric != null).sort((a, b) => b.metric! - a.metric!);
      ranked.forEach((x, i) => { x.rank = i + 1; x.tieAbove = false; });
      r = [...ranked, ...withMetric.filter((x) => x.metric == null).map((x) => ({ ...x, insufficient: true }))];
    }
    return r;
  }, [base, R.cohort, rank]);

  const ranked = rows.filter((r) => !r.insufficient);
  const tieTop = ranked.length > 1 && rank !== "contrarian" && rank !== "improved" && rank !== "influential-miss" && ranked[1].hi >= ranked[0].lo;
  const selRow = sel ? base.find((r) => r.thinkerId === sel) : null;
  const total = DIMENSIONS.reduce((s, d) => s + weights[d.id], 0) || 1;
  const usesMetric = rank === "contrarian" || rank === "improved" || rank === "influential-miss";

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 06 · Foresight leaderboard" title="Who saw it most clearly — with error bars"
        right={<ExportMenu name={`atlas-leaderboard-${rank}`} rows={() => rows.map((r) => ({ rank: r.insufficient ? "" : r.rank, name: thinkerById(r.thinkerId)?.name, cohort: thinkerById(r.thinkerId)?.cohort, score: r.score.toFixed(3), lo: r.lo.toFixed(3), hi: r.hi.toFixed(3), scored: r.scored.length, unresolved: r.unresolved, ...Object.fromEntries(DIMENSIONS.map((d) => [d.id, r.dims[d.id].toFixed(3)])), metric: r.metric?.toFixed(3) ?? "" }))} />}>
        Scores use only claims observable by the cutoff, weighted by specificity and confidence, shrunk toward neutral for thin records, and
        penalized for material misses. Bars show 80% bootstrap intervals; overlapping intervals are ties, not wins.
      </SectionHead>

      <div className="at-grid" style={{ gridTemplateColumns: "300px minmax(0, 1fr)", alignItems: "start" }}>
        <div className="at-stack" style={{ position: "sticky", top: 70 }}>
          <div className="at-card at-pad">
            <div className="at-h3">Ranking</div>
            <div className="at-stack" style={{ gap: 4 }}>
              {RANKINGS.map((r, i) => (
                <button key={r.id} className="at-btn sm" style={{ justifyContent: "flex-start", textAlign: "left" }} aria-pressed={rank === r.id} onClick={() => setRank(r.id)}>
                  <span className="at-mono at-faint" style={{ width: 18 }}>{i + 1}</span>{r.name}
                </button>
              ))}
            </div>
          </div>
          <div className="at-card at-pad">
            <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>Weights</div><button className="at-link at-xs" onClick={() => setWeights(DEFAULT_WEIGHTS)}>reset</button></div>
            <div className="at-row" style={{ gap: 4, margin: "8px 0 10px" }}>
              {WEIGHT_PRESETS.map((p) => <button key={p.id} className="at-chip" style={{ minHeight: 24, fontSize: 11.5 }} onClick={() => setWeights(p.weights)}>{p.name}</button>)}
            </div>
            {DIMENSIONS.map((d) => (
              <label key={d.id} className="at-stack" style={{ gap: 2, marginBottom: 8 }} title={d.desc}>
                <span className="at-xs" style={{ fontWeight: 600 }}>{d.name}</span>
                <span className="at-slider">
                  <input type="range" className="at-range" min={0} max={50} step={1} value={weights[d.id]} onChange={(e) => setWeights((w) => ({ ...w, [d.id]: Number(e.target.value) }))} aria-label={`${d.name} weight`} />
                  <span className="at-mono at-xs" style={{ textAlign: "right" }}>{Math.round((weights[d.id] / total) * 100)}%</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="at-stack" style={{ gap: 14 }}>
          <div className="at-card at-pad" ref={listRef}>
            <div className="at-between" style={{ marginBottom: 6 }}>
              <div><div className="at-h3" style={{ margin: 0 }}>{R.name}</div><div className="at-xs at-muted">{R.desc}</div></div>
              {usesMetric && <KindLabel k="interp" />}
            </div>
            {tieTop && <div className="at-forecast-banner" style={{ background: "#eef2fb", color: "#26407e", borderColor: "#9fb3e0", marginBottom: 8 }}>No clear winner: the top two intervals overlap — the evidence does not justify a single champion here.</div>}
            {ranked.length === 0 && <div className="at-empty">Not enough scorable claims for this ranking.</div>}
            {ranked.map((r) => <Row key={r.thinkerId} r={r} sel={sel === r.thinkerId} onClick={() => setSel(r.thinkerId)} metric={usesMetric} />)}
            {rows.some((r) => r.insufficient) && (
              <div className="at-xs at-faint" style={{ marginTop: 10 }}>
                Not ranked ({usesMetric ? "insufficient data for this lens" : `fewer than ${MIN_SCORED} scorable claims`}): {rows.filter((r) => r.insufficient).map((r) => `${thinkerById(r.thinkerId)?.name} (${r.scored.length})`).join(", ")}
              </div>
            )}
          </div>

          {selRow && <Audit row={selRow} weights={weights} sensRow={sens[selRow.thinkerId]} onClaim={(id) => open({ kind: "claim", id })} onPerson={() => open({ kind: "thinker", id: selRow.thinkerId })} />}

          <div className="at-card at-pad">
            <div className="at-h3">Sensitivity: rank under alternative weightings</div>
            <p className="at-xs at-muted" style={{ marginTop: 0 }}>A ranking that flips under reasonable alternatives should not be read as settled. Range = best–worst rank across the five schemes.</p>
            <div className="at-scroll">
              <table className="at-table">
                <thead><tr><th>Thinker</th>{WEIGHT_PRESETS.map((p) => <th key={p.id}>{p.name}</th>)}<th>Range</th></tr></thead>
                <tbody>
                  {Object.entries(sens).filter(([, v]) => v.default > 0).sort((a, b) => a[1].default - b[1].default).map(([id, v]) => {
                    const rs = Object.values(v).filter((x) => x > 0);
                    const range = Math.max(...rs) - Math.min(...rs);
                    return (
                      <tr key={id} className="click" onClick={() => setSel(id)}>
                        <td className="at-small" style={{ fontWeight: 600 }}>{thinkerById(id)?.name}</td>
                        {WEIGHT_PRESETS.map((p) => <td key={p.id} className="at-mono at-xs">{v[p.id] || "—"}</td>)}
                        <td className="at-mono at-xs" style={{ color: range >= 6 ? "var(--disagree)" : range >= 3 ? "var(--unresolved-text)" : "var(--agree)" }}>±{range}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ r, sel, onClick, metric }: { r: ScoreRow & { metric?: number }; sel: boolean; onClick: () => void; metric: boolean }) {
  const t = thinkerById(r.thinkerId)!;
  const c = cohortById(t.cohort).color;
  const v = metric ? r.metric ?? 0 : r.score;
  return (
    <div className={`at-lb-row ${sel ? "sel" : ""}`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
      aria-label={`Rank ${r.rank}: ${t.name}, score ${Math.round(v * 100)}${metric ? "" : `, interval ${Math.round(r.lo * 100)} to ${Math.round(r.hi * 100)}`}`}>
      <span className="rk">{r.rank}{r.tieAbove ? "=" : ""}</span>
      <span className="at-row" style={{ flexWrap: "nowrap", gap: 10, minWidth: 0 }}>
        <Avatar id={t.id} />
        <span style={{ minWidth: 0 }}>
          <span className="at-small" style={{ fontWeight: 650, display: "block" }}>{t.name}</span>
          <span className="at-xs at-faint">{r.scored.length} scored · {r.unresolved} pending</span>
        </span>
      </span>
      <span className="at-ci" aria-hidden="true">
        <span className="axis" />
        {!metric && <span className="band" style={{ left: `${r.lo * 100}%`, width: `${Math.max(1, (r.hi - r.lo) * 100)}%`, background: c }} />}
        <span className="pt" style={{ left: `${v * 100}%`, background: c }} />
      </span>
      <span className="at-mono" style={{ textAlign: "right", fontSize: 15 }}>{Math.round(v * 100)}</span>
    </div>
  );
}

function Audit({ row, weights, sensRow, onClaim, onPerson }: { row: ScoreRow; weights: Weights; sensRow?: Record<string, number>; onClaim: (id: string) => void; onPerson: () => void }) {
  const t = thinkerById(row.thinkerId)!;
  const j = JUDGMENTS.find((x) => x.thinkerId === row.thinkerId);
  const pending = ASSERTIONS.filter((a) => a.thinkerId === row.thinkerId && !isScorable(a));
  const total = DIMENSIONS.reduce((s, d) => s + weights[d.id], 0) || 1;
  return (
    <div className="at-card at-pad">
      <div className="at-between">
        <div className="at-row"><Avatar id={t.id} /><div><div className="at-h3" style={{ margin: 0 }}>Audit trail · {t.name}</div><div className="at-xs at-muted">Score {Math.round(row.score * 100)} (80% interval {Math.round(row.lo * 100)}–{Math.round(row.hi * 100)}){sensRow ? ` · rank range across weightings ${Math.min(...Object.values(sensRow).filter(Boolean))}–${Math.max(...Object.values(sensRow))}` : ""}</div></div></div>
        <button className="at-btn sm" onClick={onPerson}>Profile</button>
      </div>
      <div className="at-grid at-g3" style={{ gap: 8, margin: "12px 0" }}>
        {DIMENSIONS.map((d) => (
          <div key={d.id} className="at-ev" style={{ padding: "7px 10px" }}>
            <div className="at-between at-xs"><span className="at-muted">{d.name}</span><b className="at-mono">{Math.round(row.dims[d.id] * 100)}</b></div>
            <div className="at-xs at-faint">contributes {((weights[d.id] / total) * row.dims[d.id] * 100).toFixed(1)} pts</div>
          </div>
        ))}
      </div>
      {j && <p className="at-xs" style={{ margin: "0 0 10px" }}><KindLabel k="interp" /> <b>Updating ({j.updating}/5):</b> {j.updatingWhy} <b>Right reasons:</b> {j.rightReasons}</p>}
      <div className="at-scroll">
        <table className="at-table">
          <thead><tr><th>Date</th><th>Claim</th><th>Verdict</th><th title="specificity/5 × confidence × kind">Weight</th><th>Value</th><th>Orig.</th><th>Reasons</th><th>Timing</th></tr></thead>
          <tbody>
            {row.scored.map((a) => (
              <tr key={a.id} className="click" onClick={() => onClaim(a.id)}>
                <td className="at-mono at-xs">{a.date}</td>
                <td className="at-small" style={{ minWidth: 260 }}><span className="at-clamp2">{a.claim}</span></td>
                <td><VerdictBadge v={a.verdict} /></td>
                <td className="at-mono at-xs">{claimWeight(a).toFixed(2)}</td>
                <td className="at-mono at-xs" style={{ color: claimValue(a) < 0 ? "var(--disagree)" : undefined }}>{claimValue(a).toFixed(2)}</td>
                <td className="at-mono at-xs">{a.originality}</td>
                <td className="at-mono at-xs">{a.causal ?? "—"}</td>
                <td className="at-xs">{a.timing}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pending.length > 0 && <p className="at-xs at-faint" style={{ marginBottom: 0 }}>Excluded (unresolved or aspirational): {pending.length} — {pending.map((a) => a.date).join(", ")}</p>}
    </div>
  );
}
