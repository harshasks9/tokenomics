"use client";

import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { PARAM_META, valueFlow, type EconParams, type ValueSlice } from "@/lib/clicks-to-delegation/models";
import { AGENT_FEES, BENCHMARKS, SIM_DEFAULTS, VALUE_CAPTURE, type Provenance } from "@/lib/clicks-to-delegation/research";
import { Cite, Details, Ev, Fig, Section, useTableToggle } from "../ui";

const SLICE_COLOR: Record<ValueSlice["who"], string> = {
  brand: "#d8d2c4", platform: "#6250d6", ads: "#eb6834", agent: "#2a78d6", payments: "#eda100", logistics: "#1baf7a", losses: "#e87ba4", retailer: "#14213d",
};
const ORDER: ValueSlice["who"][] = ["brand", "platform", "ads", "agent", "payments", "logistics", "losses", "retailer"];
const PROV: Record<Provenance, string> = { researched: "Researched", assumed: "Assumed", illustrative: "Illustrative" };
const KEYS = Object.keys(PARAM_META) as (keyof EconParams)[];

const toParams = (m: (typeof SIM_DEFAULTS)[number]): EconParams => Object.fromEntries(KEYS.map((k) => [k, m.params[k]?.value ?? 0])) as unknown as EconParams;

export default function Money() {
  const [overrides, setOverrides] = useState<Record<string, Partial<EconParams>>>({});
  const [model, setModel] = useState("C");
  const { table, toggle } = useTableToggle();
  const params = (id: string) => { const m = SIM_DEFAULTS.find((x) => x.model === id)!; return { ...toParams(m), ...(overrides[id] ?? {}) }; };
  const flows = useMemo(() => SIM_DEFAULTS.map((m) => ({ m, f: valueFlow(params(m.model)) })), [overrides]); // eslint-disable-line react-hooks/exhaustive-deps
  const base = flows.find((x) => x.m.model === "E")?.f;
  const cur = SIM_DEFAULTS.find((x) => x.model === model) ?? SIM_DEFAULTS[0];
  const cp = params(model);
  const cf = valueFlow(cp);
  const edited = Boolean(overrides[model] && Object.keys(overrides[model]).length);
  const setParam = (k: keyof EconParams, v: number) => setOverrides((o) => ({ ...o, [model]: { ...(o[model] ?? {}), [k]: v } }));
  const reset = () => setOverrides((o) => { const n = { ...o }; delete n[model]; return n; });
  const fmt = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toFixed(2)}`;

  return (
    <Section id="money" num="07" title="Follow the money"
      dek="A protocol connecting buyers and sellers doesn't capture value by itself. What matters is who sets the ranking, who owns the transaction and who can raise the take rate."
      takeaway={<>On a $100 order the retailer keeps a few dollars in almost every model. The question is not whether agents add a fee; it&apos;s whether they <strong>replace acquisition cost or stack on top of it</strong>, and whether the customer <strong>comes back directly</strong>. In 2026 the evidence leans toward redistribution of existing margin, not new margin: <strong>Amazon and Walmart hold about 88% of US retail media</strong>, and AI platforms are moving to ads inside answers.<Cite ids={VALUE_CAPTURE[0]?.sourceIds} /></>}>

      <Fig title="Visualization F · The $100 commerce transaction"
        sub="Where an illustrative $100 first order goes under eight commercial arrangements. Pick a model to edit its assumptions; every default is labeled researched, assumed or illustrative."
        controls={toggle}
        foot={<><Ev kind="illustrative" /> A teaching model, not market data. Store labor and overhead are not modeled, which flatters the physical store. Undisclosed platform fees are shown as assumptions, never as facts.</>}>
        <div className="ctd-legend" style={{ marginBottom: 10 }}>
          {ORDER.map((w) => <span key={w}><span className="ctd-sw" style={{ background: SLICE_COLOR[w] }} />{flows[0].f.slices.find((s) => s.who === w)?.label}</span>)}
        </div>
        {table ? (
          <div className="ctd-table-wrap">
            <table className="ctd-table">
              <thead><tr><th>Model</th>{ORDER.map((w) => <th key={w}>{flows[0].f.slices.find((s) => s.who === w)?.label}</th>)}<th>Lifetime contribution</th></tr></thead>
              <tbody>{flows.map(({ m, f }) => <tr key={m.model}><td>{m.label}</td>{ORDER.map((w) => <td key={w} className="n">{fmt(f.slices.find((s) => s.who === w)!.value)}</td>)}<td className="n">{fmt(f.lifetimeContribution)}</td></tr>)}</tbody>
            </table>
          </div>
        ) : (
          <div className="ctd-stacks">
            {flows.map(({ m, f }) => {
              const pos = f.slices.filter((s) => s.value > 0);
              const neg = f.firstOrderContribution < 0;
              return (
                <button key={m.model} type="button" className={`ctd-stack-row ${m.model === model ? "on" : ""}`} onClick={() => setModel(m.model)} aria-pressed={m.model === model}>
                  <span className="ctd-stack-label"><b className="ctd-mono">{m.model}</b>{m.label}</span>
                  <span className="ctd-stack-bar" aria-label={pos.map((s) => `${s.label} ${fmt(s.value)}`).join(", ")}>
                    {ORDER.map((w) => { const s = pos.find((x) => x.who === w); if (!s) return null; return <i key={w} style={{ flexGrow: s.value, background: SLICE_COLOR[w] }} title={`${s.label}: ${fmt(s.value)}`}>{s.value >= 7 ? <em>{fmt(s.value)}</em> : null}</i>; })}
                  </span>
                  <span className={`ctd-stack-val ctd-mono ${neg ? "neg" : ""}`}>{fmt(f.firstOrderContribution)}</span>
                </button>
              );
            })}
            <div className="ctd-stack-axis"><span>$0</span><span>$50</span><span>$100</span><span className="ctd-stack-val-h">Retailer, first order</span></div>
          </div>
        )}
      </Fig>

      <div className="ctd-simwrap ctd-block">
        <Fig title={`Edit model ${cur.model}: ${cur.label}`} sub="Change any assumption; the stacked bars above update. Lifetime figures assume each order is followed by another with probability repeat × retention."
          controls={edited ? <button type="button" className="ctd-btn" onClick={reset}><RotateCcw size={14} />Reset to defaults</button> : undefined}>
          <div className="ctd-sim-grid">
            <div className="ctd-sim-params">
              {KEYS.map((k) => {
                const meta = PARAM_META[k]; const d = cur.params[k];
                return (
                  <div key={k} className="ctd-param">
                    <div className="ctd-slider-top"><label htmlFor={`p-${k}`}>{meta.label}</label><b>{meta.unit === "$" ? `$${cp[k]}` : `${cp[k]}%`}</b></div>
                    <input id={`p-${k}`} type="range" min={meta.min} max={meta.max} step={meta.step} value={cp[k]} onChange={(e) => setParam(k, Number(e.target.value))} />
                    <div className="ctd-param-meta">
                      {d && <span className={`ctd-prov ${d.provenance}`}>{PROV[d.provenance]}</span>}
                      <span className="ctd-muted">{d?.note ?? meta.help}</span>{d && <Cite ids={d.sourceIds} />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="ctd-sim-out">
              <div className="ctd-stat"><span>Retailer contribution, first order</span><b className={`ctd-mono ${cf.firstOrderContribution < 0 ? "neg" : ""}`}>{fmt(cf.firstOrderContribution)}</b><small>gross margin − channel costs − acquisition</small></div>
              <div className="ctd-stat"><span>Each repeat order</span><b className="ctd-mono">{fmt(cf.perOrderMargin)}</b><small>no acquisition cost on repeats</small></div>
              <div className="ctd-stat"><span>Expected orders per customer</span><b className="ctd-mono">{cf.expectedOrders.toFixed(2)}</b><small>1 + repeat ÷ (1 − repeat × retention)</small></div>
              <div className="ctd-stat"><span>Lifetime contribution</span><b className={`ctd-mono ${cf.lifetimeContribution < 0 ? "neg" : ""}`}>{fmt(cf.lifetimeContribution)}</b><small>per acquired customer</small></div>
              <div className="ctd-stat"><span>Volume-adjusted vs own site</span><b className="ctd-mono">{base && base.volumeAdjusted !== 0 ? `${((cf.volumeAdjusted / base.volumeAdjusted) * 100).toFixed(0)}` : "—"}</b><small>index, e-commerce own site = 100 (includes incremental orders)</small></div>
            </div>
          </div>
        </Fig>
      </div>

      <div className="ctd-grid2 ctd-block">
        <div className="ctd-card">
          <div className="ctd-h4">What AI platforms charge merchants: public vs not</div>
          <div className="ctd-table-wrap" style={{ marginTop: 8 }}>
            <table className="ctd-table">
              <thead><tr><th>Who</th><th>Fee</th><th>Status</th></tr></thead>
              <tbody>{AGENT_FEES.map((f, i) => <tr key={i}><td><b>{f.who}</b><div className="ctd-muted ctd-small">{f.what} · {f.date}</div></td><td>{f.value}<Cite ids={f.sourceIds} /></td><td><span className={`ctd-fee ${f.status}`}>{f.status === "not-disclosed" ? "Not disclosed" : f.status === "reported" ? "Reported" : "Disclosed"}</span></td></tr>)}</tbody>
            </table>
          </div>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">Redistribution or productivity?</div>
          <ul className="ctd-list">
            {VALUE_CAPTURE.map((v, i) => <li key={i}>{v.finding}<Cite ids={v.sourceIds} /></li>)}
          </ul>
          <p className="ctd-small" style={{ marginTop: 10 }}><b>Our read:</b> search and marketplaces redistributed value because they controlled the <em>consideration set</em> and could auction it. Agents become a redistribution event only if they win that same control and can monetize it (ads in answers, per-order fees). If they stay referral layers, they are mainly a productivity improvement: lower service costs and better-qualified traffic.</p>
        </div>
      </div>

      <div className="ctd-block ctd-deep">
        <Details title={`Benchmark library (${BENCHMARKS.length} sourced margins, fees and costs)`}>
          <div className="ctd-table-wrap">
            <table className="ctd-table">
              <thead><tr><th>Metric</th><th>Value</th><th>Context</th><th>Period</th><th>Type</th></tr></thead>
              <tbody>{BENCHMARKS.map((b) => <tr key={b.id}><td><b>{b.metric}</b></td><td>{b.value}<Cite ids={b.sourceIds} /></td><td>{b.context}</td><td>{b.period}</td><td>{b.kind}</td></tr>)}</tbody>
            </table>
          </div>
        </Details>
      </div>
    </Section>
  );
}
