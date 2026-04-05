"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Empty } from "@/components/ui/empty"
import type { Transaction, TransactionType, Category, User } from "@/lib/types"
import { Pencil, Trash2, Plus, Receipt, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { TransactionDetailsModal } from "@/components/transaction-details-modal"

interface TransactionsTableProps {
  transactions: Transaction[]
  users?: User[]
  onAdd?: () => void
  onEdit?: (transaction: Transaction) => void
  onDelete?: (id: string) => void

  onFilterChange?: (filters: {
    type?: string
    category?: string
    search?: string
    sort?: string
    startDate?: string
    endDate?: string
  }) => void

  showActions?: boolean
  showUserColumns?: boolean
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
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export function TransactionsTable({
  transactions,
  users = [],
  onAdd,
  onEdit,
  onDelete,
  onFilterChange,
  showActions = false,
  showUserColumns = false
}: TransactionsTableProps) {

  const [typeFilter, setTypeFilter] = useState<TransactionType | "ALL">("ALL")
  const [categoryFilter, setCategoryFilter] = useState<Category | "ALL">("ALL")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const userMap = useMemo(() => {
    const map = new Map<string, User>()
    users.forEach(user => map.set(user.id, user))
    return map
  }, [users])

  const triggerFilters = (override: any = {}) => {
    onFilterChange?.({
      type: typeFilter === "ALL" ? undefined : typeFilter,
      category: categoryFilter === "ALL" ? undefined : categoryFilter,
      search,
      sort,
      startDate,
      endDate,
      ...override
    })
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setDetailsOpen(true)
  }

  const categories: Category[] = [
    "TRANSFERS","DINING","GROCERIES","TRANSPORT","SHOPPING",
    "SERVICES","ENTERTAINMENT","SUBSCRIPTION","TRAVEL","SALARY","RENT"
  ]

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <CardTitle>Transactions</CardTitle>

            <div className="flex flex-wrap gap-2">

              {/* SEARCH */}
              <input
                placeholder="Search..."
                className="border px-2 py-1 rounded"
                onChange={(e) => {
                  setSearch(e.target.value)
                  triggerFilters({ search: e.target.value })
                }}
              />

              {/* TYPE */}
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value as any)
                  triggerFilters({ type: value === "ALL" ? undefined : value })
                }}
              >
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="INCOME">Income</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>

              {/* CATEGORY */}
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value as any)
                  triggerFilters({ category: value === "ALL" ? undefined : value })
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* SORT */}
              <Select
                onValueChange={(value) => {
                  setSort(value)
                  triggerFilters({ sort: value })
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date,desc">Latest</SelectItem>
                  <SelectItem value="date,asc">Oldest</SelectItem>
                  <SelectItem value="amount,desc">High → Low</SelectItem>
                  <SelectItem value="amount,asc">Low → High</SelectItem>
                </SelectContent>
              </Select>

              {/* DATE RANGE */}
              <input
                type="date"
                onChange={(e) => {
                  setStartDate(e.target.value)
                  triggerFilters({ startDate: e.target.value })
                }}
              />

              <input
                type="date"
                onChange={(e) => {
                  setEndDate(e.target.value)
                  triggerFilters({ endDate: e.target.value })
                }}
              />

              {showActions && onAdd && (
                <Button onClick={onAdd}>
                  <Plus className="size-4 mr-1" />
                  Add
                </Button>
              )}

            </div>
          </div>
        </CardHeader>

        <CardContent>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Receipt className="size-8 text-gray-400 mb-2" />
              <Empty title="No transactions found" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>

                  {showUserColumns && (
                    <>
                      <TableHead>User ID</TableHead>
                      <TableHead>Email</TableHead>
                    </>
                  )}

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {transactions.map((t) => {
                  const user = userMap.get(t.userId)

                  return (
                    <TableRow key={t.id} onClick={() => handleRowClick(t)}>
                      <TableCell>{formatCurrency(t.amount)}</TableCell>
                      <TableCell>
                        <Badge>{t.type}</Badge>
                      </TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>{formatDate(t.date)}</TableCell>

                      {showUserColumns && (
                        <>
                          <TableCell>{t.userId}</TableCell>
                          <TableCell>{user?.email}</TableCell>
                        </>
                      )}

                      <TableCell className="text-right">
                        <Button size="icon-sm" onClick={(e)=>{e.stopPropagation();handleRowClick(t)}}><Eye size={16}/></Button>
                        {showActions && (
                          <>
                            <Button size="icon-sm" onClick={(e)=>{e.stopPropagation();onEdit?.(t)}}><Pencil size={16}/></Button>
                            <Button size="icon-sm" onClick={(e)=>{e.stopPropagation();onDelete?.(t.id)}}><Trash2 size={16}/></Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TransactionDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        transaction={selectedTransaction}
        user={selectedTransaction ? userMap.get(selectedTransaction.userId) : null}
        showUserInfo={showUserColumns}
      />
    </>
  )
}