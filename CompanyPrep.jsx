import { useState } from "react";

// ── Company Data ───────────────────────────────────────
const COMPANIES = [
  {
    id: "tcs",
    name: "TCS",
    fullName: "Tata Consultancy Services",
    icon: "🔵",
    color: "#0052cc",
    bg: "#e8f0fe",
    type: "Service Based",
    difficulty: "easy",
    package: "3.5 - 7 LPA",
    locations: ["Pan India"],
    rounds: ["Aptitude Test (TCS NQT)", "Technical Interview", "HR Interview"],
    techStack: ["Java", "Python", "SQL", "C++", "Data Structures"],
    pattern: `TCS NQT (National Qualifier Test) has 4 sections:
1. Verbal Ability (24 questions, 30 min)
2. Reasoning Ability (30 questions, 50 min)
3. Numerical Ability (26 questions, 40 min)
4. Programming Logic (10 questions, 20 min)

Cutoff: Around 70-75% overall. No negative marking.
Coding section: 1-2 problems, easy to medium level.`,
    tips: [
      "Practice TCS NQT previous papers on PrepInsta",
      "Focus on time management — all sections are timed separately",
      "Verbal section trips most candidates — read 1 article daily",
      "Coding questions are easy — even pseudocode logic helps",
      "HR round is mostly formality — be confident and positive",
      "Know your resume well — they ask about projects in technical round",
    ],
    interviewExperience: `"The technical round was mostly theory — OOP concepts, DBMS basics, OS concepts. They asked me to explain my final year project in detail. HR round was about why TCS, future goals, and relocation. The whole process took about 3 weeks from test to offer letter."
— TCS Digital Trainee, 2024`,
    hiddenTips: [
      "TCS Digital pays better than TCS Ninja — apply for Digital if your NQT score is 80%+",
      "They check CGPA — maintain above 6.0 to be eligible",
      "iON platform is used for NQT — practice on it before the test",
    ],
  },
  {
    id: "infosys",
    name: "Infosys",
    fullName: "Infosys Limited",
    icon: "🟢",
    color: "#007cc2",
    bg: "#e6f3fb",
    type: "Service Based",
    difficulty: "easy",
    package: "3.6 - 8 LPA",
    locations: ["Pan India"],
    rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    techStack: ["Java", "Python", "SQL", "Agile", "SDLC"],
    pattern: `Infosys Instep / Fresher hiring process:
1. Online Test: Aptitude + Logical + Verbal (90 min)
2. Pseudocode / Programming questions (30 min)
3. Technical interview: CS fundamentals, project discussion
4. HR interview: behavioral questions, career goals

Test is conducted on HirePro or Mettl platform.
Difficulty level: Easy to Medium.`,
    tips: [
      "Infosys focuses heavily on aptitude — practice InfyTQ platform",
      "Complete InfyTQ certification — it directly affects your package",
      "Know OOPS, DBMS, OS concepts thoroughly",
      "They love asking about sorting algorithms and time complexity",
      "HR round: prepare STAR method answers",
      "Know Agile methodology basics",
    ],
    interviewExperience: `"The online test was straightforward — mostly aptitude and some coding. Technical interview had questions on OOP, DBMS (normalization, joins), and my project. The interviewer was friendly. HR asked about strengths, weaknesses, and why Infosys. Got offer in 2 weeks."
— Infosys Systems Engineer, 2024`,
    hiddenTips: [
      "InfyTQ certified candidates get Systems Engineer role (better pay) vs Trainee",
      "Infosys SP (Specialist Programmer) hiring is separate — needs coding skills",
      "Background verification is strict — keep all documents ready",
    ],
  },
  {
    id: "wipro",
    name: "Wipro",
    fullName: "Wipro Limited",
    icon: "🟡",
    color: "#9b59b6",
    bg: "#f5eef8",
    type: "Service Based",
    difficulty: "easy",
    package: "3.5 - 6.5 LPA",
    locations: ["Pan India"],
    rounds: ["AMCAT / Cocubes Test", "Technical Interview", "HR Interview"],
    techStack: ["Java", "Python", "C", "SQL", "Testing"],
    pattern: `Wipro Elite / Turbo hiring:
1. Online Aptitude Test (AMCAT platform)
   - Quantitative (18 Q, 16 min)
   - Logical (14 Q, 14 min)
   - Verbal (22 Q, 18 min)
   - Essay Writing (1 topic, 20 min)
2. Wipro Coding Test (2 problems, 60 min)
3. Technical + HR Interview (combined)

Wipro Turbo has higher package but needs better coding skills.`,
    tips: [
      "Essay writing is unique to Wipro — practice writing 200-250 word essays",
      "AMCAT test — focus on speed, not just accuracy",
      "Wipro Turbo requires medium level coding — practice LeetCode easy/medium",
      "Technical interview is mostly CS fundamentals and project discussion",
      "They ask about testing concepts and SDLC phases",
      "Be ready to write simple programs on paper in technical round",
    ],
    interviewExperience: `"AMCAT was time-pressured — the essay caught me off guard. Coding test had 2 easy problems. Technical interview was about Java OOP concepts and my project. The interviewer asked to write a bubble sort program. HR was very casual — just a conversation about goals."
— Wipro Project Engineer, 2024`,
    hiddenTips: [
      "Wipro Elite vs Turbo — Turbo has better pay, apply if you can code",
      "Essay writing scores matter — write structured essays with introduction and conclusion",
      "They sometimes ask puzzles in technical round — practice basic ones",
    ],
  },
  {
    id: "cognizant",
    name: "Cognizant",
    fullName: "Cognizant Technology Solutions",
    icon: "🔷",
    color: "#1a73e8",
    bg: "#e8f0fe",
    type: "Service Based",
    difficulty: "easy",
    package: "4 - 8 LPA",
    locations: ["Pan India"],
    rounds: ["GenC / GenC Elevate Test", "Technical Interview", "HR Interview"],
    techStack: ["Java", "Python", "SQL", "Cloud Basics", "Agile"],
    pattern: `Cognizant GenC (General Cognizant) process:
1. Aptitude Test (eLitmus / Cocubes)
   - Quantitative Aptitude
   - Logical Reasoning
   - Verbal Ability
   - Coding Section (2 problems)
2. Technical Interview
3. HR Interview

GenC Elevate: Higher package, needs better performance in coding.
GenC Next: Cloud/AI focused, requires specific skills.`,
    tips: [
      "GenC vs GenC Elevate — push for Elevate with good coding skills",
      "Cloud basics (AWS/Azure fundamentals) help for GenC Next",
      "Technical round focuses on Java, DBMS, OS and project",
      "They ask real world scenario questions — think practically",
      "Know your project architecture end to end",
      "Be honest about what you know and don't know",
    ],
    interviewExperience: `"The aptitude test was moderate — standard aptitude sections plus 2 coding problems. Technical interview was 45 min — OOP, SQL queries, and my project. They asked me to explain the architecture of my project. HR was simple — career goals and relocation willingness."
— Cognizant Programmer Analyst Trainee, 2024`,
    hiddenTips: [
      "Cognizant has a good training program — GenC Next gets cloud training",
      "Background check takes 2-3 months — keep all education documents ready",
      "They value communication skills highly in HR round",
    ],
  },
  {
    id: "amazon",
    name: "Amazon",
    fullName: "Amazon Development Center",
    icon: "🟠",
    color: "#ff9900",
    bg: "#fff3e0",
    type: "Product Based",
    difficulty: "hard",
    package: "20 - 45 LPA",
    locations: ["Bangalore", "Hyderabad", "Chennai", "Pune"],
    rounds: ["Online Assessment", "Technical Phone Screen", "4-5 Loop Interviews"],
    techStack: ["DSA", "System Design", "Java/Python/C++", "Leadership Principles", "Low Level Design"],
    pattern: `Amazon SDE-1 Fresher Process:
1. Online Assessment (90 min)
   - 2 Coding problems (Medium-Hard LeetCode)
   - Work Style Assessment (behavioral)
   - Work Simulation (situational judgment)

2. Technical Phone Screen (1 hour)
   - 1-2 coding problems
   - Brief behavioral questions

3. Loop Interviews (4-5 rounds, same day)
   - Each round: 1 coding + behavioral (Leadership Principles)
   - One round: System Design / LLD (for experienced)
   - Bar Raiser round included

Key: Every answer must reference Amazon Leadership Principles.`,
    tips: [
      "Master Amazon Leadership Principles — all 16 of them, with STAR examples",
      "LeetCode: solve 150+ problems, focus on Medium difficulty",
      "Most asked patterns: two pointers, sliding window, trees, graphs, DP",
      "Every behavioral question is tied to a Leadership Principle",
      "Think out loud during coding — they evaluate process, not just solution",
      "System design: practice URL shortener, parking lot, LRU cache",
      "After each coding solution mention time and space complexity",
      "Ask clarifying questions before coding — they expect this",
    ],
    interviewExperience: `"OA had 2 medium coding problems and a work simulation. Loop had 5 rounds — each started with a behavioral LP question then coding. The bar raiser round was tough — they challenged my solutions. Key insight: always connect your answers to Leadership Principles explicitly."
— Amazon SDE-1, Bangalore 2024`,
    hiddenTips: [
      "Bar Raiser can reject you even if all other rounds go well — they set the bar",
      "Prepare 6-8 strong STAR stories that cover multiple LPs",
      "Amazon values Ownership and Bias for Action most — show initiative in stories",
      "They ask about failures deliberately — have a real failure story ready",
    ],
  },
  {
    id: "google",
    name: "Google",
    fullName: "Google India",
    icon: "🔴",
    color: "#ea4335",
    bg: "#fdecea",
    type: "Product Based",
    difficulty: "hard",
    package: "35 - 80 LPA",
    locations: ["Bangalore", "Hyderabad", "Mumbai"],
    rounds: ["Resume Screen", "Online Assessment", "Phone Screen", "4-5 Onsite Interviews"],
    techStack: ["DSA (Advanced)", "System Design", "Any Language", "Algorithms", "Distributed Systems"],
    pattern: `Google SWE New Grad Process:
1. Resume Screen (very competitive — projects matter)
2. Online Coding Assessment (90 min, 2 hard problems)
3. Technical Phone Screen (45-60 min, 1-2 coding problems)
4. Onsite / Virtual Onsite (4-5 rounds)
   - Each round: 2 coding problems or 1 hard problem
   - 1 System Design round
   - 1 Behavioral round (Googleyness)

Focus: Pure algorithmic problem solving.
Language: Any — but Python preferred for speed.`,
    tips: [
      "LeetCode Hard is the minimum bar — solve 300+ problems",
      "Google focuses on algorithms — dynamic programming, graphs, trees",
      "Know time and space complexity for EVERY solution",
      "Practice explaining your thought process while coding",
      "Googleyness round: collaboration, ambiguity handling, impact",
      "System design: study distributed systems, scalability, consistency",
      "Read CLRS (algorithms book) or at least the key chapters",
      "Participate in Google Kickstart and Code Jam for practice",
    ],
    interviewExperience: `"Resume was reviewed after a referral. OA had 2 hard problems. Phone screen was 1 medium-hard problem. Onsite had 4 rounds — each had 2 problems. The interviewers were very collaborative — they give hints if you're stuck. System design was for a distributed cache. Got an offer 3 weeks after onsite."
— Google SWE L3, Bangalore 2024`,
    hiddenTips: [
      "Referrals increase your resume review chances by 10x — find someone on LinkedIn",
      "Google reschedules interviews easily — don't feel pressured to rush",
      "They hire for potential — if you show clear thinking, they overlook incomplete solutions",
      "Google has strong internal mobility — many join a team and switch later",
    ],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    fullName: "Microsoft India",
    icon: "🟦",
    color: "#00a4ef",
    bg: "#e6f5fd",
    type: "Product Based",
    difficulty: "hard",
    package: "25 - 60 LPA",
    locations: ["Hyderabad", "Bangalore", "Noida"],
    rounds: ["Online Assessment", "Technical Interviews (3-4)", "HR Interview"],
    techStack: ["DSA", "OOP", "System Design", "C#/Java/Python", "Azure Basics"],
    pattern: `Microsoft SDE-1 Process:
1. Online Assessment (HackerRank, 90 min)
   - 2-3 coding problems (Medium level)
2. Technical Interviews (3-4 rounds, same day or spread)
   - Round 1-2: DSA problems (arrays, trees, graphs, DP)
   - Round 3: Design / OOP design problem
   - Round 4 (As Appropriate): Senior interviewer round
3. HR Interview: Cultural fit, career goals

Microsoft values: Growth mindset, collaboration, diversity.`,
    tips: [
      "Microsoft OOP questions are important — design patterns, SOLID principles",
      "LeetCode Medium is the sweet spot — solve 200+ problems",
      "They love tree and graph problems — master BFS, DFS, Dijkstra",
      "Design round: design a parking lot, elevator system, chess game",
      "Growth mindset stories are important in behavioral rounds",
      "Know Azure basics if applying for cloud roles",
      "Microsoft values collaboration — show team stories",
      "Ask good questions at the end of each round",
    ],
    interviewExperience: `"OA had 3 medium problems on HackerRank. Technical rounds were 4 — first two DSA (linked lists, trees), third was design (design a URL shortener class structure), fourth was with a principal engineer. They evaluate how you think through problems, not just the final answer."
— Microsoft SDE-1, Hyderabad 2024`,
    hiddenTips: [
      "Microsoft As Appropriate (AA) round determines your level — perform well",
      "They value growth mindset heavily — have a story about learning from failure",
      "ESPP (Employee Stock Purchase Plan) makes the package more attractive",
      "Microsoft has a very collaborative culture — unlike Amazon's competitive one",
    ],
  },
  {
    id: "flipkart",
    name: "Flipkart",
    fullName: "Flipkart Internet Pvt Ltd",
    icon: "🟡",
    color: "#2874f0",
    bg: "#e8f0fe",
    type: "Product Based",
    difficulty: "medium",
    package: "18 - 40 LPA",
    locations: ["Bangalore"],
    rounds: ["Online Coding Test", "3-4 Technical Interviews", "HR Interview"],
    techStack: ["DSA", "System Design", "Java/Python", "Low Level Design", "Microservices"],
    pattern: `Flipkart SDE-1 Fresher Process:
1. Online Coding Test (90 min)
   - 3 coding problems
   - Difficulty: 1 Easy + 1 Medium + 1 Hard
2. Technical Interview Round 1: DSA focused
3. Technical Interview Round 2: DSA + OOP
4. Technical Interview Round 3: System / LLD Design
5. HR: Culture fit, compensation discussion

Flipkart values product thinking — they want engineers
who understand the business impact of their code.`,
    tips: [
      "Flipkart is slightly easier than FAANG — but still needs solid DSA",
      "Low Level Design (LLD) is important — practice OOP design problems",
      "They love HashMap and graph problems — focus on these",
      "Product thinking matters — explain the business value of your projects",
      "Know microservices basics — Flipkart has a microservices architecture",
      "SQL + System Design basics needed for senior interviews",
      "LeetCode Medium is sufficient — solve 150-200 problems",
      "They have a good culture — show enthusiasm for their products",
    ],
    interviewExperience: `"Coding test had 3 problems — easy, medium, hard. I solved 2 fully. Technical rounds were focused on DSA and one LLD round where I had to design a ride-sharing system class structure. HR discussed package expectations and team preferences. Process took about 3 weeks."
— Flipkart SDE-1, Bangalore 2024`,
    hiddenTips: [
      "Flipkart often hires from campus — Flipkart Grid competition is a good entry",
      "They care about Bangalore preference — remote work is limited",
      "Meesho, Myntra (Flipkart group) have similar process but different culture",
    ],
  },
  {
    id: "startup",
    name: "Startups",
    fullName: "High-Growth Startups (Series A-D)",
    icon: "🚀",
    color: "#00b894",
    bg: "#e0faf4",
    type: "Startup",
    difficulty: "medium",
    package: "8 - 25 LPA + ESOPs",
    locations: ["Bangalore", "Mumbai", "Delhi", "Remote"],
    rounds: ["Assignment / Take Home", "Technical Interview", "Cultural Fit", "Founder Round"],
    techStack: ["Full Stack", "Python/Node.js", "React", "Cloud", "Fast Shipping"],
    pattern: `Startup Hiring Process (varies greatly):
1. Resume/LinkedIn screening (much faster than big companies)
2. Take-home assignment (2-3 days) OR live coding
   - Build a small feature or solve a real problem
   - Code quality, architecture, and documentation matter
3. Technical interview (1-2 rounds)
   - More practical than algorithmic
   - They want to see if you can ship product
4. Cultural fit interview (sometimes with founder)
5. Offer (very fast — sometimes same week)

Key difference: Startups hire for immediate impact.
They want someone who can contribute from Day 1.`,
    tips: [
      "Startups value shipped products over algorithmic knowledge",
      "Your GitHub activity and projects matter more than CGPA",
      "Take-home assignment — focus on clean code and good documentation",
      "Ask about growth trajectory and funding stage before joining",
      "ESOPs can be valuable — understand vesting schedule",
      "Show genuine interest in their product — research deeply before interview",
      "Be ready to own features end-to-end — no siloed roles in startups",
      "Communication and speed matter — show you can work fast",
    ],
    interviewExperience: `"Applied through LinkedIn, got response in 2 days. Take-home assignment: build a REST API with authentication in 48 hours. Technical interview was practical — they reviewed my code and asked about design decisions. Founder round was a conversation about vision. Got offer letter same week."
— Full Stack Engineer at Series B Startup, Bangalore 2024`,
    hiddenTips: [
      "AngelList, Wellfound, LinkedIn, and YC job board are best for startup jobs",
      "Early stage startups pay less but ESOPs can be life-changing if they scale",
      "Culture fit is everything in startups — one toxic team member ruins it",
      "Ask about runway and burn rate before joining a pre-Series A startup",
    ],
  },
];

