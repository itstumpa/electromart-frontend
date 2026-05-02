'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, ChevronDown, X, MapPin,
  CreditCard, Clock, Package, Truck, CheckCircle2,
} from 'lucide-react';
import { mockOrders } from '@/data/mock-data';
import type { Order, OrderStatus } from '@/data/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled',
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string; icon: React.ElementType }> = {
  pending:          { label: 'Pending',         color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500',  icon: Clock },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500',    icon: CheckCircle2 },
  processing:       { label: 'Processing',       color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500',  icon: Package },
  shipped:          { label: 'Shipped',          color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500',    icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500',  icon: Truck },
  delivered:        { label: 'Delivered',        color: 'bg-green-100 text-green-700',   dot: 'bg-green-500',   icon: CheckCircle2 },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-600',       dot: 'bg-red-500',     icon: Clock },
  refunded:         { label: 'Refunded',         color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400',   icon: Clock },
};

export default function VendorOrdersClient() {
  const myOrders = mockOrders.filter((o) => o.vendorId === 'vendor-1');
  const [orders,      setOrders]      = useState<Order[]>(myOrders);
  const [viewOrder,   setViewOrder]   = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    if (viewOrder?.id === id) setViewOrder((o) => o ? { ...o, status } : null);
  };

  const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
  const pending  = orders.filter(o => o.status === 'pending').length;
  const delivered = orders.filter(o => o.status === 'delivered').length;

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>Order Management</h1>
            <p className="text-sm text-slate-400 mt-0.5">{orders.length} orders · ${revenue.toLocaleString('en-US', { minimumFractionDigits: 0 })} revenue</p>
          </div>
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
              <option value="">All Status</option>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Orders',  value: orders.length,   color: 'text-slate-900', bg: 'bg-white' },
            { label: 'Pending',       value: pending,          color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Delivered',     value: delivered,        color: 'text-green-700',  bg: 'bg-green-50' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl border border-slate-100 p-4 text-center`}>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((order, i) => {
              const s = STATUS_CONFIG[order.status];
              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all overflow-hidden">

                  {/* Order row */}
                  <div className="flex items-center gap-3 px-4 sm:px-5 py-4 flex-wrap">
                    {/* Product image */}
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image src={order.items[0].productImage} alt="" fill className="object-cover" sizes="48px" />
                    </div>

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-black text-amber-600">{order.orderNumber}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {order.customerName} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Total */}
                    <p className="text-base font-black text-slate-900 shrink-0">${order.total.toFixed(2)}</p>

                    {/* Status update dropdown */}
                    <div className="relative group shrink-0">
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer ${s.color} group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-amber-300 transition-all`}>
                        Update <ChevronDown size={11} />
                      </div>
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20 hidden group-hover:block">
                        {STATUS_OPTIONS.map((st) => {
                          const cfg = STATUS_CONFIG[st];
                          return (
                            <button key={st} onClick={() => updateStatus(order.id, st)}
                              className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-slate-50 ${order.status === st ? 'bg-amber-50 text-amber-700' : 'text-slate-700'}`}>
                              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* View button */}
                    <button onClick={() => setViewOrder(order)}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors shrink-0">
                      Details
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <ShoppingBag size={36} className="mx-auto mb-3 text-slate-300" />
              <p className="text-slate-500 font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      <AnimatePresence>
        {viewOrder && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setViewOrder(null)} />
            <motion.div
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Order Details</p>
                    <h3 className="text-lg font-black text-slate-900">{viewOrder.orderNumber}</h3>
                  </div>
                  <button onClick={() => setViewOrder(null)}
                    className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                    <X size={15} />
                  </button>
                </div>

                {/* Status update from modal */}
                <div className="mb-4">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Update Status</label>
                  <div className="relative">
                    <select value={viewOrder.status} onChange={(e) => updateStatus(viewOrder.id, e.target.value as OrderStatus)}
                      className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-4">
                  {viewOrder.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white shrink-0">
                        <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="44px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                        <p className="text-xs text-slate-400">Qty: {item.quantity}{item.variant ? ` · ${item.variant}` : ''}</p>
                      </div>
                      <p className="text-sm font-black text-slate-900 shrink-0">${item.total.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${viewOrder.subtotal.toFixed(2)}</span></div>
                  {viewOrder.shippingCost > 0 && <div className="flex justify-between text-slate-500"><span>Shipping</span><span>${viewOrder.shippingCost.toFixed(2)}</span></div>}
                  <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
                    <span>Total</span><span className="text-amber-700">${viewOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Address + payment */}
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="font-bold text-slate-700 flex items-center gap-1 mb-1.5"><MapPin size={12} /> Ship To</p>
                    <p>{viewOrder.shippingAddress.fullName}</p>
                    <p>{viewOrder.shippingAddress.street}</p>
                    <p>{viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <p className="font-bold text-slate-700 flex items-center gap-1 mb-1.5"><CreditCard size={12} /> Payment</p>
                    <p className="capitalize">{viewOrder.paymentMethod}</p>
                    <p className="capitalize font-semibold text-green-700">{viewOrder.paymentStatus}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}