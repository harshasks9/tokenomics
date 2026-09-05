"use client";

import { securitySection } from "@/lib/store/data";
import { Section, Reveal, Tag } from "./ui";

const RED = "var(--c-security)";

/** The watch: door, floor, control room, drawn as a cutaway of the store. */
function WatchDiagram() {
  const bands = [
    { y: 40, label: "Control room", sub: "AI Protection · Security Operations", icon: "screens" },
    { y: 190, label: "The floor", sub: "Agent Platform Threat Detection", icon: "watcher" },
    { y: 340, label: "The door", sub: "Model Armor on Agent Gateway", icon: "gate" },
  ];
  return (
    <svg viewBox="0 0 520 480" role="img" aria-label="Cutaway of the store showing three layers of threat detection: the control room, the floor, and the door" className="h-auto w-full">
      <defs>
        <pattern id="sec-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke={RED} strokeOpacity="0.18" strokeWidth="1" />
        </pattern>
      </defs>
      {/* building shell */}
      <rect x="40" y="30" width="440" height="430" rx="6" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <line x1="40" y1="460" x2="480" y2="460" stroke="var(--ink)" strokeWidth="4" />
      {bands.map((b, i) => (
        <g key={b.label}>
          <rect x="42" y={b.y} width="436" height="128" fill={i === 1 ? "url(#sec-hatch)" : "none"} />
          {i > 0 && <line x1="42" y1={b.y} x2="478" y2={b.y} stroke="var(--line-2)" strokeWidth="1.5" />}
          <text x="62" y={b.y + 30} fontSize="12" letterSpacing="0.14em" fill={RED} fontWeight="700">
            {b.label.toUpperCase()}
          </text>
          <text x="62" y={b.y + 52} fontSize="14" fill="var(--ink)" fontWeight="600">
            {b.sub}
          </text>
          {/* sensor icons */}
          {b.icon === "screens" && (
            <g transform={`translate(330 ${b.y + 24})`} fill="none" stroke="var(--ink)" strokeWidth="1.5">
              <rect x="0" y="0" width="40" height="28" rx="2" />
              <rect x="48" y="0" width="40" height="28" rx="2" />
              <rect x="96" y="0" width="40" height="28" rx="2" />
              <rect x="0" y="36" width="40" height="28" rx="2" />
              <rect x="48" y="36" width="40" height="28" rx="2" />
              <rect x="96" y="36" width="40" height="28" rx="2" />
              <circle cx="68" cy="14" r="4" fill={RED} stroke="none" />
              <path d="M104 50 l8 -8 l8 6 l10 -12" />
            </g>
          )}
          {b.icon === "watcher" && (
            <g transform={`translate(300 ${b.y + 26})`} fill="none" stroke="var(--ink)" strokeWidth="1.5">
              {[0, 56, 112].map((x) => (
                <g key={x} transform={`translate(${x} 0)`}>
                  <rect x="0" y="16" width="44" height="44" rx="4" />
                  <circle cx="22" cy="38" r="8" />
                  <circle cx="22" cy="38" r="3" fill="var(--ink)" />
                  <circle cx="40" cy="8" r="6" fill={RED} stroke="none" />
                </g>
              ))}
            </g>
          )}
          {b.icon === "gate" && (
            <g transform={`translate(320 ${b.y + 22})`} fill="none" stroke="var(--ink)" strokeWidth="1.5">
              <path d="M0 90 V20 a8 8 0 0 1 8 -8 h34 a8 8 0 0 1 8 8 V90" />
              <path d="M90 90 V20 a8 8 0 0 1 8 -8 h34 a8 8 0 0 1 8 8 V90" />
              <line x1="50" y1="52" x2="90" y2="52" stroke={RED} strokeWidth="3" strokeDasharray="6 4" />
              <circle cx="70" cy="38" r="5" fill={RED} stroke="none" />
            </g>
          )}
        </g>
      ))}
      {/* request path */}
      <path d="M70 448 V110" fill="none" stroke={RED} strokeWidth="2" strokeDasharray="4 5" />
      <polygon points="70,100 64,112 76,112" fill={RED} />
      <text x="80" y="446" fontSize="11" fill="var(--muted)">
        one request, watched all the way up
      </text>
    </svg>
  );
}

