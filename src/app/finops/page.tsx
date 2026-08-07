import FinOpsApp from "@/components/finops/App";

/**
 * FrontierOps — multi-cloud AI FinOps dashboard prototype. Fully static:
 * every figure is computed from the synthetic estate in `src/lib/finops/`
 * (token math in engine.ts); there is no API and no fetch.
 */
export default function FinOpsPage() {
  return <FinOpsApp />;
}
