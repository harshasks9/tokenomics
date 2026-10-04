# Earbuds Pareto — research brief, dataset and methodology

**Snapshot date:** 1 October 2026 · **Market:** United States (USD) · **Route:** `/earbuds`

This brief was written *before* any design or implementation work, as the research
gate for the earbuds tradeoff microsite. The structured, cited dataset it describes lives in
`src/lib/earbuds/` (products, sources, metrics). The raw research logs, with every
value, URL and "NOT FOUND", are in `docs/earbuds-pareto/research-log/`.

---

## 0. How the research was done, and what that limits

- **Access.** This build environment's network policy blocks direct page loads from
  RTINGS, SoundGuys, What Hi-Fi, manufacturer sites and archives. Every value was captured
  from **search-engine renderings of the cited page**, not from reading the page itself.
  Each value records the URL it was attributed to.
- **Cross-checking.** Values were cross-checked where a second query was possible.
  Values resting on a single summary, a retailer listing or a low-reputation site carry
  `confidence: "medium"` or `"low"` in the dataset and are flagged in the UI.
- **RTINGS paywall.** RTINGS numeric scores (overall attenuation dB, mic, comfort,
  "Neutral Sound") are mostly hidden behind its Insider paywall in search renderings.
  Only measured battery hours and a few numbers surfaced reliably.
- **Search budget.** The session's shared web-search budget ran out once during the
  first pass. A second, targeted pass closed the most important gaps. Models that could
  not be researched to a minimum standard were **excluded** rather than half-filled
  (see §1.3).
- **No invented values.** Nothing was filled from memory. If no source was found, the
  field is `null`, and the UI shows it as *unknown*.

## 1. Models included and why

### 1.1 Selection rule

Current-generation, widely sold true-wireless earbuds from the brands named in the brief
(Apple, Sony, Bose, Samsung, Nothing), plus the closest competitors reviewers repeatedly
compare them with (Google, Beats, Sennheiser, Technics). Each brand's **budget
alternative** is included where one exists (AirPods 5, Nothing Ear (3a), CMF Buds Pro 2,
Sony LinkBuds Fit), so the price axis spans $59–$330. Each model was checked for a newer
generation as of 1 Oct 2026.

### 1.2 Included (14)

| Model | Released | US launch price | Why it's here |
|---|---|---|---|
| Apple AirPods Pro 3 | Sep 2025 | $249 | Apple's current Pro model. No AirPods Pro 4 had shipped by 1 Oct 2026 |
| Apple AirPods 5 (USB-C case) | Sep 2026 | $129 ($149 with wireless case) | Replaced AirPods 4 with ANC on 18 Sep 2026. Open-fit with ANC |
| Beats Powerbeats Pro 2 | Feb 2025 | $249.99 | Ear-hook workout design with heart-rate sensing |
| Google Pixel Buds Pro 2 | Aug 2024 | $229 | Still current. Google added a colour in Aug 2026 and released no successor |
| Sony WF-1000XM6 | Feb 2026 | $329.99 | Sony's current flagship |
| Sony WF-1000XM5 | Jul 2023 | $299.99 | Previous flagship, still sold at a discount. Kept as an "older generation" reference |
| Sony LinkBuds Fit | Nov 2024 | $199.99 | Sony's fit-first model with fins. Replaced the LinkBuds S |
| Bose QuietComfort Ultra Earbuds (2nd Gen) | Jun 2025 (US Sep 2025) | $299 | Bose's current flagship |
| Samsung Galaxy Buds4 Pro | Mar 2026 | $249 | Replaced the Buds3 Pro |
| Nothing Ear (3) | Sep 2025 | $179 | Nothing's current flagship |
| Nothing Ear (3a) | Jul 2026 | $99 | Replaced the Ear (a) |
| CMF Buds Pro 2 | Jul 2024 | $59 (one source says $69) | Nothing sub-brand budget option |
| Sennheiser Momentum True Wireless 5 | Sep 2026 | $299.95 | Replaced MTW4 in Sep 2026 |
| Technics EAH-AZ100 | Jan 2025 | $299 | Still current; frequently compared with Sony and Bose |

### 1.3 Considered and excluded

