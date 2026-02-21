import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <img src="/logo_skillMount.png" alt="SkillMount Logo" style={{ height: '44px', objectFit: 'contain' }} />
        <span style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'Bricolage Grotesque', color: 'var(--text-primary)' }}>
          SkillMount
        </span>
      </div>

      {/* Hero */}
      <h1 style={{
        fontSize: '52px', fontWeight: 700,
        fontFamily: 'Bricolage Grotesque',
        color: 'var(--text-primary)',
        lineHeight: 1.15, marginBottom: '20px', maxWidth: '680px',
      }}>
        AI-Powered Career Intelligence
      </h1>
      <p style={{
        color: 'var(--text-muted)', fontSize: '18px',
        maxWidth: '500px', lineHeight: 1.7, marginBottom: '40px',
      }}>
        Upload your resume. Discover skill gaps. Get job recommendations.
        Let AI map your career path.
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: 'var(--accent)', color: 'white',
            border: 'none', borderRadius: '10px',
            padding: '14px 32px', fontSize: '15px',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Get Started Free
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'transparent', color: 'var(--text-primary)',
            border: '1px solid var(--border)', borderRadius: '10px',
            padding: '14px 32px', fontSize: '15px',
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Sign In
        </button>
      </div>

      {/* Features row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px', marginTop: '80px', maxWidth: '700px', width: '100%',
      }}>
        {[
          { icon: '↑', title: 'Resume Analysis', desc: 'AI-powered ATS scoring and feedback' },
          { icon: '⊞', title: 'Skill Gap Detection', desc: 'Know exactly what skills you need' },
          { icon: '✦', title: 'Job Matching', desc: 'Matched jobs from top platforms' },
        ].map(f => (
          <div key={f.title} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: '14px', padding: '24px', textAlign: 'left',
          }}>
            <span style={{ fontSize: '22px', color: 'var(--accent)', display: 'block', marginBottom: '10px' }}>{f.icon}</span>
            <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>{f.title}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}