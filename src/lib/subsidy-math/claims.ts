/**
 * Claims audit — every major finding, graded. Shared by the microsite (section 09 and
 * /subsidy-math/claims) and mirrored in public/subsidy-math/claims-audit.md.
 * Categories: 1 proven by disclosed financial data · 2 mathematically defensible under stated
 * assumptions · 3 directionally supported, not proven · 4 unsupported or contradicted.
 */

export type Category = 1 | 2 | 3 | 4;
export type Say = "say" | "qualify" | "avoid";

export const CATEGORY_LABEL: Record<Category, string> = {
  1: "Proven by filings",
  2: "Defensible math",
  3: "Directional",
  4: "Unsupported",
};

export interface Claim {
  id: string;
  category: Category;
  say: Say;
  claim: string;
  evidence: string;
  calc?: string;
  assumptions?: string;
  confidence: "High" | "Medium" | "Low";
  counter: string;
  source: string;
}

export const CLAIMS: Claim[] = [];
