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

export function TransactionFormModal({
  open,
  onOpenChange,
  transaction,
  users = [],
  showUserField = false,
  onSubmit
}: any) {

  const defaultForm = {
    amount: "",
    type: "EXPENSE",
    category: "DINING",
    date: new Date().toISOString().split("T")[0],
    description: "",
    userId: ""
  }

  const [formData, setFormData] = useState<any>(defaultForm)

  useEffect(() => {
    if (!open) return

    if (transaction) {
      setFormData({
        amount: transaction.amount?.toString() || "",
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description || "",
        userId: transaction.userId || users?.[0]?.id || ""
      })
    } else {
      setFormData({
        amount: "",
        type: "EXPENSE",
        category: "DINING",
        date: new Date().toISOString().split("T")[0],
        description: "",
        userId: users?.[0]?.id || ""
      })
    }
  }, [transaction, open, users])

  useEffect(() => {
    if (!open) {
      setFormData(defaultForm)
    }
  }, [open])

  const handleSubmit = (e: any) => {
    e.preventDefault()

    if (!formData.amount || isNaN(Number(formData.amount))) return

    const submitData = {
      amount: Number(formData.amount),
      type: formData.type,
      category: formData.category,
      date: formData.date,
      description: formData.description || "",
      ...(showUserField && { userId: formData.userId })
    }

    onSubmit(submitData)
    onOpenChange(false)
  }

  const isEdit = !!transaction

  const categories = [
    "TRANSFERS", "DINING", "GROCERIES", "TRANSPORT", "SHOPPING",
    "SERVICES", "ENTERTAINMENT", "SUBSCRIPTION", "TRAVEL", "SALARY", "RENT"
  ]

  const transactionTypes = ["INCOME", "EXPENSE"]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the transaction details below."
              : "Fill in the details for the new transaction."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  setFormData({ ...formData, type: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {transactionTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData({ ...formData, category: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          {showUserField && users.length > 0 && (
            <div className="space-y-2">
              <Label>Assign to User</Label>
              <Select
                value={formData.userId || ""}
                onValueChange={(v) =>
                  setFormData({ ...formData, userId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit">
              {isEdit ? "Update" : "Add"} Transaction
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}