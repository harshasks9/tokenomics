import type { Metadata } from "next";
import Link from "next/link";
import { LAYER_MAP, PERSONAS } from "@/lib/governance/data";
import { Section } from "@/components/governance/ui";

export const metadata: Metadata = {
  title: "Explore by persona",
  description: "What does AI governance mean for me? Nine views, from the board to the business user.",
};

export default function PersonasPage() {
  return (
    <Section
      num="04"
      kicker="Explore by persona"
      title="“What does AI governance mean for me?”"
      lede="The same framework reads differently from every chair. Each view carries what that person is accountable for, the decisions they own, the questions they should be asking — and where in this guide to take them first."
    >
      <div className="g-grid-3">
        {PERSONAS.map((p) => {
          const emphases = p.layerEmphasis.map((id) => LAYER_MAP[id]).filter(Boolean);
          return (
            <Link key={p.id} href={`/governance/personas/${p.id}`} className="g-card g-card-hover" style={{ display: "block" }}>
              <div className="g-block-title" style={{ marginBottom: 6 }}>{p.group}</div>
              <h3 className="g-h3">{p.title}</h3>
              <p className="g-small" style={{ marginTop: 8, color: "var(--ink-2)" }}>{p.tagline}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 14 }}>
                {emphases.map((l) => (
                  <span key={l.id} data-hue={l.hue} className="g-badge hue" style={{ fontSize: 9.5 }}>
                    {l.num} {l.short}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
