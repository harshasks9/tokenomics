"use client";

import Tooltip from "./Tooltip";
import {
  COMPETE_CAVEAT,
  MODEL_PRICES,
  type ModelPrice,
  VENDOR_COLOUR,
  blendedPerMtok,
  effectivePerTask,
} from "@/lib/offers/models";

const SOURCE_LABEL: Record<ModelPrice["source"], string> = {
  deck: "deck",
  derived: "derived",
  unverified: "no price",
};

const SOURCE_COLOUR: Record<ModelPrice["source"], string> = {
  deck: "var(--green)",
  derived: "var(--gold)",
  unverified: "var(--red)",
};

function Bars({
  title,
  subtitle,
  values,
  unit,
}: {
  title: string;
  subtitle: string;
  values: Array<{ model: ModelPrice; value: number | null }>;
  unit: string;
}) {
  const max = Math.max(
    ...values.map((v) => v.value ?? 0),
    0.0001,
  );

  return (
    <div>
      <h3 className="o-h3">{title}</h3>
      <p className="o-faint mt-1 text-[11.5px] leading-[1.5]">{subtitle}</p>

      <div className="mt-4 space-y-2.5">
        {values.map(({ model, value }) => (
          <div key={model.id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[12px]">
                <span className="o-mono o-faint mr-2 text-[10px]">
                  {model.vendor}
                </span>
                {model.name}
              </span>
              <span
                className="o-mono shrink-0 text-[11.5px]"
                style={{
                  color: value === null ? "var(--ink-faint)" : VENDOR_COLOUR[model.vendor],
                }}
              >
                {value === null ? "—" : `${unit}${value.toFixed(2)}`}
              </span>
            </div>
            <div
              className="mt-1 h-[10px] w-full"
              style={{ background: "var(--canvas)", border: "1px solid var(--line)" }}
            >
              {value !== null ? (
                <div
                  style={{
                    width: `${Math.max((value / max) * 100, 1)}%`,
                    height: "100%",
                    background: VENDOR_COLOUR[model.vendor],
                    opacity: model.source === "deck" ? 1 : 0.55,
                    transition: "width var(--dur) var(--ease)",
                  }}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Compete() {
  const priced = MODEL_PRICES.filter((m) => m.inputPerMtok !== null);
  const unpriced = MODEL_PRICES.filter((m) => m.inputPerMtok === null);

  return (
    <section className="o-panel p-4 sm:p-5" aria-labelledby="compete-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="compete-heading" className="o-eyebrow flex items-center gap-1.5">
          Model pricing · published list
          <Tooltip
            label="this comparison"
            text="Published list prices per million tokens, and what they become once you account for how many tokens each model actually burns on the same task."
          />
        </h2>
      </div>

      <div className="mt-4 grid gap-7 lg:grid-cols-2">
        <Bars
          title="Blended list price"
          subtitle="Per million tokens at a 25% output mix. What procurement compares."
          unit="$"
          values={MODEL_PRICES.map((model) => ({
            model,
            value: blendedPerMtok(model),
          }))}
        />

        <Bars
          title="Effective cost for the same task"
          subtitle="Blended price × tokens actually consumed. The decks are emphatic: sell cost-per-task, not cost-per-token."
          unit="$"
          values={MODEL_PRICES.map((model) => ({
            model,
            value: effectivePerTask(model),
          }))}
        />
      </div>

      {/* Provenance — the important part */}
      <div className="mt-6 overflow-x-auto">
        <table className="o-table" style={{ minWidth: 560 }}>
          <caption className="o-sr-only">
            Source of each price, and the token-efficiency assumption behind the
            effective-cost figures.
          </caption>
          <thead>
            <tr>
              <th scope="col">Model</th>
              <th scope="col" className="o-num" style={{ textAlign: "right" }}>
                In / Out $ per Mtok
              </th>
              <th scope="col" style={{ width: 90 }}>
                Source
              </th>
              <th scope="col">Provenance</th>
            </tr>
          </thead>
          <tbody>
            {[...priced, ...unpriced].map((model) => (
              <tr key={model.id}>
                <td style={{ color: "var(--ink)" }}>
                  <span
                    className="o-marker mr-1.5"
                    style={{ color: VENDOR_COLOUR[model.vendor] }}
                    aria-hidden="true"
                  >
                    ●
                  </span>
                  {model.name}
                </td>
                <td className="o-num">
                  {model.inputPerMtok === null
                    ? "—"
                    : `${model.inputPerMtok.toFixed(2)} / ${model.outputPerMtok?.toFixed(2)}`}
                </td>
                <td>
                  <span
                    className="o-badge"
                    style={{ color: SOURCE_COLOUR[model.source] }}
                  >
                    {SOURCE_LABEL[model.source]}
                  </span>
                </td>
                <td className="text-[11.5px] leading-[1.5]">
                  {model.provenance}
                  {model.tokenNote ? (
                    <span className="o-faint"> {model.tokenNote}</span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        className="o-mono mt-4 text-[10px] leading-[1.7]"
        style={{ color: "var(--gold)" }}
      >
        {COMPETE_CAVEAT}
      </p>
    </section>
  );
}
