import type { Metadata } from "next";
import { SOURCES } from "@/lib/governance/data";
import { ClaimBadge, Section } from "@/components/governance/ui";
import type { Source } from "@/lib/governance/types";

export const metadata: Metadata = {
  title: "Sources & methodology",
  description:
    "The full source register behind this guide, grouped by how each claim should be read: regulation, standard, practice, vendor capability, research, or news.",
};

const GROUPS: { kind: Source["kind"]; title: string; note: string }[] = [
  { kind: "regulation", title: "Regulation", note: "Binding law. Dates and duties as enacted; not legal advice." },
  { kind: "standard", title: "Standards", note: "Certifiable or auditable specifications (ISO/IEC family)." },
  { kind: "practice", title: "Frameworks & industry practice", note: "Voluntary but load-bearing: NIST, OWASP, MITRE, CSA, analyst frameworks." },
  { kind: "research", title: "Research & surveys", note: "Empirical findings — cite with their dates; sample sizes matter." },
  { kind: "google", title: "Google first-party", note: "Official Google/Google Cloud documentation and announcements." },
  { kind: "vendor", title: "Other vendors, first-party", note: "Microsoft, AWS, OpenAI, Anthropic and others, from their own documentation." },
  { kind: "news", title: "Incidents & reporting", note: "Journalism and case records backing the incidents and examples." },
];

export default function SourcesPage() {
  return (
    <>
      <Section
        kicker="Sources & methodology"
        title="Every significant claim, traceable."
        lede="This guide distinguishes five kinds of statement — regulation (binding), standard (certifiable), practice (recommended), vendor capability (verify before contracting), and Google's own view. The register below is the evidence base; content snapshot August 2026."
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
          <ClaimBadge kind="regulation" />
          <ClaimBadge kind="standard" />
          <ClaimBadge kind="practice" />
          <ClaimBadge kind="vendor" />
          <ClaimBadge kind="google" />
        </div>
        <p className="g-micro" style={{ maxWidth: "50em" }}>
          Methodology: content synthesized August 2026 from primary sources — regulation texts and
          official guidance, standards bodies, first-party vendor documentation, published research,
          and reported incidents. Product capabilities and legal statuses change; verify anything
          deal-critical against the linked originals. This site is an educational aid, not legal or
          compliance advice.
        </p>
      </Section>

      {GROUPS.map((group) => {
        const items = SOURCES.filter((s) => s.kind === group.kind);
        if (items.length === 0) return null;
        return (
          <Section key={group.kind} kicker={group.title} lede={group.note}>
            <div className="g-table-scroll">
              <table className="g-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Organization</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((s) => (
                    <tr key={s.id}>
                      <td style={{ minWidth: 260 }}>
                        <a href={s.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent-ink)" }}>
                          {s.title}
                        </a>
                      </td>
                      <td style={{ minWidth: 140 }}>{s.org}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{s.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        );
      })}
    </>
  );
}
