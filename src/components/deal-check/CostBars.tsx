import type { Result } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";

/** What each program leaves the customer paying, as one bar per program: gross bill with the credit shown as the part that comes off. */
export default function CostBars({ result }: { result: Result }) {
  const a = result.routes.aws.totals, g = result.routes.gcp.totals;
  const rows = [
    { key: "aws", label: "AWS MAP 2.0", cls: "aws", gross: a.gross + a.mig + a.strandedWithin, credit: a.creditsUsed, net: a.net, extra: a.strandedWithin + a.mig },
    { key: "google", label: "Google offer", cls: "google", gross: g.gross + g.mig + g.strandedWithin, credit: g.creditsUsed, net: g.net, extra: g.strandedWithin + g.mig },
  ];
  const scale = Math.max(...rows.map((r) => r.gross), 0.1);
  const w = (v: number) => `${Math.max(0, (v / scale) * 100)}%`;
  return (
    <div className="dc-costbars">
      {rows.map((r) => (
        <div key={r.key} className={`dc-costbar ${r.cls}`}>
          <div className="lab"><span><span className={`dc-swatch ${r.cls}`} />{r.label}</span><b>pays {usd(r.net)}</b></div>
          <div className="track">
            <div className="gross" style={{ width: w(r.gross) }} />
            <div className="net" style={{ width: w(r.net) }} />
          </div>
          <div className="note">
            {usd(r.gross - r.extra)} of model spend{r.extra > 0.005 ? ` + ${usd(r.extra)} migration and unused commit` : ""}{r.credit > 0.005 ? `, minus ${usd(r.credit)} of credits they can use` : ", no usable credits"}.
          </div>
        </div>
      ))}
    </div>
  );
}
