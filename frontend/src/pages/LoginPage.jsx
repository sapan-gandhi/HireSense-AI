import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'

function AuthCard({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: 24 }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 24, padding: '40px 36px', width: '100%', maxWidth: 420 }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6, background: 'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          HireSense AI ✦
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

function Btn({ children, onClick, loading }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      width: '100%', background: 'linear-gradient(135deg,var(--primary),#8B5CF6)',
      color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 12,
      fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: 'inherit', opacity: loading ? 0.7 : 1, transition: 'all .2s',
    }}>
      {children}
    </button>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !password) { setErr('Please fill all fields'); return }
    setLoading(true); setErr('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Welcome back</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>Sign in to your account</p>
      <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      {err && <p style={{ fontSize: 13, color: 'var(--danger)', marginBottom: 12 }}>{err}</p>}
      <Btn onClick={submit} loading={loading}>{loading ? 'Signing in...' : 'Sign In →'}</Btn>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text2)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: '#A78BFA', fontWeight: 600, textDecoration: 'none' }}>Sign up free</Link>
      </p>
    </AuthCard>
  )
}

export function SignupPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!name || !email || !password) { setErr('Please fill all fields'); return }
    if (password.length < 6) { setErr('Password must be at least 6 characters'); return }
    setLoading(true); setErr('')
    try {
      const { data } = await authAPI.register({ name, email, password })
      // Auto-login after register
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
      window.location.reload()
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Create your account</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>Free forever — no credit card needed</p>
      <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Sapan Gandhi" autoFocus />
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