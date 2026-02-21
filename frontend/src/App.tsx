import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './shared/components/Sidebar'
import ProtectedRoute from './shared/components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import CVTailorPage from './pages/CVTailorPage'

function DashboardRedirect() {
  const navigate = useNavigate()
  const [noResume, setNoResume] = useState(false)
  const userRaw = localStorage.getItem('sm_user')
  const user = userRaw ? JSON.parse(userRaw) : null

  useEffect(() => {
    const resumeId = localStorage.getItem(`sm_resume_${user?.id}`)
    if (resumeId) {
      navigate(`/dashboard/${resumeId}`, { replace: true })
    } else {
      setNoResume(true)
    }
  }, [])

  if (!noResume) return null

  return (
    <div style={{ maxWidth: '480px', margin: '80px auto', textAlign: 'center' }}>
      <div style={{
        width: '64px', height: '64px', borderRadius: '20px',
        background: 'rgba(0,174,239,0.08)', border: '1px solid rgba(0,174,239,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px', margin: '0 auto 24px',
      }}>
        ◈
      </div>
      <h2 style={{
        fontFamily: 'Bricolage Grotesque', fontSize: '24px',
        fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px',
      }}>
        No resume uploaded yet
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.6, marginBottom: '28px' }}>
        Upload your resume first to unlock your personal dashboard with AI analysis, skill gaps, and job recommendations.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'var(--accent)', color: 'white',
          border: 'none', borderRadius: '10px',
          padding: '13px 32px', fontSize: '15px',
          fontWeight: 600, cursor: 'pointer',
        }}
      >
        Upload Resume →
      </button>
    </div>
  )
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '256px', flex: 1, padding: '40px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const isLoggedIn = !!localStorage.getItem('sm_token')

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes — no sidebar */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes — with sidebar */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppShell><HomePage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/:id" element={
          <ProtectedRoute>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AppShell><AdminPage /></AppShell>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
  <ProtectedRoute>
    <AppShell><DashboardRedirect /></AppShell>
  </ProtectedRoute>
} />
<Route path="/cv-tailor" element={
  <ProtectedRoute>
    <AppShell><CVTailorPage /></AppShell>
  </ProtectedRoute>
} />

        {/* Root redirect */}
        <Route path="*" element={
          <Navigate to={isLoggedIn ? '/' : '/landing'} replace />
        } />
      </Routes>
    </BrowserRouter>
  )
}