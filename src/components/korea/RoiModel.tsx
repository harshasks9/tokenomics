"use client";

import { useMemo, useState } from "react";
import { Calculator, RotateCcw } from "lucide-react";
import { roiDefaults } from "@/lib/korea/opportunities";

const WORKING_WEEKS = 46;
const FTE_HOURS_PER_YEAR = 1880;
const FTE_DAYS_PER_YEAR = 230;

type Inputs = {
  seats: number;
  hoursRecoveredPerWeek: number;
  adoptionRate: number;
  realisationRate: number;
  seatCostUsdPerMonth: number;
  auditTravelReduction: number;
};

const initial: Inputs = {
  seats: roiDefaults.seats,
  hoursRecoveredPerWeek: roiDefaults.hoursRecoveredPerWeek,
  adoptionRate: roiDefaults.adoptionRate,
  realisationRate: roiDefaults.realisationRate,
  seatCostUsdPerMonth: roiDefaults.seatCostUsdPerMonth,
  auditTravelReduction: roiDefaults.auditTravelReduction,
};

function krw(value: number) {
  if (value >= 1_000_000_000) return `₩${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `₩${(value / 1_000_000).toFixed(0)}M`;
  return `₩${Math.round(value).toLocaleString()}`;
}

function usd(value: number) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${Math.round(value).toLocaleString()}`;
}

