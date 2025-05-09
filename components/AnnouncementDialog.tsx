"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useAnnouncement } from "@/context/AnnouncementContext"
import { BellRing } from "lucide-react"

export function AnnouncementDialog() {
  const { activeAnnouncement, setAnnouncementSeen, hasUnseenAnnouncement } = useAnnouncement()
  const [isOpen, setIsOpen] = useState(false)
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)

  // 当有未读公告时，显示对话框
  useEffect(() => {
    if (hasUnseenAnnouncement && activeAnnouncement) {
      setIsOpen(true)
    }
  }, [hasUnseenAnnouncement, activeAnnouncement])

  // 关闭对话框并标记为已读
  const handleClose = () => {
    if (activeAnnouncement) {
      setAnnouncementSeen(activeAnnouncement.id)
    }
    setIsOpen(false)
  }

  if (!activeAnnouncement) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BellRing className="h-5 w-5 text-[#ff6b4a]" />
            {activeAnnouncement.title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div
            className="prose prose-invert dark:prose-light max-w-none"
            dangerouslySetInnerHTML={{ __html: activeAnnouncement.content }}
          />
        </div>
        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="doNotShowAgain"
              checked={doNotShowAgain}
              onCheckedChange={(checked) => setDoNotShowAgain(checked === true)}
            />
            <Label htmlFor="doNotShowAgain" className="text-sm text-white/70 dark:text-black/70">
              今日不再显示
            </Label>
          </div>
          <Button onClick={handleClose} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
            我知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
