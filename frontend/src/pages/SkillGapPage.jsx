import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import { SectionCard, SectionTitle, SkillChip, EmptyState, PrimaryButton } from '../components/UI'

export default function SkillGapPage() {
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
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Skill Gap Analysis</h2>
      <EmptyState icon="🔍" title="No Analysis Yet" description="Analyze your resume to see what skills you have and what you need for your target role."
        action={<PrimaryButton onClick={() => navigate('/dashboard/resume')}>Get Started →</PrimaryButton>} />
    </div>
  )

  const readiness = analysis.readinessScore || 0
  const readinessColor = readiness >= 70 ? 'var(--success)' : readiness >= 40 ? 'var(--warning)' : 'var(--danger)'
  const role = analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'Target Role'

  // Build full required skills list (matched + missing)
  const allRequired = [...(analysis.matchedSkills || []), ...(analysis.missingSkills || [])]

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Skill Gap Analysis</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Your current skills vs. what <strong>{role}</strong> requires.</p>
      </div>

      {/* Readiness hero */}
      <div style={{
        background: 'var(--surface)', border: `1px solid ${readinessColor}44`,
        borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          border: `4px solid ${readinessColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: readinessColor, fontFamily: "'Space Grotesk',sans-serif" }}>
            {readiness}%
          </span>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 4 }}>
            {readiness >= 70 ? 'Strong Readiness' : readiness >= 40 ? 'Moderate Readiness' : 'Early Stage'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
            You match {analysis.matchedSkills?.length || 0} of {allRequired.length} required skills for {role}.
            {analysis.missingSkills?.length > 0 && ` ${analysis.missingSkills.length} skills left to learn.`}
          </p>
        </div>
      </div>

      {/* Skill-by-skill breakdown */}
      {allRequired.length > 0 && (
        <SectionCard>
          <SectionTitle aiBadge>Required Skills Breakdown</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allRequired.map(skill => {
              const has = (analysis.matchedSkills || []).map(s => s.toLowerCase()).includes(skill.toLowerCase())
              return (
                <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)', width: 160, flexShrink: 0 }}>{skill}</span>
                  <div style={{ flex: 1, height: 7, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: has ? '100%' : '0%', height: '100%', background: has ? 'var(--success)' : 'var(--danger)', borderRadius: 4, transition: 'width 1.2s ease' }} />
                  </div>
                  <span style={{ fontSize: 13, color: has ? 'var(--success)' : 'var(--danger)', fontWeight: 700, width: 20 }}>
                    {has ? '✓' : '✗'}
                  </span>
                </div>
              )
            })}
          </div>
        </SectionCard>
      )}

      {/* Have vs Missing chips */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard>
          <SectionTitle>✅ Skills You Have</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {(analysis.matchedSkills || []).length === 0
              ? <p style={{ fontSize: 13, color: 'var(--text3)' }}>No matched skills detected.</p>
              : (analysis.matchedSkills || []).map(s => <SkillChip key={s} label={s} variant="have" />)}
          </div>
        </SectionCard>
        <SectionCard>
          <SectionTitle>❌ Skills to Learn</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {(analysis.missingSkills || []).length === 0
              ? <p style={{ fontSize: 13, color: 'var(--success)' }}>No skill gaps! 🎉</p>
              : (analysis.missingSkills || []).map(s => <SkillChip key={s} label={s} variant="missing" />)}
          </div>
        </SectionCard>
      </div>

      <PrimaryButton fullWidth onClick={() => navigate('/dashboard/roadmap')}>
        Generate Learning Roadmap →
      </PrimaryButton>
    </div>
  )
}
