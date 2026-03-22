import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI } from '../services/api'
import { SectionCard, SectionTitle, PrimaryButton } from '../components/UI'
import { Copy, Check, Wand2 } from 'lucide-react'

const TYPE_CONFIG = {
  Summary: { color: '#A78BFA', bg: 'rgba(109,93,246,.15)', border: 'rgba(109,93,246,.3)' },
  Project: { color: '#7DD3FC', bg: 'rgba(56,189,248,.15)', border: 'rgba(56,189,248,.3)' },
  Experience: { color: '#86EFAC', bg: 'rgba(34,197,94,.15)', border: 'rgba(34,197,94,.3)' },
  Skills: { color: '#FCD34D', bg: 'rgba(245,158,11,.15)', border: 'rgba(245,158,11,.3)' },
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <button onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: '1px solid var(--border)', borderRadius: 8, padding: '4px 10px', color: copied ? 'var(--success)' : 'var(--text3)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', transition: 'all .15s' }}>
      {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
    </button>
  )
}

function ImprovementCard({ item, index }) {
  const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.Experience

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>#{index + 1}</span>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.4px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, padding: '2px 10px', borderRadius: 10 }}>
            {item.badge || item.type}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--success)', fontWeight: 600 }}>✦ AI Improved</span>
        </div>
      </div>

      {/* Before / After */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Before */}
        <div style={{ padding: 16, borderRight: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.5px', marginBottom: 8, textTransform: 'uppercase' }}>Original</div>
          <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.7, fontStyle: 'italic' }}>
            {item.original}
          </p>
        </div>
        {/* After */}
        <div style={{ padding: 16, background: 'rgba(34,197,94,.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--success)', letterSpacing: '.5px', textTransform: 'uppercase' }}>AI Improved</div>
            <CopyButton text={item.improved} />
          </div>
          <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.7 }}>
            {item.improved}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ResumeImproverPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [improvements, setImprovements] = useState(null)
  const [role, setRole] = useState('')
  const [error, setError] = useState('')

  const runImprover = async () => {
    setLoading(true); setError(''); setImprovements(null)
    try {
      const { data } = await resumeAPI.improve()
      setImprovements(data.improvements)
      setRole(data.role || '')
    } catch (e) {
      setError(e.message || 'No resume found. Please upload and analyze your resume first.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Resume Improver</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>AI rewrites weak resume content into professional, ATS-friendly language.</p>
      </div>

      {/* CTA */}
      {!improvements && !loading && (
        <div style={{ background: 'rgba(109,93,246,.07)', border: '1px solid rgba(109,93,246,.3)', borderRadius: 16, padding: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 14 }}>✨</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>AI-Powered Resume Rewriter</h3>
          <p style={{ fontSize: 14, color: 'var(--text2)', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.6 }}>
            We'll take your uploaded resume content and rewrite weak bullet points, vague project descriptions, and generic summaries into recruiter-ready language with strong action verbs and professional tone.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, maxWidth: 400, margin: '0 auto 24px', textAlign: 'left' }}>
            {['Professional Summary', 'Project Descriptions', 'Experience Bullets', 'Skills Section'].map(item => (
              <div key={item} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text2)', alignItems: 'center' }}>
                <span style={{ color: 'var(--success)' }}>✓</span>{item}
              </div>
            ))}
          </div>
          <PrimaryButton onClick={runImprover}>
            <Wand2 size={15} style={{ display: 'inline', marginRight: 8 }} />
            Improve My Resume
          </PrimaryButton>
          {error && <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 12 }}>{error}</p>}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <SectionCard>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 14 }}>
            <div style={{ width: 44, height: 44, border: '3px solid var(--surface3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>AI is rewriting your resume...</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, width: '100%', maxWidth: 340 }}>
              {['Parsing resume sections', 'Detecting weak phrasing', 'Applying action verb rewrites', 'Generating professional language', 'Creating before/after comparisons'].map(s => (
                <div key={s} style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--primary)' }}>⟳</span>{s}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      )}

      {/* Results */}
      {improvements && !loading && (
        <>
          <div style={{ background: 'rgba(34,197,94,.06)', border: '1px solid rgba(34,197,94,.3)', borderRadius: 14, padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 26 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>
                {improvements.length} Improvements Generated
                {role && <span style={{ color: 'var(--text2)', fontWeight: 400, fontSize: 13 }}> — tailored for {role}</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)' }}>Review each improvement below. Copy the improved version to update your resume.</p>
            </div>
            <button onClick={runImprover} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 14px', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
              Regenerate
            </button>
          </div>

          {/* Improvement cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {improvements.map((item, i) => (
              <ImprovementCard key={i} item={item} index={i} />
            ))}
          </div>

          {/* Legend */}
          <SectionCard>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>📋 How to Use These Improvements</div>
            {[
              'Review each "AI Improved" version — adapt it to match your actual experience',
              'Click "Copy" on any improved section, then paste it into your resume document',
              'Do not copy improvements verbatim if they include details you have not done',
              'Regenerate if you want different phrasings for any section',
              'Download the full PDF report to get these improvements in a structured format',
            ].map(tip => (
              <div key={tip} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, marginBottom: 7, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>→</span>{tip}
              </div>
            ))}
          </SectionCard>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <PrimaryButton onClick={() => navigate('/dashboard/report')}>Download Full PDF Report →</PrimaryButton>
            <PrimaryButton onClick={() => navigate('/dashboard/jd-match')} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
              Match Against a Job Description
            </PrimaryButton>
          </div>
        </>
      )}
    </div>
  )
}
