"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { AnalyticsCards } from "@/components/analytics-cards"
import { TransactionsTable } from "@/components/transactions-table"
import { TransactionFormModal } from "@/components/transaction-form-modal"
import API from "@/lib/api"

export function AdminDashboard() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)

  const [filters, setFilters] = useState<any>({}) // 🔥 IMPORTANT

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const fetchData = async () => {
    try {
      if (!user) return

      const params = new URLSearchParams()

      params.append("role", user.role)

      // 🔥 APPLY ALL FILTERS
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
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user, filters])

  const handleAdd = () => {
    setEditingTransaction(null)
    setIsFormOpen(true)
  }

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await API.delete(`/transactions/${id}`)
      fetchData()
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction.id}`, data)
      } else {
        await API.post(`/transactions`, {
          ...data,
          userId: data.userId || user?.id
        })
      }

      fetchData()
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}

        onFilterChange={setFilters} // 🔥 CONNECTED

        showActions={true}
        showUserColumns={true}
      />

      <TransactionFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        transaction={editingTransaction}
        users={users}
        showUserField={true}
        onSubmit={handleSubmit}
      />

    </div>
  )
}