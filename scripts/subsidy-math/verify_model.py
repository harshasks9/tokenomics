#!/usr/bin/env python3
"""
Verify public/subsidy-math/subsidy-math-model.xlsx against the Python reference port.

For the base case and each stress scenario in model_ref.STRESS_SCENARIOS this script
  1. copies the published workbook into the scratch folder (formulas only, cached values dropped),
     writing the scenario's overrides into the yellow "Your value" cells on Assumptions;
  2. recalculates the copy with LibreOffice headless;
  3. reads the computed values with openpyxl (data_only=True) and asserts that every registered
     output (waterfall, year drivers, lifetime rows and summaries, subsidy grid, one-time vs
     recurring, adjacency, equity, sensitivity, README glance table, Active inputs) matches
     model_ref.py within 1e-6, and that no cell anywhere holds an Excel error value.
It also checks that every registered output cell is a live formula and that the cached values
stored in the published file (what non-calculating viewers show) match the base case.

Where outputs live is taken from build_model.build_book(), so the layout never has to be
duplicated here. Exit status is non-zero on any failure.

    python3 scripts/subsidy-math/verify_model.py [--xlsx PATH] [--scratch DIR] [--base-only]
"""
from __future__ import annotations

import argparse
import math
import os
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_model as B  # noqa: E402
import model_ref as M  # noqa: E402

from openpyxl import load_workbook  # noqa: E402

TOL = 1e-6
ERROR_VALUES = {"#NULL!", "#DIV/0!", "#VALUE!", "#REF!", "#NAME?", "#NUM!", "#N/A", "#SPILL!", "#CALC!"}
INF_TEXT = {"never", "not recoverable", "unbounded"}
NA_TEXT = {"n/a"}
_SESSION_SCRATCH = Path("/tmp/claude-0/-home-user-tokenomics/f5db536d-86ef-5f7f-9e87-31915599183a/scratchpad")


def default_scratch() -> Path:
    if os.environ.get("SUBSIDY_MATH_SCRATCH"):
        return Path(os.environ["SUBSIDY_MATH_SCRATCH"])
    if _SESSION_SCRATCH.exists():
        return _SESSION_SCRATCH / "xlsx-check"
    return Path(tempfile.gettempdir()) / "subsidy-math-xlsx-check"


# ---------------------------------------------------------------------------------------
# Expected values from the reference port
# ---------------------------------------------------------------------------------------
WF_FIELDS = ["list", "discountProvider", "discountCloud", "creditsCloud", "creditsProvider", "creditsPartner",
             "customerPays", "providerRevenue", "channelFeePaid", "revenueSharePaid", "cloudNetRevenue", "infra",
             "infraDepreciation", "infraPower", "infraNetwork", "distribution", "providerServing",
             "computeContribution", "cloudContribution", "cloudEconomic", "providerContribution"]
LT_ROW_FIELDS = ["spend", "grossContribution", "incentiveCost", "adjacency", "contribution", "cumulative",
                 "discounted", "customerCredit"]
SUMMARY = {"npv": "npv", "cumulative": "cumulative", "paybackMonths": "paybackMonths",
           "effectiveCustomerDiscount": "effectiveCustomerDiscount"}


def _fund(inc):
    return {"partnerFunded": inc["partnerFunded"], "providerFunded": inc["providerFunded"]}


