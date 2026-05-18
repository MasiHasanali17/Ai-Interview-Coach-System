from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, questions, evaluate

app = FastAPI(
    title="AI Interview Coach API",
    description="AI-powered placement preparation system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router,    prefix="/api/resume",    tags=["Resume"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(evaluate.router,  prefix="/api/evaluate",  tags=["Evaluate"])

@app.get("/")
def root():
    return {"message": "AI Interview Coach API is running!"}

@app.get("/health")
def health():
    return {"status": "ok"}