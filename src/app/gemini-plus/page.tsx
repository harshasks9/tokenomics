"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Brain,
  Search,
  Bot,
  Terminal,
  Shield,
  Layers,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronDown,
  User,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Maximize2,
  Minimize2,
  RefreshCw,
  Globe,
  Settings,
  BookOpen,
  ArrowRight,
  FileText,
  Lock,
  Cpu
} from "lucide-react";

// ==========================================
// TRANSLATION DICTIONARY (APAC/Japan Focus)
// ==========================================
type Lang = "en" | "ja";

const i18n = {
  en: {
    title: "Gemini Enterprise Plus Commercial Strategy Map",
    subtitle: "APAC & Japan Enterprise AI Valuation & Consumption Planner",
    contractWarning: "Customer-specific entitlement — validate against signed order form",
    payingText: "Nominal Seat Subscription",
    creditText: "First-Party AI Consumption Credit",
    pupm: "PUPM",
    monthly: "Monthly",
    annual: "Annual",
    summaryTab: "Executive Summary",
    mindmapTab: "Interactive Value Map",
    calculatorTab: "CFO Calculator & Economic Model",
    ledgerTab: "Research Ledger",
    viewToggle: "Select Strategy Lens",
    viewExec: "C-Suite Executive",
    viewEntitlement: "Product Entitlements",
    viewCfo: "CFO Economics",
    viewCio: "CIO Security & Arch",
    viewAdoption: "Adoption & Utilization",
    activeLanguage: "日本語",
    calcHeader: "Interactive Value Calculator",
    modelScenarios: "Workload Token Equivalencies ($30 Credit)",
    seatCount: "Licensed Seats",
    contractTerm: "Contract Term (Months)",
    adoptionRate: "Adoption Rate",
    activeUserRate: "Active User Rate",
    creditUtilRate: "Credit Utilization Rate",
    workingDays: "Working Days / Year",
    employeeCost: "Employee Hourly Rate (USD)",
    minutesSaved: "Minutes Saved / User / Day",
    displacedTools: "Potentially Displaced Tools",
    commitment: "Total Subscription Commitment",
    availCredit: "Total Available Consumption Credit",
    utilCredit: "Utilized Consumption Credit",
    riskCredit: "Unused / At-Risk Credit Pool",
    displacedVal: "Avoided Tool Licensing Value",
    prodVal: "Productivity Value (Hours Saved)",
    totalVal: "Total Modeled Value",
    valueCostRatio: "Value-to-Cost ROI Ratio",
    breakevenAdoption: "Break-even Seat Adoption Rate",
    breakevenMinutes: "Break-even Minutes Saved / User / Month",
    interactionsDay: "Interactions / Active User / Day",
    tokenRatio: "Input/Output Workload Mix",
    inpTokens: "Input Tokens per Interaction",
    outTokens: "Output Tokens per Interaction",
    pricingDisclaimer: "*Calculated based on standard APAC/Japan region Vertex AI list prices (June 2026). Actual contract terms may vary.",
    regionalFocus: "APAC & Japan Regional Framing",
    residencyJP: "Sovereign & Regional Data Residency (Tokyo/Osaka regions)",
    langSupport: "Native Multi-lingual Processing (JP/EN/CN/KR parallel workflows)",
    subsidiaryOrch: "Distributed Subsidiary/Local Business Unit Autonomy",
    frontlineEnablement: "Frontline/Operational Enablement (Retail, Warehouse, Field Ops)"
  },
  ja: {
    title: "Gemini Enterprise Plus 商業戦略マップ",
    subtitle: "APAC・日本企業向け AI価値評価・コンサンプションプランナー",
    contractWarning: "顧客固有の権利契約 — 締結済みの注文書 (Order Form) と照合してください",
    payingText: "ユーザーあたりのライセンス費用",
    creditText: "ファーストパーティ AIコンサンプションクレジット",
    pupm: "PUPM / 月額",
    monthly: "月額",
    annual: "年間",
    summaryTab: "エグゼクティブ要約",
    mindmapTab: "インタラクティブ価値マップ",
    calculatorTab: "CFO計算ツール & 経済モデル",
    ledgerTab: "リサーチ台帳",
    viewToggle: "戦略レンズの切り替え",
    viewExec: "経営幹部・C-Suite向け",
    viewEntitlement: "製品権利一覧",
    viewCfo: "CFO・財務分析",
    viewCio: "CIO・セキュリティと構成",
    viewAdoption: "利用促進と定着率",
    activeLanguage: "English",
    calcHeader: "インタラクティブ価値計算ツール",
    modelScenarios: "ワークロード別トークン換算実績（$30クレジット枠内）",
    seatCount: "契約ライセンス数",
    contractTerm: "契約期間（月数）",
    adoptionRate: "導入開始率",
    activeUserRate: "アクティブユーザー率",
    creditUtilRate: "クレジット消化率",
    workingDays: "年間労働日数",
    employeeCost: "従業員の平均時給 (USD)",
    minutesSaved: "1日あたり削減時間 (分/人)",
    displacedTools: "削減可能な他社製ツール",
    commitment: "総サブスクリプションコミット額",
    availCredit: "利用可能な総クレジット額",
    utilCredit: "消費されたクレジット価値",
    riskCredit: "未消化 / リスク状態のクレジットプール",
    displacedVal: "削減された他社ツールライセンス費用",
    prodVal: "生産性向上効果（時間削減）",
    totalVal: "総モデル価値評価",
    valueCostRatio: "投資対効果（Value-to-Cost ROI）",
    breakevenAdoption: "損益分岐点・ライセンス導入率",
    breakevenMinutes: "損益分岐点・月間必要削減時間 / 人",
    interactionsDay: "アクティブユーザーの1日あたり対話回数",
    tokenRatio: "インプット / アウトプット比率",
    inpTokens: "1対話あたりのインプットトークン数",
    outTokens: "1対話あたりのアウトプットトークン数",
    pricingDisclaimer: "*2026年6月時点のAPAC・日本地域向け標準Vertex AI価格表に基づいて算出。契約内容により変動あり。",
    regionalFocus: "APAC・日本市場におけるローカル要件",
    residencyJP: "データ主権と地域データ保管（東京・大阪リージョン対応）",
    langSupport: "ネイティブな多言語処理（日・英・中・韓の並行ワークフロー）",
    subsidiaryOrch: "国内外のグループ子会社・現場事業部門の自立運用",
    frontlineEnablement: "現場・オペレーショナル層の活性化（店舗、倉庫、現場運用）"
  }
};

// ==========================================
// CENTRAL DATA STRUCTURES & INFORMATION ARCH
// ==========================================
interface MindMapNode {
  id: string;
  label: string;
  type: "solid" | "dashed";
  badge: "monetary" | "included" | "consumption" | "illustrative" | "warning" | "quota";
  description: { en: string; ja: string };
  evidence: { en: string; ja: string };
  links?: { label: string; url: string }[];
  children?: MindMapNode[];
}

