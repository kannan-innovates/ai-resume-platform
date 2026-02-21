import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const token = localStorage.getItem('sm_token')
  const userRaw = localStorage.getItem('sm_user')

  if (!token) return <Navigate to="/landing" replace />

  if (adminOnly) {
    const user = userRaw ? JSON.parse(userRaw) : null
    if (user?.role !== 'admin') return <Navigate to="/" replace />
  }

  return <>{children}</>
}