"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ErrorBar, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CUSTOMERS } from "@/lib/under-the-hood/data";
import { pct } from "@/lib/under-the-hood/format";
import { ChartFrame, Cite, ClassBadge, makeTip, PALETTE, Section } from "../ui";

type Org = "Google" | "Amazon" | "Microsoft" | "SpaceX" | "Broadcom" | "NVIDIA" | "AMD" | null;
interface Node { id: string; label: string; sub: string; x: number; y: number; group: "cust" | "chan" | "infra" | "cap"; orgs: Org[] }

const NODES: Node[] = [
  { id: "ent", label: "Enterprises ≥$100K", sub: ">11,900 · 74% of TTM rev.", x: 95, y: 175, group: "cust", orgs: [] },
  { id: "native", label: "AI-native builders", sub: "Embed Claude in products", x: 95, y: 260, group: "cust", orgs: [] },
  { id: "pro", label: "Prosumers & long tail", sub: "~40M customers · 26%", x: 95, y: 345, group: "cust", orgs: [] },
  { id: "gov", label: "Government", sub: "<2% of revenue", x: 95, y: 430, group: "cust", orgs: [] },
  { id: "direct", label: "Direct & self-serve", sub: "Non-marketplace ≈56%", x: 150, y: 58, group: "chan", orgs: [] },
  { id: "bedrock", label: "AWS Bedrock", sub: "Marketplace", x: 315, y: 58, group: "chan", orgs: ["Amazon"] },
  { id: "vertex", label: "Google Vertex AI", sub: "Marketplace", x: 480, y: 58, group: "chan", orgs: ["Google"] },
  { id: "foundry", label: "Azure Foundry · Copilot", sub: "Marketplace + embedded", x: 645, y: 58, group: "chan", orgs: ["Microsoft"] },
  { id: "si", label: "SIs · data platforms · Ode", sub: "Accenture, Salesforce…", x: 810, y: 58, group: "chan", orgs: [] },
  { id: "gcp", label: "Google Cloud", sub: "≥$121.3B min. (TPU)", x: 865, y: 160, group: "infra", orgs: ["Google"] },
  { id: "bcm", label: "Broadcom leases", sub: "~$161.2B TPU equipment", x: 865, y: 220, group: "infra", orgs: ["Broadcom", "Google"] },
  { id: "aws", label: "AWS", sub: "≥$110.0B min.", x: 865, y: 280, group: "infra", orgs: ["Amazon"] },
  { id: "azure", label: "Microsoft Azure", sub: "≥$44.9B min.", x: 865, y: 340, group: "infra", orgs: ["Microsoft", "NVIDIA"] },
  { id: "sxai", label: "SpaceXAI", sub: "≤$120.5B NVIDIA GPUs", x: 865, y: 400, group: "infra", orgs: ["SpaceX", "NVIDIA"] },
  { id: "neo", label: "Nscale · Lambda · AMD", sub: "≤$86B + AMD >$20B", x: 865, y: 460, group: "infra", orgs: ["NVIDIA", "AMD"] },
  { id: "pub", label: "Public markets", sub: "IPO · $141.1B raised", x: 255, y: 520, group: "cap", orgs: [] },
  { id: "amznCap", label: "Amazon notes & NPA", sub: "$6.2B notes · $15B NPA", x: 420, y: 520, group: "cap", orgs: ["Amazon"] },
  { id: "googCap", label: "Google NPA", sub: "$20B · 14.99% cap", x: 585, y: 520, group: "cap", orgs: ["Google"] },
  { id: "bcmCap", label: "Broadcom NPA", sub: "$42B rent-only · 9% PIK", x: 750, y: 520, group: "cap", orgs: ["Broadcom"] },
];
const COLORS = { cust: PALETTE.s7, chan: PALETTE.s1, infra: PALETTE.s2, cap: PALETTE.s3 };
const FLOW: Record<Node["group"], string> = { cust: "pays for tokens / seats", chan: "routes demand · takes a fee", infra: "supplies compute ← Anthropic pays", cap: "provides capital / credit" };

