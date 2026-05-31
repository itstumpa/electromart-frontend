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

export const deleteAccount = (userId: string) => {
  return api.delete<ApiResponse<null>>(`/users/${userId}`);
};

export interface NotificationPrefs {
  notifOrderUpdates: boolean;
  notifPromotions: boolean;
  notifWishlistSale: boolean;
  notifReviewReminder: boolean;
  notifDeliveryAlerts: boolean;
  notifWeeklyDigest: boolean;
}

export const getNotificationPrefs = () => {
  return api.get<ApiResponse<NotificationPrefs>>('/users/me/notification-prefs');
};

export const updateNotificationPrefs = (data: Partial<NotificationPrefs>) => {
  return api.patch<ApiResponse<NotificationPrefs>>('/users/me/notification-prefs', data);
};
