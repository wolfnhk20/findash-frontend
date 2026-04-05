"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Role = "ADMIN" | "ANALYST" | "VIEWER"

interface AuthUser {
  email: string
  role: Role
  id: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string) => Promise<Role>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string): Promise<Role> => {
    setIsLoading(true)

    try {
      const res = await fetch(`https://findash-backend-m4ta.onrender.com/auth/login?email=${email}`, {
        method: "POST",
      })

      // 🔥 NOW EXPECT JSON (from backend fix)
      const data = await res.json()

      if (!res.ok || !data.token) {
        throw new Error("Invalid login response")
      }

      const { token, userId, role } = data

      // ✅ STORE EVERYTHING
      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userId", userId)

      setUser({
        email,
        role,
        id: userId
      })

      return role

    } catch (err) {
      console.error("Login error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    localStorage.removeItem("userId")
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}