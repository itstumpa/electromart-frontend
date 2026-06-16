import Cookies from 'js-cookie';

const CSRF_COOKIE_NAME = 'x-csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Returns the current CSRF token from the non-httpOnly cookie set by the backend.
 */
export function getCsrfToken(): string | undefined {
  return Cookies.get(CSRF_COOKIE_NAME);
}

/**
 * Fetches a fresh CSRF token from the server.
 * The server sets the token as a non-httpOnly cookie which is then readable by JS.
 */
export async function refreshCsrfToken(): Promise<string | undefined> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/auth/csrf-token`, {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return data.csrfToken;
    }
  } catch {
    // Silently fail — CSRF token will be refreshed on next request
  }
  return undefined;
}

/**
 * Returns the CSRF header config for axios-like requests.
 */
export function csrfHeader(): Record<string, string> {
  const token = getCsrfToken();
  return token ? { [CSRF_HEADER_NAME]: token } : {};
}
