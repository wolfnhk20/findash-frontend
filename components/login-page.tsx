"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      const role = await login(email)

      if (role === "ADMIN") {
        router.push("/admin")
      } else if (role === "ANALYST") {
        router.push("/analyst")
      } else {
        router.push("/viewer")
      }

    } catch (err: any) {
      setError(err.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
              <svg
                className="size-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold text-foreground">Finance Dashboard</span>
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                aria-invalid={!!error}
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner className="size-4" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Try these demo emails:
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => setEmail("admin@example.com")}
                className="text-xs text-primary hover:underline"
              >
                admin@example.com
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                type="button"
                onClick={() => setEmail("analyst1@example.com")}
                className="text-xs text-primary hover:underline"
              >
                analyst1@example.com
              </button>
              <span className="text-muted-foreground">|</span>
              <button
                type="button"
                onClick={() => setEmail("viewer2@example.com")}
                className="text-xs text-primary hover:underline"
              >
                viewer2@example.com
              </button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}