"use client";

import { useState } from "react";
import { useSite } from "../context";
import { MotionTag, Src } from "../ui";
import { money, SEGMENT_SHORT } from "@/lib/korea-fy27/format";

export default function TopAccounts() {
  const { model } = useSite();
  const t = model.plan.topAccounts;
  const [exSk, setExSk] = useState(false);
  const rows = t.rows.map((r) => (exSk && r.accounts.startsWith("SK") ? { ...r, totalAiSpend: r.totalAiSpend - t.stated.skGpu, googleSharePct: Math.round((r.googleToday / (r.totalAiSpend - t.stated.skGpu)) * 100) } : r));
  const total = exSk ? t.stated.totalExSk : t.stated.totalAiSpend;
  const share = exSk ? t.stated.shareExSk : t.stated.googleSharePct;

  return (
    <div className="k-fig">
      <div className="k-fig-head">
        <div>
          <h3>13 top accounts to activate in Q4: ~$520M of AI spend, only ~$160M with us</h3>
          <p>{t.coverage}</p>
        </div>
        <label className="k-pill k-noprint" style={{ cursor: "pointer" }}>
          <input type="checkbox" checked={exSk} onChange={(e) => setExSk(e.target.checked)} className="k-check" />
          Exclude SK&rsquo;s $150M on-prem GPUs
        </label>
      </div>
      <div className="k-table-wrap">
        <table className="k-table">
          <thead>
            <tr>
              <th scope="col">Motion</th>
              <th scope="col">Pillar</th>
              <th scope="col">Top accounts</th>
              <th scope="col" className="num">#</th>
              <th scope="col" className="num">Google AI today</th>
              <th scope="col" className="num">Total AI spend (est.)</th>
              <th scope="col">Google share</th>
              <th scope="col" className="num">Anthropic + OpenAI</th>
              <th scope="col" className="num">FY27 plan, base → stretch</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.accounts}>
                <td>
                  <MotionTag motion={r.motion} />
                </td>
                <td>{SEGMENT_SHORT[r.segment]}</td>
                <td className="strong">
                  {r.accounts}
                  {r.footnotes ? <sup style={{ marginLeft: 3, color: "var(--muted)" }}>{r.footnotes}</sup> : null}
                </td>
                <td className="num">{r.count}</td>
                <td className="num">{money(r.googleToday)}</td>
                <td className="num">{money(r.totalAiSpend)}</td>
                <td style={{ minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: "var(--context-soft)", position: "relative", minWidth: 60 }}>
                      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.min(100, r.googleSharePct)}%`, background: "var(--deepen)", borderRadius: 4 }} />
                    </div>
                    <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, color: "var(--ink)" }}>{r.googleSharePct}%</span>
                  </div>
                </td>
                <td className="num">{money(r.anthropicOpenAi)}</td>
                <td className="num">
                  {money(r.planBase)} → {money(r.planStretch)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}>Total: 13 top accounts{exSk ? " (excl. SK GPUs)" : ""}</td>
              <td className="num">13</td>
              <td className="num">$160M</td>
              <td className="num">{money(total)}</td>
              <td>{share}%</td>
              <td className="num">$158M</td>
              <td className="num">$274M → $443M</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="k-grid k-g2" style={{ marginTop: 12 }}>
        <p className="k-small" style={{ color: "var(--ink-2)" }}>
          <b>{t.prize}</b> The ~$344M uses Krafton&rsquo;s itemized $9.8M rather than its $25M entered total; minus SK&rsquo;s GPUs it is ~$194M.
        </p>
        <ul className="k-list tight">
          {t.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      <Src src={{ part: "main", slides: "14" }} basis={["estimate", "directional"]} extra={<span>{t.source} Rows are rounded; totals are the deck&rsquo;s.</span>} />
    </div>
  );
}
