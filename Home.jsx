import { useState, useEffect } from "react";

// ── Motivational quotes for popup ─────────────────────
const QUOTES = [
  {
    emoji: "🎯",
    quote: "Be Prepared. Be Placed.",
    sub: "Every expert was once a beginner. Start your preparation today and walk into your dream company with confidence.",
    btn: "Let's Begin →",
  },
  {
    emoji: "🚀",
    quote: "Your Dream Job is One Interview Away.",
    sub: "Thousands of students got placed after practising here. You're next. The only thing between you and your offer letter is preparation.",
    btn: "I'm Ready →",
  },
  {
    emoji: "💡",
    quote: "Practice Like It's Real. Perform Like a Pro.",
    sub: "Our AI evaluates you the same way a real interviewer would — no mercy, no shortcuts. Just honest feedback that makes you better.",
    btn: "Start Practising →",
  },
];

// ── Feature cards data ─────────────────────────────────
const FEATURES = [
  {
    icon: "🎯",
    color: "#6c63ff",
    bg: "#ede9ff",
    title: "Mock Interview",
    desc: "Upload your resume and go through 5 rounds — Technical MCQs, Written answers, Aptitude, Soft Skills, and Project deep dive. Just like a real interview.",
    page: "interview",
    tag: "AI Powered",
  },
  {
    icon: "💡",
    color: "#00b894",
    bg: "#e0faf4",
    title: "Interview Guidance",
    desc: "Master the STAR method, body language tips, HR round strategies, and common mistakes freshers make. Everything in one place.",
    page: "guidance",
    tag: "Must Read",
  },
  {
    icon: "📄",
    color: "#e17055",
    bg: "#fef0ec",
    title: "Resume Tips",
    desc: "Check your ATS score, see good vs bad resume examples, and get a recruiter's perspective on what makes a resume stand out.",
    page: "resumetips",
    tag: "ATS Checker",
  },
  {
    icon: "🏢",
    color: "#0984e3",
    bg: "#e8f4fd",
    title: "Company Prep",
    desc: "Know exactly what TCS, Infosys, Google, Amazon and top startups look for. Interview patterns, difficulty ratings, and insider tips.",
    page: "company",
    tag: "Top Companies",
  },
  {
    icon: "🗺️",
    color: "#6c5ce7",
    bg: "#f0eeff",
    title: "Career Roadmap",
    desc: "Visual step-by-step roadmaps for 14 career paths — Data Science, ML, Web Dev, DevOps, and more. Know exactly what to learn and when.",
    page: "roadmap",
    tag: "14 Paths",
  },
  {
    icon: "📊",
    color: "#00cec9",
    bg: "#e0fafa",
    title: "Score & Feedback",
    desc: "Every answer you give is scored by AI out of 10. Get strengths, weaknesses, missed concepts and a personalised study plan.",
    page: "interview",
    tag: "Detailed Report",
  },
];

// ── Testimonials ──────────────────────────────────────
const TESTIMONIALS = [
  {
    stars: "★★★★★",
    text: "I was nervous about interviews but after 3 mock sessions here, I got placed at TCS Digital. The AI feedback was brutally honest — exactly what I needed.",
    name: "Rahul Sharma",
    role: "Placed at TCS Digital",
    avatar: "R",
    avatarBg: "#6c63ff",
  },
  {
    stars: "★★★★★",
    text: "The roadmap feature helped me figure out exactly what to learn for Data Science. Got a call from Infosys within 2 months of following it.",
    name: "Priya Patel",
    role: "Data Analyst at Infosys",
    avatar: "P",
    avatarBg: "#00b894",
  },
  {
    stars: "★★★★★",
    text: "Project-based questions caught me off guard at first — I couldn't explain my own projects! After practising here, I aced the interview at a Bangalore startup.",
    name: "Arjun Mehta",
    role: "SDE at Startup, Bangalore",
    avatar: "A",
    avatarBg: "#e17055",
  },
];

// ── Stats ─────────────────────────────────────────────
const STATS = [
  { num: "2,400+", label: "Students Prepared" },
  { num: "89%",    label: "Placement Rate" },
  { num: "5",      label: "Interview Rounds" },
  { num: "14",     label: "Career Roadmaps" },
];

