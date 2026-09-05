"use client";

import { useCallback, useState } from "react";
import { TopBar, Navigator } from "./Nav";
import Hero from "./Hero";
import Idea from "./Idea";
import Explore from "./Explore";
import ModelGarden from "./ModelGarden";
import ModelSwitcher from "./ModelSwitcher";
import AgentBuilder from "./AgentBuilder";
import DataFlow from "./DataFlow";
import OpennessStack from "./OpennessStack";
import GovernanceLayer from "./GovernanceLayer";
import OptimizationLoop from "./OptimizationLoop";
import InfrastructureLayer from "./InfrastructureLayer";
import ArchetypeComparison from "./ArchetypeComparison";
import CustomerJourney from "./CustomerJourney";
import FinalCTA from "./FinalCTA";
import SourcesDrawer from "./SourcesDrawer";
import { methodology } from "@/lib/store/data";

export default function Site() {
  const [sources, setSources] = useState(false);
  const open = useCallback(() => setSources(true), []);
  const close = useCallback(() => setSources(false), []);
  return (
    <>
      <a className="ds-skip" href="#idea">
        Skip to content
      </a>
      <TopBar onSources={open} />
      <Navigator />
      <main>
        <Hero />
        <Idea />
        <Explore />
        <ModelGarden />
        <ModelSwitcher />
        <AgentBuilder />
        <DataFlow />
        <OpennessStack />
        <GovernanceLayer />
        <OptimizationLoop />
        <InfrastructureLayer />
        <ArchetypeComparison />
        <CustomerJourney />
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
    </>
  );
}
