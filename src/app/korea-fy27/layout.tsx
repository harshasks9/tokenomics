import type { Metadata, Viewport } from "next";
// Fonts are self-hosted from src/fonts (see build-fonts.py there) so builds never
// download from Google Fonts. Same fonts, weights and CSS variables as before.
// next/font/local names each family after its const, so consts carry a site prefix
// to stay unique across sites (and distinct from the global Google "Inter").
import localFont from "next/font/local";
import "./korea-fy27.css";

const koreaFy27Inter = localFont({
  src: [
    { path: "../../fonts/inter.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "600", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/inter.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-k27",
  display: "swap",
});

// Kept neutral: the passcode page inherits this, and link previews of
// korea.aitokenomics.app must not carry plan figures. The plan page sets its own.
export const metadata: Metadata = {
  title: "Korea AI · FY27",
  description: "Internal page. Access requires the team passcode.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export const viewport: Viewport = {
  themeColor: "#0d2a52",
};

export default function KoreaFy27Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  // data-ja-mirror-control opts the whole plan out of the Japanese mirror's
  // machine translation, so internal text is never sent to /api/translate.
  return (
    <div className={`k-root ${koreaFy27Inter.variable}`} data-ja-mirror-control translate="no">
      {children}
    </div>
  );
}
