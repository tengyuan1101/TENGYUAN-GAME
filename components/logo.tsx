import { ppEditorialNewUltralightItalic } from "@/app/fonts"
import { GamepadIcon } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
  className?: string
}

export function Logo({ size = "md", showIcon = true, className = "" }: LogoProps) {
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
            <GamepadIcon className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
      <h1
        className={`${ppEditorialNewUltralightItalic.className} ${sizeClasses[size]} font-light italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b4a] to-[#ff9a8b] tracking-tighter`}
      >
        藤原の游戏小站
      </h1>
    </div>
  )
}
