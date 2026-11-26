#!/usr/bin/env python3
"""
Subsidy Math — Python reference port of src/lib/subsidy-math/model.ts.

This file mirrors the TypeScript engine line for line (same function names, same field
names, same branch order) so that three implementations can be checked against each
other:  TypeScript (model.ts)  ==  Python (this file)  ==  Excel (subsidy-math-model.xlsx).

* Constants (LIST, INFRA_SPLIT, INCENTIVE_LEVELS) are parsed from model.ts at import time,
  so they can never drift from the canonical engine.
* Parameter values are read from src/lib/subsidy-math/params.json, mapped exactly the way
  src/lib/subsidy-math/params.ts maps them (default incentive type "one-time";
  includeAdjacency is on only when its value is exactly 1).
* Infinity (TS `Infinity`) is float("inf") here; fixtures.json writes it as null.

Usage (from the repo root):
    python3 scripts/subsidy-math/model_ref.py              # print base-case headline numbers
    python3 scripts/subsidy-math/model_ref.py --fixtures   # (re)write src/lib/subsidy-math/fixtures.json

See build_model.py for the one-line command that rebuilds, verifies and regenerates everything.
"""
from __future__ import annotations

import argparse
import copy
import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIB = ROOT / "src" / "lib" / "subsidy-math"
MODEL_TS = LIB / "model.ts"
PARAMS_JSON = LIB / "params.json"
FIXTURES_JSON = LIB / "fixtures.json"

ROUTE_PARAM_KEYS = [
    "customerDiscount", "discountFundedByProvider", "channelFee", "providerServingCost",
    "hostedShare", "incrementalComputeShare", "computeMargin", "revenueShare", "infraCost",
    "utilization", "baseUtilization", "modelDevCost", "distributionCost",
]
INCENTIVE_KEYS = ["pct", "partnerFunded", "providerFunded"]
LIFETIME_KEYS = [
    "years", "growth", "retention", "priceDeflation", "efficiencyGain", "channelFeeDrift",
    "adjacencyAttach", "adjacencyIncremental", "adjacencyMargin", "commitAdjacencyUplift",
    "commitYears", "baselineShare", "consumptionYears", "discountRate", "includeAdjacency",
]
EQUITY_KEYS = ["stake", "revenueMultiple", "incrementalToProvider"]
INCENTIVE_TYPES = ["one-time", "recurring", "consumption", "commit"]
DEFAULT_INCENTIVE_TYPE = "one-time"  # params.ts BASE_INCENTIVE.type
INF = float("inf")


# ---------------------------------------------------------------------------------------
# Constants parsed from model.ts
# ---------------------------------------------------------------------------------------
def read_model_constants(path: Path = MODEL_TS):
    src = path.read_text(encoding="utf-8")
    m = re.search(r"export const LIST\s*=\s*([0-9.]+)", src)
    if not m:
        raise SystemExit(f"Could not find `export const LIST` in {path}")
    list_price = float(m.group(1))
    m = re.search(r"export const INFRA_SPLIT\s*=\s*\{([^}]*)\}", src)
    if not m:
        raise SystemExit(f"Could not find `export const INFRA_SPLIT` in {path}")
    split = {k: float(v) for k, v in re.findall(r"(\w+)\s*:\s*([0-9.]+)", m.group(1))}
    m = re.search(r"export const INCENTIVE_LEVELS\s*=\s*\[([^\]]*)\]", src)
    if not m:
        raise SystemExit(f"Could not find `export const INCENTIVE_LEVELS` in {path}")
    levels = [float(x) for x in m.group(1).split(",") if x.strip()]
    return list_price, split, levels


LIST, INFRA_SPLIT, INCENTIVE_LEVELS = read_model_constants()


