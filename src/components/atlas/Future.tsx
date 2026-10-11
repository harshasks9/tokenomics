"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { IMPLICATIONS, PERIODS, SCENARIOS, thesisById } from "@/lib/atlas/data";
import { LAYERS } from "@/lib/atlas/taxonomy";
import type { Implication, Scenario } from "@/lib/atlas/types";
import { ClaimLineById } from "./ClaimRef";
import { ExportMenu, KindLabel, PersonLink, SectionHead, StatusBadge, useAtlas } from "./Shared";
import { heatColor } from "./StackView";

const MARGIN = { expanding: { c: "var(--agree)", g: "▲", t: "margins expanding" }, stable: { c: "var(--ink-3)", g: "■", t: "stable" }, compressing: { c: "var(--disagree)", g: "▼", t: "margins compressing" } };
const LENSES: Implication["lens"][] = ["technology", "economics", "platforms", "enterprise", "investing"];

export default function Future({ initial }: { initial?: string }) {
  const [sid, setSid] = useState(SCENARIOS.find((s) => s.id === initial)?.id ?? SCENARIOS[0]?.id);
  const [lens, setLens] = useState<Implication["lens"]>("technology");
  const s = SCENARIOS.find((x) => x.id === sid);
  const now = PERIODS.find((p) => p.id === "p2026");

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 08 · The future AI stack (2027–2030)" title="Three ways the stack could reorganize"
        right={<ExportMenu name="atlas-scenarios" json={() => ({ scenarios: SCENARIOS, implications: IMPLICATIONS })} rows={() => SCENARIOS.flatMap((x) => LAYERS.map((L) => ({ scenario: x.name, layer: L.name, state: x.stack[L.id]?.state, control: x.stack[L.id]?.control, margin: x.stack[L.id]?.margin })))} />}>
        Scenarios are built from the causal models that proved most predictive between 2012 and 2026 — not an average of opinions. Each is tied
        back to the thinkers and theses that support or challenge it, with indicators to watch and events that would invalidate it.
      </SectionHead>
      <div className="at-forecast-banner" style={{ marginBottom: 16 }}>
        <AlertTriangle size={16} aria-hidden="true" /> Everything on this page is a <b>forecast</b>, not a historical finding. Confidence bands are qualitative: the record does not support calibrated probabilities.
      </div>

      {!s ? <div className="at-empty">Scenarios not loaded.</div> : (
        <>
          <div className="at-scen-tabs" role="group" aria-label="Scenarios">
            {SCENARIOS.map((x, i) => (
              <button key={x.id} className="at-scen-tab" aria-pressed={x.id === sid} onClick={() => setSid(x.id)}>
                <div className="at-eyebrow" style={{ margin: 0 }}>Scenario {String.fromCharCode(65 + i)} · confidence {x.confidence}</div>
                <div className="at-serif" style={{ fontSize: 21, lineHeight: 1.15, margin: "4px 0" }}>{x.name}</div>
                <div className="at-xs at-muted">{x.tagline}</div>
              </button>
            ))}
          </div>
          <ScenarioDetail s={s} now={now?.layers} />
        </>
      )}

      {IMPLICATIONS.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <SectionHead eyebrow="Strategic implications" title="What a strategist, buyer, founder and investor should take away">
            Each conclusion lists who supports it, who disagrees, and how strong the underlying evidence is.
          </SectionHead>
          <div className="at-seg" role="group" aria-label="Lens" style={{ marginBottom: 14 }}>
            {LENSES.map((l) => <button key={l} aria-pressed={lens === l} onClick={() => setLens(l)}>{l[0].toUpperCase() + l.slice(1)}</button>)}
          </div>
          <div className="at-grid at-g2">
            {IMPLICATIONS.filter((i) => i.lens === lens).map((i) => (
              <div key={i.id} className="at-card at-pad">
                <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>{i.question}</div>
                  <span className="at-badge" style={{ color: i.strength === "strong" ? "var(--agree)" : i.strength === "moderate" ? "var(--unresolved-text)" : "var(--disagree)" }}>{i.strength} evidence</span></div>
                <p className="at-small" style={{ margin: "8px 0" }}>{i.answer}</p>
                <div className="at-xs at-muted" style={{ marginBottom: 6 }}><KindLabel k="interp" /> {i.basis}</div>
                <div className="at-xs"><b style={{ color: "var(--agree)" }}>Supported by:</b> {i.supporters.map((p, k) => <span key={p}>{k ? ", " : " "}<PersonLink id={p} /></span>)}</div>
                {i.dissenters.length > 0 && <div className="at-xs"><b style={{ color: "var(--disagree)" }}>Disputed by:</b> {i.dissenters.map((p, k) => <span key={p}>{k ? ", " : " "}<PersonLink id={p} /></span>)}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ScenarioDetail({ s, now }: { s: Scenario; now?: Record<string, { heat: number; state: string }> }) {
  const { go } = useAtlas();
  return (
    <div className="at-stack" style={{ gap: 14, marginTop: 16 }}>
      <div className="at-grid" style={{ gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", alignItems: "start" }}>
        <div className="at-card at-pad">
          <div className="at-between"><div className="at-h3" style={{ margin: 0 }}>The 2030 stack under “{s.name}”</div><KindLabel k="forecast" /></div>
          <p className="at-xs at-muted" style={{ margin: "4px 0 10px" }}>Blue strip = strategic control in 2030 (0–3). ▲▼■ = margin direction. Hatched ghost = Oct 2026 attention, for comparison.</p>
          <div className="at-stackviz">
            {LAYERS.map((L) => {
              const st = s.stack[L.id];
              const m = MARGIN[st?.margin ?? "stable"];
              const h = now?.[L.id]?.heat ?? 0;
              return (
                <div key={L.id} className="at-layer" aria-label={`${L.name}: control ${st?.control ?? 0} of 3, ${m.t}. ${st?.state ?? ""}`}>
                  <span className="heat" style={{ width: `${(h / 3) * 100}%`, background: "repeating-linear-gradient(135deg, #e9e5db 0 6px, #f4f2ec 6px 12px)", opacity: 0.7 }} />
                  <span className="heat" style={{ width: `${((st?.control ?? 0) / 3) * 100}%`, background: heatColor(st?.control ?? 0), opacity: 1, height: 5, top: "auto", bottom: 0, borderRadius: 3 }} />
                  <span className="lnum">{String(L.n).padStart(2, "0")}</span>
                  <span className="lname">{L.short} <span style={{ color: m.c }} title={m.t}>{m.g}</span></span>
                  <span className="lstate">{st?.state}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="at-stack" style={{ gap: 14 }}>
          <div className="at-card at-pad">
            <div className="at-h3">Confidence: {s.confidence}</div>
            <p className="at-small at-muted" style={{ margin: 0 }}>{s.confidenceNote}</p>
          </div>
          <List title="Key assumptions" items={s.assumptions} />
          <List title="Bottlenecks" items={s.bottlenecks} />
          <List title="Sources of advantage" items={s.advantage} />
          <List title="Strategic control points" items={s.controlPoints} />
        </div>
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-h3">Winners & losers by layer</div>
          <table className="at-table"><tbody>
            {s.winners.map((w, i) => <tr key={`w${i}`}><td className="at-xs" style={{ width: 110 }}>{LAYERS.find((l) => l.id === w.layer)?.short}</td><td className="at-small"><b style={{ color: "var(--agree)" }}>▲</b> {w.who}</td></tr>)}
            {s.losers.map((w, i) => <tr key={`l${i}`}><td className="at-xs">{LAYERS.find((l) => l.id === w.layer)?.short}</td><td className="at-small"><b style={{ color: "var(--disagree)" }}>▼</b> {w.who}</td></tr>)}
          </tbody></table>
        </div>
        <div className="at-card at-pad at-stack">
          <div><div className="at-h3">Capital intensity</div><p className="at-small" style={{ margin: 0 }}>{s.capitalIntensity}</p></div>
          <div><div className="at-h3">Enterprise adoption</div><p className="at-small" style={{ margin: 0 }}>{s.enterprise}</p></div>
        </div>
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-h3">Leading indicators</div>
          <ul className="at-small" style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {s.indicators.map((x, i) => (
              <li key={i} style={{ display: "grid", gridTemplateColumns: "88px 1fr", gap: 8, padding: "5px 0", borderBottom: "1px dashed var(--line)" }}>
                <span className="at-tag" style={{ color: x.status === "observed" ? "var(--agree)" : "var(--unresolved-text)" }}>{x.status === "observed" ? "● observed" : "○ watch"}</span>{x.text}
              </li>
            ))}
          </ul>
        </div>
        <List title="What would invalidate it" items={s.invalidators} tone="bad" />
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-h3" style={{ color: "var(--agree)" }}>Thinkers whose models support it</div>
          {s.supporters.map((x) => (
            <div key={x.thinkerId} style={{ marginBottom: 10 }}>
              <PersonLink id={x.thinkerId} showAvatar /> <div className="at-xs at-muted">{x.why}</div>
              {x.assertionIds.slice(0, 2).map((id) => <ClaimLineById key={id} id={id} />)}
            </div>
          ))}
        </div>
        <div className="at-card at-pad">
          <div className="at-h3" style={{ color: "var(--disagree)" }}>Thinkers whose models challenge it</div>
          {s.challengers.map((x) => (
            <div key={x.thinkerId} style={{ marginBottom: 10 }}>
              <PersonLink id={x.thinkerId} showAvatar /> <div className="at-xs at-muted">{x.why}</div>
              {x.assertionIds.slice(0, 2).map((id) => <ClaimLineById key={id} id={id} />)}
            </div>
          ))}
        </div>
      </div>

      {s.thesisIds.length > 0 && (
        <div className="at-card at-pad">
          <div className="at-h3">Historical theses this scenario depends on</div>
          <div className="at-stack" style={{ gap: 6 }}>
            {s.thesisIds.map((id) => { const T = thesisById(id); return T ? (
              <div key={id} className="at-row"><StatusBadge s={T.status} /><b className="at-small">{T.title}</b><span className="at-xs at-muted">{T.outcome}</span>
                <button className="at-link at-xs" onClick={() => go("graph", { thesis: id })}>in graph →</button></div>
            ) : null; })}
          </div>
        </div>
      )}
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: string[]; tone?: "bad" }) {
  return (
    <div className="at-card at-pad">
      <div className="at-h3" style={tone === "bad" ? { color: "var(--disagree)" } : undefined}>{title}</div>
      <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{items.map((x, i) => <li key={i} style={{ margin: "3px 0" }}>{x}</li>)}</ul>
    </div>
  );
}
