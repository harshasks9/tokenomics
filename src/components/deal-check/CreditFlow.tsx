"use client";

import { useState } from "react";
import { creditFunnel, type CreditFunnel, type Quarter, type Result } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";

type Program = "aws" | "google";

function Funnel({ f, program, title, subtitle, scale, notes }: { f: CreditFunnel; program: Program; title: string; subtitle: string; scale: number; notes: string[] }) {
  const rows: { label: string; value: number; note: string; ghost?: number }[] = [
    { label: "Spend the program measures", value: f.spend, note: notes[0] },
    { label: "Above the baseline", value: f.incremental, ghost: f.spend, note: notes[1] },
    { label: `Credit at ${f.rate}%`, value: f.gross, note: notes[2] },
    { label: "After cap and gate", value: f.earned, note: notes[3] },
    { label: "Usable within horizon", value: f.usable, note: notes[4] },
  ];
  const w = (v: number) => `${scale > 0 ? Math.max(v > 0 ? 1.5 : 0, (v / scale) * 100) : 0}%`;
  return (
    <div className={`dc-funnel ${program}`}>
      <div className="dc-funnel-head"><span className={`dc-swatch ${program}`} /><b>{title}</b><span>{subtitle}</span></div>
      {rows.map((r) => (
        <div key={r.label} className="dc-funnel-row">
          <div className="lab"><span>{r.label}</span><b>{usd(r.value)}</b></div>
          <div className="track">
            {r.ghost !== undefined && <div className="ghost" style={{ width: w(r.ghost) }} />}
            <div className="bar" style={{ width: w(r.value) }} />
          </div>
          <div className="note">{r.note}</div>
        </div>
      ))}
    </div>
  );
}

const W = 360, H = 150, PAD = { l: 40, r: 8, t: 22, b: 26 };

function QuarterChart({ quarters, program, markers, baselineLabel }: { quarters: Quarter[]; program: Program; markers: { month: number; text: string }[]; baselineLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const n = Math.max(quarters.length, 1);
  const maxY = Math.max(0.1, ...quarters.map((q) => Math.max(q.spend, q.baseline)));
  const slot = (W - PAD.l - PAD.r) / n;
  const bw = Math.min(28, slot * 0.55);
  const x = (k: number) => PAD.l + slot * k + (slot - bw) / 2;
  const y = (v: number) => PAD.t + (1 - v / maxY) * (H - PAD.t - PAD.b);
  if (quarters.length === 0) return <p className="dc-note">No complete quarter falls inside the program window within this horizon.</p>;
  return (
    <div className="dc-chartwrap">
      <svg className="dc-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Quarterly spend, baseline and credit" onMouseLeave={() => setHover(null)}>
        {[0, 0.5, 1].map((f) => (
          <g key={f}><line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(maxY * f)} y2={y(maxY * f)} /><text x={PAD.l - 4} y={y(maxY * f) + 4} textAnchor="end">{usd(maxY * f, 1)}</text></g>
        ))}
        {quarters.map((q, k) => {
          const top = y(q.spend), base = y(Math.min(q.baseline, q.spend));
          return (
            <g key={q.month} onMouseEnter={() => setHover(k)}>
              <rect x={x(k)} y={top} width={bw} height={Math.max(0, y(0) - top)} className={`qbar ${program}`} rx={2} />
              {q.incremental > 0 && <rect x={x(k)} y={top} width={bw} height={Math.max(0, base - top)} className={`qinc ${program}`} rx={2} />}
              <line x1={x(k) - 3} x2={x(k) + bw + 3} y1={y(q.baseline)} y2={y(q.baseline)} className="qbase" />
              {q.settled > 0 && <rect x={x(k) + bw + 3} y={y(q.settled)} width={5} height={Math.max(1, y(0) - y(q.settled))} className={`qcredit ${program}`} rx={1} />}
              <text x={x(k) + bw / 2} y={H - 10} textAnchor="middle">M{q.month + 1}</text>
              <rect x={PAD.l + slot * k} y={PAD.t} width={slot} height={H - PAD.t - PAD.b} fill="transparent" />
            </g>
          );
        })}
        {markers.map((m) => {
          const k = quarters.findIndex((q) => q.month >= m.month);
          if (k < 0) return null;
          return <text key={m.text} x={x(k) + bw / 2} y={PAD.t - 8} textAnchor="middle" className="label" style={{ fontSize: 10 }}>{m.text}</text>;
        })}
      </svg>
      {hover !== null && quarters[hover] && (
        <div className="dc-tip" style={{ left: `${((x(hover) + bw / 2) / W) * 100}%`, top: 8, transform: x(hover) > W * 0.6 ? "translateX(-105%)" : "translateX(8px)" }}>
          <div style={{ fontWeight: 600 }}>Quarter ending month {quarters[hover].month + 1}</div>
          <div>Spend {usd(quarters[hover].spend)} · {baselineLabel} {usd(quarters[hover].baseline)}</div>
          <div>Above baseline {usd(quarters[hover].incremental)} → credit {usd(quarters[hover].credit)}{quarters[hover].settled < quarters[hover].credit - 1e-9 ? ` (settled ${usd(quarters[hover].settled)})` : ""}</div>
        </div>
      )}
    </div>
  );
}