# ---------------------------------------------------------------------------------------
# model.ts port
# ---------------------------------------------------------------------------------------
def waterfall(p: dict, inc: dict, opts: dict | None = None) -> dict:
    """Year-1 waterfall for $100 of list consumption (model.ts `waterfall`)."""
    opts = opts or {}
    L = LIST
    costScale = opts.get("costScale", 1)
    c = inc["pct"]
    cloudShare = 1 - inc["partnerFunded"] - inc["providerFunded"]
    creditsCloud = cloudShare * c * L
    creditsProvider = inc["providerFunded"] * c * L
    creditsPartner = inc["partnerFunded"] * c * L
    customerPays = L - p["customerDiscount"] * L - c * L
    distribution = p["distributionCost"] * L

    if p["structure"] == "agent":
        discountProvider = p["discountFundedByProvider"] * p["customerDiscount"] * L
        discountCloud = (1 - p["discountFundedByProvider"]) * p["customerDiscount"] * L
        providerRevenue = L - discountProvider - creditsProvider
        fee = max(0, p["channelFee"] + opts.get("feeShift", 0))
        channelFeePaid = fee * providerRevenue
        cloudNetRevenue = channelFeePaid - discountCloud - creditsCloud
        providerServing = p["providerServingCost"] * costScale * providerRevenue
        computeContribution = providerServing * p["hostedShare"] * p["incrementalComputeShare"] * p["computeMargin"]
        cloudContribution = cloudNetRevenue - distribution + computeContribution
        return {
            "list": L, "discountProvider": discountProvider, "discountCloud": discountCloud,
            "creditsCloud": creditsCloud, "creditsProvider": creditsProvider, "creditsPartner": creditsPartner,
            "customerPays": customerPays, "providerRevenue": providerRevenue, "cloudNetRevenue": cloudNetRevenue,
            "revenueSharePaid": 0, "infra": 0, "infraDepreciation": 0, "infraPower": 0, "infraNetwork": 0,
            "distribution": distribution, "computeContribution": computeContribution,
            "cloudContribution": cloudContribution, "cloudEconomic": cloudContribution,
            "providerServing": providerServing, "channelFeePaid": channelFeePaid,
            "providerContribution": providerRevenue - channelFeePaid - providerServing,
        }

    discountCloud = p["customerDiscount"] * L
    cloudNetRevenue = L - discountCloud - creditsCloud
    revenueSharePaid = p["revenueShare"] * cloudNetRevenue
    infra = p["infraCost"] * costScale * (p["baseUtilization"] / p["utilization"]) * L
    cloudContribution = cloudNetRevenue - revenueSharePaid - infra - distribution
    return {
        "list": L, "discountProvider": 0, "discountCloud": discountCloud,
        "creditsCloud": creditsCloud, "creditsProvider": creditsProvider, "creditsPartner": creditsPartner,
        "customerPays": customerPays, "providerRevenue": revenueSharePaid - creditsProvider,
        "cloudNetRevenue": cloudNetRevenue, "revenueSharePaid": revenueSharePaid,
        "infra": infra,
        "infraDepreciation": infra * INFRA_SPLIT["depreciation"],
        "infraPower": infra * INFRA_SPLIT["power"],
        "infraNetwork": infra * INFRA_SPLIT["network"],
        "distribution": distribution, "computeContribution": 0, "cloudContribution": cloudContribution,
        # Model development is a fixed cost: allocated on pre-incentive net revenue (model.ts).
        "cloudEconomic": cloudContribution - p["modelDevCost"] * (L - discountCloud),
        "providerServing": 0, "channelFeePaid": 0,
        "providerContribution": revenueSharePaid - creditsProvider,
    }


NO_INCENTIVE = {"pct": 0, "partnerFunded": 0, "providerFunded": 0}


def _funding(inc: dict) -> dict:
    """Funding shares only (model.ts reads nothing else from a funding argument)."""
    return {"partnerFunded": inc["partnerFunded"], "providerFunded": inc["providerFunded"]}


def breakEvenIncentive(p: dict, funding: dict, economic: bool = False) -> float:
    pick = (lambda w: w["cloudEconomic"]) if economic else (lambda w: w["cloudContribution"])
    f = _funding(funding)  # only the funding shares are read; a stray pct is ignored (model.ts)
    m0 = pick(waterfall(p, NO_INCENTIVE))
    m1 = pick(waterfall(p, {**f, "pct": 1}))
    if m0 <= 0:
        return 0
    d = m0 - m1
    if d == 0:  # JS: positive / 0 === Infinity
        return INF
    return m0 / d


