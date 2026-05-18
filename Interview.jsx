import { useState, useEffect, useRef } from "react";
import {
  extractPDFText,
  validatePDF,
  summarizeResume,
  generateTechnicalMCQs,
  generateWrittenQuestions,
  generateAptitudeQuestions,
  generateSoftSkillQuestions,
  generateProjectQuestions,
  scoreMCQAnswers,
  evaluateWrittenAnswer,
  evaluateSoftSkillAnswer,
  evaluateProjectAnswer,
  generateFinalReport,
} from "../api/client";

// ── Test metadata ──────────────────────────────────────
const TESTS = [
  { id: 1, key: "mcq_technical", name: "Technical MCQs",    icon: "💻", desc: "12 multiple choice questions",       time: 25 * 60 },
  { id: 2, key: "written",       name: "Written Answers",   icon: "✍️", desc: "4 detailed written questions",      time: 30 * 60 },
  { id: 3, key: "aptitude",      name: "Aptitude Test",     icon: "🧠", desc: "10 logical reasoning questions",    time: 20 * 60 },
  { id: 4, key: "soft_skills",   name: "Soft Skills",       icon: "🤝", desc: "5 scenario-based HR questions",     time: 20 * 60 },
  { id: 5, key: "project",       name: "Project Deep Dive", icon: "🚀", desc: "4 questions about your projects",   time: 15 * 60 },
];

const ROLES = [
  "Data Scientist", "Machine Learning Engineer", "Software Engineer",
  "Data Analyst", "Backend Developer", "Full Stack Developer",
  "Frontend Developer", "Product Manager", "DevOps Engineer",
];

const LEVELS = [
  { value: "fresher", label: "Fresher (0–1 yr)" },
  { value: "junior",  label: "Junior (1–3 yrs)" },
  { value: "mid",     label: "Mid-level (3–5 yrs)" },
];

