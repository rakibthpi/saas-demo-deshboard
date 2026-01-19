"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Check } from "lucide-react"
import Image from "next/image"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function TeamSwitcher() {
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace()
  
  if (!currentWorkspace) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2 h-9 hover:bg-accent/50 transition-colors focus-visible:ring-0"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary font-bold text-xs">
            {currentWorkspace.logo ? (
              <Image 
                src={currentWorkspace.logo} 
                alt={currentWorkspace.name} 
                fill
                className="rounded object-cover"
                unoptimized
              />
            ) : (
              currentWorkspace.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <span className="text-sm font-semibold truncate max-w-[120px]">
            {currentWorkspace.name}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 glass-card border-none shadow-2xl">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          Workspaces
        </DropdownMenuLabel>
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => switchWorkspace(ws.id)}
            className="flex items-center gap-2 cursor-pointer py-2"
          >
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded font-bold text-[10px]",
              ws.id === currentWorkspace.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              {ws.name.substring(0, 2).toUpperCase()}
            </div>
            <span className="flex-1 truncate">{ws.name}</span>
            {ws.id === currentWorkspace.id && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2 text-primary font-medium">
          <Plus className="h-4 w-4" />
          <span>Create Workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
