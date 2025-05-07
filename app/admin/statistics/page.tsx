"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, Users, GamepadIcon, MessageSquare, Eye, Clock } from "lucide-react"
import { allGames } from "@/data/games"

// Mock data for charts
const generateMockData = (days: number, min: number, max: number) => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return {
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    }
  })
}

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [activeTab, setActiveTab] = useState("overview")
  
  // Mock statistics data
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 78,
    totalGames: allGames.length,
    totalComments: 45,
    totalViews: 12458,
    averageSessionTime: "8:24",
    topGames: [
      { id: 5, title: "艾尔登法环", views: 1245, downloads: 89 },
      { id: 1, title: "无畏契约", views: 987, downloads: 76 },
      { id: 2, title: "赛博朋克2077", views: 876, downloads: 65 },
      { id: 7, title: "怪物猎人世界", views: 765, downloads: 54 },
      { id: 8, title: "只狼：影逝二度", views: 654, downloads: 43 },
    ],
    userGrowth: generateMockData(30, 1, 10),
    pageViews: generateMockData(30, 100, 500),
    gameDownloads: generateMockData(30, 5, 30),
    commentActivity: generateMockData(30, 0, 15),
  })

  // Filter data based on time range
  const getFilteredData = (data: any[]) => {
    let days = 7
    switch (timeRange) {
      case "today":
        days = 1
        break
      case "7days":
        days = 7
        break
      case "30days":
        days = 30
        break
      case "90days":
        days = 90
        break
    }
    return data.slice(-days)
  }

  // Calculate growth percentage
  const calculateGrowth = (data: any[], property = "value") => {
    if (data.length < 2) return 0
    const current = data[data.length - 1][property]
    const previous = data[data.length - 2][property]
    return previous === 0 ? 100 : ((current - previous) / previous) * 100
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
    })
  }

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
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            用户分析
          </TabsTrigger>
          <TabsTrigger
            value="games"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
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
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-white/50 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  较上月增长 8.3%
                </p>
              </CardContent>
            </Card>

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
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-white/50 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  较上周增长 15.2%
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">用户增长趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end space-x-2">
                  {getFilteredData(stats.userGrowth).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#ff6b4a]/60 hover:bg-[#ff6b4a] rounded-t transition-all duration-200"
                        style={{ height: `${(item.value / 10) * 200}px` }}
                      ></div>
                      <div className="text-xs text-white/50 mt-2">{formatDate(item.date)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">热门游戏</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topGames.map((game, index) => (
                    <div key={game.id} className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#ff6b4a]/20 rounded-full text-[#ff6b4a] font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{game.title}</h3>
                          <span className="text-white/70 text-sm">{game.views} 浏览</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                          <div
                            className="h-full bg-[#ff6b4a] rounded-full"
                            style={{ width: `${(game.views / stats.topGames[0].views) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">网站活跃度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">平均会话时长</span>
                      <div className="flex items-center text-[#ff6b4a]">
                        <Clock className="h-4 w-4 mr-1" />
                        {stats.averageSessionTime}
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-[#ff6b4a] rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">活跃用户比例</span>
                      <div className="text-[#ff6b4a]">
                        {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-[#ff6b4a] rounded-full"
                        style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">评论互动率</span>
                      <div className="text-[#ff6b4a]">
                        {Math.round((stats.totalComments / stats.totalViews) * 1000) / 10}%
                      </div>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div
                        className="h-full bg-[#ff6b4a] rounded-full"
                        style={{ width: `${(stats.totalComments / stats.totalViews) * 1000}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">用户增长</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end space-x-2">
                  {getFilteredData(stats.userGrowth).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#ff6b4a]/60 hover:bg-[#ff6b4a] rounded-t transition-all duration-200"
                        style={{ height: `${(item.value / 10) * 200}px` }}
                      ></div>
                      <div className="text-xs text-white/50 mt-2">{formatDate(item.date)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">用户分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">普通用户</span>
                      <span className="text-white">120 (76.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-white/40 rounded-full" style={{ width: "76.9%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">VIP会员</span>
                      <span className="text-[#ff6b4a]">25 (16.0%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-[#ff6b4a] rounded-full" style={{ width: "16%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">版主</span>
                      <span className="text-blue-400">8 (5.1%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: "5.1%" }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">管理员</span>
                      <span className="text-purple-400">3 (1.9%)</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: "1.9%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">用户活跃度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-[#ff6b4a]">78</div>
                    <div className="text-white/70 mt-1">日活跃用户</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-[#ff6b4a]">112</div>
                    <div className="text-white/70 mt-1">周活跃用户</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-[#ff6b4a]">135</div>
                    <div className="text-white/70 mt-1">月活跃用户</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-[#ff6b4a]">8.4</div>
                    <div className="text-white/70 mt-1">平均在线时长 (分钟)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Games Tab */}
        <TabsContent value="games" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">游戏浏览量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end space-x-2">
                  {getFilteredData(stats.pageViews).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-[#ff6b4a]/60 hover:bg-[#ff6b4a] rounded-t transition-all duration-200"
                        style={{ height: `${(item.value / 500) * 200}px` }}
                      ></div>
                      <div className="text-xs text-white/50 mt-2">{formatDate(item.date)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">游戏下载量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-end space-x-2">
                  {getFilteredData(stats.gameDownloads).map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-400/60 hover:bg-blue-400 rounded-t transition-all duration-200"
                        style={{ height: `${(item.value / 30) * 200}px` }}
                      ></div>
                      <div className="text-xs text-white/50 mt-2">{formatDate(item.date)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-lg">热门游戏排行</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topGames.map((game, index) => (
                    <div key={game.id} className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center bg-[#ff6b4a]/20 rounded-full text-[#ff6b4a] font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{game.title}</h3>
                          <div className="flex items-center space-x-4">
                            <span className="text-white/70 text-sm">{game.views} 浏览</span>
                            <span className="text-blue-400 text-sm">{game.downloads} 下载</span>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                          <div
                            className="h-full bg-[#ff6b4a] rounded-full"
                            style={{ width: `${(game.views / stats.topGames[0].views) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value\
