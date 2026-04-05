"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { TransactionsTable } from "@/components/transactions-table"
import API from "@/lib/api"

export function ViewerTransactions() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [filters, setFilters] = useState<any>({}) // 🔥 IMPORTANT

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

      const txnRes = await API.get(`/transactions?${query}&size=1000`)
      setTransactions(txnRes.data.content || txnRes.data)

    } catch (err) {
      console.error("Viewer transactions error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, filters]) 

  return (
    <div className="space-y-6 sm:space-y-8">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Transactions</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          View your recent transaction history. Click any row to see full details.
        </p>
      </div>

      <TransactionsTable
        transactions={transactions}

        onFilterChange={setFilters} 

        showActions={false}
        showUserColumns={false}
      />

    </div>
  )
}