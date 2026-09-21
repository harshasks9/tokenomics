import { COMMITMENT, REQUIRED_USERS_M12, readout, type Result } from "@/lib/mdes/engine";
import { month, pct, price, usd, users } from "@/lib/mdes/format";

/** Print-only one-page summary (hidden on screen via CSS). */
export default function PrintSummary({ result }: { result: Result }) {
  const r = result;
  return (
    <div className="mg-print" aria-hidden>
      <h1>MDES × Human Intelligence — Gemini Enterprise commitment plan</h1>
      <p className="sub">Printed {new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} · Internal · Proposed flexibility is not approved</p>
      <div className="row">
        <div><b>Commitment</b> {usd(COMMITMENT, 1)} · 12 months, Oct 2026 – Sep 2027 (final order term ends 14 Sep 2027) · Gemini Enterprise for EDU · $2.00 per user per month · 650K users at term end</div>
      </div>
      <div className="kpis">
        <div><span>Utilization</span><b>{pct(r.total.utilization)}</b></div>
        <div><span>Consumption ({r.window} mo)</span><b>{usd(r.total.consumption)}</b></div>
        <div><span>Unconsumed</span><b>{usd(r.total.unconsumed)}</b></div>
        <div><span>Above commitment</span><b>{usd(r.total.above)}</b></div>
        <div><span>Completion month</span><b>{month(r.completionMonth)}</b></div>
        <div><span>Users at term end (M{r.termEnd.month})</span><b>{users(r.termEnd.billed)} {r.termEnd.met ? "✓" : `(below ${users(REQUIRED_USERS_M12)})`}</b></div>
      </div>
      <p>{readout(r)}</p>
      <h2>Assumptions</h2>
      <ul>
        <li>Price {price(r.inputs.pupm)} per user per month in the term{r.window > 12 ? `; ${price(r.inputs.timeline.extPupm ?? r.inputs.pupm)} in extension months (assumption)` : ""}.</li>
        <li>Billed users {r.inputs.billedLinked ? "equal adoption" : "modelled separately from adoption"}.</li>
        <li>GCP allocation {r.inputs.gcp.enabled ? `on: ${usd(r.inputs.gcp.monthly)} per month from M${r.inputs.gcp.startMonth}${r.gcp.cap !== null ? `, capped at ${usd(r.gcp.cap)}` : ""} (proposed)` : "off"}.</li>
        <li>Spending window {r.window} months{r.window > 12 ? " (proposed extension; term-end milestone unchanged)" : " (as contracted)"}.</li>
      </ul>
      {r.approvals.length > 0 && (
        <>
          <h2>Approval dependencies</h2>
          <ul>{r.approvals.map((a) => <li key={a}>{a}</li>)}</ul>
        </>
      )}
      <h2>Monthly plan</h2>
      <table>
        <thead><tr><th>Month</th><th>Ordered</th><th>Billed</th><th>GE spend</th>{r.inputs.gcp.enabled && <th>GCP counted</th>}<th>Cumulative</th><th>Remaining</th></tr></thead>
        <tbody>
          {r.months.map((m) => (
            <tr key={m.m}>
              <td>{m.label}{m.isExtension ? " (ext)" : ""}</td>
              <td>{m.isExtension ? "—" : users(m.contracted)}</td>
              <td>{users(m.billed)}</td>
              <td>{usd(m.geSpend)}</td>
              {r.inputs.gcp.enabled && <td>{usd(m.gcpCounted)}</td>}
              <td>{usd(m.cumConsumption)}</td>
              <td>{usd(m.remaining)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="foot">The full $10.8M is owed under the Order Form regardless of modelled consumption. Fees are non-refundable; unused units do not roll over. GCP allocation and spending beyond Month 12 are proposals subject to approval, not contractual rights.</p>
    </div>
  );
}
