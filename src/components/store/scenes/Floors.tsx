"use client";

import type { CSSProperties, ReactNode } from "react";
import {
  storefront,
  tailoring,
  modelFloor,
  wardrobe,
  backOfHouse,
  foundations,
  type Floor,
} from "@/lib/store/copy";
import { Exhibit, Hotspot, Card, Narrator } from "../Objects";
import { FloorStack } from "../Chrome";
import { Grain } from "../Defs";
import {
  StorefrontRoom,
  TailoringRoom,
  ModelHall,
  WardrobeRoom,
  BackOfHouseRoom,
  FoundationsRoom,
} from "../rooms";
import {
  ConciergeDesk,
  StoreCard,
  TailorBench,
  Mannequin,
  AlterationsCounter,
  HangerWall,
  ReadyToWearRail,
  Rack,
  SpecialistCounter,
  ByoDesk,
  Wardrobe,
  DressForm,
  MeasureBook,
  RegisterShelving,
  FittingRooms,
  QCBench,
  LoadingBays,
  FranchiseModel,
  Conveyor,
} from "../props";

const WALL_TEXT = "Security · Governance · Residency · Audit";

/** Progress at which card/object i lights up. */
export const onAt = (i: number) => 0.14 + i * 0.09;

function itemIndex(floor: Floor, id: string) {
  const i = floor.items.findIndex((x) => x.id === id);
  if (i < 0) throw new Error(`missing item ${id}`);
  return i;
}

/* ------------------------------------------------------------------ */
/* Exhibit scene: room on top, legend beneath                           */
/* ------------------------------------------------------------------ */

export function ExhibitScene({
  id,
  className,
  number,
  name,
  sub,
  narrator,
  items,
  outro,
  next,
  room,
  children,
  dark = false,
  cols,
  signage,
  ariaLabel,
  level,
}: {
  id: string;
  className: string;
  number: string;
  name: string;
  sub: string;
  narrator: string;
  items: Floor["items"];
  outro: string;
  next: { id: string; number: string; name: string };
  room: ReactNode;
  children: ReactNode;
  dark?: boolean;
  cols?: number;
  signage?: ReactNode;
  ariaLabel?: string;
  level: number;
}) {
  return (
    <section
      id={id}
      data-scene={id}
      className={`ds-scene ds-floor ${className}`}
      aria-label={ariaLabel ?? `Floor ${number}: ${name}`}
      style={{ "--cols": cols ?? Math.min(items.length, 4) } as CSSProperties}
    >
      <Exhibit>
        <div className="ds-stage">
          <div className="ds-exhibit">
            <div className="ds-exhibit__scene">
              <div className="ds-frame">
                <div className="ds-layer ds-layer--move ds-floor__back">{room}</div>
                <div className="ds-floor__light" aria-hidden="true" />
                <div className="ds-layer ds-layer--interactive ds-layer--move ds-floor__objects">{children}</div>
                {signage}
              </div>
              <div className="ds-wallmark ds-wallmark--l" aria-hidden="true">
                <span>{WALL_TEXT}</span>
              </div>
              <div className="ds-wallmark ds-wallmark--r" aria-hidden="true">
                <span>{WALL_TEXT}</span>
              </div>
              <header className={`ds-floorhead${dark ? " ds-floorhead--dark" : ""}`}>
                <span className="ds-floorhead__num">{number}</span>
                <div>
                  <h2 className="ds-floorhead__name">{name}</h2>
                  <p className="ds-floorhead__sub">{sub}</p>
                </div>
                <FloorStack level={level} />
              </header>
            </div>

            <div className="ds-legend">
              <Narrator className="ds-floor__narrator">{narrator}</Narrator>
              <ol className="ds-cards" aria-label={`What is on floor ${number}`}>
                {items.map((it, i) => (
                  <Card key={it.id} item={it} n={i + 1} on={onAt(i)} />
                ))}
              </ol>
              <a href={`#${next.id}`} className="ds-next">
                <span className="ds-next__arrow" aria-hidden="true">
                  ↓
                </span>
                <span className="ds-next__to">
                  Next · {next.number} · {next.name}
                </span>
                <span className="ds-next__line">{outro}</span>
              </a>
            </div>
          </div>
          <Grain dark={dark} />
        </div>
      </Exhibit>
    </section>
  );
}