const MIND_MAP_DATA: MindMapNode[] = [
  {
    id: "productivity",
    label: "Productivity",
    type: "solid",
    badge: "included",
    description: {
      en: "Everyday AI productivity integrated into Google Workspace.",
      ja: "Google Workspaceに統合された日常的な生産性AIツール。"
    },
    evidence: {
      en: "Access to advanced Gemini models directly in Docs, Gmail, Sheets, and Slides. Deep Research features for multi-step intelligence collection.",
      ja: "Docs、Gmail、Sheets、Slides内でGeminiの先端モデルを利用可能。複数ステップにわたるリサーチ収集を行うDeep Research機能。"
    },
    children: [
      {
        id: "prod-cap",
        label: "Advanced Gemini Models",
        type: "solid",
        badge: "included",
        description: {
          en: "Enterprise access to Google's largest models with web grounding and Search integration.",
          ja: "Google Searchグラウンディングを備えた最先端Geminiモデルへの企業向けアクセス。"
        },
        evidence: {
          en: "Allows users to summarize, analyze, write drafts, and conduct deep multi-turn research securely.",
          ja: "ユーザーによる要約、分析、原稿執筆、およびセキュアな複数ターンのディープリサーチを可能にします。"
        }
      },
      {
        id: "prod-use",
        label: "Secure Grounded Synthesis",
        type: "solid",
        badge: "included",
        description: {
          en: "Retrieves answers grounded securely in personal or corporate Drive files with respect to permissions.",
          ja: "個人のファイルや企業の共有ドライブから、権限を遵守して情報をセキュアに検索・要約。"
        },
        evidence: {
          en: "CIO/CFO note: Data stays isolated; no employee leaks sensitive documents to public models.",
          ja: "CIO/CFOメモ：データは完全に隔離され、従業員が機密ドキュメントを公開モデルに漏洩する心配はありません。"
        }
      },
      {
        id: "prod-val",
        label: "Knowledge Action Speed",
        type: "dashed",
        badge: "illustrative",
        description: {
          en: "Reduces time spent searching, drafting, and onboarding.",
          ja: "情報検索、文書ドラフト作成、新入社員研修などの所要時間を大幅削減。"
        },
        evidence: {
          en: "Modeled as 20+ minutes saved per employee per day, verified through regional customer success studies.",
          ja: "1日あたり1人20分以上の削減としてモデル化。APAC地域の顧客導入事例により裏付け。"
        }
      }
    ]
  },
  {
    id: "notebooklm",
    label: "NotebookLM Enterprise",
    type: "solid",
    badge: "included",
    description: {
      en: "Grounded research workspace with expanded limits and admin control.",
      ja: "制限枠が拡大され管理者制御を備えた、グラウンディング済みリサーチワークスペース。"
    },
    evidence: {
      en: "Includes NotebookLM Enterprise under Gemini Enterprise Plus Workspace tenant rights.",
      ja: "Gemini Enterprise Plus Workspaceのテナント権限の下でNotebookLM Enterpriseを含みます。"
    },
    children: [
      {
        id: "nb-cap",
        label: "NotebookLM Entitlements",
        type: "solid",
        badge: "quota",
        description: {
          en: "Verified quotas: 100 notebooks per user, 50 sources per notebook, 500k words per source.",
          ja: "確認済みの上限：1ユーザーあたり100ノートブック、1ノートあたり50ソース、1ソースあたり50万語。"
        },
        evidence: {
          en: "Supports Audio Overviews, Video/Slide outlines, and markdown reports securely.",
          ja: "音声ダイジェスト、ビデオ/スライドのアウトライン作成、マークダウンレポート生成に対応。"
        }
      },
      {
        id: "nb-use",
        label: "Executive Briefing Books",
        type: "solid",
        badge: "included",
        description: {
          en: "Synthesizing regulatory filings, product catalogs, or legal briefs into instantly readable documents.",
          ja: "規制当局への提出書類、製品カタログ、法務文書を瞬時に読みやすい要約に変換。"
        },
        evidence: {
          en: "Widely used in APAC for translating regional policy changes and generating training summaries.",
          ja: "APAC地域で、現地法制度の変更翻訳やトレーニング用サマリーの作成に広く利用されています。"
        }
      },
      {
        id: "nb-val",
        label: "Tool Displacement Value",
        type: "solid",
        badge: "monetary",
        description: {
          en: "Displaces standalone synthesis and PDF analyzer tools.",
          ja: "他社の独立型文書要約ツールやPDF解析ツールのライセンスを統合・置換。"
        },
        evidence: {
          en: "Est. value: $8 PUPM ($96 annual per user replacement reference).",
          ja: "想定代替価値：月額 $8 PUPM（年間 $96/ユーザーのツール削減相当）。"
        }
      }
    ]
  },
  {
    id: "knowledge",
    label: "Enterprise Knowledge",
    type: "solid",
    badge: "included",
    description: {
      en: "Permission-aware search and grounding across SaaS ecosystems.",
      ja: "他社製SaaSを含めた横断的かつアクセス権限連動型の検索とグラウンディング。"
    },
    evidence: {
      en: "75 GiB pooled indexing and storage allowance per user included for grounding external sources.",
      ja: "外部データソースのグラウンディング用に、1ユーザーあたり75 GiBのプール型インデックス容量が付属。"
    },
    children: [
      {
        id: "kn-cap",
        label: "Google & Third-Party Connectors",
        type: "solid",
        badge: "included",
        description: {
          en: "Integrates with Google Drive, Gmail, Salesforce, SharePoint, Jira, ServiceNow, Confluence.",
          ja: "Googleドライブ/Gmailに加え、Salesforce、SharePoint、Jira、ServiceNow、Confluenceと連携。"
        },
        evidence: {
          en: "Establishes a unified corporate knowledge graph with strict document-level security.",
          ja: "ドキュメントレベルの厳格なセキュリティを維持し、全社的な統合ナレッジグラフを構築します。"
        }
      },
      {
        id: "kn-use",
        label: "Customer Support & Legal Grounding",
        type: "solid",
        badge: "included",
        description: {
          en: "Grounds customer tickets, contract templates, and product guides in real time.",
          ja: "サポートチケット、契約書テンプレート、製品ガイドに基づいたリアルタイム検索回答。"
        },
        evidence: {
          en: "Ensures staff answers match actual current guidelines without hallucination.",
          ja: "ハルシネーション（嘘の生成）を防ぎ、スタッフの回答が常に最新のガイドラインと一致することを保証します。"
        }
      },
      {
        id: "kn-val",
        label: "Avoided Search Tool Cost",
        type: "solid",
        badge: "monetary",
        description: {
          en: "Replaces high-cost enterprise search tools and manual database queries.",
          ja: "高額な他社製企業内検索ツールや、手動のデータベース問い合わせにかかる工数を削減。"
        },
        evidence: {
          en: "Reference replacement value: $5 PUPM ($60 annual per user replacement reference).",
          ja: "代替参考価値：月額 $5 PUPM（年間 $60/ユーザー）。"
        }
      }
    ]
  },
  {
    id: "agents",
    label: "Agents & Automation",
    type: "solid",
    badge: "included",
    description: {
      en: "No-code agent publishing in Workspace and custom Vertex AI agents.",
      ja: "Workspace内のノーコードエージェント作成と、Vertex AIによるカスタムエージェント。"
    },
    evidence: {
      en: "Allows building agents using standard Google Workspace flows. Billed developer execution can be offset by credit.",
      ja: "Google Workspaceの標準フローを用いたエージェント構築。有償の開発・実行費用は$30クレジットで相殺可能。"
    },
    children: [
      {
        id: "ag-cap",
        label: "Build & Govern Ecosystem",
        type: "solid",
        badge: "included",
        description: {
          en: "Full progression: Discover → Build → Publish → Use → Govern → Optimize.",
          ja: "発見 → 構築 → 公開 → 利用 → 統治 → 最適化のライフサイクル全体を管理。"
        },
        evidence: {
          en: "Centralized admin controls prevent agent sprawl and shadow AI development.",
          ja: "管理者による一元管理で、エージェントの乱立（スプロール）や野良AI（シャドーAI）を防止。"
        }
      },
      {
        id: "ag-use",
        label: "Operational Automation Agents",
        type: "solid",
        badge: "included",
        description: {
          en: "Agents for automated invoice processing, travel booking validation, and compliance checks.",
          ja: "請求書の自動処理、出張旅費規程のチェック、コンプライアンス監査などのエージェント開発。"
        },
        evidence: {
          en: "Integrates with local enterprise APIs to read, process, and write back records.",
          ja: "ローカルの業務APIと統合し、レコードの読み込み、処理、書き戻しを実行します。"
        }
      },
      {
        id: "ag-val",
        label: "Credit Funded Execution",
        type: "solid",
        badge: "consumption",
        description: {
          en: "Development and execution are funded directly by the $30 PUPM consumption credit pool.",
          ja: "開発およびエージェント実行にかかるAPIコストは、月額$30/人のコンサイクル枠から拠出可能。"
        },
        evidence: {
          en: "Reduces net new budget requirements for prototyping and hosting custom agent flows.",
          ja: "カスタムエージェントの試作やホスティングのための、新規予算要求をゼロに抑えることができます。"
        }
      }
    ]
  },
  {
    id: "developers",
    label: "Developer Platform",
    type: "solid",
    badge: "warning",
    description: {
      en: "Coding assistance and workspace intelligence for developers.",
      ja: "開発者向けのコーディング支援およびワークスペース知能化。"
    },
    evidence: {
      en: "Gemini Code Assist Standard inclusion subject to specific deal-specific contract rules.",
      ja: "Gemini Code Assist Standardの同梱状況は、顧客ごとの個別契約条件に準拠します。"
    },
    children: [
      {
        id: "dev-cap",
        label: "Gemini Code Assist",
        type: "solid",
        badge: "included",
        description: {
          en: "Code explanation, test creation, codebase refactoring directly in IDEs (VS Code, Cloud Shell).",
          ja: "IDE（VS CodeやCloud Shell）内でのコード解説、テスト作成、リファクタリング支援。"
        },
        evidence: {
          en: "Reduces engineering cycles for standard CRUD and legacy conversion jobs.",
          ja: "標準的なCRUD開発やレガシーコード変換（COBOL等の移行）に伴う開発工数を大幅削減。"
        }
      },
      {
        id: "dev-use",
        label: "Accelerated API Integration",
        type: "solid",
        badge: "included",
        description: {
          en: "Generating custom wrappers and adapters for connecting local legacy databases to Google Search.",
          ja: "ローカルのレガシーデータベースとGoogle検索を連携するためのカスタムラッパーやアダプターを自動生成。"
        },
        evidence: {
          en: "Leveraged heavily by APAC systems integrators during digital transformation migrations.",
          ja: "APACのシステムインテグレーター（SIer）がDX移行案件で全面的に導入・活用しています。"
        }
      },
      {
        id: "dev-val",
        label: "Code Tool Displacement Value",
        type: "solid",
        badge: "monetary",
        description: {
          en: "Reference replacement value for standalone dev assistant licenses.",
          ja: "他社製コーディング支援ツールの有償ライセンス料金を削減。"
        },
        evidence: {
          en: "Valued at $19 PUPM list price reference, representing potential avoided cash spend.",
          ja: "参考値として月額 $19 PUPM (年額 $228/開発者相当) の代替購入回避費。"
        }
      }
    ]
  },
  {
    id: "governance",
    label: "Trust, Control & Gov",
    type: "solid",
    badge: "included",
    description: {
      en: "Enterprise-grade controls that avoid multi-tool compliance setups.",
      ja: "セキュリティ用の追加ツール導入を不要にする、エンタープライズ級の管理者統治機構。"
    },
    evidence: {
      en: "Data residency, CMEK, VPC Service Controls, and Model Armor included.",
      ja: "データ所在地管理、CMEK、VPCサービスコントロール、Model Armorを標準で包括。"
    },
    children: [
      {
        id: "gov-cap",
        label: "Customer Data Ownership",
        type: "solid",
        badge: "included",
        description: {
          en: "Strict guarantee: Customer data, prompts, and outputs are NEVER used to train public models.",
          ja: "厳格な保証：顧客データ、プロンプト、生成された回答が共有の公開モデルの学習に使われることは「決して」ありません。"
        },
        evidence: {
          en: "Ensures compliance with intellectual property and regional trade secrets protection laws.",
          ja: "知的財産権の保護や、APAC地域の営業秘密保護法に完全に準拠します。"
        }
      },
      {
        id: "gov-use",
        label: "VPC-SC & CMEK Auditing",
        type: "solid",
        badge: "included",
        description: {
          en: "Restricting AI data flows inside secure corporate virtual private cloud boundaries.",
          ja: "セキュアな企業VPC（仮想プライベートクラウド）境界内にAIデータフローを限定。"
        },
        evidence: {
          en: "Crucial for highly regulated sectors (Banking in JP/SG, Healthcare, Public Sector).",
          ja: "規制の厳しい業界（日本の金融業、シンガポールの政府機関、医療機関）で必須要件となります。"
        }
      },
      {
        id: "gov-val",
        label: "Avoided Compliance Audit Costs",
        type: "dashed",
        badge: "illustrative",
        description: {
          en: "Reduces internal compliance reviews from months to days.",
          ja: "セキュリティ審査の期間を数ヶ月から数日へと短縮し、監査プロセスを簡略化。"
        },
        evidence: {
          en: "Sellers utilize pre-populated compliance decks to bypass security team objections immediately.",
          ja: "プリコンパイルされた適合性証明ドキュメントにより、顧客内セキュリティチームからの異議・審査を即座にバイパス。"
        }
      }
    ]
  },
  {
    id: "consumption",
    label: "AI Consumption Engine",
    type: "solid",
    badge: "consumption",
    description: {
      en: "Deal-specific $30 PUPM credit pool turning licensing into production AI capacity.",
      ja: "ライセンス契約をプロダクションAIの実行リソースへ転換する、商談特有の$30/ユーザーのクレジット枠。"
    },
    evidence: {
      en: "Eligible for first-party Vertex AI and Google Cloud agent/model SKUs.",
      ja: "GoogleファーストパーティのVertex AI、エージェント実行、およびAPIモデルSKUに適用可能。"
    },
    children: [
      {
        id: "con-cap",
        label: "Nominal Spend Recoup",
        type: "solid",
        badge: "monetary",
        description: {
          en: "$30 seat fee returns $30 in consumption value (100% face-value offset).",
          ja: "$30の席単価に対し、同額の$30相当の消費クレジットが付与され、実質負担を相殺。"
        },
        evidence: {
          en: "Effectively matches license investment dollar-for-dollar with developmental API budget.",
          ja: "ライセンス料金の支出と同額が開発者用API利用枠として顧客の環境に還流されます。"
        }
      },
      {
        id: "con-use",
        label: "Production Scale Workloads",
        type: "solid",
        badge: "consumption",
        description: {
          en: "Funds batch indexing, high-volume automated routing, and complex reasoning queries.",
          ja: "バッチインデックス処理、大容量の自動ルーティング、高度な推論クエリ実行の原資として活用。"
        },
        evidence: {
          en: "Allows developers to transition experiments directly to live customer-facing portals.",
          ja: "開発環境での試作から、本番の一般顧客向けWebポータルへのダイレクトな移行を支援。"
        }
      },
      {
        id: "con-val",
        label: "Token Volume Equivalence",
        type: "solid",
        badge: "quota",
        description: {
          en: "Supports millions of lightweight Flash tokens or thousands of deep reasoning steps per user.",
          ja: "1ユーザーあたり、軽量Flashモデルなら数百万トークン、Proモデルなら数千回の対話をカバー。"
        },
        evidence: {
          en: "Calculator details: Dynamic equivalents based on selectable user mixes (refer to CFO tab).",
          ja: "計算式の詳細：ユーザーの想定利用率に基づき動的にトークン量を算出（CFOタブを参照）。"
        }
      }
    ]
  }
];

