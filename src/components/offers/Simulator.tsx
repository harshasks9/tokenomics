"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AttributionBar from "./AttributionBar";
import ExportButton from "./ExportButton";
import Footnotes from "./Footnotes";
import KpiStrip from "./KpiStrip";
import Levers from "./Levers";
import ScenarioBar from "./ScenarioBar";
import ShareButton from "./ShareButton";
import StepTable from "./StepTable";
import Waterfall from "./Waterfall";
import {
  DEFAULT_LEVERS,
  type Levers as LeverState,
  computeModel,
} from "@/lib/offers/model";
import { paramsFromLevers } from "@/lib/offers/params";
import { SCOPE_NOTE } from "@/lib/offers/descriptions";
import { PRESETS, type Preset, matchesPreset } from "@/lib/offers/presets";
import { moneyK, multiplier, percent } from "@/lib/offers/format";

const LEGEND = [
  { label: "At list", colour: "var(--gold)" },
  { label: "Right-size PT", colour: "var(--blue)" },
  { label: "0.5x placement", colour: "var(--green)" },
  { label: "FSP", colour: "var(--fsp)" },
  { label: "GSU commit + Q3", colour: "var(--teal)" },
];

export default function Simulator({
  initialLevers,
  initialPresetId,
}: {
  initialLevers: LeverState;
  initialPresetId: string | null;
}) {
  const [levers, setLevers] = useState<LeverState>(initialLevers);
  // A shared link that names a preset opens with that preset's rationale, but
  // only if the link's levers still match it — a tweaked link is its own thing.
  const [noteFor, setNoteFor] = useState<Preset | null>(() => {
    const preset = PRESETS.find((item) => item.id === initialPresetId);
    return preset && matchesPreset(initialLevers, preset) ? preset : null;
  });
  const [pinned, setPinned] = useState<LeverState | null>(null);
  const [present, setPresent] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const result = useMemo(() => computeModel(levers), [levers]);
  const compareResult = useMemo(
    () => (pinned ? computeModel(pinned) : null),
    [pinned],
  );

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
      const params = paramsFromLevers(levers, activePresetId);
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${params.toString()}`,
      );
    }, 150);
    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [levers, activePresetId]);

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
          <h1 className="o-h1 mt-3 max-w-[22ch]">
            From peak-priced certainty to a placed portfolio.
          </h1>

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

          <details className="o-panel o-disclosure mt-3 px-4">
            <summary>
              <span className="o-eyebrow">The equation</span>
            </summary>
            <div className="pb-4">
              <p className="o-equation">
                <span style={{ color: "var(--ink)" }}>Placed</span> = P·V · [{" "}
                <span className="o-eq-blue">w_pt/u_pt</span> +{" "}
                <span className="o-eq-blue">w_spike</span>·m_spike +{" "}
                <span className="o-eq-green">0.5</span>·w_off + (
                <span className="o-eq-green">0.5</span>+
                <span className="o-eq-green">0.5</span>
                <span className="o-eq-gold">h</span>)·w_def +{" "}
                <span className="o-eq-green">0.5</span>·w_batch ] · (1−
                <span className="o-eq-fsp">d</span>)
              </p>
              <p className="o-equation mt-1">
                <span style={{ color: "var(--ink)" }}>GSU line</span> = P·V·(
                <span className="o-eq-blue">w_pt/u_pt</span>) ·{" "}
                <span className="o-eq-teal">τ</span> · (1−max(
                <span className="o-eq-fsp">d</span>,
                <span className="o-eq-teal">g</span>)) · (1−
                <span className="o-eq-teal">q</span>) · (1−
                <span className="o-eq-teal">credits</span>)
              </p>
              <p className="o-mono o-faint mt-3 text-[10px] leading-[1.6]">
                m_spike is 1.0x with Buy One PT Get One PayGo elected, 1.8x
                without. Any construct left unelected bills its share at 1.0x.
              </p>
            </div>
          </details>

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

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="mt-7 flex flex-wrap items-center gap-2">
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
          <ShareButton levers={levers} presetId={activePresetId} />
          <ExportButton levers={levers} result={result} />
        </div>

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

        {/* ── KPI strip ──────────────────────────────────────────────── */}
        <div className="mt-6">
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
                Cost waterfall · $K per month
              </h2>
              <p className="o-mono text-[11px]" style={{ color: "var(--ink-dim)" }}>
                {moneyK(result.atList)} →{" "}
                <span style={{ color: "var(--green)" }}>
                  {moneyK(result.final)}
                </span>{" "}
                <span className="o-faint">
                  ({percent(result.savingPct)} · {multiplier(result.blendedMultiplier)})
                </span>
              </p>
            </div>

            <div className="mt-3">
              <Waterfall
                result={result}
                compare={compareResult}
                present={present}
              />
            </div>

            <div
              className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3.5"
              style={{ borderColor: "var(--line)" }}
            >
              {LEGEND.map((item) => (
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
      </main>

      <Footnotes />

      {/* ── Mobile lever sheet ───────────────────────────────────────── */}
      {!present ? (
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
