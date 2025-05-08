export interface User {
  id: number
  username: string
  email: string
  password: string
  avatar?: string
  createdAt: string
  role: "user" | "admin"
  favorites: number[]
}
