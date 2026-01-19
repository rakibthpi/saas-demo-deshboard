"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Shield, Users, CreditCard, Mail, Settings, MoreHorizontal, Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { notificationService, Notification } from "@/lib/services/notification-service"

const categories = ["All", "Team", "Billing", "Security", "System"]

export default function NotificationsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = React.useState("All")
  const [notifs, setNotifs] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchNotifs = async () => {
      const data = await notificationService.getNotifications()
      setNotifs(data)
      setLoading(false)
    }
    fetchNotifs()
  }, [])

  const filteredNotifs = activeCategory === "All" 
    ? notifs 
    : notifs.filter(n => n.category === activeCategory)

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id)
    setNotifs(await notificationService.getNotifications())
  }

  const deleteNotif = async (id: number) => {
    await notificationService.deleteNotification(id)
    setNotifs(await notificationService.getNotifications())
  }

  const markAllRead = async () => {
    await notificationService.markAllAsRead()
    setNotifs(await notificationService.getNotifications())
  }

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-pulse text-muted-foreground font-medium text-lg">Loading notifications...</div>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">Stay updated with everything happening in your workspace.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllRead}>Mark all read</Button>
            <Button variant="outline" size="sm" onClick={() => router.push("/settings?tab=preferences")}>Settings</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 border-r pr-8 space-y-6 hidden lg:block">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground px-2 pb-2">Categories</h3>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group",
                    activeCategory === cat 
                      ? "bg-primary text-primary-foreground font-medium shadow-md" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {cat}
                  {cat === "All" && notifs.some(n => n.unread) && (
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      activeCategory === cat ? "bg-primary-foreground" : "bg-primary"
                    )} />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-accent/30 border space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notification Settings</h4>
              <div className="space-y-4 pt-2">
                <NotificationToggle label="System Alerts" checked />
                <NotificationToggle label="Team Updates" checked />
                <NotificationToggle label="Billing Reports" />
                <NotificationToggle label="Security Warnings" checked />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 lg:hidden overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="shrink-0"
                >
                  {cat}
                </Button>
              ))}
            </div>

            <Card className="glass-card border-none shadow-xl overflow-hidden">
              <div className="divide-y relative">
                <AnimatePresence initial={false}>
                  {filteredNotifs.length > 0 ? (
                    filteredNotifs.map((n) => (
                      <motion.div 
                        key={n.id} 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div 
                          onClick={() => {
                            if (n.category === "Billing") router.push("/billing")
                            if (n.category === "Team") router.push("/team")
                            if (n.category === "Security") router.push("/settings?tab=security")
                            markAsRead(n.id)
                          }}
                          className={cn(
                            "p-6 flex gap-4 transition-all hover:bg-accent/30 group cursor-pointer",
                            n.unread && "bg-primary/[0.03]"
                          )}
                        >
                          <div className={cn(
                            "h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center shadow-lg",
                            n.category === "Team" ? "bg-blue-500/10 text-blue-500" :
                            n.category === "Billing" ? "bg-emerald-500/10 text-emerald-500" :
                            n.category === "Security" ? "bg-amber-500/10 text-amber-500" :
                            "bg-purple-500/10 text-purple-500"
                          )}>
                            {n.category === "Team" ? <Users className="h-6 w-6" /> :
                             n.category === "Billing" ? <CreditCard className="h-6 w-6" /> :
                             n.category === "Security" ? <Shield className="h-6 w-6" /> :
                             <Bell className="h-6 w-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-base">{n.title}</h4>
                                  {n.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-2xl">
                                  {n.description}
                                </p>
                                <span className="text-xs font-medium text-muted-foreground mt-3 block">{n.time}</span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(n.id)
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotif(n.id)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-12 text-center flex flex-col items-center gap-4"
                    >
                      <div className="h-16 w-16 bg-accent rounded-full flex items-center justify-center">
                        <Bell className="h-8 w-8 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-muted-foreground font-medium">No notifications in this category.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function NotificationToggle({ label, checked = false }: { label: string, checked?: boolean }) {
  const [active, setActive] = React.useState(checked)
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-medium">{label}</span>
      <button 
        onClick={() => setActive(!active)}
        className={cn(
          "w-8 h-4 rounded-full transition-colors relative",
          active ? "bg-primary" : "bg-muted"
        )}
      >
        <div className={cn(
          "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
          active ? "left-4.5" : "left-0.5"
        )} />
      </button>
    </div>
  )
}