| Model | Reason |
|---|---|
| AirPods 4 with ANC, Nothing Ear (a), Sennheiser MTW4, Galaxy Buds3 Pro | Superseded by a newer generation listed above |
| Bose QuietComfort Earbuds (2024), Galaxy Buds3 FE | Couldn't be researched to the minimum standard (price, battery, ANC and IP rating from cited sources) within this session. Excluded rather than shown with mostly empty fields |
| Bose Noise Cancelling Wired Earbuds (announced 28 Sep 2026) | Wired, so a different category |
| Open-ear / bone-conduction sport models | Different category. ANC and isolation aren't comparable |

## 2. Fair comparison: what each metric means and where it comes from

A fair Pareto comparison needs **one definition, one protocol and ideally one lab per
axis**. Mixing labs, test benches or ANC states on one axis creates fake frontier points.
These rules were applied:

| Axis | Definition (unit) | Better | Source / protocol | Coverage |
|---|---|---|---|---|
| **Price** | US launch MSRP (USD) | Lower | Manufacturer or launch press coverage. Street prices vary and are noted, not plotted | 14/14 |
| **Noise cancellation** | SoundGuys *Active Noise Cancelling* score (0–10) | Higher | B&K 5128 head, shaped pink noise, ANC on, best fit. The score is the average perceived-loudness reduction ÷ 10; on six models the published % matched score × 10 exactly. AirPods 5 and Powerbeats Pro 2 only had the % published, so it was converted | 13/14 (MTW5 missing: conflicting snippets) |
| **Battery (claimed)** | Earbuds only, one charge, **ANC on** (hours) | Higher | Manufacturer spec. ANC-off claims are excluded so every product is rated under the same condition | 14/14 (MTW5 low confidence) |
| **Battery (measured)** | Continuous playback until shutdown, ANC on (hours) | Higher | RTINGS lab test. Single lab, so no mixing with SoundGuys hours | 9/14 |
| **Comfort** | SoundGuys *Comfort & fit* rating (0–10) | Higher | **Subjective** reviewer rating from one publication, applied consistently. Not a measurement | 12/14 |
| **Earbud weight** | Mass of one bud (g) | Lower | Manufacturer spec or retailer spec sheet. **A proxy, not comfort** (see §2.3) | 13/14 (Powerbeats Pro 2: sources conflict) |
| **Sound quality** | — | — | **Not plotted. Evidence gap** (see §2.1) | 0 comparable |
| **Microphone quality** | — | — | **Not plotted. Evidence gap** (see §2.2) | 0 comparable |

### 2.1 Why sound quality is not an axis

- RTINGS' "Neutral Sound" scores are paywalled. RTINGS also says its target is "what most
  people find balanced", not an absolute quality measure.
- SoundGuys' MDAQS audio-quality scores were captured for several models. SoundGuys itself
  notes that MDAQS **versions differ across reviews and are not directly comparable**
  (stated for AirPods Pro 3), and conflicting values appeared for Pixel Buds Pro 2.
- Open AutoEq frequency-response datasets cover only the *previous* generation of most
  models here.
- **Adaptation:** choosing the sound-quality axis shows an explanation instead of a chart.
  Each product card shows a sourced, qualitative *sound character* note (for example,
  RTINGS: "warm, bass +5 dB").

### 2.2 Why microphone quality is not an axis

- RTINGS mic scores were paywalled or marked "In Development" for several models.
- SoundGuys' reader-poll mic scores (1–5 MOS) were found for only one model (Bose QC Ultra
  2nd Gen, MOS 3.11).
- Both labs document that their rigs **understate** some products. Bone-conduction and VPU
  sensors can't be excited by a test head; RTINGS says this about the Galaxy Buds4 Pro, and
  SoundGuys built a vibration fixture to address it.
- **Adaptation:** the Calls preset charts what *is* comparable and pins sourced mic notes,
  including disagreements such as RTINGS "excellent noise rejection" vs SoundGuys "muffled"
  for the Nothing Ear (3).

### 2.3 Comfort: subjective, ear-dependent, and labelled as such

- Ear-canal anatomy varies strongly between people (MRI study), and comfort depends on how
  a given product interacts with a given ear (*Applied Ergonomics*).
- The comfort axis therefore uses **one reviewer outlet's consistent rating** and is
  labelled *subjective*.
- Earbud weight is offered as a separate, objective axis, with a note that it's only a
  partial proxy.

### 2.4 Battery: claimed vs measured

