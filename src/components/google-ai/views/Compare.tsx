"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import { fmtDate } from "@/lib/google-ai/dates";
import { SCENARIOS } from "@/lib/google-ai/editorial";
import { surfaceLabel } from "@/lib/google-ai/engine/answer";
import {
  GOOGLE_ID,
  PRICE_BY_ID,
  battlegroundRivals,
  benchLabel,
  defaultPicks,
  headToHeadBenchmarks,
  independentSets,
  isSpeedBenchmark,
  linearScale,
  logScale,
  modelRow,
  modelRows,
  priceSourceIds,
  scenarioFit,
  topicGroups,
  type BenchTopic,
  type IndependentSet,
  type ModelRow,
  type Scale,
} from "@/lib/google-ai/engine/compare";
import { lookup } from "@/lib/google-ai/engine/pricing";
import { BATTLEGROUNDS, BENCHMARKS, ENTITY_BY_ID, RESULTS, providerName, fmtIntro } from "@/lib/google-ai/kb";
import type { BenchmarkDef, BenchmarkResult, PriceRecord } from "@/lib/google-ai/types";
import { Cites, Claims, Empty, EntityLink, Ev, Sec, Seg, Status, compact, providerColor, usd, useHub } from "../ui";
import "./models.css";

const MODES = [
  { id: "head", label: "Head-to-head" },
  { id: "price", label: "Intelligence vs price" },
  { id: "speed", label: "Intelligence vs speed" },
  { id: "coding", label: "Coding and agents" },
  { id: "multimodal", label: "Multimodal" },
  { id: "open", label: "Open vs proprietary" },
  { id: "workload", label: "Pick for a workload" },
] as const;
type Mode = (typeof MODES)[number]["id"];
const MAX_PICKS = 4;

const NR = <span className="gai-muted">not recorded</span>;
const yesNo = (v?: boolean) => (v == null ? NR : v ? "yes" : "no");
const uniq = (ids: string[]) => [...new Set(ids)];
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const modelName = (id: string) => ENTITY_BY_ID[id]?.name ?? id;
const reporterLabel = (r: BenchmarkResult) => (r.reporter === "independent" ? "independent-measurement" : "provider-claim") as "independent-measurement" | "provider-claim";
const setup = (r: BenchmarkResult) => [r.modelVersion, r.reasoningConfig, r.scaffold].filter(Boolean).join(" · ") || "setup not stated";

/** The number as recorded, with a percent sign when the unit is a percentage. The full unit is named once, beside the benchmark. */
function fmtScore(score: number, def?: BenchmarkDef): string {
  return (def?.unit ?? "").trim().startsWith("%") ? `${score}%` : String(score);
}

/** Shareable state: mirror a choice into the query string without a navigation. */
function syncUrl(patch: Record<string, string | null>) {
  try {
    const url = new URL(window.location.href);
    for (const [k, v] of Object.entries(patch)) {
      if (v) url.searchParams.set(k, v);
      else url.searchParams.delete(k);
    }
    window.history.replaceState(null, "", url);
  } catch {
    // The URL is a convenience; the view works without it.
  }
}

function ModelLink({ id }: { id: string }) {
  return ENTITY_BY_ID[id] ? <Link className="gai-link" href={`/google-ai/entity/${id}`}>{ENTITY_BY_ID[id].name}</Link> : <span className="gai-mono" title="Not in the knowledge base">{id}</span>;
}
function Provider({ id }: { id?: string }) {
  if (!id) return NR;
  return <span className="gai-mc-nowrap"><i className="gai-mc-swatch" style={{ background: providerColor(id) }} aria-hidden />{providerName(id)}</span>;
}
function PriceCell({ p }: { p?: PriceRecord }) {
  if (!p) return NR;
  return (
    <>
      <span className="gai-mc-val">{usd(p.price)}</span>
      {p.unit !== "usd-per-1m-tokens" && <span className="gai-muted gai-small"> ({p.unit.replace(/-/g, " ")})</span>}
      {p.condition && <span className="gai-mc-sub">{p.condition}</span>}
      <span className="gai-mc-meta"><Ev label={p.label} short /><Cites ids={p.sourceIds} /></span>
    </>
  );
}

export default function Compare() {
  const { today } = useHub();
  const sp = useSearchParams();
  const [mode, setMode] = useState<Mode>(() => {
    const m = sp.get("mode");
    if (MODES.some((x) => x.id === m)) return m as Mode;
    return sp.get("scenario") && !sp.get("models") ? "workload" : "head";
  });
  const [initialPicks] = useState(() => {
    const valid = uniq((sp.get("models") ?? "").split(",").filter((id) => ENTITY_BY_ID[id]?.kind === "model")).slice(0, MAX_PICKS);
    if (valid.length >= 2) return valid;
    return uniq([...valid, ...defaultPicks(today, MAX_PICKS)]).slice(0, MAX_PICKS);
  });
  const change = (m: Mode) => {
    setMode(m);
    syncUrl({ mode: m === "head" ? null : m });
  };

  return (
    <>
      <div className="gai-hero">
        <span className="gai-kicker">Compare</span>
        <h1 className="gai-h1">Compare models on the same terms, or not at all</h1>
        <p className="gai-lede">
          Scores are placed side by side only when the benchmark and its version match, and independent measurements are kept apart from providers&apos; own numbers. Prices are list prices in effect on {fmtDate(today)}.
        </p>
      </div>

      <Seg value={mode} onChange={change} options={MODES} label="Comparison" />

      {mode === "head" && <HeadToHead today={today} initial={initialPicks} />}
      {mode === "price" && <Landscape kind="price" today={today} />}
      {mode === "speed" && <Landscape kind="speed" today={today} />}
      {mode === "coding" && <TopicTables topic="coding" />}
      {mode === "multimodal" && <TopicTables topic="multimodal" />}
      {mode === "open" && <OpenVsProprietary today={today} />}
      {mode === "workload" && <WorkloadPick today={today} initial={sp.get("scenario")} />}

      <div id="battlegrounds" className="gai-mc-anchor">
        <Battlegrounds initial={sp.get("battleground")} />
      </div>
    </>
  );
}

// ───────────────────────── head-to-head ─────────────────────────

interface Dim {
  label: string;
  note?: string;
  cell: (r: ModelRow) => ReactNode;
}

