import type { Notification, NotificationType } from "@/data/types";
import type { NotificationDto } from "@/types/notification";

const TYPE_MAP: Record<string, NotificationType> = {
  ORDER: "order",
  REVIEW: "review",
  SYSTEM: "system",
  PROMOTION: "promotion",
  DELIVERY: "delivery",
};

export const mapNotificationDtoToUi = (dto: NotificationDto): Notification => ({
  id: dto.id,
  userId: dto.userId,
  type: TYPE_MAP[dto.type.toUpperCase()] ?? "system",
  title: dto.title,
  message: dto.message,
  isRead: dto.isRead,
  createdAt: dto.createdAt,
});
