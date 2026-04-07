"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { UsersTable } from "@/components/users-table"
import API from "@/lib/api"

export function AnalystUsers() {
  const { user } = useAuth()
  const [users, setUsers] = useState<any[]>([])

  const fetchUsers = async () => {
    try {
      if (!user?.role) return

      const res = await API.get(`/users?authRole=${user.role}&size=1000`)
      setUsers(res.data.content || res.data)

    } catch (err) {
      console.error("Users error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchUsers()
  }, [user])

  useEffect(() => {
    setUsers([])
  }, [user?.id])

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Users</h1>

      <UsersTable
        users={users}
        showActions={false}
      />
    </div>
  )
}