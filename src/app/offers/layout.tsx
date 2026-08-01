import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./offers.css";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Offers — GenAI commercial scenario model",
  description:
    "Internal illustrative modeling of GSU, serving-tier and commitment economics.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#071E30",
  colorScheme: "dark",
};

export default function OffersLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`offers-root ${plexSans.variable} ${plexMono.variable}`}>
      {children}
    </div>
  );
}
