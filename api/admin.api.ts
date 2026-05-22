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
