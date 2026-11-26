"use client";

import { useState } from "react";
import { Explain, Seg, Tag } from "./ui";

type Pair = "amzn" | "msft" | "goog";

interface Flow { label: string; value: string; dir: "toLab" | "toCloud"; kind: "cash" | "commit" | "paper"; basis: "D" | "R" | "C" }

const PAIRS: Record<Pair, { cloud: string; lab: string; color: string; flows: Flow[]; read: string; cashVsBooks: string }> = {
  amzn: {
    cloud: "Amazon / AWS",
    lab: "Anthropic",
    color: "var(--aws)",
    flows: [
      { label: "Cash invested (notes + preferred, per Amazon's 10-Q)", value: "≈$18B", dir: "toLab", kind: "cash", basis: "D" },
      { label: "More investment, released only as AWS delivers capacity", value: "up to $15B", dir: "toLab", kind: "commit", basis: "D" },
      { label: "Promise to rent AWS computers (take-or-pay)", value: "≥$110B over 10 yrs", dir: "toCloud", kind: "commit", basis: "D" },
      { label: "Fee AWS keeps on Claude sold through AWS", value: "share of ≈$5B (9M 2026, all clouds)", dir: "toCloud", kind: "cash", basis: "C" },
      { label: "Value of Amazon's stake at the $83 IPO price", value: "≈$289B", dir: "toCloud", kind: "paper", basis: "C" },
    ],
    read: "Amazon put in about $18B and holds a stake worth about $289B at the IPO price (it also invested $50B in OpenAI this year). Anthropic in turn has promised to spend at least $110B on AWS. The stake's gains (~$67B of pre-tax income in nine months) sit below operating profit — none of it is in AWS's reported margin.",
    cashVsBooks: "Cash: AWS collects Claude bills and keeps a fee; Anthropic pays AWS for compute. Books: the stake's rise in value is a non-cash gain in Amazon's other income, not AWS revenue.",
  },
  msft: {
    cloud: "Microsoft / Azure",
    lab: "OpenAI",
    color: "var(--msft)",
    flows: [
      { label: "Microsoft's investment (stake now ≈24%, diluted from ≈27%)", value: "≈$13B+ (reported)", dir: "toLab", kind: "cash", basis: "R" },
      { label: "OpenAI's extra promise to rent Azure (Oct 2025)", value: "$250B", dir: "toCloud", kind: "commit", basis: "D" },
      { label: "Revenue Microsoft booked from OpenAI", value: "$24.1B (FY26) · $10.0B (Sep-26 qtr)", dir: "toCloud", kind: "cash", basis: "D" },
      { label: "Revenue share OpenAI pays Microsoft (capped, to 2030)", value: "≈20% of OpenAI revenue, cap reported ≈$38B", dir: "toCloud", kind: "cash", basis: "R" },
      { label: "Revenue share Microsoft paid OpenAI on Azure OpenAI", value: "ended April 2026", dir: "toLab", kind: "cash", basis: "R" },
    ],
    read: "OpenAI is now Microsoft's largest customer (10.8% of revenue last quarter), and press reports put OpenAI's own quarterly revenue at about the same size as its Microsoft bill — so those bills are paid largely with OpenAI's investors' money. Since April 2026, Microsoft sells OpenAI models royalty-free.",
    cashVsBooks: "Cash: OpenAI pays Azure for compute and pays Microsoft a capped revenue share. Books: Microsoft's OpenAI stake no longer drags its earnings (a +$272M gain last quarter).",
  },
  goog: {
    cloud: "Alphabet / Google Cloud",
    lab: "Anthropic",
    color: "var(--google)",
    flows: [
      { label: "Cash invested (notes, preferred, IPO placement)", value: "≈$23B", dir: "toLab", kind: "cash", basis: "C" },
      { label: "More investment linked to compute and revenue targets", value: "up to $10B left", dir: "toLab", kind: "commit", basis: "D" },
      { label: "Promise to rent Google Cloud (take-or-pay)", value: "≥$121.3B to 2033", dir: "toCloud", kind: "commit", basis: "D" },
      { label: "Extra TPUs (not in the total)", value: "$125–150B est.", dir: "toCloud", kind: "commit", basis: "D" },
      { label: "Value of Google's stake at the $83 IPO price", value: "≈$147B", dir: "toCloud", kind: "paper", basis: "C" },
    ],
    read: "Google plays the same game. Anthropic is at least a fifth of Google Cloud's $561B backlog, and Alphabet's nine-month gains on equity stakes ($127B) were bigger than its operating income. Any argument about AWS's ‘circular’ AI money applies to Google too.",
    cashVsBooks: "Cash: Anthropic pays Google for TPUs and cloud; Google keeps a fee on Claude sold through Vertex. Books: the stake's mark-ups are non-cash gains below operating income.",
  },
};

