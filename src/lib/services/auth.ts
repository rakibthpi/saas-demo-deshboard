export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Owner' | 'Admin' | 'Member';
  preferences?: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
  };
}

class AuthService {
  private static AUTH_KEY = "saas_auth_token";
  private static USER_KEY = "saas_user_data";

  // Demo credentials
  private static DEMO_EMAIL = "demo@example.com";
  private static DEMO_PASSWORD = "demopassword";

  async login(email: string, password: string): Promise<User> {
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Strict validation for demo mode or any non-empty for dev
        const isDemo = email === AuthService.DEMO_EMAIL && password === AuthService.DEMO_PASSWORD;
        
        if (isDemo) {
          const mockUser: User = {
            id: "demo-user-1",
            name: "Demo User",
            email: AuthService.DEMO_EMAIL,
            avatar: "DU",
            role: "Owner",
            preferences: {
              theme: "system",
              notifications: true
            }
          };
          this.setSession(mockUser);
          resolve(mockUser);
        } else if (email && password) {
          // Allow other logins for development flexibility if needed, 
          // but we can make it strict demo-only as per request.
          // For now, let's stick to the user's specific requirement.
          if (email === "jane.smith@example.com" && password === "password") {
            const mockUser: User = {
              id: "1",
              name: "Jane Smith",
              email: "jane.smith@example.com",
              avatar: "JS",
              role: "Owner",
              preferences: {
                theme: "system",
                notifications: true
              }
            };
            this.setSession(mockUser);
            resolve(mockUser);
          } else {
            reject(new Error("Invalid email or password. Hint: Use demo@example.com / demopassword"));
          }
        } else {
          reject(new Error("Please enter both email and password"));
        }
      }, 800);
    });
  }

  private setSession(user: User): void {
    const token = "mock-jwt-token-" + Math.random().toString(36).substring(7);
    localStorage.setItem(AuthService.AUTH_KEY, token);
    localStorage.setItem(AuthService.USER_KEY, JSON.stringify(user));
    // Set cookie for middleware
    document.cookie = `${AuthService.AUTH_KEY}=${token}; path=/; max-age=604800; samesite=lax`;
  }

  logout(): void {
    localStorage.removeItem(AuthService.AUTH_KEY);
    localStorage.removeItem(AuthService.USER_KEY);
    document.cookie = `${AuthService.AUTH_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem(AuthService.AUTH_KEY);
  }

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem(AuthService.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }
}

export const authService = new AuthService();
