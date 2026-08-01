"use client";

import type { WorkloadMix } from "@/lib/offers/model";
import { share } from "@/lib/offers/format";

/**
 * Tiers vary by tint, not opacity. Fading a segment toward the dark panel also
 * fades the label sitting on it — the 0.68 green landed at 4.27:1, under AA.
 * Solid lighter tints keep every label above 7:1 and read more clearly besides.
 */
export const MIX_SEGMENTS = [
  { key: "pt", label: "On Provisioned Throughput", short: "PT", colour: "var(--blue)", tier: "1.0x" },
  { key: "spike", label: "Spike traffic", short: "Spike", colour: "#8CC4EA", tier: "1.0x" },
  { key: "offPeak", label: "Off-peak", short: "Off-pk", colour: "var(--green)", tier: "0.5x" },
  { key: "deferred", label: "Deferred agents", short: "Def", colour: "#6FD1A3", tier: "0.5x*" },
  { key: "batch", label: "Batch", short: "Batch", colour: "#93DEBC", tier: "0.5x" },
] as const satisfies ReadonlyArray<{
  key: keyof WorkloadMix;
  label: string;
  short: string;
  colour: string;
  tier: string;
}>;

export default function MixBar({ mix }: { mix: WorkloadMix }) {
  return (
    <div>
      <div
        className="flex h-[26px] w-full overflow-hidden"
        style={{ border: "1px solid var(--line)" }}
        role="img"
        aria-label={`Normalized workload mix: ${MIX_SEGMENTS.map(
          (segment) => `${segment.label} ${share(mix[segment.key])}`,
        ).join(", ")}.`}
      >
        {MIX_SEGMENTS.map((segment) => {
          const value = mix[segment.key];
          if (value <= 0) return null;
          return (
            <div
              key={segment.key}
              className="flex items-center justify-center overflow-hidden"
              style={{
                width: `${value * 100}%`,
                background: segment.colour,
                transition: "width var(--dur) var(--ease)",
              }}
              title={`${segment.label} — ${share(value)} at ${segment.tier}`}
            >
              {value > 0.09 ? (
                <span
                  className="o-mono text-[9.5px]"
                  style={{ color: "var(--canvas)" }}
                >
                  {share(value)}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {MIX_SEGMENTS.map((segment) => (
          <span
            key={segment.key}
            className="o-mono o-faint flex items-center gap-1.5 text-[9.5px]"
          >
            <span
              aria-hidden="true"
              style={{
                width: 7,
                height: 7,
                background: segment.colour,
                display: "inline-block",
              }}
            />
            {segment.short}
          </span>
        ))}
      </div>
    </div>
  );
}
