"use client";

import { useMemo, useState } from "react";
import { ASSERTIONS, JUDGMENTS, THINKERS, claimsOf } from "@/lib/atlas/data";
import { DEFAULT_WEIGHTS, scoreAll } from "@/lib/atlas/scoring";
import { COHORTS, PERIOD_ORDER } from "@/lib/atlas/taxonomy";
import type { Cohort } from "@/lib/atlas/types";
import { Avatar, ExportMenu, SectionHead, useAtlas } from "./Shared";
import { PERIOD_SHORT } from "./periodLabels";

export default function Minds() {
  const { open } = useAtlas();
  const [cohort, setCohort] = useState<Cohort | "all">("all");
  const [q, setQ] = useState("");
  const rows = useMemo(() => scoreAll(THINKERS, ASSERTIONS, JUDGMENTS, DEFAULT_WEIGHTS, {}, 150), []);
  const rowBy = new Map(rows.map((r) => [r.thinkerId, r]));
  const list = THINKERS.filter((t) => (cohort === "all" || t.cohort === cohort) && (!q || `${t.name} ${t.bio} ${t.roles.map((r) => r.org).join(" ")}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 03 · The 30 minds" title="Thirty mental models, traced through time"
        right={<ExportMenu name="atlas-thinkers" json={() => THINKERS} rows={() => THINKERS.map((t) => ({ id: t.id, name: t.name, cohort: t.cohort, roles: t.roles.map((r) => `${r.title}, ${r.org} (${r.from}–${r.to ?? "now"})`), claims: claimsOf(t.id).length, ...Object.fromEntries(Object.entries(t.selection).map(([k, v]) => [`sel_${k}`, v[0]])) }))} />}>
        Selected on six criteria — influence, foresight, ability to steer technology or capital, contribution, quality of public record, and future
        influence — not fame or valuation. Each card shows the verdict mix of their documented claims and the periods in which they were on record.
      </SectionHead>

      <div className="at-row" style={{ marginBottom: 16 }}>
        <div className="at-seg" role="group" aria-label="Cohort">
          <button aria-pressed={cohort === "all"} onClick={() => setCohort("all")}>All 30</button>
          {COHORTS.map((c) => <button key={c.id} aria-pressed={cohort === c.id} onClick={() => setCohort(c.id)}>{c.name}</button>)}
        </div>
        <input className="at-input" placeholder="Search name, org…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: 260 }} aria-label="Search thinkers" />
      </div>

      {COHORTS.filter((c) => cohort === "all" || c.id === cohort).map((c) => {
        const people = list.filter((t) => t.cohort === c.id);
        if (!people.length) return null;
        return (
          <section key={c.id} style={{ marginBottom: 28 }}>
            <div className="at-row" style={{ marginBottom: 10 }}>
              <span style={{ color: c.color, fontSize: 18 }} aria-hidden="true">{c.shape === "circle" ? "●" : c.shape === "square" ? "■" : "◆"}</span>
              <h3 className="at-h3" style={{ margin: 0, fontSize: 18 }}>{c.name}</h3>
              <span className="at-xs at-faint">({people.length})</span>
            </div>
            <div className="at-grid at-g3">
              {people.map((t) => {
                const claims = claimsOf(t.id);
                const r = rowBy.get(t.id)!;
                const n = { correct: 0, partial: 0, incorrect: 0, unresolved: 0 } as Record<string, number>;
                claims.forEach((a) => n[a.verdict]++);
                const periods = new Set(t.mentalModel.map((m) => m.period));
                const latest = [...t.mentalModel].sort((a, b) => PERIOD_ORDER.indexOf(b.period) - PERIOD_ORDER.indexOf(a.period))[0];
                return (
                  <button key={t.id} className="at-card at-pad" style={{ textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: 10 }} onClick={() => open({ kind: "thinker", id: t.id })}>
                    <div className="at-row" style={{ flexWrap: "nowrap", gap: 12 }}>
                      <Avatar id={t.id} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 650 }}>{t.name}</div>
                        <div className="at-xs at-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.roles.slice(-1).map((x) => `${x.title}, ${x.org}`)}</div>
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right" }}>
                        <div className="at-mono" style={{ fontSize: 18 }}>{r.insufficient ? "—" : Math.round(r.score * 100)}</div>
                        <div className="at-xs at-faint">{r.insufficient ? "too few" : `#${r.rank}`}</div>
                      </div>
                    </div>
                    {latest && <div className="at-xs at-muted at-clamp3"><b style={{ color: "var(--ink)" }}>Now:</b> {latest.summary}</div>}
                    <div className="at-pill-bar" aria-label={`${n.correct} correct, ${n.partial} partial, ${n.incorrect} incorrect, ${n.unresolved} unresolved`}>
                      {(["correct", "partial", "incorrect", "unresolved"] as const).map((v) => n[v] ? <span key={v} style={{ width: `${(n[v] / Math.max(1, claims.length)) * 100}%`, background: `var(--${v === "correct" ? "agree" : v === "incorrect" ? "disagree" : v})` }} /> : null)}
                    </div>
                    <div className="at-between at-xs at-faint">
                      <span>✓{n.correct} ◐{n.partial} ✕{n.incorrect} ?{n.unresolved}</span>
                      <span className="at-row" style={{ gap: 2 }} aria-label="Periods on record">
                        {PERIOD_ORDER.map((p) => <span key={p} title={PERIOD_SHORT[p]} style={{ width: 9, height: 9, borderRadius: 2, background: periods.has(p) ? "var(--night)" : "var(--line)" }} />)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
