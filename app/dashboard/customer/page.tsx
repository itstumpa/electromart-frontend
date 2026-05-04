// SERVER COMPONENT
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag, Heart, Star, MapPin,
  Bell, Package,  ArrowRight,
  CheckCircle2, Clock, Truck,
} from 'lucide-react';
import {
  mockUsers, mockOrders, mockWishlist,
  mockNotifications,  mockReviews,
} from '@/data/mock-data';

export const metadata: Metadata = { title: 'My Dashboard — ElectroMart' };

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending:          { label: 'Pending',      color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500',  icon: Clock },
  confirmed:        { label: 'Confirmed',    color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    icon: CheckCircle2 },
  processing:       { label: 'Processing',   color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500',  icon: Package },
  shipped:          { label: 'Shipped',      color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500',    icon: Truck },
  out_for_delivery: { label: 'Out for Del.', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500',  icon: Truck },
  delivered:        { label: 'Delivered',    color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',   icon: CheckCircle2 },
  cancelled:        { label: 'Cancelled',    color: 'bg-red-100 text-red-600',       dot: 'bg-red-500',     icon: Clock },
  refunded:         { label: 'Refunded',     color: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400',   icon: Clock },
};

export default async function CustomerOverviewPage() {
  const customer     = mockUsers.find((u) => u.role === 'CUSTOMER')!;
  const orders       = mockOrders.filter((o) => o.customerId === customer.id);
  const notifications = mockNotifications.filter((n) => n.userId === customer.id);
  const unread       = notifications.filter((n) => !n.isRead).length;

  const totalSpent   = orders.filter((o) => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const delivered    = orders.filter((o) => o.status === 'delivered').length;

  const stats = [
    { label: 'Total Orders',    value: orders.length,              icon: ShoppingBag, color: 'bg-amber-100',  text: 'text-amber-700',  href: '/dashboard/customer/orders' },
    { label: 'Delivered',       value: delivered,                   icon: CheckCircle2, color: 'bg-green-100', text: 'text-green-700',  href: '/dashboard/customer/orders' },
    { label: 'Wishlist Items',  value: mockWishlist.length,         icon: Heart,       color: 'bg-rose-100',   text: 'text-rose-600',   href: '/dashboard/customer/wishlist' },
    { label: 'My Reviews',      value: mockReviews.filter(r => r.customerId === customer.id).length,
      icon: Star, color: 'bg-purple-100', text: 'text-purple-700', href: '/dashboard/customer/reviews' },
  ];

  return (
    <div className="space-y-6">

      {/* ── Welcome header ── */}
      <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-5 sm:p-6">
        {customer.avatar && (
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shrink-0">
            <Image src={customer.avatar} alt={customer.name} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Welcome back</p>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 truncate" style={{ fontFamily: "'Georgia', serif" }}>
            {customer.name}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{customer.email}</p>
        </div>
        <div className="hidden sm:block text-right shrink-0">
          <p className="text-2xl font-black text-slate-900">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
          <p className="text-xs text-slate-400 font-medium">Total spent</p>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, color, text, href }) => (
          <Link key={label} href={href}
            className="group bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all p-4 sm:p-5 flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
              <Icon size={18} className={text} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Recent orders + Notifications ── */}
      <div className="grid lg:grid-cols-3 gap-5">

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Recent Orders</h2>
            <Link href="/dashboard/customer/orders" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {orders.slice(0, 4).map((order) => {
              const s = STATUS_CONFIG[order.status];
              const Icon = s.icon;
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={order.items[0].productImage} alt={order.items[0].productName} fill className="object-cover" sizes="44px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-amber-600">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500 truncate">{order.items.map(i => i.productName).join(', ')}</p>
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

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900 flex items-center gap-2">
              Notifications
              {unread > 0 && <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{unread}</span>}
            </h2>
            <Link href="/dashboard/customer/notifications" className="text-xs font-semibold text-amber-600 hover:text-amber-700">
              See all
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.isRead ? 'bg-slate-300' : 'bg-amber-500'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{n.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Wishlist preview ── */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-black text-slate-900">Wishlist</h2>
          <Link href="/dashboard/customer/wishlist" className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {mockWishlist.map((item) => (
            <Link key={item.id} href={`/products/${item.productId}`}
              className="group flex items-center gap-3 p-4 hover:bg-amber-50 transition-colors"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="56px" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">{item.productName}</p>
                <p className="text-sm font-black text-amber-700 mt-1">${item.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'My Orders',     icon: ShoppingBag, href: '/dashboard/customer/orders',        color: 'bg-amber-50  border-amber-200  text-amber-700' },
          { label: 'Addresses',     icon: MapPin,      href: '/dashboard/customer/addresses',      color: 'bg-blue-50   border-blue-200   text-blue-700' },
          { label: 'My Reviews',    icon: Star,        href: '/dashboard/customer/reviews',        color: 'bg-purple-50 border-purple-200 text-purple-700' },
          { label: 'Notifications', icon: Bell,        href: '/dashboard/customer/notifications',  color: 'bg-red-50    border-red-200    text-red-600' },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className={`group flex items-center gap-3 p-4 rounded-2xl border ${color} hover:shadow-sm transition-all`}
          >
            <Icon size={18} />
            <span className="text-sm font-bold">{label}</span>
            <ArrowRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}