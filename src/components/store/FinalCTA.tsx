"use client";

import { motion, useReducedMotion } from "framer-motion";
import { finalSection } from "@/lib/store/data";
import Building from "./Building";

export default function FinalCTA() {
  const reduced = useReducedMotion();
  const show = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -20% 0px" },
          transition: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] as const },
        };
  return (
    <section id="final" className="ds-section ds-dark relative overflow-hidden" aria-labelledby="final-title">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.12]" aria-hidden="true">
        <div className="w-[min(70vw,720px)]">
          <Building variant="xray" showLabels={false} />
        </div>
      </div>
      <div className="ds-container relative grid gap-10 text-center">
        <motion.h2 id="final-title" className="ds-h1" {...show(0)}>
          {finalSection.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
        </motion.h2>
        <motion.p className="ds-h1" style={{ color: "#67e8f9" }} {...show(0.9)}>
          {finalSection.answer}
        </motion.p>
        <motion.p className="ds-lead mx-auto" {...show(1.3)}>
          {finalSection.support}
        </motion.p>
        <motion.div className="mt-6 grid gap-3" {...show(1.6)}>
          <p className="ds-eyebrow">{finalSection.brand}</p>
          <p className="ds-h2">{finalSection.statement}</p>
          <p className="ds-lead mx-auto">{finalSection.secondary}</p>
        </motion.div>
      </div>
    </section>
  );
}
