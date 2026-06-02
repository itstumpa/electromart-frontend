import type { User, UserRole } from "@/data/types";
import type { MeResponseData } from "@/types/auth";

export const mapMeToUser = (me: MeResponseData): User => ({
  id: me.id,
  name: me.name,
  email: me.email,
  role: normalizeUserRole(me.role),
  isVerified: me.isEmailVerified,
  isBanned: false,
  avatar:     me.avatar || undefined,     
  phone:      me.phone || undefined,
  createdAt: me.createdAt,
  updatedAt: me.createdAt,
});

export const normalizeUserRole = (role: string): UserRole => {
  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "VENDOR" || role === "CUSTOMER" || role === "DELIVERY") {
    return role as UserRole;
  }
  return "CUSTOMER";
};
