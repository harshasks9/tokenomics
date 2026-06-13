import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WealthAI Tokenomics Showcase — Tiered Model Economics",
  description: "CEO-facing demo: proving the economics of a tiered model architecture (Claude Opus + Gemini Flash) across Build → Run → Extend.",
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
