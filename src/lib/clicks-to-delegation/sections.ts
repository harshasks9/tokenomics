/** Site architecture: one entry per narrative section, in reading order. */
export const SECTIONS = [
  { id: "transition", num: "01", nav: "The great commerce transition" },
  { id: "timelines", num: "02", nav: "History repeats, until it doesn't" },
  { id: "adoption", num: "03", nav: "The adoption race" },
  { id: "cases", num: "04", nav: "Who got it right and wrong" },
  { id: "analogies", num: "05", nav: "The analogy engine" },
  { id: "ladder", num: "06", nav: "The delegation ladder" },
  { id: "money", num: "07", nav: "Follow the money" },
  { id: "gatekeepers", num: "08", nav: "The new gatekeepers" },
  { id: "categories", num: "09", nav: "Which categories move first" },
  { id: "geography", num: "10", nav: "One transition, many geographies" },
  { id: "futures", num: "11", nav: "Three possible futures" },
  { id: "playbook", num: "12", nav: "The retailer's playbook" },
  { id: "contrarian", num: "13", nav: "The contrarian view" },
  { id: "insights", num: "→", nav: "Ten non-obvious insights" },
  { id: "method", num: "14", nav: "Research & methodology" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