def requiredVolumeMultiple(p: dict, inc: dict) -> float:
    m0 = waterfall(p, NO_INCENTIVE)["cloudContribution"]
    m = waterfall(p, inc)["cloudContribution"]
    if m0 <= 0:
        return INF
    if m <= 0:
        return INF
    return m0 / m


def creditCliff(customerDiscount: float, credit: float) -> float:
    before = 1 - customerDiscount - credit
    if before <= 0:
        return INF
    return (1 - customerDiscount) / before - 1


def lifetime(p: dict, inc: dict, lt: dict) -> dict:
    rows = []
    prevSpend = lt["baselineShare"] * LIST
    cum = 0.0
    npv = 0.0
    creditsTotal = 0.0
    spendTotal = 0.0
    costDrift = (1 - lt["efficiencyGain"]) / (1 - lt["priceDeflation"])
    t = 1
    while t <= lt["years"]:
        inCommit = inc["type"] == "commit" and t <= lt["commitYears"]
        survive = 1 if inCommit else math.pow(lt["retention"], t - 1)
        spend = LIST * math.pow(1 + lt["growth"], t - 1) * survive
        scale = spend / LIST
        opts = {"costScale": math.pow(costDrift, t - 1), "feeShift": lt["channelFeeDrift"] * (t - 1)}
        base = waterfall(p, NO_INCENTIVE, opts)
        full = waterfall(p, {"pct": 1, "partnerFunded": inc["partnerFunded"], "providerFunded": inc["providerFunded"]}, opts)
        costPerCreditDollar = (base["cloudContribution"] - full["cloudContribution"]) / LIST
        if inc["type"] in ("one-time", "commit"):
            creditBase = inc["pct"] * spend if t == 1 else 0
        elif inc["type"] == "recurring":
            creditBase = inc["pct"] * spend
        else:
            creditBase = inc["pct"] * max(0, spend - prevSpend) if t <= lt["consumptionYears"] else 0
        grossContribution = base["cloudContribution"] * scale
        incentiveCost = costPerCreditDollar * creditBase
        attach = lt["adjacencyAttach"] * lt["adjacencyIncremental"] + (lt["commitAdjacencyUplift"] if inCommit else 0)
        adjacency = spend * attach * lt["adjacencyMargin"] if lt["includeAdjacency"] else 0
        contribution = grossContribution - incentiveCost + adjacency
        cum += contribution
        discounted = contribution / math.pow(1 + lt["discountRate"], t)
        npv += discounted
        creditsTotal += creditBase
        spendTotal += spend
        rows.append({
            "year": t, "spend": spend, "grossContribution": grossContribution, "incentiveCost": incentiveCost,
            "adjacency": adjacency, "contribution": contribution, "cumulative": cum, "discounted": discounted,
            "customerCredit": creditBase,
        })
        prevSpend = spend
        t += 1
    return {
        "rows": rows, "npv": npv, "cumulative": cum, "paybackMonths": payback(rows),
        "effectiveCustomerDiscount": creditsTotal / spendTotal if spendTotal > 0 else 0,
    }


def payback(rows: list) -> float:
    cum = 0.0
    wentNegative = False
    for r in rows:
        cum -= r["incentiveCost"]
        annual = r["grossContribution"] + r["adjacency"]
        if cum < 0:
            wentNegative = True
            if annual > 0 and -cum <= annual:
                return (r["year"] - 1) * 12 + (12 * -cum) / annual
        cum += annual
    return INF if wentNegative else 0


def requiredAttach(p: dict, inc: dict, lt: dict) -> float:
    without = lifetime(p, inc, {**lt, "includeAdjacency": True, "adjacencyAttach": 0, "commitAdjacencyUplift": 0})["npv"]
    if without >= 0:
        return 0
    withOne = lifetime(p, inc, {**lt, "includeAdjacency": True, "adjacencyAttach": 1, "commitAdjacencyUplift": 0})["npv"]
    slope = withOne - without
    if slope <= 0:
        return INF
    return -without / slope


