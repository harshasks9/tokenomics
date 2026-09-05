"use client";

import { accent, dataSection } from "@/lib/store/data";
import { Section, Reveal, Chip } from "./ui";

/** Sources on the left flow into the platform; context flows out to agents. */
function FlowDiagram() {
  const n = dataSection.sources.length;
  const h = 40 + n * 34;
  return (
    <svg viewBox={`0 0 640 ${h}`} className="ds-flow w-full" role="img" aria-label="Enterprise sources flow into the platform, which grounds agents with business context">
      {dataSection.sources.map((s, i) => {
        const y = 28 + i * 34;
        return (
          <g key={s}>
            <rect x="0" y={y - 14} width="180" height="28" rx="6" fill="#ffffff" stroke="#c9ccd1" />
            <text x="14" y={y + 5} fontSize="13" fontWeight="500" fill="#111318">
              {s}
            </text>
            <path className="line" d={`M180 ${y} C 250 ${y}, 260 ${h / 2}, 320 ${h / 2}`} fill="none" stroke={accent.data} strokeWidth="1.5" />
          </g>
        );
      })}
      <rect x="320" y={h / 2 - 44} width="150" height="88" rx="10" fill={accent.data} />
      <text x="395" y={h / 2 - 12} textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="1.5" fill="#ffffff" opacity="0.8">
        GROUNDING
      </text>
      <text x="395" y={h / 2 + 8} textAnchor="middle" fontSize="14" fontWeight="700" fill="#ffffff">
        Agent Platform
      </text>
      <text x="395" y={h / 2 + 28} textAnchor="middle" fontSize="11" fill="#ffffff" opacity="0.8">
        search · RAG · connectors
      </text>
      <path className="line" d={`M470 ${h / 2} H520`} fill="none" stroke={accent.data} strokeWidth="1.5" />
      <rect x="520" y={h / 2 - 30} width="120" height="60" rx="8" fill="#ffffff" stroke="#111318" />
      <text x="580" y={h / 2 - 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#111318">
        Your agents
      </text>
      <text x="580" y={h / 2 + 14} textAnchor="middle" fontSize="11" fill="#5f6368">
        contextual answers
      </text>
    </svg>
  );
}

export default function DataFlow() {
  return (
    <Section id="data" eyebrow={dataSection.eyebrow} title={dataSection.title} lead={dataSection.lead}>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <Reveal>
          <div className="ds-card p-6 md:p-8">
            <FlowDiagram />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid gap-5">
            <div>
              <p className="ds-tag mb-3">What the store remembers</p>
              <ul className="flex flex-wrap gap-2">
                {dataSection.concepts.map((c) => (
                  <li key={c}>
                    <Chip color={accent.data}>{c}</Chip>
                  </li>
                ))}
              </ul>
            </div>
            <p className="ds-body">
              A model that knows the world is a good start. An agent that knows your customers, your policies, your inventory and your history is the product. Grounding is how the store keeps that context in the building and out of the generic answer.
            </p>
            <p className="ds-small">{dataSection.caveat}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
