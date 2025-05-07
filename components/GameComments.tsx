"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, Flag, MessageSquare } from "lucide-react"
import type { Game } from "@/types/game"
import type { GameComment } from "@/types/comment"

interface GameCommentsProps {
  game: Game
}

export default function GameComments({ game }: GameCommentsProps) {
  const [comments, setComments] = useState<GameComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [username, setUsername] = useState("")
  const [showUsernameInput, setShowUsernameInput] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // 从本地存储加载评论
    const storedComments = localStorage.getItem("gameComments")
    if (storedComments) {
      const allComments = JSON.parse(storedComments) as GameComment[]
      // 只显示已审核的评论
      const gameComments = allComments.filter((comment) => comment.gameId === game.id && comment.approved)
      setComments(gameComments)
    }

    // 检查是否已有用户名
    const storedUsername = localStorage.getItem("commentUsername")
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [game.id])

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    if (!username.trim()) {
      setShowUsernameInput(true)
      return
    }

    // 保存用户名
    localStorage.setItem("commentUsername", username)

    setSubmitting(true)

    // 创建新评论
    const newCommentObj: GameComment = {
      id: Date.now(),
      gameId: game.id,
      userId: 999, // 模拟用户ID
      username: username,
      content: newComment,
      rating: newRating,
      createdAt: new Date().toISOString(),
      approved: false, // 默认未审核
    }

    // 获取现有评论
    const storedComments = localStorage.getItem("gameComments")
    let allComments: GameComment[] = []

    if (storedComments) {
      allComments = JSON.parse(storedComments)
    }

    // 添加新评论
    allComments.push(newCommentObj)

    // 保存到本地存储
    localStorage.setItem("gameComments", JSON.stringify(allComments))

    // 重置表单
    setNewComment("")
    setSubmitting(false)

    // 显示提交成功消息
    alert("评论已提交，等待管理员审核后显示")
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

  // 渲染星级评分选择器
  const renderRatingSelector = () => {
    return (
      <div className="flex items-center space-x-1 mb-4">
        <span className="text-white/70 text-sm mr-2">评分:</span>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setNewRating(rating)}
            className={`text-2xl ${rating <= newRating ? "text-[#ff6b4a]" : "text-white/30"}`}
          >
            ★
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">用户评论</h2>

      {/* 评论列表 */}
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id} className="bg-black/20 border-white/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2 bg-[#ff6b4a]/20">
                      <AvatarFallback className="text-[#ff6b4a]">
                        {comment.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{comment.username}</CardTitle>
                      <p className="text-xs text-white/50">{formatDate(comment.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-[#ff6b4a]">
                    {"★".repeat(comment.rating)}
                    <span className="text-white/30">{"★".repeat(5 - comment.rating)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">{comment.content}</p>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                    <ThumbsUp className="h-4 w-4 mr-1" /> 点赞
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                    <MessageSquare className="h-4 w-4 mr-1" /> 回复
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                  <Flag className="h-4 w-4 mr-1" /> 举报
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-black/20 rounded-lg border border-white/10">
          <MessageSquare className="h-10 w-10 mx-auto text-white/30 mb-2" />
          <p className="text-white/50">暂无评论，成为第一个评论的用户吧！</p>
        </div>
      )}

      {/* 评论表单 */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">发表评论</CardTitle>
        </CardHeader>
        <CardContent>
          {showUsernameInput && !username && (
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm text-white/70 mb-2">
                您的昵称
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入您的昵称"
                className="w-full p-2 bg-white/5 border border-white/10 rounded-md text-white mb-4"
              />
            </div>
          )}

          {renderRatingSelector()}

          <Textarea
            placeholder="分享您对这款游戏的看法..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-white/5 border-white/10 text-white min-h-[100px]"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
          >
            {submitting ? "提交中..." : "提交评论"}
          </Button>
          <p className="text-xs text-white/50 ml-4">评论需要经过审核后才会显示</p>
        </CardFooter>
      </Card>
    </div>
  )
}
