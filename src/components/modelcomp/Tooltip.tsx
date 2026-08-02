"use client";

import { useCallback, useState } from "react";
import { LAB_COLORS, type Lab } from "@/lib/modelcomp/data";
import { formatLongDate } from "@/lib/modelcomp/scales";

export type TipDatum = {
  name: string;
  lab: Lab;
  date: string;
  /** null = shipped without a published index score. */
  score: number | null;
  est: boolean;
  price?: string | null;
  note?: string | null;
};

export type TipState = { datum: TipDatum; x: number; y: number; width: number } | null;

const TIP_WIDTH = 262;

/**
 * Hover/tap state for a chart.
 *
 * Position is measured off the marker's own client rect rather than the SVG
 * user-space coordinate, so it stays correct through the responsive scale and
 * the horizontal scroll container below 900px.
 */
export function useChartTooltip(frame: React.RefObject<HTMLDivElement | null>) {
  const [tip, setTip] = useState<TipState>(null);

  const show = useCallback(
    (event: React.PointerEvent<SVGElement> | React.FocusEvent<SVGElement>, datum: TipDatum) => {
      const container = frame.current;
      if (!container) return;
      const target = event.currentTarget.getBoundingClientRect();
      const bounds = container.getBoundingClientRect();
      setTip({
        datum,
        x: target.left + target.width / 2 - bounds.left,
        y: target.top - bounds.top,
        width: bounds.width,
      });
    },
    [frame],
  );

  const hide = useCallback(() => setTip(null), []);

  return { tip, show, hide };
}

export default function ChartTooltip({ tip }: { tip: TipState }) {
  if (!tip) return null;
  const { datum } = tip;

  // Keep the card inside the frame, and flip it below the point when there is
  // no room above.
  const left = Math.min(Math.max(tip.x - TIP_WIDTH / 2, 8), Math.max(tip.width - TIP_WIDTH - 8, 8));
  const above = tip.y > 150;
  const top = above ? tip.y - 12 : tip.y + 34;

  return (
    <div
      className="mc-tooltip"
      role="tooltip"
      style={{
        left,
        top,
        transform: above ? "translateY(-100%)" : undefined,
      }}
    >
      <p className="mc-tooltip-name">{datum.name}</p>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
        <span className="mc-chip">
          <span className="mc-chip-swatch" style={{ background: LAB_COLORS[datum.lab] }} />
          {datum.lab}
        </span>
        <span className="mc-muted" style={{ fontSize: 11.5 }}>
          {formatLongDate(datum.date)}
        </span>
      </div>

      <div className="mc-tooltip-row">
        <span className="mc-tooltip-key">Index v4.1</span>
        <span className="mc-display" style={{ fontWeight: 600 }}>
          {datum.score === null ? (
            <span className="mc-est">no published score</span>
          ) : (
            <>
              {datum.est ? "~" : ""}
              {datum.score}
            </>
          )}
        </span>
      </div>

      <div className="mc-tooltip-row">
        <span className="mc-tooltip-key">Price /M</span>
        <span>{datum.price ?? <span className="mc-est">not disclosed</span>}</span>
      </div>

      {datum.note ? <p className="mc-tooltip-note">{datum.note}</p> : null}
    </div>
  );
}
