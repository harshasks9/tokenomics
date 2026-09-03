"use client";

import { doors } from "@/lib/store/copy";
import { SceneObjects, SceneObject, TagList } from "../Objects";
import { DoorsRoom } from "../rooms";
import { DockCrates, AnnexCounters, ServicesTailor } from "../props";
import { Grain } from "../Defs";

export function DoorsScene() {
  return (
    <section id="doors" data-scene="doors" className="ds-scene ds-doors" aria-label="The doors and the annex">
      <div className="ds-stage">
        <div className="ds-frame ds-frame--fit">
          <div className="ds-doors__camera">
            <div className="ds-layer">
              <DoorsRoom />
            </div>
            <span className="ds-inframe ds-sign ds-sign--small ds-doors__sign" style={{ left: "17.5%", top: "12.5%" }}>
              Loading dock
            </span>
            <span className="ds-inframe ds-doors__annexsign" style={{ left: "51.25%", top: "21.2%" }}>
              Marketplace &amp; Partners
            </span>
            <span className="ds-inframe ds-doors__exitsign" style={{ left: "82.5%", top: "14.6%" }}>
              Exit
              <small>open APIs, open weights, A2A, MCP</small>
            </span>
            <div className="ds-layer ds-layer--interactive">
              <SceneObjects>
                <SceneObject row={doors.rows[0]} x={120} y={420} w={340} h={240} side="right">
                  <DockCrates />
                </SceneObject>
                <SceneObject row={doors.rows[1]} x={590} y={456} w={340} h={204} side="right">
                  <AnnexCounters />
                </SceneObject>
                <SceneObject row={doors.rows[2]} x={960} y={504} w={180} h={156} side="left">
                  <ServicesTailor />
                </SceneObject>
              </SceneObjects>
            </div>
          </div>
        </div>
        <div className="ds-copy ds-doors__head">
          <header className="ds-floorhead">
            <p className="ds-floorhead__number">Ground level</p>
            <h2 className="ds-floorhead__name">{doors.name}</h2>
            <p className="ds-floorhead__tagline">{doors.tagline}</p>
          </header>
        </div>
        <Grain />
        <div className="ds-doors__night" aria-hidden="true" />
      </div>
      <TagList rows={doors.rows} heading={doors.name} />
    </section>
  );
}