def subsidyGrid(p: dict, funding: dict, lt: dict) -> list:
    out = []
    f = _funding(funding)  # only the funding shares are read; a stray pct is ignored (model.ts)
    for level in INCENTIVE_LEVELS:
        w = waterfall(p, {**f, "pct": level})
        oneTime = {**f, "pct": level, "type": "one-time"}
        recurring = {**f, "pct": level, "type": "recurring"}
        out.append({
            "level": level,
            "customerPays": w["customerPays"],
            "cloudNetRevenue": w["cloudNetRevenue"],
            "contribution": w["cloudContribution"],
            "contributionPct": w["cloudContribution"] / w["cloudNetRevenue"] if w["cloudNetRevenue"] > 0 else None,
            "volumeMultiple": requiredVolumeMultiple(p, {**f, "pct": level}),
            "paybackMonths": lifetime(p, oneTime, {**lt, "years": 5})["paybackMonths"],
            "npv1": lifetime(p, oneTime, {**lt, "years": 1})["npv"],
            "npv3": lifetime(p, oneTime, {**lt, "years": 3})["npv"],
            "npv5": lifetime(p, oneTime, {**lt, "years": 5})["npv"],
            "npvRecurring5": lifetime(p, recurring, {**lt, "years": 5})["npv"],
        })
    return out


def equityUplift(stake: float, revenueMultiple: float, incrementalToProvider: float, providerRevenue: float) -> float:
    return stake * revenueMultiple * incrementalToProvider * providerRevenue


# ---------------------------------------------------------------------------------------
# params.json loader (mirrors params.ts)
# ---------------------------------------------------------------------------------------
def load_raw(path: Path = PARAMS_JSON) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def model_inputs(raw: dict, pick: str = "base") -> dict:
    """Engine inputs at `pick` (base by default), shaped like params.ts BASE_* objects."""
    routes = {}
    for rid, r in raw["routes"].items():
        missing = [k for k in ROUTE_PARAM_KEYS if k not in r["params"]]
        if missing:
            raise SystemExit(f"params.json route {rid} is missing {missing}")
        p = {"structure": r["structure"]}
        for k in ROUTE_PARAM_KEYS:
            p[k] = r["params"][k][pick]
        routes[rid] = p
    for group, keys in (("incentive", INCENTIVE_KEYS), ("lifetime", LIFETIME_KEYS), ("equity", EQUITY_KEYS)):
        missing = [k for k in keys if k not in raw[group]]
        if missing:
            raise SystemExit(f"params.json {group} is missing {missing}")
    inc = {k: raw["incentive"][k][pick] for k in INCENTIVE_KEYS}
    inc["type"] = DEFAULT_INCENTIVE_TYPE  # params.ts hard-codes BASE_INCENTIVE.type = "one-time"
    lt = {k: raw["lifetime"][k][pick] for k in LIFETIME_KEYS}
    lt["includeAdjacency"] = lt["includeAdjacency"] == 1  # params.ts: base === 1
    eq = {k: raw["equity"][k][pick] for k in EQUITY_KEYS}
    return {"routes": routes, "incentive": inc, "lifetime": lt, "equity": eq}


def apply_overrides(inputs: dict, overrides: dict) -> dict:
    """overrides: {"routes": {rid: {k: v}}, "incentive": {k: v}, "lifetime": {k: v}, "equity": {k: v}}."""
    out = copy.deepcopy(inputs)
    for rid, kv in overrides.get("routes", {}).items():
        out["routes"][rid].update(kv)
    for g in ("incentive", "lifetime", "equity"):
        out[g].update(overrides.get(g, {}))
    if "includeAdjacency" in overrides.get("lifetime", {}):
        out["lifetime"]["includeAdjacency"] = overrides["lifetime"]["includeAdjacency"] in (1, True)
    return out


# ---------------------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------------------
def _clean(x):
    """JSON-safe: Infinity -> null, recurse into containers."""
    if isinstance(x, float) and math.isinf(x):
        return None
    if isinstance(x, dict):
        return {k: _clean(v) for k, v in x.items()}
    if isinstance(x, list):
        return [_clean(v) for v in x]
    return x


