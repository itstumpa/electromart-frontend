const AUTH_USER_KEY = "authUser";

const isBrowser = () => typeof window !== "undefined";

export interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authStorage = {
  getAuthUser(): StoredAuthUser | null {
    if (!isBrowser()) return null;
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    if (!userJson) return null;

    try {
      const parsed = JSON.parse(userJson) as StoredAuthUser;
      if (!parsed?.id || !parsed?.email || !parsed?.name || !parsed?.role) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },

  setAuthUser(user: StoredAuthUser): void {
    if (!isBrowser()) return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  clearAuthUser(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(AUTH_USER_KEY);
  },

  clearSession(): void {
    if (!isBrowser()) return;
    // Tokens are stored in httpOnly cookies — cleared by POST /auth/logout
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
