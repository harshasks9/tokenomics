import { describe, expect, it } from "vitest";
import { LAYER_IDS } from "../types";
import {
  ARCHITECTURES,
  CASE_STUDIES,
  CHALLENGES,
  GOOGLE_CAPABILITIES,
  INCIDENTS,
  LAYERS,
  PERSONAS,
  READINESS_QUESTIONS,
  RISKS,
  SOURCE_MAP,
} from "./index";

const riskIds = new Set(RISKS.map((r) => r.id));
const incidentIds = new Set(INCIDENTS.map((i) => i.id));
const capIds = new Set(GOOGLE_CAPABILITIES.map((c) => c.id));
const layerIds = new Set<string>(LAYER_IDS);

describe("governance data integrity", () => {
  it("defines all seven layers exactly once", () => {
    expect(LAYERS.map((l) => l.id)).toEqual([...LAYER_IDS]);
  });

  it("layers reference only known risks and capabilities", () => {
    for (const layer of LAYERS) {
      for (const id of layer.riskIds) expect(riskIds, `${layer.id} risk ${id}`).toContain(id);
      for (const id of layer.googleCapabilityIds) expect(capIds, `${layer.id} cap ${id}`).toContain(id);
    }
  });

  it("risks reference only known layers, incidents, and capabilities", () => {
    for (const risk of RISKS) {
      for (const id of risk.layerIds) expect(layerIds, `${risk.id} layer ${id}`).toContain(id);
      for (const id of risk.incidentIds) expect(incidentIds, `${risk.id} incident ${id}`).toContain(id);
      for (const id of risk.googleCapabilityIds) expect(capIds, `${risk.id} cap ${id}`).toContain(id);
    }
  });

  it("incidents reference known layers and sources", () => {
    for (const inc of INCIDENTS) {
      for (const id of inc.layerIds) expect(layerIds, `${inc.id} layer ${id}`).toContain(id);
      for (const id of inc.sourceIds) expect(SOURCE_MAP[id], `${inc.id} source ${id}`).toBeDefined();
    }
  });

  it("case studies reference known layers and sources", () => {
    for (const cs of CASE_STUDIES) {
      for (const id of cs.layerIds) expect(layerIds, `${cs.id} layer ${id}`).toContain(id);
      for (const id of cs.sourceIds) expect(SOURCE_MAP[id], `${cs.id} source ${id}`).toBeDefined();
    }
  });

  it("architectures reference known layers, risks, and capabilities", () => {
    for (const arch of ARCHITECTURES) {
      for (const note of arch.governanceNotes) expect(layerIds, `${arch.id} layer ${note.layerId}`).toContain(note.layerId);
      for (const id of arch.topRiskIds) expect(riskIds, `${arch.id} risk ${id}`).toContain(id);
      for (const id of arch.googleCapabilityIds) expect(capIds, `${arch.id} cap ${id}`).toContain(id);
    }
  });

  it("challenges cover every vendor and reference known layers", () => {
    for (const ch of CHALLENGES) {
      for (const id of ch.layerIds) expect(layerIds, `${ch.id} layer ${id}`).toContain(id);
      expect(Object.keys(ch.vendorNotes).sort()).toEqual(["anthropic", "aws", "google", "microsoft", "openai"]);
    }
  });

  it("personas reference known layers and internal links", () => {
    for (const p of PERSONAS) {
      for (const id of p.layerEmphasis) expect(layerIds, `${p.id} layer ${id}`).toContain(id);
      for (const stop of p.firstStops) expect(stop.href.startsWith("/governance"), `${p.id} link ${stop.href}`).toBe(true);
    }
  });

  it("readiness questions cover every layer with 4 maturity levels", () => {
    const covered = new Set(READINESS_QUESTIONS.map((q) => q.layerId));
    expect([...covered].sort()).toEqual([...LAYER_IDS].sort());
    for (const q of READINESS_QUESTIONS) expect(q.levels).toHaveLength(4);
  });

  it("every risk has at least one mitigating capability and control", () => {
    for (const risk of RISKS) {
      expect(risk.controls.length, `${risk.id} controls`).toBeGreaterThan(0);
      expect(risk.googleCapabilityIds.length, `${risk.id} caps`).toBeGreaterThan(0);
    }
  });
});
