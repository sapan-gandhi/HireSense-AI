import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import { SectionCard, SectionTitle, EmptyState, PrimaryButton } from '../components/UI'

const WEEK_COLORS = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)']

export default function RoadmapPage() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analysisAPI.getAll()
      .then(({ data }) => { if (data.analyses?.length) setAnalysis(data.analyses[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 300, background: 'var(--surface)', borderRadius: 14 }} /></div>

  if (!analysis?.roadmap?.length) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Learning Roadmap</h2>
      <EmptyState icon="🗺️" title="No Roadmap Yet" description="Complete your resume analysis to get a personalized 4-week learning plan."
        action={<PrimaryButton onClick={() => navigate('/dashboard/resume')}>Get Started →</PrimaryButton>} />
    </div>
  )

  const role = analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'your target role'

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Learning Roadmap</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          Your personalized 4-week plan to become a <strong>{role}</strong>.
        </p>
      </div>

      {/* Header card */}
      <div style={{
        background: 'rgba(109,93,246,.07)', border: '1px solid rgba(109,93,246,.3)',
        borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{ fontSize: 32 }}>🗺️</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>4-Week Sprint to {role}</div>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            {analysis.missingSkills?.length || 0} missing skills · Estimated 6-10 hrs/week · AI-generated plan
          </p>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: 10, fontWeight: 700,
          background: 'rgba(109,93,246,.2)', color: '#A78BFA',
          border: '1px solid rgba(109,93,246,.3)', padding: '3px 10px',
          borderRadius: 10, letterSpacing: '.4px', flexShrink: 0,
        }}>
          AI GENERATED
        </span>
      </div>

      {/* Week cards */}
      {(analysis.roadmap || []).map((week, i) => (
        <div key={week.week} style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderLeft: `3px solid ${WEEK_COLORS[i]}`,
          borderRadius: 14, padding: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: WEEK_COLORS[i], letterSpacing: '.5px', textTransform: 'uppercase' }}>
              Week {week.week}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text3)' }}>{week.topics?.length || 0} topics</span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 12 }}>
            {week.goal}
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
            {(week.topics || []).map(t => (
              <li key={t} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: WEEK_COLORS[i], flexShrink: 0, marginTop: 1 }}>→</span>
                {t}
              </li>
            ))}
          </ul>

          {week.task && (
            <div style={{
              background: 'var(--surface2)', border: `1px solid ${WEEK_COLORS[i]}33`,
              borderLeft: `2px solid ${WEEK_COLORS[i]}`,
              borderRadius: 8, padding: '10px 12px', fontSize: 13, color: 'var(--text2)',
            }}>
              🎯 <strong>Mini Task:</strong> {week.task}
            </div>
          )}
        </div>
      ))}

      <PrimaryButton fullWidth onClick={() => navigate('/dashboard/interview')}>
        Practice Interview Questions →
      </PrimaryButton>
    </div>
  )
}
