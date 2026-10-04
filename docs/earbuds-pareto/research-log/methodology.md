# Earbud comparison: methodology research notes

Compiled 2026-10-01. Method: WebSearch summaries only. WebFetch to rtings.com is blocked (EGRESS_BLOCKED), so no primary page was read in full. Every claim below comes from a search-result summary of the cited URL. Claims marked **[unverified]** came from one summary, a low-reliability aggregator, or conflicting snippets. **NOT FOUND** means the searches turned up no source. The search budget (200 calls) ran out at the end of the session.

---

## 1. RTINGS headphone methodology

### Test bench version history
- The current headphone methodology is **v2.3**, which RTINGS used for 2026 reviews. (https://www.rtings.com/headphones/tests/changelogs/2-3 ; reviews such as https://www.rtings.com/headphones/reviews/sony/wh-1000xm6 say "Methodology v2.3"; date of v2.3: NOT FOUND)
- **2.0**: added new tests and improved the accuracy of existing objective measurements, overhauling RTINGS' approach to sound. It also changed both "usages" and tests. It built on TB 1.8, developed an in-house target curve and allowed "a more subjective interpretation of data". New tests included Stereo Mismatch, Group Delay, Cumulative Spectral Decay, PRTF, Harmonic Distortion and Electrical Aspects. (https://www.rtings.com/headphones/tests/changelogs/2-0 ; https://www.rtings.com/headphones/learn/test-bench-2-0-preview) **Release date of 2.0: NOT FOUND.**
- **2.1**: rebalanced Harmonic Distortion scoring based on audibility research. (https://www.rtings.com/headphones/tests/changelogs/2-1)
- **2.2**: removed the Cumulative Spectral Decay test after community feedback. (https://www.rtings.com/headphones/tests/changelogs/2-2)
- **2.3**: removed Virtual Soundstage, Base/Dock and some Bluetooth Connection comparisons to remove outdated or less impactful tests. (https://www.rtings.com/headphones/tests/changelogs/2-3)

### Comparability across test bench versions
- Within one version, the tests and score calculations stay fixed until the next update. Updates cover technology changes that break tests, or new methods. (https://www.rtings.com/company/versioned-test-benches ; https://www.rtings.com/company/test-benches-and-scoring-system)
- RTINGS retests popular models on new methodologies, and "test results for certain models have been converted". The review text may not match the new results. (same sources)
- **Implication (my inference, not a quote):** only compare scores measured under the same test bench version, and check each review's "Methodology vX.Y" label.

### Noise Isolation (full range / overall attenuation)
- **Rig:** a treated room with carpet and noise-dampening wall materials. A **B&K 5128 head and torso simulator (HATS)** sits centred between **four speakers and one subwoofer**. (https://www.rtings.com/headphones/tests/noise-isolation-cancellation-passive-active ; https://www.rtings.com/headphones/learn/how-we-test)
- **Signal:** **pink noise**, which replaced an earlier sine sweep. The graphs combine three passes at **60, 70 and 80 dB**. (https://www.rtings.com/headphones/tests/noise-isolation-cancellation-passive-active ; changelog https://www.rtings.com/headphones/tests/changelogs/1-7, which version introduced the pink-noise change: [unverified])
- **Outputs:** Overall attenuation, bass, mid and treble attenuation, and self-noise. A newer version also has dynamic real-life scenarios. Reviews report "Overall Attenuation" in dB, for example −23.50 dB. (same source; example from review search snippets)
- **ANC state:** reviews show a "Noise Cancelling" field. One summary suggested ANC is tested at its maximum setting **[unverified; no page text confirms "max"]**.
- **Fit / tips:** NOT FOUND in the RTINGS sources reached.
- **Frequency band boundaries (bass/mid/treble ranges):** NOT FOUND.

### Battery life
- **Scope:** battery life, charge time, battery-saving features such as auto-off, use while charging, and passive use when drained. (https://www.rtings.com/headphones/tests/active-features/battery-life ; https://www.rtings.com/headphones/learn/how-we-test)
- **Protocol:** one search summary of RTINGS review pages said RTINGS calibrates to **84–85 dB SPL with pink stereo noise (250 Hz–2 kHz)**, then plays a "Bass Loop Track" from a test phone until the headphones run flat. (summary of RTINGS review search results, e.g. https://www.rtings.com/headphones/reviews/apple/airpods-pro-3) **[unverified]**
- A conflicting aggregator summary says "75 dB, repeated three times". It came from a non-RTINGS site (https://www.propelrc.com/best-wireless-headphones-rtings/) and **should not be used**. The 75 dB figure is SoundGuys' method (see §2).
- **ANC state during the battery test:** reviews report battery "with ANC enabled", e.g. Sony WH-1000XM6 at 31.75 h (https://www.rtings.com/headphones/reviews/sony/wh-1000xm6 snippet). An explicit policy statement was NOT FOUND.

### Microphone
- Split into **Recording Quality** and **Noise Handling**. (https://www.rtings.com/headphones/tests/microphone ; https://www.rtings.com/company/microphone-headphones)
- Noise Handling sub-tests seen in reviews: **"Speech + Pink Noise Handling"** and **"Speech + Subway Noise Handling"**. (review snippets, e.g. https://www.rtings.com/headphones/reviews/tozo/ht3, https://www.rtings.com/headphones/reviews/jabra/evolve3-85)
- Test Bench 1.2 added playback (audio samples) to Recording Quality and Noise Handling. (https://www.rtings.com/headphones/tests/changelogs/1-2 via mirror)
- **Units / exact metrics for TB 2.x** (e.g. dB SNR, POLQA): NOT FOUND.
- **RTINGS states a limitation of the rig:** the Galaxy Buds4 Pro mic "is much better than the score indicates" because "the test rig interacts with the buds and their on-board noise suppression isn't active". The Shokz OpenDots 2 also performs better than its score because its noise reduction interacts with the recording-quality measurements. (https://www.rtings.com/headphones/reviews/samsung/galaxy-buds4-pro ; https://www.rtings.com/headphones/reviews/shokz/opendots-2)

### Comfort
- The comfort test page still exists. Weight and clamping force are measured objectively, and the final comfort score comes from the group consensus of subjective tests. (https://www.rtings.com/headphones/tests/design/comfort)
- One summary said RTINGS dropped breathability because its rig broke [unverified].
- **Whether TB 2.x removed the Comfort score: NOT CONFIRMED.** One summary saw "0.0" comfort values on some review pages, but that may be paywall/"insider" masking. No changelog text confirming removal was found. Check this manually on a current review before claiming it either way.

### Stability
- A subjective evaluation of whether the design keeps a stable fit during low- and high-intensity activities. Features that aid fit (wings, hooks) are also considered. (https://rtings.com/headphones/tests/design/stability)
- Scoring: 6–7.5 means stable for casual use (walking, tilting, swaying). Above 7.5 means it stays in place during running and jumping. (same)

### Neutral Sound / Sound Profile
- RTINGS reintroduced a "Neutral Sound" usage with no components except sound (Bass, Mid and Treble boxes). It renamed sub-scores to Bass/Mid/Treble Accuracy and added Bass/Treble Amount. The "Sound Profile" box describes the signature. (https://www.rtings.com/headphones/tests/changelogs/1-3 ; https://rtings.com/headphones/tests/changelogs/1-8)
- **Limits:** the target "approximates a sound most people will find balanced… not the absolute measure of good sound quality". The target resembles Harman's. (https://rtings.com/headphones/tests/changelogs/1-8) Community discussion notes that some top-scoring "Neutral Sound" headphones are not tonally neutral but score well on Passive Soundstage, which led to re-weighting debates. (https://rtings.com/discussions/CaxdEVilDH8B0pV2/re-weighting-the-neutral-sound-score ; https://rtings.com/discussions/thDO4H1Bd5tsSGhp/re-weighting-the-neutral-sound-score-again) Measurements are on one HATS and do not capture individual ear/HRTF or fit variation. That last point is my inference, consistent with §7.

---

## 2. SoundGuys methodology
- **Rig:** Brüel & Kjær 5128 HATS with a B&K 1704C-102 conditioning amp, an audio interface, and SoundCheck software. The ear canal is an average of MRI scans of 40 people. (https://www.soundguys.com/how-we-test/)
- **ANC / isolation:** after finding the best fit during sound tests, they play shaped pink noise three times: ANC on full, ANC off (passive isolation), and headphones removed (reference). The results give ANC effect, isolation, and total attenuation. A poor seal "dramatically" reduces performance. (https://www.soundguys.com/how-we-test/ ; https://www.soundguys.com/best-noise-cancelling-wireless-earbuds-27207/)
- **ANC score:** converted to an average perceived loudness reduction. 0 means no cancellation and 10 means perfect. (https://www.soundguys.com/how-we-score/)
- **Battery:** real music peaking at **75 dB(SPL)**, **ANC on** where available, continuous playback, level-matched across products. (https://www.soundguys.com/how-we-test/ ; https://www.soundguys.com/headphones-battery-life-compared-to-price-139341/)
- **Mic samples:** recorded on the HATS. A calibrated artificial mouth plays Harvard sentences in ideal conditions, office, street, wind and reverberant space. (https://www.soundguys.com/how-we-test/ ; https://www.soundguys.com/bose-quietcomfort-ultra-earbuds-2nd-gen-microphone-performance-140990/)
- **Mic rating:** a reader poll under each sample on a **1–5 Mean Opinion Score**, labelled Awful/Bad/Okay/Good/Excellent(Perfect). It is "extremely-loosely based" on ITU-R BS.1116-3. The headphone mic score follows reader ratings. (https://www.soundguys.com/how-we-score/ ; e.g. https://www.soundguys.com/soundcore-liberty-5-microphone-139379/)
- **Bone conduction:** a standard HATS cannot excite bone-conduction or VPU pickups, so those earbuds fell back to air mics "to mixed results". Manufacturers complained, and SoundGuys built a printed glass-filled nylon fixture to transmit vibration. (https://www.soundguys.com/bone-conduction-microphones-testing-change-152866/)

---

## 3. Manufacturer battery claims
- SoundGuys tested hundreds of products and found manufacturers "typically fall within 10%" of SoundGuys' results. Test conditions differ, though: some brands rate with ANC off, and some at 50% volume, while SoundGuys tests ANC on and level-matches to a fixed output. (https://www.soundguys.com/headphones-battery-life-compared-to-price-139341/)
- Higher-bitrate codecs (e.g. aptX Adaptive) use somewhat more power than SBC, and rated figures typically use moderate volume, ANC off and a default codec. (https://www.ac3filter.net/earbud-battery-life-real-world/ , a secondary blog, low reliability) **[unverified, secondary]**
- An Indian retailer blog tested 8 pairs and found all came in 11–38% below the box figure. (https://mobile-accessories.in/blog/tws-earbuds-battery-life-claims-vs-reality-india-we-tested-8-pairs-(2026)) **[low-reliability source]**
- **No industry standard** for earbud battery-claim conditions was found: NOT FOUND. The recommendation is to use one lab's numbers, such as RTINGS or SoundGuys, consistently across all products.

---

## 4. IP ratings (IEC 60529)
- The IP code is defined in IEC 60529. It rates protection against intrusion, dust and water. (https://en.wikipedia.org/wiki/IP_code)
- **First digit (0–6), solids:** 4 = protected against objects >1 mm. 5 = **dust-protected** (some ingress is allowed if it doesn't interfere with operation). 6 = dust-tight. **X** = not tested or rated for that category. (https://en.wikipedia.org/wiki/IP_code)
- **Second digit (0–9K), water:** 4 = splashing from any direction. 5 = low-pressure water jets (6.3 mm nozzle, 12.5 L/min). 7 = **immersion up to 1 m** (temporary, 30 min). 8 = beyond IPX7 as specified by the manufacturer. (https://en.wikipedia.org/wiki/IP_code ; https://headphonesaddict.com/ip-rating-explained/)
- So **IPX4** = splash, dust untested. **IP54** = dust-protected plus splash. **IP55** = dust-protected plus low-pressure jets. **IP57** = dust-protected plus 1 m immersion. **IPX7** = 1 m immersion, dust untested.
- Apple's ratings: AirPods Pro 1 = IPX4. AirPods Pro 2 (USB-C) and AirPods 4 = IP54. **AirPods Pro 3 and its case = IP57.** Apple says the earbuds are "not waterproof or sweatproof", and "sweat, water, and dust resistance aren't permanent conditions and can diminish over time". (https://support.apple.com/en-us/105046 ; https://support.apple.com/en-us/125135)
- Samsung: Galaxy Buds3 / Buds3 Pro are IP57, rated for **fresh water** up to 1 m for 30 minutes. That does not cover salt water, chlorinated or pool water. The charging case is not water resistant. Samsung says they are not for swimming or showering. (https://www.samsung.com/ae/support/mobile-devices/galaxy-buds3-and-buds3-pro-durability-with-ip57-water-and-dust-protection/)
- **Sweat vs fresh water:** IEC 60529 tests use water. Apple separately says the buds are not "sweatproof" (above). A primary IEC statement that tests use fresh water only was NOT FOUND, but Samsung's fresh-water wording supports it.
- **Warranty:** Apple's one-year limited warranty does not cover liquid damage. This comes from secondary sites (https://www.igeeksblog.com/fix-dropped-airpods-in-water/ ; https://ispace.am/blog/en/airpods-pro-are-they-waterproof-or-not/). **[secondary; the primary Apple warranty text was not retrieved]** Other brands' warranty treatment: NOT FOUND.

---

## 5. Transparency / ambient modes, safety, safe listening
- **Sony** WF-1000XM5 Help Guide: "Depending on the ambient conditions and the type/volume of audio playback, ambient sounds may not be heard even when using the Ambient Sound Mode. Do not use the headset in places where it would be dangerous if you are unable to hear ambient sounds." (https://helpguide.sony.net/mdr/2963/v1/en/contents/TP1000779809.html, exact page within the helpguide.sony.net/mdr/2963 set [unverified])
- **Bose** owner's guides: use while operating a vehicle "is not recommended and may be prohibited by law". Stop if the earbuds interfere with hearing "surrounding sounds, including alarms and warning signals". (https://assets.bosecreative.com/m/157ea573fd945c2e/original/885502_OG_QCUE-HEADPHONEIN_en.pdf , QC Ultra Earbuds 1st-gen guide; the 2nd-gen guide was not retrieved)
- **Apple:** using AirPods "may distract you or impact your awareness of your surroundings". It says to "always remain aware of your environment", obey laws on headphone use while driving or cycling, and stop using features that are distracting. Background noise can make sounds seem quieter than they are. (https://support.apple.com/guide/airpods/important-safety-and-handling-information-dev4744b22af/web)
- **Research:**
  - A 2025 Audiology Research study (*Sound Localization with Hearables in Transparency Mode*) found localization accuracy fell from **91.5% to 68.9%** in transparency mode. Transparency mode changed level differences by up to 8 dB and eliminated spectral cues above 5 kHz, which increased errors, especially for elevation and in noise. (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12101201/ ; doi:10.3390/audiolres15030048)
  - A VR street-crossing study found personal listening devices impair auditory situation awareness. (https://www.researchgate.net/publication/363896693 ; NC A&T report https://www.ncat.edu/cobe/transportation-institute/catm/catm-documents/5-catm-finalreport-pedestriansituationawareness.pdf)
  - An older hear-through localization evaluation: https://www.researchgate.net/publication/266655462_Evaluation_of_hear-through_sound_localization
- **Hearing safety (WHO):**
  - The WHO–ITU **H.870** standard "Safe listening devices and systems" (2019; first published by ITU in Aug 2018 per secondary source) sets the adult reference at **80 dB(A) for 40 h/week** and children at **75 dB(A) for 40 h/week**. It asks for exposure tracking, warnings and volume limiting. (https://www.who.int/publications-detail/safe-listening-devices-and-systems-a-who-itu-standard ; https://hearingreview.com/hearing-loss/hearing-loss-prevention/risk-factors/standards-for-safe-listening-past-present-and-future)
  - More than 1 billion people aged 12–35 are at risk from recreational loud sound. An example of unsafe exposure: 85 dB for 8 h, or 100 dB for 15 min. (https://www.who.int/activities/making-listening-safe ; https://www.who.int/news/item/02-03-2022-who-releases-new-standard-to-tackle-rising-threat-of-hearing-loss)
  - The WHO 2022 venues standard caps the average at 100 dB. (same 2022 news item)

---

## 6. Multipoint vs Apple automatic switching; LE Audio / Auracast
- **Multipoint:** a single headset keeps simultaneous connections to two (sometimes three) source devices. Audio usually plays from one at a time, and calls take priority. (https://www.soundguys.com/bluetooth-multipitoint-explained-28601/ ; https://bose.com/stories/bluetooth-multipoint ; https://www.whathifi.com/advice/what-is-bluetooth-multipoint-what-devices-support-it)
- Whether multipoint is a formal Bluetooth SIG specification feature or vendor-implemented: NOT FOUND (search budget exhausted).
- **Apple automatic switching:** it is not standard multipoint. It requires Apple devices signed into the **same Apple Account** with two-factor authentication and current OS versions. AirPods then switch automatically between those devices, e.g. Mac music to iPhone podcast, or a call answered on Watch. iCloud also auto-sets up AirPods across devices on that account. It is only available on supported AirPods models. (https://support.apple.com/en-us/104988 ; https://support.apple.com/guide/airpods/switch-airpods-between-apple-devices-dev228ba3df8/web)
- **Implication (inference):** with non-Apple sources such as Windows or Android, AirPods behave as a normal single-connection Bluetooth headset. Score multipoint and ecosystem switching separately.
- **LE Audio:** the next-generation Bluetooth audio standard. It adds the **LC3** codec, hearing-aid support and **Auracast** broadcast. In listening tests LC3 beat SBC at the same bit rate, and matched or slightly beat SBC at under half the bit rate. (https://www.bluetooth.com/blog/le-audio-auracast-broadcast-audio-and-the-future-of-bluetooth-audio/ ; https://www.bluetooth.com/blog/a-technical-overview-of-lc3/)
- **Auracast:** one transmitter can broadcast to an unlimited number of receivers without pairing, e.g. in venues, and receivers control their own volume. (https://www.bluetooth.com/wp-content/uploads/2024/05/2403_Auracast_Overview.pdf ; https://www.bluetooth.com/media/le-audio/le-audio-faqs/)
- **Relevance:** only usable when both the source and the earbuds support LE Audio. Which of the listed earbuds support it was not researched here.

---

## 7. Comfort: individual variation and objective proxies
- A population-based MRI study found **strong individual variation** in external auditory canal morphology, with sex differences: women's canals are narrower and lower. (https://www.sciencedirect.com/science/article/pii/S0940960224001110)
- Song et al. 2020, *Applied Sciences* 10:8890: ear-canal pain and fixation correlated with specific ear dimensions (canal–incisura intertragica length, etc.). Kernel (in-canal) types put more pressure on the canal than open types. The paper suggests an earhole contact size of about 0.6–0.7 cm. (https://doi.org/10.3390/app10248890)
- A 3D-anthropometry study (*Applied Ergonomics*) found ear-dimension correlations with comfort perception weak or insignificant. **Use condition and product size** had significant effects. (https://www.sciencedirect.com/science/article/abs/pii/S0003687021002878)
- **Objective proxies:** bud weight in grams and dimensions from spec sheets or RTINGS measurements (RTINGS measures weight objectively, §1). **Limits:** the studies above show fit depends on the product–ear interaction, so weight and size alone do not predict comfort for a given person. The "~15% of people need asymmetric sizing" figure comes from a non-authoritative blog (https://audiochamps.com/why-does-my-earbud-fit-in-my-left-ear-but-not-my-right/) **[do not cite]**.

---

## 8. Earbud microphone evaluation: lab vs real calls
- Bone-conduction / voice-pickup (VPU) sensors detect voice through skull vibration and pick up less ambient noise. One study reports about 15 dB SNR advantage over air-conduction mics. They are used for voice-activity detection to drive beamforming and noise suppression. (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7571026/ ; https://arxiv.org/pdf/2309.02393)
- **Lab rigs can't excite these sensors.** Standard HATS cannot vibrate the head like a human skull, so bone-conduction earbuds fall back to air mics in lab tests and sound worse than in real calls. Manufacturers pushed back, and SoundGuys built a vibration fixture in response. (https://www.soundguys.com/bone-conduction-microphones-testing-change-152866/)
- **RTINGS acknowledges the same issue:** on the Galaxy Buds4 Pro, on-board noise suppression isn't active on the rig, so the score understates the mic. (https://www.rtings.com/headphones/reviews/samsung/galaxy-buds4-pro)
- **Other confounds:** phone or OS call processing, the network/VoIP codec, and wind. Lab "wind" tests use fans, whose airflow differs from gusty natural wind. (https://www.anclab.pro/blog/headphone-comparisons-performance-tests/wind-defying-mic-test-outdoor-call-quality , a low-reliability blog [unverified]) SoundGuys includes an artificial-wind condition (§2).
- **Recommendation (inference):** treat mic scores as low-confidence, prefer listener-rated samples (SoundGuys MOS), and note rig limitations per product.

---

## 9. Pareto dominance / frontier definitions
- **Britannica:** "A state of affairs is Pareto-optimal (or Pareto-efficient) if and only if there is no alternative state that would make some people better off without making anyone worse off." (https://www.britannica.com/money/Pareto-optimality)
- **Wikipedia, Pareto front:** the Pareto front is the set of all Pareto-efficient solutions. Solution A **dominates** B if A is no worse than B in every objective and strictly better in at least one. The front excludes all dominated solutions. (https://en.wikipedia.org/wiki/Pareto_front)
- **For the earbud comparison:** objectives are, for example, price (minimize), attenuation, battery and mic score (maximize). Earbud A dominates B if it is at least as good on every criterion and strictly better on one, and the frontier is the set of non-dominated earbuds. A textbook citation (e.g. Miettinen, *Nonlinear Multiobjective Optimization*, 1999, or Deb 2001) was NOT retrieved.

---

## Open items / NOT FOUND summary
- RTINGS TB 2.0 release date; whether Comfort was removed; mic units/metrics in TB 2.x; exact battery-test volume and ANC policy (conflicting snippets); noise-isolation band edges and tip/fit policy.
- An industry standard for battery-claim test conditions.
- A primary IEC statement on fresh vs salt water; primary Apple warranty liquid-damage text.
- Whether multipoint is part of the Bluetooth SIG spec.
- A textbook source for Pareto dominance.
