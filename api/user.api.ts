import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { ProductsMeta } from "@/types/product";

export interface UserListItemDto {
  id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified?: boolean;
  createdAt: string;
}

export const getAllUsers = (params?: { page?: number; limit?: number }) => {
  return api.get<ApiResponse<UserListItemDto[]> & { meta?: ProductsMeta }>(
    "/users",
    { params },
  );
};

export const updateUserProfile = (
  id: string,
  data: { name?: string; email?: string },
) => {
  return api.patch<ApiResponse<UserListItemDto>>(`/users/${id}`, data);
};
