# AI Interview Coach System

An AI-powered placement preparation and mock interview platform built using **React.js**, **FastAPI**, **Groq LLM**, and **modern AI workflows**.

This project helps students and job seekers prepare for technical interviews by analyzing resumes, generating AI-based interview questions, evaluating answers, checking ATS scores, and providing personalized feedback.

---

# 🚀 Features

## ✅ Resume Parsing

* Upload PDF resume
* Extracts resume text automatically
* Identifies:

  * Skills
  * Projects
  * Experience level
  * Education
  * Resume summary

---

## ✅ AI Mock Interview System

* Technical MCQs
* Written technical questions
* Soft skill interview questions
* Project-based viva questions
* Dynamic AI-generated questions

---

## ✅ AI Evaluation System

* Evaluates written answers
* Evaluates soft skill answers
* Gives:

  * Score
  * Strengths
  * Weaknesses
  * Suggestions
  * Readiness level

---

## ✅ ATS Resume Checker

* ATS compatibility score
* Missing keywords detection
* Resume improvement suggestions

---

## ✅ Performance Dashboard

* Final interview score
* Readiness percentage
* Personalized study roadmap
* Weakness analysis

---

# 🛠 Tech Stack

## Frontend

* React.js
* Vite
* JavaScript
* CSS3
* Axios
* React Router DOM
* React Hot Toast
* PDF.js

---

## Backend

* FastAPI
* Python
* Pydantic
* Uvicorn
* Python Dotenv

---

## AI / LLM

* Groq API
* Llama 3.3 70B Versatile Model

---

# 📂 Project Structure

```bash
AI-Interview-Coach-System/
│
├── backend/
│   ├── models/
│   │   └── schemas.py
│   │
│   ├── routers/
│   │   ├── evaluate.py
│   │   ├── questions.py
│   │   └── resume.py
│   │
│   ├── services/
│   │   ├── evaluator.py
│   │   ├── question_generator.py
│   │   ├── resume_parser.py
│   │   └── scorer.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ResumeUpload.jsx
│   │   │   └── ScoreReport.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── ResumeTips.jsx
│   │   │   ├── Guidance.jsx
│   │   │   ├── CompanyPrep.jsx
│   │   │   └── Roadmap.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── package.json
```

---

# ⚙️ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-interview-coach-system.git
```

```bash
cd ai-interview-coach-system
```

---

# 2️⃣ Backend Setup

## Go to backend folder

```bash
cd backend
```

---

## Create Conda Environment

```bash
conda create -n placeready python=3.10
```

---

## Activate Environment

### Windows

```bash
conda activate placeready
```

### Mac/Linux

```bash
source activate placeready
```

---

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# 3️⃣ Setup Environment Variables

Create `.env` file inside backend folder.

```env
GROQ_API_KEY=your_api_key_here
```

---

# 4️⃣ Run Backend Server

```bash
python -m uvicorn main:app --reload --port 8000
```

Backend runs on:

```bash
http://localhost:8000
```

Swagger API docs:

```bash
http://localhost:8000/docs
```

---

# 5️⃣ Frontend Setup

Open a NEW terminal.

Go to frontend folder:

```bash
cd frontend
```

---

## Install Frontend Dependencies

```bash
npm install
```

---

## Start Frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🔑 How to Get Groq API Key

1. Open:

[https://console.groq.com/](https://console.groq.com/)

2. Sign in

3. Create API key

4. Copy key

5. Paste inside:

```env
GROQ_API_KEY=your_key_here
```

---

# 📌 API Endpoints

## Resume APIs

```bash
POST /api/resume/parse
POST /api/resume/summarize
POST /api/resume/ats-check
```

---

## Question APIs

```bash
POST /api/questions/generate
```

---

## Evaluation APIs

```bash
POST /api/evaluate/written
POST /api/evaluate/softskill
POST /api/evaluate/project
POST /api/evaluate/final-report
```

---

# 🧠 AI Workflow

1. User uploads resume PDF
2. Resume text extracted using PDF.js
3. Resume analyzed using Groq LLM
4. AI generates interview questions
5. User answers questions
6. AI evaluates answers
7. Final performance report generated

---

# 📈 Future Improvements

* Voice interview support
* Webcam AI proctoring
* Multi-language interviews
* Real-time coding interviews
* Authentication system
* Database integration
* Admin dashboard
* AI resume builder
* Deployment on cloud

---

# 🔒 Environment Variables

```env
GROQ_API_KEY=your_api_key
```

---

# 👨‍💻 Author

Developed by Masi Hasan Ali

---

# ⭐ If You Like This Project

Give this repository a star on GitHub ⭐