export default function CreditFlow({ result }: { result: Result }) {
  const f = creditFunnel(result);
  const i = result.inputs, H = result.horizon;
  const a = result.routes.aws, g = result.routes.gcp;
  const scale = Math.max(f.aws.spend, f.gcp.spend, 0.1);
  const awsNotes = [
    `Anthropic spend on Bedrock, in complete quarters within ${H} months.`,
    `Minus last year's AWS AI spend (${usd(i.awsBaseline)}/yr, ${usd(i.awsBaseline / 4)} per quarter)${i.mapYears > 1 || i.mapAfter === "extend" ? "; from year two, minus the previous year" : ""}.`,
    `${i.mapPct}% MAP${i.partnerPass ? ` + ${i.partnerPass}% partner pass-back` : ""} on the excess, settled quarterly.`,
    a.map.heldForever > 0.005 ? `${usd(a.map.heldForever)} held: tagged spend never reaches 10% of committed ARR (${usd(a.map.gate)}).` : a.map.gateMonth !== null && a.map.gateMonth > a.map.programStart + 2 ? `Held until month ${a.map.gateMonth + 1}, when the 10% of ARR gate opens.` : "No cap; the 10% of ARR gate opens in the first quarter.",
    `Applied to any AWS bill: Bedrock plus ${usd(i.awsOtherSpend)}/yr of other AWS spend, ${i.awsCreditUse}% consumable.`,
  ];
  const gcpNotes = [
    `Anthropic spend on GCP marketplace inside the 12-month window (months ${g.google.windowStart + 1} to ${g.google.windowEnd + 1}).`,
    i.gcpBaselineQ > 0 ? `Minus the last full quarter before signing (${usd(i.gcpBaselineQ)} per quarter).` : "Last full quarter on GCP was zero, so everything counts.",
    `${i.gcpPct}% on the excess, settled quarterly.`,
    g.google.capBinding ? `The ${usd(i.gcpCap)} cap per account trims ${usd(f.gcp.gross)} to ${usd(f.gcp.earned)}.` : !g.google.eligible ? `Not eligible: new commit below ${usd(10)}/yr.` : `Below the ${usd(i.gcpCap)} cap; no gate.`,
    `Only against eligible GCP Cloud AI spend (${usd(i.gcpAiSpend)}/yr), never against Anthropic or other GCP spend.`,
  ];
  const awsMarkers: { month: number; text: string }[] = [];
  if (a.map.gateMonth !== null && a.map.gateMonth > a.map.programStart + 2) awsMarkers.push({ month: a.map.gateMonth, text: "gate opens" });
  const gcpMarkers: { month: number; text: string }[] = [];
  const capQ = g.google.quarters.find((q) => q.settled < q.credit - 1e-9);
  if (capQ) gcpMarkers.push({ month: capQ.month, text: "cap bites" });
  return (
    <div>
      <p className="dc-note" style={{ marginTop: 0 }}>Each program takes the spend it measures, subtracts a baseline, pays a rate on what is left, and then limits where the credit can be spent. Bars are on a shared scale.</p>
      <div className="dc-two-col">
        <Funnel f={f.aws} program="aws" title="AWS MAP 2.0" subtitle="pays on growth over last year" scale={scale} notes={awsNotes} />
        <Funnel f={f.gcp} program="google" title="Google offer" subtitle="pays on new marketplace spend, capped" scale={scale} notes={gcpNotes} />
      </div>
      <div className="dc-legend" style={{ marginTop: 14 }}><span><span className="dc-swatch aws" style={{ opacity: 0.35 }} />spend</span><span><span className="dc-swatch aws" />above baseline</span><span><span className="qbase-key" />baseline</span><span><span className="dc-swatch aws" style={{ width: 5 }} />credit settled</span></div>
      <div className="dc-two-col">
        <div><div className="dc-funnel-head"><span className="dc-swatch aws" /><b>AWS MAP by quarter</b></div><QuarterChart quarters={f.aws.quarters} program="aws" markers={awsMarkers} baselineLabel="baseline" /></div>
        <div><div className="dc-funnel-head"><span className="dc-swatch google" /><b>Google offer by quarter</b></div><QuarterChart quarters={f.gcp.quarters} program="google" markers={gcpMarkers} baselineLabel="last quarter" /></div>
      </div>
    </div>
  );
}
