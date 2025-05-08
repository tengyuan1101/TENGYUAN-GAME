"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ppEditorialNewUltralightItalic } from "@/app/fonts"
import { Github, Heart, Linkedin, Mail, Twitter } from "lucide-react"

export function Footer() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "藤原の游戏小站",
    footerText: "© 2023 藤原の游戏小站. 保留所有权利。",
    icp: "京ICP备XXXXXXXX号",
  })

  useEffect(() => {
    // 从本地存储加载网站设置
    try {
      const storedSettings = localStorage.getItem("siteSettings")
      if (storedSettings) {
        setSiteSettings(JSON.parse(storedSettings))
      }
    } catch (error) {
      console.error("加载设置失败:", error)
    }
  }, [])

  return (
    <footer className="bg-black/30 backdrop-blur-md border-t border-white/10 py-10 mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 第一列 - Logo和描述 */}
          <div className="col-span-1 md:col-span-1">
            <div
              className={`${ppEditorialNewUltralightItalic.className} text-xl font-light italic text-[#ff6b4a]/90 tracking-tighter mb-4`}
            >
              {siteSettings.siteName}
            </div>
            <p className="text-white/70 text-sm">发现最新最热门的游戏，加入我们的游戏社区，探索无限游戏世界。</p>
            <div className="flex space-x-3 mt-6">
              <a href="#" className="text-white/50 hover:text-[#ff6b4a] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-[#ff6b4a] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-[#ff6b4a] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/50 hover:text-[#ff6b4a] transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 第二列 - 游戏分类 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-semibold mb-4">游戏分类</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  动作游戏
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  角色扮演
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  射击游戏
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  策略游戏
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  模拟游戏
                </Link>
              </li>
            </ul>
          </div>

          {/* 第三列 - 快速链接 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-semibold mb-4">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  登录
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  注册
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  管理后台
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-[#ff6b4a] transition-colors">
                  关于我们
                </Link>
              </li>
            </ul>
          </div>

          {/* 第四列 - 订阅 */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-semibold mb-4">订阅最新消息</h3>
            <p className="text-white/70 text-sm mb-4">订阅我们的通讯，获取最新游戏资讯和独家优惠。</p>
            <div className="flex">
              <input
                type="email"
                placeholder="输入您的邮箱"
                className="bg-white/10 border border-white/10 rounded-l-md px-4 py-2 text-white text-sm flex-1 focus:outline-none focus:border-[#ff6b4a]/50"
              />
              <button className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white rounded-r-md px-4 py-2 text-sm transition-colors">
                订阅
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            {siteSettings.footerText}{" "}
            <span className="inline-flex items-center">
              Made with <Heart className="h-3 w-3 text-[#ff6b4a] mx-1" /> by 藤原
            </span>
          </div>
          <div className="text-white/30 text-xs">{siteSettings.icp}</div>
        </div>
      </div>
    </footer>
  )
}
