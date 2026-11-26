"use client";

import earnings from "@/lib/subsidy-math/earnings.json";
import { Explain, LineChart, Tag } from "./ui";

type S = { company: string; metric: string; unit: string; values: Record<string, number> };
const Q = earnings._meta.quarters as string[];
const SERIES = earnings.series as S[];
const get = (company: string, metric: string) => {
  const s = SERIES.find((x) => x.company === company && x.metric === metric);
  if (!s) throw new Error(`missing series ${company} / ${metric}`);
  return Q.map((q) => (q in s.values ? s.values[q] : null));
};
const short = (q: string) => q.replace(/Q(\d) 20(\d\d)/, "Q$1 '$2");
const ttm = (v: (number | null)[]) => v.map((_, i) => (i < 3 ? null : v.slice(i - 3, i + 1).reduce<number>((a, b) => a + (b ?? 0), 0)));
const ratio = (a: (number | null)[], b: (number | null)[]) => a.map((x, i) => (x === null || !b[i] ? null : x / (b[i] as number)));

/** Section: what the reported results actually show (nine quarters). */
export default function ReportCards() {
  const x = Q.map(short);
  const awsMargin = get("AWS", "Segment operating margin");
  const gcMargin = get("Google Cloud", "Segment operating margin");
  const gcBurdened = get("Google Cloud", "Margin if charged its revenue share (24%) of Alphabet-level AI costs");
  const msA = get("Microsoft", "Agents & Infra segment operating margin (recast)");
  const msGM = get("Microsoft", "Microsoft Cloud gross margin");
  const awsCapexDep = ratio(get("AWS", "Segment property & equipment additions"), get("AWS", "Segment depreciation & amortization"));
  const gCapexDep = ratio(get("Alphabet", "Capital expenditures"), get("Alphabet", "Depreciation of property & equipment"));
  const mCapexDep = ratio(get("Microsoft", "Capex including finance leases"), get("Microsoft", "Depreciation expense"));
  const amznFcf = get("Amazon", "Free cash flow, trailing twelve months").map((v, i) => (i < 3 || v === null ? null : v / 1000));
  const gFcf = ttm(get("Alphabet", "Free cash flow (quarter)")).map((v) => (v === null ? null : v / 1000));
  const mFcf = ttm(get("Microsoft", "Free cash flow (CFO less cash PP&E, quarter)")).map((v) => (v === null ? null : v / 1000));

  return (
    <>
      <div className="sm-grid c2">
        <div className="sm-panel">
          <h3>Cloud operating margins</h3>
          <p className="sm-src">Segment operating income ÷ segment revenue. Microsoft: its new Agents &amp; Infra segment (recast).</p>
          <LineChart ariaLabel="Cloud segment operating margins, nine quarters" x={x} yFormat={(v) => `${v.toFixed(0)}%`} yMin={0} yMax={60}
            series={[
              { key: "ms", label: "Microsoft Agents & Infra", short: "Microsoft", color: "var(--msft)", values: msA },
              { key: "aws", label: "AWS", color: "var(--aws)", values: awsMargin },
              { key: "gc", label: "Google Cloud (reported)", short: "Google Cloud", color: "var(--google)", values: gcMargin },
              { key: "gcb", label: "Google Cloud, charged 24% of Alphabet's AI model costs", short: "GC burdened", color: "var(--google)", values: gcBurdened, dash: true },
            ]} />
          <p className="sm-caveat">No cloud discloses the margin on AI workloads, let alone on third-party models. AWS management says AI margins are &ldquo;still lower&rdquo; than core but improving <Tag b="R" />.</p>
        </div>
        <div className="sm-panel">
          <h3>Microsoft Cloud gross margin</h3>
          <p className="sm-src">The only cloud that reports a gross margin — and explains the drop.</p>
          <LineChart ariaLabel="Microsoft Cloud gross margin" x={x} yFormat={(v) => `${v.toFixed(0)}%`} yMin={60} yMax={74}
            series={[{ key: "gm", label: "Microsoft Cloud GM", color: "var(--msft)", values: msGM }]} />
          <p className="sm-caveat">Down 5 points in two years. Microsoft&apos;s filings blamed &ldquo;scaling our AI infrastructure&rdquo; every quarter to March 2026, then switched to &ldquo;sales mix shift to Azure&rdquo; <Tag b="D" />. Operating margin held, because AI revenue arrives with little extra sales cost.</p>
        </div>
        <div className="sm-panel">
          <h3>Building ahead: spending vs depreciation</h3>
          <p className="sm-src">Capital spending ÷ depreciation in the same quarter (×). Above 1× means the cost of today&apos;s building hasn&apos;t hit profits yet.</p>
          <LineChart ariaLabel="Capex to depreciation ratio" x={x} yFormat={(v) => `${v.toFixed(1)}×`} yMin={0}
            series={[
              { key: "g", label: "Alphabet (capex ÷ depreciation)", short: "Alphabet", color: "var(--google)", values: gCapexDep },
              { key: "a", label: "AWS (P&E additions ÷ D&A)", short: "AWS", color: "var(--aws)", values: awsCapexDep },
              { key: "m", label: "Microsoft (capex incl. leases ÷ depreciation)", short: "Microsoft", color: "var(--msft)", values: mCapexDep },
            ]} />
          <p className="sm-caveat">Depreciation is growing 49–63% a year at Alphabet and AWS and will keep rising as today&apos;s buildings switch on — the margin test is still ahead for everyone, Google included.</p>
        </div>
        <div className="sm-panel">
          <h3>Free cash flow, last twelve months ($B)</h3>
          <p className="sm-src">Company definitions (Amazon, Alphabet); Microsoft = operating cash flow − cash capex.</p>
          <LineChart ariaLabel="Trailing twelve month free cash flow" x={x} yFormat={(v) => `$${v.toFixed(0)}B`} zeroLine
            series={[
              { key: "m", label: "Microsoft", color: "var(--msft)", values: mFcf },
              { key: "g", label: "Alphabet", color: "var(--google)", values: gFcf },
              { key: "a", label: "Amazon", color: "var(--aws)", values: amznFcf },
            ]} />
          <p className="sm-caveat">Amazon&apos;s trailing free cash flow turned negative in 2026 (−$42B) and Alphabet&apos;s quarterly free cash flow went negative in Q2 and Q3 2026. Nobody is funding the build-out from spare cash any more.</p>
        </div>
      </div>
      <div className="sm-table-wrap" style={{ marginTop: 16 }}>
        <table>
          <thead><tr><th>Nine months to Sep 2026</th><th className="num">Gains on AI-lab stakes</th><th className="num">Operating income</th><th>Where the gains sit</th></tr></thead>
          <tbody>
            <tr><td>Amazon (Anthropic)</td><td className="num">≈ $67B <Tag b="C" /></td><td className="num">$79.4B</td><td>Other income — none in AWS&apos;s segment profit</td></tr>
            <tr><td>Alphabet (mostly Anthropic, plus SpaceX)</td><td className="num">$127.3B <Tag b="D" /></td><td className="num">$121.0B</td><td>Other income — none in Google Cloud&apos;s segment profit</td></tr>
            <tr><td>Microsoft (OpenAI, Sep-26 quarter)</td><td className="num">+$0.3B <Tag b="D" /></td><td className="num">—</td><td>Other income; was a drag of up to −$4.1B a quarter in 2025</td></tr>
          </tbody>
        </table>
      </div>
      <Explain>
        <b>What the report cards can and can&apos;t tell us.</b> They show that AWS and Microsoft are <i>not</i> losing money on AI at the segment level: AWS margins are near record highs while it grows 39%. They do <i>not</i> show whether third-party model sales are less profitable than first-party ones — no company splits that out. And they show that a large share of all three companies&apos; 2026 profits comes from paper gains on AI-lab stakes, which sit outside the cloud businesses.
      </Explain>
    </>
  );
}
