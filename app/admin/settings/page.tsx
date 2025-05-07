"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, Upload, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WebsiteSettings {
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  contactEmail: string
  phoneNumber: string
  address: string
  icp: string
  copyright: string
  theme: string
  enableRegistration: boolean
  enableComments: boolean
  enableRatings: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  socialLinks: {
    weibo: string
    wechat: string
    qq: string
    bilibili: string
  }
  seo: {
    keywords: string
    description: string
    googleAnalyticsId: string
    baiduAnalyticsId: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    siteName: "藤原の游戏小站",
    siteDescription: "发现最新最热门的游戏，加入我们的游戏社区",
    logo: "/logo.png",
    favicon: "/favicon.ico",
    contactEmail: "contact@example.com",
    phoneNumber: "13800138000",
    address: "北京市朝阳区",
    icp: "京ICP备12345678号",
    copyright: "© 2023 藤原の游戏小站. 保留所有权利。",
    theme: "dark",
    enableRegistration: true,
    enableComments: true,
    enableRatings: true,
    maintenanceMode: false,
    maintenanceMessage: "网站正在维护中，请稍后再试。",
    socialLinks: {
      weibo: "https://weibo.com/example",
      wechat: "wechat_id",
      qq: "qq_group",
      bilibili: "https://space.bilibili.com/example",
    },
    seo: {
      keywords: "游戏,下载,评测,攻略,社区",
      description: "藤原の游戏小站是一个提供游戏下载、评测、攻略和社区交流的平台。",
      googleAnalyticsId: "",
      baiduAnalyticsId: "",
    },
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    // In a real application, this would be an API call
    const storedSettings = localStorage.getItem("websiteSettings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("websiteSettings", JSON.stringify(settings))
      setIsSaving(false)
      setSaveSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof WebsiteSettings],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">网站设置</h1>
        <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </div>

      {saveSuccess && (
        <Alert className="bg-green-900/20 border-green-900/50 text-green-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>成功</AlertTitle>
          <AlertDescription>设置已成功保存</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            value="contact"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            联系方式
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            社交媒体
          </TabsTrigger>
          <TabsTrigger value="seo" className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]">
            SEO设置
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-[#ff6b4a]/20 data-[state=active]:text-[#ff6b4a]"
          >
            高级设置
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
              <CardDescription>设置网站的基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-white/70">
                    网站名称
                  </Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="copyright" className="text-white/70">
                    版权信息
                  </Label>
                  <Input
                    id="copyright"
                    value={settings.copyright}
                    onChange={(e) => handleInputChange("copyright", e.target.value)}
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
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icp" className="text-white/70">
                  ICP备案号
                </Label>
                <Input
                  id="icp"
                  value={settings.icp}
                  onChange={(e) => handleInputChange("icp", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>外观设置</CardTitle>
              <CardDescription>设置网站的外观和主题</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-white/70">
                    网站Logo
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="logo"
                      value={settings.logo}
                      onChange={(e) => handleInputChange("logo", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button variant="outline" size="icon" className="border-white/10">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {settings.logo && (
                    <div className="mt-2 p-2 bg-white/5 rounded-md">
                      <img
                        src={settings.logo || "/placeholder.svg"}
                        alt="Logo Preview"
                        className="h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=40&width=120"
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon" className="text-white/70">
                    网站图标
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="favicon"
                      value={settings.favicon}
                      onChange={(e) => handleInputChange("favicon", e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button variant="outline" size="icon" className="border-white/10">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {settings.favicon && (
                    <div className="mt-2 p-2 bg-white/5 rounded-md">
                      <img
                        src={settings.favicon || "/placeholder.svg"}
                        alt="Favicon Preview"
                        className="h-8 w-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-white/70">
                  网站主题
                </Label>
                <Select value={settings.theme} onValueChange={(value) => handleInputChange("theme", value)}>
                  <SelectTrigger id="theme" className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="选择主题" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white">
                    <SelectItem value="dark">暗色主题</SelectItem>
                    <SelectItem value="light">亮色主题</SelectItem>
                    <SelectItem value="auto">自动（跟随系统）</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>联系方式</CardTitle>
              <CardDescription>设置网站的联系方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-white/70">
                    联系邮箱
                  </Label>
                  <Input
                    id="contactEmail"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-white/70">
                    联系电话
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-white/70">
                  联系地址
                </Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Settings */}
        <TabsContent value="social" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>社交媒体</CardTitle>
              <CardDescription>设置网站的社交媒体链接</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weibo" className="text-white/70">
                    微博
                  </Label>
                  <Input
                    id="weibo"
                    value={settings.socialLinks.weibo}
                    onChange={(e) => handleNestedInputChange("socialLinks", "weibo", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wechat" className="text-white/70">
                    微信公众号
                  </Label>
                  <Input
                    id="wechat"
                    value={settings.socialLinks.wechat}
                    onChange={(e) => handleNestedInputChange("socialLinks", "wechat", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qq" className="text-white/70">
                    QQ群
                  </Label>
                  <Input
                    id="qq"
                    value={settings.socialLinks.qq}
                    onChange={(e) => handleNestedInputChange("socialLinks", "qq", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bilibili" className="text-white/70">
                    哔哩哔哩
                  </Label>
                  <Input
                    id="bilibili"
                    value={settings.socialLinks.bilibili}
                    onChange={(e) => handleNestedInputChange("socialLinks", "bilibili", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>SEO设置</CardTitle>
              <CardDescription>设置网站的搜索引擎优化参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords" className="text-white/70">
                  关键词（用逗号分隔）
                </Label>
                <Input
                  id="keywords"
                  value={settings.seo.keywords}
                  onChange={(e) => handleNestedInputChange("seo", "keywords", e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription" className="text-white/70">
                  SEO描述
                </Label>
                <Textarea
                  id="seoDescription"
                  value={settings.seo.description}
                  onChange={(e) => handleNestedInputChange("seo", "description", e.target.value)}
                  className="bg-white/5 border-white/10 text-white min-h-[80px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId" className="text-white/70">
                    Google Analytics ID
                  </Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.seo.googleAnalyticsId}
                    onChange={(e) => handleNestedInputChange("seo", "googleAnalyticsId", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baiduAnalyticsId" className="text-white/70">
                    百度统计ID
                  </Label>
                  <Input
                    id="baiduAnalyticsId"
                    value={settings.seo.baiduAnalyticsId}
                    onChange={(e) => handleNestedInputChange("seo", "baiduAnalyticsId", e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="mt-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
              <CardDescription>设置网站的高级功能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRegistration" className="text-white/70">
                    启用用户注册
                  </Label>
                  <p className="text-sm text-white/50">允许新用户注册账号</p>
                </div>
                <Switch
                  id="enableRegistration"
                  checked={settings.enableRegistration}
                  onCheckedChange={(checked) => handleInputChange("enableRegistration", checked)}
                  className="data-[state=checked]:bg-[#ff6b4a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableComments" className="text-white/70">
                    启用评论功能
                  </Label>
                  <p className="text-sm text-white/50">允许用户在游戏页面发表评论</p>
                </div>
                <Switch
                  id="enableComments"
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => handleInputChange("enableComments", checked)}
                  className="data-[state=checked]:bg-[#ff6b4a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableRatings" className="text-white/70">
                    启用评分功能
                  </Label>
                  <p className="text-sm text-white/50">允许用户对游戏进行评分</p>
                </div>
                <Switch
                  id="enableRatings"
                  checked={settings.enableRatings}
                  onCheckedChange={(checked) => handleInputChange("enableRatings", checked)}
                  className="data-[state=checked]:bg-[#ff6b4a]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-white/70">
                    维护模式
                  </Label>
                  <p className="text-sm text-white/50">开启后，普通用户将无法访问网站</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
                  className="data-[state=checked]:bg-[#ff6b4a]"
                />
              </div>
              {settings.maintenanceMode && (
                <div className="space-y-2">
                  <Label htmlFor="maintenanceMessage" className="text-white/70">
                    维护提示信息
                  </Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={settings.maintenanceMessage}
                    onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[80px]"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="bg-[#ff6b4a] hover:bg-[#ff6b4a]/90">
          {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          {isSaving ? "保存中..." : "保存设置"}
        </Button>
      </div>
    </div>
  )
}
