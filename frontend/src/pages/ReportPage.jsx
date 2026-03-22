import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analysisAPI } from '../services/api'
import api from '../services/api'
import { SectionCard, SectionTitle, PrimaryButton } from '../components/UI'
import { Download, CheckCircle } from 'lucide-react'

export default function ReportPage() {
  const navigate = useNavigate()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    analysisAPI.getAll()
      .then(({ data }) => {
        if (data.analyses?.length) setAnalysis(data.analyses[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const downloadReport = async () => {
    setGenerating(true)
    setError('')
    setSuccess(false)
    try {
      // Fetch the HTML report as text
      const response = await api.get('/report/export/latest', {
        responseType: 'text',
        timeout: 30000,
      })

      const html = response.data

      // Create a blob and trigger download
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `career-report-${new Date().toISOString().slice(0, 10)}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess(true)
      setTimeout(() => setSuccess(false), 6000)
    } catch (e) {
      setError(e.message || 'Report generation failed. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return (
    <div style={{ padding: 24 }}>
      <div style={{ height: 300, background: 'var(--surface)', borderRadius: 14 }} />
    </div>
  )

  if (!analysis) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Export Career Report</h2>
      <SectionCard>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>📋</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No Analysis Found</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 20 }}>
            Analyse your resume first to generate a career report.
          </p>
          <PrimaryButton onClick={() => navigate('/dashboard/resume')}>
            Upload Resume →
          </PrimaryButton>
        </div>
      </SectionCard>
    </div>
  )

  const role = analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'Target Role'

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Export Career Report</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>
          Download a complete PDF-ready career intelligence report.
        </p>
      </div>

      {/* Hero download card */}
      <div style={{ background: 'linear-gradient(135deg,rgba(109,93,246,.12),rgba(56,189,248,.08))', border: '1px solid rgba(109,93,246,.3)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>📋</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Career Intelligence Report</h3>
        <p style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 420, margin: '0 auto 6px', lineHeight: 1.6 }}>
          A complete HTML report covering your full career analysis — open in any browser and print as PDF.
        </p>
        <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 24 }}>
          Target role: <strong style={{ color: '#A78BFA' }}>{role}</strong>
        </p>

        {success ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,.15)', border: '1px solid rgba(34,197,94,.3)', color: 'var(--success)', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600 }}>
            <CheckCircle size={16} /> Downloaded! Open the file in Chrome → Ctrl+P → Save as PDF
          </div>
        ) : (
          <button
            onClick={downloadReport}
            disabled={generating}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: generating ? 'var(--surface3)' : 'linear-gradient(135deg,var(--primary),#8B5CF6)',
              color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all .2s',
            }}
          >
            {generating
              ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Generating...</>
              : <><Download size={16} /> Download Report</>
            }
          </button>
        )}

        {error && <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 12 }}>{error}</p>}
      </div>

      {/* What's inside */}
      <SectionCard>
        <SectionTitle>What's Inside the Report</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { icon: '📊', title: 'Analysis Summary', desc: `Score: ${analysis.resumeScore}/100 · ${(analysis.strengths || []).length} strengths · ${(analysis.suggestions || []).length} improvements` },
            { icon: '🎯', title: 'Career Matches', desc: `Top role: ${role}` },
            { icon: '🔍', title: 'Skill Gap Analysis', desc: `${(analysis.matchedSkills || []).length} matched · ${(analysis.missingSkills || []).length} missing · ${analysis.readinessScore || 0}% ready` },
            { icon: '🗺️', title: 'Learning Roadmap', desc: '4-week personalised plan' },
            { icon: '💬', title: 'Interview Prep', desc: '30 Q&A — 10 technical, 10 conceptual, 10 HR' },
          ].map(item => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 12px', background: 'var(--surface2)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{item.desc}</div>
              </div>
              <span style={{ color: 'var(--success)', fontSize: 14 }}>✓</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* How to get PDF */}
      <SectionCard>
        <SectionTitle>📄 How to Get a PDF</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'Download the HTML report by clicking the button above',
            'Open the downloaded file in Chrome or Edge',
            'Press Ctrl+P (or Cmd+P on Mac) to open the print dialog',
            'Select "Save as PDF" as the destination',
            'Click Save — professional PDF ready to share',
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--text2)', alignItems: 'flex-start' }}>
              <span style={{ width: 22, height: 22, background: 'rgba(109,93,246,.2)', color: '#A78BFA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              {step}
            </div>
          ))}
        </div>
      </SectionCard>

      <PrimaryButton fullWidth onClick={downloadReport} disabled={generating}>
        {generating ? '⟳ Generating...' : <><Download size={14} style={{ display: 'inline', marginRight: 8 }} />Download Report</>}
      </PrimaryButton>
    </div>
  )
}
