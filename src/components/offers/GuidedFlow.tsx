"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChartTabs, { type ChartTab } from "./ChartTabs";
import MathTrace from "./MathTrace";
import Slider from "./Slider";
import Tooltip from "./Tooltip";
import Waterfall from "./Waterfall";
import {
  BOGO_MIN_GSUS,
  GSU_TERM_LABEL,
  type GsuTerm,
  type Levers,
  type ModelResult,
  type Step,
  monthlySpendFromTpm,
  tpmFromMonthlySpend,
} from "@/lib/offers/model";
import { SELECTABLE_MODELS } from "@/lib/offers/models";
import { WORKLOADS, matchWorkload } from "@/lib/offers/workloads";
import { type Recommendation, talkingPoints } from "@/lib/offers/recommend";
import { OFFER_INFO } from "@/lib/offers/descriptions";
import { inUnit, moneyK, moneyM, multiplier, percent, pickUnit } from "@/lib/offers/format";

const OFFER_KEYS = ["bogo", "offPeak", "deferred", "batch", "fsp", "q3"] as const;

const OFFER_COLOUR: Record<(typeof OFFER_KEYS)[number], string> = {
  bogo: "var(--blue)",
  offPeak: "var(--green)",
  deferred: "var(--green)",
  batch: "var(--green)",
  fsp: "var(--fsp)",
  q3: "var(--teal)",
};

/** Common deal sizes, so the usual answer is one click. $K per month. */
const SPEND_PRESETS = [100, 250, 500, 1000, 2500, 5000];

export interface GuidedFlowProps {
  levers: Levers;
  result: ModelResult;
  steps: Step[];
  chartTab: ChartTab;
  recommendation: Recommendation;
  /** True when the levers still match what was recommended. */
  onRecommendation: boolean;
  workloadId: string;
  onChartTabChange: (next: ChartTab) => void;
  onChange: (patch: Partial<Levers>) => void;
  onWorkload: (id: string) => void;
  onApplyRecommendation: () => void;
  onOpenPro: () => void;
}

/**
 * The seller's journey. Three questions at the top — what are they building,
 * how big is it, on which model — then an answer, then the detail only if the
 * conversation needs it.
 *
 * Everything the seller cannot reasonably know (output ratio, placement mix,
 * harness share) is derived from the workload archetype rather than asked for.
 */
