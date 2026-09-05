"use client";

import { useCallback, useState } from "react";
import { MotionConfig } from "framer-motion";
import { TopBar, Navigator } from "./Nav";
import Hero from "./Hero";
import Problem from "./Problem";
import Analogy from "./Analogy";
import ModelSwitcher from "./ModelSwitcher";
import Differentiation from "./Differentiation";
import TalkTrack from "./TalkTrack";
import Explore from "./Explore";
import CustomerJourney from "./CustomerJourney";
import ModelGarden from "./ModelGarden";
import AgentBuilder from "./AgentBuilder";
import DataFlow from "./DataFlow";
import OpennessStack from "./OpennessStack";
import GovernanceLayer from "./GovernanceLayer";
import SecurityLayer from "./SecurityLayer";
import OptimizationLoop from "./OptimizationLoop";
import InfrastructureLayer from "./InfrastructureLayer";
import ArchetypeComparison from "./ArchetypeComparison";
import FinalCTA from "./FinalCTA";
import SourcesDrawer from "./SourcesDrawer";
import { methodology } from "@/lib/store/data";

/**
 * Narrative order: customer problem → local store analogy → why optionality
 * matters → why this is different → the 90-second talk track → map the store
 * to the platform → customer journey → then the platform as proof.
 */
export default function Site() {
  const [sources, setSources] = useState(false);
  const open = useCallback(() => setSources(true), []);
  const close = useCallback(() => setSources(false), []);
  return (
    <MotionConfig reducedMotion="user">
      <a className="ds-skip" href="#problem">
        Skip to content
      </a>
      <TopBar onSources={open} />
      <Navigator />
      <main>
        <Hero />
        <Problem />
        <Analogy />
        <ModelSwitcher />
        <Differentiation />
        <TalkTrack />
        <Explore />
        <CustomerJourney />
        <div className="ds-section !pb-0" aria-hidden="true">
          <div className="ds-container">
            <p className="ds-eyebrow">The rest is proof</p>
            <p className="ds-h2 mt-2" style={{ fontSize: "clamp(26px, 3vw, 40px)" }}>
              Everything below is the building behind the thesis.
            </p>
          </div>
        </div>
        <ModelGarden />
        <AgentBuilder />
        <DataFlow />
        <OpennessStack />
        <GovernanceLayer />
        <SecurityLayer />
        <OptimizationLoop />
        <InfrastructureLayer />
        <ArchetypeComparison />
        <FinalCTA />
      </main>
      <footer className="ds-section ds-dark !pt-8 !pb-10 border-t border-[var(--dark-line)]">
        <div className="ds-container flex flex-wrap items-center justify-between gap-4">
          <p className="ds-small max-w-[70ch]">{methodology[methodology.length - 1]}</p>
          <div className="flex items-center gap-3">
            <button type="button" className="ds-btn ds-btn--ghost ds-btn--sm" onClick={open}>
              Sources &amp; methodology
            </button>
            <span className="ds-small">2026</span>
          </div>
        </div>
      </footer>
      <SourcesDrawer open={sources} onClose={close} />
    </MotionConfig>
  );
}
