"use client";

import { useState } from "react";
import { useSite } from "../context";
import { Src } from "../ui";
import { billions, money } from "@/lib/korea-fy27/format";

const PRESETS = [
  { label: "Plan", m: 2.0, s: 34 },
  { label: "Hold today's share", m: 2.0, s: 17 },
  { label: "Low-end TAM", m: 1.4, s: 34 },
  { label: "High-end TAM", m: 2.6, s: 34 },
];

/** 2x market × 2x share, as a stress test on the deck's own inputs. */
export default function Equation() {
  const { model } = useSite();
  const base = model.equationRanges.marketFY26;
  const fy26 = model.headline.fy26Ai;
  const plan = model.headline.fy27Plan;
  const [m, setM] = useState(2.0);
  const [s, setS] = useState(34);

  const shareToday = (fy26 / base) * 100;
  const market27 = base * m;
  const result = Math.round(market27 * (s / 100));
  const needed = (plan / market27) * 100;
  const gap = result - plan;

  return (
    <div className="k-fig">
      <div className="k-fig-head">
        <div>
          <h3>Stress-test the equation: FY26 × market growth × share growth</h3>
          <p>
            Move either input. FY27 Google AI = FY26 wallet ({money(base)}) × market multiple × FY27 share. The deck&rsquo;s FY27 TAM range is ${model.equationRanges.tamFY27Range[0].toLocaleString()}–{model.equationRanges.tamFY27Range[1].toLocaleString()}M, which puts the share needed for ~$900M at {model.equationRanges.shareAtPlanRange[0]}–{model.equationRanges.shareAtPlanRange[1]}%.
          </p>
        </div>
        <div className="k-pill-row k-noprint" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className="k-pill" aria-pressed={m === p.m && s === p.s} onClick={() => { setM(p.m); setS(p.s); }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="k-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", alignItems: "start" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="k-slider">
            <label htmlFor="k-eq-m">
              Market multiple, FY26 → FY27 <b>{m.toFixed(2)}x · {billions(market27, { digits: 2 })}</b>
            </label>
            <input id="k-eq-m" type="range" min={1.4} max={2.6} step={0.05} value={m} onChange={(e) => setM(Number(e.target.value))} />
            <span className="hint">Deck: ~2.0x (1.6–2.2x by segment, net of token deflation)</span>
          </div>
          <div className="k-slider">
            <label htmlFor="k-eq-s">
              Google share of wallet, FY27 <b>{s}% · {(s / shareToday).toFixed(1)}x today&rsquo;s {shareToday.toFixed(0)}%</b>
            </label>
            <input id="k-eq-s" type="range" min={17} max={49} step={1} value={s} onChange={(e) => setS(Number(e.target.value))} />
            <span className="hint">Deck: ~34% at plan</span>
          </div>
        </div>

        <div className="k-kv" aria-live="polite">
          <div>
            <dt>FY27 Google AI</dt>
            <dd>
              {money(result)} <small>{(result / fy26).toFixed(1)}x FY26</small>
            </dd>
          </div>
          <div>
            <dt>vs the ~$900M plan</dt>
            <dd style={{ color: gap < -5 ? "var(--risk)" : "var(--ink)" }}>{Math.abs(gap) < 5 ? "On plan" : money(Math.round(gap), { sign: true })}</dd>
          </div>
          <div>
            <dt>Share needed for ~$900M at this market size</dt>
            <dd>{needed.toFixed(0)}%</dd>
          </div>
        </div>
      </div>

      <p className="k-small k-muted" style={{ marginTop: 12 }}>
        At the plan point the arithmetic gives {money(Math.round(base * 2 * 0.34))}: the deck rounds the market to ~2x and the share to ~34%. Holding today&rsquo;s share at a uniform 2.0x gives {money(Math.round(base * 2 * (fy26 / base)))}; weighting each segment by its own TAM growth, the deck gets ~$435M (next chart).
      </p>
      <Src src={[{ part: "main", slides: "4" }, { part: "A", slides: "44, 49" }]} basis={["derived"]} extra={<span>Illustrative arithmetic on the deck&rsquo;s inputs; not a forecast.</span>} />
    </div>
  );
}