// ── Difficulty config ─────────────────────────────────
const DIFFICULTY_CONFIG = {
  easy:   { label: "Easy",   color: "#00b894", bg: "#e0faf4", desc: "Good for first job" },
  medium: { label: "Medium", color: "#f39c12", bg: "#fef9e7", desc: "Needs solid prep" },
  hard:   { label: "Hard",   color: "#e74c3c", bg: "#fdecea", desc: "Competitive, high reward" },
};

// ── Comparison Table ───────────────────────────────────
const COMPARISON_ROWS = [
  { label: "Difficulty",      tcs: "⭐",       infosys: "⭐",    wipro: "⭐",      amazon: "⭐⭐⭐⭐⭐", google: "⭐⭐⭐⭐⭐", flipkart: "⭐⭐⭐⭐" },
  { label: "Package",         tcs: "3.5-7L",   infosys: "3.6-8L", wipro: "3.5-6.5L", amazon: "20-45L", google: "35-80L", flipkart: "18-40L" },
  { label: "DSA Focus",       tcs: "Low",      infosys: "Low",  wipro: "Low",     amazon: "Very High", google: "Very High", flipkart: "High" },
  { label: "Aptitude Focus",  tcs: "High",     infosys: "High", wipro: "High",    amazon: "Low",    google: "Low",    flipkart: "Low" },
  { label: "System Design",   tcs: "No",       infosys: "No",   wipro: "No",      amazon: "Yes",    google: "Yes",    flipkart: "Yes" },
  { label: "Work-Life",       tcs: "Good",     infosys: "Good", wipro: "Good",    amazon: "Intense", google: "Good",   flipkart: "Good" },
  { label: "Growth",          tcs: "Slow",     infosys: "Slow", wipro: "Slow",    amazon: "Fast",   google: "Fast",   flipkart: "Fast" },
];