export default function GuidedFlow({
  levers,
  result,
  steps,
  chartTab,
  recommendation,
  onRecommendation,
  workloadId,
  onChartTabChange,
  onChange,
  onWorkload,
  onApplyRecommendation,
  onOpenPro,
}: GuidedFlowProps) {
  const [showOffer, setShowOffer] = useState(false);
  const [showWorking, setShowWorking] = useState(false);

  const { traffic, sizing } = result;
  const tpmUnit = pickUnit(traffic.totalTpm);
  const mathSteps = result.steps;

  const spendK = useMemo(
    () => monthlySpendFromTpm(levers.tpm, levers.modelId, levers.outputShare),
    [levers.tpm, levers.modelId, levers.outputShare],
  );

  const setSpend = (next: number) =>
    onChange({
      tpm: tpmFromMonthlySpend(next, levers.modelId, levers.outputShare),
    });

  // The field holds a string while it is being typed — committing on every
  // keystroke would round-trip through TPM and fight the cursor.
  const [draftSpend, setDraftSpend] = useState(() => String(Math.round(spendK)));
  const lastSynced = useRef(Math.round(spendK));
  useEffect(() => {
    const rounded = Math.round(spendK);
    if (rounded !== lastSynced.current) {
      lastSynced.current = rounded;
      setDraftSpend(String(rounded));
    }
  }, [spendK]);

  const commitSpend = () => {
    const parsed = Number(draftSpend);
    const next = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
    lastSynced.current = Math.round(next);
    setDraftSpend(String(Math.round(next)));
    setSpend(next);
  };

  const points = useMemo(() => talkingPoints(result), [result]);
  const matched = matchWorkload(levers);

  return (
    <div className="space-y-5">
      {/* ── 1. The three questions ───────────────────────────────────── */}
      <section className="o-panel p-5 sm:p-6" aria-labelledby="guided-inputs">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="o-eyebrow" id="guided-inputs">
            Tell it about the deal
          </p>
          <p className="o-mono o-faint text-[10px]">
            everything else is inferred
          </p>
        </div>

        {/* What are they building */}
        <fieldset className="mt-5">
          <legend className="o-mono mb-2.5 flex items-center gap-1.5 text-[11px] tracking-[0.06em] uppercase" style={{ color: "var(--ink-dim)" }}>
            What are they building?
            <Tooltip
              text="Sets the token mix, where the traffic can be placed and the agent-harness share — the things a customer rarely quotes and a seller should not have to guess. All of it is editable in Pro."
              label="What are they building"
            />
          </legend>
          <div className="flex flex-wrap gap-2">
            {WORKLOADS.map((w) => {
              const active = matched?.id === w.id || (!matched && w.id === workloadId);
              return (
                <button
                  key={w.id}
                  type="button"
                  className="o-chip"
                  aria-pressed={active}
                  onClick={() => onWorkload(w.id)}
                  title={w.blurb}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
          <p className="o-faint mt-2.5 text-[12px] leading-[1.55]">
            {matched?.blurb ??
              "Custom profile — the placement mix has been tuned by hand."}
          </p>
        </fieldset>

        {/* How big */}
        <div className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
          <div>
            <label
              className="o-mono mb-2.5 flex items-center gap-1.5 text-[11px] tracking-[0.06em] uppercase"
              style={{ color: "var(--ink-dim)" }}
              htmlFor="guided-spend"
            >
              How much are they adding, per month?
              <Tooltip
                text="What the customer expects this new workload to cost per month at standard rates — the number a seller actually hears. Tokens, GSUs and the reservation are all worked out from it, so nobody has to know a TPM figure."
                label="Incremental spend"
              />
            </label>
            <div className="flex items-center gap-2">
              <span
                className="o-mono text-[17px]"
                style={{ color: "var(--gold)" }}
                aria-hidden="true"
              >
                $
              </span>
              <input
                id="guided-spend"
                className="o-input"
                type="number"
                inputMode="numeric"
                min={0}
                step={25}
                value={draftSpend}
                onChange={(e) => setDraftSpend(e.target.value)}
                onBlur={commitSpend}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSpend();
                }}
                style={{ maxWidth: 190 }}
                aria-describedby="guided-spend-hint"
              />
              <span className="o-mono o-faint text-[11px]">K / month</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SPEND_PRESETS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="o-chip"
                  aria-pressed={Math.round(spendK) === v}
                  onClick={() => {
                    setDraftSpend(String(v));
                    setSpend(v);
                  }}
                >
                  {v >= 1000 ? `$${v / 1000}M` : `$${v}K`}
                </button>
              ))}
            </div>
            <p
              className="o-mono o-faint mt-2.5 text-[10.5px] leading-[1.6]"
              id="guided-spend-hint"
            >
              ≈ {inUnit(levers.tpm, tpmUnit)} TPM on {sizing.modelName}
            </p>
          </div>

          <div>
            <p className="o-mono mb-2.5 flex items-center gap-1.5 text-[11px] tracking-[0.06em] uppercase" style={{ color: "var(--ink-dim)" }}>
              Which model?
              <Tooltip
                text="Sets both halves of the maths: the PayGo rate per million tokens, and how much throughput one GSU delivers. The same traffic needs a different reservation on a different model."
                label="Which model"
              />
            </p>
            <div className="flex flex-wrap gap-2">
              {SELECTABLE_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="o-chip"
                  aria-pressed={levers.modelId === m.id}
                  onClick={() => onChange({ modelId: m.id })}
                >
                  {m.name.replace(/^Gemini /, "")}
                </button>
              ))}
            </div>
            <p className="o-mono o-faint mt-2.5 text-[10.5px] leading-[1.6]">
              {sizing.throughputIsPublished
                ? `${sizing.throughputPerGsu} tok/s per GSU published`
                : "throughput per GSU is an assumption"}
              {" · "}
              ${sizing.paygoPerMtok.toFixed(2)}/Mtok blended
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. The recommendation ────────────────────────────────────── */}
      <section
        className="o-panel p-5 sm:p-6"
        style={{ borderColor: onRecommendation ? "var(--teal)" : "var(--line)" }}
        aria-labelledby="guided-reco"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <p className="o-eyebrow" id="guided-reco" style={{ color: "var(--teal)" }}>
            {onRecommendation ? "Recommended shape" : "You've adjusted this"}
          </p>
          {!onRecommendation ? (
            <button type="button" className="o-btn" onClick={onApplyRecommendation}>
              Reset to recommended
            </button>
          ) : null}
        </div>

        <p
          className="mt-3 text-[clamp(1rem,0.8rem+0.85vw,1.35rem)] leading-[1.5]"
          style={{ color: "var(--ink)", fontWeight: 300 }}
        >
          {recommendation.headline}
        </p>

        {/* The executive numbers */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: "They pay", value: `${moneyK(result.final)}/mo`, colour: "var(--ink)" },
            { label: "They save", value: percent(result.savingPct, 0), colour: "var(--green)" },
            { label: "Over a year", value: moneyM(result.annualSave), colour: "var(--green)" },
            { label: "Blended rate", value: multiplier(result.blendedMultiplier), colour: "var(--teal)" },
          ].map((cell) => (
            <div key={cell.label}>
              <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
                {cell.label}
              </p>
              <p
                className="o-mono o-animate-value mt-2 text-[clamp(1.15rem,0.9rem+1vw,1.7rem)] leading-none"
                style={{ color: cell.colour }}
              >
                {cell.value}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-5 grid gap-x-8 gap-y-3 border-t pt-4 md:grid-cols-2"
          style={{ borderColor: "var(--line)" }}
        >
          <div>
            <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
              Why this shape
            </p>
            <ul className="mt-2 space-y-2">
              {recommendation.reasons.map((r) => (
                <li key={r} className="o-dim text-[12.5px] leading-[1.6]">
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
              What to say
            </p>
            <ul className="mt-2 space-y-2">
              {points.map((p) => (
                <li key={p} className="o-dim text-[12.5px] leading-[1.6]">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {recommendation.watchOuts.length > 0 ? (
          <div
            className="mt-4 border-t pt-4"
            style={{ borderColor: "var(--line)" }}
          >
            <p className="o-eyebrow" style={{ color: "var(--gold)" }}>
              Check before you quote
            </p>
            <ul className="mt-2 space-y-1.5">
              {recommendation.watchOuts.map((w) => (
                <li className="o-dim text-[12.5px] leading-[1.6]" key={w}>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* ── 3. Adjust the offer (progressive disclosure) ─────────────── */}
      <section className="o-panel" aria-labelledby="guided-offer">
        <button
          type="button"
          className="o-disclose"
          aria-expanded={showOffer}
          onClick={() => setShowOffer((v) => !v)}
          id="guided-offer"
        >
          <span>Adjust the offer</span>
          <span className="o-mono o-faint text-[10.5px]">
            {traffic.ptGsus.toLocaleString("en-US")} GSUs ·{" "}
            {GSU_TERM_LABEL[levers.term]} ·{" "}
            {OFFER_KEYS.filter((k) => levers.offers[k]).length} of{" "}
            {OFFER_KEYS.length} elected
          </span>
        </button>

        {showOffer ? (
          <div className="o-fade-in px-5 pb-5 sm:px-6 sm:pb-6">
            <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
              <Slider
                label="How much goes on Provisioned Throughput"
                tooltip="The commercial decision: how much of the demand the customer commits to reserved capacity. It sets the GSU count, which in turn sets BOGO eligibility and the Q3 tier."
                readout={`${percent(levers.ptShare, 0)} PT · ${percent(1 - levers.ptShare, 0)} PayGo`}
                value={levers.ptShare}
                min={0}
                max={1}
                step={0.01}
                onChange={(v) => onChange({ ptShare: v })}
                accent="var(--blue)"
                caption={`${traffic.ptGsus.toLocaleString("en-US")} GSUs ordered · ${moneyK(result.ptReference)}/mo at list.`}
              />
              <div>
                <p className="o-mono mb-2.5 text-[11px] tracking-[0.06em] uppercase" style={{ color: "var(--ink-dim)" }}>
                  Commitment term
                </p>
                <div className="o-seg" role="group" aria-label="GSU commitment term">
                  {(["1m", "3m", "1y"] as GsuTerm[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={levers.term === t}
                      onClick={() => onChange({ term: t })}
                      style={{ ["--seg-active" as string]: "var(--teal)" }}
                    >
                      {GSU_TERM_LABEL[t]}
                    </button>
                  ))}
                </div>
                <p className="o-mono o-faint mt-2.5 text-[10.5px] leading-[1.6]">
                  ${(result.gsu.effectiveUnitPrice * 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })} per GSU per month effective ·{" "}
                  {moneyK(result.commit.monthly)}/mo committed
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--line)" }}>
              <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
                What&rsquo;s on the table
              </p>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                {OFFER_KEYS.map((key) => {
                  const info = OFFER_INFO[key];
                  const blocked =
                    key === "bogo" && traffic.ptGsus < BOGO_MIN_GSUS;
                  return (
                    <label
                      key={key}
                      className="o-check"
                      style={blocked ? { opacity: 0.45 } : undefined}
                    >
                      <input
                        type="checkbox"
                        checked={levers.offers[key] && !blocked}
                        disabled={blocked}
                        onChange={(e) =>
                          onChange({
                            offers: { ...levers.offers, [key]: e.target.checked },
                          })
                        }
                        style={{ ["--tick" as string]: OFFER_COLOUR[key] }}
                      />
                      <span className="flex items-center gap-1.5">
                        <span className="text-[12.5px] leading-tight">
                          {info.label}
                        </span>
                        <Tooltip text={info.tooltip} label={info.label} />
                      </span>
                    </label>
                  );
                })}
              </div>
              {traffic.ptGsus < BOGO_MIN_GSUS ? (
                <p className="o-mono o-faint mt-2 text-[10px]">
                  Buy One PT Get One PayGo needs {BOGO_MIN_GSUS}+ PT GSUs.
                </p>
              ) : null}
            </div>

            <div
              className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
              style={{ borderColor: "var(--line)" }}
            >
              <button type="button" className="o-btn" onClick={onOpenPro}>
                Open every lever in Pro
              </button>
              <p className="o-mono o-faint text-[10.5px]">
                utilization, placement mix, output ratio, GCP commit, harness
              </p>
            </div>
          </div>
        ) : null}
      </section>

      {/* ── 4. The working (progressive disclosure) ──────────────────── */}
      <section className="o-panel" aria-labelledby="guided-working">
        <button
          type="button"
          className="o-disclose"
          aria-expanded={showWorking}
          onClick={() => setShowWorking((v) => !v)}
          id="guided-working"
        >
          <span>Show the working</span>
          <span className="o-mono o-faint text-[10.5px]">
            {moneyK(result.reference)} → {moneyK(result.final)}
          </span>
        </button>

        {showWorking ? (
          <div className="o-fade-in px-4 pb-5 sm:px-5 sm:pb-6">
            <ChartTabs
              value={chartTab}
              onChange={onChartTabChange}
              idPrefix="guided-waterfall"
            />
            {chartTab === "chart" ? (
              <div
                className="mt-3"
                id="guided-waterfall-panel-chart"
                role="tabpanel"
                aria-labelledby="guided-waterfall-tab-chart"
              >
                <Waterfall result={result} steps={steps} />
              </div>
            ) : (
              <div
                className="o-fade-in mt-4"
                id="guided-waterfall-panel-math"
                role="tabpanel"
                aria-labelledby="guided-waterfall-tab-math"
              >
                <MathTrace result={result} steps={mathSteps} />
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
