"use client";

import { RANK_LABEL, type GeminiPlay, type Result, type ReverseSolve } from "@/lib/deal-check/engine";
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

export default function Verdict({ result, solve, play, customer }: { result: Result; solve: ReverseSolve; play: GeminiPlay; customer?: string }) {
  const { inputs: i, routes } = result;
  const a = routes.aws.totals, g = routes.gcp.totals;
  const winner = result.advantage >= 0 ? "Google" : "AWS";
  const change = solve.smallest ? changeSentence(solve.smallest, solve.gcpAhead) : solve.gcpAhead ? "No single input in the tested ranges flips the verdict to AWS." : "No single input in the tested ranges flips the verdict to Google.";
  const pos = scalePosition(result);
  const playLine = play.winsNow
    ? (i.geminiShare > 0 ? `With ${i.geminiShare}% of the traffic on Gemini, Google is ahead; the Anthropic bill is ${i.geminiShare}% lower.` : "Google is ahead without any Gemini offload.")
    : play.minShare === null ? "No Gemini share beats AWS with these assumptions." : `Serve ${play.minShare.toFixed(0)}% of the traffic with Gemini and Google beats AWS; the rest stays on Anthropic with credits.`;

  return (
    <section className="dc-hero" aria-label="Verdict">
      <div className="dc-hero-main">
        <div className="dc-hero-rank">
          <span className={`dc-pill ${result.rank}`}>{RANK_LABEL[result.rank]}</span>
          <span className="dc-hero-when">{customer ? `${customer} · ` : ""}{result.horizon} months</span>
        </div>
        <div className="dc-hero-num">{usd(Math.abs(result.advantage))}</div>
        <div className="dc-hero-sub">{winner} cheaper by {pct(Math.abs(result.advPct))} of the larger net cost{result.doNothingBest ? "; staying put beats both" : ""}.</div>
        <div className="dc-hero-line"><b>Break-even</b> {result.breakEven === null ? "Google never stays ahead within the horizon" : `Google ahead on cumulative cost from month ${result.breakEven}`}</div>
        <div className="dc-hero-line"><b>The play</b> {playLine}</div>
        <div className="dc-hero-line"><b>{solve.gcpAhead ? "For AWS to win" : "For Google to win"}</b> {change}</div>
      </div>
      <div className="dc-hero-tiles">
        <div className="dc-stat">
          <div className="k">Today</div>
          <div className="v">{usd(i.anthSpend)}<span className="unit">/yr</span></div>
          <div className="s">Anthropic spend {PLATFORM_LABEL[i.platform]}, {i.growth}%/yr growth, {i.migPct}% moving from month {i.migStart}</div>
        </div>
        <div className="dc-stat aws">
          <div className="k">AWS MAP 2.0</div>
          <div className="row"><span>Usable credits</span><b>{usd(a.creditsUsed)}</b></div>
          <div className="row"><span>Effective incentive</span><b>{pct(a.effectiveIncentive)}</b></div>
          <div className="row"><span>Net cost</span><b>{usd(a.net)}</b></div>
          <div className="s">Field-reported terms, unverified</div>
        </div>
        <div className="dc-stat google">
          <div className="k">Google offer</div>
          <div className="row"><span>Usable credits</span><b>{usd(g.creditsUsed)}</b></div>
          <div className="row"><span>Effective incentive</span><b>{pct(g.effectiveIncentive)}</b></div>
          <div className="row"><span>Net cost</span><b>{usd(g.net)}</b></div>
          <div className="s">{routes.gcp.google.eligible ? (i.geminiShare > 0 ? `Includes ${usd(g.geminiSpend)} of Gemini spend` : "Documented terms") : "Not eligible below $10M iACV"}</div>
        </div>
      </div>
      <div className="dc-scale-wrap">
        <div className="dc-scale" aria-hidden="true">
          <div className="bar" />
          {[45, 55, 75].map((x) => <div key={x} className="tick" style={{ left: `${x}%` }} />)}
          <div className="marker" style={{ left: `${pos}%` }} title={RANK_LABEL[result.rank]} />
        </div>
        <div className="dc-scale-labels"><span>AWS win</span><span>Close</span><span>GCP win</span><span>Strong GCP win</span></div>
      </div>
    </section>
  );
}
