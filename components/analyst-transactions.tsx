"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { TransactionsTable } from "@/components/transactions-table"
import API from "@/lib/api"

export function AnalystTransactions() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [filters, setFilters] = useState<any>({}) // 🔥 IMPORTANT

  const fetchData = async () => {
    try {
      if (!user) return

      const params = new URLSearchParams()
      params.append("role", user.role)

      // 🔥 APPLY FILTERS
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const txnRes = await API.get(`/transactions?${query}`)
      setTransactions(txnRes.data)

      const usersRes = await API.get(`/users?authRole=${user.role}`)
      setUsers(usersRes.data)

    } catch (err) {
      console.error("Analyst transactions error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, filters]) // 🔥 IMPORTANT

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          View all transaction records.
        </p>
      </div>

      <TransactionsTable
        transactions={transactions}
        users={users}

        onFilterChange={setFilters} // 🔥 CONNECTED

        showActions={false} // 🔥 read-only
        showUserColumns={true}
      />

    </div>
  )
}