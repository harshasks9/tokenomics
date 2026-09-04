"use client";

import { useMemo, useSyncExternalStore } from "react";
import Defs from "./Defs";
import { TopBar } from "./Chrome";
import { EngineProvider, useReducedMotion, useReveal, useWalkEngine } from "./engine";
import { Pavement, Atrium, EscalatorUp } from "./scenes/Walk";
import {
  StorefrontFloor,
  TailoringFloor,
  ModelFloorScene,
  WardrobeFloor,
  BackOfHouseFloor,
  FoundationsFloor,
} from "./scenes/Floors";
import { WallsScene } from "./scenes/Walls";
import { DoorsScene } from "./scenes/Doors";
import { Receipt, Windows, Across, TalkTrack, Plaque, Footer } from "./scenes/Street";

export default function Site() {
  const reduced = useReducedMotion();
  const active = useWalkEngine(!reduced);
  useReveal();
  // true once hydrated on the client; false on the server and before JS runs.
  const js = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const engine = useMemo(() => ({ active, reduced, js }), [active, reduced, js]);

  return (
    <EngineProvider value={engine}>
      <div className={`ds-site${js ? " js" : ""}`}>
        <a className="ds-skip" href="#atrium">
          Skip to the atrium
        </a>
        <Defs />
        <TopBar active={active} />
        <main>
          <Pavement />
          <Atrium />
          <EscalatorUp />
          <StorefrontFloor />
          <TailoringFloor />
          <ModelFloorScene />
          <WardrobeFloor />
          <BackOfHouseFloor />
          <FoundationsFloor />
          <WallsScene />
          <DoorsScene />
          <Receipt />
          <Windows />
          <Across />
          <TalkTrack />
          <Plaque />
        </main>
        <Footer />
      </div>
    </EngineProvider>
  );
}