const ROLES: { org: Exclude<Org, null>; roles: Record<string, string> }[] = [
  { org: "Google", roles: { Investor: "NPA up to $20B; cap 14.99%; IPO-concurrent option up to $10B", Supplier: "≥$121.3B CSP minimum + $125–150B add'l TPU (est.)", Distributor: "Vertex AI marketplace", Competitor: "Gemini, Workspace agents, Antigravity" } },
  { org: "Amazon", roles: { Investor: "$6.2B notes (carried at ~$130.5B FV); $15B NPA; cap 12%", Supplier: "≥$110.0B minimum through 2036", Distributor: "Bedrock marketplace", Competitor: "Offers competing models/services (per filing)" } },
  { org: "Microsoft", roles: { Investor: "Up to $5B (Nov 2025, public reports)", Supplier: "≥$44.9B Azure minimum, Nov 2026–Jun 2033", Distributor: "Foundry; Copilot Cowork built on Claude", Competitor: "MAI models; OpenAI partner; GitHub Copilot routing" } },
  { org: "SpaceX", roles: { Investor: "—", Supplier: "SpaceXAI ≤$120.5B, ~$3.1B/month at full delivery", Distributor: "—", Competitor: "Grok; owns Cursor (acquired Aug 2026, per press)" } },
  { org: "Broadcom", roles: { Investor: "$42B rent-financing NPA (convertible)", Supplier: "~$161.2B TPU equipment leases (lessor)", Distributor: "—", Competitor: "—" } },
  { org: "NVIDIA", roles: { Investor: "Up to $10B (Nov 2025, public reports)", Supplier: "GPUs via SpaceXAI, Nscale, Lambda, Azure", Distributor: "—", Competitor: "—" } },
];