- Manufacturers rate under different conditions: ANC on or off, volume, codec. SoundGuys
  reports claims are typically within ~10% of its results, but that depends on the
  conditions used.
- Only ANC-on claims are used.
- RTINGS measurements sit on a separate axis so the two are never mixed.
- Examples where they differ:
  - Powerbeats Pro 2: claims 8 h with ANC on; RTINGS measured 5.9 h.
  - Technics AZ100: claims 10 h; RTINGS measured 12.2 h.

### 2.5 Price

- Launch MSRP is the only price that is stable and documented for every model.
- Real prices move. For example, AirPods Pro 3 has sold below $200, Bose QC Ultra 2nd Gen
  often sells at $249, and WF-1000XM5 is discounted after the XM6 launch.
- The UI shows the documented street-price notes and uses MSRP for budget filtering.
  The budget filter is labelled "launch price".

## 3. Features that decide activity suitability

| Feature | Why it matters | Data treatment |
|---|---|---|
| **Fit aid** (wings/fins, ear hook, stability band, none, open-fit) | Gym, outdoor exercise. RTINGS rates hook/wing designs as more stable during running | Categorical. `null` = unknown |
| **Water resistance** (buds' IP code) | Sweat and rain | IEC 60529: the second digit is water (4 = splashes, 5 = jets, 7 = 1 m immersion). Tests use fresh water. Apple says resistance "can diminish over time" and the buds are "not sweatproof"; Samsung excludes salt and pool water. A **documented** rating is required to pass a water requirement |
| **Transparency / ambient mode** | Commute, outdoor, office | Yes/no/unknown. **It doesn't guarantee awareness.** A 2025 study found localisation accuracy fell from 91.5% to 68.9% in transparency mode. Sony, Bose and Apple all warn about using earbuds where hearing surroundings matters |
| **Multipoint** (two simultaneous source connections) | Office (laptop + phone) | Yes / no / unknown. Apple's automatic switching (same Apple Account) and Samsung's Auto Switch (Galaxy devices) are **ecosystem switching, not multipoint**, and are recorded separately |
| **OS fit** (iPhone / Android companion-app support) | All | `full` / `limited` / `unknown`. Unknown is **not** treated as compatible |
| **Controls** (physical buttons, pinch, force-sensor stem, touch) | Gym (sweaty hands), outdoor (gloves) | Descriptive. Physical buttons work with wet hands (Powerbeats Pro 2) |
| **Charging** (wireless case, ANC-on total with case) | Travel, commute | Yes/no/unknown |
| **Heart-rate sensing** | Gym | AirPods Pro 3, Powerbeats Pro 2 |

## 4. Pareto method

- **Dominance** (Wikipedia "Pareto front"; Britannica "Pareto optimality"): A dominates B
  if A is at least as good on both selected metrics and strictly better on at least one.
  Lower price and lower weight are better; every other metric is higher-is-better.
- **Ties.** Identical on both metrics means neither dominates, so both stay on the
  frontier. Equal on one metric and better on the other means domination.
- **Order of operations:**
  1. Hard requirements: budget, OS, multipoint, water rating, wireless charging, fit aid.
  2. Brand filter.
  3. Products missing either selected metric are excluded from *this chart*, with the
     reason listed.
  4. The frontier is computed on what's left.

  Steps 1–4 re-run on every change.
- **Unknown features** are excluded by a requirement that needs them, listed separately
  as "unknown — not assumed to pass".
- The frontier says nothing about metrics not on the chart, and nothing about fit for a
  particular ear or activity.

## 5. Derived "preference match" estimate (optional, labelled as derived)

The microsite offers a **derived estimate**, not a score of record. Users can see exactly how
it's built and turn it off.

- **Inputs:** the plottable metrics with non-zero weight.
- **Normalisation:** min–max within the *eligible set* on each metric. 1 is best and 0 is
  worst. Lower-is-better metrics are inverted.
- **Weights:** set by the activity preset and adjustable with sliders (0–3).
- **Missing data:** the product's estimate is the weighted mean over the metrics it *has*.
  Its *coverage* (share of weight backed by data) is shown, and products below 60% coverage
  are marked "insufficient data", not ranked.
- **Sensitivity:** each weight is moved ±50% one at a time, and the min–max rank range is
  shown, for example "rank 2–4".
- It is never presented as a winner. Rankings move with weights by design.

## 6. Where evidence is inconsistent or incomplete

1. **RTINGS numbers are mostly paywalled.** Overall attenuation in dB was found for only
   two models, from different test-bench eras, so RTINGS dB isn't used as an axis.
2. **Noise-cancellation figures:**
   - The SoundGuys ANC score for the WF-1000XM5 (8.7) and the Technics AZ100 (8.3) rest on
     single snippets. Other snippets for the same pages showed a different
     "isolation / ANC" composite. Shown as medium confidence.
   - Sennheiser MTW5 is excluded from the noise-cancellation axis: its score snippet was
     mixed up with the over-ear Momentum 5.
3. **Battery:**
   - Sennheiser MTW5's claim conflicts between retailers (6 h vs 4 h with ANC on); the 6 h
     retailer figure is used at low confidence. RTINGS measured 6.5 h.
   - RTINGS gave only approximate figures for Galaxy Buds4 Pro ("about 6 h") and
     Ear (3a) ("just over six hours"). These are left off the measured-battery axis rather
     than rounded.
   - No RTINGS battery figure was found for AirPods 5 (still in testing), LinkBuds Fit (not
     reviewed) or Pixel Buds Pro 2 (unverified figure).
4. **Weight:** Powerbeats Pro 2 conflicts (8.7 g on a retailer spec sheet vs 4.35 g in a
   review blog), so it's excluded from the weight axis.
5. **Multipoint:**
   - Not documented in the sources for AirPods Pro 3, AirPods 5 or Sennheiser MTW5.
   - Reported as absent for Powerbeats Pro 2 and Galaxy Buds4 Pro, which offer ecosystem
     switching instead (medium confidence).
   - The XM6 multipoint claim comes from a third-party Q&A (low confidence).
6. **Price conflicts:**
   - CMF Buds Pro 2: $59 per PhoneArena and Nothing's launch, $69 per Tom's Guide. $59 is
     used.
   - AirPods 5: one outlet lists $124.99. Apple's newsroom says $129.
7. **Opposite reviewer verdicts:**
   - CMF Buds Pro 2: TechRadar says poor grip; RTINGS says very good for sports.
   - Nothing Ear (3) mic: RTINGS praises noise rejection; SoundGuys calls it muffled.
   - Both sides are shown.
8. **Generation drift:** firmware updates change ANC and sound (for example, Google's Sep 2026
   Pixel Buds Pro 2 ANC update). Lab results are tied to the firmware tested.
9. **Single-sample testing.** Each lab tests one unit on one head. Individual fit can
   swing isolation substantially, and SoundGuys notes AirPods 5's ANC "fit makes or breaks
   the entire experience".

## 7. Activity presets: what each uses

| Preset | Suggested axes (x · y) | Features surfaced | Suggested requirements (not auto-applied) |
|---|---|---|---|
| Gym | Earbud weight · Comfort | Fit aid, IP rating, controls, transparency, heart rate | Water rating ≥ IPX4 |
| Office | Price · Comfort | Multipoint, OS fit, transparency, battery | Multipoint |
| Commute | Price · Noise cancellation | Transparency, battery, wireless charging, case | — |
| Calls | Price · Noise cancellation (mic not comparable, shown as notes) | Mic notes, multipoint, transparency | Multipoint |
| Travel | Battery (measured) · Noise cancellation | Battery claim, case total, wireless charging, comfort | — |
| Outdoor exercise | Price · Comfort | Fit aid, IP rating, transparency (+ safety note), wind notes | Water rating ≥ IPX4 |

## 8. Key sources

The full list, with URLs, publishers, evidence type and access date, is in
`src/lib/earbuds/sources.ts` and is rendered on the site.

- **Lab methodology:**
  - SoundGuys "How we test" and "How we score"
  - RTINGS test pages for noise isolation, battery, microphone and stability, plus its
    versioned test-bench policy
- **Standards and safety:**
  - IEC 60529 (via the IP-code summary)
  - Apple water-resistance and safety support pages
  - Samsung IP57 fresh-water note
  - Sony, Bose and Apple user-guide warnings
  - WHO–ITU H.870 safe-listening standard
  - *Audiology Research* 2025 transparency-mode localisation study
- **Comfort research:** *Applied Ergonomics* (3D anthropometry and comfort), Song et al.
  2020 (*Applied Sciences*), MRI ear-canal morphology study
