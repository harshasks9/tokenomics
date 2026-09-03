"use client";

import { useState } from "react";
import { walls } from "@/lib/store/copy";
import CrossSection, { XS_TARGETS } from "../CrossSection";
import { SceneObjects, SceneObject, TagList } from "../Objects";
import { SecurityDesk, ReturnsCounter } from "../props";
import { Grain } from "../Defs";
import { useScrollTo } from "../engine";

export function WallsScene() {
  const [hover, setHover] = useState<string | null>(null);
  const scrollTo = useScrollTo();
  const target = XS_TARGETS.find((t) => t.id === hover);

  return (
    <section id="walls" data-scene="walls" className="ds-scene ds-walls" aria-label="The walls: governance">
      <div className="ds-stage">
        <div className="ds-walls__grid">
          <div className="ds-walls__section">
            <CrossSection onSelect={scrollTo} onHover={setHover} />
          </div>
          <div className="ds-walls__side">
            <header className="ds-floorhead ds-floorhead--light">
              <p className="ds-floorhead__number">Not a floor</p>
              <h2 className="ds-floorhead__name">{walls.name}</h2>
              <p className="ds-floorhead__tagline">{walls.tagline}</p>
            </header>
            <SceneObjects>
              <div className="ds-walls__desks">
                <div className="ds-walls__desk">
                  <SceneObject row={walls.rows[0]} x={0} y={0} w={0} h={0} flow side="right" spotlight={false}>
                    <SecurityDesk />
                  </SceneObject>
                </div>
                <div className="ds-walls__desk">
                  <SceneObject row={walls.rows[1]} x={0} y={0} w={0} h={0} flow side="right" spotlight={false}>
                    <ReturnsCounter />
                  </SceneObject>
                </div>
              </div>
            </SceneObjects>
            <p className="ds-walls__caption" aria-live="polite">
              {target ? (
                <>
                  <strong>{target.label}</strong> — {target.caption}
                </>
              ) : (
                "You have walked all of this. Every floor on the section is a door back to it."
              )}
            </p>
            <p className="ds-walls__lettering">Security · Governance · Residency · Audit</p>
          </div>
        </div>
        <Grain dark />
      </div>
      <TagList rows={walls.rows} heading={walls.name} />
    </section>
  );
}
