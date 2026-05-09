const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_USER_KEY = "authUser";

const isBrowser = () => typeof window !== "undefined";

export const authStorageKeys = {
  accessToken: ACCESS_TOKEN_KEY,
  refreshToken: REFRESH_TOKEN_KEY,
  authUser: AUTH_USER_KEY,
} as const;

export interface StoredAuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export const authStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

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
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
