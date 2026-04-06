"use client"

import { AuthProvider } from "@/lib/auth-context"
import { FinDashApp } from "@/components/findash-app"
import { FinDashAppWrapper } from "@/components/findash-app-wrapper"

export default function Page() {
  return (
    <AuthProvider>
      <FinDashAppWrapper>
        <FinDashApp />
      </FinDashAppWrapper>
    </AuthProvider>
  )
}
