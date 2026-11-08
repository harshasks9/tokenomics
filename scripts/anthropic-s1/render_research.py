#!/usr/bin/env python3
"""Render research/s1-amendment-diff.md, research/top-20-insights.md and
research/google-cloud-ai-gtm.md from the structured datasets so the prose and
the microsite never drift apart.

Usage (from repo root): python3 -I scripts/anthropic-s1/render_research.py
"""
import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
D = os.path.join(ROOT, "data", "anthropic-s1")
R = os.path.join(ROOT, "research")
S1 = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
S1A = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm"


def load(name):
    with open(os.path.join(D, name), encoding="utf-8") as f:
        return json.load(f)


def diff_md():
    ch = load("amendment-changes.json")
    st = ch["_meta"]["stats"]
    out = [
        "# Anthropic S-1 (Oct 26, 2026) vs S-1/A No. 1 (Nov 2, 2026): what actually changed",
        "",
        f"Sources: [Form S-1]({S1}) · [Form S-1/A]({S1A}). EDGAR shows no further amendment through the Nov 7, 2026 research cutoff.",
        "",
        "## Bottom line",
        "",
        "- **The October S-1 was a Q2 filing.** Its financial statements ran through **June 30, 2026** (EDGAR description \"S-1 (Q2)\"), while customer counts, NRR and concentration metrics were already stated as of Sep 30, 2026. The amendment rolls the financial statements forward to **nine months ended Sep 30, 2026** and adds a Q3 2026 column to the quarterly table.",
        "- **The biggest numbers were blank in October**: Q3 revenue, the ~$895.4B commitment total, the contractual-obligations table, the $150–175B excluded estimate, and liquidity. All were filled in on Nov 2.",
        "- **New Q3 narrative**: a $567M Q3 operating loss (vs $974M Q2 operating income) driven by **$5.0B of short-term compute** and **$2.0B** of non-cash donation-matching charges; **~$600M** of Q3 revenue lost to price reductions; positive **$6.6B** nine-month operating cash flow; S&M falling from 22% to 14% of revenue on channel mix and renegotiated channel terms.",
        "- **New risk language**: Anthropic \"may imminently meet\" its Responsible Scaling Policy definition of \"dramatically accelerated progress attributable to AI\"; it is considering human review of R&D decisions; suppliers' own financing can delay or reprice contracted capacity; $213.8B of commitments are contingent or terminable.",
        "- **Not new**: the 5–7% policy-violating revenue estimate, ~900% NRR, the 11,900 / 1,900 / 250 customer tiers, and the top-five ≈25% concentration were all already in the October filing.",
        "- **No October operating data**: \"our Run-Rate Revenue was $ as of October 31, 2026\" is **blank in both filings**. An October filing date is not October performance data.",
        "",
        "## Method",
        "",
        f"Both filings were downloaded from EDGAR, converted to text (`scripts/anthropic-s1/extract_text.py`) and compared sentence-by-sentence after removing pagination and line-wraps (`diff_filings.py`, `condense_diff.py`). The diff produced **{st['changedPassages']} changed passages**; most are period roll-forwards (\"six months ended June 30\" → \"nine months ended September 30\") and copy edits. Risk factors: **{st['riskFactorsAddedOrDeleted']} added or removed**, {st['riskFactorParagraphsChanged']} paragraphs edited, ~{st['substantiveRiskFactorChanges']} substantively. Each item below was checked in both documents. Page numbers are printed folios in the EDGAR HTML (±1 vs a PDF rendering where image pages intervene).",
        "",
        "## Change log",
        "",
        "| # | Category | Change | Oct 26 → Nov 2 delta | Materiality | Confidence | S-1 p. | S-1/A p. |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for i, c in enumerate(ch["changes"], 1):
        out.append(f"| {i} | {c['category']} | {c['title']} | {c['delta']} | {c['materiality']} | {c['confidence']} | {c['evidence']['s1Page']} | {c['evidence']['s1aPage']} |")
    out += ["", "## Detail", ""]
    for i, c in enumerate(ch["changes"], 1):
        out += [
            f"### {i}. {c['title']}",
            "",
            f"*{c['category']} · topic: {c['tag']} · section: {c['section']}*",
            "",
            f"- **Original (Oct 26):** {c['original']}",
            f"- **Updated (Nov 2):** {c['amended']}",
            f"- **Actual delta:** {c['delta']}",
            f"- **Why it matters:** {c['whyItMatters']}",
            f"- **Interpretation:** {c['interpretation']}",
            f"- **Competitive implication:** {c['competitiveImplication']}",
            f"- **Confidence:** {c['confidence']} · **Evidence:** S-1 p. {c['evidence']['s1Page']}; S-1/A p. {c['evidence']['s1aPage']}",
            "",
        ]
    out += [
        "## Specific investigation: is there October operating data in the amendment?",
        "",
        "No. The only October-dated metric placeholder — \"Additionally, our Run-Rate Revenue was $ as of October 31, 2026\" (Business, S-1/A p. 198; S-1 p. 194) — is blank in both filings. October *events* do appear (Broadcom's assignment of part of the 2026 Lease Arrangement to a financing SPV; amendments to the Google and Microsoft agreements; ~$100.2B of new commitments after Sep 30; the 28.0M-share donation-match settlement; executive-agreement amendments), but no October revenue, usage or customer figures. Run-rate figures reported in the press for October are not from the filing.",
        "",
    ]
    with open(os.path.join(R, "s1-amendment-diff.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(out))


def insights_md():
    ins = load("insights.json")
    ev = {e["id"]: e for e in load("evidence.json")["items"]}
    gaps = load("gaps.json")["items"]
    kinds = [("surprising", "A. Surprising revelations"), ("unsurprising", "B. Unsurprising confirmations — quantified"),
             ("underappreciated", "C. Underappreciated implications"), ("contradiction", "D. Contradictions and tensions")]
    out = ["# The most important findings from Anthropic's S-1 and S-1/A", "",
           f"{len(ins['items'])} insight cards (the microsite shows the same set). Each lists the evidence, why it matters, what is surprising, the competitive implication, an alternative explanation, what to watch and a confidence grade. Evidence IDs resolve to verbatim filing quotes in `data/anthropic-s1/evidence.json`.", ""]
    n = 0
    for k, title in kinds:
        out += [f"## {title}", ""]
        for it in [i for i in ins["items"] if i["kind"] == k]:
            n += 1
            refs = []
            for r in it["evidenceIds"]:
                e = ev.get(r)
                if e:
                    refs.append(f"{e['metric']} ({'S-1/A' if e['sourceId']=='s1a' else 'S-1'} p. {e['page']})")
            out += [f"### {n}. {it['headline']}", "", "**What the evidence says**", ""]
            out += [f"- {x}" for x in it["evidence"]]
            out += ["", f"**Why it matters.** {it['whyItMatters']}", "",
                    f"**What is surprising.** {it['whatIsSurprising']}", "",
                    f"**Competitive implication.** {it['competitiveImplication']}", "",
                    f"**Alternative explanation.** {it['alternativeExplanation']}", "",
                    f"**What to watch.** {it['whatToWatch']}", "",
                    f"**Confidence:** {it['confidence']}", "",
                    "**Sources:** " + "; ".join(refs + [f"<{l}>" for l in it["links"]]) + f" — [S-1/A]({S1A})", ""]
    out += ["## E. What the filing does not tell us", "", "Absence of disclosure is not evidence of weakness.", "",
            "| Gap | Status | Why it matters | What we can bound | Disclosure that would resolve it |", "|---|---|---|---|---|"]
    for g in gaps:
        out.append(f"| {g['title']} | {g['status']} | {g['whyItMatters']} | {g['whatWeCanBound']} | {g['disclosureNeeded']} |")
    with open(os.path.join(R, "top-20-insights.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


def gtm_md():
    g = load("google-cloud-gtm.json")
    ev = {e["id"]: e for e in load("evidence.json")["items"]}
    mk = {m["id"]: m for m in load("market.json")["items"]}
    areas = {a["id"]: a["label"] for a in g["areas"]}
    ranks = ["High", "Medium", "Low"]
    items = {i["id"]: i for i in g["items"]}

    def refs(ids):
        out = []
        for r in ids:
            e = ev[r]
            out.append(f"{e['metric']} ({'S-1/A' if e['sourceId'] == 's1a' else 'S-1'} p. {e['page']})")
        return "; ".join(out)

    def ctx(ids):
        return "; ".join(f"[{mk[m]['entity']}: {mk[m]['metric']}]({mk[m]['url']}) ({mk[m]['basis']}, {mk[m]['confidence']})" for m in ids)

    m, ex = g["_meta"], g["example"]
    out = [f"# {m['title']}", "", m["subtitle"], "",
           f"Companion to the microsite page `/under-the-hood/google-cloud-gtm`. Research cutoff {m['asOf']}. Sources: [Form S-1]({S1}) · [Form S-1/A]({S1A}).", "",
           f"**Method.** {m['method']}", "", "**Rubric**", ""]
    out += [f"- **{r}** — {m['rubric'][r]}" for r in ranks]
    out += ["", f"_{m['disclaimer']}_", "", "## The example, checked", "",
            f"> {ex['claim']}", "", f"**Verdict: {ex['verdict']}.** {ex['says']}", "", "What it does not say:", ""]
    out += [f"- {d}" for d in ex["doesNotSay"]]
    out += ["", f"**So what.** {ex['soWhat']}", "", f"Sources: {refs(ex['evidenceIds'])}. Context: {ctx(ex['marketIds'])}.", "",
            "## Six moves", ""]
    for n, mv in enumerate(g["moves"], 1):
        out.append(f"{n}. **{mv['title']}.** {mv['body']} _(Based on: {', '.join(items[r]['title'] + ' [' + items[r]['rank'] + ']' for r in mv['refs'])}.)_")
    out += ["", "## Where Anthropic's growth pays Google vs costs Google", "", "Do not sum these rows: they mix minimums, estimates and amounts outside the $895.4B aggregate.", "",
            "| Pays Google | Source |", "|---|---|"]
    out += [f"| {r['item']} | {refs(r['evidenceIds'])} |" for r in g["ledger"]["pays"]]
    out += ["", "| Costs Google | Source |", "|---|---|"]
    out += [f"| {r['item']} | {refs(r['evidenceIds'])}{'; ' + ctx(r['marketIds']) if r.get('marketIds') else ''} |" for r in g["ledger"]["costs"]]
    out += ["", "## Summary", "", "| Rank | # | Implication | Area | Owner | Horizon |", "|---|---|---|---|---|---|"]
    n = 0
    for r in ranks:
        for it in [i for i in g["items"] if i["rank"] == r]:
            n += 1
            out.append(f"| {r} | {n} | {it['title']} | {areas[it['area']]} | {it['owner']} | {it['horizon']} |")
    n = 0
    for r in ranks:
        out += ["", f"## {r} implications", "", f"_{m['rubric'][r]}_", ""]
        for it in [i for i in g["items"] if i["rank"] == r]:
            n += 1
            out += [f"### {n}. {it['title']}", "",
                    f"- **Statistic ({it['statKind']}):** {it['stat']}",
                    f"- **Read it precisely:** {it['reading']}",
                    f"- **What it means for Google Cloud:** {it['implication']}",
                    f"- **The play:** {it['play']}",
                    f"- **Owner:** {it['owner']} · **Leading metric:** {it['metric']} · **Horizon:** {it['horizon']}",
                    f"- **Why {r}:** {it['rankWhy']}",
                    f"- **Sources:** {refs(it['evidenceIds'])}" + (f". Context: {ctx(it['marketIds'])}" if it["marketIds"] else ""),
                    f"- **Deep dive:** `/under-the-hood#{it['deepDive']}`", ""]
    with open(os.path.join(R, "google-cloud-ai-gtm.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(out) + "\n")


if __name__ == "__main__":
    os.makedirs(R, exist_ok=True)
    diff_md()
    insights_md()
    gtm_md()
    print("rendered research/s1-amendment-diff.md, research/top-20-insights.md and research/google-cloud-ai-gtm.md")
