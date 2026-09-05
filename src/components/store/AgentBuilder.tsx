"use client";

import { motion, useReducedMotion } from "framer-motion";
import { accent, buildSection } from "@/lib/store/data";
import { Section, Reveal, Tag } from "./ui";

export default function AgentBuilder() {
  const reduced = useReducedMotion();
  const b = buildSection;
  return (
    <Section id="build" eyebrow={b.eyebrow} title={b.title} lead={b.lead}>
      <div className="grid gap-6 md:grid-cols-2">
        {b.paths.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1}>
            <article className="ds-card h-full" style={{ borderTop: `4px solid ${accent.agents}` }}>
              <Tag color={accent.agents}>{p.label}</Tag>
              <h3 className="ds-h3 mt-1">{p.product}</h3>
              <p className="ds-body mt-3">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
        <div>
          <Reveal>
            <p className="ds-tag mb-4">An agent, assembled</p>
          </Reveal>
          <div className="ds-assembly" aria-label="An agent is assembled from a model, instructions, tools, data, memory and other agents">
            {b.parts.map((part, i) => (
              <motion.div
                key={part}
                className="ds-assembly__part"
                initial={reduced ? false : { opacity: 0, y: 14, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                {part}
              </motion.div>
            ))}
          </div>
          <motion.div
            className="ds-assembly__agent"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            = An agent that does a job
          </motion.div>
          <Reveal delay={0.2}>
            <div className="ds-card mt-6">
              <p className="ds-tag mb-1">{b.associates.title}</p>
              <p className="ds-body">{b.associates.body}</p>
            </div>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <Tag color={accent.agents}>{b.garden.product}</Tag>
            <h3 className="ds-h3 mt-1 mb-3">{b.garden.title}</h3>
            <p className="ds-body mb-5">{b.garden.body}</p>
          </Reveal>
          <ul className="grid gap-3 sm:grid-cols-2" aria-label="Reusable agent patterns">
            {b.garden.patterns.map((p, i) => (
              <Reveal key={p.name} as="li" delay={0.1 + i * 0.07} className="ds-card h-full p-5">
                <p className="font-semibold">{p.name}</p>
                <p className="ds-small mt-1">{p.body}</p>
              </Reveal>
            ))}
          </ul>
          <p className="ds-small mt-3">{b.garden.note}</p>
        </div>
      </div>
    </Section>
  );
}
