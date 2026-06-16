import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { NotificationDto } from "@/types/notification";

export const getMyNotifications = () => {
  return api.get<ApiResponse<NotificationDto[]>>("/notifications/me");
};

export const getUnreadNotificationCount = () => {
  return api.get<ApiResponse<{ count: number }>>("/notifications/unread-count");
};

export const markNotificationRead = (id: string) => {
  return api.patch<ApiResponse<null>>(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = () => {
  return api.patch<ApiResponse<null>>("/notifications/mark-all-read");
};
