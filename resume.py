from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from models.schemas import (
    ResumeParseRequest,
    ATSRequest,
    ATSResult
)
from services.resume_parser import parse_resume, get_ats_score
import re

router = APIRouter()


def clean_text(text: str) -> str:
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]', ' ', text)
    text = re.sub(r'[\u200b\u200c\u200d\ufeff]', '', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def clean_dict(obj):
    if isinstance(obj, dict):
        return {k: clean_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [clean_dict(i) for i in obj]
    elif isinstance(obj, str):
        return clean_text(obj)
    return obj


@router.post("/parse")
async def parse_resume_endpoint(request: ResumeParseRequest):
    try:
        cleaned = clean_text(request.resume_text)
        result  = parse_resume(cleaned, request.target_role)
        data    = clean_dict({
            "name":             result.name,
            "skills":           result.skills,
            "projects":         [{"name": p.name, "description": p.description} for p in result.projects],
            "experience_level": result.experience_level,
            "education":        result.education,
            "summary":          result.summary,
        })
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/ats-check")
async def ats_check_endpoint(request: ATSRequest):
    try:
        cleaned = clean_text(request.resume_text)
        result  = get_ats_score(cleaned, request.target_role)
        return JSONResponse(content=clean_dict(result))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS check failed: {str(e)}")


@router.post("/summarize")
async def summarize_resume_endpoint(request: ResumeParseRequest):
    try:
        cleaned = clean_text(request.resume_text)
        result  = parse_resume(cleaned, request.target_role)
        data    = clean_dict({
            "name":             result.name,
            "summary":          result.summary,
            "skills":           result.skills,
            "projects":         [{"name": p.name, "description": p.description} for p in result.projects],
            "education":        result.education,
            "experience_level": result.experience_level,
        })
        return JSONResponse(content=data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Summarization failed: {str(e)}")