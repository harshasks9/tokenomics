"use client";

import { useMemo, useSyncExternalStore } from "react";
import Defs from "./Defs";
import { Directory, Lift } from "./Chrome";
import { EngineProvider, useReducedMotion, useReveal, useWalkEngine } from "./engine";
import { Pavement, Atrium, Escalator } from "./scenes/Walk";
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
import { Monday, Why, FourWays, TalkTrack, Strains, Footer } from "./scenes/Street";

const IVORY = "#f6f2ea";

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
        <Directory active={active} />
        <Lift active={active} />
        <main>
          <Pavement />
          <Atrium />
          <Escalator id="escalator-up" dir={1} from={IVORY} to="#f6f2ea" label="Going up · Floor 6, the Storefront" />
          <StorefrontFloor />
          <Escalator id="escalator-5" dir={-1} from="#f6f2ea" to="#ede4d3" label="Going down · Floor 5, the Tailoring Floor" />
          <TailoringFloor />
          <Escalator id="escalator-4" dir={-1} from="#ede4d3" to="#b9b3a5" label="Going down · Floor 4, the Model Floor" />
          <ModelFloorScene />
          <Escalator id="escalator-3" dir={-1} from="#e6e1d6" to="#efe8dc" label="Going down · Floor 3, Your Wardrobe" />
          <WardrobeFloor />
          <Escalator id="escalator-2" dir={-1} from="#efe8dc" to="#dcdcd6" label="Going down · Floor 2, Back of House" />
          <BackOfHouseFloor />
          <Escalator id="escalator-1" dir={-1} from="#d4d3cc" to="#0e0f12" dark label="Service stair · Floor 1, the Foundations" />
          <FoundationsFloor />
          <WallsScene />
          <DoorsScene />
          <Monday />
          <Why />
          <FourWays />
          <TalkTrack />
          <Strains />
        </main>
        <Footer />
      </div>
    </EngineProvider>
  );
}