def expected_values(book: B.Book, I: dict) -> dict:
    E = {}
    L = M.LIST
    inc, lt, eq = I["incentive"], I["lifetime"], I["equity"]
    for rid in book.routes:
        p = I["routes"][rid]
        agent = p["structure"] == "agent"
        w = M.waterfall(p, inc)
        w0 = M.waterfall(p, M.NO_INCENTIVE)
        w1 = M.waterfall(p, {**_fund(inc), "pct": 1})
        for k in WF_FIELDS:
            E[f"wf|{rid}|{k}"] = w[k]
        E[f"wf|{rid}|channelFeeRate"] = max(0, p["channelFee"]) if agent else 0
        E[f"wf|{rid}|contributionPct"] = w["cloudContribution"] / w["cloudNetRevenue"] if w["cloudNetRevenue"] > 0 else None
        E[f"wf|{rid}|modelDev"] = w["cloudContribution"] - w["cloudEconomic"]
        E[f"wf|{rid}|m0"] = w0["cloudContribution"]
        E[f"wf|{rid}|slope"] = (w0["cloudContribution"] - w1["cloudContribution"]) / L
        E[f"wf|{rid}|breakEven"] = M.breakEvenIncentive(p, inc)
        E[f"wf|{rid}|m0Economic"] = w0["cloudEconomic"]
        E[f"wf|{rid}|slopeEconomic"] = (w0["cloudEconomic"] - w1["cloudEconomic"]) / L
        E[f"wf|{rid}|breakEvenEconomic"] = M.breakEvenIncentive(p, inc, True)
        E[f"wf|{rid}|check"] = 0.0

        drift = (1 - lt["efficiencyGain"]) / (1 - lt["priceDeflation"])
        for t in range(1, 6):
            opts = {"costScale": math.pow(drift, t - 1), "feeShift": lt["channelFeeDrift"] * (t - 1)}
            b = M.waterfall(p, M.NO_INCENTIVE, opts)
            f = M.waterfall(p, {**_fund(inc), "pct": 1}, opts)
            E[f"yd|{rid}|{t}|costScale"] = opts["costScale"]
            E[f"yd|{rid}|{t}|fee"] = max(0, p["channelFee"] + opts["feeShift"]) if agent else 0
            E[f"yd|{rid}|{t}|m0"] = b["cloudContribution"]
            E[f"yd|{rid}|{t}|slope"] = (b["cloudContribution"] - f["cloudContribution"]) / L
            E[f"yd|{rid}|{t}|df"] = 1 / math.pow(1 + lt["discountRate"], t)

        for typ in M.INCENTIVE_TYPES:
            i2 = {**inc, "type": typ}
            r5 = M.lifetime(p, i2, {**lt, "years": 5})
            for row in r5["rows"]:
                for k in LT_ROW_FIELDS:
                    E[f"lt|{rid}|{typ}|{row['year']}|{k}"] = row[k]
            rs = M.lifetime(p, i2, lt)
            for k in SUMMARY:
                E[f"ltsel|{rid}|{typ}|{k}"] = rs[k]
            for n in (1, 3, 5):
                rn_ = M.lifetime(p, i2, {**lt, "years": n})
                for k in SUMMARY:
                    E[f"lth|{rid}|{typ}|{n}|{k}"] = rn_[k]
                    if typ in ("one-time", "recurring"):
                        E[f"otr|{rid}|{typ}|{n}|{k}"] = rn_[k]
            # adjacency (model.ts requiredAttach)
            lw = {**lt, "includeAdjacency": True, "adjacencyAttach": 0, "commitAdjacencyUplift": 0}
            without = M.lifetime(p, i2, lw)["npv"]
            with1 = M.lifetime(p, i2, {**lw, "adjacencyAttach": 1})["npv"]
            req = M.requiredAttach(p, i2, lt)
            E[f"adj|{rid}|{typ}|npvWithout"] = without
            E[f"adj|{rid}|{typ}|pvSlope"] = with1 - without
            E[f"adj|{rid}|{typ}|requiredAttach"] = req
            fin = not math.isinf(req)
            E[f"adj|{rid}|{typ}|requiredGPPerYear"] = req * lt["adjacencyIncremental"] * lt["adjacencyMargin"] * L if fin else M.INF
            E[f"adj|{rid}|{typ}|requiredGPPV"] = max(0, -without) if fin else M.INF
        sel = M.lifetime(p, inc, lt)
        for k in SUMMARY:
            E[f"ltpick|{rid}|{k}"] = sel[k]
        for metric in ("npv", "cumulative"):
            E[f"otr|{rid}|gap5|{metric}"] = (M.lifetime(p, {**inc, "type": "recurring"}, {**lt, "years": 5})[metric]
                                            - M.lifetime(p, {**inc, "type": "one-time"}, {**lt, "years": 5})[metric])
        E[f"otr|{rid}|cliff"] = M.creditCliff(p["customerDiscount"], inc["pct"])

        for i, g in enumerate(M.subsidyGrid(p, inc, lt)):
            for k, v in g.items():
                if k != "level":
                    E[f"grid|{rid}|{i}|{k}"] = v
            E[f"grid|{rid}|{i}|breakEven"] = M.breakEvenIncentive(p, inc)

        sub = w0["cloudContribution"] - w["cloudContribution"]
        E[f"eq|{rid}|subsidyCost"] = sub
        E[f"eq|{rid}|creditsCloud"] = w["creditsCloud"]
        if agent:
            up = M.equityUplift(eq["stake"], eq["revenueMultiple"], eq["incrementalToProvider"], w["providerRevenue"])
            E[f"eq|{rid}|providerRevenue"] = w["providerRevenue"]
            E[f"eq|{rid}|uplift"] = up
            E[f"eq|{rid}|net"] = up - sub
            E[f"eq|{rid}|ratio"] = up / sub if sub > 0 else None
            den = eq["stake"] * eq["revenueMultiple"] * w["providerRevenue"]
            E[f"eq|{rid}|breakEvenIncremental"] = sub / den if den > 0 else None

        lt5 = {**lt, "years": 5}
        E[f"readme|{rid}|m0"] = w0["cloudContribution"]
        E[f"readme|{rid}|y1"] = w["cloudContribution"]
        E[f"readme|{rid}|breakEven"] = M.breakEvenIncentive(p, inc)
        E[f"readme|{rid}|npv5OneTime"] = M.lifetime(p, {**inc, "type": "one-time"}, lt5)["npv"]
        E[f"readme|{rid}|npv5Recurring"] = M.lifetime(p, {**inc, "type": "recurring"}, lt5)["npv"]
        E[f"readme|{rid}|payback5OneTime"] = M.lifetime(p, {**inc, "type": "one-time"}, lt5)["paybackMonths"]

        for key in M.ROUTE_PARAM_KEYS:
            E[f"active|route|{rid}|{key}"] = p[key]
    for key in M.INCENTIVE_KEYS:
        E[f"active|incentive|{key}"] = inc[key]
    E["active|incentive|cloudFunded"] = 1 - inc["partnerFunded"] - inc["providerFunded"]
    for key in M.LIFETIME_KEYS:
        v = lt[key]
        E[f"active|lifetime|{key}"] = (1 if v else 0) if key == "includeAdjacency" else v
    for key in M.EQUITY_KEYS:
        E[f"active|equity|{key}"] = eq[key]

    # sensitivity: one parameter at a time on the sensitivity route
    rid = book.sens_route
    raw = book.raw

    def case(sym, which):
        group, key = B.SYM_GROUP[sym]
        p = dict(I["routes"][rid])
        i2, l2 = dict(inc), dict(lt)
        if group == "route":
            p[key] = raw["routes"][rid]["params"][key][which]
        elif group == "incentive":
            i2[key] = raw["incentive"][key][which]
        else:
            v = raw["lifetime"][key][which]
            l2[key] = (v == 1) if key == "includeAdjacency" else v
        return p, i2, l2

    def metrics(p, i2, l2):
        return {"y1": M.waterfall(p, i2)["cloudContribution"], "be": M.breakEvenIncentive(p, i2),
                "npv5": M.lifetime(p, i2, {**l2, "years": 5})["npv"]}

    base = metrics(I["routes"][rid], inc, lt)
    for metric in ("y1", "be", "npv5"):
        E[f"sens|case|{metric}|base|base"] = base[metric]
        E[f"sens|{metric}|base"] = base[metric]
    for metric, syms in book.sens_syms.items():
        for sym in syms:
            for which in ("low", "high"):
                v = metrics(*case(sym, which))[metric]
                E[f"sens|case|{metric}|{sym}|{which}"] = v
                E[f"sens|{metric}|{sym}|{which}"] = v
    return E


