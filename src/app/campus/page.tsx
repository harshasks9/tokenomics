import type { Metadata } from "next";
import { CampusApp } from "./app";

export const metadata: Metadata = {
  title: "Campus Front Office — one queue for every request your institution receives",
  description:
    "Indian universities have a system of record for everything and a system of response for nothing. Campus Front Office receives every enquiry, fee question, certificate request and placement deadline, works it across the systems you already run, and closes it.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CampusApp />;
}
