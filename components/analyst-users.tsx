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
      if (!user) return

      const res = await API.get(`/users?authRole=${user.role}&size=1000`)
      setUsers(res.data.content || res.data)
    } catch (err) {
      console.error("Analyst users error:", err)
    }
  }

  useEffect(() => {
    if (user) fetchUsers()
  }, [user])

  // 🔥 CRITICAL FIX (reset on user switch)
  useEffect(() => {
    setUsers([])
  }, [user?.id])

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold text-foreground">Users</h1>
        <p className="text-muted-foreground mt-1">
          View all user accounts.
        </p>
      </div>

      <UsersTable
        users={users}
        showActions={false}
      />

    </div>
  )
}