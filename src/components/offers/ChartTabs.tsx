"use client";

export type ChartTab = "chart" | "math";

const TABS: ReadonlyArray<[ChartTab, string]> = [
  ["chart", "Chart"],
  ["math", "Show me the math"],
];

/**
 * Chart / show-me-the-math switch. Shared by both modes so the arithmetic is
 * one click away wherever the waterfall is — and so the two never drift into
 * different affordances for the same thing.
 *
 * `idPrefix` keeps the ARIA wiring unique when more than one panel is mounted.
 */
export default function ChartTabs({
  value,
  onChange,
  idPrefix = "waterfall",
}: {
  value: ChartTab;
  onChange: (next: ChartTab) => void;
  idPrefix?: string;
}) {
  return (
    <div
      className="mt-3 flex gap-0 border-b"
      style={{ borderColor: "var(--line)" }}
      role="tablist"
      aria-label="Waterfall view"
    >
      {TABS.map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${id}`}
          aria-selected={value === id}
          aria-controls={`${idPrefix}-panel-${id}`}
          onClick={() => onChange(id)}
          className="o-mono text-[11px] tracking-[0.08em] uppercase"
          style={{
            background: "none",
            border: "none",
            borderBottom: `2px solid ${value === id ? "var(--gold)" : "transparent"}`,
            color: value === id ? "var(--ink)" : "var(--ink-faint)",
            padding: "9px 14px 8px",
            marginBottom: -1,
            cursor: "pointer",
            minHeight: 40,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