def route_outputs(I: dict, rid: str, with_rows: bool = True) -> dict:
    p = I["routes"][rid]
    inc = I["incentive"]
    lt = I["lifetime"]
    eq = I["equity"]
    w = waterfall(p, inc)
    lifetimes = {}
    for typ in INCENTIVE_TYPES:
        i2 = {**inc, "type": typ}
        lifetimes[typ] = {}
        for n in (1, 3, 5):
            r = lifetime(p, i2, {**lt, "years": n})
            entry = {"npv": r["npv"], "payback": r["paybackMonths"], "cumulative": r["cumulative"],
                     "effectiveCustomerDiscount": r["effectiveCustomerDiscount"]}
            if with_rows and n == 5:
                entry["rows"] = r["rows"]
            lifetimes[typ][str(n)] = entry
    out = {
        "structure": p["structure"],
        "waterfall": w,
        "waterfallNoIncentive": waterfall(p, NO_INCENTIVE),
        "breakEven": breakEvenIncentive(p, inc),
        "breakEvenEconomic": breakEvenIncentive(p, inc, True),
        "requiredVolumeMultiple": requiredVolumeMultiple(p, inc),
        "creditCliff": creditCliff(p["customerDiscount"], inc["pct"]),
        "grid": subsidyGrid(p, inc, lt),
        "lifetime": lifetimes,
        "requiredAttach": {typ: requiredAttach(p, {**inc, "type": typ}, lt) for typ in INCENTIVE_TYPES},
        "equityUplift": equityUplift(eq["stake"], eq["revenueMultiple"], eq["incrementalToProvider"], w["providerRevenue"]) if p["structure"] == "agent" else None,
    }
    return out


# Scenarios that push the engine through branches the base case never touches
# (MAX(0, fee) clamp, M0 <= 0, zero-slope break-even, provider/partner funding, adjacency,
# commit and consumption types, short horizons). Shared with verify_model.py.
STRESS_SCENARIOS = [
    {
        "name": "stress-commit",
        "overrides": {
            "incentive": {"type": "commit", "pct": 0.5, "partnerFunded": 0.2, "providerFunded": 0.3},
            "lifetime": {"years": 3, "includeAdjacency": 1, "baselineShare": 0.4, "channelFeeDrift": -0.05,
                         "retention": 0.7, "growth": 0.0, "commitYears": 2, "consumptionYears": 2,
                         "adjacencyIncremental": 0.0},
            "routes": {
                "bedrock-claude": {"channelFee": 0.16, "discountFundedByProvider": 0.5},
                "azure-openai": {"revenueShare": 0.25, "infraCost": 0.35, "utilization": 0.3, "customerDiscount": 0.2},
                "vertex-gemini": {"modelDevCost": 0.6},
                "vertex-claude": {"incrementalComputeShare": 1.0, "channelFee": 0.16, "distributionCost": 0.08,
                                  "customerDiscount": 0.2, "discountFundedByProvider": 0.5},
            },
        },
    },
    {
        "name": "stress-consumption",
        "overrides": {
            "incentive": {"type": "consumption", "pct": 0.25, "partnerFunded": 0.5, "providerFunded": 0.5},
            "lifetime": {"years": 5, "includeAdjacency": 1, "efficiencyGain": 0.6, "priceDeflation": 0.15,
                         "discountRate": 0.12, "growth": 0.8, "baselineShare": 0.8, "consumptionYears": 4},
            "routes": {
                "bedrock-claude": {"customerDiscount": 0.2, "discountFundedByProvider": 0.5},
                "vertex-claude": {"channelFee": 0.36, "computeMargin": 0.35},
            },
        },
    },
    {
        "name": "stress-recurring",
        "overrides": {
            "incentive": {"type": "recurring", "pct": 0.1, "partnerFunded": 0.0, "providerFunded": 0.25},
            "lifetime": {"years": 1, "includeAdjacency": 0, "retention": 0.97, "adjacencyAttach": 1.2},
            "routes": {
                "azure-openai": {"infraCost": 0.1, "utilization": 0.7},
                "vertex-gemini": {"infraCost": 0.25, "utilization": 0.3},
            },
        },
    },
]


