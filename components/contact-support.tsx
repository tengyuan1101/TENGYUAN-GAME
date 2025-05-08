"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, X, Send, CheckCircle } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function ContactSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 模拟提交
    setTimeout(() => {
      // 记录联系请求
      if (typeof window !== "undefined") {
        const contactRequests = JSON.parse(localStorage.getItem("contactRequests") || "[]")
        contactRequests.push({
          name,
          email,
          message,
          timestamp: new Date().toISOString(),
          status: "pending",
        })
        localStorage.setItem("contactRequests", JSON.stringify(contactRequests))
      }

      setIsSubmitting(false)
      setIsSubmitted(true)

      // 重置表单
      setTimeout(() => {
        setName("")
        setEmail("")
        setMessage("")
        setIsSubmitted(false)
        setIsOpen(false)
      }, 3000)
    }, 1500)
  }

  return (
    <>
      {/* 悬浮按钮 */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 z-50 flex items-center justify-center animate-pulse-custom"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* 联系表单 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-0">
          <Card className="w-full max-w-md mx-auto bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="absolute right-2 top-2 text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black"
              >
                <X className="h-4 w-4" />
              </Button>
              <CardTitle className="text-xl flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-[#ff6b4a]" />
                联系客服
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">提交成功！</h3>
                  <p className="text-center text-white/70 dark:text-black/70">感谢您的反馈，我们会尽快回复您。</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70 dark:text-black/70">
                      您的姓名
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70 dark:text-black/70">
                      电子邮箱
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-white/70 dark:text-black/70">
                      您的问题或反馈
                    </Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={4}
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black"
                    />
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter>
              {!isSubmitted && (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !name || !email || !message}
                  className="w-full bg-[#ff6b4a] hover:bg-[#ff6b4a]/90"
                >
                  {isSubmitting ? (
                    "提交中..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" /> 提交
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
