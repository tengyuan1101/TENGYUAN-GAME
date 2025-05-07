"use client"

import { useState } from "react"
import type { Game } from "../types/game"
import { newReleases } from "../data/games"
import { motion } from "framer-motion"
import { Calendar } from "lucide-react"

interface NewReleasesProps {
  onGameSelect: (game: Game) => void
  favoriteGames: number[]
  toggleFavorite: (gameId: number) => void
}

export default function NewReleases({ onGameSelect, favoriteGames, toggleFavorite }: NewReleasesProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">即将发布</h2>
        <div className="text-white/50 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>预计发布日期</span>
        </div>
      </div>

      <div className="space-y-6">
        {newReleases.map((game, index) => (
          <motion.div
            key={game.id}
            className="bg-black/20 rounded-lg overflow-hidden border border-white/10"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="flex flex-col md:flex-row">
              <div
                className="w-full md:w-1/3 h-48 md:h-auto relative cursor-pointer"
                onClick={() => onGameSelect(game)}
              >
                {hovered === index ? (
                  <video src={game.videoUrl} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                ) : (
                  <img
                    src={game.imageUrl || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className="text-xl font-bold text-white hover:text-[#ff6b4a] cursor-pointer"
                      onClick={() => onGameSelect(game)}
                    >
                      {game.title}
                    </h3>
                    <button
                      className={`p-2 rounded-full ${favoriteGames.includes(game.id) ? "bg-[#ff6b4a]/20 text-[#ff6b4a]" : "bg-black/30 text-white/70 hover:text-white"}`}
                      onClick={() => toggleFavorite(game.id)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    {game.categories.slice(0, 3).map((category, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2 mb-4">{game.description}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-white/50 text-sm">
                    <span className="text-[#ff6b4a] font-medium">{game.releaseDate}</span> 发布
                  </div>
                  <div className="text-white/70 text-sm">
                    平台: <span className="text-white">{game.platform}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