export default function Interview({ navigate, sessionData, updateSession, resetSession }) {

  // ── Local UI state ─────────────────────────────────
  const [step,           setStep]           = useState("upload");
  // Steps: upload → summary → test → result

  const [form, setForm] = useState({
    name:  "",
    role:  "Data Scientist",
    level: "fresher",
  });

  const [uploadStatus,    setUploadStatus]    = useState("idle");
  // idle | parsing | done | error

  const [loading,         setLoading]         = useState(false);
  const [loadingMsg,      setLoadingMsg]       = useState("");
  const [resumeSummary,   setResumeSummary]    = useState(null);
  const [currentTest,     setCurrentTest]      = useState(1);
  const [questions,       setQuestions]        = useState([]);
  const [currentQ,        setCurrentQ]         = useState(0);
  const [selectedOption,  setSelectedOption]   = useState(null);
  const [writtenAnswer,   setWrittenAnswer]    = useState("");
  const [showExplanation, setShowExplanation]  = useState(false);
  const [answerFeedback,  setAnswerFeedback]   = useState(null);
  const [isEvaluating,    setIsEvaluating]     = useState(false);
  const [timeLeft,        setTimeLeft]         = useState(0);
  const [testAnswers,     setTestAnswers]       = useState([]);
  const [testScores,      setTestScores]        = useState([]);
  const [allStrengths,    setAllStrengths]      = useState([]);
  const [allWeaknesses,   setAllWeaknesses]     = useState([]);
  const [skippedTests,    setSkippedTests]      = useState([]);
  const [interviewId]                           = useState(
    "PR-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  );

  const timerRef    = useRef(null);
  const fileInputRef = useRef(null);

  // ── Timer logic ────────────────────────────────────
  useEffect(() => {
    if (step !== "test" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [step, currentTest]);

  function handleTimeUp() {
    // Auto move to next test when time runs out
    handleTestComplete();
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  const timePercent = questions.length > 0
    ? (timeLeft / (TESTS.find((t) => t.id === currentTest)?.time || 1200)) * 100
    : 100;

  const timerClass =
    timeLeft < 120 ? "danger" :
    timeLeft < 300 ? "warning" : "";

  // ── Handle PDF Upload ──────────────────────────────
  async function handleFileSelect(file) {
    const validation = validatePDF(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadStatus("parsing");

    try {
      const text = await extractPDFText(file);
      updateSession({ resumeText: text });
      setUploadStatus("done");
    } catch (err) {
      console.error(err);
      setUploadStatus("error");
    }
  }

  // ── Start Interview ────────────────────────────────
  async function handleStart() {
    if (!form.name.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);
    setLoadingMsg("Reading your resume with AI...");

    try {
      // Parse resume (or use empty data if no resume)
      let resumeData;
      if (sessionData.resumeText) {
        resumeData = await summarizeResume(
          sessionData.resumeText,
          form.role
        );
      } else {
        resumeData = {
          name:             form.name,
          skills:           ["Python", "SQL", "Communication"],
          projects:         [],
          experience_level: form.level,
          education:        "Not provided",
          summary:          `${form.name} is a ${form.level} candidate targeting ${form.role} role.`,
        };
      }

      updateSession({
        candidateName: form.name,
        targetRole:    form.role,
        level:         form.level,
        resumeData,
      });

      setResumeSummary(resumeData);
      setStep("summary");
    } catch (err) {
      console.error(err);
      alert("Failed to process resume. Please check if backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  }

  // ── Load questions for a test ──────────────────────
  async function loadTest(testNum) {
    const test      = TESTS.find((t) => t.id === testNum);
    const resumeData = sessionData.resumeData || resumeSummary;

    setLoading(true);
    setLoadingMsg(`Generating ${test.name} questions with AI...`);
    setCurrentQ(0);
    setSelectedOption(null);
    setWrittenAnswer("");
    setShowExplanation(false);
    setAnswerFeedback(null);
    setTestAnswers([]);
    clearInterval(timerRef.current);
    setTimeLeft(test.time);

    try {
      let data;

      if (testNum === 1) data = await generateTechnicalMCQs(resumeData, form.role);
      if (testNum === 2) data = await generateWrittenQuestions(resumeData, form.role);
      if (testNum === 3) data = await generateAptitudeQuestions(resumeData, form.role);
      if (testNum === 4) data = await generateSoftSkillQuestions(resumeData, form.role);
      if (testNum === 5) data = await generateProjectQuestions(resumeData, form.role);

      // Auto-skip Test 5 if no project questions returned
      if (testNum === 5 && (!data.questions || data.questions.length === 0)) {
        setSkippedTests((s) => [...s, 5]);
        await finishAllTests([...testScores]);
        return;
      }

      setQuestions(data.questions || []);
      setCurrentTest(testNum);
      setStep("test");
    } catch (err) {
      console.error(err);
      alert(`Failed to load Test ${testNum}. Check backend connection.`);
    } finally {
      setLoading(false);
    }
  }

  // ── Handle MCQ Answer ─────────────────────────────
  function handleMCQSelect(label) {
    if (showExplanation) return; // already answered
    setSelectedOption(label);
  }

  function handleMCQConfirm() {
    if (!selectedOption) return;
    const q          = questions[currentQ];
    const isCorrect  = selectedOption === q.correct_answer;

    setShowExplanation(true);
    setTestAnswers((prev) => [...prev, isCorrect]);
  }

  // ── Handle Written / Soft / Project Submit ─────────
  async function handleWrittenSubmit() {
    if (!writtenAnswer.trim() || isEvaluating) return;

    setIsEvaluating(true);
    const q = questions[currentQ];

    try {
      let feedback;
      const testMeta = TESTS.find((t) => t.id === currentTest);

      if (currentTest === 2) {
        feedback = await evaluateWrittenAnswer(
          q.question, writtenAnswer, q.key_points || [],
          form.role, form.level
        );
      } else if (currentTest === 4) {
        feedback = await evaluateSoftSkillAnswer(
          q.scenario, q.question, writtenAnswer, form.role
        );
      } else if (currentTest === 5) {
        feedback = await evaluateProjectAnswer(
          q.question, writtenAnswer, form.role, form.level
        );
      }

      setAnswerFeedback(feedback);
      setTestAnswers((prev) => [...prev, feedback.score]);

      // Collect strengths and weaknesses globally
      if (feedback.strengths) setAllStrengths((s) => [...s, ...feedback.strengths]);
      if (feedback.weaknesses) setAllWeaknesses((w) => [...w, ...feedback.weaknesses]);

    } catch (err) {
      console.error(err);
      alert("Evaluation failed. Check backend.");
    } finally {
      setIsEvaluating(false);
    }
  }

  // ── Move to Next Question ──────────────────────────
  function handleNextQuestion() {
    if (currentQ + 1 >= questions.length) {
      handleTestComplete();
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedOption(null);
      setWrittenAnswer("");
      setShowExplanation(false);
      setAnswerFeedback(null);
    }
  }

  // ── Complete a Test ────────────────────────────────
  async function handleTestComplete() {
    clearInterval(timerRef.current);

    const test       = TESTS.find((t) => t.id === currentTest);
    const isMCQ      = currentTest === 1 || currentTest === 3;
    const answers    = [...testAnswers];

    // Calculate score
    let scoreVal;
    if (isMCQ) {
      const correct = answers.filter(Boolean).length;
      scoreVal      = (correct / questions.length) * 10;
    } else {
      scoreVal = answers.length > 0
        ? answers.reduce((a, b) => a + b, 0) / answers.length
        : 0;
    }

    const newScore = {
      test_name:        test.name,
      test_type:        test.key,
      score:            parseFloat(scoreVal.toFixed(1)),
      total:            10,
      percentage:       parseFloat((scoreVal * 10).toFixed(1)),
      score_out_of_10:  parseFloat(scoreVal.toFixed(1)),
    };

    const updatedScores = [...testScores, newScore];
    setTestScores(updatedScores);

    // Move to next test or finish
    const nextTest = currentTest + 1;
    if (nextTest <= 5) {
      setCurrentTest(nextTest);
      await loadTest(nextTest);
    } else {
      await finishAllTests(updatedScores);
    }
  }

  // ── Generate Final Report ──────────────────────────
  async function finishAllTests(scores) {
    setLoading(true);
    setLoadingMsg("Generating your placement report...");

    try {
      const report = await generateFinalReport(
        form.name,
        form.role,
        form.level,
        scores,
        [...new Set(allWeaknesses)],
        [...new Set(allStrengths)]
      );

      updateSession({
        finalReport:  report,
        testScores:   scores,
        allStrengths: [...new Set(allStrengths)],
        allWeaknesses:[...new Set(allWeaknesses)],
      });

      navigate("results");
    } catch (err) {
      console.error(err);
      alert("Failed to generate report.");
    } finally {
      setLoading(false);
    }
  }

  // ── RENDER: Loading ────────────────────────────────
  if (loading) {
    return (
      <div className="interview-page">
        <div className="loading-wrap">
          <div className="spinner" />
          <div className="loading-title">{loadingMsg}</div>
          <div className="loading-sub">
            Powered by Gemini AI — this takes 10-20 seconds
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER: Upload Step ────────────────────────────
  if (step === "upload") {
    return (
      <div className="interview-page">
        <div className="interview-page-title">Mock Interview</div>
        <div className="interview-page-sub">
          Upload your resume and start a personalised AI interview session
        </div>

        {/* Interview ID */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "var(--primary-light)", color: "var(--primary)",
            padding: "6px 16px", borderRadius: "var(--radius-full)",
            fontSize: "13px", fontWeight: 600, marginBottom: "28px",
          }}
        >
          🎫 Interview ID: {interviewId}
        </div>

        <div className="upload-card">
          <div className="upload-card-title">Your Details</div>
          <div className="upload-card-sub">
            Tell us about yourself so we can personalise your interview
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Your Full Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Role + Level */}
          <div className="form-row-two">
            <div className="form-group">
              <label className="form-label">Target Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Experience Level</label>
              <select
                className="form-select"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* PDF Upload */}
          <div className="form-group">
            <label className="form-label">Resume PDF (Optional but Recommended)</label>
            <div
              className={`upload-zone ${uploadStatus}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileSelect(file);
              }}
            >
              {uploadStatus === "idle" && (
                <>
                  <div className="upload-icon">📄</div>
                  <div className="upload-title">Drop your resume here</div>
                  <div className="upload-sub">or click to browse — PDF only, max 5MB</div>
                </>
              )}
              {uploadStatus === "parsing" && (
                <>
                  <div className="upload-icon">⏳</div>
                  <div className="upload-title">Reading your resume...</div>
                </>
              )}
              {uploadStatus === "done" && (
                <>
                  <div className="upload-icon">✅</div>
                  <div className="upload-success">Resume uploaded successfully!</div>
                  <div className="upload-sub" style={{ marginTop: "6px" }}>
                    Click to upload a different file
                  </div>
                </>
              )}
              {uploadStatus === "error" && (
                <>
                  <div className="upload-icon">❌</div>
                  <div className="upload-error">Upload failed. Try again.</div>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
            </div>
          </div>

          {/* What to expect */}
          <div
            style={{
              background: "var(--surface2)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", padding: "16px 20px",
              marginBottom: "24px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: "12px" }}>
              📋 What to expect in this session:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {TESTS.map((t) => (
                <div
                  key={t.id}
                  style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)" }}
                >
                  <span>{t.icon}</span>
                  <span>Test {t.id}: {t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? "Processing..." : "Start Interview →"}
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER: Summary Step ───────────────────────────
  if (step === "summary") {
    const rd = resumeSummary;
    return (
      <div className="summary-page">
        <div className="interview-page-title">Resume Summary</div>
        <div className="interview-page-sub">
          Here's how AI reads your resume — this is what a recruiter sees in 6 seconds
        </div>

        {/* Hero */}
        <div className="summary-hero">
          <div className="summary-candidate-name">
            👋 Hello, {rd?.name || form.name}!
          </div>
          <div className="summary-role-badge">
            🎯 Targeting: {form.role}
          </div>
          <div className="summary-education">
            🎓 {rd?.education || "Education not found in resume"}
          </div>
        </div>

        <div className="summary-body">
          {/* Main — AI Summary */}
          <div className="summary-main-card">
            <div className="summary-card-title">
              🤖 AI Summary
            </div>
            <div className="summary-text">
              {rd?.summary
                ? rd.summary.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))
                : <p>Resume summary not available.</p>
              }
            </div>
          </div>

          {/* Side — Skills + Projects */}
          <div>
            <div className="summary-side-card" style={{ marginBottom: "20px" }}>
              <div className="summary-card-title">⚡ Skills Found</div>
              <div className="summary-skills-wrap">
                {rd?.skills?.length > 0
                  ? rd.skills.map((sk) => (
                      <span key={sk} className="skill-chip">{sk}</span>
                    ))
                  : <span style={{ color: "var(--muted)", fontSize: "13px" }}>No skills extracted</span>
                }
              </div>
            </div>

            <div className="summary-side-card">
              <div className="summary-card-title">🚀 Projects</div>
              {rd?.projects?.length > 0
                ? rd.projects.map((p, i) => (
                    <div key={i} className="summary-project-item">
                      <div className="summary-project-name">{p.name}</div>
                      <div className="summary-project-desc">{p.description}</div>
                    </div>
                  ))
                : <div style={{ color: "var(--muted)", fontSize: "13px" }}>
                    No projects found — Test 5 will be skipped automatically
                  </div>
              }
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="summary-actions">
          <button
            className="btn-secondary"
            onClick={() => setStep("upload")}
          >
            ← Change Resume
          </button>
          <button
            className="btn-primary"
            style={{ width: "auto", padding: "14px 40px" }}
            onClick={() => loadTest(1)}
          >
            Begin Interview → Test 1
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER: Test Step ──────────────────────────────
  if (step === "test") {
    const test = TESTS.find((t) => t.id === currentTest);
    const q    = questions[currentQ];
    const isMCQ = currentTest === 1 || currentTest === 3;

    if (!q) {
      return (
        <div className="test-page">
          <div className="loading-wrap">
            <div className="spinner" />
            <div className="loading-title">Loading questions...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="test-page">

        {/* ── Test Progress Steps ─────────────────── */}
        <div className="test-progress">
          {TESTS.map((t, i) => (
            <div key={t.id} className="test-step">
              <div style={{ position: "relative" }}>
                <div
                  className={`test-step-circle ${
                    t.id < currentTest  ? "done"   :
                    t.id === currentTest ? "active" : ""
                  }`}
                >
                  {t.id < currentTest ? "✓" : t.id}
                  <span className="test-step-label">{t.name.split(" ")[0]}</span>
                </div>
              </div>
              {i < TESTS.length - 1 && (
                <div
                  className={`test-step-line ${t.id < currentTest ? "done" : ""}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Timer Bar ──────────────────────────── */}
        <div className="timer-bar">
          <div className="timer-left">
            <span className="timer-icon">⏱️</span>
            <div>
              <div className="timer-label">{test.name}</div>
            </div>
          </div>

          <div className="timer-progress-track">
            <div
              className={`timer-progress-fill ${timerClass}`}
              style={{ width: `${timePercent}%` }}
            />
          </div>

          <div className={`timer-display ${timerClass}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* ── Question Card ──────────────────────── */}
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">
              Question {currentQ + 1} of {questions.length}
            </span>
            <span className={`question-type-badge badge-${
              currentTest === 1 ? "technical" :
              currentTest === 2 ? "written"   :
              currentTest === 3 ? "aptitude"  :
              currentTest === 4 ? "softskill" : "project"
            }`}>
              {test.name}
            </span>
          </div>

          {/* Scenario (for soft skills) */}
          {q.scenario && (
            <div className="question-scenario">
              <strong>Scenario:</strong> {q.scenario}
            </div>
          )}

          {/* Question text */}
          <div className="question-text">
            {q.question}
          </div>

          {/* ── MCQ Options ──────────────────────── */}
          {isMCQ && (
            <>
              <div className="mcq-options">
                {q.options?.map((opt) => {
                  let cls = "";
                  if (showExplanation) {
                    if (opt.label === q.correct_answer) cls = "correct";
                    else if (opt.label === selectedOption) cls = "wrong";
                  } else if (opt.label === selectedOption) {
                    cls = "selected";
                  }

                  return (
                    <button
                      key={opt.label}
                      className={`mcq-option ${cls}`}
                      onClick={() => handleMCQSelect(opt.label)}
                      disabled={showExplanation}
                    >
                      <span className="mcq-option-label">{opt.label}</span>
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && q.explanation && (
                <div className="explanation-box">
                  <strong>💡 Explanation:</strong> {q.explanation}
                </div>
              )}

              {/* Confirm / Next */}
              <div className="question-nav" style={{ marginTop: "24px" }}>
                <div className="question-nav-dots">
                  {questions.map((_, i) => (
                    <div
                      key={i}
                      className={`q-dot ${
                        i < currentQ    ? "answered" :
                        i === currentQ  ? "current"  : ""
                      }`}
                    />
                  ))}
                </div>

                {!showExplanation ? (
                  <button
                    className="btn-primary"
                    style={{ width: "auto", padding: "12px 28px" }}
                    onClick={handleMCQConfirm}
                    disabled={!selectedOption}
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    className="btn-primary"
                    style={{ width: "auto", padding: "12px 28px" }}
                    onClick={handleNextQuestion}
                  >
                    {currentQ + 1 >= questions.length
                      ? "Finish Test →"
                      : "Next Question →"}
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Written / Soft / Project Answer ─── */}
          {!isMCQ && (
            <div className="written-answer-wrap">
              {!answerFeedback ? (
                <>
                  <textarea
                    className="answer-textarea"
                    placeholder="Type your detailed answer here..."
                    value={writtenAnswer}
                    onChange={(e) => setWrittenAnswer(e.target.value)}
                    disabled={isEvaluating}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "8px",
                    }}
                  >
                    <div className="answer-hint">
                      💡 Be specific. Use examples. Show your depth of knowledge.
                    </div>
                    <div className="word-count">
                      {writtenAnswer.trim().split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>

                  <button
                    className="btn-primary"
                    style={{ marginTop: "16px" }}
                    onClick={handleWrittenSubmit}
                    disabled={!writtenAnswer.trim() || isEvaluating}
                  >
                    {isEvaluating ? "⏳ AI Evaluating..." : "Submit Answer →"}
                  </button>
                </>
              ) : (
                <>
                  {/* Feedback Card */}
                  <FeedbackCard feedback={answerFeedback} />

                  <div className="question-nav" style={{ marginTop: "24px" }}>
                    <div className="question-nav-dots">
                      {questions.map((_, i) => (
                        <div
                          key={i}
                          className={`q-dot ${
                            i < currentQ    ? "answered" :
                            i === currentQ  ? "current"  : ""
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      className="btn-primary"
                      style={{ width: "auto", padding: "12px 28px" }}
                      onClick={handleNextQuestion}
                    >
                      {currentQ + 1 >= questions.length
                        ? "Finish Test →"
                        : "Next Question →"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// ── Inline FeedbackCard component ─────────────────────
function FeedbackCard({ feedback }) {
  if (!feedback) return null;
  const { score, verdict, strengths, weaknesses, suggestion, missed_concepts } = feedback;
  const cls   = score >= 8 ? "high" : score >= 6 ? "mid" : "low";
  const color = cls === "high" ? "var(--success)" : cls === "mid" ? "var(--warn)" : "var(--danger)";

  return (
    <div className="feedback-card">
      <div className="feedback-score-row">
        <div className="score-circle" style={{ borderColor: color }}>
          <span className="score-num" style={{ color }}>{score}</span>
          <span className="score-den">/10</span>
        </div>
        <div>
          <div className="feedback-verdict">{verdict}</div>
          <div className="feedback-verdict-sub">Score: {score}/10</div>
        </div>
      </div>

      {strengths?.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-section-title">Strengths</div>
          {strengths.map((s, i) => (
            <div key={i} className="feedback-item good">
              <span className="feedback-bullet">✓</span> {s}
            </div>
          ))}
        </div>
      )}

      {weaknesses?.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-section-title">Gaps</div>
          {weaknesses.map((w, i) => (
            <div key={i} className="feedback-item bad">
              <span className="feedback-bullet">✗</span> {w}
            </div>
          ))}
        </div>
      )}

      {missed_concepts?.length > 0 && (
        <div className="feedback-section">
          <div className="feedback-section-title">Missed Concepts</div>
          <div className="missed-chips">
            {missed_concepts.map((c, i) => (
              <span key={i} className="missed-chip">{c}</span>
            ))}
          </div>
        </div>
      )}

      {suggestion && (
        <div className="feedback-section">
          <div className="feedback-section-title">Tip</div>
          <div className="feedback-item tip">
            <span className="feedback-bullet">→</span> {suggestion}
          </div>
        </div>
      )}
    </div>
  );
}