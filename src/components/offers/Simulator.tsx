"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AttributionBar from "./AttributionBar";
import ChartTabs, { type ChartTab } from "./ChartTabs";
import Compete from "./Compete";
import GuidedFlow from "./GuidedFlow";
import SpendEstimate from "./SpendEstimate";
import TrafficProfile from "./TrafficProfile";
import ExportButton from "./ExportButton";
import Footnotes from "./Footnotes";
import KpiStrip from "./KpiStrip";
import MathTrace from "./MathTrace";
import Levers from "./Levers";
import ScenarioBar from "./ScenarioBar";
import ShareButton from "./ShareButton";
import StepTable from "./StepTable";
import Waterfall from "./Waterfall";
import {
  type Accent,
  DEFAULT_LEVERS,
  type Levers as LeverState,
  computeModel,
  electedSteps,
} from "@/lib/offers/model";
import { recommend } from "@/lib/offers/recommend";
import { DEFAULT_WORKLOAD_ID, findWorkload, matchWorkload } from "@/lib/offers/workloads";
import { paramsFromLevers } from "@/lib/offers/params";
import { GOAL_NOTE, SCOPE_NOTE } from "@/lib/offers/descriptions";
import { PRESETS, type Preset, matchesPreset } from "@/lib/offers/presets";
import { moneyK, multiplier, percent } from "@/lib/offers/format";

const LEGEND: ReadonlyArray<{ label: string; colour: string; accent: Accent }> = [
  { label: "Incremental spend", colour: "var(--gold)", accent: "gold" },
  { label: "BOGO", colour: "var(--blue)", accent: "blue" },
  { label: "0.5x placement", colour: "var(--green)", accent: "green" },
  { label: "FSP", colour: "var(--fsp)", accent: "fsp" },
  { label: "GSU commit + Q3", colour: "var(--teal)", accent: "teal" },
];

