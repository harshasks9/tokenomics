import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GE for Citizen — a Gemini agent for every resident at ~$2 a year",
  description:
    "Who to launch for first, what citizens would actually use, and whether a Gemini-powered citizen agent can work at about $2 per citizen per year.",
  robots: { index: false, follow: false },
};

export default function GeCitizenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
