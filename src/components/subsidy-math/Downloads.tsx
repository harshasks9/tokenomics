import Link from "next/link";
import sources from "@/lib/subsidy-math/sources.json";
import { Tag, type Basis } from "./ui";

const DOCS = [
  { href: "/subsidy-math/email", title: "A · Executive email", body: "A ~550-word note to JAPAC AI leaders: the most compelling insight, five defensible numbers, and what we do differently.", cta: "Read the email" },
  { href: "/subsidy-math/memo", title: "B · Financial research memo", body: "The full analysis: evidence, $100 waterfalls, calculations, sensitivity, counterarguments and conclusions, fully sourced.", cta: "Read the memo" },
  { href: "/subsidy-math/subsidy-math-model.xlsx", title: "C · Financial model (Excel)", body: "Every assumption adjustable, live formulas, scenario grid, break-evens, and one-time vs recurring incentives over 1, 3 and 5 years.", cta: "Download .xlsx", file: true },
  { href: "/subsidy-math/claims", title: "D · Claims audit", body: "What you can confidently say, what needs a caveat, and what you should not say — with the evidence behind each.", cta: "Read the audit" },
];

/** Section: the four deliverables plus the source register. */
export default function Downloads() {
  return (
    <>
      <div className="sm-grid c4">
        {DOCS.map((d) => (
          <div key={d.href} className="sm-card" style={{ display: "grid", gap: 10, alignContent: "space-between" }}>
            <div><h3>{d.title}</h3><p>{d.body}</p></div>
            {d.file ? <a className="sm-btn" href={d.href} download>{d.cta}</a> : <Link className="sm-btn" href={d.href} prefetch={false}>{d.cta}</Link>}
          </div>
        ))}
      </div>
      <h3 style={{ marginTop: 28 }}>Source register</h3>
      <div className="sm-table-wrap">
        <table>
          <thead><tr><th>Claim</th><th>Value</th><th>Period</th><th>Source</th><th>Basis</th></tr></thead>
          <tbody>
            {(sources as { id: string; claim: string; value: string; period: string; source: string; url: string; location: string; basis: Basis; confidence: string }[]).map((s) => (
              <tr key={s.id}>
                <td>{s.claim}</td>
                <td>{s.value}</td>
                <td style={{ whiteSpace: "nowrap" }}>{s.period}</td>
                <td><a href={s.url} target="_blank" rel="noopener noreferrer">{s.source}</a>{s.location && s.location !== "—" ? `, ${s.location}` : ""}</td>
                <td><Tag b={s.basis} /> <span className="sm-src">{s.confidence}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
