"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Transaction, User } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Calendar, IndianRupee, Tag, FileText, User as UserIcon, Mail, Hash, Clock } from "lucide-react"

interface TransactionDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  user?: User | null
  showUserInfo?: boolean
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(amount)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })
}

export function TransactionDetailsModal({
  open,
  onOpenChange,
  transaction,
  user,
  showUserInfo = true
}: TransactionDetailsModalProps) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Transaction Details</DialogTitle>
          <DialogDescription>
            View complete information about this transaction.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 sm:space-y-6 py-4">
          {/* Transaction ID */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Hash className="size-4 sm:size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Transaction ID</p>
              <p className="text-sm sm:text-base font-mono break-all">{transaction.id}</p>
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <IndianRupee className="size-4 sm:size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Amount</p>
              <p className={cn(
                "text-xl sm:text-2xl font-bold",
                transaction.type === "INCOME" ? "text-success" : "text-destructive"
              )}>
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Tag className="size-4 sm:size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-muted-foreground">Type</p>
                <Badge
                  variant={transaction.type === "INCOME" ? "default" : "destructive"}
                  className={cn(
                    "mt-1 text-xs",
                    transaction.type === "INCOME" && "bg-success text-success-foreground hover:bg-success/90"
                  )}
                >
                  {transaction.type}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-sm sm:text-base font-medium mt-1">
                {transaction.category.charAt(0) + transaction.category.slice(1).toLowerCase()}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Calendar className="size-4 sm:size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Transaction Date</p>
              <p className="text-sm sm:text-base font-medium">{formatDate(transaction.date)}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Clock className="size-4 sm:size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Created At</p>
              <p className="text-sm sm:text-base">{formatDateTime(transaction.createdAt)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <FileText className="size-4 sm:size-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm sm:text-base">{transaction.description}</p>
            </div>
          </div>

          {/* User Info - Only shown for Admin/Analyst */}
          {showUserInfo && (
            <div className="border-t pt-4 space-y-4">
              <p className="text-xs sm:text-sm font-semibold text-foreground">User Information</p>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <UserIcon className="size-4 sm:size-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm sm:text-base font-mono break-all">{transaction.userId}</p>
                </div>
              </div>
              {user && (
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="size-8 sm:size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Mail className="size-4 sm:size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">User Email</p>
                    <p className="text-sm sm:text-base break-all">{user.email}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
