"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useSiteData } from "@/context/SiteDataContext"

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const { categories, games } = useSiteData()
  const [localCategories, setLocalCategories] = useState<any[]>([])

  // 从SiteDataContext获取分类数据
  useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories)
    } else {
      // 如果没有从SiteDataContext获取到分类，则从游戏数据中提取
      const allCategories = games.flatMap((game) => game.categories)
      const uniqueCategories = Array.from(new Set(allCategories))

      // 创建分类对象
      const categoryObjects = uniqueCategories.map((name, index) => ({
        id: (index + 1).toString(),
        name,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        description: `${name}类游戏`,
        count: games.filter((game) => game.categories.includes(name)).length,
        color: getRandomColor(),
      }))

      setLocalCategories(categoryObjects)
    }
  }, [categories, games])

  // 生成随机颜色
  function getRandomColor() {
    const colors = ["#ff6b4a", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1"]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-1">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("all")}
          className={
            selectedCategory === "all"
              ? "bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white"
              : "border-white/10 text-white/70 hover:text-white hover:bg-white/5 dark:border-black/10 dark:text-black/70 dark:hover:text-black dark:hover:bg-black/5"
          }
        >
          全部
        </Button>

        {localCategories.map((category) => (
          <Button
            key={category.slug || category.id}
            variant={selectedCategory === (category.slug || category.name) ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.slug || category.name)}
            className={
              selectedCategory === (category.slug || category.name)
                ? `bg-[${category.color || "#ff6b4a"}]/20 text-[${
                    category.color || "#ff6b4a"
                  }] border-[${category.color || "#ff6b4a"}]/30 hover:bg-[${category.color || "#ff6b4a"}]/30`
                : "border-white/10 text-white/70 hover:text-white hover:bg-white/5 dark:border-black/10 dark:text-black/70 dark:hover:text-black dark:hover:bg-black/5"
            }
            style={
              selectedCategory === (category.slug || category.name)
                ? {
                    backgroundColor: `${category.color || "#ff6b4a"}20`,
                    color: category.color || "#ff6b4a",
                    borderColor: `${category.color || "#ff6b4a"}30`,
                  }
                : {}
            }
          >
            <span
              className="w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: category.color || "#ff6b4a" }}
            ></span>
            {category.name}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