export default function Simulator({
  initialLevers,
  initialPresetId,
  initialMode,
  initialFromLink,
}: {
  initialLevers: LeverState;
  initialPresetId: string | null;
  initialMode: "guided" | "pro";
  /** True when the URL carried a scenario, so it must not be overwritten. */
  initialFromLink: boolean;
}) {
  // ONE scenario. Simple and Pro are two control surfaces over it, never two
  // models — so the number never moves when you toggle between them.
  // A cold open should land on the recommendation, not on raw defaults — the
  // first thing a seller sees ought to be an answer. A shared link carries its
  // own scenario and is left exactly as it was sent.
  const [levers, setLevers] = useState<LeverState>(() =>
    initialFromLink ? initialLevers : recommend(initialLevers, DEFAULT_WORKLOAD_ID).levers,
  );
  // A shared link that names a preset opens with that preset's rationale, but
  // only if the link's levers still match it — a tweaked link is its own thing.
  const [noteFor, setNoteFor] = useState<Preset | null>(() => {
    const preset = PRESETS.find((item) => item.id === initialPresetId);
    return preset && matchesPreset(initialLevers, preset) ? preset : null;
  });
  const [pinned, setPinned] = useState<LeverState | null>(null);
  const [present, setPresent] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [compete, setCompete] = useState(false);
  const [chartTab, setChartTab] = useState<ChartTab>("chart");
  const [mode, setMode] = useState<"guided" | "pro">(initialMode);
  const [workloadId, setWorkloadId] = useState<string>(
    () => matchWorkload(initialLevers)?.id ?? DEFAULT_WORKLOAD_ID,
  );

  const result = useMemo(() => computeModel(levers), [levers]);

  // The house position on this deal, recomputed whenever the inputs move.
  const recommendation = useMemo(
    () => recommend(levers, workloadId),
    [levers, workloadId],
  );
  // Whether the seller is still sitting on it, or has taken it apart.
  const onRecommendation = useMemo(() => {
    const r = recommendation.levers;
    return (
      Math.abs(r.ptShare - levers.ptShare) < 1e-9 &&
      r.term === levers.term &&
      Math.abs(r.fspRate - levers.fspRate) < 1e-9 &&
      (Object.keys(r.offers) as Array<keyof typeof r.offers>).every(
        (k) => r.offers[k] === levers.offers[k],
      )
    );
  }, [recommendation, levers]);
  const compareResult = useMemo(
    () => (pinned ? computeModel(pinned) : null),
    [pinned],
  );

  // An unelected concession is a bar identical to the one before it. Drop it —
  // both modes chart the same columns for the same scenario.
  const chartSteps = useMemo(() => electedSteps(result.steps), [result.steps]);

  // Only key what is actually on the chart — a legend for an absent bar is a
  // promise the picture does not keep.
  const legend = useMemo(() => {
    const drawn = new Set<Accent>(chartSteps.map((step) => step.accent));
    return LEGEND.filter((item) => drawn.has(item.accent));
  }, [chartSteps]);

  // Which preset (if any) the current levers still match.
  const activePresetId = useMemo(() => {
    const match = PRESETS.find((preset) => matchesPreset(levers, preset));
    return match?.id ?? null;
  }, [levers]);

  // Keep the address bar in step with the levers, without stacking history.
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const params = paramsFromLevers(levers, mode === "guided" ? null : activePresetId);
      if (mode === "guided") params.set("mode", "guided");
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    }, 150);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [levers, activePresetId, mode]);

  // Esc leaves presenter mode / closes the mobile sheet.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (sheetOpen) setSheetOpen(false);
      else if (present) setPresent(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [present, sheetOpen]);

  const update = useCallback((patch: Partial<LeverState>) => {
    setLevers((current) => ({ ...current, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setLevers(DEFAULT_LEVERS);
    setNoteFor(null);
  }, []);

  const selectPreset = useCallback((preset: Preset) => {
    setLevers(preset.levers);
    setNoteFor(preset);
  }, []);

  // Both surfaces read and write one scenario, so switching never moves a number.
  const selectMode = useCallback((next: "guided" | "pro") => {
    setMode(next);
  }, []);

  // Choosing a workload rewrites the things the seller cannot know, and
  // re-sizes the demand so the spend they typed still means the same money.
  const selectWorkload = useCallback((id: string) => {
    const w = findWorkload(id);
    setWorkloadId(id);
    setLevers((current) => ({
      ...current,
      outputShare: w.outputShare,
      paygoMix: w.paygoMix,
      harness: w.harness,
      ptShare: w.suggestedPtShare,
    }));
  }, []);

  const applyRecommendation = useCallback(() => {
    setLevers(recommendation.levers);
  }, [recommendation]);

  const leverRail = (
    <Levers
      levers={levers}
      result={result}
      onChange={update}
      onReset={reset}
    />
  );

  return (
    <div className={present ? "o-present" : undefined}>
      <a href="#waterfall" className="o-skip-link">
        Skip to the waterfall
      </a>

      <main id="top" className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 sm:py-9">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <header>
          <p className="o-eyebrow">GenAI commercial framework · Internal</p>
          <h1 className="o-h1 mt-3 max-w-[24ch]">
            Estimate the incremental spend. Then take it apart.
          </h1>
          <p className="o-dim mt-3 max-w-[64ch] text-[14px] leading-[1.6]">
            {GOAL_NOTE}
          </p>

          <div
            className="o-panel mt-5 flex flex-wrap items-start gap-x-3 gap-y-2 px-4 py-3"
            style={{ borderColor: "var(--gold)" }}
            role="note"
          >
            <span className="o-badge shrink-0" style={{ color: "var(--gold)" }}>
              SCOPE
            </span>
            <p className="o-dim flex-1 text-[12.5px] leading-[1.6]">
              {SCOPE_NOTE}
            </p>
          </div>

          <p className="o-mono o-faint mt-2.5 text-[10px] leading-[1.6]">
            <span className="o-marker o-marker-anchored" aria-hidden="true">
              ●
            </span>{" "}
            anchored to the commercial decks ·{" "}
            <span className="o-marker o-marker-modelled" aria-hidden="true">
              ○
            </span>{" "}
            modelled assumption, yours to move
          </p>
        </header>

        {/* ── Mode ───────────────────────────────────────────────────── */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div
            className="o-seg"
            role="group"
            aria-label="Detail level"
            style={{ width: 200 }}
          >
            {(
              [
                ["guided", "Guided"],
                ["pro", "Pro"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={mode === id}
                onClick={() => selectMode(id)}
                style={{ ["--seg-active" as string]: "var(--gold)" }}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="o-mono o-faint text-[10.5px]">
            {mode === "guided"
              ? "Three questions, a recommended shape, and what to say."
              : "Every lever, every election, the full audit trail."}
          </p>
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="mt-5 flex flex-wrap items-center gap-2" style={{ display: mode === "pro" ? undefined : "none" }}>
          <button
            type="button"
            className="o-btn"
            aria-pressed={pinned !== null}
            onClick={() => setPinned((current) => (current ? null : levers))}
          >
            {pinned ? "Comparing A→B" : "Compare"}
          </button>
          <button
            type="button"
            className="o-btn"
            aria-pressed={present}
            onClick={() => setPresent((current) => !current)}
            title="Hide the levers for screen-sharing. Esc exits."
          >
            {present ? "Exit present" : "Present"}
          </button>
          <button
            type="button"
            className="o-btn"
            aria-pressed={compete}
            onClick={() => setCompete((current) => !current)}
          >
            Compete
          </button>
          <ShareButton levers={levers} presetId={activePresetId} />
          <ExportButton levers={levers} result={result} />
        </div>

        {mode === "guided" ? (
          <div className="o-fade-in mt-6">
            <GuidedFlow
              levers={levers}
              result={result}
              steps={chartSteps}
              chartTab={chartTab}
              recommendation={recommendation}
              onRecommendation={onRecommendation}
              workloadId={workloadId}
              onChartTabChange={setChartTab}
              onChange={update}
              onWorkload={selectWorkload}
              onApplyRecommendation={applyRecommendation}
              onOpenPro={() => setMode("pro")}
            />
          </div>
        ) : (
          <>
        {/* ── Scenarios ──────────────────────────────────────────────── */}
        {!present ? (
          <div className="mt-6">
            <ScenarioBar
              activeId={activePresetId}
              note={noteFor}
              onSelect={selectPreset}
              onDismissNote={() => setNoteFor(null)}
            />
          </div>
        ) : null}

        {/* ── Step one: the estimate ─────────────────────────────────── */}
        <div className="mt-6">
          <SpendEstimate result={result} />
        </div>

        {/* ── What the traffic looks like ────────────────────────────── */}
        <div className="mt-5">
          <TrafficProfile result={result} />
        </div>

        {/* ── Compete ────────────────────────────────────────────────── */}
        {compete ? (
          <div className="o-fade-in mt-5">
            <Compete />
          </div>
        ) : null}

        {/* ── KPI strip ──────────────────────────────────────────────── */}
        <div className="mt-5">
          <KpiStrip result={result} compare={compareResult} />
        </div>

        {/* ── Levers + waterfall ─────────────────────────────────────── */}
        <div
          className={`mt-5 grid items-start gap-5 ${
            present ? "" : "lg:grid-cols-[340px_minmax(0,1fr)]"
          }`}
        >
          {!present ? (
            /* Natural height, not a capped scroll area — a nested scrollbar
               would bury the GSU levers at the bottom of the rail. */
            <aside
              className="o-panel hidden self-start lg:block"
              aria-label="Model levers"
            >
              <div className="px-4 pt-4">
                <h2 className="o-h3">Levers</h2>
                <p className="o-faint mt-1 text-[11.5px] leading-[1.5]">
                  Every change recomputes the whole portfolio live.
                </p>
              </div>
              {leverRail}
            </aside>
          ) : null}

          <div className="grid gap-5">
          <section
            id="waterfall"
            className="o-panel p-4 sm:p-5"
            aria-labelledby="waterfall-heading"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="waterfall-heading" className="o-eyebrow">
                Savings vs incremental spend · $K per month
              </h2>
              <p className="o-mono text-[11px]" style={{ color: "var(--ink-dim)" }}>
                {moneyK(result.reference)} →{" "}
                <span style={{ color: "var(--green)" }}>
                  {moneyK(result.final)}
                </span>{" "}
                <span className="o-faint">
                  ({percent(result.savingPct)} · {multiplier(result.blendedMultiplier)})
                </span>
              </p>
            </div>

            {/* Chart, or the arithmetic behind it. */}
            <ChartTabs value={chartTab} onChange={setChartTab} />

            {chartTab === "chart" ? (
              <div
                className="mt-3"
                id="waterfall-panel-chart"
                role="tabpanel"
                aria-labelledby="waterfall-tab-chart"
              >
                <Waterfall
                  result={result}
                  steps={chartSteps}
                  compare={compareResult}
                  present={present}
                />
              </div>
            ) : (
              <div
                className="o-fade-in mt-4"
                id="waterfall-panel-math"
                role="tabpanel"
                aria-labelledby="waterfall-tab-math"
              >
                <MathTrace result={result} />
              </div>
            )}

            <div
              className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3.5"
              style={{
                borderColor: "var(--line)",
                display: chartTab === "chart" ? undefined : "none",
              }}
            >
              {legend.map((item) => (
                <span
                  key={item.label}
                  className="o-mono o-faint flex items-center gap-2 text-[10px]"
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 2,
                      background: item.colour,
                      display: "inline-block",
                    }}
                  />
                  {item.label}
                </span>
              ))}
              {chartSteps.length > 1 ? (
                <span className="o-mono o-faint flex items-center gap-2 text-[10px]">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 8,
                      background: "var(--green)",
                      opacity: 0.28,
                      display: "inline-block",
                    }}
                  />
                  saved this step
                </span>
              ) : null}
              {compareResult ? (
                <span className="o-mono o-faint flex items-center gap-2 text-[10px]">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 8,
                      border: "1px dashed var(--ink-faint)",
                      display: "inline-block",
                    }}
                  />
                  scenario A
                </span>
              ) : null}
            </div>
          </section>

            {/* ── Step table ───────────────────────────────────────── */}
            <StepTable result={result} />

            {/* ── Attribution ──────────────────────────────────────── */}
            <AttributionBar result={result} />
          </div>
        </div>
          </>
        )}

      </main>

      <Footnotes />

      {/* ── Mobile lever sheet ───────────────────────────────────────── */}
      {!present && mode === "pro" ? (
        <button
          type="button"
          className="o-fab lg:hidden"
          onClick={() => setSheetOpen(true)}
          aria-expanded={sheetOpen}
          aria-controls="lever-sheet"
        >
          Levers
        </button>
      ) : null}

      {sheetOpen ? (
        <>
          <button
            type="button"
            className="o-sheet-scrim lg:hidden"
            aria-label="Close levers"
            onClick={() => setSheetOpen(false)}
          />
          <div
            id="lever-sheet"
            className="o-sheet lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Model levers"
          >
            <div className="o-sheet-handle">
              <h2 className="o-eyebrow">Levers</h2>
              <button
                type="button"
                className="o-btn"
                onClick={() => setSheetOpen(false)}
              >
                Done
              </button>
            </div>
            <div className="-mx-4">{leverRail}</div>
          </div>
        </>
      ) : null}
    </div>
  );
}
