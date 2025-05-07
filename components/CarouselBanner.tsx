"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface CarouselItem {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  active: boolean
  order: number
}

const defaultBannerImages = [
  {
    id: 1,
    title: "无畏契约",
    description: "5v5 角色战术射击游戏",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
    link: "#",
    active: true,
    order: 1,
  },
  {
    id: 2,
    title: "艾尔登法环",
    description: "开放世界动作角色扮演游戏",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    link: "#",
    active: true,
    order: 2,
  },
  {
    id: 3,
    title: "赛博朋克2077",
    description: "开放世界动作冒险RPG游戏",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    link: "#",
    active: true,
    order: 3,
  },
  {
    id: 4,
    title: "黑神话：悟空",
    description: "国产动作角色扮演游戏",
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
    link: "#",
    active: true,
    order: 4,
  },
]

export default function CarouselBanner() {
  const [bannerImages, setBannerImages] = useState<CarouselItem[]>(defaultBannerImages)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    // Load carousel items from localStorage
    const storedItems = localStorage.getItem("carouselItems")
    if (storedItems) {
      const items = JSON.parse(storedItems) as CarouselItem[]
      // Filter active items and sort by order
      const activeItems = items.filter((item) => item.active).sort((a, b) => a.order - b.order)
      if (activeItems.length > 0) {
        setBannerImages(activeItems)
      }
    }
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length)
  }

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl mb-6">
      {/* Carousel content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <img
              src={bannerImages[currentIndex].imageUrl || "/placeholder.svg"}
              alt={bannerImages[currentIndex].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{bannerImages[currentIndex].title}</h2>
              <p className="text-white/70 text-lg mb-4">{bannerImages[currentIndex].description}</p>
              <Button
                className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white"
                onClick={() => (window.location.href = bannerImages[currentIndex].link)}
              >
                了解更多
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-[#ff6b4a]" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}
