"use client";

import type { Accent, ModelResult } from "@/lib/offers/model";
import { deltaK, moneyK, percent } from "@/lib/offers/format";

const ACCENT_VAR: Record<Accent, string> = {
  gold: "var(--gold)",
  blue: "var(--blue)",
  green: "var(--green)",
  fsp: "var(--fsp)",
  teal: "var(--teal)",
};

export default function StepTable({ result }: { result: ModelResult }) {
  const last = result.steps.length - 1;

  return (
    <>
      {/* Narrow screens: stacked cards, so the money never scrolls off. */}
      <ol className="o-panel divide-y md:hidden" style={{ borderColor: "var(--line)" }}>
        {result.steps.map((step, index) => (
          <li
            key={step.id}
            className="p-4"
            style={{
              borderColor: "var(--line)",
              borderTopWidth: index === 0 ? 0 : 1,
              background: index === last ? "var(--panel-2)" : undefined,
            }}
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-[13px]" style={{ color: "var(--ink)" }}>
                <span
                  className="o-marker mr-1.5"
                  style={{
                    color: step.elected
                      ? ACCENT_VAR[step.accent]
                      : "var(--ink-faint)",
                  }}
                  aria-hidden="true"
                >
                  {step.elected ? "\u25CF" : "\u25CB"}
                </span>
                {step.label}
              </p>
              <p className="o-mono shrink-0 text-[13px]" style={{ color: "var(--ink)" }}>
                {moneyK(step.value, 2)}
              </p>
            </div>

            {index > 0 ? (
              <div className="o-mono mt-1.5 flex gap-4 text-[11px]">
                <span
                  style={{
                    color:
                      step.delta < -0.05
                        ? "var(--green)"
                        : step.delta > 0.05
                          ? "var(--red)"
                          : "var(--ink-faint)",
                  }}
                >
                  {deltaK(step.delta)}
                </span>
                <span
                  style={{
                    color:
                      step.cumulativeSavingPct < 0
                        ? "var(--red)"
                        : "var(--ink-dim)",
                  }}
                >
                  {percent(step.cumulativeSavingPct)} cumulative
                </span>
              </div>
            ) : null}

            <p className="o-faint mt-2 text-[12px] leading-[1.55]">
              {step.mechanic}
            </p>
          </li>
        ))}
      </ol>

      <div className="o-panel hidden overflow-x-auto md:block">
      <table className="o-table" style={{ minWidth: 640 }}>
        <caption className="o-sr-only">
          Step-by-step monthly cost, the change each lever contributes, and the
          cumulative saving against the legacy estate.
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ width: 34 }}>
              #
            </th>
            <th scope="col" style={{ width: 168 }}>
              Lever
            </th>
            <th scope="col">Mechanic</th>
            <th scope="col" className="o-num" style={{ width: 110, textAlign: "right" }}>
              Monthly $K
            </th>
            <th scope="col" className="o-num" style={{ width: 100, textAlign: "right" }}>
              Δ $K
            </th>
            <th scope="col" className="o-num" style={{ width: 106, textAlign: "right" }}>
              Cum. saving
            </th>
          </tr>
        </thead>
        <tbody>
          {result.steps.map((step, index) => (
            <tr key={step.id} className={index === last ? "is-final" : undefined}>
              <td className="o-mono o-faint">{index === 0 ? "—" : index}</td>
              <td style={{ color: "var(--ink)" }}>
                <span
                  className="o-marker mr-1.5"
                  style={{
                    color: step.elected
                      ? ACCENT_VAR[step.accent]
                      : "var(--ink-faint)",
                  }}
                  aria-hidden="true"
                >
                  {step.elected ? "\u25CF" : "\u25CB"}
                </span>
                {step.label}
                {index > 0 && !step.elected && step.id !== "gsu" ? (
                  <span className="o-mono o-faint ml-2 whitespace-nowrap text-[10px]">
                    not elected
                  </span>
                ) : null}
              </td>
              <td className="text-[12.5px] leading-[1.5]">{step.mechanic}</td>
              <td className="o-num" style={{ color: "var(--ink)" }}>
                {moneyK(step.value, 2)}
              </td>
              <td
                className="o-num"
                style={{
                  color:
                    step.delta < -0.05
                      ? "var(--green)"
                      : step.delta > 0.05
                        ? "var(--red)"
                        : "var(--ink-faint)",
                }}
              >
                {index === 0 ? "—" : deltaK(step.delta)}
              </td>
              <td
                className="o-num"
                style={{
                  color:
                    step.cumulativeSavingPct < 0
                      ? "var(--red)"
                      : index === last
                        ? "var(--green)"
                        : "var(--ink-dim)",
                }}
              >
                {index === 0 ? "—" : percent(step.cumulativeSavingPct)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
