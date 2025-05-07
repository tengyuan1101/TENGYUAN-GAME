"use client"

import { useState, useRef, useEffect } from "react"
import type { Game } from "../types/game"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface GameCardProps {
  game: Game
  onSelect: () => void
  isFavorite: boolean
  toggleFavorite: () => void
  isHovered: boolean
}

export default function GameCard({ game, onSelect, isFavorite, toggleFavorite, isHovered }: GameCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 处理视频播放
  useEffect(() => {
    if (isHovered) {
      videoRef.current?.play().catch((e) => console.log("Video play prevented:", e))
      setIsPlaying(true)
    } else {
      videoRef.current?.pause()
      setIsPlaying(false)
    }
  }, [isHovered])

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
      className="relative w-full h-full overflow-hidden rounded-lg group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onClick={onSelect}
    >
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <img
          src={game.imageUrl || "/placeholder.svg"}
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 视频 */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <video ref={videoRef} src={game.videoUrl} className="w-full h-full object-cover" loop muted playsInline />
      </div>

      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      {/* 收藏按钮 */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 text-white/70 hover:text-white bg-black/30 hover:bg-black/50 rounded-full"
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite()
        }}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-[#ff6b4a] text-[#ff6b4a]" : ""}`} />
      </Button>

      {/* 游戏信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-white font-bold text-lg mb-1">{game.title}</h3>
        <div className="flex items-center mb-2">
          <div className="flex">{renderStars(game.rating)}</div>
          <span className="ml-2 text-white/70 text-sm">{game.rating.toFixed(1)}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {game.categories.slice(0, 2).map((category, index) => (
            <span key={index} className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded">
              {category}
            </span>
          ))}
          <span className="inline-block px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded">{game.platform}</span>
        </div>
        <p className="text-white/70 text-sm line-clamp-2 mb-2">{game.description}</p>
      </div>
    </motion.div>
  )
}
