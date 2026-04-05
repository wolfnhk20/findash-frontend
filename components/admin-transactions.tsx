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
  const [filters, setFilters] = useState<any>({}) // 🔥 IMPORTANT

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<any>(null)

  const fetchData = async () => {
    try {
      if (!user) return

      const token = localStorage.getItem("token")

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      const params = new URLSearchParams()
      params.append("role", user.role)

      // 🔥 APPLY FILTERS
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value as string)
      })

      const query = params.toString()

      const txnRes = await API.get(`/transactions?${query}`, config)
      setTransactions(txnRes.data)

      const usersRes = await API.get(`/users?authRole=${user.role}`, config)
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
      const token = localStorage.getItem("token")

      await API.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchData()
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      const token = localStorage.getItem("token")

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      if (editingTransaction) {
        await API.put(`/transactions/${editingTransaction.id}`, data, config)
      } else {
        await API.post(`/transactions`, {
          ...data,
          userId: data.userId || user?.id
        }, config)
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