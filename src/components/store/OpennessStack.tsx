"use client";

import type { CSSProperties } from "react";
import { accent, opennessSection } from "@/lib/store/data";
import { Section, Reveal } from "./ui";

const COLORS = [accent.google, accent.agents, accent.agents, accent.data, accent.data, accent.infra, accent.partner];

export default function OpennessStack() {
  return (
    <Section id="openness" eyebrow={opennessSection.eyebrow} title={opennessSection.title} lead={opennessSection.lead}>
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <div className="grid gap-4">
            <p className="ds-body">
              Openness is only worth something if it exists at every layer. A store with an open model floor and a locked front door is still a locked store. Doors, corridors and standard interfaces connect every department to every other.
            </p>
            <div className="ds-card">
              <p className="ds-tag mb-2">The structural column</p>
              <p className="ds-body">Identity · Security · Governance · Open Standards run through every floor. Openness and control are the same column, not opposite walls.</p>
            </div>
          </div>
        </Reveal>
        <ol className="ds-stack" aria-label="Seven open layers">
          {opennessSection.layers.map((l, i) => (
            <Reveal key={l.layer} delay={i * 0.07} y={12}>
              <li className="ds-stack__layer" style={{ "--lc": COLORS[i] } as CSSProperties}>
                <span className="ds-h3">{l.layer}</span>
                <span className="ds-body">{l.examples}</span>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
