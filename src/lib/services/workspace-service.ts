export type Role = 'Owner' | 'Admin' | 'Member';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  role: Role; // Current user's role in this workspace
}

class WorkspaceService {
  private static STORAGE_KEY = 'saas_workspaces';

  private defaultWorkspaces: Workspace[] = [
    {
      id: 'ws-1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      role: 'Owner'
    },
    {
      id: 'ws-2',
      name: 'Design Studio',
      slug: 'design-studio',
      role: 'Admin'
    }
  ];

  constructor() {
    if (typeof window !== 'undefined' && !localStorage.getItem(WorkspaceService.STORAGE_KEY)) {
      localStorage.setItem(WorkspaceService.STORAGE_KEY, JSON.stringify(this.defaultWorkspaces));
    }
  }

  async getWorkspaces(): Promise<Workspace[]> {
    const data = localStorage.getItem(WorkspaceService.STORAGE_KEY);
    return data ? JSON.parse(data) : this.defaultWorkspaces;
  }

  async createWorkspace(name: string): Promise<Workspace> {
    const workspaces = await this.getWorkspaces();
    const newWs: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      role: 'Owner'
    };
    const updated = [...workspaces, newWs];
    localStorage.setItem(WorkspaceService.STORAGE_KEY, JSON.stringify(updated));
    return newWs;
  }

  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
    const workspaces = await this.getWorkspaces();
    const index = workspaces.findIndex(ws => ws.id === id);
    if (index === -1) throw new Error("Workspace not found");
    
    workspaces[index] = { ...workspaces[index], ...data };
    localStorage.setItem(WorkspaceService.STORAGE_KEY, JSON.stringify(workspaces));
    return workspaces[index];
  }

  async deleteWorkspace(id: string): Promise<void> {
    const workspaces = await this.getWorkspaces();
    const filtered = workspaces.filter(ws => ws.id !== id);
    localStorage.setItem(WorkspaceService.STORAGE_KEY, JSON.stringify(filtered));
  }
}

export const workspaceService = new WorkspaceService();
