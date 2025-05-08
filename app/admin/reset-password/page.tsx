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

export default function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()

    // 验证输入
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("请填写所有字段")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("新密码和确认密码不匹配")
      return
    }

    // 验证当前密码
    const defaultPassword = "tengyuan"
    if (currentPassword !== defaultPassword) {
      setError("当前密码不正确")
      return
    }

    // 在实际应用中，这里应该是一个API调用来更新密码
    // 这里我们使用localStorage模拟
    localStorage.setItem("adminPassword", newPassword)

    // 记录密码修改日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "密码重置",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: "密码已成功重置",
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    setSuccess("密码重置成功！")
    setError("")

    // 清空表单
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")

    // 3秒后重定向到仪表盘
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 3000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
      <Card className="w-full max-w-md bg-black/40 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-white">
            <span className={`${ppEditorialNewUltralightItalic.className} text-[#ff6b4a]`}>藤原の游戏小站</span>{" "}
            重置密码
          </CardTitle>
          <CardDescription className="text-center text-white/60">请输入您的当前密码和新密码</CardDescription>
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

          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword" className="text-white/70">
                  当前密码
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="输入当前密码"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword" className="text-white/70">
                  新密码
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="输入新密码"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white/70">
                  确认新密码
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <Button type="submit" className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white">
                重置密码
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/admin/dashboard")} className="text-white/50">
            返回仪表盘
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
