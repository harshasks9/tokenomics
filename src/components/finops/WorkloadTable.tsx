"use client";

import { cloudLabel } from "@/lib/finops/catalog";
import { Assessment, tokensPerMonth } from "@/lib/finops/engine";
import { money, num, pct, perMTok, ms } from "@/lib/finops/format";
import { Sparkline, TierChip } from "./primitives";

/** The dense estate table — the table-view twin of the frontier scatter. */
export default function WorkloadTable({
  items,
  selectedId,
  onSelect,
  compact = false,
}: {
  items: Assessment[];
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  compact?: boolean;
}) {
  const rows = compact ? items.slice(0, 8) : items;
  return (
    <div className="fo-card">
      <div className="fo-card-head">
        <span className="fo-card-title">AI workload estate</span>
        <span className="fo-card-sub">
          {compact ? `Top ${rows.length} of ${items.length} by spend` : `${items.length} workloads · sorted by monthly spend`}
        </span>
      </div>
      <div className="fo-tablewrap">
        <table className="fo-table">
          <thead>
            <tr>
              <th>Workload</th>
              <th>Model · Cloud</th>
              <th className="num">Tokens/mo</th>
              <th className="num">Cache hit</th>
              <th className="num">Batch</th>
              <th className="num">TTFT</th>
              <th className="num">$/1M eff.</th>
              <th className="num">$/task</th>
              <th className="num">Cost/mo</th>
              <th className="num">30d trend</th>
              <th className="num">Gap/mo</th>
              <th>Pareto tier</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const t = tokensPerMonth(a.w);
              const clickable = !!onSelect;
              return (
                <tr
                  key={a.w.id}
                  className={clickable ? "clickable" : undefined}
                  aria-selected={selectedId === a.w.id || undefined}
                  onClick={clickable ? () => onSelect!(selectedId === a.w.id ? null : a.w.id) : undefined}
                >
                  <td>
                    <div className="fo-cell-main">{a.w.name}</div>
                    <div className="fo-cell-sub">{a.w.bu} · {a.w.useCase}</div>
                  </td>
                  <td>
                    <div className="fo-cell-main">{a.model.name}</div>
                    <div className="fo-cell-sub">{cloudLabel(a.w.cloud)} · {a.w.region}</div>
                  </td>
                  <td className="num">
                    {num(t.total)}
                    <div className="fo-cell-sub">{num(t.inTok)} in · {num(t.outTok)} out</div>
                  </td>
                  <td className="num">{pct(a.w.cacheEligible * a.w.cacheHitRate)}</td>
                  <td className="num">{pct(a.w.batchShare)}</td>
                  <td className="num">{ms(a.model.ttftMs)}</td>
                  <td className="num">{perMTok(a.current.effPerMTok)}</td>
                  <td className="num">${a.costPerTask.toFixed(4)}</td>
                  <td className="num"><b>{money(a.current.monthly)}</b></td>
                  <td className="num"><Sparkline data={a.spark} width={72} height={22} /></td>
                  <td className="num" style={{ color: a.gapMonthly > 100 ? "var(--critical)" : "var(--delta-good)", fontWeight: 600 }}>
                    {a.gapMonthly > 100 ? money(a.gapMonthly) : "—"}
                  </td>
                  <td><TierChip tier={a.tier} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
