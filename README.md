# AI Career Copilot 🚀

A full-stack AI-powered career guidance platform for students. Upload your resume and get instant career role predictions, skill gap analysis, a 4-week learning roadmap, and tailored interview questions — all powered by Claude AI.

---

## Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend   | Node.js, Express.js                         |
| Database  | MongoDB + Mongoose                          |
| AI        | Anthropic Claude API (+ rule-based fallback)|
| Auth      | JWT + bcryptjs                              |
| Upload    | Multer + pdf-parse                          |

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key (optional — app works without it via rule-based fallback)

---

### 1. Clone / unzip the project

```bash
unzip ai-career-copilot.zip
cd ai-career-copilot
```

---

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env and fill in your values
npm install
npm run dev
```

Backend runs at: **http://localhost:5000**

#### `.env` values

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-career-copilot
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx   # optional
```

> **No Anthropic API key?** The app automatically falls back to a smart rule-based pipeline. All features still work.

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

The Vite dev server proxies `/api/*` to `http://localhost:5000` automatically.

---

### 4. Build for production

```bash
# Frontend
cd frontend && npm run build

# Backend — serve frontend dist from Express (optional)
# Or deploy frontend to Vercel and backend to Railway
```

---

## Project Structure

```
ai-career-copilot/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── UI.jsx        # StatCard, SectionCard, ScoreRing, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── OverviewPage.jsx
│   │   │   ├── ResumePage.jsx
│   │   │   ├── CareersPage.jsx
│   │   │   ├── SkillGapPage.jsx
│   │   │   ├── RoadmapPage.jsx
│   │   │   └── InterviewPage.jsx
│   │   ├── services/
│   │   │   └── api.js        # Axios service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   └── analysisController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── Analysis.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── resume.js
│   │   └── analysis.js
│   ├── services/
│   │   ├── claudeService.js          # Claude API integration
│   │   ├── pdfService.js             # PDF text extraction
│   │   ├── resumeAnalysisService.js  # Scoring + skill extraction
│   │   ├── careerMatchService.js     # Role prediction logic
│   │   ├── skillGapService.js        # Gap analysis
│   │   ├── roadmapService.js         # 4-week plan generator
│   │   └── interviewService.js       # Question bank
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## API Endpoints

| Method | Endpoint                | Auth | Description              |
|--------|-------------------------|------|--------------------------|
| POST   | /api/auth/register      | ❌   | Create account           |
| POST   | /api/auth/login         | ❌   | Sign in                  |
| GET    | /api/auth/me            | ✅   | Get current user         |
| POST   | /api/resume/upload      | ✅   | Upload PDF or TXT        |
| POST   | /api/analysis/run       | ✅   | Run full AI analysis     |
| GET    | /api/analysis/:id       | ✅   | Get single analysis      |
| GET    | /api/analysis/user/all  | ✅   | Get all user analyses    |

---

## Features

1. **Resume Upload & Analysis** — PDF/TXT upload, skill extraction, score 0–100
2. **Career Role Prediction** — Top 3 matches from 5 roles with % confidence
3. **Skill Gap Analysis** — Visual skill-by-skill breakdown + readiness score
4. **4-Week Learning Roadmap** — AI-generated week-by-week plan with mini tasks
5. **Interview Prep** — Technical, conceptual, and HR questions per role

---

## Deployment

### Frontend → Vercel
```bash
cd frontend && npm run build
# Connect to Vercel, set root as /frontend
```

### Backend → Railway
```bash
# Connect GitHub repo to Railway
# Set environment variables in Railway dashboard
# Point MONGO_URI to MongoDB Atlas
```

---

## Hackathon Notes

- The app works **fully offline from Claude API** via the rule-based fallback
- All 5 core features are functional end-to-end
- Premium dark SaaS UI with responsive layout
- Clean modular architecture — easy to extend

---

Built with ❤️ for hackathons. Good luck! ✦