# ---------------------------------------------------------------------------------------
def compare(expected, actual):
    """Return (ok, diff) for one cell."""
    if isinstance(expected, float) and math.isinf(expected):
        return (isinstance(actual, str) and actual in INF_TEXT), None
    if expected is None:
        return (isinstance(actual, str) and actual in NA_TEXT), None
    if isinstance(actual, bool) or not isinstance(actual, (int, float)):
        return False, None
    d = abs(float(actual) - float(expected))
    return d <= TOL, d


def scan_errors(wb):
    bad = []
    for ws in wb:
        for row in ws.iter_rows():
            for c in row:
                v = c.value
                if isinstance(v, str) and (v in ERROR_VALUES or v.startswith("Err:") or v.startswith("#NAME")):
                    bad.append(f"{ws.title}!{c.coordinate}={v}")
    return bad


def cell_value(wb, ref):
    sheet, coord = ref.split("!")
    return wb[sheet][coord].value


def check_values(book, wb_vals, I, label, failures):
    E = expected_values(book, I)
    missing = sorted(set(book.cells) - set(E))
    extra = sorted(set(E) - set(book.cells))
    if missing:
        failures.append(f"[{label}] {len(missing)} workbook outputs have no expected value, e.g. {missing[:5]}")
    if extra:
        failures.append(f"[{label}] {len(extra)} expected outputs are not in the workbook, e.g. {extra[:5]}")
    n, max_d, bad = 0, 0.0, []
    for key, ref in book.cells.items():
        if key not in E:
            continue
        a = cell_value(wb_vals, ref)
        ok, d = compare(E[key], a)
        n += 1
        if d is not None:
            max_d = max(max_d, d)
        if not ok:
            bad.append(f"{key} @ {ref}: workbook={a!r} expected={E[key]!r}")
    if bad:
        failures.append(f"[{label}] {len(bad)} mismatches:\n    " + "\n    ".join(bad[:25]))
    return n, max_d, len(bad)


