"use client"

import { DashboardShell } from "@/components/layout/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, Mail, Shield, UserMinus, ShieldAlert } from "lucide-react"
import * as React from "react"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { teamService, TeamMember } from "@/lib/services/team-service"
import { Can } from "@/components/shared/rbac-guard"
import { cn } from "@/lib/utils"
import { InviteMemberDialog } from "@/components/team/invite-member-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TeamPage() {
  const { currentWorkspace } = useWorkspace()
  const [members, setMembers] = React.useState<TeamMember[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [inviteOpen, setInviteOpen] = React.useState(false)

  const fetchMembers = React.useCallback(async () => {
    if (!currentWorkspace) return
    setLoading(true)
    try {
      const data = await teamService.getMembers(currentWorkspace.id)
      setMembers(data)
    } finally {
      setLoading(false)
    }
  }, [currentWorkspace])

  React.useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleRemove = async (memberId: string) => {
    if (!currentWorkspace) return
    await teamService.removeMember(currentWorkspace.id, memberId)
    fetchMembers()
  }

  const handleChangeRole = async (memberId: string, role: any) => {
    if (!currentWorkspace) return
    await teamService.updateMemberRole(currentWorkspace.id, memberId, role)
    fetchMembers()
  }

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <DashboardShell>
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground font-medium">Loading team members...</div>
      </div>
    </DashboardShell>
  )

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
            <p className="text-muted-foreground">Manage your organization members and their access levels.</p>
          </div>
          <Can roles={['Owner', 'Admin']}>
            <Button 
              className="flex items-center gap-2 font-bold shadow-lg shadow-primary/20"
              onClick={() => setInviteOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </Can>
        </div>

        <InviteMemberDialog 
          open={inviteOpen} 
          onOpenChange={setInviteOpen} 
          onSuccess={fetchMembers} 
        />

        <Card className="glass-card border-none shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Members</CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="pl-10 bg-background/50 h-10 border-none shadow-inner" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              {filteredMembers.length} members found in {currentWorkspace?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground/70 uppercase text-[10px] font-bold tracking-wider">
                    <th className="text-left py-4 px-2">Member</th>
                    <th className="text-left py-4 px-2">Role</th>
                    <th className="text-left py-4 px-2">Status</th>
                    <th className="text-right py-4 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="group hover:bg-primary/[0.02] transition-colors">
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-white flex items-center justify-center font-bold shadow-md">
                            {member.avatar ? <img src={member.avatar} alt="" /> : member.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground text-sm">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                            member.role === 'Owner' ? "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20" :
                            member.role === 'Admin' ? "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20" :
                            "bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20"
                          )}>
                            {member.role}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          member.status === "Active" 
                            ? "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20" 
                            : "bg-orange-500/10 text-orange-600 ring-1 ring-orange-500/20"
                        )}>
                          <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            member.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-orange-500"
                          )} />
                          {member.status}
                        </span>
                      </td>
                      <td className="py-5 px-2 text-right">
                        <Can roles={['Owner', 'Admin']}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-accent">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 glass-card border-none shadow-2xl">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleChangeRole(member.id, 'Admin')}>
                                <Shield className="h-4 w-4 text-blue-500" />
                                <span>Make Admin</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => handleChangeRole(member.id, 'Member')}>
                                <Shield className="h-4 w-4 text-slate-500" />
                                <span>Make Member</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={() => handleRemove(member.id)}>
                                <UserMinus className="h-4 w-4" />
                                <span>Remove Member</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </Can>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
