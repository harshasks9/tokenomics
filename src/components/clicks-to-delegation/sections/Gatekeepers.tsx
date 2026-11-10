"use client";

import { useState } from "react";
import { ARCHITECTURES, CONTROL_LABEL, NODES, type ControlPoint, type FlowKind, type NodeId } from "@/lib/clicks-to-delegation/gatekeepers";
import { Ev, Fig, Section } from "../ui";

const FLOW: Record<FlowKind, { label: string; stroke: string; dash?: string; width: number }> = {
  attention: { label: "Attention", stroke: "#6b7285", dash: "2 4", width: 2 },
  decision: { label: "Purchase decision", stroke: "#14213d", width: 3 },
  money: { label: "Money", stroke: "#1baf7a", width: 2 },
  data: { label: "Consumer data", stroke: "#2a78d6", dash: "7 4", width: 2 },
};
const CPS = Object.keys(CONTROL_LABEL) as ControlPoint[];

export default function Gatekeepers() {
  const [aid, setAid] = useState("agentic-c");
  const [kinds, setKinds] = useState<FlowKind[]>(["attention", "decision", "money", "data"]);
  const [cp, setCp] = useState<ControlPoint | null>("discovery");
  const a = ARCHITECTURES.find((x) => x.id === aid) ?? ARCHITECTURES[0];
  const controlled = cp ? a.control[cp].node : null;
  const ctrlCount = (n: NodeId) => CPS.filter((c) => a.control[c].node === n).length;
  const toggleKind = (k: FlowKind) => setKinds((ks) => (ks.includes(k) ? ks.filter((x) => x !== k) : [...ks, k]));

  return (
    <Section id="gatekeepers" num="08" title="The new gatekeepers"
      dek="Six control points decide who profits from a purchase: discovery, consumer context, checkout, payment, fulfillment and loyalty. Watch which ones move as the architecture changes."
      takeaway={<>Agents don&apos;t move all six control points at once. The likely 2026–2028 shape (architectures A and B) moves <strong>discovery and context</strong> to AI platforms while merchants keep <strong>checkout, fulfillment and merchant-of-record status</strong>. A retailer&apos;s defensive priority is to keep at least <strong>loyalty and the data that comes back</strong>.</>}>
      <Fig title="Visualization E · Who controls the customer?"
        sub="Choose an architecture and a control point. Node size shows how many control points a participant holds; lines show how attention, decisions, money and data move."
        controls={<div className="ctd-chips" role="group" aria-label="Flows shown">{(Object.keys(FLOW) as FlowKind[]).map((k) => <button key={k} type="button" className="ctd-chip" aria-pressed={kinds.includes(k)} onClick={() => toggleKind(k)}><svg width="18" height="6" aria-hidden><line x1="0" y1="3" x2="18" y2="3" stroke={FLOW[k].stroke} strokeWidth={2} strokeDasharray={FLOW[k].dash} /></svg>{FLOW[k].label}</button>)}</div>}
        foot={<><Ev kind="expert-judgment" /> A structural map of who holds each control point; not a measurement of market shares.</>}>
        <div className="ctd-arch-tabs" role="tablist" aria-label="Commerce architecture">
          {ARCHITECTURES.map((x) => <button key={x.id} type="button" role="tab" aria-selected={x.id === aid} className={x.era} onClick={() => setAid(x.id)}>{x.label}</button>)}
        </div>
        <p className="ctd-small" style={{ margin: "10px 0" }}>{a.blurb} <b>{a.question}</b></p>
        <div className="ctd-net">
          <svg viewBox="0 0 840 340" role="img" aria-label={`Network diagram for ${a.label}`}>
            <defs>
              {(Object.keys(FLOW) as FlowKind[]).map((k) => <marker key={k} id={`arr-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={FLOW[k].stroke} /></marker>)}
            </defs>
            {a.flows.filter((f) => kinds.includes(f.kind)).map((f, i) => {
              const A = NODES[f.from], B = NODES[f.to];
              const off = ({ attention: -10, decision: 0, money: 10, data: 20 } as Record<FlowKind, number>)[f.kind];
              const dx = B.x - A.x, dy = B.y - A.y, len = Math.hypot(dx, dy) || 1;
              const nx = -dy / len * off, ny = dx / len * off;
              const pad = 46;
              const x1 = A.x + dx / len * pad + nx, y1 = A.y + dy / len * pad + ny, x2 = B.x - dx / len * pad + nx, y2 = B.y - dy / len * pad + ny;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={FLOW[f.kind].stroke} strokeWidth={FLOW[f.kind].width} strokeDasharray={FLOW[f.kind].dash} markerEnd={`url(#arr-${f.kind})`} opacity={0.85} />;
            })}
            {(Object.keys(NODES) as NodeId[]).map((n) => {
              const N = NODES[n]; const on = a.active.includes(n); const c = ctrlCount(n); const r = 26 + c * 4; const hl = controlled === n;
              return (
                <g key={n} opacity={on ? 1 : 0.22}>
                  <circle cx={N.x} cy={N.y} r={r} fill={hl ? "#14213d" : "#fff"} stroke={hl ? "#14213d" : "#cfc8b9"} strokeWidth={hl ? 3 : 1.5} />
                  <text x={N.x} y={N.y + 4} textAnchor="middle" fontSize={c ? 13 : 11} fontWeight={700} fill={hl ? "#fff" : "#14213d"} className="ctd-mono">{c || ""}</text>
                  <text x={N.x} y={N.y + r + 15} textAnchor="middle" fontSize={12} fill="#3f4a63" fontWeight={600} stroke="#fff" strokeWidth={5} paintOrder="stroke" strokeLinejoin="round">{N.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="ctd-cp-grid">
          {CPS.map((c) => (
            <button key={c} type="button" className={`ctd-cp ${cp === c ? "on" : ""}`} onClick={() => setCp(cp === c ? null : c)} aria-pressed={cp === c}>
              <span className="ctd-h4">{CONTROL_LABEL[c].label}</span>
              <b>{NODES[a.control[c].node]?.label ?? "Consumer"}</b>
              <span className="ctd-small ctd-muted">{a.control[c].note}</span>
            </button>
          ))}
        </div>
        {cp && <p className="ctd-small ctd-muted" style={{ marginTop: 8 }}>{CONTROL_LABEL[cp].q}</p>}
      </Fig>

      <div className="ctd-block ctd-deep">
        <div className="ctd-table-wrap">
          <table className="ctd-table">
            <thead><tr><th>Control point</th>{ARCHITECTURES.map((x) => <th key={x.id}>{x.label.split(" · ")[0]}</th>)}</tr></thead>
            <tbody>{CPS.map((c) => <tr key={c}><td><b>{CONTROL_LABEL[c].label}</b></td>{ARCHITECTURES.map((x) => <td key={x.id}>{NODES[x.control[c].node]?.label ?? "Consumer"}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