// ==========================================
// RESEARCH LEDGER DATA (Output A)
// ==========================================
interface LedgerItem {
  claim: string;
  entitlement: string;
  source: string;
  date: string;
  confidence: "High" | "Medium" | "Low";
  caveat: string;
}

const LEDGER_DATA: LedgerItem[] = [
  {
    claim: "Gemini Workspace Integration",
    entitlement: "Unlimited access to Gemini in Workspace (Gmail, Docs, Sheets, Slides, Drive) for licensed users.",
    source: "Google Workspace Admin Entitlement Matrix",
    date: "June 2026",
    confidence: "High",
    caveat: "Subject to fair use policies and workspace quota limitations."
  },
  {
    claim: "NotebookLM Enterprise Inclusion",
    entitlement: "Full rights to access, create, share, and publish organizational notebooks.",
    source: "Google Workspace & NotebookLM Enterprise Product Docs",
    date: "June 2026",
    confidence: "High",
    caveat: "Subject to central domain admin restrictions on external document sharing."
  },
  {
    claim: "NotebookLM Quotas",
    entitlement: "100 notebooks per user, 50 sources per notebook, 500k words per source.",
    source: "NotebookLM Enterprise Resource Limits Table",
    date: "June 2026",
    confidence: "High",
    caveat: "Storage pools are aggregated at the Workspace domain level."
  },
  {
    claim: "$30 PUPM Consumption Credit",
    entitlement: "USD $30 equivalent per user per month credit pooled for AGY/Generative AI SKUs.",
    source: "Customer-specific deal terms — check signed order form",
    date: "June 2026",
    confidence: "High",
    caveat: "Customer-specific entitlement — validate against signed order form. Credits may expire monthly."
  },
  {
    claim: "Data Grounding Connectors",
    entitlement: "Native connectors (SharePoint, Confluence, Jira, Salesforce) with document-level security.",
    source: "Google Cloud Search Connector SDK Documentation",
    date: "June 2026",
    confidence: "High",
    caveat: "Third-party connector configurations may require separate subscription/licenses for the source SaaS."
  },
  {
    claim: "Pooled Storage Allocation",
    entitlement: "75 GiB pooled storage and search indexing per user monthly for grounding.",
    source: "Gemini Enterprise Plus Licensing Quotas",
    date: "June 2026",
    confidence: "High",
    caveat: "Storage and indexing limits are pooled; high-volume ingestion will count against total pool."
  },
  {
    claim: "Gemini Code Assist Standard",
    entitlement: "Coding assistant integrated in standard IDEs (VS Code, IntelliJ, Cloud Workstations).",
    source: "Google Cloud Gemini Developer Services Entitlement",
    date: "June 2026",
    confidence: "Medium",
    caveat: "Verify if explicitly bundled in the customer's signed contract. Sometimes billed separately."
  },
  {
    claim: "Data Residency (Japan/APAC)",
    entitlement: "Customer controls localization: choice of Tokyo, Osaka, Singapore, Sydney storage.",
    source: "Google Cloud Compliance & Trust Center",
    date: "June 2026",
    confidence: "High",
    caveat: "Applies to stored data (data-at-rest); processing routing may depend on model capacity endpoints."
  }
];

