import type { Metadata } from "next";
import GtmPage from "@/components/under-the-hood/GtmPage";

/**
 * Companion brief to ANTHROPIC: UNDER THE HOOD. Ranked (High / Medium / Low)
 * implications of the S-1 statistics for Google Cloud's AI go-to-market.
 * Content: /data/anthropic-s1/google-cloud-gtm.json; checks: validate.ts.
 */
export const metadata: Metadata = {
  title: "What it means for Google Cloud AI GTM — ANTHROPIC: UNDER THE HOOD",
  description:
    "Every go-to-market-relevant statistic in Anthropic's S-1 and S-1/A, read from Google Cloud's side and ranked High, Medium or Low, each linked to the verbatim filing quote and to the full teardown.",
  openGraph: {
    title: "What it means for Google Cloud AI GTM",
    description: "Anthropic's S-1 statistics ranked by implication for Google Cloud's AI go-to-market.",
    siteName: "aitokenomics",
    type: "article",
  },
};

export default function GoogleCloudGtmPage() {
  return <GtmPage />;
}
