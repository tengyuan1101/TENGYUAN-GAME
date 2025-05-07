"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function TestAuth() {
  const [authStatus, setAuthStatus] = useState<{
    isLoggedIn: boolean
    username: string
    timestamp: string
  } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    const username = localStorage.getItem("adminUsername") || "未知"

    setAuthStatus({
      isLoggedIn,
      username,
      timestamp: new Date().toLocaleString(),
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn")
    localStorage.removeItem("adminUsername")
    setAuthStatus({
      isLoggedIn: false,
      username: "",
      timestamp: new Date().toLocaleString(),
    })
    router.push("/admin/login")
  }

  const handleRefresh = () => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
    const username = localStorage.getItem("adminUsername") || "未知"

    setAuthStatus({
      isLoggedIn,
      username,
      timestamp: new Date().toLocaleString(),
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">登录状态测试</h1>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle>当前登录状态</CardTitle>
          <CardDescription>检查时间: {authStatus?.timestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/70">登录状态:</span>
              <span className={authStatus?.isLoggedIn ? "text-green-500" : "text-red-500"}>
                {authStatus?.isLoggedIn ? "已登录" : "未登录"}
              </span>
            </div>
            {authStatus?.isLoggedIn && (
              <div className="flex justify-between">
                <span className="text-white/70">用户名:</span>
                <span>{authStatus.username}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleRefresh} variant="outline" className="border-white/10">
            刷新状态
          </Button>
          {authStatus?.isLoggedIn && (
            <Button onClick={handleLogout} variant="destructive">
              退出登录
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">测试步骤</h2>
        <ol className="list-decimal list-inside space-y-2 text-white/70">
          <li>
            访问 <code className="bg-black/30 px-2 py-1 rounded">/admin/login</code> 页面
          </li>
          <li>使用任意用户名和密码 "tengyuan" 登录</li>
          <li>登录成功后应自动重定向到仪表盘</li>
          <li>
            尝试访问此测试页面 <code className="bg-black/30 px-2 py-1 rounded">/admin/test-auth</code>
          </li>
          <li>点击"退出登录"按钮，然后尝试直接访问仪表盘，应该被重定向回登录页面</li>
        </ol>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">常见问题排查</h2>
        <ul className="list-disc list-inside space-y-2 text-white/70">
          <li>如果登录后没有自动重定向，请检查浏览器控制台是否有错误</li>
          <li>确保浏览器允许使用 localStorage（隐私模式可能会阻止）</li>
          <li>如果登录状态不正确，尝试清除浏览器缓存和 localStorage</li>
          <li>确保所有管理页面都正确引入了布局组件</li>
        </ul>
      </div>
    </div>
  )
}
