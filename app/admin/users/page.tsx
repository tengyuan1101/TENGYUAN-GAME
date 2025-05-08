"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2, UserIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "user" | "moderator"
  status: "active" | "inactive" | "banned"
  createdAt: string
  lastLogin?: string
  avatar?: string
  favorites?: number[]
  isVerified: boolean
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: "",
    email: "",
    role: "user",
    status: "active",
    isVerified: false,
  })
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // 从localStorage加载用户
    if (typeof window !== "undefined") {
      const storedUsers = localStorage.getItem("users")
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        // 创建一些示例用户
        const sampleUsers: User[] = [
          {
            id: "1",
            username: "admin",
            email: "admin@example.com",
            role: "admin",
            status: "active",
            createdAt: "2023-01-01T00:00:00Z",
            lastLogin: "2023-05-15T10:30:00Z",
            isVerified: true,
            favorites: [1, 3, 5],
          },
          {
            id: "2",
            username: "moderator",
            email: "mod@example.com",
            role: "moderator",
            status: "active",
            createdAt: "2023-02-15T00:00:00Z",
            lastLogin: "2023-05-14T14:20:00Z",
            isVerified: true,
            favorites: [2, 4],
          },
          {
            id: "3",
            username: "user1",
            email: "user1@example.com",
            role: "user",
            status: "active",
            createdAt: "2023-03-10T00:00:00Z",
            lastLogin: "2023-05-10T09:15:00Z",
            isVerified: true,
            favorites: [1, 2, 3],
          },
          {
            id: "4",
            username: "user2",
            email: "user2@example.com",
            role: "user",
            status: "inactive",
            createdAt: "2023-04-05T00:00:00Z",
            isVerified: false,
          },
          {
            id: "5",
            username: "banned_user",
            email: "banned@example.com",
            role: "user",
            status: "banned",
            createdAt: "2023-01-20T00:00:00Z",
            lastLogin: "2023-02-01T11:45:00Z",
            isVerified: true,
          },
        ]
        setUsers(sampleUsers)
        localStorage.setItem("users", JSON.stringify(sampleUsers))
      }
    }
  }, [])

  // 根据搜索和标签过滤用户
  const filteredUsers = users.filter((user) => {
    // 搜索过滤
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // 标签过滤
    if (activeTab === "all") return matchesSearch
    if (activeTab === "admins") return matchesSearch && user.role === "admin"
    if (activeTab === "moderators") return matchesSearch && user.role === "moderator"
    if (activeTab === "users") return matchesSearch && user.role === "user"
    if (activeTab === "active") return matchesSearch && user.status === "active"
    if (activeTab === "inactive") return matchesSearch && user.status === "inactive"
    if (activeTab === "banned") return matchesSearch && user.status === "banned"

    return matchesSearch
  })

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email) return

    const newUserWithId: User = {
      ...(newUser as User),
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      favorites: [],
      isVerified: newUser.isVerified || false,
    }

    const updatedUsers = [...users, newUserWithId]
    setUsers(updatedUsers)

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // 记录操作日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户管理",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: `添加了用户: ${newUser.username}`,
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))
    }

    setIsAddDialogOpen(false)
    setNewUser({
      username: "",
      email: "",
      role: "user",
      status: "active",
      isVerified: false,
    })
  }

  const handleEditUser = () => {
    if (!currentUser || !currentUser.username || !currentUser.email) return

    const updatedUsers = users.map((user) => (user.id === currentUser.id ? currentUser : user))

    setUsers(updatedUsers)

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // 记录操作日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户管理",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: `编辑了用户: ${currentUser.username}`,
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      // 如果当前登录的用户是被编辑的用户，更新当前用户信息
      const currentUserData = localStorage.getItem("currentUser")
      if (currentUserData) {
        const parsedCurrentUser = JSON.parse(currentUserData)
        if (parsedCurrentUser.id === currentUser.id) {
          localStorage.setItem("currentUser", JSON.stringify(currentUser))
        }
      }
    }

    setIsEditDialogOpen(false)
    setCurrentUser(null)
  }

  const handleDeleteUser = () => {
    if (!currentUser) return

    const updatedUsers = users.filter((user) => user.id !== currentUser.id)

    setUsers(updatedUsers)

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers))

      // 记录操作日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户管理",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: `删除了用户: ${currentUser.username}`,
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))
    }

    setIsDeleteDialogOpen(false)
    setCurrentUser(null)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "从未登录"
    const date = new Date(dateString)
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/10">管理员</Badge>
      case "moderator":
        return <Badge className="bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 border-blue-500/10">版主</Badge>
      default:
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/10">用户</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/10">活跃</Badge>
      case "inactive":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 border-yellow-500/10">未激活</Badge>
        )
      case "banned":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30 border-red-500/10">已封禁</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/10">未知</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 transition-all duration-300 transform hover:translate-y-[-2px]"
        >
          <Plus className="h-4 w-4 mr-2" /> 添加用户
        </Button>
      </div>

      {/* 搜索栏和标签 */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="搜索用户名或邮箱..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
              全部
            </TabsTrigger>
            <TabsTrigger
              value="admins"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              管理员
            </TabsTrigger>
            <TabsTrigger
              value="moderators"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              版主
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              普通用户
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 用户列表 */}
      <Card className="bg-black/20 border-white/10 shadow-xl transition-all duration-300 hover:shadow-[#ff6b4a]/10">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold flex items-center">
            <div className="mr-2 p-1.5 rounded-md bg-[#ff6b4a]/20 text-[#ff6b4a]">
              <UserIcon className="h-5 w-5" />
            </div>
            用户列表
          </CardTitle>
          <CardDescription className="text-white/60">管理网站的用户账户，包括管理员、版主和普通用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70">用户名</TableHead>
                  <TableHead className="text-white/70">邮箱</TableHead>
                  <TableHead className="text-white/70">角色</TableHead>
                  <TableHead className="text-white/70">状态</TableHead>
                  <TableHead className="text-white/70">注册时间</TableHead>
                  <TableHead className="text-white/70">最后登录</TableHead>
                  <TableHead className="text-white/70 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/5">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-[#ff6b4a] mr-2">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{user.username}</div>
                            {user.isVerified && <div className="text-xs text-white/50">已验证</div>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-white/70">{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-white/70">{formatDate(user.lastLogin)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentUser(user)
                              setIsEditDialogOpen(true)
                            }}
                            className="text-white/70 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-white/50">
                      没有找到用户
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 添加用户对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>添加用户</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white/70">
                用户名
              </Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70">
                邮箱
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white/70">
                角色
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as "admin" | "user" | "moderator" })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="moderator">版主</SelectItem>
                  <SelectItem value="user">普通用户</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white/70">
                状态
              </Label>
              <Select
                value={newUser.status}
                onValueChange={(value) => setNewUser({ ...newUser, status: value as "active" | "inactive" | "banned" })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-white/10 text-white">
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">未激活</SelectItem>
                  <SelectItem value="banned">已封禁</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isVerified"
                checked={newUser.isVerified}
                onCheckedChange={(checked) => setNewUser({ ...newUser, isVerified: checked })}
              />
              <Label htmlFor="isVerified" className="text-white/70">
                已验证邮箱
              </Label>
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
            <Button onClick={handleAddUser} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑用户对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username" className="text-white/70">
                  用户名
                </Label>
                <Input
                  id="edit-username"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-white/70">
                  邮箱
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role" className="text-white/70">
                  角色
                </Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value) =>
                    setCurrentUser({ ...currentUser, role: value as "admin" | "user" | "moderator" })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="moderator">版主</SelectItem>
                    <SelectItem value="user">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-white/70">
                  状态
                </Label>
                <Select
                  value={currentUser.status}
                  onValueChange={(value) =>
                    setCurrentUser({ ...currentUser, status: value as "active" | "inactive" | "banned" })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="inactive">未激活</SelectItem>
                    <SelectItem value="banned">已封禁</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isVerified"
                  checked={currentUser.isVerified}
                  onCheckedChange={(checked) => setCurrentUser({ ...currentUser, isVerified: checked })}
                />
                <Label htmlFor="edit-isVerified" className="text-white/70">
                  已验证邮箱
                </Label>
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
            <Button onClick={handleEditUser} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              保存
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
            <p>您确定要删除用户 "{currentUser?.username}" 吗？此操作无法撤销。</p>
            {currentUser?.role === "admin" && (
              <p className="mt-2 text-yellow-400">警告：您正在删除一个管理员账户，这可能会影响系统管理功能。</p>
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
            <Button onClick={handleDeleteUser} variant="destructive" className="bg-red-600 hover:bg-red-700">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