export default function CompanyPrep({ navigate }) {
  const [selectedCompany, setSelectedCompany]   = useState("tcs");
  const [activeTab,       setActiveTab]         = useState("overview");
  const [filterDifficulty,setFilterDifficulty]  = useState("all");
  const [showComparison,  setShowComparison]    = useState(false);

  const company = COMPANIES.find((c) => c.id === selectedCompany);
  const diff    = DIFFICULTY_CONFIG[company?.difficulty] || DIFFICULTY_CONFIG.easy;

  const filteredCompanies = COMPANIES.filter((c) =>
    filterDifficulty === "all" ? true : c.difficulty === filterDifficulty
  );

  const tabs = [
    { id: "overview",    label: "Overview",        icon: "📊" },
    { id: "pattern",     label: "Interview Pattern",icon: "📋" },
    { id: "tips",        label: "Tips & Strategy",  icon: "💡" },
    { id: "experience",  label: "Experience",       icon: "🎤" },
  ];

  return (
    <div className="company-prep-page">

      {/* ── Page Header ───────────────────────────── */}
      <div style={{ marginBottom: "32px" }}>
        <div className="interview-page-title">Company Prep</div>
        <div className="interview-page-sub">
          Interview patterns, tips, and insider knowledge for top companies
        </div>
      </div>

      {/* ── Filter + Comparison Toggle ────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Difficulty filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setFilterDifficulty(d)}
              style={{
                padding: "7px 18px",
                borderRadius: "var(--radius-full)",
                border: filterDifficulty === d
                  ? "1.5px solid var(--primary)"
                  : "1.5px solid var(--border)",
                background: filterDifficulty === d
                  ? "var(--primary-light)" : "var(--surface)",
                color: filterDifficulty === d
                  ? "var(--primary)" : "var(--muted)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "var(--transition)",
                textTransform: "capitalize",
              }}
            >
              {d === "all" ? "All Companies" : d}
            </button>
          ))}
        </div>

        {/* Comparison toggle */}
        <button
          className="btn-secondary"
          onClick={() => setShowComparison(!showComparison)}
          style={{ padding: "8px 20px", fontSize: "13px" }}
        >
          {showComparison ? "Hide" : "📊 Show"} Comparison Table
        </button>
      </div>

      {/* ── Comparison Table ──────────────────────── */}
      {showComparison && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "28px",
            boxShadow: "var(--shadow-card)",
            marginBottom: "32px",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "20px",
            }}
          >
            📊 Company Comparison Table
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr>
                {["Criteria", "TCS", "Infosys", "Wipro", "Amazon", "Google", "Flipkart"].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "10px 14px",
                      textAlign: i === 0 ? "left" : "center",
                      background: "var(--surface2)",
                      color: "var(--text-secondary)",
                      fontWeight: 700,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      borderBottom: "2px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "10px 14px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      borderBottom: "1px solid var(--border)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.label}
                  </td>
                  {[row.tcs, row.infosys, row.wipro, row.amazon, row.google, row.flipkart].map((val, j) => (
                    <td
                      key={j}
                      style={{
                        padding: "10px 14px",
                        textAlign: "center",
                        borderBottom: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        fontSize: "13px",
                      }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Company Cards Grid ────────────────────── */}
      <div className="company-grid" style={{ marginBottom: "32px" }}>
        {filteredCompanies.map((c) => {
          const d      = DIFFICULTY_CONFIG[c.difficulty];
          const active = selectedCompany === c.id;
          return (
            <div
              key={c.id}
              className="company-card"
              onClick={() => { setSelectedCompany(c.id); setActiveTab("overview"); }}
              style={{
                border: active
                  ? `2px solid ${c.color}`
                  : "1px solid var(--border)",
                transform: active ? "translateY(-4px)" : "none",
                boxShadow: active ? `0 8px 32px ${c.color}20` : "var(--shadow-card)",
              }}
            >
              <div className="company-header">
                <div
                  className="company-logo"
                  style={{ background: c.bg, fontSize: "28px" }}
                >
                  {c.icon}
                </div>
                <div>
                  <div className="company-name" style={{ color: active ? c.color : "var(--text)" }}>
                    {c.name}
                  </div>
                  <div className="company-type">{c.type}</div>
                </div>
              </div>

              <div
                className={`difficulty-badge difficulty-${c.difficulty}`}
                style={{ background: d.bg, color: d.color }}
              >
                {d.label} — {d.desc}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginBottom: "12px",
                  fontWeight: 600,
                }}
              >
                💰 {c.package}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {c.techStack.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    style={{
                      background: active ? c.bg : "var(--surface2)",
                      color: active ? c.color : "var(--muted)",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "var(--radius-full)",
                      border: `1px solid ${active ? c.color + "30" : "var(--border)"}`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {active && (
                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: c.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  ✓ Selected — See details below
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Selected Company Detail ───────────────── */}
      {company && (
        <div
          style={{
            background: "var(--surface)",
            border: `1px solid ${company.color}30`,
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Company header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${company.color}18, ${company.color}08)`,
              borderBottom: `1px solid ${company.color}20`,
              padding: "28px 32px",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "64px", height: "64px",
                background: company.bg,
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                border: `1px solid ${company.color}20`,
              }}
            >
              {company.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  color: company.color,
                  marginBottom: "4px",
                }}
              >
                {company.fullName}
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  💰 {company.package}
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  📍 {company.locations.join(", ")}
                </span>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  🏢 {company.type}
                </span>
              </div>
            </div>
            <div
              style={{
                background: diff.bg,
                color: diff.color,
                fontWeight: 700,
                fontSize: "13px",
                padding: "6px 18px",
                borderRadius: "var(--radius-full)",
                border: `1px solid ${diff.color}30`,
              }}
            >
              {diff.label} Difficulty
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              background: "var(--surface2)",
              overflowX: "auto",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "14px 24px",
                  border: "none",
                  background: "none",
                  fontSize: "14px",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  color: activeTab === tab.id ? company.color : "var(--muted)",
                  cursor: "pointer",
                  borderBottom: activeTab === tab.id
                    ? `2px solid ${company.color}`
                    : "2px solid transparent",
                  transition: "var(--transition)",
                  whiteSpace: "nowrap",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ padding: "28px 32px" }}>

            {/* ── Overview Tab ──────────────────────── */}
            {activeTab === "overview" && (
              <div>
                {/* Interview rounds */}
                <div style={{ marginBottom: "28px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "16px",
                    }}
                  >
                    📋 Interview Rounds
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {company.rounds.map((round, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px", height: "32px",
                            borderRadius: "50%",
                            background: company.bg,
                            border: `2px solid ${company.color}40`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: 800,
                            color: company.color,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>
                        {i < company.rounds.length - 1 && (
                          <div
                            style={{
                              position: "absolute",
                              left: "15px",
                              marginTop: "32px",
                              width: "2px",
                              height: "10px",
                              background: `${company.color}30`,
                            }}
                          />
                        )}
                        <div
                          style={{
                            fontSize: "14px",
                            color: "var(--text-secondary)",
                            fontWeight: 500,
                          }}
                        >
                          {round}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div style={{ marginBottom: "28px" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "12px",
                    }}
                  >
                    ⚡ Key Skills Tested
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {company.techStack.map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          background: company.bg,
                          color: company.color,
                          fontSize: "13px",
                          fontWeight: 600,
                          padding: "6px 14px",
                          borderRadius: "var(--radius-full)",
                          border: `1px solid ${company.color}25`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hidden insider tips */}
                <div
                  style={{
                    background: `${company.color}08`,
                    border: `1px solid ${company.color}20`,
                    borderRadius: "var(--radius-lg)",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: company.color,
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    🔍 Insider Knowledge
                  </div>
                  {company.hiddenTips.map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "flex-start",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        padding: "6px 0",
                        borderBottom: i < company.hiddenTips.length - 1
                          ? "1px solid var(--border)" : "none",
                      }}
                    >
                      <span style={{ color: company.color, flexShrink: 0 }}>💎</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Pattern Tab ───────────────────────── */}
            {activeTab === "pattern" && (
              <div>
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "16px",
                    }}
                  >
                    📋 Complete Interview Pattern
                  </div>
                  <div
                    style={{
                      whiteSpace: "pre-line",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 2,
                      fontFamily: "monospace",
                    }}
                  >
                    {company.pattern}
                  </div>
                </div>

                {/* Rounds visual */}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "16px",
                  }}
                >
                  🔄 Round by Round Breakdown
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {company.rounds.map((round, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "16px",
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "36px", height: "36px",
                          borderRadius: "50%",
                          background: company.bg,
                          color: company.color,
                          fontWeight: 800,
                          fontSize: "16px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 10px",
                          border: `2px solid ${company.color}30`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "var(--text)",
                          lineHeight: 1.4,
                        }}
                      >
                        {round}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Tips Tab ──────────────────────────── */}
            {activeTab === "tips" && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "16px",
                  }}
                >
                  💡 Strategy & Tips for {company.name}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {company.tips.map((tip, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "14px",
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "16px",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = `${company.color}40`;
                        e.currentTarget.style.background  = company.bg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.background  = "var(--surface2)";
                      }}
                    >
                      <div
                        style={{
                          width: "28px", height: "28px",
                          borderRadius: "50%",
                          background: company.bg,
                          color: company.color,
                          fontSize: "12px",
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          border: `1px solid ${company.color}30`,
                        }}
                      >
                        {i + 1}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.6,
                        }}
                      >
                        {tip}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Preparation timeline */}
                <div
                  style={{
                    marginTop: "28px",
                    background: `${company.color}08`,
                    border: `1px solid ${company.color}20`,
                    borderRadius: "var(--radius-lg)",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: company.color,
                      marginBottom: "14px",
                    }}
                  >
                    ⏱️ Recommended Preparation Timeline
                  </div>
                  {company.difficulty === "easy" && (
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                      <div>📅 <strong>Week 1-2:</strong> Aptitude practice (200+ questions)</div>
                      <div>📅 <strong>Week 3:</strong> CS fundamentals (OOP, DBMS, OS, Networks)</div>
                      <div>📅 <strong>Week 4:</strong> Resume preparation + STAR method stories</div>
                      <div>📅 <strong>Week 5:</strong> Mock interviews + company-specific preparation</div>
                    </div>
                  )}
                  {company.difficulty === "medium" && (
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                      <div>📅 <strong>Month 1:</strong> LeetCode Easy + CS fundamentals</div>
                      <div>📅 <strong>Month 2:</strong> LeetCode Medium (100+ problems)</div>
                      <div>📅 <strong>Month 3:</strong> System design + OOP design</div>
                      <div>📅 <strong>Month 4:</strong> Mock interviews + company research</div>
                    </div>
                  )}
                  {company.difficulty === "hard" && (
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                      <div>📅 <strong>Month 1-2:</strong> LeetCode Medium (200+ problems)</div>
                      <div>📅 <strong>Month 3:</strong> LeetCode Hard + advanced patterns</div>
                      <div>📅 <strong>Month 4:</strong> System design deep dive</div>
                      <div>📅 <strong>Month 5:</strong> Behavioral prep + mock interviews</div>
                      <div>📅 <strong>Month 6:</strong> Company-specific prep + referrals</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Experience Tab ────────────────────── */}
            {activeTab === "experience" && (
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "16px",
                  }}
                >
                  🎤 Real Interview Experience
                </div>

                <div
                  style={{
                    background: "var(--surface2)",
                    border: `1px solid ${company.color}20`,
                    borderRadius: "var(--radius-xl)",
                    padding: "28px",
                    marginBottom: "24px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontSize: "48px",
                      color: `${company.color}20`,
                      fontFamily: "Georgia, serif",
                      lineHeight: 1,
                      marginBottom: "8px",
                    }}
                  >
                    "
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.9,
                      fontStyle: "italic",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {company.interviewExperience}
                  </div>
                </div>

                {/* Key takeaways */}
                <div
                  style={{
                    background: `${company.color}08`,
                    border: `1px solid ${company.color}20`,
                    borderRadius: "var(--radius-lg)",
                    padding: "20px 24px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: company.color,
                      marginBottom: "14px",
                    }}
                  >
                    🎯 Key Takeaways from This Experience
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                    }}
                  >
                    {company.tips.slice(0, 4).map((tip, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "8px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: company.color, flexShrink: 0 }}>→</span>
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Where to find more */}
                <div
                  style={{
                    background: "var(--surface2)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "20px 24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--text)",
                      marginBottom: "12px",
                    }}
                  >
                    📚 Find More Interview Experiences
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {[
                      { icon: "🟢", name: "GeeksForGeeks", desc: `Search "${company.name} interview experience"` },
                      { icon: "🔵", name: "Glassdoor",     desc: `"${company.name} interview questions"` },
                      { icon: "🟣", name: "LeetCode",      desc: `"${company.name}" tag in discuss section` },
                      { icon: "🔴", name: "Reddit",        desc: `r/cscareerquestions — "${company.name} interview"` },
                    ].map((source, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          gap: "12px",
                          alignItems: "center",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          padding: "8px 0",
                          borderBottom: i < 3 ? "1px solid var(--border)" : "none",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>{source.icon}</span>
                        <div>
                          <strong style={{ color: "var(--text)" }}>{source.name}</strong>
                          <span style={{ marginLeft: "8px" }}>— {source.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "20px 32px",
              background: "var(--surface2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "14px", color: "var(--muted)" }}>
              Ready to practise for {company.name}?
            </div>
            <button
              className="btn-primary"
              style={{ width: "auto", padding: "12px 28px" }}
              onClick={() => navigate("interview")}
            >
              Start {company.name} Mock Interview →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}