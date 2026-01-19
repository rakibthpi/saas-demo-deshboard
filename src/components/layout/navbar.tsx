"use client"

import * as React from "react"
import { Search, Bell, User, Sun, Moon, LogOut, Settings, CreditCard, Shield, Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/providers/auth-provider"
import { notificationService, Notification } from "@/lib/services/notification-service"
import { cn } from "@/lib/utils"
import { TeamSwitcher } from "./team-switcher"

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [notifs, setNotifs] = React.useState<Notification[]>([])
  const unreadCount = notifs.filter(n => n.unread).length

  React.useEffect(() => {
    setMounted(true)
    const fetchNotifs = async () => {
      const data = await notificationService.getNotifications()
      setNotifs(data)
    }
    fetchNotifs()
  }, [])

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead()
    setNotifs(await notificationService.getNotifications())
  }

  const clearNotifications = async () => {
    // For demo purposes, we'll just clear the state
    setNotifs([])
  }

  const handleLogout = () => {
    logout()
  }

  if (!mounted) return null

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur sticky top-0 z-10 w-full">
      <div className="flex items-center justify-between h-full px-6 gap-4">
        <div className="flex items-center gap-4 flex-1">
          <TeamSwitcher />
          <div className="max-w-md hidden md:block flex-1">
            <div className="relative group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="pl-9 h-9 bg-accent/50 border-transparent focus:bg-background transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full border-2 border-background flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] p-0 overflow-hidden glass-card border-none shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <DropdownMenuLabel className="p-0 font-bold text-base">Notifications</DropdownMenuLabel>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 text-xs px-2" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <Bell className="h-8 w-8 opacity-20" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        if (n.category === "Billing") router.push("/billing")
                        if (n.category === "Team") router.push("/team")
                        setNotifs(notifs.map(notif => notif.id === n.id ? { ...notif, unread: false } : notif))
                      }}
                      className={cn(
                        "flex gap-4 p-4 transition-colors hover:bg-muted/50 relative cursor-pointer",
                        n.unread && "bg-primary/5"
                      )}
                    >
                      {n.unread && <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />}
                      <div className={cn(
                        "h-10 w-10 shrink-0 rounded-full flex items-center justify-center",
                        n.category === "Team" ? "bg-blue-500/10 text-blue-500" :
                        n.category === "Billing" ? "bg-emerald-500/10 text-emerald-500" :
                        "bg-amber-500/10 text-amber-500"
                      )}>
                        {n.category === "Team" ? <User className="h-5 w-5" /> :
                         n.category === "Billing" ? <CreditCard className="h-5 w-5" /> :
                         <Shield className="h-5 w-5" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold leading-none">{n.title}</p>
                          <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {n.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifs.length > 0 && (
                <div className="p-2 border-t bg-muted/10">
                  <Button 
                    variant="ghost" 
                    className="w-full h-10 text-xs font-semibold hover:bg-muted/50 rounded-none"
                    onClick={clearNotifications}
                  >
                    Clear All Notifications
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-accent p-0 overflow-hidden hover:ring-2 ring-primary/20 transition-all">
                {user?.avatar ? (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold">
                    {user.avatar}
                  </div>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none">{user?.name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 py-2"
                  onClick={() => router.push("/settings")}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 py-2"
                  onClick={() => router.push("/billing")}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2 py-2"
                  onClick={() => router.push("/settings?tab=preferences")}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer gap-2 py-2 text-destructive focus:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
