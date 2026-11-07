#!/usr/bin/env python3
"""Extract the core financial tables from the S-1 / S-1/A text into JSON.

Reads the text files produced by extract_text.py and writes
data/anthropic-s1/extracted-tables.json. Every value is copied verbatim from a
flattened table row (in $ millions unless stated); nothing is estimated here.
The hand-curated datasets in data/anthropic-s1/*.json are checked against this
file by src/lib/under-the-hood/validate.test.ts.

Usage:
  python3 -I extract_financials.py <s1.txt> <s1a.txt> <out.json>
"""
import json
import re
import sys

NUM = re.compile(r"^\(?\$?\s*-?[\d,]+(\.\d+)?\s*\)?\s*%?$|^—$|^NM$")


def parse_num(cell):
    c = cell.replace("$", "").replace(" ", "").strip()
    if c in ("—", "-", ""):
        return 0.0
    if c == "NM":
        return None
    neg = c.startswith("(") and c.endswith(")") or c.startswith("(") and c.endswith(")%")
    c = c.strip("()%").replace(",", "").rstrip(")")
    try:
        v = float(c)
    except ValueError:
        return None
    return -v if neg else v


def rows_after(lines, start_idx, labels, ncols, max_scan=80):
    """Return {label: [numbers]} for the first row starting with each label after start_idx."""
    out = {}
    for i in range(start_idx, min(len(lines), start_idx + max_scan)):
        ln = lines[i]
        if " | " not in ln:
            continue
        cells = [c.strip() for c in ln.split(" | ")]
        label = cells[0]
        for want in labels:
            if want in out:
                continue
            if label.startswith(want):
                # some rows merge "$ 376" as one cell already; keep last ncols numeric cells
                nums = [parse_num(c) for c in cells[1:] if NUM.match(c.replace(" ", "").replace("$", "")) or c in ("—",)]
                out[want] = nums[-ncols:] if len(nums) >= ncols else nums
    return out


def find(lines, pattern, start=0):
    rx = re.compile(pattern)
    for i in range(start, len(lines)):
        if rx.search(lines[i]):
            return i
    raise ValueError(f"pattern not found: {pattern}")


PNL_LABELS = [
    "Revenue", "Compute and infrastructure", "Personnel", "Bartz settlement",
    "Sales, marketing, and partnerships", "Other operating and administrative",
    "Total operating expenses", "Operating income (loss)", "Operating loss", "Interest income",
    "Change in fair value of convertible notes", "Other income (expense), net",
    "Total other income (expense), net", "Loss before provision for income taxes",
    "Provision for income taxes", "Net loss",
]
ADJ_OI_LABELS = ["Operating income (loss)", "Operating loss", "Stock-based compensation expense",
                 "Non-cash charitable contributions", "Bartz settlement", "Adjusted Operating Income (Loss)",
                 "Revenue", "Operating margin", "Adjusted Operating Margin"]
ADJ_NI_LABELS = ["Net loss", "Stock-based compensation expense", "Non-cash charitable contributions",
                 "Bartz settlement", "Change in fair value of convertible notes",
                 "Change in fair value of certain mark-to- market", "Change in fair value of certain mark-to-market",
                 "Income tax effects and adjustments", "Adjusted Net Income (Loss)"]


