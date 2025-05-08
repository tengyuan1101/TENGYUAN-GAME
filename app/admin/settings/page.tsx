"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Save, RefreshCw } from "lucide-react"

interface SiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  footerText: string
  icp: string
  contactEmail: string
  enableRegistration: boolean
  enableComments: boolean
  enableDarkMode: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "藤原の游戏小站",
    siteDescription: "发现最新最热门的游戏，加入我们的游戏社区",
    logo: "/logo.png",
    footerText: "© 2023 藤原の游戏小站. 保留所有权利。",
    icp: "京ICP备XXXXXXXX号",
    contactEmail: "contact@example.com",
    enableRegistration: true,
    enableComments: true,
    enableDarkMode: true,
    maintenanceMode: false,
    maintenanceMessage: "网站正在维护中，请稍后再试。",
  })

  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // 从localStorage加载设置
    const storedSettings = localStorage.getItem("siteSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    try {
      // 保存设置到localStorage
      localStorage.setItem("siteSettings", JSON.stringify(settings))

      // 记录设置修改日志
      const logs = JSON.parse(localStorage.getItem("adminLogs") || "[]")
      logs.push({
        action: "内容修改",
        username: localStorage.getItem("adminUsername") || "未知用户",
        timestamp: new Date().toISOString(),
        details: "系统设置已更新",
        ip: "127.0.0.1",
        userAgent: navigator.userAgent,
      })
      localStorage.setItem("adminLogs", JSON.stringify(logs))

      setSuccess("设置已成功保存！")

      // 模拟API调用延迟
      setTimeout(() => {
        setIsSaving(false)
      }, 500)
    } catch (err) {
      setError("保存设置时出错")
      setIsSaving(false)
    }
  }

  const handleResetSettings = () => {
    const defaultSettings: SiteSettings = {
      siteName: "藤原の游戏小站",
      siteDescription: "发现最新最热门的游戏，加入我们的游戏社区",
      logo: "/logo.png",
      footerText: "© 2023 藤原の游戏小站. 保留所有权利。",
      icp: "京ICP备XXXXXXXX号",
      contactEmail: "contact@example.com",
      enableRegistration: true,
      enableComments: true,
      enableDarkMode: true,
      maintenanceMode: false,
      maintenanceMessage: "网站正在维护中，请稍后再试。",
    }

    setSettings(defaultSettings)
    localStorage.setItem("siteSettings", JSON.stringify(defaultSettings))
    setSuccess("设置已重置为默认值")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">系统设置</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="border-white/10 text-white/70 hover:text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> 重置默认
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
            <Save className="h-4 w-4 mr-2" /> {isSaving ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="bg-green-900/20 border-green-900/50 text-green-300">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="bg-red-900/20 border-red-900/50 text-red-300">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            基本设置
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            外观设置
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            功能设置
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            维护模式
          </TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>网站基本信息</CardTitle>
              <CardDescription className="text-white/60">设置网站的基本信息和联系方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white/70">
                    网站名称
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white/70">
                    联系邮箱
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-white/70">
                  网站描述
                </Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription className="text-white/60">自定义网站的外观和品牌元素</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-white/70">
                  Logo URL
                </Label>
                <Input
                  id="logo"
                  value={settings.logo}
                  onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
                <p className="text-xs text-white/50">输入Logo图片的URL地址</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText" className="text-white/70">
                  页脚文本
                </Label>
                <Input
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icp" className="text-white/70">
                  ICP备案号
                </Label>
                <Input
                  id="icp"
                  value={settings.icp}
                  onChange={(e) => setSettings({ ...settings, icp: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableDarkMode: checked })}
                />
                <Label htmlFor="enableDarkMode" className="text-white/70">
                  启用深色/浅色模式切换
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 功能设置 */}
        <TabsContent value="features" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription className="text-white/60">控制网站的功能开关</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableRegistration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                />
                <Label htmlFor="enableRegistration" className="text-white/70">
                  允许用户注册
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableComments: checked })}
                />
                <Label htmlFor="enableComments" className="text-white/70">
                  允许用户评论
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 维护模式 */}
        <TabsContent value="maintenance" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>维护模式</CardTitle>
              <CardDescription className="text-white/60">启用维护模式时，普通用户将无法访问网站</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
                <Label htmlFor="maintenanceMode" className="text-white/70">
                  启用维护模式
                </Label>
              </div>
              {settings.maintenanceMode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage" className="text-white/70">
                    维护信息
                  </Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
