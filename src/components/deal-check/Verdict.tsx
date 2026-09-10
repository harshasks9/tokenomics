"use client";

import type { ReactNode } from "react";
import { RANK_LABEL, type Result, type ReverseSolve } from "@/lib/deal-check/engine";
import { pct, usd } from "@/lib/deal-check/format";
import { changeSentence } from "@/lib/deal-check/summary";

const PLATFORM_LABEL = { direct: "direct with Anthropic", aws: "on AWS Bedrock", gcp: "on GCP marketplace" } as const;

/** Position of the verdict marker on the 0–100 scale. */
export function scalePosition(result: Result): number {
  const p = result.advPct;
  if (result.rank === "strong-gcp") return Math.max(78, Math.min(97, 75 + ((p - 0.1) / 0.1) * 25));
  if (p >= 0.02) return 55 + ((p - 0.02) / 0.08) * 20;
  if (p >= -0.02) return 45 + ((p + 0.02) / 0.04) * 10;
  return Math.max(3, 45 + ((p + 0.02) / 0.18) * 45);
}

export default function Verdict({ result, solve, tabs }: { result: Result; solve: ReverseSolve; tabs: ReactNode }) {
  const { inputs: i, routes } = result;
  const a = routes.aws.totals, g = routes.gcp.totals;
  const winner = result.advantage >= 0 ? "Google" : "AWS";
  const change = solve.smallest
    ? changeSentence(solve.smallest, solve.gcpAhead)
    : solve.gcpAhead ? "No single input in the tested ranges flips the verdict to AWS." : "No single input in the tested ranges flips the verdict to Google.";
  const pos = scalePosition(result);

  return (
    <section className="dc-card" aria-label="Verdict">
      <div className="dc-headrow">
        <h2 style={{ margin: 0 }}>Verdict at {result.horizon} months</h2>
        {tabs}
      </div>
      <div className="dc-verdict">
        <div className="dc-stat">
          <div className="k">Today&apos;s spend</div>
          <div className="v">{usd(i.anthSpend)}<span style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)" }}>/yr</span></div>
          <div className="s">{PLATFORM_LABEL[i.platform]}, {i.growth}%/yr growth, {i.migPct}% moving from month {i.migStart}</div>
        </div>
        <div className="dc-stat aws">
          <div className="k">AWS MAP 2.0 provides</div>
          <div className="row"><span>Usable credits</span><b>{usd(a.creditsUsed)}</b></div>
          <div className="row"><span>Effective incentive</span><b>{pct(a.effectiveIncentive)}</b></div>
          <div className="row"><span>Net cost</span><b>{usd(a.net)}</b></div>
          <div className="s">Field-reported terms, unverified</div>
        </div>
        <div className="dc-stat google">
          <div className="k">Google offer provides</div>
          <div className="row"><span>Usable credits</span><b>{usd(g.creditsUsed)}</b></div>
          <div className="row"><span>Effective incentive</span><b>{pct(g.effectiveIncentive)}</b></div>
          <div className="row"><span>Net cost</span><b>{usd(g.net)}</b></div>
          <div className="s">{routes.gcp.google.eligible ? "Documented terms" : "Not eligible below $10M iACV"}</div>
        </div>

        <div className="dc-verdict-main">
          <div>
            <div className="dc-stat" style={{ background: "transparent" }}>
              <div className="k">Who wins</div>
              <div style={{ marginTop: 6 }}><span className={`dc-pill ${result.rank}`}>{RANK_LABEL[result.rank]}</span></div>
              {result.doNothingBest && <div className="dc-note">Staying put beats both programs at this horizon.</div>}
            </div>
          </div>
          <div className="dc-stat">
            <div className="k">By how much</div>
            <div className="v">{usd(Math.abs(result.advantage))}</div>
            <div className="s">{winner} cheaper by {pct(Math.abs(result.advPct))} of the larger net cost</div>
          </div>
          <div className="dc-stat">
            <div className="k">Break-even</div>
            <div className="v">{result.breakEven === null ? "None" : `Month ${result.breakEven}`}</div>
            <div className="s">{result.breakEven === null ? "Google never stays ahead on cumulative cost within the horizon" : "Google ahead on cumulative cost from here through the horizon"}</div>
          </div>
        </div>
      </div>

      <div className="dc-change"><b>{solve.gcpAhead ? "For AWS to win: " : "For Google to win: "}</b>{change}</div>
      <div className="dc-note">{result.driver.sentence}</div>

      <div className="dc-scale" aria-hidden="true">
        <div className="bar" />
        {[45, 55, 75].map((x) => <div key={x} className="tick" style={{ left: `${x}%` }} />)}
        <div className="marker" style={{ left: `${pos}%` }} title={RANK_LABEL[result.rank]} />
      </div>
      <div className="dc-scale-labels"><span>AWS win</span><span>Close</span><span>GCP win</span><span>Strong GCP win</span></div>
    </section>
  );
}
