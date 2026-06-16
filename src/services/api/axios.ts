import axios from "axios";
import { getCsrfToken, refreshCsrfToken } from "@/lib/csrf";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// ── CSRF Interceptor ──────────────────────────────────────────────────
// Adds CSRF token header to all state-changing (non-GET) requests.
// If no token is available, fetches one first.
api.interceptors.request.use(async (config) => {
  if (config.method && !['get', 'head', 'options'].includes(config.method)) {
    let token = getCsrfToken();
    if (!token) {
      await refreshCsrfToken();
      token = getCsrfToken();
    }
    if (token) {
      config.headers['x-csrf-token'] = token;
    }
  }
  return config;
});

// ── CSRF Error Handler ────────────────────────────────────────────────
// If we get a 403 with CSRF-related error, refresh the token and retry.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 403 &&
      !originalRequest._csrfRetry &&
      getCsrfToken()
    ) {
      originalRequest._csrfRetry = true;
      await refreshCsrfToken();
      const newToken = getCsrfToken();
      if (newToken) {
        originalRequest.headers['x-csrf-token'] = newToken;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
