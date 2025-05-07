"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, Users, Gamepad, MessageSquare, Eye } from "lucide-react"
import { allGames } from "@/data/games"

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock statistics data
  const totalUsers = 156
  const activeUsers = 78
  const totalGames = allGames.length
  const totalComments = 45
  const totalViews = 12458
  const averageSessionTime = "8:24"

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">数据统计</h1>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="today">今天</SelectItem>
              <SelectItem value="7days">最近7天</SelectItem>
              <SelectItem value="30days">最近30天</SelectItem>
              <SelectItem value="90days">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-white/10 text-white/70">
            <Download className="h-4 w-4 mr-2" /> 导出数据
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            总览
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            用户分析
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            游戏分析
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            内容分析
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">总用户数</CardTitle>
                <Users className="h-4 w-4 text-[#ff6b4a]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-white/50 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  较上月增长 8.3%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">游戏总数</CardTitle>
                <Gamepad className="h-4 w-4 text-[#ff6b4a]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalGames}</div>
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
                <div className="text-2xl font-bold">{totalComments}</div>
                <p className="text-xs text-white/50 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  较上月增长 12.5%
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">总浏览量</CardTitle>
                <Eye className="h-4 w-4 text-[#ff6b4a]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                <p className="text-xs text-white/50 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  较上周增长 15.2%
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
            <h2 className="text-xl font-bold mb-4">用户分析</h2>
            <p>用户分析内容将在此显示</p>
          </div>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="mt-6">
          <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
            <h2 className="text-xl font-bold mb-4">游戏分析</h2>
            <p>游戏分析内容将在此显示</p>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6">
          <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
            <h2 className="text-xl font-bold mb-4">内容分析</h2>
            <p>内容分析内容将在此显示</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
