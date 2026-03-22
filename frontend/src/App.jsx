import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import { LoginPage, SignupPage } from './pages/LoginPage'
import DashboardLayout from './pages/DashboardLayout'
import OverviewPage from './pages/OverviewPage'
import ResumePage from './pages/ResumePage'
import CareersPage from './pages/CareersPage'
import SkillGapPage from './pages/SkillGapPage'
import RoadmapPage from './pages/RoadmapPage'
import InterviewPage from './pages/InterviewPage'
import JDMatchPage from './pages/JDMatchPage'
import ResumeImproverPage from './pages/ResumeImproverPage'
import ReportPage from './pages/ReportPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="resume" element={<ResumePage />} />
          <Route path="careers" element={<CareersPage />} />
          <Route path="skills" element={<SkillGapPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="jd-match" element={<JDMatchPage />} />
          <Route path="improver" element={<ResumeImproverPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}
