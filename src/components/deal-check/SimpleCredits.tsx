"use client";

import { creditFunnel, type CreditFunnel, type Result } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";
import Tip, { type TipKey } from "./Tip";

function Steps({ f, cls, title, later, notes, tips, scale }: { f: CreditFunnel; cls: string; title: string; later: number; notes: string[]; tips: TipKey[]; scale: number }) {
  const rows = [
    { label: "Spend the program counts", value: f.spend, note: notes[0], tip: tips[0] },
    { label: `Credit it pays (${f.rate}%)`, value: f.earned, note: notes[1], tip: tips[1] },
    { label: "Credit they can use", value: f.usable, note: notes[2] + (later > 0.005 ? ` Another ${usd(later)} lands after the horizon.` : ""), tip: tips[2] },
  ];
  const w = (v: number) => `${scale > 0 ? Math.max(v > 0 ? 1.5 : 0, (v / scale) * 100) : 0}%`;
  return (
    <div className={`dc-funnel ${cls}`}>
      <div className="dc-funnel-head"><span className={`dc-swatch ${cls}`} /><b>{title}</b></div>
      {rows.map((r) => (
        <div key={r.label} className="dc-funnel-row">
          <div className="lab"><span>{r.label} <Tip id={r.tip} /></span><b>{usd(r.value)}</b></div>
          <div className="track"><div className="bar" style={{ width: w(r.value) }} /></div>
          <div className="note">{r.note}</div>
        </div>
      ))}
    </div>
  );
}

export default function SimpleCredits({ result }: { result: Result }) {
  const f = creditFunnel(result), i = result.inputs, H = result.horizon;
  const a = result.routes.aws, g = result.routes.gcp;
  const sum = (arr: number[], from: number, to: number) => arr.slice(from, to).reduce((t, x) => t + x, 0);
  const awsLater = sum(a.series.awsUsed, H, 36), gcpLater = sum(g.series.gcpUsed, H, 36);
  const scale = Math.max(f.aws.spend, f.gcp.spend, 0.1);
  const awsNotes = [
    `Anthropic spend on Bedrock over ${H} months. Only the part above last year's ${usd(i.awsBaseline)} earns anything: ${usd(f.aws.incremental)}.`,
    a.map.heldForever > 0.005 ? `${usd(a.map.heldForever)} more is held back because tagged spend never reaches 10% of committed ARR.` : `${f.aws.rate}% of the excess, paid each quarter.`,
    `Applied to any AWS bill: Bedrock plus ${usd(i.awsOtherSpend)} a year of other AWS spend.`,
  ];
  const gcpNotes = [
    `Anthropic spend on GCP marketplace in the 12 months after signing${i.gcpBaselineQ > 0 ? `, above last quarter × 4 (${usd(i.gcpBaselineQ * 4)} a year)` : ""}.`,
    g.google.capBinding ? `${f.gcp.rate}% would be ${usd(f.gcp.gross)}; the ${usd(i.gcpCap)} per-account cap trims it.` : g.google.forecastBinding ? `Sized on the ${usd(g.google.forecastY1)} first-year forecast agreed at signing.` : `${f.gcp.rate}% of the excess, paid as spend milestones.`,
    `Only against other GCP AI spend (${usd(i.gcpAiSpend)} a year${i.geminiShare > 0 ? " plus the Gemini bill" : ""}), never against the Anthropic spend itself.`,
  ];
  return (
    <div>
      <p className="dc-note" style={{ marginTop: 0 }}>Each program counts some spend, pays a percentage of it, and then limits what the credit can be spent on. The <span className="dc-tip-btn static">i</span> marks quote the source.</p>
      <div className="dc-two-col">
        <Steps f={f.aws} cls="aws" title="AWS MAP 2.0" later={awsLater} notes={awsNotes} tips={["awsSpend", "awsRate", "awsUse"]} scale={scale} />
        <Steps f={f.gcp} cls="google" title="Google offer" later={gcpLater} notes={gcpNotes} tips={["gcpSpend", "gcpCap", "gcpUse"]} scale={scale} />
      </div>
    </div>
  );
}
