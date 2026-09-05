"use client";

import type { CSSProperties } from "react";
import { modelCategories, modelGarden, tiers, type Tier } from "@/lib/store/data";
import { Section, Reveal, Chip, Tag } from "./ui";

const TIER_COLOR: Record<Tier, string> = {
  frontier: "#111318",
  workhorse: "#3c4043",
  efficient: "#5f6368",
  specialist: "#80868b",
};

function TierBadge({ tier }: { tier: Tier }) {
  const t = tiers.find((x) => x.id === tier)!;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
      style={{ borderColor: TIER_COLOR[tier], color: TIER_COLOR[tier] }}
    >
      {t.label}
    </span>
  );
}

export default function ModelGarden() {
  return (
    <Section id="models" eyebrow={modelGarden.eyebrow} title={modelGarden.title} lead={modelGarden.lead}>
      {/* How to read the shelf */}
      <Reveal>
        <div className="ds-card mb-8 grid gap-5 p-6 md:p-7">
          <div className="grid gap-2 md:grid-cols-[220px_1fr] md:items-start md:gap-6">
            <p className="ds-tag">How to read the shelf</p>
            <p className="ds-body">{modelGarden.howToRead}</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="The four tiers">
            {tiers.map((t) => (
              <li key={t.id} className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
                <span className="ds-h3 !text-[18px]">{t.label}</span>
                <p className="mt-1 text-[14px] font-semibold">{t.tagline}</p>
                <p className="ds-small mt-1">{t.exec}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Three shelves, each grouped by tier */}
      <div className="grid gap-6 lg:grid-cols-3">
        {modelCategories.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08} className="h-full">
            <article className="ds-card ds-shelf h-full" style={{ "--shelf": c.accent } as CSSProperties}>
              <Tag color={c.accent}>{c.label}</Tag>
              <h3 className="ds-h3 mt-1">{c.metaphor}</h3>
              <p className="ds-body mt-3">{c.body}</p>
              <p className="ds-small mt-2 mb-5">
                <span className="font-semibold">Access:</span> {c.access}
              </p>
              {tiers.map((t) => {
                const rows = c.models.filter((m) => m.tier === t.id);
                if (!rows.length) return null;
                return (
                  <div key={t.id} className="mb-4">
                    <div className="mb-2 flex items-center gap-2 border-b border-[var(--line)] pb-1.5">
                      <TierBadge tier={t.id} />
                      <span className="ds-small">{t.tagline}</span>
                    </div>
                    <ul className="ds-shelf__models" aria-label={`${c.label} — ${t.label}`}>
                      {rows.map((m) => (
                        <li key={m.name} className="ds-shelf__model">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="flex items-center gap-2 font-semibold">
                              <i className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: c.accent }} aria-hidden="true" />
                              {m.name}
                            </span>
                            <span className="ds-small">{m.maker}</span>
                            <span className="ds-small">· {m.released}</span>
                            {m.preview && <span className="rounded bg-[var(--bg-3)] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Preview</span>}
                          </div>
                          <p className="ds-small mt-0.5">{m.note}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </article>
          </Reveal>
        ))}
      </div>

      {/* The shelf at a glance */}
      <Reveal delay={0.1}>
        <div className="ds-card mt-10 p-0 overflow-hidden">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[var(--line)] px-6 py-4">
            <h3 className="ds-h3">{modelGarden.matrixTitle}</h3>
            <p className="ds-small">{modelGarden.verified}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-[14px]">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-6 py-3">
                    <span className="ds-tag">Tier</span>
                  </th>
                  {modelCategories.map((c) => (
                    <th key={c.id} scope="col" className="px-4 py-3">
                      <span className="ds-tag" style={{ color: c.accent }}>
                        {c.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modelGarden.matrix.map((row) => {
                  const t = tiers.find((x) => x.id === row.tier)!;
                  return (
                    <tr key={row.tier} className="border-t border-[var(--line)] align-top">
                      <th scope="row" className="px-6 py-4 text-left">
                        <span className="block font-semibold">{t.label}</span>
                        <span className="ds-small">{t.tagline}</span>
                      </th>
                      <td className="px-4 py-4">{row.google}</td>
                      <td className="px-4 py-4">{row.partner}</td>
                      <td className="px-4 py-4">{row.open}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
          <p className="ds-tag">Choose by</p>
          <ul className="flex flex-wrap gap-2" aria-label="Decision factors">
            {modelGarden.factors.map((f) => (
              <li key={f}>
                <Chip>{f}</Chip>
              </li>
            ))}
          </ul>
        </div>
        <p className="ds-small mt-4">{modelGarden.caveat}</p>
      </Reveal>
    </Section>
  );
}
