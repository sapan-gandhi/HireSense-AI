import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, Map, MessageSquare } from 'lucide-react'

const features = [
  { icon: '📄', label: 'Resume Analysis', desc: 'AI extracts skills, scores quality, and gives actionable improvements.', color: 'rgba(109,93,246,.2)' },
  { icon: '🎯', label: 'Career Matching', desc: 'Predicts top role fits with match scores based on your skills.', color: 'rgba(56,189,248,.2)' },
  { icon: '🔍', label: 'Skill Gap Analysis', desc: 'Visualize exactly what you have vs. what you need.', color: 'rgba(34,197,94,.2)' },
  { icon: '🗺️', label: 'Learning Roadmap', desc: '4-week structured plan tailored to your missing skills.', color: 'rgba(245,158,11,.2)' },
  { icon: '💬', label: 'Interview Prep', desc: 'Role-specific technical, conceptual, and HR questions.', color: 'rgba(239,68,68,.2)' },
  { icon: '⚡', label: 'Instant Insights', desc: 'Full pipeline analysis in seconds with explainable AI logic.', color: 'rgba(109,93,246,.2)' },
]

const workflow = [
  { step: '01', title: 'Upload Resume', desc: 'PDF or paste plain text' },
  { step: '02', title: 'AI Analysis', desc: 'Skills extracted & scored' },
  { step: '03', title: 'Career Matching', desc: 'Top roles predicted' },
  { step: '04', title: 'Skill Gap', desc: 'Gaps identified visually' },
  { step: '05', title: 'Roadmap', desc: '4-week learning plan' },
  { step: '06', title: 'Interview Prep', desc: 'Questions per role' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700 }}>
          <span style={{ background: 'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Career Copilot
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            Sign In
          </button>
          <button onClick={() => navigate('/signup')} style={{ background: 'linear-gradient(135deg,var(--primary),#8B5CF6)', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 10, cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}>
            Get Started
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6 }}
          style={{ textAlign: 'center', padding: '72px 0 48px' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(109,93,246,.15)', border: '1px solid rgba(109,93,246,.4)',
            color: '#A78BFA', fontSize: 12, fontWeight: 600, padding: '5px 14px',
            borderRadius: 20, marginBottom: 24, letterSpacing: '.5px'
          }}>
            <Zap size={12} /> AI-Powered Career Intelligence Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(36px,5vw,64px)', fontWeight: 700, lineHeight: 1.12,
            marginBottom: 20,
            background: 'linear-gradient(135deg,#fff 0%,#A78BFA 50%,#38BDF8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Your Intelligent<br />Career Copilot
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text2)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Upload your resume. Get AI-driven career insights, discover role matches, close skill gaps, and ace your interviews.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/signup')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,var(--primary),#8B5CF6)', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Start For Free <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '14px 32px', borderRadius: 12, fontSize: 16, cursor: 'pointer', fontFamily: 'inherit' }}>
              Sign In
            </button>
          </div>
        </motion.div>

        {/* Features grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .3, duration: .6 }}
        >
          <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            Everything you need to land your dream role
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 15, marginBottom: 36 }}>
            AI-powered tools designed for students and early-career professionals
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 14, marginBottom: 64 }}>
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .1 * i }}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, transition: 'border-color .2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(109,93,246,.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 12 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{f.label}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Workflow */}
        <div style={{ marginBottom: 64 }}>
          <h2 style={{ textAlign: 'center', fontSize: 26, fontWeight: 700, marginBottom: 8 }}>How it works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 14, marginBottom: 36 }}>
            From resume upload to interview-ready in minutes
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {workflow.map((w, i) => (
              <div key={w.step} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: '.5px', marginBottom: 8 }}>
                  STEP {w.step}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{w.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', padding: '40px 0 60px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid rgba(109,93,246,.3)', borderRadius: 24, padding: '48px 32px' }}>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12 }}>Ready to launch your career?</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 28, fontSize: 15 }}>
              Join thousands of students who landed roles they love.
            </p>
            <button
              onClick={() => navigate('/signup')}
              style={{ background: 'linear-gradient(135deg,var(--primary),#8B5CF6)', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              Get Started Free →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
