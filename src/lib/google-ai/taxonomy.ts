/** Segments, sub-verticals, sub-regions and languages — the specialist's ways of slicing the same knowledge base. */
import type { RegionId, SegmentId } from "./types";

export interface Segment { id: SegmentId; name: string; blurb: string }
export const SEGMENTS: Segment[] = [
  { id: "digital-natives", name: "Digital natives", blurb: "Companies born online: they build with AI as a product input and buy on price-performance and speed." },
  { id: "enterprise", name: "Enterprise traditional accounts", blurb: "Established companies modernising: they buy on risk, integration and measurable productivity." },
  { id: "public-sector", name: "Public sector", blurb: "Governments and agencies: sovereignty, procurement rules and public accountability decide." },
  { id: "education", name: "Education", blurb: "Schools, universities and research: safe access for learners, tight budgets, research computing." },
];

export interface SubVertical { id: string; segment: SegmentId; name: string }
export const SUB_VERTICALS: SubVertical[] = [
  { id: "dn-gaming", segment: "digital-natives", name: "Gaming" },
  { id: "dn-ecommerce", segment: "digital-natives", name: "E-commerce and marketplaces" },
  { id: "dn-fintech", segment: "digital-natives", name: "Fintech" },
  { id: "dn-saas", segment: "digital-natives", name: "SaaS and software vendors" },
  { id: "dn-media", segment: "digital-natives", name: "Media, streaming and social" },
  { id: "dn-ai-native", segment: "digital-natives", name: "AI-native startups" },
  { id: "dn-mobility", segment: "digital-natives", name: "Mobility, delivery and super-apps" },
  { id: "dn-adtech", segment: "digital-natives", name: "Advertising and marketing technology" },
  { id: "ent-banking", segment: "enterprise", name: "Banking and capital markets" },
  { id: "ent-insurance", segment: "enterprise", name: "Insurance" },
  { id: "ent-retail", segment: "enterprise", name: "Retail and consumer goods" },
  { id: "ent-manufacturing", segment: "enterprise", name: "Manufacturing and automotive" },
  { id: "ent-telecom", segment: "enterprise", name: "Telecommunications" },
  { id: "ent-healthcare", segment: "enterprise", name: "Healthcare and life sciences" },
  { id: "ent-energy", segment: "enterprise", name: "Energy and utilities" },
  { id: "ent-media", segment: "enterprise", name: "Media and entertainment" },
  { id: "ent-travel", segment: "enterprise", name: "Travel, transport and logistics" },
  { id: "ent-conglomerate", segment: "enterprise", name: "Conglomerates and professional services" },
  { id: "ps-central", segment: "public-sector", name: "Central and federal government" },
  { id: "ps-local", segment: "public-sector", name: "State, city and local government" },
  { id: "ps-defence", segment: "public-sector", name: "Defence and national security" },
  { id: "ps-health", segment: "public-sector", name: "Public health and social services" },
  { id: "ps-transport", segment: "public-sector", name: "Public transport and smart cities" },
  { id: "edu-k12", segment: "education", name: "Schools (K–12)" },
  { id: "edu-higher", segment: "education", name: "Higher education" },
  { id: "edu-research", segment: "education", name: "Research institutions" },
  { id: "edu-edtech", segment: "education", name: "Education technology" },
];
export const SUB_VERTICAL_BY_ID = Object.fromEntries(SUB_VERTICALS.map((s) => [s.id, s]));

export type LangId = "en" | "ko" | "ja" | "zh-CN" | "zh-TW" | "id" | "th" | "vi" | "hi";
export const LANGUAGES: { id: LangId; name: string; english: string }[] = [
  { id: "en", name: "English", english: "English" },
  { id: "ko", name: "한국어", english: "Korean" },
  { id: "ja", name: "日本語", english: "Japanese" },
  { id: "zh-CN", name: "简体中文", english: "Chinese (Simplified)" },
  { id: "zh-TW", name: "繁體中文", english: "Chinese (Traditional)" },
  { id: "id", name: "Bahasa Indonesia", english: "Indonesian" },
  { id: "th", name: "ไทย", english: "Thai" },
  { id: "vi", name: "Tiếng Việt", english: "Vietnamese" },
  { id: "hi", name: "हिन्दी", english: "Hindi" },
];

export interface Region { id: RegionId; name: string; countries: string[]; languages: LangId[] }
export const REGIONS: Region[] = [
  { id: "korea", name: "Korea", countries: ["South Korea"], languages: ["ko", "en"] },
  { id: "india", name: "India", countries: ["India"], languages: ["en", "hi"] },
  { id: "sea", name: "South East Asia", countries: ["Singapore", "Indonesia", "Thailand", "Vietnam", "Malaysia", "Philippines"], languages: ["en", "id", "th", "vi"] },
  { id: "japan", name: "Japan", countries: ["Japan"], languages: ["ja", "en"] },
  { id: "aunz", name: "Australia and New Zealand", countries: ["Australia", "New Zealand"], languages: ["en"] },
  { id: "china", name: "China", countries: ["China"], languages: ["zh-CN", "en"] },
  { id: "hk-taiwan", name: "Hong Kong and Taiwan", countries: ["Hong Kong", "Taiwan"], languages: ["zh-TW", "en"] },
];
export const REGION_BY_ID = Object.fromEntries(REGIONS.map((r) => [r.id, r]));
