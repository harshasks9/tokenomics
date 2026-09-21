"use client";

import { COMMITMENT, REQUIRED_USERS_M12, TERM_MONTHS, readout, type Result } from "@/lib/mdes/engine";
import { exactUsd, exactUsers, month, pct, usd, users } from "@/lib/mdes/format";

function Kpi({ k, v, s, title, tone }: { k: string; v: string; s?: string; title?: string; tone?: "good" | "warn" | "bad" | "neutral" }) {
  return (
    <div className={`mg-kpi ${tone ?? "neutral"}`}>
      <div className="k">{k}</div>
      <div className="v" title={title}>{v}</div>
      {s && <div className="s">{s}</div>}
    </div>
  );
}

export default function Kpis({ result }: { result: Result }) {
  const r = result;
  const n = r.window;
  const ext = n > TERM_MONTHS;
  const utilTone = r.total.utilization >= 0.999 ? "good" : r.total.utilization >= 0.8 ? "warn" : "bad";
  return (
    <>
      <div className="mg-terms" aria-label="Baseline terms">
        <span className="mg-badge contract">Contract</span>
        <span title={exactUsd(COMMITMENT)}><b>{usd(COMMITMENT, 1)}</b> commitment</span>
        <span>12 months · Oct 2026 – Sep 2027 · final term ends 14 Sep 2027</span>
        <span><b>$2.00</b> per user per month (list $5 − 60%)</span>
        <span title={exactUsers(REQUIRED_USERS_M12)}><b>{users(REQUIRED_USERS_M12)}</b> users at term end</span>
        <span>Ordered ramp 100K → 650K · <b>5.4M</b> user-months</span>
      </div>

      <div className="mg-kpis">
        <Kpi k="Utilization" v={pct(r.total.utilization)} s={`${usd(r.total.consumption)} of ${usd(COMMITMENT, 1)} over ${n} months`} title={exactUsd(r.total.consumption)} tone={utilTone} />
        <Kpi k="Unconsumed commitment" v={usd(r.total.unconsumed)} s={r.total.unconsumed > 0 ? (ext ? `${usd(r.term.unconsumed)} at Month 12 · still owed in full` : "still owed in full") : ext ? `${usd(r.term.unconsumed)} at Month 12` : "fully consumed"} title={exactUsd(r.total.unconsumed)} tone={r.total.unconsumed > 0 ? "bad" : "good"} />
        <Kpi k="Spend above commitment" v={usd(r.total.above)} s={r.total.above > 0 ? "additional spend, not credit" : "none"} title={exactUsd(r.total.above)} tone={r.total.above > 0 ? "warn" : "neutral"} />
        <Kpi k="Completion month" v={month(r.completionMonth)} s={r.completionMonth === null ? (r.monthsBeyondWindowEstimate ? `≈ ${r.monthsBeyondWindowEstimate} more months at final run rate` : "not within window") : r.extraMonths ? `${r.extraMonths} months beyond the term` : "inside the 12-month term"} tone={r.completionMonth === null ? "bad" : r.extraMonths ? "warn" : "good"} />
        <Kpi k={`Users at term end · M${r.termEnd.month}`} v={users(r.termEnd.billed)} s={r.termEnd.met ? `meets the ${users(REQUIRED_USERS_M12)} requirement` : `${users(r.termEnd.shortfallUsers)} short of ${users(REQUIRED_USERS_M12)}`} title={`${exactUsers(r.termEnd.billed)} in M${r.termEnd.month}${r.termEnd.month === 11 ? " (last ordered month; the final term ends 14 Sep 2027)" : ""}`} tone={r.termEnd.met ? "good" : "bad"} />
        <Kpi k="Average billed users" v={users(r.avgBilled12)} s={`${users(r.userMonths12)} user-months in the term · contract 450K`} title={exactUsers(r.avgBilled12)} tone={r.avgBilled12 >= 450_000 ? "good" : "warn"} />
      </div>

      <div className="mg-readout">
        <p>{readout(r)}</p>
        {r.errors.map((e) => <p key={e} className="mg-flag bad">{e}</p>)}
        {r.approvals.length > 0 && (
          <div className="mg-flags">
            <div className="mg-flags-h">Approval dependencies</div>
            {r.approvals.map((a) => <p key={a} className="mg-flag proposed">{a}</p>)}
          </div>
        )}
        {r.warnings.map((w) => <p key={w} className="mg-flag warn">{w}</p>)}
      </div>
    </>
  );
}
