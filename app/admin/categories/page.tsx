"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface GameCategory {
  id: string
  name: string
  slug: string
  description: string
  count: number
}

export default function CategoriesManagement() {
  const [categories, setCategories] = useState<GameCategory[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<GameCategory | null>(null)
  const [newCategory, setNewCategory] = useState<Partial<GameCategory>>({
    name: "",
    slug: "",
    description: "",
  })

  useEffect(() => {
    // 从localStorage加载分类
    const storedCategories = localStorage.getItem("gameCategories")
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      // 创建一些示例分类
      const sampleCategories: GameCategory[] = [
        {
          id: "1",
          name: "动作",
          slug: "action",
          description: "动作类游戏",
          count: 5,
        },
        {
          id: "2",
          name: "角色扮演",
          slug: "rpg",
          description: "角色扮演类游戏",
          count: 3,
        },
        {
          id: "3",
          name: "射击",
          slug: "shooter",
          description: "射击类游戏",
          count: 4,
        },
        {
          id: "4",
          name: "策略",
          slug: "strategy",
          description: "策略类游戏",
          count: 2,
        },
        {
          id: "5",
          name: "冒险",
          slug: "adventure",
          description: "冒险类游戏",
          count: 3,
        },
      ]
      setCategories(sampleCategories)
      localStorage.setItem("gameCategories", JSON.stringify(sampleCategories))
    }
  }, [])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.slug) return

    const newCategoryWithId: GameCategory = {
      ...(newCategory as GameCategory),
      id: Date.now().toString(),
      count: 0,
    }

    const updatedCategories = [...categories, newCategoryWithId]
    setCategories(updatedCategories)
    localStorage.setItem("gameCategories", JSON.stringify(updatedCategories))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `添加了分类: ${newCategory.name}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    setIsAddDialogOpen(false)
    setNewCategory({
      name: "",
      slug: "",
      description: "",
    })
  }

  const handleEditCategory = () => {
    if (!currentCategory || !currentCategory.name || !currentCategory.slug) return

    const updatedCategories = categories.map((category) =>
      category.id === currentCategory.id ? currentCategory : category,
    )

    setCategories(updatedCategories)
    localStorage.setItem("gameCategories", JSON.stringify(updatedCategories))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `编辑了分类: ${currentCategory.name}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    setIsEditDialogOpen(false)
    setCurrentCategory(null)
  }

  const handleDeleteCategory = () => {
    if (!currentCategory) return

    const updatedCategories = categories.filter((category) => category.id !== currentCategory.id)

    setCategories(updatedCategories)
    localStorage.setItem("gameCategories", JSON.stringify(updatedCategories))

    // 记录操作日志
    const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
    logs.push({
      action: "内容修改",
      username: localStorage.getItem("adminUsername") || "未知用户",
      timestamp: new Date().toISOString(),
      details: `删除了分类: ${currentCategory.name}`,
      ip: "127.0.0.1",
      userAgent: navigator.userAgent,
    })
    localStorage.setItem("adminLogs", JSON.stringify(logs))

    setIsDeleteDialogOpen(false)
    setCurrentCategory(null)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">游戏分类管理</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          <Plus className="h-4 w-4 mr-2" /> 添加分类
        </Button>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          type="text"
          placeholder="搜索分类..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* 分类列表 */}
      <Card className="bg-black/20 border-white/10">
        <CardHeader className="pb-0">
          <CardTitle>游戏分类</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-white/70">ID</TableHead>
                  <TableHead className="text-white/70">名称</TableHead>
                  <TableHead className="text-white/70">别名</TableHead>
                  <TableHead className="text-white/70">描述</TableHead>
                  <TableHead className="text-white/70">游戏数量</TableHead>
                  <TableHead className="text-white/70 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id} className="border-white/5">
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{category.description}</TableCell>
                      <TableCell>{category.count}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentCategory(category)
                              setIsEditDialogOpen(true)
                            }}
                            className="text-white/70 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCurrentCategory(category)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-500 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-white/50">
                      没有找到分类
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 添加分类对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>添加分类</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/70">
                分类名称
              </Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => {
                  const name = e.target.value
                  setNewCategory({
                    ...newCategory,
                    name,
                    slug: generateSlug(name),
                  })
                }}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-white/70">
                分类别名
              </Label>
              <Input
                id="slug"
                value={newCategory.slug}
                onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-white/50">用于URL，只能包含小写字母、数字和连字符</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white/70">
                分类描述
              </Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="bg-white/5 border-white/10 text-white"
              />
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
            <Button onClick={handleAddCategory} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 编辑分类对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>编辑分类</DialogTitle>
          </DialogHeader>
          {currentCategory && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-white/70">
                  分类名称
                </Label>
                <Input
                  id="edit-name"
                  value={currentCategory.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setCurrentCategory({
                      ...currentCategory,
                      name,
                      // 只有当slug未被手动修改过时，才自动更新slug
                      slug:
                        currentCategory.slug === generateSlug(currentCategory.name)
                          ? generateSlug(name)
                          : currentCategory.slug,
                    })
                  }}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-slug" className="text-white/70">
                  分类别名
                </Label>
                <Input
                  id="edit-slug"
                  value={currentCategory.slug}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, slug: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50">用于URL，只能包含小写字母、数字和连字符</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white/70">
                  分类描述
                </Label>
                <Input
                  id="edit-description"
                  value={currentCategory.description}
                  onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
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
            <Button onClick={handleEditCategory} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>您确定要删除分类 "{currentCategory?.name}" 吗？此操作无法撤销。</p>
            {currentCategory && currentCategory.count > 0 && (
              <p className="mt-2 text-yellow-400">
                警告：此分类下有 {currentCategory.count} 个游戏，删除分类可能会影响这些游戏的显示。
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/10 text-white/70"
            >
              取消
            </Button>
            <Button onClick={handleDeleteCategory} variant="destructive" className="bg-red-600 hover:bg-red-700">
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