export default function GeminiPlusShowcase() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeTab, setActiveTab] = useState<"summary" | "mindmap" | "calculator" | "ledger">("summary");
  const [strategyLens, setStrategyLens] = useState<"exec" | "entitlement" | "cfo" | "cio" | "adoption">("exec");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    productivity: true,
    notebooklm: true,
    consumption: true
  });

  // Calculator State Variables
  const [seats, setSeats] = useState<number>(5000);
  const [term, setTerm] = useState<number>(12);
  const [adoption, setAdoption] = useState<number>(80);
  const [activeUserRate, setActiveUserRate] = useState<number>(70);
  const [creditUtil, setCreditUtil] = useState<number>(60);
  const [interactionsPerDay, setInteractionsPerDay] = useState<number>(15);
  const [inputTokens, setInputTokens] = useState<number>(10000);
  const [outputTokens, setOutputTokens] = useState<number>(2000);
  const [hourlyRate, setHourlyRate] = useState<number>(45);
  const [minutesSavedPerDay, setMinutesSavedPerDay] = useState<number>(20);
  const [daysPerYear, setDaysPerYear] = useState<number>(240);

  // Potentially Displaced Tools state
  const [displaceCopilot, setDisplaceCopilot] = useState<boolean>(true);
  const [displaceNotion, setDisplaceNotion] = useState<boolean>(true);
  const [displaceSlackAI, setDisplaceSlackAI] = useState<boolean>(false);
  const [displaceSearch, setDisplaceSearch] = useState<boolean>(true);

  const t = i18n[lang];

  // Helper toggle for nodes
  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculator Math Calculations
  const calc = useMemo(() => {
    // 1. Total Subscription Commitment
    const totalCommitment = seats * 30 * term;
    // 2. Available Credit Pool
    const totalCredit = seats * 30 * term;
    // 3. Utilized Credit Value
    const utilizedCredit = totalCredit * (adoption / 100) * (creditUtil / 100);
    // 4. At-risk unused credit
    const atRiskCredit = totalCredit - utilizedCredit;

    // 5. Displaced Tools Value (per user monthly)
    let monthlyDisplacePerUser = 0;
    if (displaceCopilot) monthlyDisplacePerUser += 30;
    if (displaceNotion) monthlyDisplacePerUser += 8;
    if (displaceSlackAI) monthlyDisplacePerUser += 10;
    if (displaceSearch) monthlyDisplacePerUser += 5;

    const totalDisplacedAnnual = seats * monthlyDisplacePerUser * 12 * (term / 12) * (adoption / 100);

    // 6. Productivity Value
    // Hours saved per year = seats * adoption% * activeUser% * (minSaved / 60) * workingDays * (term / 12)
    const activeSeats = seats * (adoption / 100) * (activeUserRate / 100);
    const totalHoursSaved = activeSeats * (minutesSavedPerDay / 60) * daysPerYear * (term / 12);
    const totalProductivityValue = totalHoursSaved * hourlyRate;

    // 7. Total Modeled Value
    const totalValue = utilizedCredit + totalDisplacedAnnual + totalProductivityValue;

    // 8. ROI Ratio
    const roiRatio = totalCommitment > 0 ? totalValue / totalCommitment : 0;

    // 9. Break-even seat adoption rate (needed to cover total commitment)
    // Commitment = utilizedCredit(adoption) + displaced(adoption) + productivity(adoption)
    // We compute the value of 100% adoption and divide commitment by it
    const valueAt100Adoption =
      (totalCredit * (creditUtil / 100)) +
      (seats * monthlyDisplacePerUser * 12 * (term / 12)) +
      (seats * (activeUserRate / 100) * (minutesSavedPerDay / 60) * daysPerYear * (term / 12) * hourlyRate);
    const breakevenAdoption = valueAt100Adoption > 0 ? (totalCommitment / valueAt100Adoption) * 100 : 0;

    // 10. Break-even minutes saved per user per month
    // We want: Commitment - utilizedCredit - displaced = productivityValue(minSaved)
    // productivityValue = activeSeats * (minSaved / 60) * (12 working months * 20 days/mo) * hourlyRate * term/12
    const remainingToCover = Math.max(0, totalCommitment - utilizedCredit - totalDisplacedAnnual);
    const activeUsersCount = seats * (adoption / 100) * (activeUserRate / 100);
    const valuePerMinutePerUserPerMonth = activeUsersCount > 0
      ? (1 / 60) * 20 * hourlyRate // 20 working days per month
      : 0;
    const totalValuePerMinutePerMonth = activeUsersCount * valuePerMinutePerUserPerMonth * term;
    const breakevenMinutes = totalValuePerMinutePerMonth > 0
      ? remainingToCover / totalValuePerMinutePerMonth
      : 0;

    return {
      totalCommitment,
      totalCredit,
      utilizedCredit,
      atRiskCredit,
      totalDisplacedAnnual,
      totalProductivityValue,
      totalValue,
      roiRatio,
      breakevenAdoption: Math.min(100, Math.max(0, breakevenAdoption)),
      breakevenMinutes: Math.max(0, breakevenMinutes)
    };
  }, [
    seats,
    term,
    adoption,
    activeUserRate,
    creditUtil,
    minutesSavedPerDay,
    daysPerYear,
    hourlyRate,
    displaceCopilot,
    displaceNotion,
    displaceSlackAI,
    displaceSearch
  ]);

  // Model & Workload scenarios (Gemini 1.5 rates on Vertex AI)
  // Input: Flash $0.075 / Pro $1.25. Output: Flash $0.30 / Pro $3.75.
  const workloadScenarios = useMemo(() => {
    // Credit value per user per month = $30. Annual = $360.
    const monthlyBudget = 30;

    // Scenario 1: Input-only Theoretical Maximum (Gemini 1.5 Flash)
    const s1Cost = 0.075 / 1e6;
    const s1Interactions = monthlyBudget / (inputTokens * s1Cost);

    // Scenario 2: Balanced Assistant Workload (Gemini 1.5 Pro)
    // 80% input, 20% output
    const s2InCost = 1.25 / 1e6;
    const s2OutCost = 3.75 / 1e6;
    const s2CostPerInteraction = (inputTokens * s2InCost) + (outputTokens * s2OutCost);
    const s2Interactions = s2CostPerInteraction > 0 ? monthlyBudget / s2CostPerInteraction : 0;

    // Scenario 3: Reasoning-intensive Workload (Gemini 1.5 Pro)
    // 60% input, 40% output
    const s3InCost = 1.25 / 1e6;
    const s3OutCost = 3.75 / 1e6;
    const s3CostPerInteraction = (inputTokens * 0.8 * s3InCost) + (outputTokens * 1.5 * s3OutCost);
    const s3Interactions = s3CostPerInteraction > 0 ? monthlyBudget / s3CostPerInteraction : 0;

    // Scenario 4: High-volume Flash Workload (Gemini 1.5 Flash)
    // 90% input, 10% output
    const s4InCost = 0.075 / 1e6;
    const s4OutCost = 0.30 / 1e6;
    const s4CostPerInteraction = (inputTokens * 2 * s4InCost) + (outputTokens * 0.5 * s4OutCost);
    const s4Interactions = s4CostPerInteraction > 0 ? monthlyBudget / s4CostPerInteraction : 0;

    // Scenario 5: Deep Research Workload (Gemini 1.5 Pro + Grounding)
    // 14k input, 6k output + $0.002 search grounding fee
    const researchIn = 14000;
    const researchOut = 6000;
    const groundingFee = 0.002;
    const researchCost = (researchIn * s2InCost) + (researchOut * s2OutCost) + groundingFee;
    const researchInteractions = researchCost > 0 ? monthlyBudget / researchCost : 0;

    return [
      {
        name: {
          en: "1. Input-Only Theoretical Limit (Flash 1.5)",
          ja: "1. インプット特化上限モデル (Flash 1.5)"
        },
        inputs: "100%",
        outputs: "0%",
        cost: s1Cost * inputTokens,
        monthly: s1Interactions,
        annual: s1Interactions * 12,
        notes: {
          en: "Absolute cost ceiling, useful for telemetry pipelines.",
          ja: "テレメトリ処理などのインプット中心タスクの理論値。"
        }
      },
      {
        name: {
          en: "2. Balanced Assistant (Pro 1.5)",
          ja: "2. バランス型アシスタント (Pro 1.5)"
        },
        inputs: "80%",
        outputs: "20%",
        cost: s2CostPerInteraction,
        monthly: s2Interactions,
        annual: s2Interactions * 12,
        notes: {
          en: "Standard enterprise knowledge search and drafting.",
          ja: "社内ナレッジの横断検索、文書ドラフト作成の標準。"
        }
      },
      {
        name: {
          en: "3. Reasoning-Intensive (Pro 1.5)",
          ja: "3. 思考・推論高負荷 (Pro 1.5)"
        },
        inputs: "60%",
        outputs: "40%",
        cost: s3CostPerInteraction,
        monthly: s3Interactions,
        annual: s3Interactions * 12,
        notes: {
          en: "Complex logical tasks, code explanations, data audits.",
          ja: "複雑なロジック処理、コード解説、データ監査に最適。"
        }
      },
      {
        name: {
          en: "4. High-Volume Routing (Flash 1.5)",
          ja: "4. 大量処理ルーティング (Flash 1.5)"
        },
        inputs: "90%",
        outputs: "10%",
        cost: s4CostPerInteraction,
        monthly: s4Interactions,
        annual: s4Interactions * 12,
        notes: {
          en: "Classification, data extraction, and agent routing.",
          ja: "分類、データ抽出、エージェント用自動振り分け。"
        }
      },
      {
        name: {
          en: "5. Agentic / Deep Research (Pro + Grounding)",
          ja: "5. エージェント/調査 (Pro + 検索連動)"
        },
        inputs: "70%",
        outputs: "30%",
        cost: researchCost,
        monthly: researchInteractions,
        annual: researchInteractions * 12,
        notes: {
          en: "Includes $0.002 per-request Google Search grounding fee.",
          ja: "Google検索連動手数料（1リクエストあたり $0.002）を含む。"
        }
      }
    ];
  }, [inputTokens, outputTokens]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      {/* HEADER BANNER */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow-sm">
                Gemini Enterprise Plus
              </span>
              <span className="bg-slate-800 text-slate-400 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full tracking-wider">
                APAC & Japan
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
              {t.title}
            </h1>
            <p className="text-xs text-slate-400">
              {t.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "en" ? "ja" : "en")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors border border-slate-700 shadow-inner"
            >
              <Globe size={14} className="text-slate-400" />
              <span>{t.activeLanguage}</span>
            </button>

            {/* Contract Warning Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-medium text-amber-400 max-w-xs">
              <AlertTriangle size={14} className="shrink-0 text-amber-500" />
              <span className="leading-snug text-left">{t.contractWarning}</span>
            </div>
          </div>
        </div>
      </header>

      {/* CORE ECONOMIC STATEMENT HERO */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-900 px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/40 border border-slate-800 text-xs font-medium text-indigo-300">
            <Cpu size={14} className="animate-pulse text-indigo-400" />
            <span>Commercial Baseline construct</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            “$30 PUPM unlocks an enterprise AI platform and a <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">$30 PUPM AI consumption pool</span>”
          </h2>

          {/* Dynamic 2-column visual of nominal fee vs consumption credit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-4">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-left relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1">{t.payingText}</div>
              <div className="text-3xl font-black text-white flex items-baseline gap-1">
                $30 <span className="text-xs font-semibold text-slate-400">{t.pupm}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Licensed workspace capabilities including NotebookLM Enterprise, Search, Code Assist, and security controls.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-left relative overflow-hidden group hover:border-slate-700 transition-colors">
              <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl" />
              <div className="text-[10px] uppercase font-bold text-purple-400 tracking-widest mb-1">{t.creditText}</div>
              <div className="text-3xl font-black text-white flex items-baseline gap-1">
                +$30 <span className="text-xs font-semibold text-slate-400">{t.pupm}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Eligible Vertex AI and Google Cloud agent SKUs token credits. 100% recoup of license spend.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex border-b border-slate-850 overflow-x-auto scrollbar-none gap-2">
          {(["summary", "mindmap", "calculator", "ledger"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all duration-200 ${
                activeTab === tab
                  ? "border-blue-500 text-white bg-slate-900/40"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab === "summary" && t.summaryTab}
              {tab === "mindmap" && t.mindmapTab}
              {tab === "calculator" && t.calculatorTab}
              {tab === "ledger" && t.ledgerTab}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === "summary" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Executive Q&A Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Q1 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">Q1</div>
                  <h3 className="text-sm font-bold text-white">What did the customer pay?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The customer committed to a seat subscription pricing of <span className="text-white font-semibold">USD $30 per user per month</span> (PUPM). This equals <span className="text-white font-semibold">USD $360 per user annually</span>.
                  </p>
                </div>

                {/* Q2 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">Q2</div>
                  <h3 className="text-sm font-bold text-white">What is contractually included?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Gemini Enterprise Plus Workspace licenses, NotebookLM Enterprise, enterprise search connectors, pooled storage/indexing (75 GiB per seat), and secure governance controls.
                  </p>
                </div>

                {/* Q3 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">Q3</div>
                  <h3 className="text-sm font-bold text-white">What is the consumption-credit value?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    An additional <span className="text-white font-semibold">USD $30 PUPM</span> of first-party AI consumption credit. This acts as a dollar-for-dollar offset, creating a pool for live production workloads.
                  </p>
                </div>

                {/* Q4 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">Q4</div>
                  <h3 className="text-sm font-bold text-white">What can the credit fund?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Vertex AI token predictions (Gemini Flash/Pro), context caching hits, external document search indexing, custom Agent workflows, and Grounding queries.
                  </p>
                </div>

                {/* Q5 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 text-sm font-bold">Q5</div>
                  <h3 className="text-sm font-bold text-white">What value is realized beyond tokens?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Reference replacement values from displacing point tools (Microsoft Copilot, Notion AI, standalone search engines), employee productivity savings, and risk avoidance from VPC-SC.
                  </p>
                </div>

                {/* Q6 */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-3 border-dashed border-indigo-500/30">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-sm font-bold">Q6</div>
                  <h3 className="text-sm font-bold text-white">What must the customer do?</h3>
                  <p className="text-xs text-slate-400 leading-relaxed text-indigo-200">
                    Sellers must drive user activation and direct developers to build high-volume workflows against the credits. The primary threat to ROI is under-utilization and idle seats.
                  </p>
                </div>
              </div>

              {/* Four Value Stack Layers Diagram */}
              <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-6">
                <h3 className="text-md font-bold text-white mb-6 text-center">
                  The Four Concentric Layers of the Value Stack
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Layer A */}
                  <div className="bg-slate-900/60 border-l-4 border-emerald-500 rounded-r-xl p-4 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Layer A</div>
                    <h4 className="text-xs font-bold text-white">Contracted Monetary Value</h4>
                    <p className="text-[11px] text-slate-400">
                      Direct, guaranteed contract terms: $30 PUPM consumption credit, 75 GiB storage pooled indexing.
                    </p>
                  </div>

                  {/* Layer B */}
                  <div className="bg-slate-900/60 border-l-4 border-blue-500 rounded-r-xl p-4 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Layer B</div>
                    <h4 className="text-xs font-bold text-white">Reference Replacement</h4>
                    <p className="text-[11px] text-slate-400">
                      Avoided license costs from displacing Notion AI, Microsoft Copilot, and individual search/indexing plugins.
                    </p>
                  </div>

                  {/* Layer C */}
                  <div className="bg-slate-900/60 border-l-4 border-purple-500 rounded-r-xl p-4 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Layer C</div>
                    <h4 className="text-xs font-bold text-white">Utilization-Driven Business</h4>
                    <p className="text-[11px] text-slate-400">
                      Illustrative returns based on employee productivity hours saved and faster software deployment sprints.
                    </p>
                  </div>

                  {/* Layer D */}
                  <div className="bg-slate-900/60 border-l-4 border-indigo-500 rounded-r-xl p-4 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Layer D</div>
                    <h4 className="text-xs font-bold text-white">Strategic Option Value</h4>
                    <p className="text-[11px] text-slate-400">
                      Qualitative agility: progression from chatbot assistant to custom local agency flows on a single secure platform.
                    </p>
                  </div>
                </div>
              </div>

              {/* APAC Localization Panel */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Globe className="text-blue-400 w-4 h-4" />
                  {t.regionalFocus}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200">{t.residencyJP}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Sovereign compliance: options to pin data resting within Tokyo and Osaka, addressing strict local privacy mandates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200">{t.langSupport}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Double-byte optimizations: local models are trained for maximum context accuracy in Japanese, Korean, and Chinese.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200">{t.subsidiaryOrch}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        APAC business groups: central governance control lets regional offices publish localized workflow agents.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950/40 border border-slate-900">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-200">{t.frontlineEnablement}</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Scaling productivity: low-cost seat licenses for store clerks or logistics handlers driven by simple custom agents.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: INTERACTIVE VALUE MAP (MIND MAP) */}
          {activeTab === "mindmap" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Strategy Lens Toggles */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-blue-400" />
                  <span className="text-xs font-bold text-slate-300">{t.viewToggle}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(["exec", "entitlement", "cfo", "cio", "adoption"] as const).map((lens) => (
                    <button
                      key={lens}
                      onClick={() => setStrategyLens(lens)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        strategyLens === lens
                          ? "bg-blue-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {lens === "exec" && t.viewExec}
                      {lens === "entitlement" && t.viewEntitlement}
                      {lens === "cfo" && t.viewCfo}
                      {lens === "cio" && t.viewCio}
                      {lens === "adoption" && t.viewAdoption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mindmap visual notation legend */}
              <div className="flex flex-wrap gap-4 justify-center text-[10px] bg-slate-900/20 py-2 border-y border-slate-900">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500 block" />
                  <span className="text-slate-400">Included Platform Feature</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500 block" />
                  <span className="text-slate-400">Consumption Credit Funded</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500 block" />
                  <span className="text-slate-400">Quantifiable Dollar Value</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded border border-dashed border-slate-400 block" />
                  <span className="text-slate-400">Illustrative Return</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="text-slate-400">Contract Verification Needed</span>
                </div>
              </div>

              {/* Interactive Collapsible Mindmap Workspace */}
              <div className="relative border border-slate-900 rounded-xl bg-slate-950 p-4 md:p-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.1),transparent)] pointer-events-none" />

                {/* Mindmap Center Node */}
                <div className="flex flex-col items-center text-center max-w-md mx-auto mb-10 relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white/20 mb-3">
                    <DollarSign size={28} className="text-white" />
                  </div>
                  <h3 className="text-md font-extrabold text-white">$30 PUPM Enterprise AI Construct</h3>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Workspace Licensed Productivity &amp; $30 PUPM Vertex AI Consumption Pool
                  </p>
                </div>

                {/* Mindmap Branches Tree (Accordion-style for high-density information) */}
                <div className="space-y-4 max-w-4xl mx-auto relative">
                  {MIND_MAP_DATA.map((branch) => {
                    const isExpanded = !!expandedNodes[branch.id];
                    return (
                      <div
                        key={branch.id}
                        className={`border rounded-xl transition-all duration-300 ${
                          isExpanded
                            ? "bg-slate-900/40 border-slate-800 shadow-md"
                            : "bg-slate-900/10 border-slate-900/60 hover:border-slate-800"
                        }`}
                      >
                        {/* Branch header click handler */}
                        <div
                          onClick={() => toggleNode(branch.id)}
                          className="flex items-center justify-between p-4 cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-3">
                            {/* Branch Accent Color Indicator */}
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                branch.badge === "monetary"
                                  ? "bg-emerald-500"
                                  : branch.badge === "consumption"
                                  ? "bg-purple-500"
                                  : branch.badge === "warning"
                                  ? "bg-amber-500"
                                  : "bg-blue-500"
                              }`}
                            />
                            <div>
                              <h4 className="text-xs md:text-sm font-extrabold text-white">
                                {branch.label}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {lang === "en" ? branch.description.en : branch.description.ja}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Strategy Lens Badge Display */}
                            {strategyLens === "exec" && branch.badge === "illustrative" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                                Outcome
                              </span>
                            )}
                            {strategyLens === "entitlement" && branch.type === "solid" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                                Included
                              </span>
                            )}
                            {strategyLens === "cfo" && branch.badge === "monetary" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                ROI Offset
                              </span>
                            )}
                            {strategyLens === "cio" && branch.id === "governance" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                                Secure
                              </span>
                            )}

                            {branch.badge === "warning" && (
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                            )}
                            {isExpanded ? (
                              <ChevronDown size={18} className="text-slate-400" />
                            ) : (
                              <ChevronRight size={18} className="text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Collapsible children details */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden border-t border-slate-900 bg-slate-950/60 rounded-b-xl"
                            >
                              <div className="p-4 space-y-4">
                                {/* Branch Evidence Context */}
                                <div className="p-3 bg-slate-900/30 rounded-lg border border-slate-900 text-xs text-slate-300">
                                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                                    <BookOpen size={13} className="text-blue-400" />
                                    Strategic Context
                                  </div>
                                  {lang === "en" ? branch.evidence.en : branch.evidence.ja}
                                </div>

                                {/* Child Nodes: Capability -> Use Case -> Value */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                                  {branch.children?.map((child) => (
                                    <div
                                      key={child.id}
                                      className={`p-3.5 rounded-lg border text-left space-y-2 relative overflow-hidden ${
                                        child.badge === "monetary"
                                          ? "border-emerald-500/20 bg-emerald-500/5"
                                          : child.badge === "consumption"
                                          ? "border-purple-500/20 bg-purple-500/5"
                                          : child.badge === "quota"
                                          ? "border-slate-800 bg-slate-900/30"
                                          : "border-slate-850 bg-slate-900/20"
                                      }`}
                                    >
                                      {/* Status Badge */}
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold text-white">
                                          {child.label}
                                        </span>
                                        {child.badge === "monetary" && (
                                          <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide">
                                            $ Value
                                          </span>
                                        )}
                                        {child.badge === "consumption" && (
                                          <span className="bg-purple-500/20 text-purple-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide">
                                            Credit
                                          </span>
                                        )}
                                        {child.badge === "quota" && (
                                          <span className="bg-slate-800 text-slate-400 text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide">
                                            Quota
                                          </span>
                                        )}
                                      </div>

                                      <p className="text-[11px] text-slate-400 leading-snug">
                                        {lang === "en" ? child.description.en : child.description.ja}
                                      </p>

                                      <div className="text-[10px] text-slate-500 border-t border-slate-900/80 pt-2 leading-relaxed">
                                        <span className="font-semibold text-slate-400">Proof:</span>{" "}
                                        {lang === "en" ? child.evidence.en : child.evidence.ja}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CALCULATOR & ECONOMIC MODEL */}
          {activeTab === "calculator" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Financial Calculator Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sliders Input Panel */}
                <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-6 lg:col-span-1">
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-400" />
                    {t.calcHeader}
                  </h3>

                  {/* Slider 1: Seats */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{t.seatCount}</span>
                      <span className="text-white font-bold">{seats.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={100}
                      max={25000}
                      step={100}
                      value={seats}
                      onChange={(e) => setSeats(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider 2: Term */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{t.contractTerm}</span>
                      <span className="text-white font-bold">{term}m</span>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={36}
                      step={12}
                      value={term}
                      onChange={(e) => setTerm(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider 3: Adoption Rate */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{t.adoptionRate}</span>
                      <span className="text-white font-bold">{adoption}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={adoption}
                      onChange={(e) => setAdoption(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider 4: Active Users */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{t.activeUserRate}</span>
                      <span className="text-white font-bold">{activeUserRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={activeUserRate}
                      onChange={(e) => setActiveUserRate(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Slider 5: Credit Util */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{t.creditUtilRate}</span>
                      <span className="text-white font-bold">{creditUtil}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={creditUtil}
                      onChange={(e) => setCreditUtil(Number(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Tool Displacements Checkbox */}
                  <div className="space-y-3 pt-3 border-t border-slate-850">
                    <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      {t.displacedTools}
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displaceCopilot}
                        onChange={(e) => setDisplaceCopilot(e.target.checked)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Microsoft Copilot ($30 PUPM)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displaceNotion}
                        onChange={(e) => setDisplaceNotion(e.target.checked)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Notion AI ($8 PUPM)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displaceSlackAI}
                        onChange={(e) => setDisplaceSlackAI(e.target.checked)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Slack AI ($10 PUPM)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={displaceSearch}
                        onChange={(e) => setDisplaceSearch(e.target.checked)}
                        className="rounded border-slate-800 text-blue-600 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span>Enterprise Search ($5 PUPM)</span>
                    </label>
                  </div>

                  {/* Additional productivity sliders */}
                  <div className="space-y-4 pt-3 border-t border-slate-850">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{t.employeeCost}</span>
                        <span className="text-white font-bold">${hourlyRate}</span>
                      </div>
                      <input
                        type="range"
                        min={15}
                        max={100}
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">{t.minutesSaved}</span>
                        <span className="text-white font-bold">{minutesSavedPerDay} min</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={60}
                        value={minutesSavedPerDay}
                        onChange={(e) => setMinutesSavedPerDay(Number(e.target.value))}
                        className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Outputs Panel */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Headline Financial Metrics Card */}
                  <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        {t.commitment}
                      </div>
                      <div className="text-2xl font-black text-white">
                        ${calc.totalCommitment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {seats.toLocaleString()} seats over {term} months
                      </p>
                    </div>

                    <div className="space-y-1 border-y md:border-y-0 md:border-x border-slate-800 md:px-6 py-4 md:py-0">
                      <div className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        {t.totalVal}
                      </div>
                      <div className="text-2xl font-black text-indigo-400">
                        ${calc.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Credits + Tool savings + Productivity
                      </p>
                    </div>

                    <div className="space-y-1 md:pl-6">
                      <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                        {t.valueCostRatio}
                      </div>
                      <div className="text-2xl font-black text-emerald-400">
                        {calc.roiRatio.toFixed(1)}x
                      </div>
                      <p className="text-[10px] text-slate-500">
                        ROI multiple on spend
                      </p>
                    </div>
                  </div>

                  {/* Detailed calculations table */}
                  <div className="bg-slate-900/20 border border-slate-850 rounded-xl p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                      Value Stack Breakdown
                    </h4>

                    <div className="space-y-3 text-xs">
                      {/* Commit vs Credits */}
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">{t.availCredit}</span>
                        <span className="font-semibold text-white">
                          ${calc.totalCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">{t.utilCredit} ({adoption}% adoption, {creditUtil}% utilization)</span>
                        <span className="font-semibold text-purple-400">
                          ${calc.utilizedCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">{t.riskCredit}</span>
                        <span className="font-semibold text-amber-500">
                          ${calc.atRiskCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Tool displacement savings */}
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">{t.displacedVal}</span>
                        <span className="font-semibold text-emerald-400">
                          +${calc.totalDisplacedAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Productivity Value */}
                      <div className="flex justify-between py-1 border-b border-slate-900">
                        <span className="text-slate-400">
                          {t.prodVal} ({minutesSavedPerDay} mins/day saved)
                        </span>
                        <span className="font-semibold text-emerald-400">
                          +${calc.totalProductivityValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>

                      {/* Break-evens */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-[11px]">
                        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                          <div className="text-slate-400 mb-1">{t.breakevenAdoption}</div>
                          <div className="text-sm font-bold text-white">{calc.breakevenAdoption.toFixed(1)}%</div>
                        </div>
                        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-850">
                          <div className="text-slate-400 mb-1">{t.breakevenMinutes}</div>
                          <div className="text-sm font-bold text-white">{calc.breakevenMinutes.toFixed(1)} min</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Economic Model Workloads Scenarios (Section 3 item 7) */}
              <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">{t.modelScenarios}</h3>
                  <p className="text-xs text-slate-400">
                    Input parameters used: {inputTokens.toLocaleString()} input / {outputTokens.toLocaleString()} output tokens per interaction.
                  </p>
                </div>

                {/* Scenarios Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="py-2.5 pr-4">Workload Profile</th>
                        <th className="py-2.5 px-4 text-center">Mix (In/Out)</th>
                        <th className="py-2.5 px-4 text-right">Cost / Call</th>
                        <th className="py-2.5 px-4 text-right">Calls / Month ($30)</th>
                        <th className="py-2.5 px-4 text-right">Calls / Year ($360)</th>
                        <th className="py-2.5 pl-4 hidden md:table-cell">Usage Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {workloadScenarios.map((sc, i) => (
                        <tr key={i} className="hover:bg-slate-900/20 text-slate-300">
                          <td className="py-3 pr-4 font-bold text-white">
                            {lang === "en" ? sc.name.en : sc.name.ja}
                          </td>
                          <td className="py-3 px-4 text-center text-slate-400">{sc.inputs} / {sc.outputs}</td>
                          <td className="py-3 px-4 text-right font-mono">${sc.cost.toFixed(4)}</td>
                          <td className="py-3 px-4 text-right font-bold text-indigo-400">{Math.round(sc.monthly).toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold text-purple-400">{Math.round(sc.annual).toLocaleString()}</td>
                          <td className="py-3 pl-4 text-slate-400 hidden md:table-cell text-[11px]">
                            {lang === "en" ? sc.notes.en : sc.notes.ja}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[10px] text-slate-500">
                  {t.pricingDisclaimer}
                </p>
              </div>

              {/* Economic Scaling Scenarios (1K, 5K, 10K, 25K) */}
              <div className="bg-slate-900/30 border border-slate-850 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Deal Scaling Economics (PUPM pool scale)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1000, 5000, 10000, 25000].map((size) => {
                    const monthlyCredit = size * 30;
                    const annualCredit = size * 360;
                    return (
                      <div key={size} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 text-left space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          {size.toLocaleString()} Users
                        </div>
                        <div className="text-lg font-black text-white">
                          ${annualCredit.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">/yr</span>
                        </div>
                        <p className="text-[10px] text-indigo-300">
                          ${monthlyCredit.toLocaleString()}/mo credit pool
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: RESEARCH LEDGER */}
          {activeTab === "ledger" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Entitlement & Claim Verification Ledger</h3>
                <span className="text-[10px] text-slate-400">Checked as of June 2026</span>
              </div>

              {/* Ledger Table */}
              <div className="bg-slate-900/20 border border-slate-850 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="py-3 px-4">Claim Concept</th>
                        <th className="py-3 px-4">Verified Entitlement</th>
                        <th className="py-3 px-4">Official Source</th>
                        <th className="py-3 px-4 text-center">Confidence</th>
                        <th className="py-3 px-4">Commercial Caveats</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300">
                      {LEDGER_DATA.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-900/10">
                          <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{item.claim}</td>
                          <td className="py-3 px-4 leading-relaxed">{item.entitlement}</td>
                          <td className="py-3 px-4 text-slate-400">{item.source}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                item.confidence === "High"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}
                            >
                              {item.confidence}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-400 leading-snug">{item.caveat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <p>© 2026 Google Cloud APAC Commercial Strategy Team. Proprietary and confidential.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="hover:text-white transition-colors">
              Showcase Home
            </Link>
            <span className="text-slate-800">|</span>
            <span className="text-slate-400">Workspace Tenant: Gemini Enterprise Plus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
