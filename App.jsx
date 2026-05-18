import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import Guidance from "./pages/Guidance";
import ResumeTips from "./pages/ResumeTips";
import CompanyPrep from "./pages/CompanyPrep";
import Roadmap from "./pages/Roadmap";
import Results from "./pages/Results";

export default function App() {
  // ── Global navigation state ──────────────────────────
  const [currentPage, setCurrentPage] = useState("home");

  // ── Global interview session state ───────────────────
  const [sessionData, setSessionData] = useState({
    // Setup
    candidateName:   "",
    targetRole:      "Data Scientist",
    level:           "fresher",

    // Resume
    resumeText:      "",
    resumeData:      null,  // parsed: { name, skills, projects, summary, education }

    // Interview flow
    currentStep:     "upload",   // upload → summary → test1 → test2 → test3 → test4 → test5 → results
    currentTest:     0,          // 1 to 5

    // Questions per test
    test1Questions:  [],   // Technical MCQs
    test2Questions:  [],   // Written
    test3Questions:  [],   // Aptitude MCQs
    test4Questions:  [],   // Soft Skills
    test5Questions:  [],   // Project (empty = skip)

    // Answers and scores
    test1Answers:    [],
    test2Answers:    [],
    test3Answers:    [],
    test4Answers:    [],
    test5Answers:    [],

    test1Score:      null,
    test2Score:      null,
    test3Score:      null,
    test4Score:      null,
    test5Score:      null,

    // Collected feedback across all tests
    allStrengths:    [],
    allWeaknesses:   [],

    // Final report
    finalReport:     null,
  });

  // ── Helper: update any field in sessionData ──────────
  function updateSession(fields) {
    setSessionData((prev) => ({ ...prev, ...fields }));
  }

  // ── Helper: reset everything for a new session ───────
  function resetSession() {
    setSessionData({
      candidateName:  "",
      targetRole:     "Data Scientist",
      level:          "fresher",
      resumeText:     "",
      resumeData:     null,
      currentStep:    "upload",
      currentTest:    0,
      test1Questions: [],
      test2Questions: [],
      test3Questions: [],
      test4Questions: [],
      test5Questions: [],
      test1Answers:   [],
      test2Answers:   [],
      test3Answers:   [],
      test4Answers:   [],
      test5Answers:   [],
      test1Score:     null,
      test2Score:     null,
      test3Score:     null,
      test4Score:     null,
      test5Score:     null,
      allStrengths:   [],
      allWeaknesses:  [],
      finalReport:    null,
    });
  }

  // ── Navigate to a page ───────────────────────────────
  function navigate(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  // ── Shared props passed to every page ────────────────
  const sharedProps = {
    navigate,
    sessionData,
    updateSession,
    resetSession,
  };

  // ── Render correct page ───────────────────────────────
  function renderPage() {
    switch (currentPage) {
      case "home":        return <Home        {...sharedProps} />;
      case "interview":   return <Interview   {...sharedProps} />;
      case "guidance":    return <Guidance    {...sharedProps} />;
      case "resumetips":  return <ResumeTips  {...sharedProps} />;
      case "company":     return <CompanyPrep {...sharedProps} />;
      case "roadmap":     return <Roadmap     {...sharedProps} />;
      case "results":     return <Results     {...sharedProps} />;
      default:            return <Home        {...sharedProps} />;
    }
  }

  return (
    <div className="app-wrapper">
      <Navbar
        currentPage={currentPage}
        navigate={navigate}
      />
      <main className="main-content">
        {renderPage()}
      </main>
      <footer className="app-footer">
        <p>PlaceReady — AI Placement Preparation Portal</p>
        <p className="footer-sub"></p>
      </footer>
    </div>
  );
}