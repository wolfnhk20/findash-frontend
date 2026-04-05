"use client"

import { useState, useMemo } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Empty } from "@/components/ui/empty"
import type { User, Role } from "@/lib/types"
import { ChevronLeft, ChevronRight, Pencil, UserX, Plus, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { UserDetailsModal } from "@/components/user-details-modal"

interface UsersTableProps {
  users: User[]
  onAdd?: () => void
  onEdit?: (user: User) => void
  onDeactivate?: (id: string) => void
  showActions?: boolean
}

export function UsersTable({
  users,
  onAdd,
  onEdit,
  onDeactivate,
  showActions = true
}: UsersTableProps) {

  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL")
  const [statusFilter, setStatusFilter] = useState<"ACTIVE" | "INACTIVE" | "ALL">("ALL")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const pageSize = 10
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const roles: Role[] = ["ADMIN", "ANALYST", "VIEWER"]

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {

      const roleMatch = roleFilter === "ALL" || u.role === roleFilter
      const statusMatch = statusFilter === "ALL" || u.status === statusFilter

      const searchMatch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())

      return roleMatch && statusMatch && searchMatch
    })
  }, [users, roleFilter, statusFilter, search])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "default"
      case "ANALYST":
        return "secondary"
      case "VIEWER":
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Users</CardTitle>

          <div className="flex flex-wrap gap-3 items-center">

            {/* 🔍 SEARCH */}
            <input
              placeholder="Search users..."
              className="border px-2 py-1 rounded"
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />

            {/* ROLE FILTER */}
            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value as Role | "ALL")
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* STATUS FILTER */}
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as any)
                handleFilterChange()
              }}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {showActions && onAdd && (
              <Button onClick={onAdd}>
                <Plus className="size-4 mr-1" />
                Add User
              </Button>
            )}

          </div>
        </div>
      </CardHeader>

      <CardContent>

        {paginatedUsers.length === 0 ? (
          <Empty icon={<Users />} title="No users found" />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    onClick={() => {
                      setSelectedUser(user)
                      setDetailsOpen(true)
                    }}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0 ? "bg-background" : "bg-muted/10"
                    )}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>

                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge>
                        {user.status}
                      </Badge>
                    </TableCell>

                    {showActions && (
                      <TableCell className="text-right">
                        <Button size="icon-sm" onClick={(e)=>{e.stopPropagation();onEdit?.(user)}}><Pencil size={16}/></Button>
                        <Button size="icon-sm" onClick={(e)=>{e.stopPropagation();onDeactivate?.(user.id)}}><UserX size={16}/></Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex justify-between mt-4">
                <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft size={16} />
                </Button>

                <span>{currentPage} / {totalPages}</span>

                <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}

            <UserDetailsModal
              open={detailsOpen}
              onOpenChange={setDetailsOpen}
              user={selectedUser}
            />
          </>
        )}

      </CardContent>
    </Card>
  )
}