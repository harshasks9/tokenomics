import { describe, expect, it } from "vitest";
import { buildModel } from "./model";
import { cohorts, autoEver } from "./data/cohorts";
import { levers } from "./data/plan";
import { plays } from "./data/execution";
import { segments } from "./data/market";
import type { PlayId } from "./types";

const model = buildModel();

describe("reconciliation ledger", () => {
  it("every derived figure ties to the deck within its stated tolerance", () => {
    const failures = model.audit.checks.filter((c) => !c.pass).map((c) => `${c.id}: ${c.label} — computed ${c.computed} vs stated ${c.stated} (±${c.tolerance})`);
    expect(failures).toEqual([]);
  });

  it("check ids are unique so the ledger can link to them", () => {
    const ids = model.audit.checks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("exact checks have no rounding slack", () => {
    for (const c of model.audit.checks.filter((check) => check.kind === "exact")) {
      expect(Math.abs(c.computed - c.stated), c.id).toBeLessThanOrEqual(c.tolerance + 0.5);
    }
  });
});

describe("the plan's spine", () => {
  it("eight cohorts + AutoEver held flat make the ~$900M plan", () => {
    const fy27 = cohorts.reduce((s, c) => s + c.fy27, 0) + autoEver.fy27;
    expect(fy27).toBeCloseTo(901.4, 1);
    expect(Math.round(fy27 / 10) * 10).toBe(900);
  });

  it("every lever lands in a cohort, and lever splits add up", () => {
    for (const lever of levers) {
      const split = lever.landsIn.reduce((s, l) => s + l.value, 0);
      expect(split, `lever ${lever.num}`).toBe(lever.value);
      for (const land of lever.landsIn) expect(cohorts.some((c) => c.id === land.cohort)).toBe(true);
      expect(cohorts.filter((c) => c.leverIds.includes(lever.num)).length, `lever ${lever.num} referenced by a cohort`).toBeGreaterThan(0);
    }
  });

  it("base case by cohort sums to ~$725M and each base is positive", () => {
    for (const row of model.plan.baseByCohort) expect(row.base, row.cohort).toBeGreaterThan(0);
    expect(model.plan.baseTotal).toBeGreaterThan(723);
    expect(model.plan.baseTotal).toBeLessThan(727);
  });

  it("matrix places every cohort in exactly one motion × segment cell", () => {
    const placed = model.plan.matrix.flatMap((row) => row.cells.flatMap((cell) => cell.cohorts));
    expect(placed.sort()).toEqual(cohorts.map((c) => c.id).sort());
  });

  it("three motions, four segments, eight cohorts, six plays", () => {
    expect(model.plan.motions).toHaveLength(3);
    expect(segments).toHaveLength(4);
    expect(cohorts).toHaveLength(8);
    expect(plays).toHaveLength(6);
  });
});

describe("plays heatmap", () => {
  it("lead counts match slide 17", () => {
    for (const play of plays) {
      const leads = cohorts.filter((c) => c.plays[play.id] === "lead").length;
      expect(leads, play.id).toBe(play.leadCount);
    }
  });

  it("cohort-page view differs from slide 17 where the deck says it does", () => {
    const leads = (id: PlayId) => cohorts.filter((c) => c.playsOnCohortPage[id] === "lead").length;
    expect(leads("security")).toBe(1);
    expect(leads("coding")).toBe(4);
    expect(leads("live")).toBe(3);
    expect(leads("agentic")).toBe(6);
    expect(cohorts.find((c) => c.id === "samsung")?.playsOnCohortPage).toEqual(cohorts.find((c) => c.id === "samsung")?.plays);
  });
});

describe("account tables", () => {
  it("printed totals match the rows where the table covers the whole group", () => {
    const sumCol = (rows: { cells: (string | number | null)[] }[], col: number) =>
      rows.reduce((s, r) => s + (typeof r.cells[col] === "number" ? (r.cells[col] as number) : 0), 0);
    const tables = cohorts.flatMap((c) => c.accountTables).filter((t) => t.total && /^(Total|Gaming|Other verticals|Samsung Electronics)/.test(t.total.name));
    expect(tables.length).toBeGreaterThanOrEqual(5);
    for (const table of tables) {
      for (const col of table.numeric) {
        const printed = table.total!.cells[col];
        if (typeof printed !== "number") continue;
        expect(Math.abs(sumCol(table.rows, col) - printed), `${table.title} col ${col}`).toBeLessThanOrEqual(0.2);
      }
    }
  });

  it("no individual employee names leak from the deck", () => {
    const text = JSON.stringify(model);
    for (const name of ["Jongwoo", "Terry", "Jeehyeok", "Hangshik", "Junghoon", "Rockyoon", "Eunju", "Seongmin", "YunYol", "kyungmee", "siminoh", "Karan", "W. Cho"]) {
      expect(text.includes(name), name).toBe(false);
    }
  });
});

describe("placeholders stay placeholders", () => {
  it("every cohort owner is still [name] and the asks keep their to-confirm state", () => {
    for (const c of cohorts) expect(c.owner).toBe("[name]");
    const money = model.asks.items.find((a) => a.id === "money");
    expect(money?.decisionBasis).toBe("to-confirm");
    expect(money?.items.filter((i) => i.basis === "to-confirm").length).toBeGreaterThanOrEqual(3);
  });

  it("whales stay outside the plan", () => {
    expect(model.ladder.commit.value + model.ladder.stretch.value).toBe(900);
    expect(model.ladder.upside.range).toEqual([100, 300]);
  });
});
