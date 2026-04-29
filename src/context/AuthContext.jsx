import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const USERS = {
  admin: { password: 'admin123', role: 'admin' },
  staff: { password: 'staff123', role: 'staff' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vms_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (username, password) => {
    const u = USERS[username]
    if (u && u.password === password) {
      const userData = { username, role: u.role }
      setUser(userData)
      localStorage.setItem('vms_user', JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vms_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
