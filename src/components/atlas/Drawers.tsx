"use client";

import { useMemo } from "react";
import {
  ASSERTIONS, JUDGMENTS, RELATIONS, THINKERS, assertionById, claimsOf, nameOf, thesisById, thinkerById,
} from "@/lib/atlas/data";
import { DEFAULT_WEIGHTS, DIMENSIONS, scoreAll } from "@/lib/atlas/scoring";
import { PERIOD_ORDER, topicName } from "@/lib/atlas/taxonomy";
import type { Drawer } from "./Shared";
import {
  Avatar, ClaimLine, CohortTag, ConfidenceMeter, DrawerShell, EvidenceList, KindLabel, LayerTags, PersonLink,
  Rich, StatusBadge, VerdictBadge, useAtlas,
} from "./Shared";
import { PERIOD_LABEL } from "./periodLabels";

export default function Drawers({ drawer, onClose }: { drawer: Drawer; onClose: () => void }) {
  if (!drawer) return null;
  if (drawer.kind === "thinker") return <ThinkerDrawer id={drawer.id} onClose={onClose} />;
  if (drawer.kind === "claim") return <ClaimDrawer id={drawer.id} onClose={onClose} />;
  return (
    <DrawerShell title={drawer.title} sub="Evidence" onClose={onClose}>
      {drawer.context && <p className="at-small at-muted" style={{ marginTop: 0 }}>{drawer.context}</p>}
      <EvidenceList ids={drawer.ids} />
    </DrawerShell>
  );
}

/* ---------- Experience 3 profile ---------- */

const SEL_LABEL: Record<string, string> = {
  influence: "Intellectual influence",
  foresight: "Historical foresight (provisional)",
  allocation: "Steers technology or capital",
  contribution: "Architecture / commercialization",
  corpus: "Documented public thinking",
  future: "Future influence",
};

function ThinkerDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const { open, go } = useAtlas();
  const t = thinkerById(id)!;
  const claims = claimsOf(id);
  const rows = useMemo(() => scoreAll(THINKERS, ASSERTIONS, JUDGMENTS, DEFAULT_WEIGHTS, {}, 200), []);
  const row = rows.find((r) => r.thinkerId === id)!;
  const judgment = JUDGMENTS.find((j) => j.thinkerId === id);
  const rels = RELATIONS.filter((r) => r.from === id || r.to === id);
  const counts = { correct: 0, partial: 0, incorrect: 0, unresolved: 0 } as Record<string, number>;
  claims.forEach((c) => counts[c.verdict]++);

  return (
    <DrawerShell
      onClose={onClose}
      sub={<span className="at-row"><CohortTag cohort={t.cohort} /> {t.roles.map((r) => `${r.title}, ${r.org}`).slice(0, 2).join(" · ")}</span>}
      title={<span className="at-row" style={{ gap: 12 }}><Avatar id={id} size="lg" /> <span className="at-serif" style={{ fontSize: 26 }}>{t.name}</span></span>}
    >
      <p style={{ marginTop: 0 }}>{t.bio}</p>

      <div className="at-card at-pad" style={{ boxShadow: "none" }}>
        <div className="at-between">
          <div>
            <div className="at-eyebrow" style={{ margin: 0 }}>Foresight record</div>
            <div className="at-small at-muted">
              {row.scored.length} scored · {row.unresolved} unresolved ·{" "}
              {row.insufficient ? <b style={{ color: "var(--unresolved-text)" }}>too few scorable claims to rank</b> : <>rank <b>#{row.rank}</b> of {rows.filter((r) => !r.insufficient).length}</>}
            </div>
          </div>
          <div className="at-kpi" style={{ textAlign: "right" }}>
            <b className="at-num">{Math.round(row.score * 100)}</b>
            <span className="at-num">80% interval {Math.round(row.lo * 100)}–{Math.round(row.hi * 100)}</span>
          </div>
        </div>
        <div className="at-pill-bar" style={{ margin: "10px 0 6px" }} aria-label="Claim verdict mix">
          {(["correct", "partial", "incorrect", "unresolved"] as const).map((v) => counts[v] ? (
            <span key={v} style={{ width: `${(counts[v] / claims.length) * 100}%`, background: `var(--${v === "correct" ? "agree" : v === "incorrect" ? "disagree" : v})` }} title={`${counts[v]} ${v}`} />
          ) : null)}
        </div>
        <div className="at-row at-xs at-muted">
          <span>✓ {counts.correct} correct</span><span>◐ {counts.partial} partial</span><span>✕ {counts.incorrect} incorrect</span><span>? {counts.unresolved} unresolved</span>
        </div>
        <div className="at-grid at-g3" style={{ marginTop: 12, gap: 8 }}>
          {DIMENSIONS.map((d) => (
            <div key={d.id} className="at-xs">
              <div className="at-between"><span className="at-muted">{d.name}</span><b className="at-num">{Math.round(row.dims[d.id] * 100)}</b></div>
              <div className="at-pill-bar" style={{ height: 5 }}><span style={{ width: `${row.dims[d.id] * 100}%`, background: "var(--night)" }} /></div>
            </div>
          ))}
        </div>
        {judgment && <p className="at-xs at-muted" style={{ margin: "10px 0 0" }}><KindLabel k="interp" /> {judgment.rightReasons}</p>}
        <div style={{ marginTop: 10 }}><button className="at-btn sm" onClick={() => { onClose(); go("leaderboard", { who: id }); }}>Open audit trail in leaderboard</button></div>
      </div>

      <h4 className="at-h3" style={{ marginTop: 22 }}>Evolving mental model</h4>
      {t.mentalModel.length === 0 && <div className="at-xs at-faint">No period-level record.</div>}
      <ol style={{ listStyle: "none", padding: 0, margin: 0, borderLeft: "2px solid var(--line)", marginLeft: 6 }}>
        {[...t.mentalModel].sort((a, b) => PERIOD_ORDER.indexOf(a.period) - PERIOD_ORDER.indexOf(b.period)).map((m) => (
          <li key={m.period} style={{ padding: "0 0 14px 16px", position: "relative" }}>
            <span style={{ position: "absolute", left: -6, top: 5, width: 10, height: 10, borderRadius: 5, background: "var(--night)" }} aria-hidden="true" />
            <div className="at-xs at-faint at-mono">{PERIOD_LABEL[m.period]}</div>
            <div className="at-small"><Rich text={m.summary} />{m.unverified && <span className="at-tag" style={{ marginLeft: 6, color: "var(--unresolved-text)" }}>unverified recall</span>}</div>
            {m.evidenceIds.length > 0 && <button className="at-link at-xs" onClick={() => open({ kind: "evidence", ids: m.evidenceIds, title: `${t.name} — ${PERIOD_LABEL[m.period]}` })}>{m.evidenceIds.length} source{m.evidenceIds.length > 1 ? "s" : ""}</button>}
          </li>
        ))}
      </ol>

      {t.reversals.length > 0 && (
        <>
          <h4 className="at-h3" style={{ marginTop: 10 }}>Reversals & revisions</h4>
          <div className="at-stack">
            {t.reversals.map((r, i) => (
              <div key={i} className="at-ev">
                <div className="at-xs at-mono at-faint">{r.date}</div>
                <div className="at-small"><span className="at-faint">From</span> {r.from} <span className="at-faint">→ to</span> <b>{r.to}</b></div>
                <div className="at-xs at-muted">Trigger: {r.trigger}</div>
                {r.evidenceIds.length > 0 && <button className="at-link at-xs" onClick={() => open({ kind: "evidence", ids: r.evidenceIds, title: `${t.name}: reversal ${r.date}` })}>sources</button>}
              </div>
            ))}
          </div>
        </>
      )}

      <h4 className="at-h3" style={{ marginTop: 22 }}>Consequential assertions ({claims.length})</h4>
      <div className="at-stack">
        {claims.map((a) => <div key={a.id} className="at-ev" style={{ background: "#fff" }}><ClaimLine a={a} showPerson={false} /></div>)}
      </div>

      {rels.length > 0 && (
        <>
          <h4 className="at-h3" style={{ marginTop: 22 }}>Intellectual relationships</h4>
          <div className="at-stack">
            {rels.map((r) => {
              const other = r.from === id ? r.to : r.from;
              const dir = r.from === id ? "→" : "←";
              return (
                <div key={r.id} className="at-small">
                  <span className="at-tag">{r.type.replace("_", " ")}</span> {dir}{" "}
                  {thinkerById(other) ? <PersonLink id={other} /> : <b>{nameOf(other)}</b>} <span className="at-xs at-faint at-mono">{r.date}</span>
                  {r.inferred && <span className="at-tag" style={{ marginLeft: 6 }}>inferred</span>}
                  <div className="at-xs at-muted">{r.note}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h4 className="at-h3" style={{ marginTop: 22 }}>Why selected</h4>
      <table className="at-table">
        <tbody>
          {Object.entries(t.selection).map(([k, [s, why]]) => (
            <tr key={k}>
              <td style={{ width: 170 }} className="at-xs at-muted">{SEL_LABEL[k] ?? k}</td>
              <td style={{ width: 70 }}><span className="at-mono" aria-label={`${s} of 5`}>{"▮".repeat(s)}<span style={{ color: "var(--line-2)" }}>{"▮".repeat(5 - s)}</span></span></td>
              <td className="at-xs">{why}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {t.corpusNotes && <p className="at-xs at-muted"><b>Source limitations:</b> {t.corpusNotes}</p>}
    </DrawerShell>
  );
}

/* ---------- Experience 5 case file ---------- */

function ClaimDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const a = assertionById(id);
  if (!a) return null;
  const t = thinkerById(a.thinkerId)!;
  return (
    <DrawerShell onClose={onClose} sub={<span>Case file · {a.id}</span>}
      title={<span className="at-row" style={{ gap: 10 }}><Avatar id={t.id} /> <span>{t.name}, <span className="at-mono at-faint" style={{ fontSize: 14 }}>{a.date}</span></span></span>}>
      <div className="at-row" style={{ marginBottom: 10 }}>
        <VerdictBadge v={a.verdict} solid />
        <span className="at-tag">{a.kind}</span>
        <span className="at-tag">{a.category}</span>
        <ConfidenceMeter c={a.confidence} />
        {a.timing !== "n/a" && <span className="at-tag">timing: {a.timing}</span>}
        {a.unscored && <span className="at-tag" style={{ color: "var(--interp)" }} title="Shown on the record but excluded from the foresight score">not scored: {a.unscored}</span>}
      </div>
      <p className="at-quote" style={{ margin: "0 0 10px" }}>{a.claimIsQuote ? `“${a.claim}”` : a.claim}</p>
      {!a.claimIsQuote && <p className="at-xs at-faint" style={{ marginTop: -6 }}>Precise paraphrase — see sources for the original wording.</p>}
      <div className="at-row" style={{ marginBottom: 14 }}><LayerTags layers={a.layers} />{a.topics.map((tp) => <span key={tp} className="at-tag">{topicName(tp)}</span>)}</div>

      <Block label="Context at the time" k="fact"><Rich text={a.contextAtTime} /></Block>
      <Block label="Assumptions required" k="interp">
        <ul style={{ margin: 0, paddingLeft: 18 }}>{a.assumptions.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </Block>
      <Block label="Testable implication" k="interp">{a.predictedOutcome} <span className="at-faint">· Horizon: {a.horizon}</span></Block>
      <h4 className="at-h3" style={{ marginTop: 16 }}>Original evidence</h4>
      <EvidenceList ids={a.evidenceIds} />

      <h4 className="at-h3" style={{ marginTop: 18 }}>What happened by Oct 11, 2026</h4>
      <Block label="Outcome" k="fact"><Rich text={a.outcome} /></Block>
      <EvidenceList ids={a.outcomeEvidenceIds} empty="No independent outcome source recorded — verdict rests on the general record." />

      <h4 className="at-h3" style={{ marginTop: 18 }}>Reasoned verdict</h4>
      <Block label="Verdict rationale" k="interp"><Rich text={a.verdictRationale} /></Block>
      {a.interpretations && a.interpretations.length > 0 && (
        <Block label="Competing interpretations" k="interp">
          <ul style={{ margin: 0, paddingLeft: 18 }}>{a.interpretations.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </Block>
      )}
      <div className="at-grid at-g3" style={{ gap: 8, margin: "8px 0 12px" }}>
        <Mini label="Originality" v={a.originality} />
        <Mini label="Right reasons" v={a.causal} />
        <Mini label="Specificity" v={a.specificity} />
      </div>
      <Block label="Evolution of the view" k="fact"><Rich text={a.evolution} /></Block>
      {a.theses && a.theses.length > 0 && (
        <Block label="Theses" k="interp">
          <div className="at-stack" style={{ gap: 6 }}>
            {a.theses.map((th) => {
              const T = thesisById(th.id);
              return T ? <div key={th.id} className="at-row"><span className="at-tag" style={{ color: th.stance === "supports" ? "var(--agree)" : "var(--disagree)" }}>{th.stance}</span> {T.title} <StatusBadge s={T.status} /></div> : null;
            })}
          </div>
        </Block>
      )}
      {a.audit && <Block label="Independent audit note" k="interp">{a.audit}</Block>}
    </DrawerShell>
  );
}

function Block({ label, k, children }: { label: string; k: "fact" | "interp" | "forecast"; children: React.ReactNode }) {
  return (
    <div style={{ margin: "0 0 12px" }}>
      <div className="at-row" style={{ marginBottom: 3 }}><span className="at-xs" style={{ fontWeight: 650, color: "var(--ink-2)" }}>{label}</span><KindLabel k={k} /></div>
      <div className="at-small">{children}</div>
    </div>
  );
}

function Mini({ label, v }: { label: string; v: number | null }) {
  return (
    <div className="at-ev" style={{ padding: "6px 9px" }}>
      <div className="at-xs at-faint">{label}</div>
      <div className="at-mono">{v == null ? "n/a" : <>{"▮".repeat(v)}<span style={{ color: "var(--line-2)" }}>{"▮".repeat(5 - v)}</span></>}</div>
    </div>
  );
}
