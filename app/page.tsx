"use client"

import { useState, useEffect } from "react"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import GameLayout from "../components/GameLayout"
import GameSearch from "../components/GameSearch"
import CategoryFilter from "../components/CategoryFilter"
import GameDetails from "../components/GameDetails"
import FeaturedGames from "../components/FeaturedGames"
import NewReleases from "../components/NewReleases"
import TopGames from "../components/TopGames"
import { useMediaQuery } from "../hooks/use-media-query"
import type { Game } from "../types/game"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search, X, User, LogOut } from "lucide-react"
import CarouselBanner from "../components/CarouselBanner"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ContactSupport } from "../components/contact-support"
import { Footer } from "../components/footer"
import { Logo } from "@/components/logo"
import { useSiteData } from "@/context/SiteDataContext"

export default function Home() {
  const { games: contextGames, settings } = useSiteData()
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [favoriteGames, setFavoriteGames] = useState<number[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showSearch, setShowSearch] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  // 加载游戏数据
  useEffect(() => {
    if (contextGames.length > 0) {
      setGames(contextGames)
      setFilteredGames(contextGames)
    }
  }, [contextGames])

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("userLoggedIn") === "true"
      setIsLoggedIn(loggedIn)

      if (loggedIn) {
        const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
        setCurrentUser(user)

        // 如果用户已登录，使用用户的收藏列表
        if (user && user.favorites) {
          setFavoriteGames(user.favorites)
        }
      } else {
        // 如果未登录，使用本地存储的收藏列表
        const savedFavorites = localStorage.getItem("favoriteGames")
        if (savedFavorites) {
          setFavoriteGames(JSON.parse(savedFavorites))
        }
      }
    }
  }, [])

  // 保存收藏的游戏
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn && currentUser) {
        // 如果用户已登录，更新用户的收藏列表
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const updatedUsers = users.map((user: any) => {
          if (user.id === currentUser.id) {
            return { ...user, favorites: favoriteGames }
          }
          return user
        })
        localStorage.setItem("users", JSON.stringify(updatedUsers))

        // 更新当前用户信息
        setCurrentUser({ ...currentUser, favorites: favoriteGames })
        localStorage.setItem("currentUser", JSON.stringify({ ...currentUser, favorites: favoriteGames }))
      } else {
        // 如果未登录，保存到本地存储
        localStorage.setItem("favoriteGames", JSON.stringify(favoriteGames))
      }
    }
  }, [favoriteGames, isLoggedIn, currentUser])

  // 过滤游戏
  useEffect(() => {
    let result = [...games]

    // 分类过滤
    if (selectedCategory !== "all") {
      result = result.filter((game) => game.categories.includes(selectedCategory))
    }

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (game) => game.title.toLowerCase().includes(query) || game.description.toLowerCase().includes(query),
      )
    }

    // 收藏过滤
    if (showFavorites) {
      result = result.filter((game) => favoriteGames.includes(game.id))
    }

    setFilteredGames(result)
  }, [selectedCategory, searchQuery, showFavorites, favoriteGames, games])

  const toggleFavorite = (gameId: number) => {
    setFavoriteGames((prev) => {
      if (prev.includes(gameId)) {
        return prev.filter((id) => id !== gameId)
      } else {
        return [...prev, gameId]
      }
    })
  }

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game)
  }

  const closeGameDetails = () => {
    setSelectedGame(null)
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("userLoggedIn")
      localStorage.removeItem("currentUser")
      setIsLoggedIn(false)
      setCurrentUser(null)

      // 记录登出日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户登出",
        username: currentUser?.username || "未知用户",
        timestamp: new Date().toISOString(),
        details: "用户登出",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      // 重新加载页面以刷新状态
      window.location.reload()
    }
  }

  // 检查当前网站是否处于维护模式
  useEffect(() => {
    if (settings?.maintenanceMode && typeof window !== "undefined") {
      const isAdmin = localStorage.getItem("adminLoggedIn") === "true"
      if (!isAdmin) {
        // 如果不是管理员用户，显示维护页面
        document.body.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(to bottom, #0a0a14, #141428); color: white; flex-direction: column; padding: 20px; text-align: center;">
            <h1 style="font-size: 2rem; margin-bottom: 1rem;">网站维护中</h1>
            <p style="max-width: 500px; line-height: 1.6;">${settings.maintenanceMessage || "我们正在进行网站维护，请稍后再试。"}</p>
          </div>
        `
      }
    }
  }, [settings])

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#141428] ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Logo />
          </div>

          <div className="flex items-center space-x-2">
            {isMobile ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-white/70 hover:text-white dark:text-white/70 dark:hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`${showFavorites ? "text-[#ff6b4a]" : "text-white/70 hover:text-white dark:text-white/70 dark:hover:text-white"}`}
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <ThemeToggle />
              </>
            ) : (
              <>
                <GameSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`ml-2 ${showFavorites ? "bg-[#ff6b4a]/20 text-[#ff6b4a] border-[#ff6b4a]/30" : "text-white/70 dark:text-white/70"}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${showFavorites ? "fill-[#ff6b4a]" : ""}`} />
                  {showFavorites ? "已收藏" : "收藏"}
                </Button>
                <ThemeToggle />
              </>
            )}

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-[#ff6b4a]/20 text-[#ff6b4a]">
                    {currentUser?.username?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black"
                >
                  <div className="px-2 py-1.5 text-sm font-medium">{currentUser?.username}</div>
                  <DropdownMenuSeparator className="bg-white/10 dark:bg-black/10" />
                  <DropdownMenuItem
                    className="hover:bg-white/10 cursor-pointer dark:hover:bg-black/10"
                    onClick={() => router.push("/profile")}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>个人中心</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-white/10 cursor-pointer dark:hover:bg-black/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="border-[#ff6b4a]/30 text-[#ff6b4a] hover:bg-[#ff6b4a]/10"
              >
                <Link href="/login">登录</Link>
              </Button>
            )}
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isMobile && showSearch && (
          <div className="px-4 py-2 bg-black/40 dark:bg-white/10">
            <GameSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} fullWidth />
          </div>
        )}

        {/* 分类过滤 */}
        <div className="container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
      </header>

      {/* 轮播图 */}
      {!selectedGame && !isMobile && (
        <div className="container mx-auto px-4 pt-6">
          <CarouselBanner />
        </div>
      )}

      <main className="container mx-auto px-4 py-6">
        {/* 游戏详情页 */}
        {selectedGame ? (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeGameDetails}
              className="absolute top-0 right-0 z-10 text-white/70 hover:text-white dark:text-white/70 dark:hover:text-white"
            >
              <X className="h-6 w-6" />
            </Button>
            <GameDetails
              game={selectedGame}
              isFavorite={favoriteGames.includes(selectedGame.id)}
              toggleFavorite={() => toggleFavorite(selectedGame.id)}
            />
          </div>
        ) : (
          <>
            {/* 主要内容区域 */}
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-black/20 border border-white/10 dark:bg-white/20 dark:border-black/10">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                >
                  全部游戏
                </TabsTrigger>
                <TabsTrigger
                  value="featured"
                  className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                >
                  推荐游戏
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                >
                  新游预告
                </TabsTrigger>
                <TabsTrigger
                  value="top"
                  className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                >
                  游戏排行
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                <GameLayout
                  games={filteredGames}
                  onGameSelect={handleGameSelect}
                  favoriteGames={favoriteGames}
                  toggleFavorite={toggleFavorite}
                />
              </TabsContent>

              <TabsContent value="featured" className="mt-0">
                <FeaturedGames
                  onGameSelect={handleGameSelect}
                  favoriteGames={favoriteGames}
                  toggleFavorite={toggleFavorite}
                />
              </TabsContent>

              <TabsContent value="new" className="mt-0">
                <NewReleases
                  onGameSelect={handleGameSelect}
                  favoriteGames={favoriteGames}
                  toggleFavorite={toggleFavorite}
                />
              </TabsContent>

              <TabsContent value="top" className="mt-0">
                <TopGames
                  onGameSelect={handleGameSelect}
                  favoriteGames={favoriteGames}
                  toggleFavorite={toggleFavorite}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* 替换原有的footer元素 */}
      <Footer />

      {/* 在末尾添加联系客服按钮 */}
      <ContactSupport />
    </div>
  )
}
