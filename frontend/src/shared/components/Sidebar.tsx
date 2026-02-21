import { NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Sidebar() {
  const navigate = useNavigate()
  const userRaw = localStorage.getItem('sm_user')
  const user = userRaw ? JSON.parse(userRaw) : null

  function logout() {
    localStorage.removeItem('sm_token')
    localStorage.removeItem('sm_user')
    toast.success('Signed out successfully')
    navigate('/landing')
  }

  const links = user?.role === 'admin'
  ? [
      { to: '/admin', label: 'Admin Dashboard', icon: '⊞' },
    ]
  : [
      { to: '/', label: 'Upload Resume', icon: '↑' },
      { to: '/dashboard', label: 'My Dashboard', icon: '◈' },
      { to: '/cv-tailor', label: 'CV Tailoring', icon: '✦' },
    ]

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      height: '100vh', width: '256px',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)', zIndex: 50,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo_skillMount.png" alt="SkillMount Logo" style={{ height: '32px', objectFit: 'contain' }} />
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)' }}>
            SkillMount
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 500, textDecoration: 'none',
              transition: 'all 0.15s',
              background: isActive ? 'var(--bg-card)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
            })}
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ marginBottom: '10px' }}>
          <p style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600 }}>{user?.name}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{user?.email}</p>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%', background: 'transparent',
            border: '1px solid var(--border)', borderRadius: '8px',
            padding: '8px', color: 'var(--text-muted)',
            fontSize: '13px', cursor: 'pointer',
          }}
        >
          Sign Out
        </button>
      </div>
    </aside>
  )
}