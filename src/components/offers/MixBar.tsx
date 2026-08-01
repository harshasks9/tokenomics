"use client";

import type { WorkloadMix } from "@/lib/offers/model";
import { share } from "@/lib/offers/format";

export const MIX_SEGMENTS = [
  { key: "wb", label: "Baseload → PT", short: "PT", colour: "var(--blue)", opacity: 1, tier: "1.0x" },
  { key: "ws", label: "Spike → protected PayGo", short: "Spike", colour: "var(--blue)", opacity: 0.5, tier: "1.0x" },
  { key: "wo", label: "Off-peak", short: "Off-pk", colour: "var(--green)", opacity: 1, tier: "0.5x" },
  { key: "wd", label: "Deferred agents", short: "Def", colour: "var(--green)", opacity: 0.68, tier: "0.5x*" },
  { key: "wbt", label: "Batch", short: "Batch", colour: "var(--green)", opacity: 0.4, tier: "0.5x" },
] as const satisfies ReadonlyArray<{
  key: keyof WorkloadMix;
  label: string;
  short: string;
  colour: string;
  opacity: number;
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
                opacity: segment.opacity,
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
                opacity: segment.opacity,
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
