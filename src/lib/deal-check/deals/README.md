# Deal files

A deal file is the saved form of one customer's model: who the customer is,
every assumption, and a snapshot of the verdict when it was saved. The app
writes them from the "Customer & deal" panel (Export) and reads them back
(Import); it also keeps a list in the browser for one-click revisits.

`example.deal.json` is a template and is the only deal file that belongs in
this repository. It is public, so keep real customer files in Drive or your
own workspace and import them when you need them.

Schema (`src/lib/deal-check/construct.ts`, `DealFile`): `version`, `savedAt`,
`meta` (customer, region, onTargetList, owner, notes), `inputs` (every model
input; missing ones fall back to defaults on import), `snapshot` (horizon,
rank, advantage, net costs).
