"use client";

import { useMemo } from "react";
import { COMMITMENT, REQUIRED_USERS_M12, TERM_MONTHS, evaluate, solveExitUsers } from "@/lib/mdes/engine";
import { exactUsd, exactUsers, month, pct, price, usd, users } from "@/lib/mdes/format";
import { usePlan } from "@/lib/mdes/plan";
import { LAST_ORDERED_MONTH, TERM_END_DATE, monthLabel } from "@/lib/mdes/terms";
import SpendChart from "./SpendChart";
import UsersChart from "./UsersChart";

/**
 * Customer-facing view of the working plan. Read-only, print-ready, and free
 * of internal material: no price floor, no deal-desk wording, no scenario grid.
 * Anything not in the Order Form is labelled "subject to Google approval".
 */
export default function CustomerView({ plannerHref }: { plannerHref: string }) {
  const { inputs } = usePlan();
  const r = useMemo(() => evaluate(inputs), [inputs]);
  const solve = useMemo(() => solveExitUsers(inputs), [inputs]);

  const launchMonth = r.months.findIndex((m) => m.billed > 0) + 1;
  const reach650 = r.months.findIndex((m) => m.billed >= REQUIRED_USERS_M12) + 1;
  const belowOrdered = r.months.slice(0, LAST_ORDERED_MONTH).some((m) => m.billed < m.contracted);
  const aboveOrdered = r.months.slice(0, LAST_ORDERED_MONTH).some((m) => m.billed > m.contracted);
  const ext = r.window > TERM_MONTHS;
  const gcpOn = inputs.gcp.enabled && r.total.gcpEligible > 0;
  const priceNote = r.inputs.pupm !== 2;
  const options = [
    belowOrdered && "Aligning the ordered quantities on the Order Form to the plan above (an amendment to the Order Form).",
    aboveOrdered && "Adding users above the ordered quantities (a coterminous order form or amendment, as the Order Form allows).",
    gcpOn && `Counting eligible Google Cloud spend toward the commitment — ${usd(inputs.gcp.monthly)} per month from M${inputs.gcp.startMonth}${r.gcp.cap !== null ? `, up to ${usd(r.gcp.cap)}` : ""}.`,
    ext && `Using the commitment over ${r.window} months instead of 12, at ${price(r.inputs.timeline.extPupm ?? r.inputs.pupm)} per user per month in the additional months.`,
    priceNote && `A price of ${price(r.inputs.pupm)} per user per month instead of the ${price(2)} on the Order Form.`,
  ].filter((x): x is string => Boolean(x));
  const milestones: { m: number | null; text: string }[] = [
    { m: 1, text: "Program start; first order term begins on provisioning." },
    ...(launchMonth > 1 ? [{ m: launchMonth, text: "Planned public launch." }] : []),
    reach650 > 0 ? { m: reach650, text: `${users(REQUIRED_USERS_M12)} active licenses reached.` } : { m: null, text: `${users(REQUIRED_USERS_M12)} licenses not reached within the plan.` },
    ...(r.completionMonth !== null ? [{ m: r.completionMonth, text: "Full program value used." }] : []),
    { m: TERM_MONTHS, text: `Term ends ${TERM_END_DATE}.` },
  ].sort((a, b) => (a.m ?? 99) - (b.m ?? 99));

  return (
    <div className="mg-shell mg-cv">
      <header className="mg-top">
        <a className="mg-home" href={plannerHref}>← Planner</a>
        <div className="mg-title">
          <h1>Gemini Enterprise adoption plan</h1>
          <span className="mg-sub">Customer view · reflects the plan currently set in the planner</span>
        </div>
        <div className="mg-actions">
          <button type="button" className="mg-btn" onClick={() => window.print()}>Print / PDF</button>
        </div>
      </header>

      <section className="mg-cv-hero">
        <div className="mg-cv-brand">Ministry of Digital Economy and Society · Human Intelligence · Google Cloud</div>
        <h1>Gemini Enterprise for EDU — adoption plan</h1>
        <p>{TERM_MONTHS}-month program, October 2026 to September 2027. Prepared {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}. Indicative planning only; the signed Order Form governs.</p>
        <div className="mg-cv-terms">
          <div><span>Program value</span><b title={exactUsd(COMMITMENT)}>{usd(COMMITMENT, 1)}</b></div>
          <div><span>Price</span><b>{price(2)} <small>per user per month</small></b></div>
          <div><span>Users at term end</span><b title={exactUsers(REQUIRED_USERS_M12)}>{users(REQUIRED_USERS_M12)}</b></div>
          <div><span>Term ends</span><b>{TERM_END_DATE}</b></div>
        </div>
      </section>

      <div className="mg-kpis cv">
        <Kpi k="Planned users at term end" v={users(r.termEnd.billed)} s={r.termEnd.met ? `meets the ${users(REQUIRED_USERS_M12)} target` : `${users(r.termEnd.shortfallUsers)} below the ${users(REQUIRED_USERS_M12)} target`} title={exactUsers(r.termEnd.billed)} tone={r.termEnd.met ? "good" : "bad"} />
        <Kpi k="Program value used" v={pct(r.total.utilization)} s={`${usd(r.total.consumption)} of ${usd(COMMITMENT, 1)} over ${r.window} months`} title={exactUsd(r.total.consumption)} tone={r.total.utilization >= 0.999 ? "good" : r.total.utilization >= 0.8 ? "warn" : "bad"} />
        <Kpi k="Fully used by" v={month(r.completionMonth)} s={r.completionMonth === null ? "not within the plan window" : `${monthLabel(r.completionMonth)}${r.extraMonths ? ` · ${r.extraMonths} months after the term` : ""}`} tone={r.completionMonth === null ? "bad" : r.extraMonths ? "warn" : "good"} />
        <Kpi k="Average monthly users" v={users(r.avgBilled12)} s={`${users(r.userMonths12)} user-months in the term`} title={exactUsers(r.avgBilled12)} tone={r.avgBilled12 >= 450_000 ? "good" : "warn"} />
      </div>

      <section className="mg-card">
        <h2>The plan in one paragraph</h2>
        <p className="mg-cv-lead">
          Licenses start in {launchMonth > 0 ? `M${launchMonth} (${monthLabel(launchMonth)})` : "no month yet"}
          {reach650 > 0 ? ` and reach ${users(REQUIRED_USERS_M12)} users in M${reach650} (${monthLabel(reach650)})` : ` and do not reach ${users(REQUIRED_USERS_M12)} users within the plan`}.
          {" "}Over {r.window} months the plan uses {usd(r.total.consumption)} of the {usd(COMMITMENT, 1)} program value
          {r.total.unconsumed > 0 ? `, leaving ${usd(r.total.unconsumed)} unused` : r.total.above > 0 ? `, plus ${usd(r.total.above)} of additional usage above it` : ""}.
          {" "}Subscription fees follow the ordered quantities on the Order Form and are not reduced by lower usage, so the plan is built to turn the full program value into active learners.
        </p>
        {!r.termEnd.met && solve.feasible && solve.exitUsers !== null && (
          <p className="mg-hint">To use the full program value on this launch timing, the plan would need about {users(solve.exitUsers)} users by term end.</p>
        )}
      </section>

      <div className="mg-cv-two">
        <section className="mg-card">
          <div className="mg-headrow"><h2>Planned users by month</h2><span className="mg-hint">users in K · hover for exact</span></div>
          <UsersChart result={r} readOnly />
        </section>
        <section className="mg-card">
          <div className="mg-headrow"><h2>Program value used over time</h2><span className="mg-hint">USD in M · hover for exact</span></div>
          <SpendChart result={r} />
        </section>
      </div>

      <div className="mg-cv-two">
        <section className="mg-card">
          <h2>Milestones</h2>
          <ul className="mg-cv-list">
            {milestones.map((ms) => (
              <li key={ms.text}><b>{ms.m === null ? "—" : `M${ms.m} · ${monthLabel(ms.m)}`}</b> {ms.text}</li>
            ))}
          </ul>
        </section>
        <section className="mg-card">
          <h2>Who can be licensed</h2>
          <p className="mg-hint" style={{ marginTop: 0 }}>Per the Order Form, licenses go only to learners who complete the national programme:</p>
          <ol className="mg-cv-steps">
            <li>Identity verification through social login and Thai National ID, with the initial profiling assessments.</li>
            <li>Registration as a vocational participant under the national digital skilling framework.</li>
            <li>Completion of Level 1 to Level 3 AI certification on the MDES learning platform.</li>
            <li>Provisioning of a Gemini Enterprise license on completing Level 3.</li>
          </ol>
          <p className="mg-hint">The user plan above is therefore a certification-pipeline plan: each month&rsquo;s licenses are learners who have finished Level 3 by then.</p>
        </section>
      </div>

      {options.length > 0 && (
        <section className="mg-card mg-cv-options">
          <div className="mg-headrow"><h2>Options under discussion</h2><span className="mg-badge proposed">Subject to Google approval</span></div>
          <ul className="mg-cv-list plain">
            {options.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <p className="mg-hint">These are not part of the signed Order Form. They take effect only through a written amendment or new order form agreed with Google.</p>
        </section>
      )}

      <section className="mg-card">
        <div className="mg-headrow"><h2>Monthly plan</h2><span className="mg-hint">figures rounded; hover for exact</span></div>
        <div className="mg-tablewrap">
          <table className="mg-table">
            <thead>
              <tr>
                <th>Month</th>
                <th className="num">Planned users</th>
                <th className="num">Ordered on the Order Form</th>
                <th className="num">Monthly fees</th>
                {gcpOn && <th className="num">Google Cloud spend counted</th>}
                <th className="num">Cumulative</th>
                <th className="num">Program value remaining</th>
              </tr>
            </thead>
            <tbody>
              {r.months.map((m) => (
                <tr key={m.m} className={`${m.isExtension ? "ext" : ""}${m.m === TERM_MONTHS ? " m12" : ""}`}>
                  <td className="mo"><b>M{m.m}</b> <span className="cal">{m.label.split(" · ")[1]}{m.isExtension ? " · beyond the term" : ""}</span></td>
                  <td className="num" title={exactUsers(m.billed)}>{users(m.billed)}</td>
                  <td className="num" title={m.isExtension ? "No order term" : m.m === 12 ? `The final term ends ${TERM_END_DATE}` : exactUsers(m.contracted)}>{m.isExtension ? "—" : m.m === 12 ? <span className="dim">term ends</span> : users(m.contracted)}</td>
                  <td className="num" title={exactUsd(m.geSpend)}>{usd(m.geSpend)}</td>
                  {gcpOn && <td className="num" title={exactUsd(m.gcpCounted)}>{usd(m.gcpCounted)}</td>}
                  <td className="num" title={exactUsd(m.cumConsumption)}>{usd(m.cumConsumption)}</td>
                  <td className="num" title={exactUsd(m.remaining)}>{usd(m.remaining)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total · {r.window} months</td>
                <td className="num" title={exactUsers(r.months.reduce((s, m) => s + m.billed, 0))}>{users(r.months.reduce((s, m) => s + m.billed, 0))}</td>
                <td className="num">{users(r.contractedUserMonths)}</td>
                <td className="num" title={exactUsd(r.total.geSpend)}>{usd(r.total.geSpend)}</td>
                {gcpOn && <td className="num" title={exactUsd(r.total.gcpCounted)}>{usd(r.total.gcpCounted)}</td>}
                <td className="num" title={exactUsd(r.total.consumption)}>{usd(r.total.consumption)}</td>
                <td className="num" title={exactUsd(r.total.unconsumed)}>{usd(r.total.unconsumed)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <p className="mg-cv-foot">
        Indicative planning prepared by Human Intelligence with Google Cloud for MDES. Fees, quantities and dates are governed by the Google Cloud Addendum (Subscription Order Form) dated 17 September 2026. Subscription fees are invoiced monthly in arrears on the ordered quantities; unused licenses are not refunded or carried over. Any option listed as subject to approval is not yet agreed.
      </p>
    </div>
  );
}

function Kpi({ k, v, s, title, tone }: { k: string; v: string; s?: string; title?: string; tone?: "good" | "warn" | "bad" | "neutral" }) {
  return (
    <div className={`mg-kpi ${tone ?? "neutral"}`}>
      <div className="k">{k}</div>
      <div className="v" title={title}>{v}</div>
      {s && <div className="s">{s}</div>}
    </div>
  );
}
