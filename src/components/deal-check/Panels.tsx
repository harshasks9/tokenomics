import { ASSUMPTIONS, AWS, GOOGLE, SOURCE_LABEL, type Term } from "@/lib/deal-check/terms";

function TermList({ terms }: { terms: Term<unknown>[] }) {
  return (
    <dl>
      {terms.map((t) => (
        <div key={t.label} style={{ display: "contents" }}>
          <dt>{t.label} <span className={`dc-tag ${t.source}`}>{SOURCE_LABEL[t.source]}</span></dt>
          <dd>{Array.isArray(t.value) ? <ol style={{ margin: 0, paddingLeft: 18 }}>{t.value.map((v) => <li key={String(v)}>{String(v)}</li>)}</ol> : typeof t.value === "object" ? JSON.stringify(t.value) : String(t.value)}{t.note ? ` — ${t.note}` : ""}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Methodology() {
  return (
    <details>
      <summary>Methodology</summary>
      <p>Thirty-six months are simulated from Sep 2026 on identical Anthropic spend under three routes: stay put with no program, the workload on AWS Bedrock under MAP 2.0, and the workload on GCP marketplace under the Private Offer. A route counts as a migration only when it moves the workload off its current platform; migrating routes carry the one-off migration cost and ramp the moved share linearly.</p>
      <p><b>AWS MAP.</b> Tagged Bedrock spend is measured quarterly against the prior-year baseline (year 1) or the previous program year (later years, extension) or zero (partner restructure). The credit rate plus any partner pass-back applies to the incremental amount. Credits are held until cumulative tagged spend reaches 10% of committed ARR, settle at quarter end, and are applied from the following month against Bedrock plus other AWS spend, scaled by consumability.</p>
      <p><b>Google Private Offer.</b> Requires a new GCP commitment of at least $10M iACV. For the twelve months from signing, each quarter&apos;s top-line (undiscounted) marketplace spend above the last-full-quarter × 4 baseline earns the credit rate. The pool is sized at signing on the forecast year-one incremental spend and capped at $5M per account; credits are delivered as spend milestones, which the model approximates as quarterly settlement of accrued credit up to the pool. Credits can only be applied against eligible Cloud AI spend from the following month.</p>
      <p><b>Commits.</b> The existing AWS commit is consumed by Bedrock plus other AWS spend; whatever is unconsumed at term end is charged as stranded. GCP commits are consumed by counted marketplace spend (capped at the marketplace share of the commit in force unless an exception is granted) plus Cloud AI and other GCP spend, existing commit first, then the active new leg. Each new leg strands its shortfall in its final month. Commits ending after the horizon are projected at the last month&apos;s run-rate and reported separately. The AWS soft commit strands nothing.</p>
      <p><b>Net economic cost</b> = spend after discounts + migration cost + stranded commit recognised within the horizon − credits actually applied. Advantage = AWS net cost − Google net cost; a positive figure favours Google. Strong GCP win: advantage ≥ $3M, or ≥ 10% and ≥ $0.5M. GCP win: ≥ 2%. Close: within ±2%. Otherwise AWS win.</p>
      <p><b>Stated assumptions.</b></p>
      <ul>{ASSUMPTIONS.map((a) => <li key={a.label}><b>{a.value}.</b> {a.note}</li>)}</ul>
    </details>
  );
}

export function Sources() {
  return (
    <details>
      <summary>Sources and program terms</summary>
      <h3>Google Private Offer — internal sales summary (documented)</h3>
      <TermList terms={Object.values(GOOGLE) as Term<unknown>[]} />
      <h3>AWS MAP 2.0 — field-reported from one region, unverified</h3>
      <TermList terms={Object.values(AWS) as Term<unknown>[]} />
      <p>Everything not listed above — migration cost, platform discounts, other cloud spend, commit balances, eligible Cloud AI consumption, growth, credit consumability, migration share and timing, horizon — is an editable assumption, tagged as such next to each input.</p>
    </details>
  );
}
