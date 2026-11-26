#!/usr/bin/env python3
"""Build public/subsidy-math/claims-audit.md from src/lib/subsidy-math/claims.json.

The same JSON drives the microsite's claims section, so the two never drift.
Run from the repo root:  python3 scripts/subsidy-math/build_claims.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "src/lib/subsidy-math/claims.json"
OUT = ROOT / "public/subsidy-math/claims-audit.md"

CAT = {1: "1 · Proven by filings", 2: "2 · Defensible math", 3: "3 · Directional", 4: "4 · Unsupported / contradicted"}
SAY = {
    "say": ("What you can say with confidence", "Use as written. Each is disclosed in a filing or follows arithmetically from stated assumptions that a CFO would accept."),
    "qualify": ("What you can say with a qualification", "Use only with the caveat in the right-hand column. These depend on an assumption, an inference from rounded disclosures, or a field report."),
    "avoid": ("What you should not say", "Each of these is unsupported or contradicted by the evidence. Saying it would undermine the credibility of everything else."),
}


def cell(s: str) -> str:
    return (s or "").replace("|", "/").replace("\n", " ").strip()


def main() -> None:
    claims = json.loads(SRC.read_text())
    lines = [
        "# Claims audit",
        "",
        "**The Economics of AI: Is the Hyperscaler Subsidy Model Sustainable? · as of November 26, 2026**",
        "",
        "Every major finding, graded against the evidence after an independent skeptical review. Categories: **1** proven by disclosed financial data; **2** mathematically defensible under explicitly stated assumptions; **3** directionally supported but not conclusively proven; **4** unsupported or contradicted by available evidence. Base-case model figures are per $100 of list-price consumption and can be reproduced in the [Excel model](/subsidy-math/subsidy-math-model.xlsx).",
        "",
    ]
    for key in ("say", "qualify", "avoid"):
        title, blurb = SAY[key]
        rows = [c for c in claims if c["say"] == key]
        lines += [f"## {title}", "", blurb, ""]
        if key == "avoid":
            lines += ["| Don't say | Why not | Say this instead / note |", "|---|---|---|"]
            for c in rows:
                lines.append(f"| {cell(c['claim'])} | {cell(c['evidence'])} | {cell(c['counter'])} |")
        else:
            lines += ["| Claim | Category | Evidence | Caveat / strongest counterargument | Confidence |", "|---|---|---|---|---|"]
            for c in rows:
                ev = c["evidence"] + (f" Calculation: {c['calc']}" if c.get("calc") else "") + (f" Assumes: {c['assumptions']}" if c.get("assumptions") else "")
                lines.append(f"| {cell(c['claim'])} | {CAT[c['category']]} | {cell(ev)} | {cell(c['counter'])} | {c['confidence']} |")
        lines.append("")
    lines += ["## All findings by category", "", "| # | Category | Finding | Source | Calculation | Assumptions | Confidence | Strongest counterargument |", "|---|---|---|---|---|---|---|---|"]
    for i, c in enumerate(sorted(claims, key=lambda c: (c["category"], c["id"])), 1):
        lines.append(f"| {i} | {CAT[c['category']]} | {cell(c['claim'])} | {cell(c['source'])} | {cell(c.get('calc', '—'))} | {cell(c.get('assumptions', '—'))} | {c['confidence']} | {cell(c['counter'])} |")
    lines += ["", "*Generated from `src/lib/subsidy-math/claims.json` by `scripts/subsidy-math/build_claims.py`.*", ""]
    OUT.write_text("\n".join(lines))
    print(f"wrote {OUT.relative_to(ROOT)} ({len(claims)} claims)")


if __name__ == "__main__":
    main()
