"use client";

import { governanceSection } from "@/lib/store/data";
import Building from "./Building";
import { Section, Reveal, Chip, Tag } from "./ui";

export default function GovernanceLayer() {
  const g = governanceSection;
  return (
    <Section id="governance" dark className="ds-xray" eyebrow={g.eyebrow} title={g.title} lead={g.lead}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <div className="mx-auto w-full max-w-[420px]">
            <Building variant="xray" active="govern" showLabels />
          </div>
        </Reveal>
        <div className="grid gap-4">
          {g.items.map((it, i) => (
            <Reveal key={it.product} delay={i * 0.1}>
              <article className="ds-card grid gap-2 md:grid-cols-[180px_1fr] md:gap-6" style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(103,232,249,0.35)" }}>
                <div>
                  <Tag color="#67e8f9">{it.metaphor}</Tag>
                  <h3 className="ds-h3 mt-1">{it.product}</h3>
                </div>
                <div>
                  <p className="text-[18px] font-semibold">{it.line}</p>
                  <p className="ds-body mt-1">{it.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
          <Reveal delay={0.35}>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Controls">
              {g.controls.map((c) => (
                <li key={c}>
                  <Chip color="#67e8f9" className="!bg-transparent">
                    {c}
                  </Chip>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
