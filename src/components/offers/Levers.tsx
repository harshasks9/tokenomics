"use client";

import Slider from "./Slider";
import Tooltip from "./Tooltip";
import {
  BOGO_MIN_GSUS,
  GSU_TERM_LABEL,
  GSU_TERM_PRICE,
  type GsuTerm,
  LEVER_RANGES,
  type Levers as LeverState,
  type ModelResult,
  type OfferElections,
  type PayGoMixKey,
} from "@/lib/offers/model";
import { LEVER_INFO, OFFER_INFO } from "@/lib/offers/descriptions";
import { SELECTABLE_MODELS } from "@/lib/offers/models";
import { moneyK, share } from "@/lib/offers/format";

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t px-4 py-4" style={{ borderColor: "var(--line)" }}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="o-eyebrow">{title}</h3>
        {hint ? <span className="o-mono o-faint text-[10px]">{hint}</span> : null}
      </div>
      <div className="mt-2.5">{children}</div>
    </section>
  );
}

const TERMS: readonly GsuTerm[] = ["1m", "3m", "1y"];

function formatTpm(tpm: number): string {
  if (tpm >= 1_000_000) return `${(tpm / 1_000_000).toFixed(1)}M`;
  if (tpm >= 1_000) return `${Math.round(tpm / 1_000)}K`;
  return String(Math.round(tpm));
}

/** One PayGo construct: elect it, then size its share of PayGo demand. */
function OfferRow({
  offerKey,
  mixKey,
  tierLabel,
  tierColour,
  levers,
  result,
  onChange,
  note,
  disabled,
}: {
  offerKey: keyof OfferElections;
  mixKey: PayGoMixKey;
  tierLabel: string;
  tierColour: string;
  levers: LeverState;
  result: ModelResult;
  onChange: (patch: Partial<LeverState>) => void;
  note?: string;
  disabled?: boolean;
}) {
  const on = levers.offers[offerKey] && !disabled;
  const info = OFFER_INFO[offerKey];

  return (
    <div className={`o-offer ${on ? "" : "is-off"}`}>
      <label className={`o-check ${disabled ? "is-disabled" : ""}`}>
        <input
          type="checkbox"
          checked={levers.offers[offerKey]}
          disabled={disabled}
          onChange={(event) =>
            onChange({
              offers: { ...levers.offers, [offerKey]: event.target.checked },
            })
          }
          style={{ ["--tick" as string]: tierColour }}
        />
        <span className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[12.5px] leading-tight">{info.label}</span>
          <span className="o-badge" style={{ color: tierColour }}>
            {tierLabel}
          </span>
          <Tooltip text={info.tooltip} label={info.label} />
        </span>
      </label>

      <div className="pl-6">
        <Slider
          label={LEVER_INFO[mixKey].label}
          tooltip={LEVER_INFO[mixKey].tooltip}
          readout={share(result.mix[mixKey])}
          value={levers.paygoMix[mixKey]}
          min={LEVER_RANGES.mixShare.min}
          max={LEVER_RANGES.mixShare.max}
          step={LEVER_RANGES.mixShare.step}
          onChange={(value) =>
            onChange({ paygoMix: { ...levers.paygoMix, [mixKey]: value } })
          }
          accent={on ? tierColour : "var(--ink-faint)"}
          ariaValueText={`${LEVER_INFO[mixKey].label}: ${share(result.mix[mixKey])} of PayGo demand, ${on ? `billing at ${tierLabel}` : "not elected, billing at 1.0x"}`}
        />
        {note ? (
          <p className="o-mono o-faint -mt-1 text-[10px] leading-[1.5]">{note}</p>
        ) : null}
      </div>
    </div>
  );
}

export interface LeversProps {
  levers: LeverState;
  result: ModelResult;
  onChange: (patch: Partial<LeverState>) => void;
  onReset: () => void;
}

