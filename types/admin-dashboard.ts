// types/admin-dashboard.ts
// ── Overview response ─────────────────────────────────────────────────────────

export interface DashboardRecentOrder {
  id: string;
  orderNumber?: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: { id: string }[];
}

export interface DashboardTopProduct {
  id: string;
  name: string;
  price: number;
  images: { url: string }[];
  store: { id: string; name: string };
  totalSold: number;
  totalOrders: number;
}

export interface DashboardPendingVendor {
  id: string;
  name: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
}

export interface RevenueDataPoint {
  month: string;   // "YYYY-MM"
  revenue: number;
  orders: number;
}

export interface DashboardOverview {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalStores: number;
  ordersByStatus: Record<string, number>;
  usersByRole: Record<string, number>;
  recentOrders: DashboardRecentOrder[];
  topProducts: DashboardTopProduct[];
  pendingVendors: DashboardPendingVendor[];
  revenueData: RevenueDataPoint[];
}
