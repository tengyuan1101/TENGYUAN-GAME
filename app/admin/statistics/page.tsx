"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  MessageSquare,
  GamepadIcon,
  Star,
} from "lucide-react"

interface StatsData {
  visitors: {
    today: number
    yesterday: number
    thisWeek: number
    lastWeek: number
    thisMonth: number
    lastMonth: number
    trend: number
  }
  users: {
    total: number
    new: number
    active: number
    trend: number
  }
  games: {
    total: number
    popular: string[]
    categories: {
      name: string
      count: number
    }[]
  }
  comments: {
    total: number
    pending: number
    recent: number
    trend: number
  }
  ratings: {
    average: number
    highest: {
      game: string
      rating: number
    }
  }
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })

  const fetchStats = () => {
    setIsLoading(true)

    // 模拟API调用 - 在实际应用中，这应该是一个API调用
    setTimeout(() => {
      // 获取游戏数据
      const games = JSON.parse(localStorage.getItem("managedGames") || "[]")
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const comments = JSON.parse(localStorage.getItem("gameComments") || "[]")

      // 生成模拟数据
      const mockData: StatsData = {
        visitors: {
          today: Math.floor(Math.random() * 300) + 100,
          yesterday: Math.floor(Math.random() * 300) + 100,
          thisWeek: Math.floor(Math.random() * 1500) + 500,
          lastWeek: Math.floor(Math.random() * 1500) + 500,
          thisMonth: Math.floor(Math.random() * 6000) + 2000,
          lastMonth: Math.floor(Math.random() * 6000) + 2000,
          trend: Math.floor(Math.random() * 30) - 15,
        },
        users: {
          total: users.length || Math.floor(Math.random() * 150) + 50,
          new: Math.floor(Math.random() * 20) + 5,
          active: Math.floor(Math.random() * 80) + 20,
          trend: Math.floor(Math.random() * 20),
        },
        games: {
          total: games.length || Math.floor(Math.random() * 50) + 10,
          popular: games.slice(0, 5).map((g) => g.title) || [
            "无畏契约",
            "艾尔登法环",
            "赛博朋克2077",
            "绝地求生",
            "CS:GO",
          ],
          categories: [
            { name: "动作", count: Math.floor(Math.random() * 15) + 5 },
            { name: "角色扮演", count: Math.floor(Math.random() * 12) + 3 },
            { name: "射击", count: Math.floor(Math.random() * 10) + 5 },
            { name: "冒险", count: Math.floor(Math.random() * 8) + 2 },
            { name: "策略", count: Math.floor(Math.random() * 7) + 1 },
          ],
        },
        comments: {
          total: comments.length || Math.floor(Math.random() * 200) + 50,
          pending: comments.filter((c) => !c.approved).length || Math.floor(Math.random() * 15) + 5,
          recent: Math.floor(Math.random() * 30) + 10,
          trend: Math.floor(Math.random() * 40) - 20,
        },
        ratings: {
          average: Math.random() * 1.5 + 3.5, // 3.5 - 5.0
          highest: {
            game: games.length > 0 ? games.sort((a, b) => b.rating - a.rating)[0].title : "艾尔登法环",
            rating: games.length > 0 ? games.sort((a, b) => b.rating - a.rating)[0].rating : 4.9,
          },
        },
      }

      setStats(mockData)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const formatTrend = (trend: number) => {
    if (trend > 0) {
      return (
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-4 w-4 mr-1" />
          <span>+{trend}%</span>
        </div>
      )
    } else if (trend < 0) {
      return (
        <div className="flex items-center text-red-500">
          <TrendingDown className="h-4 w-4 mr-1" />
          <span>{trend}%</span>
        </div>
      )
    } else {
      return <span className="text-white/50">0%</span>
    }
  }

  const handleExportStats = () => {
    if (!stats) return

    const dataStr = JSON.stringify(stats, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileName = `statistics_${format(new Date(), "yyyy-MM-dd")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileName)
    linkElement.click()
  }

  // 获取范围文本
  const getRangeText = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "yyyy/MM/dd")} - ${format(dateRange.to, "yyyy/MM/dd")}`
    }
    return "选择日期范围"
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">数据统计</h1>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="border-white/10 text-white/70 hover:text-white">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {getRangeText()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-black/90 border-white/10 text-white p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range)
                }}
                className="bg-black/90"
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="outline"
            onClick={handleExportStats}
            className="border-white/10 text-white/70 hover:text-white"
            disabled={!stats}
          >
            <Download className="h-4 w-4 mr-2" /> 导出数据
          </Button>
          <Button onClick={fetchStats} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90" disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} /> 刷新数据
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            总览
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            用户数据
          </TabsTrigger>
          <TabsTrigger value="games" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            游戏数据
          </TabsTrigger>
          <TabsTrigger
            value="engagement"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            互动数据
          </TabsTrigger>
        </TabsList>

        {/* 总览标签内容 */}
        <TabsContent value="overview" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-black/20 border-white/10 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                      <Eye className="h-4 w-4 mr-2 text-[#ff6b4a]" /> 今日访问
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.visitors.today.toLocaleString()}</div>
                    <p className="text-xs text-white/50 mt-1 flex items-center">
                      较昨日 {formatTrend(stats.visitors.trend)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                      <Users className="h-4 w-4 mr-2 text-[#ff6b4a]" /> 活跃用户
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.users.active}</div>
                    <p className="text-xs text-white/50 mt-1 flex items-center">新增 {stats.users.new} 用户</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                      <GamepadIcon className="h-4 w-4 mr-2 text-[#ff6b4a]" /> 游戏总数
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.games.total}</div>
                    <p className="text-xs text-white/50 mt-1">
                      {stats.games.categories
                        .map((c) => c.name)
                        .slice(0, 3)
                        .join(", ")}{" "}
                      类最受欢迎
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2 text-[#ff6b4a]" /> 评论总数
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.comments.total}</div>
                    <p className="text-xs text-white/50 mt-1 flex items-center">待审核 {stats.comments.pending} 条</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-[#ff6b4a]" /> 热门游戏
                    </CardTitle>
                    <CardDescription className="text-white/60">近30天最受欢迎的游戏</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {stats.games.popular.map((game, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-[#ff6b4a] mr-3">
                              {index + 1}
                            </div>
                            <span>{game}</span>
                          </div>
                          <div className="text-white/50 text-sm">{Math.floor(Math.random() * 1000) + 100} 访问</div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Star className="h-5 w-5 mr-2 text-[#ff6b4a]" /> 评分统计
                    </CardTitle>
                    <CardDescription className="text-white/60">网站游戏的评分数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/70">平均评分</span>
                          <span className="text-xl font-semibold text-[#ff6b4a]">
                            {stats.ratings.average.toFixed(1)}
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-[#ff6b4a] h-2 rounded-full"
                            style={{ width: `${(stats.ratings.average / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <div className="mb-2 text-white/70">评分最高的游戏</div>
                        <div className="flex items-center justify-between">
                          <span>{stats.ratings.highest.game}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-[#ff6b4a] text-[#ff6b4a] mr-1" />
                            <span>{stats.ratings.highest.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">无法加载数据，请尝试刷新。</div>
          )}
        </TabsContent>

        {/* 用户数据标签内容 */}
        <TabsContent value="users" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-black/20 border-white/10 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">注册用户总数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.users.total}</div>
                    <p className="text-sm text-white/50 mt-2">
                      <span className="text-green-500">+{stats.users.new}</span> 新用户（过去30天）
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">活跃用户</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.users.active}</div>
                    <p className="text-sm text-white/50 mt-2">
                      活跃度{" "}
                      <span className="text-[#ff6b4a]">
                        {Math.round((stats.users.active / stats.users.total) * 100)}%
                      </span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">用户增长趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold flex items-center">{formatTrend(stats.users.trend)}</div>
                    <p className="text-sm text-white/50 mt-2">与上月相比</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle>用户活动热图</CardTitle>
                  <CardDescription className="text-white/60">过去30天用户活动密度</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-sm"
                        style={{
                          backgroundColor: `rgba(255, 107, 74, ${Math.random() * 0.8 + 0.1})`,
                          opacity: Math.random() * 0.8 + 0.2,
                        }}
                        title={`${Math.floor(Math.random() * 100)} 用户活动`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/50">
                    <span>{format(dateRange.from || new Date(), "MM/dd")}</span>
                    <span>{format(dateRange.to || new Date(), "MM/dd")}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">无法加载数据，请尝试刷新。</div>
          )}
        </TabsContent>

        {/* 游戏数据标签内容 */}
        <TabsContent value="games" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-black/20 border-white/10 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle>游戏分类分布</CardTitle>
                    <CardDescription className="text-white/60">按分类统计的游戏数量</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.games.categories.map((category, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white/70">{category.name}</span>
                            <span>{category.count} 款游戏</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-[#ff6b4a] h-2 rounded-full"
                              style={{
                                width: `${(category.count / Math.max(...stats.games.categories.map((c) => c.count))) * 100}%`,
                                opacity:
                                  0.5 +
                                  0.5 * (category.count / Math.max(...stats.games.categories.map((c) => c.count))),
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle>游戏平台分布</CardTitle>
                    <CardDescription className="text-white/60">支持的游戏平台统计</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70">PC</span>
                          <span>{Math.floor(stats.games.total * 0.9)} 款游戏</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-[#ff6b4a] h-2 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70">PlayStation 5</span>
                          <span>{Math.floor(stats.games.total * 0.7)} 款游戏</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70">Xbox Series X/S</span>
                          <span>{Math.floor(stats.games.total * 0.65)} 款游戏</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-[#10b981] h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70">Nintendo Switch</span>
                          <span>{Math.floor(stats.games.total * 0.4)} 款游戏</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: "40%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white/70">Mobile</span>
                          <span>{Math.floor(stats.games.total * 0.3)} 款游戏</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div className="bg-[#8b5cf6] h-2 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">无法加载数据，请尝试刷新。</div>
          )}
        </TabsContent>

        {/* 互动数据标签内容 */}
        <TabsContent value="engagement" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-black/20 border-white/10 animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-white/10 rounded mb-2" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">评论总数</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.comments.total}</div>
                    <p className="text-sm text-white/50 mt-2">
                      <span className="text-yellow-500">{stats.comments.pending}</span> 条待审核
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">最近评论</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.comments.recent}</div>
                    <p className="text-sm text-white/50 mt-2">过去7天内</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">评论趋势</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold flex items-center">{formatTrend(stats.comments.trend)}</div>
                    <p className="text-sm text-white/50 mt-2">与上周相比</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle>用户互动分析</CardTitle>
                  <CardDescription className="text-white/60">基于最近30天的用户行为</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70">页面浏览</span>
                        <span>{stats.visitors.thisMonth.toLocaleString()} 次</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#ff6b4a] h-2 rounded-full" style={{ width: "100%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70">游戏详情查看</span>
                        <span>{Math.floor(stats.visitors.thisMonth * 0.6).toLocaleString()} 次</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#3b82f6] h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70">评论互动</span>
                        <span>{stats.comments.total} 次</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-[#10b981] h-2 rounded-full"
                          style={{ width: `${(stats.comments.total / stats.visitors.thisMonth) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70">收藏游戏</span>
                        <span>{Math.floor(stats.visitors.thisMonth * 0.2).toLocaleString()} 次</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#f59e0b] h-2 rounded-full" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70">下载链接点击</span>
                        <span>{Math.floor(stats.visitors.thisMonth * 0.15).toLocaleString()} 次</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-[#8b5cf6] h-2 rounded-full" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 text-white/50">无法加载数据，请尝试刷新。</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
