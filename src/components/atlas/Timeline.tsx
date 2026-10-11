"use client";

import { useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { ASSERTIONS, EVENTS, PERIODS, THINKERS } from "@/lib/atlas/data";
import { PERIOD_ORDER, PERIOD_YEARS, layerById, yearOf } from "@/lib/atlas/taxonomy";
import type { LayerId, Period, PeriodId } from "@/lib/atlas/types";
import StackView, { HeatLegend } from "./StackView";
import { Avatar, ClaimLine, ExportMenu, KindLabel, LayerTags, Rich, SectionHead, SourcesButton, useAtlas } from "./Shared";
import { PERIOD_LABEL, PERIOD_SHORT } from "./periodLabels";

const inPeriod = (date: string, p: PeriodId) => {
  const y = Math.floor(yearOf(date));
  return y >= PERIOD_YEARS[p][0] && y <= PERIOD_YEARS[p][1];
};

export default function Timeline({ initial, compare }: { initial?: string; compare?: string }) {
  const [pid, setPid] = useState<PeriodId>((PERIOD_ORDER.includes(initial as PeriodId) ? initial : "p2022") as PeriodId);
  const [cmp, setCmp] = useState<PeriodId | null>((PERIOD_ORDER.includes(compare as PeriodId) ? compare : null) as PeriodId | null);
  const [cmpMode, setCmpMode] = useState(!!compare);
  const [layer, setLayer] = useState<LayerId | null>(null);
  const P = PERIODS.find((p) => p.id === pid);
  const C = cmp ? PERIODS.find((p) => p.id === cmp) : undefined;

  if (!PERIODS.length) return <div className="at-wrap at-view"><div className="at-empty">Period research not loaded.</div></div>;

  const clickPeriod = (id: PeriodId) => {
    if (cmpMode && id !== pid) setCmp(id);
    else setPid(id);
  };

  return (
    <div className="at-wrap at-view">
      <SectionHead eyebrow="Experience 02 · AI evolution timeline" title="The stack, as it was understood at the time"
        right={<div className="at-row">
          <button className="at-btn sm" aria-pressed={cmpMode} onClick={() => { setCmpMode((m) => !m); if (!cmp) setCmp(pid === "p2026" ? "p2020" : "p2026"); }}>
            <ArrowLeftRight size={13} aria-hidden="true" /> Compare two periods
          </button>
          <ExportMenu name="atlas-periods" json={() => PERIODS} rows={() => PERIODS.map((p) => ({ id: p.id, label: p.label, from: p.range[0], to: p.range[1], consensus: p.consensus, investment: p.investment, perceived: p.perceivedAdvantage, actual: p.actualAdvantage }))} />
        </div>}>
        Event-driven periods from 2012 to the October 2026 cutoff. Each state shows what existed, what was believed, what constrained progress —
        and, labeled separately, where value actually accrued in hindsight.
      </SectionHead>

      <div className="at-periods" role="group" aria-label="Periods">
        {PERIOD_ORDER.map((id) => {
          const p = PERIODS.find((x) => x.id === id);
          return (
            <button key={id} className={`at-period ${cmpMode && cmp === id ? "cmp" : ""}`} aria-pressed={pid === id} onClick={() => clickPeriod(id)}>
              <b>{PERIOD_SHORT[id]}</b>
              <span>{p?.label ?? PERIOD_LABEL[id].split(" · ")[1]}</span>
            </button>
          );
        })}
      </div>
      {cmpMode && <p className="at-xs at-muted" style={{ margin: "8px 0 0" }}>Compare mode: the dark tile is the primary period; click another tile to set the comparison (amber outline). Layer bars show ▲/▼ changes in attention.</p>}

      {cmpMode && C && P ? (
        <CompareView a={P} b={C} />
      ) : P ? (
        <div className="at-grid" style={{ gridTemplateColumns: "minmax(0, 420px) minmax(0, 1fr)", marginTop: 18, alignItems: "start" }}>
          <div className="at-card at-pad" style={{ position: "sticky", top: 70 }}>
            <div className="at-between" style={{ marginBottom: 8 }}>
              <div className="at-h3">{PERIOD_SHORT[pid]} stack</div>
              <span className="at-xs at-faint at-mono">{P.range[0]} → {P.range[1]}</span>
            </div>
            <StackView layers={P.layers} onLayer={(l) => setLayer((x) => (x === l ? null : l))} active={layer} />
            <div style={{ marginTop: 10 }}><HeatLegend /></div>
            {layer && <LayerHistory layer={layer} />}
          </div>
          <PeriodDetail p={P} />
        </div>
      ) : null}
    </div>
  );
}

function LayerHistory({ layer }: { layer: LayerId }) {
  const L = layerById(layer);
  return (
    <div style={{ marginTop: 14 }}>
      <div className="at-h3">Layer {L.n}: {L.name} across periods</div>
      <div className="at-stack" style={{ gap: 6 }}>
        {PERIODS.map((p) => (
          <div key={p.id} className="at-xs"><b className="at-mono">{PERIOD_SHORT[p.id]}</b> <span className="at-faint">({p.layers[layer]?.heat ?? 0}/3)</span> {p.layers[layer]?.state}</div>
        ))}
      </div>
    </div>
  );
}

function PeriodDetail({ p }: { p: Period }) {
  const { open } = useAtlas();
  const events = EVENTS.filter((e) => inPeriod(e.date, p.id));
  const claims = ASSERTIONS.filter((a) => inPeriod(a.date, p.id)).sort((a, b) => a.date.localeCompare(b.date));
  const beliefs = THINKERS.flatMap((t) => t.mentalModel.filter((m) => m.period === p.id).map((m) => ({ t, m })));
  const dissent = p.minorityViews;
  return (
    <div className="at-stack" style={{ gap: 16 }}>
      <div className="at-card at-pad">
        <div className="at-row" style={{ marginBottom: 6 }}><span className="at-eyebrow" style={{ margin: 0 }}>Dominant consensus</span><KindLabel k="fact" /></div>
        <p className="at-quote" style={{ margin: 0, fontSize: 17 }}><Rich text={p.consensus} /></p>
        <p className="at-xs at-muted" style={{ margin: "8px 0 0" }}>Why this period: <Rich text={p.boundaryRationale} /></p>
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-h3">Technologies & architectures</div>
          <div className="at-row" style={{ gap: 5 }}>{[...p.architectures.map((x) => ({ x, a: true })), ...p.technologies.map((x) => ({ x, a: false }))].map(({ x, a }) => <span key={x} className="at-tag" style={a ? { background: "#e7ecf8", color: "#26407e" } : undefined}>{x}</span>)}</div>
          <div className="at-h3" style={{ marginTop: 14 }}>Constraints & bottlenecks</div>
          <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>
            {p.bottlenecks.map((b, i) => <li key={i}><b>{b.item}</b> <span className="at-tag">{b.kind}</span> <span className="at-muted"><Rich text={b.note} /></span></li>)}
          </ul>
        </div>
        <div className="at-card at-pad">
          <div className="at-row"><div className="at-h3" style={{ margin: 0 }}>Where advantage was believed to be</div><KindLabel k="fact" /></div>
          <ul className="at-small" style={{ margin: "6px 0 0", paddingLeft: 18 }}>{p.perceivedAdvantage.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
          <div className="at-row" style={{ marginTop: 14 }}><div className="at-h3" style={{ margin: 0 }}>Where it actually accrued</div><KindLabel k="interp" /></div>
          <ul className="at-small" style={{ margin: "6px 0 0", paddingLeft: 18 }}>{p.actualAdvantage.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
          <div className="at-h3" style={{ marginTop: 14 }}>Investment & attention</div>
          <p className="at-small at-muted" style={{ margin: 0 }}><Rich text={p.investment} /></p>
          {p.evidenceIds.length > 0 && <div style={{ marginTop: 8 }}><SourcesButton ids={p.evidenceIds} title={`${p.label} — sources`} /></div>}
        </div>
      </div>

      <div className="at-grid at-g2">
        <div className="at-card at-pad">
          <div className="at-row"><div className="at-h3" style={{ margin: 0 }}>Minority views that later mattered</div><KindLabel k="interp" /></div>
          {dissent.length === 0 && <div className="at-xs at-faint">None recorded.</div>}
          {dissent.map((d, i) => (
            <div key={i} style={{ marginTop: 8 }}>
              <div className="at-small"><b>{d.view}</b></div>
              <div className="at-xs at-muted">Held by {d.heldBy}. Later: <Rich text={d.laterImportance} /></div>
            </div>
          ))}
        </div>
        <div className="at-card at-pad">
          <div className="at-h3">Commoditized later / underestimated then</div>
          <div className="at-xs at-muted" style={{ fontWeight: 600, marginTop: 6 }}>Looked structural, later commoditized</div>
          <ul className="at-small" style={{ margin: "4px 0 0", paddingLeft: 18 }}>{p.commoditized.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
          <div className="at-xs at-muted" style={{ fontWeight: 600, marginTop: 10 }}>Initially underestimated</div>
          <ul className="at-small" style={{ margin: "4px 0 0", paddingLeft: 18 }}>{p.underestimated.map((x, i) => <li key={i}><Rich text={x} /></li>)}</ul>
        </div>
      </div>

      <div className="at-card at-pad">
        <div className="at-h3">Turning points ({events.length})</div>
        {events.map((e) => (
          <div key={e.id} className="at-evt">
            <time>{e.date}</time>
            <div>
              <div className="at-row"><b className="at-small">{e.title}</b><span className="at-tag">{e.kind}</span><LayerTags layers={e.layers} /></div>
              <div className="at-small at-muted"><Rich text={e.summary} /></div>
              <div className="at-xs" style={{ color: "var(--interp)" }}>Why it mattered: <Rich text={e.significance} /></div>
              {e.evidenceIds.length > 0 && <button className="at-link at-xs" onClick={() => open({ kind: "evidence", ids: e.evidenceIds, title: e.title })}>sources</button>}
            </div>
          </div>
        ))}
      </div>

      <div className="at-card at-pad">
        <div className="at-h3">What the 30 believed in this period ({beliefs.length})</div>
        <div className="at-grid at-g2" style={{ gap: 10, marginTop: 8 }}>
          {beliefs.map(({ t, m }) => (
            <button key={t.id} onClick={() => open({ kind: "thinker", id: t.id })} className="at-ev" style={{ textAlign: "left", cursor: "pointer", display: "grid", gridTemplateColumns: "38px 1fr", gap: 10 }}>
              <Avatar id={t.id} />
              <span><b className="at-small">{t.name}</b><span className="at-xs at-muted" style={{ display: "block" }}>{m.summary}</span></span>
            </button>
          ))}
        </div>
      </div>

      <div className="at-card at-pad">
        <div className="at-h3">Claims made in this period ({claims.length})</div>
        <p className="at-xs at-muted" style={{ marginTop: 0 }}>Verdicts are judged on the information available when each claim was made, against outcomes observed by Oct 11, 2026.</p>
        <div className="at-stack">{claims.map((a) => <div key={a.id} className="at-ev" style={{ background: "#fff" }}><ClaimLine a={a} /></div>)}</div>
      </div>
    </div>
  );
}

function CompareView({ a, b }: { a: Period; b: Period }) {
  const [x, y] = [a, b].sort((p, q) => PERIOD_ORDER.indexOf(p.id) - PERIOD_ORDER.indexOf(q.id));
  return (
    <div style={{ marginTop: 18 }}>
      <div className="at-grid at-g2">
        {[x, y].map((p, i) => (
          <div key={p.id} className="at-card at-pad">
            <div className="at-between"><div className="at-h3">{PERIOD_SHORT[p.id]} · {p.label}</div>{i === 1 && <span className="at-xs at-faint">▲▼ vs {PERIOD_SHORT[x.id]}</span>}</div>
            <StackView layers={p.layers} compare={i === 1 ? x.layers : undefined} />
          </div>
        ))}
      </div>
      <div className="at-grid at-g2" style={{ marginTop: 14 }}>
        {[x, y].map((p) => (
          <div key={p.id} className="at-card at-pad at-stack">
            <div><div className="at-xs at-muted" style={{ fontWeight: 650 }}>Consensus</div><div className="at-small">{p.consensus}</div></div>
            <div><div className="at-xs at-muted" style={{ fontWeight: 650 }}>Dominant architectures</div><div className="at-row" style={{ gap: 4 }}>{p.architectures.map((t) => <span key={t} className="at-tag">{t}</span>)}</div></div>
            <div><div className="at-xs at-muted" style={{ fontWeight: 650 }}>Binding constraints</div><div className="at-small">{p.bottlenecks.map((b) => b.item).join(" · ")}</div></div>
            <div><div className="at-xs at-muted" style={{ fontWeight: 650 }}>Perceived advantage</div><div className="at-small">{p.perceivedAdvantage.join(" · ")}</div></div>
            <div><div className="at-xs at-muted" style={{ fontWeight: 650 }}>Actual value capture <KindLabel k="interp" /></div><div className="at-small">{p.actualAdvantage.join(" · ")}</div></div>
          </div>
        ))}
      </div>
      <div className="at-card at-pad" style={{ marginTop: 14 }}>
        <div className="at-h3">What looked structural in {PERIOD_SHORT[x.id]} but commoditized — and what was underestimated</div>
        <div className="at-grid at-g2">
          <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{x.commoditized.map((c, i) => <li key={i}>{c}</li>)}</ul>
          <ul className="at-small" style={{ margin: 0, paddingLeft: 18 }}>{x.underestimated.map((c, i) => <li key={i}>{c}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
