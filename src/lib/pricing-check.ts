// Quick sanity check for pricing calculations
// Run with: npx ts-node --esm src/lib/pricing-check.ts
// Or just read the output below:

import { callCost } from './pricing';
import { s1Costs, s2Costs, s3Costs, s4Costs, s4Annual } from './scenarios';

// ===== PRICING SANITY CHECKS =====
console.log('=== Pricing Sanity Checks ===');
const opusCost = callCost('opus', 2000, 400);
const flashCost = callCost('flash', 2000, 400);
const flashLiteCost = callCost('flashLite', 2000, 400);

console.log(`callCost("opus", 2000, 400) = $${opusCost.toFixed(4)} (expect ≈ $0.0200)`);
console.log(`callCost("flash", 2000, 400) = $${flashCost.toFixed(4)} (expect ≈ $0.0066)`);
console.log(`callCost("flashLite", 2000, 400) = $${flashLiteCost.toFixed(4)} (expect ≈ $0.0011)`);
console.log(`Opus/Flash ratio: ${(opusCost/flashCost).toFixed(1)}x (expect ~3x)`);
console.log(`Opus/FlashLite ratio: ${(opusCost/flashLiteCost).toFixed(1)}x (expect ~18x)`);

// ===== S1 CHECKS =====
console.log('\n=== S1: Build (SDLC) ===');
const s1 = s1Costs(12, 0.75);
console.log(`Per sprint @12 devs: Opus + Sonnet = $${s1.allFrontier.toFixed(2)}`);
console.log(`Per sprint @12 devs: Opus + Gemini = $${s1.tiered.toFixed(2)}`);
console.log(`Savings per sprint: $${s1.savings.toFixed(2)}`);
console.log(`Over 13 sprints: savings = $${(s1.savings * 13).toFixed(2)} (expect ≈ $1,755)`);

// ===== S2 CHECKS =====
console.log('\n=== S2: In-App Intelligence ===');
const s2 = s2Costs(5_000_000);
console.log(`@5M queries/mo: Opus + Sonnet = $${s2.allFrontier.toFixed(0)}`);
console.log(`@5M queries/mo: Opus + Gemini = $${s2.tiered.toFixed(0)}`);
console.log(`Savings/mo: $${s2.savings.toFixed(0)}`);
console.log(`Savings/yr: $${s2.savingsAnnual.toFixed(0)} (expect ≈ $841,000)`);

// ===== S3 CHECKS =====
console.log('\n=== S3: Multimodal ===');
const s3 = s3Costs();
console.log(`All Opus: $${s3.allOpus.toFixed(4)}`);
console.log(`Opus + Sonnet: $${s3.opusSonnet.toFixed(4)}`);
console.log(`Opus + Flash: $${s3.opusFlash.toFixed(4)}`);

// ===== S4 CHECKS =====
console.log('\n=== S4: Agentic Orchestration ===');
const s4 = s4Costs();
console.log(`Per run all-opus: $${s4.allOpus.toFixed(4)} (expect ≈ $0.8725)`);
console.log(`Per run Opus + Sonnet: $${s4.opusSonnet.toFixed(4)}`);
console.log(`Per run Opus + Flash: $${s4.opusFlash.toFixed(4)}`);
const s4a = s4Annual(50000);
console.log(`@50K/night annual all-opus: $${(s4a.allOpusAnnual/1e6).toFixed(1)}M (expect ≈ $15.9M)`);
console.log(`@50K/night annual Opus + Sonnet: $${(s4a.opusSonnetAnnual/1e6).toFixed(1)}M`);
console.log(`@50K/night annual Opus + Flash: $${(s4a.opusFlashAnnual/1e6).toFixed(1)}M`);
console.log(`Annual savings: $${(s4a.savings/1e6).toFixed(1)}M (expect ≈ $8.8M)`);
