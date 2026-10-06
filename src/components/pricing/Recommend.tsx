"use client";

import { useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { Model, WorkloadInput, WorkloadPreset } from "@/lib/pricing/types";
import { benchById } from "@/lib/pricing/benchmarks";
import { providerById, providerColor } from "@/lib/pricing/presets";
import { estimateCost, fmtUsd, unmetRequirements } from "@/lib/pricing/calc";

/**
 * Decision support: lowest-cost model meeting the preset's requirements,
 * with alternatives explained by visible criteria. Requirements are editable
 * in place; the preset only seeds them.
 */
export default function Recommend({ models, workload, preset }: { models: Model[]; workload: WorkloadInput; preset: WorkloadPreset }) {
  const [drop, setDrop] = useState<Set<string>>(new Set());
  const effective: WorkloadPreset = useMemo(() => {
    const r = { ...preset.requires };
    if (drop.has("minContextK")) delete r.minContextK;
    if (drop.has("toolCalling")) delete r.toolCalling;
    if (drop.has("structuredOutput")) delete r.structuredOutput;
    if (drop.has("reasoning")) delete r.reasoning;
    if (drop.has("modalitiesIn")) delete r.modalitiesIn;
    if (drop.has("minBench")) delete r.minBench;
    return { ...preset, requires: r };
  }, [preset, drop]);

  const { winner, alts, failing } = useMemo(() => {
    const scored = models.map((m) => ({ m, c: estimateCost(m, workload), fails: unmetRequirements(m, effective) }));
    const ok = scored.filter((s) => s.c.complete && s.fails.length === 0).sort((a, b) => a.c.monthly - b.c.monthly);
    const winner = ok[0] ?? null;
    const qb = effective.qualityBench;
    const alts: { m: Model; monthly: number; why: string; tone: "up" | "dn" | "" }[] = [];
    for (const s of ok.slice(1, 4)) {
      const w = winner!;
      const wb = w.m.benchmarks[qb]?.score;
      const sb = s.m.benchmarks[qb]?.score;
      const pct = Math.round(((s.c.monthly - w.c.monthly) / w.c.monthly) * 100);
      let why = `+${pct}% cost`;
      let tone: "up" | "dn" | "" = "";
      if (wb != null && sb != null) {
        if (sb > wb) {
          why += ` for +${(sb - wb).toFixed(1)} ${benchById(qb)?.short}`;
          tone = "up";
        } else why += `, ${benchById(qb)?.short} ${sb} vs ${wb}`;
      } else if (sb != null && wb == null) {
        why += `; has a ${benchById(qb)?.short} score (${sb}) where the winner has none`;
        tone = "up";
      } else why += "; no comparable quality score to weigh";
      if (s.m.contextK > w.m.contextK) why += `; ${s.m.contextK >= 1000 ? "1M" : s.m.contextK + "k"} context`;
      alts.push({ m: s.m, monthly: s.c.monthly, why, tone });
    }
    // Cheaper-but-disqualified: the ones a buyer will ask about.
    const failing = scored
      .filter((s) => s.c.complete && s.fails.length > 0 && (!winner || s.c.monthly < winner.c.monthly))
      .sort((a, b) => a.c.monthly - b.c.monthly)
      .slice(0, 4);
    return { winner, alts, failing };
  }, [models, workload, effective]);

  const reqChips: { key: string; label: string }[] = [];
  if (preset.requires.minContextK) reqChips.push({ key: "minContextK", label: `context ≥ ${preset.requires.minContextK}k` });
  if (preset.requires.toolCalling) reqChips.push({ key: "toolCalling", label: "tool calling" });
  if (preset.requires.structuredOutput) reqChips.push({ key: "structuredOutput", label: "structured output" });
  if (preset.requires.reasoning) reqChips.push({ key: "reasoning", label: "reasoning mode" });
  if (preset.requires.modalitiesIn) reqChips.push({ key: "modalitiesIn", label: `${preset.requires.modalitiesIn.join("+")} input` });
  if (preset.requires.minBench) reqChips.push({ key: "minBench", label: `${preset.requires.minBench.benchId} ≥ ${preset.requires.minBench.score}` });

  const toggle = (k: string) =>
    setDrop((d) => {
      const n = new Set(d);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  return (
    <div className="px-reco">
      <div>
        <div className="px-card px-reco-win">
          <div className="k">Lowest cost that meets “{preset.name}” requirements</div>
          {winner ? (
            <>
              <div className="nm">
                <span style={{ color: providerColor(winner.m.provider), marginRight: 8 }} aria-hidden>
                  {providerById(winner.m.provider).glyph}
                </span>
                {winner.m.name}
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-3)", marginLeft: 8 }}>{providerById(winner.m.provider).name}</span>
              </div>
              <div className="cost">
                {fmtUsd(winner.c.monthly)} <span className="u">per month at your workload</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{winner.m.tradeoff}</div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: "var(--ink-2)" }}>No visible model meets every requirement. Relax a requirement below or widen the filters.</div>
          )}
          <ul className="px-crit">
            <li style={{ color: "var(--ink)", fontWeight: 600 }}>Criteria (click to drop / restore):</li>
            {reqChips.map((r) => (
              <li key={r.key}>
                <button className={`px-chip ${drop.has(r.key) ? "" : "on"}`} onClick={() => toggle(r.key)} style={{ padding: "2px 9px" }} aria-pressed={!drop.has(r.key)}>
                  {drop.has(r.key) ? <X size={11} /> : <Check size={11} />} {r.label}
                </button>
              </li>
            ))}
            <li>
              <span style={{ color: "var(--ink-3)" }}>+ published token pricing · ranked by monthly cost for the calculator workload · quality proxy: {benchById(preset.qualityBench)?.short}</span>
            </li>
          </ul>
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", margin: "4px 0 8px" }}>Alternatives that also qualify</div>
        {alts.length === 0 && <div className="px-card px-fail">No other qualifying model is visible.</div>}
        {alts.map((a) => (
          <div key={a.m.id} className="px-card px-alt">
            <div className="h">
              <span className="nm">
                <span style={{ color: providerColor(a.m.provider), marginRight: 6 }} aria-hidden>
                  {providerById(a.m.provider).glyph}
                </span>
                {a.m.name}
              </span>
              <span className="c">{fmtUsd(a.monthly, { compact: true })}/mo</span>
            </div>
            <div className="why">
              <span className={a.tone}>{a.why}</span>
            </div>
          </div>
        ))}
        {failing.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-3)", margin: "14px 0 8px" }}>Cheaper, but disqualified</div>
            {failing.map((f) => (
              <div key={f.m.id} className="px-card px-alt">
                <div className="h">
                  <span className="nm">{f.m.name}</span>
                  <span className="c">{fmtUsd(f.c.monthly, { compact: true })}/mo</span>
                </div>
                <div className="why">
                  <span className="dn">fails: {f.fails.join(", ")}</span>
                </div>
              </div>
            ))}
          </>
        )}
        <div className="px-fail">
          This is a shortlist by visible criteria, not a verdict: run your own evals on the top two or three before committing. Benchmark coverage is uneven for the newest
          releases, so a model with no score is not a model with a low score.
        </div>
      </div>
    </div>
  );
}
