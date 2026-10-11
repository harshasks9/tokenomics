"use client";

import { useMemo, useState } from "react";
import { ASSERTIONS, THINKERS, evidenceById, thinkerById } from "@/lib/atlas/data";
import { CATEGORIES, COHORTS, LAYERS, TOPICS, VERDICT_META } from "@/lib/atlas/taxonomy";
import type { Assertion, Verdict } from "@/lib/atlas/types";
import { Avatar, ExportMenu, SectionHead, VerdictBadge, useAtlas } from "./Shared";

type SortKey = "date" | "person" | "verdict" | "specificity";

const evidenceGrade = (a: Assertion): "verified" | "mixed" | "recalled" => {
  const ev = a.evidenceIds.map(evidenceById).filter(Boolean);
  if (!ev.length) return "recalled";
  const rec = ev.filter((e) => e!.verification === "recalled").length;
  return rec === 0 ? "verified" : rec === ev.length ? "recalled" : "mixed";
};

export default function Courtroom({ params }: { params: Record<string, string> }) {
  const { open } = useAtlas();
  const [q, setQ] = useState(params.q ?? "");
  const [who, setWho] = useState(params.who ?? "");
  const [cohort, setCohort] = useState("");
  const [verdict, setVerdict] = useState<Verdict | "">((params.verdict as Verdict) ?? "");
  const [kind, setKind] = useState("");
  const [category, setCategory] = useState("");
  const [topic, setTopic] = useState(params.topic ?? "");
  const [layer, setLayer] = useState("");
  const [grade, setGrade] = useState("");
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: "date", dir: 1 });

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const r = ASSERTIONS.filter((a) => {
      const t = thinkerById(a.thinkerId);
      return (!who || a.thinkerId === who) && (!cohort || t?.cohort === cohort) && (!verdict || a.verdict === verdict) &&
        (!kind || a.kind === kind) && (!category || a.category === category) && (!topic || a.topics.includes(topic as never)) &&
        (!layer || a.layers.includes(layer as never)) && (!grade || evidenceGrade(a) === grade) &&
        (!ql || `${a.claim} ${a.outcome} ${t?.name} ${a.predictedOutcome}`.toLowerCase().includes(ql));
    });
    const vo: Record<Verdict, number> = { correct: 0, partial: 1, incorrect: 2, unresolved: 3 };
    return r.sort((x, y) => {
      const d = sort.k === "date" ? x.date.localeCompare(y.date) : sort.k === "person" ? (thinkerById(x.thinkerId)?.name ?? "").localeCompare(thinkerById(y.thinkerId)?.name ?? "")
        : sort.k === "verdict" ? vo[x.verdict] - vo[y.verdict] : x.specificity - y.specificity;
      return d * sort.dir;
    });
  }, [q, who, cohort, verdict, kind, category, topic, layer, grade, sort]);

  const landmark = useMemo(() => ASSERTIONS.filter((a) => a.verdict !== "unresolved" && a.specificity >= 4 && (a.originality >= 4 || a.confidence === "high"))
    .sort((a, b) => b.specificity + b.originality - (a.specificity + a.originality) || a.date.localeCompare(b.date)).slice(0, 8), []);

  const counts = Object.fromEntries((["correct", "partial", "incorrect", "unresolved"] as Verdict[]).map((v) => [v, rows.filter((a) => a.verdict === v).length]));
  const th = (k: SortKey, label: string) => (
    <th aria-sort={sort.k === k ? (sort.dir === 1 ? "ascending" : "descending") : "none"}>
      <button onClick={() => setSort((s) => ({ k, dir: s.k === k ? (s.dir === 1 ? -1 : 1) : 1 }))}>{label}{sort.k === k ? (sort.dir === 1 ? " ↑" : " ↓") : ""}</button>
    </th>
  );
  const reset = () => { setQ(""); setWho(""); setCohort(""); setVerdict(""); setKind(""); setCategory(""); setTopic(""); setLayer(""); setGrade(""); };

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 05 · Prediction courtroom" title="Every consequential claim, on trial"
        right={<ExportMenu name="atlas-assertions" json={() => rows}
          rows={() => rows.map((a) => ({ id: a.id, person: thinkerById(a.thinkerId)?.name, date: a.date, claim: a.claim, kind: a.kind, category: a.category, layers: a.layers, topics: a.topics, assumptions: a.assumptions, predicted: a.predictedOutcome, horizon: a.horizon, outcome: a.outcome, verdict: a.verdict, timing: a.timing, confidence: a.confidence, rationale: a.verdictRationale, sources: a.evidenceIds.map((id) => evidenceById(id)?.url).filter(Boolean), outcome_sources: a.outcomeEvidenceIds.map((id) => evidenceById(id)?.url).filter(Boolean) }))} />}>
        Original claim, context and evidence available at the time, what actually happened by October 11, 2026, and a reasoned verdict.
        Predictions are separated from opinions, aspirations, conditional statements and strategic actions; deadlines not yet reached stay unresolved.
      </SectionHead>

      {landmark.length > 0 && (
        <>
          <div className="at-eyebrow">Landmark cases</div>
          <div className="at-grid at-g4" style={{ marginBottom: 26 }}>
            {landmark.map((a) => (
              <button key={a.id} className="at-card at-pad" style={{ textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 8 }} onClick={() => open({ kind: "claim", id: a.id })}>
                <div className="at-row"><Avatar id={a.thinkerId} /><div><div className="at-small" style={{ fontWeight: 650 }}>{thinkerById(a.thinkerId)?.name}</div><div className="at-xs at-faint at-mono">{a.date}</div></div></div>
                <div className="at-small at-clamp3" style={{ fontFamily: "var(--font-serif), Georgia, serif", fontSize: 15 }}>{a.claimIsQuote ? `“${a.claim}”` : a.claim}</div>
                <div style={{ marginTop: "auto" }}><VerdictBadge v={a.verdict} solid /></div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="at-card at-pad" style={{ marginBottom: 12 }}>
        <div className="at-row" style={{ gap: 8 }}>
          <input className="at-input" placeholder="Search claims, outcomes, people…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: "1 1 240px" }} aria-label="Search claims" />
          <Sel v={who} set={setWho} label="Person" opts={THINKERS.map((t) => [t.id, t.name])} />
          <Sel v={cohort} set={setCohort} label="Cohort" opts={COHORTS.map((c) => [c.id, c.short])} />
          <Sel v={verdict} set={(x) => setVerdict(x as Verdict | "")} label="Verdict" opts={Object.entries(VERDICT_META).map(([k, m]) => [k, m.label])} />
          <Sel v={kind} set={setKind} label="Type" opts={[["prediction", "Prediction"], ["conditional", "Conditional"], ["opinion", "Opinion"], ["aspiration", "Aspiration"], ["action", "Strategic action"]]} />
          <Sel v={category} set={setCategory} label="Category" opts={CATEGORIES.map((c) => [c.id, c.name])} />
          <Sel v={topic} set={setTopic} label="Topic" opts={TOPICS.map((t) => [t.id, t.name])} />
          <Sel v={layer} set={setLayer} label="Layer" opts={LAYERS.map((l) => [l.id, `${l.n}. ${l.short}`])} />
          <Sel v={grade} set={setGrade} label="Evidence" opts={[["verified", "Search-verified"], ["mixed", "Mixed"], ["recalled", "Unverified recall"]]} />
          <button className="at-btn sm ghost" onClick={reset}>Reset</button>
        </div>
        <div className="at-row at-xs at-muted" style={{ marginTop: 8 }}>
          <b>{rows.length}</b> claims · ✓ {counts.correct} · ◐ {counts.partial} · ✕ {counts.incorrect} · ? {counts.unresolved}
        </div>
      </div>

      <div className="at-card at-scroll" style={{ maxHeight: "70vh" }}>
        <table className="at-table">
          <thead><tr>{th("date", "Date")}{th("person", "Person")}<th>Claim</th>{th("verdict", "Verdict")}<th>Type</th>{th("specificity", "Specific")}<th>Evidence</th></tr></thead>
          <tbody>
            {rows.map((a) => {
              const g = evidenceGrade(a);
              return (
                <tr key={a.id} className="click" onClick={() => open({ kind: "claim", id: a.id })} tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") open({ kind: "claim", id: a.id }); }}>
                  <td className="at-mono at-xs" style={{ whiteSpace: "nowrap" }}>{a.date}</td>
                  <td style={{ whiteSpace: "nowrap" }}><span className="at-small" style={{ fontWeight: 600 }}>{thinkerById(a.thinkerId)?.name}</span></td>
                  <td style={{ minWidth: 320 }}><div className="at-small at-clamp2">{a.claim}</div><div className="at-xs at-faint at-clamp2">→ {a.outcome}</div></td>
                  <td><VerdictBadge v={a.verdict} /></td>
                  <td className="at-xs">{a.kind}<div className="at-faint">{a.category}</div></td>
                  <td className="at-mono at-xs">{a.specificity}/5</td>
                  <td className="at-xs" style={{ color: g === "recalled" ? "var(--unresolved-text)" : g === "mixed" ? "var(--ink-2)" : "var(--agree)", whiteSpace: "nowrap" }}>
                    {g === "verified" ? "● verified" : g === "mixed" ? "◐ mixed" : "○ recall"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && <div className="at-empty" style={{ margin: 16 }}>No claims match these filters.</div>}
      </div>
    </div>
  );
}

function Sel({ v, set, label, opts }: { v: string; set: (v: string) => void; label: string; opts: [string, string][] }) {
  return (
    <select className="at-input at-select" value={v} onChange={(e) => set(e.target.value)} aria-label={label} style={{ maxWidth: 170 }}>
      <option value="">{label}: all</option>
      {opts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
    </select>
  );
}
