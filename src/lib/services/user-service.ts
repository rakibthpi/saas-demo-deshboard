export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  professionalTitle: string;
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
}

class UserService {
  private static PROFILE_KEY = "saas_user_profile";

  async getProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check for authenticated user first to keep in sync
        const authUser = localStorage.getItem("saas_user_data");
        const saved = localStorage.getItem(UserService.PROFILE_KEY);
        
        if (authUser) {
          const user = JSON.parse(authUser);
          const currentProfile = saved ? JSON.parse(saved) : {};
          
          resolve({
            id: user.id || "1",
            name: user.name || "Jane Smith",
            email: user.email || "jane.smith@example.com",
            avatar: user.avatar || "JS",
            role: user.role || "Owner",
            professionalTitle: currentProfile.professionalTitle || "Senior Product Designer",
            language: currentProfile.language || "English (United States)",
            timezone: currentProfile.timezone || "(GMT-08:00) Pacific Time",
            theme: user.preferences?.theme || currentProfile.theme || "system"
          });
        } else if (saved) {
          resolve(JSON.parse(saved));
        } else {
          const defaultProfile: UserProfile = {
            id: "1",
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatar: "JS",
            role: "Owner",
            professionalTitle: "Senior Product Designer",
            language: "English (United States)",
            timezone: "(GMT-08:00) Pacific Time",
            theme: "system"
          };
          resolve(defaultProfile);
        }
      }, 500);
    });
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(UserService.PROFILE_KEY, JSON.stringify(updated));
    return updated;
  }
}

export const userService = new UserService();
