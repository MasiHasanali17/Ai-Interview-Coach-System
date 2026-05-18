import { useEffect, useState } from "react";

// ── Performance label helper ───────────────────────────
function getPerformanceEmoji(score) {
  if (score >= 9)  return "🏆";
  if (score >= 7.5) return "⭐";
  if (score >= 6)  return "✅";
  if (score >= 4)  return "⚠️";
  return "📚";
}

function getRatingColor(rating) {
  switch (rating) {
    case "Elite":       return "#00b894";
    case "Strong":      return "#6c63ff";
    case "Developing":  return "#f39c12";
    case "Needs Work":  return "#e74c3c";
    default:            return "#6c63ff";
  }
}

function getScoreColor(score) {
  if (score >= 8) return "var(--success)";
  if (score >= 6) return "var(--warn)";
  return "var(--danger)";
}

function getPriorityColor(priority) {
  switch (priority) {
    case "high":   return { bg: "#fdecea", color: "#e74c3c" };
    case "medium": return { bg: "#fef9e7", color: "#f39c12" };
    default:       return { bg: "#eaf4fb", color: "#0984e3" };
  }
}

export default function Results({ sessionData, navigate, resetSession }) {
  const {
    finalReport,
    testScores,
    candidateName,
    targetRole,
    level,
    allStrengths,
    allWeaknesses,
  } = sessionData;

  const [animateScore, setAnimateScore] = useState(false);
  const [activeTab,    setActiveTab]    = useState("overview");

  // Trigger score animation on mount
  useEffect(() => {
    const t = setTimeout(() => setAnimateScore(true), 300);
    return () => clearTimeout(t);
  }, []);

  // If no report — redirect to home
  if (!finalReport && (!testScores || testScores.length === 0)) {
    return (
      <div className="results-page">
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-title">No Results Found</div>
          <div className="empty-sub">
            You haven't completed an interview session yet.
          </div>
          <button
            className="btn-primary"
            style={{ width: "auto", margin: "0 auto" }}
            onClick={() => navigate("interview")}
          >
            Start Mock Interview →
          </button>
        </div>
      </div>
    );
  }

  const report       = finalReport || {};
  const overallScore = report.overall_score || 0;
  const rating       = report.rating        || "Developing";
  const ratingColor  = getRatingColor(rating);
  const readiness    = report.readiness_score || Math.round(overallScore * 10);

  // Build category breakdown from testScores
  const categoryData = (testScores || []).map((ts) => ({
    name:    ts.test_name,
    score:   ts.score_out_of_10 || ts.score || 0,
    type:    ts.test_type,
  }));

  const tabs = [
    { id: "overview",  label: "Overview",     icon: "📊" },
    { id: "breakdown", label: "Test Details",  icon: "📋" },
    { id: "strengths", label: "Strengths",     icon: "💪" },
    { id: "studyplan", label: "Study Plan",    icon: "📚" },
  ];

  return (
    <div className="results-page">

      {/* ── HERO ──────────────────────────────────── */}
      <div className="results-hero">
        {/* Confetti emoji bg */}
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "180px", opacity: 0.04, pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🏆
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Score */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: "4px",
              marginBottom: "12px",
            }}
          >
            <div
              className="results-big-score"
              style={{
                transform: animateScore ? "scale(1)" : "scale(0.5)",
                opacity:   animateScore ? 1 : 0,
                transition: "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              {overallScore.toFixed(1)}
            </div>
            <div className="results-score-den">/10</div>
          </div>

          {/* Rating badge */}
          <div
            className="results-rating"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            {getPerformanceEmoji(overallScore)} {rating}
          </div>

          {/* Name + Role */}
          <div
            style={{
              fontSize: "15px",
              opacity: 0.85,
              marginBottom: "12px",
              fontWeight: 600,
            }}
          >
            {candidateName || "Candidate"} — {targetRole}
          </div>

          {/* Summary */}
          <p className="results-summary-text">
            {report.summary || `You completed the ${targetRole} mock interview. Review your detailed feedback below.`}
          </p>

          {/* Readiness badge */}
          <div className="results-ready-badge">
            📅 {report.estimated_ready_in || "Keep practising"}
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ROW ───────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "Overall Score",   value: `${overallScore.toFixed(1)}/10`, color: getScoreColor(overallScore) },
          { label: "Tests Completed", value: `${testScores?.length || 0}/5`,  color: "var(--primary)" },
          { label: "Readiness",       value: `${readiness}%`,                  color: ratingColor },
          { label: "Rating",          value: rating,                            color: ratingColor },
        ].map((stat, i) => (
          <div key={i} className="result-card" style={{ textAlign: "center", padding: "20px" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "28px",
                fontWeight: 800,
                color: stat.color,
                marginBottom: "6px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── TABS ──────────────────────────────────── */}
      <div className="tabs-wrap" style={{ marginBottom: "28px" }}>
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

      {/* ── TAB: OVERVIEW ─────────────────────────── */}
      {activeTab === "overview" && (
        <div className="results-grid">

          {/* Score by Category */}
          <div className="result-card">
            <div className="result-card-title">📊 Score by Test</div>
            {categoryData.map((cat, i) => {
              const pct   = Math.round((cat.score / 10) * 100);
              const color = getScoreColor(cat.score);
              return (
                <div key={i} className="category-bar-wrap">
                  <div className="category-bar-label">
                    <span>{cat.name}</span>
                    <span style={{ color, fontWeight: 700 }}>
                      {cat.score.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: animateScore ? `${pct}%` : "0%",
                        background: color,
                        transition: `width ${0.6 + i * 0.15}s ease`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Placement Readiness */}
          <div className="result-card" style={{ textAlign: "center" }}>
            <div className="result-card-title">🎯 Placement Readiness</div>

            {/* Circular gauge */}
            <div style={{ position: "relative", display: "inline-block", margin: "16px 0" }}>
              <svg width="160" height="100" viewBox="0 0 160 100">
                {/* Track */}
                <path
                  d="M20 90 A70 70 0 0 1 140 90"
                  fill="none"
                  stroke="var(--surface3)"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                {/* Fill */}
                <path
                  d="M20 90 A70 70 0 0 1 140 90"
                  fill="none"
                  stroke={ratingColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${animateScore ? readiness * 2.2 : 0} 1000`}
                  style={{ transition: "stroke-dasharray 1.2s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "28px",
                    fontWeight: 900,
                    color: ratingColor,
                    lineHeight: 1,
                  }}
                >
                  {readiness}%
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                marginBottom: "16px",
              }}
            >
              {readiness >= 80
                ? "🎉 You are interview ready!"
                : readiness >= 60
                ? "💪 Almost there — keep practising!"
                : "📚 More practice needed — you'll get there!"}
            </div>

            <div
              style={{
                display: "inline-block",
                background: ratingColor + "15",
                color: ratingColor,
                border: `1px solid ${ratingColor}30`,
                padding: "6px 18px",
                borderRadius: "var(--radius-full)",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              Ready in: {report.estimated_ready_in || "Keep practising"}
            </div>
          </div>

          {/* Positive Areas */}
          <div className="result-card">
            <div className="result-card-title">✅ Positive Areas</div>
            {(report.positive_areas || allStrengths?.slice(0, 5) || []).map((s, i) => (
              <div key={i} className="strength-item">
                <span className="strength-check">✓</span>
                <span>{s}</span>
              </div>
            ))}
            {(!report.positive_areas || report.positive_areas.length === 0) && (
              <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                Complete the interview to see your strengths.
              </div>
            )}
          </div>

          {/* Negative Areas */}
          <div className="result-card">
            <div className="result-card-title">⚠️ Areas to Improve</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {(report.negative_areas || allWeaknesses?.slice(0, 6) || []).map((w, i) => (
                <span key={i} className="weakness-tag">{w}</span>
              ))}
              {(!report.negative_areas || report.negative_areas.length === 0) && (
                <div style={{ color: "var(--muted)", fontSize: "14px" }}>
                  No major weaknesses detected — great job!
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ── TAB: TEST BREAKDOWN ───────────────────── */}
      {activeTab === "breakdown" && (
        <div className="result-card full">
          <div className="result-card-title">📋 Question-by-Question Breakdown</div>

          {testScores && testScores.length > 0 ? (
            <>
              <div className="breakdown-table">
                <div className="bt-header">
                  <span>#</span>
                  <span>Test Name</span>
                  <span>Type</span>
                  <span>Score</span>
                  <span>Status</span>
                </div>
                {testScores.map((ts, i) => {
                  const sc    = ts.score_out_of_10 || ts.score || 0;
                  const color = getScoreColor(sc);
                  const label =
                    sc >= 8 ? "Excellent" :
                    sc >= 6 ? "Good"      :
                    sc >= 4 ? "Average"   : "Needs Work";

                  return (
                    <div key={i} className="bt-row">
                      <span className="bt-num">{i + 1}</span>
                      <span className="bt-q">{ts.test_name}</span>
                      <span>
                        <span
                          className={`question-type-badge badge-${
                            ts.test_type === "mcq_technical" ? "technical" :
                            ts.test_type === "written"       ? "written"   :
                            ts.test_type === "aptitude"      ? "aptitude"  :
                            ts.test_type === "soft_skills"   ? "softskill" : "project"
                          }`}
                        >
                          {ts.test_type?.replace("_", " ")}
                        </span>
                      </span>
                      <span
                        className="bt-score"
                        style={{ color, fontWeight: 700 }}
                      >
                        {sc.toFixed(1)}/10
                      </span>
                      <span>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 10px",
                            borderRadius: "var(--radius-full)",
                            background: color + "18",
                            color,
                          }}
                        >
                          {label}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Bar chart per test */}
              <div
                style={{
                  marginTop: "32px",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: "16px",
                }}
              >
                {testScores.map((ts, i) => {
                  const sc    = ts.score_out_of_10 || ts.score || 0;
                  const color = getScoreColor(sc);
                  const pct   = Math.round(sc * 10);

                  return (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          height: "120px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          background: "var(--surface2)",
                          borderRadius: "var(--radius)",
                          overflow: "hidden",
                          marginBottom: "8px",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            background: color + "30",
                            height: animateScore ? `${pct}%` : "0%",
                            transition: `height ${0.6 + i * 0.15}s ease`,
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            paddingTop: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize: "16px",
                              fontWeight: 800,
                              color,
                            }}
                          >
                            {sc.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--muted)",
                          lineHeight: 1.3,
                        }}
                      >
                        {ts.test_name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">📭</div>
              <div className="empty-title">No test data available</div>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: STRENGTHS ────────────────────────── */}
      {activeTab === "strengths" && (
        <div className="results-grid">
          {/* Strengths */}
          <div className="result-card">
            <div className="result-card-title">💪 Your Strengths</div>
            {(report.positive_areas || []).concat(allStrengths || [])
              .filter((v, i, a) => a.indexOf(v) === i)
              .slice(0, 8)
              .map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "var(--success)", fontSize: "16px", flexShrink: 0 }}>✓</span>
                  {s}
                </div>
              ))}
          </div>

          {/* Weaknesses */}
          <div className="result-card">
            <div className="result-card-title">🎯 Areas to Improve</div>
            {(report.negative_areas || []).concat(allWeaknesses || [])
              .filter((v, i, a) => a.indexOf(v) === i)
              .slice(0, 8)
              .map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 0",
                    borderBottom: "1px solid var(--border)",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  <span style={{ color: "var(--danger)", fontSize: "16px", flexShrink: 0 }}>✗</span>
                  {w}
                </div>
              ))}
          </div>

          {/* Skill radar — simple visual */}
          <div className="result-card full">
            <div className="result-card-title">📈 Performance Heatmap</div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              {(testScores || []).map((ts, i) => {
                const sc    = ts.score_out_of_10 || ts.score || 0;
                const color = getScoreColor(sc);
                const bg    =
                  sc >= 8 ? "var(--success-light)" :
                  sc >= 6 ? "var(--warn-light)"    : "var(--danger-light)";

                return (
                  <div
                    key={i}
                    style={{
                      background: bg,
                      border: `1px solid ${color}30`,
                      borderRadius: "var(--radius)",
                      padding: "20px 16px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "32px",
                        fontWeight: 900,
                        color,
                        lineHeight: 1,
                        marginBottom: "8px",
                      }}
                    >
                      {sc.toFixed(1)}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color, opacity: 0.8 }}>
                      {ts.test_name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: STUDY PLAN ───────────────────────── */}
      {activeTab === "studyplan" && (
        <div>
          {report.study_plan && report.study_plan.length > 0 ? (
            <>
              <div
                style={{
                  background: "linear-gradient(135deg, #667eea20, #764ba220)",
                  border: "1px solid var(--primary-light)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 24px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <span style={{ fontSize: "28px" }}>📚</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>
                    Your Personalised Study Plan
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--muted)" }}>
                    Based on your performance, focus on these topics to get placement-ready
                  </div>
                </div>
              </div>

              <div className="study-grid">
                {report.study_plan.map((item, i) => {
                  const pColor = getPriorityColor(item.priority);
                  return (
                    <div key={i} className="study-item">
                      <div
                        className="study-priority"
                        style={{ background: pColor.bg, color: pColor.color }}
                      >
                        {item.priority} priority
                      </div>
                      <div className="study-topic">{item.topic}</div>
                      <div className="study-resource">{item.resource}</div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly plan suggestion */}
              <div
                style={{
                  marginTop: "32px",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "28px",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="result-card-title" style={{ marginBottom: "20px" }}>
                  📅 Suggested Weekly Schedule
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {[
                    { day: "Monday",    task: "Technical Concepts", icon: "💻" },
                    { day: "Tuesday",   task: "DSA Practice",        icon: "🧮" },
                    { day: "Wednesday", task: "Mock Interview",       icon: "🎯" },
                    { day: "Thursday",  task: "Soft Skills",          icon: "🤝" },
                    { day: "Friday",    task: "Company Research",     icon: "🏢" },
                    { day: "Saturday",  task: "Project Work",         icon: "🚀" },
                    { day: "Sunday",    task: "Revision + Rest",      icon: "📖" },
                  ].map((d, i) => (
                    <div
                      key={i}
                      style={{
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "14px 12px",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "22px", marginBottom: "6px" }}>{d.icon}</div>
                      <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--primary)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {d.day}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>
                        {d.task}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <div className="empty-title">No study plan generated</div>
              <div className="empty-sub">Complete the full interview to get your personalised study plan.</div>
            </div>
          )}
        </div>
      )}

      {/* ── ACTION BUTTONS ────────────────────────── */}
      <div className="results-actions">
        <div
          style={{
            display: "flex",
            gap: "16px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-secondary"
            onClick={() => navigate("roadmap")}
          >
            🗺️ View Career Roadmap
          </button>
          <button
            className="btn-restart"
            onClick={() => {
              resetSession();
              navigate("interview");
            }}
          >
            🔄 Try Again with New Questions
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("home")}
          >
            🏠 Back to Home
          </button>
        </div>

        {/* Motivational close */}
        <div
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "linear-gradient(135deg, #f8f6ff, #f0fdf8)",
            borderRadius: "var(--radius-lg)",
            textAlign: "center",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "10px" }}>💪</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "8px",
            }}
          >
            {overallScore >= 7
              ? "You're on the right track! Keep it up."
              : "Every expert was once a beginner. Keep practising!"}
          </div>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            Attempt the interview again to see your improvement 🚀
          </div>
        </div>
      </div>
    </div>
  );
}