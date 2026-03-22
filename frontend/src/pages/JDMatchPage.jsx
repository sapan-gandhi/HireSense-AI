import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jdAPI } from '../services/api'
import { SectionCard, SectionTitle, SkillChip, PrimaryButton } from '../components/UI'
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react'

const SAMPLE_JD = `We are hiring a Frontend Developer to join our growing engineering team.

Role: Frontend Developer
Experience: 1-2 years

Requirements (Must Have):
- Strong proficiency in React.js and JavaScript (ES6+)
- Good understanding of HTML5, CSS3, and responsive design
- Experience with Git and version control workflows
- Familiarity with REST APIs and integrating backend services
- Knowledge of TypeScript is required
- Experience with Tailwind CSS or any CSS framework

Preferred:
- Familiarity with Next.js or any SSR framework
- Basic understanding of Node.js
- Experience with state management (Redux or Zustand)
- Open source contributions or active GitHub profile

Responsibilities:
- Build and maintain responsive web applications using React
- Collaborate with designers to implement pixel-perfect UI
- Write clean, reusable, well-documented component code
- Participate in code reviews and agile sprint planning`

const TIER_COLORS = {
  success: { bg: 'rgba(34,197,94,.1)',  border: 'rgba(34,197,94,.3)',  text: 'var(--success)' },
  warning: { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.3)', text: 'var(--warning)' },
  danger:  { bg: 'rgba(239,68,68,.1)',  border: 'rgba(239,68,68,.3)',  text: 'var(--danger)'  },
}

const PRIORITY_COLORS = {
  HIGH:   { bg: 'rgba(239,68,68,.12)',  color: '#FCA5A5', border: 'rgba(239,68,68,.3)'  },
  MEDIUM: { bg: 'rgba(245,158,11,.12)', color: '#FCD34D', border: 'rgba(245,158,11,.3)' },
  LOW:    { bg: 'rgba(56,189,248,.12)', color: '#7DD3FC', border: 'rgba(56,189,248,.3)' },
}

const LEGEND_COLORS = {
  success: 'var(--success)',
  warning: 'var(--warning)',
  danger:  'var(--danger)',
}

function BreakdownBar({ label, value, color = 'var(--primary)' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

function Collapsible({ title, children, defaultOpen = false, badge }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 600 }}>
          {title}
          {badge && <span style={{ fontSize: 10, background: 'rgba(109,93,246,.2)', color: '#A78BFA', border: '1px solid rgba(109,93,246,.3)', padding: '1px 7px', borderRadius: 8, fontWeight: 700 }}>{badge}</span>}
        </div>
        {open ? <ChevronUp size={15} style={{ color: 'var(--text3)' }} /> : <ChevronDown size={15} style={{ color: 'var(--text3)' }} />}
      </div>
      {open && <div style={{ padding: '0 16px 14px' }}>{children}</div>}
    </div>
  )
}

