// SERVER COMPONENT — Vendor Dashboard Overview (placeholder)
// Full vendor dashboard (products, orders, earnings, store) coming next sprint.
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Package, ShoppingBag, Wallet,
  Store, BarChart2, ArrowRight,
} from 'lucide-react';
import { mockUsers, mockVendorProfiles } from '@/data/mock-data';

export const metadata: Metadata = { title: 'Vendor Dashboard — ElectroMart' };

export default async function VendorOverviewPage() {
  const vendor  = mockUsers.find((u) => u.role === 'VENDOR')!;
  const profile = mockVendorProfiles[0];

  const stats = [
    { label: 'Total Products', value: profile.totalProducts, icon: Package,     color: 'bg-blue-100',   text: 'text-blue-700' },
    { label: 'Total Sales',    value: profile.totalSales,    icon: ShoppingBag,  color: 'bg-green-100',  text: 'text-green-700' },
    { label: 'Store Rating',   value: `${profile.rating}★`,  icon: Store,        color: 'bg-amber-100',  text: 'text-amber-700' },
    { label: 'Revenue',        value: '$0',                  icon: Wallet,       color: 'bg-purple-100', text: 'text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Vendor Panel</p>
        <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
          Welcome, {vendor.name}
        </h1>
        <p className="text-sm text-slate-400 mt-1">{profile.storeName} · {profile.isApproved ? '✅ Approved' : '⏳ Pending approval'}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, text }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col gap-3">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={18} className={text} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon modules */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="font-black text-slate-900 mb-4">Vendor Modules</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Product Management', sub: 'Add, edit, delete products',   icon: Package,   href: '/dashboard/vendor/products' },
            { label: 'Order Management',   sub: 'View and update order status',  icon: ShoppingBag, href: '/dashboard/vendor/orders' },
            { label: 'Earnings & Payouts', sub: 'Revenue and payout history',    icon: Wallet,    href: '/dashboard/vendor/earnings' },
            { label: 'Store Profile',      sub: 'Edit your store info & logo',   icon: Store,     href: '/dashboard/vendor/store' },
            { label: 'Analytics',          sub: 'Sales charts and insights',     icon: BarChart2, href: '/dashboard/vendor/analytics' },
          ].map(({ label, sub, icon: Icon, href }) => (
            <Link key={label} href={href}
              className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-amber-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">{label}</p>
                <p className="text-xs text-slate-400 truncate">{sub}</p>
              </div>
              <ArrowRight size={14} className="ml-auto text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}