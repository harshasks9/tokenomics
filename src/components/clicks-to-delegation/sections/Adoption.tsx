"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { adoptionCurve, SCENARIO_PRESETS, valueAt, type AdoptionParams } from "@/lib/clicks-to-delegation/models";
import { AGENT_METRICS, PROBLEMS, qToYear, US_ECOM } from "@/lib/clicks-to-delegation/research";
import type { FunnelStage } from "@/lib/clicks-to-delegation/types";
import { Cite, Details, Ev, Fig, Section, Slider, useTableToggle } from "../ui";

type Mode = "calendar" | "intro" | "adoption" | "transaction" | "stage";
type ScenarioKey = keyof typeof SCENARIO_PRESETS;

/** Anchors for each alignment. Each is a dated, sourced (or flagged) event. */
const ANCHORS: Record<Exclude<Mode, "calendar" | "stage">, { label: string; ecom: { year: number; what: string }; agentic: { year: number; what: string } }> = {
  intro: { label: "Years since commercial introduction", ecom: { year: 1995.54, what: "Amazon.com opens (Jul 1995)" }, agentic: { year: 2022.91, what: "ChatGPT released (Nov 30, 2022)" } },
  adoption: { label: "Years since first meaningful consumer adoption", ecom: { year: 2000.46, what: "22% of US adults have bought online (Pew, Jun 2000)" }, agentic: { year: 2026.45, what: "53% of consumers used AI for shopping (McKinsey, Jun 2026)" } },
  transaction: { label: "Years since first measurable transaction", ecom: { year: 1999.875, what: "Census begins measuring e-commerce sales (1999Q4: 0.6%)" }, agentic: { year: 2025.74, what: "First agentic checkouts in a general assistant (Sep 29, 2025)" } },
};
const STAGE_THRESHOLD = 0.6; // % of US retail — the level at which e-commerce was first measured

const DASH: Record<ScenarioKey, string> = { conservative: "2 4", base: "8 4", transformative: "14 3 2 3" };
const FUNNEL: { id: FunnelStage; label: string }[] = [
  { id: "access", label: "Access" }, { id: "discovery", label: "Discovery" }, { id: "comparison", label: "Comparison" }, { id: "purchase", label: "Purchase" },
  { id: "repeat", label: "Repeat" }, { id: "autonomous", label: "Autonomous" }, { id: "gmv-share", label: "GMV share" }, { id: "traffic", label: "AI referral traffic" }, { id: "merchant-readiness", label: "Merchant readiness" },
];

const INHERITED = [
  { what: "Internet and smartphone access", ecomTook: "US adults online: 14% (1995) → 76% (2010); smartphones 35% (2011) → 91% (2025)", status: "Inherited" },
  { what: "Card-not-present payments and liability rules", ecomTook: "Zero-liability card policies arrived around 2000; wallets and stored cards in the 2000s–2010s", status: "Inherited, but built for a human clicking 'buy'" },
  { what: "Digitized merchants and catalogs", ecomTook: "Two decades of marketplace and platform build-out", status: "Inherited; machine-readable quality varies" },
  { what: "Logistics, delivery and returns", ecomTook: "Fulfilment networks, two-day then same-day delivery", status: "Inherited unchanged" },
  { what: "Reviews and trust signals", ecomTook: "Grew with marketplaces from the late 1990s", status: "Inherited; gameable by and for agents" },
];