const KIND_LABEL = { cash: "cash", commit: "promise", paper: "paper value" } as const;

/** Section: the circles of money between clouds and model makers. */
export default function MoneyCircle() {
  const [pair, setPair] = useState<Pair>("amzn");
  const d = PAIRS[pair];
  const toLab = d.flows.filter((f) => f.dir === "toLab");
  const toCloud = d.flows.filter((f) => f.dir === "toCloud");
  const W = 760, rowH = 46;
  const H = Math.max(toLab.length, toCloud.length) * rowH + 150;
  return (
    <div className="sm-panel">
      <div style={{ marginBottom: 14 }}>
        <Seg label="Choose a pair" value={pair} onChange={setPair} options={[{ v: "amzn", l: "Amazon ⇄ Anthropic" }, { v: "msft", l: "Microsoft ⇄ OpenAI" }, { v: "goog", l: "Google ⇄ Anthropic" }]} />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="sm-chart sm-flow" role="img" aria-label={`Money flows between ${d.cloud} and ${d.lab}`}>
        <defs>
          <marker id="arrR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)" /></marker>
        </defs>
        <rect x={10} y={20} width={170} height={H - 40} rx={16} fill="#fff" stroke={d.color} strokeWidth={2} />
        <text x={95} y={H / 2 - 6} textAnchor="middle" className="nodeT">{d.cloud.split(" / ")[0]}</text>
        <text x={95} y={H / 2 + 14} textAnchor="middle" className="elbl">{d.cloud.split(" / ")[1] ?? ""}</text>
        <rect x={W - 180} y={20} width={170} height={H - 40} rx={16} fill="#fff" stroke="var(--provider)" strokeWidth={2} />
        <text x={W - 95} y={H / 2 + 4} textAnchor="middle" className="nodeT">{d.lab}</text>
        {toLab.map((f, i) => {
          const y = 52 + i * rowH;
          return (
            <g key={f.label}>
              <line x1={190} x2={W - 190} y1={y} y2={y} stroke="var(--ink-2)" strokeWidth={f.kind === "cash" ? 2.5 : 1.5} strokeDasharray={f.kind === "commit" ? "6 4" : f.kind === "paper" ? "2 4" : undefined} markerEnd="url(#arrR)" />
              <text x={W / 2} y={y - 8} textAnchor="middle" className="elbl">{f.label} · {KIND_LABEL[f.kind]}</text>
              <text x={W / 2} y={y + 16} textAnchor="middle" style={{ fontWeight: 700, fontSize: 13 }}>{f.value}</text>
            </g>
          );
        })}
        {toCloud.map((f, i) => {
          const y = 52 + (toLab.length + i) * rowH + 20;
          return (
            <g key={f.label}>
              <line x1={W - 190} x2={190} y1={y} y2={y} stroke={d.color} strokeWidth={f.kind === "cash" ? 2.5 : 1.5} strokeDasharray={f.kind === "commit" ? "6 4" : f.kind === "paper" ? "2 4" : undefined} markerEnd="url(#arrR)" />
              <text x={W / 2} y={y - 8} textAnchor="middle" className="elbl">{f.label} · {KIND_LABEL[f.kind]}</text>
              <text x={W / 2} y={y + 16} textAnchor="middle" style={{ fontWeight: 700, fontSize: 13 }}>{f.value}</text>
            </g>
          );
        })}
      </svg>
      <div className="sm-legend"><span>── cash</span><span>- - - promise (contract)</span><span>· · · paper value (not cash)</span></div>
      <div className="sm-grid c2" style={{ marginTop: 12 }}>
        <Explain><b>What it means.</b> {d.read}</Explain>
        <Explain><b>Cash vs accounting.</b> {d.cashVsBooks}</Explain>
      </div>
      <p className="sm-caveat">
        Circular flows are normal in this industry and are disclosed in the filings — we found no evidence of improper accounting. The honest question is narrower: how much of each cloud&apos;s AI growth depends on one or two customers who are funded by the cloud itself? Sources: Anthropic S-1/A and 424B4 <Tag b="D" />, Amazon/Alphabet/Microsoft 10-Qs <Tag b="D" />, our calculations at the $83 IPO price <Tag b="C" />.
      </p>
    </div>
  );
}
