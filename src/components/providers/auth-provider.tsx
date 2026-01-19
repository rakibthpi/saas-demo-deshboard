"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService, User } from "@/lib/services/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isPublicRoute = React.useMemo(() => {
    return ["/login", "/register", "/forgot-password"].includes(pathname)
  }, [pathname])

  const checkAuth = React.useCallback(() => {
    const authenticated = authService.isAuthenticated()
    const currentUser = authService.getUser()
    
    setUser(currentUser)
    setLoading(false)

    if (!authenticated && !isPublicRoute) {
      router.push("/login")
    } else if (authenticated && isPublicRoute) {
      router.push("/")
    }
  }, [isPublicRoute, router])

  React.useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const userData = await authService.login(email, password)
      setUser(userData)
      router.push("/")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
