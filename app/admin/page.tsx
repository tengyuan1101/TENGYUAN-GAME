"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("adminLoggedIn") === "true"

    if (isLoggedIn) {
      // 如果已登录，跳转到仪表盘
      router.push("/admin/dashboard")
    } else {
      // 如果未登录，跳转到登录页面
      router.push("/admin/login")
    }
  }, [router])

  // 显示加载状态
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428]">
      <div className="loading-spinner"></div>
    </div>
  )
}
