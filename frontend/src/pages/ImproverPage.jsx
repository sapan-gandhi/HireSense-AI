import { useState, useEffect } from 'react'
import { improverAPI, analysisAPI } from '../services/api'
import { SectionCard, SectionTitle, PrimaryButton, EmptyState } from '../components/UI'

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <button onClick={copy} style={{ background: copied ? 'rgba(34,197,94,.15)' : 'var(--surface3)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: copied ? 'var(--success)' : 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all .2s' }}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

const TYPE_STYLES = {
  project: { label: 'PROJECT', bg: 'rgba(56,189,248,.15)', color: '#7DD3FC' },
  experience: { label: 'EXPERIENCE', bg: 'rgba(109,93,246,.15)', color: '#A78BFA' },
  achievement: { label: 'ACHIEVEMENT', bg: 'rgba(34,197,94,.15)', color: '#86EFAC' },
  general: { label: 'GENERAL', bg: 'rgba(245,158,11,.15)', color: '#FCD34D' },
}

export default function ImproverPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [analysisId, setAnalysisId] = useState(null)

  useEffect(() => {
    analysisAPI.getAll().then(({ data }) => {
      if (data.analyses?.length) setAnalysisId(data.analyses[0]._id)
    }).catch(() => {})
  }, [])

  const runImprover = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await improverAPI.improve(analysisId)
      setResult(data.result)
    } catch (e) { setError(e.message || 'Improvement failed.') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>AI Resume Improver</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Transform weak resume lines into professional, ATS-optimised content.</p>
      </div>

      {!analysisId
        ? <EmptyState icon="✍️" title="No Resume Found" description="Upload and analyze your resume first, then come back here to improve it." action={null} />
        : !result && !loading && (
          <SectionCard style={{ textAlign: 'center', padding: 36 }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>✍️</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Ready to Improve Your Resume</div>
            <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 320, margin: '0 auto 20px', lineHeight: 1.6 }}>AI will rewrite weak bullet points and project descriptions into professional, action-driven content.</p>
            <PrimaryButton onClick={runImprover}>✦ Improve My Resume</PrimaryButton>
          </SectionCard>
        )
      }

      {loading && <SectionCard><div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36, gap: 14 }}><div style={{ width: 40, height: 40, border: '3px solid var(--surface3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><p style={{ fontSize: 14, color: 'var(--text2)' }}>AI is rewriting your resume content...</p></div></SectionCard>}

      {error && <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: 'var(--danger)' }}>{error}</div>}

      {result && !loading && <>
        {/* Improved Summary */}
        {result.improvedSummary && (
          <SectionCard style={{ background: 'rgba(109,93,246,.05)', borderColor: 'rgba(109,93,246,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <SectionTitle aiBadge>Professional Summary</SectionTitle>
              <CopyBtn text={result.improvedSummary.improved} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger)', letterSpacing: '.5px', marginBottom: 8 }}>ORIGINAL</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{result.improvedSummary.original || 'No summary section detected.'}</p>
              </div>
              <div style={{ background: 'rgba(34,197,94,.05)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', letterSpacing: '.5px', marginBottom: 8 }}>AI IMPROVED</div>
                <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{result.improvedSummary.improved}</p>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Line improvements */}
        {(result.improvements || []).length > 0 && (
          <SectionCard>
            <SectionTitle aiBadge>Improved Resume Lines ({result.improvements.length})</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {result.improvements.map((imp, i) => {
                const ts = TYPE_STYLES[imp.type] || TYPE_STYLES.general
                return (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px', background: 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.5px', background: ts.bg, color: ts.color, padding: '3px 9px', borderRadius: 10 }}>{ts.label}</span>
                      <CopyBtn text={imp.improved} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                      <div style={{ padding: 14, borderRight: '1px solid var(--border)', background: 'rgba(239,68,68,.02)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--danger)', letterSpacing: '.5px', marginBottom: 8 }}>ORIGINAL</div>
                        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{imp.original}</p>
                      </div>
                      <div style={{ padding: 14, background: 'rgba(34,197,94,.02)' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', letterSpacing: '.5px', marginBottom: 8 }}>AI IMPROVED</div>
                        <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>{imp.improved}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </SectionCard>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <PrimaryButton onClick={runImprover} style={{ flex: 1 }}>⟳ Regenerate Improvements</PrimaryButton>
        </div>
      </>}
    </div>
  )
}