def build_fixtures(raw: dict) -> dict:
    I = model_inputs(raw)
    fx = {
        "_meta": {
            "generatedBy": "scripts/subsidy-math/model_ref.py --fixtures",
            "paramsVersion": raw.get("_meta", {}).get("version"),
            "paramsAsOf": raw.get("_meta", {}).get("asOf"),
            "constants": {"LIST": LIST, "INFRA_SPLIT": INFRA_SPLIT, "INCENTIVE_LEVELS": INCENTIVE_LEVELS},
            "conventions": (
                "All money values are $ per $100 of year-1 list spend. null means Infinity (payback 'never', "
                "volume multiple / required attach 'not recoverable', break-even 'unbounded', cliff 'unbounded') "
                "except grid[].contributionPct and equityUplift, where null means n/a. lifetime[type][years] "
                "holds lifetime(p, {...incentive, type}, {...lifetime, years}) with payback = paybackMonths; rows are given for "
                "years = 5. "
                "requiredAttach uses the base lifetime (years as in params). Scenario overrides replace base "
                "values (includeAdjacency 1 -> true)."
            ),
            "tolerance": 1e-6,
        },
        "base": {"incentive": I["incentive"], "lifetime": I["lifetime"], "equity": I["equity"]},
        "routes": {rid: route_outputs(I, rid, with_rows=True) for rid in I["routes"]},
        "scenarios": [],
    }
    for sc in STRESS_SCENARIOS:
        J = apply_overrides(I, sc["overrides"])
        fx["scenarios"].append({
            "name": sc["name"],
            "overrides": sc["overrides"],
            "routes": {rid: route_outputs(J, rid, with_rows=False) for rid in J["routes"]},
        })
    return _clean(fx)


def headline(raw: dict) -> list:
    I = model_inputs(raw)
    inc, lt = I["incentive"], I["lifetime"]
    out = []
    for rid, p in I["routes"].items():
        ot = {**inc, "type": "one-time"}
        rc = {**inc, "type": "recurring"}
        out.append({
            "route": raw["routes"][rid]["short"],
            "y1Contribution0": waterfall(p, NO_INCENTIVE)["cloudContribution"],
            "y1ContributionAtPct": waterfall(p, inc)["cloudContribution"],
            "breakEven": breakEvenIncentive(p, inc),
            "breakEvenEconomic": breakEvenIncentive(p, inc, True),
            "npv5OneTime": lifetime(p, ot, {**lt, "years": 5})["npv"],
            "npv5Recurring": lifetime(p, rc, {**lt, "years": 5})["npv"],
            "payback5OneTime": lifetime(p, ot, {**lt, "years": 5})["paybackMonths"],
        })
    return out


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--params", default=str(PARAMS_JSON))
    ap.add_argument("--fixtures", action="store_true", help=f"write {FIXTURES_JSON.relative_to(ROOT)}")
    ap.add_argument("--out", default=str(FIXTURES_JSON))
    a = ap.parse_args(argv)
    raw = load_raw(Path(a.params))
    pct = raw["incentive"]["pct"]["base"]
    print(f"params {raw.get('_meta', {}).get('version')} ({raw.get('_meta', {}).get('asOf')}) · incentive {pct:.0%} one-time unless noted")
    fmt = lambda v, f: ("inf" if isinstance(v, float) and math.isinf(v) else format(v, f))
    print(f"{'route':18}{'Y1 @0%':>9}{'Y1 @inc':>9}{'BE':>8}{'BE econ':>9}{'NPV5 1x':>9}{'NPV5 rec':>10}{'payback':>9}")
    for h in headline(raw):
        print(f"{h['route']:18}{fmt(h['y1Contribution0'], '9.2f')}{fmt(h['y1ContributionAtPct'], '9.2f')}"
              f"{fmt(h['breakEven'], '8.1%')}{fmt(h['breakEvenEconomic'], '9.1%')}{fmt(h['npv5OneTime'], '9.2f')}"
              f"{fmt(h['npv5Recurring'], '10.2f')}{fmt(h['payback5OneTime'], '9.1f')}")
    if a.fixtures:
        fx = build_fixtures(raw)
        Path(a.out).write_text(json.dumps(fx, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"wrote {a.out}")


if __name__ == "__main__":
    sys.exit(main())