export default function Levers({ levers, result, onChange, onReset }: LeversProps) {
  const { q3Tier, gsusToNextTier, bogoEligible, traffic } = result;

  return (
    <div>
      {/* ── Volume: what they're adding ──────────────────────────────── */}
      <Group title="What they're adding" hint={`${formatTpm(traffic.totalTpm)} TPM`}>
        <Slider
          label={LEVER_INFO.ptGsus.label}
          tooltip={LEVER_INFO.ptGsus.tooltip}
          readout={`${levers.ptGsus.toLocaleString("en-US")} GSU`}
          value={levers.ptGsus}
          min={LEVER_RANGES.ptGsus.min}
          max={LEVER_RANGES.ptGsus.max}
          step={LEVER_RANGES.ptGsus.step}
          onChange={(value) => onChange({ ptGsus: value })}
          accent="var(--blue)"
          caption={`${moneyK(result.ptReference)}/mo at list · ${formatTpm(traffic.ptCapacityTpm)} TPM reserved.`}
        />
        <Slider
          label={LEVER_INFO.ptUtilization.label}
          tooltip={LEVER_INFO.ptUtilization.tooltip}
          readout={share(levers.ptUtilization)}
          value={levers.ptUtilization}
          min={LEVER_RANGES.ptUtilization.min}
          max={LEVER_RANGES.ptUtilization.max}
          step={LEVER_RANGES.ptUtilization.step}
          onChange={(value) => onChange({ ptUtilization: value })}
          accent="var(--gold)"
          marker="anchored"
          caption={
            traffic.idleGsus > 0.5
              ? `${traffic.idleGsus.toFixed(0)} GSUs reserved but unused — billed anyway.`
              : "Fully utilised."
          }
        />
        <Slider
          label={LEVER_INFO.paygoGsus.label}
          tooltip={LEVER_INFO.paygoGsus.tooltip}
          readout={`${levers.paygoGsus.toLocaleString("en-US")} GSU`}
          value={levers.paygoGsus}
          min={LEVER_RANGES.paygoGsus.min}
          max={LEVER_RANGES.paygoGsus.max}
          step={LEVER_RANGES.paygoGsus.step}
          onChange={(value) => onChange({ paygoGsus: value })}
          accent="var(--green)"
          caption={`${moneyK(result.paygoReference)}/mo at standard rates · ${formatTpm(traffic.paygoTpm)} TPM.`}
        />
      </Group>

      {/* ── PayGo placement ──────────────────────────────────────────── */}
      <Group
        title="Where the PayGo goes"
        hint={`${share(result.mix.standard)} standard`}
      >
        <OfferRow
          offerKey="bogo"
          mixKey="spike"
          tierLabel={levers.offers.bogo && bogoEligible ? "1.0x" : "1.8x"}
          tierColour="var(--blue)"
          levers={levers}
          result={result}
          onChange={onChange}
          disabled={!bogoEligible}
          note={
            bogoEligible
              ? undefined
              : `Needs ${BOGO_MIN_GSUS}+ PT GSUs (currently ${levers.ptGsus.toLocaleString("en-US")}).`
          }
        />
        <OfferRow
          offerKey="offPeak"
          mixKey="offPeak"
          tierLabel={levers.offers.offPeak ? "0.5x" : "1.0x"}
          tierColour="var(--green)"
          levers={levers}
          result={result}
          onChange={onChange}
        />
        <OfferRow
          offerKey="deferred"
          mixKey="deferred"
          tierLabel={levers.offers.deferred ? `${result.defMult.toFixed(2)}x` : "1.0x"}
          tierColour="var(--green)"
          levers={levers}
          result={result}
          onChange={onChange}
        />
        <OfferRow
          offerKey="batch"
          mixKey="batch"
          tierLabel={levers.offers.batch ? "0.5x" : "1.0x"}
          tierColour="var(--green)"
          levers={levers}
          result={result}
          onChange={onChange}
        />

        <p
          className="o-mono mt-3 text-[10px] leading-[1.6]"
          style={{ color: result.overAllocated ? "var(--red)" : "var(--ink-faint)" }}
        >
          {result.overAllocated
            ? "Shares exceed 100% — scaled back proportionally."
            : `The remaining ${share(result.mix.standard)} runs on Standard PayGo at 1.0x.`}
        </p>
      </Group>

      {/* ── Commitments ──────────────────────────────────────────────── */}
      <Group title="Commitments">
        <div className="o-offer">
          <label className="o-check">
            <input
              type="checkbox"
              checked={levers.offers.fsp}
              onChange={(event) =>
                onChange({ offers: { ...levers.offers, fsp: event.target.checked } })
              }
              style={{ ["--tick" as string]: "var(--fsp)" }}
            />
            <span className="flex flex-1 items-center gap-1.5">
              <span className="text-[12.5px] leading-tight">{OFFER_INFO.fsp.label}</span>
              <Tooltip text={OFFER_INFO.fsp.tooltip} label={OFFER_INFO.fsp.label} />
            </span>
          </label>
          {levers.offers.fsp ? (
            <div className="pb-1 pl-6">
              <div className="o-seg" role="group" aria-label="FSP term">
                {[
                  { value: 0.1, label: "1Y −10%" },
                  { value: 0.2, label: "3Y −20%" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={levers.fspRate === option.value}
                    onClick={() => onChange({ fspRate: option.value })}
                    style={{ ["--seg-active" as string]: "var(--fsp)" }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="o-offer pt-3">
          <p className="mb-2 flex items-center gap-1.5 text-[12.5px] leading-tight">
            {LEVER_INFO.term.label}
            <Tooltip text={LEVER_INFO.term.tooltip} label={LEVER_INFO.term.label} />
          </p>
          <div className="o-seg" role="group" aria-label="GSU commitment term">
            {TERMS.map((term) => (
              <button
                key={term}
                type="button"
                aria-pressed={levers.term === term}
                onClick={() => onChange({ term })}
                style={{ ["--seg-active" as string]: "var(--teal)" }}
              >
                {GSU_TERM_LABEL[term]}
              </button>
            ))}
          </div>
          <p className="o-mono o-faint mt-2 text-[10px] leading-[1.5]">
            ${(GSU_TERM_PRICE[levers.term] * 1000).toLocaleString("en-US")} per GSU
            per month · commit {moneyK(result.commit.monthly)}/mo (
            {moneyK(result.commit.total)} over {result.commit.months} mo).
          </p>
        </div>

        <div className="o-offer pt-3">
          <Slider
            label={LEVER_INFO.gcpCommit.label}
            tooltip={LEVER_INFO.gcpCommit.tooltip}
            readout={share(levers.gcpCommit)}
            value={levers.gcpCommit}
            min={LEVER_RANGES.gcpCommit.min}
            max={LEVER_RANGES.gcpCommit.max}
            step={LEVER_RANGES.gcpCommit.step}
            onChange={(value) => onChange({ gcpCommit: value })}
            accent="var(--teal)"
            caption={
              result.gsu.appliedDiscount === "gcp"
                ? `Non-stacking — the PT line takes GCP commit ${share(result.gsu.appliedDiscountRate)}, not FSP.`
                : result.gsu.appliedDiscount === "fsp"
                  ? `Non-stacking — the PT line takes FSP ${share(result.gsu.appliedDiscountRate)}, not both.`
                  : "Non-stacking with FSP — the larger of the two applies."
            }
          />
        </div>

        <div className="o-offer pt-3">
          <label className="o-check">
            <input
              type="checkbox"
              checked={levers.offers.q3}
              onChange={(event) =>
                onChange({ offers: { ...levers.offers, q3: event.target.checked } })
              }
              style={{ ["--tick" as string]: "var(--teal)" }}
            />
            <span className="flex flex-1 items-center gap-1.5">
              <span className="text-[12.5px] leading-tight">{OFFER_INFO.q3.label}</span>
              <Tooltip text={OFFER_INFO.q3.tooltip} label={OFFER_INFO.q3.label} />
            </span>
          </label>

          {levers.offers.q3 ? (
            <div className="pb-1 pl-6">
              <div
                className="o-panel-2 px-3 py-2"
                style={{ borderColor: q3Tier ? "var(--teal)" : "var(--line)" }}
              >
                {q3Tier ? (
                  <>
                    <p className="o-mono text-[10.5px]" style={{ color: "var(--teal)" }}>
                      QUALIFIES · {q3Tier.label}
                    </p>
                    <p className="o-faint mt-1 text-[11px] leading-[1.5]">
                      {q3Tier.blurb}
                    </p>
                    {gsusToNextTier !== null && gsusToNextTier > 0 ? (
                      <p className="o-mono o-faint mt-1.5 text-[10px]">
                        +{gsusToNextTier.toLocaleString("en-US")} GSUs reaches the
                        2,000+ tier.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="o-mono text-[10.5px]" style={{ color: "var(--gold)" }}>
                      BELOW THRESHOLD
                    </p>
                    <p className="o-faint mt-1 text-[11px] leading-[1.5]">
                      +{gsusToNextTier?.toLocaleString("en-US")} PT GSUs reaches the
                      500+ tier.
                    </p>
                  </>
                )}
              </div>

              {q3Tier && !q3Tier.fixed ? (
                <div className="mt-2">
                  <Slider
                    label={LEVER_INFO.q3Discount.label}
                    tooltip={LEVER_INFO.q3Discount.tooltip}
                    readout={share(result.q3AppliedDiscount)}
                    value={Math.min(levers.q3Discount, q3Tier.maxDiscount)}
                    min={0}
                    max={q3Tier.maxDiscount}
                    step={0.01}
                    onChange={(value) => onChange({ q3Discount: value })}
                    accent="var(--teal)"
                    caption={`Up to ${share(q3Tier.maxDiscount)} · credits ${share(q3Tier.credits)} fixed.`}
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Group>

      {/* ── Advanced ─────────────────────────────────────────────────── */}
      <div className="border-t px-4 py-1" style={{ borderColor: "var(--line)" }}>
        <details className="o-disclosure">
          <summary>
            <span className="o-eyebrow">Assumptions</span>
          </summary>
          <div className="space-y-1 pb-3">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[12.5px] leading-tight">
                {LEVER_INFO.modelId.label}
                <Tooltip
                  text={LEVER_INFO.modelId.tooltip}
                  label={LEVER_INFO.modelId.label}
                />
              </p>
              <div className="o-seg" role="group" aria-label="Model">
                {SELECTABLE_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    aria-pressed={levers.modelId === model.id}
                    onClick={() => onChange({ modelId: model.id })}
                    style={{ ["--seg-active" as string]: "var(--blue)" }}
                  >
                    {model.name.replace("Gemini ", "")}
                  </button>
                ))}
              </div>
            </div>

            <Slider
              label={LEVER_INFO.tpmPerGsu.label}
              tooltip={LEVER_INFO.tpmPerGsu.tooltip}
              readout={`${formatTpm(levers.tpmPerGsu)} TPM`}
              value={levers.tpmPerGsu}
              min={LEVER_RANGES.tpmPerGsu.min}
              max={LEVER_RANGES.tpmPerGsu.max}
              step={LEVER_RANGES.tpmPerGsu.step}
              onChange={(value) => onChange({ tpmPerGsu: value })}
              accent="var(--ink-dim)"
              caption="Not published in the source decks — set to your real figure."
            />

            <Slider
              label={LEVER_INFO.harness.label}
              tooltip={LEVER_INFO.harness.tooltip}
              readout={share(levers.harness)}
              value={levers.harness}
              min={LEVER_RANGES.harness.min}
              max={LEVER_RANGES.harness.max}
              step={LEVER_RANGES.harness.step}
              onChange={(value) => onChange({ harness: value })}
              accent="var(--gold)"
              marker="anchored"
              caption={`Deferred bills at ${result.defMult.toFixed(3)}x rather than 0.5x.`}
            />
          </div>
        </details>
      </div>

      <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)" }}>
        <button type="button" className="o-btn w-full" onClick={onReset}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