function FloorScene({
  floor,
  className,
  room,
  children,
  dark,
  cols,
  signage,
}: {
  floor: Floor;
  className: string;
  room: ReactNode;
  children: ReactNode;
  dark?: boolean;
  cols?: number;
  signage?: ReactNode;
}) {
  return (
    <ExhibitScene
      id={floor.id}
      className={className}
      number={floor.number}
      name={floor.name}
      sub={floor.sub}
      narrator={floor.narrator}
      items={floor.items}
      outro={floor.outro}
      next={floor.next}
      room={room}
      dark={dark}
      cols={cols}
      signage={signage}
      level={Number(floor.number)}
    >
      {children}
    </ExhibitScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 6 — The Storefront                                             */
/* ------------------------------------------------------------------ */

export function StorefrontFloor() {
  const f = storefront;
  return (
    <FloorScene floor={f} className="ds-storefront" room={<StorefrontRoom />}>
      <Hotspot
        id="concierge"
        n={1}
        label={`${f.items[0].object}: ${f.items[0].capability}`}
        x={560}
        y={430}
        w={400}
        h={260}
        on={onAt(0)}
        signage={<span className="ds-desksign">{f.signs?.desk}</span>}
      >
        <ConciergeDesk />
      </Hotspot>
      <Hotspot id="storecard" n={2} label={`${f.items[1].object}: ${f.items[1].capability}`} x={880} y={440} w={140} h={102} on={onAt(1)} callout="tr">
        <StoreCard />
      </Hotspot>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 5 — The Tailoring Floor                                        */
/* ------------------------------------------------------------------ */

export function TailoringFloor() {
  const f = tailoring;
  const lab = (id: string) => {
    const it = f.items[itemIndex(f, id)];
    return `${it.object}: ${it.capability}`;
  };
  return (
    <FloorScene floor={f} className="ds-tailoring" room={<TailoringRoom />}>
      <Hotspot id="readytowear" n={4} label={lab("readytowear")} x={50} y={470} w={340} h={235} on={onAt(3)}>
        <ReadyToWearRail />
      </Hotspot>
      <Hotspot
        id="bench"
        n={1}
        label={lab("bench")}
        x={430}
        y={370}
        w={600}
        h={340}
        on={onAt(0)}
        signage={<span className="ds-pinsign">{f.signs?.mannequin}</span>}
      >
        <div className="ds-composite">
          <div className="ds-part" style={{ left: "0%", top: "24%", width: "64%", height: "76%" }}>
            <TailorBench />
          </div>
          <div className="ds-part" style={{ left: "64%", top: "0%", width: "36%", height: "100%" }}>
            <Mannequin />
          </div>
        </div>
      </Hotspot>
      <Hotspot id="alterations" n={2} label={lab("alterations")} x={1130} y={470} w={360} h={240} on={onAt(1)} callout="tr">
        <AlterationsCounter />
      </Hotspot>
      <Hotspot id="hangers" n={3} label={lab("hangers")} x={1040} y={200} w={320} h={213} on={onAt(2)} spot={false} callout="tr">
        <HangerWall />
      </Hotspot>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 4 — The Model Floor                                            */
/* ------------------------------------------------------------------ */

const RACKS: { name: string; item: string; x: number; w: number; accent?: boolean }[] = [
  { name: "GEMMA", item: "gemma", x: 90, w: 180 },
  { name: "CLAUDE", item: "claude", x: 290, w: 180 },
  { name: "LLAMA", item: "open", x: 490, w: 180 },
  { name: "GEMINI", item: "gemini", x: 700, w: 210, accent: true },
  { name: "MISTRAL", item: "open", x: 930, w: 180 },
  { name: "QWEN", item: "open", x: 1130, w: 180 },
  { name: "DEEPSEEK", item: "open", x: 1330, w: 180 },
];

const COUNTERS: { name: string; kind: "camera" | "film" | "music" | "mic" | "pharmacy"; x: number }[] = [
  { name: "IMAGEN", kind: "camera", x: 330 },
  { name: "VEO", kind: "film", x: 480 },
  { name: "LYRIA", kind: "music", x: 630 },
  { name: "CHIRP", kind: "mic", x: 780 },
  { name: "MEDLM", kind: "pharmacy", x: 930 },
];

const GROUPS = [
  { label: "House brand", x: 700, w: 210 },
  { label: "Own-label", x: 90, w: 180 },
  { label: "Partner brand", x: 290, w: 180 },
  { label: "Open-weights", x: 490, w: 180, span: true },
];

export function ModelFloorScene() {
  const f = modelFloor;
  const n = (id: string) => itemIndex(f, id) + 1;
  const on = (id: string) => onAt(itemIndex(f, id));
  const lab = (obj: string, id: string) => `${obj}: ${f.items[itemIndex(f, id)].capability}`;
  return (
    <FloorScene
      floor={f}
      className="ds-model-floor"
      room={<ModelHall />}
      dark
      cols={3}
      signage={
        <>
          <span className="ds-inframe ds-overhead" style={{ left: "50%", top: "28.5%" }}>
            {f.signs?.overhead}
          </span>
          {/* group brackets under the front row */}
          {GROUPS.map((g) => (
            <span
              key={g.label}
              className="ds-bracket"
              style={{
                left: `${(g.x / 1600) * 100}%`,
                width: g.span ? `${((1510 - 490) / 1600) * 100}%` : `${(g.w / 1600) * 100}%`,
                top: "73.5%",
              }}
            >
              {g.label}
            </span>
          ))}
        </>
      }
    >
      {COUNTERS.map((c) => (
        <Hotspot
          key={c.name}
          id="specialist"
          n={n("specialist")}
          label={lab(`The ${c.name} counter`, "specialist")}
          x={c.x}
          y={300}
          w={120}
          h={110}
          on={on("specialist")}
          className="ds-rack--counter"
          callout="tr"
          signage={<span className="ds-racklabel ds-racklabel--small">{c.name}</span>}
        >
          <SpecialistCounter kind={c.kind} />
        </Hotspot>
      ))}
      <Hotspot
        id="byo"
        n={n("byo")}
        label={lab("The desk at the end of the hall", "byo")}
        x={1090}
        y={300}
        w={180}
        h={110}
        on={on("byo")}
        callout="tr"
        signage={<span className="ds-racklabel ds-racklabel--small">{f.signs?.byo}</span>}
      >
        <ByoDesk />
      </Hotspot>
      {RACKS.map((r, i) => (
        <Hotspot
          key={r.name}
          id={r.item}
          n={n(r.item)}
          label={lab(`The ${r.name} rack`, r.item)}
          x={r.x}
          y={r.accent ? 380 : 400}
          w={r.w}
          h={r.accent ? 270 : 250}
          on={onAt(itemIndex(f, r.item)) + i * 0.01}
          className={r.accent ? "ds-rack ds-rack--house" : "ds-rack"}
          callout={r.x > 800 ? "tr" : "tl"}
          signage={
            <>
              <span className={`ds-racklabel${r.accent ? " ds-racklabel--house" : ""}`}>{r.name}</span>
              <span className="ds-pricetag">{f.signs?.price}</span>
            </>
          }
        >
          <Rack accent={r.accent} />
        </Hotspot>
      ))}
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 3 — Your Wardrobe                                              */
/* ------------------------------------------------------------------ */

export function WardrobeFloor() {
  const f = wardrobe;
  return (
    <FloorScene floor={f} className="ds-wardrobe" room={<WardrobeRoom />}>
      <Hotspot
        id="closet"
        n={1}
        label={`${f.items[0].object}: ${f.items[0].capability}`}
        x={260}
        y={280}
        w={440}
        h={360}
        on={onAt(0)}
        signage={<span className="ds-doorplaque">{f.signs?.plaque}</span>}
      >
        <Wardrobe />
      </Hotspot>
      <Hotspot id="measurements" n={2} label={`${f.items[1].object}: ${f.items[1].capability}`} x={760} y={340} w={500} h={300} on={onAt(1)} callout="tr">
        <div className="ds-composite">
          <div className="ds-part" style={{ left: "0%", top: "0%", width: "32%", height: "100%" }}>
            <DressForm />
          </div>
          <div className="ds-part" style={{ left: "34%", top: "34%", width: "66%", height: "66%" }}>
            <MeasureBook />
          </div>
        </div>
      </Hotspot>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 2 — Back of House                                              */
/* ------------------------------------------------------------------ */

export function BackOfHouseFloor() {
  const f = backOfHouse;
  return (
    <FloorScene
      floor={f}
      className="ds-back-of-house"
      room={<BackOfHouseRoom />}
      signage={
        <span className="ds-inframe ds-sign ds-sign--small" style={{ left: "36%", top: "36%" }}>
          {f.signs?.register}
        </span>
      }
    >
      <Hotspot id="register" n={1} label={`${f.items[0].object}: ${f.items[0].capability}`} x={360} y={366} w={440} h={294} on={onAt(0)}>
        <RegisterShelving />
      </Hotspot>
      <Hotspot
        id="fitting"
        n={2}
        label={`${f.items[1].object}: ${f.items[1].capability} — curtains draw back to show Gemini, Claude and Llama on the same outfit`}
        x={800}
        y={364}
        w={450}
        h={296}
        on={onAt(1)}
        callout="tr"
      >
        <FittingRooms />
      </Hotspot>
      <Hotspot id="qc" n={3} label={`${f.items[2].object}: ${f.items[2].capability}`} x={1270} y={500} w={240} h={160} on={onAt(2)} callout="tr">
        <QCBench />
      </Hotspot>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 1 — The Foundations                                            */
/* ------------------------------------------------------------------ */

export function FoundationsFloor() {
  const f = foundations;
  return (
    <FloorScene floor={f} className="ds-foundations" room={<FoundationsRoom />} dark>
      <Hotspot id="bays" n={1} label={`${f.items[0].object}: ${f.items[0].capability}`} x={120} y={330} w={440} h={330} on={onAt(0)}>
        <LoadingBays />
      </Hotspot>
      <Hotspot id="franchise" n={2} label={`${f.items[1].object}: ${f.items[1].capability}`} x={640} y={420} w={240} h={240} on={onAt(1)}>
        <FranchiseModel />
      </Hotspot>
      <Hotspot id="conveyor" n={3} label={`${f.items[2].object}: ${f.items[2].capability}`} x={940} y={385} w={600} h={275} on={onAt(2)} callout="tr">
        <Conveyor />
      </Hotspot>
    </FloorScene>
  );
}
