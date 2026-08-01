"use client";

import Tooltip from "./Tooltip";
import type { ModelResult } from "@/lib/offers/model";
import { KPI_INFO } from "@/lib/offers/descriptions";
import {
  moneyK,
  moneyM,
  multiplier,
  percent,
  signedPercent,
} from "@/lib/offers/format";

interface Cell {
  key: keyof typeof KPI_INFO;
  value: string;
  sub: string;
  colour: string;
}

function cells(result: ModelResult): Cell[] {
  return [
    {
      key: "reference",
      value: moneyK(result.reference),
      sub: "at standard rates, nothing elected",
      colour: "var(--gold)",
    },
    {
      key: "final",
      value: moneyK(result.final),
      sub: `${percent(result.savingPct)} below incremental spend`,
      colour: "var(--green)",
    },
    {
      key: "saved",
      value: moneyM(result.annualSave),
      sub: `${moneyK(result.reference - result.final)} per month`,
      colour: "var(--green)",
    },
    {
      key: "commit",
      value: moneyK(result.commit.monthly),
      sub: `${moneyK(result.commit.total)} over ${result.commit.months} mo · ${result.gsu.units.toLocaleString("en-US")} GSUs`,
      colour: "var(--teal)",
    },
    {
      key: "blendedMultiplier",
      value: multiplier(result.blendedMultiplier),
      sub: "of Standard PayGo, all-in",
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
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
        {live.map((cell, index) => {
          const info = KPI_INFO[cell.key];
          return (
            <div
              key={cell.key}
              className="border-b border-r p-4 lg:p-5"
              style={{ borderColor: "var(--line)" }}
            >
              <p className="o-eyebrow flex items-center gap-1.5" style={{ color: "var(--ink-faint)" }}>
                {info.label}
                <Tooltip text={info.tooltip} label={info.label} />
              </p>
              <p
                className="o-mono o-animate-value mt-2.5 text-[clamp(1.05rem,0.85rem+0.9vw,1.5rem)] leading-none"
                style={{ color: cell.colour }}
              >
                {cell.value}
              </p>
              <p className="o-mono o-faint mt-2 text-[10.5px] leading-tight">
                {cell.sub}
              </p>
              <span className="o-sr-only">{index + 1} of {live.length}</span>
            </div>
          );
        })}
      </div>

      {compare ? <ComparisonRow a={compare} b={result} /> : null}
    </div>
  );
}

function ComparisonRow({ a, b }: { a: ModelResult; b: ModelResult }) {
  const deltas = [
    {
      label: "Incremental",
      text: moneyK(b.reference - a.reference),
      good: b.reference <= a.reference,
      neutral: Math.abs(b.reference - a.reference) < 0.5,
    },
    {
      label: "Monthly",
      text: moneyK(b.final - a.final),
      good: b.final <= a.final,
      neutral: Math.abs(b.final - a.final) < 0.5,
    },
    {
      label: "Commit",
      text: moneyK(b.commit.monthly - a.commit.monthly),
      good: b.commit.monthly <= a.commit.monthly,
      neutral: Math.abs(b.commit.monthly - a.commit.monthly) < 0.5,
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
