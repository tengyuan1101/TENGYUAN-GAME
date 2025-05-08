"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
}

interface CategoryFilterProps {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

export default function CategoryFilter({ selectedCategory, setSelectedCategory }: CategoryFilterProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // 从localStorage加载分类
    if (typeof window !== "undefined") {
      const storedCategories = localStorage.getItem("gameCategories")
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories))
      } else {
        // 默认分类
        const defaultCategories = [
          { id: "1", name: "动作", slug: "action", color: "#ff6b4a" },
          { id: "2", name: "角色扮演", slug: "rpg", color: "#3b82f6" },
          { id: "3", name: "射击", slug: "shooter", color: "#10b981" },
          { id: "4", name: "策略", slug: "strategy", color: "#f59e0b" },
          { id: "5", name: "冒险", slug: "adventure", color: "#8b5cf6" },
        ]
        setCategories(defaultCategories)
      }
    }
  }, [])

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
              : "border-white/10 text-white/70 hover:text-white hover:bg-white/5"
          }
        >
          全部
        </Button>

        {categories.map((category) => (
          <Button
            key={category.slug}
            variant={selectedCategory === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.slug)}
            className={
              selectedCategory === category.slug
                ? `bg-[${category.color || "#ff6b4a"}]/20 text-[${
                    category.color || "#ff6b4a"
                  }] border-[${category.color || "#ff6b4a"}]/30 hover:bg-[${category.color || "#ff6b4a"}]/30`
                : "border-white/10 text-white/70 hover:text-white hover:bg-white/5"
            }
            style={
              selectedCategory === category.slug
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
