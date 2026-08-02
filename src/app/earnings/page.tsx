import Site from "@/components/earnings/Site";

/**
 * EARNINGS — a single fully static route. Every figure is hard-coded in
 * `src/lib/earnings/data.ts` and carries a fact/inference/hypothesis tag;
 * there is no API, no CMS and no fetch.
 */
export default function EarningsPage() {
  return <Site />;
}