function Slider({
  label,
  hint,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-slate-800">{label}</span>
        <span className="tabular-nums text-sm font-black text-[#0047A0]">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-[#0047A0]"
        aria-label={label}
      />
      <p className="mt-1 text-[11px] leading-4 text-slate-500">{hint}</p>
    </label>
  );
}

export default function RoiModel() {
  const [inputs, setInputs] = useState<Inputs>(initial);

  const set = <K extends keyof Inputs>(key: K) => (value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value as Inputs[K] }));

  const model = useMemo(() => {
    const activeUsers = inputs.seats * inputs.adoptionRate;
    const rawHours = activeUsers * inputs.hoursRecoveredPerWeek * WORKING_WEEKS;
    const realisedHours = rawHours * inputs.realisationRate;
    const fteEquivalent = realisedHours / FTE_HOURS_PER_YEAR;
    const productivityKrw = fteEquivalent * roiDefaults.loadedCostPerFteKrw;

    const auditorTrips = roiDefaults.auditTripsPerYear * roiDefaults.auditorsPerTrip;
    const travelUsd = auditorTrips * roiDefaults.costPerTripUsd;
    const travelSavedUsd = travelUsd * inputs.auditTravelReduction;
    const auditorDays = auditorTrips * roiDefaults.auditorDaysPerTrip;
    const auditorDaysSaved = auditorDays * inputs.auditTravelReduction;
    const auditorTimeKrw =
      (auditorDaysSaved / FTE_DAYS_PER_YEAR) * roiDefaults.loadedCostPerFteKrw;
    const auditKrw = travelSavedUsd * roiDefaults.usdKrw + auditorTimeKrw;

    const seatCostKrw = inputs.seats * inputs.seatCostUsdPerMonth * 12 * roiDefaults.usdKrw;
    // Modelled programme overhead: delivery, enablement and governance in year one.
    const programmeKrw = seatCostKrw * 1.6;

    const totalValueKrw = productivityKrw + auditKrw;
    const netKrw = totalValueKrw - programmeKrw;
    const multiple = programmeKrw > 0 ? totalValueKrw / programmeKrw : 0;
    const paybackMonths = totalValueKrw > 0 ? (programmeKrw / totalValueKrw) * 12 : 99;

    return {
      activeUsers,
      realisedHours,
      fteEquivalent,
      productivityKrw,
      travelSavedUsd,
      auditorDaysSaved,
      auditKrw,
      seatCostKrw,
      programmeKrw,
      totalValueKrw,
      netKrw,
      multiple,
      paybackMonths,
    };
  }, [inputs]);

  const centValue = 2_500_000 * 365 * 0.01; // one cent per garment, per year, USD

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Calculator size={16} className="text-[#0047A0]" />
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">Change any assumption</p>
          </div>
          <button
            type="button"
            onClick={() => setInputs(initial)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            <RotateCcw size={11} /> Reset
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <Slider
            label="Gemini Enterprise seats"
            hint={`Of roughly ${roiDefaults.officeStaff.toLocaleString()} Korean office staff. The Q4 2026 proposal is ${roiDefaults.seats.toLocaleString()}.`}
            value={inputs.seats}
            min={200}
            max={2000}
            step={100}
            format={(v) => v.toLocaleString()}
            onChange={set("seats")}
          />
          <Slider
            label="Hours recovered per active user per week"
            hint="Time no longer spent assembling information that an agent can retrieve and cite."
            value={inputs.hoursRecoveredPerWeek}
            min={0.5}
            max={8}
            step={0.5}
            format={(v) => `${v} hrs`}
            onChange={set("hoursRecoveredPerWeek")}
          />
          <Slider
            label="Adoption — share of seats in weekly active use"
            hint="The measure we propose to be judged on. Set it to 30% — the case should still stand."
            value={inputs.adoptionRate}
            min={0.2}
            max={0.95}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={set("adoptionRate")}
          />
          <Slider
            label="Realisation — share of recovered time converted to output"
            hint="Deliberately conservative. Recovered hours are not automatically productive hours."
            value={inputs.realisationRate}
            min={0.1}
            max={0.8}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={set("realisationRate")}
          />
          <Slider
            label="Assumed seat cost per user per month"
            hint="Placeholder assumption for modelling only. Actual commercial terms are set separately."
            value={inputs.seatCostUsdPerMonth}
            min={10}
            max={60}
            step={1}
            format={(v) => `$${v}`}
            onChange={set("seatCostUsdPerMonth")}
          />
          <Slider
            label="Audit travel and auditor-day reduction"
            hint={`Across ${roiDefaults.factories} factories in 10 countries. The briefing target is 30–50%.`}
            value={inputs.auditTravelReduction}
            min={0}
            max={0.6}
            step={0.05}
            format={(v) => `${Math.round(v * 100)}%`}
            onChange={set("auditTravelReduction")}
          />
        </div>

        <p className="mt-6 border-t border-slate-100 pt-4 text-[11px] leading-5 text-slate-500">
          Fixed modelling assumptions: fully-loaded cost per Korean office FTE of{" "}
          {krw(roiDefaults.loadedCostPerFteKrw)} per year; {WORKING_WEEKS} working weeks; {roiDefaults.auditTripsPerYear}{" "}
          audit trips a year at {roiDefaults.auditorsPerTrip} auditors and {usd(roiDefaults.costPerTripUsd)} per trip;
          programme cost modelled at 1.6× licence to cover delivery, enablement and governance in year one; USD/KRW{" "}
          {roiDefaults.usdKrw.toLocaleString()}. Every one of these is a Google placeholder, not a Sae-A figure. Replacing
          them with your own numbers is the first agenda item on 14 August.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl bg-[#070d18] p-6 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/45">Modelled year-one outcome</p>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-4xl font-black tracking-tight tabular-nums">{krw(model.totalValueKrw)}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">Annual value modelled</p>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tight tabular-nums text-[#8ab4f8]">
                {model.multiple.toFixed(1)}×
              </p>
              <p className="mt-1 text-xs font-semibold text-white/55">Value to programme cost</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight tabular-nums">{krw(model.programmeKrw)}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">Year-one programme cost</p>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tight tabular-nums">
                {model.paybackMonths < 12 ? `${model.paybackMonths.toFixed(1)} mo` : "> 12 mo"}
              </p>
              <p className="mt-1 text-xs font-semibold text-white/55">Modelled payback</p>
            </div>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-[#8ab4f8]"
              style={{ width: `${Math.min(100, (model.multiple / 10) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-white/40">Bar scales to a 10× reference point.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
              Knowledge &amp; workspace agents
            </p>
            <p className="mt-3 text-3xl font-black tabular-nums text-slate-950">{krw(model.productivityKrw)}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Modelled annual value</p>
            <dl className="mt-4 space-y-1.5 text-[12px] text-slate-600">
              <div className="flex justify-between gap-3">
                <dt>Weekly active users</dt>
                <dd className="tabular-nums font-semibold text-slate-900">{Math.round(model.activeUsers).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Realised hours per year</dt>
                <dd className="tabular-nums font-semibold text-slate-900">{Math.round(model.realisedHours).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>FTE-equivalent capacity</dt>
                <dd className="tabular-nums font-semibold text-slate-900">{model.fteEquivalent.toFixed(0)}</dd>
              </div>
            </dl>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Remote smart audit agent</p>
            <p className="mt-3 text-3xl font-black tabular-nums text-slate-950">{krw(model.auditKrw)}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Modelled annual value</p>
            <dl className="mt-4 space-y-1.5 text-[12px] text-slate-600">
              <div className="flex justify-between gap-3">
                <dt>Travel cost avoided</dt>
                <dd className="tabular-nums font-semibold text-slate-900">{usd(model.travelSavedUsd)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Auditor-days recovered</dt>
                <dd className="tabular-nums font-semibold text-slate-900">{Math.round(model.auditorDaysSaved).toLocaleString()}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Adoption dependency</dt>
                <dd className="font-semibold text-[#188038]">None</dd>
              </div>
            </dl>
          </article>
        </div>

        <div className="rounded-2xl border-l-4 border-[#CD2E3A] bg-[#fff5f6] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#CD2E3A]">For scale</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
            At roughly 2.5 million garments a day, a one-cent improvement in fully-landed cost per unit is worth around{" "}
            <span className="font-black text-[#CD2E3A]">{usd(centValue)}</span> a year. Everything modelled above is small
            beside that. It is why we think the allocation work, not the productivity work, is the real prize — and why we
            would rather be measured against cost of goods than against an IT budget.
          </p>
        </div>
      </div>
    </div>
  );
}
