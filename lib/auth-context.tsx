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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role") as Role | null
      const userId = localStorage.getItem("userId")
      const email = localStorage.getItem("email")

      if (token && role && userId) {
        setUser({
          email: email || "",
          role,
          id: userId
        })
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string): Promise<Role> => {
    setIsLoading(true)

    try {
      const res = await fetch(
        `https://findash-backend-m4ta.onrender.com/auth/login?email=${email}`,
        { method: "POST" }
      )

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

      if (!data?.token) {
        throw new Error("Invalid login response")
      }

      const { token, userId, role } = data

      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userId", userId)
      localStorage.setItem("email", email)

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
    localStorage.clear()
    setUser(null)
    window.location.href = "/"
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