"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User, Shield, Bell, AppWindow, Trash2, Globe, Clock, Moon, Sun, Monitor, Lock, Smartphone, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useSearchParams } from "next/navigation"
import { userService, UserProfile } from "@/lib/services/user-service"
import { Loader2, Building } from "lucide-react"
import { Can } from "@/components/shared/rbac-guard"
import { useWorkspace } from "@/components/providers/workspace-provider"
import WorkspaceSettingsPage from "./workspace/page"

function SettingsContent() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const { currentWorkspace } = useWorkspace()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = React.useState(tabParam || "profile")
  const [mounted, setMounted] = React.useState(false)
  
  const [profile, setProfile] = React.useState<UserProfile | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const fetchProfile = async () => {
      const data = await userService.getProfile()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [])

  const handleUpdateProfile = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await userService.updateProfile(profile)
      alert("Profile updated successfully")
    } catch (err) {
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const savePreferences = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await userService.updateProfile(profile)
      alert("Preferences saved successfully")
    } catch (err) {
      alert("Failed to save preferences")
    } finally {
      setSaving(false)
    }
  }

  if (!mounted || loading) return (
    <DashboardShell>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground font-medium">Loading settings...</div>
      </div>
    </DashboardShell>
  )

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-1">
            <SettingsNavItem 
              icon={User} 
              label="Profile" 
              active={activeTab === "profile"} 
              onClick={() => setActiveTab("profile")} 
            />
            <SettingsNavItem 
              icon={Shield} 
              label="Security" 
              active={activeTab === "security"} 
              onClick={() => setActiveTab("security")} 
            />
            <Can roles={['Owner', 'Admin']}>
              <SettingsNavItem 
                icon={Building} 
                label="Workspace" 
                active={activeTab === "workspace"} 
                onClick={() => setActiveTab("workspace")} 
              />
            </Can>
            <SettingsNavItem 
              icon={Monitor} 
              label="Preferences" 
              active={activeTab === "preferences"} 
              onClick={() => setActiveTab("preferences")} 
            />
            <SettingsNavItem 
              icon={AppWindow} 
              label="Connected Apps" 
              active={activeTab === "apps"} 
              onClick={() => setActiveTab("apps")} 
            />
          </aside>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="glass-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle>Public Profile</CardTitle>
                    <CardDescription>How others see you on the platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="relative group cursor-pointer shrink-0">
                        <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-background">
                          {profile?.avatar}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                        </div>
                      </div>
                      <div className="grid gap-4 flex-1 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">First Name</label>
                            <Input 
                              placeholder="Jane" 
                              value={profile?.name.split(" ")[0]} 
                              onChange={(e) => setProfile(prev => prev ? {...prev, name: `${e.target.value} ${prev.name.split(" ")[1] || ""}`} : null)} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Last Name</label>
                            <Input 
                              placeholder="Smith" 
                              value={profile?.name.split(" ")[1]} 
                              onChange={(e) => setProfile(prev => prev ? {...prev, name: `${prev.name.split(" ")[0]} ${e.target.value}`} : null)} 
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none">Email Address</label>
                          <Input 
                            placeholder="jane.smith@example.com" 
                            value={profile?.email} 
                            onChange={(e) => setProfile(prev => prev ? {...prev, email: e.target.value} : null)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium leading-none">Professional Title</label>
                          <Input 
                            placeholder="Product Designer" 
                            value={profile?.professionalTitle} 
                            onChange={(e) => setProfile(prev => prev ? {...prev, professionalTitle: e.target.value} : null)} 
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/5 p-6 flex justify-end">
                    <Button onClick={handleUpdateProfile} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5 shadow-xl glass-card">
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Permanently delete your account and all associated data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                  </CardContent>
                  <CardFooter className="border-t border-destructive/10 p-6 flex justify-end">
                    <Button variant="destructive">Delete Account</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="glass-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle>Password Authentication</CardTitle>
                    <CardDescription>Change your password to keep your account secure.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">New Password</label>
                        <Input type="password" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Confirm New Password</label>
                        <Input type="password" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/5 p-6 flex justify-end">
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>

                <Card className="glass-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-primary" />
                      Two-Factor Authentication
                    </CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="space-y-1">
                      <p className="font-bold text-sm">Authenticator App</p>
                      <p className="text-xs text-muted-foreground italic">Currently disabled</p>
                    </div>
                    <Button variant="outline">Setup 2FA</Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="glass-card border-none shadow-xl">
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                    <CardDescription>Customize your workspace experience.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-bold block">Theme Preference</label>
                      <div className="grid grid-cols-3 gap-4">
                        <ThemeCard 
                          icon={Sun} 
                          label="Light" 
                          active={theme === "light"} 
                          onClick={() => setTheme("light")}
                        />
                        <ThemeCard 
                          icon={Moon} 
                          label="Dark" 
                          active={theme === "dark"} 
                          onClick={() => setTheme("dark")}
                        />
                        <ThemeCard 
                          icon={Monitor} 
                          label="System" 
                          active={theme === "system"} 
                          onClick={() => setTheme("system")}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Globe className="h-4 w-4" /> Language
                        </label>
                        <select 
                          value={profile?.language}
                          onChange={(e) => setProfile(prev => prev ? {...prev, language: e.target.value} : null)}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        >
                          <option>English (United States)</option>
                          <option>Spanish (ES)</option>
                          <option>French (FR)</option>
                          <option>German (DE)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                          <Clock className="h-4 w-4" /> Timezone
                        </label>
                        <select 
                          value={profile?.timezone}
                          onChange={(e) => setProfile(prev => prev ? {...prev, timezone: e.target.value} : null)}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
                        >
                          <option>(GMT-08:00) Pacific Time</option>
                          <option>(GMT+00:00) UTC</option>
                          <option>(GMT+01:00) London</option>
                          <option>(GMT+05:30) Mumbai</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/5 p-6 flex justify-end">
                    <Button onClick={savePreferences} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Save Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {activeTab === "workspace" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <WorkspaceSettingsPage />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default function SettingsPage() {
  return (
    <React.Suspense fallback={
       <DashboardShell>
         <div className="flex items-center justify-center min-h-[400px]">
           <div className="animate-pulse text-muted-foreground font-medium">Loading settings...</div>
         </div>
       </DashboardShell>
    }>
      <SettingsContent />
    </React.Suspense>
  )
}

function SettingsNavItem({ icon: Icon, label, active, onClick }: { icon: LucideIcon, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group",
        active 
          ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active ? "text-primary-foreground" : "text-primary")} />
      {label}
    </button>
  )
}

function ThemeCard({ icon: Icon, label, active = false, onClick }: { icon: LucideIcon, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-primary/50",
        active ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/20"
      )}
    >
      <Icon className={cn("h-6 w-6", active ? "text-primary" : "text-muted-foreground")} />
      <span className={cn("text-xs font-bold", active ? "text-primary" : "text-muted-foreground")}>{label}</span>
    </div>
  )
}
