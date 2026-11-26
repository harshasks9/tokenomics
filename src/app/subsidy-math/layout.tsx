import type { Metadata, Viewport } from "next";
import "./sm.css";

export const metadata: Metadata = {
  title: "Subsidy Math — The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable?",
  description:
    "Follow $100 of AI spending through AWS Bedrock, Azure OpenAI and Google Vertex AI. Who keeps what, how big a coupon each cloud can afford, one-time credits vs permanent discounts, the money circles between clouds and model makers, and what is proven versus assumed.",
  openGraph: {
    title: "Subsidy Math — Follow the $100",
    description: "Is the hyperscaler AI subsidy model sustainable? An evidence-graded economic analysis.",
    siteName: "aitokenomics",
    type: "article",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", colorScheme: "light" };

export default function SubsidyMathLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="sm-root">{children}</div>;
}