function HeadToHead({ today, initial }: { today: string; initial: string[] }) {
  const rows = useMemo(() => modelRows(today), [today]);
  const [picks, setPicks] = useState(initial);
  const update = (next: string[]) => {
    setPicks(next);
    syncUrl({ models: next.join(",") });
  };
  const byProvider = useMemo(() => {
    const out: Record<string, ModelRow[]> = {};
    for (const r of rows.slice().sort((a, b) => (b.e.introducedAt ?? "").localeCompare(a.e.introducedAt ?? ""))) (out[r.e.providerId] ??= []).push(r);
    return Object.entries(out).sort(([a], [b]) => (a === GOOGLE_ID ? -1 : b === GOOGLE_ID ? 1 : providerName(a).localeCompare(providerName(b))));
  }, [rows]);
  const sel = useMemo(() => picks.flatMap((id) => rows.filter((r) => r.e.id === id)), [picks, rows]);
  const bench = useMemo(() => headToHeadBenchmarks(sel.map((r) => r.e.id)), [sel]);

  if (rows.length < 2) {
    return (
      <Sec title="Head-to-head" sub="Two to four models, dimension by dimension.">
        <Empty title="Fewer than two models recorded">A side-by-side comparison needs at least two models in the knowledge base.</Empty>
      </Sec>
    );
  }

  const q = (r: ModelRow) => ({ entityId: r.e.id, date: today, surface: r.price.surface });
  const groups: { title: string; dims: Dim[] }[] = [
    {
      title: "Identity",
      dims: [
        { label: "Provider", cell: (r) => <Provider id={r.e.providerId} /> },
        { label: "Family", cell: (r) => (r.e.parentId ? <EntityLink id={r.e.parentId} /> : NR) },
        { label: "Introduced", cell: (r) => (r.e.introducedAt ? fmtIntro(r.e) : NR) },
        { label: "Stage today", cell: (r) => <Status status={r.status} short /> },
        { label: "License", cell: (r) => (r.spec?.openWeights ? `Open weights · ${r.spec.license ?? "license not recorded"}` : r.spec?.license ?? (r.spec?.openWeights === false ? "Proprietary" : NR)) },
        { label: "Sources for the model facts", cell: (r) => <span className="gai-mc-meta" style={{ marginTop: 0 }}><Cites ids={r.e.sourceIds} />{r.e.verification !== "verified" && <span className="gai-tag">{r.e.verification.replace("-", " ")}</span>}</span> },
      ],
    },
    {
      title: "Capabilities",
      dims: [
        { label: "Accepts", cell: (r) => (r.spec?.modalitiesIn.length ? r.spec.modalitiesIn.join(", ") : NR) },
        { label: "Produces", cell: (r) => (r.spec?.modalitiesOut.length ? r.spec.modalitiesOut.join(", ") : NR) },
        { label: "Reasoning", cell: (r) => r.spec?.reasoning ?? NR },
        { label: "Tool use", cell: (r) => yesNo(r.spec?.toolUse) },
        { label: "Structured output", cell: (r) => yesNo(r.spec?.structuredOutput) },
      ],
    },
    {
      title: "Technical — provider-stated",
      dims: [
        { label: "API id", cell: (r) => (r.spec?.apiIds[0] ? <><code className="gai-mono">{r.spec.apiIds[0]}</code>{r.spec.apiIds.length > 1 && <span className="gai-muted gai-small"> +{r.spec.apiIds.length - 1} more</span>}</> : NR) },
        { label: "Context window", cell: (r) => (r.spec?.contextTokens ? `${compact(r.spec.contextTokens)} tokens` : NR) },
        { label: "Maximum output", cell: (r) => (r.spec?.maxOutputTokens ? `${compact(r.spec.maxOutputTokens)} tokens` : NR) },
        { label: "Knowledge cutoff", cell: (r) => r.spec?.knowledgeCutoff ?? NR },
        ...(sel.some((r) => r.spec?.unverified?.length) ? [{ label: "Looked for, not confirmed", cell: (r: ModelRow) => (r.spec?.unverified?.length ? r.spec.unverified.join(" · ") : <span className="gai-muted">nothing flagged</span>) }] : []),
      ],
    },
    {
      title: `Economics — list price in effect ${fmtDate(today)}, US$ per 1M tokens`,
      dims: [
        { label: "Priced on", note: "The surface the prices below are quoted on.", cell: (r) => (r.price.surface ? `${surfaceLabel(r.price.surface)}${r.price.surface === "third-party-host" ? " — not the developer's own price" : ""}` : <span className="gai-muted">no token price in effect today</span>) },
        { label: "Input", cell: (r) => <PriceCell p={r.price.input} /> },
        { label: "Output", cell: (r) => <PriceCell p={r.price.output} /> },
        { label: "Cached input", cell: (r) => <PriceCell p={r.price.surface ? lookup(q(r), "cache-read") : undefined} /> },
        {
          label: "Batch tier",
          cell: (r) => {
            const bi = r.price.surface ? lookup({ ...q(r), tier: "batch" }, "input") : undefined;
            const bo = r.price.surface ? lookup({ ...q(r), tier: "batch" }, "output") : undefined;
            if (!bi && !bo) return <span className="gai-muted">no batch price recorded</span>;
            const any = (bi ?? bo)!;
            return (
              <>
                Published: <span className="gai-mc-val">{bi ? usd(bi.price) : "—"} in / {bo ? usd(bo.price) : "—"} out</span>
                <span className="gai-mc-meta"><Ev label={any.label} short /><Cites ids={uniq([...(bi?.sourceIds ?? []), ...(bo?.sourceIds ?? [])])} /></span>
              </>
            );
          },
        },
        {
          label: "Blended at 3:1",
          note: "Three parts input to one part output. A shorthand: real workloads have other mixes, caching and reasoning tokens.",
          cell: (r) => (r.blended == null ? NR : <><span className="gai-mc-val">{usd(r.blended)}</span><span className="gai-mc-sub">derived from the input and output prices above</span></>),
        },
      ],
    },
  ];

  return (
    <Sec title="Head-to-head" sub="Two to four models, dimension by dimension. A gap reads “not recorded”; it is never shown as zero.">
      <div className="gai-card gai-stack">
        <div className="gai-mc-pickers">
          {picks.map((id, i) => (
            <label key={i} className="gai-mc-picker">
              <span>
                Model {i + 1}
                {picks.length > 2 && <button type="button" className="gai-link" onClick={() => update(picks.filter((_, k) => k !== i))} aria-label={`Remove ${modelName(id)}`}>Remove</button>}
              </span>
              <select className="gai-select" value={id} onChange={(e) => update(picks.map((p, k) => (k === i ? e.target.value : p)))}>
                {!ENTITY_BY_ID[id] && <option value={id}>{id}</option>}
                {byProvider.map(([p, list]) => (
                  <optgroup key={p} label={providerName(p)}>
                    {list.map((r) => <option key={r.e.id} value={r.e.id} disabled={r.e.id !== id && picks.includes(r.e.id)}>{r.e.name}{r.bucket === "retired" ? " (deprecated or retired)" : ""}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          ))}
        </div>
        {picks.length < MAX_PICKS && rows.some((r) => !picks.includes(r.e.id)) && (
          <div><button type="button" className="gai-btn" onClick={() => update([...picks, rows.find((r) => !picks.includes(r.e.id) && r.bucket !== "retired")?.e.id ?? rows.find((r) => !picks.includes(r.e.id))!.e.id])}>Add a model</button></div>
        )}
      </div>

      <div className="gai-tablewrap" style={{ marginTop: 12 }}>
        <table className="gai-table gai-mc-h2h">
          <thead>
            <tr>
              <th scope="col">Dimension</th>
              {sel.map((r) => (
                <th key={r.e.id} scope="col">
                  <span className="gai-mc-colhead">
                    <Link className="gai-link" href={`/google-ai/entity/${r.e.id}`}>{r.e.name}</Link>
                    <small><i className="gai-mc-swatch" style={{ background: providerColor(r.e.providerId) }} aria-hidden />{providerName(r.e.providerId)}</small>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((g) => (
            <tbody key={g.title}>
              <tr><th className="gai-mc-grouprow" colSpan={sel.length + 1} scope="colgroup">{g.title}</th></tr>
              {g.dims.map((d) => (
                <tr key={d.label}>
                  <th className="gai-mc-dim" scope="row">{d.label}{d.note && <span className="gai-mc-sub">{d.note}</span>}</th>
                  {sel.map((r) => <td key={r.e.id}>{d.cell(r)}</td>)}
                </tr>
              ))}
            </tbody>
          ))}
          <tbody>
            <tr><th className="gai-mc-grouprow" colSpan={sel.length + 1} scope="colgroup">Benchmarks — only where two or more of these models have a result</th></tr>
            {bench.rows.length === 0 && (
              <tr><td colSpan={sel.length + 1} className="gai-muted">No benchmark has a recorded result for two or more of the selected models.</td></tr>
            )}
            {bench.rows.map((b) => {
              const first = b.cells.find((c) => c);
              return (
                <tr key={b.benchmarkId}>
                  <th className="gai-mc-dim" scope="row">
                    {b.def?.name ?? b.benchmarkId}
                    <span className="gai-mc-sub">
                      {b.def ? `${b.def.unit || "score"} · ${b.def.higherBetter ? "higher is better" : "lower is better"}` : "benchmark definition not recorded"}
                      {b.comparable && first ? ` · ${first.benchmarkVersion ? `version ${first.benchmarkVersion}` : "version not stated"}` : ""}
                    </span>
                    {!b.comparable && <span className="gai-mc-meta"><span className="gai-tag" title={b.reason}>not directly comparable</span><span className="gai-small gai-muted">{b.reason}</span></span>}
                  </th>
                  {b.cells.map((c, i) => (
                    <td key={sel[i].e.id}>
                      {!c ? NR : (
                        <>
                          <span className={`gai-mc-val${b.leaders.includes(i) ? " gai-mc-best" : ""}`}>{fmtScore(c.score, b.def)}</span>
                          {b.leaders.includes(i) && <span className="gai-tag" style={{ marginLeft: 6 }}>leads this row</span>}
                          <span className="gai-mc-meta">
                            <Ev label={reporterLabel(c)} short />
                            <span className="gai-small gai-muted">{fmtDate(c.date)}{!b.comparable ? ` · ${c.benchmarkVersion ? `version ${c.benchmarkVersion}` : "version not stated"}` : ""}</span>
                            <Cites ids={c.sourceIds} />
                          </span>
                          <span className="gai-mc-sub">{setup(c)}</span>
                        </>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
        A row is marked as leading only when every score in it shares the benchmark version and the kind of reporter. Even then the evaluation setup under each score (model snapshot, reasoning setting, scaffold) can differ and affects the result.
        {bench.singles > 0 ? ` ${bench.singles} ${bench.singles === 1 ? "benchmark has" : "benchmarks have"} a result for only one of these models and ${bench.singles === 1 ? "is" : "are"} not listed; see each model's dossier.` : ""}
      </p>
    </Sec>
  );
}

// ───────────────────────── landscape scatter ─────────────────────────

interface Pt {
  id: string;
  name: string;
  providerId: string;
  x: number;
  y: number;
  tip: string[];
}

const SW = 720;
const SH = 420;
const SL = 56;
const SR = 22;
const ST = 34;
const SB = 48;

type Box = [x0: number, y0: number, x1: number, y1: number];
const hits = (a: Box, b: Box) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];

/** Pixel positions plus direct labels placed greedily where they collide with nothing; the rest rely on the tooltip and the table. */
function layoutScatter(pts: Pt[], xs: Scale, ys: Scale, xLog: boolean) {
  const fx = (v: number) => SL + ((xLog ? Math.log(v / xs.lo) / Math.log(xs.hi / xs.lo) : (v - xs.lo) / (xs.hi - xs.lo)) || 0) * (SW - SL - SR);
  const fy = (v: number) => SH - SB - ((v - ys.lo) / (ys.hi - ys.lo) || 0) * (SH - SB - ST);
  const items = pts.map((pt) => ({ pt, px: fx(pt.x), py: fy(pt.y), label: null as null | { x: number; y: number; anchor: "start" | "end" | "middle" } }));
  const boxes: Box[] = items.map((i) => [i.px - 7, i.py - 7, i.px + 7, i.py + 7]);
  const own = boxes.slice();
  items
    .map((it, i) => ({ it, i }))
    .sort((a, b) => a.it.py - b.it.py)
    .forEach(({ it, i }) => {
      const w = Math.min(it.pt.name.length, 22) * 6.2;
      const { px, py } = it;
      const options: { box: Box; x: number; y: number; anchor: "start" | "end" | "middle" }[] = [
        { box: [px + 8, py - 7, px + 12 + w, py + 7], x: px + 10, y: py + 4, anchor: "start" },
        { box: [px - 12 - w, py - 7, px - 8, py + 7], x: px - 10, y: py + 4, anchor: "end" },
        { box: [px - w / 2, py - 23, px + w / 2, py - 9], x: px, y: py - 11, anchor: "middle" },
        { box: [px - w / 2, py + 9, px + w / 2, py + 23], x: px, y: py + 20, anchor: "middle" },
      ];
      const fit = options.find((o) => o.box[0] >= SL + 2 && o.box[2] <= SW - 2 && o.box[1] >= ST - 16 && o.box[3] <= SH - SB - 2 && !boxes.some((b) => b !== own[i] && hits(o.box, b)));
      if (fit) {
        it.label = { x: fit.x, y: fit.y, anchor: fit.anchor };
        boxes.push(fit.box);
      }
    });
  return { items, fx, fy };
}

function Scatter({ pts, xs, ys, xLog, xTitle, yTitle, fmtX, label }: { pts: Pt[]; xs: Scale; ys: Scale; xLog: boolean; xTitle: string; yTitle: string; fmtX: (v: number) => string; label: string }) {
  const [hover, setHover] = useState<string | null>(null);
  const lay = useMemo(() => layoutScatter(pts, xs, ys, xLog), [pts, xs, ys, xLog]);
  const providers = uniq(pts.map((p) => p.providerId));
  const tip = lay.items.find((i) => i.pt.id === hover);
  return (
    <>
      <div className="gai-mc-scroll">
        <div className="gai-mc-plot gai-mc-narrow">
          <svg className="gai-chart" viewBox={`0 0 ${SW} ${SH}`} role="img" aria-label={label}>
            {ys.ticks.map((t) => (
              <g key={t}>
                <line className="grid" x1={SL} x2={SW - SR} y1={lay.fy(t)} y2={lay.fy(t)} />
                <text x={SL - 8} y={lay.fy(t) + 4} textAnchor="end">{t}</text>
              </g>
            ))}
            {xs.ticks.map((t) => (
              <g key={t}>
                <line className="grid" x1={lay.fx(t)} x2={lay.fx(t)} y1={ST} y2={SH - SB} />
                <text x={lay.fx(t)} y={SH - SB + 16} textAnchor="middle">{fmtX(t)}</text>
              </g>
            ))}
            <line className="axis" x1={SL} x2={SW - SR} y1={SH - SB} y2={SH - SB} />
            <line className="axis" x1={SL} x2={SL} y1={ST} y2={SH - SB} />
            <text className="gai-mc-axis-title" x={6} y={14}>{yTitle}</text>
            <text className="gai-mc-axis-title" x={(SL + SW - SR) / 2} y={SH - 8} textAnchor="middle">{xTitle}</text>
            {lay.items.map(({ pt, px, py, label: l }) => {
              const on = hover === pt.id;
              return (
                <a
                  key={pt.id}
                  className="gai-mc-node"
                  href={`/google-ai/entity/${pt.id}`}
                  aria-label={`${pt.name}, ${providerName(pt.providerId)}. ${pt.tip.join(". ")}. Open dossier.`}
                  onMouseEnter={() => setHover(pt.id)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(pt.id)}
                  onBlur={() => setHover(null)}
                >
                  <circle className="gai-mc-ring" cx={px} cy={py} r={12} />
                  <circle cx={px} cy={py} r={on ? 7.5 : 6} fill={providerColor(pt.providerId)} stroke="var(--surface)" strokeWidth="2" />
                  {l && <text className={on ? "lbl" : "gai-mc-nlabel"} x={l.x} y={l.y} textAnchor={l.anchor}>{clip(pt.name, 22)}</text>}
                </a>
              );
            })}
          </svg>
          {tip && (
            <div className="gai-tip" style={{ left: `${(tip.px / SW) * 100}%`, top: `${(tip.py / SH) * 100}%`, transform: `translate(${tip.px > SW * 0.72 ? "-100%" : tip.px < SW * 0.28 ? "0" : "-50%"}, ${tip.py < 110 ? "14px" : "calc(-100% - 12px)"})` }}>
              <b>{tip.pt.name}</b> · {providerName(tip.pt.providerId)}
              {tip.pt.tip.map((t) => <span key={t} className="gai-mc-tip-line">{t}</span>)}
            </div>
          )}
        </div>
      </div>
      <div className="gai-legend" style={{ marginTop: 8 }} aria-label="Legend: colour is the provider">
        {providers.map((p) => <span key={p}><i style={{ background: providerColor(p), borderRadius: "50%" }} />{providerName(p)}</span>)}
      </div>
    </>
  );
}

interface LandRow {
  r: BenchmarkResult;
  x: number;
  row?: ModelRow;
  xr?: BenchmarkResult;
}

function Landscape({ kind, today }: { kind: "price" | "speed"; today: string }) {
  const sets = useMemo(() => independentSets(), []);
  const quality = useMemo(() => sets.filter((s) => !s.speed && s.points.length >= 3), [sets]);
  const speedSets = useMemo(() => sets.filter((s) => s.speed), [sets]);
  const [yKey, setYKey] = useState(quality[0]?.key ?? "");
  const [xKey, setXKey] = useState(speedSets[0]?.key ?? "");
  const ySet: IndependentSet | undefined = quality.find((s) => s.key === yKey) ?? quality[0];
  const xSet: IndependentSet | undefined = speedSets.find((s) => s.key === xKey) ?? speedSets[0];

  const data = useMemo(() => {
    if (!ySet || (kind === "speed" && !xSet)) return null;
    const plotted: LandRow[] = [];
    const dropped: BenchmarkResult[] = [];
    for (const r of ySet.points) {
      if (kind === "price") {
        const e = ENTITY_BY_ID[r.modelId];
        const row = e ? modelRow(e, today) : undefined;
        if (row?.blended && row.blended > 0) plotted.push({ r, x: row.blended, row });
        else dropped.push(r);
      } else {
        const xr = xSet!.points.find((p) => p.modelId === r.modelId);
        if (xr) plotted.push({ r, x: xr.score, xr });
        else dropped.push(r);
      }
    }
    const pts: Pt[] = plotted.map(({ r, x, row, xr }) => ({
      id: r.modelId,
      name: modelName(r.modelId),
      providerId: ENTITY_BY_ID[r.modelId]?.providerId ?? "unknown",
      x,
      y: r.score,
      tip: [
        `${benchLabel(ySet.benchmarkId, ySet.version)}: ${fmtScore(r.score, ySet.def)}, independent, ${fmtDate(r.date)}`,
        row ? `Blended list price today: ${usd(x)} per 1M tokens (${usd(row.price.input?.price)} in / ${usd(row.price.output?.price)} out, ${row.price.surface ? surfaceLabel(row.price.surface) : "surface not recorded"})` : `${benchLabel(xSet!.benchmarkId, xSet!.version)}: ${fmtScore(x, xSet!.def)}, independent, ${fmtDate(xr?.date)}`,
      ],
    }));
    const xv = pts.map((p) => p.x);
    return { plotted, dropped, pts, xs: kind === "price" ? logScale(xv) : linearScale(xv), ys: linearScale(pts.map((p) => p.y)) };
  }, [ySet, xSet, kind, today]);

  const title = kind === "price" ? "Intelligence vs price" : "Intelligence vs speed";
  const sub = kind === "price"
    ? "Each point is one model: an independent benchmark score against its blended list price today. One benchmark and one version at a time."
    : "Each point is one model: an independent benchmark score against an independently measured output speed. One benchmark and one version on each axis.";
  const providerOnly = RESULTS.filter((r) => r.reporter === "provider").length;
  const speedDefs = BENCHMARKS.filter((d) => isSpeedBenchmark(d, d.id));

  if (!ySet) {
    return (
      <Sec title={title} sub={sub}>
        <Empty title="No benchmark has enough independent results to plot">
          A chart needs at least three independent results on the same benchmark and version. The knowledge base holds {RESULTS.length} benchmark {RESULTS.length === 1 ? "result" : "results"}, {providerOnly} of them provider-reported; provider-reported scores are never plotted here.
        </Empty>
      </Sec>
    );
  }
  if (kind === "speed" && !xSet) {
    return (
      <Sec title={title} sub={sub}>
        <Empty title="No independent speed measurement recorded">
          {speedDefs.length
            ? `A speed benchmark is defined (${speedDefs.map((d) => d.name).join(", ")}) but no independent result for it is recorded yet. No speed axis is drawn rather than estimating one.`
            : "This chart needs a throughput benchmark (for example output tokens per second) with independent results. None is in the knowledge base, so no speed axis is drawn rather than estimating one."}
        </Empty>
      </Sec>
    );
  }
  const yName = benchLabel(ySet.benchmarkId, ySet.version);
  const xName = xSet ? benchLabel(xSet.benchmarkId, xSet.version) : "";
  const yTitle = `${yName}${ySet.def?.unit ? `, ${ySet.def.unit}` : ""}${ySet.def ? (ySet.def.higherBetter ? " — higher is better" : " — lower is better") : ""}`;
  const xTitle = kind === "price" ? "Blended list price today, US$ per 1M tokens (3 input : 1 output) — log scale" : `${xName}${xSet?.def?.unit ? `, ${xSet.def.unit}` : ""}`;

  return (
    <Sec
      title={title}
      sub={sub}
      right={
        <div className="gai-row">
          <label className="gai-small gai-row">
            Benchmark
            <select className="gai-select" value={ySet.key} onChange={(e) => setYKey(e.target.value)}>
              {quality.map((s) => <option key={s.key} value={s.key}>{benchLabel(s.benchmarkId, s.version)} ({s.points.length} models)</option>)}
            </select>
          </label>
          {kind === "speed" && speedSets.length > 1 && (
            <label className="gai-small gai-row">
              Speed
              <select className="gai-select" value={xSet!.key} onChange={(e) => setXKey(e.target.value)}>
                {speedSets.map((s) => <option key={s.key} value={s.key}>{benchLabel(s.benchmarkId, s.version)} ({s.points.length} models)</option>)}
              </select>
            </label>
          )}
        </div>
      }
    >
      {!data || data.pts.length === 0 ? (
        <Empty title="Nothing to plot for this benchmark">
          {kind === "price" ? "None of the models with an independent result on this benchmark has a token list price in effect today." : "No model has an independent result on both the chosen benchmark and the speed benchmark."}
        </Empty>
      ) : (
        <>
          <div className="gai-card">
            <Scatter
              pts={data.pts}
              xs={data.xs}
              ys={data.ys}
              xLog={kind === "price"}
              xTitle={xTitle}
              yTitle={yTitle}
              fmtX={kind === "price" ? (v) => usd(v) : String}
              label={`Scatter plot of ${data.pts.length} models. Vertical: ${yName}, independent results only. Horizontal: ${kind === "price" ? "blended list price today per 1M tokens, log scale" : xName}. The table below lists every point.`}
            />
            <p className="gai-small gai-muted" style={{ marginTop: 6 }}>
              {ySet.def?.limitations ? `What this score cannot tell you: ${ySet.def.limitations} ` : ""}
              {kind === "price" ? "List price is not cost per task: models differ in how many tokens and attempts a task takes." : xSet?.def?.limitations ? `Speed: ${xSet.def.limitations}` : ""}
            </p>
          </div>
          <div className="gai-tablewrap" style={{ marginTop: 12 }}>
            <table className="gai-table">
              <thead>
                <tr>
                  <th>Model</th><th>Provider</th><th className="num">{yName}</th><th>Measured</th><th>Setup</th>
                  {kind === "price" ? <><th className="num">Blended / 1M</th><th className="num">Input</th><th className="num">Output</th><th>Price basis</th></> : <><th className="num">{xName}</th><th>Measured</th></>}
                  <th>Sources</th>
                </tr>
              </thead>
              <tbody>
                {data.plotted.map(({ r, x, row, xr }) => (
                  <tr key={r.id}>
                    <td><ModelLink id={r.modelId} /></td>
                    <td><Provider id={ENTITY_BY_ID[r.modelId]?.providerId} /></td>
                    <td className="num">{fmtScore(r.score, ySet.def)} <Ev label="independent-measurement" short /></td>
                    <td className="gai-mc-nowrap">{fmtDate(r.date)}</td>
                    <td className="gai-small">{setup(r)}</td>
                    {row ? (
                      <>
                        <td className="num">{usd(x)}</td>
                        <td className="num">{usd(row.price.input?.price)}</td>
                        <td className="num">{usd(row.price.output?.price)}</td>
                        <td className="gai-small">{row.price.surface ? surfaceLabel(row.price.surface) : "not recorded"} {row.price.input && <Ev label={row.price.input.label} short />}</td>
                      </>
                    ) : (
                      <>
                        <td className="num">{fmtScore(x, xSet?.def)} <Ev label="independent-measurement" short /></td>
                        <td className="gai-mc-nowrap">{fmtDate(xr?.date)}</td>
                      </>
                    )}
                    <td className="gai-mc-nowrap"><Cites ids={uniq([...r.sourceIds, ...(row ? priceSourceIds(row.price) : []), ...(xr?.sourceIds ?? [])])} align="right" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="gai-warn" style={{ marginTop: 12 }}>
        <b>What is excluded, and why.</b>
        <ul className="gai-mc-notes" style={{ marginTop: 4 }}>
          <li>Provider-reported scores: {ySet.providerReported} on this benchmark and version are left out. A provider&apos;s own number and an independent measurement are different evidence and are not mixed in one chart.</li>
          <li>
            Other versions: {ySet.otherVersions.length === 0 ? "none recorded." : `${ySet.otherVersions.map((o) => `${o.count} on ${o.version ? `version ${o.version}` : "an unstated version"}`).join(", ")} — left out because scores are comparable only within one version.`}
          </li>
          {data && data.dropped.length > 0 && (
            <li>
              {kind === "price" ? "No token list price in effect today" : "No independent speed result"} ({data.dropped.length}): {data.dropped.map((r) => modelName(r.modelId)).join(", ")}.
            </li>
          )}
          <li>Where a model has several independent results on this version, the most recent is used. Benchmarks with fewer than three independent results on one version are not offered.</li>
        </ul>
      </div>
    </Sec>
  );
}

// ───────────────────────── topic benchmark tables ─────────────────────────

const TOPIC_COPY: Record<BenchTopic, { title: string; sub: string; none: string }> = {
  coding: { title: "Coding and agents", sub: "Benchmarks for software engineering, terminal work, tool use and computer use. Each benchmark is its own table.", none: "No coding or agent benchmark result recorded" },
  multimodal: { title: "Multimodal", sub: "Benchmarks for image, video and audio understanding or generation. Each benchmark is its own table.", none: "No multimodal benchmark result recorded" },
};

function ResultTable({ rows, def, reporter, multiVersion }: { rows: BenchmarkResult[]; def?: BenchmarkDef; reporter: "independent" | "provider"; multiVersion: boolean }) {
  const label = reporter === "independent" ? "independent-measurement" : "provider-claim";
  return (
    <>
      <div className="gai-mc-subhead">
        <Ev label={label} />
        <span>{reporter === "independent" ? "Measured by a party other than the provider" : "Reported by the provider about its own model"}</span>
        <span className="gai-muted gai-small">{rows.length} {rows.length === 1 ? "result" : "results"}</span>
      </div>
      {rows.length === 0 ? (
        <p className="gai-muted gai-small">No {reporter === "independent" ? "independent" : "provider-reported"} result recorded.</p>
      ) : (
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead><tr><th>Model</th><th>Provider</th><th>Version</th><th className="num">Score</th><th>Date</th><th>Setup</th><th>Sources</th></tr></thead>
            <tbody>
              {rows.flatMap((r, i) => {
                const newGroup = multiVersion && (i === 0 || (rows[i - 1].benchmarkVersion ?? "") !== (r.benchmarkVersion ?? ""));
                return [
                  newGroup ? <tr key={`v-${r.id}`}><th className="gai-mc-grouprow" colSpan={7} scope="colgroup">{r.benchmarkVersion ? `Version ${r.benchmarkVersion}` : "Version not stated"} — comparable only with the rows in this group</th></tr> : null,
                  <tr key={r.id}>
                    <td><ModelLink id={r.modelId} /></td>
                    <td><Provider id={ENTITY_BY_ID[r.modelId]?.providerId} /></td>
                    <td>{r.benchmarkVersion ?? <span className="gai-muted">not stated</span>}</td>
                    <td className="num">{fmtScore(r.score, def)}</td>
                    <td className="gai-mc-nowrap">{fmtDate(r.date)}</td>
                    <td className="gai-small">{setup(r)}{r.limitations ? ` — ${r.limitations}` : ""}</td>
                    <td className="gai-mc-nowrap"><Cites ids={r.sourceIds} align="right" /></td>
                  </tr>,
                ];
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function TopicTables({ topic }: { topic: BenchTopic }) {
  const { groups, definedWithoutResults } = useMemo(() => topicGroups(topic), [topic]);
  const copy = TOPIC_COPY[topic];
  return (
    <Sec title={copy.title} sub={`${copy.sub} Independent and provider-reported results are listed separately and are not ranked against each other.`}>
      {groups.length === 0 ? (
        <Empty title={copy.none}>Benchmarks are matched to this view by keywords in their id, name and description. Nothing that matches has a result yet.</Empty>
      ) : (
        groups.map((g) => (
          <div key={g.benchmarkId} className="gai-card gai-mc-bench">
            <h3 className="gai-h3">{g.def?.name ?? g.benchmarkId}{g.match === 1 && <span className="gai-tag" style={{ marginLeft: 8 }} title="Listed here because its description mentions this area, not because it is named for it">broader benchmark</span>}</h3>
            {g.def ? (
              <>
                <p className="gai-small" style={{ marginTop: 3 }}>{g.def.measures}</p>
                <p className="gai-small gai-muted" style={{ marginTop: 3 }}>
                  {g.def.unit || "score"} · {g.def.higherBetter ? "higher is better" : "lower is better"} · maintained by{" "}
                  <a className="gai-link" href={g.def.url} target="_blank" rel="noreferrer noopener">{g.def.maintainer}</a>
                  {g.def.limitations ? ` · What it cannot tell you: ${g.def.limitations}` : ""}
                </p>
              </>
            ) : (
              <p className="gai-small gai-muted">This benchmark has results but no definition in the knowledge base, so its unit and direction are not recorded.</p>
            )}
            {g.versions.length > 1 && <div className="gai-warn" style={{ marginTop: 8 }}>Results span {g.versions.length} versions of this benchmark. Scores on different versions are not comparable; rows are grouped by version.</div>}
            <ResultTable rows={g.independent} def={g.def} reporter="independent" multiVersion={g.versions.length > 1} />
            <ResultTable rows={g.provider} def={g.def} reporter="provider" multiVersion={g.versions.length > 1} />
          </div>
        ))
      )}
      {definedWithoutResults.length > 0 && (
        <p className="gai-small gai-muted" style={{ marginTop: 8 }}>Defined but with no result recorded yet: {definedWithoutResults.map((d) => d.name).join(", ")}.</p>
      )}
    </Sec>
  );
}

// ───────────────────────── open vs proprietary ─────────────────────────

function WeightsColumn({ title, note, rows, empty }: { title: string; note: string; rows: ModelRow[]; empty: string }) {
  return (
    <div className="gai-card">
      <h3 className="gai-h3">{title} <span className="gai-muted">({rows.length})</span></h3>
      <p className="gai-small gai-muted" style={{ margin: "2px 0 10px" }}>{note}</p>
      {rows.length === 0 ? <p className="gai-muted gai-small">{empty}</p> : (
        <div className="gai-tablewrap">
          <table className="gai-table">
            <thead><tr><th>Model</th><th>License</th><th className="num">Context</th><th>List price today, in / out per 1M</th></tr></thead>
            <tbody>
              {rows.map(({ e, spec, price }) => (
                <tr key={e.id}>
                  <td><ModelLink id={e.id} /><span className="gai-mc-sub">{providerName(e.providerId)}{e.introducedAt ? ` · ${fmtDate(e.introducedAt, "month")}` : ""}</span></td>
                  <td className="gai-small">{spec?.license ?? (spec?.openWeights === false ? "Proprietary" : spec?.openWeights ? NR : <span className="gai-muted">weights status not recorded</span>)}</td>
                  <td className="num">{spec?.contextTokens ? compact(spec.contextTokens) : NR}</td>
                  <td className="gai-small">
                    {price.input || price.output ? (
                      <>
                        <span className="gai-mc-val">{usd(price.input?.price)} / {usd(price.output?.price)}</span>
                        <span className="gai-mc-meta">
                          {price.surface === "third-party-host" ? <span className="gai-tag" title="Charged by a company hosting the model, not by its developer. Other hosts charge other prices.">third-party host price</span> : <span className="gai-muted">{price.surface ? surfaceLabel(price.surface) : ""}</span>}
                          <Ev label={(price.input ?? price.output)!.label} short /><Cites ids={priceSourceIds(price)} align="right" />
                        </span>
                      </>
                    ) : (
                      <span className="gai-muted">no token price in effect today</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OpenVsProprietary({ today }: { today: string }) {
  const { open, closed, retired } = useMemo(() => {
    const all = modelRows(today);
    const live = all.filter((r) => r.bucket !== "retired").sort((a, b) => (b.e.introducedAt ?? "").localeCompare(a.e.introducedAt ?? ""));
    return { open: live.filter((r) => r.spec?.openWeights === true), closed: live.filter((r) => r.spec?.openWeights !== true), retired: all.length - live.length };
  }, [today]);
  return (
    <Sec title="Open vs proprietary" sub="Models whose weights can be downloaded, next to models reachable only through a provider's service. Newest first.">
      {open.length + closed.length === 0 ? (
        <Empty title="No model recorded">Nothing to split into open-weight and proprietary yet.</Empty>
      ) : (
        <div className="gai-grid gai-g2">
          <WeightsColumn title="Open weights" note="An open-weight model has no single price: you pay a host, or for your own hardware. Any price shown is one named host's price." rows={open} empty="No open-weight model recorded." />
          <WeightsColumn title="Proprietary" note="Served by the provider or its partners. Models with no open-weights flag recorded are listed here and marked." rows={closed} empty="No proprietary model recorded." />
        </div>
      )}
      <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
        Licence names are as recorded from the provider; an open-weight licence can still restrict commercial use.{retired > 0 ? ` ${retired} deprecated or retired ${retired === 1 ? "model is" : "models are"} left out.` : ""}
      </p>
    </Sec>
  );
}

// ───────────────────────── pick for a workload ─────────────────────────

const pct = (x: number) => `${Math.round(x * 100)}%`;

function WorkloadPick({ today, initial }: { today: string; initial: string | null }) {
  const [sid, setSid] = useState(SCENARIOS.find((s) => s.id === initial)?.id ?? SCENARIOS[0]?.id ?? "");
  const s = SCENARIOS.find((x) => x.id === sid) ?? SCENARIOS[0];
  const [loose, setLoose] = useState(false);
  const fit = useMemo(() => (s ? scenarioFit(s, today, loose) : null), [s, today, loose]);
  if (!s || !fit) {
    return (
      <Sec title="Pick for a workload" sub="Rank models by what an example workload would cost.">
        <Empty title="No example workload defined">The editorial layer holds no scenario to cost.</Empty>
      </Sec>
    );
  }
  const names = (rows: ModelRow[]) => rows.slice(0, 12).map((r) => r.e.name).join(", ") + (rows.length > 12 ? `, and ${rows.length - 12} more` : "");
  return (
    <Sec title="Pick for a workload" sub="Choose an example workload. Models that accept the inputs it needs are ranked by estimated monthly cost at today's list prices.">
      <div className="gai-card gai-stack">
        <label className="gai-row gai-small" htmlFor="gai-mc-scenario">
          Workload
          <select id="gai-mc-scenario" className="gai-select" value={s.id} onChange={(e) => { setSid(e.target.value); syncUrl({ scenario: e.target.value }); }}>
            {SCENARIOS.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
          </select>
        </label>
        <p>{s.description}</p>
        <dl className="gai-mc-facts">
          <div><dt>Requests per month</dt><dd>{compact(s.requestsPerMonth)}</dd></div>
          <div><dt>Input tokens per call</dt><dd>{compact(s.inputTokens)}</dd></div>
          <div><dt>Output tokens per call</dt><dd>{compact(s.outputTokens)}</dd></div>
          <div><dt>Input served from cache</dt><dd>{pct(s.cachedShare)}</dd></div>
          <div><dt>Run in batch</dt><dd>{pct(s.batchShare)}</dd></div>
          <div><dt>Reasoning tokens per output token</dt><dd>{s.thinkingRatio}×</dd></div>
          <div><dt>Model calls per completed task</dt><dd>{s.attemptsPerTask}</dd></div>
          <div><dt>Inputs the model must accept</dt><dd>{s.needs.join(", ")}</dd></div>
        </dl>
        <p className="gai-small"><Ev label="analyst-interpretation" short /> These numbers are illustrative assumptions set by this site, not measurements. The same assumptions are applied to every model.</p>
      </div>

      <label className="gai-row gai-small" style={{ marginTop: 12 }}>
        <input type="checkbox" className="gai-mc-check" checked={loose} onChange={(e) => setLoose(e.target.checked)} />
        Also rank models whose recorded inputs do not cover this workload (flagged in the table)
        {fit.missingByNeed.length > 0 && <span className="gai-muted">— not recorded as accepting: {fit.missingByNeed.map((m) => `${m.need} (${m.n} ${m.n === 1 ? "model" : "models"})`).join(", ")}</span>}
      </label>

      <div className="gai-warn" style={{ marginTop: 12 }}>
        <b>A lower per-token price does not mean a lower cost per completed task.</b> Models differ in how many attempts a task takes and how many reasoning tokens they spend. Here both are your assumption, held equal across models, so this ranking reflects list prices only.{" "}
        <Link className="gai-link" href={`/google-ai/pricing?scenario=${s.id}`}>Change the assumptions in the pricing calculator →</Link>
      </div>

      {fit.ranked.length === 0 ? (
        <div style={{ marginTop: 12 }}>
          <Empty title="No model can be costed for this workload">
            {fit.uncovered.length + fit.unpriced.length === 0
              ? "No model is recorded."
              : loose
                ? `None of the ${fit.uncovered.length + fit.unpriced.length} live models has a token list price in effect today.`
                : `${fit.unpriced.length} ${fit.unpriced.length === 1 ? "model accepts" : "models accept"} the required inputs but ${fit.unpriced.length === 1 ? "has" : "have"} no token list price in effect today; ${fit.uncovered.length} are not recorded as accepting every required input (${s.needs.join(" + ")}). An input that is missing from the record may be supported but unconfirmed; tick the box above to rank those models too.`}
          </Empty>
        </div>
      ) : (
        <div className="gai-tablewrap" style={{ marginTop: 12 }}>
          <table className="gai-table">
            <thead><tr><th className="num">#</th><th>Model</th><th>Priced on</th><th className="num">Per month</th><th className="num">Per completed task</th><th>Notes from the cost engine</th><th>Price evidence</th></tr></thead>
            <tbody>
              {fit.ranked.map(({ row, est, missing }, i) => {
                const recs = est.recordIds.flatMap((id) => (PRICE_BY_ID[id] ? [PRICE_BY_ID[id]] : []));
                return (
                  <tr key={row.e.id}>
                    <td className="num">{i + 1}</td>
                    <td>
                      <ModelLink id={row.e.id} /><span className="gai-mc-sub">{providerName(row.e.providerId)}</span>
                      {missing.length > 0 && <span className="gai-mc-meta"><span className="gai-tag" title="The model's recorded inputs do not include this">not recorded as accepting {missing.join(", ")}</span></span>}
                    </td>
                    <td className="gai-small">{est.surface ? surfaceLabel(est.surface) : "not recorded"}{est.surface === "third-party-host" ? " — not the developer's own price" : ""}</td>
                    <td className="num">{usd(est.monthly, 0)}</td>
                    <td className="num">{usd(est.perTask)}</td>
                    <td>{est.notes.length ? <ul className="gai-mc-notes">{est.notes.map((n) => <li key={n}>{n}</li>)}</ul> : <span className="gai-muted gai-small">no caveat raised</span>}</td>
                    <td className="gai-mc-nowrap"><span className="gai-mc-meta" style={{ marginTop: 0, flexWrap: "nowrap" }}>{recs[0] && <Ev label={recs[0].label} short />}<Cites ids={uniq(recs.flatMap((p) => p.sourceIds))} align="right" /></span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
        Each estimate is sourced list prices multiplied by the assumptions above; the result is this site&apos;s arithmetic, not a quote. Ranked by monthly cost, lowest first.
        {fit.uncovered.length > 0 && fit.ranked.length > 0 ? ` Left out because ${loose ? "they have no token list price in effect today" : `their recorded inputs do not cover ${s.needs.join(" + ")}`} (${fit.uncovered.length}): ${names(fit.uncovered)}.` : ""}
        {fit.unpriced.length > 0 && fit.ranked.length > 0 ? ` Left out because no token list price is in effect today (${fit.unpriced.length}): ${names(fit.unpriced)}.` : ""}
        {fit.retired > 0 ? ` ${fit.retired} deprecated or retired ${fit.retired === 1 ? "model is" : "models are"} not considered.` : ""}
      </p>
    </Sec>
  );
}

// ───────────────────────── battlegrounds ─────────────────────────

function Battlegrounds({ initial }: { initial: string | null }) {
  const rivals = useMemo(() => battlegroundRivals(), []);
  const [sel, setSel] = useState(BATTLEGROUNDS.find((b) => b.id === initial)?.id ?? BATTLEGROUNDS[0]?.id ?? "");
  const b = BATTLEGROUNDS.find((x) => x.id === sel);
  const cols = [GOOGLE_ID, ...rivals];
  const count = (bg: (typeof BATTLEGROUNDS)[number], p: string) => (p === GOOGLE_ID ? bg.google.length : bg.rivals.filter((r) => r.providerId === p).reduce((n, r) => n + r.position.length, 0));

  return (
    <Sec title="Battlegrounds — competition matrix" sub="Where Google and its rivals each hold a sourced position. A number is how many sourced claims are recorded for that provider in that battleground; it measures coverage of the record, not strength.">
      {BATTLEGROUNDS.length === 0 ? (
        <Empty title="No battleground recorded">The competitive record is empty, so no matrix is drawn.</Empty>
      ) : (
        <>
          <div className="gai-tablewrap">
            <table className="gai-table gai-mc-matrix">
              <thead>
                <tr>
                  <th scope="col">Battleground</th>
                  {cols.map((p) => <th key={p} scope="col" className="gai-mc-pcol"><i className="gai-mc-swatch" style={{ background: providerColor(p) }} aria-hidden />{providerName(p)}</th>)}
                </tr>
              </thead>
              <tbody>
                {BATTLEGROUNDS.map((bg) => (
                  <tr key={bg.id} data-on={bg.id === sel ? 1 : 0}>
                    <td>
                      <button type="button" className="gai-mc-rowbtn" aria-pressed={bg.id === sel} aria-controls="gai-mc-bg-panel" onClick={() => setSel(bg.id)}>
                        {bg.name}
                        <small>{bg.question}</small>
                      </button>
                    </td>
                    {cols.map((p) => {
                      const n = count(bg, p);
                      return (
                        <td key={p} className="gai-mc-cell">
                          {n > 0 ? (
                            <span className={`gai-mc-dot${p === GOOGLE_ID ? " gai-mc-home" : ""}`} title={`${providerName(p)}: ${n} sourced ${n === 1 ? "claim" : "claims"}`}>{n}<span className="gai-sr"> sourced {n === 1 ? "claim" : "claims"}</span></span>
                          ) : (
                            <><span className="gai-mc-nodot" aria-hidden /><span className="gai-sr">no position recorded</span></>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gai-small gai-muted" style={{ marginTop: 8 }}>
            Select a row to read the positions. An empty ring means no sourced position is recorded here, not that the provider is absent from that market. Correlation in time between Google and rival moves is shown on the <Link className="gai-link" href="/google-ai/timeline">Timeline</Link>; this site does not infer that one caused the other.
          </p>

          {b && (
            <div id="gai-mc-bg-panel" className="gai-card pad-lg gai-mc-panel" style={{ marginTop: 12 }} aria-live="polite">
              <div>
                <h3 className="gai-h2">{b.name}</h3>
                <p className="gai-lede">{b.question}</p>
              </div>
              <div className="gai-grid gai-g2">
                <div>
                  <h4 className="gai-h3">Google&apos;s position</h4>
                  <Claims claims={b.google} empty="No sourced claim recorded for Google here." />
                  <div className="gai-group-name" style={{ marginTop: 12 }}>Google products that carry this position</div>
                  {b.entityIds.length ? <div className="gai-chipset">{b.entityIds.map((id) => <EntityLink key={id} id={id} />)}</div> : <p className="gai-muted gai-small">None linked.</p>}
                </div>
                <div className="gai-stack">
                  <h4 className="gai-h3">Rivals</h4>
                  {b.rivals.length === 0 ? <p className="gai-muted gai-small">No rival position recorded.</p> : b.rivals.map((r) => (
                    <div key={r.providerId}>
                      <div className="gai-group-name"><i className="gai-mc-swatch" style={{ background: providerColor(r.providerId) }} aria-hidden />{providerName(r.providerId)}</div>
                      <Claims claims={r.position} empty="No sourced claim recorded." />
                    </div>
                  ))}
                </div>
              </div>
              <div className="gai-note">
                <p style={{ marginBottom: 4 }}><Ev label="analyst-interpretation" /> <b>Assessment</b></p>
                <p>{b.assessment || "No assessment written yet."}</p>
              </div>
              <div>
                <h4 className="gai-h3">What to watch</h4>
                {b.watch.length ? <ul className="gai-mc-watch">{b.watch.map((w) => <li key={w}>{w}</li>)}</ul> : <p className="gai-muted gai-small">Nothing listed.</p>}
              </div>
            </div>
          )}
        </>
      )}
    </Sec>
  );
}
