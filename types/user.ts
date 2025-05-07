export type UserRole = "admin" | "moderator" | "vip" | "user"

export interface User {
  id: number
  username: string
  email: string
  password: string // In a real app, this would be hashed
  role: UserRole
  status: "active" | "pending" | "blocked"
  registrationDate: string
  lastLogin: string
  avatar: string
  bio?: string
  permissions: string[]
  favoriteGames: number[]
  phoneNumber?: string
}
