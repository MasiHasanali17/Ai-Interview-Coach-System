import { useState, useRef } from "react";
import { checkATS, extractPDFText, validatePDF } from "../api/client";

// ── Good vs Bad resume examples ────────────────────────
const COMPARISONS = [
  {
    category: "Work Experience",
    good: "Developed a machine learning model using Python and Scikit-learn that improved customer churn prediction accuracy by 23%, reducing revenue loss by ₹12L annually.",
    bad: "Worked on machine learning project. Used Python. Got good results.",
    tip: "Always quantify your achievements. Numbers make your impact real to recruiters.",
  },
  {
    category: "Skills Section",
    good: "Python (NumPy, Pandas, Scikit-learn), SQL (PostgreSQL, MySQL), Machine Learning, Deep Learning (TensorFlow), Data Visualization (Matplotlib, Seaborn, Tableau)",
    bad: "Python, SQL, Machine Learning, Good Communication, Team Player, MS Office",
    tip: "List specific tools and libraries. Remove generic soft skills from the skills section.",
  },
  {
    category: "Project Description",
    good: "Stock Price Prediction | Python, LSTM, yfinance | GitHub Link\nBuilt a time-series forecasting model using LSTM networks to predict NIFTY 50 closing prices. Achieved 87% directional accuracy on test data. Deployed as a Flask API.",
    bad: "Stock Prediction Project\nMade a project to predict stock prices using machine learning. It worked well.",
    tip: "Include tech stack, measurable results, and a GitHub link for every project.",
  },
  {
    category: "Summary / Objective",
    good: "Final year B.Tech CSE student specializing in Data Science with hands-on experience in ML, Python, and SQL. Built 3 end-to-end ML projects. Seeking a Data Analyst role where I can apply my skills to drive business insights.",
    bad: "I am a hardworking student who wants to work in a good company and learn new things and grow my career.",
    tip: "Be specific. Mention your specialization, what you've built, and what role you want.",
  },
];

// ── ATS tips ───────────────────────────────────────────
const ATS_TIPS = [
  {
    icon: "🔍",
    title: "Use Keywords from Job Description",
    desc: "Copy exact words from the job posting. ATS systems scan for exact keyword matches. If JD says 'data analysis', your resume should say 'data analysis' — not 'data analytics'.",
  },
  {
    icon: "📝",
    title: "Use Standard Section Headings",
    desc: "Use headings like 'Work Experience', 'Education', 'Skills', 'Projects'. Avoid creative names like 'My Journey' or 'What I've Done' — ATS won't recognise them.",
  },
  {
    icon: "🚫",
    title: "No Tables, Columns or Images",
    desc: "ATS cannot read text inside tables, multi-column layouts or images. Use a single-column, plain text format to ensure 100% readability by ATS systems.",
  },
  {
    icon: "📄",
    title: "Save as PDF but Check Job Post",
    desc: "Most companies accept PDF. But some older ATS systems prefer .docx. Always check the job description. When in doubt — submit PDF.",
  },
  {
    icon: "📏",
    title: "Keep it 1 Page (Freshers)",
    desc: "Freshers should stick to 1 page. Recruiters spend 6 seconds on a resume. More pages = more chances of important content being missed.",
  },
  {
    icon: "✍️",
    title: "Use Action Verbs",
    desc: "Start bullet points with action verbs: Developed, Built, Designed, Implemented, Improved, Analysed, Deployed. Never start with 'Responsible for' or 'Worked on'.",
  },
];

// ── Checklist items ────────────────────────────────────
const CHECKLIST = [
  { id: 1,  text: "Contact info is correct (email, phone, LinkedIn, GitHub)" },
  { id: 2,  text: "Resume is exactly 1 page (for freshers)" },
  { id: 3,  text: "No spelling or grammar mistakes" },
  { id: 4,  text: "Used action verbs for all bullet points" },
  { id: 5,  text: "Every project has tech stack + GitHub link" },
  { id: 6,  text: "Quantified at least 2-3 achievements with numbers" },
  { id: 7,  text: "Skills section has specific tools, not generic terms" },
  { id: 8,  text: "No tables, columns or images (ATS-friendly)" },
  { id: 9,  text: "Font is clean and readable (Inter, Calibri, Arial)" },
  { id: 10, text: "Saved as PDF" },
  { id: 11, text: "Tailored to the specific job description" },
  { id: 12, text: "Education section has CGPA if above 7.0" },
];

