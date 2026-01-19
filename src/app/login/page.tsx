"use client"

import Link from "next/link"
import { Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/providers/auth-provider"
import { Loader2, Info } from "lucide-react"
import * as React from "react"
import { useToast } from "@/components/ui/toast"

export default function LoginPage() {
  const { login, loading } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      toast("Logged in as Demo User", "success")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong"
      setError(message)
      toast(message || "Login failed", "error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 leading-relaxed tracking-tight">
      <div className="absolute top-8 left-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <div className="bg-primary p-1 rounded-lg">
            <Command className="w-6 h-6 text-primary-foreground" />
          </div>
          <span>Team Control</span>
        </Link>
      </div>

      <Card className="w-full max-w-md glass-card border-none shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button type="button" variant="outline" disabled={loading}>
                Google
              </Button>
              <Button type="button" variant="outline" disabled={loading}>
                GitHub
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex gap-3 items-start animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Demo Credentials</p>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  <p>Email: <span className="text-foreground font-bold select-all">demo@example.com</span></p>
                  <p>Password: <span className="text-foreground font-bold select-all">demopassword</span></p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold leading-none" htmlFor="email">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold leading-none" htmlFor="password">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-primary hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button className="w-full font-bold" type="submit" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="text-primary hover:underline underline-offset-4 font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
