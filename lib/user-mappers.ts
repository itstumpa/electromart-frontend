import type { User, UserRole } from "@/data/types";
import type { MeResponseData } from "@/types/auth";

export const mapMeToUser = (me: MeResponseData): User => ({
  id: me.id,
  name: me.name,
  email: me.email,
  role: normalizeUserRole(me.role),
  isVerified: me.isEmailVerified,
  isBanned: false,
  createdAt: me.createdAt,
  updatedAt: me.createdAt,
});

export const normalizeUserRole = (role: string): UserRole => {
  // if (role === "ADMIN") return "SUPER_ADMIN";
  if (role === "SUPER_ADMIN" || role === "VENDOR" || role === "CUSTOMER" || role === "DELIVERY") {
    return role;
  }
  return "CUSTOMER";
};
