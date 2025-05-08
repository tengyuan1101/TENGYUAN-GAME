"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Trash2, Eye, Download } from "lucide-react"
import type { Game } from "@/types/game"

export default function GamesManagement() {
  const [games, setGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentGame, setCurrentGame] = useState<Game | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [newGame, setNewGame] = useState<Partial<Game>>({
    title: "",
    description: "",
    platform: "",
    categories: [],
    rating: 0,
    imageUrl: "",
    videoUrl: "",
    trendingScore: 50,
    downloadUrl: "#",
  })

  const router = useRouter()

  useEffect(() => {
    // 从localStorage加载游戏
    const storedGames = localStorage.getItem("managedGames")
    if (storedGames) {
      try {
        const parsedGames = JSON.parse(storedGames)
        setGames(parsedGames)
      } catch (error) {
        console.error("加载游戏数据出错:", error)
        // 如果解析出错，使用原始游戏数据
        import("@/data/games").then(({ allGames }) => {
          setGames(allGames)
          localStorage.setItem("managedGames", JSON.stringify(allGames))
        })
      }
    } else {
      // 如果没有存储的游戏，使用原始游戏数据
      import("@/data/games").then(({ allGames }) => {
        setGames(allGames)
        localStorage.setItem("managedGames", JSON.stringify(allGames))
      })
    }
  }, [])

  // 根据搜索和标签过滤游戏
  const filteredGames = games.filter((game) => {
    // 搜索过滤
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())

    // 标签过滤
    if (activeTab === "all") return matchesSearch
    if (activeTab === "new") return matchesSearch && game.id > games.length - 3
    if (activeTab === "popular") return matchesSearch && game.trendingScore > 85
    if (activeTab === "rated") return matchesSearch && game.rating > 4.5

    return matchesSearch
  })

  const handleAddGame = () => {
    // 在实际应用中，这应该是一个API调用
    const newGameWithId: Game = {
      ...(newGame as Game),
      id: Math.max(...games.map((g) => g.id), 0) + 1,
      trendingScore: newGame.trendingScore || 50,
      downloadUrl: newGame.downloadUrl || "#",
      longDescription: newGame.description,
    }

    const updatedGames = [...games, newGameWithId]
    setGames(updatedGames)

    // 保存到localStorage
    localStorage.setItem("managedGames", JSON.stringify(updatedGames))

    setIsAddDialogOpen(false)
    setNewGame({
      title: "",
      description: "",
      platform: "",
      categories: [],
      rating: 0,
      imageUrl: "",
      videoUrl: "",
      trendingScore: 50,
      downloadUrl: "#",
    })

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `添加了游戏: ${newGameWithId.title}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  const handleEditGame = () => {
    if (!currentGame) return

    // 在实际应用中，这应该是一个API调用
    const updatedGames = games.map((game) => (game.id === currentGame.id ? currentGame : game))

    setGames(updatedGames)

    // 保存到localStorage
    localStorage.setItem("managedGames", JSON.stringify(updatedGames))

    setIsEditDialogOpen(false)
    setCurrentGame(null)

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `编辑了游戏: ${currentGame.title}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  const handleDeleteGame = () => {
    if (!currentGame) return

    // 在实际应用中，这应该是一个API调用
    const updatedGames = games.filter((game) => game.id !== currentGame.id)

    setGames(updatedGames)

    // 保存到localStorage
    localStorage.setItem("managedGames", JSON.stringify(updatedGames))

    setIsDeleteDialogOpen(false)
    setCurrentGame(null)

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `删除了游戏: ${currentGame.title}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  const handleViewGame = (game: Game) => {
    window.open("/", "_blank")
  }

  const handleExportGames = () => {
    const dataStr = JSON.stringify(games, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileName = `games_export_${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileName)
    linkElement.click()

    setIsExportDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">游戏管理</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsExportDialogOpen(true)}
            className="border-white/10 text-white/70 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" /> 导出游戏
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
            <Plus className="h-4 w-4 mr-2" /> 添加游戏
          </Button>
        </div>
      </div>

      {/* 搜索栏和标签 */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="搜索游戏..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
              全部游戏
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
              新上架
            </TabsTrigger>
            <TabsTrigger
              value="popular"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              热门游戏
            </TabsTrigger>
            <TabsTrigger
              value="rated"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              高评分
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 游戏列表 */}
      <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">ID</TableHead>
                <TableHead className="text-white/70">游戏名称</TableHead>
                <TableHead className="text-white/70">分类</TableHead>
                <TableHead className="text-white/70">平台</TableHead>
                <TableHead className="text-white/70">评分</TableHead>
                <TableHead className="text-white/70">热度</TableHead>
                <TableHead className="text-white/70 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGames.length > 0 ? (
                filteredGames.map((game) => (
                  <TableRow key={game.id} className="border-white/5">
                    <TableCell>{game.id}</TableCell>
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
                    <TableCell className="text-white/70">
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
                          <Badge variant="outline" className="bg-white/10 text-white/70 border-white/20">
                            +{game.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-white/70">{game.platform}</TableCell>
                    <TableCell>
                      <span className="text-[#ff6b4a]">★ {game.rating.toFixed(1)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-white/10 rounded-full h-1.5 mr-2">
                          <div
                            className="bg-[#ff6b4a] h-1.5 rounded-full"
                            style={{ width: `${game.trendingScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{game.trendingScore}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                          <DropdownMenuItem
                            onClick={() => handleViewGame(game)}
                            className="hover:bg-white/10 cursor-pointer"
                          >
                            <Eye className="h-4 w-4 mr-2" /> 查看
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentGame(game)
                              setIsEditDialogOpen(true)
                            }}
                            className="hover:bg-white/10 cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" /> 编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentGame(game)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-500 hover:bg-red-900/20 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> 删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-white/50">
                    没有找到游戏
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 添加游戏对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加新游戏</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/70">
                  游戏名称
                </Label>
                <Input
                  id="title"
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="platform" className="text-white/70">
                  平台
                </Label>
                <Input
                  id="platform"
                  value={newGame.platform}
                  onChange={(e) => setNewGame({ ...newGame, platform: e.target.value })}
                  placeholder="例如: PC/PS5/Xbox"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70">
                游戏描述
              </Label>
              <Textarea
                id="description"
                value={newGame.description}
                onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categories" className="text-white/70">
                  分类
                </Label>
                <Input
                  id="categories"
                  placeholder="用逗号分隔，例如: 动作,冒险,角色扮演"
                  onChange={(e) => setNewGame({ ...newGame, categories: e.target.value.split(",") })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-white/70">
                  评分
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={newGame.rating || ""}
                  onChange={(e) => setNewGame({ ...newGame, rating: Number.parseFloat(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-white/70">
                  图片URL
                </Label>
                <Input
                  id="imageUrl"
                  value={newGame.imageUrl}
                  onChange={(e) => setNewGame({ ...newGame, imageUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-white/70">
                  视频URL
                </Label>
                <Input
                  id="videoUrl"
                  value={newGame.videoUrl}
                  onChange={(e) => setNewGame({ ...newGame, videoUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trendingScore" className="text-white/70">
                  热度 (1-100)
                </Label>
                <Input
                  id="trendingScore"
                  type="number"
                  min="1"
                  max="100"
                  value={newGame.trendingScore || 50}
                  onChange={(e) => setNewGame({ ...newGame, trendingScore: Number.parseInt(e.target.value) })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downloadUrl" className="text-white/70">
                  下载链接
                </Label>
                <Input
                  id="downloadUrl"
                  value={newGame.downloadUrl || "#"}
                  onChange={(e) => setNewGame({ ...newGame, downloadUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleAddGame} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              添加游戏
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑游戏对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑游戏</DialogTitle>
          </DialogHeader>
          {currentGame && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-white/70">
                    游戏名称
                  </Label>
                  <Input
                    id="edit-title"
                    value={currentGame.title}
                    onChange={(e) => setCurrentGame({ ...currentGame, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-platform" className="text-white/70">
                    平台
                  </Label>
                  <Input
                    id="edit-platform"
                    value={currentGame.platform}
                    onChange={(e) => setCurrentGame({ ...currentGame, platform: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white/70">
                  游戏描述
                </Label>
                <Textarea
                  id="edit-description"
                  value={currentGame.description}
                  onChange={(e) => setCurrentGame({ ...currentGame, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-categories" className="text-white/70">
                    分类
                  </Label>
                  <Input
                    id="edit-categories"
                    value={currentGame.categories.join(",")}
                    onChange={(e) => setCurrentGame({ ...currentGame, categories: e.target.value.split(",") })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-rating" className="text-white/70">
                    评分
                  </Label>
                  <Input
                    id="edit-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={currentGame.rating}
                    onChange={(e) => setCurrentGame({ ...currentGame, rating: Number.parseFloat(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl" className="text-white/70">
                    图片URL
                  </Label>
                  <Input
                    id="edit-imageUrl"
                    value={currentGame.imageUrl}
                    onChange={(e) => setCurrentGame({ ...currentGame, imageUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-videoUrl" className="text-white/70">
                    视频URL
                  </Label>
                  <Input
                    id="edit-videoUrl"
                    value={currentGame.videoUrl}
                    onChange={(e) => setCurrentGame({ ...currentGame, videoUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-trendingScore" className="text-white/70">
                    热度 (1-100)
                  </Label>
                  <Input
                    id="edit-trendingScore"
                    type="number"
                    min="1"
                    max="100"
                    value={currentGame.trendingScore}
                    onChange={(e) => setCurrentGame({ ...currentGame, trendingScore: Number.parseInt(e.target.value) })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-downloadUrl" className="text-white/70">
                    下载链接
                  </Label>
                  <Input
                    id="edit-downloadUrl"
                    value={currentGame.downloadUrl}
                    onChange={(e) => setCurrentGame({ ...currentGame, downloadUrl: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleEditGame} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除 "{currentGame?.title}" 吗？此操作无法撤销。</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleDeleteGame} variant="destructive" className="bg-red-600 hover:bg-red-700">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 导出确认对话框 */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>导出游戏数据</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>要导出所有游戏数据吗？这将下载一个包含当前 {games.length} 个游戏数据的JSON文件。</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleExportGames} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              确认导出
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
