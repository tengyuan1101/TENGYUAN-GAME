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
import { Save, RefreshCw, Eye, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSiteData } from "@/context/SiteDataContext"

export default function SettingsPage() {
  const { settings: siteSettings, updateSettings } = useSiteData()
  const [settings, setSettings] = useState(siteSettings)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  // 当SiteDataContext中的设置更新时，更新本地状态
  useEffect(() => {
    setSettings(siteSettings)
  }, [siteSettings])

  const handleSaveSettings = () => {
    setIsSaving(true)
    setSuccess("")
    setError("")

    try {
      // 使用SiteDataContext的updateSettings函数更新设置
      updateSettings(settings)

      setSuccess("设置已成功保存！页面将自动刷新以应用更改。")

      // 模拟API调用延迟
      setTimeout(() => {
        setIsSaving(false)
        // 刷新页面以应用新设置
        window.location.reload()
      }, 1500)
    } catch (err) {
      setError("保存设置时出错")
      setIsSaving(false)
    }
  }

  const handleResetSettings = () => {
    const defaultSettings = {
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
    setSuccess("设置已重置为默认值")
  }

  const handlePreviewSite = () => {
    window.open("/", "_blank")
  }

  // 美化设置卡片
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">系统设置</h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handlePreviewSite}
            className="border-white/10 text-white/70 hover:text-white dark:border-black/10 dark:text-black/70 dark:hover:text-black admin-button"
          >
            <Eye className="h-4 w-4 mr-2" /> 预览网站
          </Button>
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="border-white/10 text-white/70 hover:text-white dark:border-black/10 dark:text-black/70 dark:hover:text-black admin-button"
          >
            <RefreshCw className="h-4 w-4 mr-2" /> 重置默认
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90 text-white admin-button primary"
          >
            {isSaving ? <Check className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {isSaving ? "保存中..." : "保存设置"}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="bg-green-900/20 border-green-900/50 text-green-300 dark:bg-green-100/20 dark:border-green-100/50 dark:text-green-700">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert
          variant="destructive"
          className="bg-red-900/20 border-red-900/50 text-red-300 dark:bg-red-100/20 dark:border-red-100/50 dark:text-red-700"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-black/20 border border-white/10 dark:bg-white/20 dark:border-black/10">
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
          <Card className="bg-black/20 border-white/10 admin-card settings-card">
            <CardHeader>
              <CardTitle>网站基本信息</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">
                设置网站的基本信息和联系方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white/70 dark:text-black/70 admin-text">
                    网站名称
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                  />
                  <p className="text-xs text-white/50 dark:text-black/50">这将显示在网站的标题、Logo和页脚中</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white/70 dark:text-black/70 admin-text">
                    联系邮箱
                  </Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription" className="text-white/70 dark:text-black/70 admin-text">
                  网站描述
                </Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="bg-white/5 border-white/10 text-white min-h-[100px] dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-black/20 border-white/10 admin-card settings-card">
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">自定义网站的外观和品牌元素</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logo" className="text-white/70 dark:text-black/70 admin-text">
                  Logo URL
                </Label>
                <div className="flex gap-4 items-center">
                  <Input
                    id="logo"
                    value={settings.logo}
                    onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                    className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                  />
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 dark:bg-black/10 flex items-center justify-center">
                    <img
                      src={settings.logo || "/placeholder.svg"}
                      alt="Logo Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
                <p className="text-xs text-white/50 dark:text-black/50">输入Logo图片的URL地址</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="footerText" className="text-white/70 dark:text-black/70 admin-text">
                  页脚文本
                </Label>
                <Input
                  id="footerText"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icp" className="text-white/70 dark:text-black/70 admin-text">
                  ICP备案号
                </Label>
                <Input
                  id="icp"
                  value={settings.icp}
                  onChange={(e) => setSettings({ ...settings, icp: e.target.value })}
                  className="bg-white/5 border-white/10 text-white dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableDarkMode"
                  checked={settings.enableDarkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableDarkMode: checked })}
                />
                <Label htmlFor="enableDarkMode" className="text-white/70 dark:text-black/70 admin-text">
                  启用深色/浅色模式切换
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 功能设置 */}
        <TabsContent value="features" className="mt-6">
          <Card className="bg-black/20 border-white/10 admin-card settings-card">
            <CardHeader>
              <CardTitle>功能设置</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">控制网站的功能开关</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableRegistration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                />
                <Label htmlFor="enableRegistration" className="text-white/70 dark:text-black/70 admin-text">
                  允许用户注册
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableComments: checked })}
                />
                <Label htmlFor="enableComments" className="text-white/70 dark:text-black/70 admin-text">
                  允许用户评论
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 维护模式 */}
        <TabsContent value="maintenance" className="mt-6">
          <Card className="bg-black/20 border-white/10 admin-card settings-card">
            <CardHeader>
              <CardTitle>维护模式</CardTitle>
              <CardDescription className="text-white/60 dark:text-black/60">
                启用维护模式时，普通用户将无法访问网站
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
                <Label htmlFor="maintenanceMode" className="text-white/70 dark:text-black/70 admin-text">
                  启用维护模式
                </Label>
              </div>
              {settings.maintenanceMode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage" className="text-white/70 dark:text-black/70 admin-text">
                    维护信息
                  </Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                    className="bg-white/5 border-white/10 text-white min-h-[100px] dark:bg-black/5 dark:border-black/10 dark:text-black admin-input settings-input"
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
