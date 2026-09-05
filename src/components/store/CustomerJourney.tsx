"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { journey, type ModelChip } from "@/lib/store/data";
import Building from "./Building";
import { ArchitectureStack } from "./ModelSwitcher";
import { Section, Reveal } from "./ui";

const FIRST_MODEL: ModelChip = { name: "Gemini 3.8 Flash", category: "google", note: "Workhorse tier · chosen on the model floor" };
const NEW_MODEL: ModelChip = { name: "A better model, six months later", category: "open", note: "Same platform, same rules" };

export default function CustomerJourney() {
  const [i, setI] = useState(0);
  const total = journey.steps.length + 1; // + the swap
  const isSwap = i === journey.steps.length;
  const step = journey.steps[Math.min(i, journey.steps.length - 1)];

  return (
    <Section id="journey" eyebrow={journey.eyebrow} title={journey.title} lead={journey.brief}>
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Stepper */}
        <div>
          <ol className="ds-steps" aria-label="Journey steps">
            {journey.steps.map((s, idx) => (
              <li key={s.n}>
                <button type="button" className="ds-step w-full" aria-current={i === idx ? "step" : undefined} onClick={() => setI(idx)}>
                  <span className="ds-step__n">{String(s.n).padStart(2, "0")}</span>
                  <span>
                    <span className="ds-step__t">{s.title}</span>
                    <span className="ds-step__p">{s.product}</span>
                  </span>
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="ds-step w-full" aria-current={isSwap ? "step" : undefined} onClick={() => setI(journey.steps.length)}>
                <span className="ds-step__n">11</span>
                <span>
                  <span className="ds-step__t">Six months later</span>
                  <span className="ds-step__p">A better model arrives</span>
                </span>
              </button>
            </li>
          </ol>
          <div className="mt-4 flex gap-2">
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={() => setI((v) => Math.max(0, v - 1))} disabled={i === 0}>
              ← Back
            </button>
            <button type="button" className="ds-btn ds-btn--primary ds-btn--sm" onClick={() => setI((v) => Math.min(total - 1, v + 1))} disabled={i === total - 1}>
              Next →
            </button>
          </div>
        </div>

        {/* Stage */}
        <Reveal>
          <div className="ds-card grid gap-8 p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
            <div className="mx-auto w-full max-w-[300px]">
              <Building variant="solid" active={isSwap ? "models" : step.floor} showLabels />
            </div>
            <div className="grid content-start gap-5">
              <AnimatePresence mode="wait" initial={false}>
                {!isSwap ? (
                  <motion.div key={step.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                    <p className="ds-tag">Step {step.n} of 10</p>
                    <h3 className="ds-h2 mt-1" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
                      {step.title}
                    </h3>
                    <p className="ds-lead mt-2">{step.product}</p>
                  </motion.div>
                ) : (
                  <motion.div key="swap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <p className="ds-tag">Step 11</p>
                    <h3 className="ds-h2 mt-1" style={{ fontSize: "clamp(24px, 2.6vw, 34px)" }}>
                      {journey.swap.question}
                    </h3>
                    <motion.p className="ds-h2 mt-4" style={{ fontSize: "clamp(28px, 3.2vw, 44px)" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.5 }}>
                      {journey.swap.answer}
                    </motion.p>
                    <motion.p className="ds-lead mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.5 }}>
                      {journey.swap.line.join(" ")}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
              <ArchitectureStack agent="Customer recommendation agent" model={isSwap ? NEW_MODEL : FIRST_MODEL} switchKey={isSwap ? 1 : 0} compact />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
