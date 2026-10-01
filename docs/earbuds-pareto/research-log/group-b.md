# Group B research: Sony WF-1000XM6, WF-1000XM5, LinkBuds Fit (as of 2026-10-01)

## Method and caveats (read first)
- WebFetch and curl are blocked for rtings.com, soundguys.com, whathifi.com, helpguide.sony.net and sony.com (EGRESS_BLOCKED / proxy 403). Every value below comes from WebSearch result summaries, which are machine-written. They are not verbatim page text, and some summaries visibly mixed up models (see "Gaps & conflicts").
- The session-wide WebSearch budget (200 calls, shared with the other research agents) ran out partway through. Many RTINGS sub-scores could not be collected and are marked NOT FOUND.
- Evidence types: MFR = manufacturer claim, MEAS = independent lab measurement, SUBJ = reviewer opinion or rating, RETAIL = retailer or aggregator listing (lower trust).

## Generation status
- **A newer generation exists.** The Sony WF-1000XM6 was officially launched in February 2026. Pre-orders opened Feb 12, 2026, and it shipped around Feb 23, 2026. US price is $329.99. [MFR/press] (https://www.prnewswire.com/news-releases/sony-electronics-launches-wf-1000xm6-truly-wireless-earbuds--the-best-noise-canceling1-with-premium-sound-302685878.html ; https://www.soundguys.com/sony-wf-1000xm6-120084/ ; https://www.lowyat.net/2026/380899/sony-wf-1000xm6-launch-12-february-2026/). The ship date comes from a pre-launch report: https://www.notebookcheck.net/Sony-WF-1000XM6-release-date-rears-its-head-as-new-pricing-leaks.1197885.0.html
- The WF-1000XM5 has not been discontinued. It is still sold, at a discount. [SUBJ/news] (https://www.whathifi.com/headphones/wireless-earbuds/sony-xm6-earbuds-too-expensive-their-five-star-predecessors-are-now-at-their-lowest-ever-price)
- The LinkBuds Fit (WF-LS910N) is still the current model. No successor turned up in the searches. Note that WebSearch did not search for a "LinkBuds Fit 2" by name, so this is unconfirmed.

---

## 1. Sony WF-1000XM6 (current flagship)

### Identity / price
- name: Sony WF-1000XM6 [MFR] (https://www.sony.co.uk/headphones/products/wf-1000xm6)
- announced / release: announced Feb 12, 2026; shipping around Feb 23, 2026 [press/news] (https://www.lowyat.net/2026/380899/sony-wf-1000xm6-launch-12-february-2026/ ; https://www.notebookcheck.net/Sony-WF-1000XM6-release-date-rears-its-head-as-new-pricing-leaks.1197885.0.html)
- US launch MSRP: $329.99 [MFR via press/news] (https://www.soundguys.com/sony-wf-1000xm6-120084/ ; https://www.prnewswire.com/news-releases/sony-electronics-launches-wf-1000xm6-truly-wireless-earbuds--the-best-noise-canceling1-with-premium-sound-302685878.html). Cross-checked against Tom's Guide (https://www.tomsguide.com/audio/earbuds/the-sony-wf-1000xm6-are-here-heres-everything-you-need-to-know). EU price €299.99.
- current price: NOT FOUND. SoundGuys reported a "first-ever sale price" without a figure in the summary (https://www.soundguys.com/sony-wf-1000xm6-earbuds-hit-their-first-ever-sale-price-155236/). What Hi-Fi reported a "first ever discount" (https://www.whathifi.com/headphones/wireless-earbuds/these-five-star-wireless-earbuds-are-seeing-their-first-ever-discount).

### Manufacturer specs
- battery, buds only, ANC on: 8 h (12 h ANC off) [MFR] (https://www.soundguys.com/sony-wf-1000xm6-review-152013/ restating Sony; https://www.sony-mea.com/en/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications). **Conflict:** one summary of the Sony UK spec page said "Max 5 h (NC ON) / 5.5 h (NC OFF)". Another summary lists 5 h NC on as the *communication (call)* time, so the 5 h figure is almost certainly call time.
- battery total with case: 24 h ANC on / 36 h ANC off [MFR] (https://www.rtings.com/headphones/reviews/sony/wf-1000xm6 summary ; https://www.soundguys.com/sony-wf-1000xm6-review-152013/)
- fast charge: 3 min charge gives up to 60 min playback [MFR, via a third-party page] (https://shopsavvy.com/answers/how-does-the-quick-charge-feature-work-on-the-sony-wf-1000xm6). The same summary said real-world results were about 45 min with ANC on, from an unnamed tester. Low trust.
- earbud charge time: about 1.5 h; case charge about 2 h over USB [MFR] (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications)
- wireless charging: Yes, Qi [MFR] (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications ; https://www.soundguys.com/sony-wf-1000xm6-review-152013/)
- USB-C: NOT FOUND explicitly. The spec page says "USB charge", and Sony's previous model uses USB-C.
- IP rating: buds IPX4. The case is NOT waterproof. [MFR] (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications)
- weight per bud: about 6.5 g with M tips [MFR] (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications)
- case weight: about 47 g [MFR] (same URL)
- Bluetooth: 5.3 [MFR] (https://www.sony-mea.com/en/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications)
- codecs: SBC, AAC, LDAC, LC3 (LE Audio ready) [MFR] (same URL ; press release https://www.sony.eu/presscentre/sony-launches-wf-1000xm6-truly-wireless-earbuds-the-best-noise-cancelling-with-premium-sound)
- multipoint: Yes, 2 devices. LDAC is unavailable while multipoint is on (falls back to AAC/SBC) and can be toggled in the app. [RETAIL/third-party] (https://shopsavvy.com/answers/sony-wf-1000xm6-multipoint-bluetooth). Not confirmed on a Sony page, and the press release summary did not mention multipoint. Medium-low trust.
- Android vs iOS: LDAC works on Android only; iPhone uses AAC. Android head tracking / spatial sound is supported on Android. The Sound Connect app features are otherwise the same on both platforms. [helpguide MFR for spatial: https://helpguide.sony.net/mdr/2985/v1/en/contents/F002_Using_the_Sound_Connect_app.html ; parity claim from a third party: https://shopsavvy.com/answers/do-the-sony-wf-1000xm6-work-better-with-android-or-iphone]
- fit type: in-ear with memory foam tips, no fins. The buds are "wider and more contoured" than the XM5. [MEAS-site description] (https://rtings.com/headphones/reviews/sony/wf-1000xm6)
- controls: touch sensor; single, double and triple tap plus long press; each bud assignable separately in Sound Connect [MFR helpguide https://helpguide.sony.net/mdr/2985/v1/en/contents/F013_About_the_touch_sensor.html ; per-gesture detail via https://shopsavvy.com/answers/how-do-the-touch-controls-work-on-the-sony-wf-1000xm6]
- ambient / transparency: Yes, Ambient Sound mode plus Adaptive Sound Control / scene-based listening and Auto Play [MFR] (https://www.sony.eu/presscentre/sony-launches-wf-1000xm6-truly-wireless-earbuds-the-best-noise-cancelling-with-premium-sound)
- speak-to-chat: Yes [MFR] (https://helpguide.sony.net/mdr/2985/v1/en/contents/F045_Speaking_with_someone_in_front_of_you.html)
- head gestures (nod to answer, shake to reject calls): Yes [MFR] (https://helpguide.sony.net/mdr/2985/v1/en/contents/F048_Functions_for_a_phone_call.html)
- spatial audio: 360 Reality Audio supported [MFR] (https://helpguide.sony.net/mdr/2985/v1/en/contents/F039_About_360_Reality_Audio.html). TechRadar flags "waning support for 360 Reality Audio" [SUBJ] (https://www.techradar.com/audio/earbuds-airpods/sony-wf-1000xm6-review)
- ANC hardware: QN3e plus Integrated Processor V2, 4 mics per bud (8 total vs 6 on the XM5). Sony claims 25% more noise reduction than the XM5. [MFR] (https://www.sony.eu/presscentre/sony-launches-wf-1000xm6-truly-wireless-earbuds-the-best-noise-cancelling-with-premium-sound)
- call tech: bone conduction sensor, AI beamforming, AI noise reduction [MFR] (same URL)
- antenna: 1.5x larger than the previous model [MFR] (same URL)

### RTINGS (https://www.rtings.com/headphones/reviews/sony/wf-1000xm6). Review date and test bench version NOT FOUND.
- noise isolation: described as "outstanding", with ANC beating the XM5 especially in the low frequencies [MEAS, qualitative]. **Overall attenuation in dB: NOT FOUND** (bass/mid/treble: NOT FOUND).
- battery, continuous: 8.6 h [MEAS] (summary of the RTINGS review URL above). Single source, so treat with caution. The RTINGS XM5 vs XM6 compare page says the XM6 "retains the same battery life" as the XM5 (https://www.rtings.com/headphones/tools/compare/sony-wf-1000xm5-truly-wireless-vs-sony-wf-1000xm6/38974/104419).
- battery total with case (measured): NOT FOUND
- microphone: overall "okay"; noise handling "good"; clearer than the XM5 with less bass and treble roll-off; very loud noise (trains) can trigger the noise gate [MEAS, qualitative]. Numeric "Recording Quality" / "Noise Handling" scores: NOT FOUND.
- stability / comfort: most people will find them comfortable and stable with the right tips. Their bulkier size can make them pop out of smaller ears. [MEAS-site SUBJ]
- sound: bass "Emphasized (4 dB)", treble "Balanced (-1 dB)", flat mids [MEAS]. **Suspect:** the same numbers appeared in a summary for the XM5 page, so they may belong to only one of the two models. Sound Profile / Neutral Sound scores: NOT FOUND.
- latency: NOT FOUND. Sony claims LE Audio enables ultra-low latency [MFR].

### SoundGuys (https://www.soundguys.com/sony-wf-1000xm6-review-152013/)
- battery measured: 9 h 41 min on one charge (SoundGuys standard test, ANC on) [MEAS]. Battery deep-dive article: https://www.soundguys.com/sony-wf-1000xm6-battery-life-performance-152956/
- ANC: attenuates over 40 dB around 100 Hz and over 50 dB around 2 kHz. One summary said the buds "block an average of 32 dB", but that figure could not be tied definitively to SoundGuys. [MEAS]
- mic: "some of the best call quality" from earbuds; numeric mic rating NOT FOUND [SUBJ]

### Other reviews
- What Hi-Fi: 5/5 stars. Named best overall flagship wireless earbuds. Praised the sound ("out-of-this-world") and calls ("loud and clear", even in wind). Called the 8 h / 24 h battery mid-pack. [SUBJ] (https://www.whathifi.com/headphones/wireless-earbuds/sony-wf-1000xm6 ; https://www.whathifi.com/headphones/wireless-earbuds/the-sony-wf-1000xm6-are-officially-our-favourite-flagship-wireless-earbuds). Review date NOT FOUND (2026).
- TechRadar: 4/5. "Great sound, impressive features, middling noise cancellation." Notes fit issues, no hearing test, and waning 360RA support. Praises much easier retrieval of the buds from the case. [SUBJ] (https://www.techradar.com/audio/earbuds-airpods/sony-wf-1000xm6-review)
- Tom's Guide: very positive ("everything I could possibly need"); star rating NOT FOUND. Pros: balanced sound, ANC, battery, codecs, comfort. Cons: odd case design, price hike. [SUBJ] (https://www.tomsguide.com/audio/earbuds/sony-wf-1000xm6-review)
- The Verge: one summary called them "an amalgamation of the best traits from Sony's past models", even though the price has crept up. Direct URL and rating NOT FOUND, so the attribution is unverified.

### Activity notes
- gym / workout: IPX4 buds; no fins; foam tips. RTINGS says the larger body can pop out of small ears. TechRadar notes fit issues. Fine for most people with the right tip size; not a sport design. [MFR/SUBJ] (URLs above)
- office / calls: 8-mic ANC, bone conduction plus AI call processing. What Hi-Fi and SoundGuys praise calls. RTINGS rates the mic only "okay" (noise handling good). Multipoint available, but it disables LDAC.
- commute / travel: RTINGS highlights its top-tier isolation for travel; 8 h per charge (8.6 h RTINGS, 9 h 41 min SoundGuys).
- known problems: fit / falling-out complaints (vendor blog, low trust: https://www.complyfoam.com/blogs/comply-foam-blog/why-do-my-sony-wf-1000xm6-keep-falling-out-heres-how-to-fix-the-fit); multipoint / LDAC connection instability in congested RF (third party: https://shopsavvy.com/answers/sony-wf-1000xm6-connection-issues-troubleshooting). No verified battery-swelling reports were found.

---

## 2. Sony WF-1000XM5 (previous generation, still sold)

### Identity / price
- name: Sony WF-1000XM5 [MFR] (https://www.sony.co.uk/headphones/products/wf-1000xm5)
- release: announced July 24, 2023; deliveries from about July 26, 2023 [news] (https://androidauthority.com/sony-wf-1000xm5-3235457 ; https://wccftech.com/sony-wf-1000xm5-official/amp/)
- US launch MSRP: $299.99 [news] (https://androidauthority.com/sony-wf-1000xm5-3235457). Cross-checked: What Hi-Fi tested at £259 / $299 / AU$419 (https://www.whathifi.com/advice/sony-wf-1000xm5-release-date-rumours-potential-price-features-and-spec-leaks); SoundGuys says the XM6 is $30 more than the XM5.
- current price: discounted after the XM6 launch; one summary cited about $248 US and £149–£160 UK. Exact current US list price NOT FOUND. [news] (https://www.whathifi.com/headphones/wireless-earbuds/sony-xm6-earbuds-too-expensive-their-five-star-predecessors-are-now-at-their-lowest-ever-price ; https://www.whathifi.com/news/another-discount-award-winning-sony-xm5-wireless-earbuds-fall-again-to-a-new-low-just-gbp149)

### Manufacturer specs (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm5/specifications ; https://www.sony-mea.com/en/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm5/specifications)
- battery, ANC on: 8 h (12 h ANC off); call time 6 h ANC on / 7 h ANC off [MFR]
- total with case: 24 h ANC on [MFR] (also restated by RTINGS / SoundGuys summaries)
- fast charge: NOT FOUND
- charge time: buds about 1.5 h; case about 2 h over USB [MFR]
- wireless charging: Yes [MFR]
- USB-C: NOT FOUND explicitly ("USB charge")
- IP rating: buds IPX4 equivalent; case and tips not water resistant [MFR]
- weight per bud: about 5.9 g with M tips [MFR]
- case weight: about 39 g [MFR]
- Bluetooth: 5.3 [MFR / retail] (https://store.sony.com.sg/blogs/7686391300251_43466053779611/7686391300251__specifications)
- codecs: SBC, AAC, LDAC (also LC3 / LE Audio according to later firmware, but NOT FOUND in this session) [MFR]
- multipoint / speak-to-chat / 360RA / controls: NOT FOUND in this session. These are not verified here, although prior-gen features are generally assumed.
- fit: memory foam "Noise Isolation Earbud Tips" in XS–L; no fins [MFR / news]
- ANC hardware: 2 processors (QN2e plus V1), dual feedback mics, Dynamic Driver X [MFR]

### RTINGS (https://www.rtings.com/headphones/reviews/sony/wf-1000xm5-truly-wireless ; a variant URL also appears: https://www.rtings.com/headphones/reviews/sony/wf-1000xm5)
- noise isolation overall attenuation: -23.37 dB; bass -14.43 dB; mid -24.82 dB; treble -32.63 dB [MEAS]. Test bench version NOT FOUND, so this may be an older bench and not directly comparable to the XM6.
- battery continuous: 8.75 h [MEAS]
- battery total with case (measured): NOT FOUND
- microphone: "mediocre"; recordings lack depth; loud sustained noise overwhelms noise handling [MEAS, qualitative]. Numeric scores NOT FOUND.
- stability / comfort: no fins, but stable during "tough reps at the gym". Foam tips can cause fatigue with a poor fit or small canals. [MEAS-site SUBJ]
- sound: "great" accuracy, warm profile; bass Emphasized (4 dB), treble Balanced (-1 dB) (see the XM6 duplication caveat) [MEAS]
- latency: "high latency on PCs" (Bluetooth only); ms value NOT FOUND [MEAS]
- usage: "great for sports and fitness" [MEAS-site SUBJ]

### SoundGuys (https://www.soundguys.com/product/sony-wf-1000xm5/)
- battery: "8 hours" in the summary; the exact measured value is NOT clearly FOUND [MEAS?]
- ANC / isolation score: 8.3/10, "top 10%" [MEAS-derived score]
- mic rating: NOT FOUND

### Other reviews
- What Hi-Fi: 5/5. What Hi-Fi Award winner 2024. Pros: detail, timing, comfortable discreet design. Cons: rivals have more bass; "could feel more secure". [SUBJ] (https://www.whathifi.com/advice/sony-wf-1000xm5-release-date-rumours-potential-price-features-and-spec-leaks)
- Tom's Guide: headline "Best-ever wireless earbuds"; rating NOT FOUND [SUBJ] (https://www.tomsguide.com/reviews/sony-wf-1000xm5)
- The Verge: glossy finish makes the buds hard to remove from the case. Trusted Reviews and Wired criticised call quality. [SUBJ, second-hand summary] (https://www.trustedreviews.com/reviews/sony-wf-1000xm5)

### Activity notes / known problems
- gym: IPX4; RTINGS says they stay put without fins; What Hi-Fi says they could be more secure. Glossy shell is slippery.
- calls: RTINGS rates the mic mediocre in loud noise. Several reviewers criticised calls. RTINGS says the XM6 mic is clearly better.
- repairability: iFixit says XM5 batteries are no longer user-replaceable with common tools; "repairability... completely tanked" [SUBJ] (https://ifixit.com/News/79140/sony-just-nerfed-their-most-repairable-earbud-line)
- battery swelling: NOT FOUND for the XM5. Swelling and explosion reports and a battery-drain firmware fix were for the **XM4**, not the XM5 (https://www.phonearena.com/news/sony-wf-1000xm4-earbuds-seem-to-be-exploding-at-random_id145793). A "battery issues 1 year later" blog exists, content NOT FOUND (https://www.loudnwireless.com/blog/sony-wf-1000xm5-battery-issues-1-year-later-).

---

## 3. Sony LinkBuds Fit (WF-LS910N)

### Identity / price
- name / model: Sony LinkBuds Fit, WF-LS910N [MFR] (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-ls910n/specifications)
- announced Oct 2024; US release Nov 1, 2024 [news] (https://soyacincau.com/2024/10/06/sony-launches-three-new-linkbuds-devices-pre-orders-start-november-2024/ ; https://www.gsmarena.com/sony_unveils_linkbuds_open_with_open_design_linkbuds_fit_replace_the_linkbuds_s-news-64762.php). It replaces the LinkBuds S.
- US launch MSRP: $199.99 [news] (soyacincau URL above)
- current price: B&H listing $198.00; other retailers seen at $179.99–$229.99 [RETAIL] (https://www.bhphotovideo.com/c/product/1857998-REG/sony_wfls910n_w_linkbuds_fit_truly_wireless.html). Exact date NOT FOUND.

### Manufacturer specs (https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-ls910n/specifications ; https://www.sony-asia.com/electronics/support/wireless-headphones-bluetooth-headphones/wf-ls910n/specifications)
- battery, ANC on: 5.5 h (8 h ANC off) [MFR]
- total with case: 21 h (ANC on presumably) [MFR via retail] (https://www.bhphotovideo.com/c/product/1857998-REG/sony_wfls910n_w_linkbuds_fit_truly_wireless.html). One review summary said "6 h plus 3 extra charges", which conflicts.
- fast charge: 5 min gives about 60 min [MFR via retail/review]
- charge time: buds about 2 h; case about 3 h over USB [MFR]
- wireless charging: NOT FOUND (believed no, but unverified)
- IP rating: buds IPX4; case NOT FOUND [MFR]
- weight: about 4.9 g per bud; case about 41 g; case 47.2 x 47.2 x 32.6 mm [MFR]
- Bluetooth: 5.3; codecs SBC, AAC, LDAC, LC3 [MFR]
- driver: 8.4 mm Dynamic Driver X; Integrated Processor V2 [MFR / news]
- fit: in-ear with soft "Air Fitting Supporters" (fins) plus newly designed tips; shallow insertion [MFR / news]
- multipoint, controls, speak-to-chat, spatial audio, Android / iOS limits: NOT FOUND

### RTINGS
- **No RTINGS review of the LinkBuds Fit was found.** Searches returned only the LinkBuds (original) and LinkBuds S. All RTINGS measurements: NOT FOUND. Note: one summary wrongly presented original-LinkBuds RTINGS text as the Fit; it was discarded.

### SoundGuys (https://www.soundguys.com/sony-linkbuds-fit-review-127506/)
- battery measured: 6 h 46 min, ANC on [MEAS]
- isolation / ANC rating: 4.7/10 [MEAS-derived score]
- mic: positive ("better than any halfway decent ones" in other earphones; summary wording garbled) [SUBJ]

### Other reviews
- What Hi-Fi: review exists (https://www.whathifi.com/reviews/sony-linkbuds-fit); rating NOT FOUND
- Consumer Reports: very good sound, "excellent" active noise reduction, stable fit with the Air Fitting Supporters [SUBJ] (https://www.consumerreports.org/electronics-computers/headphones/sony-linkbuds-fit/m415796/)
- Galaxus (Samuel Buchmann): "comfiest earphones ever", but a "remarkably poor isolator" because of the shallow fit. ANC is decent but below the XM5 and works mainly on low frequencies. [SUBJ] (https://www.galaxus.ch/en/page/sony-linkbuds-fit-review-comfiest-earphones-ever-35650)
- Trusted Reviews (https://www.trustedreviews.com/reviews/sony-linkbuds-fit), Engadget (https://www.engadget.com/audio/headphones/sony-linkbuds-fit-and-linkbuds-open-review-two-designs-one-clear-champ-134529932.html), PhoneArena (https://www.phonearena.com/reviews/sony-linkbuds-fit-review_id7587): reviews exist; ratings NOT FOUND

### Activity notes
- gym / outdoor: the fins keep the buds in place during workouts [SUBJ] (Galaxus; https://recordingnow.com/blog/sony-linkbuds-fit-review/ "Great for Workouts"); IPX4
- office / long wear: comfort is the headline strength; light at 4.9 g
- commute / travel: weak isolation (SoundGuys 4.7/10; Galaxus); shorter battery (5.5 h claimed / 6 h 46 min measured)

---

## 4. Sony ULT / other mid-tier (optional)
- Not researched (search budget exhausted). An RTINGS review of the Sony ULT WEAR (over-ear) exists (https://www.rtings.com/headphones/reviews/sony/ult-wear-wireless). It is not an earbud.

---

## Gaps & conflicts
1. **XM6 battery spec conflict:** the Sony UK spec summary gave "5 h NC on / 5.5 h NC off", while Sony / press / reviews say 8 h / 12 h music. The 5 h figure is most likely communication (call) time. Use 8 h music with ANC on.
2. **XM6 measured battery differs by lab:** RTINGS 8.6 h vs SoundGuys 9 h 41 min. These are different test protocols and both are plausible. The RTINGS 8.6 h comes from a single summary and is unverified.
3. **XM6 RTINGS noise isolation dB: NOT FOUND.** The only dB figures are SoundGuys-style (>40 dB at 100 Hz, >50 dB at 2 kHz; a "32 dB average" of uncertain attribution). The XM5 RTINGS overall of -23.37 dB may come from an older test bench. Do not compare it directly to non-RTINGS XM6 numbers.
4. **RTINGS sound numbers duplicated:** "Bass Emphasized 4 dB / Treble Balanced -1 dB" appeared for both the XM5 and XM6 pages. At least one is likely contaminated.
5. **RTINGS mic numeric scores, stability / comfort scores, latency ms, review dates and test bench versions:** NOT FOUND for every model.
6. **LinkBuds Fit:** no RTINGS review found. Total battery is 21 h (MFR / retail) vs "6 h + 3 charges" (review summary). Wireless charging, multipoint and controls: NOT FOUND.
7. **XM6 multipoint and the LDAC-disables-multipoint behaviour** come only from a third-party Q&A site (shopsavvy), not Sony. Treat as unverified.
8. **XM5 current US price:** NOT FOUND precisely (about $248 cited in a garbled summary).
9. **XM5 battery swelling:** no evidence found; the swelling and explosion reports concern the XM4.
10. **The Verge XM6 / XM5 opinions** are second-hand summaries without a direct Verge URL.
11. **Tom's Guide, What Hi-Fi (LinkBuds Fit), Wired and CNET ratings:** NOT FOUND.
