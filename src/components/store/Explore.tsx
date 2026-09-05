"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { floors, mapping, type FloorId } from "@/lib/store/data";
import Building from "./Building";
import { Section, Reveal, Chip, Tag } from "./ui";

function FloorDetail({ id }: { id: FloorId }) {
  const f = floors.find((x) => x.id === id)!;
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={f.id}
        className="ds-card ds-detail grid gap-4"
        style={{ borderTop: `4px solid ${f.accent}` }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3 }}
        aria-live="polite"
      >
        <div>
          <Tag color={f.accent}>{f.level}</Tag>
          <h3 className="ds-h3 mt-1">{f.name}</h3>
          <p className="ds-small mt-1 italic">{f.metaphor}</p>
        </div>
        <p className="ds-body">{f.detail}</p>
        <div className="ds-detail__products">
          {f.products.map((p) => (
            <Chip key={p} color={f.accent}>
              {p}
            </Chip>
          ))}
        </div>
        <a href={`#${f.sectionId === "map" ? "models" : f.sectionId}`} className="ds-btn ds-btn--ghost ds-btn--sm w-fit">
          See the proof
          <span aria-hidden="true">↓</span>
        </a>
      </motion.article>
    </AnimatePresence>
  );
}

export default function Explore() {
  const [active, setActive] = useState<FloorId>("models");
  return (
    <Section id="map" eyebrow={mapping.eyebrow} title={mapping.title} lead={mapping.lead}>
      {/* The mapping table */}
      <Reveal>
        <div className="ds-card mb-12 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[14px]">
              <thead>
                <tr className="text-left">
                  <th scope="col" className="px-6 py-3">
                    <span className="ds-tag">In the store</span>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="ds-tag" style={{ color: "var(--c-google)" }}>
                      On Google Cloud
                    </span>
                  </th>
                  <th scope="col" className="px-4 py-3">
                    <span className="ds-tag">What it means for you</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {mapping.rows.map((r) => (
                  <tr key={r.store} className="border-t border-[var(--line)] align-top">
                    <th scope="row" className="px-6 py-4 text-left font-semibold">
                      {r.store}
                    </th>
                    <td className="px-4 py-4 font-semibold text-[var(--ink)]">{r.platform}</td>
                    <td className="px-4 py-4 text-[var(--ink-2)]">{r.means}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <p className="ds-tag">{mapping.exploreTitle}</p>
        <p className="ds-lead mb-6 mt-1">{mapping.exploreLead}</p>
      </Reveal>

      {/* Desktop: building + detail */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="mx-auto w-full max-w-[520px]">
          <Building variant="solid" interactive active={active} onSelect={setActive} />
        </div>
        <FloorDetail id={active} />
      </div>

      {/* Mobile: floor-by-floor journey */}
      <ol className="grid gap-3 lg:hidden">
        {floors.map((f) => {
          const open = active === f.id;
          return (
            <li key={f.id} className="ds-card p-0">
              <button type="button" className="flex w-full items-center gap-4 p-4 text-left" aria-expanded={open} onClick={() => setActive(f.id)}>
                <span className="w-16 shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: f.accent }}>
                  {f.level}
                </span>
                <span className="ds-h3 flex-1">{f.name}</span>
                <span aria-hidden="true" className="text-[var(--muted)]">
                  {open ? "−" : "+"}
                </span>
              </button>
              {open && (
                <div className="grid gap-3 border-t border-[var(--line)] p-4">
                  <p className="ds-small italic">{f.metaphor}</p>
                  <p className="ds-body">{f.detail}</p>
                  <div className="ds-detail__products">
                    {f.products.map((p) => (
                      <Chip key={p} color={f.accent}>
                        {p}
                      </Chip>
                    ))}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
