import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { analysisAPI } from '../services/api'
import { StatCard, SectionCard, SectionTitle, SkillChip, EmptyState, PrimaryButton } from '../components/UI'

function MiniBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 9 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 1.2s ease' }} />
      </div>
    </div>
  )
}

export default function OverviewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analysisAPI.getAll()
      .then(({ data }) => { if (data.analyses?.length) setAnalysis(data.analyses[0]) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ padding: 24 }}>
      <div style={{ height: 28, width: 220, background: 'var(--surface3)', borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ height: 90, background: 'var(--surface)', borderRadius: 14 }} />)}
      </div>
    </div>
  )

  if (!analysis) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Welcome, {user?.name?.split(' ')[0]} 👋</h2>
      <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 28 }}>Let's get your career analysis started.</p>
      <EmptyState icon="🚀" title="No Analysis Yet"
        description="Upload your resume to get AI-powered career insights, role predictions, skill gaps, and a personalised learning roadmap."
        action={<PrimaryButton onClick={() => navigate('/dashboard/resume')}>Upload Resume →</PrimaryButton>}
      />
    </div>
  )

  const bestMatch  = analysis.careerMatches?.[0]
  const jd         = analysis.jdIntelligence  // null until JD Matcher is run
  const scoreColor = analysis.resumeScore >= 80 ? 'var(--success)' : analysis.resumeScore >= 60 ? 'var(--warning)' : 'var(--danger)'
  const readColor  = analysis.readinessScore >= 70 ? 'var(--success)' : analysis.readinessScore >= 45 ? 'var(--warning)' : 'var(--danger)'

  const slColor = !jd ? null :
    jd.shortlistTierColor === 'success' ? 'var(--success)' :
    jd.shortlistTierColor === 'danger'  ? 'var(--danger)'  : 'var(--warning)'

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Header */}
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Here's your career intelligence summary.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
        <StatCard label="Resume Score"    value={analysis.resumeScore}              sub="out of 100"      color="purple" />
        <StatCard label="Readiness Score" value={`${analysis.readinessScore}%`}     sub="for target role" color="blue" />
        <StatCard label="Skills Detected" value={analysis.extractedSkills?.length || 0} sub="from resume"   color="green" />
        <StatCard label="Skills to Learn" value={analysis.missingSkills?.length || 0}   sub="to close gaps" color="amber" />
      </div>

      {/* ── JD Intelligence Cards — only when JD Matcher has been run ── */}
      {jd ? (
        <>
          {/* Shortlist Probability hero */}
          <div style={{ background: `${slColor}11`, border: `1px solid ${slColor}44`, borderRadius: 16, padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', border: `5px solid ${slColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: slColor, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{jd.shortlistProbability}%</span>
              <span style={{ fontSize: 8, color: slColor, opacity: .7, letterSpacing: '.3px' }}>PROB</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.6px', textTransform: 'uppercase', marginBottom: 3 }}>
                Shortlist Probability · {jd.confidenceRange} Confidence
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: slColor, marginBottom: 4 }}>{jd.shortlistTier}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{jd.explanation?.verdict}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#A78BFA' }}>{jd.matchScore}%</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>Skill Match</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#7DD3FC' }}>{jd.semanticScore}%</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>Semantic</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#86EFAC' }}>{jd.domainAlignment}%</div>
                <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase' }}>Domain</div>
              </div>
            </div>
          </div>

          {/* Explainable AI — Hiring Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SectionCard>
              <SectionTitle aiBadge>Why You May Get Shortlisted</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(jd.explanation?.shortlistReasons || []).slice(0, 3).map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 7, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>{r}
                  </div>
                ))}
                {!jd.explanation?.shortlistReasons?.length && <p style={{ fontSize: 12, color: 'var(--text3)' }}>Run JD Matcher to see reasons</p>}
              </div>
            </SectionCard>
            <SectionCard>
              <SectionTitle>⚠ Why You May Get Rejected</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(jd.explanation?.rejectionReasons || []).slice(0, 3).map((r, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text2)', display: 'flex', gap: 7, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✗</span>{r}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* Hiring breakdown bars */}
          <SectionCard>
            <SectionTitle aiBadge>Hiring Intelligence Breakdown</SectionTitle>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12 }}>
              Last analysed against: <strong style={{ color: '#A78BFA' }}>{jd.roleTitle}</strong>
            </p>
            {jd.shortlistBreakdown && (
              <>
                <MiniBar label="Skill Match"      value={jd.shortlistBreakdown.skillMatch}       color="#A78BFA" />
                <MiniBar label="Semantic Score"   value={jd.shortlistBreakdown.semanticScore}    color="#7DD3FC" />
                <MiniBar label="Domain Alignment" value={jd.shortlistBreakdown.domainAlignment}  color="#86EFAC" />
                <MiniBar label="Project Quality"  value={jd.shortlistBreakdown.projectQuality}   color="#FCD34D" />
                <MiniBar label="Achievements"     value={jd.shortlistBreakdown.achievementScore} color="#FB923C" />
                <MiniBar label="Resume Score"     value={jd.shortlistBreakdown.resumeScore}      color="#38BDF8" />
              </>
            )}
            <button onClick={() => navigate('/dashboard/jd-match')} style={{ marginTop: 10, background: 'none', border: 'none', color: '#A78BFA', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>
              Re-run JD analysis →
            </button>
          </SectionCard>

          {/* Critical missing skills */}
          {jd.criticalMissingSkills?.length > 0 && (
            <div style={{ background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 12, padding: '12px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--danger)', marginBottom: 8 }}>
                ⚠ {jd.criticalMissingSkills.length} Critical Missing Skills for {jd.roleTitle}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {jd.criticalMissingSkills.map(s => (
                  <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', color: '#FCA5A5', fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* CTA when JD Matcher hasn't been run yet */
        <div style={{ background: 'rgba(109,93,246,.06)', border: '1px solid rgba(109,93,246,.25)', borderRadius: 14, padding: '20px 18px', textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎯</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Unlock Hiring Intelligence</div>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, lineHeight: 1.5 }}>
            Paste a job description to see your <strong>Shortlist Probability</strong>, Semantic Match Score, and Explainable AI hiring breakdown — right here on the Overview.
          </p>
          <PrimaryButton onClick={() => navigate('/dashboard/jd-match')}>
            Run JD Intelligence Match →
          </PrimaryButton>
        </div>
      )}

      {/* Profile health bars */}
      <SectionCard>
        <SectionTitle>Profile Health</SectionTitle>
        <MiniBar label="Resume Score"   value={analysis.resumeScore}    color={scoreColor} />
        <MiniBar label="Role Readiness" value={analysis.readinessScore} color={readColor} />
        <MiniBar label="Skill Coverage" value={Math.round(((analysis.extractedSkills?.length || 0) / Math.max((analysis.extractedSkills?.length || 0) + (analysis.missingSkills?.length || 0), 1)) * 100)} color="var(--accent)" />
      </SectionCard>

      {/* Best match */}
      {bestMatch && (
        <SectionCard>
          <SectionTitle aiBadge>Best Career Match</SectionTitle>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", marginBottom: 8, color: '#A78BFA' }}>
            {analysis.selectedRole || bestMatch.role}
          </div>
          <div style={{ height: 7, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ width: `${bestMatch.score}%`, height: '100%', background: 'linear-gradient(90deg,var(--primary),var(--accent))', borderRadius: 4, transition: 'width 1.2s ease' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 12, color: 'var(--text2)' }}>{bestMatch.score}% match confidence</p>
            <button onClick={() => navigate('/dashboard/careers')} style={{ background: 'none', border: 'none', color: '#A78BFA', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>See all →</button>
          </div>
        </SectionCard>
      )}

      {/* Skills */}
      <SectionCard>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <SectionTitle>Your Skills</SectionTitle>
          <span style={{ fontSize: 11, color: 'var(--text3)' }}>{analysis.extractedSkills?.length || 0} detected</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {(analysis.extractedSkills || []).slice(0, 12).map(s => (
            <SkillChip key={s} label={s} variant="skill" />
          ))}
        </div>
      </SectionCard>

      {/* Missing skills */}
      {(analysis.missingSkills?.length || 0) > 0 && (
        <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.25)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--warning)' }}>
            ⚡ {analysis.missingSkills.length} skills to learn for {analysis.selectedRole || 'your target role'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {(analysis.missingSkills || []).slice(0, 6).map(s => (
              <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.3)', color: '#FCD34D', fontWeight: 500 }}>{s}</span>
            ))}
          </div>
          <button onClick={() => navigate('/dashboard/roadmap')} style={{ background: 'none', border: 'none', color: 'var(--warning)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8, padding: 0 }}>
            View 4-week roadmap →
          </button>
        </div>
      )}

      {/* Quick actions */}
      <SectionCard>
        <SectionTitle>Quick Actions</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
          {[
            { label: '📄 Resume Analysis', path: '/dashboard/resume' },
            { label: '🎯 Career Matches',  path: '/dashboard/careers' },
            { label: '🔍 Skill Gap',       path: '/dashboard/skills' },
            { label: '💬 Interview Prep',  path: '/dashboard/interview' },
            { label: '🎯 JD Matcher',      path: '/dashboard/jd-match' },
            { label: '✨ Resume Improver', path: '/dashboard/improver' },
          ].map(a => (
            <button key={a.path} onClick={() => navigate(a.path)} style={{
              background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10,
              padding: '10px 14px', color: 'var(--text2)', fontSize: 13, cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left', transition: 'all .15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(109,93,246,.4)'; e.currentTarget.style.color = 'var(--text)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </SectionCard>

    </div>
  )
}
