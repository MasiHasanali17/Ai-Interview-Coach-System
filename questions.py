from fastapi import APIRouter, HTTPException
from models.schemas import QuestionRequest, QuestionSet, ResumeData
from services.question_generator import (
    generate_technical_mcqs,
    generate_written_questions,
    generate_aptitude_questions,
    generate_soft_skill_questions,
    generate_project_questions
)

router = APIRouter()

# Time limits per test (in seconds)
TIME_LIMITS = {
    "mcq_technical":  25 * 60,   # 25 minutes for 12 MCQs
    "written":        30 * 60,   # 30 minutes for 4 written
    "aptitude":       20 * 60,   # 20 minutes for 10 aptitude
    "soft_skills":    20 * 60,   # 20 minutes for 5 scenarios
    "project":        15 * 60,   # 15 minutes for 4 project Qs
}


@router.post("/generate", response_model=QuestionSet)
async def generate_questions(request: QuestionRequest):
    """
    Master endpoint — generates questions for any test type.
    Frontend calls this once per test with test_type field.
    """
    try:
        test_type = request.test_type
        role = request.target_role
        resume = request.resume_data

        if test_type == "mcq_technical":
            questions = generate_technical_mcqs(resume, role)

        elif test_type == "written":
            questions = generate_written_questions(resume, role)

        elif test_type == "aptitude":
            questions = generate_aptitude_questions()

        elif test_type == "soft_skills":
            questions = generate_soft_skill_questions(role)

        elif test_type == "project":
            # Returns [] if no projects — frontend auto-skips
            questions = generate_project_questions(resume, role)

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid test_type: {test_type}. Must be one of: mcq_technical, written, aptitude, soft_skills, project"
            )

        return QuestionSet(
            test_type=test_type,
            questions=questions,
            total=len(questions),
            time_limit_seconds=TIME_LIMITS.get(test_type, 20 * 60)
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/technical")
async def generate_technical(request: QuestionRequest):
    """Direct endpoint for Test 1 — Technical MCQs"""
    try:
        questions = generate_technical_mcqs(request.resume_data, request.target_role)
        return {
            "test_type": "mcq_technical",
            "test_number": 1,
            "test_name": "Technical Knowledge",
            "questions": questions,
            "total": len(questions),
            "time_limit_seconds": TIME_LIMITS["mcq_technical"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/written")
async def generate_written(request: QuestionRequest):
    """Direct endpoint for Test 2 — Written Questions"""
    try:
        questions = generate_written_questions(request.resume_data, request.target_role)
        return {
            "test_type": "written",
            "test_number": 2,
            "test_name": "Knowledge Depth",
            "questions": questions,
            "total": len(questions),
            "time_limit_seconds": TIME_LIMITS["written"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/aptitude")
async def generate_aptitude(request: QuestionRequest):
    """Direct endpoint for Test 3 — Aptitude"""
    try:
        questions = generate_aptitude_questions()
        return {
            "test_type": "aptitude",
            "test_number": 3,
            "test_name": "Aptitude & Reasoning",
            "questions": questions,
            "total": len(questions),
            "time_limit_seconds": TIME_LIMITS["aptitude"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/softskills")
async def generate_softskills(request: QuestionRequest):
    """Direct endpoint for Test 4 — Soft Skills"""
    try:
        questions = generate_soft_skill_questions(request.target_role)
        return {
            "test_type": "soft_skills",
            "test_number": 4,
            "test_name": "Soft Skills & Communication",
            "questions": questions,
            "total": len(questions),
            "time_limit_seconds": TIME_LIMITS["soft_skills"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/project")
async def generate_project(request: QuestionRequest):
    """
    Direct endpoint for Test 5 — Project Questions.
    Returns empty list if resume has no projects.
    Frontend handles auto-skip.
    """
    try:
        questions = generate_project_questions(request.resume_data, request.target_role)
        return {
            "test_type": "project",
            "test_number": 5,
            "test_name": "Project Deep Dive",
            "questions": questions,
            "total": len(questions),
            "skipped": len(questions) == 0,
            "skip_reason": "No projects found in resume" if len(questions) == 0 else None,
            "time_limit_seconds": TIME_LIMITS["project"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))