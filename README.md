# HireSense AI ✦

<div align="center">

![HireSense AI](https://img.shields.io/badge/HireSense-AI-6D5DF6?style=for-the-badge&logo=artificial-intelligence&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

### **Hiring Intelligence Platform**
*Resume analysis · JD matching · Shortlist probability · Explainable AI · Improvement simulation*

**[🚀 Live Demo](https://hire-sense-ai-mocha.vercel.app)** &nbsp;|&nbsp; **[📧 Contact](mailto:sapgandhi811@gmail.com)** &nbsp;|&nbsp; **[🐛 Report Bug](https://github.com/sapan-gandhi/HireSense-AI/issues)**

</div>

---

## 📌 Overview

**HireSense AI** goes beyond a typical resume scorer. It simulates real hiring decisions — telling you *why* you would or would not be shortlisted, and exactly what to change to improve your chances.

Built for students, freshers, and job seekers who want data-driven, actionable career guidance instead of generic feedback.

> "Not just a career assistant — a hiring simulation platform."

---

## ✨ Features

### Core Pipeline
| Feature | Description |
|---|---|
| 📄 **Resume Upload & Parsing** | PDF / TXT support with intelligent skill extraction |
| 📊 **Resume Scoring** | Calibrated 0–100 score with realistic benchmarks |
| 🎯 **Career Match** | AI-predicted role predictions based on skill profile |
| 🔍 **Skill Gap Analysis** | Visual breakdown — skills you have vs. skills you need |
| 🗺️ **4-Week Roadmap** | Personalised week-by-week upskilling plan |
| 💬 **Interview Prep** | 30 Q&As (10 Technical · 10 Conceptual · 10 HR) with professional answers |

### Hiring Intelligence Layer
| Feature | Description |
|---|---|
| 🎯 **JD Intelligence Match** | Full recruiter-level job description analysis |
| 📈 **Shortlist Probability** | 6-factor weighted probability engine (0–96%) |
| 🧠 **Semantic Score** | TF-IDF cosine similarity between resume and JD |
| 🌐 **Domain Alignment** | How well your background matches the JD domain |
| 💡 **Explainable AI** | Exact reasons why you would / would not be shortlisted |
| 📊 **Score Legend** | Contextual interpretation of your probability score |
| 🔮 **Improvement Simulation** | "+8% if you add TypeScript" — quantified action items |
| 🔑 **JD Keyword Gaps** | Missing keywords with suggested placement in resume |
| 📝 **Executive Summary** | One-paragraph recruiter-style hiring verdict |
| 🤖 **ATS Coverage** | Keyword coverage graded A–D with specific gaps |
| ✨ **Resume Improver** | AI rewrites weak bullets into professional ATS-ready language |
| 📋 **PDF Report Export** | Complete career intelligence report — print as PDF |

---

## 🛠️ Tech Stack

```
Frontend        React 18 + Vite + Tailwind CSS + React Router
Backend         Node.js + Express.js
Database        MongoDB + Mongoose (Atlas in production)
AI Engine       Anthropic Claude API + rule-based fallback
Similarity      TF-IDF cosine similarity (custom implementation)
Auth            JWT (no external auth provider)
Email           Nodemailer + Gmail SMTP
Deployment      Vercel (frontend) + Render (backend) + MongoDB Atlas
```

---

## 🏗️ Architecture

```
HireSense-AI/
├── frontend/                          # React + Vite SPA
│   ├── src/
│   │   ├── pages/                     # All dashboard pages
│   │   │   ├── OverviewPage.jsx       # Dashboard with intelligence cards
│   │   │   ├── ResumePage.jsx         # Upload + analysis results
│   │   │   ├── CareersPage.jsx        # Role prediction
│   │   │   ├── SkillGapPage.jsx       # Skill comparison
│   │   │   ├── RoadmapPage.jsx        # 4-week learning plan
│   │   │   ├── InterviewPage.jsx      # 30 Q&A with answers
│   │   │   ├── JDMatchPage.jsx        # Full intelligence match
│   │   │   ├── ResumeImproverPage.jsx # Before/after rewrites
│   │   │   └── ReportPage.jsx         # PDF export
│   │   ├── components/
│   │   │   ├── Sidebar.jsx            # Navigation
│   │   │   └── UI.jsx                 # Design system components
│   │   ├── context/AuthContext.jsx    # JWT auth state
│   │   └── services/api.js            # Axios API layer
│   └── vercel.json                    # SPA routing config
│
└── backend/                           # Node.js + Express API
    ├── controllers/                   # Route handlers
    ├── services/
    │   ├── resumeAnalysisService.js   # Scoring + skill extraction
    │   ├── careerMatchService.js      # Role prediction engine
    │   ├── skillGapService.js         # Gap analysis
    │   ├── roadmapService.js          # Roadmap generation
    │   ├── interviewService.js        # Q&A bank (150 questions)
    │   ├── semanticSimilarityService.js  # TF-IDF cosine similarity
    │   ├── probabilityEngineService.js   # Shortlist probability
    │   ├── jdAnalysisService.js          # JD deep parsing
    │   ├── explainabilityService.js      # Why hired/rejected
    │   ├── improvementSimulationService.js # Action → delta
    │   ├── resumeImproverService.js      # AI rewrites
    │   └── reportService.js              # HTML report generation
    ├── models/                        # Mongoose schemas
    ├── routes/                        # Express routes
    └── middleware/                    # Auth, error handling, upload
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) or MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/sapan-gandhi/HireSense-AI.git
cd HireSense-AI
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env with your values (see Environment Variables below)
npm install
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

### 4. Open the app
```
Frontend → http://localhost:3000
Backend  → http://localhost:5000
```

---

## ⚙️ Environment Variables

Create `backend/.env` from `.env.example`:

```dotenv
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/hiresense-ai

# Auth
JWT_SECRET=your_minimum_32_character_secret_key
JWT_EXPIRES_IN=7d

# Anthropic Claude API (optional — rule-based fallback works without it)
# Get your key at: https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxxx

# Gmail OTP for email verification (optional)
# Without these, OTP prints to console in dev mode
# Setup: myaccount.google.com/apppasswords
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_16char_app_password

# Production only
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🌐 Deployment

### MongoDB Atlas
1. Create free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create database user → allow access from anywhere (`0.0.0.0/0`)
3. Copy connection string → paste as `MONGO_URI` in Render

### Backend → Render
1. Connect GitHub repo at [render.com](https://render.com)
2. Root directory: `backend` · Build: `npm install` · Start: `npm start`
3. Add all environment variables from above

### Frontend → Vercel
1. Import repo at [vercel.com](https://vercel.com)
2. Root directory: `frontend` · Framework: `Vite`
3. Install command: `npm install --legacy-peer-deps`
4. Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

> **Note:** Render free tier spins down after 15 min inactivity. First request takes ~60s to wake up. Pre-warm before demos by hitting `/api/health`.

---

## 📡 API Reference

```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login
GET    /api/auth/me                Get current user

POST   /api/resume/upload          Upload resume (PDF/TXT)
POST   /api/resume/improve         Generate AI improvements

POST   /api/analysis/run           Run full career analysis
GET    /api/analysis/user/all      Get user's analyses

POST   /api/jd/match               JD intelligence match

GET    /api/report/export/latest   Export HTML report

GET    /api/health                 Health check
```

---

## 🧪 Test Data

Use this resume to see the full demo flow:

```
Priya Sharma | priya@gmail.com | github.com/priyasharma

SUMMARY
Computer Science graduate with experience in web development.

SKILLS
HTML, CSS, JavaScript, React, Python, SQL, Git, MySQL

EDUCATION
B.E. Computer Science — Mumbai University | 2020-2024 | CGPA: 7.1

EXPERIENCE
Web Dev Intern | Softworks Pvt Ltd | Jun–Aug 2023
- Built web pages using HTML, CSS and JavaScript
- Fixed bugs in existing website

PROJECTS
Todo App | HTML, CSS, JavaScript
Weather App | React, API
Student Portal | Python, MySQL

CERTIFICATIONS
Udemy Web Dev Bootcamp | HackerRank Python Certificate
```

**Expected results:**
- Resume Score → ~58/100 (Fair)
- Top Match → Frontend Developer (63%)
- Skill Gaps → TypeScript, Tailwind, Responsive Design
- JD Shortlist → ~38–45% vs Full Stack JD

---

## 🗺️ Roadmap

- [ ] LinkedIn profile import
- [ ] Company-specific JD templates
- [ ] Multi-resume comparison
- [ ] Peer benchmarking (anonymised)
- [ ] Claude-powered personalised cover letter generator
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add AmazingFeature'

# Push and open a Pull Request
git push origin feature/AmazingFeature
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Sapan Gandhi**

[![Email](https://img.shields.io/badge/Email-sapgandhi811%40gmail.com-D14836?style=flat&logo=gmail&logoColor=white)](mailto:sapgandhi811@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-sapan--gandhi-181717?style=flat&logo=github&logoColor=white)](https://github.com/sapan-gandhi)

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) — Claude AI API
- [MongoDB Atlas](https://cloud.mongodb.com) — Database hosting
- [Render](https://render.com) — Backend hosting
- [Vercel](https://vercel.com) — Frontend hosting
- [Lucide React](https://lucide.dev) — Icon library

---

<div align="center">

**Built with ❤️ by Sapan Gandhi**

[⭐ Star this repo](https://github.com/sapan-gandhi/HireSense-AI) if you found it helpful!

</div>
