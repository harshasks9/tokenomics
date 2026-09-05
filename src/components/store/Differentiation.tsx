"use client";

import { different } from "@/lib/store/data";
import { Section, Reveal } from "./ui";

function Column({ title, assumes, points, highlight }: { title: string; assumes: string; points: string[]; highlight?: boolean }) {
  return (
    <article className={`ds-card h-full p-7 ${highlight ? "border-2 border-[var(--ink)]" : ""}`}>
      <h3 className="ds-h3">{title}</h3>
      <p className="mt-2 text-[16px] font-semibold">{assumes}</p>
      <ul className="mt-5 grid gap-3">
        {points.map((p) => (
          <li key={p} className="ds-body flex gap-3">
            <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: highlight ? "var(--ink)" : "var(--line-2)" }} />
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Differentiation() {
  const d = different;
  return (
    <Section id="different" eyebrow={d.eyebrow} title={d.title} lead={d.lead}>
      <div className="grid gap-5 md:grid-cols-2">
        <Reveal className="h-full">
          <Column {...d.boutique} />
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <Column {...d.store} highlight />
        </Reveal>
      </div>
      <Reveal delay={0.2}>
        <div className="ds-card ds-dark mt-6 grid gap-3 rounded-[14px] p-8 md:grid-cols-[220px_1fr] md:items-center md:gap-8">
          <p className="ds-tag" style={{ color: "#67e8f9" }}>
            {d.google.title}
          </p>
          <div>
            <p className="ds-lead" style={{ color: "rgba(255,255,255,0.6)" }}>
              {d.google.not}
            </p>
            <p className="ds-h3 mt-2" style={{ fontSize: "clamp(20px, 2vw, 28px)", lineHeight: 1.3 }}>
              {d.google.but}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