// ── Recruiter secrets ──────────────────────────────────
const RECRUITER_SECRETS = [
  { icon: "⏱️", title: "6 Second Rule",       desc: "Recruiters spend only 6 seconds on your resume. Put your strongest points — skills and projects — in the top half of the page." },
  { icon: "👁️", title: "They Scan, Not Read", desc: "Recruiters don't read line by line. They scan for keywords, numbers, and company/project names. Use bold for key terms." },
  { icon: "📊", title: "Numbers Stand Out",   desc: "Specific numbers jump out during scanning. '23% improvement' is remembered. 'Significant improvement' is forgotten immediately." },
  { icon: "🔗", title: "GitHub is Important", desc: "For tech roles, a GitHub profile with active projects is sometimes more valuable than your resume. Keep it updated." },
  { icon: "📋", title: "ATS Before Human",    desc: "In 90% of companies, your resume is first scanned by ATS software. If it fails ATS — no human ever sees it." },
  { icon: "🎯", title: "Tailoring Matters",   desc: "A tailored resume gets 3x more responses than a generic one. Spend 15 minutes customising for each application." },
];

const ROLES = [
  "Data Scientist", "Machine Learning Engineer", "Software Engineer",
  "Data Analyst", "Backend Developer", "Full Stack Developer",
  "Frontend Developer", "Product Manager", "DevOps Engineer",
];

