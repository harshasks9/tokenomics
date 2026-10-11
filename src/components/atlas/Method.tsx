"use client";

import { useMemo, useState } from "react";
import {
  ASSERTIONS, DEBATES, EVENTS, EVIDENCE, IMPLICATIONS, JUDGMENTS, METHOD, METRICS, PERIODS, RELATIONS, SCENARIOS, SYNTHESIS,
  TECHNOLOGIES, THESES, THINKERS, thinkerById,
} from "@/lib/atlas/data";
import { DIMENSIONS, MIN_SCORED, MIN_WEIGHT } from "@/lib/atlas/scoring";
import { COHORTS, CUTOFF, LAYERS } from "@/lib/atlas/taxonomy";
import { CohortTag, EvidenceCard, ExportMenu, SectionHead } from "./Shared";

const CRIT = ["influence", "foresight", "allocation", "contribution", "corpus", "future"] as const;
const CRIT_LABEL: Record<(typeof CRIT)[number], string> = {
  influence: "Influence", foresight: "Foresight", allocation: "Steers tech/capital", contribution: "Contribution", corpus: "Public record", future: "Future influence",
};

export default function Method() {
  const [q, setQ] = useState("");
  const [ver, setVer] = useState("");
  const evq = useMemo(() => EVIDENCE.filter((e) => (!ver || e.verification === ver) && (!q || `${e.title} ${e.passage} ${e.publisher} ${e.speaker}`.toLowerCase().includes(q.toLowerCase()))), [q, ver]);
  const stat = { fetched: 0, snippet: 0, recalled: 0 } as Record<string, number>;
  EVIDENCE.forEach((e) => stat[e.verification]++);
  const withUrl = EVIDENCE.filter((e) => e.url).length;
  const primary = EVIDENCE.filter((e) => e.primary).length;

  const all = () => ({ cutoff: CUTOFF, layers: LAYERS, thinkers: THINKERS, assertions: ASSERTIONS, evidence: EVIDENCE, relations: RELATIONS, events: EVENTS, periods: PERIODS, metrics: METRICS, theses: THESES, technologies: TECHNOLOGIES, debates: DEBATES, scenarios: SCENARIOS, implications: IMPLICATIONS, judgments: JUDGMENTS, synthesis: SYNTHESIS, method: METHOD });

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Method & data" title="How the Atlas was built — and where it is weak"
        right={<ExportMenu name="ai-intelligence-atlas-dataset" json={all} />}>
        Six stages: research → knowledge modeling → historical evaluation → visualization → forward analysis → independent audit. All data is
        exportable; the full dataset download above contains every entity with its stable id.
      </SectionHead>

      <div className="at-grid at-g4" style={{ marginBottom: 18 }}>
        <Kpi v={THINKERS.length} l="thinkers in three cohorts" />
        <Kpi v={ASSERTIONS.length} l="dated assertions with verdicts" />
        <Kpi v={EVIDENCE.length} l={`evidence records (${primary} primary)`} />
        <Kpi v={THESES.length + DEBATES.length} l={`theses (${THESES.length}) and debates (${DEBATES.length})`} />
      </div>

      <div className="at-card at-pad" style={{ marginBottom: 18 }}>
        <div className="at-h3">Evidence quality — read this first</div>
        <div className="at-pill-bar" style={{ height: 14, margin: "8px 0" }}>
          <span style={{ width: `${(stat.fetched / EVIDENCE.length) * 100}%`, background: "var(--agree)" }} />
          <span style={{ width: `${(stat.snippet / EVIDENCE.length) * 100}%`, background: "#6f93dd" }} />
          <span style={{ width: `${(stat.recalled / EVIDENCE.length) * 100}%`, background: "var(--unresolved)" }} />
        </div>
        <div className="at-row at-xs at-muted">
          <span>● {stat.fetched} source opened</span><span style={{ color: "#3b62b8" }}>● {stat.snippet} search-verified</span><span style={{ color: "var(--unresolved-text)" }}>● {stat.recalled} unverified recall</span><span>· {withUrl} with a citation URL</span>
        </div>
        <p className="at-small" style={{ marginBottom: 0 }}>
          Research ran from a sandbox whose network proxy blocked direct page fetches, and the shared web-search quota was exhausted part-way
          through. Items marked <b>search-verified</b> were matched against search-engine extracts of the source; items marked <b>unverified recall</b> are
          attributions drawn from the research model&apos;s background knowledge that could not be re-checked against the source during this build. They are kept
          (removing them would erase well-known positions) but are visibly flagged everywhere, carry lower confidence in scoring, and have no URL unless the
          address was known with confidence. No quotation is presented as verbatim unless it was seen verbatim.
        </p>
      </div>

      <div className="at-card at-pad" style={{ marginBottom: 18 }}>
        <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>Selection of the 30</div>
          <ExportMenu name="atlas-selection" rows={() => THINKERS.map((t) => ({ name: t.name, cohort: t.cohort, ...Object.fromEntries(CRIT.map((c) => [c, t.selection[c][0]])), total: CRIT.reduce((s, c) => s + t.selection[c][0], 0) }))} /></div>
        <p className="at-small at-muted">Each candidate was scored 1–5 on the brief&apos;s six criteria. Popularity, valuation and media visibility were not criteria. People with overlapping roles were assigned one primary cohort (e.g. Suleyman and Liang Wenfeng as builders; Kai-Fu Lee and Aschenbrenner as investors).</p>
        <div className="at-scroll" style={{ maxHeight: 420 }}>
          <table className="at-table">
            <thead><tr><th>Thinker</th><th>Cohort</th>{CRIT.map((c) => <th key={c}>{CRIT_LABEL[c]}</th>)}<th>Total</th></tr></thead>
            <tbody>
              {[...THINKERS].sort((a, b) => CRIT.reduce((s, c) => s + b.selection[c][0], 0) - CRIT.reduce((s, c) => s + a.selection[c][0], 0)).map((t) => (
                <tr key={t.id}>
                  <td className="at-small" style={{ fontWeight: 600 }}>{t.name}</td>
                  <td><CohortTag cohort={t.cohort} /></td>
                  {CRIT.map((c) => <td key={c} className="at-mono at-xs" title={t.selection[c][1]}>{t.selection[c][0]}</td>)}
                  <td className="at-mono at-small">{CRIT.reduce((s, c) => s + t.selection[c][0], 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="at-grid at-g2" style={{ marginBottom: 18 }}>
        <div className="at-card at-pad">
          <div className="at-h3">Considered and excluded</div>
          {COHORTS.map((c) => (
            <div key={c.id} style={{ marginBottom: 10 }}>
              <div className="at-xs at-muted" style={{ fontWeight: 650 }}>{c.name}</div>
              {METHOD.exclusions.filter((e) => e.cohort === c.id).map((e) => <div key={e.name} className="at-small"><b>{e.name}</b> — <span className="at-muted">{e.why}</span></div>)}
            </div>
          ))}
        </div>
        <div className="at-card at-pad">
          <div className="at-h3">Selection & evaluation biases</div>
          <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{METHOD.biases.map((b, i) => <li key={i} style={{ margin: "4px 0" }}>{b}</li>)}</ul>
        </div>
      </div>

      <div className="at-card at-pad" style={{ marginBottom: 18 }}>
        <div className="at-h3">Foresight scorecard</div>
        <div className="at-grid at-g3" style={{ gap: 10 }}>
          {DIMENSIONS.map((d) => <div key={d.id} className="at-ev"><div className="at-between"><b className="at-small">{d.name}</b><span className="at-mono">{d.defaultWeight}%</span></div><div className="at-xs at-muted">{d.desc}</div></div>)}
        </div>
        <ul className="at-small" style={{ marginBottom: 0, paddingLeft: 18 }}>
          <li>Scored: claims whose outcome is observable by {CUTOFF}. Unresolved claims, aspirations, and records that are not forecasts — announcements of the speaker&apos;s own demonstrated results, investments and divestments, advocacy whose outcome the speaker helped cause, and governance acts — are listed but never scored.</li>
          <li>Claim weight = specificity/5 × confidence (high 1, medium 0.75, low 0.5) × kind (prediction/conditional 1, opinion 0.75, strategic action 0.5 — an investment is not proof of belief).</li>
          <li>Values: correct 1, partial 0.5, incorrect 0; a precise (specificity ≥ 4) incorrect claim scores −0.25 — a penalty for material misses.</li>
          <li>Each dimension is shrunk toward 0.5 with two pseudo-claims, normalizing for record length. Fewer than {MIN_SCORED} scorable claims or less than {MIN_WEIGHT.toFixed(1)} total evidential weight → shown as provisional, not ranked.</li>
          <li>Uncertainty: 300-sample seeded bootstrap over each thinker&apos;s scored claims → 80% interval. Overlapping intervals are reported as ties; the sensitivity table re-ranks under five weighting schemes.</li>
          <li>Selective quotation & survivorship: assertions were chosen as each person&apos;s most consequential documented claims, including misses; claims are judged on information available when made; retrospective reinterpretations are recorded under “evolution”, not as the original claim.</li>
          <li>“Updating” is an analyst judgment per thinker, recorded with its reasoning in the audit trail.</li>
        </ul>
      </div>

      {(METHOD.limitations.length > 0 || METHOD.periodRevisions.length > 0) && (
        <div className="at-grid at-g2" style={{ marginBottom: 18 }}>
          <div className="at-card at-pad"><div className="at-h3">Known limitations</div><ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{METHOD.limitations.map((b, i) => <li key={i} style={{ margin: "4px 0" }}>{b}</li>)}</ul></div>
          <div className="at-card at-pad"><div className="at-h3">Period boundary revisions</div><ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{METHOD.periodRevisions.map((b, i) => <li key={i} style={{ margin: "4px 0" }}>{b}</li>)}</ul></div>
        </div>
      )}

      {METHOD.audit.length > 0 && (
        <div className="at-card at-pad" style={{ marginBottom: 18 }}>
          <div className="at-h3">Stage 6 — independent audit log</div>
          <table className="at-table"><thead><tr><th>Date</th><th>Finding</th><th>Action taken</th></tr></thead>
            <tbody>{METHOD.audit.map((a, i) => <tr key={i}><td className="at-mono at-xs">{a.date}</td><td className="at-small">{a.finding}</td><td className="at-small">{a.action}</td></tr>)}</tbody></table>
        </div>
      )}

      <div className="at-card at-pad">
        <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>Evidence database ({evq.length})</div>
          <ExportMenu name="atlas-evidence" rows={() => evq.map((e) => ({ ...e, speaker: thinkerById(e.speaker)?.name ?? e.speaker }))} /></div>
        <div className="at-row" style={{ margin: "10px 0" }}>
          <input className="at-input" placeholder="Search evidence…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search evidence" style={{ flex: "1 1 260px" }} />
          <select className="at-input at-select" value={ver} onChange={(e) => setVer(e.target.value)} aria-label="Verification">
            <option value="">All verification levels</option><option value="fetched">Source opened</option><option value="snippet">Search-verified</option><option value="recalled">Unverified recall</option>
          </select>
        </div>
        <div className="at-grid at-g2" style={{ maxHeight: 640, overflowY: "auto", gap: 10 }}>
          {evq.slice(0, 200).map((e) => <EvidenceCard key={e.id} e={e} />)}
        </div>
        {evq.length > 200 && <div className="at-xs at-faint" style={{ marginTop: 8 }}>Showing 200 of {evq.length} — refine the search or export the full table.</div>}
      </div>
    </div>
  );
}

function Kpi({ v, l }: { v: number; l: string }) {
  return <div className="at-card at-pad at-kpi"><b className="at-num">{v}</b><span>{l}</span></div>;
}
