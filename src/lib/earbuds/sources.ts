import type { Source } from "./types";

/**
 * Citation registry. Every product value and note references ids from here.
 * All sources consulted 1 Oct 2026 via search-engine renderings (direct page
 * loads were blocked by the build environment's network policy — see
 * docs/earbuds-pareto/RESEARCH_BRIEF.md §0).
 */
const A = "2026-10-01";

const list: Source[] = [
  // ── Methodology, standards, safety ────────────────────────────────────────
  { id: "sg-how-test", publisher: "SoundGuys", title: "How we test", url: "https://www.soundguys.com/how-we-test/", kind: "lab", accessed: A },
  { id: "sg-how-score", publisher: "SoundGuys", title: "How we score", url: "https://www.soundguys.com/how-we-score/", kind: "lab", accessed: A },
  { id: "sg-battery-claims", publisher: "SoundGuys", title: "Headphone battery life compared to price", url: "https://www.soundguys.com/headphones-battery-life-compared-to-price-139341/", kind: "lab", accessed: A },
  { id: "sg-bone-mics", publisher: "SoundGuys", title: "Bone conduction microphones testing change", url: "https://www.soundguys.com/bone-conduction-microphones-testing-change-152866/", kind: "lab", accessed: A },
  { id: "rt-isolation", publisher: "RTINGS", title: "Noise isolation test (passive & active)", url: "https://www.rtings.com/headphones/tests/noise-isolation-cancellation-passive-active", kind: "lab", accessed: A },
  { id: "rt-battery", publisher: "RTINGS", title: "Battery life test", url: "https://www.rtings.com/headphones/tests/active-features/battery-life", kind: "lab", accessed: A },
  { id: "rt-stability", publisher: "RTINGS", title: "Stability test", url: "https://rtings.com/headphones/tests/design/stability", kind: "lab", accessed: A },
  { id: "rt-mic", publisher: "RTINGS", title: "Microphone test", url: "https://www.rtings.com/headphones/tests/microphone", kind: "lab", accessed: A },
  { id: "rt-versioning", publisher: "RTINGS", title: "Versioned test benches", url: "https://www.rtings.com/company/versioned-test-benches", kind: "lab", accessed: A },
  { id: "rt-neutral", publisher: "RTINGS", title: "Test bench 1.8 changelog (Neutral Sound target)", url: "https://rtings.com/headphones/tests/changelogs/1-8", kind: "lab", accessed: A },
  { id: "ip-code", publisher: "Wikipedia", title: "IP code (IEC 60529 summary)", url: "https://en.wikipedia.org/wiki/IP_code", kind: "standard", accessed: A },
  { id: "apple-water", publisher: "Apple Support", title: "About sweat and water resistance of AirPods", url: "https://support.apple.com/en-us/105046", kind: "manufacturer", accessed: A },
  { id: "samsung-ip57", publisher: "Samsung", title: "Galaxy Buds3 / Buds3 Pro durability with IP57", url: "https://www.samsung.com/ae/support/mobile-devices/galaxy-buds3-and-buds3-pro-durability-with-ip57-water-and-dust-protection/", kind: "manufacturer", accessed: A },
  { id: "apple-safety", publisher: "Apple Support", title: "AirPods: important safety and handling information", url: "https://support.apple.com/guide/airpods/important-safety-and-handling-information-dev4744b22af/web", kind: "manufacturer", accessed: A },
  { id: "sony-ambient-warning", publisher: "Sony Help Guide", title: "WF-1000XM5 Help Guide — Ambient Sound Mode precautions", url: "https://helpguide.sony.net/mdr/2963/v1/en/contents/TP1000779809.html", kind: "manufacturer", accessed: A },
  { id: "bose-guide-warning", publisher: "Bose", title: "QuietComfort Ultra Earbuds owner's guide — safety", url: "https://assets.bosecreative.com/m/157ea573fd945c2e/original/885502_OG_QCUE-HEADPHONEIN_en.pdf", kind: "manufacturer", accessed: A },
  { id: "transparency-study", publisher: "Audiology Research (MDPI)", title: "Sound Localization with Hearables in Transparency Mode", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12101201/", kind: "research", published: "2025", accessed: A },
  { id: "who-h870", publisher: "WHO–ITU", title: "Safe listening devices and systems (H.870)", url: "https://www.who.int/publications-detail/safe-listening-devices-and-systems-a-who-itu-standard", kind: "standard", published: "2019", accessed: A },
  { id: "multipoint-explained", publisher: "SoundGuys", title: "Bluetooth multipoint explained", url: "https://www.soundguys.com/bluetooth-multipitoint-explained-28601/", kind: "review", accessed: A },
  { id: "apple-switching", publisher: "Apple Support", title: "Switch AirPods between devices automatically", url: "https://support.apple.com/en-us/104988", kind: "manufacturer", accessed: A },
  { id: "comfort-ergonomics", publisher: "Applied Ergonomics", title: "3D anthropometry and earphone comfort perception", url: "https://www.sciencedirect.com/science/article/abs/pii/S0003687021002878", kind: "research", accessed: A },
  { id: "comfort-song2020", publisher: "Applied Sciences", title: "Song et al. 2020 — ear dimensions and earphone comfort", url: "https://doi.org/10.3390/app10248890", kind: "research", published: "2020", accessed: A },
  { id: "ear-mri", publisher: "Annals of Anatomy", title: "Population-based MRI study of external auditory canal morphology", url: "https://www.sciencedirect.com/science/article/pii/S0940960224001110", kind: "research", accessed: A },
  { id: "pareto-front", publisher: "Wikipedia", title: "Pareto front", url: "https://en.wikipedia.org/wiki/Pareto_front", kind: "research", accessed: A },
  { id: "pareto-britannica", publisher: "Britannica", title: "Pareto optimality", url: "https://www.britannica.com/money/Pareto-optimality", kind: "research", accessed: A },

  // ── Apple AirPods Pro 3 ───────────────────────────────────────────────────
  { id: "apple-app3-specs", publisher: "Apple", title: "AirPods Pro 3 — Technical specifications", url: "https://www.apple.com/uk/airpods-pro/specs", kind: "manufacturer", accessed: A },
  { id: "apple-controls", publisher: "Apple Support", title: "Use controls and gestures with your AirPods", url: "https://support.apple.com/guide/airpods/devb2c431317", kind: "manufacturer", accessed: A },
  { id: "whf-app3-price", publisher: "What Hi-Fi?", title: "6 key things about the new AirPods Pro 3 — starting with their price", url: "https://www.whathifi.com/headphones/wireless-earbuds/6-key-things-that-im-hyped-about-the-new-airpods-pro-3-starting-with-their-price", kind: "news", published: "2025-09", accessed: A },
  { id: "sg-app3-news", publisher: "SoundGuys", title: "Apple AirPods Pro 3: everything you need to know", url: "https://www.soundguys.com/apple-airpods-pro-3-96353/", kind: "news", accessed: A },
  { id: "sg-app3-anc", publisher: "SoundGuys", title: "The AirPods Pro 3 have the best noise canceling of any earbuds", url: "https://www.soundguys.com/the-airpods-pro-3-have-the-best-noise-canceling-of-any-earbuds-145227/", kind: "lab", accessed: A },
  { id: "sg-app3", publisher: "SoundGuys", title: "Apple AirPods Pro 3 — scores", url: "https://www.soundguys.com/product/apple-airpods-pro-3rd-gen/", kind: "lab", accessed: A },
  { id: "rt-app3", publisher: "RTINGS", title: "Apple AirPods Pro 3 review", url: "https://www.rtings.com/headphones/reviews/apple/airpods-pro-3", kind: "lab", accessed: A },
  { id: "rt-app-vs-app3", publisher: "RTINGS", title: "AirPods Pro vs AirPods Pro 3", url: "https://www.rtings.com/headphones/tools/compare/apple-airpods-pro-apple-airpods-pro-3/1625/113044", kind: "lab", accessed: A },
  { id: "rt-ap4-vs-app3", publisher: "RTINGS", title: "AirPods 4 (ANC) vs AirPods Pro 3", url: "https://www.rtings.com/headphones/tools/compare/apple-airpods-4-with-active-noise-cancellation-vs-apple-airpods-pro-3/78189/113044", kind: "lab", accessed: A },
  { id: "tg-app3", publisher: "Tom's Guide", title: "AirPods Pro 3 review", url: "https://www.tomsguide.com/audio/airpods/airpods-pro-3-review", kind: "review", accessed: A },
  { id: "ts2-compare", publisher: "TS2 Tech", title: "AirPods Pro 3 vs Pixel Buds Pro 2 vs Galaxy Buds3 Pro", url: "https://ts2.tech/en/battle-of-the-earbud-titans-airpods-pro-3-vs-pixel-buds-pro-2-vs-galaxy-buds3-pro/", kind: "review", accessed: A },

  // ── Apple AirPods 5 ───────────────────────────────────────────────────────
  { id: "apple-ap5-news", publisher: "Apple Newsroom", title: "Apple introduces AirPods 5 with best-in-class open-ear ANC", url: "https://www.apple.com/newsroom/2026/09/apple-introduces-airpods-5-with-best-in-class-open-ear-active-noise-cancellation/", kind: "manufacturer", published: "2026-09-09", accessed: A },
  { id: "apple-ap5-specs", publisher: "Apple", title: "AirPods 5 — Technical specifications", url: "https://www.apple.com/au/airpods-5/specs/", kind: "manufacturer", accessed: A },
  { id: "apple-modes", publisher: "Apple Support", title: "Switch between listening modes on AirPods", url: "https://support.apple.com/en-ae/guide/airpods/dev9812f5cc3", kind: "manufacturer", accessed: A },
  { id: "ecoustics-ap5", publisher: "eCoustics", title: "Apple AirPods 5", url: "https://www.ecoustics.com/products/apple-airpods-5/", kind: "news", published: "2026-09", accessed: A },
  { id: "sg-ap5", publisher: "SoundGuys", title: "Apple AirPods 5 review", url: "https://www.soundguys.com/apple-airpods-5-review-163483/", kind: "lab", published: "2026-09", accessed: A },
  { id: "rt-pipeline", publisher: "RTINGS", title: "Review pipeline (AirPods 5 listed as being tested)", url: "https://www.rtings.com/review-pipeline/headphones~speaker", kind: "lab", accessed: A },

  // ── Beats Powerbeats Pro 2 ────────────────────────────────────────────────
  { id: "cc-pbp2", publisher: "ComputerCity", title: "Powerbeats Pro generations (launch Feb 11 2025, $249.99)", url: "https://computercity.com/hardware/earbuds-and-headphones/powerbeats-pro-generations", kind: "news", accessed: A },
  { id: "utah-pbp2", publisher: "University of Utah Campus Store", title: "Beats Powerbeats Pro 2 — specifications", url: "https://www.store.utah.edu/Beats-Powerbeats-Pro-2", kind: "retailer", accessed: A },
  { id: "hc-pbp2", publisher: "Headphonecheck", title: "Beats Powerbeats Pro 2 test", url: "https://www.headphonecheck.com/test/beats-powerbeats-pro-2/", kind: "review", accessed: A },
  { id: "rt-pbp2", publisher: "RTINGS", title: "Beats Powerbeats Pro 2 review", url: "https://www.rtings.com/headphones/reviews/beats/powerbeats-pro-2", kind: "lab", accessed: A },
  { id: "sg-app3-vs-pbp2", publisher: "SoundGuys", title: "AirPods Pro 3 vs Powerbeats Pro 2", url: "https://www.soundguys.com/apple-airpods-pro-3-vs-beats-powerbeats-pro-2-146367/", kind: "lab", accessed: A },
  { id: "sg-pbp2", publisher: "SoundGuys", title: "Beats Powerbeats Pro 2 — scores", url: "https://www.soundguys.com/product/beats-powerbeats-pro-2/", kind: "lab", accessed: A },
  { id: "tgl-pbp2", publisher: "TechGearLab", title: "Beats Powerbeats Pro 2 review", url: "https://www.techgearlab.com/reviews/audio/wireless-earbuds/beats-powerbeats-pro-2", kind: "review", accessed: A },
  { id: "hh-pbp2", publisher: "HotHardware", title: "Powerbeats Pro 2 review: feature-rich for iPhone, not Android", url: "https://hothardware.com/reviews/beats-powerbeats-pro-2-review", kind: "review", accessed: A },
  { id: "hifide-beats", publisher: "hifi.de", title: "Alle Beats-Kopfhörer 2026", url: "https://hifi.de/beste/alle-beats-kopfhoerer-2026-ist-das-wirklich-die-beste-apple-alternative-auf-dem-markt-76022", kind: "review", published: "2026", accessed: A },
  { id: "techtimes-pbp2", publisher: "Tech Times", title: "Powerbeats Pro 2 drops to $199.95 at Amazon", url: "https://www.techtimes.com/articles/328018/20260924/beats-powerbeats-pro-2-drops-19995-amazon-50-off-workout-earbuds-heart-rate-tracking.htm", kind: "news", published: "2026-09-24", accessed: A },

  // ── Google Pixel Buds Pro 2 ───────────────────────────────────────────────
  { id: "google-pbp2-specs", publisher: "Google (press kit)", title: "Pixel Buds Pro 2 tech specs (PDF)", url: "https://cdn.uc.assets.prezly.com/6945f60c-5091-4888-b324-356c4d33e737/-/inline/no/Pixel%20Buds%20Pro%202%20Tech%20Specs.pdf", kind: "manufacturer", accessed: A },
  { id: "google-pbp2-store", publisher: "Google Store", title: "Pixel Buds Pro 2", url: "https://store.google.com/ie/product/pixel_buds_pro_2", kind: "manufacturer", accessed: A },
  { id: "aa-pbp2-qi", publisher: "Android Authority", title: "Pixel Buds Pro 2 wireless charging", url: "https://androidauthority.com/google-pixel-buds-pro-2-wireless-charging-3471809", kind: "news", accessed: A },
  { id: "9to5-mbg2026", publisher: "9to5Google", title: "Made by Google 2026 announcements", url: "https://9to5google.com/2026/08/12/made-by-google-2026-announcements/", kind: "news", published: "2026-08-12", accessed: A },
  { id: "sg-pbp2-review", publisher: "SoundGuys", title: "Google Pixel Buds Pro 2 review", url: "https://soundguys.com/google-pixel-buds-pro-2-review-124563", kind: "lab", accessed: A },
  { id: "sg-pbp2g", publisher: "SoundGuys", title: "Google Pixel Buds Pro 2 — scores", url: "https://www.soundguys.com/product/google-pixel-buds-pro-2/", kind: "lab", accessed: A },
  { id: "rt-pixel", publisher: "RTINGS", title: "Google Pixel Buds Pro 2 review", url: "https://www.rtings.com/headphones/reviews/google/pixel-buds-pro-2-truly-wireless", kind: "lab", accessed: A },
  { id: "ob-pixel", publisher: "Outlook Business", title: "Google Pixel Buds Pro 2 review", url: "https://www.outlookbusiness.com/deeptech/tech/google-pixel-buds-pro-2-review-the-excellent-fit-sound-quality-makes-these-the-best-wireless-earbuds-of-2024", kind: "review", published: "2024", accessed: A },
  { id: "pocketlint-pixel", publisher: "Pocket-lint", title: "Pixel Buds Pro 2 review", url: "https://www.pocket-lint.com/pixel-buds-pro-2-review/", kind: "review", accessed: A },

  // ── Sony WF-1000XM6 ───────────────────────────────────────────────────────
  { id: "prn-xm6", publisher: "Sony Electronics (PR Newswire)", title: "Sony launches WF-1000XM6", url: "https://www.prnewswire.com/news-releases/sony-electronics-launches-wf-1000xm6-truly-wireless-earbuds--the-best-noise-canceling1-with-premium-sound-302685878.html", kind: "manufacturer", published: "2026-02-12", accessed: A },
  { id: "sony-xm6-specs", publisher: "Sony UK", title: "WF-1000XM6 specifications", url: "https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications", kind: "manufacturer", accessed: A },
  { id: "sony-xm6-mea", publisher: "Sony MEA", title: "WF-1000XM6 specifications", url: "https://www.sony-mea.com/en/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm6/specifications", kind: "manufacturer", accessed: A },
  { id: "sony-xm6-press", publisher: "Sony Europe", title: "Sony launches WF-1000XM6 (press centre)", url: "https://www.sony.eu/presscentre/sony-launches-wf-1000xm6-truly-wireless-earbuds-the-best-noise-cancelling-with-premium-sound", kind: "manufacturer", published: "2026-02", accessed: A },
  { id: "sony-xm6-touch", publisher: "Sony Help Guide", title: "WF-1000XM6 — About the touch sensor", url: "https://helpguide.sony.net/mdr/2985/v1/en/contents/F013_About_the_touch_sensor.html", kind: "manufacturer", accessed: A },
  { id: "ss-xm6-multipoint", publisher: "ShopSavvy", title: "Sony WF-1000XM6 multipoint Bluetooth", url: "https://shopsavvy.com/answers/sony-wf-1000xm6-multipoint-bluetooth", kind: "retailer", accessed: A },
  { id: "rt-xm6", publisher: "RTINGS", title: "Sony WF-1000XM6 review", url: "https://www.rtings.com/headphones/reviews/sony/wf-1000xm6", kind: "lab", accessed: A },
  { id: "rt-bose-vs-xm6", publisher: "RTINGS", title: "Bose QC Ultra Earbuds (2nd Gen) vs Sony WF-1000XM6", url: "https://www.rtings.com/headphones/tools/compare/bose-quietcomfort-ultra-earbuds-2nd-gen-vs-sony-wf-1000xm6/103244/104419", kind: "lab", accessed: A },
  { id: "sg-xm6-review", publisher: "SoundGuys", title: "Sony WF-1000XM6 review", url: "https://www.soundguys.com/sony-wf-1000xm6-review-152013/", kind: "lab", published: "2026", accessed: A },
  { id: "sg-xm6", publisher: "SoundGuys", title: "Sony WF-1000XM6 — scores", url: "https://www.soundguys.com/product/sony-wf-1000xm6/", kind: "lab", accessed: A },
  { id: "whf-xm6", publisher: "What Hi-Fi?", title: "Sony WF-1000XM6 review", url: "https://www.whathifi.com/headphones/wireless-earbuds/sony-wf-1000xm6", kind: "review", published: "2026", accessed: A },
  { id: "tr-xm6", publisher: "TechRadar", title: "Sony WF-1000XM6 review", url: "https://www.techradar.com/audio/earbuds-airpods/sony-wf-1000xm6-review", kind: "review", published: "2026", accessed: A },

  // ── Sony WF-1000XM5 ───────────────────────────────────────────────────────
  { id: "aa-xm5", publisher: "Android Authority", title: "Sony WF-1000XM5 announced", url: "https://androidauthority.com/sony-wf-1000xm5-3235457", kind: "news", published: "2023-07-24", accessed: A },
  { id: "sony-xm5-specs", publisher: "Sony UK", title: "WF-1000XM5 specifications", url: "https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-1000xm5/specifications", kind: "manufacturer", accessed: A },
  { id: "sony-xm5-start", publisher: "Sony Ireland", title: "Get started with your WF-1000XM5 (multipoint)", url: "https://www.sony.ie/electronics/get-started-with-your-wf-1000xm5", kind: "manufacturer", accessed: A },
  { id: "sony-xm5-touch", publisher: "Sony Philippines", title: "WF-1000XM5 features — touch controls", url: "https://www.sony.com.ph/headphones/products/wf-1000xm5/features7", kind: "manufacturer", accessed: A },
  { id: "rt-xm5", publisher: "RTINGS", title: "Sony WF-1000XM5 review", url: "https://www.rtings.com/headphones/reviews/sony/wf-1000xm5-truly-wireless", kind: "lab", accessed: A },
  { id: "sg-xm5", publisher: "SoundGuys", title: "Sony WF-1000XM5 — scores", url: "https://www.soundguys.com/product/sony-wf-1000xm5/", kind: "lab", accessed: A },
  { id: "whf-xm5", publisher: "What Hi-Fi?", title: "Sony WF-1000XM5 review", url: "https://www.whathifi.com/advice/sony-wf-1000xm5-release-date-rumours-potential-price-features-and-spec-leaks", kind: "review", accessed: A },
  { id: "whf-xm5-discount", publisher: "What Hi-Fi?", title: "Their five-star predecessors are now at their lowest-ever price", url: "https://www.whathifi.com/headphones/wireless-earbuds/sony-xm6-earbuds-too-expensive-their-five-star-predecessors-are-now-at-their-lowest-ever-price", kind: "news", published: "2026", accessed: A },
  { id: "ifixit-xm5", publisher: "iFixit", title: "Sony just nerfed their most repairable earbud line", url: "https://ifixit.com/News/79140/sony-just-nerfed-their-most-repairable-earbud-line", kind: "review", accessed: A },

  // ── Sony LinkBuds Fit ─────────────────────────────────────────────────────
  { id: "soya-lbf", publisher: "SoyaCincau", title: "Sony launches three new LinkBuds devices", url: "https://soyacincau.com/2024/10/06/sony-launches-three-new-linkbuds-devices-pre-orders-start-november-2024/", kind: "news", published: "2024-10-06", accessed: A },
  { id: "sony-lbf-specs", publisher: "Sony UK", title: "WF-LS910N (LinkBuds Fit) specifications", url: "https://www.sony.co.uk/electronics/support/wireless-headphones-bluetooth-headphones/wf-ls910n/specifications", kind: "manufacturer", accessed: A },
  { id: "coolblue-lbf", publisher: "Coolblue", title: "Sony LinkBuds Fit — specifications", url: "https://coolblue.nl/en/product/954552/sony-linkbuds-fit-black.html", kind: "retailer", accessed: A },
  { id: "sg-lbf", publisher: "SoundGuys", title: "Sony LinkBuds Fit review", url: "https://soundguys.com/sony-linkbuds-fit-review-127506", kind: "lab", accessed: A },
  { id: "galaxus-lbf", publisher: "Galaxus", title: "Sony LinkBuds Fit review: comfiest earphones ever", url: "https://www.galaxus.ch/en/page/sony-linkbuds-fit-review-comfiest-earphones-ever-35650", kind: "review", accessed: A },
  { id: "cr-lbf", publisher: "Consumer Reports", title: "Sony LinkBuds Fit", url: "https://www.consumerreports.org/electronics-computers/headphones/sony-linkbuds-fit/m415796/", kind: "review", accessed: A },

  // ── Bose QC Ultra Earbuds (2nd Gen) ───────────────────────────────────────
  { id: "bose-qcue2-press", publisher: "Bose", title: "Bose announces the QuietComfort Ultra Earbuds (2nd Gen)", url: "https://www.bose.com/pressroom/bose-announces-the-quietcomfort-ultra-earbuds-2nd-gen", kind: "manufacturer", published: "2025-06-12", accessed: A },
  { id: "bose-qcue2-specs", publisher: "Bose Support", title: "QuietComfort Ultra Earbuds (2nd Gen) specifications", url: "https://support.bose.co.uk/article/quietcomfort-ultra-earbuds-gen-2-specifications", kind: "manufacturer", accessed: A },
  { id: "ss-qcue2-controls", publisher: "ShopSavvy", title: "How do the touch controls work on the QC Ultra Earbuds 2nd Gen?", url: "https://shopsavvy.com/answers/how-to-use-touch-controls", kind: "retailer", accessed: A },
  { id: "ws-qcue2", publisher: "Worldshop", title: "Bose QC Ultra Earbuds (2nd Gen) listing", url: "https://www.worldshop.eu/en/bose-quietcomfort-ultra-earbuds-2nd-gen-in-ear-headphones-black-1775395", kind: "retailer", accessed: A },
  { id: "rt-qcue2", publisher: "RTINGS", title: "Bose QuietComfort Ultra Earbuds (2nd Gen) review", url: "https://www.rtings.com/headphones/reviews/bose/quietcomfort-ultra-earbuds-2nd-gen", kind: "lab", accessed: A },
  { id: "sg-qcue2-review", publisher: "SoundGuys", title: "Bose QC Ultra Earbuds (2nd Gen) review", url: "https://www.soundguys.com/bose-quietcomfort-ultra-earbuds-2nd-gen-review-140812/", kind: "lab", accessed: A },
  { id: "sg-qcue2", publisher: "SoundGuys", title: "Bose QC Ultra Earbuds (2nd Gen) — scores", url: "https://www.soundguys.com/product/bose-quietcomfort-ultra-2nd-gen/", kind: "lab", accessed: A },
  { id: "sg-qcue2-mic", publisher: "SoundGuys", title: "We asked, you told us: the QC Ultra Earbuds 2's mic sounds okay", url: "https://www.soundguys.com/we-asked-you-told-us-the-bose-quietcomfort-ultra-earbuds-2s-mic-sounds-okay-140998/", kind: "lab", accessed: A },
  { id: "sg-qcue2-wind", publisher: "SoundGuys", title: "Bose QC Ultra Earbuds 2 wind noise", url: "https://www.soundguys.com/bose-quietcomfort-ultra-earbuds-2-wind-noise-158654/", kind: "lab", published: "2026-06", accessed: A },
  { id: "whf-qcue2", publisher: "What Hi-Fi?", title: "Bose QC Ultra Earbuds (2nd Gen) review", url: "https://www.whathifi.com/headphones/wireless-earbuds/bose-quietcomfort-ultra-earbuds-2nd-gen", kind: "review", accessed: A },
  { id: "ah-qcue2-deal", publisher: "Android Headlines", title: "The Bose QC Ultra 2nd Gen are still down to $249", url: "https://www.androidheadlines.com/2026/01/the-bose-quietcomfort-ultra-2nd-gen-are-still-down-to-249.html", kind: "news", published: "2026-01", accessed: A },

  // ── Samsung Galaxy Buds4 Pro ──────────────────────────────────────────────
  { id: "sammobile-b4p", publisher: "SamMobile", title: "Galaxy Buds 4 Pro release date", url: "https://www.sammobile.com/news/samsung-galaxy-buds-4-pro-release-date/", kind: "news", published: "2026-02", accessed: A },
  { id: "galaxus-b4p", publisher: "Galaxus", title: "Samsung Galaxy Buds4 Pro — specifications", url: "https://www.galaxus.ch/en/s1/product/samsung-galaxy-buds4-pro-anc-6-h-wireless-headphones-67247923", kind: "retailer", accessed: A },
  { id: "samsung-b4", publisher: "Samsung India", title: "Latest Galaxy Buds4 series", url: "https://www.samsung.com/in/explore/brand/latest-galaxy-buds4-series-with-exceptional-sound", kind: "manufacturer", accessed: A },
  { id: "rt-b4p", publisher: "RTINGS", title: "Samsung Galaxy Buds4 Pro review", url: "https://www.rtings.com/headphones/reviews/samsung/galaxy-buds4-pro", kind: "lab", accessed: A },
  { id: "sg-b4p-vs-bose", publisher: "SoundGuys", title: "Galaxy Buds 4 Pro vs Bose QC Ultra 2nd Gen", url: "https://www.soundguys.com/samsung-galaxy-buds-4-pro-vs-bose-quietcomfort-ultra-2nd-gen-249-vs-299-153696/", kind: "lab", accessed: A },
  { id: "sg-b4p-review", publisher: "SoundGuys", title: "Samsung Galaxy Buds 4 Pro review", url: "https://www.soundguys.com/samsung-galaxy-buds-4-pro-review-153435/", kind: "lab", published: "2026", accessed: A },
  { id: "sg-b4p-vs-app3", publisher: "SoundGuys", title: "Galaxy Buds 4 Pro vs AirPods Pro 3: the $249 ecosystem showdown", url: "https://www.soundguys.com/samsung-galaxy-buds-4-pro-vs-apple-airpods-pro-3-the-249-ecosystem-showdown-153673/", kind: "lab", accessed: A },
  { id: "bgr-b4p", publisher: "BGR", title: "5 hidden features of the Galaxy Buds 4 Pro", url: "https://www.bgr.com/2176684/best-audio-galaxy-buds-4-pro-hidden-features/", kind: "review", accessed: A },

  // ── Nothing Ear (3) ───────────────────────────────────────────────────────
  { id: "pbtech-ear3", publisher: "PB Tech", title: "Nothing Ear (3) listing (launch price)", url: "https://www.pbtech.co.nz/product/HSTNTG10600121/Nothing-Ear-3-True-Wireless-Noise-Cancelling-In-Ea", kind: "retailer", accessed: A },
  { id: "91m-ear3", publisher: "91mobiles", title: "Nothing Ear (3) launched globally — specifications", url: "https://www.91mobiles.com/updates/nothing-ear-3-launched-globally-price-specifications-features/amp/", kind: "news", published: "2025-09", accessed: A },
  { id: "nbc-ear3", publisher: "Notebookcheck", title: "Nothing Ear (3) review", url: "https://www.notebookcheck.net/True-wireless-headphones-with-ANC-and-Super-Mic-Nothing-Ear-3-review.1127069.0.html", kind: "review", accessed: A },
  { id: "tg-ear3", publisher: "Tom's Guide", title: "Nothing Ear (3) review", url: "https://www.tomsguide.com/audio/earbuds/nothing-ear-3-review", kind: "review", accessed: A },
  { id: "rt-ear3", publisher: "RTINGS", title: "Nothing Ear (3) review", url: "https://www.rtings.com/headphones/reviews/nothing/ear-3-in-ear", kind: "lab", accessed: A },
  { id: "sg-ear3-review", publisher: "SoundGuys", title: "Nothing Ear (3) review", url: "https://www.soundguys.com/nothing-ear-3-review-144486/", kind: "lab", accessed: A },
  { id: "sg-ear3", publisher: "SoundGuys", title: "Nothing Ear (3) — scores", url: "https://www.soundguys.com/product/nothing-ear-3/", kind: "lab", accessed: A },
  { id: "hc-ear3", publisher: "Headphonecheck", title: "Nothing Ear (3) test", url: "https://www.headphonecheck.com/test/nothing-ear-3/", kind: "review", accessed: A },
  { id: "mz-ear3", publisher: "Mute Zone", title: "Nothing Ear (3) test", url: "https://mute-zone.com/en/test/nothing-ear-3", kind: "review", accessed: A },

  // ── Nothing Ear (3a) ──────────────────────────────────────────────────────
  { id: "tc-ear3a", publisher: "TechCabal", title: "Nothing Ear (3a) price, release date, specs", url: "https://techcabal.com/2026/07/08/nothing-ear-3a-price-release-date-specs/", kind: "news", published: "2026-07-08", accessed: A },
  { id: "tru-ear3a", publisher: "Trusted Reviews", title: "Nothing Ear (3a) review", url: "https://www.trustedreviews.com/reviews/nothing-ear-3a", kind: "review", published: "2026", accessed: A },
  { id: "tr-ear3a", publisher: "TechRadar", title: "Nothing Ear (3a) review", url: "https://www.techradar.com/audio/earbuds-airpods/nothing-ear-3a-review", kind: "review", published: "2026", accessed: A },
  { id: "rt-ear3a", publisher: "RTINGS", title: "Nothing Ear (3a) review", url: "https://www.rtings.com/headphones/reviews/nothing/ear-3a", kind: "lab", accessed: A },
  { id: "sg-ear3a", publisher: "SoundGuys", title: "Nothing Ear (3a) — scores", url: "https://www.soundguys.com/product/nothing-ear-3a/", kind: "lab", accessed: A },
  { id: "sg-ear3a-vs-a", publisher: "SoundGuys", title: "Nothing Ear (3a) vs Nothing Ear (a)", url: "https://www.soundguys.com/nothing-ear-3a-vs-nothing-ear-a-160301/", kind: "lab", accessed: A },
  { id: "nothing-compat", publisher: "Nothing Support", title: "Which devices are the earbuds compatible with?", url: "https://support.nothing.tech/hc/en-us/articles/47974762868625-Which-devices-is-the-Earbuds-compatible-with", kind: "manufacturer", accessed: A },

  // ── CMF Buds Pro 2 ────────────────────────────────────────────────────────
  { id: "pa-cmf", publisher: "PhoneArena", title: "CMF unveils Buds Pro 2", url: "https://www.phonearena.com/news/nothings-sub-brand-cmf-unveils-its-buds-pro-2-offering-big-features-for-a-small-price_id160174", kind: "news", published: "2024-07", accessed: A },
  { id: "nothing-cmf", publisher: "Nothing (AU)", title: "CMF Buds Pro 2", url: "https://au.nothing.tech/pages/cmf-buds-pro-2", kind: "manufacturer", accessed: A },
  { id: "rt-cmf-vs-ear3", publisher: "RTINGS", title: "CMF Buds Pro 2 vs Nothing Ear (3)", url: "https://www.rtings.com/headphones/tools/compare/cmf-buds-pro-2-vs-nothing-ear-3/66883/114011", kind: "lab", accessed: A },
  { id: "rt-cmf", publisher: "RTINGS", title: "CMF Buds Pro 2 review", url: "https://www.rtings.com/headphones/reviews/cmf/buds-pro-2", kind: "lab", accessed: A },
  { id: "sg-cmf", publisher: "SoundGuys", title: "CMF Buds Pro 2 review", url: "https://www.soundguys.com/cmf-buds-pro-2-review-big-features-small-price-smart-dial-123206/", kind: "lab", accessed: A },
  { id: "tr-cmf", publisher: "TechRadar", title: "CMF Buds Pro 2 review", url: "https://www.techradar.com/audio/earbuds-airpods/cmf-buds-pro-2-review", kind: "review", accessed: A },
  { id: "tg-cmf", publisher: "Tom's Guide", title: "CMF by Nothing Buds Pro 2 review", url: "https://www.tomsguide.com/audio/earbuds/cmf-by-nothing-buds-pro-2-review", kind: "review", accessed: A },

  // ── Sennheiser Momentum True Wireless 5 ──────────────────────────────────
  { id: "senn-mtw5-news", publisher: "Sennheiser Newsroom", title: "Introducing Sennheiser Momentum True Wireless 5", url: "https://newsroom.sennheiser.com/introducing-sennheiser-momentum-true-wireless-5-the-flagship-momentum-experience-in-your-pocket", kind: "manufacturer", published: "2026-08-20", accessed: A },
  { id: "ecoustics-mtw5", publisher: "eCoustics", title: "Sennheiser Momentum True Wireless 5", url: "https://www.ecoustics.com/products/sennheiser-momentum-true-wireless-5-earbuds/", kind: "news", published: "2026-08", accessed: A },
  { id: "thomann-mtw5", publisher: "Thomann", title: "Sennheiser Momentum 5 TW — specifications", url: "https://www.thomann.co.uk/sennheiser_hearing_momentum_5_tw_graphite.htm", kind: "retailer", accessed: A },
  { id: "fillion-mtw5", publisher: "Fillion", title: "Sennheiser Momentum True Wireless 5 — specifications", url: "https://fillion.ca/en/products/sennheiser-momentum-true-wireless-5-in-ear-headphones", kind: "retailer", accessed: A },
  { id: "rt-mtw5", publisher: "RTINGS", title: "Sennheiser Momentum True Wireless 5 review", url: "https://www.rtings.com/headphones/reviews/sennheiser/momentum-true-wireless-5", kind: "lab", published: "2026", accessed: A },
  { id: "sg-mtw5", publisher: "SoundGuys", title: "Sennheiser Momentum True Wireless 5 — scores", url: "https://www.soundguys.com/product/sennheiser-momentum-true-wireless-5", kind: "lab", accessed: A },
  { id: "tr-mtw5", publisher: "TechRadar", title: "Sennheiser Momentum True Wireless 5 review", url: "https://www.techradar.com/audio/earbuds-airpods/sennheisers-eco-conscious-addition-to-the-momentum-true-wireless-5-earbuds-is-commendable-but-their-sound-alone-makes-them-the-buds-to-beat", kind: "review", published: "2026", accessed: A },

  // ── Technics EAH-AZ100 ────────────────────────────────────────────────────
  { id: "cn-az100", publisher: "ChannelNews", title: "CES 2025: Technics introduces EAH-AZ100", url: "https://www.channelnews.com.au/ces-2025-technics-introduces-wireless-hi-fi-eah-az100-earbuds/", kind: "news", published: "2025-01", accessed: A },
  { id: "rn-az100", publisher: "RouteNote", title: "Technics EAH-AZ100 — worth the $300 price tag?", url: "https://routenote.com/blog/technics-eah-az100/", kind: "news", published: "2025-01", accessed: A },
  { id: "jb-az100", publisher: "JB Hi-Fi", title: "Technics AZ100 — specifications", url: "https://www.jbhifi.com.au/products/technics-az100-premium-true-wireless-noise-cancelling-in-ear-headphones-black", kind: "retailer", accessed: A },
  { id: "rt-az100-vs-app3", publisher: "RTINGS", title: "Technics EAH-AZ100 vs AirPods Pro 3", url: "https://www.rtings.com/headphones/tools/compare/technics-eah-az100-vs-apple-airpods-pro-3/88498/113044", kind: "lab", accessed: A },
  { id: "sg-az100", publisher: "SoundGuys", title: "Technics EAH-AZ100 review", url: "https://www.soundguys.com/technics-eah-az100-review-135211/", kind: "lab", accessed: A },
  { id: "whf-az100", publisher: "What Hi-Fi?", title: "Technics EAH-AZ100 review", url: "https://www.whathifi.com/reviews/technics-eah-az100", kind: "review", accessed: A },
];

export const SOURCES: Record<string, Source> = Object.fromEntries(list.map((s) => [s.id, s]));
export const SOURCE_LIST = list;
export const SNAPSHOT_DATE = A;
