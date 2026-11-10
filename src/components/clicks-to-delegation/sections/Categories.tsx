"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/clicks-to-delegation/research";
import { Cite, Ev, Fig, Section, useTableToggle } from "../ui";

const TRAIT_LABEL: Record<string, string> = {
  standardization: "Standardization", comparability: "Ease of comparison", frequency: "Purchase frequency", replenishment: "Replenishment fit",
  tactile: "Need to touch / try", emotional: "Emotional attachment", ticket: "Ticket size", urgency: "Urgency", returns: "Return complexity",
  delivery: "Delivery difficulty", priceTransparency: "Price transparency", switching: "Switching costs",
};
const SHORT: Record<string, string> = {
  "books-media": "Books & media", electronics: "Electronics", travel: "Travel", apparel: "Apparel", grocery: "Grocery", "household-cpg": "Household consumables",
  beauty: "Beauty", "furniture-home": "Furniture & home", autos: "Autos", luxury: "Luxury", pet: "Pet supplies", "pharmacy-health": "Pharmacy & health",
  "food-delivery": "Restaurants & delivery", financial: "Financial products", "b2b-office": "B2B & office supplies",
};
type Box = { x: number; y: number; w: number; h: number };
const overlap = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
/** Greedy label placement: try right, left, above, below, then nudge, avoiding other labels and dots. */
function placeLabels(pts: { id: string; x: number; y: number; text: string }[], W: number) {
  const placed: Box[] = []; const dots: Box[] = pts.map((p) => ({ x: p.x - 7, y: p.y - 7, w: 14, h: 14 }));
  const out: Record<string, { x: number; y: number; anchor: "start" | "end" | "middle"; lead: boolean }> = {};
  for (const p of [...pts].sort((a, b) => a.y - b.y)) {
    const w = p.text.length * 6.6 + 4, h = 15;
    const cands: { x: number; y: number; anchor: "start" | "end" | "middle"; box: Box }[] = [];
    for (const dy of [0, -14, 14, -26, 26]) {
      cands.push({ x: p.x + 11, y: p.y + 4 + dy, anchor: "start", box: { x: p.x + 9, y: p.y - 9 + dy, w, h } });
      cands.push({ x: p.x - 11, y: p.y + 4 + dy, anchor: "end", box: { x: p.x - 11 - w, y: p.y - 9 + dy, w, h } });
    }
    cands.push({ x: p.x, y: p.y - 13, anchor: "middle", box: { x: p.x - w / 2, y: p.y - 26, w, h } });
    cands.push({ x: p.x, y: p.y + 22, anchor: "middle", box: { x: p.x - w / 2, y: p.y + 9, w, h } });
    const ok = cands.find((c) => c.box.x >= 0 && c.box.x + c.box.w <= W && !placed.some((b) => overlap(b, c.box)) && !dots.some((d, i) => pts[i].id !== p.id && overlap(d, c.box)));
    const c = ok ?? cands[0];
    placed.push(c.box); out[p.id] = { x: c.x, y: c.y, anchor: c.anchor, lead: Math.abs(c.y - (p.y + 4)) > 6 };
  }
  return out;
}
const QUADS = [
  { x: 1, y: 1, title: "Extend e-commerce's lead", sub: "Agents speed up what already works online" },
  { x: 0, y: 1, title: "Agents remove old friction", sub: "Hard for e-commerce, promising for agents" },
  { x: 1, y: 0, title: "AI assists, humans buy", sub: "Easy to buy online, hard to delegate" },
  { x: 0, y: 0, title: "Needs new trust and execution", sub: "Hard on both counts" },
];

