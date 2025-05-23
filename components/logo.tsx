"use client"

import { ppEditorialNewUltralightItalic } from "@/app/fonts"
import { GamepadIcon } from "lucide-react"
import { useSiteData } from "@/context/SiteDataContext"
import { useEffect, useState } from "react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export function Logo({ size = "md", showIcon = true, className = "" }: LogoProps) {
  const { settings } = useSiteData()
  const [siteName, setSiteName] = useState("藤原の游戏小站")
  const [logoUrl, setLogoUrl] = useState("/logo.png")

  useEffect(() => {
    if (settings?.siteName) {
      setSiteName(settings.siteName)
    }

    // 添加这段代码来处理logo URL
    if (settings?.logo) {
      setLogoUrl(settings.logo)
    }
  }, [settings])

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-4xl",
  }

  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && (
        <div className="relative mr-2">
          <div className="absolute inset-0 bg-[#ff6b4a] blur-sm rounded-full opacity-50 animate-pulse-custom"></div>
          <div className="relative bg-gradient-to-br from-[#ff6b4a] to-[#ff9a8b] p-1.5 rounded-full">
            {logoUrl !== "/logo.png" ? (
              <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="h-5 w-5 object-contain" />
            ) : (
              <GamepadIcon className="h-5 w-5 text-white" />
            )}
          </div>
        </div>
      )}
      <h1
        className={`${ppEditorialNewUltralightItalic.className} ${sizeClasses[size]} font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#ff9a8b] tracking-tighter`}
      >
        {siteName}
      </h1>
    </div>
  )
}
