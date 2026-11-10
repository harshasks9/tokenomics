/** The source library: every citation on the site resolves here. */
import raw from "./data/sources.json";
import type { Source, Verification } from "./types";

export const SOURCES = raw as Source[];
export const SOURCE_BY_ID: Record<string, Source> = Object.fromEntries(SOURCES.map((s) => [s.id, s]));
export const SOURCE_NUMBER: Record<string, number> = Object.fromEntries(SOURCES.map((s, i) => [s.id, i + 1]));

export const VERIFICATION_LABEL: Record<Verification, { label: string; help: string }> = {
  primary: { label: "Primary, read in full", help: "The source document was opened and read." },
  "data-mirror": { label: "Data mirror", help: "Official series read from an exact public mirror because the official host was blocked; cross-checked." },
  "search-excerpt": { label: "Search excerpt", help: "Content confirmed through search-engine excerpts of the page; the full document was not opened (host blocked in the research environment)." },
  secondary: { label: "Secondary only", help: "Known through reporting that cites the original, not the original itself." },
  "not-accessed": { label: "Not accessed", help: "Listed as a starting point; could not be opened in this research pass." },
  "prior-knowledge": { label: "Not re-verified", help: "From the analyst's background knowledge; not re-verified in this pass. Treat as provisional." },
};
