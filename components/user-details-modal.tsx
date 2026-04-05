"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  User as UserIcon,
  Mail,
  Hash,
  Shield,
  Activity,
  Clock
} from "lucide-react"

export function UserDetailsModal({
  open,
  onOpenChange,
  user
}: any) {

  if (!user) return null

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">

        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            Complete information about this user
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">

          {/* USER ID */}
          <div className="flex gap-3">
            <Hash className="size-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono">{user.id}</p>
            </div>
          </div>

          {/* NAME */}
          <div className="flex gap-3">
            <UserIcon className="size-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex gap-3">
            <Mail className="size-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p>{user.email}</p>
            </div>
          </div>

          {/* ROLE */}
          <div className="flex gap-3">
            <Shield className="size-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge>{user.role}</Badge>
            </div>
          </div>

          {/* STATUS */}
          <div className="flex gap-3">
            <Activity className="size-4 mt-1 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={user.status === "ACTIVE" ? "default" : "destructive"}
              >
                {user.status}
              </Badge>
            </div>
          </div>

          {/* CREATED AT (OPTIONAL) */}
          {user.createdAt && (
            <div className="flex gap-3">
              <Clock className="size-4 mt-1 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p>{formatDateTime(user.createdAt)}</p>
              </div>
            </div>
          )}

        </div>
      </DialogContent>
    </Dialog>
  )
}