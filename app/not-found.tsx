import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ppEditorialNewUltralightItalic } from "./fonts"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a14] to-[#141428] p-4">
      <div className="text-center">
        <h1 className={`${ppEditorialNewUltralightItalic.className} text-6xl font-light italic text-[#ff6b4a] mb-4`}>
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white mb-4">页面未找到</h2>
        <p className="text-white/70 mb-8 max-w-md">
          抱歉，您访问的页面不存在或已被移除。请返回首页继续浏览其他精彩内容。
        </p>
        <Button asChild className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <Link href="/">返回首页</Link>
        </Button>
      </div>
    </div>
  )
}
