"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HeadphonesIcon, Send, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ContactSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  // 检查是否已登录，获取用户信息
  const getUserInfo = () => {
    if (typeof window !== "undefined") {
      try {
        const userLoggedIn = localStorage.getItem("userLoggedIn") === "true"
        if (userLoggedIn) {
          const user = JSON.parse(localStorage.getItem("currentUser") || "{}")
          if (user && user.username) {
            setName(user.username)
          }
          if (user && user.email) {
            setEmail(user.email)
          }
        }
      } catch (e) {
        console.error("获取用户信息错误:", e)
      }
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    getUserInfo()
    setSuccess(false)
    setError("")
  }

  const handleClose = () => {
    setIsOpen(false)
    if (success) {
      setName("")
      setEmail("")
      setMessage("")
      setSubject("")
      setSuccess(false)
      setError("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)
    setError("")

    // 验证
    if (!name || !email || !subject || !message) {
      setError("请填写所有必填字段")
      setIsSending(false)
      return
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("请输入有效的邮箱地址")
      setIsSending(false)
      return
    }

    // 模拟提交
    setTimeout(() => {
      try {
        // 在实际应用中，这里会发送API请求

        // 记录联系记录
        const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
        logs.push({
          action: "客服咨询",
          username: name,
          timestamp: new Date().toISOString(),
          details: `主题: ${subject}`,
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
        })
        localStorage.setItem("adminLogs", JSON.stringify(logs))

        setSuccess(true)
        setIsSending(false)
      } catch (err) {
        setError("提交失败，请稍后再试")
        setIsSending(false)
      }
    }, 1000)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white rounded-full p-3 shadow-lg"
        size="icon"
      >
        <HeadphonesIcon className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black/90 backdrop-blur-md border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <HeadphonesIcon className="mr-2 h-5 w-5 text-[#ff6b4a]" />
              联系客服
            </DialogTitle>
            <DialogDescription className="text-white/60">填写下面的表单，我们将尽快回复您的咨询。</DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">消息已发送</h3>
              <p className="text-white/70">感谢您的反馈，我们会尽快回复您！</p>
              <Button onClick={handleClose} className="mt-4 bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
                关闭
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert variant="destructive" className="mb-4 bg-red-900/20 border-red-900/50 text-red-300">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70">
                      姓名
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="请输入您的姓名"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="请输入您的邮箱"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-white/70">
                    主题
                  </Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="请输入咨询主题"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white/70">
                    消息内容
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="请详细描述您的问题或建议..."
                    className="bg-white/5 border-white/10 text-white min-h-[120px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleClose} className="border-white/10 text-white/70">
                  <X className="mr-2 h-4 w-4" />
                  取消
                </Button>
                <Button type="submit" className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90" disabled={isSending}>
                  {isSending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      发送中...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      发送
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
