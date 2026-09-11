import { dealConstruct, type DealMeta } from "@/lib/deal-check/construct";
import type { Inputs, Result } from "@/lib/deal-check/engine";
import { usd } from "@/lib/deal-check/format";

const LABEL = { stop: "Stop", warn: "Check", ok: "OK", info: "" } as const;

export default function DealConstruct({ meta, inputs, result }: { meta: DealMeta; inputs: Inputs; result: Result }) {
  const c = dealConstruct(meta, inputs, result);
  return (
    <div>
      <p className="dc-note" style={{ marginTop: 0 }}>The Google Private Offer as it would be written for {meta.customer || "this customer"}: the checks the offer summary imposes, the credit pool it produces, and the approvals and steps it needs. Export the deal file to keep this.</p>
      {c.blockers.length > 0 && (
        <div className="dc-change" style={{ borderLeft: "4px solid var(--stop)" }}><b>Blocked:</b> {c.blockers.join(" ")}</div>
      )}
      <div className="dc-tablewrap">
        <table className="dc-table">
          <tbody>
            {c.rows.map((r) => (
              <tr key={r.label}>
                <td style={{ whiteSpace: "normal", fontWeight: 600, width: "26%" }}>{r.label}</td>
                <td className="why" style={{ color: "var(--ink)" }}>{r.value}{r.note && <div style={{ color: "var(--muted)", marginTop: 2 }}>{r.note}</div>}</td>
                <td style={{ width: 70 }}>{r.status !== "info" && <span className={`dc-flag-icon ${r.status === "ok" ? "info" : r.status}`}>{LABEL[r.status]}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dc-two-col" style={{ marginTop: 14 }}>
        <div>
          <h3 style={{ marginTop: 0 }}>Credit pool and milestones</h3>
          <p className="dc-note" style={{ marginTop: 0 }}>Pool {usd(c.pool)} on a forecast of {usd(c.forecastY1)} incremental marketplace spend in year one. Four equal milestones are an assumption; the offer defines milestone delivery but not the schedule.</p>
          <div className="dc-tablewrap"><table className="dc-table"><thead><tr><th>#</th><th>Cumulative incremental</th><th>Credit</th></tr></thead><tbody>
            {c.milestones.map((m) => <tr key={m.index}><td>{m.index}</td><td>{usd(m.threshold)}</td><td>{usd(m.tranche)}</td></tr>)}
          </tbody></table></div>
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>Approvals required</h3>
          <ul className="dc-flags">{c.approvals.map((a) => <li key={a}><span className="dc-flag-icon info">Approval</span><span>{a}</span></li>)}</ul>
          <h3>How to request</h3>
          <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)" }}>{c.steps.map((s) => <li key={s} style={{ margin: "3px 0" }}>{s}</li>)}</ol>
        </div>
      </div>
    </div>
  );
}
