"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface GameSearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  fullWidth?: boolean
}

export default function GameSearch({ searchQuery, setSearchQuery, fullWidth = false }: GameSearchProps) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : "w-64"}`}>
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
      <Input
        type="text"
        placeholder="搜索游戏..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8 bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-[#ff6b4a]/50 focus:ring-[#ff6b4a]/20"
      />
    </div>
  )
}
