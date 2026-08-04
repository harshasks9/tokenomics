import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import "./fsi.css";

const display = Archivo({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--fsi-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--fsi-body", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "600"], variable: "--fsi-mono", display: "swap" });

export const metadata: Metadata = {
  title: "FSI Knowledge Hub — Financial Services AI & Agentic Transformation (Internal)",
  description:
    "Internal evidence register for Google Cloud India FSI field teams: production cases, workflow scoring, competitive map, architecture, regulation. Current as of August 2026.",
  robots: { index: false, follow: false },
};

export default function FsiLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</div>;
}