def extract_s1a(lines):
    d = {}
    q = find(lines, r"^Quarterly Consolidated Statements of Operations$")
    d["quarterly_columns"] = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026", "Q3 2026"]
    d["quarterly_pnl"] = rows_after(lines, q, PNL_LABELS, 7)
    qa = find(lines, r"^Quarterly Adjusted Operating Income")
    d["quarterly_adjusted_operating_income"] = rows_after(lines, qa, ADJ_OI_LABELS, 7)
    qn = find(lines, r"^Quarterly Adjusted Net Income")
    d["quarterly_adjusted_net_income"] = rows_after(lines, qn, ADJ_NI_LABELS, 7)

    r = find(lines, r"^Results of Operations$")
    d["annual_columns"] = ["FY2023", "FY2024", "FY2025", "9M2025", "9M2026"]
    d["annual_pnl"] = rows_after(lines, r, PNL_LABELS, 5)
    a = find(lines, r"^We define Adjusted Operating Income \(Loss\) as", r)
    d["annual_adjusted_operating_income"] = rows_after(lines, a, ADJ_OI_LABELS, 5)
    n = find(lines, r"^A reconciliation of Adjusted Net Income", a)
    d["annual_adjusted_net_income"] = rows_after(lines, n, ADJ_NI_LABELS, 5)

    c = find(lines, r"^The following table shows a summary of our cash flows")
    d["cash_flows"] = rows_after(lines, c, ["Operating activities", "Investing activities", "Financing activities"], 5)

    co = find(lines, r"^The following table summarizes our contractual obligations as of September 30, 2026")
    d["contractual_obligations_columns"] = ["Total", "2026", "2027", "2028", "2029", "2030", "Thereafter"]
    d["contractual_obligations"] = rows_after(lines, co, ["Operating leases", "Finance leases", "Purchase commitments", "Total"], 7)

    f = find(lines, r"^The following table presents the Company’s operating expenses grouped by function")
    d["functional_opex"] = rows_after(lines, f, ["Cost of revenue", "Research and development", "Sales and marketing",
                                                 "Bartz settlement", "General and administrative", "Total operating expenses"], 5)
    g = find(lines, r"^The following table presents revenue by geographical region")
    d["revenue_by_geography"] = rows_after(lines, g, ["United States", "International", "Total"], 5)
    t = find(lines, r"^The following table presents consumption-based and subscription-based revenue")
    d["revenue_by_type"] = rows_after(lines, t, ["Consumption-based", "Subscription-based", "Total"], 5)
    b = find(lines, r"^Consolidated Balance Sheet Data$")
    d["balance_sheet_summary_sep30_2026"] = rows_after(lines, b, [
        "Cash, cash equivalents, and short-term investments", "Working capital", "Total assets",
        "Total liabilities", "Redeemable convertible preferred stock", "Additional paid-in capital",
        "Accumulated deficit", "Total stockholders’ deficit"], 1, 20)
    return d


def extract_s1(lines):
    d = {}
    r = find(lines, r"^Results of Operations$")
    d["annual_columns"] = ["FY2023", "FY2024", "FY2025", "6M2025", "6M2026"]
    d["annual_pnl"] = rows_after(lines, r, PNL_LABELS, 5)
    a = find(lines, r"^We define Adjusted Operating Income \(Loss\) as", r)
    d["annual_adjusted_operating_income"] = rows_after(lines, a, ADJ_OI_LABELS, 5)
    c = find(lines, r"^The following table shows a summary of our cash flows")
    d["cash_flows"] = rows_after(lines, c, ["Operating activities", "Investing activities", "Financing activities"], 5)
    q = find(lines, r"^Quarterly Consolidated Statements of Operations$")
    d["quarterly_columns"] = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025", "Q1 2026", "Q2 2026"]
    d["quarterly_pnl"] = rows_after(lines, q, PNL_LABELS, 6)
    co = find(lines, r"^The following table summarizes our contractual obligations")
    d["contractual_obligations_raw_rows"] = [l for l in lines[co:co + 12] if " | " in l or l.startswith(("Operating", "Finance", "Purchase", "Total"))]
    return d


def main():
    s1, s1a, dst = sys.argv[1:4]
    L1 = open(s1, encoding="utf-8").read().split("\n")
    L2 = open(s1a, encoding="utf-8").read().split("\n")
    out = {
        "_meta": {
            "description": "Tables parsed verbatim from Anthropic, PBC S-1 (2026-10-26) and S-1/A No.1 (2026-11-02). $ millions unless noted; negative = loss/outflow.",
            "s1_url": "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm",
            "s1a_url": "https://www.sec.gov/Archives/edgar/data/2130357/000162828026068676/anthropicpbc-sx1ax1.htm",
            "generated_by": "scripts/anthropic-s1/extract_financials.py",
        },
        "s1a": extract_s1a(L2),
        "s1": extract_s1(L1),
    }
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=1, ensure_ascii=False)
    print("wrote", dst)


if __name__ == "__main__":
    main()
