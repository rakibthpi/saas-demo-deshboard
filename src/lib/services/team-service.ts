import { Role } from "./workspace-service";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Pending';
  avatar?: string;
  joinedAt: string;
}

class TeamService {
  private static STORAGE_PREFIX = 'saas_team_';

  private mockMembers: Record<string, TeamMember[]> = {
    'ws-1': [
      { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Owner', status: 'Active', joinedAt: '2025-01-01' },
      { id: '2', name: 'Jackson Lee', email: 'jackson.lee@email.com', role: 'Admin', status: 'Active', joinedAt: '2025-02-15' },
      { id: '3', name: 'Olivia Martin', email: 'olivia.martin@email.com', role: 'Member', status: 'Active', joinedAt: '2025-03-10' },
      { id: '4', name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', role: 'Member', status: 'Pending', joinedAt: '2026-01-10' },
    ],
    'ws-2': [
      { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', status: 'Active', joinedAt: '2025-05-01' },
      { id: '5', name: 'William Kim', email: 'will@email.com', role: 'Owner', status: 'Active', joinedAt: '2025-06-20' },
    ]
  };

  private getStorageKey(workspaceId: string) {
    return `${TeamService.STORAGE_PREFIX}${workspaceId}`;
  }

  async getMembers(workspaceId: string): Promise<TeamMember[]> {
    const data = localStorage.getItem(this.getStorageKey(workspaceId));
    if (data) return JSON.parse(data);
    
    const members = this.mockMembers[workspaceId] || [];
    localStorage.setItem(this.getStorageKey(workspaceId), JSON.stringify(members));
    return members;
  }

  async inviteMember(workspaceId: string, email: string, role: Role): Promise<TeamMember> {
    const members = await this.getMembers(workspaceId);
    const newMember: TeamMember = {
      id: `m-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role,
      status: 'Pending',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...members, newMember];
    localStorage.setItem(this.getStorageKey(workspaceId), JSON.stringify(updated));
    return newMember;
  }

  async updateMemberRole(workspaceId: string, memberId: string, role: Role): Promise<void> {
    const members = await this.getMembers(workspaceId);
    const index = members.findIndex(m => m.id === memberId);
    if (index === -1) throw new Error("Member not found");
    
    members[index].role = role;
    localStorage.setItem(this.getStorageKey(workspaceId), JSON.stringify(members));
  }

  async removeMember(workspaceId: string, memberId: string): Promise<void> {
    const members = await this.getMembers(workspaceId);
    const filtered = members.filter(m => m.id !== memberId);
    localStorage.setItem(this.getStorageKey(workspaceId), JSON.stringify(filtered));
  }

  async revokeInvite(workspaceId: string, memberId: string): Promise<void> {
    return this.removeMember(workspaceId, memberId);
  }
}

export const teamService = new TeamService();
