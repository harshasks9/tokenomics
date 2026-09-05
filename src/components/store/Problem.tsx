"use client";

import { problem } from "@/lib/store/data";
import { Section, Reveal } from "./ui";

export default function Problem() {
  return (
    <Section id="problem" eyebrow={problem.eyebrow} title={problem.title} lead={problem.lead}>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <ol className="grid gap-4" aria-label="Three questions nobody can answer">
          {problem.bets.map((b, i) => (
            <Reveal key={b.q} as="li" delay={i * 0.1} className="ds-card grid gap-2 md:grid-cols-[40px_1fr] md:gap-5">
              <span className="ds-h3 text-[var(--muted)]" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="ds-h3">{b.q}</p>
                <p className="ds-body mt-2">{b.a}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.3}>
          <div className="ds-card border-2 border-[var(--ink)] p-7">
            <p className="ds-tag mb-4">{problem.wantTitle}</p>
            <ul className="grid gap-3">
              {problem.wants.map((w) => (
                <li key={w} className="ds-h3">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
