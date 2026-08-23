import type { Metadata } from "next";
import { CASE_STUDIES, INCIDENTS, LAYER_MAP, SOURCE_MAP } from "@/lib/governance/data";
import { ExampleLibrary } from "@/components/governance/ExampleLibrary";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Customer examples",
  description:
    "A curated library of governance implementations that teach — Situation → Challenge → Controls → Architecture → Outcome — plus the cautionary tales.",
};

const SHARED_PATTERNS = [
  {
    name: "One governed front door",
    what: "Every model call routes through a platform/gateway that owns identity, policy, logging, and model choice — new use cases inherit governance.",
    who: "Goldman Sachs · Walmart · JPMorgan · TELUS · Highmark",
  },
  {
    name: "Sensitive data never meets the model raw",
    what: "Tokenize, redact, or de-identify before inference; re-hydrate inside the perimeter.",
    who: "Wells Fargo · healthcare de-identification pipelines",
  },
  {
    name: "Evals before rollout, evals forever",
    what: "Golden test sets and expert grading gate launch; every change reruns the suite.",
    who: "Morgan Stanley · Deutsche Bank · Commerzbank",
  },
  {
    name: "Humans accountable at the decision point",
    what: "AI drafts, accountable humans approve — with UIs designed so review is real work, not a rubber stamp.",
    who: "HCA · Nevada DETR · NHS scribes",
  },
  {
    name: "Constrained blast radius",
    what: "Scope fences, deterministic execution, and confidence-based handoff decide what AI may do alone.",
    who: "Wendy's · Fargo's intent-only LLM",
  },
  {
    name: "Governance as the paved road",
    what: "A sanctioned platform good enough to out-compete shadow AI, then institutionalize.",
    who: "USAF NIPRGPT · Moderna · Macquarie",
  },
] as const;

export default function ExamplesPage() {
  return (
    <>
      <Section
        num="09"
        kicker="Customer examples"
        title="How the best-governed deployments actually did it."
        lede="Every example here teaches a mechanism — Situation → Challenge → Controls → Architecture → Outcome — with sources a customer can check. Entries marked Directional are real deployments whose public governance detail is thinner; present them as direction of travel, not blueprints."
      >
        <div className="g-grid-3" style={{ marginBottom: 36 }}>
          {SHARED_PATTERNS.map((p, i) => (
            <div key={p.name} className="g-card">
              <div className="g-kicker" style={{ marginBottom: 6 }}>
                <span className="g-kicker-num">P{i + 1}</span>
                Shared pattern
              </div>
              <h3 className="g-h3" style={{ fontSize: 15 }}>{p.name}</h3>
              <p className="g-small" style={{ marginTop: 6 }}>{p.what}</p>
              <p className="g-micro" style={{ marginTop: 8 }}>{p.who}</p>
            </div>
          ))}
        </div>
        <ExampleLibrary examples={CASE_STUDIES} sourceMap={SOURCE_MAP} />
      </Section>

      <Section
        kicker="Cautionary tales"
        title="It has already happened — to someone else."
        lede="The most persuasive governance argument is a dated incident and the specific control that would have caught it. In every row, a policy existed; enforcement did not."
        hue="security"
      >
        <div className="g-table-scroll">
          <table className="g-table">
            <thead>
              <tr>
                <th>Incident</th>
                <th>Date</th>
                <th>What failed</th>
                <th>The control that would have caught it</th>
                <th>Layer</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENTS.map((inc) => (
                <tr key={inc.id}>
                  <td className="lead" style={{ whiteSpace: "normal", minWidth: 170 }}>
                    {inc.org}
                    <span className="g-micro" style={{ display: "block", fontWeight: 500 }}>{inc.headline}</span>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{inc.date}</td>
                  <td style={{ minWidth: 220 }}>{inc.what}</td>
                  <td style={{ minWidth: 220 }}>{inc.lesson}</td>
                  <td style={{ minWidth: 110 }}>
                    {inc.layerIds.map((id) => {
                      const l = LAYER_MAP[id];
                      return (
                        <span key={id} data-hue={l.hue} className="g-badge hue" style={{ fontSize: 9, marginRight: 4 }}>
                          {l.num}
                        </span>
                      );
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="g-micro" style={{ marginTop: 12 }}>
          Sources for every incident are in the register — see Sources &amp; methodology.
        </p>
      </Section>
    </>
  );
}
