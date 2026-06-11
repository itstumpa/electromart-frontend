import api from "./axios";
import type { ApiResponse } from "@/types/api";
import type { ProductsMeta } from "@/types/product";

export interface AdminDashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalStores: number;
  ordersByStatus: Array<{ status: string; _count: { status: number } }>;
  usersByRole: Array<{ role: string; _count: { role: number } }>;
  recentOrders: unknown[];
  topProducts: unknown[];
}

export const getAdminDashboard = () => {
  return api.get<ApiResponse<AdminDashboardOverview>>("/admin/dashboard");
};

export const getAdminVendors = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return api.get<ApiResponse<unknown[]> & { meta?: ProductsMeta }>(
    "/admin/vendors",
    { params },
  );
};

/* ── Admin Coupon API ────────────────────────────────── */

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  discountPercent: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startDate: string | null;
  expiryDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getAdminCoupons = () => {
  return api.get<ApiResponse<AdminCoupon[]>>("/coupons");
};

export const createAdminCoupon = (data: {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  startDate?: string;
  expiryDate?: string;
  isActive?: boolean;
}) => {
  return api.post<ApiResponse<AdminCoupon>>("/coupons", data);
};

export const updateAdminCoupon = (
  id: string,
  data: Partial<{
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    minOrderAmount: number | null;
    maxDiscount: number | null;
    usageLimit: number | null;
    startDate: string | null;
    expiryDate: string | null;
    isActive: boolean;
  }>,
) => {
  return api.patch<ApiResponse<AdminCoupon>>(`/coupons/${id}`, data);
};

export const toggleAdminCoupon = (id: string) => {
  return api.patch<ApiResponse<AdminCoupon>>(`/coupons/${id}/toggle`);
};

export const deleteAdminCoupon = (id: string) => {
  return api.delete<ApiResponse<null>>(`/coupons/${id}`);
};
