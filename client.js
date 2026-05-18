const BASE_URL = "http://localhost:8000/api";

async function apiCall(endpoint, method = "GET", body = null) {
  const config = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // Get raw text first
  const rawText = await response.text();

  // Clean control characters from response
  const cleanedText = rawText.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ');

  // Parse cleaned JSON
  let data;
  try {
    data = JSON.parse(cleanedText);
  } catch (e) {
    throw new Error(`JSON parse error: ${e.message} — Raw: ${rawText.substring(0, 100)}`);
  }

  if (!response.ok) {
    throw new Error(data.detail || `API error: ${response.status}`);
  }

  return data;
}

export async function parseResume(resumeText, targetRole) {
  return apiCall("/resume/parse", "POST", {
    resume_text: resumeText,
    target_role: targetRole,
  });
}

export async function summarizeResume(resumeText, targetRole) {
  return apiCall("/resume/summarize", "POST", {
    resume_text: resumeText,
    target_role: targetRole,
  });
}

export async function checkATS(resumeText, targetRole) {
  return apiCall("/resume/ats-check", "POST", {
    resume_text: resumeText,
    target_role: targetRole,
  });
}

export async function generateQuestions(resumeData, targetRole, testType) {
  return apiCall("/questions/generate", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   testType,
  });
}

export async function generateTechnicalMCQs(resumeData, targetRole) {
  return apiCall("/questions/technical", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   "mcq_technical",
  });
}

export async function generateWrittenQuestions(resumeData, targetRole) {
  return apiCall("/questions/written", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   "written",
  });
}

export async function generateAptitudeQuestions(resumeData, targetRole) {
  return apiCall("/questions/aptitude", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   "aptitude",
  });
}

export async function generateSoftSkillQuestions(resumeData, targetRole) {
  return apiCall("/questions/softskills", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   "soft_skills",
  });
}

export async function generateProjectQuestions(resumeData, targetRole) {
  return apiCall("/questions/project", "POST", {
    resume_data: resumeData,
    target_role: targetRole,
    test_type:   "project",
  });
}

export async function scoreMCQAnswers(submissions) {
  return apiCall("/evaluate/mcq", "POST", submissions);
}

export async function evaluateWrittenAnswer(
  question, answer, keyPoints, role, level
) {
  return apiCall("/evaluate/written", "POST", {
    question,
    answer,
    key_points: keyPoints,
    role,
    level,
  });
}

export async function evaluateSoftSkillAnswer(
  scenario, question, answer, role
) {
  return apiCall("/evaluate/softskill", "POST", {
    scenario,
    question,
    answer,
    role,
  });
}

export async function evaluateProjectAnswer(question, answer, role, level) {
  return apiCall("/evaluate/project", "POST", {
    question,
    answer,
    key_points: [],
    role,
    level,
  });
}

export async function calculateTestScore(testType, answers, totalQuestions) {
  return apiCall("/evaluate/test-score", "POST", {
    test_type:       testType,
    answers,
    total_questions: totalQuestions,
  });
}

export async function generateFinalReport(
  candidateName, targetRole, level,
  testScores, allWeaknesses, allStrengths
) {
  return apiCall("/evaluate/final-report", "POST", {
    candidate_name: candidateName,
    target_role:    targetRole,
    level,
    test_scores:    testScores,
    all_weaknesses: allWeaknesses,
    all_strengths:  allStrengths,
  });
}

export async function calculateOverallScore(testScores) {
  return apiCall("/evaluate/overall-score", "POST", {
    test_scores: testScores,
  });
}

export async function extractPDFText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (!window.pdfjsLib) {
          await loadPDFJSFromCDN();
        }

        const pdfjsLib = window.pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        const typedArray = new Uint8Array(e.target.result);
        const pdf        = await pdfjsLib.getDocument({ data: typedArray }).promise;

        let fullText = "";
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page        = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText    = textContent.items
            .map((item) => item.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        // Clean extracted text
        const cleaned = fullText
          .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        resolve(cleaned || "Resume text extracted.");
      } catch (err) {
        reject(new Error("PDF parsing failed: " + err.message));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

function loadPDFJSFromCDN() {
  return new Promise((resolve, reject) => {
    if (window.pdfjsLib) { resolve(); return; }
    const script    = document.createElement("script");
    script.src      = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.onload   = () => resolve();
    script.onerror  = () => reject(new Error("Failed to load PDF.js"));
    document.head.appendChild(script);
  });
}

export function validatePDF(file) {
  if (!file)
    return { valid: false, error: "No file selected" };
  if (file.type !== "application/pdf")
    return { valid: false, error: "Please upload a PDF file only" };
  if (file.size > 5 * 1024 * 1024)
    return { valid: false, error: "File size must be under 5MB" };
  return { valid: true };
}