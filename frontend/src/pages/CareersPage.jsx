import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import { SectionCard, SectionTitle, EmptyState, PrimaryButton } from '../components/UI'

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--success)']
const MATCH_STYLES = {
  'Top Match': { bg: 'rgba(109,93,246,.15)', color: '#A78BFA', border: 'rgba(109,93,246,.3)' },
  'Good Match': { bg: 'rgba(56,189,248,.15)', color: '#7DD3FC', border: 'rgba(56,189,248,.3)' },
  'Possible Match': { bg: 'rgba(34,197,94,.15)', color: '#86EFAC', border: 'rgba(34,197,94,.3)' },
}

export default function CareersPage() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analysisAPI.getAll()
      .then(({ data }) => { if (data.analyses?.length) setAnalysis(data.analyses[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 24 }}><div style={{ height: 200, background: 'var(--surface)', borderRadius: 14 }} /></div>

  if (!analysis) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Career Match</h2>
      <EmptyState icon="🎯" title="No Analysis Yet" description="Upload and analyze your resume to get AI-predicted career role matches."
        action={<PrimaryButton onClick={() => navigate('/dashboard/resume')}>Upload Resume →</PrimaryButton>} />
    </div>
  )

  const matches = analysis.careerMatches || []

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Career Match</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>AI-predicted roles based on your skills and experience.</p>
      </div>

      {/* Hero best match */}
      {matches[0] && (
        <div style={{
          background: 'rgba(109,93,246,.07)', border: '1px solid rgba(109,93,246,.35)',
          borderRadius: 16, padding: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(109,93,246,.2)', color: '#A78BFA', border: '1px solid rgba(109,93,246,.3)', padding: '3px 10px', borderRadius: 10, letterSpacing: '.4px' }}>
              ✦ TOP MATCH
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 6 }}>
            {matches[0].role}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 10, background: 'var(--surface3)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${matches[0].score}%`, height: '100%', background: 'linear-gradient(90deg,var(--primary),#8B5CF6)', borderRadius: 5, transition: 'width 1.2s ease' }} />
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#A78BFA', fontFamily: "'Space Grotesk',sans-serif" }}>
              {matches[0].score}%
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>Match confidence · Based on your detected skills</p>
        </div>
      )}

      {/* All matches */}
      <SectionCard>
        <SectionTitle aiBadge>All Role Predictions</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {matches.map((m, i) => {
            const ms = MATCH_STYLES[m.match] || MATCH_STYLES['Possible Match']
            return (
              <div key={m.role} style={{
                background: 'var(--surface2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'border-color .2s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(109,93,246,.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: COLORS[i], fontFamily: "'Space Grotesk',sans-serif" }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{m.role}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: ms.bg, color: ms.color, border: `1px solid ${ms.border}`, padding: '3px 10px', borderRadius: 10 }}>
                      {m.match}
                    </span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: COLORS[i], fontFamily: "'Space Grotesk',sans-serif" }}>
                      {m.score}%
                    </span>
                  </div>
                </div>
                <div style={{ height: 7, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${m.score}%`, height: '100%', background: COLORS[i], borderRadius: 4, transition: 'width 1.2s ease' }} />
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <PrimaryButton fullWidth onClick={() => navigate('/dashboard/skills')}>
        View Skill Gap Analysis →
      </PrimaryButton>
    </div>
  )
}