export default function Categories() {
  const [sel, setSel] = useState("grocery");
  const [hover, setHover] = useState<string | null>(null);
  const { table, toggle } = useTableToggle();
  const c = CATEGORIES.find((x) => x.id === sel) ?? CATEGORIES[0];
  const W = 760, H = 460, L = 56, R = 24, T = 20, B = 50;
  const sx = (v: number) => L + (v / 100) * (W - L - R);
  const sy = (v: number) => T + (1 - v / 100) * (H - T - B);
  const labels = placeLabels(CATEGORIES.map((x) => ({ id: x.id, x: sx(x.ecomEase), y: sy(x.agenticSuitability), text: SHORT[x.id] ?? x.name })), W);

  return (
    <Section id="categories" num="09" title="Which retail categories move first?"
      dek="E-commerce won standardized, comparable categories first. Agents may follow, but the bigger surprise could be the categories e-commerce never cracked."
      takeaway={<>The upper-left quadrant is the counter-intuitive one. <strong>Grocery</strong> sits there: still a small share of sales online after 25 years, but the most-cited category for delegation in 2026 surveys, because the pain was never browsing but <strong>assembling a recurring basket</strong>. Luxury, autos and fashion sit at the bottom: agents help research, people keep the decision.</>}>
      <Fig title="Visualization G · Category readiness"
        sub="Historical ease of e-commerce adoption (horizontal) against suitability for AI-mediated or delegated purchasing (vertical). Ring size shows confidence; select a category for its rationale and traits."
        controls={toggle}
        foot={<><Ev kind="expert-judgment" /> Both scores are this report&apos;s judgment from 12 category traits and cited evidence. Online-penetration figures are cited where found.</>}>
        {table ? (
          <div className="ctd-table-wrap"><table className="ctd-table"><thead><tr><th>Category</th><th>E-commerce ease</th><th>Agentic suitability</th><th>Confidence</th><th>Online share (where found)</th></tr></thead>
            <tbody>{CATEGORIES.map((x) => <tr key={x.id}><td>{x.name}</td><td className="n">{x.ecomEase}</td><td className="n">{x.agenticSuitability}</td><td>{x.confidence}</td><td>{x.ecomPenetration?.value ?? "—"}<Cite ids={x.ecomPenetration?.sourceIds} /></td></tr>)}</tbody></table></div>
        ) : (
          <div className="ctd-scatter-wrap">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Category readiness quadrant chart">
              {QUADS.map((q) => (
                <g key={q.title}>
                  <rect x={q.x ? sx(50) : sx(0)} y={q.y ? sy(100) : sy(50)} width={sx(50) - sx(0)} height={sy(0) - sy(50)} fill={q.x === 0 && q.y === 1 ? "#e3edf9" : "#f6f3ec"} opacity={0.7} />
                  <text x={q.x ? sx(100) - 8 : sx(0) + 8} y={q.y ? sy(100) + 18 : sy(0) - 24} textAnchor={q.x ? "end" : "start"} fontSize={12} fontWeight={700} fill="#3f4a63">{q.title}</text>
                  <text x={q.x ? sx(100) - 8 : sx(0) + 8} y={q.y ? sy(100) + 33 : sy(0) - 9} textAnchor={q.x ? "end" : "start"} fontSize={11} fill="#6b7285">{q.sub}</text>
                </g>
              ))}
              {[0, 25, 50, 75, 100].map((v) => <g key={v}><text x={sx(v)} y={H - B + 18} fontSize={11} textAnchor="middle" fill="#6b7285">{v}</text><text x={L - 8} y={sy(v) + 4} fontSize={11} textAnchor="end" fill="#6b7285">{v}</text></g>)}
              <text x={(L + W - R) / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="#3f4a63" fontWeight={600}>Historical ease of e-commerce adoption →</text>
              <text x={16} y={(T + H - B) / 2} textAnchor="middle" fontSize={12} fill="#3f4a63" fontWeight={600} transform={`rotate(-90 16 ${(T + H - B) / 2})`}>Suitability for delegated purchasing →</text>
              {CATEGORIES.map((x) => {
                const cx = sx(x.ecomEase), cy = sy(x.agenticSuitability); const on = x.id === sel || x.id === hover;
                const ring = x.confidence === "high" ? 0 : x.confidence === "medium" ? 6 : 12;
                const lb = labels[x.id];
                return (
                  <g key={x.id} tabIndex={0} role="button" aria-label={`${x.name}: e-commerce ease ${x.ecomEase}, agentic suitability ${x.agenticSuitability}, ${x.confidence} confidence`} onClick={() => setSel(x.id)} onKeyDown={(e) => { if (e.key === "Enter") setSel(x.id); }} onMouseEnter={() => setHover(x.id)} onMouseLeave={() => setHover(null)} style={{ cursor: "pointer" }}>
                    {ring > 0 && <circle cx={cx} cy={cy} r={6 + ring} fill="none" stroke="#2a78d6" strokeOpacity={0.35} strokeDasharray="3 3" />}
                    <circle cx={cx} cy={cy} r={on ? 8 : 6} fill={x.id === sel ? "#14213d" : "#2a78d6"} stroke="#fcfbf8" strokeWidth={2} />
                    {lb.lead && <line x1={cx} y1={cy} x2={lb.anchor === "end" ? lb.x + 2 : lb.anchor === "start" ? lb.x - 2 : lb.x} y2={lb.y - 4} stroke="#9aa0ad" strokeWidth={1} />}
                    <text x={lb.x} y={lb.y} fontSize={12} textAnchor={lb.anchor} fill="#14213d" fontWeight={on ? 700 : 500} stroke="#fcfbf8" strokeWidth={4} paintOrder="stroke">{SHORT[x.id] ?? x.name}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
        <div className="ctd-cat-detail">
          <div>
            <h3 className="ctd-h3">{c.name}</h3>
            <p className="ctd-small ctd-muted">E-commerce ease <b className="ctd-mono">{c.ecomEase}</b> · Agentic suitability <b className="ctd-mono">{c.agenticSuitability}</b> · {c.confidence} confidence</p>
            <p style={{ marginTop: 8 }}>{c.rationale}<Cite ids={c.sourceIds} /></p>
            {c.ecomPenetration && <p className="ctd-small" style={{ marginTop: 8 }}><b>Online share:</b> {c.ecomPenetration.value} ({c.ecomPenetration.geo}, {c.ecomPenetration.year})<Cite ids={c.ecomPenetration.sourceIds} /></p>}
          </div>
          <div className="ctd-traits" aria-label="Category traits, 1 to 5">
            {Object.entries(c.traits).map(([k, v]) => (
              <div key={k} className="ctd-trait"><span>{TRAIT_LABEL[k] ?? k}</span><span className="ctd-trait-bar"><i style={{ width: `${(v / 5) * 100}%` }} /></span><b className="ctd-mono">{v}</b></div>
            ))}
          </div>
        </div>
      </Fig>
    </Section>
  );
}
