"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FrameComponent } from "./FrameComponent"
import { Switch } from "@/components/ui/switch"

const GRID_SIZE = 12
const CELL_SIZE = 60 // pixels per grid cell

interface Frame {
  id: number
  video: string
  imageUrl: string // 添加图片URL字段
  defaultPos: { x: number; y: number; w: number; h: number }
  mediaSize: number
  autoplayMode: "all" | "hover"
  isHovered: boolean
  title: string
  rating: number
  platform: string
}

// 游戏图片数组
const gameImages = [
  "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1517290/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/601150/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1938090/header.jpg",
  "https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg",
]

// 随机获取图片的函数
const getRandomImage = () => {
  return gameImages[Math.floor(Math.random() * gameImages.length)]
}

const initialFrames: Frame[] = [
  {
    id: 1,
    video:
      "https://assets.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt778f65cedfee54fd/63bcad5b08dfb21202a7794d/VAL_EP_6_1_TRAILER_16x9_27s.mp4",
    imageUrl: getRandomImage(),
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "无畏契约",
    rating: 4.8,
    platform: "PC",
  },
  {
    id: 2,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256919876/movie480_vp9.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "赛博朋克2077",
    rating: 4.5,
    platform: "PC/PS5/Xbox",
  },
  {
    id: 3,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256705156/movie480.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "绝地求生",
    rating: 4.2,
    platform: "PC/Mobile",
  },
  {
    id: 4,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256658589/movie480.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "CS:GO",
    rating: 4.7,
    platform: "PC",
  },
  {
    id: 5,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256801252/movie480_vp9.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "艾尔登法环",
    rating: 4.9,
    platform: "PC/PS5/Xbox",
  },
  {
    id: 6,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256820713/movie480_vp9.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "死亡搁浅",
    rating: 4.6,
    platform: "PC/PS5",
  },
  {
    id: 7,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256743972/movie480.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "怪物猎人世界",
    rating: 4.7,
    platform: "PC/PS4/Xbox",
  },
  {
    id: 8,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256814567/movie480_vp9.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "只狼：影逝二度",
    rating: 4.8,
    platform: "PC/PS4/Xbox",
  },
  {
    id: 9,
    video: "https://cdn.akamai.steamstatic.com/steam/apps/256757119/movie480.webm",
    imageUrl: getRandomImage(),
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
    mediaSize: 1,
    autoplayMode: "all",
    isHovered: false,
    title: "鬼泣5",
    rating: 4.6,
    platform: "PC/PS4/Xbox",
  },
]

export default function DynamicFrameLayout() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames)
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
  const [hoverSize, setHoverSize] = useState(6)
  const [gapSize, setGapSize] = useState(4)
  const [showControls, setShowControls] = useState(false)
  const [cleanInterface, setCleanInterface] = useState(true)
  const [autoplayMode, setAutoplayMode] = useState<"all" | "hover">("hover") // Changed to hover by default
  const [showGameInfo, setShowGameInfo] = useState(true)

  const getRowSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr"
    }
    const { row } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getColSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr"
    }
    const { col } = hovered
    const nonHoveredSize = (12 - hoverSize) / 2
    return [0, 1, 2].map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`)).join(" ")
  }

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom"
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right"
    return `${vertical} ${horizontal}`
  }

  const updateFrameProperty = (id: number, property: keyof Frame, value: number) => {
    setFrames(frames.map((frame) => (frame.id === id ? { ...frame, [property]: value } : frame)))
  }

  const toggleControls = () => {
    setShowControls(!showControls)
  }

  const toggleCleanInterface = () => {
    setCleanInterface(!cleanInterface)
    if (!cleanInterface) {
      setShowControls(false)
    }
  }

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="text-[#ff6b4a]">
          ★
        </span>,
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-[#ff6b4a]">
          ★
        </span>,
      )
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-500">
          ★
        </span>,
      )
    }

    return stars
  }

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoplay-toggle"
              checked={autoplayMode === "all"}
              onCheckedChange={(checked) => setAutoplayMode(checked ? "all" : "hover")}
            />
            <label htmlFor="autoplay-toggle" className="text-sm text-white/70">
              {autoplayMode === "all" ? "全部自动播放" : "悬停时播放"}
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="info-toggle" checked={showGameInfo} onCheckedChange={setShowGameInfo} />
            <label htmlFor="info-toggle" className="text-sm text-white/70">
              {showGameInfo ? "隐藏游戏信息" : "显示游戏信息"}
            </label>
          </div>
        </div>
      </div>
      <div
        className="relative w-full h-full"
        style={{
          display: "grid",
          gridTemplateRows: getRowSizes(),
          gridTemplateColumns: getColSizes(),
          gap: `${gapSize}px`,
          transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
        }}
      >
        {frames.map((frame) => {
          const row = Math.floor(frame.defaultPos.y / 4)
          const col = Math.floor(frame.defaultPos.x / 4)
          const transformOrigin = getTransformOrigin(frame.defaultPos.x, frame.defaultPos.y)
          const isCurrentlyHovered =
            hovered?.row === Math.floor(frame.defaultPos.y / 4) && hovered?.col === Math.floor(frame.defaultPos.x / 4)

          return (
            <motion.div
              key={frame.id}
              className="relative group"
              style={{
                transformOrigin,
                transition: "transform 0.4s ease",
              }}
              onMouseEnter={() => setHovered({ row, col })}
              onMouseLeave={() => setHovered(null)}
            >
              <FrameComponent
                video={frame.video}
                imageUrl={frame.imageUrl}
                width="100%"
                height="100%"
                className="absolute inset-0"
                mediaSize={frame.mediaSize}
                onMediaSizeChange={(value) => updateFrameProperty(frame.id, "mediaSize", value)}
                showControls={showControls && !cleanInterface}
                label={`Frame ${frame.id}`}
                autoplayMode={autoplayMode}
                isHovered={isCurrentlyHovered}
              />

              {/* Game Info Overlay */}
              {showGameInfo && (
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${isCurrentlyHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                >
                  <h3 className="text-white font-bold text-lg">{frame.title}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex">{renderStars(frame.rating)}</div>
                    <span className="ml-2 text-white/70 text-sm">{frame.rating.toFixed(1)}</span>
                  </div>
                  <div className="mt-1">
                    <span className="inline-block px-2 py-0.5 bg-[#ff6b4a]/20 text-[#ff6b4a] text-xs rounded">
                      {frame.platform}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
