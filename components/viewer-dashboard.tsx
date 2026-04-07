"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AnalyticsCards } from "@/components/analytics-cards"
import { TransactionsTable } from "@/components/transactions-table"
import API from "@/lib/api"

export function ViewerDashboard() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [filters, setFilters] = useState<any>({})

  const fetchData = async () => {
    try {
      if (!user?.id) return

      const params = new URLSearchParams()
      params.append("role", user.role)
      params.append("userId", user.id)

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const txnRes = await API.get(`/transactions?${query}`)
      setTransactions(txnRes.data)

      const analyticsRes = await API.get(`/transactions/analytics?${query}`)
      setAnalytics(analyticsRes.data)

    } catch (err) {
      console.error("Viewer dashboard error:", err)
    }
  }

  useEffect(() => {
    if (user?.id) fetchData()
  }, [user, filters])

  // 🔥 CRITICAL FIX (reset on user switch)
  useEffect(() => {
    setTransactions([])
    setAnalytics(null)
    setFilters({})
  }, [user?.id])

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome, {user?.email}! Here&apos;s your personal financial overview.
        </p>
      </div>

      {analytics && (
        <AnalyticsCards
          totalIncome={analytics.totalIncome}
          totalExpense={analytics.totalExpense}
          netBalance={analytics.netBalance}
        />
      )}

      <TransactionsTable
        transactions={transactions}
        onFilterChange={setFilters}
        showActions={false}
        showUserColumns={false}
      />

    </div>
  )
}