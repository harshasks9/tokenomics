"use client";

import MixBar from "./MixBar";
import Slider from "./Slider";
import Tooltip from "./Tooltip";
import {
  BOGO_MIN_GSUS,
  GSU_TERM_LABEL,
  GSU_TERM_PRICE,
  type GsuTerm,
  LEVER_RANGES,
  type Levers as LeverState,
  type MixKey,
  type ModelResult,
  type OfferElections,
} from "@/lib/offers/model";
import { LEVER_INFO, OFFER_INFO } from "@/lib/offers/descriptions";
import { moneyK, share } from "@/lib/offers/format";

interface GroupProps {
  title: string;
  hint?: string;
  children: React.ReactNode;
}

function Group({ title, hint, children }: GroupProps) {
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

/** One placement construct: elect it, then size it. */
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
  mixKey: MixKey;
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
        <span className="flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-[12.5px] leading-tight">{info.label}</span>
            <span className="o-badge" style={{ color: tierColour }}>
              {tierLabel}
            </span>
          </span>
        </span>
      </label>

      <div className="pl-6">
        <Slider
          label={LEVER_INFO[mixKey].label}
          tooltip={LEVER_INFO[mixKey].tooltip}
          readout={share(result.mix[mixKey])}
          value={levers.mix[mixKey]}
          min={LEVER_RANGES.mixShare.min}
          max={LEVER_RANGES.mixShare.max}
          step={LEVER_RANGES.mixShare.step}
          onChange={(value) => onChange({ mix: { ...levers.mix, [mixKey]: value } })}
          accent={on ? tierColour : "var(--ink-faint)"}
          ariaValueText={`${LEVER_INFO[mixKey].label}: ${share(result.mix[mixKey])} of workload, ${on ? `billing at ${tierLabel}` : "not elected, billing at 1.0x"}`}
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

export default function Levers({
  levers,
  result,
  onChange,
  onReset,
}: LeversProps) {
  const { q3Tier, gsusToNextTier, bogoEligible } = result;

  return (
    <div>
      {/* ── New capacity ─────────────────────────────────────────────── */}
      <Group title="New capacity" hint={`${result.gsu.units.toFixed(0)} GSUs committed`}>
        <Slider
          label={LEVER_INFO.gsus.label}
          tooltip={LEVER_INFO.gsus.tooltip}
          readout={levers.gsus.toLocaleString("en-US")}
          value={levers.gsus}
          min={LEVER_RANGES.gsus.min}
          max={LEVER_RANGES.gsus.max}
          step={LEVER_RANGES.gsus.step}
          onChange={(value) => onChange({ gsus: value })}
          accent="var(--gold)"
          caption={`${moneyK(result.atList)}/mo if bought peak-sized at list.`}
          ariaValueText={`${levers.gsus} peak-sized GSUs, ${moneyK(result.atList)} per month at list`}
        />

        <div className="mt-3">
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
            per month · incremental commit {moneyK(result.commit.monthly)}/mo (
            {moneyK(result.commit.total)} over {result.commit.months} mo).
          </p>
        </div>
      </Group>

      {/* ── Utilization ──────────────────────────────────────────────── */}
      <Group title="Utilization">
        <Slider
          label={LEVER_INFO.uPeak.label}
          tooltip={LEVER_INFO.uPeak.tooltip}
          readout={share(levers.uPeak)}
          value={levers.uPeak}
          min={LEVER_RANGES.uPeak.min}
          max={LEVER_RANGES.uPeak.max}
          step={LEVER_RANGES.uPeak.step}
          onChange={(value) => onChange({ uPeak: value })}
          accent="var(--gold)"
        />
        <Slider
          label={LEVER_INFO.uPt.label}
          tooltip={LEVER_INFO.uPt.tooltip}
          readout={share(levers.uPt)}
          value={levers.uPt}
          min={LEVER_RANGES.uPt.min}
          max={LEVER_RANGES.uPt.max}
          step={LEVER_RANGES.uPt.step}
          onChange={(value) => onChange({ uPt: value })}
          accent="var(--blue)"
        />
        {levers.uPt <= levers.uPeak ? (
          <p className="o-mono text-[10px] leading-[1.5]" style={{ color: "var(--red)" }}>
            Right-sized utilization is at or below the peak-sized figure — sizing
            to steady state costs more than it saves here.
          </p>
        ) : null}
      </Group>

      {/* ── Placement ────────────────────────────────────────────────── */}
      <Group title="Placement" hint="Tick to elect · slide to size">
        <Slider
          label={LEVER_INFO.pt.label}
          tooltip={LEVER_INFO.pt.tooltip}
          readout={share(result.mix.pt)}
          value={levers.mix.pt}
          min={LEVER_RANGES.mixShare.min}
          max={LEVER_RANGES.mixShare.max}
          step={LEVER_RANGES.mixShare.step}
          onChange={(value) => onChange({ mix: { ...levers.mix, pt: value } })}
          accent="var(--blue)"
          caption={`The other ${share(1 - result.mix.pt)} rides PayGo tiers below.`}
        />

        <div className="mt-3">
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
                ? levers.offers.bogo
                  ? "Protected PayGo for spikes at 1.0x."
                  : "Not elected — spikes bill at Priority PayGo 1.8x."
                : `Needs ${BOGO_MIN_GSUS}+ committed GSUs (currently ${result.gsu.units.toFixed(0)}).`
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
            tierLabel={
              levers.offers.deferred ? `${result.defMult.toFixed(2)}x` : "1.0x"
            }
            tierColour="var(--green)"
            levers={levers}
            result={result}
            onChange={onChange}
            note={
              levers.offers.deferred
                ? `0.5x on tokens, ${share(levers.harness)} harness at 1.0x.`
                : undefined
            }
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
        </div>

        <div className="mt-4">
          <MixBar mix={result.mix} />
          <p className="o-mono o-faint mt-2 text-[10px] leading-[1.5]">
            Shares auto-normalize to 100%.
          </p>
        </div>
      </Group>

      {/* ── Commitments ──────────────────────────────────────────────── */}
      <Group title="Commitments">
        <div className="o-offer">
          <label className="o-check">
            <input
              type="checkbox"
              checked={levers.offers.fsp}
              onChange={(event) =>
                onChange({
                  offers: { ...levers.offers, fsp: event.target.checked },
                })
              }
              style={{ ["--tick" as string]: "var(--fsp)" }}
            />
            <span className="flex flex-1 items-center gap-1.5">
              <span className="text-[12.5px] leading-tight">
                {OFFER_INFO.fsp.label}
              </span>
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
          />
          <p className="o-mono o-faint -mt-1 text-[10px] leading-[1.6]">
            Non-stacking — the GSU line takes{" "}
            <span
              style={{
                color:
                  result.gsu.appliedDiscount === "gcp"
                    ? "var(--teal)"
                    : result.gsu.appliedDiscount === "fsp"
                      ? "var(--fsp)"
                      : "var(--ink-faint)",
              }}
            >
              {result.gsu.appliedDiscount === "gcp"
                ? `GCP commit ${share(result.gsu.appliedDiscountRate)}`
                : result.gsu.appliedDiscount === "fsp"
                  ? `FSP ${share(result.gsu.appliedDiscountRate)}`
                  : "no discount"}
            </span>
            , not both.
          </p>
        </div>

        {/* GSU Q3 offer — the tier is earned, not chosen. */}
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
              <span className="text-[12.5px] leading-tight">
                {OFFER_INFO.q3.label}
              </span>
              <Tooltip text={OFFER_INFO.q3.tooltip} label={OFFER_INFO.q3.label} />
            </span>
          </label>

          {levers.offers.q3 ? (
            <div className="pb-1 pl-6">
              <div
                className="o-panel-2 px-3 py-2"
                style={{
                  borderColor: q3Tier ? "var(--teal)" : "var(--line)",
                }}
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
                        {gsusToNextTier.toLocaleString("en-US")} more GSUs reaches
                        the 2,000+ tier.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <>
                    <p className="o-mono text-[10.5px]" style={{ color: "var(--gold)" }}>
                      BELOW THRESHOLD
                    </p>
                    <p className="o-faint mt-1 text-[11px] leading-[1.5]">
                      {result.gsu.units.toFixed(0)} GSUs committed —{" "}
                      {gsusToNextTier?.toLocaleString("en-US")} more reaches the
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

              {result.gsu.credits > 0.005 ? (
                <p className="o-mono o-faint mt-2 text-[10px] leading-[1.5]">
                  {moneyK(result.gsu.credits, 1)}/mo credited back · effective $
                  {(result.gsu.effectiveUnitPrice * 1000).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  per GSU.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </Group>

      {/* ── Advanced ─────────────────────────────────────────────────── */}
      <div className="border-t px-4 py-1" style={{ borderColor: "var(--line)" }}>
        <details className="o-disclosure">
          <summary>
            <span className="o-eyebrow">Advanced</span>
          </summary>
          <div className="pb-3">
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
