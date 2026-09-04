"use client";

import { doors } from "@/lib/store/copy";
import { Exhibit, Hotspot, Card, Narrator } from "../Objects";
import { DoorsRoom } from "../rooms";
import { DockCrates, AnnexCounters, ServicesTailor } from "../props";
import { Grain } from "../Defs";
import { FloorStack } from "../Chrome";
import { onAt } from "./Floors";

export function DoorsScene() {
  const d = doors;
  return (
    <section id="doors" data-scene="doors" className="ds-scene ds-floor ds-doors" aria-label="The doors and the annex">
      <Exhibit>
        <div className="ds-stage">
          <div className="ds-exhibit">
            <div className="ds-exhibit__scene">
              <div className="ds-frame">
                <div className="ds-doors__camera">
                  <div className="ds-layer">
                    <DoorsRoom />
                  </div>
                  <span className="ds-inframe ds-sign ds-sign--small ds-doors__sign" style={{ left: "17.5%", top: "30%" }}>
                    {d.dockSign}
                  </span>
                  <span className="ds-inframe ds-doors__annexsign" style={{ left: "51.25%", top: "25%" }}>
                    {d.annexSign}
                  </span>
                  <span className="ds-inframe ds-doors__exitsign" style={{ left: "82.5%", top: "24%" }}>
                    {d.exitSign}
                    <small>{d.exitSub}</small>
                  </span>
                  <div className="ds-layer ds-layer--interactive">
                    <Hotspot id="inbound" n={1} label={`${d.items[0].object}: ${d.items[0].capability}`} x={120} y={400} w={340} h={240} on={onAt(0)}>
                      <DockCrates />
                    </Hotspot>
                    <Hotspot id="outbound" n={2} label={`${d.items[1].object}: ${d.items[1].capability}`} x={1170} y={160} w={300} h={480} on={onAt(1)} spot={false} callout="tr">
                      <span />
                    </Hotspot>
                    <Hotspot id="annex" n={3} label={`${d.items[2].object}: ${d.items[2].capability}`} x={590} y={436} w={340} h={204} on={onAt(2)}>
                      <AnnexCounters />
                    </Hotspot>
                    <Hotspot id="annex" n={3} label={`${d.items[2].object}: ${d.items[2].capability}`} x={960} y={484} w={180} h={156} on={onAt(2)} callout="t">
                      <ServicesTailor />
                    </Hotspot>
                  </div>
                </div>
              </div>
              <header className="ds-floorhead">
                <span className="ds-floorhead__num">{d.number}</span>
                <div>
                  <h2 className="ds-floorhead__name">{d.name}</h2>
                  <p className="ds-floorhead__sub">{d.exitSub}</p>
                </div>
                <FloorStack level={0} />
              </header>
            </div>

            <div className="ds-legend">
              <Narrator className="ds-floor__narrator">{d.narrator}</Narrator>
              <ol className="ds-cards" aria-label="The doors and the annex">
                {d.items.map((it, i) => (
                  <Card key={it.id} item={it} n={i + 1} on={onAt(i)} />
                ))}
              </ol>
              <a href="#receipt" className="ds-next">
                <span className="ds-next__arrow" aria-hidden="true">
                  ↓
                </span>
                <span className="ds-next__to">Next · Your receipt</span>
                <span className="ds-next__line">{d.narratorOut}</span>
              </a>
            </div>
          </div>
          <Grain />
          <div className="ds-doors__night" aria-hidden="true" />
        </div>
      </Exhibit>
    </section>
  );
}
