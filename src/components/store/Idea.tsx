"use client";

import { idea } from "@/lib/store/data";
import { Section, Reveal } from "./ui";

export default function Idea() {
  return (
    <Section id="idea" eyebrow="Section 02 · The idea" title={[idea.title]} lead={idea.lead}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="grid gap-6">
          <Reveal>
            <p className="ds-body text-[17px]">{idea.body}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="ds-body text-[17px]">{idea.positioning}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="ds-card border-l-4" style={{ borderLeftColor: "var(--c-google)" }}>
              <p className="ds-tag mb-2">{idea.distinction.title}</p>
              <p className="ds-body">{idea.distinction.body}</p>
            </div>
          </Reveal>
        </div>

        {/* The equation */}
        <div className="ds-card p-8" aria-label="Choice plus curation plus common platform plus governance equals optionality without chaos">
          <ol className="grid gap-3">
            {idea.terms.map((t, i) => (
              <Reveal key={t} delay={0.1 + i * 0.12}>
                <li className="flex items-center gap-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-2)] text-lg font-semibold text-[var(--muted)]" aria-hidden="true">
                    {i === 0 ? "" : "+"}
                  </span>
                  <span className="ds-h3">{t}</span>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.7}>
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <p className="ds-tag mb-2">Equals</p>
              <p className="ds-h2" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
                {idea.result}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
