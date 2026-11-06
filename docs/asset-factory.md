# Gemini 10 Asset Factory (`/asset-factory`, assets.aitokenomics.app)

Concept demo of one agent-asset marketplace serving three audiences — Customer,
Google FDE, Partner FDE — with a role-aware experience over a shared catalog.
All organizations, people, assets and figures are synthetic and modeled.

## How access is enforced

- `POST /api/asset-factory` is the only data path. Identity comes from the
  httpOnly `af_persona` cookie (the simulated sign-in), never from the payload.
- The world = seed (`src/lib/asset-factory/data.ts`) + an event log the client
  holds. On every request the server replays the log through `engine.ts`,
  re-authorizing each event against `policy.ts`; a tampered log is cut at the
  first denied event.
- `views.ts` projects the world for the signed-in persona. Assets, workspaces,
  contributions and metrics the persona may not see are never serialized.
  GTM figures (`gtm`, internal metrics) exist only in Google responses.
- Browser code imports only `types.ts` and `journey.ts`; a test fails if any
  client file imports `data/policy/engine/model/views`, and a production build
  contains none of the restricted asset names.

## Visibility and trust

| Visibility | Who receives it |
| --- | --- |
| Public community | every authorized user |
| Organization private | owning org + workspaces it was explicitly shared into |
| Shared workspace | owning org + that workspace's collaborators |
| Google internal | Google only; can't enter a cross-org workspace |

Trust tiers: Community (verified contributor, not certified), Field validated
(≥2 FDE-led production engagements), Google verified (official).

## Packages

Every asset is a versioned package addressed as `namespace/name@version`
(anonymous contributions publish under `community/`). Seed files live in
`src/lib/asset-factory/content.ts` (server-only); assets created on the
platform carry their own files.

- **Files** — `SKILL.md` (frontmatter + Instructions / Guardrails / Examples /
  Parameters), `schema/output.json`, `examples/`, `evals/`, manifests
  (`agent.yaml`, `connector.yaml`, `workflow.yaml`, `suite.yaml`).
- **Inherit** — `asset.inherit` creates a child whose SKILL.md `extends:` the
  parent at a pinned version. `skillmd.ts` resolves the chain: frontmatter
  child-wins, Instructions/Guardrails/Examples append, Parameters merge key by
  key, schema inherited. A child can't be more visible than its parent.
- **Edit** — `asset.edit` commits a file as a new patch version (owner org
  only, JSON validated, `extends:` immutable, scanned when public); history
  keeps full diffs.
- **Try it** — `POST /api/asset-factory/run` runs the resolved instructions
  with Gemini (`GEMINI_API_KEY`; model `ASSET_FACTORY_GEMINI_MODEL`, default
  gemini-3.5-flash) and validates against the output schema. Without a key it
  returns the package's recorded `examples/sample-output.json`, labeled.
- `POST /api/asset-factory/asset` returns one package's files, resolved
  SKILL.md, lineage and history — 404 when missing *or* not visible.

## Executive demo

`journey.ts` scripts the ten steps (Kestrel Industrial · Priya at Google ·
Marcus at Lattice). Each task is a normal API action; "Try it as …" sends the
same request as the wrong persona so the server's refusal is visible.

Tests: `npx vitest run src/lib/asset-factory`.
