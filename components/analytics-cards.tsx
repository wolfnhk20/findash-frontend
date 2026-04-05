"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalyticsCardsProps {
  totalIncome: number
  totalExpense: number
  netBalance: number
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function AnalyticsCards({ totalIncome, totalExpense, netBalance }: AnalyticsCardsProps) {
  const cards = [
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      trend: "Income",
      trendUp: true,
      bgClass: "bg-success/10",
      iconClass: "text-success"
    },
    {
      title: "Total Expense",
      value: totalExpense,
      icon: TrendingDown,
      trend: "Expense",
      trendUp: false,
      bgClass: "bg-destructive/10",
      iconClass: "text-destructive"
    },
    {
      title: "Net Balance",
      value: netBalance,
      icon: Wallet,
      trend: "Net Balance",
      trendUp: netBalance >= 0,
      bgClass: "bg-primary/10",
      iconClass: "text-primary"
    }
  ]

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-3xl font-bold text-foreground">
                    {formatCurrency(card.value)}
                  </p>
                  <div className="flex items-center gap-1.5">
                    {card.trendUp ? (
                      <ArrowUpRight className="size-4 text-success" />
                    ) : (
                      <ArrowDownRight className="size-4 text-destructive" />
                    )}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        card.trendUp ? "text-success" : "text-destructive"
                      )}
                    >
                      {card.trend}
                    </span>
                    <span className="text-sm text-muted-foreground"></span>
                  </div>
                </div>
                <div className={cn("rounded-xl p-3.5 shrink-0", card.bgClass)}>
                  <Icon className={cn("size-6", card.iconClass)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
