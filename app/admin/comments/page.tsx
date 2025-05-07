"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreVertical, CheckCircle, XCircle, Eye, Trash2, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { allGames } from "@/data/games"
import type { GameComment } from "@/types/comment"

export default function CommentsManagement() {
  const [comments, setComments] = useState<GameComment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterGame, setFilterGame] = useState("all")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentComment, setCurrentComment] = useState<GameComment | null>(null)

  useEffect(() => {
    // 在实际应用中，这些数据应该从API获取
    const storedComments = localStorage.getItem("gameComments")
    if (storedComments) {
      setComments(JSON.parse(storedComments))
    } else {
      // 生成一些示例评论
      const sampleComments: GameComment[] = [
        {
          id: 1,
          gameId: 1,
          userId: 101,
          username: "游戏玩家1",
          content: "无畏契约是一款非常有趣的游戏，我特别喜欢它的角色设计和战术元素。",
          rating: 5,
          createdAt: "2023-05-10T08:30:00Z",
          approved: true,
        },
        {
          id: 2,
          gameId: 2,
          userId: 102,
          username: "夜之城居民",
          content:
            "赛博朋克2077的世界观非常吸引人，但游戏发布时的bug太多了。不过经过多次更新后，游戏体验已经好了很多。",
          rating: 4,
          createdAt: "2023-05-12T14:20:00Z",
          approved: true,
        },
        {
          id: 3,
          gameId: 5,
          userId: 103,
          username: "魂系玩家",
          content: "艾尔登法环是FromSoftware的巅峰之作，开放世界设计与魂系游戏的完美结合。",
          rating: 5,
          createdAt: "2023-05-15T19:45:00Z",
          approved: false,
        },
        {
          id: 4,
          gameId: 3,
          userId: 104,
          username: "大逃杀爱好者",
          content: "绝地求生虽然已经不如当年那么火了，但仍然是大逃杀类游戏的经典之作。",
          rating: 4,
          createdAt: "2023-05-18T10:15:00Z",
          approved: false,
        },
        {
          id: 5,
          gameId: 8,
          userId: 105,
          username: "忍者大师",
          content: "只狼的战斗系统非常精妙，需要精确的反应和策略。弹刀系统带来了前所未有的爽快感！",
          rating: 5,
          createdAt: "2023-05-20T16:30:00Z",
          approved: true,
        },
      ]
      setComments(sampleComments)
      localStorage.setItem("gameComments", JSON.stringify(sampleComments))
    }
  }, [])

  // 过滤评论
  const filteredComments = comments.filter((comment) => {
    // 搜索过滤
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.username.toLowerCase().includes(searchQuery.toLowerCase())

    // 状态过滤
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "approved" && comment.approved) ||
      (filterStatus === "pending" && !comment.approved)

    // 游戏过滤
    const matchesGame = filterGame === "all" || comment.gameId.toString() === filterGame

    return matchesSearch && matchesStatus && matchesGame
  })

  // 获取游戏名称
  const getGameTitle = (gameId: number) => {
    const game = allGames.find((g) => g.id === gameId)
    return game ? game.title : "未知游戏"
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 处理评论审核
  const handleApproveComment = (commentId: number, approved: boolean) => {
    // 在实际应用中，这应该是一个API调用
    const updatedComments = comments.map((comment) => (comment.id === commentId ? { ...comment, approved } : comment))

    setComments(updatedComments)
    localStorage.setItem("gameComments", JSON.stringify(updatedComments))
  }

  // 处理评论删除
  const handleDeleteComment = () => {
    if (!currentComment) return

    // 在实际应用中，这应该是一个API调用
    const updatedComments = comments.filter((comment) => comment.id !== currentComment.id)

    setComments(updatedComments)
    localStorage.setItem("gameComments", JSON.stringify(updatedComments))
    setIsDeleteDialogOpen(false)
    setCurrentComment(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">评论管理</h1>
      </div>

      {/* 过滤和搜索 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="搜索评论内容或用户名..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="approved">已审核</SelectItem>
              <SelectItem value="pending">待审核</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterGame} onValueChange={setFilterGame}>
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择游戏" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="all">全部游戏</SelectItem>
              {allGames.map((game) => (
                <SelectItem key={game.id} value={game.id.toString()}>
                  {game.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">ID</TableHead>
                <TableHead className="text-white/70">用户</TableHead>
                <TableHead className="text-white/70">游戏</TableHead>
                <TableHead className="text-white/70">评论内容</TableHead>
                <TableHead className="text-white/70">评分</TableHead>
                <TableHead className="text-white/70">时间</TableHead>
                <TableHead className="text-white/70">状态</TableHead>
                <TableHead className="text-white/70 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComments.map((comment) => (
                <TableRow key={comment.id} className="border-white/5">
                  <TableCell>{comment.id}</TableCell>
                  <TableCell>{comment.username}</TableCell>
                  <TableCell>{getGameTitle(comment.gameId)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{comment.content}</TableCell>
                  <TableCell>
                    <span className="text-[#ff6b4a]">{"★".repeat(comment.rating)}</span>
                  </TableCell>
                  <TableCell className="text-white/70">{formatDate(comment.createdAt)}</TableCell>
                  <TableCell>
                    {comment.approved ? (
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">已审核</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">待审核</Badge>
                    )}
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
                          onClick={() => {
                            setCurrentComment(comment)
                            setIsViewDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" /> 查看详情
                        </DropdownMenuItem>
                        {!comment.approved && (
                          <DropdownMenuItem
                            onClick={() => handleApproveComment(comment.id, true)}
                            className="text-green-400 hover:bg-green-900/20 hover:text-green-300 cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" /> 通过审核
                          </DropdownMenuItem>
                        )}
                        {comment.approved && (
                          <DropdownMenuItem
                            onClick={() => handleApproveComment(comment.id, false)}
                            className="text-yellow-400 hover:bg-yellow-900/20 hover:text-yellow-300 cursor-pointer"
                          >
                            <XCircle className="h-4 w-4 mr-2" /> 取消审核
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentComment(comment)
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
              ))}
              {filteredComments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-white/50">
                    没有找到符合条件的评论
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 查看评论对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>评论详情</DialogTitle>
          </DialogHeader>
          {currentComment && (
            <div className="py-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{currentComment.username}</h3>
                  <p className="text-sm text-white/50">评论于 {formatDate(currentComment.createdAt)}</p>
                </div>
                <Badge
                  className={
                    currentComment.approved ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                  }
                >
                  {currentComment.approved ? "已审核" : "待审核"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">游戏</p>
                <p>{getGameTitle(currentComment.gameId)}</p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">评分</p>
                <p className="text-[#ff6b4a]">{"★".repeat(currentComment.rating)}</p>
              </div>
              <div>
                <p className="text-sm text-white/70 mb-1">评论内容</p>
                <p className="bg-white/5 p-3 rounded-md">{currentComment.content}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div>
              {currentComment && !currentComment.approved && (
                <Button
                  onClick={() => {
                    handleApproveComment(currentComment.id, true)
                    setIsViewDialogOpen(false)
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white mr-2"
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> 通过审核
                </Button>
              )}
              {currentComment && currentComment.approved && (
                <Button
                  onClick={() => {
                    handleApproveComment(currentComment.id, false)
                    setIsViewDialogOpen(false)
                  }}
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-900/20"
                >
                  <XCircle className="h-4 w-4 mr-2" /> 取消审核
                </Button>
              )}
            </div>
            <Button onClick={() => setIsViewDialogOpen(false)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              关闭
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
            <p>您确定要删除此评论吗？此操作无法撤销。</p>
            {currentComment && (
              <div className="mt-4 p-3 bg-white/5 rounded-md text-white/70 text-sm">
                <p>"{currentComment.content}"</p>
                <p className="mt-2">- {currentComment.username}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleDeleteComment} variant="destructive" className="bg-red-600 hover:bg-red-700">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
