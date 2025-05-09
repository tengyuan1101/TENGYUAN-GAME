"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

const bannerImages = [
  {
    id: 1,
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
    title: "无畏契约",
    description: "5v5 角色战术射击游戏",
    link: "#",
  },
  {
    id: 2,
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
    title: "艾尔登法环",
    description: "开放世界动作角色扮演游戏",
    link: "#",
  },
  {
    id: 3,
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
    title: "赛博朋克2077",
    description: "开放世界动作冒险RPG游戏",
    link: "#",
  },
  {
    id: 4,
    imageUrl: "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
    title: "黑神话：悟空",
    description: "国产动作角色扮演游戏",
    link: "#",
  },
]

export default function CarouselBanner() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [favorites, setFavorites] = useState<number[]>([])
  const slides = bannerImages

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const toggleFavorite = (slideId: number) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(slideId)) {
        return prevFavorites.filter((id) => id !== slideId)
      } else {
        return [...prevFavorites, slideId]
      }
    })
  }

  const isFavorite = (slideId: number) => {
    return favorites.includes(slideId)
  }

  const onSlideClick = (slide: any) => {
    window.location.href = slide.link
  }

  // 美化轮播页
  return (
    <div className="carousel-container mb-8 relative rounded-xl overflow-hidden shadow-lg">
      <div className="relative aspect-[21/9] overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="carousel-slide min-w-full h-full relative">
              <img
                src={slide.imageUrl || "/placeholder.svg"}
                alt={slide.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="carousel-content absolute bottom-0 left-0 right-0 p-8 z-10">
                <div className="inline-block px-3 py-1 bg-[#ff6b4a] text-white text-sm font-medium rounded-full mb-4 shadow-md">
                  精选推荐
                </div>
                <h2 className="carousel-title text-3xl md:text-4xl font-bold text-white mb-2">{slide.title}</h2>
                <p className="carousel-description text-white/80 text-lg mb-6 max-w-2xl line-clamp-2 md:line-clamp-3">
                  {slide.description}
                </p>
                <div className="flex space-x-4">
                  <Button
                    className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => onSlideClick(slide)}
                  >
                    了解详情
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => toggleFavorite(slide.id)}
                  >
                    {isFavorite(slide.id) ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 fill-[#ff6b4a] text-[#ff6b4a]" /> 已收藏
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" /> 收藏
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 导航按钮 */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
          onClick={prevSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 transition-all duration-300 hover:scale-110"
          onClick={nextSlide}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        {/* 指示器 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? "bg-[#ff6b4a] w-6" : "bg-white/50 hover:bg-white/80"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
