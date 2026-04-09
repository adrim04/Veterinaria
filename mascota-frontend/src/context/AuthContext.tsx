import React, { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin } from '@/api/auth'

interface AuthContextValue {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('vet_token')
  )
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem('vet_username')
  )

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null)
      setUsername(null)
    }
    window.addEventListener('unauthorized', handleUnauthorized)
    return () => window.removeEventListener('unauthorized', handleUnauthorized)
  }, [])

  const login = async (usernameInput: string, password: string) => {
    const response = await apiLogin({ username: usernameInput, password })
    if (!response.success) {
      throw new Error(response.message ?? 'Error al iniciar sesión')
    }
    const { token: newToken, username: newUsername } = response.data
    localStorage.setItem('vet_token', newToken)
    localStorage.setItem('vet_username', newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  const logout = () => {
    localStorage.removeItem('vet_token')
    localStorage.removeItem('vet_username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
