// app/dashboard/admin/page.tsx
// SERVER COMPONENT — fetches all data, zero client JS for data loading.

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import RevenueChart from "@/components/dashboard/admin/Revenuechart";
import StatCard from "@/components/dashboard/admin/Statcard";
import {
  mockAdminAnalytics,
  mockOrders,
  mockVendorProfiles,
} from "@/data/mock-data";
import { fetchDashboardOverview } from "@/lib/api/admin/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Overview — ElectroMart" };

// ── Status badge config ───────────────────────────────────────────────────────
const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  PROCESSING: {
    label: "Processing",
    color: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  SHIPPED: {
    label: "Shipped",
    color: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Del",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
  REFUNDED: {
    label: "Refunded",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
  // lowercase fallbacks for mock data
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  processing: {
    label: "Processing",
    color: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-cyan-100 text-cyan-700",
    dot: "bg-cyan-500",
  },
  out_for_delivery: {
    label: "Out for Del",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-600",
    dot: "bg-red-500",
  },
  refunded: {
    label: "Refunded",
    color: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
  },
};

const fallbackStatus = {
  label: "Unknown",
  color: "bg-slate-100 text-slate-500",
  dot: "bg-slate-300",
};
export default async function AdminOverviewPage() {
  let overviewData;

  try {
    overviewData = await fetchDashboardOverview();
  } catch (error) {
    console.error(
      "Failed to fetch dynamic admin overview data, using mock fallback:",
      error,
    );

    // Derive ordersByStatus mapping for quick stats
    const ordersByStatus: Record<string, number> = {};
    mockOrders.forEach((o) => {
      const status = o.status.toUpperCase();
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });

    overviewData = {
      totalRevenue: mockAdminAnalytics.totalRevenue,
      totalOrders: mockAdminAnalytics.totalOrders,
      totalUsers: mockAdminAnalytics.totalUsers,
      totalProducts: mockAdminAnalytics.totalProducts,
      ordersByStatus,
      recentOrders: mockOrders.slice(0, 5).map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        user: {
          id: o.customerId || "mock-customer",
          name: o.customerName,
          email: o.customerEmail,
        },
        items: [],
      })),
      topProducts: mockAdminAnalytics.topProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        images: [{ url: p.image }],
        store: { id: "mock-store", name: "Mock Store" },
        totalSold: p.reviewCount * 2,
        totalOrders: p.reviewCount,
      })),
      pendingVendors: mockVendorProfiles
        .filter((v) => !v.isApproved)
        .map((v) => ({
          id: v.id,
          name: v.storeName,
          isApproved: false,
          isActive: true,
          createdAt: v.createdAt || new Date().toISOString(),
          owner: {
            id: v.userId,
            name: v.storeName,
            email: "",
          },
        })),
      totalStores: mockVendorProfiles.length,
      revenueData: mockAdminAnalytics.revenueData,
    };
  }

  const {
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    ordersByStatus,
    recentOrders,
    topProducts,
    pendingVendors,
    totalStores,
    revenueData,
  } = overviewData;

  const stats = [
    {
      label: "Total Revenue",
      value: totalRevenue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      change: 12.5,
      trend: "up" as const,
      icon: DollarSign,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-700",
      prefix: "$",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      change: 8.2,
      trend: "up" as const,
      icon: ShoppingBag,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-700",
    },
    {
      label: "Total Users",
      value: totalUsers.toLocaleString(),
      change: 15.3,
      trend: "up" as const,
      icon: Users,
      iconBg: "bg-green-100",
      iconColor: "text-green-700",
    },
    {
      label: "Total Vendors",
      value: totalStores.toLocaleString(),
      change: 4.2,
      trend: "up" as const,
      icon: Store,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-700",
    },
    {
      label: "Total Products",
      value: totalProducts.toLocaleString(),
      change: 3.1,
      trend: "down" as const,
      icon: Package,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-700",
    },
  ];

  const pendingOrdersCount =
    ordersByStatus["PENDING"] ?? ordersByStatus["pending"] ?? 0;
  const deliveredCount =
    ordersByStatus["DELIVERED"] ?? ordersByStatus["delivered"] ?? 0;
  const pendingVendorCount = pendingVendors.length;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-2xl font-black text-slate-900"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {pendingVendorCount > 0 && (
          <Link
            href="/dashboard/admin/vendors"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
          >
            <AlertCircle size={15} />
            {pendingVendorCount} Vendor{pendingVendorCount > 1 ? "s" : ""}{" "}
            Awaiting Approval
          </Link>
        )}
      </div>

      {/* ── Stat cards — server rendered ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Charts — CLIENT component, data passed as props ── */}
      <RevenueChart
        revenueData={revenueData}
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
      />

      {/* ── Bottom row: Recent orders + Top products ── */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-black text-slate-900">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              View all →
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full min-w-0">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => {
                  const s = statusConfig[order.status] ?? fallbackStatus;

                  const displayId =
                    order.orderNumber ?? `#${order.id.slice(-6).toUpperCase()}`;
                  const customerName =
                    order.user?.name ??
                    (order as any).customerName ??
                    "Unknown";
                  const customerEmail =
                    order.user?.email ?? (order as any).customerEmail ?? "";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/orders`}
                          className="text-sm font-bold text-amber-600 hover:text-amber-700"
                        >
                          {displayId}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {customerName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {customerEmail}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-900">
                        $
                        {Number(order.total).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${s.dot}`}
                          />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-slate-50">
            {recentOrders.map((order) => {
              const s = statusConfig[order.status] ?? fallbackStatus;
              const displayId =
                order.orderNumber ?? `#${order.id.slice(-6).toUpperCase()}`;
              const customerName =
                order.user?.name ??
                (order as any).customerName ??
                "Unknown";
              const customerEmail =
                order.user?.email ?? (order as any).customerEmail ?? "";

              return (
                <div key={order.id} className="px-4 py-3.5 space-y-2 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/admin/orders`}
                      className="text-sm font-bold text-amber-600 hover:text-amber-700"
                    >
                      {displayId}
                    </Link>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {customerName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {customerEmail}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-sm font-bold text-slate-900">
                        ${Number(order.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-black text-slate-900">Top Products</h3>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700"
            >
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {topProducts.map((p, i) => {
              const imageSrc = (p as any).image ?? p.images?.[0]?.url ?? "";
              const detailText = `${(p.totalSold ?? 0).toLocaleString()} sold · ${p.store?.name ?? "Store"}`;

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
                >
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400">{detailText}</p>
                  </div>
                  <p className="text-sm font-black text-slate-900 shrink-0">
                    ${Number(p.price).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Quick stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            icon: Clock,
            label: "Pending Orders",
            value: pendingOrdersCount,
            color: "text-yellow-600",
            bg: "bg-yellow-50",
          },
          {
            icon: CheckCircle2,
            label: "Delivered Today",
            value: deliveredCount,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: Store,
            label: "Active Stores",
            value: totalStores,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: AlertCircle,
            label: "Pending Approvals",
            value: pendingVendorCount,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div
            key={label}
            className={`${bg} rounded-2xl px-5 py-4 flex items-center gap-3`}
          >
            <Icon size={20} className={color} />
            <div>
              <p className="text-xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
