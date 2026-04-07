"use client"

import { useEffect, useState } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { FinDashApp } from "@/components/findash-app"
import { FinDashAppWrapper } from "@/components/findash-app-wrapper"

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AuthProvider>
      <FinDashAppWrapper>
        <FinDashApp />
      </FinDashAppWrapper>
    </AuthProvider>
  )
}