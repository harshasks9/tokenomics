import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GE for Citizen — a Gemini agent for every resident at ~$2 a year",
  description:
    "The Gemini agent, extended from every employee to every resident: who to launch for first, what citizens would use, and whether it works at about $2 per citizen per year.",
  robots: { index: false, follow: false },
};

export default function GeCitizenLayout({ children }: { children: React.ReactNode }) {
  return children;
}
