import { useState } from 'react'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('sm_user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem('sm_token')
  )

  function saveAuth(token: string, user: AuthUser) {
    localStorage.setItem('sm_token', token)
    localStorage.setItem('sm_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  function clearAuth() {
    localStorage.removeItem('sm_token')
    localStorage.removeItem('sm_user')
    setToken(null)
    setUser(null)
  }

  return { user, token, saveAuth, clearAuth, isLoggedIn: !!token }
}