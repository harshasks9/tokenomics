import DealCheckApp from "@/components/deal-check/App";

/**
 * Deal check — compares AWS MAP 2.0 and the Google Private Offer for an
 * Anthropic model workload. Fully static: every figure is computed in the
 * browser by `src/lib/deal-check/engine.ts`; no API, no fetch, no storage.
 */
export default function DealCheckPage() {
  return <DealCheckApp />;
}
