"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Game } from "@/types/game"

interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  footerText: string
  icp: string
  contactEmail: string
  enableRegistration: boolean
  enableComments: boolean
  enableDarkMode: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
}

interface GameCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
  color?: string
}

interface SiteDataContextType {
  settings: SiteSettings
  updateSettings: (newSettings: SiteSettings) => void
  games: Game[]
  updateGames: (newGames: Game[]) => void
  categories: GameCategory[]
  updateCategories: (newCategories: GameCategory[]) => void
  refreshData: () => void
  isLoading: boolean
}

const defaultSettings: SiteSettings = {
  siteName: "藤原の游戏小站",
  siteDescription: "发现最新最热门的游戏，加入我们的游戏社区",
  logo: "/logo.png",
  footerText: "© 2023 藤原の游戏小站. 保留所有权利。",
  icp: "京ICP备XXXXXXXX号",
  contactEmail: "contact@example.com",
  enableRegistration: true,
  enableComments: true,
  enableDarkMode: true,
  maintenanceMode: false,
  maintenanceMessage: "网站正在维护中，请稍后再试。",
}

const SiteDataContext = createContext<SiteDataContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  games: [],
  updateGames: () => {},
  categories: [],
  updateCategories: () => {},
  refreshData: () => {},
  isLoading: true,
})

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [games, setGames] = useState<Game[]>([])
  const [categories, setCategories] = useState<GameCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 修改refreshData函数，确保数据更新时正确触发重新渲染
  const refreshData = () => {
    setIsLoading(true)

    // 加载设置
    const storedSettings = localStorage.getItem("siteSettings")
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch (e) {
        console.error("Failed to parse site settings:", e)
        setSettings(defaultSettings)
      }
    }

    // 加载游戏
    const storedGames = localStorage.getItem("managedGames")
    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames))
      } catch (e) {
        console.error("Failed to parse games:", e)
        // 如果解析失败，使用原始数据
        import("@/data/games").then(({ allGames }) => {
          setGames(allGames)
          localStorage.setItem("managedGames", JSON.stringify(allGames))
        })
      }
    } else {
      // 如果没有存储的游戏，使用原始数据
      import("@/data/games").then(({ allGames }) => {
        setGames(allGames)
        localStorage.setItem("managedGames", JSON.stringify(allGames))
      })
    }

    // 加载分类
    const storedCategories = localStorage.getItem("gameCategories")
    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories))
      } catch (e) {
        console.error("Failed to parse categories:", e)
        setCategories([])
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    refreshData()

    // 监听存储变化
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "siteSettings") {
        refreshData()
      }
      if (e.key === "managedGames") {
        refreshData()
      }
      if (e.key === "gameCategories") {
        refreshData()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  // 修改updateSettings函数，确保设置更新后立即生效
  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings)
    localStorage.setItem("siteSettings", JSON.stringify(newSettings))

    // 记录设置修改日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "设置更新",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: "系统设置已更新",
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    // 触发存储事件，以便其他组件也能更新
    window.dispatchEvent(new Event("storage"))
  }

  // 同样修改updateGames和updateCategories函数
  const updateGames = (newGames: Game[]) => {
    setGames(newGames)
    localStorage.setItem("managedGames", JSON.stringify(newGames))

    // 记录游戏更新日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "游戏更新",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: "游戏数据已更新",
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    // 触发存储事件，以便其他组件也能更新
    window.dispatchEvent(new Event("storage"))
  }

  const updateCategories = (newCategories: GameCategory[]) => {
    setCategories(newCategories)
    localStorage.setItem("gameCategories", JSON.stringify(newCategories))

    // 记录分类更新日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "分类更新",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: "游戏分类已更新",
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    // 触发存储事件，以便其他组件也能更新
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <SiteDataContext.Provider
      value={{
        settings,
        updateSettings,
        games,
        updateGames,
        categories,
        updateCategories,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  )
}

export const useSiteData = () => useContext(SiteDataContext)
