// ─── StatCard ────────────────────────────────────────────
export function StatCard({ label, value, sub, color = 'purple' }) {
  const colors = {
    purple: 'var(--primary)',
    blue: 'var(--accent)',
    green: 'var(--success)',
    amber: 'var(--warning)',
    red: 'var(--danger)',
  }
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 16,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -20,
        width: 80, height: 80, borderRadius: '50%',
        background: colors[color], opacity: .2,
      }} />
      <div style={{ fontSize: 11, color: 'var(--text2)', fontWeight: 500, letterSpacing: '.3px', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

// ─── SectionCard ─────────────────────────────────────────
export function SectionCard({ children, style = {} }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: 16,
      ...style
    }}>
      {children}
    </div>
  )
}

// ─── SectionTitle ────────────────────────────────────────
export function SectionTitle({ children, aiBadge = false }) {
  return (
    <div style={{
      fontFamily: "'Space Grotesk',sans-serif",
      fontSize: 14, fontWeight: 600,
      marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {children}
      {aiBadge && (
        <span style={{
          fontSize: 10, background: 'rgba(109,93,246,.2)', color: '#A78BFA',
          border: '1px solid rgba(109,93,246,.3)', padding: '2px 7px',
          borderRadius: 10, fontWeight: 600, letterSpacing: '.3px',
        }}>
          AI POWERED
        </span>
      )}
    </div>
  )
}

// ─── SkillChip ───────────────────────────────────────────
export function SkillChip({ label, variant = 'skill' }) {
  return <span className={`chip-${variant}`}>{label}</span>
}

// ─── ProgressBar ─────────────────────────────────────────
export function ProgressBar({ label, value, color = 'var(--primary)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '5px 0' }}>
      <span style={{ fontSize: 13, color: 'var(--text2)', width: 140, flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 7, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 1.2s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, width: 36, textAlign: 'right', color, flexShrink: 0 }}>
        {Math.round(value)}%
      </span>
    </div>
  )
}

// ─── ScoreRing ───────────────────────────────────────────
export function ScoreRing({ score }) {
  const circumference = 213.6
  const offset = circumference - (score / 100) * circumference
  return (
    <svg width="90" height="90" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--surface3)" strokeWidth="8" />
      <circle
        cx="40" cy="40" r="34" fill="none"
        stroke="url(#ringGrad)" strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1.5s ease' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6D5DF6" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <text x="40" y="45" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="700" fontFamily="Space Grotesk,sans-serif">
        {score}
      </text>
    </svg>
  )
}

// ─── Loader ──────────────────────────────────────────────
export function Loader({ message = 'Loading...', steps = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--surface3)',
        borderTopColor: 'var(--primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ fontSize: 14, color: 'var(--text2)' }}>{message}</p>
      {steps.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {steps.map((s, i) => (
            <p key={i} style={{ fontSize: 12, color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--success)' }}>⟳</span> {s}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SkeletonCard ─────────────────────────────────────────
export function SkeletonCard({ lines = 3 }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
      <div style={{ width: '60%', height: 14, background: 'var(--surface3)', borderRadius: 6, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ width: `${80 - i * 10}%`, height: 10, background: 'var(--surface3)', borderRadius: 4, marginBottom: 8, opacity: 1 - i * 0.2 }} />
      ))}
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ fontSize: 40, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto 20px' }}>
        {description}
      </p>
      {action}
    </div>
  )
}

// ─── PrimaryButton ────────────────────────────────────────
export function PrimaryButton({ children, onClick, fullWidth = false, disabled = false, style = {} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? 'var(--surface3)' : 'linear-gradient(135deg,var(--primary),#8B5CF6)',
        color: disabled ? 'var(--text3)' : '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'inherit',
        transition: 'all .2s',
        ...style,
      }}
    >
      {children}
    </button>
  )
}

// ─── AiBadge ─────────────────────────────────────────────
export function AiBadge({ label = 'AI POWERED' }) {
  return (
    <span style={{
      fontSize: 10, background: 'rgba(109,93,246,.2)', color: '#A78BFA',
      border: '1px solid rgba(109,93,246,.3)', padding: '2px 8px',
      borderRadius: 10, fontWeight: 700, letterSpacing: '.4px',
    }}>
      {label}
    </span>
  )
}
