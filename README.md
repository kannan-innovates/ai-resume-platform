# SkillMount — AI-Powered Resume Analysis & Career Intelligence Platform

> Built with MERN stack + TypeScript, modular monolith architecture, Groq AI (Llama 3.3 70B)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Module Breakdown](#module-breakdown)
- [AI Prompts & Strategy](#ai-prompts--strategy)
- [Skill Gap Logic](#skill-gap-logic)
- [Career Pivot Logic](#career-pivot-logic)
- [Job Recommendation Module](#job-recommendation-module)
- [Admin Vault Workflow](#admin-vault-workflow)
- [Auth & Session Management](#auth--session-management)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Future Extensibility & Scaling](#future-extensibility--scaling)

---

## Overview

SkillMount is a full-stack web application that simulates an AI-powered career intelligence platform. Users upload their resumes, receive AI-driven analysis, discover skill gaps, get course recommendations, view matched job listings, and receive tailored resumes per job description.

Admins review all resumes, run skill gap checks per candidate, and approve career paths which are surfaced back to the user.

---

## Architecture

```
Modular Monolith — designed to split into microservices
```

```
Client (React + Vite)
        │
        ▼
Express REST API (TypeScript)
        │
        ├── Auth Module          → JWT issue, user management
        ├── Resume Module        → Upload, extract, parse, store
        ├── AI Analysis Module   → Groq API, structured JSON output
        ├── Skill Gap Module     → Gap detection, course recommendation
        ├── Career Pivot Module  → Path prediction engine
        ├── Job Recommendation   → Simulated platform aggregator
        ├── CV Tailoring Module  → Per-job resume generation + auto-apply stub
        └── Admin Vault Module   → Career path approvals, admin decisions
                │
                ▼
          MongoDB (Mongoose)
```

### Clean Architecture Flow

```
Controller → Service → (AI Service / Dataset / DB) → Response
```

Each module has:
- `*.types.ts` — TypeScript interfaces
- `*.model.ts` — Mongoose schema (if DB interaction)
- `*.service.ts` — all business logic
- `*.controller.ts` — HTTP request/response only
- `*.routes.ts` — endpoint definitions only
- `*.middleware.ts` — module-specific middleware (e.g. multer)

No business logic lives in controllers. No DB queries live in routes. This makes each module independently testable and replaceable.

---

## Module Breakdown

### 1. Resume Upload & Processing

**Flow:** File upload → text extraction → metadata parsing → MongoDB storage

- Multer handles multipart/form-data with disk storage (temp), fileFilter for PDF/DOCX only, 5MB limit
- `pdf-parse` extracts text from PDFs
- `mammoth` extracts text from DOCX
- File deleted from disk after extraction — only text stored in DB
- Basic NLP parsing via regex + keyword matching:
  - **Skills** — matched against `KNOWN_SKILLS` constant using word-boundary regex (avoids false positives like `java` inside `javascript`)
  - **Education** — lines containing keywords: bachelor, master, university, college, etc.
  - **Experience** — lines with job title keywords or year-range patterns (e.g. `2019–2022`)
  - **Location** — regex for `City, State/Country` pattern

Each resume stores: `rawText`, `skills[]`, `education[]`, `experience[]`, `location`, `fileType`, `fileName`, `userId`, `status`, `aiAnalysis`

---

### 2. AI Resume Analysis

**Flow:** Resume `rawText` → Groq API (Llama 3.3 70B) → structured JSON → stored in resume document

The AI module is isolated — it reads from and writes to the Resume document but has no knowledge of upload logic. Swapping Groq for OpenAI requires changing only `ai-analysis.service.ts`.

**Output schema:**
```json
{
  "summary": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missing_keywords": ["string"],
  "ats_score": 0,
  "improvement_suggestions": ["string"]
}
```

**Error handling:**
- Timeout: axios `timeout: 30000` (30s)
- Invalid JSON from Groq: strips markdown code fences before `JSON.parse()`
- No response: throws with descriptive message, caught in controller with 500 response

---

### 3. Skill Gap Analysis & Course Recommendation

**Flow:** `resumeId` + `dreamJob` → compare skills → diff → map to courses → return

**No AI used here.** Pure deterministic logic:

```
requiredSkills = JOB_SKILLS[dreamJob]
matchedSkills  = requiredSkills ∩ resume.skills
missingSkills  = requiredSkills - resume.skills
matchPercentage = (matchedSkills.length / requiredSkills.length) × 100
```

Supported roles in `job-skills.dataset.ts`:
- Frontend Developer, Backend Developer, Fullstack Developer
- DevOps Engineer, Data Scientist, ML Engineer, Mobile Developer

Course recommendations come from `courses.dataset.ts` — each course is mapped to a skill. Only courses for `missingSkills` are returned. Static dataset is acceptable per spec; real integration would call Udemy/Coursera APIs.

---

### 4. Career Pivot Logic

**Flow:** Resume skills → score every job role → rank by match % → label difficulty

```
For each role in JOB_SKILLS:
  matchedSkills  = role.skills ∩ resume.skills
  matchPercentage = (matched / required) × 100
  difficulty:
    ≥ 70% → easy
    ≥ 40% → moderate
    < 40% → hard

Return sorted descending by matchPercentage
```

This gives candidates a realistic view of which roles they're closest to and what they'd need to get there.

---

### 5. Job Recommendation Module

**Flow:** Resume skills → simulate 3 platform fetchers → score jobs → return ranked list

Three simulated fetchers (`fetchFromNaukri`, `fetchFromLinkedIn`, `fetchFromIndeed`) aggregate jobs from `jobs.dataset.ts`. In production, these would call:
- Naukri: `https://developer.naukri.com`
- LinkedIn: `https://api.linkedin.com/v2/jobSearch`
- Indeed: `https://apis.indeed.com/ads/apisearch`

**Scoring:**
```
matchedSkills = job.requiredSkills ∩ candidateSkills
matchScore = (matched / required) × 100
```

**Admin vault boost:** If an admin has approved a career path for this user, the target role's skills are unioned with current skills before scoring — making recommendations smarter and goal-aware.

Jobs with `matchScore = 0` are filtered out. Results sorted descending.

---

### 6. Admin Vault Workflow

**Admin flow:**
1. Admin logs in (hardcoded credentials via `.env`)
2. Views all resumes from all users
3. Clicks "Review" → side panel opens with:
   - Extracted skills
   - ATS score + AI summary
   - Skill gap check (admin selects a role to compare)
   - Career path approval form + admin notes
4. Admin approves a career path → `AdminVault` document created, resume `status` → `approved`

**User sees:**
- Resume card with `Approved` badge
- Green banner showing approved career path, admin notes, skills to work on

`AdminVault` schema: `resumeId` (ref), `approvedCareerPath`, `adminNotes`, `skillGapSummary[]`, `status`

---

### 7. CV Tailoring & Auto-Apply

**Flow:** `rawText` + `jobDescription` → Groq → tailored output JSON

**Output:**
```json
{
  "tailoredSummary": "string",
  "highlightedSkills": ["string"],
  "tailoredBullets": ["string"],
  "coverLetterSnippet": "string"
}
```

**Auto-Apply stub:** `POST /api/cv/auto-apply` returns simulated field values. Architecture is designed for Chrome extension integration — the extension would detect a job application form, call this endpoint, and auto-fill fields using the tailored output.

---

## AI Prompts & Strategy

### Resume Analysis Prompt

Located in `src/modules/ai-analysis/ai-analysis.prompt.ts`

Key design decisions:
- **Low temperature (0.3)** — prioritizes consistent, structured output over creativity
- **Explicit JSON-only instruction repeated twice** — LLMs tend to wrap JSON in markdown; being explicit prevents `JSON.parse()` failures
- **Strict schema defined in prompt** — includes field names, types, and constraints (`ats_score` must be 0–100)
- **Post-processing** — strips backtick code fences before parsing as safety net

### CV Tailoring Prompt

Located in `src/modules/cv-tailoring/cv-tailoring.prompt.ts`

- **Temperature 0.4** — slightly more creative than analysis (rewriting needs some variation)
- Job description injected verbatim into prompt — model uses it as context for tailoring
- Returns actionable, job-specific output (not generic advice)

### Model Choice

**`llama-3.3-70b-versatile`** via Groq — chosen for:
- Free tier with generous rate limits
- Fast inference (Groq's hardware advantage)
- Strong instruction-following for structured JSON output
- 128K context window — handles long resumes without truncation

---

## Auth & Session Management

- **Users** register with name, email, password (bcrypt hashed, 12 rounds)
- **Admin** is hardcoded via `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` — no DB entry
- Both use the same `POST /api/auth/login` endpoint — role in JWT differentiates them
- JWT signed with `JWT_SECRET`, expires in `JWT_EXPIRES_IN` (default 7d)
- Frontend stores token in `localStorage`, attached to every request via axios interceptor
- 401 on protected routes → interceptor clears storage + redirects to `/login`
- Auth routes (`/auth/login`, `/auth/register`) are excluded from the 401 redirect

**Middleware chain:**
```
protect (verify JWT, attach req.user)
  └── adminOnly (check req.user.role === 'admin')
```

---

## API Reference

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login (user or admin) |

### Resumes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/resumes` | User | Upload resume |
| GET | `/api/resumes` | User/Admin | List resumes (scoped by role) |
| GET | `/api/resumes/:id` | User/Admin | Get single resume |

### AI Analysis
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/analysis/:id/analyze` | User | Run Groq analysis |

### Skill Gap
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/skill-gap/analyze` | User/Admin | Analyze skill gap |

### Career Pivot
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/career-pivot/:id/predict` | User | Predict career paths |

### Admin Vault
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/admin-vault` | Admin | Approve career path |
| GET | `/api/admin-vault` | Admin | All vault entries |
| GET | `/api/admin-vault/resume/:resumeId` | User | Get own vault entry |

### Jobs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/jobs/:id/recommend` | User | Get job recommendations |

### CV Tailoring
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/cv/tailor` | User | Tailor resume for job |
| POST | `/api/cv/auto-apply` | User | Auto-apply stub |

---

## Environment Variables

```env
# Backend (.env)
MONGO_URI=mongodb+srv://...
PORT=5002
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@skillmount.com
ADMIN_PASSWORD=Admin@123
GROQ_API_KEY=gsk_...
```

---

## Running Locally

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5002`

---

## Future Extensibility & Scaling

### Splitting into Microservices

Each module is already structured as an independent service. To split:

```
ai-resume-platform/
  ├── services/
  │   ├── auth-service/        (port 3001)
  │   ├── resume-service/      (port 3002)
  │   ├── analysis-service/    (port 3003)
  │   ├── skill-gap-service/   (port 3004)
  │   ├── job-service/         (port 3005)
  │   └── admin-service/       (port 3006)
  └── api-gateway/             (port 3000) ← nginx or Express gateway
```

Each service has its own DB connection, its own `.env`, and communicates via REST or message queue (RabbitMQ/Kafka). No shared state between services.

### Bonus Features (Architecture Ready)

| Feature | Status | How to Add |
|---------|--------|-----------|
| Background jobs | Stub | Add `bull` queue for AI analysis — non-blocking |
| Streaming AI output | Ready | Groq supports streaming; pipe response to SSE |
| Chrome Extension | Stub | `/api/cv/auto-apply` is the integration point |
| Token usage logging | Easy | Log `response.usage` from Groq response |
| Unit tests | Structure ready | Jest + supertest per module |
| Deployment | Ready | Backend → Railway/Render, Frontend → Vercel |

### Real Job Platform Integration

Replace the stub fetchers in `job-recommendation.service.ts`:

```typescript
// Current (stub)
function fetchFromNaukri(skills: string[]) {
  return JOBS.filter(j => j.platform === 'naukri')
}

// Future (real)
async function fetchFromNaukri(skills: string[]) {
  return await axios.get('https://developer.naukri.com/api/jobs', {
    params: { skills: skills.join(',') },
    headers: { 'X-Api-Key': process.env.NAUKRI_API_KEY }
  })
}
```

### Real Course Integration

Replace `courses.dataset.ts` with Udemy/Coursera API calls:

```typescript
// Future
async function fetchCourses(skill: string) {
  return await axios.get('https://www.udemy.com/api-2.0/courses/', {
    params: { search: skill },
    headers: { Authorization: `Bearer ${process.env.UDEMY_KEY}` }
  })
}
```

---

## Project Structure

```
ai-resume-platform/
├── backend/
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── resume/
│       │   ├── ai-analysis/
│       │   ├── skill-gap/
│       │   ├── career-pivot/
│       │   ├── job-recommendation/
│       │   ├── cv-tailoring/
│       │   └── admin-vault/
│       ├── shared/
│       │   ├── constants/
│       │   ├── datasets/
│       │   └── middleware/
│       ├── config/
│       ├── app.ts
│       └── server.ts
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/
        │   ├── resume/
        │   ├── skill-gap/
        │   ├── jobs/
        │   └── admin/
        ├── pages/
        ├── shared/
        │   ├── components/
        │   └── lib/
        └── App.tsx
```
