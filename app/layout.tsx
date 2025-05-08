import "./globals.css"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "藤原の游戏小站 - 探索游戏世界",
  description: "发现最新最热门的游戏，加入我们的游戏社区，体验丰富的游戏内容与社区互动",
  keywords: "游戏,电子游戏,游戏社区,游戏下载,游戏评测,游戏推荐",
  authors: [{ name: "藤原", url: "https://example.com" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning className={`${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="theme">
          <div className="page-transition">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
