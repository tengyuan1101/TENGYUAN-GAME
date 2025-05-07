"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ppEditorialNewUltralightItalic } from "../../fonts"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // 简单的验证
    if (!username || !password) {
      setError("请输入用户名和密码")
      return
    }

    // 检查凭据 - 在实际应用中，这应该是一个安全的API调用
    if (password === "tengyuan") {
      // 存储登录状态
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminUsername", username)
      setError("")

      // 添加一个短暂的延迟，确保localStorage更新后再重定向
      setTimeout(() => {
        // 重定向到管理面板
        router.push("/admin/dashboard")
      }, 100)
    } else {
      setError("用户名或密码不正确")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            <span className={`${ppEditorialNewUltralightItalic.className} text-[#ff6b4a]`}>藤原の游戏小站</span>{" "}
            管理后台
          </CardTitle>
          <CardDescription className="text-center text-white/60">请输入您的管理员凭据登录</CardDescription>
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
                <Label htmlFor="username" className="text-white/70">
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="管理员用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  placeholder="管理员密码"
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
          <p className="text-sm text-white/50">默认密码: tengyuan</p>
        </CardFooter>
      </Card>
    </div>
  )
}
