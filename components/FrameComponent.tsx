"use client"
import { Slider } from "@/components/ui/slider"
import { useEffect, useRef } from "react"

interface FrameComponentProps {
  video: string
  imageUrl: string
  width: number | string
  height: number | string
  className?: string
  mediaSize: number
  onMediaSizeChange: (value: number) => void
  showControls: boolean
  label: string
  autoplayMode: "all" | "hover"
  isHovered: boolean
}

export function FrameComponent({
  video,
  imageUrl,
  width,
  height,
  className = "",
  mediaSize,
  onMediaSizeChange,
  showControls,
  label,
  autoplayMode,
  isHovered,
}: FrameComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (autoplayMode === "all") {
      videoRef.current?.play().catch((e) => console.log("Autoplay prevented:", e))
    } else if (autoplayMode === "hover") {
      if (isHovered) {
        videoRef.current?.play().catch((e) => console.log("Hover play prevented:", e))
      } else {
        videoRef.current?.pause()
      }
    }
  }, [isHovered, autoplayMode])

  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {/* Media Content */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            zIndex: 1,
            transition: "all 0.3s ease-in-out",
          }}
        >
          <div
            className="w-full h-full overflow-hidden rounded-lg"
            style={{
              transform: `scale(${mediaSize})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {/* Background Image (Always Visible) */}
            <div className="absolute inset-0">
              <img src={imageUrl || "/placeholder.svg"} alt="Game background" className="w-full h-full object-cover" />
            </div>

            {/* Video (Plays on Hover or Always) */}
            <video
              className="w-full h-full object-cover"
              src={video}
              loop
              muted
              playsInline
              autoPlay={autoplayMode === "all"}
              ref={videoRef}
              onMouseEnter={(e) => {
                if (autoplayMode === "hover") {
                  e.currentTarget.play().catch((e) => console.log("Mouse enter play prevented:", e))
                }
              }}
              onMouseLeave={(e) => {
                if (autoplayMode === "hover") {
                  e.currentTarget.pause()
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 z-10">
          <div className="text-white font-bold mb-2">{label}</div>
          <div className="space-y-2">
            <div>
              <label htmlFor={`media-size-${label}`} className="block text-sm font-medium text-white">
                Media Size: {mediaSize.toFixed(2)}
              </label>
              <Slider
                id={`media-size-${label}`}
                min={0.5}
                max={3}
                step={0.01}
                value={[mediaSize]}
                onValueChange={(value) => onMediaSizeChange(value[0])}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
