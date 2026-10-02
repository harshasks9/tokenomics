# Earbuds catalog: method, India scope, coverage and next research round

Addendum to `RESEARCH_BRIEF.md`. It covers the broad catalog behind the explorer: 14 deep-dive models plus a sourced catalog of popular earbuds, with an India market view.

## How it was built

1. **Research passes by brand group.** These ran in parallel with shared instructions (`catalog-raw/RESEARCH_INSTRUCTIONS.md`).
   - Each pass wrote one JSON array per group to `catalog-raw/`.
   - Every record lists the URLs it used and which fields each URL supported.
   - Nothing was filled from memory. If no search result stated a value, it is `null`.
2. **Build.** `node scripts/earbuds-build-catalog.mjs` turns those files into `src/lib/earbuds/catalog.json`. It:
   - merges the same model across passes (normalised brand + model);
   - resolves conflicts by confidence and writes the alternative into the model's research notes;
   - attributes each value to the source ids that stated it;
   - drops out-of-range values, for example a case weight reported as one earbud;
   - excludes models with fewer than two substantive sourced values.

   Every decision is logged to `catalog-build-log.txt`.
3. **Deep-dive merge.** The 14 hand-researched models keep their curated values and notes. They take only the fields their own research didn't cover (India price, claimed ANC depth, claimed maximum battery, codecs) from the matching catalog entry (`DEEP_TO_CATALOG` in `products.ts`).

## India market view

- **Which models appear.** A model is in the India view if a source documents it as sold in India, or gives an India launch price.
- **Prices.**
  - India prices are the **announced launch price**. MRP is stored separately and shown on the card.
  - Limited-time introductory prices are noted in the research notes. Where a launch article led with the intro price, that price is used and the regular price is noted.
  - Street prices aren't plotted, because Indian TWS prices often fall well below launch within weeks.
- **Budgets** apply in the active market's currency. Switching market clears the budget.
- **Price axis.** The rupee axis uses a log scale, because the India market spans roughly ₹800 to ₹33,000.

## Metrics added for the catalog

| Metric | Evidence | Note |
|---|---|---|
| Price (India), ₹ | Manufacturer / launch coverage | Announced launch price |
| ANC depth (claimed), dB | Manufacturer claim | Brands measure differently. Not comparable in the way lab scores are, so it's labelled as a claim |
| Battery, buds (claimed max), h | Manufacturer claim | Usually ANC off. Covers more models than the ANC-on claim |
| Battery with case (claimed), h | Manufacturer claim | Budget brands lead on paper |

Lab scores (SoundGuys ANC and comfort, RTINGS battery) are attached where a lab-score pass found them.

## Coverage after research round 1

- **Result:** 132 models across 23 brands. 103 are documented as sold in India.
- **Why it stopped there:** round 1 hit the session's web-search budget (200 searches shared across all research agents). Most groups stopped partway, and the gaps are not deliberate omissions.
- **Not yet covered** (queued for round 2, about 190 models):
  - **Global brands:**
    - Sony: WF-1000XM4, LinkBuds S, WF-C710N, WF-C700N, WF-C510, WF-C500, Float Run
    - Google: Pixel Buds Pro 2 India pricing, Pixel Buds 2a, Pixel Buds A-Series, Pixel Buds Pro
    - Beats: Studio Buds, Solo Buds, Fit Pro
    - Sennheiser: MTW4, MTW3, Momentum Sport, Accentum TW, CX Plus, CX TW
    - Technics: AZ80, AZ60M2, AZ40M2
    - Jabra: Elite 10 Gen 2, 8 Active Gen 2, 5, 4
    - B&O: Beoplay EX, E8 Gen 4
    - Marshall: Motif II, Minor IV, Mode II
    - Master & Dynamic MW09
    - Audio-Technica: TWX9, CKS50TW2
  - **Phone brands sold in India:**
    - OnePlus: Buds Pro 3, Buds 3, Nord Buds 3 Pro, Nord Buds 3, Nord Buds 2r, Buds Pro 2
    - OPPO: Enco Air4, Air4 Pro, Air3 Pro, Buds 2, Buds 3 Pro, X3i, X3
    - vivo / iQOO: TWS 3e, TWS 1e, TWS Air 3
    - Huawei: FreeBuds Pro 4, Pro 3, 6i, 5i, 6
    - Honor: Earbuds X7, X8
    - Motorola: Moto Buds, Buds+, Buds Loop
  - **Audio brands:**
    - JBL: Tour Pro 3, Tour Pro 2, Live Beam 3, Live Buds 3, Live Pro 2, Live Flex 3, Tune Beam 2, Tune Buds 2, Wave Beam 2, Wave Buds 2, Endurance Race 2, Vibe Beam 2, Soundgear Sense
    - Soundcore: P20i, Life P3, AeroFit 2, AeroFit Pro, Sport X20, Life Note 3i, A30i
  - **Indian budget brands:**
    - Boult: Z40, Z40 Pro, Z60, Y1, K40, Maverick, Klarity 3
    - boAt: Nirvana Ion / Ion ANC / Space / Zenith Pro, Airdopes Atom 81, 800, 161 Pro, 141 Pro, Loop
    - Fire-Boltt, Portronics, Zebronics, Ambrane, Philips, Lava, Crossbeats
    - Skullcandy: Sesh ANC, Rail ANC, Indy Evo
  - **Value brands:**
    - Edifier: NeoBuds Pro 2, W240TN, X3 Lite
    - 1MORE: Aero, Evo
    - TOZO, JLab, Echo Buds, QCY
  - **Lab scores** for about 56 models that the lab pass didn't reach.

Round 2 uses brand price-list searches, which cover many models per search, before per-model spec searches. That fits the queue into one 200-search budget.
