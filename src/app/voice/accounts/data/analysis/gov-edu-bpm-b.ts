import type { ProfileAnalysis } from "../../shared";

export const ANALYSIS_GOV_EDU_BPM_B: Record<string, ProfileAnalysis> = {
  "gakken": {
    operatingContext:
      "Gakken Holdings is a Tokyo-listed group built on three unrelated engines: a learning-classroom and cram-school network franchised into neighbourhood classrooms across Japan, an education publishing house supplying textbooks, reference titles and children's books, and a medical-and-welfare division operating serviced senior housing and nursing-care facilities. The classroom business sells to parents household by household, mostly through local instructors who take enquiries on their own phones during the after-school window. The care division sells to adult children arranging a place for a parent, a decision that starts with a phone call, a facility tour and a long chain of follow-up questions about fees, medical cover and move-in dates. Both halves therefore run on inbound Japanese-language voice into thinly staffed regional offices, with headquarters holding the brand but not the conversation.",
    strategicPressure: [
      { text: "Japan's shrinking school-age cohort structurally reduces the addressable classroom market every year, so growth has to come from higher conversion of each enquiry rather than more enquiries.", kind: "verified" },
      { text: "The eldercare division is expanding into a demand pool that is growing exactly as fast as the education one is shrinking, which makes family-facing responsiveness in that division a board-level revenue lever.", kind: "inference" },
      { text: "A franchised classroom network means enquiry handling quality varies instructor by instructor, and headquarters has no measurement of what happens between a parent's first call and an enrollment.", kind: "inference" },
      { text: "Care-facility staffing shortages push administrative phone work onto clinical and care staff, which is the most expensive possible way to answer a fee question.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Gakken's technology identity is publishing production and learning content, not conversational infrastructure. There is no public evidence of a speech or dialogue engineering group, and the group's software investments have gone into digital learning materials and school-facing platforms. A capability that must span franchised classrooms and regulated care facilities is a bought, configured layer.",
    whyNotBuild:
      "Building would mean Japanese speech recognition tuned to elderly callers and children's parents, telephony into hundreds of franchise and facility numbers, orchestration into two entirely different systems of record, and an evaluation regime for care-related conversations. Gakken can fund none of that from an education publishing P&L, and the eldercare regulatory surface makes an unevaluated home-grown agent an unacceptable risk.",
    workflows: [
      {
        name: "Classroom trial-lesson booking and enrollment follow-up",
        friction: "A parent calls a local classroom during the day and reaches nobody because the instructor is teaching; the callback happens after the parent has already booked a trial at a competitor.",
        outcome: "Every parent enquiry is answered within minutes in Japanese, a trial lesson is booked into the classroom's live calendar, and headquarters sees conversion by classroom for the first time.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Classroom scheduling system", "Franchise CRM", "Enrollment and billing master"],
        value: 3, complexity: 2,
      },
      {
        name: "Care-facility enquiry intake and tour coordination",
        friction: "Adult children call multiple facilities in one evening; Gakken's line is answered by care staff who cannot quote fee structures or availability without checking, so the family moves on.",
        outcome: "Structured intake of the resident's care level, budget and preferred area, a tour booked at facilities with real vacancy, and a warm handoff to a facility manager with the whole context written down.",
        channels: ["Voice", "Web", "LINE"],
        systems: ["Facility vacancy register", "Care-services CRM", "Contract and fee schedule"],
        value: 3, complexity: 3,
      },
      {
        name: "Term-cycle re-enrollment and fee-change communication",
        friction: "Continuation confirmations and fee revisions go out as printed notices; the resulting parent questions land unpredictably on instructors and go unrecorded.",
        outcome: "Proactive term-transition outreach that confirms continuation, explains fee changes in plain Japanese and captures withdrawal reasons as structured data.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Enrollment master", "Billing system", "Franchise reporting"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Public course and classroom-search website with enquiry forms", "Local classroom telephone numbers published per location", "Facility-search pages for the senior housing and care business", "Printed and mailed enrollment and fee documentation"],
      gaps: ["No way to book a trial lesson end-to-end outside instructor working hours", "No single record of a parent's enquiry across franchise classrooms", "Care enquiries cannot be matched to live vacancy without a staff callback", "No measurement of enquiry-to-enrollment conversion at classroom level"],
    },
    risks: [
      "Franchise agreements may not give headquarters the right to intercept or record enquiries directed to individual classroom numbers.",
      "Care-facility conversations touch health and care-level information covered by Japan's personal information protection regime, and an agent must never assess a prospective resident's medical suitability.",
      "Elderly callers and their families expect keigo-level politeness and patience; a brusque or repetitive agent damages the care brand more than no agent at all.",
    ],
    economics: { volumeMonthly: 160000, costPerInteraction: 5.2, automationRate: 0.45, basis: "Seller assumptions: blended enquiry and servicing volume across classrooms, publishing customer support and care facilities, at a Japanese assisted-contact cost — validate all three in discovery." },
    pilotScope:
      "Automate trial-lesson booking and enrollment enquiry handling for the directly operated classrooms in two prefectures, in Japanese voice and LINE, integrated to the classroom scheduling calendar.",
    expansion: ["Extend to the franchised classroom network with headquarters-level conversion reporting", "Add care-facility enquiry intake and tour booking across the senior housing portfolio", "Add term-cycle re-enrollment and fee-change outreach across both divisions"],
    stakeholders: ["Head of Education Business Division", "General Manager, Gakken Classroom operations", "Head of Medical and Welfare Division", "Corporate IT / Digital Transformation lead", "Head of Franchise Development"],
    discovery: [
      "When a parent calls a local Gakken classroom at 2pm on a weekday, who actually answers, and what happens if nobody does?",
      "Do you measure enquiry-to-trial-lesson conversion by classroom today, and if so, from what data?",
      "In the care division, how long does it take from a family's first call to a confirmed facility tour?",
      "Which contract terms with franchise classroom operators govern who owns the parent enquiry and its data?",
    ],
    flowTemplate: "admissions",
    scenario: "A parent calls a Gakken classroom at 2pm asking about a trial lesson for her second-grader; the instructor is mid-class, and the agent books the trial into the live calendar before the call ends.",
  },

  "z-kai": {
    operatingContext:
      "Z-kai is a Shizuoka-rooted correspondence-education and exam-preparation group whose reputation rests on rigorous graded assignments for students aiming at Japan's most selective universities. Its core model is subscription: a household signs up for a course level, receives materials on a monthly cadence, submits work for marking and either continues, changes course or lapses at each term boundary. Revenue therefore depends less on new leads than on choosing the right course at sign-up and holding the subscription through the multi-year exam runway. Contact today is a mix of phone enquiry lines, mailed materials, web account pages and a classroom and juku arm, with course-selection counselling — genuinely consultative, genuinely repeatable — the highest-value conversation in the business.",
    strategicPressure: [
      { text: "Japan's declining birth cohort shrinks the pool of exam-track students every year, making retention of each existing subscriber more valuable than incremental acquisition.", kind: "verified" },
      { text: "Digital-first competitors offering video-led exam prep at lower price points have reset parental expectations about response speed and self-service.", kind: "inference" },
      { text: "Course-level mismatch at sign-up is a leading cause of early cancellation, and correcting it requires a counselling conversation that is currently capacity-limited to office hours.", kind: "hypothesis" },
      { text: "Enquiry volume is violently seasonal around the spring enrollment window and exam results, so a fixed counselling team is either idle or overwhelmed.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Z-kai's intellectual property is assignment design and marking pedagogy. Its digital investment has gone into learning delivery and marking workflows, not into speech, telephony or dialogue orchestration. A mid-size education group with a publishing cost base buys conversational capability.",
    whyNotBuild:
      "The counselling conversation requires grounded retrieval across a large, frequently revised course catalogue, Japanese voice quality good enough for anxious parents, and evaluation to prove the agent never over-promises exam outcomes. That is a platform problem, not an education-content problem, and Z-kai has no engineering base from which to attempt it.",
    workflows: [
      {
        name: "Course-selection counselling for new subscribers",
        friction: "A parent researching at 10pm cannot get an answer on which course level suits their child's current grade, so they either guess or defer, and a wrong guess becomes a cancellation two months later.",
        outcome: "Instant, grounded counselling in Japanese that maps the student's year, target universities and current level to the right course, with a human counsellor booked for genuinely ambiguous cases.",
        channels: ["Voice", "LINE", "Web chat"],
        systems: ["Course catalogue and curriculum map", "Subscription CRM", "Counsellor calendar"],
        value: 3, complexity: 2,
      },
      {
        name: "Subscription continuation and lapse prevention",
        friction: "Term-boundary cancellations are noticed after the fact in billing reports; nobody has asked the household why they stopped submitting assignments.",
        outcome: "Timed outreach when submission activity drops, a real conversation about what is not working, and a course change or level adjustment offered instead of a cancellation.",
        channels: ["Voice", "LINE", "Email"],
        systems: ["Assignment submission tracking", "Subscription and billing system", "Course catalogue"],
        value: 3, complexity: 2,
      },
      {
        name: "Materials, marking and account servicing",
        friction: "Undelivered materials, marking turnaround questions and address or payment changes consume the same counselling line that should be selling courses.",
        outcome: "Routine account and delivery questions resolved in-conversation at any hour, freeing the counselling team for the conversations that decide enrollment.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Materials fulfilment system", "Marking workflow", "Billing and account master"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: ["Course catalogue website with level guidance and sample materials", "Telephone enquiry desk staffed in Japanese business hours", "Online member account for submissions and results", "Mailed materials and printed course guidance"],
      gaps: ["No counselling available in the evening hours when families actually decide", "No proactive contact when a student stops submitting assignments", "Course changes mid-term require a staffed call", "No structured capture of why a household cancelled"],
    },
    risks: [
      "Exam-preparation marketing in Japan is scrutinised for outcome claims; an agent must never suggest or imply a probability of university admission.",
      "Conversations concern minors' academic performance, which is sensitive personal data requiring parental-consent handling under Japan's privacy law.",
      "Households under exam pressure include genuinely distressed students and parents; distress cues must route to a human counsellor, never be handled conversationally.",
    ],
    economics: { volumeMonthly: 60000, costPerInteraction: 5.0, automationRate: 0.45, basis: "Seller assumptions: subscription-base servicing plus seasonal enquiry peaks at Japanese assisted-contact cost — validate the spring peak multiple and current counselling headcount in discovery." },
    pilotScope:
      "Deploy Japanese voice and LINE course-selection counselling for the primary and junior-high correspondence courses through one spring enrollment window, grounded in the live course catalogue.",
    expansion: ["Extend to high-school and university-entrance course lines with counsellor handoff rules", "Add submission-activity-triggered retention outreach across the subscriber base", "Add materials and billing servicing to remove routine load from the counselling desk"],
    stakeholders: ["Head of Correspondence Education business", "Enrollment and Counselling Centre manager", "Head of Digital / Information Systems", "Course Development lead", "Customer Support Centre supervisor"],
    discovery: [
      "What proportion of first-year cancellations trace back to a course-level mismatch at sign-up?",
      "How many counselling calls does the enrollment desk take in the March peak versus a normal month?",
      "Do you have a trigger today when a subscriber stops submitting assignments, and who acts on it?",
      "What claims about exam outcomes are your counsellors explicitly forbidden from making?",
    ],
    flowTemplate: "admissions",
    scenario: "At 10pm a mother asks which Z-kai course level suits her son's current mock-exam results; the agent maps it against the catalogue and books a counsellor call for the ambiguous case.",
  },

  "chungdahm": {
    operatingContext:
      "Chungdahm Learning operates branded English-education academy networks across Korea, mixing directly operated campuses with a large franchised base under brands aimed at different age bands from kindergarten through middle school. The commercial unit is the parent consultation: a mother enquires, books a level test for her child, receives the result and a placement recommendation, and then decides between Chungdahm and the hagwon two blocks away. Every step of that funnel is a phone call, usually made in a narrow evening window, usually to a campus desk staffed by one or two people who are simultaneously handling pickup, payments and teacher scheduling. Franchise campuses run their own numbers, so headquarters sees enrollments but not the conversations that produced them.",
    strategicPressure: [
      { text: "Korea's private-education market is fiercely competitive and reputation-driven at neighbourhood level, so a missed parent call is a direct transfer of revenue to the nearest competing hagwon.", kind: "verified" },
      { text: "A collapsing birth rate is shrinking the kindergarten and elementary cohort that Chungdahm's junior brands depend on, forcing higher conversion per enquiry.", kind: "verified" },
      { text: "Level-test scheduling is the bottleneck between enquiry and enrollment, and it is handled manually against teacher availability at each campus.", kind: "inference" },
      { text: "Franchise campuses vary widely in how quickly and how well they handle parent consultations, and headquarters cannot see or correct that variance.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Chungdahm's product is curriculum and teacher training; its technology spend goes to learning platforms and content delivery. There is no evidence of speech or telephony engineering, and a franchise-heavy operating model makes any capability something headquarters buys once and distributes.",
    whyNotBuild:
      "Korean-language voice quality good enough for a mother evaluating her child's education, integration to per-campus test and class scheduling, and consistent policy on fees and refunds across franchisees is a platform build. A hagwon operator has neither the engineering headcount nor a reason to acquire it.",
    workflows: [
      {
        name: "Parent enquiry capture and level-test booking",
        friction: "A parent calls a campus at 7pm; the desk is mid-class-change and the phone rings out, or the parent is told someone will call back tomorrow, by which time she has booked elsewhere.",
        outcome: "The enquiry is answered instantly in Korean, the child's age and current level captured, and a level test booked into the campus's real availability.",
        channels: ["Voice", "KakaoTalk", "Web"],
        systems: ["Campus scheduling system", "Student and lead CRM", "Level-test assessment records"],
        value: 3, complexity: 2,
      },
      {
        name: "Post-test placement follow-up and enrollment conversion",
        friction: "Test results are explained on a callback that may take days, and undecided parents drift; nobody chases the family that tested but did not enroll.",
        outcome: "Result notification and placement explanation delivered promptly, questions on class times and fees answered, and a consultation with the campus director booked for high-intent families.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Assessment records", "Class capacity and timetable", "Enrollment and billing system"],
        value: 3, complexity: 2,
      },
      {
        name: "Term re-registration and payment-cycle communication",
        friction: "Re-registration and monthly tuition reminders are handled campus by campus, with dropouts noticed only when a payment fails to arrive.",
        outcome: "Consistent term-transition outreach in Korean, re-registration confirmed conversationally, and withdrawal reasons captured as structured data headquarters can act on.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Enrollment master", "Tuition billing", "Franchise reporting"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Brand websites with campus locators and enquiry forms", "KakaoTalk channels for parent communication at some campuses", "Per-campus telephone desks handling consultation and scheduling", "Level-test and assessment reporting to parents"],
      gaps: ["No answer to a parent call outside campus desk hours", "Level tests cannot be booked without staff intervention", "No headquarters visibility of enquiry-to-enrollment conversion by campus", "No systematic follow-up on families who tested but did not enroll"],
    },
    risks: [
      "Korean private-education advertising rules constrain claims about outcomes and rankings; an agent must stay within approved statements about programs and levels.",
      "Conversations concern minors, requiring guardian-consent handling under Korea's Personal Information Protection Act.",
      "Franchise agreements determine who owns the parent lead and whether headquarters may route or record campus-directed calls.",
    ],
    economics: { volumeMonthly: 90000, costPerInteraction: 3.4, automationRate: 0.5, basis: "Seller assumptions: parent enquiry, test-scheduling and re-registration volume across directly operated and franchised campuses at Korean assisted-contact cost — validate campus counts and desk staffing in discovery." },
    pilotScope:
      "Run Korean voice and KakaoTalk enquiry capture and level-test booking for the directly operated campuses of one brand in the Seoul metropolitan area across a single enrollment season.",
    expansion: ["Extend to the franchise network with campus-level conversion dashboards", "Add post-test placement follow-up and undecided-family nurture", "Add term re-registration and tuition-cycle outreach across brands"],
    stakeholders: ["Head of Domestic Academy Business", "Franchise Operations Director", "Campus Operations Manager", "Head of IT / Digital", "Head of Marketing and Admissions"],
    discovery: [
      "Between 6pm and 9pm on a weekday, what share of parent calls to a campus go unanswered?",
      "How many days pass between a level test and the placement conversation with the parent?",
      "What visibility does headquarters have today into enquiry volume at franchise campuses?",
      "Who decides fee and refund answers, and what may a front-desk person say without escalation?",
    ],
    flowTemplate: "admissions",
    scenario: "A mother calls a Chungdahm campus at 7:40pm about her third-grader; the agent captures the level, books a Saturday level test and confirms it on KakaoTalk.",
  },

  "hackers-korea": {
    operatingContext:
      "Hackers Education Group is the dominant Korean brand in TOEIC, TOEFL and language preparation, running physical academies in the major test-prep districts alongside very large online course operations and a publishing arm whose workbooks are ubiquitous. Its customers are adults and university students buying a course to clear a specific score threshold for a job application, a graduation requirement or an overseas admission, which makes purchase decisions urgent, price-sensitive and comparison-driven. Revenue is transacted online at high volume, so the questions that matter are pre-purchase — which course, which schedule, does the pass-guarantee apply to me — and post-purchase refund and extension questions governed by Korean e-commerce rules. Contact today runs through web enquiry boards, chat, KakaoTalk and phone lines that concentrate hard around test-registration deadlines.",
    strategicPressure: [
      { text: "Test-prep demand is deadline-driven, so enquiry volume spikes sharply around official test registration and result dates rather than spreading evenly.", kind: "verified" },
      { text: "Korean e-commerce consumer-protection rules give buyers strong refund and withdrawal rights on online courses, making refund handling a high-volume, rule-bound conversation.", kind: "verified" },
      { text: "Pass-guarantee and score-refund programs create the most complex eligibility conversations in the business, and inconsistent answers directly generate disputes.", kind: "inference" },
      { text: "An online-heavy model means pre-purchase response latency converts almost mechanically into lost sales to competing brands.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Hackers has real digital-platform capability for course delivery and commerce, which is why it is worth confirming scope. But its engineering is oriented to e-learning and storefront, not to speech, telephony and conversational orchestration; the historical pattern for Korean education companies is to buy conversational tooling and integrate it.",
    whyNotBuild:
      "The valuable conversation depends on grounded retrieval across a large, constantly changing course and pricing catalogue plus rule-exact application of guarantee and refund policy. Getting that wrong creates consumer-protection exposure. A publishing-and-courseware business will not staff the speech, evaluation and governance functions that make such an agent safe.",
    workflows: [
      {
        name: "Pre-purchase course counselling and enrollment",
        friction: "A prospective student comparing three brands at midnight posts a question on an enquiry board and gets an answer the next afternoon, by which time the competitor's course is bought.",
        outcome: "Immediate grounded answers on course fit, schedule, price and start dates in Korean, with enrollment completed in-conversation.",
        channels: ["KakaoTalk", "Web chat", "Voice"],
        systems: ["Course catalogue and pricing", "E-commerce order system", "Class schedule and capacity"],
        value: 3, complexity: 2,
      },
      {
        name: "Pass-guarantee and refund eligibility servicing",
        friction: "Eligibility depends on attendance, score submission and program terms; different agents give different answers and disputes escalate.",
        outcome: "Policy applied identically every time from the governed rule set, evidence requirements explained clearly, and only genuine exceptions routed to a human decision-maker.",
        channels: ["Voice", "KakaoTalk", "Web"],
        systems: ["Enrollment and attendance records", "Refund and guarantee policy engine", "Payments and settlement"],
        value: 3, complexity: 3,
      },
      {
        name: "Deadline-peak enquiry absorption",
        friction: "Test-registration weeks generate a multiple of normal contact volume against a fixed counselling team, so queues and abandoned enquiries spike exactly when purchase intent is highest.",
        outcome: "Elastic capacity through the peak with no queue, and human counsellors reserved for high-value or contested cases.",
        channels: ["Voice", "KakaoTalk", "Web chat"],
        systems: ["Course catalogue", "Order and payment system", "Counsellor routing"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: ["High-traffic course commerce websites with enquiry boards", "KakaoTalk customer channels", "Telephone counselling lines for academy and online courses", "Published refund and pass-guarantee terms"],
      gaps: ["No real-time answer outside counselling hours when most online purchases are considered", "Guarantee eligibility cannot be checked by the student against their own record", "Refund status is opaque between request and settlement", "Peak-period enquiries are queued rather than resolved"],
    },
    risks: [
      "Korean consumer-protection law on distance e-commerce sets refund and disclosure obligations; automated statements about refund rights carry regulatory weight.",
      "Advertising rules restrict score-improvement and pass-rate claims, so the agent's grounded corpus must exclude promotional language.",
      "Payment and identity data flow through the enrollment conversation and require PIPA-compliant handling and logging.",
    ],
    economics: { volumeMonthly: 220000, costPerInteraction: 3.0, automationRate: 0.55, basis: "Seller assumptions: online-course enquiry, enrollment and refund contact volume with strong deadline peaks at Korean assisted-contact cost — validate peak-week multiples in discovery." },
    pilotScope:
      "Deploy Korean KakaoTalk and voice pre-purchase counselling plus refund-status servicing for the TOEIC online course line through one full test-registration cycle.",
    expansion: ["Add pass-guarantee eligibility checking grounded in attendance and score records", "Extend to TOEFL, language and academy course lines", "Add post-enrollment progress and course-extension outreach"],
    stakeholders: ["Head of Online Business", "Customer Counselling Centre Director", "Head of Platform Engineering", "Legal and Consumer Protection lead", "Course Product Manager"],
    discovery: [
      "In the week before a TOEIC registration deadline, how far does enquiry volume exceed a normal week?",
      "How many refund and guarantee disputes escalate beyond first-line counselling each month, and why?",
      "What share of online course purchases involve a pre-purchase counselling contact?",
      "Where does your platform team draw the line between what it builds and what it integrates?",
    ],
    flowTemplate: "lead-sales",
    scenario: "Three days before the TOEIC registration deadline a student asks at 1am whether the pass-guarantee applies to her attendance record; the agent checks it and enrolls her in-conversation.",
  },

  "monash": {
    operatingContext:
      "Monash University is Australia's largest university by enrollment, running campuses across Melbourne plus a full campus in Malaysia and operations in Indonesia, India and Italy, with one of the country's biggest international student cohorts. Its admissions machine has to convert applicants from mainland China, India, Indonesia, Vietnam and Malaysia through a sequence that spans agent networks, direct applications, conditional offers, English-requirement evidence, deposit payment and visa lodgement — a funnel where every step is a chance for a candidate to accept a competitor's offer instead. Student services then carry a very large enrolled population through enrollment variations, fee queries, results and graduation. The channel reality is a CRM-driven email and portal experience plus phone lines that operate on Melbourne business hours, which is the middle of the night for a large share of the applicant base.",
    strategicPressure: [
      { text: "Australian government policy has tightened international student visa processing and settings, making offer-to-enrollment conversion far more fragile and more competitive against other destinations.", kind: "verified" },
      { text: "International student fee income is a material share of the operating revenue of large Australian universities, so melt between offer and census date is a direct budget problem.", kind: "verified" },
      { text: "Applicant peaks around the two main intakes concentrate enormous contact volume into a few weeks against a fixed admissions and student-services headcount.", kind: "inference" },
      { text: "A significant share of applicant contact happens through education agents rather than directly, so the university's view of applicant intent is second-hand and delayed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Australian universities buy student-engagement technology through established procurement panels and run it on top of an incumbent CRM. Monash has strong research computing and a capable central IT function, but student-facing conversational channels are a purchased and integrated capability rather than an in-house engineering product.",
    whyNotBuild:
      "The requirement is multilingual voice and messaging across five or more applicant languages, 24-hour coverage, grounded retrieval over course rules and fee schedules that change by faculty, and auditable handling of student wellbeing escalation. University IT priorities sit with core systems, cyber and research infrastructure; nobody will fund a speech and orchestration platform out of a student-services budget.",
    workflows: [
      {
        name: "International applicant engagement and offer conversion",
        friction: "An applicant in Delhi or Jakarta emails a question about her conditional offer at 9pm local time and gets a reply two working days later, by which time she has accepted an offer elsewhere.",
        outcome: "Applicants are answered within minutes in their own language at their own hour, conditions explained against their actual application record, and deposit and acceptance steps completed in-conversation.",
        channels: ["WhatsApp", "Voice", "Web chat", "WeChat"],
        systems: ["Student CRM", "Application and admissions system", "Course and fee catalogue", "Payments gateway"],
        value: 3, complexity: 3,
      },
      {
        name: "Document chase and condition clearance",
        friction: "Missing English test results, transcripts or identity documents stall applications silently, and nobody chases until an intake deadline forces a bulk email.",
        outcome: "Every incomplete application is actively chased in-language with a specific checklist, and documents are validated for format and completeness before they reach an admissions officer.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Admissions system", "Document management", "Student CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Enrolled-student service enquiry handling",
        friction: "Enrollment variations, fee due dates, timetable clashes and results queries flood the student hub at census and results peaks, and students queue for routine answers.",
        outcome: "Routine student enquiries resolved in-conversation around the clock, with wellbeing and academic-progress concerns routed immediately to qualified staff.",
        channels: ["Web chat", "Voice", "WhatsApp"],
        systems: ["Student management system", "Fees and finance", "Timetabling", "Case management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Applicant and student portals with application tracking", "A student services hub with phone and counter channels", "Published course, fee and scholarship information online", "An education-agent network with its own portal and support"],
      gaps: ["No live answer in applicant time zones and languages outside Melbourne hours", "Conditional-offer conditions cannot be discussed conversationally against the applicant's record", "Document gaps are not chased proactively", "Peak-period student enquiries queue rather than resolve"],
    },
    risks: [
      "The ESOS Act and National Code impose specific obligations on information given to international students, including agent conduct and written agreements; agent-generated statements must be grounded and auditable.",
      "Student wellbeing and mental-health disclosures must route immediately to trained human staff and must never be handled conversationally.",
      "Australian Privacy Principles and university data governance constrain what applicant data may be processed, where it may be stored, and how consent is captured for messaging channels.",
    ],
    economics: { volumeMonthly: 300000, costPerInteraction: 5.5, automationRate: 0.5, basis: "Seller assumptions: combined applicant and enrolled-student contact volume at an ANZ assisted-contact cost blend — validate against actual contact-centre and admissions volumes in discovery." },
    pilotScope:
      "Deploy multilingual applicant engagement for one faculty's international postgraduate coursework intake, covering offer-condition queries, document chase and deposit conversion, integrated to the admissions system and CRM.",
    expansion: ["Extend across all faculties and both major intakes with agent-channel visibility", "Add enrolled-student service enquiry handling for the student hub", "Extend to the Malaysia and Indonesia operations with local language coverage"],
    stakeholders: ["Deputy Vice-Chancellor (Global Engagement)", "Director of Admissions", "Director, Student Services / Student Hub", "Chief Information Officer", "Head of International Recruitment"],
    discovery: [
      "What is your current median first-response time to an international applicant enquiry, measured in the applicant's time zone?",
      "How much melt do you see between offer acceptance and census date, and where in the sequence does it concentrate?",
      "Which student conversations are you contractually or ethically unwilling to automate at any level?",
      "How much applicant contact reaches you through agents rather than directly, and what visibility do you have into it?",
    ],
    flowTemplate: "admissions",
    scenario: "A postgraduate applicant in Jakarta asks at 11pm what evidence clears her English condition; the agent checks her record, lists the accepted options and books her deposit payment.",
  },

  "unsw": {
    operatingContext:
      "UNSW Sydney is a Group of Eight research university with a very large international cohort concentrated in engineering, business and computing, operating on a trimester-style calendar that compresses the academic year into tighter service peaks than most peers. Its student-facing operations centre on a consolidated student hub that fields enrollment, fee, timetable, credit-transfer and progression questions across a population of tens of thousands, alongside an admissions operation converting applicants from China, India and Southeast Asia. The service model is a triaged front door — web knowledge base, chat, phone and counter — where the hub resolves what it can and refers the rest to faculty or specialist teams. The structural problem is that peaks are extreme and repetitive: the same few hundred question types arrive tens of thousands of times in the fortnight around each term start.",
    strategicPressure: [
      { text: "Tightened Australian student visa settings and caps on international enrollment have made both applicant conversion and enrolled-student retention materially harder for Group of Eight universities.", kind: "verified" },
      { text: "A compressed academic calendar produces more service peaks per year than a two-semester model, multiplying the number of weeks the student hub is overwhelmed.", kind: "inference" },
      { text: "The overwhelming majority of student hub contacts are transactional and repetitive, which means the marginal contact is expensive human capacity spent on a knowable answer.", kind: "inference" },
      { text: "Sector-wide budget pressure makes headcount growth in professional services politically difficult, so absorbing peaks has to come from automation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "UNSW has substantial computing capability, but it lives in research and teaching technology; student administration runs on vendor platforms bought through university procurement. Conversational service layers at Australian universities are consistently purchased and integrated, not engineered internally.",
    whyNotBuild:
      "Doing this properly means multilingual voice and chat, live grounding in a student management system whose rules change by program, wellbeing escalation with legal weight, and continuous evaluation. That combination is a product, and the university's IT investment committee will not fund building one when the alternative is a procured platform with an evaluation framework attached.",
    workflows: [
      {
        name: "Student hub enquiry resolution",
        friction: "In the fortnight around a term start the hub takes the same enrollment-variation and fee-deadline questions thousands of times, with queues at the counter and on the phone and students missing deadlines while they wait.",
        outcome: "Routine enquiries answered instantly against the student's own record at any hour, with hub staff redeployed to complex and at-risk cases.",
        channels: ["Web chat", "Voice", "WhatsApp"],
        systems: ["Student management system", "Fees and finance", "Timetabling", "Case management"],
        value: 3, complexity: 2,
      },
      {
        name: "International applicant and offer-conversion support",
        friction: "Applicants in Asian time zones ask about conditions, credit recognition and fee deposits outside Sydney hours and wait days for a reply while competing offers sit open.",
        outcome: "In-language responses within minutes, conditions and credit questions answered against the actual application, and acceptance and deposit steps completed conversationally.",
        channels: ["WhatsApp", "WeChat", "Voice", "Web chat"],
        systems: ["Admissions system", "Student CRM", "Payments", "Course and fee catalogue"],
        value: 3, complexity: 3,
      },
      {
        name: "Census-date and fee-deadline proactive outreach",
        friction: "Students who have not finalised enrollment or paid by census date incur financial and academic consequences, and current outreach is a mass email nobody reads.",
        outcome: "Targeted conversational outreach that explains the individual student's outstanding action and completes it in-channel, cutting late-penalty and withdrawal volume.",
        channels: ["SMS", "WhatsApp", "Voice"],
        systems: ["Student management system", "Finance and fees", "Communications consent register"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A consolidated student hub with chat, phone and counter service", "Self-service student portal for enrollment and fee transactions", "Extensive online knowledge base and FAQ", "Applicant portal with application status tracking"],
      gaps: ["No service outside Sydney business hours when international students are awake", "Knowledge base answers are generic rather than grounded in the individual student record", "No proactive outreach to students at risk of missing census deadlines", "Language coverage limited to English on live channels"],
    },
    risks: [
      "ESOS Act and National Code obligations govern information provided to international students and require records of advice given.",
      "Student distress and mental-health disclosures must be detected and routed immediately to counselling staff, never handled by an agent.",
      "Australian Privacy Principles plus university policy govern where student data may be processed and how messaging consent is captured and revoked.",
    ],
    economics: { volumeMonthly: 220000, costPerInteraction: 5.8, automationRate: 0.55, basis: "Seller assumptions: student hub and admissions contact volume across a compressed academic calendar at ANZ assisted-contact cost — validate peak-fortnight volumes in discovery." },
    pilotScope:
      "Run a term-start pilot on the student hub covering enrollment variation, fee deadline and timetable enquiries in English and Mandarin, grounded in the student management system with wellbeing escalation rules enforced.",
    expansion: ["Add international applicant offer-conversion support in Mandarin and Hindi", "Add census-date and fee-deadline proactive outreach", "Extend to faculty-level progression and credit-transfer enquiries"],
    stakeholders: ["Director, Student Experience / Student Hub", "Director of Admissions", "Chief Information Officer", "Head of Student Wellbeing and Support", "Deputy Vice-Chancellor (Education and Student Experience)"],
    discovery: [
      "What are your top twenty student hub contact reasons by volume in the fortnight after a term starts?",
      "What is the wait time at the counter and on the phone at that peak, and what is the abandonment rate?",
      "What is your standing policy for detecting and escalating student distress in a written channel?",
      "Which enquiry types must always be answered by a named human under university or regulatory policy?",
    ],
    flowTemplate: "inbound-service",
    scenario: "Three days after trimester start a student asks at midnight whether dropping a course before census affects her visa; the agent answers from her record and escalates the visa element to an adviser.",
  },

  "deakin": {
    operatingContext:
      "Deakin University is a Victorian multi-campus university with an unusually large online-education arm, meaning a substantial share of its students never set foot on a campus and experience the institution entirely through digital and remote service channels. It has pushed hard into international expansion, including a teaching campus in India's GIFT City, which creates an admissions funnel operating in Indian time zones, in a market where families expect phone and WhatsApp contact rather than email. The university therefore runs three quite different service populations at once: on-campus domestic students, a large remote online cohort with different service rhythms, and an offshore international funnel it is actively growing. Contact today flows through a student CRM, portals, chat and phone lines built primarily around Australian hours.",
    strategicPressure: [
      { text: "Deakin established a teaching campus in India's GIFT City, creating an admissions and student-services operation that must run on Indian time and Indian channel expectations.", kind: "verified" },
      { text: "Tightened Australian international student policy raises the strategic value of offshore delivery, which increases the operational load on offshore applicant engagement.", kind: "verified" },
      { text: "A large online cohort generates service demand distributed across evenings and weekends rather than concentrated in campus hours, which a business-hours service model systematically underserves.", kind: "inference" },
      { text: "Offshore campus admissions competing against Indian institutions and other foreign providers will be won or lost on speed of counsellor response.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Deakin is digitally ambitious and has experimented publicly with student-facing digital assistants, but those have been built on vendor platforms and integrated into university systems. The pattern is purchase-and-integrate, and an offshore admissions funnel adds languages and telephony that only widen the gap between ambition and internal build capacity.",
    whyNotBuild:
      "The India funnel needs Hindi and English voice on Indian telephony, WhatsApp as a primary channel, and grounding in both Australian and GIFT City program rules — plus evaluation good enough to satisfy ESOS obligations. That is a different engineering problem from the chatbot work universities have historically done, and it is not one a university IT function will staff.",
    workflows: [
      {
        name: "GIFT City and India-market applicant engagement",
        friction: "Indian applicants and their families expect a WhatsApp or phone response the same evening; Deakin's funnel answers by email in Australian hours and loses candidates to faster local competitors.",
        outcome: "Instant Hindi and English engagement on the channels Indian families actually use, eligibility and fee questions answered against the real program rules, and counsellor calls booked in local time.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Student CRM", "Admissions system", "Program and fee catalogue", "Counsellor calendar"],
        value: 3, complexity: 3,
      },
      {
        name: "Online-cohort student service",
        friction: "Remote students study at night and on weekends but hit a business-hours service wall for enrollment, assessment-extension and fee questions.",
        outcome: "Around-the-clock resolution of routine online-student enquiries grounded in the individual student record, with academic and wellbeing matters routed to staff.",
        channels: ["Web chat", "Voice", "SMS"],
        systems: ["Student management system", "Learning management system", "Finance and fees"],
        value: 3, complexity: 2,
      },
      {
        name: "Offer-condition clearance and enrollment completion",
        friction: "Conditional offers stall on missing documents and unconfirmed English evidence, and the follow-up is a scheduled email rather than a conversation.",
        outcome: "Active, in-language chase of every outstanding condition with document validation in-flow, lifting offer-to-enrollment conversion measurably.",
        channels: ["WhatsApp", "Email", "Voice"],
        systems: ["Admissions system", "Document management", "Student CRM"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Student portal and CRM-driven applicant communications", "Digital student assistant capability on the website", "Phone and chat student-service channels in Australian hours", "An offshore campus admissions operation with local counsellors"],
      gaps: ["No Hindi-language live channel for the India funnel", "WhatsApp is not an integrated, record-aware service channel", "Online-cohort students cannot get answers in their actual study hours", "Condition clearance depends on batch email rather than active conversation"],
    },
    risks: [
      "ESOS Act and National Code obligations apply to information given to international students, and offshore delivery adds Indian regulatory and GIFT City authority requirements.",
      "Cross-border processing of Indian applicant data must satisfy both Australian Privacy Principles and India's data protection regime.",
      "Student wellbeing disclosures, particularly from isolated online students, must escalate to trained humans immediately and be logged.",
    ],
    economics: { volumeMonthly: 180000, costPerInteraction: 5.2, automationRate: 0.5, basis: "Seller assumptions: blended online-cohort service and international applicant contact at ANZ assisted-contact cost, with the India funnel costed separately — validate both in discovery." },
    pilotScope:
      "Deploy Hindi and English WhatsApp and voice applicant engagement for the GIFT City campus intake, grounded in the admissions system with counsellor booking in Indian time.",
    expansion: ["Extend to the broader India and South Asia recruitment funnel", "Add out-of-hours service for the online student cohort", "Add condition-clearance and document chase across all international offers"],
    stakeholders: ["Deputy Vice-Chancellor (Global)", "Director of Admissions and Student Recruitment", "Head of Deakin India / GIFT City campus operations", "Chief Digital Officer", "Director, Student Services"],
    discovery: [
      "What is the current first-response time for a GIFT City campus enquiry, measured in Indian local time?",
      "What proportion of your online cohort's service contacts arrive outside Australian business hours?",
      "How is WhatsApp used in the India funnel today, and is it connected to the student record?",
      "Who is accountable for offer-to-enrollment conversion for offshore programs, and what is the current rate?",
    ],
    flowTemplate: "admissions",
    scenario: "A GIFT City applicant messages on WhatsApp at 9pm IST asking whether her three-year degree meets entry requirements; the agent checks the rule and books a counsellor call for the next morning.",
  },

  "navitas": {
    operatingContext:
      "Navitas operates pathway colleges embedded with university partners across Australia, the UK, North America and Asia, taking international students who do not yet meet direct-entry requirements and delivering them into partner degree programs. Its revenue depends on recruiting students largely through a global education-agent network, converting them through offer, deposit and visa, and then holding them through a pathway year into university progression. That means dozens of separate colleges, each with its own intakes, program rules and partner university requirements, all serving the same fundamentally repetitive applicant conversation in a dozen source-market languages. Under private-equity ownership the operating discipline is conversion economics: cost per enrolled student and progression rate are the numbers that matter, and both are decided in conversations currently handled by college admissions teams and agents.",
    strategicPressure: [
      { text: "Pathway providers were disproportionately exposed to the tightening of Australian and other destination-market student visa settings, compressing enrollment volumes and raising the value of every retained applicant.", kind: "verified" },
      { text: "Recruiting largely through third-party agents means Navitas often sees an applicant only after the agent has shaped expectations, leaving gaps and errors to be corrected late in the funnel.", kind: "inference" },
      { text: "Private-equity ownership makes standardised, portfolio-wide operating leverage far more attractive than college-by-college process improvement.", kind: "inference" },
      { text: "Dozens of colleges running local admissions practices means conversion performance varies widely with no single explanation available to head office.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Navitas is an education operator whose technology function exists to run student administration across a federated college portfolio. It has no speech or conversational engineering capability, and its ownership structure rewards buying a standard capability once and deploying it across every college rather than funding a build.",
    whyNotBuild:
      "A portfolio-wide capability needs multilingual voice and messaging, telephony in multiple countries, grounding in per-college program and partner-university rules, and audit trails satisfying each destination market's international-student regulation. Navitas will not create a platform engineering function to obtain that.",
    workflows: [
      {
        name: "Applicant engagement and offer conversion across colleges",
        friction: "An applicant in Hanoi or Hyderabad asks a program or fee question that requires a specific college's rules; the agent network gives an approximate answer and the college corrects it days later, eroding trust and delaying deposits.",
        outcome: "Applicants get college-accurate, in-language answers within minutes, conditions are explained against their actual application, and deposit and acceptance are completed in-channel.",
        channels: ["WhatsApp", "Voice", "Web chat", "WeChat"],
        systems: ["Student CRM", "Admissions system", "Per-college program and fee rules", "Payments"],
        value: 3, complexity: 3,
      },
      {
        name: "Agent-channel support and application quality",
        friction: "Agents submit incomplete or non-compliant applications and then call college admissions teams for status, consuming the same capacity that should be converting students.",
        outcome: "Agents get instant application status and requirement answers, submission errors are caught conversationally before they reach admissions, and head office finally sees agent performance data.",
        channels: ["WhatsApp", "Voice", "Agent portal chat"],
        systems: ["Agent portal", "Admissions system", "Commission and CRM records"],
        value: 3, complexity: 2,
      },
      {
        name: "Pre-arrival and progression retention",
        friction: "Between deposit and arrival, and again before university progression, students go quiet; nobody detects the ones drifting away until they fail to enroll.",
        outcome: "Structured pre-arrival journeys covering visa steps, accommodation and orientation, and progression-point outreach that catches at-risk students while intervention still works.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Student records", "Progression tracking", "Partner-university enrollment feeds"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Per-college websites and applicant portals", "A global education-agent network with an agent portal", "College admissions teams handling offers and enquiries", "Partner-university progression pathways with published requirements"],
      gaps: ["No consistent, college-accurate answer available to applicants outside office hours", "Agent enquiries consume admissions capacity instead of being self-served", "No portfolio-level visibility of enquiry-to-deposit conversion by college or agent", "Pre-arrival drop-off is discovered rather than prevented"],
    },
    risks: [
      "ESOS Act and National Code obligations in Australia, with analogous rules in the UK and Canada, govern information given to international students and agent conduct — statements must be grounded and auditable.",
      "Agent commission structures and partner-university agreements constrain what may be said about progression guarantees.",
      "Applicant data crosses many jurisdictions, requiring per-market consent and residency handling.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 4.6, automationRate: 0.55, basis: "Seller assumptions: portfolio applicant and agent contact volume at a blended ANZ and offshore cost — validate per-college admissions headcount and agent enquiry share in discovery." },
    pilotScope:
      "Deploy multilingual applicant engagement and agent status self-service for three Australian pathway colleges through one intake, grounded in the shared admissions system with per-college rule sets.",
    expansion: ["Extend across the Australian college portfolio with head-office conversion reporting", "Add UK and North American colleges with market-specific compliance rules", "Add pre-arrival and progression retention journeys"],
    stakeholders: ["Chief Operating Officer", "Group Director of Admissions", "Head of Global Agent Network / Recruitment", "Chief Information Officer", "College Director (pilot colleges)"],
    discovery: [
      "What share of applicant contact reaches you directly versus through the agent network?",
      "How much of your admissions teams' time goes to agent status enquiries rather than applicant conversion?",
      "How does enquiry-to-deposit conversion vary across colleges, and do you know why?",
      "Which program and progression statements must be word-exact for compliance in each destination market?",
    ],
    flowTemplate: "admissions",
    scenario: "A Vietnamese applicant asks on WhatsApp at 10pm whether her diploma clears the pathway entry rule for a specific partner university; the agent answers from that college's rule set and takes her deposit.",
  },

  "idp-education": {
    operatingContext:
      "IDP Education is an ASX-listed international-student placement business and a co-owner of the IELTS test, operating counselling offices across India, Southeast Asia, China and beyond and placing students into universities in Australia, the UK, Canada and the US. Its two revenue engines are placement commissions, earned when a counsellor converts a student into an enrolled offer, and IELTS testing volume, earned per test booking and delivery. Both are conversation-native at enormous scale: prospective students walk into or call an office, ask which country and course suits them, book a counsellor session, prepare documents, then separately book, reschedule and query an IELTS test sitting. The channel mix is physical offices, a mobile app and web presence, phone and increasingly WhatsApp, with counsellor time the scarce and expensive resource in the middle of everything.",
    strategicPressure: [
      { text: "Visa policy tightening across Australia, Canada and the UK has simultaneously reduced placement volumes and compressed the industry's economics, putting acute pressure on cost per placement.", kind: "verified" },
      { text: "Counsellor capacity is the binding constraint on placement volume, so any minute of counsellor time spent on scheduling or status questions is a minute not spent converting.", kind: "inference" },
      { text: "IELTS booking, rescheduling and result enquiries generate very high-volume, highly structured contact that is almost entirely transactional.", kind: "verified" },
      { text: "With destination markets less certain, students shop across multiple agencies simultaneously, making speed of first response a direct determinant of market share.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "IDP has a real digital product team behind its student app and platform, so partner-led rather than pure buy-led is worth testing. But that team's roadmap is student experience and marketplace features, not speech recognition, telephony and conversational orchestration across a dozen languages. The realistic outcome is a purchased conversational layer integrated into its existing platform.",
    whyNotBuild:
      "Voice in Hindi, Telugu, Vietnamese, Mandarin, Bahasa and more, telephony in a dozen countries, grounded retrieval over constantly changing destination-country visa and university requirements, and evaluation strict enough that no agent ever gives immigration advice — that is a multi-year platform programme. IDP's investment case is placement volume and IELTS share, not building conversational infrastructure.",
    workflows: [
      {
        name: "Prospective-student qualification and counsellor booking",
        friction: "An enquiry arrives through the website or a walk-in, and the student waits days for a counsellor slot while three competing agencies call them the same evening.",
        outcome: "Every enquiry engaged within minutes in the student's language, qualified against destination, course level and budget on a structured rubric, and booked into a counsellor's real calendar only when it is worth counsellor time.",
        channels: ["WhatsApp", "Voice", "Web chat"],
        systems: ["Placement CRM", "Counsellor calendar", "University course and requirement database"],
        value: 3, complexity: 2,
      },
      {
        name: "IELTS booking, rescheduling and result servicing",
        friction: "Test-date availability, reschedule rules, fee questions and result timing questions flood counselling offices and phone lines, absorbing capacity that earns nothing per contact.",
        outcome: "Test booking, rescheduling and result status handled conversationally at any hour in local languages, with office staff removed from the transaction entirely.",
        channels: ["Voice", "WhatsApp", "Web"],
        systems: ["IELTS test-booking system", "Payments", "Candidate records"],
        value: 3, complexity: 2,
      },
      {
        name: "Application document chase and offer follow-through",
        friction: "Applications stall on missing transcripts, financial evidence and English scores; counsellors chase manually or the file simply sits.",
        outcome: "Automated, in-language chase of every outstanding item with format validation in-flow, shortening time-to-offer and lifting the number of applications a counsellor can carry.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Placement CRM", "Document management", "University application portals"],
        value: 3, complexity: 3,
      },
    ],
    existing: {
      has: ["A network of physical counselling offices across source markets", "A student mobile app and web platform for course search and application tracking", "IELTS test booking and candidate-services channels", "Local-language counselling staff in each market"],
      gaps: ["No instant first response to a new enquiry outside office hours", "IELTS transactional queries still consume counselling office capacity", "Document chase is manual and counsellor-dependent", "No single measured view of enquiry-to-placement conversion by counsellor and channel"],
    },
    risks: [
      "Immigration advice is regulated in destination markets; an agent must never advise on visa eligibility or outcomes, only on documented process steps, with hard escalation rules.",
      "IELTS test-security and candidate-identity rules constrain what may be confirmed or changed conversationally.",
      "Student personal and financial data crosses multiple jurisdictions with differing data-protection regimes, including India's DPDP framework.",
    ],
    economics: { volumeMonthly: 700000, costPerInteraction: 1.4, automationRate: 0.6, basis: "Seller assumptions: combined placement enquiry and IELTS candidate-servicing volume, costed at India and SEA assisted-contact rates where most contact originates — validate the split in discovery." },
    pilotScope:
      "Deploy Hindi and English WhatsApp and voice enquiry qualification plus IELTS booking and reschedule servicing for the South India office cluster over one testing quarter.",
    expansion: ["Extend to all Indian offices with counsellor productivity reporting", "Add Vietnamese, Bahasa and Mandarin coverage across Southeast Asia and China offices", "Add application document chase and offer follow-through into the placement CRM"],
    stakeholders: ["Regional Director, South Asia", "Global Head of IELTS Operations", "Chief Digital / Technology Officer", "Head of Counselling Operations", "Group Head of Compliance"],
    discovery: [
      "What share of counsellor time is currently spent on IELTS transactional queries rather than placement counselling?",
      "What is your median time from web enquiry to first human contact, by market?",
      "How does IDP Live's product roadmap treat conversational channels — build, integrate, or out of scope?",
      "What are the standing rules on what a counsellor may and may not say about visa outcomes?",
    ],
    flowTemplate: "lead-sales",
    scenario: "A student in Hyderabad messages at 9pm asking about Australian masters options and an IELTS date; the agent qualifies her, books the test and puts a counsellor session in the diary.",
  },

  "hku-space": {
    operatingContext:
      "HKU SPACE is the University of Hong Kong's self-financed continuing and professional education arm, enrolling on the order of a hundred thousand course registrations a year across short professional courses, part-time award programmes and full-time sub-degree study. Because it is self-financed, enrollment is a commercial imperative rather than an administrative process: courses run when they fill, and a prospective student who cannot get a clear answer about schedule, fee, exemption or accreditation simply does not register. Its learners are overwhelmingly working adults choosing evening and weekend study, which means their decision window is precisely when the enquiry counters and phone lines are closed. Service today runs through learning-centre counters across Hong Kong, phone enquiry lines, a course-search website and email, all operating bilingually in Cantonese and English with growing Mandarin demand.",
    strategicPressure: [
      { text: "As a self-financed institution, HKU SPACE carries direct commercial exposure to enrollment volume in every course intake rather than being funded on a block grant.", kind: "verified" },
      { text: "Hong Kong's continuing-education market has been squeezed by demographic change and by online alternatives, raising the value of converting each enquiry.", kind: "inference" },
      { text: "Working-adult learners research and decide outside office hours, so a business-hours enquiry model structurally loses registrations to whoever answers first.", kind: "inference" },
      { text: "A very large and frequently changing course catalogue makes accurate enquiry answering genuinely hard for counter staff without automation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "HKU SPACE operates under university governance with a lean administrative technology function focused on enrollment and learning systems. There is no platform engineering capability, and procurement runs through university processes that favour established vendors and packaged capability.",
    whyNotBuild:
      "Trilingual voice, integration to an enrollment system holding thousands of concurrent course offerings, and reliable grounding on fee, exemption and accreditation rules is a platform problem. A self-financed continuing-education arm will not fund speech engineering out of course margins.",
    workflows: [
      {
        name: "Course enquiry and registration servicing",
        friction: "A working professional browsing at 11pm cannot confirm whether a course still has places, when it runs, or whether her prior qualification grants exemption, so she defers and never returns.",
        outcome: "Instant grounded answers in Cantonese, English or Mandarin on course availability, schedule and fees, with registration completed in-conversation.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Course catalogue and enrollment system", "Payments", "Learning-centre timetables"],
        value: 3, complexity: 2,
      },
      {
        name: "Exemption, accreditation and progression enquiries",
        friction: "Questions about credit exemption and whether a course counts toward a professional body's requirements need a specialist and produce multi-day email chains.",
        outcome: "Grounded first-pass answers from the published rules with a clean handoff to a programme officer for genuine judgement calls, cutting time-to-decision for the learner.",
        channels: ["Voice", "Web chat", "Email"],
        systems: ["Programme rules and accreditation register", "Student records", "Programme officer routing"],
        value: 2, complexity: 3,
      },
      {
        name: "Intake-cycle re-enrollment and course-start communication",
        friction: "Class venue changes, start-date confirmations and next-module registration are handled by mass email and counter queues at each intake.",
        outcome: "Proactive, per-learner communication of start details and next-module options, with re-registration completed conversationally and drop-off reasons captured.",
        channels: ["WhatsApp", "SMS", "Voice"],
        systems: ["Enrollment system", "Timetabling", "Billing"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: ["A large searchable course catalogue website with online registration", "Learning-centre enquiry counters across Hong Kong", "Bilingual telephone enquiry lines in business hours", "Student portal for enrolled learners"],
      gaps: ["No live answer during the evening hours when working adults decide", "Course availability and exemption questions require staff intervention", "No Mandarin live-channel coverage for mainland-origin learners", "No proactive next-module or re-enrollment conversation"],
    },
    risks: [
      "Statements about accreditation, professional recognition and qualification frameworks carry regulatory weight in Hong Kong and must be word-exact and grounded.",
      "Hong Kong's Personal Data (Privacy) Ordinance governs learner data handling and direct-marketing consent, which must be captured and honoured per channel.",
      "University governance may constrain what the SPACE arm can commit to independently on data processing and vendor selection.",
    ],
    economics: { volumeMonthly: 70000, costPerInteraction: 4.5, automationRate: 0.5, basis: "Seller assumptions: enquiry and enrollment servicing volume across intakes at a Hong Kong assisted-contact cost — validate counter and phone volumes by intake period in discovery." },
    pilotScope:
      "Deploy trilingual voice and WhatsApp course enquiry and registration servicing for the professional short-course portfolio through one intake cycle, grounded in the live course catalogue.",
    expansion: ["Add exemption and accreditation enquiry handling with programme-officer escalation", "Extend to part-time award and full-time sub-degree programmes", "Add proactive intake-cycle and next-module re-enrollment outreach"],
    stakeholders: ["Director, HKU SPACE", "Head of Student Enrolment and Registry", "Programme Directors (professional courses)", "Head of Information Technology", "Head of Marketing and Communications"],
    discovery: [
      "What proportion of course enquiries arrive outside counter and phone-line hours?",
      "How many enquiries per intake concern exemption or accreditation, and how long do they take to answer?",
      "Which courses have the widest gap between enquiry volume and completed registrations?",
      "What statements about professional recognition must be quoted exactly rather than paraphrased?",
    ],
    flowTemplate: "admissions",
    scenario: "A working accountant asks at 11pm whether her prior diploma exempts her from a module and whether the evening class still has places; the agent confirms both and registers her.",
  },

  "care-hospitals": {
    operatingContext:
      "CARE Hospitals is a Hyderabad-headquartered multi-specialty chain running more than a dozen hospitals concentrated in Telangana, Andhra Pradesh, Maharashtra, Chhattisgarh and Odisha, with a strong cardiac-sciences heritage and a Blackstone-backed platform strategy. Its patients are largely middle-income families in tier-1 and tier-2 cities who reach the hospital through per-facility phone numbers, walk-in OPD counters and increasingly through aggregator listings, speaking Telugu, Hindi, Marathi and Odia far more often than English. The commercial rhythm is outpatient-led: appointment booking, consultant availability, health-checkup packages, diagnostic report collection and post-discharge follow-up together generate far more contacts than inpatient admissions. Each hospital runs its own front-desk and call-handling arrangement, so a single patient moving between facilities is a new person every time.",
    strategicPressure: [
      { text: "Private-equity ownership drives explicit operating-leverage targets, making cost per patient interaction and OPD conversion board-visible metrics rather than administrative details.", kind: "verified" },
      { text: "Multi-state expansion across Telugu-, Marathi-, Hindi- and Odia-speaking regions means a single-language call operation systematically underserves a large share of patients.", kind: "verified" },
      { text: "Appointment leakage — patients who call, cannot get through, and book with a competitor or an aggregator instead — is a direct revenue loss that per-hospital desks do not measure.", kind: "inference" },
      { text: "Consolidation activity in the southern hospital market raises the value of a standardised patient-access layer that new acquisitions can inherit on day one.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "CARE's technology function runs hospital information systems, diagnostics integration and compliance reporting. There is no software product organisation and no public evidence of conversational engineering. A PE-backed platform pursuing acquisitions specifically wants portable, purchasable capability rather than bespoke code.",
    whyNotBuild:
      "Four-language voice with medical vocabulary, telephony across a dozen hospital numbers, orchestration into HIS and LIS, and — critically — an evaluation regime that proves the agent never crosses into clinical advice is a platform undertaking. A hospital chain's capital goes into beds, cath labs and imaging, not speech infrastructure.",
    workflows: [
      {
        name: "Multilingual OPD appointment booking and rescheduling",
        friction: "A patient calls the hospital number at 8am when consultant slots open, gets a busy tone or a queue, and books through an aggregator or a competing hospital instead.",
        outcome: "Every call answered instantly in the caller's language, live consultant availability offered across the chain, and the appointment written into the hospital system with a confirmation and reminder.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Hospital information system", "Consultant scheduling", "Patient master index"],
        value: 3, complexity: 2,
      },
      {
        name: "Diagnostic report status and collection coordination",
        friction: "Patients call repeatedly to ask whether a report is ready; front desks put them on hold to check the lab system, and the same patient calls three times.",
        outcome: "Report readiness pushed proactively to the patient with secure access instructions, and status queries resolved without a human touching the lab system.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Laboratory information system", "Radiology information system", "Patient master index"],
        value: 3, complexity: 2,
      },
      {
        name: "Health-checkup package enquiry and post-discharge follow-up",
        friction: "Package pricing and inclusion questions are answered inconsistently by desk staff, and post-discharge follow-up calls are made irregularly when nursing staff have time.",
        outcome: "Consistent package explanation and booking, plus scheduled post-discharge check-in calls that confirm medication and follow-up appointments and escalate anything clinical to a nurse.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Package and tariff master", "Discharge summary records", "Nurse escalation queue"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Per-hospital appointment phone lines and front-desk counters", "A group website with doctor listings and appointment request forms", "A patient portal or app for reports and appointment history", "Health-checkup package catalogues published per hospital"],
      gaps: ["No single number that works across the chain in the patient's language", "Report status requires a human to check the lab system", "No proactive post-discharge follow-up at scale", "No measurement of how many appointment calls are abandoned"],
    },
    risks: [
      "An agent must never provide clinical advice, triage symptoms or interpret a report; all clinical content routes to qualified staff with hard-coded escalation.",
      "India's DPDP Act and hospital confidentiality obligations govern the handling of patient identity, appointment and diagnostic data, including consent for WhatsApp messaging.",
      "Report content and diagnostic findings must be delivered through authenticated channels only, never read aloud on an unverified inbound call.",
    ],
    economics: { volumeMonthly: 400000, costPerInteraction: 0.9, automationRate: 0.55, basis: "Seller assumptions: OPD appointment, report-status and package enquiry volume across the hospital network at Indian assisted-contact cost — validate per-hospital call volumes and abandonment in discovery." },
    pilotScope:
      "Deploy Telugu, Hindi and English voice and WhatsApp appointment booking plus report-status servicing for the Hyderabad hospitals, integrated to the HIS and LIS with strict clinical-escalation rules.",
    expansion: ["Extend to the Maharashtra, Chhattisgarh and Odisha hospitals with Marathi and Odia coverage", "Add health-checkup package sales and corporate-checkup coordination", "Add post-discharge follow-up with nurse escalation"],
    stakeholders: ["Group Chief Operating Officer", "Chief Information Officer", "Zonal Hospital Director", "Head of Patient Experience / Front Office", "Medical Superintendent (clinical governance)"],
    discovery: [
      "What is the abandonment rate on your appointment lines during the morning booking peak?",
      "How many report-status calls does a single patient episode generate on average?",
      "Which languages are actually spoken by callers to each hospital, and how are they staffed today?",
      "What is the standing rule for what a non-clinical staff member may say to a patient about a report?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient calls the Hyderabad hospital in Telugu at 8am for a cardiology slot; the agent finds the next available consultant across the city, books it and sends a WhatsApp confirmation.",
  },

  "yashoda-hospitals": {
    operatingContext:
      "Yashoda Hospitals runs large flagship campuses in Hyderabad delivering very high daily outpatient volumes across oncology, transplant, neurosciences and cardiac care, and draws a meaningful stream of patients from neighbouring states and from overseas for tertiary procedures. It is a promoter-led group whose growth has come from clinical depth and consultant reputation rather than from digital channels, so the front door remains the phone and the physical OPD counter. Patients and their families are predominantly Telugu- and Hindi-speaking and often navigate a complex first visit: which specialty, which consultant, which campus, what documents, what it will cost. International and out-of-state patients add an entirely separate coordination load around travel, estimates and accommodation that is handled by a small dedicated desk.",
    strategicPressure: [
      { text: "Very high daily OPD throughput at a small number of campuses concentrates enormous appointment and enquiry volume into narrow morning windows.", kind: "inference" },
      { text: "Competition in Hyderabad tertiary care is intense, with several large chains competing for the same referral and self-pay patients on access and service experience.", kind: "verified" },
      { text: "Out-of-state and international patients require pre-arrival coordination that is currently people-dependent and cannot scale with a small desk.", kind: "inference" },
      { text: "A promoter-led operating model means capital goes to clinical capability first, so administrative modernisation must justify itself on hard cost or revenue-leakage grounds.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Yashoda's IT function exists to run HIS, diagnostics and billing. There is no software engineering organisation, no published digital-product activity, and no reason for a family-owned clinical group to acquire one. This is a straightforward packaged-platform purchase decision made by operations and the promoter.",
    whyNotBuild:
      "The requirement is Telugu and Hindi voice quality good enough for anxious families, integration to a hospital information system that was not designed for external API traffic, and clinical-safety governance. Building any one of those would cost more than the entire administrative technology budget.",
    workflows: [
      {
        name: "OPD appointment and consultant-availability servicing",
        friction: "Morning call volume overwhelms the appointment desk; families call repeatedly, and many simply arrive at the campus and wait, which pushes crowding into the OPD itself.",
        outcome: "Instant Telugu and Hindi appointment booking against live consultant schedules across campuses, with confirmations and reminders reducing both no-shows and walk-in congestion.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Hospital information system", "Consultant schedules", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Report status and pre-visit preparation",
        friction: "Report-ready calls and questions about fasting, documents and which building to report to consume desk time and still leave patients arriving unprepared.",
        outcome: "Proactive pre-visit instructions in the patient's language and report-readiness notifications, cutting repeat calls and failed visits.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Laboratory and radiology systems", "Appointment records", "Departmental instruction library"],
        value: 3, complexity: 2,
      },
      {
        name: "Out-of-state and international patient coordination",
        friction: "Enquiries about treatment estimates, travel timing and admission logistics reach a small desk by phone and email and depend entirely on who picks up.",
        outcome: "Structured intake of the enquiry, package and estimate information delivered consistently, and a coordinator engaged only once the case is qualified and documented.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Estimate and tariff master", "International patient desk records", "Appointment system"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Campus appointment phone lines and OPD registration counters", "Website with specialty and consultant directories and enquiry forms", "An international patient coordination desk", "Diagnostic report collection counters and digital report access"],
      gaps: ["No answer capacity at the morning appointment peak", "No proactive pre-visit preparation messaging", "Report status requires a staff lookup", "International enquiries have no structured intake or tracking"],
    },
    risks: [
      "Clinical advice, symptom triage and report interpretation must be strictly out of scope and routed to clinical staff.",
      "Treatment cost estimates are sensitive and variable; an agent must give only approved package figures with clear caveats, never case-specific quotes.",
      "Patient data handling must satisfy India's DPDP Act and consent requirements for messaging channels, particularly for out-of-state and overseas patients.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 0.85, automationRate: 0.55, basis: "Seller assumptions: appointment, report-status and enquiry volume across the Hyderabad campuses at Indian assisted-contact cost — validate desk staffing and peak-hour abandonment in discovery." },
    pilotScope:
      "Deploy Telugu, Hindi and English voice appointment booking and report-status servicing for the main Hyderabad campus, integrated to the HIS with clinical-escalation rules enforced.",
    expansion: ["Extend across all campuses with cross-campus consultant availability", "Add pre-visit preparation and no-show reduction messaging", "Add structured international and out-of-state patient enquiry intake"],
    stakeholders: ["Executive Director / Promoter", "Chief Operating Officer", "Head of Information Technology", "Manager, Front Office and Appointments", "Medical Superintendent"],
    discovery: [
      "How many appointment calls arrive between 8am and 10am, and what share are answered?",
      "What proportion of OPD patients arrive without an appointment because they could not get through?",
      "How is the international patient desk staffed, and what happens to enquiries outside its hours?",
      "Does the HIS expose an interface for appointment booking today, or is it screen-based only?",
    ],
    flowTemplate: "appointments",
    scenario: "A family calls at 8:30am in Telugu for a neurology appointment; the agent books the next available consultant slot and sends pre-visit instructions on WhatsApp.",
  },

  "aig-hospitals": {
    operatingContext:
      "AIG Hospitals in Hyderabad is built around the Asian Institute of Gastroenterology, a quaternary referral centre that draws patients from across India and from South Asia and the Gulf for complex hepatobiliary, pancreatic and endoscopic care. Because its case mix is procedure-heavy, the dominant patient communication is not a simple appointment but a preparation sequence: fasting windows, bowel preparation, medication holds, anticoagulant instructions, escort requirements and arrival timing — each of which, if misunderstood, cancels a theatre or endoscopy slot on the day. Patients are referred in by physicians across states, so a large share arrive as first-time callers with no record, speaking Telugu, Hindi, Bengali or English. The result is a small number of extremely high-consequence conversations per patient, repeated thousands of times a month, currently handled by coordinators over the phone.",
    strategicPressure: [
      { text: "Procedure preparation failures cause same-day cancellations that waste scarce endoscopy and theatre capacity, which is the most expensive resource in the hospital.", kind: "inference" },
      { text: "A referral-driven national and international catchment means most callers are new, unregistered and multilingual, which makes the first conversation both critical and unstructured.", kind: "verified" },
      { text: "Quaternary specialisation supports premium pricing but also concentrates reputational risk in the coordination experience around procedures.", kind: "inference" },
      { text: "Coordinator capacity is the ceiling on how many procedures can be scheduled and properly prepared per day.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "AIG is a clinician-founded institution whose investment is in endoscopy suites, imaging and clinical research. Its technology footprint is hospital and departmental systems. There is no software product capability and no strategic reason to develop one for patient communication.",
    whyNotBuild:
      "Preparation instructions are clinically consequential, which raises the evaluation bar far above a normal service bot: every instruction must be traceable to an approved protocol, delivered in the right language, confirmed as understood, and escalated when the patient reports a condition the protocol does not cover. Building that governance stack is not something a specialty hospital can do.",
    workflows: [
      {
        name: "Procedure preparation instruction and confirmation",
        friction: "Preparation instructions are given verbally at booking and printed on a sheet; patients forget the fasting window or continue anticoagulants, and the procedure is cancelled on the morning.",
        outcome: "Protocol-grounded preparation delivered in the patient's language on a timed schedule before the procedure, with confirmation of understanding captured and any reported complication escalated to clinical staff.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Procedure scheduling system", "Approved preparation protocol library", "Clinical escalation queue"],
        value: 3, complexity: 3,
      },
      {
        name: "Referral and first-contact appointment intake",
        friction: "A referred patient from another state calls with a physician's note and no record; the coordinator has to establish specialty, urgency and consultant fit while other calls queue.",
        outcome: "Structured multilingual intake that captures referral details and routes the case to the right specialty clinic with an appointment and document checklist issued in-conversation.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Patient registration", "Consultant and clinic scheduling", "Referral records"],
        value: 3, complexity: 2,
      },
      {
        name: "Post-procedure follow-up and report coordination",
        friction: "Follow-up calls and histopathology report availability are handled ad hoc, so patients call repeatedly and follow-up appointments are missed.",
        outcome: "Scheduled post-procedure check-ins that confirm recovery instructions and book follow-up, with report availability pushed proactively and any symptom report escalated clinically.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Pathology and lab systems", "Appointment system", "Discharge instruction records"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Appointment and coordination phone lines staffed by hospital coordinators", "Printed and verbally delivered procedure preparation instructions", "Website with specialty and consultant information and enquiry forms", "Digital report access for diagnostics"],
      gaps: ["No timed, confirmed preparation sequence in the patient's own language", "No structured intake for out-of-state referral calls", "No proactive post-procedure follow-up at scale", "No record of whether a patient understood their preparation instructions"],
    },
    risks: [
      "Preparation instructions are clinical content; the agent may only deliver approved protocol text and must escalate any deviation, comorbidity or medication question to clinical staff.",
      "Any patient report of bleeding, pain or adverse reaction must trigger immediate human clinical escalation with no conversational handling.",
      "Patient data across states and countries must be handled under India's DPDP Act with explicit messaging consent.",
    ],
    economics: { volumeMonthly: 120000, costPerInteraction: 1.0, automationRate: 0.5, basis: "Seller assumptions: appointment, preparation and follow-up contact volume for a high-throughput quaternary centre at Indian assisted-contact cost — validate procedure volumes and coordinator headcount in discovery." },
    pilotScope:
      "Deploy multilingual timed procedure-preparation messaging and confirmation for endoscopy and day-procedure lists, grounded in the approved protocol library with hard clinical escalation.",
    expansion: ["Add multilingual referral intake and first-contact appointment booking", "Add post-procedure follow-up and report-availability notification", "Extend to international patient coordination for Gulf and South Asian referrals"],
    stakeholders: ["Chairman / Clinical Director", "Chief Operating Officer", "Head of Endoscopy and Procedure Scheduling", "Head of Information Technology", "Nursing Superintendent (clinical escalation owner)"],
    discovery: [
      "What is your same-day cancellation rate for endoscopy and day procedures, and how many trace to preparation failures?",
      "Who writes and approves preparation instructions today, and how are they versioned?",
      "How many appointment calls come from outside Telangana, and in which languages?",
      "What is the current escalation path when a patient calls at night reporting a symptom after a procedure?",
    ],
    flowTemplate: "appointments",
    scenario: "Two evenings before a colonoscopy the agent calls in Hindi to confirm the bowel-prep steps and fasting window, and escalates when the patient mentions she is still on a blood thinner.",
  },

  "sankara-nethralaya": {
    operatingContext:
      "Sankara Nethralaya is a Chennai-based not-for-profit ophthalmology institution running very high daily outpatient volumes alongside surgical services, community outreach and teleconsultation, with a patient base spanning Tamil Nadu, Andhra Pradesh, West Bengal and beyond. Eye care is unusually protocol-driven and high-throughput: a cataract or retina patient moves through a standard sequence of consultation, investigation, surgery date, pre-operative instructions and a fixed schedule of post-operative reviews, and the great majority of those touchpoints are identical across thousands of patients. Its mission model means a large share of care is subsidised or free, which makes administrative cost per patient a mission concern rather than only a commercial one. Patients reach the institution mainly by phone and by walking in, overwhelmingly in Tamil, with significant Bengali demand at its eastern operations.",
    strategicPressure: [
      { text: "A not-for-profit funding model means every rupee spent on administrative call handling is a rupee not spent on subsidised care, making automation a mission argument as much as a cost one.", kind: "inference" },
      { text: "Post-operative review compliance directly determines surgical outcomes in ophthalmology, and missed reviews are a clinical quality problem, not just a scheduling one.", kind: "verified" },
      { text: "High-volume, protocol-driven surgery means the same short conversation is repeated at enormous scale, which is the highest-yield automation profile in healthcare.", kind: "inference" },
      { text: "Patients travelling from other states for surgery need travel-aware scheduling and instruction delivery that a phone desk cannot personalise at volume.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A charitable ophthalmology institution funds clinical capability and research, not platform engineering. Its technology function runs hospital and electronic medical record systems. Any conversational capability arrives as a procured, configured platform, most plausibly with concessional or outcome-linked commercial terms.",
    whyNotBuild:
      "Tamil and Bengali voice with ophthalmic vocabulary, integration to surgical scheduling, and evaluation strict enough that no agent ever comments on vision outcomes is not something a not-for-profit hospital can build. Its constraint is budget, which argues for a shared platform rather than a bespoke one.",
    workflows: [
      {
        name: "Post-operative review scheduling and reminders",
        friction: "Post-op review appointments are given on a discharge slip; patients from distant districts miss them, and nobody knows until a complication presents late.",
        outcome: "Each patient receives Tamil-language reminders on the protocol schedule with the review booked and confirmed, and non-attendance surfaced to the clinical team for follow-up.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Surgical and appointment scheduling", "Electronic medical record", "Clinical follow-up queue"],
        value: 3, complexity: 2,
      },
      {
        name: "OPD appointment and surgery-date coordination",
        friction: "The appointment line is saturated in the morning; families call repeatedly or travel to the campus to book, which itself creates crowding.",
        outcome: "High-volume Tamil and English appointment booking against live clinic and theatre availability, with travel-aware scheduling for out-of-district patients.",
        channels: ["Voice", "IVR", "WhatsApp"],
        systems: ["Appointment system", "Theatre scheduling", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Pre-operative preparation and documentation",
        friction: "Fasting instructions, medication holds, escort requirements and pre-op investigation results are communicated verbally and frequently misremembered, causing day-of cancellations.",
        outcome: "Timed, protocol-grounded pre-operative instruction delivery with confirmation and a documented checklist, reducing surgical-list disruption.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Approved pre-operative protocol library", "Surgical scheduling", "Investigation results"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Appointment phone lines and campus registration counters", "Teleconsultation services for follow-up and remote patients", "Website with department information and appointment request forms", "Printed pre- and post-operative instruction material"],
      gaps: ["No systematic reminder and confirmation for the post-operative review schedule", "Appointment lines cannot absorb the morning peak", "No confirmation that pre-operative instructions were understood", "No Bengali-language live channel for eastern-region patients"],
    },
    risks: [
      "The agent must never comment on vision, healing or outcomes; all clinical content is protocol text only with immediate escalation for symptoms.",
      "Any report of pain, discharge or sudden vision change post-surgery must escalate to clinical staff instantly as an emergency path.",
      "Patient data and consent handling must satisfy India's DPDP Act, with particular care for subsidised and outreach patients who may have limited digital literacy.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 0.7, automationRate: 0.55, basis: "Seller assumptions: appointment, reminder and follow-up contact volume for a high-throughput eye institution at Indian assisted-contact cost, reflecting a not-for-profit cost base — validate in discovery." },
    pilotScope:
      "Deploy Tamil and English voice post-operative review reminders and rebooking for cataract surgery patients at the Chennai campus, grounded in the surgical schedule with clinical escalation rules.",
    expansion: ["Add high-volume OPD appointment booking to absorb the morning peak", "Add timed pre-operative preparation delivery and confirmation", "Extend to eastern-region operations with Bengali coverage and outreach-camp follow-up"],
    stakeholders: ["Director of Medical Services", "Chief Operating Officer", "Head of Information Technology", "Head of Outpatient Services and Appointments", "Head of Community Outreach"],
    discovery: [
      "What proportion of cataract patients complete their full post-operative review schedule?",
      "How many appointment calls does the institution receive on a typical morning, and how many are answered?",
      "How are outreach-camp patients followed up for surgery and review today?",
      "What budget model would let a not-for-profit fund this — per-interaction, outcome-linked, or grant-funded?",
    ],
    flowTemplate: "appointments",
    scenario: "A week after cataract surgery the agent calls a patient in Tamil to confirm her review appointment, rebooks it around her bus schedule and escalates when she mentions redness.",
  },

  "cloudnine": {
    operatingContext:
      "Cloudnine is a maternity, fertility and paediatrics chain with facilities across Bengaluru, Mumbai, NCR, Chennai, Pune and other metros, serving urban, digitally literate, mostly self-pay and insured families. Its defining characteristic is journey length: a pregnancy is a nine-month relationship with a fixed schedule of antenatal visits, scans, classes and tests, followed by delivery and then a paediatric vaccination calendar that runs for years. Fertility adds an even more communication-intensive cycle with date-critical medication and monitoring appointments. This makes Cloudnine's customer relationship unusually predictable and unusually dense in scheduled touchpoints — and today those touchpoints are largely coordinated by per-centre front desks, an app and reminder SMS, with the phone still the fallback for anything that varies.",
    strategicPressure: [
      { text: "The maternity journey is a fixed multi-month appointment schedule, which makes proactive coordination unusually high-yield compared with reactive service models.", kind: "verified" },
      { text: "Private-equity-backed expansion into new metros raises the cost of replicating per-centre front-desk coordination and favours a centralised engagement layer.", kind: "inference" },
      { text: "Competition with Motherhood and with large multi-specialty chains for the same urban maternity customer is decided substantially on service experience rather than clinical differentiation.", kind: "inference" },
      { text: "Package pricing enquiries — what the delivery package includes and what it costs — are among the highest-intent, highest-drop-off conversations in the business.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Cloudnine has invested in a consumer app and digital patient experience, so it is more digitally mature than a typical hospital chain, but that investment is product and content, not conversational infrastructure. Voice, telephony and orchestration across HIS and scheduling remain a purchase.",
    whyNotBuild:
      "Multi-language voice across four or more metros, WhatsApp at scale with consent management, integration to per-centre scheduling and a vaccination calendar engine, plus clinical-safety governance for pregnancy-related questions — none of that is buildable from a hospital chain's product team, and the clinical risk of getting it wrong is severe.",
    workflows: [
      {
        name: "Antenatal journey scheduling and proactive coordination",
        friction: "Antenatal visits, scans and tests are booked one at a time by phone or app; when a date slips the whole downstream schedule drifts and nobody reconciles it.",
        outcome: "The full antenatal schedule is maintained proactively, each visit confirmed and rebooked conversationally when needed, with preparation instructions delivered ahead of each scan or test.",
        channels: ["WhatsApp", "Voice", "App"],
        systems: ["Appointment and consultant scheduling", "Electronic medical record", "Protocol-based visit schedule"],
        value: 3, complexity: 3,
      },
      {
        name: "Package enquiry, pricing and conversion",
        friction: "A prospective mother comparing hospitals asks what a delivery package includes and costs; answers vary by who picks up the phone, and out-of-hours enquiries go unanswered entirely.",
        outcome: "Consistent, grounded package explanation in the family's language at any hour, with a consultant consultation booked in-conversation and enquiry-to-booking conversion measured.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Package and tariff master", "Consultant scheduling", "Lead CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Paediatric vaccination scheduling and reminders",
        friction: "The immunisation calendar spans years; reminders are generic SMS and compliance drops as children get older, losing both clinical adherence and repeat footfall.",
        outcome: "Per-child schedule-aware reminders that book the next dose conversationally and capture reasons when families defer, lifting completion rates and paediatric OPD volume.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Immunisation records", "Paediatric appointment scheduling", "Patient master index"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A consumer mobile app for appointments, records and pregnancy tracking", "Per-centre front desks and appointment phone lines", "Published maternity and delivery package information", "SMS and app-based appointment reminders"],
      gaps: ["Schedule drift across the antenatal journey is not reconciled proactively", "Package pricing enquiries go unanswered outside centre hours", "Vaccination reminders are generic rather than conversational and bookable", "Fertility-cycle date-critical coordination depends on staff calling patients"],
    },
    risks: [
      "Pregnancy, fertility and paediatric questions are clinical; the agent must handle only scheduling, logistics and approved package information, escalating anything symptomatic immediately.",
      "Reproductive and paediatric health data is highly sensitive under India's DPDP Act and requires explicit, revocable consent for each messaging channel.",
      "Any report of bleeding, reduced fetal movement or similar warning signs must trigger an immediate clinical escalation path with no conversational handling.",
    ],
    economics: { volumeMonthly: 300000, costPerInteraction: 1.1, automationRate: 0.55, basis: "Seller assumptions: antenatal, paediatric and enquiry contact volume across the network at Indian metro assisted-contact cost — validate per-centre desk staffing and app deflection in discovery." },
    pilotScope:
      "Deploy WhatsApp and voice antenatal schedule coordination and visit-preparation messaging for the Bengaluru centres, integrated to appointment scheduling with clinical escalation enforced.",
    expansion: ["Add package enquiry and conversion handling across all metros", "Add paediatric vaccination scheduling and reminder journeys", "Add fertility-cycle date-critical coordination with clinical oversight"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Digital / Product", "Regional Centre Head", "Medical Director (clinical governance)"],
    discovery: [
      "What proportion of antenatal appointments are rescheduled, and how is the downstream schedule corrected today?",
      "How many package enquiry calls arrive outside centre operating hours, and what happens to them?",
      "What is your current vaccination-schedule completion rate by dose number?",
      "How does the app's roadmap treat conversational channels — is WhatsApp in scope for your product team?",
    ],
    flowTemplate: "appointments",
    scenario: "A mother at 28 weeks reschedules her growth scan on WhatsApp; the agent rebooks it, shifts the two downstream visits and sends the fasting instructions for her glucose test.",
  },

  "motherhood-hospitals": {
    operatingContext:
      "Motherhood Hospitals is a private-equity-backed women's and children's hospital chain operating across Bengaluru, Chennai, Pune, Noida, Indore and other Indian cities, competing head-on with Cloudnine for the urban maternity customer. Its unit economics rest on filling a fixed number of delivery suites and paediatric consulting slots per centre, which makes enquiry conversion and appointment adherence the two levers that matter most. Like all maternity chains it inherits a naturally long, scheduled customer journey — antenatal visits, scans, antenatal classes, delivery, then paediatric care and immunisation — but its centres are smaller and more numerous than a flagship model, so coordination is spread across many thin front desks. Patients reach it through per-centre numbers, walk-ins, web enquiry forms and aggregator listings, in English, Hindi, Kannada and Tamil depending on the city.",
    strategicPressure: [
      { text: "Private-equity ownership imposes explicit targets on occupancy and cost per centre, making enquiry conversion and no-show rates directly board-relevant.", kind: "verified" },
      { text: "A many-small-centres footprint means front-desk staffing is inherently thin, so every centre has hours where nobody can answer an enquiry.", kind: "inference" },
      { text: "Direct competition for the same urban maternity customer is decided on responsiveness and coordination quality rather than clinical claims.", kind: "inference" },
      { text: "Antenatal class and package upsell revenue depends on proactive outreach that thin desks cannot sustain.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Motherhood is an operator, not a technology company; its systems are hospital information, scheduling and billing platforms bought from vendors. PE ownership pushes toward capability that can be deployed across the whole chain quickly and costed per interaction, which is a buy.",
    whyNotBuild:
      "Four-language voice, WhatsApp with consent handling, integration into per-centre scheduling and a clinical-escalation regime for pregnancy questions is a platform build with medical risk attached. No maternity chain will attempt it.",
    workflows: [
      {
        name: "Enquiry capture and package conversion",
        friction: "A pregnant woman calls a centre in the evening to ask about delivery packages and consultant availability; the desk has closed, the enquiry is lost, and she books at the competitor who answered.",
        outcome: "Every enquiry answered within a minute in the caller's language with grounded package and consultant information, and a first consultation booked in-conversation.",
        channels: ["Voice", "WhatsApp", "Web chat"],
        systems: ["Package and tariff master", "Consultant scheduling", "Lead CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Antenatal visit reminders and no-show recovery",
        friction: "Missed antenatal appointments leave consultant slots empty and clinical schedules incomplete; recovery depends on a desk having time to call back.",
        outcome: "Confirmations and reminders on the antenatal schedule with conversational rescheduling, and same-day recovery of cancelled slots by offering them to waiting patients.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Appointment scheduling", "Electronic medical record", "Waitlist records"],
        value: 3, complexity: 2,
      },
      {
        name: "Paediatric vaccination and follow-up outreach",
        friction: "Vaccination due dates are tracked in records but reminders are generic and unbooked, so families drift to neighbourhood clinics for later doses.",
        outcome: "Schedule-aware reminders that book the next dose in the conversation, retaining paediatric footfall and improving immunisation completion.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Immunisation records", "Paediatric scheduling", "Patient master index"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Per-centre appointment lines and front desks", "Website and web enquiry forms with package information", "SMS appointment reminders", "Antenatal class and workshop programmes marketed to expectant families"],
      gaps: ["No enquiry handling outside centre desk hours", "No cross-centre view of an enquiry or a patient", "Reminders do not allow rescheduling in the same channel", "Cancelled slots are rarely refilled the same day"],
    },
    risks: [
      "All clinical content, including pregnancy symptom questions, must escalate to qualified staff; the agent handles logistics and approved package information only.",
      "Maternity and paediatric data is sensitive personal data under India's DPDP Act requiring explicit channel-level consent.",
      "Package price statements must be grounded in the approved tariff and clearly caveated, since final billing varies with clinical course.",
    ],
    economics: { volumeMonthly: 180000, costPerInteraction: 1.0, automationRate: 0.55, basis: "Seller assumptions: enquiry, appointment and reminder volume across the centre network at Indian metro assisted-contact cost — validate per-centre enquiry counts and out-of-hours loss in discovery." },
    pilotScope:
      "Deploy multilingual voice and WhatsApp enquiry capture and consultation booking for the Bengaluru and Chennai centres, with out-of-hours coverage and lead-conversion measurement.",
    expansion: ["Add antenatal reminder, rescheduling and same-day slot recovery", "Extend to all cities with local-language coverage", "Add paediatric vaccination outreach and antenatal class enrollment"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Marketing and Patient Acquisition", "Centre Head (pilot cities)", "Head of Information Technology"],
    discovery: [
      "How many enquiry calls per centre go unanswered outside desk hours, and is that measured today?",
      "What is your antenatal appointment no-show rate, and what happens to a cancelled slot?",
      "Where does a web enquiry land today, and how quickly is it contacted?",
      "Which package price statements are you willing to have stated conversationally without a human?",
    ],
    flowTemplate: "appointments",
    scenario: "An expectant mother calls a Bengaluru centre at 9pm asking what the delivery package covers; the agent explains it, books her first consultation and confirms on WhatsApp.",
  },

  "rainbow-childrens": {
    operatingContext:
      "Rainbow Children's Medicare is a listed paediatric and maternity hospital group headquartered in Hyderabad, operating hospitals and clinics across Telangana, Karnataka, Tamil Nadu and the Delhi NCR region, with a case mix built on paediatric multi-specialty care, neonatal intensive care and perinatal services. Its patient relationships are structurally recurring: a child seen once for a neonatal admission or a vaccination visit generates years of subsequent paediatric contact, and a maternity patient converts into a paediatric one. Because it is listed, operating leverage — revenue per bed, occupancy, and administrative cost ratios — is scrutinised quarterly, which makes coordination efficiency a reported concern rather than an internal one. Contact today runs through per-hospital appointment lines, front desks and an app, mostly in Telugu, Hindi, Kannada, Tamil and English depending on the city.",
    strategicPressure: [
      { text: "As a listed operator adding bed capacity, Rainbow faces investor scrutiny on occupancy ramp and operating leverage at new units, which favours centralised rather than per-hospital coordination.", kind: "verified" },
      { text: "Paediatric care generates an unusually recurring contact pattern through the immunisation calendar, which is both a retention opportunity and an unmanaged one today.", kind: "inference" },
      { text: "NICU families need frequent, emotionally difficult status communication that is currently entirely clinician-delivered and consumes scarce nursing time.", kind: "inference" },
      { text: "Expansion into NCR and other non-Telugu markets stretches a call-handling model designed around Hyderabad.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Rainbow's technology function operates hospital systems and a patient app; it has no conversational or speech engineering capability and no reason to develop one. A listed hospital group buys capability that shows up as an operating expense with measurable payback.",
    whyNotBuild:
      "The workflows span five languages, four states, and clinically sensitive paediatric and neonatal contexts. The governance requirement alone — proving that no agent ever gives paediatric advice — is a platform capability, not a hospital IT project.",
    workflows: [
      {
        name: "Vaccination-schedule reminders and booking",
        friction: "Immunisation due dates sit in records; SMS reminders go out but do not book anything, so families default to a nearby clinic and the paediatric relationship lapses.",
        outcome: "Per-child, schedule-aware conversational reminders that book the next dose immediately, raising completion rates and retaining paediatric OPD volume.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Immunisation records", "Paediatric appointment scheduling", "Patient master index"],
        value: 3, complexity: 2,
      },
      {
        name: "Paediatric OPD appointment and consultant availability",
        friction: "Parents with a sick child call for the earliest slot and hit a queue; they take the child to a walk-in clinic instead, and the hospital loses both the visit and the relationship.",
        outcome: "Immediate multilingual booking against live consultant availability across nearby units, with urgency triage boundaries clearly defined and emergencies directed to casualty.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Consultant scheduling", "Hospital information system", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Maternity-to-paediatric handover and follow-up",
        friction: "A delivery at a Rainbow unit does not reliably convert into paediatric follow-up; the transition depends on discharge paperwork and parental initiative.",
        outcome: "Structured post-delivery outreach that books the newborn's first paediatric review and enrols the family into the immunisation journey, with any clinical concern escalated to staff.",
        channels: ["WhatsApp", "Voice"],
        systems: ["Maternity and neonatal records", "Paediatric scheduling", "Immunisation calendar"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Per-hospital appointment lines and front-desk registration", "A patient app with appointment and record access", "SMS reminders for appointments and vaccinations", "Website with paediatric specialty and consultant directories"],
      gaps: ["Vaccination reminders cannot be acted on in the same channel", "No cross-unit consultant availability offered to a caller", "Maternity-to-paediatric conversion is not actively managed", "No live-language coverage matching the NCR and Tamil Nadu units"],
    },
    risks: [
      "Paediatric symptom questions must never be triaged conversationally; urgent presentations must be directed to emergency care with an explicit, tested rule set.",
      "Children's health data carries heightened sensitivity under India's DPDP Act, including guardian consent for messaging.",
      "NICU-related communication is emotionally charged and clinically consequential; status updates must remain clinician-delivered.",
    ],
    economics: { volumeMonthly: 220000, costPerInteraction: 0.95, automationRate: 0.55, basis: "Seller assumptions: paediatric appointment, vaccination and enquiry contact volume across units at Indian assisted-contact cost — validate immunisation base size and per-unit call volumes in discovery." },
    pilotScope:
      "Deploy Telugu, Hindi and English vaccination reminder-and-booking journeys across the Hyderabad units, integrated to immunisation records and paediatric scheduling.",
    expansion: ["Add paediatric OPD appointment booking with cross-unit availability", "Extend to Bengaluru, Chennai and NCR units with local languages", "Add maternity-to-paediatric handover and newborn follow-up journeys"],
    stakeholders: ["Managing Director", "Chief Operating Officer", "Chief Information Officer", "Head of Paediatric Services (clinical governance)", "Head of Patient Experience"],
    discovery: [
      "What is your immunisation-schedule completion rate by dose, and how many families lapse after the first year?",
      "How many paediatric appointment calls are abandoned during evening peaks?",
      "What proportion of babies delivered at Rainbow units return for paediatric follow-up?",
      "What is the hard rule today on what a non-clinical staff member may say to a parent describing symptoms?",
    ],
    flowTemplate: "appointments",
    scenario: "The agent calls a parent in Telugu about a due booster, books the slot at the nearest Rainbow unit and directs an unrelated fever question to the paediatric helpline.",
  },

  "kauvery-hospital": {
    operatingContext:
      "Kauvery Hospital is a Tamil Nadu-rooted multi-specialty chain that grew from Trichy into Chennai and a series of tier-2 cities including Salem, Hosur and Tirunelveli, with a case mix spanning cardiac, orthopaedic, emergency and general secondary care. Its differentiation is proximity: it brings tertiary-adjacent capability to cities where the alternative is a long journey to Chennai, which means its patients are overwhelmingly Tamil-first, often older, and strongly voice-preferring rather than app-using. Revenue is a mix of insurance, government scheme and self-pay work, with health checkups and elective procedures as important discretionary volume. Operationally, each hospital runs its own appointment desk and enquiry number, so the chain's brand is national in Tamil Nadu while the patient experience is entirely local.",
    strategicPressure: [
      { text: "Tier-2 city expansion means serving patients whose primary and often only interaction channel is a Tamil-language phone call, not an app or portal.", kind: "verified" },
      { text: "Per-hospital appointment desks cannot deliver a consistent experience or route a patient to a nearby unit with earlier availability.", kind: "inference" },
      { text: "Health-checkup and elective-procedure volume is discretionary and highly responsive to proactive outreach that thin desks cannot sustain.", kind: "inference" },
      { text: "Government scheme and insurance pre-authorisation queries generate substantial repeat contact that consumes front-desk capacity without revenue.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Kauvery is a clinician-founded regional operator whose investment goes into new units and clinical equipment. Its IT capability administers HIS and billing. Conversational capability is unambiguously a purchase, and its regional-language requirement is exactly what a multilingual platform provides off the shelf.",
    whyNotBuild:
      "Tamil voice good enough for elderly callers in tier-2 cities, telephony across a dozen hospital numbers, and HIS integration is a platform problem. Nothing in a regional hospital chain's P&L supports building it.",
    workflows: [
      {
        name: "Tamil-language appointment booking across units",
        friction: "A patient in Salem calls the local hospital for a cardiology slot, is told the consultant visits next week, and never learns that the Trichy unit has a slot tomorrow.",
        outcome: "Tamil-first booking that sees availability across the chain, offers the earliest realistic option and books it, with confirmation and reminders in Tamil.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Hospital information system", "Consultant visiting schedules", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Health-checkup package enquiry and campaign conversion",
        friction: "Checkup packages are marketed by local campaigns and handled by whichever desk staff answers; conversion is unmeasured and follow-up is nonexistent.",
        outcome: "Consistent Tamil explanation of package contents and pricing, booking in-conversation, and structured follow-up of unconverted enquiries with measured conversion by campaign.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Package and tariff master", "Checkup scheduling", "Campaign and lead records"],
        value: 3, complexity: 2,
      },
      {
        name: "Insurance and scheme pre-authorisation status servicing",
        friction: "Families of admitted patients call repeatedly to ask whether insurance or scheme approval has come through; desk staff chase the TPA desk and call back, or do not.",
        outcome: "Proactive status updates as authorisation progresses and instant answers to status calls, cutting anxious repeat contact and freeing the billing desk.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Billing and TPA workflow", "Admission records", "Scheme claim tracking"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Per-hospital appointment and enquiry telephone lines", "Website with unit, specialty and consultant listings", "Health-checkup package catalogues and local campaigns", "Front-desk insurance and TPA coordination at each unit"],
      gaps: ["No chain-wide view of consultant availability offered to a caller", "No Tamil-language service outside desk hours", "No proactive insurance or scheme authorisation status updates", "Checkup campaign enquiries are not followed up systematically"],
    },
    risks: [
      "Clinical questions and symptom descriptions must escalate to clinical staff; the agent handles scheduling, packages and administrative status only.",
      "Government scheme eligibility statements carry compliance weight and must be grounded in the approved scheme rules, never inferred.",
      "Patient and insurance data handling must satisfy India's DPDP Act with consent captured per channel, including for elderly patients contacted by proxy family members.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 0.8, automationRate: 0.55, basis: "Seller assumptions: appointment, checkup and administrative-status contact volume across Tamil Nadu units at Indian assisted-contact cost — validate per-unit call volumes in discovery." },
    pilotScope:
      "Deploy Tamil and English voice appointment booking with chain-wide consultant availability for the Trichy and Salem units, integrated to the hospital information system.",
    expansion: ["Extend to Chennai and all tier-2 units with a single chain number", "Add health-checkup package enquiry, booking and campaign follow-up", "Add insurance and scheme authorisation status outreach"],
    stakeholders: ["Executive Director / Promoter", "Chief Operating Officer", "Unit Medical Director", "Head of Information Technology", "Head of Marketing and Business Development"],
    discovery: [
      "Can a caller to the Salem unit currently be offered an earlier slot at another Kauvery hospital?",
      "How many calls per day does each unit's appointment desk take, and what share go unanswered?",
      "How is checkup campaign conversion measured today, from enquiry to completed checkup?",
      "How many calls per admission are about insurance or scheme authorisation status?",
    ],
    flowTemplate: "appointments",
    scenario: "A patient calls the Salem hospital in Tamil for a cardiology consult; the agent finds an earlier slot at Trichy, books it and confirms the pre-visit documents.",
  },

  "hcg-oncology": {
    operatingContext:
      "HealthCare Global Enterprises is India's largest dedicated cancer-care network, operating comprehensive centres across Bengaluru, Ahmedabad, Kolkata, Mumbai, Hyderabad and a spread of tier-2 cities, with radiation oncology, medical oncology and surgical oncology under one roof. Oncology creates the densest scheduled-communication burden in healthcare: a single patient on a chemotherapy protocol may have twenty to thirty scheduled appointments over six months, each with pre-treatment blood work, each dependent on counts, each subject to rescheduling, and radiation patients attend daily for weeks. Around that sits a constant stream of family questions about reports, costs, insurance authorisation and travel logistics, since many patients travel from other cities for treatment. Today this is coordinated by care coordinators and centre front desks over the phone, in Kannada, Hindi, Telugu, Bengali, Gujarati and English depending on the centre.",
    strategicPressure: [
      { text: "Oncology treatment protocols generate a very high number of scheduled, interdependent appointments per patient, so coordination failures cascade across a treatment plan.", kind: "verified" },
      { text: "Private-equity ownership focuses management on centre-level utilisation of expensive linear accelerators and day-care chairs, where a missed slot is unrecoverable capacity.", kind: "verified" },
      { text: "Patients travelling from other cities need logistics-aware scheduling that a per-centre desk cannot deliver consistently.", kind: "inference" },
      { text: "Care-coordinator time is spent largely on scheduling and status calls rather than on the supportive coordination that drives patient retention and outcomes.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "HCG's technology investment targets oncology information systems, radiation planning and diagnostics integration. It is a clinical network, not a platform builder, and its ownership structure rewards measurable operating expense over capitalised software development.",
    whyNotBuild:
      "Oncology conversations sit adjacent to the most sensitive clinical content in medicine. Any agent operating here needs airtight scope limits, tested distress handling, multilingual voice and deep scheduling integration — a governance and platform problem that a cancer-care network has no capacity to solve internally.",
    workflows: [
      {
        name: "Treatment-cycle scheduling and rescheduling",
        friction: "When a chemotherapy cycle shifts because counts are low, every downstream appointment, blood test and travel plan must be rebuilt by a coordinator on the phone, and often is not.",
        outcome: "The full treatment schedule is maintained conversationally in the patient's language, downstream appointments rebuilt automatically within protocol rules, and the day-care chair or linac slot released for reuse.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Oncology scheduling", "Day-care and radiation slot management", "Electronic medical record"],
        value: 3, complexity: 3,
      },
      {
        name: "Pre-treatment preparation and report readiness",
        friction: "Patients arrive without required blood work or having missed fasting and medication instructions, wasting a treatment slot and a family's day of travel.",
        outcome: "Timed, protocol-grounded preparation messages with confirmation, plus proactive notification when reports are ready, cutting wasted slots and repeat calls.",
        channels: ["WhatsApp", "Voice", "SMS"],
        systems: ["Laboratory information system", "Protocol instruction library", "Appointment records"],
        value: 3, complexity: 2,
      },
      {
        name: "Cost estimate and insurance authorisation status",
        friction: "Families call repeatedly about treatment cost estimates and insurance approvals, and each call pulls a coordinator away from clinical coordination.",
        outcome: "Approved estimate information delivered consistently and authorisation status pushed proactively as it changes, with financial-counselling handoff for genuine decisions.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Billing and estimate system", "TPA and insurance workflow", "Financial counselling records"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Care coordinators assigned to patients on treatment protocols", "Per-centre appointment and enquiry phone lines", "Digital diagnostic report access", "Financial counselling and insurance coordination desks"],
      gaps: ["Schedule changes are rebuilt manually and inconsistently", "No confirmed pre-treatment preparation delivery", "No proactive insurance authorisation status", "No multilingual coverage matching each centre's local language"],
    },
    risks: [
      "The agent must never discuss diagnosis, prognosis, treatment efficacy or report findings; scope is strictly scheduling, logistics, preparation and approved administrative information.",
      "Oncology patients and families are frequently in distress; distress cues must route immediately to a human care coordinator with the transcript attached.",
      "Cancer diagnosis and treatment data is among the most sensitive personal data under India's DPDP Act and requires strict consent and access controls.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 1.1, automationRate: 0.45, basis: "Seller assumptions: treatment-cycle coordination and enquiry volume across the centre network at Indian assisted-contact cost, with a conservative automation rate reflecting clinical scope limits — validate in discovery." },
    pilotScope:
      "Deploy multilingual treatment-cycle appointment confirmation, rescheduling and pre-treatment preparation messaging for the Bengaluru centres, with hard clinical and distress escalation rules.",
    expansion: ["Extend to all comprehensive centres with local-language coverage", "Add report-readiness notification and diagnostic coordination", "Add insurance authorisation status and estimate servicing with counselling handoff"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Clinical Operations / Medical Director", "Head of Patient Care Coordination", "Chief Information Officer"],
    discovery: [
      "When a chemotherapy cycle is deferred, who rebuilds the downstream schedule and how long does it take?",
      "What proportion of day-care and radiation slots are lost to no-shows or unprepared arrivals?",
      "What are the standing rules today on what a care coordinator may say to an oncology patient?",
      "How are distress and psychological-support needs detected and escalated in current phone contact?",
    ],
    flowTemplate: "appointments",
    scenario: "A chemotherapy cycle is deferred for low counts; the agent calls the patient in Kannada, rebuilds the next three appointments and releases the day-care chair for another patient.",
  },

  "dr-agarwals": {
    operatingContext:
      "Dr. Agarwal's Eye Hospital is a listed ophthalmology chain running well over a hundred centres across India and a set of operations in Africa, built on very high-volume cataract and refractive surgery plus retina, glaucoma and paediatric ophthalmology services. Its model is throughput: standardised surgical pathways delivered at scale through a dense network of small centres, many in tier-2 and tier-3 towns, feeding a smaller number of surgical facilities. That means the patient journey is highly repeatable — screening, diagnosis, surgery counselling and date, pre-operative instructions, surgery, and a fixed post-operative review sequence — and it is repeated across a dozen languages as the network spans Tamil Nadu, Karnataka, Maharashtra, Telangana and the north. Contact today runs through centre phone numbers and a central number, with counselling and conversion happening face to face at the centre.",
    strategicPressure: [
      { text: "Aggressive centre expansion means new units open with thin administrative staffing and no established local call-handling capacity.", kind: "verified" },
      { text: "Post-IPO scrutiny of same-store growth and margins makes surgery conversion rate — the share of diagnosed patients who actually book and attend surgery — a reported performance driver.", kind: "verified" },
      { text: "Cataract surgery conversion depends heavily on counselling follow-up after the initial diagnosis, which is currently centre-dependent and largely unmeasured.", kind: "inference" },
      { text: "A dozen-language footprint makes any single-language central call centre structurally inadequate.", kind: "inference" },
    ],
    buildVsBuyWhy:
      "Dr. Agarwal's technology function runs clinical and practice-management systems across a rapidly growing network. It has no speech or conversational engineering capability, and a listed high-growth operator will treat conversational capability as an opex line with a payback calculation, not a build.",
    whyNotBuild:
      "The differentiating requirement is language breadth at scale — Tamil, Telugu, Kannada, Marathi, Hindi, Bengali and English across hundreds of centres — plus surgical scheduling integration and clinical-safety scope limits. No eye-care chain can assemble that.",
    workflows: [
      {
        name: "Surgery counselling follow-up and conversion",
        friction: "A patient diagnosed with cataract at a centre goes home to think about it; the follow-up depends on whether a counsellor has time to call, so a large share of diagnosed patients never convert.",
        outcome: "Structured, in-language follow-up that answers cost, recovery-logistics and scheduling questions, books the surgery date and hands genuinely clinical questions to the surgeon's team.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Practice management system", "Surgical scheduling", "Package and tariff master"],
        value: 3, complexity: 2,
      },
      {
        name: "Post-operative review scheduling and adherence",
        friction: "Post-op reviews follow a fixed schedule but attendance falls off after the first visit, particularly for patients who travelled from smaller towns.",
        outcome: "Protocol-timed reminders in the patient's language with rescheduling in-conversation and non-attendance flagged to the clinical team, improving both outcomes and centre utilisation.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Surgical records", "Appointment scheduling", "Clinical follow-up queue"],
        value: 3, complexity: 2,
      },
      {
        name: "Centre appointment booking and screening-camp follow-up",
        friction: "New centres and screening camps generate enquiry and referral volume that thin local staffing cannot absorb, so leads decay.",
        outcome: "Central multilingual booking that covers every centre from day one and converts camp-screened patients into diagnostic appointments with measured conversion.",
        channels: ["Voice", "WhatsApp", "IVR"],
        systems: ["Practice management system", "Camp and screening records", "Centre schedules"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Centre-level appointment phone lines and a central enquiry number", "Website with centre locator and appointment request forms", "In-centre counselling for surgery conversion", "Screening camps and community outreach generating referrals"],
      gaps: ["Post-diagnosis surgery counselling follow-up is inconsistent and unmeasured", "No language coverage matching the geographic spread on live channels", "Post-operative review adherence is not actively managed", "New centres open without call-handling capacity"],
    },
    risks: [
      "The agent must never discuss diagnosis, surgical suitability or visual outcomes; clinical content is limited to approved instruction text with escalation.",
      "Post-operative symptom reports such as pain or sudden vision loss must trigger an immediate clinical escalation path.",
      "Patient data across states and the African operations must be handled under India's DPDP Act and the relevant local regimes, with channel-level consent.",
    ],
    economics: { volumeMonthly: 350000, costPerInteraction: 0.75, automationRate: 0.6, basis: "Seller assumptions: appointment, counselling-follow-up and post-operative reminder volume across a large centre network at Indian assisted-contact cost — validate surgical volumes and current counsellor headcount in discovery." },
    pilotScope:
      "Deploy Tamil and English surgery counselling follow-up and post-operative review reminders for the Tamil Nadu centres, integrated to practice management and surgical scheduling.",
    expansion: ["Extend to Telugu, Kannada, Marathi and Hindi centres with a single central number", "Add screening-camp referral conversion and new-centre appointment coverage", "Extend to the African operations with local-language and telephony coverage"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Clinical Services (ophthalmology governance)", "Chief Information Officer", "Head of Marketing and Patient Acquisition"],
    discovery: [
      "What share of patients diagnosed with cataract at a centre convert to surgery, and over what period?",
      "Who calls a diagnosed patient today for follow-up, and is that call recorded anywhere?",
      "How do you staff appointment handling at a centre in its first six months?",
      "What is your post-operative review attendance rate at the second and third visits?",
    ],
    flowTemplate: "appointments",
    scenario: "Four days after a cataract diagnosis the agent calls in Tamil, answers the family's cost and recovery questions and books the surgery date at the nearest surgical centre.",
  },

  "medpark": {
    operatingContext:
      "MedPark Hospital is a single-site premium tertiary hospital in central Bangkok, opened as a physician-led venture positioned against Bumrungrad, Samitivej and the BDMS network for high-acuity domestic patients and international medical travellers. Because it is one building rather than a network, its economics depend on filling specialist clinics and operating theatres from a catchment that includes Thai self-pay and insured patients, expatriates resident in Bangkok, and inbound patients from CLMV countries, China and the Gulf. That last group arrives through a fundamentally different funnel: an enquiry in a foreign language about whether a condition can be treated, what it costs, how long the stay is, and how visas and accommodation work — a coordination conversation, not a booking. Contact today runs through a call centre, an international patient office, LINE and web enquiry forms, in Thai and English with interpreter support for other languages.",
    strategicPressure: [
      { text: "Thailand's medical-travel sector competes internationally on service experience and responsiveness, and enquiries from overseas patients are won by whoever answers first and most completely.", kind: "verified" },
      { text: "As a newer single-site entrant, MedPark must build referral and repeat volume against incumbents with decades of brand equity and far larger international marketing operations.", kind: "verified" },
      { text: "International patient enquiries arrive across many time zones and languages, which a Bangkok-hours interpreter-supported desk cannot cover.", kind: "inference" },
      { text: "Specialist clinic and theatre utilisation at a single premium site is highly sensitive to no-shows and to slow conversion of enquiries into confirmed appointments.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "MedPark is a hospital operating company with a clinical and hospitality investment thesis. Its technology spend goes to hospital information systems, imaging and the patient app. There is no engineering organisation, and a single-site operator has no scale over which to amortise a platform build.",
    whyNotBuild:
      "Serving Thai, English, Mandarin and Arabic-speaking enquirers on voice and messaging, grounded in a treatment and package catalogue, with clinical scope limits and medical-travel coordination logic, is a platform capability. A single hospital buys it or does without.",
    workflows: [
      {
        name: "International patient enquiry intake and coordination",
        friction: "An enquiry from Yangon, Kunming or Dubai arrives by email or web form outside Bangkok hours; by the time the international office replies with a request for medical records, the patient has enquired at three competitors.",
        outcome: "Immediate in-language intake capturing condition, records and travel intent, an approved indicative package explanation, and a coordinator engaged with a complete file rather than a cold enquiry.",
        channels: ["Web chat", "WhatsApp", "LINE", "Voice"],
        systems: ["International patient office records", "Package and estimate master", "Appointment scheduling"],
        value: 3, complexity: 3,
      },
      {
        name: "Specialist clinic appointment booking and reminders",
        friction: "Domestic patients call the hospital line for specialist slots and queue; no-shows leave premium clinic capacity idle with no recovery mechanism.",
        outcome: "Thai and English booking against live specialist availability with confirmation, preparation instructions and same-day recovery of cancelled slots.",
        channels: ["Voice", "LINE", "App"],
        systems: ["Hospital information system", "Specialist clinic scheduling", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Health-checkup package enquiry and corporate booking",
        friction: "Executive checkup packages are a core acquisition product but enquiry handling is manual, and corporate bookings for employee checkups involve long email chains.",
        outcome: "Grounded package explanation and booking in-conversation for individuals, plus structured coordination for corporate group bookings with scheduling handled conversationally.",
        channels: ["LINE", "Voice", "Web chat"],
        systems: ["Package master", "Checkup scheduling", "Corporate account records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A hospital call centre handling appointments and enquiries in Thai and English", "An international patient office with interpreter support", "LINE official account for patient communication", "Website with specialty, physician and package information"],
      gaps: ["No live coverage in Mandarin or Arabic for inbound medical-travel enquiries", "No out-of-hours handling of international enquiries arriving from other time zones", "No structured intake capturing medical records before a coordinator engages", "No same-day recovery of cancelled specialist slots"],
    },
    risks: [
      "Thai medical regulations and hospital policy prohibit non-clinical staff from assessing treatability or giving medical advice; the agent must confine itself to logistics and approved package information.",
      "Cost estimates for international patients are indicative and highly variable; any figure given must be an approved published package figure with explicit caveats.",
      "Thailand's PDPA governs patient data handling, and cross-border transfer of records from enquiring overseas patients adds consent and residency requirements.",
    ],
    economics: { volumeMonthly: 70000, costPerInteraction: 1.6, automationRate: 0.5, basis: "Seller assumptions: call-centre, LINE and international enquiry volume for a single premium tertiary site at Thai assisted-contact cost — validate international enquiry counts and conversion in discovery." },
    pilotScope:
      "Deploy Thai, English and Mandarin enquiry intake and specialist appointment booking on LINE, web chat and voice, integrated to the hospital information system with clinical scope limits enforced.",
    expansion: ["Add Arabic coverage and full international patient coordination workflows", "Add health-checkup package sales and corporate group booking", "Add proactive appointment reminders and cancelled-slot recovery"],
    stakeholders: ["Chief Executive Officer", "Director, International Patient Services", "Chief Operating Officer", "Head of Information Technology", "Head of Marketing and Business Development"],
    discovery: [
      "How many international enquiries arrive per month, in which languages, and what is your current response time?",
      "What share of international enquiries convert to a confirmed appointment or admission?",
      "What is your specialist clinic no-show rate, and is there any recovery process for a cancelled slot?",
      "What may an international coordinator say about cost and treatability without a physician's sign-off?",
    ],
    flowTemplate: "appointments",
    scenario: "A family in Yangon enquires at 10pm in Mandarin about cardiac surgery; the agent captures the records, explains the approved package range and books a coordinator call for the morning.",
  },

  "tokushukai": {
    operatingContext:
      "Tokushukai Medical Group is Japan's largest private hospital group, running on the order of seventy hospitals plus clinics, dialysis units, care facilities and home-nursing services across the country, with a founding mission of round-the-clock acceptance of patients regardless of ability to pay. That federated scale means the group brand is national while operations are intensely local: each hospital manages its own outpatient reception, appointment handling and ningen dock health-checkup bookings, largely by telephone, largely in business hours, largely with paper-adjacent processes. Its patient population skews elderly, which reinforces voice as the dominant channel and makes politeness, patience and repetition load-bearing service attributes. Health checkups are also a significant commercial line sold to individuals and to corporate employers, with booking concentrated in seasonal windows.",
    strategicPressure: [
      { text: "Japan's healthcare workforce shortage is acute and worsening, making every hour of clerical reception work performed by nursing or administrative staff a scarce resource misallocated.", kind: "verified" },
      { text: "An elderly patient base means telephone remains the dominant channel and digital self-service adoption is structurally limited, so automation must be voice-first rather than app-first.", kind: "verified" },
      { text: "A federated group of roughly seventy hospitals cannot deliver a consistent booking experience or measure it, and standardising a reception layer is far cheaper than standardising staffing.", kind: "inference" },
      { text: "Ningen dock checkup bookings concentrate into seasonal peaks that overwhelm individual hospital reception desks.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Japanese hospital groups procure systems from established healthcare IT vendors and integrate them; Tokushukai's technology footprint is electronic medical records and hospital administration, not software development. A federated structure further favours a bought layer that each hospital can adopt without local engineering.",
    whyNotBuild:
      "Japanese voice quality good enough for elderly callers, telephony across seventy hospital numbers, integration into heterogeneous electronic medical record and reservation systems, and evaluation for clinical safety is a platform undertaking far outside a hospital group's capability.",
    workflows: [
      {
        name: "Outpatient appointment and reservation handling",
        friction: "Reception phones are busiest exactly when reception staff are checking in the morning outpatient queue, so calls go unanswered and elderly patients simply arrive and wait.",
        outcome: "Polite Japanese voice handling of booking, changes and cancellations against each hospital's live reservation system, at any hour, with confirmation by the patient's preferred method.",
        channels: ["Voice", "IVR", "SMS"],
        systems: ["Hospital reservation system", "Electronic medical record", "Patient registration"],
        value: 3, complexity: 2,
      },
      {
        name: "Ningen dock health-checkup booking and preparation",
        friction: "Checkup bookings peak seasonally and involve preparation instructions — fasting, medication, sample collection — that are explained by phone and frequently misremembered.",
        outcome: "Seasonal peak absorbed without queues, checkups booked into live capacity, and timed preparation instructions delivered and confirmed before the appointment.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Checkup booking system", "Preparation protocol library", "Corporate account records"],
        value: 3, complexity: 2,
      },
      {
        name: "Care-facility and home-nursing family coordination",
        friction: "Families of residents and home-care patients call facilities for scheduling, visit arrangements and administrative questions, interrupting care staff mid-shift.",
        outcome: "Administrative family enquiries handled conversationally with anything care-related routed to the responsible staff member, protecting frontline care time.",
        channels: ["Voice", "SMS"],
        systems: ["Care facility records", "Home-nursing scheduling", "Staff escalation routing"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Per-hospital outpatient reception and telephone reservation desks", "Ningen dock health-checkup booking services", "Group website with hospital and department directories", "Care facility and home-nursing coordination teams"],
      gaps: ["No telephone answering outside hospital reception hours", "No consistent booking experience or measurement across group hospitals", "Checkup preparation instructions are not confirmed as understood", "Care staff are interrupted by administrative family calls"],
    },
    risks: [
      "The agent must never triage symptoms or advise on whether to attend; urgent presentations must be directed to emergency services with a tested rule set.",
      "Japan's personal information protection law and medical-record confidentiality rules govern patient data handling across a federated group with varied local practice.",
      "Elderly callers require patience, repetition and keigo-level politeness; a poor voice experience is a reputational risk for a group whose mission is universal acceptance.",
    ],
    economics: { volumeMonthly: 900000, costPerInteraction: 4.5, automationRate: 0.5, basis: "Seller assumptions: outpatient reservation and checkup booking volume across roughly seventy hospitals at Japanese assisted-contact cost — validate per-hospital call volumes and reservation system landscape in discovery." },
    pilotScope:
      "Deploy Japanese voice outpatient reservation handling and checkup booking for a cluster of five hospitals in one region, integrated to their reservation systems with emergency-routing rules enforced.",
    expansion: ["Extend across group hospitals region by region with standardised reporting", "Add ningen dock preparation instruction delivery and corporate checkup coordination", "Add care-facility and home-nursing administrative family enquiry handling"],
    stakeholders: ["Group Director of Hospital Operations", "Head of Medical Information Systems", "Hospital Director (pilot sites)", "Head of Health Checkup Business", "Head of Nursing Administration"],
    discovery: [
      "How many outpatient reservation calls does a typical group hospital receive daily, and what share go unanswered?",
      "Which reservation systems are in use across the group, and how standardised are they?",
      "How are ningen dock preparation instructions delivered today, and how often do patients arrive unprepared?",
      "What are the standing rules for what reception staff may say to a caller describing symptoms?",
    ],
    flowTemplate: "appointments",
    scenario: "An elderly patient calls a Tokushukai hospital at 7am to change her outpatient appointment; the agent handles it in polite Japanese and confirms the new date by SMS.",
  },

  "st-john-of-god": {
    operatingContext:
      "St John of God Health Care is one of Australia's largest Catholic not-for-profit private hospital operators, running hospitals across Western Australia, Victoria, New South Wales and beyond alongside home nursing, social outreach and disability services. Its private-hospital economics turn on elective surgical throughput: surgeons book patients into theatre lists, and each admission requires a pre-admission process covering health history, medications, anaesthetic screening, health-fund verification, excess and out-of-pocket estimation, fasting and arrival instructions. That process is today largely a phone and paper exercise run by per-hospital pre-admission clerks and nurses, and when it fails the consequence is a same-day cancellation of an expensive theatre slot. Patients are almost entirely English-speaking, privately insured or self-funded, and reach the hospital through their surgeon's rooms rather than directly, which makes the hospital's first contact with them a cold administrative call.",
    strategicPressure: [
      { text: "Australian private hospital operators have faced sustained margin pressure from health-fund payment rates against rising labour and supply costs, making administrative efficiency a survival issue rather than an optimisation.", kind: "verified" },
      { text: "Nursing and administrative workforce shortages mean pre-admission work is frequently performed by clinical staff who are scarce and expensive.", kind: "verified" },
      { text: "Same-day surgical cancellations caused by incomplete pre-admission or unmet fasting and medication instructions destroy theatre capacity that cannot be recovered.", kind: "inference" },
      { text: "Informed financial consent obligations mean out-of-pocket estimates must be communicated and documented before admission, which is a repeatable but currently manual conversation.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A not-for-profit hospital operator invests surplus in clinical services and facilities. Its digital health function integrates electronic medical record and patient administration systems bought from vendors. There is no software product capability and no charitable rationale for creating one.",
    whyNotBuild:
      "Pre-admission touches clinical screening, financial consent and consent documentation, all of which require auditable, evaluated behaviour. Building voice, orchestration into a patient administration system and that governance regime is beyond what a hospital group's digital team can deliver or maintain.",
    workflows: [
      {
        name: "Pre-admission data collection and screening",
        friction: "A clerk or nurse phones each incoming surgical patient to work through health history, medications and allergies; calls are missed, played back and forth, and incomplete files reach the anaesthetist late.",
        outcome: "Structured pre-admission information collected conversationally at the patient's convenience, validated for completeness, with any clinical flag routed immediately to a pre-admission nurse.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Patient administration system", "Pre-admission and anaesthetic records", "Nurse escalation queue"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-fund verification and informed financial consent",
        friction: "Patients arrive uncertain about excess, gap and out-of-pocket costs; verification calls to funds and repeat explanations consume admissions staff and generate complaints after discharge.",
        outcome: "Fund and cover status confirmed, approved estimate explained and documented consent captured before admission, cutting billing disputes and admission-day delays.",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Patient administration and billing", "Health-fund eligibility interfaces", "Consent records"],
        value: 3, complexity: 3,
      },
      {
        name: "Admission-day preparation and cancellation prevention",
        friction: "Fasting, medication-hold and arrival instructions are given days ahead and forgotten; patients arrive having eaten or having taken a withheld medication and the procedure is cancelled.",
        outcome: "Timed pre-admission reminders with confirmation of understanding and escalation of any deviation, measurably reducing same-day cancellations.",
        channels: ["Voice", "SMS"],
        systems: ["Theatre scheduling", "Approved preparation protocols", "Nurse escalation queue"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Per-hospital pre-admission teams handling health history and admission logistics by phone", "Online pre-admission forms for some hospitals", "Health-fund verification and estimate processes at admissions", "Patient information materials on preparation and what to bring"],
      gaps: ["No way to complete pre-admission outside business hours without a staff call", "Incomplete forms are chased manually or not at all", "Financial consent conversations are inconsistent between hospitals", "No confirmed delivery of fasting and medication instructions"],
    },
    risks: [
      "Clinical screening content must be collected, not interpreted; any answer indicating clinical risk must route to a pre-admission nurse with no agent judgement.",
      "Informed financial consent is a regulated expectation in Australian private healthcare and the record of what was communicated must be auditable.",
      "Australian Privacy Principles and My Health Record legislation govern health information handling, and Catholic mission governance may add ethical review requirements for automation touching patients.",
    ],
    economics: { volumeMonthly: 130000, costPerInteraction: 6.5, automationRate: 0.45, basis: "Seller assumptions: pre-admission, admissions and enquiry contact volume across the hospital portfolio at ANZ assisted-contact cost — validate elective admission volumes and pre-admission staffing in discovery." },
    pilotScope:
      "Deploy voice and SMS pre-admission data collection with nurse escalation for elective surgical admissions at two Western Australian hospitals, integrated to the patient administration system.",
    expansion: ["Add health-fund verification and informed financial consent capture", "Add timed admission-day preparation reminders to cut same-day cancellations", "Extend across the Victorian and New South Wales hospitals"],
    stakeholders: ["Group Chief Operating Officer", "Chief Digital / Information Officer", "Hospital Chief Executive (pilot sites)", "Director of Nursing / Pre-admission Services", "Group Head of Revenue and Patient Accounts"],
    discovery: [
      "How many pre-admission calls does a nurse or clerk make per elective admission, and how many attempts are needed?",
      "What is your same-day surgical cancellation rate, and how many are attributable to preparation failures?",
      "How is informed financial consent captured and evidenced today?",
      "Which pre-admission questions must be asked by a clinician rather than collected administratively?",
    ],
    flowTemplate: "onboarding",
    scenario: "Five days before knee surgery the agent calls a patient to complete her medication history, flags an anticoagulant to the pre-admission nurse and confirms her fasting window.",
  },

  "epworth": {
    operatingContext:
      "Epworth HealthCare is Victoria's largest not-for-profit private hospital group, operating across Richmond, Freemasons, Eastern, Geelong and other sites with a case mix weighted heavily toward elective surgery, rehabilitation and specialist medical services. Its patients are referred by private specialists whose rooms schedule the procedure, so Epworth's own first contact with a patient is administrative: confirming the booking, running pre-admission, verifying health-fund cover and communicating preparation. Rehabilitation and recurring outpatient services add a second stream of scheduled contact spread over weeks. The operational reality is that a large share of the group's inbound and outbound phone volume is neither clinical nor commercial but logistical — a theatre list moved, an admission time changed, a gap payment explained — and it is handled by administrative teams at each site.",
    strategicPressure: [
      { text: "Australian private hospitals are under sustained financial pressure from health-fund contract terms and rising labour costs, with several operators publicly restructuring.", kind: "verified" },
      { text: "A heavy elective-surgery mix means theatre utilisation is the primary economic engine, and administrative failures that cancel or delay lists are directly costly.", kind: "verified" },
      { text: "Theatre list changes propagate to every affected patient and are communicated manually, which is slow, error-prone and staff-intensive.", kind: "inference" },
      { text: "Rehabilitation and outpatient scheduling generates recurring contact that thin administrative teams handle reactively rather than proactively.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Epworth is a not-for-profit clinical operator with a digital function focused on electronic medical record deployment and integration. It buys and integrates rather than builds, and its financial position rules out speculative platform investment.",
    whyNotBuild:
      "The requirement — voice and SMS at scale, integration to theatre scheduling and patient administration, clinical escalation rules, and evidence trails for financial consent — is a governed platform. A hospital group under margin pressure will buy this on a payback case or not at all.",
    workflows: [
      {
        name: "Theatre-list change communication and rebooking",
        friction: "When a surgeon's list moves, administrative staff phone each affected patient individually; many are unreachable during the day and turn up at the original time.",
        outcome: "Every affected patient contacted immediately in parallel with a new time offered and confirmed conversationally, and unreachable patients escalated for a human call.",
        channels: ["Voice", "SMS"],
        systems: ["Theatre scheduling", "Patient administration system", "Surgeon rooms interface"],
        value: 3, complexity: 2,
      },
      {
        name: "Pre-admission completion and preparation confirmation",
        friction: "Pre-admission forms come back incomplete and preparation instructions are given once, days ahead, with no confirmation, producing avoidable admission-day problems.",
        outcome: "Pre-admission information collected and completed conversationally, timed fasting and medication reminders delivered and confirmed, with clinical flags routed to nursing staff.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Pre-admission records", "Approved preparation protocols", "Nurse escalation queue"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-fund gap and billing enquiry servicing",
        friction: "Patients call after receiving accounts to query gap payments and fund coverage; each call requires a staff member to reconstruct the episode from billing systems.",
        outcome: "Grounded explanation of the account and gap against the patient's episode record, with payment arrangements handled in-conversation and disputes routed to a human.",
        channels: ["Voice", "SMS", "Email"],
        systems: ["Billing and patient accounts", "Health-fund contract terms", "Payment gateway"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Site-level admissions and pre-admission administrative teams", "Online pre-admission forms and patient information materials", "Patient accounts and billing enquiry lines", "Rehabilitation and outpatient appointment scheduling"],
      gaps: ["Theatre-list changes are communicated one patient at a time by phone", "No confirmation that preparation instructions were received and understood", "Billing enquiries require manual reconstruction of the episode", "No after-hours channel for administrative patient questions"],
    },
    risks: [
      "Clinical information collected in pre-admission must be routed, not interpreted; any risk flag goes to a nurse immediately.",
      "Informed financial consent and account explanations must be grounded in actual contract terms and be auditable.",
      "Australian Privacy Principles and Victorian health records legislation govern patient data handling and communication consent.",
    ],
    economics: { volumeMonthly: 110000, costPerInteraction: 6.2, automationRate: 0.5, basis: "Seller assumptions: pre-admission, scheduling and billing contact volume across the group at ANZ assisted-contact cost — validate elective volumes and administrative headcount in discovery." },
    pilotScope:
      "Deploy voice and SMS theatre-list change communication and pre-admission completion for elective surgical patients at the Richmond and Eastern sites, integrated to theatre scheduling.",
    expansion: ["Add timed preparation reminders with confirmation to cut same-day cancellations", "Add health-fund gap and billing enquiry servicing", "Extend to rehabilitation and outpatient scheduling across all sites"],
    stakeholders: ["Group Chief Operating Officer", "Director of Perioperative Services", "Chief Information Officer", "Director of Nursing (pre-admission governance)", "Group Manager, Patient Accounts"],
    discovery: [
      "When a theatre list moves, how many patients are affected on average and how long does notification take?",
      "What is your same-day cancellation rate and its breakdown by cause?",
      "How many billing and gap enquiry calls do you take per month, and what is the average handle time?",
      "What proportion of pre-admission forms are returned complete without staff follow-up?",
    ],
    flowTemplate: "appointments",
    scenario: "A surgeon's Thursday list is pushed back three hours; the agent reaches all fourteen patients within minutes, reconfirms arrival times and escalates the two it cannot contact.",
  },

  "mater-group": {
    operatingContext:
      "Mater Group is a Brisbane-based Catholic not-for-profit spanning private and public hospitals, Queensland's largest maternity service, a pathology business, a research institute and a health insurance fund. That combination is unusual: the same organisation runs a longitudinal maternity journey with tens of thousands of births' worth of scheduled antenatal contact, an acute hospital operation with pre-admission and elective scheduling, a pathology network with collection and result logistics, and a member-servicing insurance operation with claims, cover and premium conversations. Each of those has its own contact centre or administrative team, its own systems and its own peak patterns, and a Queensland family may interact with three of them without any of them knowing. Channels are overwhelmingly phone and paper-adjacent, in English, with the maternity service in particular generating a predictable, protocol-driven communication schedule.",
    strategicPressure: [
      { text: "Operating Queensland's largest maternity service creates a very large, fixed schedule of antenatal contacts that is protocol-driven and therefore unusually automatable.", kind: "verified" },
      { text: "Australian private hospital and health-fund economics are both under pressure, and a not-for-profit running both feels the squeeze from two directions at once.", kind: "verified" },
      { text: "Multiple separate contact operations across hospitals, pathology and the health fund duplicate cost and produce a fragmented experience for the same family.", kind: "inference" },
      { text: "Health-fund member servicing — cover questions, claims status, premium changes — is a high-volume, rule-bound conversation that mirrors patterns already automated elsewhere in insurance.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Mater's technology function integrates hospital, pathology and insurance systems supplied by vendors. It is not a software developer, and the diversity of its business lines argues strongly for one bought conversational layer configured per entity rather than three separate builds.",
    whyNotBuild:
      "Spanning clinical maternity communication, hospital pre-admission and regulated insurance servicing means three different governance regimes over one conversational capability. Nothing about a Catholic not-for-profit health group supports building and maintaining that.",
    workflows: [
      {
        name: "Maternity journey scheduling and preparation",
        friction: "Antenatal appointments, classes and scans are booked individually and reminders are generic; changes cascade badly and expectant families call the midwifery service for logistics that should not need a clinician.",
        outcome: "The antenatal schedule is maintained proactively with conversational rescheduling and preparation instructions, and any clinical concern routes immediately to the midwifery team.",
        channels: ["Voice", "SMS", "Web chat"],
        systems: ["Maternity scheduling", "Electronic medical record", "Midwifery escalation queue"],
        value: 3, complexity: 3,
      },
      {
        name: "Health-fund member servicing",
        friction: "Members call about what is covered, waiting periods, claim status and premium changes; the fund's contact centre queues at renewal and end-of-financial-year peaks.",
        outcome: "Grounded, policy-accurate answers on cover and claims status at any hour, with claims lodged and premium changes actioned in-conversation and advice-adjacent questions routed to staff.",
        channels: ["Voice", "Web chat", "SMS"],
        systems: ["Policy administration", "Claims system", "Payments and premium billing"],
        value: 3, complexity: 3,
      },
      {
        name: "Pathology collection and result logistics",
        friction: "Patients call collection centres about opening hours, fasting requirements, referral validity and whether results have gone to their doctor, saturating small local teams.",
        outcome: "Routine pathology logistics answered instantly, collection appointments booked where offered, and result-release questions answered without disclosing clinical content.",
        channels: ["Voice", "SMS", "Web"],
        systems: ["Laboratory information system", "Collection centre schedules", "Referral records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Hospital appointment and pre-admission administrative teams", "A maternity service with midwifery-led scheduling and education programmes", "A health fund with member servicing channels", "A pathology network with collection centres and result delivery to referrers"],
      gaps: ["No unified front door across hospitals, pathology and the fund", "Antenatal schedule changes are handled reactively by clinical staff", "Fund member enquiries queue at renewal peaks", "No after-hours servicing across any of the business lines"],
    },
    risks: [
      "Maternity clinical concerns, including reduced fetal movement or bleeding, must trigger immediate midwifery escalation with no conversational handling.",
      "Health insurance conduct rules and the Private Health Insurance Code of Conduct govern what may be said about cover, and general versus personal advice boundaries must be enforced.",
      "Pathology results are clinical information that must not be disclosed conversationally; only release status may be discussed.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 6.0, automationRate: 0.5, basis: "Seller assumptions: combined hospital, maternity, pathology and health-fund contact volume at ANZ assisted-contact cost — validate each business line's contact centre volumes separately in discovery." },
    pilotScope:
      "Deploy voice and SMS antenatal appointment scheduling, rescheduling and preparation messaging for the maternity service, with hard midwifery escalation rules and integration to maternity scheduling.",
    expansion: ["Add health-fund member servicing for cover, claims status and premium changes", "Add hospital pre-admission and elective scheduling communication", "Add pathology collection and result-status logistics"],
    stakeholders: ["Group Chief Executive", "Executive Director, Mater Mothers / Maternity Services", "Chief Executive, Mater Health Fund", "Chief Information Officer", "Director of Midwifery (clinical governance)"],
    discovery: [
      "How many antenatal appointment contacts does a typical pregnancy generate at Mater, and how many are handled by clinical staff?",
      "What are the peak-period wait times in the health fund's member contact centre?",
      "How much duplication exists across the hospital, pathology and fund contact operations?",
      "Where exactly is the general-versus-personal advice line drawn for fund member conversations?",
    ],
    flowTemplate: "appointments",
    scenario: "An expectant mother reschedules her 32-week appointment by SMS; the agent rebuilds the remaining antenatal schedule and escalates her question about reduced movements to a midwife.",
  },

  "genpact": {
    operatingContext:
      "Genpact is a NYSE-listed professional-services firm born out of General Electric's back-office operations, running finance and accounting, supply-chain, risk and customer-service processes for global enterprises from very large delivery centres in India plus sites across the Philippines, China, Europe and the Americas. Its revenue is contracted per process, per transaction or per seat, which means the economics of every client engagement are a function of how many people it takes to deliver an agreed service level. It sells its Cora framework as its digital and data layer, but that is process intelligence and data engineering rather than an enterprise conversational-voice platform. That creates the dual position that matters here: Genpact both runs client contact operations that a conversational platform would transform, and needs a platform it can put in front of clients without building the speech, telephony and orchestration stack itself.",
    strategicPressure: [
      { text: "Genpact's revenue model is directly exposed to the shift from headcount-based to outcome-based pricing, since generative AI compresses the labour content of the processes it delivers.", kind: "verified" },
      { text: "Global enterprise clients now write AI expectations into BPM tenders, so an operator without a credible conversational-automation story loses renewals on capability rather than price.", kind: "verified" },
      { text: "Cora is positioned around process, data and analytics rather than real-time multilingual voice, leaving a specific gap in contact-centre transformation offerings.", kind: "inference" },
      { text: "Client-mandated tooling means Genpact must be able to operate multiple platforms, so it will favour a partner that integrates rather than one demanding exclusivity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Genpact has genuine engineering capability and an AI product identity, which is why this is partner-led rather than buy-led. But its investment is oriented to domain models, process orchestration and analytics assets that differentiate its services, not to the undifferentiated infrastructure of speech recognition, telephony and real-time dialogue management.",
    whyNotBuild:
      "Building a production-grade conversational platform means owning speech models across dozens of languages, carrier-grade telephony in every delivery geography, real-time orchestration and a continuous evaluation regime — a product business with its own roadmap and support obligations. Genpact monetises services, not licences, and a platform build would burn capital on capability its clients would still expect it to interoperate with.",
    workflows: [
      {
        name: "Client contact-centre transformation as a delivered service",
        friction: "A client asks Genpact to cut cost per contact by a third; the only levers today are offshoring further, restructuring shifts, or bolting a client-chosen tool onto an existing operation.",
        outcome: "Genpact delivers automation-inclusive contact operations on a platform it configures and runs, changing the pricing conversation from seats to outcomes while protecting margin.",
        channels: ["Voice", "Chat", "Email", "WhatsApp"],
        systems: ["Client CRM and case systems", "Contact-centre platform", "Workforce management", "Quality and evaluation tooling"],
        value: 3, complexity: 3,
      },
      {
        name: "Finance-and-accounting process conversation automation",
        friction: "Order-to-cash and procure-to-pay work generates enormous supplier and customer conversation volume — invoice status, payment queries, dispute follow-up — handled by agents reading from ERP screens.",
        outcome: "Supplier and customer enquiries resolved conversationally against live ERP data in the supplier's language, with exceptions routed to specialists and every interaction evaluated.",
        channels: ["Voice", "Email", "Chat"],
        systems: ["Client ERP", "Invoice and payments workflow", "Dispute case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Internal service-desk and delivery-workforce support",
        friction: "Genpact's own hundred-thousand-plus workforce raises IT, HR and access requests through internal ticketing, absorbing significant internal cost per employee.",
        outcome: "An internal conversational front door resolving access, leave, payroll and IT issues at first contact, demonstrating the platform on Genpact's own operation as a reference.",
        channels: ["Chat", "Voice"],
        systems: ["ITSM platform", "HR information system", "Identity and access management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Large multi-geography contact and back-office delivery operations for enterprise clients", "The Cora digital and data framework applied to client processes", "Domain solutions across finance, supply chain and risk", "Workforce management and quality assurance operations at delivery scale"],
      gaps: ["No proprietary real-time multilingual voice platform to put in front of clients", "Automation offerings depend on whichever tool each client has already chosen", "No consistent evaluation layer across conversational work in different client programmes", "Pricing remains substantially seat-linked rather than outcome-linked"],
    },
    risks: [
      "Client contracts frequently mandate specific technology stacks and data-residency terms, so any platform must be deployable within client-controlled environments.",
      "Delivering regulated processes for financial-services and healthcare clients imposes audit, retention and access-control obligations that the conversational layer must satisfy.",
      "Genpact's own AI roadmap may treat conversational CX as strategic scope, so partnership boundaries must be agreed explicitly to avoid channel conflict.",
    ],
    economics: { volumeMonthly: 3000000, costPerInteraction: 1.6, automationRate: 0.5, basis: "Seller assumptions: aggregate client contact volume across Genpact-delivered CX programmes at an offshore delivery cost per interaction — validate against actual contracted volumes and pricing models in discovery." },
    pilotScope:
      "Stand up an automation-inclusive delivery pod for one client's customer-service programme, with Genpact configuring and operating the platform and reporting cost per contact against the pre-pilot baseline.",
    expansion: ["Extend to additional client programmes in the same vertical with a repeatable delivery playbook", "Add finance-and-accounting supplier and customer conversation automation", "Deploy internally across the Genpact workforce service desk as a reference implementation"],
    stakeholders: ["Global Business Leader, Customer Experience / CX services", "Chief Digital Officer / Head of Cora", "Head of Delivery Operations, India", "Chief Technology Officer", "Head of Commercial and Pricing"],
    discovery: [
      "Which client programmes have automation commitments written into their current contracts, and what are the deadlines?",
      "How does Genpact price an outcome-based CX engagement today, and what platform cost can that pricing absorb?",
      "Where does Cora's roadmap stop and a partner conversational platform begin?",
      "How many client contracts mandate a specific CCaaS or conversational stack that we would need to interoperate with?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A Genpact-run customer-service programme for a global consumer brand cuts cost per contact by automating status and returns conversations while agents keep the escalations.",
  },

  "wns": {
    operatingContext:
      "WNS is a business-process management firm with unusually deep vertical concentration in travel, insurance, utilities, shipping and healthcare, running processes such as airline revenue accounting, insurance claims administration and utility customer service from delivery centres in India, the Philippines, Sri Lanka, South Africa and elsewhere. Those verticals are precisely the ones where contact volume is highest and most seasonal: a travel client's disruption event or a utility client's billing cycle generates contact spikes that WNS must staff for. Its acquisition by Capgemini reshapes its technology sourcing, placing it inside a group with its own alliance structure while leaving the operating reality unchanged. WNS itself has analytics and domain assets but no proprietary enterprise conversational-voice platform, so the automation its clients demand must be sourced.",
    strategicPressure: [
      { text: "Capgemini's acquisition of WNS places its technology partnering decisions inside a larger group alliance framework, which changes who decides the conversational stack.", kind: "verified" },
      { text: "WNS's travel and insurance concentration means its clients' contact volumes are spiky and event-driven, so elastic automated capacity is worth more to it than to a generalist BPM.", kind: "verified" },
      { text: "Buyers now expect BPM providers to price on outcomes rather than seats, which is impossible without automation the provider controls.", kind: "inference" },
      { text: "Deep vertical process knowledge is WNS's differentiator, and pairing it with a conversational platform is a faster route to defensible offerings than building the platform.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "WNS's assets are domain process expertise and analytics, delivered by operations teams. Its AI investment has centred on analytics and domain accelerators, not speech and telephony infrastructure. Inside Capgemini the incentive is stronger still to consume group-approved platforms rather than fund an independent build.",
    whyNotBuild:
      "A conversational platform is a product with a release cadence, security certifications and multilingual speech obligations. WNS's economics are services margins on delivered processes; capitalising a platform build would compete directly with the group's own technology strategy and deliver nothing clients could not get elsewhere.",
    workflows: [
      {
        name: "Travel-client disruption servicing at scale",
        friction: "When an airline or OTA client suffers a disruption event, contact volume multiplies within an hour against a staffed floor that cannot flex, and service levels collapse exactly when the client is most exposed.",
        outcome: "Elastic automated capacity absorbs the spike with proactive outbound rebooking and refund-status handling, while WNS agents take the complex itineraries — turning disruption performance into a contract-winning differentiator.",
        channels: ["Voice", "WhatsApp", "SMS", "Chat"],
        systems: ["Client reservation and PSS", "Refund and payments pipeline", "Disruption management tools"],
        value: 3, complexity: 3,
      },
      {
        name: "Insurance claims and policy-servicing automation",
        friction: "Claims status, document chase and policy-servicing calls dominate insurance programmes and are handled by trained agents whose cost per contact WNS cannot reduce further by offshoring.",
        outcome: "First-notice-of-loss intake, document validation and proactive claim-status updates automated within client policy, with adjuster decisions kept human and every interaction evaluated.",
        channels: ["Voice", "WhatsApp", "Email", "Chat"],
        systems: ["Client policy administration", "Claims management system", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Utility billing-cycle and outage contact absorption",
        friction: "Utility clients generate predictable billing-cycle and unpredictable outage contact peaks that force WNS to hold standby capacity it cannot bill for.",
        outcome: "Billing queries and outage status handled automatically at any volume, with proactive outbound notification suppressing inbound entirely for known events.",
        channels: ["Voice", "SMS", "WhatsApp", "IVR"],
        systems: ["Client billing system", "Outage management", "Payments"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Vertical-specialised delivery operations in travel, insurance and utilities", "Analytics and domain accelerators applied to client processes", "Multi-geography contact and back-office delivery centres", "Established quality and workforce management practices"],
      gaps: ["No proprietary real-time conversational voice platform", "Cannot flex capacity for client event spikes without pre-staffing", "Automation depends on the client's own chosen tooling programme by programme", "Limited ability to price outcomes rather than seats"],
    },
    risks: [
      "Capgemini group alliance policy may determine or constrain platform selection, so the sponsor set must include group technology leadership.",
      "Insurance and healthcare client processes carry regulatory audit, retention and data-residency obligations the platform must satisfy per client.",
      "Client contracts may prohibit subcontracting conversation handling to a third-party platform without explicit consent.",
    ],
    economics: { volumeMonthly: 1500000, costPerInteraction: 1.5, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across WNS-delivered CX programmes at offshore delivery cost — validate contracted volumes by vertical in discovery." },
    pilotScope:
      "Deploy disruption-servicing automation for one travel client programme across voice and WhatsApp, measured on contacts absorbed per disruption event and agent hours saved.",
    expansion: ["Extend to insurance claims intake and status servicing for a general insurance client", "Add utility billing-cycle and outage contact absorption", "Standardise the platform across WNS travel-vertical programmes as a repeatable offering"],
    stakeholders: ["Chief Executive Officer / Head of Travel vertical", "Chief Technology Officer", "Head of Insurance BPM practice", "Capgemini group alliances lead", "Head of Delivery Operations"],
    discovery: [
      "Which client contracts come up for renewal in the next four quarters with automation commitments attached?",
      "How much standby capacity do you hold for travel-client disruption events, and what does it cost?",
      "How does Capgemini's alliance framework govern platform selection for WNS-delivered programmes?",
      "Which clients would need to consent to conversation handling on a partner platform?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "A WNS-run airline programme absorbs a weather-disruption spike with proactive rebooking messages while agents handle only the multi-leg itineraries.",
  },

  "exl": {
    operatingContext:
      "EXL Service is an operations-and-analytics firm whose revenue concentrates in insurance, healthcare payer and banking clients, delivering claims administration, underwriting support, member services and analytics from India, the Philippines and other centres. It has deliberately repositioned itself as a data and AI company rather than a labour arbitrage business, investing in domain data platforms and analytics products. That repositioning is exactly why its conversational gap matters: EXL sells outcome-linked engagements to insurers and payers whose member and claimant contact volumes are enormous, but it has no enterprise voice platform to deliver the conversational half of those outcomes. Its clients are also heavily regulated, which makes governance, auditability and evaluation a procurement requirement rather than a nice-to-have.",
    strategicPressure: [
      { text: "EXL has positioned itself publicly as a data and AI-led firm, which raises client expectations that it can deliver conversational automation as well as analytics.", kind: "verified" },
      { text: "US healthcare payer and insurance clients operate under strict compliance regimes, making auditability and evaluation of any conversational agent a contractual precondition.", kind: "verified" },
      { text: "Analytics-led differentiation does not by itself reduce a client's contact-centre cost, so EXL needs a conversational layer to convert insight into delivered savings.", kind: "inference" },
      { text: "Outcome-based pricing in claims and member services is only safe if EXL controls the automation that determines its cost to serve.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "EXL's AI investment is in domain data models and analytics accelerators that differentiate its services. Speech recognition, telephony and dialogue orchestration are undifferentiated infrastructure for a firm whose value is in insurance and healthcare domain depth, making this a consume-and-embed partnership.",
    whyNotBuild:
      "Meeting payer and insurer compliance means every conversational interaction must be logged, scored and reproducible under audit, across multiple languages and channels. That is a platform with certification obligations. EXL would rather attach its domain models to someone else's evaluated platform than carry that burden.",
    workflows: [
      {
        name: "Health-plan member services automation",
        friction: "Member calls about benefits, eligibility, claim status and provider networks are handled by trained agents at high cost per call, and payer clients push relentlessly on that number.",
        outcome: "Benefit, eligibility and claim-status questions resolved conversationally against live payer systems with full audit logging, and complex or appeal-related calls routed to licensed staff.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Payer claims platform", "Eligibility and benefits systems", "Provider directory", "Audit logging"],
        value: 3, complexity: 3,
      },
      {
        name: "Insurance claims intake and status servicing",
        friction: "First-notice-of-loss intake and the subsequent status-call flood are the two highest-volume conversations in a claims programme, and both are handled by people reading from screens.",
        outcome: "Structured multilingual intake with document validation, and proactive status updates that suppress inbound status calls, with adjuster judgement kept human.",
        channels: ["Voice", "WhatsApp", "Email", "Chat"],
        systems: ["Claims management system", "Policy administration", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Collections and payment-arrangement conversations for banking clients",
        friction: "Early-bucket collections programmes are staffed heavily and compliance-sensitive, and contact coverage is limited by dialler and agent capacity.",
        outcome: "Policy-bounded, fully logged outreach across the entire at-risk population with payment arrangements captured in-conversation and hardship cases escalated to specialists.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Client collections system", "Payment processing", "Compliance recording and retention"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Insurance and healthcare payer operations delivered at scale from offshore centres", "Domain analytics platforms and data assets for its verticals", "Established compliance, audit and quality functions for regulated client work", "Multi-channel contact delivery for client programmes"],
      gaps: ["No proprietary conversational voice platform to deliver contact automation", "Analytics insight cannot be executed conversationally without a client's own tooling", "Evaluation of conversational quality varies by client programme", "Outcome pricing is constrained by lack of control over the conversational cost base"],
    },
    risks: [
      "US healthcare client work is subject to HIPAA and related obligations, requiring business-associate arrangements, encryption and retention controls in the conversational platform.",
      "Insurance conduct rules limit what may be said about coverage and claims outcomes; agent scope must be bounded and auditable.",
      "Collections work for banking clients is governed by conduct rules on contact timing, frequency and disclosure that must be enforced by the platform, not by training.",
    ],
    economics: { volumeMonthly: 1200000, costPerInteraction: 1.5, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across EXL-delivered insurance, payer and banking programmes at offshore delivery cost — validate contracted volumes in discovery." },
    pilotScope:
      "Deploy member-services automation for one health-plan client covering benefits, eligibility and claim-status enquiries, with full audit logging and licensed-staff escalation, measured on cost per member contact.",
    expansion: ["Extend to insurance claims intake and proactive status servicing", "Add collections and payment-arrangement conversations for a banking client", "Attach EXL domain models to the conversational layer as a differentiated joint offering"],
    stakeholders: ["Head of Insurance business unit", "Head of Healthcare / Payer business unit", "Chief Technology Officer", "Chief Compliance Officer", "Head of Analytics Platforms"],
    discovery: [
      "Which payer or insurer clients have contractual cost-per-contact reduction targets in the next year?",
      "What certification and audit evidence would a US payer client require before approving a conversational platform?",
      "Where does EXLerate's roadmap stop and a partner conversational platform begin?",
      "How would outcome-based pricing change if EXL controlled the automation layer?",
    ],
    flowTemplate: "claims",
    scenario: "An EXL-run health plan programme resolves benefit and claim-status calls conversationally with every interaction logged for payer audit, and routes appeals to licensed staff.",
  },

  "firstsource": {
    operatingContext:
      "Firstsource Solutions, part of the RP-Sanjiv Goenka group, is a customer-experience-led BPM concentrated in banking and financial services, healthcare payers and providers, and communications and media clients, mostly in the United States and United Kingdom, delivered from India, the Philippines, the US and the UK. Its book is unusually weighted toward two conversation types that are both high-volume and heavily regulated: collections and recovery for lenders, and member and patient services for healthcare organisations. Both are priced per seat or per contact, which means Firstsource's margin is a direct function of handle time and agent utilisation. It markets digital-first delivery and has built automation accelerators, but it does not own an enterprise conversational-voice platform, so automation is assembled per client from partner and client-chosen tooling.",
    strategicPressure: [
      { text: "Firstsource's concentration in collections and healthcare member services puts it in the two BPM segments where conversational automation is most mature and most demanded by buyers.", kind: "verified" },
      { text: "US and UK collections work is governed by conduct rules on contact timing, frequency and disclosure, which makes fully logged and policy-bounded automated outreach a compliance improvement rather than a risk.", kind: "verified" },
      { text: "Seat-based pricing is under structural pressure from clients who now expect automation-inclusive economics at renewal.", kind: "inference" },
      { text: "Embedding automation into contracts rather than resisting it is Firstsource's route to defending revenue as contact volumes fall.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Firstsource is a delivery organisation with automation accelerators, not a platform vendor. Its group parent is a diversified Indian conglomerate with no software product tradition. The realistic path is embedding a partner platform into client programmes and pricing.",
    whyNotBuild:
      "Collections and healthcare conversations must be recorded, retained, scored and reproducible under regulatory examination in multiple jurisdictions. Building a platform capable of that, plus multilingual speech and telephony across four delivery geographies, is a product company's job, not a BPM's.",
    workflows: [
      {
        name: "Regulated collections and recovery outreach",
        friction: "Dialler-based early-bucket collections reaches only a fraction of the portfolio within permitted contact windows, and agent-by-agent variation in what is said creates conduct risk.",
        outcome: "Every account in the at-risk population contacted within permitted windows with identical, policy-bounded language, arrangements captured in-conversation, and hardship indicators escalated to trained specialists.",
        channels: ["Voice", "SMS", "WhatsApp", "Email"],
        systems: ["Client collections system", "Payment processing", "Compliance recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Healthcare member and patient services",
        friction: "Eligibility, benefit, billing and appointment-related calls for payer and provider clients are handled by trained agents at a cost per contact clients are actively trying to cut.",
        outcome: "Routine member and patient enquiries resolved against live client systems with audit logging, and clinical or appeal matters routed immediately to qualified staff.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Payer eligibility and claims systems", "Provider patient accounts", "Appointment scheduling", "Audit logging"],
        value: 3, complexity: 3,
      },
      {
        name: "Communications-client service and retention",
        friction: "Telecom and media clients generate very high volumes of billing, service and cancellation calls where save-offer quality depends entirely on which agent answers.",
        outcome: "Consistent, matrix-bounded retention and billing conversations at full population coverage, with high-value saves routed to specialists with full context.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client billing and CRM", "Offer and retention matrix", "Order management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Collections and recovery operations for US and UK lenders", "Healthcare payer and provider member-services delivery", "Digital-first delivery accelerators and automation tooling", "Compliance recording, quality and workforce management functions"],
      gaps: ["No proprietary conversational voice platform to standardise across programmes", "Contact coverage in collections is limited by dialler and agent capacity", "Quality assurance samples a small fraction of conversations", "Automation economics differ programme by programme with no reusable platform"],
    },
    risks: [
      "US collections conduct rules and UK FCA consumer-duty expectations impose contact-frequency, disclosure and vulnerability-handling obligations that must be enforced by the platform.",
      "HIPAA and equivalent healthcare privacy obligations require business-associate arrangements and strict access and retention controls.",
      "Client contracts may require consent before conversation handling moves onto a third-party platform, and some clients mandate their own stack.",
    ],
    economics: { volumeMonthly: 1200000, costPerInteraction: 1.4, automationRate: 0.55, basis: "Seller assumptions: aggregate contact volume across Firstsource-delivered collections, healthcare and communications programmes at offshore delivery cost — validate contracted volumes in discovery." },
    pilotScope:
      "Deploy policy-bounded collections outreach for one US lending client across voice and SMS, with full recording and hardship escalation, measured on contact coverage and promise-to-pay conversion against the dialler baseline.",
    expansion: ["Extend to healthcare member-services automation for a payer client", "Add communications-client billing and retention conversations", "Standardise the platform across the collections practice as a repeatable offering"],
    stakeholders: ["Chief Executive Officer", "President, Banking and Financial Services", "Head of Healthcare business unit", "Chief Technology Officer", "Chief Compliance Officer"],
    discovery: [
      "What share of your collections portfolio is actually contacted within permitted windows each cycle?",
      "How is conduct compliance evidenced today across collections conversations, and what sample rate does QA achieve?",
      "Which client contracts allow automation to be introduced without renegotiation?",
      "How would the pricing model change if a third of contacts were handled without an agent?",
    ],
    flowTemplate: "collections",
    scenario: "A Firstsource-run collections programme contacts the entire early-bucket portfolio within permitted hours with identical compliant language, escalating hardship cases to specialists.",
  },

  "hgs": {
    operatingContext:
      "Hinduja Global Solutions, following the divestment of its healthcare-services business, is a customer-experience-focused BPM running contact-centre operations from India, the Philippines and other geographies for consumer brands, telecom operators, retailers and public-sector clients. Its revenue is predominantly seats-and-minutes: it wins programmes on price, service level and language coverage, and it defends them on operational consistency. That business model is directly threatened by conversational automation, because the volume it is paid to handle is exactly the volume that automates most readily. HGS markets digital CX transformation and has assembled automation offerings, but the underlying conversational technology is sourced from partners, which means its competitive position depends on which platform it can standardise on across programmes.",
    strategicPressure: [
      { text: "A seats-and-minutes revenue model is structurally exposed to conversational automation, since the highest-volume programmes are the most automatable.", kind: "verified" },
      { text: "Buyers in telecom and retail now require an automation roadmap as part of CX outsourcing bids, so capability is a qualification criterion rather than a differentiator.", kind: "verified" },
      { text: "Standardising one platform across delivery centres would let HGS reuse configuration and evaluation across clients instead of rebuilding per programme.", kind: "inference" },
      { text: "Public-sector CX clients bring accessibility, language-equity and record-keeping requirements that a governed platform satisfies more credibly than bespoke tooling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "HGS is an operator whose competitive assets are delivery footprint, language coverage and process discipline. Post-divestment it is not capital-rich, and its technology function integrates rather than builds. Standardising on a partner platform is the only economically rational route to an automation offering.",
    whyNotBuild:
      "A conversational platform would require HGS to fund speech models, telephony integration across multiple countries and continuous evaluation while its clients simultaneously demand lower prices. It cannot amortise that investment across a seats-based revenue base.",
    workflows: [
      {
        name: "Consumer-brand service programme automation",
        friction: "High-volume order, billing and service enquiries for retail and consumer clients are handled by agents at a cost per contact that clients benchmark against automated alternatives every renewal.",
        outcome: "Routine enquiries resolved conversationally against client systems in the customer's language, with agents redeployed to complaints and retention, and cost per contact reported against baseline.",
        channels: ["Voice", "Chat", "WhatsApp", "Email"],
        systems: ["Client CRM and order management", "Billing systems", "Knowledge base"],
        value: 3, complexity: 2,
      },
      {
        name: "Telecom billing, recharge and retention servicing",
        friction: "Telecom programmes generate enormous low-value contact volume — balance, plan, recharge, activation — where each human contact can exceed the customer's monthly revenue contribution.",
        outcome: "Balance, plan and recharge conversations fully automated in multiple languages with retention offers applied from an approved matrix and specialists reserved for high-value saves.",
        channels: ["Voice", "IVR", "WhatsApp", "SMS"],
        systems: ["Client billing and charging systems", "Recharge and payments", "Offer and retention matrix"],
        value: 3, complexity: 2,
      },
      {
        name: "Public-sector citizen contact delivery",
        friction: "Government CX contracts impose language-access and accessibility obligations that force HGS to staff languages it can barely recruit for, and peak events overwhelm the staffed floor.",
        outcome: "Language coverage far beyond the recruitable pool, elastic capacity for scheme deadlines and outage events, and complete records of every citizen interaction for accountability.",
        channels: ["Voice", "IVR", "Chat", "SMS"],
        systems: ["Government case and record systems", "Scheme eligibility databases", "Accessibility and record-keeping tooling"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Multi-geography contact-centre delivery for consumer, telecom and public-sector clients", "Multilingual agent pools across India and the Philippines", "Digital CX transformation offerings assembled from partner technology", "Workforce management and quality operations at delivery scale"],
      gaps: ["No proprietary conversational platform standardised across delivery centres", "Automation is rebuilt per client programme rather than reused", "Language coverage limited by recruitment rather than technology", "Quality assurance samples rather than scores every interaction"],
    },
    risks: [
      "Client contracts frequently mandate specific technology and may prohibit routing conversations through a partner platform without consent.",
      "Public-sector contracts impose accessibility, language-access and record-retention obligations that the platform must demonstrably meet.",
      "Operating across India and the Philippines creates data-residency and cross-border transfer requirements per client programme.",
    ],
    economics: { volumeMonthly: 1000000, costPerInteraction: 1.3, automationRate: 0.55, basis: "Seller assumptions: aggregate contact volume across HGS-delivered programmes at offshore delivery cost — validate seats, minutes and contracted volumes in discovery." },
    pilotScope:
      "Deploy automation for one consumer-brand service programme across voice and WhatsApp in three languages, measured on cost per contact and containment against the pre-pilot baseline.",
    expansion: ["Extend to telecom billing, recharge and retention programmes", "Standardise the platform across Indian and Philippine delivery centres", "Add public-sector citizen contact programmes with accessibility and record-keeping evidence"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer, CX Services", "Chief Technology Officer", "Head of Solutions and Bid Management", "Head of Delivery, Philippines"],
    discovery: [
      "Which programmes are up for renewal where the client has already asked for automation-inclusive pricing?",
      "How many languages do you currently staff, and which ones can you not recruit for?",
      "Would you lead with one platform across bids, or stay stack-agnostic per client?",
      "What consent do existing contracts require before conversations route through a partner platform?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An HGS-run consumer-brand programme handles order and billing enquiries automatically in three languages while agents take only complaints and retention calls.",
  },

  "startek": {
    operatingContext:
      "Startek is a mid-tier global customer-experience outsourcer with delivery concentrated in India, the Philippines and Malaysia alongside sites in Latin America and elsewhere, serving telecom operators, e-commerce marketplaces and travel brands. Its Malaysian footprint is strategically distinctive: it lets Startek sell regional hubs covering Bahasa Malaysia, Mandarin and English into Southeast Asian programmes that a purely Indian or Philippine provider cannot staff. Commercially it competes below the scale tier of the largest CX outsourcers, which means it wins on price, flexibility and language mix rather than on transformation consulting. That position is exactly what makes conversational automation existential: it cannot outspend larger rivals on proprietary technology, but it also cannot bid credibly for regional programmes without an automation answer.",
    strategicPressure: [
      { text: "Mid-tier scale means Startek lacks the balance sheet to fund proprietary conversational technology while larger competitors invest heavily in AI positioning.", kind: "verified" },
      { text: "Its Malaysian and Southeast Asian delivery hubs are sold on language coverage, which multilingual conversational AI both threatens and dramatically extends.", kind: "inference" },
      { text: "Telecom and e-commerce clients — its core verticals — are among the fastest to demand automation-inclusive pricing at renewal.", kind: "verified" },
      { text: "Without a platform partnership, Startek risks losing regional bids to competitors bundling automation with seats.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Startek's assets are delivery sites, recruitment reach and operational discipline. It has no product engineering organisation and no capital allocation for one. A partner platform embedded into its delivery model is the only viable route to an automation offering.",
    whyNotBuild:
      "Building would mean funding speech across Bahasa Malaysia, Tagalog, Mandarin, Hindi and English, telephony in four countries, and continuous evaluation, while competing on price against larger rivals. The investment would exceed several years of Startek's discretionary technology spend and deliver nothing proprietary.",
    workflows: [
      {
        name: "Regional multilingual programme delivery",
        friction: "A Southeast Asian client wants coverage across Bahasa Malaysia, Mandarin and English; Startek must recruit and retain three separate agent pools in a tight Malaysian labour market, and coverage gaps appear at nights and weekends.",
        outcome: "Language coverage delivered by the platform rather than the hiring plan, with agents concentrated on complex cases and Startek able to bid programmes its recruitment reach previously ruled out.",
        channels: ["Voice", "Chat", "WhatsApp", "Email"],
        systems: ["Client CRM", "Order and case management", "Workforce management"],
        value: 3, complexity: 2,
      },
      {
        name: "Telecom client billing and service automation",
        friction: "Telecom programmes generate huge volumes of balance, plan and activation calls that Startek is paid per minute to handle, while the client benchmarks that cost against automation every quarter.",
        outcome: "High-volume transactional telecom conversations automated with retention and upsell offers bounded by an approved matrix, preserving the account by delivering the saving Startek would otherwise lose.",
        channels: ["Voice", "IVR", "WhatsApp", "SMS"],
        systems: ["Client billing and charging systems", "Recharge and payments", "Offer matrix"],
        value: 3, complexity: 2,
      },
      {
        name: "E-commerce peak-season contact absorption",
        friction: "Marketplace clients generate order, delivery and returns spikes during regional sale events that force Startek to hire and train seasonal agents at negative margin.",
        outcome: "Peak volume absorbed by elastic automated capacity with proactive delivery-exception messaging, removing the seasonal hiring cycle from the cost base.",
        channels: ["Chat", "WhatsApp", "Voice"],
        systems: ["Client order management", "Logistics and 3PL feeds", "Returns and refunds workflow"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Delivery centres across India, the Philippines, Malaysia and other geographies", "Multilingual agent pools serving Southeast Asian and global programmes", "Standard CX delivery tooling and workforce management", "Client-specific CRM and case-system integration experience"],
      gaps: ["No proprietary conversational platform to bundle into bids", "Language coverage constrained by local recruitment", "Seasonal peaks handled by hiring rather than elasticity", "Quality assurance samples a small fraction of interactions"],
    },
    risks: [
      "Client contracts commonly mandate the client's own contact-centre technology, limiting where a partner platform may be introduced.",
      "Delivery across India, the Philippines and Malaysia creates per-country data-residency and cross-border transfer obligations.",
      "Thin margins mean platform costs must be demonstrably passed through in pricing before commitment.",
    ],
    economics: { volumeMonthly: 500000, costPerInteraction: 1.3, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across Startek-delivered programmes in Asia at offshore delivery cost — validate contracted minutes and seat counts in discovery." },
    pilotScope:
      "Deploy a trilingual automated tier for one Southeast Asian telecom or e-commerce programme delivered from Malaysia, measured on containment and cost per contact against the current staffed baseline.",
    expansion: ["Extend to Philippine and Indian delivery centres for the same client verticals", "Add e-commerce peak-season elastic capacity across marketplace clients", "Bundle automation into new-bid pricing as a standard delivery tier"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Regional Head, Southeast Asia delivery", "Chief Information Officer", "Head of Solutions and Bids"],
    discovery: [
      "Which languages do your Malaysian and Philippine sites struggle hardest to recruit for?",
      "How much seasonal hiring do e-commerce clients drive, and what does the training cost per seasonal agent?",
      "Which client contracts permit introducing a partner platform without renegotiation?",
      "How would automation change your bid pricing structure for a regional telecom programme?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A Startek-delivered Southeast Asian telecom programme handles balance and plan queries in Bahasa Malaysia, Mandarin and English without adding a single seat.",
  },

  "ienergizer": {
    operatingContext:
      "iEnergizer is an India-headquartered outsourcer with large delivery operations in Noida and other Indian centres, built on cost-efficient support for gaming and iGaming operators, publishing and content clients, and consumer-services brands, largely serving UK, US and European markets. Gaming support is its most distinctive book and its most demanding: it runs around the clock, spikes hard around event schedules and promotions, deals with payments, account access and bonus disputes, and carries responsible-gambling obligations that mean certain player conversations must be escalated to trained staff rather than handled transactionally. Its commercial model is explicitly cost-first — it wins programmes on price per seat and defends them on stability — which leaves little room to fund technology of its own but also makes automation savings unusually attractive to its clients.",
    strategicPressure: [
      { text: "Gaming and iGaming clients operate under licensing regimes with responsible-gambling and player-protection duties, so any automation must have hard-coded escalation for at-risk player signals.", kind: "verified" },
      { text: "Around-the-clock gaming support forces permanent night-shift staffing in India, which carries attrition and premium cost that automation directly addresses.", kind: "inference" },
      { text: "A cost-first positioning means iEnergizer's clients renew on price, and a competitor bundling automation can undercut it decisively.", kind: "verified" },
      { text: "Lean technology spending makes a usage-priced partner platform far more acceptable than any capitalised build.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "iEnergizer competes on delivery cost, not technology. There is no product organisation, and the operating model deliberately minimises fixed technology investment. Any automation capability must arrive as a variable-cost partner platform embedded in client programmes.",
    whyNotBuild:
      "Regulated gaming support requires evidenced player-protection handling, full conversation retention and auditability across multiple licensing jurisdictions. Building a platform to that standard is inconceivable for a cost-first BPO whose entire advantage is a low fixed-cost base.",
    workflows: [
      {
        name: "Gaming account and payments support automation",
        friction: "Player queries about deposits, withdrawals, account verification and bonus terms arrive continuously across time zones and are handled by night-shift agents at premium cost.",
        outcome: "Account, payment and verification queries resolved conversationally around the clock against client systems, with responsible-gambling and dispute signals escalated immediately to trained human staff.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client player account platform", "Payments and KYC systems", "Responsible-gambling case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Promotion and event peak absorption",
        friction: "Major sporting events and promotional campaigns multiply contact volume within hours, and iEnergizer must pre-staff for peaks it cannot precisely forecast.",
        outcome: "Elastic automated capacity absorbs event spikes with no queue and no pre-staffing, converting a forecasting problem into a configuration one.",
        channels: ["Chat", "Voice", "Email"],
        systems: ["Client player platform", "Promotion and bonus rules engine", "Workforce management"],
        value: 3, complexity: 2,
      },
      {
        name: "Consumer-services and publishing client support",
        friction: "Subscription, delivery and account queries for publishing and consumer clients are handled by agents at a cost per contact clients benchmark constantly.",
        outcome: "Routine subscription and account conversations automated in English at UK and US service hours without night-shift staffing, with escalations reserved for complaints.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client subscription and billing systems", "Order and delivery records", "Knowledge base"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Round-the-clock English-language delivery from Indian centres", "Gaming and iGaming support operations with regulated escalation processes", "Publishing and consumer-services client programmes", "Standard contact-centre tooling and quality management"],
      gaps: ["No proprietary conversational platform to reduce night-shift dependence", "Event-driven peaks require pre-staffing rather than elastic capacity", "Responsible-gambling escalation depends on agent judgement rather than systematic detection", "Quality assurance covers only a sampled fraction of player conversations"],
    },
    risks: [
      "Gaming licensing regimes impose responsible-gambling duties; automated conversations must detect and escalate at-risk indicators with evidenced, tested rules and must never handle self-exclusion transactionally.",
      "Player payments and identity verification data require strict handling under UK and EU data-protection law with India-based processing.",
      "Client licensing conditions may restrict who and what may handle player conversations, requiring explicit approval for a partner platform.",
    ],
    economics: { volumeMonthly: 400000, costPerInteraction: 1.1, automationRate: 0.55, basis: "Seller assumptions: aggregate contact volume across gaming, publishing and consumer programmes at Indian offshore delivery cost — validate contracted volumes and night-shift premium in discovery." },
    pilotScope:
      "Deploy chat and email automation for one gaming client's account and payments queries with hard responsible-gambling escalation, measured on containment and night-shift hours displaced.",
    expansion: ["Add event and promotion peak absorption across gaming clients", "Extend to publishing and consumer-services subscription programmes", "Add voice channels for clients where telephony support is contracted"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Gaming vertical delivery", "Head of Information Technology", "Head of Compliance and Client Governance"],
    discovery: [
      "What share of gaming contact volume arrives during Indian night shifts, and what premium does that staffing carry?",
      "How are responsible-gambling risk signals detected and escalated in chat today?",
      "Which gaming clients would need licensing approval before conversations route through a partner platform?",
      "How much pre-staffing do you hold for major sporting events, and how accurate is the forecast?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A gaming client's withdrawal and verification queries are resolved automatically through the Indian night shift, with any at-risk player signal escalated to a trained specialist.",
  },

  "taskus": {
    operatingContext:
      "TaskUs is a digital-native outsourcer whose client base is unusually skewed toward technology, fintech, marketplace and AI companies, delivering customer support, trust-and-safety content moderation and AI data services from large Philippine operations plus sites in India, Latin America and elsewhere. That client mix is the defining fact: its buyers are engineering-led organisations that measure support economics obsessively, expect automation as the default rather than the exception, and are themselves building AI products. TaskUs has invested in internal agent-assist and generative tooling, which gives it a more credible AI narrative than most outsourcers, but that tooling augments agents rather than replacing the conversational tier. Its AI data services line — human labelling and evaluation for model developers — also gives it an unusual second identity as a supplier to the AI industry rather than only a consumer of it.",
    strategicPressure: [
      { text: "TaskUs's clients are technology and AI companies that expect automation-first support economics and will insource or switch providers rather than pay for headcount-based support.", kind: "verified" },
      { text: "Trust-and-safety and content-moderation work carries wellbeing obligations for human reviewers, giving TaskUs a strong operational reason to remove routine volume from people.", kind: "verified" },
      { text: "Its internal agent-assist tooling improves handle time but does not change the fundamental seat-based cost structure of a support programme.", kind: "inference" },
      { text: "The AI data services line means TaskUs is comfortable partnering deeply with model and platform providers rather than treating them as competitors.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "TaskUs has more internal AI capability than a typical outsourcer, which is why partner-led is the right classification and why the boundary must be tested carefully. But its tooling is agent-assist and workflow, not a production conversational voice platform with telephony, orchestration and evaluation — that remains a purchase.",
    whyNotBuild:
      "Its clients would not accept a support-only vendor's home-grown conversational stack for customer-facing interactions when they can specify their own; and building one would divert TaskUs from the agent-assist and data-services investments that actually differentiate it with AI buyers.",
    workflows: [
      {
        name: "Tech and fintech client support automation",
        friction: "Account, transaction and troubleshooting queries for fintech and marketplace clients are handled by trained agents whose cost per contact the client's own finance team models against automation every quarter.",
        outcome: "Routine account and transaction conversations resolved against client systems with full logging, agents redeployed to fraud, disputes and escalations, and TaskUs pricing shifted toward outcomes.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client account and transaction systems", "Case management", "Fraud and dispute workflows"],
        value: 3, complexity: 3,
      },
      {
        name: "Trust-and-safety triage support",
        friction: "Human moderators review large volumes of reports, many of which are routine policy applications, exposing reviewers to unnecessary material and driving wellbeing cost and attrition.",
        outcome: "Routine report intake and policy-clear cases handled conversationally with clear thresholds, reserving human review for genuinely ambiguous or harmful content and reducing exposure.",
        channels: ["Chat", "In-product messaging", "Email"],
        systems: ["Client moderation queue", "Policy rule sets", "Reviewer wellbeing and escalation tooling"],
        value: 2, complexity: 3,
      },
      {
        name: "Scale-up client onboarding and ramp",
        friction: "Fast-growing clients ramp support volume unpredictably, forcing TaskUs into aggressive hiring and training cycles that erode margin during the ramp.",
        outcome: "New programmes launch with an automated tier from day one, absorbing ramp volatility and letting human hiring follow actual complexity rather than raw volume.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client CRM and helpdesk", "Knowledge base", "Workforce management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Large Philippine and multi-geography digital support delivery", "Trust-and-safety and content-moderation operations with wellbeing programmes", "Internal agent-assist and generative tooling for its delivery workforce", "AI data services including labelling and model evaluation work"],
      gaps: ["No production conversational voice platform for client-facing automation", "Agent-assist tooling improves handle time but not the seat-based cost structure", "Programme ramps depend on hiring rather than elastic automated capacity", "Automation approach varies by client rather than being a standard delivery tier"],
    },
    risks: [
      "Technology clients frequently mandate their own stacks and data-processing terms, so the platform must be deployable within client-controlled environments.",
      "Trust-and-safety automation touches content policy with legal and reputational consequences; thresholds must be conservative and human review preserved.",
      "Fintech client work carries financial-services compliance obligations including recording, retention and identity handling.",
    ],
    economics: { volumeMonthly: 900000, costPerInteraction: 1.6, automationRate: 0.55, basis: "Seller assumptions: aggregate client contact volume across TaskUs support programmes at Philippine delivery cost — validate contracted volumes and pricing structures in discovery." },
    pilotScope:
      "Deploy an automated first tier for one fintech client's account and transaction support across chat and voice, measured on containment, cost per contact and escalation quality.",
    expansion: ["Extend to marketplace and technology client programmes as a standard delivery tier", "Add trust-and-safety routine-report triage with conservative thresholds", "Build automation into new-client ramp plans to absorb volume volatility"],
    stakeholders: ["Chief Operating Officer", "Chief Technology Officer / Head of AI", "General Manager, Fintech and Technology verticals", "Head of Trust and Safety operations", "Head of Client Solutions"],
    discovery: [
      "Which clients have already asked you to price support on outcomes rather than seats?",
      "Where does TaskGPT and your internal AI tooling stop — is client-facing conversational automation in or out of its roadmap?",
      "How much margin do you lose during a fast client ramp, and how long does the ramp take?",
      "Which clients would require their own conversational stack rather than accepting a partner platform?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A TaskUs-run fintech support programme resolves account and transaction queries automatically while agents handle only fraud disputes and escalations.",
  },

  "inspiro": {
    operatingContext:
      "Inspiro is a Manila-headquartered customer-experience outsourcer owned within the Relia and Mitsui orbit, operating tens of thousands of agents across Philippine sites plus delivery in the United States and other geographies, serving telecommunications, retail, travel and financial-services clients. Its Japanese parentage gives it something most Philippine outsourcers lack: a channel into Japanese enterprise CX programmes and an operating culture accustomed to Japanese quality expectations, alongside the standard English-language offshore business. Commercially it sits in the middle of the Philippine market — large enough to bid national programmes, not large enough to fund proprietary technology — and its growth depends on winning multi-year contracts where automation capability is now part of the evaluation. Its delivery model remains fundamentally seat-based, so automation is simultaneously the threat to its revenue and the qualification for its next contract.",
    strategicPressure: [
      { text: "Philippine BPO bids increasingly require an automation roadmap as a scored evaluation criterion, not an optional differentiator.", kind: "verified" },
      { text: "Japanese parentage creates an opportunity to serve Japanese-language CX programmes, a market where labour scarcity makes automation especially valuable — but only with a platform that handles Japanese voice well.", kind: "inference" },
      { text: "Telecom and retail client concentration exposes Inspiro to exactly the contact types that automate most readily.", kind: "verified" },
      { text: "A parent-company technology alliance may constrain or accelerate platform selection depending on how Relia positions its own tooling.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Inspiro is an operations business with delivery sites and recruitment capability. It has no software product function and no capital allocated to one. Its parent is a services and trading group rather than a platform vendor, so the route to automation is a partner platform embedded into delivery.",
    whyNotBuild:
      "A Japanese-plus-English conversational platform with telephony across the Philippines, Japan and the US and a real evaluation regime is a multi-year product investment. Inspiro's margins on seats cannot fund it, and its clients would not accept an unevaluated in-house stack.",
    workflows: [
      {
        name: "Telecom and retail client contact automation",
        friction: "Billing, order, activation and returns conversations dominate Inspiro's Philippine floors and are precisely the volume clients now expect to be automated at renewal.",
        outcome: "High-volume transactional conversations handled automatically against client systems, agents redeployed to retention and complaints, and Inspiro able to bid automation-inclusive pricing.",
        channels: ["Voice", "Chat", "Email", "SMS"],
        systems: ["Client billing and CRM", "Order management", "Returns workflow"],
        value: 3, complexity: 2,
      },
      {
        name: "Japanese-language CX programme delivery",
        friction: "Japanese programmes require keigo-quality service that is expensive to staff from the Philippines and nearly impossible to scale, capping the size of the opportunity Inspiro can pursue.",
        outcome: "Japanese voice and messaging handled by the platform at consistent politeness levels, with bilingual agents reserved for complex cases, opening programmes Inspiro cannot currently staff.",
        channels: ["Voice", "Chat", "Email"],
        systems: ["Client CRM and order systems", "Knowledge base", "Escalation routing"],
        value: 3, complexity: 3,
      },
      {
        name: "Travel-client disruption and peak handling",
        friction: "Travel clients generate disruption spikes and seasonal peaks that force standby staffing Inspiro cannot bill for and cannot always deliver.",
        outcome: "Elastic capacity for disruption events with proactive rebooking and refund-status handling, protecting service levels and removing standby cost.",
        channels: ["Voice", "SMS", "Chat", "WhatsApp"],
        systems: ["Client reservation systems", "Refund and payments pipeline", "Disruption tooling"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Large Philippine delivery footprint with US and other offshore sites", "English-language CX delivery for telecom, retail, travel and financial-services clients", "Japanese-linked ownership with access to Japanese enterprise CX demand", "Standard contact-centre tooling, quality and workforce management"],
      gaps: ["No proprietary conversational platform to bundle into bids", "Japanese-language capacity limited by bilingual recruitment", "Peak and disruption capacity requires costly standby staffing", "Automation is rebuilt per client rather than standardised"],
    },
    risks: [
      "Parent-company technology alliances may mandate or restrict platform choices, so Relia-level sponsorship must be secured early.",
      "Philippine data-privacy law plus client-country regimes govern cross-border handling of customer data in each programme.",
      "Client contracts may prohibit routing conversations through a third-party platform without written consent.",
    ],
    economics: { volumeMonthly: 700000, costPerInteraction: 1.2, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across Inspiro-delivered programmes at Philippine delivery cost — validate seat counts and contracted minutes in discovery." },
    pilotScope:
      "Deploy an automated tier for one telecom or retail client programme across voice and chat from a Philippine site, measured on containment and cost per contact against baseline.",
    expansion: ["Add Japanese-language conversational delivery to open Japanese enterprise programmes", "Extend to travel-client disruption and peak handling", "Standardise the platform as a bid-stage automation offering across verticals"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Solutions and Bid Management", "Chief Information Officer", "Relia / parent-company technology sponsor"],
    discovery: [
      "How many of your current bids include a scored automation requirement?",
      "What is the size of the Japanese-language opportunity you cannot currently staff?",
      "Does Relia mandate specific technology partnerships for Inspiro programmes?",
      "How much standby capacity do travel clients require, and what does it cost annually?",
    ],
    flowTemplate: "inbound-service",
    scenario: "An Inspiro-delivered retail programme automates order and returns conversations from Manila while bilingual agents take only the Japanese escalations.",
  },

  "transcom-asia": {
    operatingContext:
      "Transcom is a European-headquartered customer-experience outsourcer whose Asian operations are concentrated in the Philippines, delivering English-language support for global e-commerce, travel, technology and consumer brands headquartered in Europe and North America. Its Asian delivery organisation therefore serves clients whose commercial decisions, technology standards and platform alliances are set thousands of kilometres away, which makes the Philippine business a delivery arm executing group commitments rather than an autonomous commercial unit. Transcom markets AI-augmented CX and has publicly aligned itself with automation-forward positioning, but the underlying conversational technology comes from partners. For the Asian sites, the practical question is whether they can deliver the automation the group has promised its clients, in the volumes and languages the Philippine floors currently cover with people.",
    strategicPressure: [
      { text: "European and North American clients now write automation expectations into CX outsourcing contracts, and Transcom's Asian delivery must execute those commitments.", kind: "verified" },
      { text: "Philippine wage inflation and attrition steadily erode the cost advantage that justified offshoring, making automation the only durable lever on cost per contact.", kind: "verified" },
      { text: "Platform selection is likely decided at European group level, so the Asian organisation is an implementer and reference site rather than the buying decision-maker.", kind: "inference" },
      { text: "E-commerce and travel client concentration means Transcom Asia carries large seasonal peaks it currently staffs for.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Transcom is a services organisation with a technology function that integrates CCaaS and automation tooling. It has no platform product and no reason to develop one when its clients' own stacks vary. Asian delivery consumes whatever the group selects.",
    whyNotBuild:
      "A CX outsourcer building conversational infrastructure would compete with the very vendors its clients specify. Transcom's commercial interest is in operating platforms well, not owning one.",
    workflows: [
      {
        name: "E-commerce order and delivery-exception servicing",
        friction: "Order status, delivery exception and returns contacts dominate marketplace programmes and spike hard during European and North American sale events, forcing seasonal hiring in Manila.",
        outcome: "Proactive delivery-exception messaging and automated order and returns handling absorb the peak, with agents kept for goodwill decisions and complaints.",
        channels: ["Chat", "Email", "WhatsApp", "Voice"],
        systems: ["Client order management", "Logistics and carrier feeds", "Returns and refunds workflow"],
        value: 3, complexity: 2,
      },
      {
        name: "Travel-client servicing and disruption support",
        friction: "Travel programmes generate booking-change and disruption volume that arrives unpredictably in European hours, requiring Philippine night-shift coverage at premium cost.",
        outcome: "Booking changes, refund status and disruption rebooking handled automatically across time zones with human agents reserved for complex itineraries.",
        channels: ["Voice", "Chat", "Email", "SMS"],
        systems: ["Client reservation systems", "Refund pipeline", "Disruption management tools"],
        value: 3, complexity: 3,
      },
      {
        name: "Technology-client tier-one support deflection",
        friction: "Technology clients push tier-one troubleshooting offshore and then benchmark it against self-service and automation, squeezing the price per contact each renewal.",
        outcome: "Tier-one diagnostics and account queries resolved conversationally with grounded knowledge retrieval, and Transcom's agents concentrated on tier-two work at higher value.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client helpdesk and knowledge base", "Account and entitlement systems", "Diagnostics tooling"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Philippine delivery centres serving European and North American brands", "English-language CX delivery across e-commerce, travel and technology verticals", "Group-level AI-augmented CX positioning and partner tooling", "Standard workforce management and quality operations"],
      gaps: ["No conversational platform owned or standardised by the Asian delivery organisation", "Seasonal and disruption peaks handled by staffing rather than elasticity", "Automation approach set per client rather than per delivery centre", "Night-shift coverage for European hours carries persistent premium cost"],
    },
    risks: [
      "Group-level alliance decisions in Europe govern platform selection, so an Asia-only engagement may not be able to contract.",
      "European client data is subject to GDPR, requiring documented transfer mechanisms and processing terms for Philippine-based handling.",
      "Client contracts may specify the contact-centre technology stack, limiting where a partner platform may be introduced.",
    ],
    economics: { volumeMonthly: 500000, costPerInteraction: 1.2, automationRate: 0.55, basis: "Seller assumptions: contact volume across Transcom's Philippine-delivered programmes at Philippine delivery cost — validate contracted volumes and group pricing structures in discovery." },
    pilotScope:
      "Deploy automated order and delivery-exception handling for one e-commerce client served from Manila through a peak sale period, measured on peak contacts absorbed and seasonal hiring avoided.",
    expansion: ["Extend to travel-client booking and disruption servicing", "Add technology-client tier-one deflection across programmes", "Present the Asian deployment as the group reference for European client rollouts"],
    stakeholders: ["Regional Head, Asia operations", "Group Chief Information Officer (Europe)", "Head of Client Services, Philippines", "Group Head of Digital / AI offerings", "Site Director, Manila"],
    discovery: [
      "Who decides platform selection for Transcom-delivered programmes — the group or the region?",
      "How much seasonal hiring do e-commerce clients drive in Manila each year?",
      "Which clients have automation commitments already written into current contracts?",
      "What GDPR transfer mechanism governs European customer data processed in the Philippines today?",
    ],
    flowTemplate: "order-logistics",
    scenario: "During a European sale peak the Manila-delivered programme messages customers about delivery exceptions before they call, and agents handle only goodwill decisions.",
  },

  "acquire-bpo": {
    operatingContext:
      "Acquire BPO is an Australian-owned outsourcer delivering contact-centre and back-office services primarily from Manila, plus Australian onshore and other offshore capacity, for Australian energy retailers, telecommunications providers, financial-services firms and digital brands. Its value proposition to ANZ buyers is a familiar Australian commercial relationship with Philippine cost structure and quality control, which means its client conversations are Australian-consumer conversations governed by Australian regulation — energy retail rules, telecommunications consumer protections, financial-services conduct obligations — executed by agents in Manila. Those clients are themselves under intense regulatory and cost pressure, particularly energy retailers dealing with hardship obligations and payment-difficulty frameworks, and they are actively piloting AI in their own service operations. Acquire's exposure is straightforward: if its clients automate directly, the seats disappear.",
    strategicPressure: [
      { text: "Australian energy retailers operate under regulator-mandated hardship and payment-difficulty frameworks that require documented, consistent customer contact — a strong fit for governed automation.", kind: "verified" },
      { text: "ANZ clients are actively piloting conversational AI in their own operations, which threatens outsourced seat volumes directly.", kind: "verified" },
      { text: "Philippine wage inflation compresses the offshore arbitrage that underpins Acquire's pricing, making automation the next cost lever.", kind: "inference" },
      { text: "An Australian-owned commercial relationship gives Acquire the trust position to introduce automation into ANZ client contracts before the clients do it themselves.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Acquire is a delivery organisation with an Australian commercial front end. It has no product engineering capability and competes on service and cost. Partnering to embed a platform into its ANZ client programmes is its only realistic automation path.",
    whyNotBuild:
      "Australian regulated conversations — energy hardship, telecommunications complaints, financial-services conduct — require evidenced compliance, recording and retention. Building a platform to that standard for a mid-size outsourcer's client book is economically absurd compared with configuring an evaluated one.",
    workflows: [
      {
        name: "Energy-retail billing and payment-difficulty servicing",
        friction: "Bill-shock and payment-difficulty calls spike with seasonal energy bills; Manila agents work scripts under Australian hardship rules and consistency depends on training rather than systems.",
        outcome: "Billing explanations and payment-plan conversations handled consistently within the regulated framework, with hardship indicators escalated to trained specialists and every interaction recorded and scored.",
        channels: ["Voice", "SMS", "Chat", "Email"],
        systems: ["Client billing system", "Payment plan and hardship workflow", "Compliance recording and retention"],
        value: 3, complexity: 3,
      },
      {
        name: "Telecommunications service and complaint handling",
        friction: "Telco clients generate high-volume plan, activation and fault conversations plus complaint escalations governed by Australian consumer protections, all staffed in Manila.",
        outcome: "Routine service conversations automated with fault status grounded in client systems, and complaints routed immediately to agents with the required record trail intact.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client CRM and billing", "Fault and provisioning systems", "Complaints case management"],
        value: 3, complexity: 2,
      },
      {
        name: "After-hours and overflow coverage for ANZ clients",
        friction: "Clients want extended-hours coverage but paying for Manila night shifts to cover Australian evenings is expensive and hard to staff consistently.",
        outcome: "Continuous coverage delivered without additional shifts, with overflow absorbed instantly during campaign or event peaks.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client CRM", "Workforce management", "Routing and telephony"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: ["Manila-based contact-centre delivery for Australian energy, telco and financial-services clients", "Australian onshore commercial and account management presence", "Compliance recording and quality assurance aligned to Australian client obligations", "Back-office and processing services alongside voice delivery"],
      gaps: ["No conversational platform to offer clients alongside seats", "Extended-hours coverage requires costly night-shift staffing", "Consistency in regulated conversations depends on training and QA sampling", "No elastic capacity for client campaign or event peaks"],
    },
    risks: [
      "Australian energy retail hardship rules, telecommunications consumer protections and financial-services conduct obligations impose documented process requirements the platform must enforce and evidence.",
      "Australian customer data processed in the Philippines requires disclosure and consent handling under the Australian Privacy Principles and client policies.",
      "Client contracts and their own regulators may require approval before conversations are handled by a third-party platform.",
    ],
    economics: { volumeMonthly: 400000, costPerInteraction: 4.2, automationRate: 0.5, basis: "Seller assumptions: contact volume across ANZ client programmes priced at a blended onshore-equivalent ANZ contact cost rather than Manila delivery cost — validate contracted rates in discovery." },
    pilotScope:
      "Deploy governed billing and payment-plan conversation automation for one Australian energy-retail client across voice and SMS, with hardship escalation and full recording, measured on cost per contact and compliance evidence quality.",
    expansion: ["Extend to telecommunications client service and complaint programmes", "Add continuous after-hours and overflow coverage across ANZ clients", "Bundle automation into new-bid pricing as a standard tier"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer, Philippines delivery", "Head of Client Services, Australia", "Chief Information Officer", "Head of Risk and Compliance"],
    discovery: [
      "Which ANZ clients are already piloting conversational AI internally, and what is your position in those conversations?",
      "How do you currently evidence hardship-framework compliance across energy-client conversations?",
      "What does after-hours coverage cost you today in night-shift premiums?",
      "Which client contracts allow automation to be introduced without renegotiation?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "An Australian energy client's bill-shock calls are handled from the platform with consistent hardship language, and genuine payment-difficulty cases go straight to a trained specialist.",
  },

  "probe-cx": {
    operatingContext:
      "Probe Group is Australia's largest locally headquartered customer-experience outsourcer, with tens of thousands of staff across Australian and New Zealand onshore sites, Philippine delivery centres and other offshore locations, serving federal and state government agencies, utilities, telecommunications providers, banks and insurers. Its government and utility book is the strategically distinctive part: those contracts are won through formal tender, carry explicit obligations on accessibility, language access, record-keeping and service standards, and increasingly require bidders to describe how they will apply automation. Probe also owns MicroSourcing, giving it an offshore staffing arm alongside its managed-CX business. Its revenue remains predominantly seat- and minute-based, which means every automation commitment it makes in a tender is simultaneously a commitment to shrink its own billable base unless it changes how it prices.",
    strategicPressure: [
      { text: "Australian government and utility tenders now routinely require bidders to set out an automation and AI approach, making platform capability a qualification criterion.", kind: "verified" },
      { text: "Onshore Australian delivery carries a very high cost per contact, so automation economics are far more compelling for Probe's onshore book than for pure offshore providers.", kind: "verified" },
      { text: "Government CX contracts impose accessibility and language-access duties that a multilingual, evaluated platform meets more credibly than recruitment.", kind: "inference" },
      { text: "Owning MicroSourcing gives Probe a second channel to aggregate automation demand across many small client teams.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Probe is an operator with scale in delivery and bid management, not a technology developer. Its automation offerings are assembled from partner platforms, and government clients would in any case expect an evaluated, auditable third-party capability rather than a bespoke outsourcer build.",
    whyNotBuild:
      "Government-grade conversational service requires accessibility compliance, language access, complete record retention and demonstrable evaluation. Building that plus multilingual speech and telephony is a product company's undertaking; Probe's advantage is winning and running the contracts, not owning the stack.",
    workflows: [
      {
        name: "Government citizen-contact programme delivery",
        friction: "Scheme deadlines, payment cycles and policy changes generate enormous citizen contact spikes against contracted service levels, and language-access obligations force staffing Probe cannot always recruit.",
        outcome: "Elastic capacity absorbs deadline surges, language coverage extends far beyond the recruitable pool, and every citizen interaction is recorded and scored for accountability reporting.",
        channels: ["Voice", "IVR", "Chat", "SMS"],
        systems: ["Agency case and record systems", "Scheme eligibility databases", "Accessibility and interpreting tooling"],
        value: 3, complexity: 3,
      },
      {
        name: "Utility outage and billing contact absorption",
        friction: "Utility clients generate predictable billing-cycle peaks and unpredictable outage surges; Probe holds standby onshore capacity that is expensive and often idle.",
        outcome: "Outage status and billing conversations handled automatically at any volume with proactive outbound notification suppressing inbound calls entirely during known events.",
        channels: ["Voice", "SMS", "IVR", "Chat"],
        systems: ["Client billing system", "Outage management system", "Payments and hardship workflow"],
        value: 3, complexity: 2,
      },
      {
        name: "Financial-services client servicing with conduct evidence",
        friction: "Bank and insurer programmes require conduct-compliant conversations with vulnerability handling, evidenced today through sampled quality assurance across a small share of calls.",
        outcome: "Every interaction scored rather than sampled, consistent conduct language applied, and vulnerability indicators escalated to trained staff with full context.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client CRM and core systems", "Compliance recording and retention", "Vulnerability case management"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Onshore Australian and New Zealand contact-centre delivery plus Philippine offshore capacity", "Government, utility, telecommunications and financial-services client programmes", "Formal bid and tender management capability for public-sector work", "MicroSourcing offshore staffing arm within the group"],
      gaps: ["No proprietary conversational platform to underwrite tender automation commitments", "Language access limited by onshore recruitment", "Standby capacity for outage and deadline peaks is expensive and idle", "Quality assurance samples rather than scores every regulated conversation"],
    },
    risks: [
      "Government contracts impose accessibility standards, language-access obligations and record-retention requirements that must be demonstrably met and audited.",
      "Financial-services programmes carry conduct and vulnerability-handling obligations that automation must enforce rather than merely support.",
      "Australian government data-sovereignty requirements may mandate onshore processing and hosting for citizen conversations.",
    ],
    economics: { volumeMonthly: 900000, costPerInteraction: 5.0, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across onshore and offshore Probe programmes at a blended ANZ contact cost — validate onshore versus offshore mix and contracted rates in discovery." },
    pilotScope:
      "Deploy an automated tier on one utility client's billing and outage contact stream with proactive outbound notification, measured on peak contacts absorbed and standby capacity released.",
    expansion: ["Extend to a government citizen-contact programme with accessibility and language-access evidence", "Add financial-services conduct-evidenced servicing with full interaction scoring", "Aggregate automation demand across MicroSourcing client teams"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Executive General Manager, Government and Utilities", "Chief Information Officer", "Head of Bids and Solutions"],
    discovery: [
      "Which upcoming government tenders require an automation approach, and what evidence do they demand?",
      "What onshore standby capacity do you hold for utility outage events, and what does it cost annually?",
      "Which Australian government contracts require data to remain onshore?",
      "How would automation change your pricing structure on a seat-based government contract?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A summer storm knocks out power across a utility client's network; the platform absorbs the call surge with proactive outage messaging while Probe's agents handle vulnerable customers.",
  },

  "tsa-group": {
    operatingContext:
      "TSA Group is an Australian customer-experience outsourcer historically anchored by large telecommunications work, delivering from Australian onshore sites and Philippine offshore centres for telco, utility, financial-services and government clients. Its business is unusually concentrated: a small number of very large anchor contracts account for a large share of revenue, which makes each renewal an existential event and each anchor client's technology strategy a direct determinant of TSA's future. Australian telecommunications operators have been publicly aggressive about deploying AI in their own service operations, which means the volume TSA is paid to handle is being automated by the client from above at the same time as buyers demand lower prices from below. Its differentiator has been onshore Australian delivery quality and complex-call capability rather than lowest cost.",
    strategicPressure: [
      { text: "Australian telecommunications operators are deploying conversational AI in their own customer service, directly reducing the outsourced volume TSA depends on.", kind: "verified" },
      { text: "Heavy client concentration means a single anchor contract's automation decision can reshape TSA's revenue base.", kind: "verified" },
      { text: "Onshore Australian delivery carries the highest cost per contact in the region, which makes automation economics compelling but also makes TSA's premium positioning harder to defend.", kind: "inference" },
      { text: "TSA's best defensive move is to become the operator of its clients' automation rather than the supplier of the humans it replaces.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "TSA is a mid-size delivery business with no product engineering function and concentrated client risk. Building a platform would be both unaffordable and irrelevant if an anchor client mandates its own stack. Partnering to operate a platform inside client programmes is the realistic play.",
    whyNotBuild:
      "The anchor clients that dominate TSA's revenue have their own AI programmes and vendor relationships. A home-grown TSA platform would compete with them and satisfy nobody. What TSA can uniquely offer is operating and evaluating conversational agents inside a regulated Australian service context.",
    workflows: [
      {
        name: "Telco service and complex-call triage",
        friction: "As the client automates simple calls, what reaches TSA is increasingly complex and expensive to handle, while pricing has not moved to reflect the mix shift.",
        outcome: "TSA operates the automated tier as well as the human one, capturing value across the whole contact stream and pricing on resolved outcomes rather than handled minutes.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client CRM and billing", "Provisioning and fault systems", "Complaints case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Outbound campaign and retention delivery",
        friction: "Outbound retention and campaign work is capacity-limited by dialler and agent hours, so only a fraction of a target list is ever contacted.",
        outcome: "Full-population outbound coverage in permitted windows with offers bounded by the client's approved matrix, and high-value saves handed to onshore specialists with context.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Client CRM", "Offer and retention matrix", "Consent and contact-preference register"],
        value: 3, complexity: 2,
      },
      {
        name: "After-hours and surge coverage for onshore contracts",
        friction: "Onshore Australian coverage outside business hours is prohibitively expensive, so clients accept degraded service or push volume offshore against their brand preference.",
        outcome: "Continuous coverage delivered without onshore night shifts, preserving the onshore brand positioning TSA sells while removing its cost.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client CRM", "Routing and telephony", "Workforce management"],
        value: 2, complexity: 1,
      },
    ],
    existing: {
      has: ["Onshore Australian contact-centre delivery with Philippine offshore capacity", "Deep telecommunications programme experience including complex-call handling", "Compliance recording and quality assurance for Australian regulated conversations", "Outbound campaign and retention delivery capability"],
      gaps: ["No conversational platform to operate on clients' behalf", "Outbound coverage limited by dialler and agent capacity", "After-hours onshore coverage is economically unviable", "Revenue remains tied to handled minutes rather than resolved outcomes"],
    },
    risks: [
      "Anchor clients may mandate their own conversational stack, restricting TSA to operating rather than selecting the platform.",
      "Australian telecommunications consumer protections and complaint-handling rules impose record and escalation obligations the platform must enforce.",
      "Client concentration means commercial terms must survive a single anchor contract's loss or renegotiation.",
    ],
    economics: { volumeMonthly: 350000, costPerInteraction: 5.5, automationRate: 0.5, basis: "Seller assumptions: contact volume across TSA-delivered programmes at a blended onshore-weighted ANZ contact cost — validate onshore versus offshore mix and contracted rates in discovery." },
    pilotScope:
      "Deploy full-population outbound retention and campaign coverage for one telco client with matrix-bounded offers and onshore specialist handoff, measured on contact coverage and save rate against the dialler baseline.",
    expansion: ["Add an automated inbound tier operated by TSA within the anchor telco programme", "Add continuous after-hours coverage for onshore contracts", "Extend to utility and financial-services clients with conduct evidence"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Client Partner, anchor telecommunications account", "Chief Information Officer", "Head of Risk and Compliance"],
    discovery: [
      "What proportion of your revenue sits with your largest two clients, and when do those contracts renew?",
      "Have your anchor clients specified their own conversational stack, or is the platform choice open?",
      "What share of an outbound retention list do you actually reach in a campaign cycle?",
      "How has your contact mix shifted as clients have automated simple calls, and has pricing followed?",
    ],
    flowTemplate: "retention",
    scenario: "A telco client's entire at-risk base is contacted in permitted hours with matrix-bounded offers, and TSA's onshore specialists take only the high-value saves.",
  },

  "alorica-ph": {
    operatingContext:
      "Alorica's Philippine operations form one of the largest private employment footprints in the country, with dozens of sites delivering English-language customer service for United States and global brands in retail, healthcare, financial services, technology and communications. The Philippine organisation is a delivery engine executing programmes sold and governed from the United States, where Alorica's digital arm assembles third-party AI and automation tooling into client solutions rather than building an enterprise voice platform of its own. That structure means the Philippine sites are the largest single consumer of whatever conversational stack wins a place in Alorica's integration ecosystem — and also the place where the labour economics of automation bite hardest, since tens of thousands of seats are exposed to the same automatable contact types. Wage inflation and attrition in the Philippine market compound that exposure year on year.",
    strategicPressure: [
      { text: "Alorica's digital arm integrates third-party AI rather than owning an enterprise conversational voice platform, which makes platform selection an ecosystem decision rather than a build decision.", kind: "verified" },
      { text: "Philippine wage inflation and persistent attrition steadily erode the offshore cost advantage that underpins Alorica's pricing to US clients.", kind: "verified" },
      { text: "Its US retail, healthcare and financial-services clients are among the most aggressive buyers of automation-inclusive CX contracts.", kind: "inference" },
      { text: "The sheer scale of the Philippine seat base means even modest automation rates translate into very large absolute volume shifts, which must be managed commercially rather than absorbed.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Alorica positions its digital capability as integration and orchestration of best-of-breed tools. It has not built and shows no sign of building a conversational voice platform, and its scale makes a partner ecosystem more attractive than a proprietary stack it would have to support across every client.",
    whyNotBuild:
      "Serving US healthcare and financial-services clients means HIPAA and financial conduct obligations, audited retention and per-client data segregation. Building a platform to that standard, then maintaining it across dozens of sites and hundreds of programmes, is a product business Alorica has explicitly chosen not to be in.",
    workflows: [
      {
        name: "US retail and consumer programme automation",
        friction: "Order, returns, billing and account conversations dominate retail programmes and spike hard through the US holiday season, forcing large-scale seasonal hiring and training in the Philippines.",
        outcome: "Routine retail conversations handled automatically against client systems with proactive delivery-exception messaging, removing the seasonal hiring cycle and improving peak service levels.",
        channels: ["Voice", "Chat", "SMS", "Email"],
        systems: ["Client order management", "Billing and payments", "Returns workflow", "Logistics feeds"],
        value: 3, complexity: 2,
      },
      {
        name: "Healthcare member and patient services with audit evidence",
        friction: "Eligibility, benefit and billing conversations for US healthcare clients require trained agents and strict compliance handling, making cost per contact high and difficult to reduce.",
        outcome: "Routine member enquiries resolved against client systems with complete audit logging and access controls, and clinical or appeal matters routed to licensed staff.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Payer eligibility and claims systems", "Patient accounts", "Audit logging and retention"],
        value: 3, complexity: 3,
      },
      {
        name: "Financial-services servicing and dispute intake",
        friction: "Card, account and dispute conversations for financial-services clients carry conduct and recording obligations and are among the most expensive contacts on Philippine floors.",
        outcome: "Balance, transaction and dispute-intake conversations handled with consistent compliant language and full recording, with dispute decisions and hardship kept human.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client core banking and card systems", "Dispute case management", "Compliance recording"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Dozens of Philippine delivery sites serving US and global brands", "A digital arm integrating third-party AI and automation tooling into client solutions", "Compliance, recording and quality operations for regulated US client work", "Large-scale recruitment, training and workforce management capability"],
      gaps: ["No proprietary conversational voice platform in the ecosystem", "Seasonal peaks handled by mass hiring rather than elastic capacity", "Automation configuration is rebuilt per client programme", "Quality assurance samples rather than scores every interaction"],
    },
    risks: [
      "US healthcare client work requires HIPAA business-associate arrangements and audited access, retention and encryption controls.",
      "Financial-services programmes carry recording, retention and conduct obligations that must be enforced by the platform.",
      "Cross-border processing of US consumer data in the Philippines requires documented client-approved transfer and security arrangements.",
    ],
    economics: { volumeMonthly: 2000000, costPerInteraction: 1.5, automationRate: 0.55, basis: "Seller assumptions: aggregate contact volume across Alorica's Philippine-delivered programmes at Philippine delivery cost — validate contracted volumes and seat counts in discovery." },
    pilotScope:
      "Deploy an automated tier for one US retail client programme delivered from the Philippines across voice and chat through a holiday peak, measured on peak containment and seasonal hiring avoided.",
    expansion: ["Extend to healthcare member-services programmes with full audit evidence", "Add financial-services servicing and dispute intake", "Establish the platform as a standard offering within the Alorica IQ integration ecosystem"],
    stakeholders: ["Country Head / Managing Director, Philippines", "Head of Alorica IQ / digital solutions", "Vice President, Retail and Consumer vertical", "Chief Information Security Officer", "Head of Philippine Operations"],
    discovery: [
      "How does a new platform enter the Alorica IQ ecosystem, and who approves it?",
      "How many seasonal agents do you hire in the Philippines for the US holiday peak, and what does training cost?",
      "Which client programmes have automation targets contractually committed for the coming year?",
      "What security and compliance evidence do your healthcare and financial-services clients require of a new platform?",
    ],
    flowTemplate: "order-logistics",
    scenario: "Through the US holiday peak an Alorica-delivered retail programme messages customers about delivery exceptions proactively, and Manila agents handle only goodwill decisions.",
  },

  "vxi": {
    operatingContext:
      "VXI Global Solutions is a US-headquartered, private-equity-backed customer-experience outsourcer with tens of thousands of employees concentrated in the Philippines, plus sites in China, the United States and elsewhere, serving telecommunications, media, technology and healthcare clients. Its Philippine base delivers English-language voice and chat support for US consumer brands, with telecom and media programmes — high-volume, transactional, price-benchmarked — forming the core of the book. VXI markets CX advisory and digital services, but the technology underneath its automation offerings comes from partners, which places it in the same structural position as its Philippine peers: large enough that its programme volumes matter to a platform vendor, small enough that it cannot fund a stack of its own. Private-equity ownership sharpens the focus on margin and on capability that can be sold at renewal without heavy capital outlay.",
    strategicPressure: [
      { text: "Telecommunications and media clients generate exactly the high-volume transactional contact that buyers now expect to be automated, putting VXI's core book at risk.", kind: "verified" },
      { text: "Private-equity ownership prioritises margin and cash generation over capitalised technology investment, favouring usage-priced partner platforms.", kind: "verified" },
      { text: "Philippine labour cost inflation compresses the arbitrage on which VXI's pricing to US clients depends.", kind: "inference" },
      { text: "A credible automation offering is now a prerequisite for renewal conversations with US telecom clients rather than an upsell.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "VXI is an operator whose differentiation is delivery quality and client management. It has no product engineering organisation, and its ownership structure explicitly disfavours capitalised software investment. A partner platform priced on usage fits both the balance sheet and the sales motion.",
    whyNotBuild:
      "Telecom and healthcare client programmes carry recording, retention and compliance obligations that would make an in-house platform a certification burden with no commercial upside. VXI's clients specify outcomes, not stacks, and would not pay a premium for VXI-built technology.",
    workflows: [
      {
        name: "Telecom billing, plan and activation servicing",
        friction: "Balance, plan-change, activation and troubleshooting calls fill VXI's Philippine floors and are benchmarked against automated alternatives by the client every renewal cycle.",
        outcome: "High-volume transactional telecom conversations automated against client systems with retention offers bounded by an approved matrix, and agents concentrated on saves and complaints.",
        channels: ["Voice", "Chat", "SMS", "IVR"],
        systems: ["Client billing and charging systems", "Provisioning and activation", "Offer and retention matrix"],
        value: 3, complexity: 2,
      },
      {
        name: "Media and streaming subscriber servicing",
        friction: "Subscription, payment-failure and cancellation conversations for media clients arrive in volume around billing cycles and content launches, with save-offer quality varying by agent.",
        outcome: "Subscription and payment conversations handled consistently with cancellation saves applied from an approved matrix, and high-value subscribers routed to specialists.",
        channels: ["Voice", "Chat", "Email"],
        systems: ["Subscription management", "Payments and dunning", "Offer matrix"],
        value: 3, complexity: 2,
      },
      {
        name: "Healthcare client support with compliance evidence",
        friction: "Healthcare programmes require trained agents and strict handling, which caps how far VXI can reduce cost per contact through operational measures alone.",
        outcome: "Routine eligibility and administrative enquiries automated with complete audit logging, and clinical or appeal matters routed to qualified staff.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client eligibility and claims systems", "Patient accounts", "Audit logging and retention"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Large Philippine delivery footprint with additional sites in China and the US", "Telecommunications, media, technology and healthcare client programmes", "CX advisory and digital services assembled from partner technology", "Standard recording, quality and workforce management operations"],
      gaps: ["No proprietary conversational platform to offer at renewal", "Automation configured per client rather than reused across programmes", "Cost per contact reduction limited to operational levers", "Quality assurance samples rather than scores every conversation"],
    },
    risks: [
      "US healthcare client work requires HIPAA business-associate arrangements and audited controls in the conversational platform.",
      "Telecommunications programmes carry recording and consumer-protection obligations in the client's jurisdiction.",
      "Client contracts may prohibit routing conversations through a third-party platform without written approval.",
    ],
    economics: { volumeMonthly: 800000, costPerInteraction: 1.4, automationRate: 0.55, basis: "Seller assumptions: aggregate contact volume across VXI's Philippine-delivered programmes at Philippine delivery cost — validate contracted volumes and seat counts in discovery." },
    pilotScope:
      "Deploy an automated tier for one US telecom client's billing and plan-change contact stream across voice and chat, measured on containment and cost per contact against baseline.",
    expansion: ["Extend to media and streaming subscriber servicing with matrix-bounded saves", "Add healthcare client administrative enquiry handling with audit evidence", "Standardise the platform across Philippine sites as a renewal offering"],
    stakeholders: ["Chief Operating Officer", "Country Head, Philippines", "Head of Digital / CX Solutions", "Chief Information Officer", "Vice President, Telecommunications vertical"],
    discovery: [
      "Which telecom and media contracts renew in the next year, and have clients asked for automation pricing?",
      "What is your current cost per contact on Philippine voice programmes, and what target have clients set?",
      "How does private-equity ownership view a usage-priced platform cost versus a capitalised build?",
      "Which clients would need to approve conversations routing through a partner platform?",
    ],
    flowTemplate: "billing-recharge",
    scenario: "A VXI-delivered US telecom programme handles balance and plan-change calls automatically from Manila, and agents take only the retention conversations.",
  },

  "datamatics": {
    operatingContext:
      "Datamatics is a Mumbai-listed digital operations and technology company that occupies an unusual position between a BPM and a software product firm: it runs finance, insurance and back-office processes for global clients while also selling its own automation products for robotic process automation and intelligent document processing. That product portfolio is document- and workflow-centric — extracting data from invoices, claims forms and shipping documents and driving it through automated processes — which is precisely where its automation IP ends. When a client's process touches a real conversation, whether a supplier chasing an invoice or a policyholder asking about a claim, Datamatics falls back on people. Its clients are increasingly asking for end-to-end automation, and the conversational tier is the visible gap in an otherwise coherent automation story.",
    strategicPressure: [
      { text: "Datamatics sells its own RPA and intelligent document-processing products, which makes it a technology-credible partner but leaves a specific and visible gap at the conversational layer.", kind: "verified" },
      { text: "Clients buying document automation increasingly expect the exception conversations that automation surfaces to be handled automatically too, not routed to a person.", kind: "inference" },
      { text: "As a listed mid-cap, Datamatics is judged on the growth of its products business, which favours adding a partner conversational layer to its own stack over expanding headcount services.", kind: "inference" },
      { text: "Its existing chatbot ambitions may overlap, so positioning must be explicitly complementary rather than competitive.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Datamatics has real engineering capability, which is why partner-led is right rather than buy-led. But its product investment is in document intelligence and process automation, not in speech, telephony and real-time dialogue. Extending into conversational infrastructure would mean a second product line with different economics and a different competitive set.",
    whyNotBuild:
      "Building conversational voice would put a mid-cap Indian product company into direct competition with global platform vendors while diluting the document-automation focus its investors value. Partnering lets it sell a complete automation story without funding speech models, multilingual telephony or a continuous evaluation function.",
    workflows: [
      {
        name: "Conversational layer over client RPA deployments",
        friction: "Datamatics automates a client's invoice or claims process, but every exception — a mismatched amount, a missing document, an ambiguous field — becomes an email or a phone call handled by a person.",
        outcome: "Exceptions surfaced by the automation are resolved conversationally with the supplier, customer or claimant, closing the loop and lifting straight-through processing rates in the client's own metrics.",
        channels: ["Voice", "Email", "WhatsApp", "Chat"],
        systems: ["Client ERP", "Datamatics RPA and document-processing platform", "Case and exception management"],
        value: 3, complexity: 3,
      },
      {
        name: "Supplier and accounts-payable enquiry servicing",
        friction: "Finance-and-accounting clients generate constant supplier calls about invoice receipt, approval status and payment dates, absorbing the team that should be processing.",
        outcome: "Supplier enquiries answered conversationally against live ERP and workflow data in the supplier's language, with disputes routed to specialists and every interaction logged.",
        channels: ["Voice", "Email", "Chat"],
        systems: ["Client ERP and payables workflow", "Document processing outputs", "Dispute case management"],
        value: 3, complexity: 2,
      },
      {
        name: "Insurance policyholder document and status conversations",
        friction: "Insurance clients rely on Datamatics for claims document processing, but claimants still call for status and to resolve rejected documents, which happens outside the automated flow.",
        outcome: "Proactive status updates and guided document re-submission handled conversationally, cutting claim cycle time and the status-call volume the client's own contact centre carries.",
        channels: ["WhatsApp", "Voice", "Email"],
        systems: ["Client claims system", "Document processing platform", "Communications consent register"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Proprietary RPA and intelligent document-processing products deployed at client sites", "Finance, insurance and back-office process delivery from Indian centres", "Systems-integration and implementation capability for client automation programmes", "Established client relationships in banking, insurance and logistics"],
      gaps: ["No conversational voice capability to close automation loops", "Exceptions raised by automation still route to human handling", "No multilingual conversational reach for supplier and customer contact", "Automation story stops at the boundary of a real conversation"],
    },
    risks: [
      "Positioning must be explicitly complementary to Datamatics' own chatbot and automation products to avoid an internal competitive objection.",
      "Client ERP and claims data processed conversationally requires per-client data-handling agreements and India-based processing disclosures.",
      "Insurance client work carries conduct and record-retention obligations that the conversational layer must satisfy.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 1.2, automationRate: 0.55, basis: "Seller assumptions: exception and enquiry conversation volume arising from Datamatics-run client processes at Indian delivery cost — validate per-client process volumes in discovery." },
    pilotScope:
      "Deploy a conversational exception-resolution layer over one existing accounts-payable automation client, handling supplier invoice and payment status enquiries against live ERP data.",
    expansion: ["Extend to insurance claims document and status conversations", "Add multilingual supplier outreach across finance-and-accounting clients", "Package the conversational layer as a standard add-on to Datamatics automation deals"],
    stakeholders: ["Chief Executive Officer", "Head of Products (RPA and document processing)", "Head of Business Process Management delivery", "Chief Technology Officer", "Head of Client Solutions"],
    discovery: [
      "What proportion of transactions in your automated client processes end as exceptions requiring a human conversation?",
      "Where does TruBot's conversational roadmap stop, and what would you not want a partner to overlap with?",
      "How many supplier enquiry calls do your finance-and-accounting programmes handle monthly?",
      "Would clients accept a partner conversational layer inside a Datamatics-branded automation solution?",
    ],
    flowTemplate: "employee-desk",
    scenario: "An invoice exception raised by Datamatics automation triggers a call to the supplier in Hindi, resolves the mismatch and pushes the payment straight through.",
  },

  "fusion-cx": {
    operatingContext:
      "Fusion CX is a Kolkata-headquartered customer-experience outsourcer that has grown rapidly by acquisition into a network of dozens of delivery centres across India, the Philippines, Latin America, North America and Europe, serving healthcare, fintech, utility and consumer clients. Growth by acquisition is the defining operational fact: it has inherited heterogeneous telephony, CRM and quality tooling from a series of independent companies, each with its own client contracts, standards and local practices. That fragmentation is expensive to run and hard to sell against, and it collides directly with a public-market ambition that requires a clean, scalable operating story. Its multilingual footprint is genuine — Indian languages, Filipino, Spanish, European languages — but it is delivered by recruitment in many places rather than by a single capability.",
    strategicPressure: [
      { text: "Growth by acquisition across many geographies has left a heterogeneous technology estate that raises operating cost and complicates standardisation.", kind: "verified" },
      { text: "A public-listing ambition requires a demonstrable, scalable operating model and an AI narrative that investors and clients both recognise.", kind: "inference" },
      { text: "Multilingual delivery is currently a recruitment achievement rather than a technology capability, which caps how fast it can scale into new language markets.", kind: "inference" },
      { text: "Mid-tier scale means Fusion CX cannot fund proprietary platform development while also integrating acquisitions.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Fusion CX is an acquisitive services operator whose capital is committed to acquisitions and integration. It has no product engineering function, and its immediate technology problem is standardisation, not invention. A single bought platform deployed across centres is directly aligned with the integration agenda.",
    whyNotBuild:
      "Building a conversational platform while simultaneously integrating dozens of acquired centres would be a distraction with no chance of success. What Fusion CX needs is one capability it can impose across a fragmented estate, which is exactly what a packaged platform provides.",
    workflows: [
      {
        name: "Standardised multilingual delivery across acquired centres",
        friction: "Each acquired centre delivers language coverage through local hiring on its own tooling, so quality, cost and capability vary by site and cannot be sold as one offering.",
        outcome: "One conversational capability spanning Indian languages, Filipino, Spanish and English across every centre, giving Fusion CX a single scalable offering and consistent quality measurement.",
        channels: ["Voice", "Chat", "WhatsApp", "Email"],
        systems: ["Client CRM systems", "Contact-centre platforms across sites", "Quality and evaluation tooling"],
        value: 3, complexity: 3,
      },
      {
        name: "Healthcare client member and patient servicing",
        friction: "Healthcare programmes require trained agents and compliance handling, and each acquired centre applies its own controls and evidence practices.",
        outcome: "Routine eligibility, billing and appointment enquiries automated with uniform audit logging across sites, and clinical matters routed to qualified staff under one policy.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Client eligibility and claims systems", "Patient accounts", "Audit logging and retention"],
        value: 3, complexity: 3,
      },
      {
        name: "Fintech and utility client contact automation",
        friction: "Payment, account and billing conversations for fintech and utility clients are high-volume and price-benchmarked, and delivered inconsistently across the acquired network.",
        outcome: "Consistent automated handling of payment and account conversations with compliant language and full logging, giving Fusion CX a uniform cost-per-contact story at bid stage.",
        channels: ["Voice", "Chat", "SMS", "WhatsApp"],
        systems: ["Client billing and payments systems", "Account management", "Compliance recording"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Dozens of delivery centres across India, the Philippines, the Americas and Europe", "Multilingual agent pools covering Indian, Filipino, Spanish and European languages", "Healthcare, fintech, utility and consumer client programmes", "Local contact-centre tooling and quality practices inherited from acquisitions"],
      gaps: ["No standardised conversational platform across the acquired estate", "Language coverage limited by recruitment in each geography", "Quality and evaluation practices vary site by site", "No uniform cost-per-contact or automation story to present at bid stage"],
    },
    risks: [
      "Heterogeneous inherited telephony and CRM estates make integration effort highly variable by site, and the pilot must prove a repeatable pattern.",
      "Healthcare client work carries HIPAA and equivalent obligations requiring consistent controls that the current estate may not uniformly meet.",
      "Client contracts inherited through acquisition may restrict technology changes without consent.",
    ],
    economics: { volumeMonthly: 400000, costPerInteraction: 1.2, automationRate: 0.5, basis: "Seller assumptions: aggregate contact volume across Fusion CX delivery centres at a blended offshore delivery cost — validate per-centre volumes and contract terms in discovery." },
    pilotScope:
      "Standardise one client programme delivered from two acquired centres onto a single conversational platform with uniform evaluation, proving the integration pattern and cost-per-contact improvement.",
    expansion: ["Roll the standard platform across Indian and Philippine centres", "Add healthcare client member-servicing automation with uniform audit evidence", "Extend language coverage beyond the recruitable pool to widen the addressable bid market"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Chief Technology Officer", "Head of Healthcare vertical", "Head of Integration / M&A operations"],
    discovery: [
      "How many distinct contact-centre platforms are in use across your acquired centres today?",
      "Which client contracts allow a technology change without renegotiation?",
      "Which languages do you currently turn down bids for because you cannot recruit?",
      "What operating-model evidence would a listing process require of your delivery standardisation?",
    ],
    flowTemplate: "inbound-service",
    scenario: "Two acquired Fusion CX centres run the same client programme on one platform for the first time, with identical language coverage and every interaction scored.",
  },

  "igt-solutions": {
    operatingContext:
      "IGT Solutions is a travel-specialist business-process and technology firm serving airlines, online travel agencies, hospitality groups and travel-technology providers, delivering contact-centre operations, back-office fares and ticketing work, and application services from centres in India, the Philippines, Vietnam, Colombia and elsewhere. Its vertical focus is unusually sharp: it understands passenger service systems, fare rules, ticketing and reaccommodation in a way generalist outsourcers do not, and it sells that depth rather than the lowest seat price. That specialisation also concentrates its exposure. Travel demand is seasonal and its clients' operations are subject to weather, technical and industrial disruptions that multiply contact volume within an hour, which means IGT must either hold expensive standby capacity or accept service-level failures at the worst possible moment for its clients.",
    strategicPressure: [
      { text: "Airline and OTA disruption events multiply contact volume within an hour, and no staffed contact centre can flex fast enough to absorb them.", kind: "verified" },
      { text: "IGT's travel-domain depth is exactly the asset that makes disruption automation credible, since generic providers cannot model reaccommodation and fare-rule logic.", kind: "inference" },
      { text: "Airline clients are actively deploying AI in their own service operations, which threatens outsourced volume unless IGT is the party delivering the automation.", kind: "verified" },
      { text: "Multi-country delivery in India, the Philippines, Vietnam and Latin America means language coverage is a recruitment problem that a platform could relieve.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "IGT builds travel-specific applications and integrations, so it is technology-capable, but its products are domain applications rather than conversational infrastructure. Speech, telephony and dialogue orchestration are horizontal capabilities it would gain no advantage from owning.",
    whyNotBuild:
      "Airline clients specify their own passenger service systems and increasingly their own AI vendors. IGT's right to win is the domain layer — reaccommodation logic, fare rules, disruption playbooks — sitting on top of a conversational platform someone else maintains and certifies.",
    workflows: [
      {
        name: "Airline disruption reaccommodation and passenger notification",
        friction: "When an airline client cancels a bank of flights, IGT's floors are overwhelmed within minutes; passengers wait on hold at airports while agents work rebooking screens one passenger at a time.",
        outcome: "Affected passengers are contacted proactively with live rebooking options confirmed in-channel, hold queues collapse, and IGT's agents handle only complex multi-leg and special-service cases.",
        channels: ["Voice", "WhatsApp", "SMS", "App"],
        systems: ["Passenger service system", "Reaccommodation and inventory tools", "Refund and payments pipeline"],
        value: 3, complexity: 3,
      },
      {
        name: "Refund and ancillary-services status servicing",
        friction: "Refund status calls dominate post-disruption and seasonal contact volume, and each requires an agent to interrogate the payments pipeline and explain a timeline.",
        outcome: "Refund status delivered proactively and on demand from live payment data, with ancillary purchases and changes handled conversationally, removing the highest-volume low-value contact type.",
        channels: ["Voice", "WhatsApp", "Chat", "Email"],
        systems: ["Payments and refunds pipeline", "Passenger service system", "Ancillary product catalogue"],
        value: 3, complexity: 2,
      },
      {
        name: "OTA and hospitality booking servicing",
        friction: "Booking changes, cancellation policy questions and supplier-side confirmations for OTA and hotel clients consume agent time across multiple time zones and languages.",
        outcome: "Booking modifications and policy questions resolved conversationally against live inventory and rules, with supplier escalations routed and every interaction logged.",
        channels: ["Chat", "Voice", "WhatsApp", "Email"],
        systems: ["OTA booking platform", "Supplier and property management systems", "Cancellation policy rules"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Travel-vertical contact-centre delivery for airlines, OTAs and hospitality clients", "Fares, ticketing and revenue-accounting back-office operations", "Travel-technology application services and integration capability", "Multi-country delivery footprint including Vietnam and Latin America"],
      gaps: ["No conversational platform to absorb disruption surges", "Standby capacity is the only current answer to unpredictable spikes", "Refund status remains a high-volume manual contact type", "Language coverage limited by recruitment in each delivery country"],
    },
    risks: [
      "Airline clients mandate passenger service system access controls and may require their own AI vendor, so interoperability and client consent are prerequisites.",
      "Passenger data including payment and special-service information is subject to GDPR and airline-industry data rules across jurisdictions.",
      "Disruption communications carry regulatory consequences under passenger-rights regimes, so compensation and rebooking statements must be grounded in the client's approved policy.",
    ],
    economics: { volumeMonthly: 600000, costPerInteraction: 1.3, automationRate: 0.55, basis: "Seller assumptions: aggregate travel-client contact volume including disruption peaks at offshore delivery cost — validate contracted volumes and standby capacity cost in discovery." },
    pilotScope:
      "Deploy proactive disruption notification and self-service rebooking for one airline client across voice and WhatsApp, measured on contacts absorbed per disruption event and hold-queue reduction.",
    expansion: ["Add refund and ancillary status servicing across airline clients", "Extend to OTA and hospitality booking servicing", "Package disruption automation as a standard IGT travel offering at bid stage"],
    stakeholders: ["Chief Executive Officer", "Head of Airline vertical delivery", "Chief Technology Officer", "Head of Solutions and Bids", "Head of Delivery Operations, India and Philippines"],
    discovery: [
      "In a major disruption event, how many contacts arrive in the first hour and what service level do you achieve?",
      "How much standby capacity do you hold for airline clients, and what does it cost annually?",
      "Which airline clients have already selected their own conversational AI vendor?",
      "What share of your travel contact volume is refund status, and what is the average handle time?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "An airline client cancels a bank of evening flights; the platform rebooks affected passengers on WhatsApp before they reach the counter, and IGT agents take only the complex itineraries.",
  },

  "conneqt": {
    operatingContext:
      "Conneqt Business Solutions, owned within the Quess group, is one of India's largest domestic-market customer-lifecycle outsourcers, running inbound service, tele-sales, verification and collections operations in Indian languages for banks, non-banking finance companies, telecom operators, insurers and government programmes. Unlike the export-oriented Indian BPMs, its book is Indian consumers being served in Hindi, Tamil, Telugu, Marathi, Bengali and more, at price points measured in rupees per contact rather than dollars. That domestic positioning makes it the most directly exposed of all Indian BPMs to conversational automation, because the workflows it sells — early-bucket collections, verification calls, service enquiries, lead qualification — are the same workflows agentic voice automates first and best. It is simultaneously the most valuable channel, since it already holds relationships with hundreds of Indian enterprises that would buy the same automation.",
    strategicPressure: [
      { text: "Conneqt's core domestic offerings — collections, verification and tele-sales in Indian languages — are precisely the workflows conversational AI automates first, making disruption immediate rather than distant.", kind: "verified" },
      { text: "Indian domestic BPM pricing is measured in rupees per contact, leaving almost no margin buffer to absorb technology cost without a pass-through model.", kind: "inference" },
      { text: "RBI conduct rules on recovery-agent behaviour, contact timing and recording make governed, fully logged automated outreach a compliance improvement for its lending clients.", kind: "verified" },
      { text: "Existing relationships with hundreds of Indian enterprises make Conneqt a faster route to market than direct enterprise selling for many mid-tier accounts.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Conneqt is a labour-intensive domestic operator inside a staffing-led group. It has no software product capability and no capital for one. Its strategic choice is binary: resell and operate a platform across its client base, or watch that client base buy it directly.",
    whyNotBuild:
      "Ten or more Indian languages with genuine voice quality, telephony at Indian domestic scale, and RBI-compliant recording and retention is a platform investment far beyond a domestic BPM's means. Quess is a staffing and services group, not a technology developer.",
    workflows: [
      {
        name: "Multilingual early-bucket collections for lending clients",
        friction: "Dialler campaigns reach a fraction of the portfolio in permitted hours; collector language coverage limits which geographies can be worked, and conduct consistency depends on training.",
        outcome: "The full early-bucket portfolio contacted in permitted windows in each borrower's language with policy-bounded negotiation, payment links in-channel, and hardship cases escalated to trained collectors.",
        channels: ["Voice", "WhatsApp", "SMS"],
        systems: ["Client loan management system", "Payment gateway", "Compliance recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Verification and onboarding call automation",
        friction: "Tele-verification calls for lenders, insurers and telcos are high-volume, script-driven and staffed heavily, with quality checked only by sampled QA.",
        outcome: "Verification conversations conducted identically every time in the customer's language with complete recordings, structured outcomes written back, and every call scored rather than sampled.",
        channels: ["Voice", "WhatsApp"],
        systems: ["Client onboarding and KYC systems", "Document management", "Recording and retention"],
        value: 3, complexity: 2,
      },
      {
        name: "Domestic service and tele-sales programme delivery",
        friction: "Service enquiry and outbound sales programmes for telecom, insurance and government clients are capacity-limited and delivered at rupee-level margins that leave no room for improvement.",
        outcome: "High-volume service and qualification conversations automated across Indian languages, with agents concentrated on conversion and complaint handling and Conneqt able to price on outcomes.",
        channels: ["Voice", "WhatsApp", "SMS", "IVR"],
        systems: ["Client CRM", "Campaign management", "Consent and DND registers"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Large domestic Indian delivery operations across multiple languages", "Collections, verification, tele-sales and service programmes for banks, NBFCs, telcos and insurers", "Compliance recording and quality operations aligned to Indian regulatory expectations", "Long-standing relationships with hundreds of Indian enterprise clients"],
      gaps: ["No conversational platform to resell or operate", "Language coverage constrained by regional collector recruitment", "Contact coverage in collections limited by dialler and agent capacity", "Quality assurance samples a small fraction of regulated conversations"],
    },
    risks: [
      "RBI conduct rules govern recovery-agent behaviour, contact hours, frequency and recording; automated outreach must enforce these and evidence compliance.",
      "TRAI regulations and DND registers constrain outbound commercial communication and must be respected per contact.",
      "India's DPDP Act governs borrower and customer data handling, with client-specific consent and retention terms.",
    ],
    economics: { volumeMonthly: 2500000, costPerInteraction: 0.6, automationRate: 0.6, basis: "Seller assumptions: aggregate domestic contact volume across Conneqt-delivered programmes at Indian domestic delivery cost — validate contracted volumes and per-contact pricing in discovery." },
    pilotScope:
      "Deploy multilingual early-bucket collections outreach for one NBFC client across voice and WhatsApp with RBI-compliant recording and hardship escalation, measured on contact coverage and promise-to-pay conversion.",
    expansion: ["Extend to verification and onboarding call automation across lending and insurance clients", "Offer the platform as a resold capability to Conneqt's wider Indian enterprise base", "Add domestic service and tele-sales programme automation across languages"],
    stakeholders: ["Chief Executive Officer", "Head of Collections business", "Chief Technology Officer", "Head of Banking and Financial Services vertical", "Quess group strategy / corporate development lead"],
    discovery: [
      "What share of an early-bucket portfolio do you actually contact within permitted hours today?",
      "Which languages can you not staff collectors for, and what business do you turn away as a result?",
      "How would a resale margin structure work against your current rupee-per-contact pricing?",
      "How is RBI conduct compliance evidenced across your collections conversations today?",
    ],
    flowTemplate: "collections",
    scenario: "An NBFC client's entire early-bucket book is contacted in eight Indian languages within permitted hours, with payment links sent in-conversation and hardship cases escalated.",
  },

  "sagility": {
    operatingContext:
      "Sagility is an India-listed, healthcare-focused business-process management firm — formerly the healthcare arm of Hinduja Global Solutions — running member services, claims administration, provider support, payment integrity and clinical-adjacent operations for United States health plans and providers from delivery centres in India, the Philippines, Jamaica and the US. Its client base is almost entirely US healthcare payers and providers, which means every process it touches sits inside HIPAA, plan-specific compliance regimes and payer audit expectations. Its contact work is dominated by two enormous conversation categories: members asking about eligibility, benefits, claims and billing, and providers asking about authorisations, claim status and payment. Both are highly structured, highly repetitive, and expensive because they require trained, compliance-certified agents rather than generalists.",
    strategicPressure: [
      { text: "As a pure-play healthcare BPM, Sagility's entire revenue base is exposed to US payers' relentless administrative-cost reduction programmes.", kind: "verified" },
      { text: "HIPAA and payer audit requirements make governance, logging and evaluation a procurement precondition rather than a feature, which favours an evaluated platform over bespoke tooling.", kind: "verified" },
      { text: "Member and provider enquiry conversations are structured and repetitive enough to automate at high rates while keeping clinical and appeal decisions human.", kind: "inference" },
      { text: "Payer clients increasingly require their vendors to demonstrate AI-enabled cost reduction as a condition of renewal.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Sagility is an operations business with healthcare domain depth, not a technology developer. Its differentiation is understanding payer processes and passing payer audits; the conversational infrastructure underneath is undifferentiated and better sourced from a platform that already carries the security and compliance evidence payers demand.",
    whyNotBuild:
      "A HIPAA-compliant conversational platform requires business-associate arrangements, encryption, audited access, retention controls and demonstrable evaluation across every interaction. Building and certifying that would consume Sagility's technology budget for years and produce nothing its payer clients would pay a premium for.",
    workflows: [
      {
        name: "Health-plan member services automation",
        friction: "Members call about eligibility, benefits, deductibles, claim status and provider networks; each call requires a certified agent navigating multiple payer systems, and payers benchmark that cost continuously.",
        outcome: "Routine member enquiries resolved against live payer systems with complete audit logging, and appeals, grievances and clinical questions routed immediately to licensed staff.",
        channels: ["Voice", "Chat", "SMS"],
        systems: ["Payer claims platform", "Eligibility and benefits systems", "Provider directory", "Audit logging and retention"],
        value: 3, complexity: 3,
      },
      {
        name: "Provider claim-status and authorisation servicing",
        friction: "Provider offices call repeatedly for claim status and prior-authorisation updates, generating enormous predictable volume that adds no clinical value.",
        outcome: "Claim status and authorisation state delivered conversationally and proactively to provider offices, collapsing the highest-volume administrative contact type in payer operations.",
        channels: ["Voice", "Chat", "Portal messaging"],
        systems: ["Claims adjudication platform", "Prior-authorisation workflow", "Provider records"],
        value: 3, complexity: 2,
      },
      {
        name: "Member outreach for care gaps and enrollment",
        friction: "Outreach campaigns for annual enrollment, wellness visits and care-gap closure are capacity-limited by outbound agent hours, so a large share of the target population is never reached.",
        outcome: "Full-population outbound coverage with appointment scheduling and enrollment support handled conversationally, with clinical questions escalated and every contact documented for the plan's quality reporting.",
        channels: ["Voice", "SMS", "Chat"],
        systems: ["Member records and care-gap registries", "Scheduling interfaces", "Campaign and consent management"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Member services, claims and provider support operations for US payers and providers", "HIPAA-aligned compliance, security and audit functions", "Multi-geography delivery from India, the Philippines and nearshore locations", "Payment integrity and clinical-adjacent operational capability"],
      gaps: ["No conversational platform to automate member and provider contact", "Cost per contact reducible only through operational levers and offshoring", "Outbound member outreach limited by agent capacity", "Quality assurance samples rather than scores every regulated conversation"],
    },
    risks: [
      "HIPAA requires business-associate agreements, encryption, audited access and retention controls across the conversational platform and all its subprocessors.",
      "Member conversations must never include clinical advice or coverage determinations; appeals and grievances have regulated handling paths that must be enforced.",
      "US payer clients impose their own security assessments and may require specific hosting or data-residency arrangements.",
    ],
    economics: { volumeMonthly: 1500000, costPerInteraction: 1.6, automationRate: 0.5, basis: "Seller assumptions: aggregate member and provider contact volume across Sagility-delivered payer programmes at offshore delivery cost — validate contracted volumes in discovery." },
    pilotScope:
      "Deploy provider claim-status and authorisation servicing for one payer client across voice and portal messaging, with full HIPAA-compliant logging, measured on contacts automated and cost per provider enquiry.",
    expansion: ["Extend to member services covering eligibility, benefits and claim status", "Add outbound care-gap and enrollment outreach with clinical escalation", "Standardise the platform across payer programmes as a contracted cost-reduction commitment"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Chief Information Security Officer", "Head of Payer Client Delivery", "Chief Compliance Officer"],
    discovery: [
      "What share of your contact volume is provider claim-status enquiry, and what is the average handle time?",
      "What security and HIPAA evidence would your largest payer client require before approving a new conversational platform?",
      "Which client contracts include committed administrative cost-reduction targets?",
      "Where exactly is the line between an administrative answer and a coverage determination in member conversations?",
    ],
    flowTemplate: "claims",
    scenario: "A provider office asks about claim status and a pending authorisation; the agent answers both from the adjudication platform with every step logged for payer audit.",
  },

  "ansr": {
    operatingContext:
      "ANSR is a Bengaluru-based firm that designs, establishes and operates global capability centres for large multinational enterprises, having stood up a very large number of GCCs in India for Fortune-500 clients across technology, retail, financial services and healthcare. Its role is not to run contact centres but to sit at the table when an enterprise decides what functions to move into a new India centre, how those functions will be staffed, and what technology they will run on. That places ANSR upstream of the buying decision for exactly the support, service-desk and customer-operations functions that conversational automation transforms. Its commercial model — build-operate-transfer and managed GCC operations — means its recommendations become the operating standard of centres that then run for years, which makes it a route to market rather than a conventional end customer.",
    strategicPressure: [
      { text: "India's GCC boom continues to move enterprise support and operations functions into new centres, each of which makes technology and operating-model decisions at inception.", kind: "verified" },
      { text: "New GCCs are increasingly expected to demonstrate AI-native operating models from day one rather than replicating legacy processes offshore.", kind: "inference" },
      { text: "ANSR's advisory position means its technology recommendations shape multi-year operating standards inside centres it establishes.", kind: "inference" },
      { text: "Its commercial model may or may not permit carrying third-party platform recommendations, which is the central thing to validate.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "ANSR is an advisory and operating firm, not a technology developer. Its value to clients is speed to a functioning centre and access to talent, so any technology in its playbook is third-party and configurable rather than proprietary.",
    whyNotBuild:
      "Building a conversational platform would put ANSR into a product business that conflicts with its neutrality as an adviser to enterprises selecting technology for their own centres. Partnering keeps it a trusted adviser while giving it a differentiated capability to include in GCC designs.",
    workflows: [
      {
        name: "Internal service desk for newly established GCCs",
        friction: "A new GCC ramping to thousands of employees needs IT, HR and facilities support from day one, and the default is to hire an L1 service desk that will cost per ticket for years.",
        outcome: "New centres launch with a conversational service desk resolving access, payroll, leave and IT issues at first contact, avoiding an entire layer of permanent headcount.",
        channels: ["Chat", "Voice"],
        systems: ["ITSM platform", "HR information system", "Identity and access management"],
        value: 3, complexity: 2,
      },
      {
        name: "Customer-operations function design for client GCCs",
        friction: "When an enterprise moves customer operations into a new India centre, the default design is a lift-and-shift of the existing agent-based process, which locks in a labour-based cost structure.",
        outcome: "Customer-operations functions are designed with an automated tier from inception, so the centre's business case is built on automation-inclusive economics rather than seat counts.",
        channels: ["Voice", "Chat", "Email", "WhatsApp"],
        systems: ["Client CRM and case systems", "Contact routing", "Quality and evaluation tooling"],
        value: 3, complexity: 3,
      },
      {
        name: "GCC talent acquisition and onboarding at ramp",
        friction: "Standing up a centre means hiring at extraordinary rates, and candidate screening, interview scheduling and onboarding logistics overwhelm recruitment teams during ramp.",
        outcome: "Candidate engagement, screening and interview scheduling handled conversationally at ramp scale, and new-joiner onboarding questions resolved without recruiter time.",
        channels: ["WhatsApp", "Voice", "Chat"],
        systems: ["Applicant tracking system", "Interview scheduling", "Onboarding and HR systems"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["GCC design, establishment and managed-operations services for multinational clients", "Talent acquisition and workforce enablement capability at ramp scale", "Real estate, infrastructure and operating-model advisory for new centres", "Established relationships with enterprise leadership making offshore operating decisions"],
      gaps: ["No conversational capability included in standard GCC operating designs", "New centres default to human-staffed service desks and customer operations", "Ramp-phase recruitment handled entirely by people", "No reusable automation playbook across the GCCs it establishes"],
    },
    risks: [
      "ANSR's advisory neutrality may limit its ability to recommend a specific platform, and commercial arrangements must be structured to avoid a conflict-of-interest objection with clients.",
      "The ultimate buyer is the client enterprise, not ANSR, so contracting paths and revenue-share arrangements must be clear before investment.",
      "Client enterprises bring their own security, data-residency and vendor-approval regimes that vary widely.",
    ],
    economics: { volumeMonthly: 150000, costPerInteraction: 1.2, automationRate: 0.55, basis: "Seller assumptions: internal service-desk and support interaction volume across ANSR-operated centres at Indian delivery cost — validate headcount under management and ticket volumes in discovery." },
    pilotScope:
      "Deploy a conversational internal service desk for one ANSR-operated GCC covering IT access, HR and payroll queries, measured on first-contact resolution and L1 headcount avoided.",
    expansion: ["Include the automated tier in customer-operations designs for new GCC mandates", "Add ramp-phase recruitment and onboarding conversation automation", "Package the capability as a standard component of the ANSR GCC operating model"],
    stakeholders: ["Chief Executive Officer", "Head of GCC Operations / Managed Services", "Head of Solution Design and Advisory", "Chief Technology Officer", "Head of Talent Solutions"],
    discovery: [
      "How many employees are currently under ANSR-managed GCC operations, and what does L1 support cost per head?",
      "Can ANSR carry a specific technology recommendation into a client GCC design, or must it remain vendor-neutral?",
      "Who contracts for technology inside a GCC you operate — ANSR or the client enterprise?",
      "How many new GCC mandates do you expect to design in the next year that include customer operations?",
    ],
    flowTemplate: "employee-desk",
    scenario: "A newly opened GCC goes live with a conversational service desk on day one, resolving access and payroll questions without an L1 team ever being hired.",
  },

  "open-access-bpo": {
    operatingContext:
      "Open Access BPO is a Manila- and Davao-based outsourcer that differentiates explicitly on multilingual delivery, offering support in a wide range of Asian and European languages for technology, e-commerce and consumer clients, with an additional site in Taipei supporting Mandarin and other regional coverage. That positioning is its entire commercial identity: clients choose it not for the lowest Philippine seat price but because it can staff Japanese, Korean, Mandarin or European-language support that most Philippine providers cannot. It is also its structural vulnerability, because that language coverage is produced by expatriate and specialist recruitment in Manila and Taipei — expensive, slow to scale, and fragile when a single speaker resigns. A multilingual conversational platform is therefore both the most direct threat to its differentiation and the fastest way to multiply it.",
    strategicPressure: [
      { text: "Open Access BPO's differentiation rests on multilingual coverage produced by specialist recruitment, which is expensive, slow to scale and vulnerable to individual attrition.", kind: "verified" },
      { text: "Multilingual conversational AI can deliver in one deployment the language breadth the company spends years recruiting for, which threatens its positioning unless it adopts the capability itself.", kind: "inference" },
      { text: "Its technology and e-commerce clients are exactly the buyer set most willing to accept automated first-tier support.", kind: "inference" },
      { text: "Mid-size scale means client volumes must be aggregated to justify platform economics.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Open Access BPO is a delivery organisation whose investment goes into sites, recruitment and language talent. It has no engineering function and no realistic path to one. The choice is to adopt a partner platform or watch language-capable automation erode its differentiation.",
    whyNotBuild:
      "Building speech capability across a dozen languages is a research-scale investment. For a mid-size Philippine outsourcer it is not a build-or-buy decision but a partner-or-decline one.",
    workflows: [
      {
        name: "Multilingual first-tier support beyond the recruitable pool",
        friction: "Winning a Japanese or Korean support programme requires recruiting native speakers in Manila, which limits both the languages offered and the hours covered, and one resignation can breach a service level.",
        outcome: "Language coverage delivered by the platform across a dozen languages at any hour, with specialist human agents reserved for complex cases and the bid-addressable market widened substantially.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client helpdesk and CRM", "Knowledge base", "Routing and escalation"],
        value: 3, complexity: 2,
      },
      {
        name: "E-commerce order and returns servicing across markets",
        friction: "Marketplace clients need support in each market's language during that market's hours, which forces Open Access to spread thin language teams across shifts.",
        outcome: "Order, delivery and returns conversations handled in each market's language around the clock, with proactive exception messaging reducing inbound entirely.",
        channels: ["Chat", "WhatsApp", "Email", "Voice"],
        systems: ["Client order management", "Logistics feeds", "Returns and refunds workflow"],
        value: 3, complexity: 2,
      },
      {
        name: "Taipei-hub regional coverage extension",
        friction: "The Taipei site anchors Mandarin and regional coverage but is small, so capacity and hours are constrained and growth requires local hiring in a tight market.",
        outcome: "Regional language coverage scaled from the platform rather than the Taipei headcount plan, letting the site focus on complex and relationship-led work.",
        channels: ["Chat", "Voice", "Email"],
        systems: ["Client CRM", "Knowledge base", "Workforce management"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Manila and Davao delivery centres with multilingual agent teams", "A Taipei site supporting Mandarin and regional coverage", "Technology, e-commerce and consumer client programmes", "Standard contact-centre tooling and quality management"],
      gaps: ["Language coverage capped by specialist recruitment and attrition", "Round-the-clock coverage in minority languages is economically unviable", "No conversational platform to scale languages independently of hiring", "Bid participation limited by which languages can currently be staffed"],
    },
    risks: [
      "Client contracts may specify native-speaker handling for particular languages, requiring explicit renegotiation before automation.",
      "Philippine and Taiwanese data-protection regimes plus client-country rules govern cross-border handling of customer data.",
      "Mid-size volumes mean platform economics must be proven across aggregated client programmes rather than a single account.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 1.3, automationRate: 0.5, basis: "Seller assumptions: aggregate multilingual contact volume across Open Access BPO programmes at Philippine delivery cost — validate per-language volumes and seat counts in discovery." },
    pilotScope:
      "Deploy automated first-tier support in Japanese, Korean and Mandarin for one technology client across chat and email, measured on containment and languages served without additional hiring.",
    expansion: ["Extend to e-commerce order and returns servicing across market languages", "Scale regional coverage from the Taipei hub without proportional hiring", "Bid for programmes in languages the company cannot currently staff"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Multilingual Delivery", "Site Director, Taipei", "Head of Business Development"],
    discovery: [
      "Which languages do you turn down bids for today because you cannot recruit speakers?",
      "What is your attrition rate among specialist-language agents, and what does a single resignation cost?",
      "Which client contracts require native-speaker handling explicitly?",
      "What volume across clients would need to be aggregated to justify platform economics for you?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A technology client's Japanese and Korean support runs around the clock from Manila without a single additional native-speaker hire.",
  },

  "microsourcing": {
    operatingContext:
      "MicroSourcing is one of the largest offshore-staffing providers in the Philippines, owned within the Probe Group, building and hosting dedicated teams for Australian, New Zealand, US and UK small and mid-market businesses across customer support, administration, accounting, marketing and technical roles. Its model is not managed outsourcing but managed staffing: the client directs the work, MicroSourcing provides the people, facilities, employment and management infrastructure. That means it hosts thousands of small support operations — a five-seat helpdesk for an Australian software company here, a ten-seat customer service team for a UK retailer there — each individually far too small to procure conversational AI, evaluate it, or integrate it. MicroSourcing sits across all of them as the only party with the scale to aggregate that demand.",
    strategicPressure: [
      { text: "The offshore-staffing model hosts many small client teams that individually lack the scale to buy, integrate or govern conversational AI.", kind: "verified" },
      { text: "SME and mid-market clients are the segment most likely to reduce offshore headcount as accessible AI tooling improves, threatening seat volumes directly.", kind: "inference" },
      { text: "Philippine wage inflation compresses the cost advantage that justifies offshore staffing for smaller clients with tighter budgets.", kind: "verified" },
      { text: "Parent Probe Group's platform strategy will determine whether MicroSourcing sells automation itself or channels it through the group.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "MicroSourcing provides employment, facilities and management infrastructure, not technology products. Its clients bring their own systems. A white-label partner platform it can offer as an add-on across many small teams is the only model that matches how it operates.",
    whyNotBuild:
      "Its clients are too small and too heterogeneous to justify any bespoke build, and MicroSourcing's economics are staffing margins. What it can uniquely provide is aggregation — one platform relationship serving hundreds of small client operations that could never contract for it individually.",
    workflows: [
      {
        name: "White-label automation add-on for client support teams",
        friction: "A client's five-seat offshore support team handles the same routine questions all day; the client cannot justify buying AI tooling for five seats and MicroSourcing has nothing to offer.",
        outcome: "An automation tier offered alongside the seats, configured per client, letting small teams handle more volume without more headcount and giving MicroSourcing higher-value revenue per client.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client helpdesk and CRM", "Knowledge base", "Client-specific workflow tools"],
        value: 3, complexity: 2,
      },
      {
        name: "After-hours coverage for ANZ and UK clients",
        friction: "Small clients want extended-hours coverage but cannot fund the extra seats, so their offshore teams cover only a single shift and out-of-hours contacts go unanswered.",
        outcome: "Continuous coverage delivered from the platform without additional seats, turning a capability small clients cannot afford into a standard MicroSourcing offering.",
        channels: ["Chat", "Email", "Voice", "SMS"],
        systems: ["Client helpdesk", "Routing and telephony", "Escalation rules"],
        value: 3, complexity: 1,
      },
      {
        name: "Internal recruitment and workforce support at scale",
        friction: "MicroSourcing recruits and onboards continuously across thousands of roles, and candidate screening, scheduling and new-joiner questions consume large internal teams.",
        outcome: "Candidate engagement, screening and onboarding queries handled conversationally at recruitment scale, reducing internal cost per hire and speeding client team ramps.",
        channels: ["WhatsApp", "SMS", "Chat", "Voice"],
        systems: ["Applicant tracking system", "Interview scheduling", "HR and onboarding systems"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Large Philippine facilities hosting dedicated client teams", "Employment, management and infrastructure services for offshore staffing clients", "Recruitment capability across support, administrative and technical roles", "Client account management across many small and mid-market accounts"],
      gaps: ["No automation offering to sell alongside seats", "Small client teams cannot individually procure or govern AI tooling", "Extended-hours coverage requires additional seats clients cannot fund", "No aggregated platform relationship across the client base"],
    },
    risks: [
      "Channel conflict with parent Probe Group's own platform strategy must be resolved before commercial engagement.",
      "In a staffing model the client directs the work and owns the systems, so automation requires per-client consent and integration into their own tooling.",
      "Philippine data-protection law plus client-country regimes apply to each small client's customer data separately.",
    ],
    economics: { volumeMonthly: 300000, costPerInteraction: 1.1, automationRate: 0.5, basis: "Seller assumptions: aggregated contact volume across MicroSourcing-hosted client support teams at Philippine delivery cost — validate the number of support-function seats and their contact volumes in discovery." },
    pilotScope:
      "Offer a white-label automation add-on to ten Australian SME clients with offshore support teams, configured per client, measured on contacts automated and revenue per client seat.",
    expansion: ["Extend the add-on across the ANZ and UK client base as a standard offering", "Add continuous after-hours coverage as a packaged capability", "Deploy internally across recruitment and onboarding operations"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Client Solutions", "Head of Recruitment Operations", "Probe Group technology strategy lead"],
    discovery: [
      "How many of your hosted client teams perform customer-support functions, and what is the average team size?",
      "How is automation positioned today when a client asks whether AI can reduce their offshore headcount?",
      "How would revenue be structured for an automation add-on within a staffing contract?",
      "How does Probe Group's platform strategy govern what MicroSourcing may offer independently?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A five-seat Australian client team hosted in Manila adds an automation tier and covers evenings and weekends without hiring a sixth person.",
  },

  "cloudstaff": {
    operatingContext:
      "Cloudstaff is a Clark-based offshore-staffing firm serving primarily Australian small and mid-sized businesses with dedicated remote teams spanning customer support, administration, accounting, marketing and technical roles, positioning itself as a technology-forward employer with strong workplace and retention credentials. Its clients are typically businesses of ten to a few hundred people that could never establish an offshore operation themselves, and its economics are staffing margins on hosted seats plus the employer-of-record infrastructure that makes the model work. Like all staffing-model providers it hosts a very long tail of small support operations, each running the client's own systems and each handling a stream of routine, repetitive contact. Its explicitly tech-forward positioning makes it a more natural early adopter than most of its peers, but the buying decision still ultimately sits with each individual client.",
    strategicPressure: [
      { text: "Australian SME clients are increasingly aware of AI tooling and may reduce offshore headcount directly rather than through their staffing provider.", kind: "inference" },
      { text: "Cloudstaff markets itself on technology and workplace innovation, which makes an automation offering consistent with its positioning rather than a contradiction of it.", kind: "verified" },
      { text: "Philippine labour cost inflation narrows the savings that justify offshore staffing for the smallest clients.", kind: "verified" },
      { text: "A white-label automation offering would move Cloudstaff up the value chain from seats to outcomes with the same client base.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Cloudstaff provides employment infrastructure and workplace technology, not customer-facing conversational products. Its clients bring their own systems and its margins are staffing margins. A partner platform offered white-label across the client base fits the model exactly.",
    whyNotBuild:
      "The client base is a long tail of small businesses with heterogeneous systems and no appetite to fund technology development. Cloudstaff's advantage is aggregation and packaging, not engineering.",
    workflows: [
      {
        name: "White-label support automation for SME client teams",
        friction: "A client's small offshore support team answers the same account, billing and product questions repeatedly, and neither the client nor Cloudstaff has an alternative to adding seats.",
        outcome: "An automation tier packaged with the team, configured against the client's own helpdesk, letting the same team handle materially more volume and raising Cloudstaff's revenue per client.",
        channels: ["Chat", "Email", "Voice"],
        systems: ["Client helpdesk and CRM", "Knowledge base", "Client billing or order systems"],
        value: 3, complexity: 2,
      },
      {
        name: "Extended-hours and overflow coverage",
        friction: "Australian SME clients want coverage across their full business day and into evenings, but a two-person team cannot cover it and a third seat is unaffordable.",
        outcome: "Continuous coverage without additional seats, with overflow absorbed instantly during promotions or incidents, delivering a service level small clients could not otherwise buy.",
        channels: ["Chat", "Email", "Voice", "SMS"],
        systems: ["Client helpdesk", "Routing and telephony", "Escalation rules"],
        value: 3, complexity: 1,
      },
      {
        name: "Internal recruitment and employee support",
        friction: "Cloudstaff recruits continuously in the Clark labour market and supports a distributed workforce, with screening, scheduling and employee queries handled by internal teams.",
        outcome: "Candidate engagement and employee support handled conversationally, cutting internal cost per hire and improving the responsiveness its employer-brand positioning depends on.",
        channels: ["WhatsApp", "Chat", "SMS"],
        systems: ["Applicant tracking system", "HR information system", "Interview scheduling"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Clark-based facilities hosting dedicated client teams", "Employer-of-record and workplace infrastructure for offshore staffing", "Technology-forward internal tooling and workplace systems", "Account management across a long tail of Australian SME clients"],
      gaps: ["No automation product to offer alongside hosted seats", "Small teams cannot deliver extended-hours coverage economically", "Client systems are heterogeneous with no standard integration pattern", "Revenue remains tied to seat count rather than outcomes"],
    },
    risks: [
      "Each client owns its own systems and directs the work, so automation requires individual consent and integration effort that must be templated to be viable.",
      "Australian client customer data processed in the Philippines requires disclosure and appropriate handling under the Australian Privacy Principles.",
      "A long tail of small clients means per-client configuration cost must be very low or the model does not clear.",
    ],
    economics: { volumeMonthly: 150000, costPerInteraction: 1.1, automationRate: 0.5, basis: "Seller assumptions: aggregated contact volume across Cloudstaff-hosted client support teams at Philippine delivery cost — validate the number of support-function seats and per-client volumes in discovery." },
    pilotScope:
      "Package a white-label automation tier for five Australian SME clients with hosted support teams on a common helpdesk platform, measured on contacts automated and configuration hours per client.",
    expansion: ["Extend to the wider Australian SME client base with templated integrations", "Add extended-hours and overflow coverage as a standard package", "Deploy internally across recruitment and employee support"],
    stakeholders: ["Chief Executive Officer", "Chief Technology Officer", "Head of Client Services", "Head of Recruitment", "Head of Operations, Clark"],
    discovery: [
      "How many of your hosted teams perform customer support, and which helpdesk platforms do they most commonly use?",
      "What would per-client configuration need to cost for an automation add-on to be viable across your tail?",
      "How do clients react today when they ask whether AI could replace part of their offshore team?",
      "What extended-hours coverage do clients ask for and decline on cost?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A two-person Australian client team in Clark adds an automation tier and covers the full Australian business day plus evenings without a third hire.",
  },

  "supportninja": {
    operatingContext:
      "SupportNinja is a Philippine-delivery outsourcer specialising in customer support for software-as-a-service startups and scale-ups, a client base that is unusually young, unusually technical and unusually cost-conscious. Those clients buy support the way they buy infrastructure: they measure cost per ticket, expect elastic scaling with product growth, and are themselves shipping AI features into their own products. That makes SupportNinja's market both the most receptive to automated support and the most likely to insource it, since a SaaS company with an engineering team can wire up its own support automation in a quarter if its outsourcer does not offer something better. SupportNinja markets an AI-plus-human delivery model, but the AI layer is sourced rather than owned, which means its competitive position depends entirely on the quality of the platform it partners with.",
    strategicPressure: [
      { text: "SaaS clients are AI-native buyers who measure cost per ticket obsessively and can insource support automation with their own engineering teams.", kind: "verified" },
      { text: "Startup and scale-up clients grow and shrink support volume unpredictably, so elastic capacity is worth more to them than a fixed offshore team.", kind: "inference" },
      { text: "SupportNinja's AI-plus-human positioning is only credible if the underlying platform is genuinely capable, making platform choice a competitive rather than operational decision.", kind: "inference" },
      { text: "Client churn in the startup segment is high, so per-client onboarding cost for any automation must be very low.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "SupportNinja is a delivery organisation serving a technical client base that would immediately see through a weak in-house stack. It has no platform engineering capability and no capital for one; partnering with a credible platform is the only way its AI-plus-human positioning survives contact with a SaaS buyer.",
    whyNotBuild:
      "Its clients build software for a living and would evaluate any SupportNinja-built AI on engineering merits it could not win. The defensible position is operating a strong third-party platform expertly on top of deep product knowledge of each client's software.",
    workflows: [
      {
        name: "SaaS tier-one support automation",
        friction: "Product how-to, account, billing and basic troubleshooting tickets dominate SaaS support queues and are handled by agents at a cost per ticket the client benchmarks against automation every quarter.",
        outcome: "Tier-one tickets resolved conversationally with answers grounded in the client's documentation and account data, agents concentrated on technical escalations, and cost per ticket cut visibly.",
        channels: ["Chat", "Email", "In-product messaging"],
        systems: ["Client helpdesk", "Product documentation and knowledge base", "Account and subscription systems"],
        value: 3, complexity: 2,
      },
      {
        name: "Elastic scaling through client growth and launches",
        friction: "A client's product launch or growth spurt multiplies ticket volume with little notice, forcing SupportNinja into rushed hiring and training that degrades quality during the ramp.",
        outcome: "Volume spikes absorbed by automated capacity immediately, with human hiring following sustained complexity rather than transient volume.",
        channels: ["Chat", "Email", "In-product messaging"],
        systems: ["Client helpdesk", "Knowledge base", "Workforce management"],
        value: 3, complexity: 1,
      },
      {
        name: "Onboarding and activation support for client customers",
        friction: "SaaS clients lose customers during onboarding when questions go unanswered, but dedicating agents to proactive activation support is rarely affordable at startup budgets.",
        outcome: "Proactive onboarding guidance and activation nudges delivered conversationally, improving the client's activation metrics and moving SupportNinja from cost centre to growth contributor.",
        channels: ["In-product messaging", "Email", "Chat"],
        systems: ["Client product analytics", "Account and subscription systems", "Documentation"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Philippine delivery centres supporting SaaS startups and scale-ups", "AI-plus-human delivery positioning built on partner tooling", "Product-specific agent training and knowledge management for client software", "Flexible contracting suited to fast-growing clients"],
      gaps: ["No owned conversational platform underpinning the AI positioning", "Volume spikes handled by hiring rather than elastic capacity", "Proactive onboarding support unaffordable at current cost structures", "Automation configuration is per client with no reusable pattern"],
    },
    risks: [
      "SaaS clients frequently mandate their own tooling and data-processing terms, and some will insource automation regardless.",
      "Client product documentation changes constantly, so grounding must be continuously refreshed or answers decay quickly.",
      "High client churn in the startup segment means per-client onboarding cost must be minimal for the economics to work.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 1.3, automationRate: 0.6, basis: "Seller assumptions: aggregate ticket volume across SupportNinja SaaS client programmes at Philippine delivery cost — validate per-client ticket volumes and pricing structures in discovery." },
    pilotScope:
      "Deploy tier-one automation for three SaaS clients grounded in their own documentation and account systems, measured on containment, cost per ticket and configuration hours per client.",
    expansion: ["Extend across the SaaS client base with a templated onboarding pattern", "Add elastic capacity as a contracted commitment for client launches", "Add proactive onboarding and activation support as a premium offering"],
    stakeholders: ["Chief Executive Officer", "Chief Operating Officer", "Head of Client Solutions", "Head of Delivery, Philippines", "Head of Technology / AI partnerships"],
    discovery: [
      "What share of client tickets are tier-one how-to and account questions?",
      "Which clients have told you they are considering insourcing support automation?",
      "What is your current AI tooling partnership, and does it carry exclusivity terms?",
      "How quickly would you need to onboard a new client onto the platform for the economics to work?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A SaaS client's product launch triples ticket volume overnight; automation absorbs the tier-one surge while SupportNinja's agents handle only technical escalations.",
  },

  "punjab-and-sind-bank": {
    operatingContext:
      "Punjab & Sind Bank is one of India's smaller public-sector banks, with a branch network concentrated in Punjab, Haryana, Delhi and the wider north, serving farmers, small traders, salaried government employees, pensioners and beneficiaries of central and state welfare schemes. Its customer base skews older and rural-to-semi-urban, which means the branch counter and the telephone remain the primary service channels regardless of what the mobile app can technically do. As a public-sector bank it is also an execution agent for government programmes — pension disbursement, subsidy credits, Jan Dhan accounts, insurance and credit schemes — each of which generates predictable waves of citizen questions whenever a payment cycle or scheme deadline arrives. Technology procurement runs through formal public tender, and the bank's own technology bench is small relative to the large public-sector banks.",
    strategicPressure: [
      { text: "As a public-sector bank it carries universal-service and financial-inclusion obligations, so it must serve customers who cannot or will not use digital channels.", kind: "verified" },
      { text: "Government scheme and pension credit cycles create predictable, concentrated surges of branch and phone enquiries that a small operation cannot absorb.", kind: "verified" },
      { text: "A Punjabi- and Hindi-speaking base means English-language digital channels systematically fail a large share of customers, pushing load back to branches.", kind: "inference" },
      { text: "A thin technology bench and tender-led procurement mean any capability arrives as a packaged, vendor-delivered platform with defined deliverables.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Public-sector banks of this size procure core and channel technology through tender from established vendors and system integrators. There is no in-house engineering organisation capable of building conversational infrastructure, and procurement rules would not permit an informal internal build anyway.",
    whyNotBuild:
      "Punjabi and Hindi voice quality suitable for elderly rural callers, integration to a core banking system through a tender-governed change process, and audit-grade logging for a regulated public-sector bank is a platform requirement. The bank's IT budget is committed to core banking, cyber and regulatory compliance.",
    workflows: [
      {
        name: "Pension and scheme-credit enquiry servicing",
        friction: "When pension or subsidy credits land, branches fill with customers asking whether the money has arrived, why it is short, or when the next credit is due, and the phone line is unusable for days.",
        outcome: "Balance, credit-status and scheme-eligibility questions answered instantly in Punjabi and Hindi by phone, removing the queue from the branch counter entirely for those enquiry types.",
        channels: ["Voice", "IVR", "SMS"],
        systems: ["Core banking system", "Government scheme disbursement records", "Customer master"],
        value: 3, complexity: 2,
      },
      {
        name: "Account servicing and branch-visit reduction",
        friction: "Routine requests — statement, cheque status, KYC-update reminders, card blocking — all require either a branch visit or a call to a small contact operation with limited hours.",
        outcome: "Routine servicing handled conversationally in the customer's language with identity verified through registered channel plus OTP, and only genuinely branch-bound tasks referred onward.",
        channels: ["Voice", "IVR", "SMS"],
        systems: ["Core banking system", "Card management", "KYC records"],
        value: 3, complexity: 2,
      },
      {
        name: "Loan and scheme application status communication",
        friction: "Applicants for agricultural, MSME and government-linked credit schemes have no way to check progress except by visiting the branch that took the application.",
        outcome: "Proactive status updates as an application moves through sanction stages, with document requirements explained in-language and chased before they stall the file.",
        channels: ["Voice", "SMS", "WhatsApp"],
        systems: ["Loan origination system", "Scheme eligibility records", "Document management"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["A branch network concentrated in north India with counter-based servicing", "A telephone banking and enquiry line with limited hours", "Internet and mobile banking channels for digitally active customers", "ATM and cash-recycler network for routine transactions"],
      gaps: ["No language-appropriate service channel outside branch hours", "Scheme and pension credit questions require a branch visit or a queue", "No proactive communication on loan or scheme application progress", "No measurement of what customers actually come to branches to ask"],
    },
    risks: [
      "RBI rules on customer authentication, grievance redressal and record-keeping apply fully; identity verification and escalation paths must be auditable.",
      "Government scheme eligibility statements carry accountability weight and must be grounded in the scheme rules, never inferred or approximated.",
      "Public-sector procurement requires competitive tender, defined deliverables and often on-premises or sovereign hosting arrangements.",
    ],
    economics: { volumeMonthly: 900000, costPerInteraction: 0.6, automationRate: 0.5, basis: "Seller assumptions: combined phone and branch-substitutable enquiry volume across the branch network at Indian public-sector servicing cost — validate call-centre volumes and branch enquiry counts in discovery." },
    pilotScope:
      "Deploy a Punjabi and Hindi voice servicing line for balance, pension-credit and scheme-status enquiries across the Punjab branch cluster, integrated to core banking with RBI-compliant authentication.",
    expansion: ["Extend to all branches with full account-servicing coverage", "Add loan and scheme application status communication with document chase", "Add proactive outreach for KYC updates and dormant-account reactivation"],
    stakeholders: ["Executive Director (Retail / Operations)", "General Manager, Information Technology", "General Manager, Financial Inclusion and Government Business", "Chief Information Security Officer", "General Manager, Customer Service and Grievance Redressal"],
    discovery: [
      "What happens to branch footfall in the week after a pension or subsidy credit cycle?",
      "What are the operating hours and staffing of your telephone banking channel today?",
      "Which enquiry types account for the largest share of branch counter time?",
      "What is the tender route and timeline for a customer-servicing technology procurement this fiscal year?",
    ],
    flowTemplate: "inbound-service",
    scenario: "The day after pension credits land, a customer calls in Punjabi to confirm the amount and why it differs from last month, and never has to visit the branch.",
  },

  "pvcombank": {
    operatingContext:
      "PVcomBank is a mid-size Vietnamese commercial bank competing for retail deposits, consumer lending and card business against far better-resourced digital-first rivals such as Techcombank, VPBank and MB. Without their engineering depth or marketing budget, it competes on relationship, branch presence and service responsiveness, which puts a disproportionate weight on how well it handles the everyday conversations of retail banking: EMI reminders on consumer loans, card servicing and disputes, account questions and branch appointment coordination. Its customers are Vietnamese-speaking, increasingly mobile-first for transactions but still phone-first when something is wrong or when money is involved. Its consumer-lending book, like every Vietnamese lender's, makes collections economics a decisive factor in profitability, and State Bank of Vietnam conduct expectations increasingly govern how borrowers may be contacted.",
    strategicPressure: [
      { text: "Vietnamese consumer lending has been through a credit-quality cycle that put collections cost and conduct under sharp regulatory and management scrutiny.", kind: "verified" },
      { text: "Competing against digitally sophisticated Vietnamese banks without comparable engineering means PVcomBank must buy service capability rather than develop it.", kind: "inference" },
      { text: "State Bank of Vietnam expectations on debt-collection conduct make fully logged, policy-bounded outreach a compliance improvement over agent-dependent calling.", kind: "verified" },
      { text: "Card servicing and dispute handling are phone-heavy and generate repeat contact that a small contact centre cannot absorb at peaks.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "PVcomBank's technology function operates core banking, cards and digital channels supplied by vendors. It has no conversational-AI capability, and a mid-size bank competing on cost has no route to funding one.",
    whyNotBuild:
      "Vietnamese voice quality, telephony at retail scale, integration to core banking and card systems, and SBV-grade recording and retention is a platform. The bank's technology budget is committed to digital channel parity with larger rivals.",
    workflows: [
      {
        name: "Consumer-loan EMI reminders and early-bucket collections",
        friction: "Reminder calls are made by a small tele-collections team on a dialler; most of the book is never reached before a payment is missed, and what collectors say varies person to person.",
        outcome: "Every borrower contacted before the due date and again in early buckets, in Vietnamese, with policy-bounded arrangements and payment links in-channel and hardship cases escalated to trained staff.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management system", "Payment gateway", "Recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Card servicing and dispute intake",
        friction: "Card blocking, limit questions, statement queries and transaction disputes arrive by phone at all hours, and out-of-hours coverage is minimal.",
        outcome: "Card servicing handled around the clock with authenticated identity, disputes captured in structured form with evidence requirements explained, and fraud escalated immediately.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Card management system", "Dispute workflow", "Fraud monitoring"],
        value: 3, complexity: 2,
      },
      {
        name: "Branch appointment and product enquiry coordination",
        friction: "Customers call branches directly for product information and to arrange visits, tying up branch staff and producing inconsistent product explanations.",
        outcome: "Product questions answered from governed sources and branch appointments booked into real availability, freeing branch staff for advisory conversations.",
        channels: ["Voice", "Zalo", "Web"],
        systems: ["Branch appointment scheduling", "Product and pricing catalogue", "Customer master"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A branch network across Vietnamese cities with counter servicing", "Mobile and internet banking channels for retail customers", "A contact centre handling card and account enquiries in business hours", "A tele-collections team working consumer-loan arrears"],
      gaps: ["Collections coverage limited to what the dialler and team can reach", "No out-of-hours card or account servicing", "No consistent, evidenced conduct record across collections conversations", "Branch staff absorb product enquiries that should be handled centrally"],
    },
    risks: [
      "State Bank of Vietnam conduct expectations on debt collection govern contact timing, frequency and language; automated outreach must enforce and evidence these.",
      "Vietnam's personal data protection decree governs customer data handling and cross-border processing, which may require in-country deployment.",
      "Card and payment conversations require strong authentication and fraud-escalation paths that must be tested before production.",
    ],
    economics: { volumeMonthly: 400000, costPerInteraction: 1.0, automationRate: 0.55, basis: "Seller assumptions: retail servicing and collections contact volume for a mid-size Vietnamese bank at local assisted-contact cost — validate contact-centre and tele-collections volumes in discovery." },
    pilotScope:
      "Deploy Vietnamese voice and Zalo pre-due and early-bucket collections outreach for the consumer-loan book, with full recording, policy-bounded arrangements and hardship escalation.",
    expansion: ["Add card servicing and dispute intake with round-the-clock coverage", "Extend to account servicing and product enquiry handling", "Add branch appointment coordination across the network"],
    stakeholders: ["Head of Retail Banking", "Head of Collections and Recovery", "Chief Information Officer", "Head of Contact Centre Operations", "Chief Compliance Officer"],
    discovery: [
      "What share of the consumer-loan book does your tele-collections team actually reach before the due date?",
      "How is collections conduct evidenced today under SBV expectations?",
      "What happens to card servicing calls received outside contact-centre hours?",
      "Does customer data need to remain in Vietnam under your current regulatory interpretation?",
    ],
    flowTemplate: "collections",
    scenario: "Three days before an EMI falls due the agent calls a borrower in Vietnamese, confirms the amount and sends a payment link on Zalo before any arrears arise.",
  },

  "vietravel": {
    operatingContext:
      "Vietravel is Vietnam's largest tour operator, selling packaged domestic and outbound tours through a network of branch offices, tele-sales teams and agents, with an affiliated airline that ties its fortunes even more tightly to travel operations. Its business is intensely calendar-driven: Tet, summer school holidays and public holiday clusters concentrate booking demand, departure logistics and customer questions into a handful of weeks, after which volumes fall away. A single tour booking generates a long tail of conversations — deposit and balance payments, visa documentation, passport validity, rooming and dietary requests, pre-departure briefings, meeting points, and then changes and cancellations when plans shift. All of that is currently carried by branch consultants and tele-sales staff in Vietnamese, with the same questions asked thousands of times per departure season.",
    strategicPressure: [
      { text: "Tour demand concentrates violently around Tet and summer holidays, so a fixed consultant team is either idle or overwhelmed for most of the year.", kind: "verified" },
      { text: "Outbound tours require visa and documentation chase-ups where a single missing document can prevent a departure, making proactive follow-up commercially critical.", kind: "verified" },
      { text: "Packaged-tour margins are thin and price-competitive, so consultant time spent on logistics questions is margin lost rather than value added.", kind: "inference" },
      { text: "Group departures create synchronised communication needs — meeting points, delays, changes — that phone trees handle badly.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Vietravel is a travel retailer with booking and reservation systems supplied by vendors. It has no conversational engineering capability and no scale over which to amortise one; its capital goes into tour products, airline operations and retail presence.",
    whyNotBuild:
      "Seasonal peaks are exactly the case where owning fixed platform capability makes least sense and consuming elastic capacity makes most. Building Vietnamese voice, messaging and booking integration for a tour operator's peak weeks would be an extraordinary misallocation.",
    workflows: [
      {
        name: "Peak-season booking enquiry and tour-selection support",
        friction: "In the weeks before Tet, branch and tele-sales lines are saturated; customers comparing operators call, cannot get through, and book with whoever answers.",
        outcome: "Every enquiry answered instantly in Vietnamese with grounded tour, price and availability information, deposits taken in-channel and consultants engaged only for complex or high-value itineraries.",
        channels: ["Voice", "Zalo", "Web chat"],
        systems: ["Tour reservation system", "Pricing and availability", "Payment gateway"],
        value: 3, complexity: 2,
      },
      {
        name: "Visa and documentation chase before departure",
        friction: "Outbound tour participants must submit passports, photographs, financial evidence and visa forms by hard deadlines; chasing them is manual and a single missed document can cost a seat.",
        outcome: "Every traveller chased proactively against a per-destination checklist with format validation in-channel, cutting last-minute scrambles and failed departures.",
        channels: ["Zalo", "Voice", "SMS"],
        systems: ["Booking records", "Visa document checklist by destination", "Document management"],
        value: 3, complexity: 2,
      },
      {
        name: "Pre-departure briefing and disruption notification",
        friction: "Meeting points, timing changes, flight delays and itinerary adjustments are communicated by tour leaders phoning travellers one at a time, often the night before.",
        outcome: "Synchronised pre-departure information and instant change notification to every traveller on a departure, with confirmations captured and exceptions escalated to the tour leader.",
        channels: ["Zalo", "SMS", "Voice"],
        systems: ["Departure manifests", "Itinerary and supplier feeds", "Tour leader escalation"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A branch network and tele-sales operation selling packaged tours", "Online tour catalogue and booking channels", "Zalo and social channels for customer communication", "Tour leaders managing on-the-ground group communication"],
      gaps: ["No capacity to answer peak-season enquiries without queueing", "Visa and document chase is manual and consultant-dependent", "Pre-departure and change notification is one-to-one by phone", "No structured capture of why an enquiry did not convert"],
    },
    risks: [
      "Statements about visa requirements and approval likelihood carry consequences for travellers; the agent must convey documented requirements only and never predict outcomes.",
      "Vietnam's personal data protection decree governs handling of passport and identity documents collected in-channel.",
      "Tour pricing and availability change frequently with supplier terms, so grounding must be live or quoted information will be wrong.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 0.9, automationRate: 0.55, basis: "Seller assumptions: booking, documentation and departure-related contact volume across peak and off-peak months at Vietnamese assisted-contact cost — validate peak-week multiples in discovery." },
    pilotScope:
      "Deploy Vietnamese Zalo and voice visa and documentation chase for outbound tour departures across one peak season, with per-destination checklists and format validation.",
    expansion: ["Add peak-season booking enquiry handling and deposit capture", "Add pre-departure briefing and change notification across departures", "Extend to post-tour feedback capture and repeat-booking outreach"],
    stakeholders: ["Deputy General Director, Tour Operations", "Head of Outbound Tours", "Head of Tele-sales and Branch Network", "Head of Information Technology", "Head of Customer Service"],
    discovery: [
      "How much does enquiry volume rise in the four weeks before Tet compared with a normal month?",
      "How many departures each season are affected by incomplete traveller documentation?",
      "How are itinerary changes communicated to a departing group today?",
      "What share of peak-season enquiries go unanswered, and is that measured?",
    ],
    flowTemplate: "travel-disruption",
    scenario: "Two weeks before a Korea tour departure the agent chases three travellers on Zalo for missing visa documents and validates the uploads before the deadline.",
  },

  "krungsri-auto": {
    operatingContext:
      "Krungsri Auto is the vehicle-finance arm of Bank of Ayudhya, part of the MUFG group, and one of Thailand's largest auto lenders, financing new and used cars, motorcycles and providing car-for-cash products through a dealer network spanning the country. Its portfolio is hundreds of thousands of hire-purchase contracts held mostly by mass-market Thai borrowers, which makes its economics a function of collections efficiency: an auto lender's profitability lives or dies on early-bucket cure rates and on the cost of achieving them. Around collections sit adjacent recurring conversations — insurance renewal cross-sell, end-of-term settlement and trade-in, ownership transfer paperwork, and dealer-side queries about approvals and disbursements. Bank of Thailand's responsible-lending and debt-collection rules have tightened materially in recent years, which changes collections from a purely commercial exercise into a documented conduct obligation.",
    strategicPressure: [
      { text: "Bank of Thailand responsible-lending and debt-collection rules impose documented obligations on how and how often borrowers may be contacted, making evidenced, policy-bounded outreach a compliance requirement.", kind: "verified" },
      { text: "Thai household debt levels and auto-loan credit quality have been under sustained pressure, putting early-bucket cure rates at the centre of management attention.", kind: "verified" },
      { text: "MUFG and Krungsri group technology standards will govern vendor selection and data handling, which lengthens but also legitimises the procurement path.", kind: "inference" },
      { text: "Insurance renewal and end-of-term conversations are high-value cross-sell moments currently handled, if at all, by the same stretched collections capacity.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Krungsri Auto operates within a bank group whose technology function integrates vendor platforms under group standards. It has no conversational engineering capability, and group governance makes an evaluated third-party platform far more procurable than an internal build.",
    whyNotBuild:
      "Thai-language voice at portfolio scale, telephony, integration to hire-purchase systems, and Bank of Thailand-grade recording, retention and conduct enforcement is a platform. A lending business inside a bank group will procure that, not develop it.",
    workflows: [
      {
        name: "Hire-purchase payment reminders and early-bucket collections",
        friction: "The dialler and collections floor can reach only part of the portfolio within permitted hours, and what is said varies by collector, creating both cure-rate loss and conduct exposure.",
        outcome: "Every account contacted within permitted windows in Thai with identical policy-bounded language, arrangements captured with payment links in-channel, and hardship cases escalated to trained staff with full transcript.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Hire-purchase loan management system", "Payment gateway", "Recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Insurance renewal and add-on cross-sell",
        friction: "Motor insurance renewal is a predictable annual moment with high attach value, but outbound capacity is consumed by collections so renewals lapse to other providers.",
        outcome: "Timed renewal conversations in Thai with quotes from the approved product set, renewal completed in-channel, and complex or advice-adjacent cases routed to licensed staff.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Insurance product and pricing systems", "Policy renewal records", "Payments"],
        value: 3, complexity: 2,
      },
      {
        name: "End-of-term settlement and ownership transfer coordination",
        friction: "Contract maturity generates settlement-quote requests, ownership transfer paperwork questions and trade-in enquiries handled by branch and service teams inconsistently.",
        outcome: "Settlement quotes, transfer requirements and trade-in options explained consistently in-conversation, with documentation chased proactively and retained-customer opportunities surfaced.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Loan management system", "Registration and transfer workflow", "Dealer and trade-in systems"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["A nationwide dealer network originating hire-purchase contracts", "A collections operation with dialler-based outbound calling", "Customer service channels including LINE and a call centre", "Insurance and add-on product distribution to the borrower base"],
      gaps: ["Contact coverage in early buckets limited by dialler and collector capacity", "Conduct consistency depends on collector training rather than systems", "Insurance renewal outreach loses to collections for capacity", "End-of-term conversations are handled reactively"],
    },
    risks: [
      "Bank of Thailand responsible-lending and debt-collection rules govern contact timing, frequency, disclosure and hardship handling, and compliance must be evidenced per interaction.",
      "Thailand's PDPA governs borrower data handling and messaging consent, with group-level data standards from Krungsri and MUFG layered on top.",
      "Insurance conversations may cross into regulated advice; product statements must be bounded and licensed staff involved where required.",
    ],
    economics: { volumeMonthly: 800000, costPerInteraction: 1.2, automationRate: 0.6, basis: "Seller assumptions: collections, servicing and renewal contact volume across the hire-purchase portfolio at Thai assisted-contact cost — validate portfolio size and current dialler coverage in discovery." },
    pilotScope:
      "Deploy Thai voice and LINE pre-due and early-bucket collections outreach for one product segment of the hire-purchase book, with full recording, policy-bounded arrangements and hardship escalation.",
    expansion: ["Extend across the full hire-purchase portfolio with conduct evidence reporting", "Add motor insurance renewal and add-on cross-sell conversations", "Add end-of-term settlement, transfer and trade-in coordination"],
    stakeholders: ["Head of Krungsri Auto business", "Head of Collections and Recovery", "Chief Information Officer, Krungsri", "Head of Compliance", "Head of Customer Experience"],
    discovery: [
      "What share of the early-bucket portfolio is actually contacted within permitted hours each cycle?",
      "How is Bank of Thailand collections-conduct compliance evidenced today across calls?",
      "What is your motor insurance renewal retention rate, and who makes those outbound calls?",
      "Which vendor standards does Krungsri or MUFG impose on a platform handling borrower conversations?",
    ],
    flowTemplate: "collections",
    scenario: "Two days before an instalment is due the agent calls a Thai borrower, confirms the amount and sends a payment link on LINE, escalating a job-loss disclosure to a hardship specialist.",
  },

  "sbi-shinsei-bank": {
    operatingContext:
      "SBI Shinsei Bank is a mid-size Japanese bank now under SBI Group ownership, combining a retail deposit and banking franchise with consumer-finance operations rooted in the Lake card-loan brand and a structured-finance business. The consumer-finance side is what makes it operationally distinctive: unsecured card loans generate a continuous cycle of drawdown, repayment-date coordination, limit reviews and early-arrears conversations with a mass Japanese customer base, largely by telephone and increasingly through app and web channels. Japanese consumer credit is heavily regulated on disclosure and collection conduct, and the customer relationship is discreet in a way that shapes channel design: many borrowers prefer not to be called at all, and contact-preference handling is a genuine product feature. Meanwhile Japan's labour scarcity makes staffing a call-centre operation of this kind steadily more expensive.",
    strategicPressure: [
      { text: "Japan's structural labour shortage makes call-centre staffing progressively more expensive and harder to sustain, which is the single strongest driver of automation in Japanese financial services.", kind: "verified" },
      { text: "Japanese consumer-credit regulation imposes strict disclosure and collection-conduct requirements, so automated contact must be provably compliant and fully recorded.", kind: "verified" },
      { text: "SBI Group has substantial fintech assets, which raises a genuine question about whether conversational capability would be sourced at group level rather than by the bank.", kind: "inference" },
      { text: "Card-loan customers value discretion, so channel and contact-preference handling is a service differentiator rather than an operational detail.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "SBI Group holds fintech and platform assets, which is why this is partner-led rather than buy-led and why the group boundary must be tested. But the bank itself operates vendor-supplied core, card and channel systems, and keigo-quality Japanese conversational voice is not something the group has publicly built.",
    whyNotBuild:
      "Japanese voice with the politeness register consumer-finance customers expect, telephony at retail scale, integration to card-loan systems, and evidenced conduct compliance is a platform investment. A mid-size bank will procure it, most plausibly with group technology sign-off.",
    workflows: [
      {
        name: "Card-loan repayment coordination and early arrears",
        friction: "Repayment-date reminders and early-arrears contact are made by a staffed team within regulated hours, so coverage is partial and conduct consistency depends on individual operators.",
        outcome: "Every customer contacted within permitted windows in polite Japanese on their preferred channel, with repayment arrangements captured and hardship or distress escalated immediately to trained staff.",
        channels: ["Voice", "SMS", "App"],
        systems: ["Card-loan management system", "Payments", "Recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Retail deposit and account servicing",
        friction: "Routine account questions — balances, transfers, card issues, address changes — arrive by telephone from a customer base that includes many who will not use the app, against a shrinking staffed operation.",
        outcome: "Routine servicing handled conversationally in Japanese at any hour with authenticated identity, and only genuinely complex matters routed to staff.",
        channels: ["Voice", "App", "SMS"],
        systems: ["Core banking system", "Card management", "Customer master"],
        value: 3, complexity: 2,
      },
      {
        name: "Limit review and product enquiry handling",
        friction: "Limit increase requests, product terms questions and new-application enquiries require disclosure-compliant explanations that vary in quality across operators.",
        outcome: "Disclosure-compliant, identical product explanations delivered every time with applications initiated in-channel and credit decisions kept firmly with the bank's systems and staff.",
        channels: ["Voice", "App", "Web chat"],
        systems: ["Loan origination system", "Product and disclosure library", "Credit decisioning"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["Retail banking channels including app, web and telephone banking", "Consumer card-loan servicing operations with regulated contact processes", "Branch and ATM presence for retail customers", "Contact-preference management for consumer-finance customers"],
      gaps: ["No out-of-hours servicing in Japanese for retail or card-loan customers", "Contact coverage for repayment reminders limited by staffed capacity", "Conduct consistency depends on operator training and sampled QA", "No systematic escalation trigger for financial-distress indicators"],
    },
    risks: [
      "Japanese money-lending and consumer-credit regulation imposes disclosure and collection-conduct obligations that must be enforced by the platform and evidenced per interaction.",
      "Financial-distress and over-indebtedness disclosures must escalate immediately to trained human staff, never be handled conversationally.",
      "SBI Group technology governance and Japanese financial-services data handling rules will govern deployment architecture and hosting.",
    ],
    economics: { volumeMonthly: 500000, costPerInteraction: 5.0, automationRate: 0.5, basis: "Seller assumptions: retail and card-loan servicing plus repayment contact volume at Japanese assisted-contact cost — validate contact-centre volumes and outbound coverage in discovery." },
    pilotScope:
      "Deploy Japanese voice repayment-date coordination and early-arrears outreach for the card-loan portfolio within permitted contact windows, with full recording and distress escalation.",
    expansion: ["Extend to retail deposit and account servicing for out-of-hours coverage", "Add limit review and product enquiry handling with disclosure-compliant scripting", "Extend to other SBI Group consumer-finance entities"],
    stakeholders: ["Head of Retail Banking", "Head of Consumer Finance / card-loan business", "Chief Information Officer", "Chief Compliance Officer", "SBI Group technology governance sponsor"],
    discovery: [
      "What share of card-loan customers do you currently reach within permitted contact hours each cycle?",
      "How is collection-conduct compliance evidenced today, and at what QA sample rate?",
      "Where does SBI Group draw the line between group-built and bank-procured customer technology?",
      "What is your current escalation rule when a customer discloses financial distress by phone?",
    ],
    flowTemplate: "collections",
    scenario: "Ahead of a repayment date the agent calls a Lake card-loan customer in polite Japanese, confirms the arrangement, and escalates immediately when she mentions losing her job.",
  },

  "aozora-bank": {
    operatingContext:
      "Aozora Bank is a mid-size Japanese bank combining corporate and specialty lending with a retail franchise built substantially on deposit products marketed to individual savers, many of them elderly, served through a deliberately small branch network. That combination — a nationwide retail deposit base and very few branches — pushes a disproportionate share of retail servicing onto telephone and postal channels, which is exactly where Japan's labour shortage bites hardest. Its retail customers call about interest rates on time deposits, maturity and rollover decisions, address and beneficiary changes, inheritance procedures and card issues, in Japanese, often at length, and often needing patience. Meanwhile the bank's technology and management attention is largely committed to its corporate and real-estate lending business and to the balance-sheet issues that come with it.",
    strategicPressure: [
      { text: "A small branch network combined with a nationwide retail deposit base forces retail servicing onto telephone channels rather than counters.", kind: "verified" },
      { text: "An elderly retail depositor base means voice is the dominant and often only acceptable channel, and calls are longer and require more patience than average.", kind: "verified" },
      { text: "Japan's labour shortage makes staffing a patient, high-quality retail telephone operation progressively more expensive.", kind: "inference" },
      { text: "Management attention and technology budget are concentrated on the corporate and specialty lending business, leaving retail servicing to be solved with bought capability.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Aozora is a mid-size bank running vendor-supplied core banking and channel systems with a lean technology organisation. There is no conversational engineering capability and no strategic reason to create one for a retail servicing function.",
    whyNotBuild:
      "Elderly-friendly Japanese voice — patient, repetitive where needed, keigo-correct — integrated to core banking with audit-grade logging is a platform capability. Building it for a bank of this size, with its technology attention elsewhere, is not a credible proposition.",
    workflows: [
      {
        name: "Time-deposit maturity and rollover servicing",
        friction: "Maturity decisions generate a wave of calls asking about current rates, rollover terms and alternatives; the phone team is stretched and customers who cannot get through simply let deposits roll or withdraw.",
        outcome: "Maturity conversations handled proactively in Japanese with current approved rates and terms explained, rollover instructions captured, and advice-adjacent questions routed to staff.",
        channels: ["Voice", "SMS", "Postal follow-up"],
        systems: ["Core banking deposit system", "Rate and product catalogue", "Customer master"],
        value: 3, complexity: 2,
      },
      {
        name: "Retail account servicing for phone-first customers",
        friction: "Address changes, card reissues, statement requests and general account questions all require a phone call to a limited-hours team, and elderly customers frequently need the same explanation twice.",
        outcome: "Patient, unhurried Japanese servicing available at any hour with identity verified appropriately, and genuinely complex or sensitive matters escalated to staff with context.",
        channels: ["Voice", "SMS"],
        systems: ["Core banking system", "Card management", "Customer master"],
        value: 3, complexity: 2,
      },
      {
        name: "Inheritance and life-event procedure guidance",
        friction: "Bereaved families and customers handling inheritance procedures face document-heavy processes explained over long phone calls, and errors force repeated visits and mailings.",
        outcome: "Procedure requirements explained clearly and documents chased against a checklist, with the emotionally sensitive parts of the conversation always handled by staff.",
        channels: ["Voice", "Postal", "SMS"],
        systems: ["Inheritance procedure workflow", "Document management", "Branch and staff escalation"],
        value: 2, complexity: 3,
      },
    ],
    existing: {
      has: ["A nationwide retail deposit franchise served through a small branch network", "Telephone banking and customer service channels in business hours", "Internet banking for digitally active retail customers", "Postal servicing for document-heavy procedures"],
      gaps: ["No telephone servicing outside business hours for a phone-first customer base", "Maturity and rollover decisions handled reactively when customers call", "Long calls with elderly customers consume disproportionate staff time", "Document-heavy procedures are explained repeatedly with no tracked checklist"],
    },
    risks: [
      "Japanese financial-services regulation on suitability and disclosure means product explanations must be bounded and any advice-adjacent conversation escalated to qualified staff.",
      "Elderly customers may show signs of cognitive difficulty or vulnerability; detection and escalation rules must be explicit and conservative.",
      "Japan's personal information protection law governs customer data handling and identity verification in remote channels.",
    ],
    economics: { volumeMonthly: 200000, costPerInteraction: 5.5, automationRate: 0.45, basis: "Seller assumptions: retail telephone servicing volume for a deposit-led franchise with a small branch network at Japanese assisted-contact cost — validate call-centre volumes and average handle time in discovery." },
    pilotScope:
      "Deploy Japanese voice time-deposit maturity and rollover servicing with proactive outreach ahead of maturity dates, integrated to the deposit system with staff escalation for advice-adjacent questions.",
    expansion: ["Extend to general retail account servicing with out-of-hours coverage", "Add inheritance and life-event procedure guidance with document checklists", "Add vulnerability detection and escalation across all retail conversations"],
    stakeholders: ["Head of Retail Banking", "General Manager, Information Systems", "Head of Customer Service Centre", "Chief Compliance Officer", "Head of Product (deposits)"],
    discovery: [
      "What is the average handle time on a retail deposit call, and how does it differ for customers over seventy?",
      "How many maturity decisions each month are made without any conversation with the bank?",
      "What happens to retail calls received outside customer service hours?",
      "What are your standing rules on detecting and escalating customer vulnerability by phone?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A week before her time deposit matures, an elderly customer is called in polite Japanese, hears the current rollover rates and confirms her instruction without visiting a branch.",
  },

  "taiwan-business-bank": {
    operatingContext:
      "Taiwan Business Bank is a state-linked lender whose statutory mandate is to serve small and medium enterprises, giving it a customer base of hundreds of thousands of small-business owners — manufacturers, traders, shopkeepers, family firms — across Taiwan. That mandate shapes everything: its lending is dominated by SME working-capital and equipment loans, much of it channelled through government credit-guarantee schemes, and its borrowers are proprietors who run their businesses in the day and deal with the bank by phone rather than through a treasury portal. The dominant conversations are therefore loan-application status, guarantee-scheme eligibility and documentation, repayment coordination and account servicing, conducted in Mandarin and frequently in Taiwanese Hokkien with older business owners. Technology procurement runs through state-influenced processes, and the bank has no proprietary AI capability.",
    strategicPressure: [
      { text: "An SME mandate means the bank serves proprietors who deal with it by phone rather than through digital corporate channels, concentrating service load on voice.", kind: "verified" },
      { text: "Government credit-guarantee schemes generate documentation-heavy application processes with eligibility questions that borrowers cannot resolve themselves.", kind: "verified" },
      { text: "Taiwanese Hokkien remains the comfortable language for many older business owners, and it is not served by standard Mandarin-only channels.", kind: "inference" },
      { text: "State linkage and FSC guidance mean any AI in customer service must be governed, auditable and procured through a formal process.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A state-linked SME bank procures technology through formal processes from established vendors and integrators. There is no software product organisation and no institutional appetite for building conversational infrastructure.",
    whyNotBuild:
      "Traditional Chinese and Taiwanese Hokkien voice, integration to loan origination and guarantee-scheme systems, and FSC-compliant logging is a platform. The bank's technology budget goes to core banking, regulatory reporting and cyber.",
    workflows: [
      {
        name: "SME loan application status and document chase",
        friction: "A proprietor who applied for a working-capital loan has no way to check progress except by calling his branch relationship manager, who is out visiting other customers.",
        outcome: "Application status available on demand and pushed proactively at each stage, with outstanding documents chased against a checklist and validated before they stall the file.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Loan origination system", "Document management", "Credit-guarantee scheme interfaces"],
        value: 3, complexity: 3,
      },
      {
        name: "Guarantee-scheme eligibility and application guidance",
        friction: "Government guarantee schemes have detailed eligibility rules that change with policy; branch staff explain them inconsistently and applicants submit ineligible or incomplete files.",
        outcome: "Scheme rules explained accurately from the governed source in Mandarin or Taiwanese Hokkien, eligibility pre-screened conversationally, and only viable applications reaching the credit team.",
        channels: ["Voice", "LINE", "Web"],
        systems: ["Guarantee-scheme rule sets", "Loan origination system", "Customer records"],
        value: 3, complexity: 3,
      },
      {
        name: "Repayment coordination and account servicing",
        friction: "Repayment date questions, balance enquiries and routine account servicing for business accounts arrive by phone throughout the working day and tie up branch staff.",
        outcome: "Routine business-account servicing handled conversationally with authenticated identity, and relationship managers freed for lending conversations that generate revenue.",
        channels: ["Voice", "LINE", "SMS"],
        systems: ["Core banking system", "Loan management", "Business account records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A branch network across Taiwan serving SME customers with relationship managers", "Corporate and personal internet banking channels", "A customer service telephone line in business hours", "Participation in government credit-guarantee lending schemes"],
      gaps: ["No proactive loan application status communication", "Guarantee-scheme eligibility explained inconsistently across branches", "No Taiwanese Hokkien service on any live channel", "Routine servicing consumes relationship-manager time"],
    },
    risks: [
      "Financial Supervisory Commission guidance on AI use in financial services requires governance, explainability and human oversight for customer-facing deployments.",
      "Government guarantee-scheme eligibility statements carry accountability weight and must be grounded in the current scheme rules, never inferred.",
      "Taiwan's Personal Data Protection Act governs customer data handling, and state linkage may impose additional procurement and hosting requirements.",
    ],
    economics: { volumeMonthly: 300000, costPerInteraction: 3.2, automationRate: 0.5, basis: "Seller assumptions: SME servicing, application status and account enquiry volume across the branch network at Taiwanese assisted-contact cost — validate call-centre and branch enquiry volumes in discovery." },
    pilotScope:
      "Deploy Mandarin and Taiwanese Hokkien voice loan application status and document chase for SME working-capital applications, integrated to the loan origination system.",
    expansion: ["Add guarantee-scheme eligibility guidance grounded in current scheme rules", "Extend to repayment coordination and business-account servicing", "Add proactive outreach at renewal and review points across the SME book"],
    stakeholders: ["Executive Vice President, SME Banking", "Chief Information Officer", "Head of Credit Operations", "Head of Customer Service", "Chief Compliance Officer"],
    discovery: [
      "How many calls does a typical SME loan application generate between submission and disbursement?",
      "How many applications are rejected or delayed for incomplete or ineligible documentation?",
      "What proportion of your SME customers prefer to be served in Taiwanese Hokkien?",
      "What does FSC guidance require of a customer-facing AI deployment for a bank of your type?",
    ],
    flowTemplate: "onboarding",
    scenario: "A machine-shop owner asks in Taiwanese Hokkien where his guarantee-backed loan application stands; the agent gives the stage, lists the missing document and validates his upload.",
  },

  "suhyup-bank": {
    operatingContext:
      "Suhyup Bank is the banking arm of Korea's national fisheries cooperative federation, serving fishing households, aquaculture and seafood businesses, and coastal communities alongside a general retail franchise, with a policy-lending role channelling government support to the fisheries sector. Its customer geography is unusual: members are concentrated in ports and coastal villages, often far from a branch, frequently at sea or working hours that do not align with banking hours, and skewed considerably older than the national average. The conversations that matter are policy-loan applications and servicing, subsidy and support-programme questions, deposit and account servicing for members, and the branch-visit coordination that everything else currently requires. Cooperative governance means decisions involve member representatives as well as bank management, and the technology organisation is small.",
    strategicPressure: [
      { text: "A membership base concentrated in coastal and island communities far from branches makes remote servicing a structural necessity rather than a convenience.", kind: "verified" },
      { text: "Policy-lending and government support programmes for the fisheries sector generate documentation-heavy applications with eligibility questions members cannot resolve alone.", kind: "verified" },
      { text: "An older membership working non-standard hours means voice servicing outside banking hours has disproportionate value.", kind: "inference" },
      { text: "Regional dialect handling along the coasts may be a real requirement rather than a nicety for older members.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "A cooperative bank with a small technology organisation and member-representative governance procures packaged capability. There is no engineering function and no plausible route to building conversational infrastructure.",
    whyNotBuild:
      "Korean voice with dialect tolerance, integration to core banking and policy-loan systems, and audit-grade logging for a regulated cooperative bank is a platform. Suhyup's technology attention is on core systems and digital channel parity.",
    workflows: [
      {
        name: "Policy-loan and support-programme servicing",
        friction: "Fisheries policy loans and support programmes have detailed eligibility and documentation rules; members call branches or travel to them to ask questions that a governed source could answer.",
        outcome: "Programme eligibility and documentation explained accurately in Korean from the governed rule set, applications progressed conversationally and documents chased before they stall.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Policy-loan origination system", "Programme rule sets", "Document management"],
        value: 3, complexity: 3,
      },
      {
        name: "Member account servicing and remote coordination",
        friction: "Members in coastal communities must call limited-hours lines or travel to a branch for routine servicing, which for many means losing a working day.",
        outcome: "Routine servicing handled by phone at any hour with appropriate authentication, and branch visits reserved for tasks that genuinely require attendance, booked into real availability.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Core banking system", "Branch appointment scheduling", "Member records"],
        value: 3, complexity: 2,
      },
      {
        name: "Deposit and subsidy credit-cycle communication",
        friction: "Subsidy and support payments arriving in member accounts generate predictable waves of questions about amounts, timing and deductions that saturate branch lines.",
        outcome: "Proactive notification of credits with explanations of amounts and any deductions, suppressing the enquiry wave entirely for members who receive it.",
        channels: ["SMS", "Voice", "KakaoTalk"],
        systems: ["Core banking system", "Subsidy disbursement records", "Member communications consent"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["A branch and cooperative office network serving coastal and fishing communities", "Retail banking channels including mobile and internet banking", "Policy-lending operations for the fisheries sector", "A customer service telephone line in business hours"],
      gaps: ["No servicing available outside banking hours for members working at sea", "Policy-programme eligibility explained inconsistently across offices", "No proactive communication on subsidy and support credits", "Routine servicing still requires travel to a branch for many members"],
    },
    risks: [
      "Korean financial-services regulation and the Financial Supervisory Service govern authentication, record-keeping and complaint handling for remote banking channels.",
      "Policy-programme eligibility statements carry accountability weight and must be grounded in current programme rules approved by the relevant ministry.",
      "Korea's Personal Information Protection Act governs member data handling, and cooperative governance may require member-representative approval for new channels.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 3.0, automationRate: 0.5, basis: "Seller assumptions: member servicing and policy-programme enquiry volume across the branch and cooperative network at Korean assisted-contact cost — validate call and branch enquiry volumes in discovery." },
    pilotScope:
      "Deploy Korean voice policy-loan and support-programme servicing for one coastal region, grounded in the current programme rule sets with document chase and branch-appointment booking.",
    expansion: ["Extend to member account servicing with out-of-hours coverage nationwide", "Add proactive subsidy and support credit-cycle communication", "Add regional dialect tolerance testing across coastal regions"],
    stakeholders: ["Head of Retail Banking", "Head of Policy Finance / fisheries lending", "Head of Information Technology", "Head of Customer Service", "Cooperative governance representative"],
    discovery: [
      "How far do members typically travel to reach a branch, and how many visits are for tasks that could be done remotely?",
      "How many policy-loan applications stall on documentation each cycle?",
      "What happens to member calls received outside business hours?",
      "Do older members in particular regions require dialect handling that standard Korean systems fail on?",
    ],
    flowTemplate: "inbound-service",
    scenario: "A fisherman calls at 5am before heading out to ask about his policy-loan application; the agent gives the stage, lists the missing document and books a branch appointment.",
  },

  "lotte-home-shopping": {
    operatingContext:
      "Lotte Home Shopping is a major Korean television and online home-shopping operator where the broadcast schedule is the demand engine: a product goes on air, and within minutes order calls, questions and app traffic spike, then collapse when the segment ends. That produces a contact pattern unlike almost any other retailer — extreme, predictable concentration into on-air windows, with an older, phone-preferring customer segment who genuinely order by voice rather than through the app. Around the order sit the standard home-shopping tails: delivery date changes, address corrections, returns and exchanges under Korean e-commerce withdrawal rules, and instalment-payment questions. Because airtime is expensive and non-repeatable, an unanswered call during a broadcast is not a deferred sale but a lost one, which makes concurrency at peak the defining operational metric.",
    strategicPressure: [
      { text: "Home-shopping demand is created by broadcast airtime, so an order call that is not answered during the segment is revenue lost rather than deferred.", kind: "verified" },
      { text: "Korean e-commerce consumer-protection rules give buyers strong withdrawal and return rights, making returns handling a high-volume, rule-bound conversation.", kind: "verified" },
      { text: "A significant older customer segment orders by telephone rather than app, so voice capacity directly constrains sales.", kind: "inference" },
      { text: "Broadcast commission structures and margin pressure across Korean home shopping make contact-centre cost a scrutinised line item.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Lotte Home Shopping is a retail and broadcast operator inside a conglomerate whose technology functions run commerce and logistics systems. It has no conversational engineering capability, and the requirement — burst concurrency in Korean voice — is precisely what a platform provides and an internal team cannot.",
    whyNotBuild:
      "The operational requirement is extreme elasticity for short windows. Building fixed capability to serve peaks that last twenty minutes several times a day is exactly backwards; consuming elastic capacity is the correct architecture and the correct commercial model.",
    workflows: [
      {
        name: "Broadcast-window order capture and overflow",
        friction: "When a popular segment airs, order calls exceed the staffed floor within minutes; customers hear a busy tone or abandon the queue and the sale is gone with the airtime.",
        outcome: "Unlimited concurrent Korean order-taking during broadcast windows with product details, pricing and instalment options explained and orders written into the commerce system.",
        channels: ["Voice", "IVR", "KakaoTalk"],
        systems: ["Order management system", "Product and pricing catalogue", "Payments and instalment processing"],
        value: 3, complexity: 2,
      },
      {
        name: "Returns, exchanges and withdrawal-rights servicing",
        friction: "Return requests under Korean withdrawal rules arrive in volume after each delivery wave and are handled by agents applying policy inconsistently, generating disputes.",
        outcome: "Return and exchange eligibility applied identically from the governed rule set, pickups arranged in-conversation, and refund status pushed proactively until settlement.",
        channels: ["Voice", "KakaoTalk", "App"],
        systems: ["Order and returns management", "Logistics and pickup scheduling", "Refund and payments"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery-date and address-change coordination",
        friction: "Customers call to change delivery dates or correct addresses after ordering, and each change requires an agent to work between the order system and the logistics provider.",
        outcome: "Delivery changes executed directly against logistics systems in-conversation, with proactive notification of delivery exceptions before the customer calls.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Order management", "Logistics and 3PL feeds", "Customer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Television broadcast and online home-shopping sales channels", "A contact centre taking telephone orders and servicing customers", "A mobile app and website for ordering and order tracking", "KakaoTalk customer channels for notifications and service"],
      gaps: ["Order-taking capacity is capped by staffed concurrency during broadcast peaks", "Return policy application varies by agent", "Refund status requires the customer to call", "Delivery changes require agent handling between systems"],
    },
    risks: [
      "Korean e-commerce consumer-protection law governs withdrawal rights, disclosure and refund timelines; automated statements carry legal weight.",
      "Product claims made during order conversations must match approved broadcast and catalogue copy, since advertising rules apply to representations made at the point of sale.",
      "Payment and identity data handled in order conversations require PIPA-compliant processing and retention.",
    ],
    economics: { volumeMonthly: 900000, costPerInteraction: 2.8, automationRate: 0.6, basis: "Seller assumptions: order, returns and delivery-change contact volume concentrated in broadcast windows at Korean assisted-contact cost — validate peak concurrency and abandonment rates in discovery." },
    pilotScope:
      "Deploy Korean voice order capture and overflow handling for prime-time broadcast windows on selected product categories, integrated to the order management system and measured on orders captured that would previously have abandoned.",
    expansion: ["Add returns, exchanges and refund-status servicing across the customer base", "Add delivery-date and address-change coordination with proactive exception messaging", "Extend to online and app channels for pre-purchase product questions"],
    stakeholders: ["Head of Home Shopping Business", "Head of Customer Contact Centre", "Chief Information Officer", "Head of Logistics and Fulfilment", "Head of Legal and Consumer Protection"],
    discovery: [
      "What is your peak concurrent call volume during a prime broadcast slot, and what share abandons?",
      "How many orders per month are lost to unanswered calls during on-air windows?",
      "How consistently is the withdrawal and return policy applied across agents today?",
      "What proportion of your orders still come by telephone rather than app?",
    ],
    flowTemplate: "order-logistics",
    scenario: "A prime-time segment sends order calls past the staffed limit; the agent takes every one in Korean, explains instalment options and writes the orders straight into the commerce system.",
  },

  "gs-home-shopping": {
    operatingContext:
      "GS Shop is the home-shopping division of GS Retail, selling through television broadcast, mobile and online channels into the same Korean consumer market as Lotte, CJ and Hyundai, with the same broadcast-driven demand physics: on-air segments create bursts of orders and enquiries that collapse when the segment ends. Sitting inside a retail conglomerate whose centre of gravity is convenience stores and supermarkets, the home-shopping division competes for group technology attention with businesses that have entirely different operational needs. Its own commercial priority has shifted heavily toward mobile commerce, but a meaningful share of orders and a disproportionate share of service contacts still arrive by phone from an older customer base. The practical question is what happens to those calls when they exceed the floor — whether they are deflected into an IVR, queued, or simply lost.",
    strategicPressure: [
      { text: "Broadcast-driven demand concentrates orders and enquiries into short on-air windows that a fixed contact-centre floor cannot match.", kind: "verified" },
      { text: "As part of a convenience-store-led retail group, the home-shopping division competes for technology investment against very different business priorities.", kind: "inference" },
      { text: "Korean home shopping faces structural pressure from mobile commerce and platform retail, making contact-centre cost and order conversion both closely watched.", kind: "verified" },
      { text: "Overflow handling today may rely on IVR deflection that converts poorly, meaning lost orders are invisible in the current reporting.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "GS Retail's technology investment centres on convenience-store operations, logistics and its own commerce platforms. The home-shopping division would not receive funding to build conversational infrastructure, and the elastic-burst requirement is a textbook case for consuming capacity rather than owning it.",
    whyNotBuild:
      "Building for a peak that lasts twenty minutes several times a day means paying for idle capability the rest of the time. A division inside a conglomerate has neither the budget nor the argument for that.",
    workflows: [
      {
        name: "Broadcast overflow order capture",
        friction: "During peak segments calls exceed the staffed floor and are pushed into IVR self-service that older telephone-ordering customers abandon, taking the order with them.",
        outcome: "Every overflow call answered conversationally in Korean with product, price and instalment details explained and the order written directly into the commerce system.",
        channels: ["Voice", "IVR", "KakaoTalk"],
        systems: ["Order management system", "Product and pricing catalogue", "Payments and instalment processing"],
        value: 3, complexity: 2,
      },
      {
        name: "Delivery-change and order-status servicing",
        friction: "Post-order calls about delivery dates, address changes and shipment status arrive continuously and consume the same agents needed for on-air order capture.",
        outcome: "Order status and delivery changes handled conversationally against logistics data at any hour, with proactive exception messaging suppressing the calls entirely.",
        channels: ["Voice", "KakaoTalk", "SMS"],
        systems: ["Order management", "Logistics and 3PL feeds", "Customer records"],
        value: 3, complexity: 2,
      },
      {
        name: "Returns and refund-status handling",
        friction: "Returns under Korean withdrawal rules generate pickup scheduling and refund-timing questions, and customers call repeatedly during the refund window.",
        outcome: "Return eligibility applied consistently, pickups scheduled in-conversation and refund status pushed proactively until settlement, removing repeat contact.",
        channels: ["Voice", "KakaoTalk", "App"],
        systems: ["Returns management", "Logistics pickup scheduling", "Refund and payments"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Television, mobile and online home-shopping sales channels", "A contact centre for order-taking and customer service", "Mobile app and website with order tracking", "KakaoTalk notification and service channels"],
      gaps: ["Overflow calls during broadcast peaks are deflected rather than converted", "No measurement of orders lost to abandoned calls", "Delivery and refund status require the customer to initiate contact", "Order-taking capacity competes with servicing for the same agents"],
    },
    risks: [
      "Korean e-commerce consumer-protection law governs withdrawal rights, disclosure and refund timelines, so automated statements carry legal weight.",
      "Product representations made during order conversations must match approved broadcast and catalogue copy under advertising rules.",
      "PIPA governs handling of payment and identity data captured in order conversations.",
    ],
    economics: { volumeMonthly: 700000, costPerInteraction: 2.8, automationRate: 0.6, basis: "Seller assumptions: order, delivery-change and returns contact volume concentrated in broadcast windows at Korean assisted-contact cost — validate peak concurrency and current IVR deflection outcomes in discovery." },
    pilotScope:
      "Deploy Korean voice overflow order capture for prime broadcast windows, measured on orders converted from calls that would previously have been deflected or abandoned.",
    expansion: ["Add delivery-change and order-status servicing with proactive exception messaging", "Add returns and refund-status handling across the customer base", "Extend to pre-purchase product questions on mobile and KakaoTalk channels"],
    stakeholders: ["Head of GS Shop business", "Head of Customer Contact Centre", "Head of Digital / Commerce Platform", "Head of Logistics and Fulfilment", "GS Retail Chief Information Officer"],
    discovery: [
      "What happens to a call today when the contact centre is at capacity during a broadcast?",
      "Do you measure orders lost to abandoned or deflected calls, and if so how?",
      "What share of orders still arrive by telephone rather than through the app?",
      "How much of your agent capacity goes to post-order servicing rather than order capture?",
    ],
    flowTemplate: "order-logistics",
    scenario: "Overflow calls during a GS Shop broadcast are answered rather than deflected, and the orders that used to abandon in the IVR are captured in Korean and written to the commerce system.",
  },

  "axa-hong-kong": {
    operatingContext:
      "AXA Hong Kong and Macau is one of the territory's larger composite insurers, writing motor, home, travel, medical and employee-benefits general insurance alongside a life and savings book, distributed through tied agents, brokers, bancassurance partners and direct channels. Hong Kong's insurance market is dense, intermediated and service-competitive: policyholders reach the insurer through their agent as often as directly, which means AXA must serve two distinct populations — customers and intermediaries — with different questions and different urgency. The conversations that dominate are claims-related: motor accident first notification, medical claim submission and status, travel claims after a disrupted trip, and the endless status enquiries that follow each. All of this runs trilingually in Cantonese, English and increasingly Mandarin, and global AXA sets technology direction while regional delivery is executed with partners.",
    strategicPressure: [
      { text: "Hong Kong's Insurance Authority sets conduct requirements and complaint-handling expectations that make consistent, evidenced claims communication a regulatory as well as service concern.", kind: "verified" },
      { text: "Claim status enquiries are the dominant inbound contact type in general insurance, and they generate no value while consuming trained claims staff.", kind: "verified" },
      { text: "Serving both policyholders and intermediaries means the same claim generates parallel enquiry streams from two audiences.", kind: "inference" },
      { text: "Group technology direction from AXA globally will shape platform selection, so regional autonomy must be established early.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "AXA globally has significant technology capability and sets direction, but regional claims-servicing automation in Hong Kong is delivered through partners and vendor platforms rather than built locally. The regional entity is an integrator and operator, not a developer.",
    whyNotBuild:
      "Trilingual voice and messaging, integration to claims and policy administration systems, and Insurance Authority-grade record-keeping is a platform requirement. A regional entity within a global group buys or adopts; it does not build conversational infrastructure for a single market.",
    workflows: [
      {
        name: "Motor and travel claims first notification",
        friction: "A policyholder at the roadside or stranded at an airport calls the claims line and queues, then repeats the same details to whoever answers, with photos and documents following by email days later.",
        outcome: "Structured trilingual intake at the moment of loss with photos and documents captured in-channel, coverage verified against the policy, and the claim opened before the caller hangs up.",
        channels: ["Voice", "WhatsApp", "App"],
        systems: ["Claims management system", "Policy administration", "Document and image capture"],
        value: 3, complexity: 3,
      },
      {
        name: "Claim status and document chase",
        friction: "Claimants and their agents call repeatedly for status; each call requires a claims handler to interrogate the file, and outstanding documents are chased by templated email that is frequently ignored.",
        outcome: "Status pushed proactively at every stage change to both policyholder and intermediary, outstanding documents chased conversationally with format validation, and status calls largely eliminated.",
        channels: ["WhatsApp", "Voice", "SMS", "Email"],
        systems: ["Claims management system", "Document management", "Intermediary records"],
        value: 3, complexity: 2,
      },
      {
        name: "Agent and broker servicing",
        friction: "Tied agents and brokers call the same lines as customers for policy details, renewal terms and claim progress on behalf of clients, competing with policyholders for the same capacity.",
        outcome: "A dedicated intermediary channel giving instant authenticated access to policy and claim information, freeing the claims and service teams for genuine decisions.",
        channels: ["Voice", "WhatsApp", "Agent portal chat"],
        systems: ["Policy administration", "Claims system", "Intermediary and commission records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Claims notification and service telephone lines operating trilingually", "A customer app and online portal for policy and claim access", "An intermediary network with agent and broker portals", "Established claims processing and assessment operations"],
      gaps: ["No structured intake at the moment of loss outside staffed hours", "Claim status requires the claimant or agent to call", "Document chase depends on templated email with no validation", "Intermediaries and policyholders compete for the same service capacity"],
    },
    risks: [
      "Hong Kong Insurance Authority conduct rules govern claims communication and complaint handling; statements about coverage and liability must be grounded and auditable.",
      "The agent must never determine coverage or liability; assessment and settlement decisions remain with qualified claims staff.",
      "Hong Kong's Personal Data (Privacy) Ordinance governs claimant data and direct-marketing consent, with additional group data standards from AXA globally.",
    ],
    economics: { volumeMonthly: 250000, costPerInteraction: 4.5, automationRate: 0.5, basis: "Seller assumptions: claims, servicing and intermediary contact volume for a composite Hong Kong insurer at local assisted-contact cost — validate claims volumes and contact-centre staffing in discovery." },
    pilotScope:
      "Deploy trilingual motor and travel claims first-notification intake with proactive status updates, integrated to the claims system with assessment decisions kept human.",
    expansion: ["Add claim document chase with format validation across claim types", "Extend to medical and home claims intake and status", "Add a dedicated intermediary servicing channel for agents and brokers"],
    stakeholders: ["Chief Executive Officer, Hong Kong and Macau", "Chief Claims Officer", "Chief Operations Officer", "Head of Distribution / Agency", "Chief Technology Officer (regional)"],
    discovery: [
      "What share of your inbound claims-line volume is status enquiry rather than new notification?",
      "How much of your claims contact comes from intermediaries rather than policyholders?",
      "What is the average time from a motor incident to a complete claim file today?",
      "How much autonomy does the Hong Kong entity have over claims-servicing platform selection?",
    ],
    flowTemplate: "claims",
    scenario: "A driver calls from the roadside in Cantonese; the agent verifies cover, captures photos on WhatsApp and opens the motor claim before a handler ever picks up the file.",
  },

  "chailease-holding": {
    operatingContext:
      "Chailease Holding is Taiwan's dominant leasing and SME-finance group, financing equipment, vehicles, machinery and working capital for small and mid-sized businesses, with very substantial operations in mainland China and a growing ASEAN footprint across Vietnam, Thailand, Malaysia, the Philippines and Indonesia. Its customers are small-business owners — factory operators, logistics firms, agricultural businesses, retailers — who take equipment leases and instalment finance and are served through a direct sales force and a dealer and vendor channel. That produces three recurring conversation families at large scale: lease-payment reminders and early-stage collections across hundreds of thousands of contracts, contract-renewal and end-of-lease decisions, and dealer or vendor channel support around approvals and disbursements. Operating across Traditional Chinese, Simplified Chinese, Vietnamese, Thai and other markets makes language breadth a genuine operational requirement rather than a preference.",
    strategicPressure: [
      { text: "Operating across Taiwan, mainland China and multiple ASEAN markets means Chailease must serve borrowers in five or more languages, which no single collections operation can staff consistently.", kind: "verified" },
      { text: "SME leasing credit quality is sensitive to regional economic cycles, making early-bucket contact coverage the primary lever on portfolio losses.", kind: "verified" },
      { text: "End-of-lease decisions are high-value moments — renewal, upgrade, buyout — that are currently reactive rather than proactively worked.", kind: "inference" },
      { text: "Dealer and vendor channel partners generate their own enquiry stream about approvals and disbursements that competes with customer servicing.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "Chailease is a finance company whose systems are leasing and credit platforms supplied by vendors and adapted per market. It has no conversational engineering capability, and its multi-market language requirement is precisely what a platform delivers off the shelf and an internal build never could.",
    whyNotBuild:
      "Five or more languages with genuine voice quality, telephony in six countries, integration to per-market leasing systems, and per-jurisdiction collections-conduct compliance is a platform. No leasing company will build it.",
    workflows: [
      {
        name: "Multi-market lease-payment reminders and early collections",
        friction: "Each market runs its own collections team and dialler; coverage varies enormously and language capacity limits which customer segments can be worked at all.",
        outcome: "Every lease contract contacted before and shortly after the due date in the customer's own language within each market's permitted windows, with arrangements captured and hardship escalated locally.",
        channels: ["Voice", "LINE", "Zalo", "WhatsApp", "SMS"],
        systems: ["Leasing and contract management systems", "Payment processing", "Recording and retention per market"],
        value: 3, complexity: 3,
      },
      {
        name: "End-of-lease renewal and upgrade conversations",
        friction: "Contracts approach maturity and the renewal or upgrade conversation happens only if a salesperson has time, so profitable renewals are lost to competitors or simply lapse.",
        outcome: "Timed maturity outreach explaining buyout, renewal and upgrade options from the approved product set, with qualified opportunities handed to the sales force with full context.",
        channels: ["Voice", "LINE", "WhatsApp"],
        systems: ["Contract management", "Product and pricing catalogue", "Sales CRM"],
        value: 3, complexity: 2,
      },
      {
        name: "Dealer and vendor channel support",
        friction: "Equipment dealers and vendors call for application status, approval conditions and disbursement timing, and are queued behind end-customer servicing calls.",
        outcome: "Dealers get instant authenticated answers on application and disbursement status in their own language, reducing channel friction and speeding origination.",
        channels: ["Voice", "LINE", "WhatsApp", "Dealer portal chat"],
        systems: ["Credit origination system", "Disbursement workflow", "Dealer records"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Leasing and SME finance operations across Taiwan, mainland China and ASEAN markets", "Direct sales force plus dealer and vendor origination channels", "Per-market collections teams with dialler-based outbound calling", "Customer service channels including messaging apps in each market"],
      gaps: ["Collections coverage varies widely by market and language capacity", "No proactive end-of-lease renewal conversation at portfolio scale", "Dealer enquiries compete with customer servicing for the same capacity", "No consistent conduct evidence across markets"],
    },
    risks: [
      "Debt-collection conduct rules differ materially across Taiwan, mainland China, Vietnam and Thailand; contact timing, frequency and language must be configured per jurisdiction.",
      "Cross-border data handling across six or more markets requires per-country residency and transfer arrangements, with mainland China requiring particular care.",
      "SME borrowers in financial distress require hardship escalation to local staff who understand each market's restructuring options.",
    ],
    economics: { volumeMonthly: 1200000, costPerInteraction: 1.4, automationRate: 0.55, basis: "Seller assumptions: collections, renewal and dealer contact volume across Taiwan, China and ASEAN portfolios at a blended regional assisted-contact cost — validate per-market portfolio sizes in discovery." },
    pilotScope:
      "Deploy Traditional Chinese voice and LINE pre-due and early-bucket lease-payment outreach for the Taiwan portfolio, with per-market conduct rules, recording and hardship escalation.",
    expansion: ["Extend to Vietnam and Thailand portfolios with local-language coverage and jurisdiction-specific conduct rules", "Add end-of-lease renewal and upgrade outreach across markets", "Add dealer and vendor channel support with authenticated status access"],
    stakeholders: ["Group Chief Operating Officer", "Head of Collections and Credit Management", "Country General Manager (pilot markets)", "Group Chief Information Officer", "Head of Compliance"],
    discovery: [
      "Which markets centralise collections operations today, and which run them locally?",
      "What share of each portfolio is contacted before the due date, by market?",
      "How many end-of-lease contracts mature each month without a renewal conversation?",
      "What are the differing collections-conduct rules you must respect in Taiwan, Vietnam and Thailand?",
    ],
    flowTemplate: "collections",
    scenario: "Ahead of a lease instalment a Taiwanese workshop owner is called in Mandarin, confirms payment on LINE, and the same platform works the Vietnamese portfolio the next morning.",
  },

  "fe-credit": {
    operatingContext:
      "FE Credit is Vietnam's largest consumer-finance company, majority-owned by VPBank with SMBC as a strategic investor, lending small-ticket unsecured personal loans, credit cards and consumer-durable finance to a mass-market Vietnamese customer base largely through point-of-sale and digital origination. Its portfolio is millions of small accounts where individual balances are low, margins are thin and the difference between profit and loss is decided almost entirely by collections efficiency in the first buckets. After a severe credit-quality downturn in the Vietnamese consumer-finance sector, cost per collected dong is the operating metric that matters most to its board and its shareholders. State Bank of Vietnam conduct expectations and public scrutiny of debt-collection practices have simultaneously raised the compliance bar, which makes agent-dependent calling both expensive and risky.",
    strategicPressure: [
      { text: "Vietnamese consumer finance went through a severe credit-quality downturn that made collections cost and recovery efficiency the decisive determinant of profitability.", kind: "verified" },
      { text: "State Bank of Vietnam conduct expectations and public scrutiny of debt-collection practices make fully logged, policy-bounded outreach a compliance necessity rather than an option.", kind: "verified" },
      { text: "Millions of small-ticket accounts mean the cost of a human collections call can exceed the economic value of the contact, so coverage is rationed rather than complete.", kind: "inference" },
      { text: "Parent-bank and SMBC governance will shape vendor approval and data-handling requirements for any collections platform.", kind: "hypothesis" },
    ],
    buildVsBuyWhy:
      "FE Credit is a lending business whose systems are loan-management and origination platforms supplied by vendors. Its parent VPBank has digital capability but that capability is directed at banking channels, not at a consumer-finance collections platform. This is a straightforward procurement with parent sign-off.",
    whyNotBuild:
      "Vietnamese voice at the scale of millions of accounts, telephony capacity for full-portfolio coverage, and SBV-grade recording, retention and conduct enforcement is a platform. Nothing in a consumer-finance company's economics supports building it, and the compliance risk of a home-grown system is unacceptable after the sector's recent scrutiny.",
    workflows: [
      {
        name: "Early-bucket collections with policy-bounded negotiation",
        friction: "The dialler and collections floor can work only a fraction of a multi-million-account portfolio in permitted hours, so most early delinquency is never contacted before it hardens, and what collectors say varies dangerously.",
        outcome: "Full-portfolio coverage within permitted windows in Vietnamese with identical policy-bounded language, arrangements and payment links delivered in-channel, and hardship or distress escalated immediately to trained staff with the transcript.",
        channels: ["Voice", "Zalo", "SMS"],
        systems: ["Loan management system", "Payment gateway", "Recording and retention", "Hardship case management"],
        value: 3, complexity: 3,
      },
      {
        name: "Pre-due reminders and payment enablement",
        friction: "Many customers miss instalments through forgetfulness or payment friction rather than inability to pay, but pre-due outreach is deprioritised because collections capacity is consumed by existing arrears.",
        outcome: "Every customer reminded ahead of the due date with a payment link in-channel, reducing the number of accounts that ever enter delinquency and lowering the cost base of the whole collections operation.",
        channels: ["Zalo", "SMS", "Voice"],
        systems: ["Loan management system", "Payment gateway", "Consent and contact-preference register"],
        value: 3, complexity: 2,
      },
      {
        name: "Card and loan account servicing",
        friction: "Balance, statement, limit and settlement questions arrive by phone at all hours from a mass customer base, and out-of-hours coverage is minimal.",
        outcome: "Routine servicing handled conversationally around the clock with authenticated identity, reducing inbound pressure and improving the customer relationship that collections depends on.",
        channels: ["Voice", "Zalo", "App"],
        systems: ["Card and loan management systems", "Payments", "Customer master"],
        value: 2, complexity: 2,
      },
    ],
    existing: {
      has: ["Point-of-sale and digital origination across Vietnam for small-ticket consumer credit", "A large collections operation with dialler-based outbound calling", "Mobile app and Zalo channels for customer servicing and payments", "Recording and quality functions for collections conversations"],
      gaps: ["Portfolio contact coverage rationed by dialler and collector capacity", "Pre-due reminder outreach deprioritised behind arrears work", "Conduct consistency depends on collector training and sampled QA", "No out-of-hours account servicing for a mass customer base"],
    },
    risks: [
      "State Bank of Vietnam conduct expectations and heightened public scrutiny govern debt-collection contact timing, frequency and language; the platform must enforce and evidence compliance per interaction.",
      "Vietnam's personal data protection decree governs borrower data handling and may require in-country deployment and processing.",
      "Financial-distress and vulnerability disclosures must escalate immediately to trained human collectors, never be negotiated conversationally.",
    ],
    economics: { volumeMonthly: 4000000, costPerInteraction: 0.7, automationRate: 0.6, basis: "Seller assumptions: pre-due, early-bucket and servicing contact volume across a multi-million-account consumer-finance portfolio at Vietnamese assisted-contact cost — validate portfolio size and current dialler coverage in discovery." },
    pilotScope:
      "Deploy Vietnamese voice and Zalo pre-due reminders plus early-bucket collections for one product segment, with full recording, policy-bounded arrangements and hardship escalation, measured on contact coverage and roll-rate against a matched control.",
    expansion: ["Extend to the full early-bucket portfolio across all products with conduct-evidence reporting", "Add card and loan account servicing with round-the-clock coverage", "Add restructuring and settlement conversations under human-approved matrices"],
    stakeholders: ["Chief Executive Officer", "Head of Collections and Recovery", "Chief Risk Officer", "Chief Information Officer", "VPBank / SMBC governance sponsor"],
    discovery: [
      "What share of the early-bucket portfolio is actually contacted within permitted hours each cycle?",
      "How much of your delinquency is behavioural rather than affordability-driven, and is pre-due outreach measured?",
      "How is SBV collections-conduct compliance evidenced today, and at what QA sample rate?",
      "What vendor approval and data-residency requirements do VPBank and SMBC impose?",
    ],
    flowTemplate: "collections",
    scenario: "The entire early-bucket portfolio is contacted in Vietnamese within permitted hours with payment links on Zalo, and a borrower who mentions job loss goes straight to a hardship specialist.",
  },
};
