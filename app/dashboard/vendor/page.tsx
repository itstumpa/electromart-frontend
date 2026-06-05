"use client";

import { getMyStore, type MyStoreDto } from "@/api/store.api";
import {
  getMyAnalytics,
  type VendorAnalyticsDto,
} from "@/api/vendor-analytics.api";
import { getApiErrorMessage } from "@/utils/api-error";
import {
  AlertTriangle,
  ArrowRight,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import VendorRevenueChart from "./overview/VendorRevenueChart";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    dot: "bg-yellow-500",
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
};

export default function VendorOverviewPage() {
  const [store, setStore] = useState<MyStoreDto | null>(null);
  const [analytics, setAnalytics] = useState<VendorAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyStore(), getMyAnalytics()])
      .then(([storeRes, analyticsRes]) => {
        setStore(storeRes.data.data);
        setAnalytics(analyticsRes.data.data);
      })
      .catch((err) =>
        toast.error(getApiErrorMessage(err, "Failed to load dashboard")),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-100 animate-pulse rounded-2xl h-24"
          />
        ))}
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 font-semibold">No store found.</p>
        <Link
          href="/dashboard/vendor/store"
          className="mt-3 text-sm text-amber-600 font-bold hover:underline"
        >
          Create your store
        </Link>
      </div>
    );
  }

  const lowStock = store.products.filter((p) => p.stock <= 10);
  const totalRevenue =
    analytics?.monthlyRevenue.reduce((s, d) => s + d.revenue, 0) ?? 0;
  const totalOrders = Object.values(analytics?.ordersByStatus ?? {}).reduce(
    (s, v) => s + v,
    0,
  );

  // format monthly revenue for chart
  const chartData =
    analytics?.monthlyRevenue.map((r) => ({
      month: r.month.slice(5), // "2026-03" → "03"
      revenue: r.revenue,
      orders: 0, // not available per month from this endpoint
    })) ?? [];

  const stats = [
    {
      label: "Total Revenue",
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      icon: Wallet,
      bg: "bg-amber-100",
      text: "text-amber-700",
      change: `${store.totalSales} sales`,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      bg: "bg-blue-100",
      text: "text-blue-700",
      change: `${analytics?.totalCustomers ?? 0} customers`,
    },
    {
      label: "Products",
      value: store.products.length,
      icon: Package,
      bg: "bg-purple-100",
      text: "text-purple-700",
      change: `${lowStock.length} low stock`,
    },
    {
      label: "Store Rating",
      value: `${store.rating}★`,
      icon: Star,
      bg: "bg-green-100",
      text: "text-green-700",
      change: `avg $${analytics?.averageOrderValue ?? 0}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Welcome header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {store.logo &&
            typeof store.logo === "string" &&
            store.logo !== "[object Object]" &&
            store.logo.trim() !== "" && (
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">
              Vendor Panel
            </p>
            <h1
              className="text-xl sm:text-2xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {store.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${store.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
              >
                {store.isApproved ? "✓ Approved" : "⏳ Pending"}
              </span>
              <span className="text-xs text-slate-400">
                Since{" "}
                {new Date(store.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        {lowStock.length > 0 && (
          <Link
            href="/dashboard/vendor/inventory"
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
          >
            <AlertTriangle size={14} />
            {lowStock.length} Low Stock Items
          </Link>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, bg, text, change }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:border-amber-200 transition-all"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
              >
                <Icon size={18} className={text} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                {change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart ── */}
      {chartData.length > 0 && (
        <VendorRevenueChart
          data={chartData}
          totalRevenue={totalRevenue}
          totalOrders={totalOrders}
        />
      )}

      {/* ── Top products ── */}
      {analytics?.topProducts && analytics.topProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Top Products</h2>
            <Link
              href="/dashboard/vendor/products"
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {analytics.topProducts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {p.images?.[0]?.url && (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                    <Image
                      src={p.images[0].url}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {p.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {p.totalSold} sold · ${Number(p.price).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full shrink-0">
                  ${p.totalRevenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Orders by status ── */}
      {analytics?.ordersByStatus && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="font-black text-slate-900 mb-4">Orders by Status</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(analytics.ordersByStatus).map(([status, count]) => {
              const s = STATUS_CONFIG[status] ?? {
                label: status,
                color: "bg-slate-100 text-slate-600",
                dot: "bg-slate-400",
              };
              return (
                <div key={status} className={`rounded-xl p-3 ${s.color}`}>
                  <p className="text-2xl font-black">{count}</p>
                  <p className="text-xs font-bold mt-0.5">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Quick actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Add Product",
            icon: Package,
            href: "/dashboard/vendor/products?action=new",
            color:
              "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
          },
          {
            label: "View Orders",
            icon: ShoppingBag,
            href: "/dashboard/vendor/orders",
            color: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
          },
          {
            label: "Check Stock",
            icon: AlertTriangle,
            href: "/dashboard/vendor/inventory",
            color: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
          },
          {
            label: "Edit Store",
            icon: TrendingUp,
            href: "/dashboard/vendor/store",
            color:
              "bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100",
          },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className={`group flex items-center gap-2.5 p-4 rounded-2xl border ${color} transition-all`}
          >
            <Icon size={16} className="shrink-0" />
            <span className="text-sm font-bold">{label}</span>
            <ArrowRight
              size={13}
              className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
