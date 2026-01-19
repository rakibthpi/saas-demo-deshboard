"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/shell"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWorkspace } from "@/components/providers/workspace-provider"
import { workspaceService } from "@/lib/services/workspace-service"
import { Building, Trash2, ShieldAlert, Loader2 } from "lucide-react"
import { Can } from "@/components/shared/rbac-guard"

export default function WorkspaceSettingsPage() {
  const { currentWorkspace, refreshWorkspaces } = useWorkspace()
  const [name, setName] = React.useState(currentWorkspace?.name || "")
  const [slug, setSlug] = React.useState(currentWorkspace?.slug || "")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (currentWorkspace) {
      setName(currentWorkspace.name)
      setSlug(currentWorkspace.slug)
    }
  }, [currentWorkspace])

  const handleSave = async () => {
    if (!currentWorkspace) return
    setLoading(true)
    try {
      await workspaceService.updateWorkspace(currentWorkspace.id, { name, slug })
      await refreshWorkspaces()
      alert("Workspace updated successfully")
    } catch (error) {
      alert("Failed to update workspace")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="flex flex-col gap-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Workspace Settings</h1>
          <p className="text-muted-foreground">Manage your organization's core identity and administrative settings.</p>
        </div>

        <div className="grid gap-6">
          <Card className="glass-card border-none shadow-xl overflow-hidden">
            <CardHeader className="bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Workspace Profile</CardTitle>
                  <CardDescription>Public identity of your organization</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Workspace Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Acme Corp"
                    className="h-11 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Workspace URL</label>
                  <div className="flex items-center">
                    <div className="bg-muted px-3 h-11 flex items-center rounded-l-md border-r text-xs text-muted-foreground font-medium">
                      abz.com
                    </div>
                    <Input 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="acme-corp"
                      className="h-11 rounded-l-none shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t flex justify-end p-4">
              <Button onClick={handleSave} disabled={loading} className="font-bold px-8">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Can roles={['Owner']}>
            <Card className="border-destructive/20 bg-destructive/5 overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  <CardTitle>Danger Zone</CardTitle>
                </div>
                <CardDescription>
                  Permanently delete this workspace and all associated data. This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardFooter className="bg-destructive/10 p-4 border-t border-destructive/10 flex justify-between items-center">
                <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                  <ShieldAlert className="h-4 w-4" />
                  Action is irreversible
                </div>
                <Button variant="destructive" className="font-bold">
                  Delete Workspace
                </Button>
              </CardFooter>
            </Card>
          </Can>
        </div>
      </div>
    </DashboardShell>
  )
}
