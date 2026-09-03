import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI for the Modern Tax Authority — IRAS × Google Cloud",
  description:
    "An executive point of view for IRAS: transform taxpayer experiences, augment every officer, and build intelligent workflows — while preserving choice at every layer of the AI stack.",
};

export default function IrasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
