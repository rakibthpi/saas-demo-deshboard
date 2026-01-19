"use client"

import * as React from "react"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { Role } from "@/lib/services/workspace-service"

interface CanProps {
  roles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Can({ roles, children, fallback = null }: CanProps) {
  const { currentWorkspace } = useWorkspace()
  
  if (!currentWorkspace) return null
  
  const hasAccess = roles.includes(currentWorkspace.role)
  
  if (!hasAccess) return fallback
  
  return <>{children}</>
}

export function isAllowed(currentRole: Role | undefined, allowedRoles: Role[]) {
  if (!currentRole) return false
  return allowedRoles.includes(currentRole)
}
