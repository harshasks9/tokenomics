"use client";

import { analogy } from "@/lib/store/data";
import { Section, Reveal } from "./ui";
import { useFill } from "./StoreContext";

export default function Analogy() {
  const fill = useFill();
  return (
    <Section id="analogy" eyebrow={analogy.eyebrow} title={analogy.title} lead={analogy.lead}>
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div className="ds-card p-7">
          <ol className="grid gap-4" aria-label="Why a department store wins">
            {analogy.points.map((p, i) => (
              <Reveal key={p.title} as="li" delay={0.1 + i * 0.12} className="flex items-start gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--line-2)] text-lg font-semibold text-[var(--muted)]" aria-hidden="true">
                  {i === 0 ? "" : "+"}
                </span>
                <span>
                  <span className="ds-h3 block">{p.title}</span>
                  <span className="ds-body">{p.body}</span>
                </span>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.65}>
            <div className="mt-6 border-t border-[var(--line)] pt-6">
              <p className="ds-tag mb-2">Equals</p>
              <p className="ds-h2" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
                {analogy.result}
              </p>
            </div>
          </Reveal>
        </div>
        <div className="grid gap-6">
          <Reveal delay={0.2}>
            <div className="ds-card border-l-4 p-7" style={{ borderLeftColor: "var(--c-google)" }}>
              <p className="ds-tag mb-3">The insight</p>
              <p className="ds-h3" style={{ fontSize: "clamp(19px, 1.7vw, 24px)", lineHeight: 1.35 }}>
                {fill(analogy.insight)}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="ds-h2" style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}>
              {fill(analogy.ask)}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
