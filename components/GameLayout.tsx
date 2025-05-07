"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import type { Game } from "../types/game"
import GameCard from "./GameCard"
import { useMediaQuery } from "../hooks/use-media-query"

interface GameLayoutProps {
  games: Game[]
  onGameSelect: (game: Game) => void
  favoriteGames: number[]
  toggleFavorite: (gameId: number) => void
}

export default function GameLayout({ games, onGameSelect, favoriteGames, toggleFavorite }: GameLayoutProps) {
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [hoverSize, setHoverSize] = useState(6)
  const [gapSize, setGapSize] = useState(8)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)")

  // 根据屏幕大小确定网格布局
  const getGridLayout = () => {
    if (isMobile) {
      return {
        columns: 1,
        rows: Math.ceil(games.length / 1),
      }
    } else if (isTablet) {
      return {
        columns: 2,
        rows: Math.ceil(games.length / 2),
      }
    } else {
      return {
        columns: 3,
        rows: Math.ceil(games.length / 3),
      }
    }
  }

  const { columns, rows } = getGridLayout()

  const getRowSizes = () => {
    if (isMobile || hovered === null) {
      return Array(rows).fill("1fr").join(" ")
    }

    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / (rows - 1)
    return Array(rows)
      .fill(0)
      .map((_, r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  const getColSizes = () => {
    if (isMobile || hovered === null) {
      return Array(columns).fill("1fr").join(" ")
    }

    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / (columns - 1)
    return Array(columns)
      .fill(0)
      .map((_, c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ")
  }

  // 如果没有游戏显示空状态
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl text-white/20 mb-4">¯\_(ツ)_/¯</div>
        <h3 className="text-xl font-semibold text-white/70 mb-2">没有找到游戏</h3>
        <p className="text-white/50 max-w-md">尝试更改搜索条件或选择不同的分类</p>
      </div>
    )
  }

  return (
    <div
      className="w-full h-full min-h-[60vh]"
      style={{
        display: "grid",
        gridTemplateRows: getRowSizes(),
        gridTemplateColumns: getColSizes(),
        gap: `${gapSize}px`,
        transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
      }}
    >
      {games.map((game, index) => {
        const row = Math.floor(index / columns)
        const col = index % columns

        return (
          <motion.div
            key={game.id}
            className="relative min-h-[200px] md:min-h-[250px]"
            style={{
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={() => !isMobile && setHovered({ row, col })}
            onMouseLeave={() => !isMobile && setHovered(null)}
          >
            <GameCard
              game={game}
              onSelect={() => onGameSelect(game)}
              isFavorite={favoriteGames.includes(game.id)}
              toggleFavorite={() => toggleFavorite(game.id)}
              isHovered={hovered?.row === row && hovered?.col === col}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
