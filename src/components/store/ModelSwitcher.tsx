"use client";

import { useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { accent, modelSwitch, useCases, type ModelChip } from "@/lib/store/data";
import { Section, Reveal } from "./ui";

const LAYER_COLOR: Record<string, string> = {
  Data: accent.data,
  Security: accent.security,
  Governance: accent.security,
  Operations: accent.infra,
  Infrastructure: accent.infra,
};

const CHIP_COLOR = { google: accent.google, partner: accent.partner, open: accent.open };

/** The diagram: application → model → common platform → five layers. */
export function ArchitectureStack({
  agent,
  model,
  switchKey,
  compact = false,
}: {
  agent: string;
  model: ModelChip;
  switchKey: number;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <div className={`ds-arch ${compact ? "text-[13px]" : ""}`}>
      <div className="ds-arch__box">
        <small>Application / agent</small>
        {agent}
      </div>
      <span className="ds-arch__arrow" aria-hidden="true" />
      <div className="ds-arch__model" aria-live="polite" aria-label={`Model: ${model.name}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${model.name}-${switchKey}`}
            className="ds-arch__chip"
            style={{ "--chip": CHIP_COLOR[model.category] } as CSSProperties}
            initial={reduced ? false : { x: 140, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduced ? undefined : { x: -140, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span>
              {model.name}
              <small>{model.note}</small>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="ds-arch__arrow" aria-hidden="true" />
      <div className="ds-arch__platform">
        {modelSwitch.platform}
        <Unchanged k={switchKey} />
      </div>
      <span className="ds-arch__arrow" aria-hidden="true" />
      <div className="ds-arch__layers" aria-label="Layers that stay the same">
        {modelSwitch.layers.map((l) => (
          <div key={l} className="ds-arch__layer" style={{ "--lc": LAYER_COLOR[l] } as CSSProperties}>
            <i aria-hidden="true" />
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

function Unchanged({ k }: { k: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      key={k}
      className="ds-unchanged"
      initial={reduced || k === 0 ? false : { scale: 0.8, opacity: 0.4 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {modelSwitch.unchanged}
    </motion.span>
  );
}

export default function ModelSwitcher() {
  const [uc, setUc] = useState(0);
  const [mi, setMi] = useState(0);
  const [count, setCount] = useState(0);
  const useCase = useCases[uc];
  const model = useCase.models[mi % useCase.models.length];

  const switchModel = () => {
    setMi((m) => (m + 1) % useCase.models.length);
    setCount((c) => c + 1);
  };
  const pick = (i: number) => {
    if (i === mi) return;
    setMi(i);
    setCount((c) => c + 1);
  };

  return (
    <Section id="switch" eyebrow={modelSwitch.eyebrow} title={modelSwitch.title} lead={modelSwitch.lead}>
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <div className="grid gap-6">
            <p className="ds-h3">{modelSwitch.kicker}</p>
            <div>
              <p className="ds-tag mb-3">Use case</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a use case">
                {useCases.map((u, i) => (
                  <button
                    key={u.id}
                    type="button"
                    className="ds-pill"
                    aria-pressed={i === uc}
                    onClick={() => {
                      setUc(i);
                      setMi(0);
                      setCount((c) => c + 1);
                    }}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="ds-body">{useCase.why}</p>
            <div>
              <p className="ds-tag mb-3">Models that could do the job</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Choose a model">
                {useCase.models.map((m, i) => (
                  <button key={m.name} type="button" className="ds-pill flex items-center gap-2" aria-pressed={i === mi % useCase.models.length} onClick={() => pick(i)}>
                    <i className="h-2 w-2 rounded-full" style={{ background: CHIP_COLOR[m.category] }} aria-hidden="true" />
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button type="button" className="ds-btn ds-btn--primary" onClick={switchModel}>
                {modelSwitch.button}
                <span aria-hidden="true">⇄</span>
              </button>
              <p className="ds-small">
                Switched {count} {count === 1 ? "time" : "times"}. Everything beneath the model stayed put.
              </p>
            </div>
            <p className="ds-body">
              The product on the shelf changes. The building doesn&rsquo;t. That is what optionality means once it leaves the slide and enters the architecture.
            </p>
            <p className="ds-small">Model names as documented on Agent Platform, 5 September 2026. Preview models are pre-GA.</p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="ds-card p-6 md:p-8">
            <ArchitectureStack agent={useCase.agent} model={model} switchKey={count} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
