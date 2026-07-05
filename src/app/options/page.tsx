import type { Metadata } from "next";
import OptionsDashboard from "@/components/options/OptionsDashboard";
import { getCachedOrRunScreen } from "@/lib/options/screener";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Read-Only Cash-Secured Put Screener",
  description: "A password-gated, read-only cash-secured-put wheel screener for ranking candidates. Not investment advice.",
};

export default async function OptionsPage() {
  const result = await getCachedOrRunScreen();
  return <OptionsDashboard initialResult={result} />;
}
