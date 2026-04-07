"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { TransactionsTable } from "@/components/transactions-table"
import { TransactionFormModal } from "@/components/transaction-form-modal"
import API from "@/lib/api"

export function AdminTransactions() {
  const { user } = useAuth()

  const [transactions, setTransactions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [filters, setFilters] = useState<any>({})

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const fetchData = async () => {
    try {
      if (!user) return

      const params = new URLSearchParams()
      params.append("role", user.role)

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const txnRes = await API.get(`/transactions?${query}&size=1000`)
      setTransactions(txnRes.data.content || txnRes.data)

      const usersRes = await API.get(`/users?authRole=${user.role}&size=1000`)
      setUsers(usersRes.data.content || usersRes.data)

    } catch (err) {
      console.error("Fetch error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchData()
  }, [user, filters])

  useEffect(() => {
    setTransactions([])
    setUsers([])
    setFilters({})
    setEditingTransaction(null)
    setIsFormOpen(false)
  }, [user?.id])

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
      const payload = {
        amount: Number(data.amount),
        type: data.type?.toUpperCase(),
        category: data.category,
        description: data.description || "",
        date: data.date,
        userId: data.userId || user?.id
      }

      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction.id}`, payload)
      } else {
        await API.post(`/transactions`, payload)
      }

      fetchData()
    } catch (err) {
      console.error("Submit error:", err)
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">View and manage all transactions.</p>
      </div>

      <TransactionsTable
        transactions={transactions}
        users={users}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilterChange={setFilters}
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