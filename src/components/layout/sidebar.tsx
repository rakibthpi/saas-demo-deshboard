"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  CreditCard, 
  Bell, 
  Search,
  Menu,
  ChevronLeft,
  LogOut,
  Command
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Can, isAllowed } from "@/components/shared/rbac-guard"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", roles: ["Owner", "Admin", "Member"] },
  { label: "Team", icon: Users, href: "/team", roles: ["Owner", "Admin", "Member"] },
  { label: "Billing", icon: CreditCard, href: "/billing", roles: ["Owner", "Admin"] },
  { label: "Notifications", icon: Bell, href: "/notifications", roles: ["Owner", "Admin", "Member"] },
  { label: "Settings", icon: Settings, href: "/settings", roles: ["Owner", "Admin", "Member"] },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const { currentWorkspace } = useWorkspace()

  const filteredNavItems = navItems.filter(item => 
    isAllowed(currentWorkspace?.role, item.roles as any)
  )

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 border-r bg-card transition-all duration-300 z-20",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="bg-primary p-1 rounded-lg">
            <Command className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && <span className="text-xl tracking-tight">Team</span>}
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-2 mt-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
              pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            {collapsed && (
              <div className="absolute left-16 scale-0 group-hover:scale-100 transition-transform bg-popover text-popover-foreground px-2 py-1 rounded text-xs border shadow-lg whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 w-full px-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[-30px] border shadow bg-background rounded-full w-6 h-6 z-30"
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>
    </aside>
  )
}
