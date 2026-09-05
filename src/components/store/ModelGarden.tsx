"use client";

import type { CSSProperties } from "react";
import { modelCategories, modelGarden } from "@/lib/store/data";
import { Section, Reveal, Chip, Tag } from "./ui";

export default function ModelGarden() {
  return (
    <Section id="models" eyebrow={modelGarden.eyebrow} title={modelGarden.title} lead={modelGarden.lead}>
      <div className="grid gap-6 md:grid-cols-3">
        {modelCategories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.1}>
            <article className="ds-card ds-shelf h-full" style={{ "--shelf": c.accent } as CSSProperties}>
              <Tag color={c.accent}>{c.label}</Tag>
              <h3 className="ds-h3 mt-1">{c.metaphor}</h3>
              <p className="ds-body mt-3 mb-5">{c.body}</p>
              <ul className="ds-shelf__models" aria-label={`${c.label} examples`}>
                {c.models.map((m) => (
                  <li key={m} className="ds-shelf__model flex items-center gap-3">
                    <i className="h-2.5 w-2.5 rounded-sm" style={{ background: c.accent }} aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-10 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
          <p className="ds-tag">Choose by</p>
          <ul className="flex flex-wrap gap-2" aria-label="Decision factors">
            {modelGarden.factors.map((f) => (
              <li key={f}>
                <Chip>{f}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <p className="ds-small mt-4">{modelGarden.caveat}</p>
      </Reveal>
    </Section>
  );
}
