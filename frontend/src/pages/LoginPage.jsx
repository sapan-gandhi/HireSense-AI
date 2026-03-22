import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

// ── Shared UI ────────────────────────────────────────────
function AuthCard({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6, background: 'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Career Intelligence Copilot ✦
        </div>
        {children}
      </div>
    </div>
  )
}

function Input({ label, type = 'text', value, onChange, placeholder, autoFocus }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 13, color: 'var(--text2)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder} autoFocus={autoFocus}
        style={{ width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
    </div>
  )
}

function Btn({ children, onClick, loading, variant = 'primary', fullWidth = true }) {
  const isPrimary = variant === 'primary'
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: fullWidth ? '100%' : 'auto',
      background: isPrimary ? 'linear-gradient(135deg,var(--primary),#8B5CF6)' : 'var(--surface2)',
      color: isPrimary ? '#fff' : 'var(--text2)',
      border: isPrimary ? 'none' : '1px solid var(--border)',
      padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
      cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
      opacity: loading ? 0.7 : 1, transition: 'all .2s',
    }}>
      {children}
    </button>
  )
}

// ── OTP Digit Input ──────────────────────────────────────
function OTPInput({ value, onChange }) {
  const digits = (value + '      ').slice(0, 6).split('')

  const handleChange = (e, idx) => {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const arr = (value + '      ').slice(0, 6).split('')
    arr[idx] = v
    const newVal = arr.join('').trimEnd()
    onChange(newVal)
    if (v && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !digits[idx].trim() && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    document.getElementById(`otp-5`)?.focus()
    e.preventDefault()
  }

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '24px 0' }}>
      {digits.map((d, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d.trim()}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          onPaste={handlePaste}
          autoFocus={i === 0}
          style={{
            width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
            background: 'var(--surface2)', border: `2px solid ${d.trim() ? 'var(--primary)' : 'var(--border)'}`,
            borderRadius: 12, color: 'var(--text)', fontFamily: "'Courier New', monospace",
            outline: 'none', caretColor: 'var(--primary)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = d.trim() ? 'var(--primary)' : 'var(--border)'}
        />
      ))}
    </div>
  )
}

// ── Verify Step ──────────────────────────────────────────
function VerifyStep({ email, onSuccess }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const verify = async () => {
    if (code.length < 6) { setErr('Please enter the 6-digit code.'); return }
    setLoading(true); setErr('')
    try {
      const { data } = await authAPI.verify({ email, code })
      // Auto-login after verification
      if (data.token) {
        localStorage.setItem('token', data.token)
        navigate('/dashboard')
      }
    } catch (e) {
      setErr(e.message || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  const resend = async () => {
    setResending(true); setErr(''); setResent(false)
    try {
      await authAPI.resendCode({ email })
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch (e) {
      setErr(e.message)
    } finally {
      setResending(false)
    }
  }

  return (
    <>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Verify your email</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 4 }}>
        We sent a 6-digit code to
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: '#A78BFA', marginBottom: 20 }}>{email}</p>

      <div style={{ background: 'rgba(56,189,248,.06)', border: '1px solid rgba(56,189,248,.25)', borderRadius: 12, padding: '14px 16px', fontSize: 13, color: 'var(--text2)', marginBottom: 4, lineHeight: 1.5 }}>
        💡 <strong style={{ color: 'var(--text)' }}>Dev mode:</strong> If no email credentials are set in <code style={{ background: 'var(--surface3)', padding: '1px 5px', borderRadius: 4, fontSize: 12 }}>.env</code>, the code prints to the <strong>backend terminal</strong> — check your console.
      </div>

      <OTPInput value={code} onChange={setCode} />

      {err && <p style={{ fontSize: 13, color: 'var(--danger)', textAlign: 'center', marginBottom: 12 }}>{err}</p>}
      {resent && <p style={{ fontSize: 13, color: 'var(--success)', textAlign: 'center', marginBottom: 12 }}>✓ New code sent to your email.</p>}

      <Btn onClick={verify} loading={loading}>
        {loading ? 'Verifying...' : 'Verify Email →'}
      </Btn>

      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <button onClick={resend} disabled={resending} style={{ background: 'none', border: 'none', color: 'var(--text2)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
          {resending ? 'Sending...' : "Didn't receive it? Resend code"}
        </button>
      </div>
    </>
  )
}

// ── Login Page ───────────────────────────────────────────
export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [needsVerify, setNeedsVerify] = useState(false)

  const submit = async () => {
    if (!email || !password) { setErr('Please fill all fields'); return }
    setLoading(true); setErr('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (e) {
      if (e.message?.toLowerCase().includes('verify')) {
        setNeedsVerify(true)
      }
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (needsVerify) {
    return <AuthCard><VerifyStep email={email} /></AuthCard>
  }

  return (
    <AuthCard>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Welcome back</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>Sign in to your account</p>

      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />

      {err && !needsVerify && <p style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{err}</p>}

      <Btn onClick={submit} loading={loading}>{loading ? 'Signing in...' : 'Sign In →'}</Btn>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
      </p>
    </AuthCard>
  )
}

// ── Signup Page ──────────────────────────────────────────
export function SignupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'verify'

  const submit = async () => {
    if (!name || !email || !password) { setErr('Please fill all fields'); return }
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return }
    setLoading(true); setErr('')
    try {
      await authAPI.register({ name, email, password })
      setStep('verify')
    } catch (e) {
      if (e.message?.toLowerCase().includes('not verified') || e.message?.toLowerCase().includes('new code')) {
        setStep('verify')
      } else {
        setErr(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return <AuthCard><VerifyStep email={email} /></AuthCard>
  }

  return (
    <AuthCard>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create your account</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>Free forever — no credit card needed</p>

      <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Priya Sharma" autoFocus />
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="min. 6 characters" />

      {err && <p style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{err}</p>}

      <Btn onClick={submit} loading={loading}>{loading ? 'Creating account...' : 'Create Account →'}</Btn>

      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
      </p>
    </AuthCard>
  )
}

export default LoginPage
