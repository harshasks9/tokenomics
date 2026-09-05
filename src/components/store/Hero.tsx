"use client";

import { motion, useReducedMotion } from "framer-motion";
import { hero } from "@/lib/store/data";
import Building from "./Building";

export default function Hero() {
  const reduced = useReducedMotion();
  const anim = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const, delay },
        };
  return (
    <section id="hero" className="ds-section relative overflow-hidden" style={{ paddingTop: "clamp(120px, 16vw, 180px)" }} aria-labelledby="hero-title">
      <div className="ds-container grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-7">
          <motion.p className="ds-eyebrow" {...anim(0)}>
            {hero.eyebrow}
          </motion.p>
          <motion.h1 id="hero-title" className="ds-h1" {...anim(0.1)}>
            {hero.headline.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
          </motion.h1>
          <motion.p className="ds-lead" {...anim(0.25)}>
            {hero.support}
          </motion.p>
          <motion.div {...anim(0.35)}>
            <a href="#idea" className="ds-btn ds-btn--primary">
              {hero.cta}
              <span aria-hidden="true">↓</span>
            </a>
          </motion.div>
        </div>
        <div className="mx-auto w-full max-w-[520px]">
          <Building variant="outline" animate />
        </div>
      </div>
    </section>
  );
}
