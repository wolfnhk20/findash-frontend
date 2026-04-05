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
      const token = localStorage.getItem("token")

      const res = await API.get(`/users?authRole=${user?.role}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user) fetchUsers()
  }, [user])

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
      const token = localStorage.getItem("token")

      await API.patch(`/users/${id}/deactivate?authRole=${user?.role}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      fetchUsers()
    } catch (err) {
      console.error(err)
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

      if (editingUser) {
        await API.put(`/users/${editingUser.id}?authRole=${user?.role}`, data, config)
      } else {
        await API.post(`/users`, data, config)
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