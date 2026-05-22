const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const AUTH_USER_KEY = 'authUser';

const isBrowser = () => typeof window !== 'undefined';

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
      if (!parsed?.id || !parsed?.email || !parsed?.name || !parsed?.role) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  setAuthUser(user: StoredAuthUser): void {
    if (!isBrowser()) return;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  setRefreshToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearSession(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};