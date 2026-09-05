"use client";

import { motion } from "framer-motion";
import { archetypeSection, archetypes } from "@/lib/store/data";
import { Section, Reveal, Tag } from "./ui";

function Icon({ id }: { id: string }) {
  const s = { fill: "none", stroke: "#111318", strokeWidth: 1.5 } as const;
  switch (id) {
    case "boutique":
      return (
        <svg viewBox="0 0 160 100" className="h-24 w-full" aria-hidden="true">
          <rect x="50" y="30" width="60" height="60" {...s} />
          <path d="M44 30 h72 l6 12 h-84 z" fill="#111318" />
          <rect x="70" y="56" width="20" height="34" {...s} />
          <rect x="94" y="56" width="10" height="14" {...s} />
        </svg>
      );
    case "bazaar":
      return (
        <svg viewBox="0 0 160 100" className="h-24 w-full" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <path d={`M${10 + i * 30} 60 l14 -18 l14 18 z`} {...s} />
              <rect x={14 + i * 30} y="60" width="20" height="30" {...s} />
            </g>
          ))}
        </svg>
      );
    case "warehouse":
      return (
        <svg viewBox="0 0 160 100" className="h-24 w-full" aria-hidden="true">
          <path d="M20 90 V40 L80 20 L140 40 V90 z" {...s} />
          <rect x="40" y="52" width="80" height="38" {...s} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1="40" y1={62 + i * 10} x2="120" y2={62 + i * 10} {...s} />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 160 100" className="h-24 w-full" aria-hidden="true">
          <rect x="30" y="14" width="100" height="76" {...s} />
          {[0, 1, 2].map((i) => (
            <line key={i} x1="30" y1={33 + i * 19} x2="130" y2={33 + i * 19} {...s} />
          ))}
          <rect x="24" y="14" width="8" height="76" fill="#111318" />
          <rect x="72" y="72" width="16" height="18" {...s} />
        </svg>
      );
  }
}

export default function ArchetypeComparison() {
  const others = archetypes.slice(0, 3);
  const store = archetypes[3];
  return (
    <Section id="archetypes" eyebrow={archetypeSection.eyebrow} title={archetypeSection.title} lead={archetypeSection.lead}>
      <div className="grid gap-5 lg:grid-cols-4">
        {others.map((a, i) => (
          <Reveal key={a.id} delay={i * 0.1} className="h-full">
            <article className="ds-card h-full">
              <Icon id={a.id} />
              <h3 className="ds-h3 mt-3">{a.name}</h3>
              <p className="mt-2 text-[17px] font-semibold">&ldquo;{a.message}&rdquo;</p>
              <dl className="mt-4 grid gap-3">
                <div>
                  <dt className="ds-tag">Strength</dt>
                  <dd className="ds-body">{a.strength}</dd>
                </div>
                <div>
                  <dt className="ds-tag">Trade-off</dt>
                  <dd className="ds-body">{a.tradeoff}</dd>
                </div>
              </dl>
            </article>
          </Reveal>
        ))}

        <Reveal delay={0.3} className="h-full">
          <article className="ds-card h-full border-2 border-[var(--ink)]">
            <Icon id="store" />
            <h3 className="ds-h3 mt-3">{store.name}</h3>
            <p className="mt-2 text-[22px] font-bold tracking-tight">{store.message.toUpperCase()}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Strengths of the other three, combined">
              {others.map((o, i) => (
                <motion.li
                  key={o.id}
                  className="ds-chip"
                  initial={{ opacity: 0, x: -40 - i * 20, y: -10 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{ duration: 0.6, delay: 0.5 + i * 0.18, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {o.strengthShort}
                </motion.li>
              ))}
              <motion.li
                className="ds-chip !bg-[var(--ink)] !text-white"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                + Governance
              </motion.li>
            </ul>
            <dl className="mt-4 grid gap-3">
              <div>
                <dt className="ds-tag">Strength</dt>
                <dd className="ds-body">{store.strength}</dd>
              </div>
              <div>
                <dt className="ds-tag">The offer</dt>
                <dd className="ds-body">{store.tradeoff}</dd>
              </div>
            </dl>
            <Tag>That is the position to own.</Tag>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}
