import { useState, useEffect } from "react";

// All 6 navigation options
const NAV_LINKS = [
  { id: "home",       label: "Home",            icon: "🏠" },
  { id: "interview",  label: "Mock Interview",   icon: "🎯" },
  { id: "guidance",   label: "Interview Guide",  icon: "💡" },
  { id: "resumetips", label: "Resume Tips",      icon: "📄" },
  { id: "company",    label: "Company Prep",     icon: "🏢" },
  { id: "roadmap",    label: "Roadmap",          icon: "🗺️" },
];

export default function Navbar({ currentPage, navigate }) {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);

  // Add shadow to navbar on scroll
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setMobileOpen(false);
  }, [currentPage]);

  function handleNav(pageId) {
    navigate(pageId);
    setMobileOpen(false);
  }

  return (
    <>
      <nav
        className="navbar"
        style={{
          boxShadow: scrolled
            ? "0 4px 24px rgba(108,99,255,0.10)"
            : "0 2px 20px rgba(108,99,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          className="navbar-logo"
          onClick={() => handleNav("home")}
          title="Go to Home"
        >
          PlaceReady
        </div>

        {/* Desktop Links */}
        <ul className="navbar-links desktop-links">
          {NAV_LINKS.map((link) => (
            <li
              key={link.id}
              className={currentPage === link.id ? "active" : ""}
            >
              <button onClick={() => handleNav(link.id)}>
                {link.label}
              </button>
            </li>
          ))}

          {/* CTA Button */}
          <li>
            <button
              className="navbar-cta"
              onClick={() => handleNav("interview")}
            >
              Start Interview 🚀
            </button>
          </li>
        </ul>

        {/* Mobile Hamburger */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              display: "block",
              width: "22px",
              height: "2px",
              background: mobileOpen ? "transparent" : "var(--text)",
              position: "relative",
              transition: "all 0.3s",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: "22px",
                height: "2px",
                background: "var(--text)",
                top: mobileOpen ? "0" : "-7px",
                transform: mobileOpen ? "rotate(45deg)" : "none",
                transition: "all 0.3s",
              }}
            />
            <span
              style={{
                position: "absolute",
                width: "22px",
                height: "2px",
                background: "var(--text)",
                top: mobileOpen ? "0" : "7px",
                transform: mobileOpen ? "rotate(-45deg)" : "none",
                transition: "all 0.3s",
              }}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-inner">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className={`mobile-nav-item ${
                  currentPage === link.id ? "active" : ""
                }`}
                onClick={() => handleNav(link.id)}
              >
                <span className="mobile-nav-icon">{link.icon}</span>
                <span>{link.label}</span>
                {currentPage === link.id && (
                  <span className="mobile-nav-check">✓</span>
                )}
              </button>
            ))}

            <button
              className="mobile-cta-btn"
              onClick={() => handleNav("interview")}
            >
              🚀 Start Mock Interview
            </button>
          </div>
        </div>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile styles injected here to keep global.css clean */}
      <style>{`
        .desktop-links {
          display: flex;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
        }

        .mobile-menu {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          z-index: 999;
          background: var(--white);
          border-bottom: 1px solid var(--border);
          box-shadow: var(--shadow-lg);
          animation: fadeInDown 0.2s ease;
        }

        .mobile-menu-inner {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 16px;
          border: none;
          background: none;
          border-radius: var(--radius);
          font-size: 15px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          transition: var(--transition);
          width: 100%;
        }

        .mobile-nav-item:hover {
          background: var(--surface2);
          color: var(--text);
        }

        .mobile-nav-item.active {
          background: var(--primary-light);
          color: var(--primary);
          font-weight: 600;
        }

        .mobile-nav-icon { font-size: 18px; }

        .mobile-nav-check {
          margin-left: auto;
          color: var(--primary);
          font-weight: 700;
        }

        .mobile-cta-btn {
          margin-top: 8px;
          padding: 14px;
          background: var(--grad-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition);
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          top: 70px;
          background: rgba(0,0,0,0.3);
          z-index: 998;
          backdrop-filter: blur(2px);
        }

        @media (max-width: 900px) {
          .desktop-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}