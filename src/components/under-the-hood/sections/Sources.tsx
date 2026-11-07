"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, FileJson } from "lucide-react";
import { COMMITMENTS, EVIDENCE, EVIDENCE_META, MARKET, SOURCES, TABLES, type Classification } from "@/lib/under-the-hood/data";
import { quarterly } from "@/lib/under-the-hood/calc";
import { runChecks } from "@/lib/under-the-hood/validate";
import { ClassBadge, ConfBadge, DownloadCsv, downloadText, Ext, Section } from "../ui";

const KINDS: ("all" | Classification)[] = ["all", "reported", "calculated", "inference", "assumption", "hypothesis"];

export default function Sources() {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const [mq, setMq] = useState("");
  const checks = useMemo(() => runChecks(), []);
  const passed = checks.filter((c) => c.pass).length;
  const groups = Array.from(new Set(checks.map((c) => c.group)));
  const ev = EVIDENCE.filter((e) => (kind === "all" || e.classification === kind) && (q === "" || `${e.metric} ${e.quote} ${e.tags.join(" ")} ${e.section}`.toLowerCase().includes(q.toLowerCase())));
  const mk = MARKET.filter((m) => mq === "" || `${m.entity} ${m.metric} ${m.value}`.toLowerCase().includes(mq.toLowerCase()));
  return (
    <Section id="sources">
      <div className="uth-grid uth-g3">
        <div className="uth-card">
          <h3 className="uth-h4">Primary sources</h3>
          <ul className="uth-list" style={{ fontSize: 14 }}>
            <li><span><Ext href={SOURCES.s1.url}>Anthropic, PBC — Form S-1</Ext>, filed Oct 26, 2026 (financials through Jun 30, 2026)</span></li>
            <li><span><Ext href={SOURCES.s1a.url}>Form S-1/A Amendment No. 1</Ext>, filed Nov 2, 2026 (financials through Sep 30, 2026)</span></li>
            <li><span><Ext href={SOURCES.edgar.url}>EDGAR index</Ext>: no further amendment filed by the Nov 7, 2026 cutoff (earlier DRS confidential drafts, Jun–Oct 2026)</span></li>
          </ul>
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">Method</h3>
          <ul className="uth-list" style={{ fontSize: 13.5 }}>
            <li><span>Filings downloaded from EDGAR and converted to text; tables parsed by script and every financial table cross-checked.</span></li>
            <li><span>Sentence-level diff of both filings (711 changed passages) reviewed to a list of material changes.</span></li>
            <li><span>Every <i>reported</i> quote is verified verbatim against the filing; page numbers are assigned automatically.</span></li>
            <li><span>External facts come from company releases, filings and reputable press, graded by confidence; none feeds an Anthropic financial figure.</span></li>
          </ul>
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">Downloads</h3>
          <div style={{ display: "grid", gap: 8 }}>
            <DownloadCsv filename="uth-quarterly-pnl.csv" label="Quarterly P&L (CSV)" rows={quarterly().map((r) => ({ quarter: r.q, revenue: r.revenue, compute: r.compute, personnel: r.personnel, sales_marketing_partnerships: r.sm, other_opex: r.otherOpex, total_opex: r.totalOpex, operating_income: r.opIncome, sbc: r.sbc, donation: r.donation, adjusted_operating_income: r.adjOpIncome, net_loss: r.netLoss, adjusted_net_income: r.adjNetIncome }))} />
            <DownloadCsv filename="uth-evidence-library.csv" label="Evidence library (CSV)" rows={EVIDENCE.map((e) => ({ id: e.id, metric: e.metric, value: e.value, unit: e.unit, period: e.period, classification: e.classification, source: e.sourceId, section: e.section, page: e.page, quote: e.quote, formula: e.formula, confidence: e.confidence, caveat: e.caveat }))} />
            <DownloadCsv filename="uth-commitment-ledger.csv" label="Commitment ledger (CSV)" rows={COMMITMENTS.counterparties.map((c) => ({ counterparty: c.name, type: c.type, amount_musd: c.amount, basis: c.amountBasis, period: c.period, chip: c.chip, cancelability: c.cancelability, in_aggregate: c.inAggregate, page: c.page }))} />
            <button type="button" className="uth-btn" onClick={() => downloadText("uth-extracted-tables.json", JSON.stringify(TABLES, null, 1), "application/json")}><FileJson size={14} aria-hidden /> Parsed filing tables (JSON)</button>
          </div>
        </div>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Evidence library — {ev.length} of {EVIDENCE.length} items</h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input className="uth-input" type="search" placeholder="Search metrics, quotes, tags…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search evidence" />
            <select className="uth-select" value={kind} onChange={(e) => setKind(e.target.value as (typeof KINDS)[number])} aria-label="Filter by classification">
              {KINDS.map((k) => <option key={k} value={k}>{k === "all" ? "All classifications" : k}</option>)}
            </select>
          </div>
        </div>
        {ev.length === 0 ? <div className="uth-empty">No evidence matches “{q}”. Try a broader term such as “compute” or “customers”.</div> : (
          <div className="uth-tablewrap" style={{ maxHeight: 560, overflowY: "auto" }}>
            <table className="uth-table" style={{ minWidth: 900 }}>
              <thead><tr><th>Claim</th><th>Value</th><th>Period</th><th>Basis</th><th>Source</th><th>Verbatim / formula</th></tr></thead>
              <tbody>{ev.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.metric}</strong>{e.caveat && <div className="uth-xs">{e.caveat}</div>}</td>
                  <td className="num">{e.value === null ? "blank" : String(e.value)} <span className="uth-xs">{e.unit}</span></td>
                  <td>{e.period}</td>
                  <td><ClassBadge kind={e.classification} /><div style={{ marginTop: 4 }}><ConfBadge level={e.confidence} /></div></td>
                  <td><Ext href={SOURCES[e.sourceId].url}>{e.sourceId === "s1a" ? "S-1/A" : "S-1"}</Ext> p.{e.page}<div className="uth-xs">{e.section}</div>{e.quoteVerified && <div className="uth-xs" style={{ color: "var(--good)" }}>✓ quote verified</div>}</td>
                  <td style={{ maxWidth: 420 }}><span style={{ fontStyle: "italic" }}>“{e.quote}”</span>{e.formula && <div className="uth-xs"><b>Formula:</b> {e.formula}</div>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <p className="uth-xs" style={{ marginTop: 8 }}>{EVIDENCE_META.pageNote}</p>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>External sources — {mk.length} facts</h3>
          <input className="uth-input" type="search" placeholder="Filter by company or metric…" value={mq} onChange={(e) => setMq(e.target.value)} aria-label="Filter external sources" />
        </div>
        <div className="uth-tablewrap" style={{ maxHeight: 420, overflowY: "auto" }}>
          <table className="uth-table" style={{ minWidth: 860 }}>
            <thead><tr><th>Entity</th><th>Metric</th><th>Value</th><th>Period</th><th>Basis</th><th>Confidence</th><th>Source</th></tr></thead>
            <tbody>{mk.map((m) => <tr key={m.id}><td><strong>{m.entity}</strong></td><td>{m.metric}</td><td>{m.value}</td><td>{m.period}</td><td>{m.basis}</td><td>{m.confidence}</td><td><Ext href={m.url}>{new URL(m.url).hostname.replace("www.", "")}</Ext><div className="uth-xs">{m.date}</div></td></tr>)}</tbody>
          </table>
        </div>
        <p className="uth-xs" style={{ marginTop: 8 }}>Research cutoff Nov 7, 2026. Many external pages were read through search extracts; confidence reflects that. Survey sources (Menlo, Ramp) have known biases (Menlo is an Anthropic investor; Ramp covers its own customers).</p>
      </div>

      <div className="uth-block uth-card">
        <div className="uth-toolbar">
          <h3 className="uth-h4" style={{ margin: 0 }}>Verification checks — {passed} of {checks.length} passing</h3>
          <span className="uth-xs">Run at build time from src/lib/under-the-hood/validate.ts (also in the test suite)</span>
        </div>
        <div className="uth-grid uth-g2">
          {groups.map((g) => (
            <div key={g} className="uth-card sunk">
              <h4 className="uth-h4">{g}</h4>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6, fontSize: 13 }}>
                {checks.filter((c) => c.group === g).map((c) => (
                  <li key={c.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    {c.pass ? <CheckCircle2 size={15} color="#0c7a0c" aria-label="pass" style={{ flex: "0 0 auto", marginTop: 2 }} /> : <XCircle size={15} color="#b42d2d" aria-label="fail" style={{ flex: "0 0 auto", marginTop: 2 }} />}
                    <span>{c.label} <span className="uth-xs">({c.detail})</span></span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="uth-block uth-grid uth-g2">
        <div className="uth-card">
          <h3 className="uth-h4">Key calculations</h3>
          <dl className="uth-kv" style={{ gridTemplateColumns: "180px 1fr", fontSize: 13 }}>
            <dt>Growth</dt><dd>QoQ = Rₜ/Rₜ₋₁ − 1; YoY = Rₜ/Rₜ₋₄ − 1; increment = Rₜ − Rₜ₋₁ (quarterly table)</dd>
            <dt>Compute intensity</dt><dd>Compute & infrastructure ÷ revenue; revenue per $ = inverse</dd>
            <dt>Implied gross margin</dt><dd>1 − functional cost of revenue ÷ revenue (Note 8)</dd>
            <dt>Serving share bound</dt><dd>Cost of revenue ÷ compute & infrastructure (upper bound)</dd>
            <dt>Q3 marketplace share</dt><dd>(0.44 × 9M rev − 0.48 × H1 rev) ÷ Q3 rev; ±0.5pt rounding range</dd>
            <dt>NRR cohort bound</dt><dd>Base ∈ [Q3’25 rev − 9M’25 subscriptions, Q3’25 rev]; NRR 8.5–9.5×</dd>
            <dt>Implied growth</dt><dd>Solve R₀Σ(1+g)ᵏ (k=1..4) = next-12-month obligations ÷ target compute ratio</dd>
            <dt>Obligation profile</dt><dd>Disclosed table by year + other buckets spread to match $895.4B, $447.5B pre-2031 and $69.8B next-12-month anchors</dd>
          </dl>
        </div>
        <div className="uth-card">
          <h3 className="uth-h4">Guardrails applied</h3>
          <ul className="uth-list" style={{ fontSize: 13.5 }}>
            <li><span>Annualized or run-rate figures are never mixed with recognized GAAP revenue; Q3 × 4 is labelled as such.</span></li>
            <li><span>NRR is not compared with SaaS NRR without stating the methodological difference.</span></li>
            <li><span>Customers are not treated as seats; “enterprise” means ≥$100K TTM spend, per the filing.</span></li>
            <li><span>Compute expense is not treated as inference COGS; the functional split is used instead.</span></li>
            <li><span>Adjusted operating income is not cash flow; mark-to-market losses are not cash burn.</span></li>
            <li><span>Commitment buckets are never added to named-arrangement headline amounts; contingent and excluded amounts are shown separately.</span></li>
            <li><span>Scenario outputs are visually separated, labelled as assumptions, and never presented as guidance.</span></li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
