/**
 * Interface strings translated by hand for the navigation and controls, so they appear instantly and read
 * naturally. Everything else on a page is machine-translated on demand (see LanguageMirror and
 * /api/google-ai/translate) and says so. English is the authoritative text.
 */
import type { LangId } from "./taxonomy";

type Dict = Record<string, string>;

const ko: Dict = {
  Today: "오늘", Industries: "산업별", "Case studies": "고객 사례", Quiz: "퀴즈", Graph: "그래프",
  "All developments": "전체 소식", Briefing: "브리핑", "AI stack": "AI 스택", Models: "모델", Compare: "비교", Pricing: "가격",
  Workloads: "워크로드", Timeline: "타임라인", "Sources and method": "출처 및 방법론", Reference: "참고 자료",
  Region: "지역", Language: "언어", Detail: "상세 수준", "All of Asia-Pacific": "아시아 태평양 전체", Ask: "질문하기",
  Executive: "요약", Analyst: "분석", Technical: "기술", Search: "검색",
  Korea: "한국", India: "인도", "South East Asia": "동남아시아", Japan: "일본", "Australia and New Zealand": "호주·뉴질랜드", China: "중국", "Hong Kong and Taiwan": "홍콩·대만",
  "Digital natives": "디지털 네이티브", "Enterprise traditional accounts": "전통 엔터프라이즈", "Public sector": "공공 부문", Education: "교육",
  "Must know": "꼭 알아야 할 소식", "What to say": "고객에게 전할 말", "Watch out": "주의할 점", Sources: "출처", "Coming up": "예정된 일정",
  "Machine translation. The English text is authoritative.": "기계 번역입니다. 영어 원문이 기준입니다.",
};
const ja: Dict = {
  Today: "今日", Industries: "業種別", "Case studies": "導入事例", Quiz: "クイズ", Graph: "グラフ",
  "All developments": "すべての動向", Briefing: "ブリーフィング", "AI stack": "AIスタック", Models: "モデル", Compare: "比較", Pricing: "料金",
  Workloads: "ワークロード", Timeline: "タイムライン", "Sources and method": "出典と方法", Reference: "リファレンス",
  Region: "地域", Language: "言語", Detail: "詳細度", "All of Asia-Pacific": "アジア太平洋全体", Ask: "質問する",
  Executive: "要約", Analyst: "分析", Technical: "技術", Search: "検索",
  Korea: "韓国", India: "インド", "South East Asia": "東南アジア", Japan: "日本", "Australia and New Zealand": "オーストラリア・ニュージーランド", China: "中国", "Hong Kong and Taiwan": "香港・台湾",
  "Digital natives": "デジタルネイティブ", "Enterprise traditional accounts": "従来型エンタープライズ", "Public sector": "公共部門", Education: "教育",
  "Must know": "必ず押さえる動向", "What to say": "お客様への伝え方", "Watch out": "注意点", Sources: "出典", "Coming up": "今後の予定",
  "Machine translation. The English text is authoritative.": "機械翻訳です。英語の原文が正となります。",
};
const zhCN: Dict = {
  Today: "今日", Industries: "行业", "Case studies": "客户案例", Quiz: "测验", Graph: "关系图",
  "All developments": "全部动态", Briefing: "简报", "AI stack": "AI 技术栈", Models: "模型", Compare: "对比", Pricing: "价格",
  Workloads: "工作负载", Timeline: "时间线", "Sources and method": "来源与方法", Reference: "参考资料",
  Region: "地区", Language: "语言", Detail: "详细程度", "All of Asia-Pacific": "整个亚太地区", Ask: "提问",
  Executive: "概要", Analyst: "分析", Technical: "技术", Search: "搜索",
  Korea: "韩国", India: "印度", "South East Asia": "东南亚", Japan: "日本", "Australia and New Zealand": "澳大利亚和新西兰", China: "中国", "Hong Kong and Taiwan": "香港和台湾",
  "Digital natives": "数字原生企业", "Enterprise traditional accounts": "传统企业客户", "Public sector": "公共部门", Education: "教育",
  "Must know": "必须了解", "What to say": "对客户怎么说", "Watch out": "注意事项", Sources: "来源", "Coming up": "即将到来",
  "Machine translation. The English text is authoritative.": "机器翻译，以英文原文为准。",
};
const zhTW: Dict = {
  Today: "今日", Industries: "產業", "Case studies": "客戶案例", Quiz: "測驗", Graph: "關聯圖",
  "All developments": "全部動態", Briefing: "簡報", "AI stack": "AI 技術堆疊", Models: "模型", Compare: "比較", Pricing: "價格",
  Workloads: "工作負載", Timeline: "時間軸", "Sources and method": "來源與方法", Reference: "參考資料",
  Region: "地區", Language: "語言", Detail: "詳細程度", "All of Asia-Pacific": "整個亞太地區", Ask: "提問",
  Executive: "摘要", Analyst: "分析", Technical: "技術", Search: "搜尋",
  Korea: "韓國", India: "印度", "South East Asia": "東南亞", Japan: "日本", "Australia and New Zealand": "澳洲與紐西蘭", China: "中國", "Hong Kong and Taiwan": "香港與台灣",
  "Digital natives": "數位原生企業", "Enterprise traditional accounts": "傳統企業客戶", "Public sector": "公部門", Education: "教育",
  "Must know": "必須掌握", "What to say": "如何向客戶說明", "Watch out": "注意事項", Sources: "來源", "Coming up": "即將到來",
  "Machine translation. The English text is authoritative.": "機器翻譯，以英文原文為準。",
};
const id: Dict = {
  Today: "Hari ini", Industries: "Industri", "Case studies": "Studi kasus", Quiz: "Kuis", Graph: "Graf",
  "All developments": "Semua perkembangan", Briefing: "Ringkasan", "AI stack": "Tumpukan AI", Models: "Model", Compare: "Bandingkan", Pricing: "Harga",
  Workloads: "Beban kerja", Timeline: "Linimasa", "Sources and method": "Sumber dan metode", Reference: "Referensi",
  Region: "Wilayah", Language: "Bahasa", Detail: "Tingkat detail", "All of Asia-Pacific": "Seluruh Asia Pasifik", Ask: "Tanya",
  Executive: "Eksekutif", Analyst: "Analis", Technical: "Teknis", Search: "Cari",
  Korea: "Korea", India: "India", "South East Asia": "Asia Tenggara", Japan: "Jepang", "Australia and New Zealand": "Australia dan Selandia Baru", China: "Tiongkok", "Hong Kong and Taiwan": "Hong Kong dan Taiwan",
  "Digital natives": "Perusahaan digital", "Enterprise traditional accounts": "Perusahaan tradisional", "Public sector": "Sektor publik", Education: "Pendidikan",
  "Must know": "Wajib tahu", "What to say": "Yang perlu disampaikan", "Watch out": "Perlu diperhatikan", Sources: "Sumber", "Coming up": "Yang akan datang",
  "Machine translation. The English text is authoritative.": "Terjemahan mesin. Teks bahasa Inggris adalah acuan.",
};
const th: Dict = {
  Today: "วันนี้", Industries: "อุตสาหกรรม", "Case studies": "กรณีศึกษา", Quiz: "แบบทดสอบ", Graph: "กราฟ",
  "All developments": "ความเคลื่อนไหวทั้งหมด", Briefing: "สรุป", "AI stack": "สแต็ก AI", Models: "โมเดล", Compare: "เปรียบเทียบ", Pricing: "ราคา",
  Workloads: "เวิร์กโหลด", Timeline: "ไทม์ไลน์", "Sources and method": "แหล่งที่มาและวิธีการ", Reference: "ข้อมูลอ้างอิง",
  Region: "ภูมิภาค", Language: "ภาษา", Detail: "ระดับรายละเอียด", "All of Asia-Pacific": "เอเชียแปซิฟิกทั้งหมด", Ask: "ถาม",
  Executive: "ผู้บริหาร", Analyst: "วิเคราะห์", Technical: "เทคนิค", Search: "ค้นหา",
  Korea: "เกาหลี", India: "อินเดีย", "South East Asia": "เอเชียตะวันออกเฉียงใต้", Japan: "ญี่ปุ่น", "Australia and New Zealand": "ออสเตรเลียและนิวซีแลนด์", China: "จีน", "Hong Kong and Taiwan": "ฮ่องกงและไต้หวัน",
  "Digital natives": "ธุรกิจดิจิทัล", "Enterprise traditional accounts": "องค์กรดั้งเดิม", "Public sector": "ภาครัฐ", Education: "การศึกษา",
  "Must know": "ต้องรู้", "What to say": "สิ่งที่ควรบอกลูกค้า", "Watch out": "ข้อควรระวัง", Sources: "แหล่งที่มา", "Coming up": "กำลังจะมาถึง",
  "Machine translation. The English text is authoritative.": "แปลด้วยเครื่อง โปรดยึดข้อความภาษาอังกฤษเป็นหลัก",
};
const vi: Dict = {
  Today: "Hôm nay", Industries: "Ngành", "Case studies": "Tình huống khách hàng", Quiz: "Trắc nghiệm", Graph: "Đồ thị",
  "All developments": "Tất cả diễn biến", Briefing: "Tóm tắt", "AI stack": "Ngăn xếp AI", Models: "Mô hình", Compare: "So sánh", Pricing: "Giá",
  Workloads: "Khối lượng công việc", Timeline: "Dòng thời gian", "Sources and method": "Nguồn và phương pháp", Reference: "Tham khảo",
  Region: "Khu vực", Language: "Ngôn ngữ", Detail: "Mức chi tiết", "All of Asia-Pacific": "Toàn bộ châu Á – Thái Bình Dương", Ask: "Hỏi",
  Executive: "Tổng quan", Analyst: "Phân tích", Technical: "Kỹ thuật", Search: "Tìm kiếm",
  Korea: "Hàn Quốc", India: "Ấn Độ", "South East Asia": "Đông Nam Á", Japan: "Nhật Bản", "Australia and New Zealand": "Úc và New Zealand", China: "Trung Quốc", "Hong Kong and Taiwan": "Hồng Kông và Đài Loan",
  "Digital natives": "Doanh nghiệp số", "Enterprise traditional accounts": "Doanh nghiệp truyền thống", "Public sector": "Khu vực công", Education: "Giáo dục",
  "Must know": "Cần biết", "What to say": "Nên nói gì với khách hàng", "Watch out": "Lưu ý", Sources: "Nguồn", "Coming up": "Sắp tới",
  "Machine translation. The English text is authoritative.": "Bản dịch máy. Văn bản tiếng Anh là bản chuẩn.",
};
const hi: Dict = {
  Today: "आज", Industries: "उद्योग", "Case studies": "केस स्टडी", Quiz: "क्विज़", Graph: "ग्राफ़",
  "All developments": "सभी घटनाक्रम", Briefing: "ब्रीफ़िंग", "AI stack": "AI स्टैक", Models: "मॉडल", Compare: "तुलना", Pricing: "मूल्य",
  Workloads: "वर्कलोड", Timeline: "टाइमलाइन", "Sources and method": "स्रोत और पद्धति", Reference: "संदर्भ",
  Region: "क्षेत्र", Language: "भाषा", Detail: "विवरण स्तर", "All of Asia-Pacific": "पूरा एशिया-प्रशांत", Ask: "पूछें",
  Executive: "सारांश", Analyst: "विश्लेषण", Technical: "तकनीकी", Search: "खोजें",
  Korea: "कोरिया", India: "भारत", "South East Asia": "दक्षिण-पूर्व एशिया", Japan: "जापान", "Australia and New Zealand": "ऑस्ट्रेलिया और न्यूज़ीलैंड", China: "चीन", "Hong Kong and Taiwan": "हांगकांग और ताइवान",
  "Digital natives": "डिजिटल नेटिव", "Enterprise traditional accounts": "पारंपरिक एंटरप्राइज़", "Public sector": "सार्वजनिक क्षेत्र", Education: "शिक्षा",
  "Must know": "ज़रूर जानें", "What to say": "ग्राहक से क्या कहें", "Watch out": "ध्यान रखें", Sources: "स्रोत", "Coming up": "आने वाला",
  "Machine translation. The English text is authoritative.": "मशीन अनुवाद। अंग्रेज़ी पाठ ही मान्य है।",
};

