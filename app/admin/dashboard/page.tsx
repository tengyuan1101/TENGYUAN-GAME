"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GamepadIcon, MessageSquare, Users, TrendingUp, Eye, ThumbsUp } from "lucide-react"
import { allGames } from "@/data/games"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalGames: 0,
    totalComments: 0,
    totalUsers: 0,
    pendingComments: 0,
    views: 0,
    likes: 0,
  })

  useEffect(() => {
    // 在实际应用中，这些数据应该从API获取
    // 这里我们使用模拟数据
    const comments = JSON.parse(localStorage.getItem("gameComments") || "[]")

    setStats({
      totalGames: allGames.length,
      totalComments: comments.length,
      totalUsers: 156,
      pendingComments: comments.filter((c) => !c.approved).length,
      views: 12458,
      likes: 3267,
    })
  }, [])

  // 最近添加的游戏
  const recentGames = allGames.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">控制面板</h1>
        <p className="text-sm text-white/50">
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">游戏总数</CardTitle>
            <GamepadIcon className="h-4 w-4 text-[#ff6b4a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGames}</div>
            <p className="text-xs text-white/50 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              较上月增加 3 款游戏
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">评论总数</CardTitle>
            <MessageSquare className="h-4 w-4 text-[#ff6b4a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-white/50 mt-1">
              <span className="text-yellow-500">待审核: {stats.pendingComments}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">注册用户</CardTitle>
            <Users className="h-4 w-4 text-[#ff6b4a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-white/50 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              本周新增 12 名用户
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">总浏览量</CardTitle>
            <Eye className="h-4 w-4 text-[#ff6b4a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
            <p className="text-xs text-white/50 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              较上周增长 8.3%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">总收藏数</CardTitle>
            <ThumbsUp className="h-4 w-4 text-[#ff6b4a]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.likes.toLocaleString()}</div>
            <p className="text-xs text-white/50 mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              较上月增长 12.5%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近添加的游戏 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">最近添加的游戏</h2>
        <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/70">游戏名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/70">分类</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/70">平台</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/70">评分</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-white/70">添加日期</th>
                </tr>
              </thead>
              <tbody>
                {recentGames.map((game) => (
                  <tr key={game.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded overflow-hidden mr-2">
                          <img
                            src={game.imageUrl || "/placeholder.svg"}
                            alt={game.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span>{game.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{game.categories[0]}</td>
                    <td className="px-4 py-3 text-white/70">{game.platform}</td>
                    <td className="px-4 py-3">
                      <span className="text-[#ff6b4a]">★ {game.rating.toFixed(1)}</span>
                    </td>
                    <td className="px-4 py-3 text-white/70">2023-05-15</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
