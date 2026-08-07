"use client";

import { cloudLabel } from "@/lib/finops/catalog";
import {
  Assessment,
  FRONTIER_MODELS,
  MODEL_POINTS,
  TIER_META,
  recommendationsFor,
} from "@/lib/finops/engine";
import { blendedPrice } from "@/lib/finops/catalog";
import { money, moneyFull, ms, pct, perMTok, signed } from "@/lib/finops/format";
import { TierChip, TipRows, useChartTip, useMeasure } from "./primitives";

const H = 420;
const PAD = { top: 16, right: 16, bottom: 40, left: 52 };
const X_MIN = 54;
const X_MAX = 98;
const Y_MIN = 0.05;
const Y_MAX = 40;

const TIER_COLOR: Record<string, string> = {
  frontier: "var(--good)",
  near: "var(--warn)",
  opportunity: "var(--serious)",
  severe: "var(--critical)",
};

export default function Pareto({
  items,
  selectedId,
  onSelect,
}: {
  items: Assessment[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [hostRef, width] = useMeasure<HTMLDivElement>();
  const { hostRef: tipHost, show, hide, tipNode } = useChartTip();

  const W = Math.max(360, width);
  const x = (q: number) => PAD.left + ((q - X_MIN) / (X_MAX - X_MIN)) * (W - PAD.left - PAD.right);
  const y = (c: number) =>
    PAD.top +
    (1 - (Math.log10(Math.max(Y_MIN, c)) - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN))) *
      (H - PAD.top - PAD.bottom);

  const maxSpend = Math.max(...items.map((i) => i.current.monthly));
  const r = (spend: number) => 5 + Math.sqrt(spend / maxSpend) * 15;

  const selected = items.find((i) => i.w.id === selectedId) ?? null;
  const frontierPath = FRONTIER_MODELS.map(
    (m, i) => `${i === 0 ? "M" : "L"}${x(m.quality).toFixed(1)},${y(blendedPrice(m)).toFixed(1)}`,
  ).join(" ");

  const yTicks = [0.1, 0.3, 1, 3, 10, 30];
  const xTicks = [55, 60, 65, 70, 75, 80, 85, 90, 95];

  return (
    <div className="fo-pareto-grid">
      <div className="fo-card">
        <div className="fo-card-head">
          <span className="fo-card-title">The AI Pareto frontier</span>
          <span className="fo-card-sub">
            Effective $ / 1M tokens (log) vs. blended quality index · bubble = monthly spend · click a workload
          </span>
        </div>
        <div ref={hostRef}>
          <div ref={tipHost} style={{ position: "relative" }}>
            {width > 0 && (
              <svg width={W} height={H} role="img" aria-label="Scatter of workloads versus the model cost-quality frontier">
                {yTicks.map((t) => (
                  <g key={t}>
                    <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} stroke="var(--grid)" strokeWidth={1} />
                    <text x={PAD.left - 8} y={y(t) + 3.5} textAnchor="end" fontSize={10} fill="var(--muted)">
                      {perMTok(t)}
                    </text>
                  </g>
                ))}
                {xTicks.map((t) => (
                  <text key={t} x={x(t)} y={H - 22} textAnchor="middle" fontSize={10} fill="var(--muted)">
                    {t}
                  </text>
                ))}
                <text x={(W + PAD.left - PAD.right) / 2} y={H - 6} textAnchor="middle" fontSize={10.5} fill="var(--ink-2)">
                  Blended quality index (reasoning · instruction · grounding) →
                </text>
                <text
                  transform={`translate(12 ${(H - PAD.bottom + PAD.top) / 2}) rotate(-90)`}
                  textAnchor="middle" fontSize={10.5} fill="var(--ink-2)"
                >
                  ← Effective $ / 1M tokens
                </text>
                <line x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} stroke="var(--baseline)" strokeWidth={1} />

                {/* efficient frontier */}
                <path d={frontierPath} fill="none" stroke="var(--seq-450)" strokeWidth={2} strokeDasharray="6 5" strokeLinejoin="round" opacity={0.9} />

                {/* candidate model marks (context, de-emphasised) */}
                {MODEL_POINTS.map((m, idx) => {
                  const mx = x(m.quality);
                  const my = y(blendedPrice(m));
                  const onFrontier = FRONTIER_MODELS.includes(m);
                  return (
                    <g key={m.id}>
                      <rect
                        x={mx - 4} y={my - 4} width={8} height={8} rx={2}
                        transform={`rotate(45 ${mx} ${my})`}
                        fill={onFrontier ? "var(--seq-450)" : "var(--baseline)"}
                        stroke="var(--surface)" strokeWidth={2}
                        onMouseMove={(e) =>
                          show(e, <TipRows title={`${m.name} (${m.vendor})`} rows={[
                            ["List blend $/1M", perMTok(blendedPrice(m))],
                            ["Quality index", `${m.quality}`],
                            ["TTFT p50", ms(m.ttftMs)],
                            [onFrontier ? "On frontier" : "Dominated", onFrontier ? "yes" : "yes"],
                          ]} />)
                        }
                        onMouseLeave={hide}
                      />
                      {onFrontier && (
                        <text
                          x={mx} y={my + (idx % 2 === 0 ? -10 : 18)}
                          textAnchor="middle" fontSize={9.5} fill="var(--muted)"
                        >
                          {m.name}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* gap connector for selection */}
                {selected && (
                  <line
                    x1={x(selected.model.quality)} y1={y(selected.current.effPerMTok)}
                    x2={x(selected.frontier.model.quality)} y2={y(selected.frontier.effPerMTok)}
                    stroke={TIER_COLOR[selected.tier]} strokeWidth={1.5} strokeDasharray="3 3"
                    markerEnd="url(#fo-arrow)"
                  />
                )}
                <defs>
                  <marker id="fo-arrow" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L8,4 L0,8 z" fill={selected ? TIER_COLOR[selected.tier] : "var(--muted)"} />
                  </marker>
                </defs>

                {/* workload bubbles */}
                {[...items]
                  .sort((a, b) => b.current.monthly - a.current.monthly)
                  .map((a) => {
                    const cx = x(a.model.quality);
                    const cy = y(a.current.effPerMTok);
                    const rr = r(a.current.monthly);
                    const isSel = a.w.id === selectedId;
                    return (
                      <circle
                        key={a.w.id}
                        cx={cx} cy={cy} r={rr}
                        fill={TIER_COLOR[a.tier]}
                        fillOpacity={isSel ? 0.95 : 0.72}
                        stroke="var(--surface)" strokeWidth={2}
                        tabIndex={0}
                        className="fo-focusable"
                        style={{ cursor: "pointer" }}
                        aria-label={`${a.w.name}: ${moneyFull(a.current.monthly)} per month, ${TIER_META[a.tier].label}`}
                        onClick={() => onSelect(isSel ? null : a.w.id)}
                        onKeyDown={(e) => e.key === "Enter" && onSelect(isSel ? null : a.w.id)}
                        onMouseMove={(e) =>
                          show(e, <TipRows title={a.w.name} rows={[
                            ["Model", a.model.name],
                            ["Monthly cost", moneyFull(a.current.monthly)],
                            ["Effective $/1M", perMTok(a.current.effPerMTok)],
                            ["Gap to frontier", `${money(a.gapMonthly)}/mo (${pct(1 - a.efficiency)})`],
                            ["Tier", TIER_META[a.tier].label],
                          ]} />)
                        }
                        onFocus={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          show({ clientX: rect.left, clientY: rect.top },
                            <TipRows title={a.w.name} rows={[["Monthly cost", moneyFull(a.current.monthly)], ["Gap", `${money(a.gapMonthly)}/mo`]]} />);
                        }}
                        onMouseLeave={hide}
                        onBlur={hide}
                      />
                    );
                  })}
              </svg>
            )}
            {tipNode}
          </div>
          <div className="fo-legend">
            {(Object.keys(TIER_META) as (keyof typeof TIER_META)[]).map((t) => (
              <span className="fo-legend-item" key={t}>
                <span className="fo-dot" style={{ background: TIER_COLOR[t] }} />
                {TIER_META[t].label} <b>{items.filter((i) => i.tier === t).length}</b>
              </span>
            ))}
            <span className="fo-legend-item">
              <span className="fo-line-key" /> Efficient frontier
            </span>
            <span className="fo-legend-item">
              <span className="fo-dot" style={{ background: "var(--baseline)", borderRadius: 2 }} /> Candidate model
            </span>
          </div>
        </div>
      </div>

      <DetailPanel a={selected} />
    </div>
  );
}

function DetailPanel({ a }: { a: Assessment | null }) {
  if (!a) {
    return (
      <div className="fo-card fo-detail">
        <div className="fo-card-head"><span className="fo-card-title">Workload drill-down</span></div>
        <div className="fo-detail-empty">
          Select a workload bubble (or a row in the estate table) to see its frontier
          alternative, the expected cost / quality / latency change and migration complexity.
        </div>
      </div>
    );
  }
  const f = a.frontier;
  const recs = recommendationsFor(a);
  const effort = recs.find((r) => r.kind === "substitution")?.effort ?? (recs[0]?.effort ?? "Low");
  return (
    <div className="fo-card fo-detail">
      <div className="fo-card-head" style={{ marginBottom: 0 }}>
        <div>
          <h4>{a.w.name}</h4>
          <div className="fo-card-sub">{a.w.bu} · {a.w.useCase} · {a.w.region}</div>
        </div>
        <span className="fo-card-right"><TierChip tier={a.tier} /></span>
      </div>
      <div className="fo-vs">
        <div className="fo-vs-box">
          <h5>Current</h5>
          <div className="big">{money(a.current.monthly)}/mo</div>
          <div className="sub">{a.model.name} · {cloudLabel(a.w.cloud)}</div>
          <div className="sub">Q {a.model.quality} · TTFT {ms(a.model.ttftMs)} · {perMTok(a.current.effPerMTok)}/1M</div>
        </div>
        <div className="fo-vs-box" style={{ borderColor: "var(--seq-450)" }}>
          <h5>Frontier target</h5>
          <div className="big">{money(f.monthly)}/mo</div>
          <div className="sub">{f.model.name} · {cloudLabel(f.cloud)}</div>
          <div className="sub">Q {f.model.quality} · TTFT {ms(f.model.ttftMs)} · {perMTok(f.effPerMTok)}/1M</div>
        </div>
      </div>
      <div className="fo-kv"><span>Pareto gap</span><b className={a.gapMonthly > 0 ? "neg" : "pos"}>{money(a.gapMonthly)}/mo · {pct(1 - a.efficiency)} above frontier</b></div>
      <div className="fo-kv"><span>Annualized savings</span><b className="pos">{money(a.gapMonthly * 12)}</b></div>
      <div className="fo-kv"><span>Quality change</span><b className={f.model.quality >= a.model.quality ? "pos" : ""}>{signed(f.model.quality - a.model.quality)} pts (floor {a.w.qualityFloor})</b></div>
      <div className="fo-kv"><span>Latency change (TTFT)</span><b className={f.model.ttftMs <= a.model.ttftMs ? "pos" : ""}>{signed(f.model.ttftMs - a.model.ttftMs, "ms")}</b></div>
      <div className="fo-kv"><span>Cache hit (eligible share)</span><b>{pct(a.w.cacheHitRate)} → {pct(f.levers.cacheHitRate)}</b></div>
      <div className="fo-kv"><span>Batch share</span><b>{pct(a.w.batchShare)} → {pct(f.levers.batchShare)}</b></div>
      <div className="fo-kv"><span>Capacity</span><b>{a.w.capacity.type === "committed" ? `Committed @ ${pct(a.w.capacity.utilization)}` : "PayGo"} → {f.levers.capacity.type === "committed" ? `Committed @ ${pct(f.levers.capacity.utilization)}` : "PayGo"}</b></div>
      <div className="fo-kv"><span>Cost / successful task</span><b>${a.costPerTask.toFixed(4)}</b></div>
      <div className="fo-kv"><span>Migration complexity</span><b><span className={`fo-badge effort-${effort}`}>{effort}</span></b></div>
      {recs.length > 0 && (
        <p className="fo-note" style={{ marginTop: 10 }}>
          Top action: <strong style={{ color: "var(--ink)" }}>{recs[0].title}</strong> — {money(recs[0].monthlySavings)}/mo. Full plan in the Opportunities tab.
        </p>
      )}
    </div>
  );
}
