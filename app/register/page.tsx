"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ppEditorialNewUltralightItalic } from "../fonts"
import type { User } from "@/types/user"

// 在文件顶部添加这个检查函数
function isClient() {
  return typeof window !== "undefined"
}

export default function Register() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [enableRegistration, setEnableRegistration] = useState(true)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!username || !email || !password || !confirmPassword) {
      setError("请填写所有字段")
      return
    }

    if (password !== confirmPassword) {
      setError("两次输入的密码不匹配")
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址")
      return
    }

    // 确保在客户端环境
    if (isClient()) {
      // 检查用户名是否已存在
      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
      if (users.some((user) => user.username === username)) {
        setError("用户名已被使用")
        return
      }

      // 检查邮箱是否已存在
      if (users.some((user) => user.email === email)) {
        setError("邮箱已被注册")
        return
      }

      // 创建新用户
      const newUser: User = {
        id: Date.now(),
        username,
        email,
        password, // 注意：实际应用中应该对密码进行加密
        createdAt: new Date().toISOString(),
        role: "user",
        favorites: [],
      }

      // 保存用户
      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      // 记录注册日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户注册",
        username: username,
        timestamp: new Date().toISOString(),
        details: "新用户注册",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))
    }

    setSuccess("注册成功！正在跳转到登录页面...")
    setError("")

    // 清空表单
    setUsername("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")

    // 3秒后重定向到登录页面
    setTimeout(() => {
      router.push("/login")
    }, 3000)
  }

  // 添加 useEffect 钩子来读取 localStorage
  useEffect(() => {
    if (isClient()) {
      const siteSettings = JSON.parse(localStorage.getItem("siteSettings") || "{}")
      setEnableRegistration(siteSettings.enableRegistration !== false) // 默认为true
    }
  }, [])

  if (!enableRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
        <Card className="w-full max-w-md bg-black/40 border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              <span className={`${ppEditorialNewUltralightItalic.className} text-[#ff6b4a]`}>藤原の游戏小站</span>
            </CardTitle>
            <CardDescription className="text-center text-white/60">注册功能已关闭</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-yellow-900/20 border-yellow-900/50 text-yellow-300">
              <AlertDescription>管理员已暂时关闭注册功能，请稍后再试。</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild className="text-white/70">
              <Link href="/login">返回登录</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            <span className={`${ppEditorialNewUltralightItalic.className} text-[#ff6b4a]`}>藤原の游戏小站</span> 注册
          </CardTitle>
          <CardDescription className="text-center text-white/60">创建您的账号，开始游戏之旅</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-900/20 border-green-900/50 text-green-300">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-white/70">
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/70">
                  电子邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white/70">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white/70">
                  确认密码
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button type="submit" className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white">
                注册
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-white/50">
            已有账号？
            <Button variant="link" asChild className="text-[#ff6b4a] p-0 h-auto ml-1">
              <Link href="/login">登录</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
