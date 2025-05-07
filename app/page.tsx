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
import { allGames } from "../data/games"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search, X } from "lucide-react"
import CarouselBanner from "../components/CarouselBanner"
import { useRouter } from "next/navigation"

export default function Home() {
  const [games, setGames] = useState<Game[]>(allGames)
  const [filteredGames, setFilteredGames] = useState<Game[]>(allGames)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [favoriteGames, setFavoriteGames] = useState<number[]>([])
  const [showFavorites, setShowFavorites] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [showSearch, setShowSearch] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const router = useRouter()

  // 加载收藏的游戏
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteGames")
    if (savedFavorites) {
      setFavoriteGames(JSON.parse(savedFavorites))
    }
  }, [])

  // 保存收藏的游戏
  useEffect(() => {
    localStorage.setItem("favoriteGames", JSON.stringify(favoriteGames))
  }, [favoriteGames])

  // 过滤游戏
  useEffect(() => {
    let result = [...allGames]

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
  }, [selectedCategory, searchQuery, showFavorites, favoriteGames])

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

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#141428] ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <h1
              className={`${ppEditorialNewUltralightItalic.className} text-2xl md:text-3xl font-light italic text-[#ff6b4a]/90 tracking-tighter cursor-pointer`}
              onClick={() => router.push("/")}
            >
              藤原の游戏小站
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {isMobile ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(!showSearch)}
                  className="text-white/70 hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`${showFavorites ? "text-[#ff6b4a]" : "text-white/70 hover:text-white"}`}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <GameSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`ml-2 ${showFavorites ? "bg-[#ff6b4a]/20 text-[#ff6b4a] border-[#ff6b4a]/30" : "text-white/70"}`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${showFavorites ? "fill-[#ff6b4a]" : ""}`} />
                  {showFavorites ? "已收藏" : "收藏"}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* 移动端搜索框 */}
        {isMobile && showSearch && (
          <div className="px-4 py-2 bg-black/40">
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
              className="absolute top-0 right-0 z-10 text-white/70 hover:text-white"
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
              <TabsList className="mb-6 bg-black/20 border border-white/10">
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

      {/* 底部导航 */}
      <footer className="bg-black/30 border-t border-white/10 py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div
              className={`${ppEditorialNewUltralightItalic.className} text-xl font-light italic text-[#ff6b4a]/90 tracking-tighter mb-4 md:mb-0 cursor-pointer`}
              onClick={() => router.push("/")}
            >
              藤原の游戏小站
            </div>
            <div className="text-white/50 text-sm">© 2025 TENGYUAN.保留所有权利。</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
