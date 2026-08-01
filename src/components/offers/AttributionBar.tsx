"use client";

import type { ModelResult } from "@/lib/offers/model";
import { moneyK, percent } from "@/lib/offers/format";

export default function AttributionBar({ result }: { result: ModelResult }) {
  const { attribution } = result;

  const parts = [
    {
      key: "rightSizing",
      label: "Right-sizing",
      value: attribution.rightSizing,
      colour: "var(--blue)",
      opacity: 1,
    },
    {
      key: "placement",
      label: "Placement (0.5x tiers)",
      value: attribution.placement,
      colour: "var(--green)",
      opacity: 1,
    },
    {
      key: "fsp",
      label: "FSP commitment",
      value: attribution.fsp,
      colour: "var(--fsp)",
      opacity: 1,
    },
    {
      key: "gsu",
      label: "GSU term + commit",
      value: attribution.gsuCommit,
      colour: "var(--teal)",
      opacity: 1,
    },
    {
      key: "q3",
      label: "GSU Q3 offer",
      value: attribution.q3,
      colour: "#7FD3DC",
      opacity: 1,
    },
  ].filter((part) => part.value > 0.01);

  const total = parts.reduce((sum, part) => sum + part.value, 0);
  const negative = attribution.rightSizing < -0.01;

  return (
    <section className="o-panel p-5" aria-labelledby="attribution-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="attribution-heading" className="o-eyebrow">
          Where the saving comes from
        </h2>
        <p className="o-mono o-faint text-[10.5px]">
          {moneyK(attribution.total)}/mo total
        </p>
      </div>

      {total > 0 ? (
        <>
          <div
            className="mt-4 flex h-[30px] w-full overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
            role="img"
            aria-label={`Saving attribution: ${parts
              .map((part) => `${part.label} ${percent(part.value / total, 0)}`)
              .join(", ")}.`}
          >
            {parts.map((part) => (
              <div
                key={part.key}
                className="flex items-center justify-center"
                style={{
                  width: `${(part.value / total) * 100}%`,
                  background: part.colour,
                  opacity: part.opacity,
                  transition: "width var(--dur) var(--ease)",
                }}
              >
                {part.value / total > 0.1 ? (
                  <span
                    className="o-mono text-[10px]"
                    style={{ color: "var(--canvas)" }}
                  >
                    {percent(part.value / total, 0)}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
            {parts.map((part) => (
              <span
                key={part.key}
                className="o-mono flex items-center gap-2 text-[10.5px]"
                style={{ color: "var(--ink-dim)" }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    background: part.colour,
                    opacity: part.opacity,
                    display: "inline-block",
                  }}
                />
                {part.label}
                <span className="o-faint">
                  {percent(part.value / total, 0)} · {moneyK(part.value)}
                </span>
              </span>
            ))}
          </div>
        </>
      ) : (
        <p className="o-dim mt-4 text-[13px]">
          No saving to attribute at these settings.
        </p>
      )}

      {negative ? (
        <p
          className="o-mono mt-4 text-[10.5px] leading-[1.6]"
          style={{ color: "var(--red)" }}
        >
          Right-sized utilization is at or below the peak-sized figure, so the
          PT step costs more than it saves. Right-sizing is excluded from the
          bar above.
        </p>
      ) : null}

      <p className="o-mono o-faint mt-4 text-[10.5px]">
        Discounts are the cherry. Placement is the cake.
      </p>
    </section>
  );
}
