import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./custom-slider.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteDataProvider } from "@/context/SiteDataContext"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "藤原の游戏小站",
  description: "发现最新最热门的游戏，加入我们的游戏社区",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <SiteDataProvider>{children}</SiteDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
