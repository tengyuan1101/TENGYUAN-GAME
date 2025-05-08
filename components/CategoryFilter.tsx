"use client"

import { useState, useEffect } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { allGames } from "../data/games"

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  count?: number
  color?: string
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const [showCategoryGames, setShowCategoryGames] = useState(false)
  const [categories, setCategories] = useState<Category[]>([
    { id: "all", name: "全部", slug: "all" },
    { id: "action", name: "动作", slug: "action", color: "#ff6b4a" },
    { id: "adventure", name: "冒险", slug: "adventure", color: "#3b82f6" },
    { id: "rpg", name: "角色扮演", slug: "rpg", color: "#10b981" },
    { id: "strategy", name: "策略", slug: "strategy", color: "#f59e0b" },
    { id: "simulation", name: "模拟", slug: "simulation", color: "#8b5cf6" },
    { id: "sports", name: "体育", slug: "sports", color: "#ec4899" },
    { id: "racing", name: "竞速", slug: "racing", color: "#14b8a6" },
    { id: "shooter", name: "射击", slug: "shooter", color: "#f43f5e" },
    { id: "puzzle", name: "解谜", slug: "puzzle", color: "#0ea5e9" },
    { id: "indie", name: "独立", slug: "indie", color: "#d946ef" },
    { id: "mmo", name: "多人在线", slug: "mmo", color: "#84cc16" },
  ])

  useEffect(() => {
    // 尝试从存储中获取分类信息
    try {
      const storedCategories = localStorage.getItem("gameCategories")
      if (storedCategories) {
        const parsedCategories = JSON.parse(storedCategories)
        // 确保"全部"分类始终存在
        const allCategory = { id: "all", name: "全部", slug: "all" }
        setCategories([allCategory, ...parsedCategories])
      }
    } catch (error) {
      console.error("加载分类失败:", error)
    }
  }, [])

  // 获取每个分类的游戏数量
  const getCategoryGameCount = (categoryId: string) => {
    if (categoryId === "all") return allGames.length
    return allGames.filter((game) => game.categories.includes(categoryId)).length
  }

  // 获取当前分类的游戏
  const getCategoryGames = () => {
    if (selectedCategory === "all") return allGames.slice(0, 4)
    return allGames.filter((game) => game.categories.includes(selectedCategory)).slice(0, 4)
  }

  const categoryGames = getCategoryGames()

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(category.id)
                setShowCategoryGames(true)
              }}
              className={
                selectedCategory === category.id
                  ? `${category.id === "all" ? "bg-[#ff6b4a]" : `bg-[${category.color || "#ff6b4a"}]`} hover:bg-opacity-90 text-white`
                  : "bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/5"
              }
              style={
                selectedCategory === category.id && category.id !== "all"
                  ? { backgroundColor: category.color || "#ff6b4a" }
                  : {}
              }
            >
              {category.name} ({getCategoryGameCount(category.id)})
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>

      {/* 显示当前分类的游戏预览 */}
      {showCategoryGames && categoryGames.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pb-4">
          {categoryGames.map((game) => (
            <div key={game.id} className="relative group overflow-hidden rounded-lg">
              <img
                src={game.imageUrl || "/placeholder.svg"}
                alt={game.title}
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 p-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-sm font-medium text-white truncate">{game.title}</h3>
                <div className="flex items-center mt-1">
                  <span className="text-[#ff6b4a] text-xs">★ {game.rating.toFixed(1)}</span>
                  <span className="text-white/70 text-xs ml-2">{game.platform}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
