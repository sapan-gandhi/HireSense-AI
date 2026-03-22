import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LayoutDashboard, FileText, Target, Search, Map, MessageSquare, Briefcase, Wand2, Download, LogOut } from 'lucide-react'

const NAV_MAIN = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/resume', label: 'Resume', icon: FileText },
  { to: '/dashboard/careers', label: 'Career Match', icon: Target },
  { to: '/dashboard/skills', label: 'Skill Gap', icon: Search },
  { to: '/dashboard/roadmap', label: 'Roadmap', icon: Map },
  { to: '/dashboard/interview', label: 'Interview Prep', icon: MessageSquare },
]
const NAV_PRO = [
  { to: '/dashboard/jd-match', label: 'JD Matcher', icon: Briefcase },
  { to: '/dashboard/improver', label: 'Resume Improver', icon: Wand2 },
  { to: '/dashboard/report', label: 'Export Report', icon: Download },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const NavItem = ({ to, label, icon: Icon, end }) => (
    <NavLink to={to} end={end} style={({ isActive }) => ({
      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
      fontSize: 13, fontWeight: isActive ? 600 : 400,
      color: isActive ? '#A78BFA' : 'var(--text2)',
      background: isActive ? 'rgba(109,93,246,.15)' : 'transparent',
      borderRadius: 8, textDecoration: 'none', margin: '2px 0', transition: 'all .15s',
    })}>
      <Icon size={15} />
      {label}
    </NavLink>
  )

  return (
    <aside style={{ width: 210, background: 'var(--surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '20px 16px 12px', fontFamily: "\'Space Grotesk\',sans-serif", fontSize: 16, fontWeight: 700, background: 'linear-gradient(135deg,#A78BFA,#38BDF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        AI Career Copilot ✦
      </div>
      <nav style={{ flex: 1, padding: '8px 8px', overflow: 'auto' }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.8px', padding: '8px 10px 4px', textTransform: 'uppercase' }}>Main</p>
        {NAV_MAIN.map(n => <NavItem key={n.to} {...n} />)}
        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', letterSpacing: '.8px', padding: '16px 10px 4px', textTransform: 'uppercase' }}>Pro Tools</p>
        {NAV_PRO.map(n => <NavItem key={n.to} {...n} />)}
      </nav>
      <div style={{ padding: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--surface2)', borderRadius: 10, padding: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary),#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>Student</div>
          </div>
          <button onClick={() => { logout(); navigate('/') }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 2 }} title="Logout"><LogOut size={14} /></button>
        </div>
      </div>
    </aside>
  )
}
