"use client";

import MixBar from "./MixBar";
import Slider from "./Slider";
import {
  GSU_TERM_LABEL,
  GSU_TERM_PRICE,
  type GsuTerm,
  LEVER_RANGES,
  type Levers as LeverState,
  type ModelResult,
  type WorkloadMix,
} from "@/lib/offers/model";
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
        {hint ? (
          <span className="o-mono o-faint text-[10px]">{hint}</span>
        ) : null}
      </div>
      <div className="mt-2.5 space-y-2">{children}</div>
    </section>
  );
}

const MIX_LEVERS: ReadonlyArray<{ key: keyof WorkloadMix; label: string }> = [
  { key: "wb", label: "Baseload → Provisioned Throughput" },
  { key: "ws", label: "Spike → protected PayGo (1.0x)" },
  { key: "wo", label: "Off-peak eligible (0.5x)" },
  { key: "wd", label: "Deferred agents (0.5x tokens)" },
  { key: "wbt", label: "Batch (0.5x)" },
];

const FSP_SEGMENTS: ReadonlyArray<{ value: number; label: string }> = [
  { value: 0, label: "None" },
  { value: 0.1, label: "1Y −10%" },
  { value: 0.2, label: "3Y −20%" },
];

const TERMS: readonly GsuTerm[] = ["1m", "3m", "1y"];

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
  const setMix = (key: keyof WorkloadMix, value: number) =>
    onChange({ mix: { ...levers.mix, [key]: value } });

  const mixTotal = MIX_LEVERS.reduce(
    (sum, lever) => sum + levers.mix[lever.key],
    0,
  );

  return (
    <div>
      <Group title="Scale">
        <Slider
          label="Legacy peak-sized GSUs (N₀)"
          readout={levers.n0.toLocaleString("en-US")}
          value={levers.n0}
          min={LEVER_RANGES.n0.min}
          max={LEVER_RANGES.n0.max}
          step={LEVER_RANGES.n0.step}
          onChange={(value) => onChange({ n0: value })}
          accent="var(--gold)"
          caption={`Legacy run-rate ${moneyK(result.c0)}/mo at list.`}
          ariaValueText={`${levers.n0} GSUs, ${moneyK(result.c0)} per month`}
        />
      </Group>

      <Group title="Utilization">
        <Slider
          label="Legacy utilization (u₀)"
          readout={share(levers.u0)}
          value={levers.u0}
          min={LEVER_RANGES.u0.min}
          max={LEVER_RANGES.u0.max}
          step={LEVER_RANGES.u0.step}
          onChange={(value) => onChange({ u0: value })}
          accent="var(--gold)"
        />
        <Slider
          label="Right-sized PT utilization (u₁)"
          readout={share(levers.u1)}
          value={levers.u1}
          min={LEVER_RANGES.u1.min}
          max={LEVER_RANGES.u1.max}
          step={LEVER_RANGES.u1.step}
          onChange={(value) => onChange({ u1: value })}
          accent="var(--blue)"
          caption="p50 coverage + protected PayGo for the spikes."
        />
        {levers.u1 <= levers.u0 ? (
          <p
            className="o-mono text-[10px] leading-[1.5]"
            style={{ color: "var(--red)" }}
          >
            u₁ ≤ u₀ — right-sizing costs more than it saves here.
          </p>
        ) : null}
      </Group>

      <Group title="Workload mix" hint={`Σ ${Math.round(mixTotal * 100)}`}>
        {MIX_LEVERS.map((lever) => (
          <Slider
            key={lever.key}
            label={lever.label}
            readout={share(result.mix[lever.key])}
            value={levers.mix[lever.key]}
            min={LEVER_RANGES.mixShare.min}
            max={LEVER_RANGES.mixShare.max}
            step={LEVER_RANGES.mixShare.step}
            onChange={(value) => setMix(lever.key, value)}
            accent="var(--green)"
            ariaValueText={`${lever.label}: raw ${Math.round(
              levers.mix[lever.key] * 100,
            )}, normalized ${share(result.mix[lever.key])}`}
          />
        ))}

        <div className="pt-2">
          <MixBar mix={result.mix} />
          <p className="o-mono o-faint mt-2 text-[10px] leading-[1.5]">
            Shares auto-normalize: wᵢ ← wᵢ / Σw. Raw Σ ={" "}
            {Math.round(mixTotal * 100)} → normalized to 100%.
          </p>
        </div>
      </Group>

      <Group title="Deferred honesty term">
        <Slider
          label="Harness fee share within Deferred (h)"
          readout={share(levers.h)}
          value={levers.h}
          min={LEVER_RANGES.h.min}
          max={LEVER_RANGES.h.max}
          step={LEVER_RANGES.h.step}
          onChange={(value) => onChange({ h: value })}
          accent="var(--gold)"
          caption={`Harness fees billed at 1.0x → effective ${result.defMult.toFixed(3)}x on Deferred.`}
        />
      </Group>

      <Group title="FSP commitment">
        <div className="o-seg" role="group" aria-label="FSP commitment term">
          {FSP_SEGMENTS.map((segment) => (
            <button
              key={segment.value}
              type="button"
              aria-pressed={levers.d === segment.value}
              onClick={() => onChange({ d: segment.value })}
              style={{ ["--seg-active" as string]: "var(--fsp)" }}
            >
              {segment.label}
            </button>
          ))}
        </div>
        <p className="o-mono o-faint text-[10px] leading-[1.5]">
          <span className="o-marker o-marker-anchored" aria-hidden="true">
            ●
          </span>{" "}
          Monthly enforcement, post-pay, dollar-fungible across Vertex AI 1P
          including PT.
        </p>
      </Group>

      <Group
        title="GSU commitment"
        hint={`${moneyK(result.gsu.atList)} base`}
      >
        <div>
          <p className="mb-2 text-[12.5px] leading-tight">
            <span className="o-marker o-marker-modelled mr-1.5" aria-hidden="true">
              ○
            </span>
            GSU term
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
            ${(GSU_TERM_PRICE[levers.term] * 1000).toLocaleString("en-US")} per
            GSU per month · {result.gsu.units.toFixed(0)} GSUs committed.
          </p>
        </div>

        <Slider
          label="GCP commit discount"
          readout={share(levers.gcp)}
          value={levers.gcp}
          min={LEVER_RANGES.gcp.min}
          max={LEVER_RANGES.gcp.max}
          step={LEVER_RANGES.gcp.step}
          onChange={(value) => onChange({ gcp: value })}
          accent="var(--teal)"
          caption="Applies to GSU pricing."
        />

        <div
          className="o-panel-2 px-3 py-2"
          style={{ borderColor: "var(--line)" }}
        >
          <p className="o-mono text-[10px] leading-[1.6]" style={{ color: "var(--ink-dim)" }}>
            <span className="o-marker o-marker-anchored" aria-hidden="true">
              ●
            </span>{" "}
            NON-STACKING — the GSU line takes{" "}
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
            , not both. On-demand rate is the ceiling.
          </p>
        </div>
      </Group>

      <Group title="GSU Q3 offer" hint="Custom incentives">
        <Slider
          label="Incremental discount"
          readout={share(levers.inc)}
          value={levers.inc}
          min={LEVER_RANGES.inc.min}
          max={LEVER_RANGES.inc.max}
          step={LEVER_RANGES.inc.step}
          onChange={(value) => onChange({ inc: value })}
          accent="var(--teal)"
        />
        <Slider
          label="Credits"
          readout={share(levers.cr)}
          value={levers.cr}
          min={LEVER_RANGES.cr.min}
          max={LEVER_RANGES.cr.max}
          step={LEVER_RANGES.cr.step}
          onChange={(value) => onChange({ cr: value })}
          accent="var(--teal)"
          caption={
            result.gsu.credits > 0.005
              ? `${moneyK(result.gsu.credits, 1)}/mo credited back.`
              : "Applied against GSU spend, not the whole bill."
          }
        />
        <p className="o-mono o-faint text-[10px] leading-[1.5]">
          Effective GSU rate $
          {(result.gsu.effectiveUnitPrice * 1000).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}{" "}
          / GSU / mo after term, commit and Q3 incentives.
        </p>
      </Group>

      <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)" }}>
        <button type="button" className="o-btn w-full" onClick={onReset}>
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
