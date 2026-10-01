import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi, signup as signupApi } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On first load, restore the session from localStorage if one was saved earlier.
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  function persistSession(authResponse) {
    const { token, name, email, role } = authResponse
    localStorage.setItem('token', token)
    const user = { name, email, role }
    localStorage.setItem('user', JSON.stringify(user))
    setCurrentUser(user)
    return user
  }

  async function login(credentials) {
    const authResponse = await loginApi(credentials)
    return persistSession(authResponse)
  }

  async function signup(details) {
    const authResponse = await signupApi(details)
    return persistSession(authResponse)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    role: currentUser?.role ?? null,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}