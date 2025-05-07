"use client"

import { useState } from "react"
import type { Game } from "../types/game"
import { topGames } from "../data/games"
import { motion } from "framer-motion"
import { Trophy, TrendingUp, Users } from "lucide-react"

interface TopGamesProps {
  onGameSelect: (game: Game) => void
  favoriteGames: number[]
  toggleFavorite: (gameId: number) => void
}

export default function TopGames({ onGameSelect, favoriteGames, toggleFavorite }: TopGamesProps) {
  const [activeTab, setActiveTab] = useState("popular")

  // 根据活动标签获取游戏列表
  const getGamesList = () => {
    switch (activeTab) {
      case "trending":
        return [...topGames].sort((a, b) => b.trendingScore - a.trendingScore)
      case "rated":
        return [...topGames].sort((a, b) => b.rating - a.rating)
      case "popular":
      default:
        return topGames
    }
  }

  const games = getGamesList()

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-white/10 pb-2">
        <button
          className={`flex items-center px-4 py-2 rounded-t-lg ${activeTab === "popular" ? "text-[#ff6b4a] border-b-2 border-[#ff6b4a]" : "text-white/70 hover:text-white"}`}
          onClick={() => setActiveTab("popular")}
        >
          <Trophy className="h-4 w-4 mr-2" />
          热门游戏
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-t-lg ${activeTab === "trending" ? "text-[#ff6b4a] border-b-2 border-[#ff6b4a]" : "text-white/70 hover:text-white"}`}
          onClick={() => setActiveTab("trending")}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          趋势榜
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-t-lg ${activeTab === "rated" ? "text-[#ff6b4a] border-b-2 border-[#ff6b4a]" : "text-white/70 hover:text-white"}`}
          onClick={() => setActiveTab("rated")}
        >
          <Users className="h-4 w-4 mr-2" />
          评分榜
        </button>
      </div>

      <div className="space-y-4">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            className="bg-black/20 rounded-lg overflow-hidden border border-white/10 flex items-center"
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            transition={{ duration: 0.2 }}
            onClick={() => onGameSelect(game)}
          >
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-r from-[#ff6b4a]/20 to-transparent text-2xl font-bold text-white/70">
              {index + 1}
            </div>
            <div className="h-16 w-28 relative">
              <img src={game.imageUrl || "/placeholder.svg"} alt={game.title} className="h-full w-full object-cover" />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{game.title}</h3>
                <div className="flex items-center">
                  <div className="text-[#ff6b4a] mr-4">★ {game.rating.toFixed(1)}</div>
                  <button
                    className={`p-1.5 rounded-full ${favoriteGames.includes(game.id) ? "text-[#ff6b4a]" : "text-white/50 hover:text-white"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(game.id)
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={favoriteGames.includes(game.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center text-sm text-white/50 mt-1">
                <span className="mr-3">{game.platform}</span>
                <span>{game.categories.slice(0, 2).join(", ")}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
