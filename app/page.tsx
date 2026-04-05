"use client"

import { AuthProvider } from "@/lib/auth-context"
import { FinDashApp } from "@/components/findash-app"

export default function Page() {
  return (
    <AuthProvider>
      <FinDashApp />
    </AuthProvider>
  )
}