export const UI_STRINGS: Record<Exclude<LangId, "en">, Dict> = { ko, ja, "zh-CN": zhCN, "zh-TW": zhTW, id, th, vi, hi };

/** Language names in English, for the translation service. */
export const LANG_ENGLISH: Record<LangId, string> = { en: "English", ko: "Korean", ja: "Japanese", "zh-CN": "Simplified Chinese", "zh-TW": "Traditional Chinese", id: "Indonesian", th: "Thai", vi: "Vietnamese", hi: "Hindi" };

/** Names that must survive translation unchanged. Longest first. */
export const PROTECTED_TERMS = [
  "Gemini Enterprise Agent Platform", "Google AI Intelligence Hub", "Gemini Enterprise", "Google Cloud", "Google DeepMind", "Google Workspace",
  "Vertex AI", "AI Studio", "Model Armor", "Agent Runtime", "Agent Gateway", "Agent Identity", "Agent Registry", "NotebookLM", "Antigravity",
  "Gemini", "Gemma", "Imagen", "Veo", "Lyria", "Genie", "Claude", "Anthropic", "OpenAI", "ChatGPT", "Microsoft", "Copilot", "Bedrock", "Llama", "Qwen", "DeepSeek",
  "Flash-Lite", "Flash", "Argon", "Carbon", "Hydrogen", "Neon", "TPU", "MCP", "A2A", "ADK", "UCP", "AP2",
];
