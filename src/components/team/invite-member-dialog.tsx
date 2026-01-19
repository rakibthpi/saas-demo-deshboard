"use client"

import * as React from "react"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { teamService } from "@/lib/services/team-service"
import { Role } from "@/lib/services/workspace-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Mail, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InviteMemberDialog({ open, onOpenChange, onSuccess }: InviteMemberDialogProps) {
  const { currentWorkspace } = useWorkspace()
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<Role>("Member")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentWorkspace) return
    
    setLoading(true)
    try {
      await teamService.inviteMember(currentWorkspace.id, email, role)
      onSuccess()
      onOpenChange(false)
      setEmail("")
      setRole("Member")
    } catch (error) {
      alert("Failed to send invite")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] glass-card border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invite Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join <span className="text-foreground font-semibold">{currentWorkspace?.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-bold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="colleague@example.com" 
                className="pl-10 h-11" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold">Workspace Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Admin', 'Member'] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={cn(
                    "flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all",
                    role === r ? "border-primary bg-primary/5 shadow-md" : "border-transparent bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Shield className={cn("h-4 w-4", role === r ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-bold", role === r ? "text-primary" : "text-foreground")}>{r}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight">
                    {r === 'Admin' ? 'Can manage members and settings' : 'Can view and edit workspace data'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full font-bold h-11" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
