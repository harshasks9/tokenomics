import type { Metadata } from "next";
import JapaneseMirror from "@/components/JapaneseMirror";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Tokenomics — Opus + Gemini Routing Economics",
  description: "Interactive scenarios comparing Opus + Gemini routing, Opus + Sonnet, and single-model deployments across Build, Run, and Extend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full">
        <JapaneseMirror>{children}</JapaneseMirror>
      </body>
    </html>
  );
}
