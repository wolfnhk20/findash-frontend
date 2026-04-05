export type Role = "ADMIN" | "ANALYST" | "VIEWER"
export type UserStatus = "ACTIVE" | "INACTIVE"
export type TransactionType = "INCOME" | "EXPENSE"
export type Category =
  | "FOOD"
  | "TRAVEL"
  | "SALARY"
  | "ENTERTAINMENT"
  | "OTHER"
  | "TRANSFERS"
  | "DINING"
  | "GROCERIES"
  | "TRANSPORT"
  | "SHOPPING"
  | "SERVICES"
  | "SUBSCRIPTION"
  | "RENT"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
}

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: Category
  date: string
  description: string
  userId: string
  createdAt: string
}

export interface AuthUser {
  email: string
  role: Role
  id: string
}
