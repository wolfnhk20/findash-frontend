"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { AnalyticsCards } from "@/components/analytics-cards"
import { TransactionsTable } from "@/components/transactions-table"
import API from "@/lib/api"

export function AnalystDashboard() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  const [filters, setFilters] = useState<any>({})

  const fetchData = async () => {
    try {
      if (!user) return

      const params = new URLSearchParams()
      params.append("role", user.role)

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const txnRes = await API.get(`/transactions?${query}`)
      setTransactions(txnRes.data)

      const analyticsRes = await API.get(`/transactions/analytics?${query}`)
      setAnalytics(analyticsRes.data)

      const usersRes = await API.get(`/users?authRole=${user.role}`)
      setUsers(usersRes.data)

    } catch (err) {
      console.error("Analyst fetch error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user, filters])

  // 🔥 CRITICAL FIX (reset state on user switch)
  useEffect(() => {
    setTransactions([])
    setUsers([])
    setAnalytics(null)
    setFilters({})
  }, [user?.id])

  return (
    <div className="space-y-6 sm:space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Welcome back! Here&apos;s your financial overview.
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
        users={users}
        onFilterChange={setFilters}
        showActions={false}
        showUserColumns={true}
      />

    </div>
  )
}