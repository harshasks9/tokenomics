import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./korea-fy27.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
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
    <div className={`k-root ${inter.variable}`} data-ja-mirror-control translate="no">
      {children}
    </div>
  );
}
