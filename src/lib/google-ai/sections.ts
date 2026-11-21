/**
 * Navigation. Five specialist pages first — the things someone opens every day — then the reference library.
 * `wide` pages hold tables or canvases and use the full width; the rest read as documents.
 */
export interface SectionDef {
  slug: string;
  label: string;
  icon: string;
  group: "daily" | "reference";
  wide?: boolean;
  blurb: string;
}

export const SECTIONS: SectionDef[] = [
  { slug: "", label: "Today", icon: "☀️", group: "daily", blurb: "What an AI specialist must know right now" },
  { slug: "industries", label: "Industries", icon: "🏭", group: "daily", wide: true, blurb: "News, examples and talking points by sub-vertical" },
  { slug: "cases", label: "Case studies", icon: "📚", group: "daily", wide: true, blurb: "How customers use AI, on Google Cloud and elsewhere" },
  { slug: "quiz", label: "Quiz", icon: "🎯", group: "daily", blurb: "Test what you know about recent developments" },
  { slug: "graph", label: "Graph", icon: "🕸️", group: "daily", wide: true, blurb: "Everything connected: move from one thing to the next" },
  { slug: "latest", label: "All developments", icon: "📰", group: "reference", blurb: "Every recorded development, filterable" },
  { slug: "briefing", label: "Briefing", icon: "📊", group: "reference", wide: true, blurb: "Executive brief, change radar and deadlines" },
  { slug: "stack", label: "AI stack", icon: "🧱", group: "reference", wide: true, blurb: "Eight layers from silicon to distribution" },
  { slug: "models", label: "Models", icon: "🤖", group: "reference", wide: true, blurb: "Catalogue and family tree" },
  { slug: "compare", label: "Compare", icon: "⚖️", group: "reference", wide: true, blurb: "Head-to-head and battlegrounds" },
  { slug: "pricing", label: "Pricing", icon: "💵", group: "reference", wide: true, blurb: "Prices, calculator and history" },
  { slug: "enterprise", label: "Workloads", icon: "🧩", group: "reference", wide: true, blurb: "Reference stacks by workload" },
  { slug: "timeline", label: "Timeline", icon: "🕰️", group: "reference", wide: true, blurb: "History and the time machine" },
  { slug: "research", label: "Sources and method", icon: "🔬", group: "reference", blurb: "How this site works and what it rests on" },
];

export const SECTION_BY_SLUG = Object.fromEntries(SECTIONS.map((s) => [s.slug, s]));
