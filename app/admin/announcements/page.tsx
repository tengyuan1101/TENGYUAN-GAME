"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Plus, Search, Edit, Trash2, BellRing, Calendar, Eye } from "lucide-react"
import { useAnnouncement } from "@/context/AnnouncementContext"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncement()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [currentAnnouncement, setCurrentAnnouncement] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
  })

  // 过滤公告
  const filteredAnnouncements = announcements
    .filter((announcement) => {
      // 搜索过滤
      const matchesSearch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase())

      // 标签过滤
      if (activeTab === "all") return matchesSearch
      if (activeTab === "active") return matchesSearch && announcement.isActive
      if (activeTab === "inactive") return matchesSearch && !announcement.isActive

      return matchesSearch
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  const handleAddAnnouncement = () => {
    addAnnouncement({
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      startDate: new Date(newAnnouncement.startDate).toISOString(),
      endDate: newAnnouncement.endDate ? new Date(newAnnouncement.endDate).toISOString() : "",
      isActive: newAnnouncement.isActive,
    })

    setIsAddDialogOpen(false)
    setNewAnnouncement({
      title: "",
      content: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
    })
  }

  const handleEditAnnouncement = () => {
    if (!currentAnnouncement) return

    updateAnnouncement(currentAnnouncement.id, {
      title: currentAnnouncement.title,
      content: currentAnnouncement.content,
      startDate: new Date(currentAnnouncement.startDate).toISOString(),
      endDate: currentAnnouncement.endDate ? new Date(currentAnnouncement.endDate).toISOString() : "",
      isActive: currentAnnouncement.isActive,
    })

    setIsEditDialogOpen(false)
    setCurrentAnnouncement(null)
  }

  const handleDeleteAnnouncement = () => {
    if (!currentAnnouncement) return

    deleteAnnouncement(currentAnnouncement.id)
    setIsDeleteDialogOpen(false)
    setCurrentAnnouncement(null)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "无截止日期"
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 transition-all duration-300 transform hover:translate-y-[-2px] admin-button primary"
        >
          <Plus className="h-4 w-4 mr-2" /> 添加公告
        </Button>
      </div>

      {/* 搜索栏和标签 */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 dark:text-black/50" />
          <Input
            type="text"
            placeholder="搜索公告..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-black/20 border border-white/10 dark:bg-white/20 dark:border-black/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
              全部
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              已激活
            </TabsTrigger>
            <TabsTrigger
              value="inactive"
              className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
            >
              未激活
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 公告列表 */}
      <Card className="bg-black/20 border-white/10 shadow-xl transition-all duration-300 hover:shadow-[#ff6b4a]/10 admin-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-semibold flex items-center">
            <div className="mr-2 p-1.5 rounded-md bg-[#ff6b4a]/20 text-[#ff6b4a]">
              <BellRing className="h-5 w-5" />
            </div>
            网站公告
          </CardTitle>
          <CardDescription className="text-white/60 dark:text-black/60">
            管理网站的公告信息，设置公告的显示时间和状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent dark:border-black/10">
                  <TableHead className="text-white/70 dark:text-black/70 admin-text">标题</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70 admin-text">状态</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70 admin-text">开始日期</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70 admin-text">结束日期</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70 admin-text">更新时间</TableHead>
                  <TableHead className="text-white/70 dark:text-black/70 admin-text text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <TableRow key={announcement.id} className="border-white/5 dark:border-black/5">
                      <TableCell className="font-medium">{announcement.title}</TableCell>
                      <TableCell>
                        {announcement.isActive ? (
                          <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-green-500/10">
                            已激活
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-500 hover:bg-gray-500/30 border-gray-500/10">
                            未激活
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-white/70 dark:text-black/70 admin-text">
                        {formatDate(announcement.startDate)}
                      </TableCell>
                      <TableCell className="text-white/70 dark:text-black/70 admin-text">
                        {formatDate(announcement.endDate)}
                      </TableCell>
                      <TableCell className="text-white/70 dark:text-black/70 admin-text">
                        {new Date(announcement.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentAnnouncement(announcement)
                              setIsPreviewDialogOpen(true)
                            }}
                            className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black admin-button"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentAnnouncement(announcement)
                              setIsEditDialogOpen(true)
                            }}
                            className="text-white/70 hover:text-white dark:text-black/70 dark:hover:text-black admin-button"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentAnnouncement(announcement)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-500 hover:text-red-400 admin-button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-white/50 dark:text-black/50">
                      没有找到公告
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 添加公告对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
          <DialogHeader>
            <DialogTitle>添加公告</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white/70 dark:text-black/70 admin-text">
                公告标题
              </Label>
              <Input
                id="title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content" className="text-white/70 dark:text-black/70 admin-text">
                公告内容
              </Label>
              <Textarea
                id="content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                className="min-h-[200px] bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                placeholder="支持HTML格式，例如：<p>这是一个<strong>重要</strong>公告</p>"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-white/70 dark:text-black/70 admin-text">
                  开始日期
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-white/50 dark:text-black/50" />
                  <Input
                    id="startDate"
                    type="date"
                    value={newAnnouncement.startDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, startDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-white/70 dark:text-black/70 admin-text">
                  结束日期 (可选)
                </Label>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-white/50 dark:text-black/50" />
                  <Input
                    id="endDate"
                    type="date"
                    value={newAnnouncement.endDate}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, endDate: e.target.value })}
                    className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={newAnnouncement.isActive}
                onCheckedChange={(checked) => setNewAnnouncement({ ...newAnnouncement, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-white/70 dark:text-black/70 admin-text">
                立即激活
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-white/10 text-white/70 dark:border-black/10 dark:text-black/70 admin-button"
            >
              取消
            </Button>
            <Button onClick={handleAddAnnouncement} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 admin-button primary">
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑公告对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
          <DialogHeader>
            <DialogTitle>编辑公告</DialogTitle>
          </DialogHeader>
          {currentAnnouncement && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-white/70 dark:text-black/70 admin-text">
                  公告标题
                </Label>
                <Input
                  id="edit-title"
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content" className="text-white/70 dark:text-black/70 admin-text">
                  公告内容
                </Label>
                <Textarea
                  id="edit-content"
                  value={currentAnnouncement.content}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                  className="min-h-[200px] bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                  placeholder="支持HTML格式，例如：<p>这是一个<strong>重要</strong>公告</p>"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate" className="text-white/70 dark:text-black/70 admin-text">
                    开始日期
                  </Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-white/50 dark:text-black/50" />
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={
                        currentAnnouncement.startDate
                          ? new Date(currentAnnouncement.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, startDate: e.target.value })}
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate" className="text-white/70 dark:text-black/70 admin-text">
                    结束日期 (可选)
                  </Label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-white/50 dark:text-black/50" />
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={
                        currentAnnouncement.endDate
                          ? new Date(currentAnnouncement.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, endDate: e.target.value })}
                      className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={currentAnnouncement.isActive}
                  onCheckedChange={(checked) => setCurrentAnnouncement({ ...currentAnnouncement, isActive: checked })}
                />
                <Label htmlFor="edit-isActive" className="text-white/70 dark:text-black/70 admin-text">
                  激活公告
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/10 text-white/70 dark:border-black/10 dark:text-black/70 admin-button"
            >
              取消
            </Button>
            <Button
              onClick={handleEditAnnouncement}
              className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 admin-button primary"
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除公告 "{currentAnnouncement?.title}" 吗？此操作无法撤销。</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70 dark:border-black/10 dark:text-black/70 admin-button"
            >
              取消
            </Button>
            <Button
              onClick={handleDeleteAnnouncement}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 admin-button"
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 预览公告对话框 */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white dark:bg-white/90 dark:border-black/10 dark:text-black">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-[#ff6b4a]" />
              {currentAnnouncement?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div
              className="prose prose-invert dark:prose-light max-w-none"
              dangerouslySetInnerHTML={{ __html: currentAnnouncement?.content || "" }}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsPreviewDialogOpen(false)}
              className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 admin-button primary"
            >
              关闭预览
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