export default function JDMatchPage() {
  const navigate = useNavigate()
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  const runMatch = async () => {
    if (jdText.trim().length < 50) { setError('Please paste a job description (min 50 characters).'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await jdAPI.match(jdText)
      setResult(data.result)
      setRole(data.role || '')
    } catch (e) {
      setError(e.message || 'Matching failed. Make sure you have analyzed your resume first.')
    } finally {
      setLoading(false)
    }
  }

  const slColor = result ? (TIER_COLORS[result.shortlistTierColor] || TIER_COLORS.warning) : null
  const sim = result?.improvementSimulation

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>JD Intelligence Match</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Semantic ATS · Shortlist probability · Explainable hiring · Improvement simulation</p>
      </div>

      {/* Input */}
      <SectionCard>
        <SectionTitle aiBadge>Paste Job Description</SectionTitle>
        <textarea
          value={jdText}
          onChange={e => { setJdText(e.target.value); setError('') }}
          placeholder="Paste the full job description here..."
          style={{ width: '100%', minHeight: 150, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 14px', color: 'var(--text)', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'vertical', lineHeight: 1.6, boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <PrimaryButton onClick={runMatch} disabled={loading || jdText.trim().length < 50}>
            {loading ? '⟳ Analysing...' : '🎯 Analyse My Fit'}
          </PrimaryButton>
          <button onClick={() => setJdText(SAMPLE_JD)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '10px 18px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
            Load Sample JD
          </button>
        </div>
        {error && <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 10 }}>{error}</p>}
      </SectionCard>

      {/* Loading */}
      {loading && (
        <SectionCard>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 0', gap: 12 }}>
            <div style={{ width: 40, height: 40, border: '3px solid var(--surface3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>Running hiring intelligence analysis...</p>
            {['Deep JD parsing', 'TF-IDF semantic scoring', 'Probability engine', 'Improvement simulation', 'Executive summary'].map(s => (
              <div key={s} style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', gap: 7 }}><span style={{ color: 'var(--primary)' }}>⟳</span>{s}</div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ── RESULTS ── */}
      {result && !loading && (
        <>
          {/* ── 1. EXECUTIVE SUMMARY ── */}
          {result.executiveSummary && (
            <div style={{ background: 'rgba(109,93,246,.06)', border: '1px solid rgba(109,93,246,.25)', borderRadius: 14, padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(109,93,246,.2)', color: '#A78BFA', border: '1px solid rgba(109,93,246,.35)', padding: '2px 9px', borderRadius: 8 }}>✦ AI EXECUTIVE SUMMARY</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{result.executiveSummary}</p>
            </div>
          )}

          {/* JD meta banner */}
          <div style={{ background: 'rgba(56,189,248,.05)', border: '1px solid rgba(56,189,248,.25)', borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div><div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 }}>Role Detected</div><div style={{ fontSize: 14, fontWeight: 700 }}>{result.roleTitle}</div></div>
            <div><div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 }}>Experience</div><div style={{ fontSize: 14, fontWeight: 700 }}>{result.experienceRequired}</div></div>
            <div><div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 }}>JD Skills</div><div style={{ fontSize: 14, fontWeight: 700 }}>{result.requiredSkills?.length || 0} required · {result.preferredSkills?.length || 0} preferred</div></div>
            <div><div style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 700, letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 3 }}>ATS Grade</div><div style={{ fontSize: 14, fontWeight: 700, color: result.atsCoverage?.grade === 'A' ? 'var(--success)' : result.atsCoverage?.grade === 'B' ? 'var(--warning)' : 'var(--danger)' }}>{result.atsCoverage?.grade} ({result.atsCoverage?.coveragePct}% coverage)</div></div>
          </div>

          {/* ── 2. SHORTLIST PROBABILITY HERO ── */}
          <div style={{ background: slColor.bg, border: `1px solid ${slColor.border}`, borderRadius: 16, padding: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 84, height: 84, borderRadius: '50%', border: `5px solid ${slColor.text}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: slColor.text, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>{result.shortlistProbability}%</span>
              <span style={{ fontSize: 9, color: slColor.text, opacity: .7 }}>PROB</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: 4 }}>Shortlist Probability · {result.confidenceRange} Confidence</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: slColor.text, marginBottom: 6 }}>{result.shortlistTier}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{result.explanation?.verdict}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 800, color: '#A78BFA' }}>{result.matchScore}%</div><div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase' }}>Skill</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 800, color: '#7DD3FC' }}>{result.semanticScore}%</div><div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase' }}>Semantic</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: 17, fontWeight: 800, color: '#86EFAC' }}>{result.domainAlignment}%</div><div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase' }}>Domain</div></div>
            </div>
          </div>

          {/* ── 3. SCORE LEGEND ── */}
          {result.scoreLegend && (
            <SectionCard>
              <SectionTitle>📊 Score Interpretation</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {result.scoreLegend.map(item => {
                  const isActive = result.shortlistProbability >= item.min &&
                    (item.min === 80 ? true : result.shortlistProbability < result.scoreLegend.find(l => l.min > item.min)?.min || 100)
                  return (
                    <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', background: isActive ? `${TIER_COLORS[item.color]?.bg}` : 'var(--surface2)', border: `1px solid ${isActive ? TIER_COLORS[item.color]?.border : 'var(--border)'}`, borderRadius: 10, transition: 'all .2s' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: LEGEND_COLORS[item.color], flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: isActive ? 700 : 500, color: isActive ? LEGEND_COLORS[item.color] : 'var(--text)' }}>{item.range}%</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>{item.label}</div>
                      </div>
                      {isActive && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: LEGEND_COLORS[item.color] }}>← You</span>}
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )}

          {/* Probability breakdown + Skills */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SectionCard>
              <SectionTitle aiBadge>Probability Breakdown</SectionTitle>
              {result.shortlistBreakdown && <>
                <BreakdownBar label="Skill Match"      value={result.shortlistBreakdown.skillMatch}       color="#A78BFA" />
                <BreakdownBar label="Semantic Score"   value={result.shortlistBreakdown.semanticScore}    color="#7DD3FC" />
                <BreakdownBar label="Domain Alignment" value={result.shortlistBreakdown.domainAlignment}  color="#86EFAC" />
                <BreakdownBar label="Project Quality"  value={result.shortlistBreakdown.projectQuality}   color="#FCD34D" />
                <BreakdownBar label="Achievements"     value={result.shortlistBreakdown.achievementScore} color="#FB923C" />
                <BreakdownBar label="Resume Score"     value={result.shortlistBreakdown.resumeScore}      color="#38BDF8" />
                {result.shortlistBreakdown.missingPenalty > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>⚠ Missing skills penalty: -{result.shortlistBreakdown.missingPenalty} pts</div>
                )}
              </>}
            </SectionCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <SectionCard>
                <SectionTitle>✅ Matched ({result.matchedSkills?.length || 0})</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(result.matchedSkills || []).map(s => <SkillChip key={s} label={s} variant="have" />)}
                  {!result.matchedSkills?.length && <p style={{ fontSize: 13, color: 'var(--text3)' }}>No matches found</p>}
                </div>
              </SectionCard>
              <SectionCard>
                <SectionTitle>❌ Missing ({result.missingSkills?.length || 0})</SectionTitle>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(result.missingSkills || []).map(s => (
                    <span key={s} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: result.criticalMissingSkills?.includes(s) ? 'rgba(239,68,68,.15)' : 'rgba(245,158,11,.1)', border: `1px solid ${result.criticalMissingSkills?.includes(s) ? 'rgba(239,68,68,.4)' : 'rgba(245,158,11,.3)'}`, color: result.criticalMissingSkills?.includes(s) ? '#FCA5A5' : '#FCD34D', fontWeight: 500 }}>
                      {result.criticalMissingSkills?.includes(s) && '⚠ '}{s}
                    </span>
                  ))}
                  {!result.missingSkills?.length && <p style={{ fontSize: 13, color: 'var(--success)' }}>No missing skills! 🎉</p>}
                </div>
                {result.criticalMissingSkills?.length > 0 && <p style={{ fontSize: 11, color: 'var(--danger)', marginTop: 6 }}>⚠ Red = critical/required in JD</p>}
              </SectionCard>
            </div>
          </div>

          {/* Why shortlisted / rejected */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <SectionCard>
              <SectionTitle>✦ Why You May Get Shortlisted</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(result.explanation?.shortlistReasons || []).map((r, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>{r}
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard>
              <SectionTitle>⚠ Why You May Get Rejected</SectionTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {(result.explanation?.rejectionReasons || []).map((r, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✗</span>{r}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* ── 4. IMPROVEMENT SIMULATION ── */}
          {sim && sim.simulations?.length > 0 && (
            <SectionCard style={{ background: 'rgba(34,197,94,.04)', borderColor: 'rgba(34,197,94,.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <SectionTitle aiBadge>
                  <TrendingUp size={14} style={{ display: 'inline', marginRight: 6, color: 'var(--success)' }} />
                  Improvement Simulation
                </SectionTitle>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 2 }}>Projected after top actions</div>
                  <div style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Space Grotesk',sans-serif", color: 'var(--success)' }}>
                    {sim.projectedProbability}% <span style={{ fontSize: 13, color: 'var(--success)', opacity: .7 }}>(+{sim.combinedDelta}%)</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.5 }}>
                If you make these specific changes, your shortlist probability increases from <strong style={{ color: slColor.text }}>{result.shortlistProbability}%</strong> to <strong style={{ color: 'var(--success)' }}>{sim.projectedProbability}%</strong>:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sim.simulations.map((item, i) => {
                  const col = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.MEDIUM
                  return (
                    <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 52, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--success)', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>+{item.delta}%</div>
                        <div style={{ fontSize: 9, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.3px' }}>boost</div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, background: col.bg, color: col.color, border: `1px solid ${col.border}`, padding: '2px 7px', borderRadius: 7 }}>{item.category}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.action}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 4, lineHeight: 1.4 }}>{item.detail}</div>
                        <div style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>Effort: {item.effort}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </SectionCard>
          )}

          {/* ── 5. JD KEYWORD GAPS ── */}
          {result.keywordGaps && (
            <Collapsible title="🔑 JD Keyword Gaps" badge={`${result.keywordGaps.coveragePct}% covered`} defaultOpen>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 8 }}>✅ Present in Resume</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.keywordGaps.presentKeywords || []).map(k => (
                      <span key={k} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(34,197,94,.1)', border: '1px solid rgba(34,197,94,.3)', color: '#86EFAC', fontWeight: 500 }}>{k}</span>
                    ))}
                    {!result.keywordGaps.presentKeywords?.length && <p style={{ fontSize: 12, color: 'var(--text3)' }}>No JD keywords found yet</p>}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--danger)', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 8 }}>❌ Missing Keywords</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.keywordGaps.missingKeywords || []).map(k => (
                      <span key={k} style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', color: '#FCD34D', fontWeight: 500 }}>{k}</span>
                    ))}
                    {!result.keywordGaps.missingKeywords?.length && <p style={{ fontSize: 12, color: 'var(--success)' }}>All keywords covered! 🎉</p>}
                  </div>
                </div>
              </div>
              {result.keywordGaps.placements?.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.4px', textTransform: 'uppercase', marginBottom: 8 }}>Suggested Placement</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {result.keywordGaps.placements.map((p, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                        <span style={{ background: 'rgba(56,189,248,.15)', color: '#7DD3FC', border: '1px solid rgba(56,189,248,.3)', padding: '2px 8px', borderRadius: 7, fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{p.keyword}</span>
                        <span style={{ color: 'var(--text2)', fontSize: 12 }}>→ {p.placement}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Collapsible>
          )}

          {/* Strengths & Weaknesses */}
          <Collapsible title="📊 Detailed Strengths & Weaknesses" badge="AI Explained">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Strengths</div>
                {(result.explanation?.strengths || []).map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, marginBottom: 6, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--success)', flexShrink: 0 }}>✔</span>{s}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--danger)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.4px' }}>Weaknesses</div>
                {(result.explanation?.weaknesses || []).map((s, i) => (
                  <div key={i} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, marginBottom: 6, lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--danger)', flexShrink: 0 }}>✘</span>{s}
                  </div>
                ))}
              </div>
            </div>
          </Collapsible>

          {/* ATS Optimization */}
          <Collapsible title="🤖 ATS Keyword Optimization" badge={`Grade ${result.atsCoverage?.grade}`}>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.5 }}>
              ATS scans before any human reads your resume. Coverage: <strong style={{ color: result.atsCoverage?.grade === 'A' ? 'var(--success)' : 'var(--warning)' }}>{result.atsCoverage?.coveredKeywords}/{result.atsCoverage?.totalKeywords} keywords</strong>
            </p>
            {result.atsCoverage?.missingKeywords?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {result.atsCoverage.missingKeywords.map(k => (
                  <span key={k} style={{ fontSize: 12, padding: '4px 11px', borderRadius: 20, background: 'rgba(245,158,11,.1)', border: '1px solid rgba(245,158,11,.3)', color: '#FCD34D', fontWeight: 500 }}>{k}</span>
                ))}
              </div>
            )}
          </Collapsible>

          {/* Risk Factors */}
          {result.explanation?.riskFactors?.length > 0 && (
            <Collapsible title="⚡ Risk Factors">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.explanation.riskFactors.map((r, i) => {
                  const col = r.level === 'HIGH' ? PRIORITY_COLORS.HIGH : PRIORITY_COLORS.MEDIUM
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: col.color, flexShrink: 0, marginTop: 2 }}>{r.level}</span>
                      <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{r.factor}</span>
                    </div>
                  )
                })}
              </div>
            </Collapsible>
          )}

          {/* Recruiter Suggestions */}
          <SectionCard style={{ background: 'rgba(109,93,246,.04)', borderColor: 'rgba(109,93,246,.3)' }}>
            <SectionTitle aiBadge>Recruiter-Level Suggestions</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(result.recruiterSuggestions || []).map((s, i) => {
                const col = PRIORITY_COLORS[s.priority] || PRIORITY_COLORS.MEDIUM
                return (
                  <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: col.bg, color: col.color, border: `1px solid ${col.border}`, padding: '2px 8px', borderRadius: 8 }}>{s.priority}</span>
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontWeight: 600, textTransform: 'uppercase' }}>{s.category}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{s.suggestion}</p>
                  </div>
                )
              })}
            </div>
          </SectionCard>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={() => navigate('/dashboard/improver')}>Improve My Resume →</PrimaryButton>
            <PrimaryButton onClick={() => navigate('/dashboard/report')} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Download Report
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  )
}
