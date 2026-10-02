# Earbuds catalog research — shared instructions (read fully before starting)

Today is 2026-10-02. We are building a sourced catalog of ~300 popular true-wireless earbuds
with an India focus (INR prices, India availability) plus US launch prices where they exist.

## Tools & network
- WebFetch and curl are BLOCKED for almost every site (rtings, soundguys, smartprix, amazon, flipkart,
  brand sites...). Use the WebSearch tool (mode "standard"); its result summary contains values
  from the pages, and it lists the URLs. Use "extended" only if standard is thin for an important model.
- Budget: aim for ~1–2 searches per model, max 3. Run several searches in parallel per turn.
- Good query shape: `<brand> <model> specifications price India battery ANC IP rating weight`
  (smartprix.com, 91mobiles.com, gadgets360.com, the brand's own site, Amazon/Flipkart listings,
  launch news). For US price: `<model> price $ launch`.

## Hard rules
- NEVER invent a value or fill from memory. If a value isn't in a search result, set it to null.
- Only include a model if a search result confirms it exists (a spec/listing/launch page).
- True-wireless earbuds only (no neckbands, no over-ear headphones, no wired).
- Record which URL(s) each value came from (use the URLs shown in the search results).
- If sources conflict, pick the manufacturer/launch figure, put the alternative in `notes`.
- Prices: `launchPriceINR` = the price announced at India launch (often lower than MRP; NOT a
  random sale price). `mrpINR` = listed MRP if shown. `launchPriceUSD` = US launch MSRP if the model
  was sold in the US. Never convert currencies.
- Battery: `batteryBudsAncOn` = hours from earbuds alone with ANC ON (only if stated as ANC-on);
  `batteryBudsMax` = earbuds alone, maximum claimed (usually ANC off); `batteryTotalMax` = total with
  case, maximum claimed. Hours as numbers.
- `ancClaimDb` = manufacturer's "up to X dB" ANC claim (manufacturer claim, not a measurement).

## Output
Write a JSON array (valid JSON, no comments) to the file path given in your task, one object per model:
{
  "id": "kebab-case brand-model",
  "brand": "boAt",
  "model": "Airdopes 141 ANC",
  "released": "2024-08" | null,             // yyyy-mm of launch (India or global, say which in notes if unclear)
  "status": "current" | "older-still-sold" | "discontinued" | "unknown",
  "form": "in-ear" | "open-ear" | "ear-hook" | "semi-in-ear" | "clip",   // semi-in-ear = AirPods-style unsealed
  "indiaAvailable": true | false | null,
  "launchPriceINR": number | null,
  "mrpINR": number | null,
  "launchPriceUSD": number | null,
  "anc": "none" | "anc" | "adaptive" | null,
  "ancClaimDb": number | null,
  "batteryBudsAncOn": number | null,
  "batteryBudsMax": number | null,
  "batteryTotalMax": number | null,
  "ip": "IPX4" | "IP54" | ... | null,       // earbuds rating as stated
  "weightG": number | null,                // one earbud, grams
  "multipoint": true | false | null,
  "bluetooth": "5.3" | null,
  "codecs": ["SBC","AAC","LDAC"] | null,
  "wirelessCharging": true | false | null,
  "latencyMs": number | null,              // claimed low-latency/game mode figure
  "drivers": "12.4mm dynamic" | null,
  "sources": [
    {"url": "https://...", "publisher": "Smartprix", "kind": "aggregator|manufacturer|retailer|news|review|lab",
     "fields": ["launchPriceINR","batteryTotalMax","ip"]}
  ],
  "notes": "conflicts, caveats" | "",
  "confidence": "high" | "medium" | "low"
}
Write the file incrementally (rewrite the whole array every ~8 models) so work isn't lost if you
run out of budget. When done, reply with: number of models written, which assigned models were
dropped and why, and the main conflicts.
