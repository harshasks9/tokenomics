import type { Metadata } from "next";
import OneDeskApp from "./app";

export const metadata: Metadata = {
  title: "One Desk — the agentic front office for Indian higher education",
  description:
    "A university has forty desks. A student needs one. Indian universities do not have a communication problem — they have a completion problem.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OneDeskApp />;
}