def prepare_copy(src: Path, dst: Path, book, overrides: dict):
    """Formula-only copy of the workbook with overrides typed into the 'Your value' cells."""
    wb = load_workbook(src)
    for g in ("incentive", "lifetime", "equity"):
        for k, v in overrides.get(g, {}).items():
            ref = book.inputs[f"{g}|{k}"]
            sheet, coord = ref.split("!")
            wb[sheet][coord] = v
    for rid, kv in overrides.get("routes", {}).items():
        for k, v in kv.items():
            sheet, coord = book.inputs[f"route|{rid}|{k}"].split("!")
            wb[sheet][coord] = v
    wb.save(dst)


def main(argv=None):
    ap = argparse.ArgumentParser(description="Verify the Subsidy Math workbook against model_ref.py.")
    ap.add_argument("--xlsx", default=str(B.OUT_XLSX))
    ap.add_argument("--scratch", default=str(default_scratch()))
    ap.add_argument("--base-only", action="store_true", help="skip the stress scenarios")
    a = ap.parse_args(argv)
    xlsx = Path(a.xlsx)
    scratch = Path(a.scratch)
    scratch.mkdir(parents=True, exist_ok=True)
    if not xlsx.exists():
        print(f"FAIL: {xlsx} not found — run build_model.py first")
        return 1

    book = B.build_book(built="verify")
    I0 = M.model_inputs(book.raw)
    failures = []
    lines = []

    # 1. every registered output is a live formula in the published file
    wb_f = load_workbook(xlsx)
    not_formula = [f"{k} @ {ref}" for k, ref in book.cells.items()
                   if not (isinstance(cell_value(wb_f, ref), str) and str(cell_value(wb_f, ref)).startswith("="))]
    n_formulas = sum(1 for ws in wb_f for row in ws.iter_rows() for c in row
                     if isinstance(c.value, str) and c.value.startswith("="))
    if not_formula:
        failures.append(f"{len(not_formula)} outputs are not formulas, e.g. {not_formula[:5]}")
    if set(wb_f.sheetnames) != set(B.SHEETS):
        failures.append(f"sheet list differs: {wb_f.sheetnames}")
    lines.append(f"workbook: {xlsx.relative_to(B.ROOT) if xlsx.is_relative_to(B.ROOT) else xlsx} — {len(wb_f.sheetnames)} sheets, "
                 f"{n_formulas} formulas, {len(book.cells)} registered outputs, all live formulas: {'yes' if not not_formula else 'NO'}")

    # 2. cached values stored in the published file
    wb_cached = load_workbook(xlsx, data_only=True)
    cached_present = sum(1 for ref in book.cells.values() if cell_value(wb_cached, ref) is not None)
    if cached_present == 0:
        lines.append("cached values: none stored (built with --no-recalc)")
    else:
        errs = scan_errors(wb_cached)
        if errs:
            failures.append(f"[cached] {len(errs)} error values, e.g. {errs[:10]}")
        n, md, nb = check_values(book, wb_cached, I0, "cached", failures)
        lines.append(f"cached values in published file: {n} outputs checked, {nb} mismatches, max |diff| {md:.2e}, "
                     f"{len(errs)} error cells")

    # 3. fresh LibreOffice recalculation, base + stress scenarios
    scenarios = [{"name": "base", "overrides": {}}] + ([] if a.base_only else M.STRESS_SCENARIOS)
    for sc in scenarios:
        name = sc["name"]
        dst = scratch / f"{name}.xlsx"
        prepare_copy(xlsx, dst, book, sc["overrides"])
        rec = B.libreoffice_recalc(dst, scratch)
        vals = load_workbook(rec, data_only=True)
        errs = scan_errors(vals)
        if errs:
            failures.append(f"[{name}] {len(errs)} Excel error values, e.g. {errs[:10]}")
        I = M.apply_overrides(I0, sc["overrides"])
        n, md, nb = check_values(book, vals, I, name, failures)
        lines.append(f"scenario {name:20s}: {n} outputs checked, {nb} mismatches, max |diff| {md:.2e}, {len(errs)} error cells "
                     f"(recalculated copy: {rec})")

    print("Subsidy Math workbook verification")
    for ln in lines:
        print("  " + ln)
    if failures:
        print("FAILED")
        for f in failures:
            print("  - " + f)
        return 1
    print(f"PASSED — workbook ≡ model_ref.py within {TOL:g} on every registered output; no Excel error values.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
