"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ppEditorialNewUltralightItalic } from "../fonts"
import type { User } from "@/types/user"

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!usernameOrEmail || !password) {
      setError("请输入用户名/邮箱和密码")
      return
    }

    // 获取用户列表
    const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]

    // 查找用户
    const user = users.find(
      (user) => (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password,
    )

    if (user) {
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

      // 重定向到首页
      router.push("/")
    } else {
      setError("用户名/邮箱或密码不正确")
    }
  }

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
