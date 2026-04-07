"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { UsersTable } from "@/components/users-table"
import { UserFormModal } from "@/components/user-form-modal"
import API from "@/lib/api"

export function AdminUsers() {
  const { user } = useAuth()

  const [users, setUsers] = useState<any[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  const fetchUsers = async () => {
    try {
      if (!user) return

      const res = await API.get(`/users?authRole=${user.role}&size=1000`)
      setUsers(res.data.content || res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) fetchUsers()
  }, [user])

  // 🔥 CRITICAL FIX (reset on user change)
  useEffect(() => {
    setUsers([])
    setEditingUser(null)
    setIsFormOpen(false)
  }, [user?.id])

  const handleAdd = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const handleEdit = (user: any) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleDeactivate = async (id: string) => {
    try {
      if (!user) return

      await API.patch(`/users/${id}/deactivate?authRole=${user.role}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (data: any) => {
    try {
      if (!user) return

      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status || "ACTIVE"
      }

      if (editingUser) {
        await API.put(`/users/${editingUser.id}?authRole=${user.role}`, payload)
      } else {
        await API.post(`/users`, payload)
      }

      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage user accounts and permissions.</p>
      </div>

      <UsersTable
        users={users}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDeactivate={handleDeactivate}
        showActions={true}
      />

      <UserFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={editingUser}
        onSubmit={handleSubmit}
      />

    </div>
  )
}