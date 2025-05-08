"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { ppEditorialNewUltralightItalic } from "../fonts"
import { Button } from "@/components/ui/button"
import {
  Home,
  GamepadIcon,
  MessageSquare,
  Users,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  FileText,
  Lock,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // 检查登录状态
  useEffect(() => {
    // 确保代码在客户端运行
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("adminLoggedIn") === "true"
      const storedUsername = localStorage.getItem("adminUsername") || ""

      setIsLoggedIn(loggedIn)
      setUsername(storedUsername)

      // 如果未登录且不在登录页面，重定向到登录页面
      if (!loggedIn && pathname !== "/admin/login" && pathname !== "/admin/reset-password") {
        router.push("/admin/login")
      }
    }
  }, [pathname, router])

  // 处理登出
  const handleLogout = () => {
    // 记录登出日志
    if (typeof window !== "undefined") {
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "登出",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: "用户登出",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))
    }

    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUsername")
    setIsLoggedIn(false)
    router.push("/admin/login")
  }

  // 如果在登录页面或密码重置页面，只渲染子组件
  if (pathname === "/admin/login" || pathname === "/admin/reset-password") {
    return <>{children}</>
  }

  // 如果未登录，不渲染任何内容（等待重定向）
  if (!isLoggedIn) {
    return null
  }

  const navItems = [
    { icon: <Home size={20} />, label: "控制面板", path: "/admin/dashboard" },
    { icon: <GamepadIcon size={20} />, label: "游戏管理", path: "/admin/games" },
    { icon: <MessageSquare size={20} />, label: "评论管理", path: "/admin/comments" },
    { icon: <Users size={20} />, label: "用户管理", path: "/admin/users" },
    { icon: <BarChart size={20} />, label: "数据统计", path: "/admin/statistics" },
    { icon: <FileText size={20} />, label: "系统日志", path: "/admin/logs" },
    { icon: <Settings size={20} />, label: "系统设置", path: "/admin/settings" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a14] to-[#141428] text-white flex">
      {/* 移动端菜单按钮 */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-black/30 text-white hover:bg-black/50"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* 侧边栏 */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-black/50 backdrop-blur-md border-r border-white/10 transition-transform z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-white/10">
          <h1
            className={`${ppEditorialNewUltralightItalic.className} text-xl font-light italic text-[#ff6b4a]/90 tracking-tighter`}
          >
            藤原の游戏小站
          </h1>
          <p className="text-sm text-white/50 mt-1">管理后台</p>
        </div>

        <div className="p-4">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-[#ff6b4a]/20 flex items-center justify-center text-[#ff6b4a]">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{username}</p>
              <p className="text-xs text-white/50">管理员</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full justify-start ${
                  pathname === item.path
                    ? "bg-[#ff6b4a]/10 text-[#ff6b4a] hover:bg-[#ff6b4a]/20"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => {
                  router.push(item.path)
                  setIsSidebarOpen(false)
                }}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Button>
            ))}

            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5"
              onClick={() => {
                router.push("/admin/reset-password")
                setIsSidebarOpen(false)
              }}
            >
              <Lock size={20} />
              <span className="ml-2">修改密码</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-white/70 hover:text-white hover:bg-white/5 mt-4"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="ml-2">退出登录</span>
            </Button>
          </nav>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-4 md:p-6 ml-0 md:ml-64">{children}</div>
    </div>
  )
}
