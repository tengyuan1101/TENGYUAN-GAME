"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden rounded-full transition-all duration-300 hover:bg-[#ff6b4a]/20 text-white/80 hover:text-[#ff6b4a]"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5 transition-transform duration-300 ease-in-out transform hover:rotate-90" />
          ) : (
            <Moon className="h-5 w-5 transition-transform duration-300 ease-in-out transform hover:rotate-90" />
          )}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-black/90 border-white/10 text-white backdrop-blur-md animate-in fade-in-80 slide-in-from-top-5"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
        >
          <Sun className="mr-2 h-4 w-4" />
          <span>浅色</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
        >
          <Moon className="mr-2 h-4 w-4" />
          <span>深色</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-white/10 cursor-pointer transition-colors duration-200"
        >
          <Laptop className="mr-2 h-4 w-4" />
          <span>跟随系统</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
