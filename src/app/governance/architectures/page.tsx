import type { Metadata } from "next";
import Link from "next/link";
import { ARCHITECTURES, LAYER_MAP, RISKS, capabilitiesById } from "@/lib/governance/data";
import { Expander } from "@/components/governance/Expander";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Explore by AI architecture",
  description:
    "Governance profiles for nine AI architectures — from employee assistants and RAG to multi-agent systems and air-gapped AI.",
};

export default function ArchitecturesPage() {
  return (
    <Section
      num="06"
      kicker="Explore by AI architecture"
      title="Governance depends on what you're actually deploying."
      lede="An employee assistant, a RAG search, and an agent fleet share a framework but not a risk profile. Open the architecture your customer is building — each entry says what is distinctive, which layers work hardest, and where the incidents have been."
    >
      <div>
        {ARCHITECTURES.map((arch, i) => {
          const topRisks = RISKS.filter((r) => arch.topRiskIds.includes(r.id));
          const caps = capabilitiesById(arch.googleCapabilityIds);
          return (
            <Expander
              key={arch.id}
              defaultOpen={i === 0}
              head={
                <span style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span className="g-h3">{arch.name}</span>
                  <span className="g-micro">{arch.examples}</span>
                </span>
              }
            >
              <p className="g-prose">{arch.description}</p>
              <p className="g-serif-voice" style={{ fontSize: 15.5, marginTop: 10 }}>{arch.distinctive}</p>

              <div className="g-grid-2" style={{ marginTop: 18 }}>
                <div>
                  <div className="g-block-title">Where governance concentrates</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {arch.governanceNotes.map((note) => {
                      const layer = LAYER_MAP[note.layerId];
                      return (
                        <div key={note.layerId} data-hue={layer.hue} style={{ borderLeft: "3px solid var(--hue)", paddingLeft: 12 }}>
                          <Link href={`/governance/stack/${layer.id}`} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--hue-ink)" }}>
                            {layer.num}. {layer.short} →
                          </Link>
                          <p className="g-small" style={{ marginTop: 2 }}>{note.note}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                    {topRisks.map((r) => (
                      <span key={r.id} className="g-badge" title={r.blurb}>
                        ⚠ {r.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="g-google-band" style={{ padding: 18 }}>
                  <div className="g-block-title" style={{ marginBottom: 8 }}>How Google Cloud approaches this</div>
                  <p className="g-small" style={{ color: "var(--ink-2)" }}>{arch.googleNote}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {caps.map((c) => (
                      <a key={c.id} href={c.docsUrl} target="_blank" rel="noreferrer" className="g-badge google" title={c.oneLiner}>
                        {c.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Expander>
          );
        })}
      </div>
    </Section>
  );
}
