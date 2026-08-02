import Site from "@/components/modelcomp/Site";

/**
 * MODELCOMP — a single fully static route. Every figure is hard-coded in
 * `src/lib/modelcomp/data.ts`; there is no API, no CMS and no fetch.
 */
export default function ModelcompPage() {
  return <Site />;
}
