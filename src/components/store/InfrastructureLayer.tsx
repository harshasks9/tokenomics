"use client";

import { ecosystemSection, infraSection } from "@/lib/store/data";
import { Section, Reveal, Chip, Tag } from "./ui";

function EngineRoom() {
  return (
    <svg viewBox="0 0 640 260" className="w-full" role="img" aria-label="The engine room beneath the store: accelerators, networking and storage">
      {/* building footprint above */}
      <rect x="120" y="0" width="420" height="34" fill="none" stroke="rgba(255,255,255,0.35)" strokeDasharray="4 6" />
      <text x="330" y="22" textAnchor="middle" fontSize="11" letterSpacing="2" fill="rgba(255,255,255,0.55)">
        THE STORE ABOVE
      </text>
      {/* ground */}
      <line x1="40" y1="34" x2="600" y2="34" stroke="#ffffff" strokeOpacity="0.5" />
      {/* accelerator grid */}
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => (
          <rect key={`${r}${c}`} x={70 + c * 50} y={64 + r * 48} width="36" height="32" rx="4" fill={c < 5 ? "rgba(63,81,181,0.5)" : "rgba(255,255,255,0.08)"} stroke="rgba(255,255,255,0.45)" />
        )),
      )}
      <text x="160" y="228" textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="2" fill="#ffffff">
        TPUs
      </text>
      <text x="440" y="228" textAnchor="middle" fontSize="11" fontWeight="600" letterSpacing="2" fill="#ffffff">
        GPUs
      </text>
      {/* power and network lines */}
      <path d="M40 130 H70 M556 130 H600 M40 178 H70 M556 178 H600" stroke="#67e8f9" strokeOpacity="0.8" strokeWidth="1.5" />
      <path d="M320 34 V60" stroke="#67e8f9" strokeWidth="2" />
      <text x="40" y="250" fontSize="10" letterSpacing="1.5" fill="rgba(255,255,255,0.55)">
        NETWORKING · STORAGE · SERVING
      </text>
    </svg>
  );
}

export default function InfrastructureLayer() {
  const s = infraSection;
  return (
    <>
      <Section id="infrastructure" dark eyebrow={s.eyebrow} title={s.title} lead={s.lead}>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="ds-card p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
              <EngineRoom />
            </div>
          </Reveal>
          <div className="grid gap-5">
            <Reveal>
              <Tag color="#8c9eff">Foundation</Tag>
              <h3 className="ds-h3 mt-1">{s.product}</h3>
              <p className="ds-body mt-2">{s.body}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="flex flex-wrap gap-2" aria-label="Infrastructure components">
                {s.parts.map((p) => (
                  <li key={p}>
                    <Chip className="!bg-transparent" color="#8c9eff">
                      {p}
                    </Chip>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="ds-tag mb-2">So enterprises can optimise for</p>
              <ul className="flex flex-wrap gap-2">
                {s.optimise.map((p) => (
                  <li key={p}>
                    <Chip className="!bg-transparent">{p}</Chip>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="ds-h3 mt-2">{s.headline}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <section id="ecosystem" className="ds-section !pt-0" aria-labelledby="eco-title">
        <div className="ds-container">
          <Reveal>
            <div className="ds-card grid gap-5 md:grid-cols-[1fr_1fr] md:items-center">
              <div>
                <p className="ds-eyebrow mb-2">Stores within the store</p>
                <h2 id="eco-title" className="ds-h3">
                  {ecosystemSection.title}
                </h2>
                <p className="ds-body mt-2">{ecosystemSection.body}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {ecosystemSection.items.map((i) => (
                  <li key={i}>
                    <Chip color="#b26a00">{i}</Chip>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
