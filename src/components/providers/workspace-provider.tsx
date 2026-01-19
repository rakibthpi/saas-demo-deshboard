"use client"

import * as React from "react"
import { workspaceService, Workspace } from "@/lib/services/workspace-service"
import { useAuth } from "./auth-provider"

interface WorkspaceContextType {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  loading: boolean
  switchWorkspace: (id: string) => void
  createWorkspace: (name: string) => Promise<void>
  refreshWorkspaces: () => Promise<void>
}

const WorkspaceContext = React.createContext<WorkspaceContextType | undefined>(undefined)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace | null>(null)
  const [loading, setLoading] = React.useState(true)

  const fetchWorkspaces = React.useCallback(async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const data = await workspaceService.getWorkspaces()
      setWorkspaces(data)
      
      const savedId = localStorage.getItem('saas_active_workspace')
      const active = data.find(ws => ws.id === savedId) || data[0]
      
      if (active) {
        setCurrentWorkspace(active)
        localStorage.setItem('saas_active_workspace', active.id)
      }
    } catch (error) {
      console.error("Failed to fetch workspaces", error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  React.useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  const switchWorkspace = (id: string) => {
    const active = workspaces.find(ws => ws.id === id)
    if (active) {
      setCurrentWorkspace(active)
      localStorage.setItem('saas_active_workspace', id)
      // Force reload or redirect to dashboard if needed
    }
  }

  const createWorkspace = async (name: string) => {
    const newWs = await workspaceService.createWorkspace(name)
    setWorkspaces(prev => [...prev, newWs])
    switchWorkspace(newWs.id)
  }

  return (
    <WorkspaceContext.Provider value={{ 
      currentWorkspace, 
      workspaces, 
      loading, 
      switchWorkspace, 
      createWorkspace,
      refreshWorkspaces: fetchWorkspaces
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export const useWorkspace = () => {
  const context = React.useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider")
  }
  return context
}
