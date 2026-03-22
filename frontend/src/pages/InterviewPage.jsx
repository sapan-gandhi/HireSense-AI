import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import { SectionCard, EmptyState, PrimaryButton } from '../components/UI'

const Q_STYLES = {
  technical: { label: 'TECHNICAL', bg: 'rgba(109,93,246,.15)', color: '#A78BFA', border: 'rgba(109,93,246,.3)' },
  conceptual: { label: 'CONCEPTUAL', bg: 'rgba(56,189,248,.15)', color: '#7DD3FC', border: 'rgba(56,189,248,.3)' },
  hr: { label: 'BEHAVIORAL', bg: 'rgba(34,197,94,.15)', color: '#86EFAC', border: 'rgba(34,197,94,.3)' },
}

function QCard({ q, type, index }) {
  const [open, setOpen] = useState(false)
  const s = Q_STYLES[type] || Q_STYLES.technical
  const qText = typeof q === 'object' ? q.question : q
  const aText = typeof q === 'object' ? q.answer : ''
  return (
    <div onClick={() => setOpen(!open)} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, cursor: 'pointer', transition: 'border-color .2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.5px', background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 9px', borderRadius: 10, flexShrink: 0 }}>{s.label}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text)', fontWeight: 500 }}>Q{index}. {qText}</div>
          {open && aText && (
            <div style={{ marginTop: 12, padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, borderLeft: `2px solid ${s.color}`, fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: '.4px' }}>SAMPLE ANSWER</span>
              <p style={{ marginTop: 6 }}>{aText}</p>
            </div>
          )}
          {!open && aText && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>Click to see sample answer</p>}
        </div>
        <span style={{ color: 'var(--text3)', fontSize: 16, flexShrink: 0 }}>{open ? '▲' : '▼'}</span>
      </div>
    </div>
  )
}

export default function InterviewPage() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('technical')

  useEffect(() => {
    analysisAPI.getAll().then(({ data }) => { if (data.analyses?.length) setAnalysis(data.analyses[0]) })
      .catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 200, background: 'var(--surface)', borderRadius: 14 }} /></div>

  if (!analysis?.interviewQuestions) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Interview Prep</h2>
      <EmptyState icon="💬" title="No Questions Yet" description="Analyze your resume to get tailored interview questions for your target role."
        action={<PrimaryButton onClick={() => navigate('/dashboard/resume')}>Get Started</PrimaryButton>} />
    </div>
  )

  const qs = analysis.interviewQuestions
  const role = analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'Target Role'
  const tabs = ['technical', 'conceptual', 'hr'].filter(k => qs[k]?.length)
  const total = tabs.reduce((acc, k) => acc + (qs[k]?.length || 0), 0)

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Interview Prep</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>{total} questions tailored for <strong>{role}</strong></p>
      </div>
      <div style={{ background: 'rgba(56,189,248,.06)', border: '1px solid rgba(56,189,248,.3)', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ fontSize: 30 }}>💬</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>{role} Interview Questions</div>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Click any question to reveal a professional sample answer · {total} questions total</p>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: 'rgba(56,189,248,.15)', color: '#7DD3FC', border: '1px solid rgba(56,189,248,.3)', padding: '3px 10px', borderRadius: 10, letterSpacing: '.4px', flexShrink: 0 }}>AI GENERATED</span>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map(tab => {
          const s = Q_STYLES[tab]
          const count = qs[tab]?.length || 0
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? s.bg : 'var(--surface)', border: `1px solid ${activeTab === tab ? s.color + '66' : 'var(--border)'}`, color: activeTab === tab ? s.color : 'var(--text2)', padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
              {s.label} ({count})
            </button>
          )
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {(qs[activeTab] || []).map((q, i) => <QCard key={i} q={q} type={activeTab} index={i + 1} />)}
      </div>
      <SectionCard>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>💡 Interview Tips</div>
        {['Use the STAR method for behavioral questions (Situation, Task, Action, Result)', 'Research the company and role thoroughly before the interview', 'Prepare 2-3 thoughtful questions to ask the interviewer', 'Practice answers out loud — not just in your head'].map(tip => (
          <div key={tip} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, marginBottom: 6, lineHeight: 1.5 }}><span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>{tip}</div>
        ))}
      </SectionCard>
    </div>
  )
}
