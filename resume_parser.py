import json
import re
import os
from dotenv import load_dotenv
from groq import Groq
from models.schemas import ResumeData, Project

load_dotenv()

client = Groq(api_key=os.getenv("YOUR API"))
MODEL  = "llama-3.3-70b-versatile"

print("resume_parser: Groq client initialized")


def clean_text(text: str) -> str:
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', ' ', text)
    text = re.sub(r'[\u200b\u200c\u200d\ufeff]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def call_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=2000,
    )
    return response.choices[0].message.content


def parse_resume(resume_text: str, target_role: str) -> ResumeData:
    cleaned_resume = clean_text(resume_text)[:3000]

    prompt = f"""You are a resume parser. Parse the resume and return JSON.

Resume: {cleaned_resume}

Target Role: {target_role}

CRITICAL RULES:
- Return ONLY raw JSON, no markdown, no code blocks
- No newlines inside any string value
- No special characters, only ASCII
- summary must be one single line (no line breaks inside)

Return exactly this JSON format:
{{"name": "Full Name", "skills": ["skill1", "skill2"], "projects": [{{"name": "Project Name", "description": "One sentence description"}}], "experience_level": "fresher", "education": "Degree Field", "summary": "Write 2-3 sentences about candidate in ONE LINE. No line breaks."}}

experience_level must be: fresher OR junior OR mid
If no projects, use empty array: []"""

    raw = call_groq(prompt)

    # Step 1 - remove markdown
    raw = re.sub(r"```json|```", "", raw).strip()

    # Step 2 - remove ALL control characters
    raw = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)

    # Step 3 - fix newlines inside JSON strings
    # This finds content between quotes and removes newlines
    def fix_json_strings(text):
        result = []
        in_string = False
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
                result.append(' ')  # replace newline with space inside strings
            else:
                result.append(char)
        return ''.join(result)

    raw = fix_json_strings(raw)

    # Step 4 - parse
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        # Try to extract just the JSON object
        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            try:
                fixed = fix_json_strings(match.group())
                fixed = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', fixed)
                data  = json.loads(fixed)
            except Exception:
                raise Exception(f"JSON parse failed: {str(e)} | Raw: {raw[:300]}")
        else:
            raise Exception(f"No JSON found in response: {raw[:300]}")

    projects = [
        Project(
            name=clean_text(p.get("name", "Project")),
            description=clean_text(p.get("description", ""))
        )
        for p in data.get("projects", [])
    ]

    return ResumeData(
        name=clean_text(data.get("name", "Unknown")),
        skills=[clean_text(s) for s in data.get("skills", [])],
        projects=projects,
        experience_level=data.get("experience_level", "fresher"),
        education=clean_text(data.get("education", "Not specified")),
        summary=clean_text(data.get("summary", ""))
    )


def get_ats_score(resume_text: str, target_role: str) -> dict:
    cleaned_resume = clean_text(resume_text)[:3000]

    prompt = f"""Analyze this resume for ATS compatibility for role: {target_role}

Resume: {cleaned_resume}

Return ONLY this JSON (no markdown, no explanation, ASCII only):
{{"ats_score": 65, "matched_keywords": ["keyword1", "keyword2"], "missing_keywords": ["missing1", "missing2"], "suggestions": ["suggestion1", "suggestion2", "suggestion3"], "verdict": "Good Match"}}"""

    raw = call_groq(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()
    raw = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', raw)

    try:
        return json.loads(raw)
    except Exception:
        match = re.search(r'\{[\s\S]*\}', raw)
        if match:
            return json.loads(re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', match.group()))
        raise Exception("Could not parse ATS response")