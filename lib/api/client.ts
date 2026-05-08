import { ROUTES, API_BASE } from './routes';

interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClient {
  private getAuthToken(): string | null {
    // Later: Get from cookies or localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = this.getAuthToken();

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options?.headers,
      },
      ...options,
    });

    // Check response
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'API Error',
        statusCode: response.status,
      };
      throw error;
    }

    return data.data || data; // Adjust based on your backend response format
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();