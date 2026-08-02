"use client";

import Slider from "./Slider";
import Waterfall from "./Waterfall";
import Tooltip from "./Tooltip";
import {
  type Accent,
  GSU_TERM_LABEL,
  type ModelResult,
  SIMPLE_OFFER_KEYS,
  SIMPLE_RANGES,
  type SimpleInputs,
  type Step,
} from "@/lib/offers/model";
import { OFFER_INFO } from "@/lib/offers/descriptions";
import { inUnit, moneyK, moneyM, multiplier, percent, pickUnit } from "@/lib/offers/format";

const ACCENT_VAR: Record<Accent, string> = {
  gold: "var(--gold)",
  blue: "var(--blue)",
  green: "var(--green)",
  fsp: "var(--fsp)",
  teal: "var(--teal)",
};

/**
 * The two-input version. One sentence describing the customer, the concessions
 * applied in order, and what they blend to. It reads the same scenario Pro
 * does — it just shows fewer of its dials, so the two always agree.
 */
export default function SimpleView({
  simple,
  result,
  steps,
  onChange,
}: {
  simple: SimpleInputs;
  result: ModelResult;
  /** The columns to chart — the elected steps, shared with Pro. */
  steps: Step[];
  onChange: (patch: Partial<SimpleInputs>) => void;
}) {
  const { levers, traffic } = result;
  const tpmUnit = pickUnit(traffic.totalTpm);
  const paygoShare = 1 - simple.ptShare;

  const movers = steps.filter(
    (step) => step.index > 0 && Math.abs(step.delta) > 0.005,
  );

  const OFFER_COLOUR: Record<(typeof SIMPLE_OFFER_KEYS)[number], string> = {
    offPeak: "var(--green)",
    deferred: "var(--green)",
    batch: "var(--green)",
    fsp: "var(--fsp)",
    q3: "var(--teal)",
  };

  return (
    <div className="space-y-5">
      {/* ── The sentence ─────────────────────────────────────────────── */}
      <section className="o-panel p-5 sm:p-6" aria-labelledby="simple-heading">
        <p className="o-eyebrow">The customer</p>

        <h2
          id="simple-heading"
          className="mt-3 text-[clamp(1.05rem,0.85rem+0.9vw,1.5rem)] leading-[1.45]"
          style={{ color: "var(--ink-dim)", fontWeight: 300 }}
        >
          Total demand of{" "}
          <span className="o-mono" style={{ color: "var(--ink)" }}>
            {levers.ptGsus + levers.paygoGsus === 0
              ? "0"
              : (levers.ptGsus + levers.paygoGsus).toLocaleString("en-US")}{" "}
            GSUs
          </span>
          , of which{" "}
          <span className="o-mono" style={{ color: "var(--blue)" }}>
            {percent(simple.ptShare, 0)}
          </span>{" "}
          goes to{" "}
          <span style={{ color: "var(--blue)" }}>Provisioned Throughput</span> and{" "}
          <span className="o-mono" style={{ color: "var(--green)" }}>
            {percent(paygoShare, 0)}
          </span>{" "}
          goes to <span style={{ color: "var(--green)" }}>PayGo</span>.
        </h2>

        <div className="mt-6 grid gap-x-8 gap-y-4 md:grid-cols-2">
          <Slider
            label="Total demand"
            tooltip="Total incremental demand per month, in GSU-equivalents so PT and PayGo sit on one scale."
            readout={`${simple.totalDemand.toLocaleString("en-US")} GSU`}
            value={simple.totalDemand}
            min={SIMPLE_RANGES.totalDemand.min}
            max={SIMPLE_RANGES.totalDemand.max}
            step={SIMPLE_RANGES.totalDemand.step}
            onChange={(value) => onChange({ totalDemand: value })}
            accent="var(--gold)"
            caption={`${inUnit(traffic.totalTpm, tpmUnit)} TPM · ${moneyK(result.reference)}/mo at standard rates.`}
          />
          <Slider
            label="Share on Provisioned Throughput"
            tooltip="How much of that demand is committed to reserved capacity. The remainder rides PayGo tiers."
            readout={`${percent(simple.ptShare, 0)} PT · ${percent(paygoShare, 0)} PayGo`}
            value={simple.ptShare}
            min={SIMPLE_RANGES.ptShare.min}
            max={SIMPLE_RANGES.ptShare.max}
            step={SIMPLE_RANGES.ptShare.step}
            onChange={(value) => onChange({ ptShare: value })}
            accent="var(--blue)"
            caption={`${levers.ptGsus.toLocaleString("en-US")} GSUs on PT · ${levers.paygoGsus.toLocaleString("en-US")} on PayGo.`}
          />
        </div>

        <div className="mt-6 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
            Concessions on the table
          </p>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-0">
            {SIMPLE_OFFER_KEYS.map((key) => {
              const info = OFFER_INFO[key];
              return (
                <label key={key} className="o-check">
                  <input
                    type="checkbox"
                    checked={simple.offers[key]}
                    onChange={(event) =>
                      onChange({
                        offers: { ...simple.offers, [key]: event.target.checked },
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
        </div>

        <div
          className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2 border-t pt-4"
          style={{ borderColor: "var(--line)" }}
        >
          <span className="o-mono text-[11px]">
            <span className="o-faint">At standard rates </span>
            <span style={{ color: "var(--gold)" }}>
              {moneyK(result.reference)}/mo
            </span>
          </span>
          <span className="o-mono text-[11px]">
            <span className="o-faint">With the above elected </span>
            <span style={{ color: "var(--green)" }}>{moneyK(result.final)}/mo</span>
          </span>
          <span className="o-mono text-[11px]">
            <span className="o-faint">Saved </span>
            <span style={{ color: "var(--green)" }}>
              {percent(result.savingPct)} · {moneyM(result.annualSave)}/yr
            </span>
          </span>
        </div>
      </section>

      {/* ── The waterfall ────────────────────────────────────────────── */}
      <section className="o-panel p-4 sm:p-5" aria-labelledby="simple-waterfall">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="simple-waterfall" className="o-eyebrow">
            Concessions applied in order · $K per month
          </h2>
          <p className="o-mono text-[11px]" style={{ color: "var(--ink-dim)" }}>
            {moneyK(result.reference)} →{" "}
            <span style={{ color: "var(--green)" }}>{moneyK(result.final)}</span>
          </p>
        </div>

        <div className="mt-3">
          <Waterfall result={result} steps={steps} />
        </div>

        <ol
          className="mt-4 grid gap-x-6 gap-y-2 border-t pt-4 sm:grid-cols-2"
          style={{ borderColor: "var(--line)" }}
        >
          {movers.map((step) => (
            <li
              key={step.id}
              className="flex items-baseline justify-between gap-3 text-[12.5px]"
            >
              <span style={{ color: "var(--ink-dim)" }}>
                <span
                  className="o-marker mr-1.5"
                  style={{ color: ACCENT_VAR[step.accent] }}
                  aria-hidden="true"
                >
                  ●
                </span>
                {step.label}
              </span>
              <span
                className="o-mono shrink-0 text-[11.5px]"
                style={{ color: "var(--green)" }}
              >
                −{moneyK(Math.abs(step.delta))}
              </span>
            </li>
          ))}
          {movers.length === 0 ? (
            <li className="o-faint text-[12.5px]">
              Nothing elected moves the number. Tick a concession above, or note
              that the Q3 tiers need 500+ GSUs on PT.
            </li>
          ) : null}
        </ol>
      </section>

      {/* ── The blended outcome ──────────────────────────────────────── */}
      <section className="o-panel p-5 sm:p-6" aria-labelledby="simple-blended">
        <p className="o-eyebrow" id="simple-blended">
          What the customer ends up paying
        </p>

        <div className="mt-4 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
          <div>
            <p
              className="o-mono o-animate-value text-[clamp(2rem,1.4rem+2.6vw,3.1rem)] leading-none"
              style={{ color: "var(--green)" }}
            >
              {multiplier(result.blendedMultiplier)}
            </p>
            <p className="o-mono o-faint mt-2.5 text-[10.5px] leading-[1.6]">
              blended, of Standard PayGo
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Monthly",
                value: moneyK(result.final),
                colour: "var(--ink)",
              },
              {
                label: "Saved per year",
                value: moneyM(result.annualSave),
                colour: "var(--green)",
              },
              {
                label: "Committed",
                value: `${moneyK(result.commit.monthly)}/mo`,
                colour: "var(--teal)",
              },
            ].map((cell) => (
              <div key={cell.label}>
                <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
                  {cell.label}
                </p>
                <p
                  className="o-mono mt-2 text-[17px] leading-none"
                  style={{ color: cell.colour }}
                >
                  {cell.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="o-mono o-faint mt-5 text-[10px] leading-[1.7]">
          Same scenario as Pro, same arithmetic — this view just shows fewer
          dials. Running on {percent(levers.ptUtilization, 0)} PT utilization, a{" "}
          {GSU_TERM_LABEL[levers.term]} GSU term and FSP at{" "}
          {percent(levers.fspRate, 0)}; carried over from Pro, and changed
          there. Simple models no spike traffic, so Buy One PT Get One PayGo has
          nothing to rescue and is left out here.
        </p>
      </section>
    </div>
  );
}
