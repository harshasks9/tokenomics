"use client";

import type { Accent, ModelResult } from "@/lib/offers/model";
import { moneyK, percent } from "@/lib/offers/format";

const ACCENT_VAR: Record<Accent, string> = {
  gold: "var(--gold)",
  blue: "var(--blue)",
  green: "var(--green)",
  fsp: "var(--fsp)",
  teal: "var(--teal)",
};

/**
 * The arithmetic behind every bar, with the live values substituted. Not
 * algebra — the working, so anyone challenged on a number can show where it
 * came from without leaving the page.
 */
export default function MathTrace({ result }: { result: ModelResult }) {
  return (
    <div>
      <ol className="space-y-4">
        {result.steps.map((step, index) => (
          <li
            key={step.id}
            className="border-t pt-3.5 first:border-t-0 first:pt-0"
            style={{ borderColor: "var(--line)" }}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-[13px]" style={{ color: "var(--ink)" }}>
                <span
                  className="o-mono o-faint mr-2 text-[10px]"
                  aria-hidden="true"
                >
                  {index === 0 ? "—" : String(index).padStart(2, "0")}
                </span>
                <span
                  className="o-marker mr-1.5"
                  style={{
                    color: step.elected
                      ? ACCENT_VAR[step.accent]
                      : "var(--ink-faint)",
                  }}
                  aria-hidden="true"
                >
                  {step.elected ? "●" : "○"}
                </span>
                {step.label}
              </p>
              {index > 0 ? (
                <p
                  className="o-mono text-[11px]"
                  style={{
                    color:
                      step.delta < -0.05
                        ? "var(--green)"
                        : step.delta > 0.05
                          ? "var(--red)"
                          : "var(--ink-faint)",
                  }}
                >
                  {percent(step.cumulativeSavingPct)} cumulative
                </p>
              ) : null}
            </div>

            <table className="o-table mt-2.5" style={{ tableLayout: "auto" }}>
              <caption className="o-sr-only">
                Arithmetic for {step.label}
              </caption>
              <tbody>
                {step.working.map((line, lineIndex) => (
                  <tr
                    key={`${step.id}-${lineIndex}`}
                    style={
                      line.total
                        ? { background: "var(--panel-2)" }
                        : undefined
                    }
                  >
                    <td
                      className="py-2 text-[12px] leading-[1.45]"
                      style={{
                        color: line.total ? "var(--ink)" : "var(--ink-dim)",
                        border: "none",
                        width: "34%",
                      }}
                    >
                      {line.label}
                    </td>
                    <td
                      className="o-mono py-2 text-[11.5px] leading-[1.45]"
                      style={{
                        color: "var(--ink-faint)",
                        border: "none",
                      }}
                    >
                      {line.expression}
                    </td>
                    <td
                      className="o-num py-2 text-[12px]"
                      style={{
                        color: line.total
                          ? "var(--ink)"
                          : line.value < -0.005
                            ? "var(--green)"
                            : line.value > 0.005
                              ? "var(--ink-dim)"
                              : "var(--ink-faint)",
                        border: "none",
                        width: 110,
                      }}
                    >
                      {Math.abs(line.value) < 0.005 && !line.total
                        ? "—"
                        : `${line.value < 0 ? "−" : ""}${moneyK(Math.abs(line.value), 2)}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </li>
        ))}
      </ol>

      <div
        className="mt-5 border-t pt-4"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="o-mono text-[12px]" style={{ color: "var(--ink)" }}>
            {moneyK(result.reference, 2)} − {moneyK(result.attribution.total, 2)}{" "}
            = {moneyK(result.final, 2)}
          </p>
          <p className="o-mono text-[12px]" style={{ color: "var(--green)" }}>
            {percent(result.savingPct)} of the incremental spend
          </p>
        </div>
        <p className="o-mono o-faint mt-2 text-[10px] leading-[1.6]">
          Every figure is $K per month. Rates are anchored to the commercial
          decks; GSU pricing, the Q3 tiers and tokens-per-GSU are stated
          assumptions — see the caveats below.
        </p>
      </div>
    </div>
  );
}
