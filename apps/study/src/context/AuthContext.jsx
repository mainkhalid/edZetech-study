import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'))
  const navigate = useNavigate()

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (!res.ok) throw new Error('Login failed')
    
    const data = await res.json()
    localStorage.setItem('adminToken', data.token)
    setToken(data.token)
    navigate('/admin')
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    navigate('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)