export default function Distribution() {
  const [org, setOrg] = useState<Org>(null);
  const [node, setNode] = useState<string | null>(null);
  const C = { x: 480, y: 290 };
  const ms = CUSTOMERS.marketplaceShare.map((m) => ({ period: m.period, value: m.value / 100, err: m.low && m.high ? [(m.value - m.low) / 100, (m.high - m.value) / 100] : [0, 0], derived: !!m.derived }));
  const active = (n: Node) => (org ? n.orgs.includes(org) : node ? n.id === node : true);
  const sel = NODES.find((n) => n.id === node);
  return (
    <Section id="distribution">
      <div className="uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>The distribution web — click a company to see every role it plays</h3>
          <div className="uth-chips" role="group" aria-label="Highlight a company">
            <button type="button" className="uth-chip" aria-pressed={org === null} onClick={() => setOrg(null)}>All</button>
            {(["Google", "Amazon", "Microsoft", "SpaceX", "Broadcom", "NVIDIA"] as const).map((o) => <button key={o} type="button" className="uth-chip" aria-pressed={org === o} onClick={() => { setOrg(o); setNode(null); }}>{o}</button>)}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <svg viewBox="0 0 960 566" role="img" aria-label="Ecosystem map: customers on the left, sales channels at the top, infrastructure providers on the right and capital providers at the bottom, all connected to Anthropic in the centre." style={{ width: "100%", minWidth: 640, height: "auto", display: "block" }}>
            {["Customers", "Channels", "Infrastructure", "Capital"].map((t, i) => (
              <text key={t} x={[95, 480, 865, 480][i]} y={[135, 18, 122, 562][i]} textAnchor="middle" fontSize="11" fill={PALETTE.muted} style={{ letterSpacing: ".12em", textTransform: "uppercase" }}>{t.toUpperCase()}</text>
            ))}
            {NODES.map((n) => (
              <line key={`e-${n.id}`} x1={C.x} y1={C.y} x2={n.x} y2={n.y} stroke={COLORS[n.group]} strokeWidth={active(n) ? 2 : 1} strokeOpacity={active(n) ? 0.55 : 0.12} />
            ))}
            <g>
              <circle cx={C.x} cy={C.y} r={62} fill={PALETTE.accent} />
              <text x={C.x} y={C.y - 6} textAnchor="middle" fontSize="16" fill="#fff" fontWeight="600">Anthropic</text>
              <text x={C.x} y={C.y + 12} textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,.8)">models · platform · apps</text>
              <text x={C.x} y={C.y + 27} textAnchor="middle" fontSize="10.5" fill="rgba(255,255,255,.8)">$17.0B Q3 revenue</text>
            </g>
            {NODES.map((n) => (
              <g key={n.id} role="button" tabIndex={0} aria-label={`${n.label}: ${n.sub}`} onClick={() => { setNode(n.id === node ? null : n.id); setOrg(null); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setNode(n.id === node ? null : n.id); setOrg(null); } }} style={{ cursor: "pointer" }} opacity={active(n) ? 1 : 0.28}>
                <rect x={n.x - 76} y={n.y - 22} width={152} height={44} rx={10} fill="#fff" stroke={COLORS[n.group]} strokeWidth={node === n.id || (org && n.orgs.includes(org)) ? 2.5 : 1.2} />
                <text x={n.x} y={n.y - 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fill={PALETTE.ink}>{n.label}</text>
                <text x={n.x} y={n.y + 11} textAnchor="middle" fontSize="9" fill={PALETTE.ink2}>{n.sub}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="uth-legend" style={{ marginTop: 6 }}>
          {(Object.keys(COLORS) as Node["group"][]).map((g) => <span key={g}><i style={{ background: COLORS[g] }} />{({ cust: "Customers", chan: "Channels", infra: "Infrastructure", cap: "Capital" })[g]} — {FLOW[g]}</span>)}
        </div>
        {sel && <p className="uth-small" aria-live="polite" style={{ margin: "6px 0 0" }}><b>{sel.label}:</b> {sel.sub}. Flow: {FLOW[sel.group]}.</p>}
        <p className="uth-xs" style={{ marginTop: 6 }}>Amounts are disclosed minimums or headline values (S-1/A) except where marked as public reports; positions are schematic. <Cite id="csp-marketplace-share" /> <Cite id="npa-capacity" /></p>
      </div>

      <div className="uth-block uth-card">
        <h3 className="uth-h4">The frenemy matrix: one company, four roles</h3>
        <div className="uth-tablewrap">
          <table className="uth-table" style={{ minWidth: 880 }}>
            <thead><tr><th>Company</th><th>Investor / financier</th><th>Infrastructure supplier</th><th>Distributor</th><th>Competitor</th></tr></thead>
            <tbody>
              {ROLES.map((r) => (
                <tr key={r.org} style={{ background: org === r.org ? "var(--accent-wash)" : undefined, cursor: "pointer" }} onClick={() => setOrg(org === r.org ? null : r.org)}>
                  <td><strong>{r.org}</strong></td>
                  {["Investor", "Supplier", "Distributor", "Competitor"].map((k) => <td key={k}>{r.roles[k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="uth-block uth-split">
        <div className="uth-card">
          <ChartFrame
            title="Share of revenue sold through CSP marketplaces"
            summary="Revenue sold through cloud marketplaces rose from 11% in 2023 to 32% in 2024 and 47% in 2025, was 48% in H1 2026 and 44% for nine months 2026, implying roughly 40% in Q3 2026 alone (range 38.7–41.6%)."
            rows={ms.map((m) => ({ period: m.period, share: m.value, derived: m.derived ? "calculated" : "reported" }))}
            cols={[{ key: "period", label: "Period" }, { key: "share", label: "Share", num: true, render: (r) => pct(r.share as number, 1) }, { key: "derived", label: "Basis" }]}
            filename="uth-marketplace-share.csv"
            note={<span>Note 1 (S-1 and S-1/A) <Cite id="csp-marketplace-share" /> · Q3 implied <Cite id="csp-marketplace-q3-implied" /></span>}
          >
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 640, height: 300 }}>
                <BarChart data={ms} margin={{ top: 20, right: 8, bottom: 4, left: 4 }}>
                  <CartesianGrid vertical={false} stroke={PALETTE.grid} />
                  <XAxis dataKey="period" stroke={PALETTE.axis} tickLine={false} tick={{ fontSize: 11 }} interval={0} />
                  <YAxis stroke={PALETTE.axis} tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => pct(v, 0)} domain={[0, 0.6]} />
                  <Tooltip content={makeTip((v) => pct(v, 1))} cursor={{ fill: "rgba(0,0,0,.04)" }} />
                  <Bar dataKey="value" name="CSP-marketplace share" radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false}>
                    {ms.map((m, i) => <Cell key={i} fill={m.derived ? PALETTE.s3 : PALETTE.s1} />)}
                    <ErrorBar dataKey="err" width={6} stroke={PALETTE.ink2} />
                    <LabelList dataKey="value" position="top" style={{ fontSize: 11, fill: PALETTE.ink }} formatter={(v: unknown) => pct(Number(v), 0)} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartFrame>
        </div>
        <div className="uth-card sunk">
          <h3 className="uth-h4">Who has the bargaining power?</h3>
          <ul className="uth-list" style={{ fontSize: 14 }}>
            <li><span><b>Distribution → Anthropic.</b> It keeps the direct contract and sets price even on marketplaces (“principal… establishes pricing”); marketplace share and S&M (22% → 14% of revenue) fell as it “changed the terms” of channel deals <Cite id="sm-pct-q3" />.</span></li>
            <li><span><b>Surge compute → suppliers.</b> $5.0B of Q3 capacity was bought at a premium <Cite id="shortterm-q3" />; $213.8B of commitments depend on suppliers’ financing <Cite id="commit-contingent" />.</span></li>
            <li><span><b>Capital → partners, for now.</b> Ownership caps (Amazon 12%, Google 14.99%) and milestone-gated NPAs keep hyperscalers close; the IPO reduces this dependence.</span></li>
            <li><span><b>Multi-cloud weakens each cloud’s differentiation.</b> Claude on all three clouds means no cloud owns Claude as an exclusive draw — but every cloud earns compute and fees from it. <ClassBadge kind="inference" /></span></li>
          </ul>
          <p className="uth-small" style={{ margin: "10px 0 0" }}>Channel fees rose by $4.8B year over year in 9M 2026 — about 14% of revenue — the price of reach <Cite id="channel-fees-increase" />.</p>
        </div>
      </div>
    </Section>
  );
}
