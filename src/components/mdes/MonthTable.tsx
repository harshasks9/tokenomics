"use client";

import { TERM_MONTHS, type Inputs, type Result } from "@/lib/mdes/engine";
import { exactUsd, exactUsers, price, usd, users } from "@/lib/mdes/format";
import Field from "./Field";
import { setMonthUsers } from "./UsersChart";

interface Props {
  result: Result;
  update: (patch: Partial<Inputs> | ((prev: Inputs) => Partial<Inputs>)) => void;
}

function U({ v }: { v: number }) {
  return <span title={exactUsers(v)}>{users(v)}</span>;
}
function D({ v, dim }: { v: number; dim?: boolean }) {
  return <span title={exactUsd(v)} className={dim && v === 0 ? "dim" : undefined}>{usd(v)}</span>;
}

export default function MonthTable({ result, update }: Props) {
  const { inputs } = result;
  const linked = inputs.billedLinked;
  const gcpOn = inputs.gcp.enabled;

  const setAdoption = (m: number, v: number) => update((prev) => {
    if (m > TERM_MONTHS) return setMonthUsers(prev, m, v);
    const adoption = prev.adoption.slice();
    adoption[m - 1] = Math.max(0, Math.round(v));
    return { ramp: { ...prev.ramp, preset: "custom" }, adoption, billed: prev.billedLinked ? adoption : prev.billed };
  });
  const setBilled = (m: number, v: number) => update((prev) => {
    if (m > TERM_MONTHS) return setMonthUsers(prev, m, v);
    const billed = prev.billed.slice();
    billed[m - 1] = Math.max(0, Math.round(v));
    return { ramp: { ...prev.ramp, preset: "custom" }, billed };
  });
  const setExtGcp = (m: number, v: number) => update((prev) => {
    const extGcp = prev.timeline.extGcp.slice();
    while (extGcp.length < prev.timeline.windowMonths - TERM_MONTHS) extGcp.push(null);
    extGcp[m - TERM_MONTHS - 1] = Math.max(0, v);
    return { timeline: { ...prev.timeline, extGcp } };
  });

  return (
    <div className="mg-tablewrap">
      <table className="mg-table">
        <thead>
          <tr>
            <th>Month</th>
            <th className="num" title="Ordered units on the Order Form">Ordered</th>
            <th className="num">Adoption</th>
            <th className="num">Billed</th>
            <th className="num">Price</th>
            <th className="num">GE spend</th>
            {gcpOn && <th className="num">GCP eligible</th>}
            {gcpOn && <th className="num">GCP counted</th>}
            <th className="num">Consumption</th>
            <th className="num">Cumulative</th>
            <th className="num">Remaining</th>
            <th className="num">Above</th>
          </tr>
        </thead>
        <tbody>
          {result.months.map((r) => (
            <tr key={r.m} className={`${r.isExtension ? "ext" : ""}${result.completionMonth === r.m ? " done" : ""}${r.m === TERM_MONTHS ? " m12" : ""}`}>
              <td className="mo">
                <b>M{r.m}</b> <span className="cal">{r.label.split(" · ")[1]}</span>
                {r.isExtension && <span className="mg-badge proposed tiny">ext</span>}
              </td>
              <td className="num" title={r.isExtension ? "No order term beyond the Order Form" : r.m === 12 ? "No order term starts in M12: the final term ends 14 Sep 2027" : exactUsers(r.contracted)}>{r.isExtension ? "—" : r.m === 12 ? <span className="dim">term ends 14 Sep</span> : users(r.contracted)}</td>
              <td className="num edit">
                {r.isExtension && !linked ? <U v={r.adoption} /> : (
                  <Field compact kind="users" value={r.adoption} min={0} ariaLabel={`Adoption month ${r.m}`} onCommit={(v) => setAdoption(r.m, v)} />
                )}
              </td>
              <td className="num edit">
                {linked ? <U v={r.billed} /> : (
                  <Field compact kind="users" value={r.billed} min={0} ariaLabel={`Billed users month ${r.m}`} onCommit={(v) => setBilled(r.m, v)} />
                )}
              </td>
              <td className="num">{price(r.pupm)}</td>
              <td className="num"><D v={r.geSpend} /></td>
              {gcpOn && (
                <td className="num edit">
                  {r.isExtension ? (
                    <Field compact kind="usd" prefix="$" value={r.gcpEligible} min={0} ariaLabel={`Eligible GCP spend month ${r.m}`} onCommit={(v) => setExtGcp(r.m, v)} />
                  ) : <D v={r.gcpEligible} dim />}
                </td>
              )}
              {gcpOn && <td className="num"><D v={r.gcpCounted} dim /></td>}
              <td className="num"><D v={r.consumption} /></td>
              <td className="num"><D v={r.cumConsumption} /></td>
              <td className="num"><D v={r.remaining} dim /></td>
              <td className="num"><D v={r.above} dim /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total · {result.window} mo</td>
            <td className="num" title={exactUsers(result.contractedUserMonths)}>{users(result.contractedUserMonths)}</td>
            <td className="num" title={exactUsers(result.months.reduce((s, r) => s + r.adoption, 0))}>{users(result.months.reduce((s, r) => s + r.adoption, 0))}</td>
            <td className="num" title={exactUsers(result.months.reduce((s, r) => s + r.billed, 0))}>{users(result.months.reduce((s, r) => s + r.billed, 0))}</td>
            <td />
            <td className="num"><D v={result.total.geSpend} /></td>
            {gcpOn && <td className="num"><D v={result.total.gcpEligible} /></td>}
            {gcpOn && <td className="num"><D v={result.total.gcpCounted} /></td>}
            <td className="num"><D v={result.total.consumption} /></td>
            <td />
            <td className="num"><D v={result.total.unconsumed} /></td>
            <td className="num"><D v={result.total.above} /></td>
          </tr>
        </tfoot>
      </table>
      <p className="mg-hint">
        Adoption{linked ? "" : " and billed"} cells are editable; editing switches the ramp to Custom. Ordered units are the Order Form quantities and are invoiced as signed.
        {result.window > TERM_MONTHS && " Extension rows (ext) hold the term-end values until edited — a proposed exception, not a contractual right."}
        {gcpOn && " In the term, eligible GCP spend is the monthly figure from the GCP panel; extension months can be edited here."}
      </p>
    </div>
  );
}
