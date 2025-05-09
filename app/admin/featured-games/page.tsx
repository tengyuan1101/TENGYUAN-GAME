"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Game } from "@/types/game"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

export default function FeaturedGamesPage() {
  const [allGames, setAllGames] = useState<Game[]>([])
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])
  const [newReleases, setNewReleases] = useState<Game[]>([])
  const [topGames, setTopGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<"featured" | "new" | "top">("featured")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // 加载游戏数据
    const storedGames = localStorage.getItem("managedGames")
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames)
        setAllGames(parsedGames)
      } catch (error) {
        console.error("加载游戏数据出错:", error)
        import("@/data/games").then(({ allGames }) => {
          setAllGames(allGames)
        })
      }
    } else {
      import("@/data/games").then(({ allGames }) => {
        setAllGames(allGames)
      })
    }

    // 加载推荐游戏、新游预告和排行榜数据
    const storedFeatured = localStorage.getItem("featuredGames")
    if (storedFeatured) {
      setFeaturedGames(JSON.parse(storedFeatured))
    } else {
      import("@/data/games").then(({ featuredGames }) => {
        setFeaturedGames(featuredGames)
        localStorage.setItem("featuredGames", JSON.stringify(featuredGames))
      })
    }

    const storedNewReleases = localStorage.getItem("newReleases")
    if (storedNewReleases) {
      setNewReleases(JSON.parse(storedNewReleases))
    } else {
      import("@/data/games").then(({ newReleases }) => {
        setNewReleases(newReleases)
        localStorage.setItem("newReleases", JSON.stringify(newReleases))
      })
    }

    const storedTopGames = localStorage.getItem("topGames")
    if (storedTopGames) {
      setTopGames(JSON.parse(storedTopGames))
    } else {
      import("@/data/games").then(({ topGames }) => {
        setTopGames(topGames)
        localStorage.setItem("topGames", JSON.stringify(topGames))
      })
    }
  }, [])

  // 过滤游戏
  const filteredGames = allGames.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())

    // 排除已经在选定区域的游戏
    let isAlreadyAdded = false
    if (selectedSection === "featured") {
      isAlreadyAdded = featuredGames.some((g) => g.id === game.id)
    } else if (selectedSection === "new") {
      isAlreadyAdded = newReleases.some((g) => g.id === game.id)
    } else if (selectedSection === "top") {
      isAlreadyAdded = topGames.some((g) => g.id === game.id)
    }

    return matchesSearch && !isAlreadyAdded
  })

  const handleAddGame = (game: Game) => {
    if (selectedSection === "featured") {
      setFeaturedGames([...featuredGames, game])
    } else if (selectedSection === "new") {
      // 为新游预告添加发布日期
      const gameWithReleaseDate = {
        ...game,
        releaseDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }
      setNewReleases([...newReleases, gameWithReleaseDate])
    } else if (selectedSection === "top") {
      setTopGames([...topGames, game])
    }
    setIsAddDialogOpen(false)
  }

  const handleRemoveGame = (section: "featured" | "new" | "top", gameId: number) => {
    if (section === "featured") {
      setFeaturedGames(featuredGames.filter((game) => game.id !== gameId))
    } else if (section === "new") {
      setNewReleases(newReleases.filter((game) => game.id !== gameId))
    } else if (section === "top") {
      setTopGames(topGames.filter((game) => game.id !== gameId))
    }
  }

  const handleMoveGame = (section: "featured" | "new" | "top", gameId: number, direction: "up" | "down") => {
    let games: Game[] = []
    let setGames: React.Dispatch<React.SetStateAction<Game[]>> = () => {}

    if (section === "featured") {
      games = [...featuredGames]
      setGames = setFeaturedGames
    } else if (section === "new") {
      games = [...newReleases]
      setGames = setNewReleases
    } else if (section === "top") {
      games = [...topGames]
      setGames = setTopGames
    }

    const index = games.findIndex((game) => game.id === gameId)
    if (index === -1) return

    if (direction === "up" && index > 0) {
      const temp = games[index]
      games[index] = games[index - 1]
      games[index - 1] = temp
    } else if (direction === "down" && index < games.length - 1) {
      const temp = games[index]
      games[index] = games[index + 1]
      games[index + 1] = temp
    }

    setGames(games)
  }

  const handleSaveChanges = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    try {
      localStorage.setItem("featuredGames", JSON.stringify(featuredGames))
      localStorage.setItem("newReleases", JSON.stringify(newReleases))
      localStorage.setItem("topGames", JSON.stringify(topGames))

      // 记录操作日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "内容修改",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: "更新了推荐游戏、新游预告和排行榜",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      // 触发存储事件，以便其他组件也能更新
      window.dispatchEvent(new Event("storage"))

      setSuccess("设置已成功保存！")
      setTimeout(() => {
        setIsSaving(false)
        setSuccess("")
      }, 2000)
    } catch (err) {
      setError("保存设置时出错")
      setIsSaving(false)
    }
  }

  const onDragEnd = (result: any, section: "featured" | "new" | "top") => {
    if (!result.destination) return

    let games: Game[] = []
    let setGames: React.Dispatch<React.SetStateAction<Game[]>> = () => {}

    if (section === "featured") {
      games = [...featuredGames]
      setGames = setFeaturedGames
    } else if (section === "new") {
      games = [...newReleases]
      setGames = setNewReleases
    } else if (section === "top") {
      games = [...topGames]
      setGames = setTopGames
    }

    const [removed] = games.splice(result.source.index, 1)
    games.splice(result.destination.index, 0, removed)

    setGames(games)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">推荐游戏管理</h1>
        <Button onClick={handleSaveChanges} disabled={isSaving} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <Save className="h-4 w-4 mr-2" /> {isSaving ? "保存中..." : "保存更改"}
        </Button>
      </div>

      {success && (
        <Alert className="bg-green-900/20 border-green-900/50 text-green-300 dark:bg-green-100/20 dark:border-green-100/50 dark:text-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert
          variant="destructive"
          className="bg-red-900/20 border-red-900/50 text-red-300 dark:bg-red-100/20 dark:border-red-100/50 dark:text-red-700"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 推荐游戏 */}
        <Card className="bg-black/20 border-white/10 dark:bg-white/20 dark:border-black/10 col-span-1 admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>推荐游戏</span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSection("featured")
                  setIsAddDialogOpen(true)
                }}
                className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              >
                <Plus className="h-4 w-4 mr-1" /> 添加
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={(result) => onDragEnd(result, "featured")}>
              <Droppable droppableId="featured-games">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {featuredGames.length > 0 ? (
                      featuredGames.map((game, index) => (
                        <Draggable key={game.id} draggableId={`featured-${game.id}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-2 bg-black/10 dark:bg-white/10 rounded-md"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-2">
                                  <img
                                    src={game.imageUrl || "/placeholder.svg"}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{game.title}</div>
                                  <div className="text-xs text-white/50 dark:text-black/50">{game.platform}</div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("featured", game.id, "up")}
                                  disabled={index === 0}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("featured", game.id, "down")}
                                  disabled={index === featuredGames.length - 1}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveGame("featured", game.id)}
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-white/50 dark:text-black/50">暂无推荐游戏</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* 新游预告 */}
        <Card className="bg-black/20 border-white/10 dark:bg-white/20 dark:border-black/10 col-span-1 admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>新游预告</span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSection("new")
                  setIsAddDialogOpen(true)
                }}
                className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              >
                <Plus className="h-4 w-4 mr-1" /> 添加
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={(result) => onDragEnd(result, "new")}>
              <Droppable droppableId="new-releases">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {newReleases.length > 0 ? (
                      newReleases.map((game, index) => (
                        <Draggable key={game.id} draggableId={`new-${game.id}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-2 bg-black/10 dark:bg-white/10 rounded-md"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded overflow-hidden mr-2">
                                  <img
                                    src={game.imageUrl || "/placeholder.svg"}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{game.title}</div>
                                  <div className="text-xs text-white/50 dark:text-black/50">
                                    发布日期: {game.releaseDate || "未设置"}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("new", game.id, "up")}
                                  disabled={index === 0}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("new", game.id, "down")}
                                  disabled={index === newReleases.length - 1}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveGame("new", game.id)}
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-white/50 dark:text-black/50">暂无新游预告</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>

        {/* 游戏排行榜 */}
        <Card className="bg-black/20 border-white/10 dark:bg-white/20 dark:border-black/10 col-span-1 admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>游戏排行榜</span>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedSection("top")
                  setIsAddDialogOpen(true)
                }}
                className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              >
                <Plus className="h-4 w-4 mr-1" /> 添加
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={(result) => onDragEnd(result, "top")}>
              <Droppable droppableId="top-games">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {topGames.length > 0 ? (
                      topGames.map((game, index) => (
                        <Draggable key={game.id} draggableId={`top-${game.id}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center justify-between p-2 bg-black/10 dark:bg-white/10 rounded-md"
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center bg-[#ff6b4a]/20 text-[#ff6b4a] rounded-full mr-2 font-bold">
                                  {index + 1}
                                </div>
                                <div className="w-10 h-10 rounded overflow-hidden mr-2">
                                  <img
                                    src={game.imageUrl || "/placeholder.svg"}
                                    alt={game.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-medium">{game.title}</div>
                                  <div className="text-xs text-white/50 dark:text-black/50">
                                    评分: {game.rating.toFixed(1)}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("top", game.id, "up")}
                                  disabled={index === 0}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveGame("top", game.id, "down")}
                                  disabled={index === topGames.length - 1}
                                  className="h-7 w-7 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveGame("top", game.id)}
                                  className="h-7 w-7 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="text-center py-4 text-white/50 dark:text-black/50">暂无排行榜游戏</div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      {/* 添加游戏对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSection === "featured" && "添加推荐游戏"}
              {selectedSection === "new" && "添加新游预告"}
              {selectedSection === "top" && "添加排行榜游戏"}
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 dark:text-black/50" />
            <Input
              type="text"
              placeholder="搜索游戏..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent dark:border-black/10">
                  <TableHead className="text-white/70 dark:text-black/70">游戏</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70">分类</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70">平台</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70">评分</TableHead>
                  <TableHead className="text-right text-white/70 dark:text-black/70">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGames.length > 0 ? (
                  filteredGames.map((game) => (
                    <TableRow key={game.id} className="border-white/5 dark:border-black/5">
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-2">
                            <img
                              src={game.imageUrl || "/placeholder.svg"}
                              alt={game.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span>{game.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {game.categories.slice(0, 2).map((category, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-[#ff6b4a]/10 text-[#ff6b4a] border-[#ff6b4a]/20"
                            >
                              {category}
                            </Badge>
                          ))}
                          {game.categories.length > 2 && (
                            <Badge
                              variant="outline"
                              className="bg-white/10 text-white/70 border-white/20 dark:bg-black/10 dark:text-black/70 dark:border-black/20"
                            >
                              +{game.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{game.platform}</TableCell>
                      <TableCell>
                        <span className="text-[#ff6b4a]">★ {game.rating.toFixed(1)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button onClick={() => handleAddGame(game)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
                          <Plus className="h-4 w-4 mr-1" /> 添加
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-white/50 dark:text-black/50">
                      没有找到游戏或所有游戏已添加
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-white/10 text-white/70 dark:border-black/10 dark:text-black/70"
            >
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
