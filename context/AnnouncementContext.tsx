"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface Announcement {
  id: string
  title: string
  content: string
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AnnouncementContextType {
  announcements: Announcement[]
  activeAnnouncement: Announcement | null
  addAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt">) => void
  updateAnnouncement: (id: string, announcement: Partial<Announcement>) => void
  deleteAnnouncement: (id: string) => void
  setAnnouncementSeen: (id: string) => void
  hasUnseenAnnouncement: boolean
}

const AnnouncementContext = createContext<AnnouncementContextType>({
  announcements: [],
  activeAnnouncement: null,
  addAnnouncement: () => {},
  updateAnnouncement: () => {},
  deleteAnnouncement: () => {},
  setAnnouncementSeen: () => {},
  hasUnseenAnnouncement: false,
})

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [activeAnnouncement, setActiveAnnouncement] = useState<Announcement | null>(null)
  const [hasUnseenAnnouncement, setHasUnseenAnnouncement] = useState(false)

  // 加载公告数据
  useEffect(() => {
    const storedAnnouncements = localStorage.getItem("announcements")
    if (storedAnnouncements) {
      try {
        const parsedAnnouncements = JSON.parse(storedAnnouncements)
        setAnnouncements(parsedAnnouncements)
      } catch (e) {
        console.error("Failed to parse announcements:", e)
        setAnnouncements([])
      }
    }
  }, [])

  // 检查是否有活跃的公告
  useEffect(() => {
    const now = new Date().toISOString()
    const active = announcements.find((a) => a.isActive && a.startDate <= now && (a.endDate === "" || a.endDate >= now))
    setActiveAnnouncement(active || null)

    // 检查是否有未读的公告
    if (active) {
      const seenAnnouncements = JSON.parse(localStorage.getItem("seenAnnouncements") || "[]")
      const today = new Date().toDateString()
      const key = `${active.id}-${today}`

      if (!seenAnnouncements.includes(key)) {
        setHasUnseenAnnouncement(true)
      } else {
        setHasUnseenAnnouncement(false)
      }
    } else {
      setHasUnseenAnnouncement(false)
    }
  }, [announcements])

  // 添加新公告
  const addAnnouncement = (announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString()
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    }

    const updatedAnnouncements = [...announcements, newAnnouncement]
    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "公告管理",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: now,
      details: `添加了公告: ${announcement.title}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  // 更新公告
  const updateAnnouncement = (id: string, announcement: Partial<Announcement>) => {
    const now = new Date().toISOString()
    const updatedAnnouncements = announcements.map((a) => {
      if (a.id === id) {
        return { ...a, ...announcement, updatedAt: now }
      }
      return a
    })

    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "公告管理",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: now,
      details: `更新了公告: ${announcement.title || id}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  // 删除公告
  const deleteAnnouncement = (id: string) => {
    const announcementToDelete = announcements.find((a) => a.id === id)
    const updatedAnnouncements = announcements.filter((a) => a.id !== id)

    setAnnouncements(updatedAnnouncements)
    localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "公告管理",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `删除了公告: ${announcementToDelete?.title || id}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))
  }

  // 标记公告为已读
  const setAnnouncementSeen = (id: string) => {
    if (!id) return

    const today = new Date().toDateString()
    const key = `${id}-${today}`
    const seenAnnouncements = JSON.parse(localStorage.getItem("seenAnnouncements") || "[]")

    if (!seenAnnouncements.includes(key)) {
      const updatedSeenAnnouncements = [...seenAnnouncements, key]
      localStorage.setItem("seenAnnouncements", JSON.stringify(updatedSeenAnnouncements))
      setHasUnseenAnnouncement(false)
    }
  }

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        activeAnnouncement,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        setAnnouncementSeen,
        hasUnseenAnnouncement,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  )
}

export const useAnnouncement = () => useContext(AnnouncementContext)
