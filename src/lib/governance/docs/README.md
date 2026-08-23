# AI Governance Field Guide — deliverables

This folder contains the eight PRD deliverables behind the microsite at
`governance.aitokenomics.app` (route `/governance`). Content snapshot: **August 2026**.

| # | Deliverable | Where |
|---|---|---|
| 1 | Research synthesis | `01-research-synthesis.md` (full evidence base in `research/`) |
| 2 | AI Governance Framework | `02-framework.md` |
| 3 | Governance control map | `03-control-map.md` (canonical: `../data/layers.ts`) |
| 4 | Competitive landscape | `04-competitive-landscape.md` (canonical: `../data/vendors.ts`) |
| 5 | Google Cloud capability map | `05-google-capability-map.md` (canonical: `../data/google.ts`) |
| 6 | Customer examples | `06-customer-examples.md` (canonical: `../data/examples.ts`) |
| 7 | Microsite architecture | `07-microsite-architecture.md` |
| 8 | The microsite itself | `src/app/governance/`, `src/components/governance/`, `src/lib/governance/` |

**Single source of truth.** The typed data files under `../data/` are canonical for
everything the site renders (layers, risks, incidents, personas, vendors, capabilities,
examples, readiness, sources); a vitest suite (`../data/integrity.test.ts`) validates all
cross-references. The markdown documents here are the narrative deliverables — read them
for rationale, use the data files to change the site.

**Research provenance.** `research/` holds the five verbatim research briefs (frameworks &
regulation; enterprise practice & agents; vendor landscape; Google Cloud; customer
examples), each with `[verified 2026]` / `[training knowledge]` markings and full source
URLs. Every significant claim on the site traces to these briefs or to the source
register in `../data/sources.ts`.
