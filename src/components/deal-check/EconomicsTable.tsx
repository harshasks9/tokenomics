import { ROUTES, ROUTE_LABEL, type Result, type Route, type Totals } from "@/lib/deal-check/engine";
import { pct, usd } from "@/lib/deal-check/format";

type Row = { label: string; get: (t: Totals) => string; dim?: boolean; total?: boolean };

const ROWS: Row[] = [
  { label: "Anthropic spend (after discounts)", get: (t) => usd(t.anthropicSpend) },
  { label: "Gemini spend", get: (t) => usd(t.geminiSpend) },
  { label: "Migration cost", get: (t) => usd(t.mig) },
  { label: "Credits earned", get: (t) => usd(t.creditsEarned) },
  { label: "Credits usable within horizon", get: (t) => usd(t.creditsUsed) },
  { label: "Effective incentive (usable ÷ model spend)", get: (t) => pct(t.effectiveIncentive), dim: true },
  { label: "Stranded commit within horizon", get: (t) => usd(t.strandedWithin) },
  { label: "Incremental commit required", get: (t) => t.incrementalCommitKind === "none" ? "—" : `${usd(t.incrementalCommit)} ${t.incrementalCommitKind}`, dim: true },
  { label: "Net economic cost", get: (t) => usd(t.net), total: true },
  { label: "Stranding projected beyond horizon", get: (t) => usd(t.strandedBeyond), dim: true },
];

export default function EconomicsTable({ result }: { result: Result }) {
  const best = (["aws", "gcp"] as Route[]).reduce((b, r) => (result.routes[r].totals.net < result.routes[b].totals.net ? r : b), "aws" as Route);
  return (
    <div className="dc-tablewrap">
      <table className="dc-table">
        <thead>
          <tr>
            <th>$M over {result.horizon} months</th>
            {ROUTES.map((r) => <th key={r}><span className={`dc-swatch ${r === "gcp" ? "google" : r}`} />{ROUTE_LABEL[r]}{r === best ? " ✓" : ""}</th>)}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className={row.total ? "total" : undefined}>
              <td>{row.label}</td>
              {ROUTES.map((r) => <td key={r} className={row.dim ? "dim" : undefined}>{row.get(result.routes[r].totals)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