export default function SecurityLayer() {
  const s = securitySection;
  return (
    <Section id="security" eyebrow={s.eyebrow} title={s.title} lead={s.lead}>
      {/* Why now */}
      <Reveal>
        <div className="ds-card mb-10 grid gap-4 border-l-4 md:grid-cols-[200px_1fr] md:gap-8" style={{ borderLeftColor: RED }}>
          <p className="ds-tag" style={{ color: RED }}>
            {s.why.tag}
          </p>
          <ul className="grid gap-2">
            {s.why.lines.map((l) => (
              <li key={l} className="ds-body flex gap-3">
                <span aria-hidden="true" className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: RED }} />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* CodeMender: the maintenance crew */}
      <Reveal>
        <article className="ds-card mb-6 p-7 md:p-9" aria-labelledby="sec-mender">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Tag color={RED}>{s.mender.metaphor}</Tag>
              <h3 id="sec-mender" className="ds-h2 mt-2" style={{ fontSize: "clamp(30px, 3.4vw, 46px)" }}>
                {s.mender.product}
              </h3>
              <p className="ds-small mt-2 inline-block rounded-full border border-[var(--line-2)] px-3 py-1">{s.mender.status}</p>
              <p className="mt-5 text-[19px] font-semibold leading-[1.35] md:text-[22px]">{s.mender.line}</p>
              <p className="ds-body mt-3">{s.mender.body}</p>
              <ul className="mt-5 grid gap-2" aria-label="CodeMender facts">
                {s.mender.facts.map((f) => (
                  <li key={f} className="ds-small flex gap-3 text-[var(--ink)]">
                    <span aria-hidden="true" className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--line-2)]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ol className="grid gap-3" aria-label="Find, verify, fix">
                {s.mender.steps.map((st, i) => (
                  <Reveal key={st.n} as="li" delay={0.1 + i * 0.12} className="ds-card grid gap-2 border-[var(--line)] p-5 md:grid-cols-[64px_1fr] md:gap-5">
                    <span className="ds-h3" style={{ color: RED }} aria-hidden="true">
                      {st.n}
                    </span>
                    <div>
                      <p className="ds-h3">{st.title}</p>
                      <p className="ds-body mt-1">{st.body}</p>
                    </div>
                  </Reveal>
                ))}
              </ol>
              <p className="ds-small mt-4">{s.mender.provenance}</p>
            </div>
          </div>
        </article>
      </Reveal>

      {/* The watch: AI threat detection */}
      <Reveal delay={0.05}>
        <article className="ds-card mb-6 p-7 md:p-9" aria-labelledby="sec-watch">
          <Tag color={RED}>{s.watch.metaphor}</Tag>
          <h3 id="sec-watch" className="ds-h2 mt-2" style={{ fontSize: "clamp(26px, 2.8vw, 38px)" }}>
            {s.watch.title}
          </h3>
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="mx-auto w-full max-w-[440px]">
              <WatchDiagram />
            </div>
            <ol className="grid gap-4" aria-label="Where threats are detected">
              {s.watch.rings.map((r, i) => (
                <Reveal key={r.place} as="li" delay={0.1 + i * 0.12} className="ds-card grid gap-2 border-[var(--line)] p-5 md:grid-cols-[150px_1fr] md:gap-6">
                  <div>
                    <p className="ds-tag" style={{ color: RED }}>
                      {r.place}
                    </p>
                    <p className="ds-small mt-2">{r.status}</p>
                  </div>
                  <div>
                    <p className="ds-h3">{r.product}</p>
                    <p className="ds-body mt-1">{r.body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </article>
      </Reveal>

      {/* The point */}
      <Reveal delay={0.1}>
        <div className="ds-card ds-dark grid gap-3 rounded-[14px] p-8 md:grid-cols-[260px_1fr] md:items-center md:gap-8">
          <p className="ds-tag" style={{ color: "#f28b82" }}>
            {s.point.tag}
          </p>
          <div>
            <p className="ds-h2" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
              {s.point.line}
            </p>
            <p className="ds-lead mt-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              {s.point.body}
            </p>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.15}>
        <p className="ds-small mt-6 max-w-[860px]">{s.caveat}</p>
      </Reveal>
    </Section>
  );
}
