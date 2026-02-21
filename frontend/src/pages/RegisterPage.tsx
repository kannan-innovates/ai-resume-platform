import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../features/auth/api'
import { useAuth } from '../features/auth/useAuth'
import Spinner from '../shared/components/Spinner'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
 
  const [loading, setLoading] = useState(false)
  const { saveAuth } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit() {
  if (!form.name || !form.email || !form.password) {
    toast.error('All fields are required')
    return
  }
  if (form.password !== form.confirm) {
    toast.error('Passwords do not match')
    return
  }
  if (form.password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return
  }
  setLoading(true)
  try {
    const data = await register(form.name, form.email, form.password)
    saveAuth(data.token, data.user)
    toast.success(`Welcome to SkillMount, ${data.user.name}!`)
    navigate('/')
  } catch (e: any) {
    toast.error(e.response?.data?.message || 'Registration failed')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '20px',
    }}>
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '20px', padding: '40px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo_skillMount.png" alt="SkillMount Logo" style={{ height: '44px', objectFit: 'contain', margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)', fontSize: '24px', fontWeight: 700 }}>
            Create account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>Start your career journey</p>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '6px' }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.key]}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{
                  width: '100%', background: 'var(--bg-surface)',
                  border: '1px solid var(--border)', borderRadius: '8px',
                  padding: '11px 14px', color: 'var(--text-primary)',
                  fontSize: '14px', outline: 'none',
                }}
              />
            </div>
          ))}
        </div>

        

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', marginTop: '20px',
            background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '13px', fontSize: '15px', fontWeight: 600,
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          {loading ? <><Spinner size={16} /> Creating account...</> : 'Create Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}