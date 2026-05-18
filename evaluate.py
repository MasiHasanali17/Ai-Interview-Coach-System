# from fastapi import APIRouter, HTTPException
# from models.schemas import (
#     MCQSubmission,
#     WrittenSubmission,
#     SoftSkillSubmission,
#     AnswerFeedback,
#     FinalReportRequest,
#     FinalReport
# )
# from services.evaluator import (
#     evaluate_written_answer,
#     evaluate_soft_skill_answer,
#     evaluate_project_answer,
#     generate_final_report
# )
# from services.scorer import (
#     score_mcq_batch,
#     calculate_test_score,
#     calculate_overall_score
# )

# router = APIRouter()


# @router.post("/mcq")
# async def evaluate_mcq(submissions: list[MCQSubmission]):
#     """
#     Auto-scores MCQ answers.
#     No AI needed — just compare selected vs correct answer.
#     Returns per-question results + total score.
#     """
#     try:
#         results = score_mcq_batch([s.dict() for s in submissions])
#         return results
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/written", response_model=AnswerFeedback)
# async def evaluate_written(submission: WrittenSubmission):
#     """
#     AI evaluates a single written answer.
#     Called after each written question is submitted.
#     Returns score + strengths + weaknesses + suggestion.
#     """
#     try:
#         result = evaluate_written_answer(
#             question=submission.question,
#             answer=submission.answer,
#             key_points=submission.key_points,
#             role=submission.role,
#             level=submission.level
#         )
#         return AnswerFeedback(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/softskill", response_model=AnswerFeedback)
# async def evaluate_softskill(submission: SoftSkillSubmission):
#     """
#     AI evaluates a soft skill scenario answer.
#     Checks STAR method, communication clarity, maturity.
#     """
#     try:
#         result = evaluate_soft_skill_answer(
#             scenario=submission.scenario,
#             question=submission.question,
#             answer=submission.answer,
#             role=submission.role
#         )
#         return AnswerFeedback(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/project", response_model=AnswerFeedback)
# async def evaluate_project(submission: WrittenSubmission):
#     """
#     AI evaluates a project-based answer.
#     Checks depth of knowledge about their own project.
#     """
#     try:
#         result = evaluate_project_answer(
#             question=submission.question,
#             answer=submission.answer,
#             project_name="Resume Project",
#             role=submission.role
#         )
#         return AnswerFeedback(**result)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/test-score")
# async def get_test_score(data: dict):
#     """
#     Calculates score for one complete test.
#     Called when user finishes a test (all questions answered).
#     """
#     try:
#         score = calculate_test_score(
#             test_type=data["test_type"],
#             answers=data["answers"],
#             total_questions=data["total_questions"]
#         )
#         return score
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/final-report", response_model=FinalReport)
# async def get_final_report(request: FinalReportRequest):
#     """
#     Called after ALL 5 tests complete.
#     Generates full placement readiness report with:
#     overall score, positive areas, negative areas, study plan.
#     """
#     try:
#         report = generate_final_report(
#             candidate_name=request.candidate_name,
#             target_role=request.target_role,
#             level=request.level,
#             test_scores=[ts.dict() for ts in request.test_scores],
#             all_weaknesses=request.all_weaknesses,
#             all_strengths=request.all_strengths
#         )
#         return FinalReport(**report)
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @router.post("/overall-score")
# async def get_overall_score(data: dict):
#     """
#     Calculates weighted overall score across all 5 tests.
#     Weights: Technical 30%, Written 25%, Aptitude 20%, Soft 15%, Project 10%
#     """
#     try:
#         result = calculate_overall_score(data["test_scores"])
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


from fastapi import APIRouter, HTTPException
from models.schemas import (
    MCQSubmission,
    WrittenSubmission,
    SoftSkillSubmission,
    AnswerFeedback,
    FinalReportRequest,
    FinalReport
)
from services.evaluator import (
    evaluate_written_answer,
    evaluate_soft_skill_answer,
    evaluate_project_answer,
    generate_final_report
)
from services.scorer import (
    score_mcq_batch,
    calculate_test_score,
    calculate_overall_score
)
import re

router = APIRouter()


def clean_text(text: str) -> str:
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


@router.post("/mcq")
async def evaluate_mcq(submissions: list[MCQSubmission]):
    try:
        results = score_mcq_batch([s.dict() for s in submissions])
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/written", response_model=AnswerFeedback)
async def evaluate_written(submission: WrittenSubmission):
    try:
        result = evaluate_written_answer(
            question=clean_text(submission.question),
            answer=clean_text(submission.answer),
            key_points=submission.key_points,
            role=submission.role,
            level=submission.level
        )
        return AnswerFeedback(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/softskill", response_model=AnswerFeedback)
async def evaluate_softskill(submission: SoftSkillSubmission):
    try:
        result = evaluate_soft_skill_answer(
            scenario=clean_text(submission.scenario),
            question=clean_text(submission.question),
            answer=clean_text(submission.answer),
            role=clean_text(submission.role)
        )
        return AnswerFeedback(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/project", response_model=AnswerFeedback)
async def evaluate_project(submission: WrittenSubmission):
    try:
        result = evaluate_project_answer(
            question=clean_text(submission.question),
            answer=clean_text(submission.answer),
            project_name="Resume Project",
            role=clean_text(submission.role)
        )
        return AnswerFeedback(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/test-score")
async def get_test_score(data: dict):
    try:
        score = calculate_test_score(
            test_type=data["test_type"],
            answers=data["answers"],
            total_questions=data["total_questions"]
        )
        return score
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/final-report", response_model=FinalReport)
async def get_final_report(request: FinalReportRequest):
    try:
        report = generate_final_report(
            candidate_name=request.candidate_name,
            target_role=request.target_role,
            level=request.level,
            test_scores=[ts.dict() for ts in request.test_scores],
            all_weaknesses=request.all_weaknesses,
            all_strengths=request.all_strengths
        )
        return FinalReport(**report)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/overall-score")
async def get_overall_score(data: dict):
    try:
        result = calculate_overall_score(data["test_scores"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))