"use client"

import { useState } from "react"
import type { Game } from "@/types/game"
import { Button } from "@/components/ui/button"
import { Heart, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface AnimatedGameCardProps {
  game: Game
  isFavorite: boolean
  toggleFavorite: () => void
  onSelect: () => void
}

export default function AnimatedGameCard({ game, isFavorite, toggleFavorite, onSelect }: AnimatedGameCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // 渲染星级评分
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-[#ff6b4a]">
          ★
        </span>,
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-[#ff6b4a]">
          ★
        </span>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-500">
          ★
        </span>,
      )
    }

    return stars
  }

  return (
    <motion.div
      className="relative w-full h-full overflow-hidden rounded-lg glassmorphism card-hover cursor-pointer group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* 背景图片 */}
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
        <img src={game.imageUrl || "/placeholder.svg"} alt={game.title} className="w-full h-full object-cover" />
      </div>

      {/* 视频 */}
      {isHovered && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <video src={game.videoUrl} className="w-full h-full object-cover" loop muted autoPlay playsInline />
        </div>
      )}

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* 收藏按钮 */}
      <motion.button
        className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
          isFavorite ? "bg-[#ff6b4a]/20 text-[#ff6b4a]" : "bg-black/30 text-white/70 hover:text-white"
        }`}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite()
        }}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#ff6b4a]" : ""}`} />
      </motion.button>

      {/* 游戏信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-500 group-hover:translate-y-0 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-[#ff6b4a] transition-colors">
            {game.title}
          </h3>
          <div className="flex items-center mb-2">
            <div className="flex">{renderStars(game.rating)}</div>
            <span className="ml-2 text-white/70 text-sm">{game.rating.toFixed(1)}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {game.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            <span className="inline-block px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded-full">
              {game.platform}
            </span>
          </div>
          <p className="text-white/70 text-sm line-clamp-2 mb-4 transition-all duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
            {game.description}
          </p>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-y-4 group-hover:translate-y-0 transform transition-transform">
            <Button
              onClick={onSelect}
              className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white button-glow text-sm py-1 h-auto"
              size="sm"
            >
              查看详情
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                window.open(game.downloadUrl, "_blank")
              }}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/10 text-sm py-1 h-auto"
              size="sm"
            >
              <ExternalLink className="h-3 w-3 mr-1" /> 官网
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
