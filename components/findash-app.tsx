"use client"

import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminDashboard } from "@/components/admin-dashboard"
import { AdminTransactions } from "@/components/admin-transactions"
import { AdminUsers } from "@/components/admin-users"
import { AnalystDashboard } from "@/components/analyst-dashboard"
import { AnalystTransactions } from "@/components/analyst-transactions"
import { AnalystUsers } from "@/components/analyst-users"
import { ViewerDashboard } from "@/components/viewer-dashboard"
import { ViewerTransactions } from "@/components/viewer-transactions"
import { Skeleton } from "@/components/ui/skeleton"

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  )
}

export function FinDashApp() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <DashboardLayout>
      {(activePage) => {
        // Admin views
        if (user.role === "ADMIN") {
          switch (activePage) {
            case "dashboard":
              return <AdminDashboard />
            case "transactions":
              return <AdminTransactions />
            case "users":
              return <AdminUsers />
            default:
              return <AdminDashboard />
          }
        }

        // Analyst views
        if (user.role === "ANALYST") {
          switch (activePage) {
            case "dashboard":
              return <AnalystDashboard />
            case "transactions":
              return <AnalystTransactions />
            case "users":
              return <AnalystUsers />
            default:
              return <AnalystDashboard />
          }
        }

        // Viewer views
        switch (activePage) {
          case "dashboard":
            return <ViewerDashboard />
          case "transactions":
            return <ViewerTransactions />
          default:
            return <ViewerDashboard />
        }
      }}
    </DashboardLayout>
  )
}
