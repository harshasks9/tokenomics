import Site from "@/components/pricing/Site";

/**
 * PRICING — model pricing, capability and value explorer.
 * Static facts come from the typed catalog in src/lib/pricing/; the client
 * overlays the daily cron snapshot from /api/pricing when present.
 */
export default function PricingPage() {
  return <Site />;
}
