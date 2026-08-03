"use client";

import Tooltip from "./Tooltip";
import type { ModelResult } from "@/lib/offers/model";
import { inUnit, moneyK, percent, pickUnit } from "@/lib/offers/format";

/**
 * The opening question. Everything downstream is a refinement of this one
 * number, so it leads: what does the new workload cost, and how does that
 * estimate divide between the PT order and everything else.
 */
export default function SpendEstimate({ result }: { result: ModelResult }) {
  const { traffic } = result;
  const tpmUnit = pickUnit(traffic.totalTpm);

  const parts = [
    {
      key: "pt",
      label: "The PT order",
      value: result.ptReference,
      share: traffic.ptShareOfSpend,
      colour: "var(--blue)",
      detail: `${traffic.ptGsus.toLocaleString("en-US")} GSUs reserved · ${inUnit(traffic.ptCapacityTpm, tpmUnit)} TPM`,
      tooltip:
        "Provisioned Throughput bills on the capacity ordered, not on what gets used — so this half of the estimate is fixed the moment the order is signed.",
    },
    {
      key: "paygo",
      label: "The rest — PayGo",
      value: result.paygoReference,
      share: traffic.paygoShareOfSpend,
      colour: "var(--green)",
      detail: `${Math.round(traffic.paygoGsus).toLocaleString("en-US")} GSU-equiv · ${inUnit(traffic.paygoTpm, tpmUnit)} TPM`,
      tooltip:
        "Everything not covered by the reserved capacity, billed per tier as it is consumed. Spikes sit on Priority PayGo at 1.8x until Buy One PT Get One PayGo is elected.",
    },
  ];

  return (
    <section className="o-panel p-5 sm:p-6" aria-labelledby="estimate-heading">
      <p className="o-eyebrow">Step one</p>

      <h2 id="estimate-heading" className="o-h2 mt-2.5">
        How much is the incremental spend?
      </h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div>
          <p
            className="o-mono o-animate-value text-[clamp(2rem,1.4rem+2.6vw,3.1rem)] leading-none"
            style={{ color: "var(--gold)" }}
          >
            {moneyK(result.reference)}
          </p>
          <p className="o-mono o-faint mt-2.5 text-[10.5px] leading-[1.6]">
            per month, at standard rates with nothing elected
            <br />
            {inUnit(traffic.totalTpm, tpmUnit)} TPM across{" "}
            {traffic.totalConsumed.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            GSU-equivalents delivered
          </p>
        </div>

        {/* The split of that estimate */}
        <div>
          <div
            className="flex h-[34px] w-full overflow-hidden"
            style={{ border: "1px solid var(--line)" }}
            role="img"
            aria-label={`Split of the estimate: ${parts
              .map((p) => `${p.label} ${percent(p.share, 0)}`)
              .join(", ")}.`}
          >
            {parts.map((part) =>
              part.share > 0 ? (
                <div
                  key={part.key}
                  className="flex items-center justify-center"
                  style={{
                    width: `${part.share * 100}%`,
                    background: part.colour,
                    transition: "width var(--dur) var(--ease)",
                  }}
                >
                  {part.share > 0.12 ? (
                    <span
                      className="o-mono text-[11px]"
                      style={{ color: "var(--canvas)" }}
                    >
                      {percent(part.share, 0)}
                    </span>
                  ) : null}
                </div>
              ) : null,
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {parts.map((part) => (
              <div key={part.key}>
                <p className="flex items-center gap-2 text-[12.5px]">
                  <span
                    aria-hidden="true"
                    style={{
                      width: 9,
                      height: 9,
                      background: part.colour,
                      display: "inline-block",
                    }}
                  />
                  {part.label}
                  <Tooltip text={part.tooltip} label={part.label} />
                </p>
                <p
                  className="o-mono mt-1.5 pl-[17px] text-[17px] leading-none"
                  style={{ color: part.colour }}
                >
                  {moneyK(part.value)}
                </p>
                <p className="o-mono o-faint mt-1.5 pl-[17px] text-[10px] leading-[1.5]">
                  {part.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
