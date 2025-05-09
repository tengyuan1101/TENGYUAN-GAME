"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useSiteData } from "@/context/SiteDataContext"

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const { games } = useSiteData()
  const [categories, setCategories] = useState<string[]>([])

  // 从游戏数据中提取所有唯一的分类
  useEffect(() => {
    if (games.length > 0) {
      const allCategories = games.flatMap((game) => game.categories)
      const uniqueCategories = Array.from(new Set(allCategories)).sort()
      setCategories(uniqueCategories)
    }
  }, [games])

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={selectedCategory === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setSelectedCategory("all")}
        className={
          selectedCategory === "all"
            ? "bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
            : "text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
        }
      >
        全部
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(category)}
          className={
            selectedCategory === category
              ? "bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              : "text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
          }
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
