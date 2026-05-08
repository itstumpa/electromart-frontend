import { apiCall } from '../api-client';

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUser(id: string): Promise<User> {
  return apiCall<User>(`/api/v1/users/${id}`);
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return apiCall<User>(`/api/v1/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}