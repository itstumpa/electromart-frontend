// SERVER COMPONENT — fetches all data, zero client JS for data loading
import { Metadata } from 'next';
import {
  DollarSign, ShoppingBag, Users, Package,
  Clock, CheckCircle2, Store, AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

import {
  mockAdminAnalytics, mockOrders, mockUsers,
  mockProducts, mockVendorProfiles,
} from '@/data/mock-data';
import RevenueChart from '@/components/dashboard/admin/Revenuechart';
import StatCard from '@/components/dashboard/admin/Statcard';

export const metadata: Metadata = { title: 'Admin Overview — ElectroMart' };

export default async function AdminOverviewPage() {
  // All data fetched server-side — swap with DB queries in production
  const analytics  = mockAdminAnalytics;
  const recentOrders = mockOrders.slice(0, 5);
  const pendingVendors = mockVendorProfiles.filter((v) => !v.isApproved);
  const recentUsers = mockUsers.slice(0, 5);

  const stats = [
    {
      label: 'Total Revenue',
      value: analytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
      change: 12.5, trend: 'up' as const,
      icon: DollarSign, iconBg: 'bg-amber-100', iconColor: 'text-amber-700', prefix: '$',
    },
    {
      label: 'Total Orders',
      value: analytics.totalOrders.toLocaleString(),
      change: 8.2, trend: 'up' as const,
      icon: ShoppingBag, iconBg: 'bg-blue-100', iconColor: 'text-blue-700',
    },
    {
      label: 'Total Users',
      value: analytics.totalUsers.toLocaleString(),
      change: 15.3, trend: 'up' as const,
      icon: Users, iconBg: 'bg-green-100', iconColor: 'text-green-700',
    },
    {
      label: 'Total Products',
      value: analytics.totalProducts.toLocaleString(),
      change: 3.1, trend: 'down' as const,
      icon: Package, iconBg: 'bg-purple-100', iconColor: 'text-purple-700',
    },
  ];

  const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
    pending:          { label: 'Pending',     color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
    confirmed:        { label: 'Confirmed',   color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
    processing:       { label: 'Processing',  color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
    shipped:          { label: 'Shipped',     color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500' },
    out_for_delivery: { label: 'Out for Del', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
    delivered:        { label: 'Delivered',   color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
    cancelled:        { label: 'Cancelled',   color: 'bg-red-100 text-red-600',       dot: 'bg-red-500' },
    refunded:         { label: 'Refunded',    color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400' },
  };

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {pendingVendors.length > 0 && (
          <Link href="/admin/vendors"
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
          >
            <AlertCircle size={15} />
            {pendingVendors.length} Vendor{pendingVendors.length > 1 ? 's' : ''} Awaiting Approval
          </Link>
        )}
      </div>

      {/* ── Stat cards — server rendered ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Charts — CLIENT component, data passed as props ── */}
      <RevenueChart
        revenueData={analytics.revenueData}
        totalRevenue={analytics.totalRevenue}
        totalOrders={analytics.totalOrders}
      />

      {/* ── Bottom row: Recent orders + Top products ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-black text-slate-900">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Order', 'Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.map((order) => {
                  const s = statusConfig[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/orders`} className="text-sm font-bold text-amber-600 hover:text-amber-700">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>
                          <p className="text-xs text-slate-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-900">
                        ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-400 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-black text-slate-900">Top Products</h3>
            <Link href="/admin/products" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {analytics.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.reviewCount.toLocaleString()} reviews</p>
                </div>
                <p className="text-sm font-black text-slate-900 shrink-0">
                  ${p.price.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick stats strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: Clock,        label: 'Pending Orders',   value: mockOrders.filter(o => o.status === 'pending').length,   color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { icon: CheckCircle2, label: 'Delivered Today',  value: mockOrders.filter(o => o.status === 'delivered').length, color: 'text-green-600',  bg: 'bg-green-50' },
          { icon: Store,        label: 'Active Vendors',   value: mockVendorProfiles.filter(v => v.isApproved).length,     color: 'text-blue-600',   bg: 'bg-blue-50' },
          { icon: AlertCircle,  label: 'Pending Approvals', value: pendingVendors.length,                                  color: 'text-amber-600',  bg: 'bg-amber-50' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl px-5 py-4 flex items-center gap-3`}>
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