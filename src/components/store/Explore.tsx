"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { floors, explore, type FloorId } from "@/lib/store/data";
import Building from "./Building";
import { Section, Chip, Tag } from "./ui";

function FloorDetail({ id }: { id: FloorId }) {
  const f = floors.find((x) => x.id === id)!;
  const reduced = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={f.id}
        className="ds-card ds-detail grid gap-4"
        style={{ borderTop: `4px solid ${f.accent}` }}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, y: -8 }}
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
        <a href={`#${f.sectionId}`} className="ds-btn ds-btn--ghost ds-btn--sm w-fit">
          Go to this floor
          <span aria-hidden="true">↓</span>
        </a>
      </motion.article>
    </AnimatePresence>
  );
}

export default function Explore() {
  const [active, setActive] = useState<FloorId>("models");
  return (
    <Section id="explore" eyebrow={explore.eyebrow} title={[explore.title]} lead={explore.lead}>
      {/* Desktop: building + detail */}
      <div className="hidden gap-10 lg:grid lg:grid-cols-[1fr_0.9fr] lg:items-start">
        <div className="mx-auto w-full max-w-[560px]">
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
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left"
                aria-expanded={open}
                onClick={() => setActive(f.id)}
              >
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