export default function ResumeTips({ navigate }) {
  const [activeTab,     setActiveTab]     = useState("tips");
  const [checkedItems,  setCheckedItems]  = useState({});
  const [atsText,       setAtsText]       = useState("");
  const [atsRole,       setAtsRole]       = useState("Data Scientist");
  const [atsResult,     setAtsResult]     = useState(null);
  const [atsLoading,    setAtsLoading]    = useState(false);
  const [uploadStatus,  setUploadStatus]  = useState("idle");
  const fileRef = useRef(null);

  const tabs = [
    { id: "tips",      label: "Resume Tips",     icon: "💡" },
    { id: "compare",   label: "Good vs Bad",     icon: "⚖️" },
    { id: "ats",       label: "ATS Checker",     icon: "🤖" },
    { id: "checklist", label: "Checklist",       icon: "✅" },
    { id: "secrets",   label: "Recruiter View",  icon: "👁️" },
  ];

  function toggleCheck(id) {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length;

  // ── Handle PDF for ATS checker ─────────────────────
  async function handleATSPDF(file) {
    const v = validatePDF(file);
    if (!v.valid) { alert(v.error); return; }
    setUploadStatus("parsing");
    try {
      const text = await extractPDFText(file);
      setAtsText(text);
      setUploadStatus("done");
    } catch (err) {
      setUploadStatus("error");
    }
  }

  // ── Run ATS Check ──────────────────────────────────
  async function runATSCheck() {
    if (!atsText.trim()) { alert("Please paste your resume text or upload a PDF first."); return; }
    setAtsLoading(true);
    setAtsResult(null);
    try {
      const result = await checkATS(atsText, atsRole);
      setAtsResult(result);
    } catch (err) {
      alert("ATS check failed. Make sure backend is running on port 8000.");
    } finally {
      setAtsLoading(false);
    }
  }

  const atsScoreColor =
    !atsResult           ? "var(--primary)"  :
    atsResult.ats_score >= 70 ? "var(--success)" :
    atsResult.ats_score >= 50 ? "var(--warn)"    : "var(--danger)";

  return (
    <div className="resume-tips-page">

      {/* ── Page Header ───────────────────────────── */}
      <div style={{ marginBottom: "36px" }}>
        <div className="interview-page-title">Resume Tips</div>
        <div className="interview-page-sub">
          Everything you need to build a resume that gets past ATS and impresses recruiters
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="tabs-wrap" style={{ marginBottom: "36px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB: RESUME TIPS ──────────────────────── */}
      {activeTab === "tips" && (
        <div>
          {/* Hero tip */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "var(--radius-xl)",
              padding: "36px 40px",
              color: "white",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontSize: "56px" }}>📄</div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "22px",
                  fontWeight: 800,
                  marginBottom: "8px",
                }}
              >
                Your Resume = Your First Impression
              </div>
              <div style={{ opacity: 0.85, fontSize: "15px", lineHeight: 1.6, maxWidth: "500px" }}>
                A recruiter spends 6 seconds on your resume. In those 6 seconds,
                they decide if you move forward or not. Make every word count.
              </div>
            </div>
          </div>

          {/* ATS Tips grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
              gap: "20px",
            }}
          >
            {ATS_TIPS.map((tip, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                  boxShadow: "var(--shadow-card)",
                  transition: "var(--transition-slow)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  e.currentTarget.style.borderColor = "var(--primary-light)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{tip.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  {tip.title}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  {tip.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 1 page vs 2 page */}
          <div
            style={{
              marginTop: "32px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "32px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "20px",
              }}
            >
              📏 1 Page vs 2 Page — The Final Answer
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  background: "var(--success-light)",
                  border: "1px solid rgba(39,174,96,0.2)",
                  borderRadius: "var(--radius)",
                  padding: "20px",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--success)", marginBottom: "12px", fontSize: "15px" }}>
                  ✅ 1 Page — For You (Fresher)
                </div>
                <ul style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: "16px" }}>
                  <li>0–3 years of experience</li>
                  <li>Recruiters prefer 1 page for freshers</li>
                  <li>Forces you to include only the best</li>
                  <li>Easier to scan in 6 seconds</li>
                  <li>Shows you can prioritise information</li>
                </ul>
              </div>
              <div
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "20px",
                }}
              >
                <div style={{ fontWeight: 700, color: "var(--muted)", marginBottom: "12px", fontSize: "15px" }}>
                  📄 2 Pages — Only If You Have
                </div>
                <ul style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.8, paddingLeft: "16px" }}>
                  <li>5+ years of solid experience</li>
                  <li>Multiple full-time job positions</li>
                  <li>Published research or patents</li>
                  <li>Significant leadership roles</li>
                  <li>Even then — make it tight</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: GOOD VS BAD ──────────────────────── */}
      {activeTab === "compare" && (
        <div>
          <div
            style={{
              background: "var(--primary-light)",
              border: "1px solid rgba(108,99,255,0.2)",
              borderRadius: "var(--radius-lg)",
              padding: "16px 20px",
              marginBottom: "28px",
              fontSize: "14px",
              color: "var(--primary)",
              fontWeight: 500,
            }}
          >
            💡 See the difference between a resume that gets shortlisted vs one that gets rejected.
            Both describe the same candidate — just written differently.
          </div>

          {COMPARISONS.map((comp, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-xl)",
                padding: "28px",
                boxShadow: "var(--shadow-card)",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "var(--text)",
                  marginBottom: "20px",
                  paddingBottom: "12px",
                  borderBottom: "2px solid var(--border)",
                }}
              >
                📌 {comp.category}
              </div>

              <div className="compare-grid">
                <div className="compare-card good">
                  <div className="compare-title">
                    <span>✅</span> Good Version
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                      fontFamily: "monospace",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {comp.good}
                  </div>
                </div>
                <div className="compare-card bad">
                  <div className="compare-title">
                    <span>❌</span> Bad Version
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.8,
                      fontFamily: "monospace",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {comp.bad}
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: "16px",
                  background: "var(--warn-light)",
                  border: "1px solid rgba(243,156,18,0.2)",
                  borderRadius: "var(--radius)",
                  padding: "12px 16px",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <span style={{ color: "var(--warn)", flexShrink: 0 }}>💡</span>
                <span><strong style={{ color: "var(--warn)" }}>Tip:</strong> {comp.tip}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TAB: ATS CHECKER ──────────────────────── */}
      {activeTab === "ats" && (
        <div>
          <div className="ats-checker">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "6px",
              }}
            >
              🤖 AI-Powered ATS Score Checker
            </div>
            <div style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "24px" }}>
              Paste your resume text below or upload your PDF. Select your target role and check how ATS-friendly your resume is.
            </div>

            {/* Upload PDF for ATS */}
            <div
              className={`upload-zone ${uploadStatus}`}
              style={{ marginBottom: "16px" }}
              onClick={() => fileRef.current?.click()}
            >
              {uploadStatus === "idle"    && <><div className="upload-icon">📄</div><div className="upload-title">Upload PDF to auto-extract text</div><div className="upload-sub">or paste manually below</div></>}
              {uploadStatus === "parsing" && <><div className="upload-icon">⏳</div><div className="upload-title">Extracting text from PDF...</div></>}
              {uploadStatus === "done"    && <><div className="upload-icon">✅</div><div className="upload-success">PDF text extracted! You can edit below.</div></>}
              {uploadStatus === "error"   && <><div className="upload-icon">❌</div><div className="upload-error">Failed. Paste text manually instead.</div></>}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => handleATSPDF(e.target.files[0])}
              />
            </div>

            {/* Resume text area */}
            <div className="form-group">
              <label className="form-label">Resume Text</label>
              <textarea
                className="answer-textarea"
                style={{ minHeight: "200px" }}
                placeholder="Paste your full resume text here..."
                value={atsText}
                onChange={(e) => setAtsText(e.target.value)}
              />
            </div>

            {/* Role selector */}
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select
                className="form-select"
                value={atsRole}
                onChange={(e) => setAtsRole(e.target.value)}
              >
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>

            <button
              className="btn-primary"
              onClick={runATSCheck}
              disabled={atsLoading || !atsText.trim()}
            >
              {atsLoading ? "⏳ Analysing with AI..." : "🤖 Check ATS Score →"}
            </button>
          </div>

          {/* ATS Result */}
          {atsResult && (
            <div className="ats-result">
              {/* Score */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  marginBottom: "24px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div className="ats-score-big" style={{ color: atsScoreColor }}>
                    {atsResult.ats_score}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>ATS Score out of 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        background: atsScoreColor + "18",
                        color: atsScoreColor,
                        fontWeight: 700,
                        padding: "6px 16px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "14px",
                      }}
                    >
                      {atsResult.verdict}
                    </span>
                  </div>
                  <div className="progress-bar-track" style={{ height: "10px" }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${atsResult.ats_score}%`,
                        background: atsScoreColor,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                {/* Matched Keywords */}
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "var(--success)",
                      marginBottom: "10px",
                    }}
                  >
                    ✅ Matched Keywords ({atsResult.matched_keywords?.length || 0})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {(atsResult.matched_keywords || []).map((kw, i) => (
                      <span
                        key={i}
                        style={{
                          background: "var(--success-light)",
                          color: "var(--success)",
                          fontSize: "12px",
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: "var(--radius-full)",
                          border: "1px solid rgba(39,174,96,0.2)",
                        }}
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      color: "var(--danger)",
                      marginBottom: "10px",
                    }}
                  >
                    ❌ Missing Keywords ({atsResult.missing_keywords?.length || 0})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {(atsResult.missing_keywords || []).map((kw, i) => (
                      <span key={i} className="weakness-tag">{kw}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    color: "var(--warn)",
                    marginBottom: "10px",
                  }}
                >
                  💡 Suggestions to Improve
                </div>
                {(atsResult.suggestions || []).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border)",
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span style={{ color: "var(--warn)", flexShrink: 0 }}>→</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: CHECKLIST ────────────────────────── */}
      {activeTab === "checklist" && (
        <div>
          {/* Progress */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              marginBottom: "24px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontWeight: 700, color: "var(--text)" }}>
                Pre-Submission Checklist
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 800,
                  color: checkedCount === CHECKLIST.length ? "var(--success)" : "var(--primary)",
                }}
              >
                {checkedCount}/{CHECKLIST.length}
              </div>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${(checkedCount / CHECKLIST.length) * 100}%`,
                  background: checkedCount === CHECKLIST.length
                    ? "var(--success)"
                    : "var(--grad-primary)",
                }}
              />
            </div>
            {checkedCount === CHECKLIST.length && (
              <div
                style={{
                  marginTop: "12px",
                  color: "var(--success)",
                  fontWeight: 600,
                  fontSize: "14px",
                }}
              >
                🎉 Your resume is ready to submit!
              </div>
            )}
          </div>

          {/* Checklist items */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "24px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {CHECKLIST.map((item) => (
              <div
                key={item.id}
                className="checklist-item"
                style={{ cursor: "pointer" }}
                onClick={() => toggleCheck(item.id)}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "6px",
                    border: checkedItems[item.id]
                      ? "2px solid var(--success)"
                      : "2px solid var(--border-dark)",
                    background: checkedItems[item.id]
                      ? "var(--success)"
                      : "var(--surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "var(--transition)",
                    fontSize: "13px",
                    color: "white",
                  }}
                >
                  {checkedItems[item.id] && "✓"}
                </div>
                <span
                  style={{
                    textDecoration: checkedItems[item.id] ? "line-through" : "none",
                    color: checkedItems[item.id] ? "var(--muted)" : "var(--text-secondary)",
                    fontSize: "14px",
                    transition: "var(--transition)",
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <button
              className="btn-secondary"
              onClick={() => setCheckedItems({})}
            >
              Reset Checklist
            </button>
          </div>
        </div>
      )}

      {/* ── TAB: RECRUITER VIEW ───────────────────── */}
      {activeTab === "secrets" && (
        <div>
          <div
            style={{
              background: "linear-gradient(135deg, #2d3436, #636e72)",
              borderRadius: "var(--radius-xl)",
              padding: "32px 36px",
              color: "white",
              marginBottom: "32px",
            }}
          >
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>👁️</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "20px",
                fontWeight: 800,
                marginBottom: "8px",
              }}
            >
              Inside the Recruiter's Mind
            </div>
            <div style={{ opacity: 0.8, fontSize: "14px", lineHeight: 1.7 }}>
              Understanding how recruiters think and what they actually look for
              will change the way you write your resume forever.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {RECRUITER_SECRETS.map((secret, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px",
                  boxShadow: "var(--shadow-card)",
                  transition: "var(--transition-slow)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{secret.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  {secret.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.7,
                  }}
                >
                  {secret.desc}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "32px",
              background: "linear-gradient(135deg, #f8f6ff, #f0fdf8)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              padding: "32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>🚀</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "8px",
              }}
            >
              Ready to test your resume in a real mock interview?
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "var(--muted)",
                marginBottom: "20px",
              }}
            >
              Upload your resume and get AI-generated questions based on your skills and projects.
            </div>
            <button
              className="btn-primary"
              style={{ width: "auto", padding: "13px 36px" }}
              onClick={() => navigate("interview")}
            >
              Start Mock Interview →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}