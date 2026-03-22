import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { resumeAPI, analysisAPI } from '../services/api'
import { SectionCard, SectionTitle, SkillChip, ScoreRing, PrimaryButton } from '../components/UI'
import { Upload, RotateCcw, FileText } from 'lucide-react'

const LOADING_STEPS = [
  'Extracting text from resume...',
  'Identifying technical skills...',
  'Scoring resume quality...',
  'Predicting career matches...',
  'Computing skill gaps...',
  'Generating roadmap & questions...',
  'Saving your analysis...',
]

export default function ResumePage() {
  const navigate = useNavigate()
  const fileRef = useRef()
  const [pasteText, setPasteText] = useState('')   // only for paste mode
  const [file, setFile] = useState(null)            // only for file mode
  const [mode, setMode] = useState('file')          // 'file' | 'paste'
  const [loading, setLoading] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')

  const handleFile = (f) => {
    if (!f) return
    const allowed = ['application/pdf', 'text/plain']
    if (!allowed.includes(f.type) && !f.name.endsWith('.pdf') && !f.name.endsWith('.txt')) {
      setError('Only PDF or TXT files are supported.')
      return
    }
    setFile(f)
    setMode('file')
    setPasteText('')
    setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.currentTarget.style.borderColor = 'var(--border2)'
    handleFile(e.dataTransfer.files[0])
  }

  const canAnalyze = file || pasteText.trim().length >= 30

  const runAnalysis = async () => {
    if (!canAnalyze) {
      setError('Please upload a file or paste at least 30 characters of resume text.')
      return
    }
    setLoading(true)
    setError('')
    setStepIdx(0)

    let idx = 0
    const ticker = setInterval(() => {
      idx++
      if (idx < LOADING_STEPS.length) setStepIdx(idx)
    }, 1800)

    try {
      const formData = new FormData()
      if (file) {
        formData.append('resume', file)
      } else {
        const blob = new Blob([pasteText.trim()], { type: 'text/plain' })
        formData.append('resume', blob, 'resume.txt')
      }

      const { data: uploadData } = await resumeAPI.upload(formData)
      const { data: analysisData } = await analysisAPI.run(uploadData.resume._id)

      clearInterval(ticker)
      setAnalysis(analysisData.analysis)
    } catch (e) {
      clearInterval(ticker)
      setError(e.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setAnalysis(null)
    setFile(null)
    setPasteText('')
    setMode('file')
    setError('')
    setStepIdx(0)
  }

  // ── Loading ──────────────────────────────────────────────
  if (loading) return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Analyzing Your Resume</h2>
      <SectionCard>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', gap: 20 }}>
          <div style={{ width: 48, height: 48, border: '3px solid var(--surface3)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 15, fontWeight: 600 }}>AI is analyzing your resume...</p>
          <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {LOADING_STEPS.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                <span style={{ color: i < stepIdx ? 'var(--success)' : i === stepIdx ? 'var(--primary)' : 'var(--text3)', fontSize: 16 }}>
                  {i < stepIdx ? '✓' : i === stepIdx ? '⟳' : '○'}
                </span>
                <span style={{ color: i <= stepIdx ? 'var(--text2)' : 'var(--text3)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  )

  // ── Results ──────────────────────────────────────────────
  if (analysis) return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Resume Analysis</h2>
        <button onClick={reset} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid var(--border2)', color: 'var(--text2)', padding: '7px 14px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          <RotateCcw size={13} /> Re-upload
        </button>
      </div>

      {/* Score */}
      <SectionCard>
        <SectionTitle aiBadge>Resume Score</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <ScoreRing score={analysis.resumeScore} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
              {analysis.scoreLabel}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4, lineHeight: 1.5 }}>
              {analysis.scoreDesc}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Strengths + Suggestions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <SectionCard>
          <SectionTitle>✅ Strengths</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(analysis.strengths || []).map(s => (
              <div key={s} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--success)', flexShrink: 0 }}>✓</span>{s}
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard>
          <SectionTitle>⚠️ Suggestions</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(analysis.suggestions || []).map(s => (
              <div key={s} style={{ fontSize: 13, color: 'var(--text2)', display: 'flex', gap: 8, lineHeight: 1.5 }}>
                <span style={{ color: 'var(--warning)', flexShrink: 0 }}>→</span>{s}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Skills */}
      <SectionCard>
        <SectionTitle aiBadge>Detected Skills</SectionTitle>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(analysis.extractedSkills || []).map(s => (
            <SkillChip key={s} label={s} variant="skill" />
          ))}
        </div>
      </SectionCard>

      <PrimaryButton fullWidth onClick={() => navigate('/dashboard/careers')}>
        View Career Matches →
      </PrimaryButton>
    </div>
  )

  // ── Upload form ──────────────────────────────────────────
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Resume Analysis</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14 }}>Upload your resume to get AI-powered career insights.</p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)' }}
        onDragLeave={e => { e.currentTarget.style.borderColor = file ? 'var(--success)' : 'var(--border2)' }}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${file ? 'var(--success)' : 'var(--border2)'}`,
          borderRadius: 16, padding: '40px 20px', textAlign: 'center',
          cursor: 'pointer', transition: 'all .2s',
          background: file ? 'rgba(34,197,94,.04)' : 'var(--surface)',
        }}
      >
        <input
          ref={fileRef} type="file" accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />
        {file ? (
          <>
            <FileText size={30} style={{ color: 'var(--success)', marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--success)', marginBottom: 4 }}>
              ✓ {file.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>
              {(file.size / 1024).toFixed(1)} KB · Click to change file
            </div>
          </>
        ) : (
          <>
            <Upload size={28} style={{ color: 'var(--text3)', marginBottom: 10 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Drop your resume here</div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>PDF or TXT · Click to browse</div>
          </>
        )}
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0 }}>or paste resume text below</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>

      {/* Paste area — only shows user-typed text, never raw server data */}
      <textarea
        value={pasteText}
        onChange={e => {
          setPasteText(e.target.value)
          if (e.target.value.trim()) {
            setFile(null)   // clear file if user starts typing
            setMode('paste')
          }
        }}
        placeholder={
          file
            ? `File selected: ${file.name}\n\nYou can also clear the file above and paste text instead.`
            : 'Paste your resume content here...\n\nInclude: skills, experience, education, projects'
        }
        disabled={!!file}
        style={{
          width: '100%', minHeight: 140,
          background: file ? 'var(--surface3)' : 'var(--surface2)',
          border: '1px solid var(--border)', borderRadius: 12,
          padding: '12px 14px', color: file ? 'var(--text3)' : 'var(--text)',
          fontSize: 13, fontFamily: 'inherit', outline: 'none',
          resize: 'vertical', lineHeight: 1.6, cursor: file ? 'not-allowed' : 'text',
          boxSizing: 'border-box',
        }}
        onFocus={e => { if (!file) e.target.style.borderColor = 'var(--primary)' }}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />

      {error && <p style={{ fontSize: 13, color: 'var(--danger)' }}>{error}</p>}

      <PrimaryButton fullWidth onClick={runAnalysis} disabled={!canAnalyze}>
        ✦ Analyze My Resume
      </PrimaryButton>
    </div>
  )
}
