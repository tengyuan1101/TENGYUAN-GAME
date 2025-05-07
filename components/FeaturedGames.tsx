"use client"

import { useState } from "react"
import type { Game } from "../types/game"
import { featuredGames } from "../data/games"
import GameCard from "./GameCard"
import { motion } from "framer-motion"

interface FeaturedGamesProps {
  onGameSelect: (game: Game) => void
  favoriteGames: number[]
  toggleFavorite: (gameId: number) => void
}

export default function FeaturedGames({ onGameSelect, favoriteGames, toggleFavorite }: FeaturedGamesProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 主推荐游戏 */}
        <div className="col-span-1 md:col-span-2 h-[400px] relative rounded-xl overflow-hidden">
          <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => onGameSelect(featuredGames[0])}
          >
            <img
              src={featuredGames[0].imageUrl || "/placeholder.svg"}
              alt={featuredGames[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex items-start">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 bg-[#ff6b4a] text-white text-sm font-medium rounded-full mb-4">
                    编辑推荐
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredGames[0].title}</h2>
                  <p className="text-white/70 text-lg mb-4 line-clamp-2 md:line-clamp-3">
                    {featuredGames[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {featuredGames[0].categories.map((category, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className={`p-3 rounded-full ${favoriteGames.includes(featuredGames[0].id) ? "bg-[#ff6b4a]/20 text-[#ff6b4a]" : "bg-black/30 text-white/70 hover:text-white"}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(featuredGames[0].id)
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={favoriteGames.includes(featuredGames[0].id) ? "currentColor" : "none"}
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
          </motion.div>
        </div>
      </div>

      {/* 其他推荐游戏 */}
      <h3 className="text-xl font-semibold text-white mb-4">更多推荐</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredGames.slice(1).map((game, index) => (
          <motion.div
            key={game.id}
            className="relative min-h-[250px]"
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <GameCard
              game={game}
              onSelect={() => onGameSelect(game)}
              isFavorite={favoriteGames.includes(game.id)}
              toggleFavorite={() => toggleFavorite(game.id)}
              isHovered={hovered === index}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
