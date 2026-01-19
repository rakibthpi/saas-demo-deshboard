"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, CheckCircle2, Loader2 } from "lucide-react"

export default function InviteAcceptancePage() {
  const router = useRouter()
  const [status, setStatus] = React.useState<'loading' | 'pending' | 'accepted'>('pending')

  const handleAccept = async () => {
    setStatus('loading')
    // Simulate API call
    setTimeout(() => {
      setStatus('accepted')
    }, 1500)
  }

  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full glass-card border-none shadow-2xl text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Invitation Accepted!</h1>
          <p className="text-muted-foreground mb-8">
            You are now a member of <span className="text-foreground font-bold">Acme Corp</span>.
            Welcome to the team!
          </p>
          <Button onClick={() => router.push('/')} className="w-full font-bold h-11">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full glass-card border-none shadow-2xl overflow-hidden">
        <div className="bg-primary h-2 w-full" />
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Building className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join Acme Corp</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join the <span className="text-foreground font-bold italic">Acme Corp</span> workspace on Team Control.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 text-center">
          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-sm text-muted-foreground">
            As a <span className="text-primary font-bold">Member</span>, you&apos;ll be able to view and edit workspace projects and collaborate with your team.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6 pt-0">
          <Button 
            onClick={handleAccept} 
            className="w-full font-bold h-12 shadow-lg shadow-primary/20" 
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : "Accept Invitation"}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground h-11" disabled={status === 'loading'}>
            Decline
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
