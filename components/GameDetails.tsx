"use client"

import { useState } from "react"
import type { Game } from "../types/game"
import { Button } from "@/components/ui/button"
import { Heart, Download, Share2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GameComments from "./GameComments"

interface GameDetailsProps {
  game: Game
  isFavorite: boolean
  toggleFavorite: () => void
}

export default function GameDetails({ game, isFavorite, toggleFavorite }: GameDetailsProps) {
  const [activeTab, setActiveTab] = useState("description")

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
    <div className="bg-black/20 rounded-xl overflow-hidden border border-white/10">
      {/* 游戏封面 */}
      <div className="relative h-[300px] md:h-[400px]">
        <img src={game.imageUrl || "/placeholder.svg"} alt={game.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* 游戏标题和评分 */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{game.title}</h1>
              <div className="flex items-center mb-2">
                <div className="flex text-lg">{renderStars(game.rating)}</div>
                <span className="ml-2 text-white/70">{game.rating.toFixed(1)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {game.categories.map((category, index) => (
                  <span key={index} className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded">
                    {category}
                  </span>
                ))}
                <span className="inline-block px-2 py-0.5 bg-white/10 text-white/70 text-xs rounded">
                  {game.platform}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 relative mb-2">
                <img
                  src={game.iconUrl || "/placeholder.svg?height=64&width=64"}
                  alt={`${game.title} icon`}
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏详情 */}
      <div className="p-6">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            className="flex-1 bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white"
            onClick={() => window.open(game.downloadUrl, "_blank")}
          >
            <Download className="mr-2 h-4 w-4" /> 下载游戏
          </Button>
          <Button
            variant="outline"
            className={`flex-1 ${isFavorite ? "bg-[#ff6b4a]/10 text-[#ff6b4a] border-[#ff6b4a]/30" : "text-white/70 border-white/10"}`}
            onClick={toggleFavorite}
          >
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-[#ff6b4a]" : ""}`} />
            {isFavorite ? "取消收藏" : "收藏游戏"}
          </Button>
          <Button variant="outline" className="flex-1 text-white/70 border-white/10">
            <Share2 className="mr-2 h-4 w-4" /> 分享
          </Button>
        </div>

        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 bg-black/20 border border-white/10">
            <TabsTrigger
              value="description"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              游戏介绍
            </TabsTrigger>
            <TabsTrigger
              value="screenshots"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              游戏截图
            </TabsTrigger>
            <TabsTrigger
              value="requirements"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              系统需求
            </TabsTrigger>
            <TabsTrigger
              value="comments"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              用户评论
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-0">
            <div className="text-white/80 space-y-4">
              <p>{game.description}</p>
              <p>{game.longDescription}</p>
            </div>
          </TabsContent>

          <TabsContent value="screenshots" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.screenshots?.map((screenshot, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={screenshot || "/placeholder.svg"}
                    alt={`${game.title} screenshot ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white mb-2">最低配置</h3>
                <div className="space-y-1 text-white/70">
                  <p>
                    <span className="text-white/50">操作系统:</span> {game.requirements?.minimum.os}
                  </p>
                  <p>
                    <span className="text-white/50">处理器:</span> {game.requirements?.minimum.processor}
                  </p>
                  <p>
                    <span className="text-white/50">内存:</span> {game.requirements?.minimum.memory}
                  </p>
                  <p>
                    <span className="text-white/50">显卡:</span> {game.requirements?.minimum.graphics}
                  </p>
                  <p>
                    <span className="text-white/50">存储空间:</span> {game.requirements?.minimum.storage}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white mb-2">推荐配置</h3>
                <div className="space-y-1 text-white/70">
                  <p>
                    <span className="text-white/50">操作系统:</span> {game.requirements?.recommended.os}
                  </p>
                  <p>
                    <span className="text-white/50">处理器:</span> {game.requirements?.recommended.processor}
                  </p>
                  <p>
                    <span className="text-white/50">内存:</span> {game.requirements?.recommended.memory}
                  </p>
                  <p>
                    <span className="text-white/50">显卡:</span> {game.requirements?.recommended.graphics}
                  </p>
                  <p>
                    <span className="text-white/50">存储空间:</span> {game.requirements?.recommended.storage}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-0">
            <GameComments game={game} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
