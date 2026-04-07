"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { User, Role, UserStatus } from "@/lib/types"

interface UserFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  onSubmit: (data: Omit<User, "id">) => void
}

const roles: Role[] = ["ADMIN", "ANALYST", "VIEWER"]
const statuses: UserStatus[] = ["ACTIVE", "INACTIVE"]

export function UserFormModal({ open, onOpenChange, user, onSubmit }: UserFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultForm = {
    name: "",
    email: "",
    role: "VIEWER" as Role,
    status: "ACTIVE" as UserStatus
  }

  const [formData, setFormData] = useState(defaultForm)

  useEffect(() => {
    if (!open) return

    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role,
        status: user.status
      })
    } else {
      setFormData(defaultForm)
    }
  }, [user, open])

  // 🔥 RESET ON CLOSE
  useEffect(() => {
    if (!open) {
      setFormData(defaultForm)
      setIsSubmitting(false)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) return

    setIsSubmitting(true)

    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status
      })
    } finally {
      setIsSubmitting(false)
      onOpenChange(false)
    }
  }

  const isEdit = !!user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit User" : "Add User"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the user details below."
              : "Fill in the details for the new user."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">

          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Enter full name"
              value={formData.name}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, email: e.target.value }))
              }
              required
              className="h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, role: value as Role }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, status: value as UserStatus }))
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? (
                <>
                  <Spinner className="size-4" />
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEdit ? "Update" : "Add"} User</>
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}