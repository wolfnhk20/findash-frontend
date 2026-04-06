"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role") as Role | null
      const userId = localStorage.getItem("userId")

      if (token && role && userId) {
        setUser({
          email: "",
          role,
          id: userId
        })
      }
    }
  }, [])

  const login = useCallback(async (email: string): Promise<Role> => {
    setIsLoading(true)

    try {
      const res = await fetch(`https://findash-backend-production.up.railway.app/auth/login?email=${email}`, {
        method: "POST",
      })

      let data: any = null

      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Your account is inactive. Contact admin.")
        }
        throw new Error(data?.message || "Login failed")
      }

      if (!data || !data.token) {
        throw new Error("Invalid login response")
      }

      const { token, userId, role } = data

      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userId", userId)

      setUser({
        email,
        role,
        id: userId
      })

      return role

    } catch (err: any) {
      throw new Error(err.message || "Login failed")
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