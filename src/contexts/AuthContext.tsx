import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  delivery_address: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<string>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('trznjak_access')
    if (token) {
      api.get('/auth/me/')
        .then((r) => setUser(r.data))
        .catch(() => {
          localStorage.removeItem('trznjak_access')
          localStorage.removeItem('trznjak_refresh')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<string> => {
    const { data } = await api.post('/auth/token/', { email, password })
    const me = await api.get('/auth/me/', { headers: { Authorization: `Bearer ${data.access}` } })
    localStorage.setItem('trznjak_access', data.access)
    localStorage.setItem('trznjak_refresh', data.refresh)
    setUser(me.data)
    return me.data.role
  }

  const logout = () => {
    localStorage.removeItem('trznjak_access')
    localStorage.removeItem('trznjak_refresh')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
