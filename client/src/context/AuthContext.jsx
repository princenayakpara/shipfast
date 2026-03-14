import React, { createContext, useContext, useState, useEffect } from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('shipfast_token')
    if (!token) {
      setLoading(false)
      return
    }
    authService.getMe()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('shipfast_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const { user, token } = await authService.login(email, password)
    localStorage.setItem('shipfast_token', token)
    setUser(user)
    return user
  }

  const register = async (email, password, name) => {
    const { user, token } = await authService.register(email, password, name)
    localStorage.setItem('shipfast_token', token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('shipfast_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
