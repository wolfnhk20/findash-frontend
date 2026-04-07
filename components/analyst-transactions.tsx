"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { TransactionsTable } from "@/components/transactions-table"
import API from "@/lib/api"

export function AnalystTransactions() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
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

      const [txnRes, usersRes] = await Promise.all([
        API.get(`/transactions?${query}&size=1000`),
        API.get(`/users?authRole=${user.role}&size=1000`)
      ])

      setTransactions(txnRes.data.content || txnRes.data)
      setUsers(usersRes.data.content || usersRes.data)

    } catch (err) {
      console.error("Transactions error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user, filters])

  useEffect(() => {
    setTransactions([])
    setUsers([])
    setFilters({})
  }, [user?.id])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Transactions</h1>

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