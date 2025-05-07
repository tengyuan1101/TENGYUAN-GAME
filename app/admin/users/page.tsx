"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Shield,
  MessageSquare,
  Star,
  CheckSquare,
  Upload,
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { User, UserRole } from "@/types/user"

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  })

  useEffect(() => {
    // In a real application, this would be an API call
    const storedUsers = localStorage.getItem("gameUsers")
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    } else {
      // Generate sample users
      const sampleUsers: User[] = [
        {
          id: 1,
          username: "admin",
          email: "admin@example.com",
          password: "hashed_password",
          role: "admin",
          status: "active",
          registrationDate: "2023-01-15T08:30:00Z",
          lastLogin: "2023-05-20T14:25:00Z",
          avatar: "/placeholder.svg?height=40&width=40",
          bio: "Website administrator",
          permissions: ["all"],
          favoriteGames: [1, 4, 5],
          phoneNumber: "13800138000",
        },
        {
          id: 2,
          username: "gamer123",
          email: "gamer123@example.com",
          password: "hashed_password",
          role: "user",
          status: "active",
          registrationDate: "2023-02-10T10:15:00Z",
          lastLogin: "2023-05-19T18:45:00Z",
          avatar: "/placeholder.svg?height=40&width=40",
          bio: "Passionate gamer who loves RPGs and strategy games",
          permissions: ["comment", "rate"],
          favoriteGames: [2, 5, 8],
          phoneNumber: "13900139000",
        },
        {
          id: 3,
          username: "moderator",
          email: "mod@example.com",
          password: "hashed_password",
          role: "moderator",
          status: "active",
          registrationDate: "2023-01-20T09:45:00Z",
          lastLogin: "2023-05-20T11:30:00Z",
          avatar: "/placeholder.svg?height=40&width=40",
          bio: "Community moderator",
          permissions: ["comment", "rate", "moderate_comments"],
          favoriteGames: [1, 3, 6],
          phoneNumber: "13700137000",
        },
        {
          id: 4,
          username: "newuser",
          email: "new@example.com",
          password: "hashed_password",
          role: "user",
          status: "pending",
          registrationDate: "2023-05-18T16:20:00Z",
          lastLogin: "2023-05-18T16:25:00Z",
          avatar: "/placeholder.svg?height=40&width=40",
          bio: "Just joined!",
          permissions: ["comment"],
          favoriteGames: [],
          phoneNumber: "13600136000",
        },
        {
          id: 5,
          username: "blockeduser",
          email: "blocked@example.com",
          password: "hashed_password",
          role: "user",
          status: "blocked",
          registrationDate: "2023-03-05T14:10:00Z",
          lastLogin: "2023-05-10T09:15:00Z",
          avatar: "/placeholder.svg?height=40&width=40",
          bio: "This account has been blocked for violating community guidelines",
          permissions: [],
          favoriteGames: [2, 7],
          phoneNumber: "13500135000",
        },
      ]
      setUsers(sampleUsers)
      localStorage.setItem("gameUsers", JSON.stringify(sampleUsers))
    }
  }, [])

  // Filter users
  const filteredUsers = users.filter((user) => {
    // Search filter
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    // Role filter
    const matchesRole = filterRole === "all" || user.role === filterRole

    return matchesSearch && matchesRole
  })

  // Format date
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

  // Handle user status change
  const handleStatusChange = (userId: number, status: "active" | "pending" | "blocked") => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, status } : user))
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
  }

  // Handle user role change
  const handleRoleChange = (userId: number, role: UserRole) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role } : user))
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
  }

  // Handle add user
  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) return

    const newUserId = users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1
    const currentDate = new Date().toISOString()

    const userToAdd: User = {
      id: newUserId,
      username: newUser.username || "",
      email: newUser.email || "",
      password: newUser.password || "", // In a real app, this would be hashed
      role: (newUser.role as UserRole) || "user",
      status: (newUser.status as "active" | "pending" | "blocked") || "active",
      registrationDate: currentDate,
      lastLogin: currentDate,
      avatar: "/placeholder.svg?height=40&width=40",
      bio: newUser.bio || "",
      permissions: newUser.role === "admin" ? ["all"] : ["comment", "rate"],
      favoriteGames: [],
      phoneNumber: newUser.phoneNumber || "",
    }

    const updatedUsers = [...users, userToAdd]
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
    setIsAddDialogOpen(false)
    setNewUser({
      username: "",
      email: "",
      password: "",
      role: "user",
      status: "active",
    })
  }

  // Handle edit user
  const handleEditUser = () => {
    if (!currentUser) return

    const updatedUsers = users.map((user) => (user.id === currentUser.id ? currentUser : user))
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
    setIsEditDialogOpen(false)
    setCurrentUser(null)
  }

  // Handle delete user
  const handleDeleteUser = () => {
    if (!currentUser) return

    const updatedUsers = users.filter((user) => user.id !== currentUser.id)
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
    setIsDeleteDialogOpen(false)
    setCurrentUser(null)
  }

  // Handle permission update
  const handlePermissionUpdate = () => {
    if (!currentUser) return

    const updatedUsers = users.map((user) => (user.id === currentUser.id ? currentUser : user))
    setUsers(updatedUsers)
    localStorage.setItem("gameUsers", JSON.stringify(updatedUsers))
    setIsPermissionDialogOpen(false)
    setCurrentUser(null)
  }

  // Toggle permission
  const togglePermission = (permission: string) => {
    if (!currentUser) return

    let updatedPermissions = [...(currentUser.permissions || [])]

    if (permission === "all") {
      updatedPermissions = ["all"]
    } else {
      // Remove "all" if it exists
      updatedPermissions = updatedPermissions.filter((p) => p !== "all")

      // Toggle the specific permission
      if (updatedPermissions.includes(permission)) {
        updatedPermissions = updatedPermissions.filter((p) => p !== permission)
      } else {
        updatedPermissions.push(permission)
      }
    }

    setCurrentUser({
      ...currentUser,
      permissions: updatedPermissions,
    })
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">活跃</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">待验证</Badge>
      case "blocked":
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/30">已封禁</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">未知</Badge>
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">管理员</Badge>
      case "moderator":
        return <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">版主</Badge>
      case "vip":
        return <Badge className="bg-[#ff6b4a]/20 text-[#ff6b4a] hover:bg-[#ff6b4a]/30">VIP会员</Badge>
      case "user":
        return <Badge className="bg-white/10 text-white/70 hover:bg-white/20">普通用户</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30">未知</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <Plus className="h-4 w-4 mr-2" /> 添加用户
        </Button>
      </div>

      {/* Filter and search */}
      <div className="flex flex-col md:flex-row gap-4">
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
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="选择角色" />
          </SelectTrigger>
          <SelectContent className="bg-black/90 border-white/10 text-white">
            <SelectItem value="all">全部角色</SelectItem>
            <SelectItem value="admin">管理员</SelectItem>
            <SelectItem value="moderator">版主</SelectItem>
            <SelectItem value="vip">VIP会员</SelectItem>
            <SelectItem value="user">普通用户</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users list */}
      <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">ID</TableHead>
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-white/5">
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-white/70">{formatDate(user.registrationDate)}</TableCell>
                  <TableCell className="text-white/70">{formatDate(user.lastLogin)}</TableCell>
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
                            setCurrentUser(user)
                            setIsViewDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" /> 查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentUser(user)
                            setIsEditDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" /> 编辑用户
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentUser(user)
                            setIsPermissionDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Shield className="h-4 w-4 mr-2" /> 权限设置
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentUser(user)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-500 hover:bg-red-900/20 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> 删除用户
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-white/50">
                    没有找到符合条件的用户
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add user dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加新用户</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white/70">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-white/70">
                  手机号码
                </Label>
                <Input
                  id="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white/70">
                  角色
                </Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="admin">管理员</SelectItem>
                    <SelectItem value="moderator">版主</SelectItem>
                    <SelectItem value="vip">VIP会员</SelectItem>
                    <SelectItem value="user">普通用户</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white/70">
                  状态
                </Label>
                <Select value={newUser.status} onValueChange={(value) => setNewUser({ ...newUser, status: value })}>
                  <SelectTrigger id="status" className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="active">活跃</SelectItem>
                    <SelectItem value="pending">待验证</SelectItem>
                    <SelectItem value="blocked">已封禁</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-white/70">
                个人简介
              </Label>
              <Textarea
                id="bio"
                value={newUser.bio}
                onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
              />
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
              添加用户
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit user dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-white/70">
                    重置密码 (留空则不修改)
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="输入新密码"
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, password: e.target.value || currentUser.password })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phoneNumber" className="text-white/70">
                    手机号码
                  </Label>
                  <Input
                    id="edit-phoneNumber"
                    value={currentUser.phoneNumber}
                    onChange={(e) => setCurrentUser({ ...currentUser, phoneNumber: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role" className="text-white/70">
                    角色
                  </Label>
                  <Select
                    value={currentUser.role}
                    onValueChange={(value) => setCurrentUser({ ...currentUser, role: value as UserRole })}
                  >
                    <SelectTrigger id="edit-role" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择角色" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      <SelectItem value="admin">管理员</SelectItem>
                      <SelectItem value="moderator">版主</SelectItem>
                      <SelectItem value="vip">VIP会员</SelectItem>
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
                      setCurrentUser({ ...currentUser, status: value as "active" | "pending" | "blocked" })
                    }
                  >
                    <SelectTrigger id="edit-status" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/10 text-white">
                      <SelectItem value="active">活跃</SelectItem>
                      <SelectItem value="pending">待验证</SelectItem>
                      <SelectItem value="blocked">已封禁</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bio" className="text-white/70">
                  个人简介
                </Label>
                <Textarea
                  id="edit-bio"
                  value={currentUser.bio}
                  onChange={(e) => setCurrentUser({ ...currentUser, bio: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
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
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View user dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <img
                      src={currentUser.avatar || "/placeholder.svg"}
                      alt={currentUser.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{currentUser.username}</h3>
                    <div className="flex items-center mt-1">
                      {getRoleBadge(currentUser.role)}
                      {getStatusBadge(currentUser.status)}
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="bg-black/20 border border-white/10">
                      <TabsTrigger
                        value="basic"
                        className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                      >
                        基本信息
                      </TabsTrigger>
                      <TabsTrigger
                        value="activity"
                        className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                      >
                        活动记录
                      </TabsTrigger>
                      <TabsTrigger
                        value="games"
                        className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
                      >
                        收藏游戏
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="basic" className="mt-4 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">用户ID:</div>
                        <div>{currentUser.id}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">邮箱:</div>
                        <div>{currentUser.email}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">手机号码:</div>
                        <div>{currentUser.phoneNumber || "未设置"}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">注册时间:</div>
                        <div>{formatDate(currentUser.registrationDate)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">最后登录:</div>
                        <div>{formatDate(currentUser.lastLogin)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-white/50 text-sm">个人简介:</div>
                        <div>{currentUser.bio || "未设置"}</div>
                      </div>
                    </TabsContent>
                    <TabsContent value="activity" className="mt-4">
                      <div className="text-center py-6 text-white/50">
                        <p>暂无活动记录</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="games" className="mt-4">
                      {currentUser.favoriteGames && currentUser.favoriteGames.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {currentUser.favoriteGames.map((gameId) => (
                            <div key={gameId} className="bg-white/5 p-2 rounded-md">
                              游戏 ID: {gameId}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-white/50">
                          <p>暂无收藏游戏</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>权限设置</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="py-4">
              <div className="mb-4">
                <p className="text-sm text-white/70 mb-2">用户: {currentUser.username}</p>
                <p className="text-sm text-white/70">角色: {getRoleBadge(currentUser.role)}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="permission-all" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-purple-400" />
                    所有权限
                  </Label>
                  <Switch
                    id="permission-all"
                    checked={currentUser.permissions?.includes("all")}
                    onCheckedChange={() => togglePermission("all")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="permission-comment" className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-400" />
                    评论权限
                  </Label>
                  <Switch
                    id="permission-comment"
                    checked={currentUser.permissions?.includes("comment") || currentUser.permissions?.includes("all")}
                    onCheckedChange={() => togglePermission("comment")}
                    disabled={currentUser.permissions?.includes("all")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="permission-rate" className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-400" />
                    评分权限
                  </Label>
                  <Switch
                    id="permission-rate"
                    checked={currentUser.permissions?.includes("rate") || currentUser.permissions?.includes("all")}
                    onCheckedChange={() => togglePermission("rate")}
                    disabled={currentUser.permissions?.includes("all")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="permission-moderate" className="flex items-center">
                    <CheckSquare className="h-4 w-4 mr-2 text-green-400" />
                    内容审核权限
                  </Label>
                  <Switch
                    id="permission-moderate"
                    checked={
                      currentUser.permissions?.includes("moderate_comments") || currentUser.permissions?.includes("all")
                    }
                    onCheckedChange={() => togglePermission("moderate_comments")}
                    disabled={currentUser.permissions?.includes("all")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="permission-upload" className="flex items-center">
                    <Upload className="h-4 w-4 mr-2 text-[#ff6b4a]" />
                    上传权限
                  </Label>
                  <Switch
                    id="permission-upload"
                    checked={currentUser.permissions?.includes("upload") || currentUser.permissions?.includes("all")}
                    onCheckedChange={() => togglePermission("upload")}
                    disabled={currentUser.permissions?.includes("all")}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPermissionDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handlePermissionUpdate} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              保存权限
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除用户 "{currentUser?.username}" 吗？此操作无法撤销。</p>
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
