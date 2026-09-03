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
import { SceneObjects, SceneObject, TagList, Composite, Part } from "../Objects";
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

function row(floor: Floor, id: string) {
  const r = floor.rows.find((x) => x.id === id);
  if (!r) throw new Error(`missing row ${id}`);
  return r;
}

/* ------------------------------------------------------------------ */
/* Generic floor scene                                                  */
/* ------------------------------------------------------------------ */

function FloorScene({
  floor,
  className,
  room,
  children,
  dark = false,
  priceTag = false,
  headLight = false,
}: {
  floor: Floor;
  className: string;
  room: ReactNode;
  children: ReactNode;
  dark?: boolean;
  priceTag?: boolean;
  headLight?: boolean;
}) {
  return (
    <section
      id={floor.id}
      data-scene={floor.id}
      className={`ds-scene ds-floor ${className}`}
      aria-label={`Floor ${floor.number}: ${floor.name}`}
    >
      <div className="ds-stage">
        <div className="ds-frame">
          <div className="ds-layer ds-layer--move ds-floor__back">{room}</div>
          <div className="ds-floor__light" aria-hidden="true" />
          <div className="ds-layer ds-layer--interactive ds-layer--move ds-floor__objects">
            <SceneObjects>{children}</SceneObjects>
          </div>
        </div>
        <div className="ds-wallmark ds-wallmark--l" aria-hidden="true">
          <span>{WALL_TEXT}</span>
        </div>
        <div className="ds-wallmark ds-wallmark--r" aria-hidden="true">
          <span>{WALL_TEXT}</span>
        </div>
        <div className="ds-copy ds-floor__head">
          <header className={`ds-floorhead${headLight ? " ds-floorhead--light" : ""}`}>
            <p className="ds-floorhead__number">Floor {floor.number}</p>
            <h2 className="ds-floorhead__name">{floor.name}</h2>
            <p className="ds-floorhead__tagline">{floor.tagline}</p>
          </header>
        </div>
        <Grain dark={dark} />
      </div>
      <TagList rows={floor.rows} heading={floor.name} priceTag={priceTag} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 6 — The Storefront                                             */
/* ------------------------------------------------------------------ */

export function StorefrontFloor() {
  return (
    <FloorScene floor={storefront} className="ds-storefront" room={<StorefrontRoom />}>
      <SceneObject
        row={row(storefront, "concierge")}
        x={560}
        y={470}
        w={400}
        h={260}
        side="left"
        label={
          <span className="ds-desksign">
            Gemini Enterprise
            <small>Ask here</small>
          </span>
        }
      >
        <ConciergeDesk />
      </SceneObject>
      <SceneObject row={row(storefront, "storecard")} x={880} y={480} w={140} h={102} side="right">
        <StoreCard />
      </SceneObject>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 5 — The Tailoring Floor                                        */
/* ------------------------------------------------------------------ */

export function TailoringFloor() {
  return (
    <FloorScene floor={tailoring} className="ds-tailoring" room={<TailoringRoom />}>
      <SceneObject row={row(tailoring, "readytowear")} x={50} y={500} w={340} h={235} side="right">
        <ReadyToWearRail />
      </SceneObject>
      <SceneObject row={row(tailoring, "bench")} x={430} y={400} w={600} h={340} side="right">
        <Composite>
          <Part x={0} y={24} w={64} h={76}>
            <TailorBench />
          </Part>
          <Part x={64} y={0} w={36} h={100}>
            <Mannequin />
          </Part>
        </Composite>
      </SceneObject>
      <SceneObject row={row(tailoring, "alterations")} x={1130} y={500} w={360} h={240} side="left">
        <AlterationsCounter />
      </SceneObject>
      <SceneObject row={row(tailoring, "hangers")} x={1040} y={228} w={320} h={213} side="left" spotlight={false}>
        <HangerWall />
      </SceneObject>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 4 — The Model Floor                                            */
/* ------------------------------------------------------------------ */

const RACKS: { name: string; rowId: string; x: number; w: number; accent?: boolean }[] = [
  { name: "GEMMA", rowId: "gemma", x: 90, w: 180 },
  { name: "CLAUDE", rowId: "partner", x: 290, w: 180 },
  { name: "LLAMA", rowId: "open", x: 490, w: 180 },
  { name: "GEMINI", rowId: "gemini", x: 700, w: 210, accent: true },
  { name: "MISTRAL", rowId: "partner", x: 930, w: 180 },
  { name: "QWEN", rowId: "open", x: 1130, w: 180 },
  { name: "DEEPSEEK", rowId: "open", x: 1330, w: 180 },
];

const COUNTERS: { name: string; kind: "camera" | "film" | "music" | "mic" | "pharmacy"; x: number }[] = [
  { name: "IMAGEN", kind: "camera", x: 330 },
  { name: "VEO", kind: "film", x: 480 },
  { name: "LYRIA", kind: "music", x: 630 },
  { name: "CHIRP", kind: "mic", x: 780 },
  { name: "MEDLM", kind: "pharmacy", x: 930 },
];

function RackSpot({ on, small = false }: { on: number; small?: boolean }) {
  return (
    <span
      className={`ds-rack-spot${small ? " ds-rack-spot--small" : ""}`}
      aria-hidden="true"
      style={{ "--on": on } as CSSProperties}
    />
  );
}

export function ModelFloorScene() {
  // Spotlights come on left to right as the visitor walks in.
  const order = [...RACKS].sort((a, b) => a.x - b.x);
  return (
    <FloorScene floor={modelFloor} className="ds-model-floor" room={<ModelHall />} priceTag headLight>
      {/* specialist counters, second row */}
      {COUNTERS.map((c, i) => (
        <SceneObject
          key={c.name}
          row={row(modelFloor, "specialist")}
          x={c.x}
          y={450}
          w={130}
          h={130}
          side={i > 2 ? "left" : "right"}
          priceTag
          ariaLabel={`${c.name} counter — ${row(modelFloor, "specialist").element}`}
          style={{ "--on": 0.55 + i * 0.04 } as CSSProperties}
          label={<span className="ds-racklabel ds-racklabel--small">{c.name}</span>}
          extra={<RackSpot on={0.55 + i * 0.04} small />}
        >
          <SpecialistCounter kind={c.kind} />
        </SceneObject>
      ))}
      <SceneObject
        row={row(modelFloor, "byo")}
        x={1090}
        y={456}
        w={190}
        h={124}
        side="left"
        priceTag
        style={{ "--on": 0.78 } as CSSProperties}
        label={<span className="ds-racklabel ds-racklabel--small">Bring your own</span>}
        extra={<RackSpot on={0.78} />}
      >
        <ByoDesk />
      </SceneObject>

      {/* the racks, front row */}
      {order.map((r, i) => {
        const on = 0.06 + i * 0.065;
        return (
          <SceneObject
            key={r.name}
            row={row(modelFloor, r.rowId)}
            x={r.x}
            y={r.accent ? 560 : 600}
            w={r.w}
            h={r.accent ? 320 : 280}
            side={r.x > 800 ? "left" : "right"}
            priceTag
            ariaLabel={`${r.name} rack — ${row(modelFloor, r.rowId).element}`}
            className={r.accent ? "ds-rack ds-rack--house" : "ds-rack"}
            style={{ "--on": on } as CSSProperties}
            label={<span className={`ds-racklabel${r.accent ? " ds-racklabel--house" : ""}`}>{r.name}</span>}
            extra={<RackSpot on={on} />}
          >
            <Rack accent={r.accent} />
          </SceneObject>
        );
      })}
      {/* MODEL GARDEN overhead sign — the store floor itself */}
      <SceneObject
        row={row(modelFloor, "garden")}
        x={560}
        y={300}
        w={480}
        h={60}
        side="right"
        priceTag
        spotlight={false}
        className="ds-gardensign"
        style={{ "--on": 0 } as CSSProperties}
        label={<span className="ds-overhead">Model Garden</span>}
      >
        <span />
      </SceneObject>

    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 3 — Your Wardrobe                                              */
/* ------------------------------------------------------------------ */

export function WardrobeFloor() {
  return (
    <FloorScene floor={wardrobe} className="ds-wardrobe" room={<WardrobeRoom />}>
      <SceneObject row={row(wardrobe, "closet")} x={260} y={300} w={440} h={360} side="right">
        <Wardrobe />
      </SceneObject>
      <SceneObject row={row(wardrobe, "measurements")} x={760} y={360} w={500} h={300} side="left">
        <Composite>
          <Part x={0} y={0} w={32} h={100}>
            <DressForm />
          </Part>
          <Part x={34} y={34} w={66} h={66}>
            <MeasureBook />
          </Part>
        </Composite>
      </SceneObject>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 2 — Back of House                                              */
/* ------------------------------------------------------------------ */

export function BackOfHouseFloor() {
  return (
    <FloorScene floor={backOfHouse} className="ds-back-of-house" room={<BackOfHouseRoom />}>
      <SceneObject row={row(backOfHouse, "register")} x={360} y={386} w={440} h={294} side="right">
        <RegisterShelving />
      </SceneObject>
      <SceneObject
        row={row(backOfHouse, "fitting")}
        x={800}
        y={384}
        w={450}
        h={296}
        side="left"
        ariaLabel="Fitting rooms — hover or press to draw the curtains and compare Gemini, Claude and Llama on the same outfit"
      >
        <FittingRooms />
      </SceneObject>
      <SceneObject row={row(backOfHouse, "qc")} x={1270} y={520} w={240} h={160} side="left">
        <QCBench />
      </SceneObject>
    </FloorScene>
  );
}

/* ------------------------------------------------------------------ */
/* Floor 1 — The Foundations                                            */
/* ------------------------------------------------------------------ */

export function FoundationsFloor() {
  return (
    <FloorScene floor={foundations} className="ds-foundations" room={<FoundationsRoom />} dark headLight>
      <SceneObject row={row(foundations, "bays")} x={120} y={350} w={440} h={330} side="right">
        <LoadingBays />
      </SceneObject>
      <SceneObject row={row(foundations, "franchise")} x={640} y={440} w={240} h={240} side="right">
        <FranchiseModel />
      </SceneObject>
      <SceneObject row={row(foundations, "conveyor")} x={940} y={405} w={600} h={275} side="left">
        <Conveyor />
      </SceneObject>
    </FloorScene>
  );
}
