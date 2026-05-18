from pydantic import BaseModel
from typing import List, Optional

# ─── RESUME ───────────────────────────────────────────
class ResumeParseRequest(BaseModel):
    resume_text: str
    target_role: str

class Project(BaseModel):
    name: str
    description: str

class ResumeData(BaseModel):
    name: str
    skills: List[str]
    projects: List[Project]
    experience_level: str
    education: str
    summary: str

# ─── QUESTIONS ────────────────────────────────────────
class QuestionRequest(BaseModel):
    resume_data: ResumeData
    target_role: str
    test_type: str

class MCQOption(BaseModel):
    label: str
    text: str

class MCQQuestion(BaseModel):
    id: int
    question: str
    options: List[MCQOption]
    correct_answer: str
    explanation: str

class WrittenQuestion(BaseModel):
    id: int
    question: str
    key_points: List[str]
    difficulty: str

class SoftSkillQuestion(BaseModel):
    id: int
    scenario: str
    question: str
    evaluation_criteria: List[str]

class QuestionSet(BaseModel):
    test_type: str
    questions: List[dict]
    total: int
    time_limit_seconds: int

# ─── EVALUATION ───────────────────────────────────────
class MCQSubmission(BaseModel):
    question_id: int
    selected_answer: str
    correct_answer: str

class WrittenSubmission(BaseModel):
    question: str
    answer: str
    key_points: List[str]
    role: str
    level: str

class SoftSkillSubmission(BaseModel):
    scenario: str
    question: str
    answer: str
    role: str

class AnswerFeedback(BaseModel):
    score: int
    verdict: str
    strengths: List[str]
    weaknesses: List[str]
    suggestion: str
    missed_concepts: Optional[List[str]] = []
    star_method_used: Optional[bool] = None
    communication_rating: Optional[str] = None
    depth_of_knowledge: Optional[str] = None
    ideal_answer_hint: Optional[str] = None

# ─── FINAL REPORT ─────────────────────────────────────
class TestScore(BaseModel):
    test_name: str
    score: float
    total: float
    percentage: float

class FinalReportRequest(BaseModel):
    candidate_name: str
    target_role: str
    level: str
    test_scores: List[TestScore]
    all_weaknesses: List[str]
    all_strengths: List[str]

class FinalReport(BaseModel):
    overall_score: float
    overall_percentage: float
    rating: str
    summary: str
    positive_areas: List[str]
    negative_areas: List[str]
    study_plan: List[dict]
    readiness_score: int
    estimated_ready_in: str

# ─── ATS CHECKER ──────────────────────────────────────
class ATSRequest(BaseModel):
    resume_text: str
    target_role: str

class ATSResult(BaseModel):
    ats_score: int
    matched_keywords: List[str]
    missing_keywords: List[str]
    suggestions: List[str]
    verdict: str