"use client";

import { useRef, useState } from "react";
import { REQUIRED_USERS_M12, TERM_MONTHS, type Inputs, type Result } from "@/lib/mdes/engine";
import { exactUsers, users } from "@/lib/mdes/format";

const W = 760, H = 290, PAD = { l: 54, r: 16, t: 18, b: 34 };

interface Props {
  result: Result;
  update?: (patch: Partial<Inputs> | ((prev: Inputs) => Partial<Inputs>)) => void;
  /** Customer view: hover only, no drag editing. */
  readOnly?: boolean;
}

/** Set the billed/adoption value for planning month m (1-based), flipping the ramp to custom. */
export function setMonthUsers(prev: Inputs, m: number, value: number): Partial<Inputs> {
  const v = Math.max(0, Math.round(value));
  if (m > TERM_MONTHS) {
    const extUsers = prev.timeline.extUsers.slice();
    while (extUsers.length < prev.timeline.windowMonths - TERM_MONTHS) extUsers.push(null);
    extUsers[m - TERM_MONTHS - 1] = v;
    return { timeline: { ...prev.timeline, extUsers } };
  }
  if (prev.billedLinked) {
    const adoption = prev.adoption.slice();
    adoption[m - 1] = v;
    return { ramp: { ...prev.ramp, preset: "custom" }, adoption, billed: adoption };
  }
  const billed = prev.billed.slice();
  billed[m - 1] = v;
  return { ramp: { ...prev.ramp, preset: "custom" }, billed };
}

export default function UsersChart({ result, update, readOnly = false }: Props) {
  const editable = !readOnly && Boolean(update);
  const [hover, setHover] = useState<number | null>(null);
  const dragging = useRef(false);
  const n = result.window;
  const rows = result.months;
  const maxV = Math.max(REQUIRED_USERS_M12, ...rows.map((r) => Math.max(r.billed, r.adoption, r.contracted))) * 1.12;
  const innerW = W - PAD.l - PAD.r, innerH = H - PAD.t - PAD.b;
  const slot = innerW / n;
  const x = (m: number) => PAD.l + (m - 1) * slot;
  const y = (v: number) => PAD.t + (1 - v / maxV) * innerH;
  const barW = Math.max(4, slot * 0.62);
  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, k) => (maxV * k) / ticks);
  const linked = result.inputs.billedLinked;

  const pointToMonthValue = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const py = ((e.clientY - rect.top) / rect.height) * H;
    const m = Math.floor((px - PAD.l) / slot) + 1;
    const v = Math.max(0, Math.min(maxV, (1 - (py - PAD.t) / innerH) * maxV));
    return { m, v };
  };
  const apply = (m: number, v: number) => {
    if (!editable || !update || m < 1 || m > n) return;
    update((prev) => setMonthUsers(prev, m, Math.round(v / 1000) * 1000));
  };

  const contractedPath = rows.filter((r) => !r.isExtension).map((r, i) => `${i === 0 ? "M" : "L"}${x(r.m).toFixed(1)},${y(r.contracted).toFixed(1)} L${(x(r.m) + slot).toFixed(1)},${y(r.contracted).toFixed(1)}`).join(" ");
  const adoptionPath = rows.map((r, i) => `${i === 0 ? "M" : "L"}${(x(r.m) + slot / 2).toFixed(1)},${y(r.adoption).toFixed(1)}`).join(" ");

  return (
    <div className="mg-chartwrap">
      <div className="mg-legend">
        <span><i className="sw billed" />{readOnly ? "Planned users" : `Billed users${linked ? " (= adoption)" : ""}`}</span>
        {!linked && <span><i className="sw adoption" />Adoption</span>}
        <span><i className="sw contracted" />Ordered units (contract)</span>
        <span><i className="sw req" />650K requirement</span>
        {editable && <span className="muted">drag bars to edit</span>}
      </div>
      <svg
        className="mg-chart"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Monthly billed users versus the contracted schedule"
        style={{ touchAction: editable ? "none" : "auto", cursor: editable ? "crosshair" : "default" }}
        onPointerDown={(e) => { if (!editable) return; dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); const { m, v } = pointToMonthValue(e); apply(m, v); }}
        onPointerMove={(e) => { const { m, v } = pointToMonthValue(e); setHover(m >= 1 && m <= n ? m : null); if (dragging.current) apply(m, v); }}
        onPointerUp={(e) => { if (!dragging.current) return; dragging.current = false; e.currentTarget.releasePointerCapture(e.pointerId); }}
        onPointerLeave={() => { if (!dragging.current) setHover(null); }}
      >
        {n > TERM_MONTHS && <rect className="ext" x={x(TERM_MONTHS + 1)} y={PAD.t} width={slot * (n - TERM_MONTHS)} height={innerH} />}
        {yTicks.map((v) => (
          <g key={v}>
            <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} />
            <text x={PAD.l - 6} y={y(v) + 4} textAnchor="end">{users(v)}</text>
          </g>
        ))}
        {rows.map((r) => (
          <g key={r.m}>
            <rect className={`bar${r.isExtension ? " ext" : ""}${hover === r.m ? " hot" : ""}`} x={x(r.m) + (slot - barW) / 2} y={y(r.billed)} width={barW} height={Math.max(0, innerH + PAD.t - y(r.billed))}>
              <title>{`M${r.m}: ${exactUsers(r.billed)} billed`}</title>
            </rect>
            {(n <= 18 || r.m % 2 === 1) && <text x={x(r.m) + slot / 2} y={H - 12} textAnchor="middle">M{r.m}</text>}
          </g>
        ))}
        <path className="contracted" d={contractedPath} />
        {!linked && <path className="adoption" d={adoptionPath} />}
        <line className="req" x1={PAD.l} x2={W - PAD.r} y1={y(REQUIRED_USERS_M12)} y2={y(REQUIRED_USERS_M12)} />
        <line className="marker" x1={x(TERM_MONTHS) + slot} x2={x(TERM_MONTHS) + slot} y1={PAD.t} y2={PAD.t + innerH} />
        <text x={x(TERM_MONTHS) + slot - 4} y={PAD.t + 10} textAnchor="end" className="lbl">Month 12</text>
        {hover !== null && (
          <g className="tip" transform={`translate(${Math.min(W - 170, Math.max(PAD.l, x(hover) + slot / 2 - 80))},${PAD.t + 2})`}>
            <rect width={160} height={linked ? 40 : 54} rx={6} />
            <text x={8} y={15} className="t1">M{hover} · {rows[hover - 1].label.split(" · ")[1]}{rows[hover - 1].isExtension ? " · ext" : ""}</text>
            <text x={8} y={31} className="t2">{readOnly ? "Planned" : "Billed"} {Math.round(rows[hover - 1].billed).toLocaleString("en-US")} · ordered {Math.round(rows[hover - 1].contracted).toLocaleString("en-US")}</text>
            {!linked && <text x={8} y={46} className="t2">Adoption {Math.round(rows[hover - 1].adoption).toLocaleString("en-US")}</text>}
          </g>
        )}
      </svg>
    </div>
  );
}
