import type { Layer, LayerId } from "../types";
import { LAYERS } from "./layers";
import { RISKS } from "./risks";
import { INCIDENTS } from "./incidents";
import { PERSONAS } from "./personas";
import { CASE_STUDIES } from "./examples";
import { VENDORS, CHALLENGES } from "./vendors";
import { ARCHITECTURES } from "./architectures";
import { GOOGLE_CAPABILITIES } from "./google";
import { READINESS_QUESTIONS, MATURITY_STAGES } from "./readiness";
import { SOURCES, SOURCE_MAP } from "./sources";

export {
  LAYERS,
  RISKS,
  INCIDENTS,
  PERSONAS,
  CASE_STUDIES,
  VENDORS,
  CHALLENGES,
  ARCHITECTURES,
  GOOGLE_CAPABILITIES,
  READINESS_QUESTIONS,
  MATURITY_STAGES,
  SOURCES,
  SOURCE_MAP,
};

export function getLayer(id: LayerId): Layer {
  const layer = LAYERS.find((l) => l.id === id);
  if (!layer) throw new Error(`Unknown layer: ${id}`);
  return layer;
}

export const LAYER_MAP: Record<string, Layer> = Object.fromEntries(
  LAYERS.map((l) => [l.id, l]),
);

export function risksForLayer(layerId: LayerId) {
  return RISKS.filter((r) => r.layerIds.includes(layerId));
}

export function capabilitiesForLayer(layerId: LayerId) {
  return GOOGLE_CAPABILITIES.filter((c) => c.layerIds.includes(layerId));
}

export function examplesForLayer(layerId: LayerId) {
  return CASE_STUDIES.filter((e) => e.layerIds.includes(layerId));
}

export function capabilitiesById(ids: string[]) {
  return ids
    .map((id) => GOOGLE_CAPABILITIES.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
}
