"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Send, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  status: "pending" | "processing" | "resolved" | "closed"
  category?: string
  responses?: {
    message: string
    timestamp: string
    respondedBy: string
    isAdmin: boolean
  }[]
}

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [category, setCategory] = useState("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [myRequests, setMyRequests] = useState<ContactRequest[]>([])
  const [activeTab, setActiveTab] = useState("new")
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null)
  const [reply, setReply] = useState("")

  // 加载用户的请求
  useEffect(() => {
    const storedRequests = localStorage.getItem("contactRequests")
    if (storedRequests) {
      const allRequests = JSON.parse(storedRequests)
      // 假设用户已登录，这里模拟只显示当前用户的请求
      const userEmail = localStorage.getItem("userEmail") || email || "user@example.com"
      const userRequests = allRequests.filter((req: ContactRequest) => req.email === userEmail)
      setMyRequests(userRequests)
    }
  }, [email])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSuccess("")
    setError("")

    // 验证表单
    if (!name || !email || !message) {
      setError("请填写所有必填字段")
      setIsSubmitting(false)
      return
    }

    // 模拟API调用
    setTimeout(() => {
      try {
        // 获取现有请求
        const storedRequests = JSON.parse(localStorage.getItem("contactRequests") || "[]")

        // 创建新请求
        const newRequest: ContactRequest = {
          id: (storedRequests.length + 1).toString(),
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
          status: "pending",
          category,
          responses: [],
        }

        // 保存到localStorage
        localStorage.setItem("contactRequests", JSON.stringify([...storedRequests, newRequest]))

        // 更新我的请求列表
        setMyRequests([...myRequests, newRequest])

        // 重置表单
        setName("")
        setEmail("")
        setMessage("")
        setCategory("general")
        setSuccess("您的请求已成功提交，我们会尽快回复您。")
        setActiveTab("history")
      } catch (err) {
        setError("提交请求时出错，请稍后再试。")
      }

      setIsSubmitting(false)
    }, 1000)
  }

  const handleReply = (requestId: string) => {
    if (!reply.trim()) return

    setIsSubmitting(true)

    // 模拟API调用
    setTimeout(() => {
      try {
        // 获取现有请求
        const storedRequests = JSON.parse(localStorage.getItem("contactRequests") || "[]")

        // 更新请求
        const updatedRequests = storedRequests.map((req: ContactRequest) => {
          if (req.id === requestId) {
            const responses = req.responses || []
            return {
              ...req,
              responses: [
                ...responses,
                {
                  message: reply,
                  timestamp: new Date().toISOString(),
                  respondedBy: req.name,
                  isAdmin: false,
                },
              ],
            }
          }
          return req
        })

        // 保存到localStorage
        localStorage.setItem("contactRequests", JSON.stringify(updatedRequests))

        // 更新我的请求列表
        const updatedMyRequests = myRequests.map((req) => {
          if (req.id === requestId) {
            const responses = req.responses || []
            return {
              ...req,
              responses: [
                ...responses,
                {
                  message: reply,
                  timestamp: new Date().toISOString(),
                  respondedBy: req.name,
                  isAdmin: false,
                },
              ],
            }
          }
          return req
        })

        setMyRequests(updatedMyRequests)

        // 更新选中的请求
        if (selectedRequest && selectedRequest.id === requestId) {
          const responses = selectedRequest.responses || []
          setSelectedRequest({
            ...selectedRequest,
            responses: [
              ...responses,
              {
                message: reply,
                timestamp: new Date().toISOString(),
                respondedBy: selectedRequest.name,
                isAdmin: false,
              },
            ],
          })
        }

        // 重置回复
        setReply("")
        setSuccess("您的回复已成功提交。")
      } catch (err) {
        setError("提交回复时出错，请稍后再试。")
      }

      setIsSubmitting(false)
    }, 1000)
  }

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center text-yellow-500">
            <Clock className="h-4 w-4 mr-1" /> 待处理
          </div>
        )
      case "processing":
        return (
          <div className="flex items-center text-blue-500">
            <MessageSquare className="h-4 w-4 mr-1" /> 处理中
          </div>
        )
      case "resolved":
        return (
          <div className="flex items-center text-green-500">
            <CheckCircle className="h-4 w-4 mr-1" /> 已解决
          </div>
        )
      case "closed":
        return (
          <div className="flex items-center text-gray-500">
            <XCircle className="h-4 w-4 mr-1" /> 已关闭
          </div>
        )
      default:
        return (
          <div className="flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" /> 未知状态
          </div>
        )
    }
  }

  const getCategoryLabel = (category?: string) => {
    switch (category) {
      case "account":
        return "账号问题"
      case "download":
        return "下载问题"
      case "content":
        return "内容反馈"
      case "suggestion":
        return "功能建议"
      case "technical":
        return "技术支持"
      case "payment":
        return "支付问题"
      case "general":
      default:
        return "一般咨询"
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">联系客服</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="new" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            提交新请求
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            我的请求历史
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card className="bg-black/20 border-white/10 dark:bg-white/20 dark:border-black/10">
            <CardHeader>
              <CardTitle>提交新请求</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">
                请填写以下表单，我们会尽快回复您。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-4 bg-green-900/20 border-green-900/50 text-green-300 dark:bg-green-100/20 dark:border-green-100/50 dark:text-green-700">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert className="mb-4 bg-red-900/20 border-red-900/50 text-red-300 dark:bg-red-100/20 dark:border-red-100/50 dark:text-red-700">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入您的姓名"
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入您的邮箱"
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">问题类型</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 rounded-md bg-white/5 border border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                  >
                    <option value="general">一般咨询</option>
                    <option value="account">账号问题</option>
                    <option value="download">下载问题</option>
                    <option value="content">内容反馈</option>
                    <option value="suggestion">功能建议</option>
                    <option value="technical">技术支持</option>
                    <option value="payment">支付问题</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">问题描述</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="请详细描述您的问题"
                    className="min-h-[150px] bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              >
                {isSubmitting ? "提交中..." : "提交请求"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-black/20 border-white/10 dark:bg-white/20 dark:border-black/10">
            <CardHeader>
              <CardTitle>我的请求历史</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">
                查看您之前提交的请求和回复。
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRequests.length === 0 ? (
                <div className="text-center py-8 text-white/50 dark:text-black/50">您还没有提交过请求。</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 border-r border-white/10 dark:border-black/10 pr-4">
                    <div className="space-y-2">
                      {myRequests.map((request) => (
                        <div
                          key={request.id}
                          className={`p-3 rounded-md cursor-pointer transition-colors ${
                            selectedRequest?.id === request.id
                              ? "bg-[#ff6b4a]/10 border border-[#ff6b4a]/20"
                              : "hover:bg-white/5 dark:hover:bg-black/5 border border-transparent"
                          }`}
                          onClick={() => setSelectedRequest(request)}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <div className="font-medium truncate">{request.message.substring(0, 30)}...</div>
                            <div className="text-xs text-white/50 dark:text-black/50 whitespace-nowrap ml-2">
                              {new Date(request.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-xs text-white/50 dark:text-black/50">
                              {getCategoryLabel(request.category)}
                            </div>
                            <div className="text-xs">{getStatusBadge(request.status)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    {selectedRequest ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{getCategoryLabel(selectedRequest.category)}</h3>
                            <p className="text-sm text-white/50 dark:text-black/50">
                              {formatDate(selectedRequest.timestamp)}
                            </p>
                          </div>
                          <div>{getStatusBadge(selectedRequest.status)}</div>
                        </div>

                        <ScrollArea className="h-[400px] pr-4">
                          <div className="space-y-4">
                            <div className="message-bubble user">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium">{selectedRequest.name}</span>
                                <span className="text-xs text-white/50 dark:text-black/50">
                                  {formatDate(selectedRequest.timestamp)}
                                </span>
                              </div>
                              <p>{selectedRequest.message}</p>
                            </div>

                            {selectedRequest.responses &&
                              selectedRequest.responses.map((response, index) => (
                                <div key={index} className={`message-bubble ${response.isAdmin ? "admin" : "user"}`}>
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium">{response.respondedBy}</span>
                                    <span className="text-xs text-white/50 dark:text-black/50">
                                      {formatDate(response.timestamp)}
                                    </span>
                                  </div>
                                  <p>{response.message}</p>
                                </div>
                              ))}
                          </div>
                        </ScrollArea>

                        {(selectedRequest.status === "processing" || selectedRequest.status === "pending") && (
                          <div className="flex space-x-2 pt-4 border-t border-white/10 dark:border-black/10">
                            <Textarea
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                              placeholder="输入回复内容..."
                              className="flex-1 bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                            />
                            <Button
                              onClick={() => handleReply(selectedRequest.id)}
                              disabled={isSubmitting || !reply.trim()}
                              className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
                            >
                              <Send className="h-4 w-4 mr-2" /> 回复
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-white/50 dark:text-black/50">
                        <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
                        <p>选择一个请求查看详情</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
