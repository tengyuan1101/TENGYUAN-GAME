"use client"

import { useEffect, useState } from "react"
import { Logo } from "./logo"
import { useSiteData } from "@/context/SiteDataContext"

export function Footer() {
  const { settings } = useSiteData()
  const [footerText, setFooterText] = useState("© 2023 藤原の游戏小站. 保留所有权利。")
  const [icp, setIcp] = useState("京ICP备XXXXXXXX号")

  useEffect(() => {
    if (settings) {
      setFooterText(settings.footerText)
      setIcp(settings.icp)
    }
  }, [settings])

  return (
    <footer className="bg-black/30 border-t border-white/10 py-6 mt-10 dark:bg-white/10 dark:border-black/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <Logo size="sm" />
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black">
              关于我们
            </a>
            <a href="#" className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black">
              使用条款
            </a>
            <a href="#" className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black">
              隐私政策
            </a>
            <a href="#" className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black">
              联系我们
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-white/30 dark:text-black/30 text-xs">{icp}</div>
        <div className="mt-2 text-center text-white/50 dark:text-black/50 text-sm">{footerText}</div>
      </div>
    </footer>
  )
}
