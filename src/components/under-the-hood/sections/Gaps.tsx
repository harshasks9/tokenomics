"use client";

import { GAPS } from "@/lib/under-the-hood/data";
import { Section } from "../ui";

export default function Gaps() {
  return (
    <Section id="gaps">
      <div className="uth-grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(330px,1fr))" }}>
        {GAPS.map((g) => (
          <article key={g.id} className="uth-card">
            <h3 className="uth-h3" style={{ fontSize: 19 }}>{g.title}</h3>
            <dl className="uth-kv" style={{ gridTemplateColumns: "1fr", gap: 2 }}>
              <dt>Status in the filing</dt><dd>{g.status}</dd>
              <dt>Why it matters</dt><dd>{g.whyItMatters}</dd>
              <dt>What we can bound</dt><dd>{g.whatWeCanBound}</dd>
              <dt>Disclosure that would resolve it</dt><dd><strong style={{ color: "var(--ink)" }}>{g.disclosureNeeded}</strong></dd>
            </dl>
          </article>
        ))}
      </div>
      <p className="uth-small" style={{ marginTop: 14 }}>Absence of evidence is not negative evidence: S-1s routinely omit product-level and customer-level economics. These gaps mark where competitors should not over-read either the bull or the bear case.</p>
    </Section>
  );
}
