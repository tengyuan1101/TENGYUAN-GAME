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

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [success, setSuccess] = useState("")
  const router = useRouter()

  // 修改所有直接访问 localStorage 的地方，确保在客户端环境中执行
  // 例如，在 handleLogin 函数中：

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!usernameOrEmail || !password) {
      setError("请输入用户名/邮箱和密码")
      return
    }

    // 确保在客户端环境
    if (isClient()) {
      const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
      const user = users.find(
        (user) => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password,
      )

      if (!user) {
        setError("用户名/邮箱或密码不正确")
        return
      }

      // 记录登录日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "用户登录",
        username: user.username,
        timestamp: new Date().toISOString(),
        details: "用户成功登录",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      // 存储登录状态
      localStorage.setItem("userLoggedIn", "true")
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          favorites: user.favorites,
        }),
      )

      // 如果选择了"记住我"，设置持久登录
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
        localStorage.setItem("rememberedUser", JSON.stringify({ username: usernameOrEmail, password }))
      } else {
        localStorage.removeItem("rememberMe")
        localStorage.removeItem("rememberedUser")
      }

      setSuccess("登录成功！正在跳转...")
      setError("")

      // 清空表单
      setUsernameOrEmail("")
      setPassword("")

      // 3秒后重定向到首页
      setTimeout(() => {
        router.push("/")
      }, 1500)
    }
  }

  // 同样，修改 useEffect 钩子中的 localStorage 访问
  useEffect(() => {
    if (isClient()) {
      // 检查是否有记住的用户
      const rememberMeFlag = localStorage.getItem("rememberMe")
      if (rememberMeFlag === "true") {
        const rememberedUser = JSON.parse(localStorage.getItem("rememberedUser") || "{}")
        if (rememberedUser.username && rememberedUser.password) {
          setUsernameOrEmail(rememberedUser.username)
          setPassword(rememberedUser.password)
          setRememberMe(true)
        }
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            <span className={`${ppEditorialNewUltralightItalic.className} text-[#ff6b4a]`}>藤原の游戏小站</span> 登录
          </CardTitle>
          <CardDescription className="text-center text-white/60">登录您的账号，继续游戏之旅</CardDescription>
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

          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usernameOrEmail" className="text-white/70">
                  用户名或邮箱
                </Label>
                <Input
                  id="usernameOrEmail"
                  type="text"
                  placeholder="输入用户名或邮箱"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/70">
                    密码
                  </Label>
                  <Button variant="link" asChild className="text-[#ff6b4a] p-0 h-auto">
                    <Link href="/forgot-password">忘记密码？</Link>
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="bg-white/5 border-white/10 text-white focus:ring-0 focus:ring-offset-0"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-white/70"
                >
                  记住我
                </Label>
              </div>
              <Button type="submit" className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white">
                登录
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-white/50">
            没有账号？
            <Button variant="link" asChild className="text-[#ff6b4a] p-0 h-auto ml-1">
              <Link href="/register">注册</Link>
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
