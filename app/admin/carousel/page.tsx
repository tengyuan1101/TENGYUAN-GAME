"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, MoreVertical, Edit, Trash2, Eye, ArrowUp, ArrowDown } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface CarouselItem {
  id: number
  title: string
  description: string
  imageUrl: string
  link: string
  active: boolean
  order: number
}

export default function CarouselManagement() {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<CarouselItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<CarouselItem>>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    active: true,
  })

  useEffect(() => {
    // In a real application, this would be an API call
    const storedItems = localStorage.getItem("carouselItems")
    if (storedItems) {
      setCarouselItems(JSON.parse(storedItems))
    } else {
      // Generate sample carousel items
      const sampleItems: CarouselItem[] = [
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
          active: false,
          order: 4,
        },
      ]
      setCarouselItems(sampleItems)
      localStorage.setItem("carouselItems", JSON.stringify(sampleItems))
    }
  }, [])

  // Sort carousel items by order
  const sortedCarouselItems = [...carouselItems].sort((a, b) => a.order - b.order)

  // Handle add carousel item
  const handleAddItem = () => {
    if (!newItem.title || !newItem.imageUrl) return

    const newItemId = carouselItems.length > 0 ? Math.max(...carouselItems.map((item) => item.id)) + 1 : 1
    const newOrder = carouselItems.length > 0 ? Math.max(...carouselItems.map((item) => item.order)) + 1 : 1

    const itemToAdd: CarouselItem = {
      id: newItemId,
      title: newItem.title || "",
      description: newItem.description || "",
      imageUrl: newItem.imageUrl || "",
      link: newItem.link || "#",
      active: newItem.active !== undefined ? newItem.active : true,
      order: newOrder,
    }

    const updatedItems = [...carouselItems, itemToAdd]
    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
    setIsAddDialogOpen(false)
    setNewItem({
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      active: true,
    })
  }

  // Handle edit carousel item
  const handleEditItem = () => {
    if (!currentItem) return

    const updatedItems = carouselItems.map((item) => (item.id === currentItem.id ? currentItem : item))
    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
    setIsEditDialogOpen(false)
    setCurrentItem(null)
  }

  // Handle delete carousel item
  const handleDeleteItem = () => {
    if (!currentItem) return

    const updatedItems = carouselItems.filter((item) => item.id !== currentItem.id)
    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
    setIsDeleteDialogOpen(false)
    setCurrentItem(null)
  }

  // Handle move item up
  const handleMoveUp = (id: number) => {
    const itemIndex = sortedCarouselItems.findIndex((item) => item.id === id)
    if (itemIndex <= 0) return

    const updatedItems = [...carouselItems]
    const currentItem = updatedItems.find((item) => item.id === id)
    const prevItem = updatedItems.find((item) => item.id === sortedCarouselItems[itemIndex - 1].id)

    if (currentItem && prevItem) {
      const tempOrder = currentItem.order
      currentItem.order = prevItem.order
      prevItem.order = tempOrder
    }

    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
  }

  // Handle move item down
  const handleMoveDown = (id: number) => {
    const itemIndex = sortedCarouselItems.findIndex((item) => item.id === id)
    if (itemIndex >= sortedCarouselItems.length - 1) return

    const updatedItems = [...carouselItems]
    const currentItem = updatedItems.find((item) => item.id === id)
    const nextItem = updatedItems.find((item) => item.id === sortedCarouselItems[itemIndex + 1].id)

    if (currentItem && nextItem) {
      const tempOrder = currentItem.order
      currentItem.order = nextItem.order
      nextItem.order = tempOrder
    }

    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
  }

  // Handle toggle active state
  const handleToggleActive = (id: number) => {
    const updatedItems = carouselItems.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    setCarouselItems(updatedItems)
    localStorage.setItem("carouselItems", JSON.stringify(updatedItems))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">轮播图管理</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <Plus className="h-4 w-4 mr-2" /> 添加轮播图
        </Button>
      </div>

      {/* Carousel items list */}
      <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-white/70">顺序</TableHead>
                <TableHead className="text-white/70">标题</TableHead>
                <TableHead className="text-white/70">图片</TableHead>
                <TableHead className="text-white/70">描述</TableHead>
                <TableHead className="text-white/70">链接</TableHead>
                <TableHead className="text-white/70">状态</TableHead>
                <TableHead className="text-white/70 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCarouselItems.map((item) => (
                <TableRow key={item.id} className="border-white/5">
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{item.order}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveUp(item.id)}
                          disabled={item.order === 1}
                          className="h-5 w-5 text-white/50 hover:text-white"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveDown(item.id)}
                          disabled={item.order === sortedCarouselItems.length}
                          className="h-5 w-5 text-white/50 hover:text-white"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    <div className="w-16 h-9 rounded overflow-hidden">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell className="max-w-[100px] truncate">{item.link}</TableCell>
                  <TableCell>
                    <Switch
                      checked={item.active}
                      onCheckedChange={() => handleToggleActive(item.id)}
                      className="data-[state=checked]:bg-[#ff6b4a]"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentItem(item)
                            setIsViewDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" /> 预览
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentItem(item)
                            setIsEditDialogOpen(true)
                          }}
                          className="hover:bg-white/10 cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" /> 编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setCurrentItem(item)
                            setIsDeleteDialogOpen(true)
                          }}
                          className="text-red-500 hover:bg-red-900/20 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> 删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {carouselItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-white/50">
                    暂无轮播图，请添加
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add carousel item dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>添加轮播图</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white/70">
                  标题
                </Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link" className="text-white/70">
                  链接
                </Label>
                <Input
                  id="link"
                  value={newItem.link}
                  onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                  placeholder="例如: /games/1"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70">
                描述
              </Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-white/70">
                图片URL
              </Label>
              <Input
                id="imageUrl"
                value={newItem.imageUrl}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={newItem.active}
                onCheckedChange={(checked) => setNewItem({ ...newItem, active: checked })}
                className="data-[state=checked]:bg-[#ff6b4a]"
              />
              <Label htmlFor="active" className="text-white/70">
                启用轮播图
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleAddItem} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              添加轮播图
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit carousel item dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>编辑轮播图</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="text-white/70">
                    标题
                  </Label>
                  <Input
                    id="edit-title"
                    value={currentItem.title}
                    onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-link" className="text-white/70">
                    链接
                  </Label>
                  <Input
                    id="edit-link"
                    value={currentItem.link}
                    onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white/70">
                  描述
                </Label>
                <Textarea
                  id="edit-description"
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl" className="text-white/70">
                  图片URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  value={currentItem.imageUrl}
                  onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={currentItem.active}
                  onCheckedChange={(checked) => setCurrentItem({ ...currentItem, active: checked })}
                  className="data-[state=checked]:bg-[#ff6b4a]"
                />
                <Label htmlFor="edit-active" className="text-white/70">
                  启用轮播图
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleEditItem} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              保存更改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View carousel item dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>轮播图预览</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="py-4">
              <div className="rounded-lg overflow-hidden mb-4">
                <img
                  src={currentItem.imageUrl || "/placeholder.svg"}
                  alt={currentItem.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{currentItem.title}</h3>
                  <p className="text-white/70 mt-1">{currentItem.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-white/50 text-sm">链接:</div>
                  <div>{currentItem.link}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-white/50 text-sm">状态:</div>
                  <div>{currentItem.active ? "启用" : "禁用"}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-white/50 text-sm">顺序:</div>
                  <div>{currentItem.order}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              关闭
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除轮播图 "{currentItem?.title}" 吗？此操作无法撤销。</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleDeleteItem} variant="destructive" className="bg-red-600 hover:bg-red-700">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
