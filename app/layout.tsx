import "./globals.css"
import { ppEditorialNewUltralightItalic, inter } from "./fonts"
import { ThemeProvider } from "@/components/theme-provider"
import type React from "react"

export const metadata = {
  title: "藤原の游戏小站 - 探索游戏世界",
  description: "发现最新最热门的游戏，加入我们的游戏社区",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
