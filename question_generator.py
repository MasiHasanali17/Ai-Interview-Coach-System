import json
import re
import os
from dotenv import load_dotenv
from groq import Groq
from models.schemas import ResumeData

load_dotenv()

client = Groq(api_key=os.getenv("YOUR API"))
MODEL  = "llama-3.3-70b-versatile"

print("question_generator: Groq client initialized")


def clean_text(text: str) -> str:
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def fix_json_strings(text):
    """Fix newlines inside JSON string values"""
    result      = []
    in_string   = False
    escape_next = False
    for char in text:
        if escape_next:
            result.append(char)
            escape_next = False
        elif char == '\\':
            result.append(char)
            escape_next = True
        elif char == '"':
            in_string = not in_string
            result.append(char)
        elif in_string and char in '\n\r':
            result.append(' ')
        else:
            result.append(char)
    return ''.join(result)


def safe_parse(raw: str):
    """Safely parse JSON with multiple fallback attempts"""
    # Remove markdown
    raw = re.sub(r"```json|```", "", raw).strip()
    # Remove control characters
    raw = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)
    # Fix newlines in strings
    raw = fix_json_strings(raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Try extracting array
        match = re.search(r'\[[\s\S]*\]', raw)
        if match:
            try:
                fixed = fix_json_strings(
                    re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', match.group())
                )
                return json.loads(fixed)
            except Exception:
                pass
        raise Exception(f"Could not parse JSON: {raw[:200]}")


def call_groq(prompt: str, max_tokens: int = 3000) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=max_tokens,
    )
    return response.choices[0].message.content


def generate_technical_mcqs(resume_data: ResumeData, role: str) -> list:
    skills_str = ", ".join(resume_data.skills[:8])

    prompt = f"""Generate exactly 12 technical MCQ questions for a {resume_data.experience_level} {role} candidate.
Skills: {skills_str}

CRITICAL: Return ONLY a JSON array. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
[{{"id": 1, "question": "What is X?", "options": [{{"label": "A", "text": "option1"}}, {{"label": "B", "text": "option2"}}, {{"label": "C", "text": "option3"}}, {{"label": "D", "text": "option4"}}], "correct_answer": "A", "explanation": "Because X is option1."}}]

Generate 12 questions in this exact format. Mix easy (4), medium (5), hard (3)."""

    raw = call_groq(prompt, 4000)
    return safe_parse(raw)


def generate_written_questions(resume_data: ResumeData, role: str) -> list:
    skills_str = ", ".join(resume_data.skills[:6])

    prompt = f"""Generate exactly 4 written answer questions for a {resume_data.experience_level} {role} candidate.
Skills: {skills_str}

CRITICAL: Return ONLY a JSON array. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
[{{"id": 1, "question": "Explain X with examples.", "key_points": ["point1", "point2", "point3"], "difficulty": "medium", "expected_length": "medium"}}]

Generate 4 questions in this exact format."""

    raw = call_groq(prompt, 2000)
    return safe_parse(raw)


def generate_aptitude_questions() -> list:
    prompt = """Generate exactly 10 aptitude MCQ questions for a placement exam.
Mix: 3 logical reasoning, 3 quantitative, 2 data interpretation, 2 verbal.

CRITICAL: Return ONLY a JSON array. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
[{{"id": 1, "type": "logical", "question": "If A is B then C is?", "options": [{{"label": "A", "text": "option1"}}, {{"label": "B", "text": "option2"}}, {{"label": "C", "text": "option3"}}, {{"label": "D", "text": "option4"}}], "correct_answer": "B", "explanation": "Because logic says so."}}]

Generate 10 questions in this exact format."""

    raw = call_groq(prompt, 4000)
    return safe_parse(raw)


def generate_soft_skill_questions(role: str) -> list:
    prompt = f"""Generate exactly 5 soft skill scenario questions for a {role} position.
Test: communication, teamwork, problem solving, leadership, conflict resolution.

CRITICAL: Return ONLY a JSON array. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
[{{"id": 1, "skill_tested": "communication", "scenario": "Your team disagrees on approach.", "question": "What would you do?", "evaluation_criteria": ["shows clarity", "shows empathy", "shows solution focus"]}}]

Generate 5 questions in this exact format."""

    raw = call_groq(prompt, 2000)
    return safe_parse(raw)


def generate_project_questions(resume_data: ResumeData, role: str) -> list:
    if not resume_data.projects:
        return []

    projects_str = " | ".join([
        f"{p.name}: {p.description}"
        for p in resume_data.projects
    ])

    prompt = f"""Generate exactly 4 questions about these projects for a {role} interview.
Projects: {projects_str}

CRITICAL: Return ONLY a JSON array. No markdown. No explanation. ASCII only. No newlines inside strings.

Example format:
[{{"id": 1, "related_project": "Project Name", "question": "How did you handle X in this project?", "key_points": ["technical depth", "challenges faced"], "difficulty": "medium"}}]

Generate 4 questions in this exact format."""

    raw = call_groq(prompt, 2000)
    return safe_parse(raw)