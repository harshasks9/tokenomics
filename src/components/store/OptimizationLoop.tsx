"use client";

import { accent, operationsSection } from "@/lib/store/data";
import { Section, Reveal, Tag, Statement } from "./ui";

function Loop() {
  const steps = operationsSection.loop;
  const cx = 210;
  const cy = 210;
  const r = 150;
  return (
    <svg viewBox="0 0 420 420" className="w-full max-w-[440px]" role="img" aria-label={steps.join(", then ")}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#c9ccd1" strokeDasharray="4 6" />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="12" fontWeight="600" fill="#5f6368" letterSpacing="2">
        QUALITY
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="#5f6368" letterSpacing="2">
        CONTROL
      </text>
      {steps.map((s, i) => {
        const a = (i / steps.length) * Math.PI * 2 - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const last = i === steps.length - 1;
        const words = s.split(" ");
        const l1 = words.slice(0, Math.ceil(words.length / 2)).join(" ");
        const l2 = words.slice(Math.ceil(words.length / 2)).join(" ");
        return (
          <g key={s}>
            <rect x={x - 48} y={y - 22} width="96" height="44" rx="22" fill={last ? accent.infra : "#ffffff"} stroke={last ? accent.infra : "#111318"} strokeWidth="1.5" />
            <text x={x} y={y - 2} textAnchor="middle" fontSize="10" fontWeight="600" fill={last ? "#ffffff" : "#111318"}>
              {l1}
            </text>
            <text x={x} y={y + 11} textAnchor="middle" fontSize="10" fontWeight="600" fill={last ? "#ffffff" : "#111318"}>
              {l2}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function OptimizationLoop() {
  const o = operationsSection;
  return (
    <Section id="operations" eyebrow={o.eyebrow} title={o.title} lead={o.lead}>
      <Reveal>
        <p className="ds-tag mb-3">From prototype to production</p>
        <ol className="ds-pipeline" aria-label="Idea to build to test to deploy to scale to operate">
          {o.pipeline.map((p, i) => (
            <li key={p} className="ds-pipeline__step">
              <small>{String(i + 1).padStart(2, "0")}</small>
              {p}
            </li>
          ))}
        </ol>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="ds-card mt-5 md:flex md:items-center md:gap-6">
          <div className="md:w-56">
            <Tag color={accent.infra}>Floor 2</Tag>
            <h3 className="ds-h3 mt-1">{o.runtime.product}</h3>
          </div>
          <p className="ds-body mt-2 md:mt-0">{o.runtime.body}</p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <Reveal>
          <div className="ds-card grid place-items-center p-6">
            <Loop />
          </div>
        </Reveal>
        <div className="grid gap-5">
          <Reveal>
            <Statement lines={o.headline} className="!text-[clamp(28px,3.2vw,44px)]" />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {[o.observability, o.evaluation].map((q, i) => (
              <Reveal key={q.label} delay={0.1 + i * 0.1}>
                <div className="ds-card h-full" style={{ borderTop: `4px solid ${accent.infra}` }}>
                  <Tag color={accent.infra}>{q.label}</Tag>
                  <p className="ds-h3 mt-2">&ldquo;{q.question}&rdquo;</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.3}>
            <p className="ds-body">Quality control is the reason the model floor can carry rivals without fear. The store measures the product, not the brand.</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
