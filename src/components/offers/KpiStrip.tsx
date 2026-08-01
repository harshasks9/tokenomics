"use client";

import type { ModelResult } from "@/lib/offers/model";
import {
  moneyK,
  moneyM,
  multiplier,
  percent,
  signedPercent,
} from "@/lib/offers/format";

interface Cell {
  eyebrow: string;
  value: string;
  sub: string;
  colour: string;
}

function cells(result: ModelResult): Cell[] {
  return [
    {
      eyebrow: "Legacy monthly",
      value: moneyK(result.c0),
      sub: `${result.v.toLocaleString("en-US", { maximumFractionDigits: 0 })} GSU-equiv consumed`,
      colour: "var(--gold)",
    },
    {
      eyebrow: "Portfolio monthly",
      // Two decimals: this is the number people read aloud off the screen.
      value: moneyK(result.final, 2),
      sub: `${percent(result.savingPct)} below legacy`,
      colour: "var(--green)",
    },
    {
      eyebrow: "Annualized saving",
      value: moneyM(result.annualSave),
      sub: `${moneyK(result.c0 - result.final)} per month`,
      colour: "var(--green)",
    },
    {
      eyebrow: "Blended multiplier",
      value: multiplier(result.blendedMultiplier),
      sub: `vs ${multiplier(result.legacyMultiplier)} legacy effective`,
      colour: "var(--blue)",
    },
  ];
}

export default function KpiStrip({
  result,
  compare,
}: {
  result: ModelResult;
  compare?: ModelResult | null;
}) {
  const live = cells(result);

  return (
    <div className="o-panel">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {live.map((cell, index) => (
          <div
            key={cell.eyebrow}
            className="border-b p-4 lg:border-b-0 lg:p-5"
            style={{
              borderColor: "var(--line)",
              borderRightWidth: index % 2 === 0 ? 1 : 0,
              borderRightStyle: "solid",
              borderBottomWidth: index < 2 ? 1 : 0,
            }}
          >
            <p className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
              {cell.eyebrow}
            </p>
            <p
              className="o-mono o-animate-value mt-2.5 text-[clamp(1.15rem,0.9rem+1vw,1.65rem)] leading-none"
              style={{ color: cell.colour }}
            >
              {cell.value}
            </p>
            <p className="o-mono o-faint mt-2 text-[10.5px] leading-tight">
              {cell.sub}
            </p>
          </div>
        ))}
      </div>

      {compare ? (
        <ComparisonRow a={compare} b={result} />
      ) : null}
    </div>
  );
}

function ComparisonRow({ a, b }: { a: ModelResult; b: ModelResult }) {
  const deltas = [
    {
      label: "Legacy",
      text: moneyK(b.c0 - a.c0),
      good: b.c0 <= a.c0,
      neutral: Math.abs(b.c0 - a.c0) < 0.5,
    },
    {
      label: "Monthly",
      text: moneyK(b.final - a.final),
      good: b.final <= a.final,
      neutral: Math.abs(b.final - a.final) < 0.5,
    },
    {
      label: "Annual",
      text: moneyM(b.annualSave - a.annualSave),
      good: b.annualSave >= a.annualSave,
      neutral: Math.abs(b.annualSave - a.annualSave) < 5,
    },
    {
      label: "Saving",
      text: signedPercent(b.savingPct - a.savingPct),
      good: b.savingPct >= a.savingPct,
      neutral: Math.abs(b.savingPct - a.savingPct) < 0.0005,
    },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t px-4 py-3 lg:px-5"
      style={{ borderColor: "var(--line)", background: "var(--panel-2)" }}
    >
      <span className="o-eyebrow" style={{ color: "var(--ink-faint)" }}>
        A → B
      </span>
      {deltas.map((delta) => (
        <span key={delta.label} className="o-mono text-[11px]">
          <span className="o-faint">{delta.label} </span>
          <span
            style={{
              color: delta.neutral
                ? "var(--ink-dim)"
                : delta.good
                  ? "var(--green)"
                  : "var(--red)",
            }}
          >
            {delta.neutral ? "no change" : delta.text}
          </span>
        </span>
      ))}
    </div>
  );
}
