import json
import re
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("YOUR API"))
MODEL  = "llama-3.3-70b-versatile"

print(f"evaluator: Groq client initialized")


def call_groq(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1500,
    )
    return response.choices[0].message.content


def evaluate_written_answer(
    question: str,
    answer: str,
    key_points: list,
    role: str,
    level: str
) -> dict:
    key_points_str = ", ".join(key_points)

    prompt = f"""You are a strict but fair {role} technical interviewer evaluating a {level} candidate.

Question: {question}
Expected key points: {key_points_str}
Candidate answer: "{answer}"

Return ONLY valid JSON (no markdown, no extra text):
{{
  "score": <integer 1-10>,
  "verdict": "<Excellent|Good|Average|Poor>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestion": "<one actionable tip>",
  "missed_concepts": ["<concept 1>", "<concept 2>"],
  "ideal_answer_hint": "<2-3 sentences of perfect answer>"
}}"""

    raw = call_groq(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)


def evaluate_soft_skill_answer(
    scenario: str,
    question: str,
    answer: str,
    role: str
) -> dict:
    prompt = f"""You are an HR interviewer evaluating soft skills for a {role} position.

Scenario: {scenario}
Question: {question}
Candidate answer: "{answer}"

Return ONLY valid JSON (no markdown, no extra text):
{{
  "score": <integer 1-10>,
  "verdict": "<Excellent|Good|Average|Poor>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestion": "<one tip>",
  "star_method_used": <true|false>,
  "communication_rating": "<Clear|Moderate|Unclear>"
}}"""

    raw = call_groq(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)


def evaluate_project_answer(
    question: str,
    answer: str,
    project_name: str,
    role: str
) -> dict:
    prompt = f"""You are a technical interviewer evaluating a candidate's project knowledge.

Project: {project_name}
Question: {question}
Candidate answer: "{answer}"

Return ONLY valid JSON (no markdown, no extra text):
{{
  "score": <integer 1-10>,
  "verdict": "<Excellent|Good|Average|Poor>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "suggestion": "<one tip>",
  "depth_of_knowledge": "<Deep|Surface|Shallow>"
}}"""

    raw = call_groq(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)


def generate_final_report(
    candidate_name: str,
    target_role: str,
    level: str,
    test_scores: list,
    all_weaknesses: list,
    all_strengths: list
) -> dict:
    scores_str = "\n".join([
        f"- {ts['test_name']}: {ts['score']}/{ts['total']} ({ts['percentage']:.0f}%)"
        for ts in test_scores
    ])

    prompt = f"""You are a career coach reviewing a complete mock interview session.

Candidate: {candidate_name}
Target Role: {target_role}
Level: {level}
Test Results:
{scores_str}
Weaknesses: {', '.join(all_weaknesses[:10])}
Strengths: {', '.join(all_strengths[:8])}

Return ONLY valid JSON (no markdown, no extra text):
{{
  "overall_score": <float out of 10>,
  "overall_percentage": <float 0-100>,
  "rating": "<Elite|Strong|Developing|Needs Work>",
  "summary": "<3-4 sentences honest assessment>",
  "positive_areas": ["<area 1>", "<area 2>", "<area 3>"],
  "negative_areas": ["<area 1>", "<area 2>", "<area 3>"],
  "study_plan": [
    {{
      "topic": "<topic>",
      "priority": "<high|medium|low>",
      "resource": "<what to study>"
    }}
  ],
  "readiness_score": <integer 0-100>,
  "estimated_ready_in": "<Ready now|1 week|2 weeks|1 month|2-3 months>"
}}"""

    raw = call_groq(prompt)
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)