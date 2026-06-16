import type { ApiResponse } from "@/types/api";
import api from "./axios";

export interface VendorAnalyticsDto {
  store: { id: string; name: string };
  ordersByStatus: Record<string, number>;
  totalCustomers: number;
  averageOrderValue: number;
  topProducts: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    totalRevenue: number;
    totalSold: number;
  }[];
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
}

export const getMyAnalytics = () => {
  return api.get<ApiResponse<VendorAnalyticsDto>>("/vendor-analytics");
};