export default function Adoption() {
  const [mode, setMode] = useState<Mode>("calendar");
  const [preset, setPreset] = useState<ScenarioKey>("base");
  const [p, setP] = useState<AdoptionParams>(SCENARIO_PRESETS.base.params);
  const [stage, setStage] = useState<FunnelStage>("purchase");
  const { table, toggle } = useTableToggle();

  const ecom = useMemo(() => US_ECOM.series.map((s) => ({ year: qToYear(s.q), pct: s.pct, q: s.q })), []);
  const scen = useMemo(() => (Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).map((k) => ({ k, curve: adoptionCurve(SCENARIO_PRESETS[k].params) })), []);
  const custom = useMemo(() => adoptionCurve(p), [p]);

  const shift = (series: { year: number; pct: number }[], which: "ecom" | "agentic") => {
    if (mode === "calendar") return series.map((d) => ({ x: d.year, pct: d.pct }));
    if (mode === "stage") {
      const cross = series.find((d) => d.pct >= STAGE_THRESHOLD);
      if (!cross) return [];
      return series.filter((d) => d.year >= cross.year).map((d) => ({ x: d.year - cross.year, pct: d.pct }));
    }
    const a = ANCHORS[mode][which].year;
    return series.map((d) => ({ x: d.year - a, pct: d.pct }));
  };

  const ecomS = shift(ecom, "ecom");
  const scenS = scen.map((s) => ({ ...s, data: shift(s.curve.points, "agentic") }));
  const customS = shift(custom.points, "agentic");
  const xLabel = mode === "calendar" ? "Year" : mode === "stage" ? `Years since reaching ${STAGE_THRESHOLD}% of US retail sales` : ANCHORS[mode].label;
  const allX = [...ecomS, ...scenS.flatMap((s) => s.data), ...customS].map((d) => d.x);
  const yMax = Math.max(30, Math.ceil(Math.max(...customS.map((d) => d.pct), ...scenS.flatMap((s) => s.data.map((d) => d.pct))) / 5) * 5 + 5);
  const same = (k: ScenarioKey) => JSON.stringify(SCENARIO_PRESETS[k].params) === JSON.stringify(p);
  const xMin = Math.floor(Math.min(...allX));
  const xMax = Math.ceil(Math.max(...allX));
  const metrics = AGENT_METRICS.filter((m) => m.stage === stage);
  const applyPreset = (k: ScenarioKey) => { setPreset(k); setP(SCENARIO_PRESETS[k].params); };
  const set = (k: keyof AdoptionParams) => (v: number) => setP((x) => ({ ...x, [k]: v }));
  const fmtX = (v: number) => (mode === "calendar" ? String(Math.round(v)) : `${v > 0 ? "+" : ""}${Math.round(v)}`);

  return (
    <Section id="adoption" num="03" title="The adoption race"
      dek="Are we replaying e-commerce at 2×, 5× or 10× speed? It depends entirely on what you measure. Access is racing ahead; delegated purchasing has barely started."
      takeaway={<>Agentic commerce inherits the rails e-commerce spent 25 years building, so the <strong>physical speed limits are gone</strong>. The new speed limit is <strong>trust to spend</strong>. In mid-2026, 53% of consumers in 11 markets used AI for shopping, but only about 9% completed a purchase through it. A billion people with an assistant is not a billion people letting it pay.</>}>

      <Fig title="Visualization B · The great adoption race"
        sub={<>Share of US retail sales: e-commerce as measured by the US Census Bureau, against <strong>illustrative</strong> agent-executed scenarios. Re-align the clocks to compare like with like.</>}
        controls={toggle}
        foot={<><span><span className="ctd-sw ecom" />E-commerce share of total US retail, seasonally adjusted <Ev kind="measured" /><Cite ids={US_ECOM.sourceIds} /></span><span><span className="ctd-dash" />Agentic scenarios, % of retail sales executed by agents <Ev kind="illustrative" /></span></>}>
        <div className="ctd-seg-row">
          <div className="ctd-seg" role="group" aria-label="Align timelines by">
            {([["calendar", "Calendar time"], ["intro", "Since introduction"], ["adoption", "Since consumer adoption"], ["transaction", "Since first measured transaction"], ["stage", "Comparable stage"]] as [Mode, string][]).map(([id, l]) => (
              <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>{l}</button>
            ))}
          </div>
        </div>
        {table ? (
          <div className="ctd-table-wrap" style={{ maxHeight: 360 }}>
            <table className="ctd-table">
              <thead><tr><th>Quarter</th><th>E-commerce % of US retail</th></tr></thead>
              <tbody>{ecom.filter((d) => d.q.endsWith("Q4") || d.q === ecom[ecom.length - 1].q).map((d) => <tr key={d.q}><td>{d.q}</td><td className="n">{d.pct.toFixed(1)}%</td></tr>)}</tbody>
            </table>
          </div>
        ) : (
          <div className="ctd-chart" style={{ height: 380 }}>
            <ResponsiveContainer>
              <LineChart margin={{ top: 16, right: 110, bottom: 24, left: 4 }}>
                <CartesianGrid stroke="#e2ddd2" strokeDasharray="0" vertical={false} />
                <XAxis type="number" dataKey="x" domain={[xMin, xMax]} tickFormatter={fmtX} stroke="#9aa0ad" tick={{ fontSize: 12, fill: "#6b7285" }} label={{ value: xLabel, position: "insideBottom", offset: -14, fontSize: 12, fill: "#6b7285" }} allowDuplicatedCategory={false} />
                <YAxis domain={[0, yMax]} tickFormatter={(v) => `${v}%`} stroke="#9aa0ad" tick={{ fontSize: 12, fill: "#6b7285" }} width={44} />
                {mode !== "calendar" && <ReferenceLine x={0} stroke="#9aa0ad" strokeDasharray="3 3" />}
                {mode === "calendar" && <ReferenceLine x={2026.86} stroke="#9aa0ad" strokeDasharray="3 3" label={{ value: "Nov 2026", position: "top", fontSize: 11, fill: "#6b7285" }} />}
                <Tooltip content={<ChartTip mode={mode} />} />
                <Line data={ecomS} dataKey="pct" name="E-commerce (measured)" stroke="#eb6834" strokeWidth={2} dot={false} isAnimationActive={false} label={<EndLabel n={ecomS.length} text="E-commerce" color="#b4461b" />} />
                {scenS.map((s) => (
                  <Line key={s.k} data={s.data} dataKey="pct" name={`${SCENARIO_PRESETS[s.k].label} (illustrative)`} stroke="#2a78d6" strokeOpacity={s.k === preset ? 0.35 : 0.55} strokeWidth={1.5} strokeDasharray={DASH[s.k]} dot={false} isAnimationActive={false} label={same(s.k) ? undefined : <EndLabel n={s.data.length} text={SCENARIO_PRESETS[s.k].label} color="#1c5cab" />} />
                ))}
                <Line data={customS} dataKey="pct" name="Your settings (illustrative)" stroke="#1c5cab" strokeWidth={2.5} dot={false} isAnimationActive={false} label={<EndLabel n={customS.length} text={(Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).find(same) ? `${SCENARIO_PRESETS[(Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).find(same)!].label} (your settings)` : "Your settings"} color="#14213d" bold />} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {mode !== "calendar" && (
          <div className="ctd-anchor-note">
            {mode === "stage" ? (
              <p><b>Comparable stage:</b> each series starts when it first reaches {STAGE_THRESHOLD}% of US retail sales, the level at which the Census Bureau first measured e-commerce (1999Q4). Only like-for-like denominators are aligned. Scenarios that never reach the threshold by 2035 drop out.</p>
            ) : (
              <p><b>Anchors.</b> E-commerce: {ANCHORS[mode].ecom.what}. Agentic: {ANCHORS[mode].agentic.what}. Change the anchor and the &ldquo;speed&rdquo; changes, which is the point: speed claims depend on the chosen starting gun.</p>
            )}
          </div>
        )}
      </Fig>

      <div className="ctd-lab ctd-block">
        <Fig title="Visualization H · The 2030 scenario lab"
          sub="Adjust the assumptions behind the 'Your settings' curve above. Presets load the three labeled scenarios."
          foot={<><Ev kind="illustrative" /> A transparent model for exploring assumptions. It is not a forecast and has not been independently verified.</>}>
          <div className="ctd-chips" role="group" aria-label="Scenario preset" style={{ marginBottom: 12 }}>
            {(Object.keys(SCENARIO_PRESETS) as ScenarioKey[]).map((k) => <button key={k} type="button" className="ctd-chip" aria-pressed={preset === k} onClick={() => applyPreset(k)}>{SCENARIO_PRESETS[k].label}</button>)}
          </div>
          <p className="ctd-small ctd-muted" style={{ marginBottom: 14 }}>{SCENARIO_PRESETS[preset].blurb}</p>
          <div className="ctd-lab-grid">
            <div className="ctd-lab-sliders">
              <Slider label="Categories in scope" value={p.scope} min={10} max={90} unit="%" onChange={set("scope")} help="Share of retail spend in categories where agent execution is plausible (section 09)." />
              <Slider label="Merchants agents can transact with" value={p.merchantAccess} min={5} max={100} unit="%" onChange={set("merchantAccess")} help="Spend at merchants exposing agent-accessible checkout." />
              <Slider label="Transaction completion reliability" value={p.reliability} min={30} max={100} unit="%" onChange={set("reliability")} help="Benchmarks in 2023–25 put web-agent task success well below human levels." />
              <Slider label="Consumer delegation rate" value={p.delegation} min={1} max={80} unit="%" onChange={set("delegation")} help="Of eligible purchases, the share people let an agent execute. Surveys: 6–38% depending on wording." />
              <Slider label="Trust (speed of spread)" value={p.trust} min={0} max={100} onChange={set("trust")} help="Raises the growth rate and pulls the inflection point earlier." />
              <Slider label="Repeat purchasing" value={p.repeat} min={0} max={100} onChange={set("repeat")} help="Habit formation among agent buyers; raises the growth rate." />
            </div>
            <div className="ctd-lab-out">
              <div className="ctd-stat"><span>2030</span><b className="ctd-mono">{valueAt(custom, 2030).toFixed(1)}%</b><small>of US retail executed by agents</small></div>
              <div className="ctd-stat"><span>2035</span><b className="ctd-mono">{valueAt(custom, 2035).toFixed(1)}%</b><small>vs e-commerce at 17.1% after ~31 years</small></div>
              <div className="ctd-stat"><span>Ceiling</span><b className="ctd-mono">{custom.ceiling.toFixed(1)}%</b><small>long-run maximum under these settings</small></div>
              <div className="ctd-formula">
                <div className="ctd-h4">Formula</div>
                <code>ceiling = scope × merchants × reliability × delegation</code>
                <code>k = 0.15 + 0.35·trust + 0.15·repeat = {custom.k.toFixed(2)}/yr</code>
                <code>midpoint = 2029 + 9·(1 − trust) = {custom.midpoint.toFixed(1)}</code>
                <code>share(t) = ceiling · (L(t) − L(2025)) / (1 − L(2025))</code>
                <small>L is the logistic curve 1/(1+e<sup>−k(t−midpoint)</sup>). Sensitivity: the ceiling is multiplicative, so halving any one factor halves the long-run share. Trust changes timing more than size.</small>
              </div>
            </div>
          </div>
        </Fig>
      </div>

      <div className="ctd-block">
        <Fig title="The adoption funnel, kept apart"
          sub="Each stage has a different denominator. These figures cannot be added, averaged or chained. Pick a stage to see what is actually measured."
          foot={<>Values as reported; read the denominator and limitation before comparing any two figures.</>}>
          <div className="ctd-chips" role="group" aria-label="Funnel stage" style={{ marginBottom: 12 }}>
            {FUNNEL.map((f) => { const n = AGENT_METRICS.filter((m) => m.stage === f.id).length; return <button key={f.id} type="button" className="ctd-chip" aria-pressed={stage === f.id} onClick={() => setStage(f.id)} disabled={!n}>{f.label} <span className="ctd-mono">{n}</span></button>; })}
          </div>
          <div className="ctd-metrics">
            {metrics.map((m) => (
              <div key={m.id} className="ctd-metric">
                <div className="ctd-metric-top"><b className="ctd-mono">{m.value}</b><Ev kind={m.kind} /></div>
                <p className="ctd-metric-def">{m.definition}<Cite ids={m.sourceIds} /></p>
                <dl>
                  <div><dt>Denominator</dt><dd>{m.denominator}</dd></div>
                  <div><dt>Where / when</dt><dd>{m.geo} · {m.period}</dd></div>
                  <div className="ctd-deep"><dt>Limitation</dt><dd>{m.limitations}</dd></div>
                </dl>
              </div>
            ))}
          </div>
        </Fig>
      </div>

      <div className="ctd-grid2 ctd-block">
        <div className="ctd-card">
          <div className="ctd-h4">Why it could be faster: what agents inherit</div>
          <div className="ctd-table-wrap" style={{ marginTop: 8 }}><table className="ctd-table">
            <thead><tr><th>Capability</th><th>What it took e-commerce</th><th>For agents</th></tr></thead>
            <tbody>{INHERITED.map((r) => <tr key={r.what}><td><b>{r.what}</b></td><td>{r.ecomTook}</td><td>{r.status}</td></tr>)}</tbody>
          </table></div>
        </div>
        <div className="ctd-card">
          <div className="ctd-h4">Why it could be slower: problems e-commerce never had</div>
          <ul className="ctd-list">
            {PROBLEMS.slice(0, 7).map((x) => <li key={x.id}><b>{x.problem}.</b> <span className="ctd-deep-inline">{x.evidence}</span><Cite ids={x.sourceIds} /></li>)}
          </ul>
        </div>
      </div>

      <div className="ctd-block ctd-deep">
        <Details title="How long e-commerce took to cross each threshold (US, consistent Census definition)">
          <div className="ctd-table-wrap"><table className="ctd-table">
            <thead><tr><th>Threshold</th><th>First quarter</th><th>Years after Amazon opened</th><th>Note</th></tr></thead>
            <tbody>{US_ECOM.thresholds.map((t, i) => <tr key={i}><td className="n">{t.pct}%{t.label ? " (sustained)" : ""}</td><td>{t.firstQuarter}</td><td className="n">{t.yearsSince1995}</td><td>{t.note ?? ""}<Cite ids={t.sourceIds} /></td></tr>)}</tbody>
          </table></div>
          <p><strong>Definition:</strong> {US_ECOM.definition}</p>
          <p><strong>Are these the right analogies?</strong> Partly. They measure spend executed online on a consistent denominator, which is the right comparison for <em>agent-executed</em> commerce. They are the wrong comparison for <em>AI-influenced</em> commerce, which is better compared with the share of purchases researched online (most of them, by the 2010s). Applicable-retail shares (excluding autos and fuel) run higher than the total-retail figures shown.</p>
        </Details>
      </div>
    </Section>
  );
}

function EndLabel(props: { index?: number; x?: number; y?: number; n: number; text: string; color: string; bold?: boolean }) {
  const { index, x, y, n, text, color, bold } = props;
  if (index !== n - 1 || x == null || y == null) return null;
  return <text x={x + 6} y={y + 4} fontSize={12} fill={color} fontWeight={bold ? 700 : 500}>{text}</text>;
}

function ChartTip({ active, payload, mode }: { active?: boolean; payload?: { name: string; value: number; payload: { x: number } }[]; mode: Mode }) {
  if (!active || !payload?.length) return null;
  const x = payload[0].payload.x;
  const when = mode === "calendar" ? (Math.floor(x) + (x % 1 >= 0.5 ? " H2" : " H1")) : `${x >= 0 ? "+" : ""}${x.toFixed(1)} years`;
  return (
    <div className="ctd-tip">
      <b>{when}</b>
      {payload.map((p) => <div key={p.name}>{p.name}: <span className="ctd-mono">{p.value.toFixed(1)}%</span></div>)}
    </div>
  );
}