export default function Home({ navigate }) {
  const [showPopup,   setShowPopup]   = useState(false);
  const [quoteIndex,  setQuoteIndex]  = useState(0);
  const [popupDone,   setPopupDone]   = useState(false);

  // Show popup 800ms after page loads
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto cycle quotes in popup every 3 seconds
  useEffect(() => {
    if (!showPopup) return;
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [showPopup]);

  function closePopup() {
    setShowPopup(false);
    setPopupDone(true);
  }

  function handlePopupCTA() {
    closePopup();
    setTimeout(() => navigate("interview"), 300);
  }

  const quote = QUOTES[quoteIndex];

  return (
    <div className="home-page">

      {/* ── MOTIVATIONAL POPUP ─────────────────────── */}
      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className="popup-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "20px",
                cursor: "pointer",
                color: "var(--muted)",
                lineHeight: 1,
              }}
            >
              ✕
            </button>

            <span className="popup-emoji">{quote.emoji}</span>
            <div className="popup-quote">{quote.quote}</div>
            <div className="popup-sub">{quote.sub}</div>

            <button className="popup-btn" onClick={handlePopupCTA}>
              {quote.btn}
            </button>

            {/* Dots */}
            <div className="popup-dots">
              {QUOTES.map((_, i) => (
                <div
                  key={i}
                  className={`popup-dot ${i === quoteIndex ? "active" : ""}`}
                  onClick={() => setQuoteIndex(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── HERO SECTION ───────────────────────────── */}
      <section className="hero-section">
        {/* Background blobs */}
        <div className="hero-bg-blob hero-bg-blob-1" />
        <div className="hero-bg-blob hero-bg-blob-2" />
        <div className="hero-bg-blob hero-bg-blob-3" />

        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            AI-Powered Placement Preparation
          </div>

          {/* Title */}
          <h1 className="hero-title">
            Get Placed.{" "}
            <span className="hero-title-gradient">Get Hired.</span>
            <br />
            Get There.
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            India's smartest AI mock interview platform. Upload your resume,
            take 5 real interview rounds, and get honest AI feedback — just
            like a real recruiter would give you.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button
              className="btn-hero-primary"
              onClick={() => navigate("interview")}
            >
              <span>🚀</span> Start Mock Interview
            </button>
            <button
              className="btn-hero-secondary"
              onClick={() => navigate("roadmap")}
            >
              View Career Roadmaps
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {STATS.map((stat, i) => (
              <div key={i} className="hero-stat">
                <div className="hero-stat-num">{stat.num}</div>
                <div className="hero-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ───────────────────────── */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-tag">Everything You Need</div>
          <h2 className="section-title">
            Your Complete Placement Toolkit
          </h2>
          <p className="section-sub">
            From mock interviews to career roadmaps — everything a fresher
            needs to crack placements in one place.
          </p>
        </div>

        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              onClick={() => navigate(f.page)}
            >
              {/* Tag */}
              <div style={{ marginBottom: "16px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    background: f.bg,
                    color: f.color,
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {f.tag}
                </span>
              </div>

              {/* Icon */}
              <div
                className="feature-icon-wrap"
                style={{ background: f.bg }}
              >
                {f.icon}
              </div>

              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>

              <div className="feature-link" style={{ color: f.color }}>
                Explore {f.title} <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #f8f6ff 0%, #f0fdf8 100%)",
          padding: "100px 40px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="section-header">
            <div className="section-tag">Simple Process</div>
            <h2 className="section-title">How PlaceReady Works</h2>
            <p className="section-sub">
              From resume upload to final placement report — 5 steps, 5 tests,
              1 result.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "24px",
              marginTop: "48px",
            }}
          >
            {[
              { step: "01", icon: "📄", title: "Upload Resume",    desc: "Upload your PDF resume. AI reads and understands your skills and projects." },
              { step: "02", icon: "🔍", title: "Resume Summary",   desc: "See how your resume looks to a recruiter — summarized by AI." },
              { step: "03", icon: "📝", title: "5 Interview Tests", desc: "Technical, Written, Aptitude, Soft Skills, and Project rounds." },
              { step: "04", icon: "🤖", title: "AI Evaluates",     desc: "Every answer scored by Gemini AI with honest feedback." },
              { step: "05", icon: "🏆", title: "Get Your Report",  desc: "Score out of 10, strengths, weaknesses, and a personalised study plan." },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "24px 20px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-card)",
                  transition: "var(--transition-slow)",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-card)";
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    color: "var(--primary)",
                    letterSpacing: "1px",
                    marginBottom: "12px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  STEP {item.step}
                </div>
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                  {item.icon}
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text)",
                    marginBottom: "8px",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button
              className="btn-hero-primary"
              onClick={() => navigate("interview")}
            >
              <span>🎯</span> Try It Now — It's Free
            </button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────── */}
      <section className="testimonials-section">
        <div className="section-header">
          <div className="section-tag">Student Stories</div>
          <h2 className="section-title">They Got Placed. You're Next.</h2>
          <p className="section-sub">
            Real students. Real preparation. Real results.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="testimonial-stars">{t.stars}</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div
                  className="testimonial-avatar"
                  style={{ background: t.avatarBg }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-card">
          <div
            style={{ fontSize: "48px", marginBottom: "20px" }}
          >
            🎓
          </div>
          <div className="cta-title">
            Ready to Get Placed?
          </div>
          <p className="cta-sub">
            Join thousands of students who used PlaceReady to crack their
            placement interviews. Your preparation starts right now.
          </p>
          <button
            className="btn-cta"
            onClick={() => navigate("interview")}
          >
            Start Your Mock Interview →
          </button>
        </div>
      </section>
    </div>
  );
}