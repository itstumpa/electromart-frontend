// SERVER COMPONENT
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package, ShoppingBag, Wallet, Star,
  TrendingUp, ArrowRight, AlertTriangle,
  CheckCircle2, Clock, Truck,
} from 'lucide-react';
import { mockVendorProfiles, mockProducts, mockOrders, mockUsers } from '@/data/mock-data';
import VendorRevenueChart from './VendorRevenueChart';
// Note: VendorRevenueChart is a CLIENT component (Recharts needs DOM)

export const metadata: Metadata = { title: 'Vendor Overview — ElectroMart' };

// Vendor-scoped mock revenue data
const REVENUE_DATA = [
  { month: 'Nov', revenue: 4200,  orders: 38 },
  { month: 'Dec', revenue: 7800,  orders: 71 },
  { month: 'Jan', revenue: 5100,  orders: 46 },
  { month: 'Feb', revenue: 6300,  orders: 58 },
  { month: 'Mar', revenue: 8900,  orders: 82 },
  { month: 'Apr', revenue: 11200, orders: 103 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  pending:          { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  confirmed:        { label: 'Confirmed',  color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  processing:       { label: 'Processing', color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  shipped:          { label: 'Shipped',    color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500' },
  out_for_delivery: { label: 'Delivering', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  delivered:        { label: 'Delivered',  color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  cancelled:        { label: 'Cancelled',  color: 'bg-red-100 text-red-600',       dot: 'bg-red-500' },
  refunded:         { label: 'Refunded',   color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
};

export default async function VendorOverviewPage() {
  const vendor      = mockUsers.find((u) => u.role === 'VENDOR')!;
  const profile     = mockVendorProfiles[0];
  const myProducts  = mockProducts.filter((p) => p.vendorId === profile.id);
  const myOrders    = mockOrders.filter((o) => o.vendorId === profile.id);
  const lowStock    = myProducts.filter((p) => p.stock <= 10);
  const totalRevenue = REVENUE_DATA.reduce((s, d) => s + d.revenue, 0);
  const totalOrders  = REVENUE_DATA.reduce((s, d) => s + d.orders, 0);

  const stats = [
    { label: 'Total Revenue',  value: `$${(totalRevenue / 1000).toFixed(1)}k`, icon: Wallet,     bg: 'bg-amber-100',  text: 'text-amber-700',  change: '+18%' },
    { label: 'Total Orders',   value: totalOrders,                               icon: ShoppingBag, bg: 'bg-blue-100',   text: 'text-blue-700',   change: '+12%' },
    { label: 'Products',       value: myProducts.length,                         icon: Package,     bg: 'bg-purple-100', text: 'text-purple-700', change: `${lowStock.length} low` },
    { label: 'Store Rating',   value: `${profile.rating}★`,                     icon: Star,        bg: 'bg-green-100',  text: 'text-green-700',  change: `${profile.totalSales} sales` },
  ];

  return (
    <div className="space-y-6">

      {/* ── Welcome header ── */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          {profile.logo && (
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-200 shrink-0">
              <Image src={profile.logo} alt={profile.storeName} fill className="object-cover" sizes="56px" />
            </div>
          )}
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Vendor Panel</p>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              {profile.storeName}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${profile.isApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {profile.isApproved ? '✓ Approved' : '⏳ Pending'}
              </span>
              <span className="text-xs text-slate-400">Member since {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        {lowStock.length > 0 && (
          <Link href="/dashboard/vendor/inventory"
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors">
            <AlertTriangle size={14} />
            {lowStock.length} Low Stock Items
          </Link>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, bg, text, change }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex flex-col gap-3 hover:shadow-md hover:border-amber-200 transition-all">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={text} />
              </div>
              <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Revenue chart — CLIENT ── */}
      <VendorRevenueChart data={REVENUE_DATA} totalRevenue={totalRevenue} totalOrders={totalOrders} />

      {/* ── Recent orders + top products ── */}
      <div className="grid lg:grid-cols-5 gap-5">

        {/* Recent orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Recent Orders</h2>
            <Link href="/dashboard/vendor/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myOrders.slice(0, 5).map((order) => {
              const s = STATUS_CONFIG[order.status];
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={order.items[0].productImage} alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-amber-600">{order.orderNumber}</p>
                    <p className="text-xs text-slate-400 truncate">{order.customerName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">${order.total.toFixed(2)}</p>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Top Products</h2>
            <Link href="/dashboard/vendor/products" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              Manage <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {myProducts.slice(0, 5).map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <span className="w-5 h-5 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.reviewCount} reviews · ${p.price.toLocaleString()}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${p.stock <= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick action strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Product',    icon: Package,     href: '/dashboard/vendor/products?action=new',  color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100' },
          { label: 'View Orders',    icon: ShoppingBag, href: '/dashboard/vendor/orders',               color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' },
          { label: 'Check Stock',    icon: AlertTriangle, href: '/dashboard/vendor/inventory',           color: 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' },
          { label: 'Edit Store',     icon: TrendingUp,  href: '/dashboard/vendor/store',                color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className={`group flex items-center gap-2.5 p-4 rounded-2xl border ${color} transition-all`}>
            <Icon size={16} className="shrink-0" />
            <span className="text-sm font-bold">{label}</span>
            <ArrowRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}