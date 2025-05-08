"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Search, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ContactRequest {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
  status: "pending" | "processing" | "resolved" | "closed"
  category?: string
  response?: {
    message: string
    timestamp: string
    respondedBy: string
  }
}

export default function CustomerServicePage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isRespondDialogOpen, setIsRespondDialogOpen] = useState(false)
  const [response, setResponse] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [category, setCategory] = useState<string>("general")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    // 加载客服请求数据
    const storedRequests = localStorage.getItem("contactRequests")
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests))
    } else {
      // 创建一些示例数据
      const sampleRequests: ContactRequest[] = [
        {
          id: "1",
          name: "张三",
          email: "zhangsan@example.com",
          message: "我在登录时遇到了问题，提示'密码错误'，但我确定密码是正确的。",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          category: "account",
        },
        {
          id: "2",
          name: "李四",
          email: "lisi@example.com",
          message: "我想知道如何更改我的个人资料信息？",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: "processing",
          category: "account",
        },
        {
          id: "3",
          name: "王五",
          email: "wangwu@example.com",
          message: "我刚购买了《赛博朋克2077》，但是下载链接似乎失效了。",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: "resolved",
          category: "download",
          response: {
            message: "已经为您重新生成下载链接，请检查您的邮箱。",
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            respondedBy: "客服团队",
          },
        },
        {
          id: "4",
          name: "赵六",
          email: "zhaoliu@example.com",
          message: "网站上《艾尔登法环》的系统配置信息似乎有误。最低配置应该是8GB内存而不是4GB。",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: "closed",
          category: "content",
          response: {
            message: "感谢您的反馈，我们已经更正了系统配置信息。",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            respondedBy: "内容团队",
          },
        },
        {
          id: "5",
          name: "陈七",
          email: "chenqi@example.com",
          message: "我想提交一个网站功能建议：希望能增加游戏评分的排序功能。",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          category: "suggestion",
        },
      ]
      setRequests(sampleRequests)
      localStorage.setItem("contactRequests", JSON.stringify(sampleRequests))
    }
  }, [])

  // 过滤和排序请求
  const filteredRequests = requests
    .filter((request) => {
      // 搜索过滤
      const matchesSearch =
        request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.message.toLowerCase().includes(searchQuery.toLowerCase())

      // 状态过滤
      let matchesStatus = true
      if (activeTab !== "all") {
        matchesStatus = request.status === activeTab
      }

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      }
    })

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
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/10">待处理</Badge>
        )
      case "processing":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/10">处理中</Badge>
      case "resolved":
        return (
          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/10">已解决</Badge>
        )
      case "closed":
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/10">已关闭</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/10">未知状态</Badge>
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

  const getCategoryBadge = (category?: string) => {
    const categoryType = category || "general"
    const colors: Record<string, { bg: string; text: string }> = {
      account: { bg: "bg-purple-500/20", text: "text-purple-500" },
      download: { bg: "bg-blue-500/20", text: "text-blue-500" },
      content: { bg: "bg-pink-500/20", text: "text-pink-500" },
      suggestion: { bg: "bg-green-500/20", text: "text-green-500" },
      technical: { bg: "bg-orange-500/20", text: "text-orange-500" },
      payment: { bg: "bg-red-500/20", text: "text-red-500" },
      general: { bg: "bg-gray-500/20", text: "text-gray-500" },
    }

    const { bg, text } = colors[categoryType]
    return <Badge className={`${bg} ${text}`}>{getCategoryLabel(category)}</Badge>
  }

  const handleUpdateStatus = (id: string, status: "pending" | "processing" | "resolved" | "closed") => {
    const updatedRequests = requests.map((request) => {
      if (request.id === id) {
        return { ...request, status }
      }
      return request
    })
    setRequests(updatedRequests)
    localStorage.setItem("contactRequests", JSON.stringify(updatedRequests))

    // 如果要更新的是当前选中的请求，也更新它
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status })
    }
  }

  const handleSendResponse = () => {
    if (!selectedRequest || !response.trim()) return

    setIsSubmitting(true)

    // 模拟API调用
    setTimeout(() => {
      const updatedRequests = requests.map((request) => {
        if (request.id === selectedRequest.id) {
          return {
            ...request,
            status: "resolved" as const,
            response: {
              message: response,
              timestamp: new Date().toISOString(),
              respondedBy: localStorage.getItem("adminUsername") || "管理员",
            },
          }
        }
        return request
      })

      setRequests(updatedRequests)
      localStorage.setItem("contactRequests", JSON.stringify(updatedRequests))

      // 记录操作日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "客服回复",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: `回复了用户 ${selectedRequest.name} 的咨询`,
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      setIsSubmitting(false)
      setResponse("")
      setIsRespondDialogOpen(false)

      // 更新选中的请求
      const updatedRequest = updatedRequests.find((r) => r.id === selectedRequest.id)
      if (updatedRequest) {
        setSelectedRequest(updatedRequest)
      }
    }, 1000)
  }

  const handleCategoryChange = (id: string, newCategory: string) => {
    const updatedRequests = requests.map((request) => {
      if (request.id === id) {
        return { ...request, category: newCategory }
      }
      return request
    })
    setRequests(updatedRequests)
    localStorage.setItem("contactRequests", JSON.stringify(updatedRequests))

    // 如果要更新的是当前选中的请求，也更新它
    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, category: newCategory })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">客服管理</h1>
        <Button onClick={() => window.location.reload()} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <RefreshCw className="h-4 w-4 mr-2" /> 刷新数据
        </Button>
      </div>

      {/* 状态统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-yellow-500" /> 待处理
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{requests.filter((r) => r.status === "pending").length}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-blue-500" /> 处理中
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{requests.filter((r) => r.status === "processing").length}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> 已解决
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{requests.filter((r) => r.status === "resolved").length}</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/10">
          <CardHeader className="py-4">
            <CardTitle className="text-base font-medium flex items-center">
              <XCircle className="h-4 w-4 mr-2 text-gray-500" /> 已关闭
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="text-2xl font-bold">{requests.filter((r) => r.status === "closed").length}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索栏和过滤器 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="搜索用户名、邮箱或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="排序方式" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="newest">最新优先</SelectItem>
              <SelectItem value="oldest">最早优先</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 标签栏 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            全部
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            待处理
          </TabsTrigger>
          <TabsTrigger
            value="processing"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            处理中
          </TabsTrigger>
          <TabsTrigger
            value="resolved"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            已解决
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            已关闭
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 请求列表 */}
      <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">ID</TableHead>
                <TableHead className="text-white/70">用户</TableHead>
                <TableHead className="text-white/70">分类</TableHead>
                <TableHead className="text-white/70">内容</TableHead>
                <TableHead className="text-white/70">提交时间</TableHead>
                <TableHead className="text-white/70">状态</TableHead>
                <TableHead className="text-white/70 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <TableRow key={request.id} className="border-white/5">
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{request.name}</div>
                        <div className="text-xs text-white/50">{request.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getCategoryBadge(request.category)}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{request.message}</TableCell>
                    <TableCell className="text-white/70">{formatDate(request.timestamp)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRequest(request)
                            setIsViewDialogOpen(true)
                          }}
                          className="text-white/70 hover:text-white"
                        >
                          查看
                        </Button>
                        {(request.status === "pending" || request.status === "processing") && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsRespondDialogOpen(true)
                            }}
                            className="text-[#ff6b4a] hover:text-[#ff6b4a]/80"
                          >
                            回复
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-white/50">
                    没有找到匹配的客服请求
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 查看详情对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle>查看客服请求</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{selectedRequest.name}</h3>
                  <p className="text-sm text-white/50">{selectedRequest.email}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="mb-1">{getStatusBadge(selectedRequest.status)}</div>
                  <p className="text-sm text-white/50">{formatDate(selectedRequest.timestamp)}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-1">
                  <p className="text-sm text-white/70 mb-1">分类</p>
                  <Select
                    value={selectedRequest.category || "general"}
                    onValueChange={(value) => handleCategoryChange(selectedRequest.id, value)}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      <SelectItem value="general">一般咨询</SelectItem>
                      <SelectItem value="account">账号问题</SelectItem>
                      <SelectItem value="download">下载问题</SelectItem>
                      <SelectItem value="content">内容反馈</SelectItem>
                      <SelectItem value="suggestion">功能建议</SelectItem>
                      <SelectItem value="technical">技术支持</SelectItem>
                      <SelectItem value="payment">支付问题</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-white/70 mb-1">状态</p>
                  <Select
                    value={selectedRequest.status}
                    onValueChange={(value: "pending" | "processing" | "resolved" | "closed") =>
                      handleUpdateStatus(selectedRequest.id, value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="更新状态" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      <SelectItem value="pending">待处理</SelectItem>
                      <SelectItem value="processing">处理中</SelectItem>
                      <SelectItem value="resolved">已解决</SelectItem>
                      <SelectItem value="closed">已关闭</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-sm text-white/70 mb-1">用户消息</p>
                <div className="bg-white/5 p-4 rounded-md border border-white/10">{selectedRequest.message}</div>
              </div>

              {selectedRequest.response && (
                <div>
                  <p className="text-sm text-white/70 mb-1">回复内容</p>
                  <div className="bg-[#ff6b4a]/10 p-4 rounded-md border border-[#ff6b4a]/20">
                    <div className="mb-2">{selectedRequest.response.message}</div>
                    <div className="text-xs text-white/50 flex justify-between">
                      <span>回复者: {selectedRequest.response.respondedBy}</span>
                      <span>{formatDate(selectedRequest.response.timestamp)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div>
              {selectedRequest && (selectedRequest.status === "pending" || selectedRequest.status === "processing") && (
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    setIsRespondDialogOpen(true)
                  }}
                  className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white mr-2"
                >
                  <MessageSquare className="h-4 w-4 mr-2" /> 回复
                </Button>
              )}
            </div>
            <Button onClick={() => setIsViewDialogOpen(false)} variant="outline" className="border-white/10">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 回复对话框 */}
      <Dialog open={isRespondDialogOpen} onOpenChange={setIsRespondDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>回复客服请求</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4 space-y-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">{selectedRequest.name}</span>
                    <span className="text-sm text-white/50 ml-2">{selectedRequest.email}</span>
                  </div>
                  <span className="text-sm text-white/50">{formatDate(selectedRequest.timestamp)}</span>
                </div>
                <p>{selectedRequest.message}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response" className="text-white/70">
                  回复内容
                </Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[150px]"
                  placeholder="在此输入回复内容..."
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div>
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedRequest) {
                    handleUpdateStatus(selectedRequest.id, "processing")
                  }
                  setIsRespondDialogOpen(false)
                }}
                className="border-white/10 text-white/70 mr-2"
              >
                标记为处理中
              </Button>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => setIsRespondDialogOpen(false)}
                className="border-white/10 text-white/70 mr-2"
              >
                取消
              </Button>
              <Button
                onClick={handleSendResponse}
                disabled={isSubmitting || !response.trim()}
                className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
              >
                {isSubmitting ? "发送中..." : "发送回复"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
