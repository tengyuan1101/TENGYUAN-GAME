"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Download, Trash2, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface LogEntry {
  action: string
  username: string
  timestamp: string
  details?: string
  ip?: string
  userAgent?: string
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // 从localStorage加载日志
    const storedLogs = localStorage.getItem("adminLogs")
    if (storedLogs) {
      const parsedLogs = JSON.parse(storedLogs)
      setLogs(parsedLogs)
      setFilteredLogs(parsedLogs)
    } else {
      // 创建一些示例日志
      const sampleLogs: LogEntry[] = [
        {
          action: "登录",
          username: "admin",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          details: "成功登录",
          ip: "192.168.1.1",
          userAgent: "Chrome/98.0.4758.102",
        },
        {
          action: "登出",
          username: "admin",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          details: "用户登出",
          ip: "192.168.1.1",
          userAgent: "Chrome/98.0.4758.102",
        },
        {
          action: "密码重置",
          username: "admin",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          details: "密码已成功重置",
          ip: "192.168.1.1",
          userAgent: "Chrome/98.0.4758.102",
        },
      ]
      setLogs(sampleLogs)
      setFilteredLogs(sampleLogs)
      localStorage.setItem("adminLogs", JSON.stringify(sampleLogs))
    }
  }, [])

  // 过滤日志
  useEffect(() => {
    let result = [...logs]

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (log) =>
          log.username.toLowerCase().includes(query) || (log.details && log.details.toLowerCase().includes(query)),
      )
    }

    // 操作类型过滤
    if (actionFilter !== "all") {
      result = result.filter((log) => log.action === actionFilter)
    }

    // 按时间排序（最新的在前）
    result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredLogs(result)
  }, [logs, searchQuery, actionFilter])

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  // 清除所有日志
  const handleClearLogs = () => {
    setLogs([])
    setFilteredLogs([])
    localStorage.setItem("adminLogs", JSON.stringify([]))
    setIsDeleteDialogOpen(false)
  }

  // 导出日志为CSV
  const handleExportLogs = () => {
    const headers = ["操作", "用户名", "时间", "详情", "IP", "浏览器"]
    const csvContent = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.action,
          log.username,
          formatDate(log.timestamp),
          log.details || "",
          log.ip || "",
          log.userAgent || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `admin_logs_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">管理员日志</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleExportLogs}
            className="border-white/10 text-white/70 hover:text-white"
          >
            <Download className="h-4 w-4 mr-2" /> 导出日志
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> 清除日志
          </Button>
        </div>
      </div>

      {/* 过滤和搜索 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="搜索用户名或详情..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="操作类型" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/10 text-white">
              <SelectItem value="all">全部操作</SelectItem>
              <SelectItem value="登录">登录</SelectItem>
              <SelectItem value="登出">登出</SelectItem>
              <SelectItem value="密码重置">密码重置</SelectItem>
              <SelectItem value="内容修改">内容修改</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 日志列表 */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">系统日志记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70">操作类型</TableHead>
                  <TableHead className="text-white/70">用户名</TableHead>
                  <TableHead className="text-white/70">时间</TableHead>
                  <TableHead className="text-white/70">详情</TableHead>
                  <TableHead className="text-white/70">IP地址</TableHead>
                  <TableHead className="text-white/70">浏览器</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <TableRow key={index} className="border-white/5">
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            log.action === "登录"
                              ? "bg-green-500/20 text-green-400"
                              : log.action === "登出"
                                ? "bg-blue-500/20 text-blue-400"
                                : log.action === "密码重置"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-purple-500/20 text-purple-400"
                          }`}
                        >
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>{log.username}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{log.details || "-"}</TableCell>
                      <TableCell>{log.ip || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{log.userAgent || "-"}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-white/50">
                      没有找到日志记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>确认清除日志</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要清除所有日志记录吗？此操作无法撤销。</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleClearLogs} variant="destructive">
              确认清除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
