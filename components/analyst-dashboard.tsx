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
      if (!user?.role) return

      const params = new URLSearchParams()
      params.append("role", user.role)

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const [txnRes, analyticsRes, usersRes] = await Promise.all([
        API.get(`/transactions?${query}`),
        API.get(`/transactions/analytics?${query}`),
        API.get(`/users?authRole=${user.role}`)
      ])

      setTransactions(txnRes.data)
      setAnalytics(analyticsRes.data)
      setUsers(usersRes.data)

    } catch (err) {
      console.error("Dashboard error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user, filters])

  useEffect(() => {
    setTransactions([])
    setUsers([])
    setAnalytics(null)
    setFilters({})
  }, [user?.id])

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Financial overview</p>
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