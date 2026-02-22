'use client';

import { useState } from 'react';
import {
  Eye, ChevronDown, X, Package,
  MapPin, CreditCard, Truck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '@/data/types';
import AdminDataTable, { Column } from '../Admindatatable';
// import type { Order, OrderStatus } from '@/types';
// import AdminDataTable, { Column } from '@/components/dashboard/admin/AdminDataTable';

const STATUS_OPTIONS: OrderStatus[] = [
  'pending', 'confirmed', 'processing',
  'shipped', 'out_for_delivery', 'delivered',
  'cancelled', 'refunded',
];

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:          { label: 'Pending',         color: 'bg-yellow-100 text-yellow-700',  dot: 'bg-yellow-500' },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500' },
  processing:       { label: 'Processing',       color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
  shipped:          { label: 'Shipped',          color: 'bg-cyan-100 text-cyan-700',      dot: 'bg-cyan-500' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-500' },
  delivered:        { label: 'Delivered',        color: 'bg-green-100 text-green-700',    dot: 'bg-green-500' },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-600',        dot: 'bg-red-500' },
  refunded:         { label: 'Refunded',         color: 'bg-slate-100 text-slate-600',    dot: 'bg-slate-400' },
};

const paymentConfig: Record<string, { color: string }> = {
  paid:     { color: 'bg-green-100 text-green-700' },
  unpaid:   { color: 'bg-yellow-100 text-yellow-700' },
  failed:   { color: 'bg-red-100 text-red-600' },
  refunded: { color: 'bg-slate-100 text-slate-500' },
};

export default function OrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [orders,      setOrders]      = useState(initialOrders);
  const [viewOrder,   setViewOrder]   = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, updatedAt: new Date().toISOString() }
          : o
      )
    );
    // Optimistic update — in prod: await api.patch(`/orders/${orderId}`, { status: newStatus })
  };

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order',
      sortable: true,
      render: (o) => (
        <button
          onClick={() => setViewOrder(o)}
          className="font-black text-amber-600 hover:text-amber-700 text-sm transition-colors"
        >
          {o.orderNumber}
        </button>
      ),
    },
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (o) => (
        <div>
          <p className="text-sm font-bold text-slate-900">{o.customerName}</p>
          <p className="text-xs text-slate-400">{o.customerEmail}</p>
        </div>
      ),
    },
    {
      key: 'vendorName',
      label: 'Vendor',
      sortable: true,
      render: (o) => <span className="text-sm text-slate-600 font-medium">{o.vendorName}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (o) => (
        <span className="text-sm font-black text-slate-900">
          ${o.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (o) => (
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${paymentConfig[o.paymentStatus]?.color ?? 'bg-slate-100 text-slate-500'}`}>
          {o.paymentStatus}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (o) => {
        const s = statusConfig[o.status];
        return (
          /* Inline status dropdown — senior pattern: optimistic UI update */
          <div className="relative group">
            <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer ${s.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
              {s.label}
              <ChevronDown size={10} />
            </div>
            {/* Dropdown on hover */}
            <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 hidden group-hover:block">
              {STATUS_OPTIONS.map((st) => {
                const cfg = statusConfig[st];
                return (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(o.id, st)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-colors hover:bg-slate-50 ${
                      o.status === st ? 'bg-amber-50 text-amber-700' : 'text-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (o) => (
        <span className="text-xs text-slate-400 font-medium">
          {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      ),
    },
  ];

  const filterSlot = (
    <div className="relative">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
        className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{statusConfig[s].label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );

  const actions = (o: Order) => (
    <button
      onClick={() => setViewOrder(o)}
      className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 flex items-center justify-center transition-colors"
      title="View order"
    >
      <Eye size={14} />
    </button>
  );

  // Summary stats
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);
  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders',   value: orders.length,                 color: 'text-slate-900' },
          { label: 'Revenue',        value: `$${Math.round(revenue).toLocaleString()}`, color: 'text-amber-700' },
          { label: 'Pending',        value: statusCounts.pending,           color: 'text-yellow-600' },
          { label: 'Delivered',      value: statusCounts.delivered,         color: 'text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <AdminDataTable
        data={filtered}
        columns={columns}
        searchKeys={['orderNumber', 'customerName', 'customerEmail', 'vendorName']}
        searchPlaceholder="Search by order #, customer or vendor..."
        actions={actions}
        filterSlot={filterSlot}
        pageSize={8}
        emptyMessage="No orders found."
      />

      {/* Order detail modal */}
      <AnimatePresence>
        {viewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setViewOrder(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setViewOrder(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <X size={15} />
              </button>

              {/* Header */}
              <div className="mb-5">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Order Details</p>
                <h3 className="text-xl font-black text-slate-900">{viewOrder.orderNumber}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Placed {new Date(viewOrder.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
              </div>

              {/* Status + payment */}
              <div className="flex gap-2 flex-wrap mb-5">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${statusConfig[viewOrder.status].color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[viewOrder.status].dot}`} />
                  {statusConfig[viewOrder.status].label}
                </span>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${paymentConfig[viewOrder.paymentStatus]?.color}`}>
                  {viewOrder.paymentStatus} · {viewOrder.paymentMethod}
                </span>
              </div>

              {/* Items */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Package size={12} /> Items
                </p>
                <div className="space-y-3">
                  {viewOrder.items.map((item) => (
                    <div key={item.productId} className="flex items-center gap-3">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-lg object-cover bg-white" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                        {item.variant && <p className="text-xs text-slate-400">{item.variant}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900">${item.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-slate-400">×{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2">
                {[
                  { label: 'Subtotal',  value: viewOrder.subtotal },
                  { label: 'Shipping',  value: viewOrder.shippingCost },
                  { label: 'Tax',       value: viewOrder.tax },
                  { label: 'Discount',  value: -viewOrder.discount },
                ].map(({ label, value }) => (
                  value !== 0 && (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-slate-500">{label}</span>
                      <span className={`font-semibold ${value < 0 ? 'text-green-600' : 'text-slate-900'}`}>
                        {value < 0 ? '-' : ''}${Math.abs(value).toFixed(2)}
                      </span>
                    </div>
                  )
                ))}
                <div className="flex justify-between text-base font-black border-t border-slate-200 pt-2 mt-1">
                  <span className="text-slate-900">Total</span>
                  <span className="text-amber-700">${viewOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping address */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={12} /> Shipping Address
                </p>
                <p className="text-sm font-bold text-slate-900">{viewOrder.shippingAddress.fullName}</p>
                <p className="text-sm text-slate-600">{viewOrder.shippingAddress.street}</p>
                <p className="text-sm text-slate-600">
                  {viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} {viewOrder.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-slate-500">{viewOrder.shippingAddress.phone}</p>
              </div>

              {/* Tracking + delivery */}
              {(viewOrder.trackingNumber || viewOrder.deliveryPersonName) && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Truck size={12} /> Delivery Info
                  </p>
                  {viewOrder.trackingNumber && (
                    <p className="text-sm text-slate-700">
                      Tracking: <span className="font-bold">{viewOrder.trackingNumber}</span>
                    </p>
                  )}
                  {viewOrder.deliveryPersonName && (
                    <p className="text-sm text-slate-700 mt-1">
                      Agent: <span className="font-bold">{viewOrder.deliveryPersonName}</span>
                    </p>
                  )}
                  {viewOrder.estimatedDelivery && (
                    <p className="text-sm text-slate-700 mt-1">
                      ETA: <span className="font-bold">
                        {new Date(viewOrder.estimatedDelivery).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {viewOrder.note && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-800 font-medium">
                  📝 Note: {viewOrder.note}
                </div>
              )}

              {/* Change status from modal */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Update Status</p>
                <div className="relative">
                  <select
                    value={viewOrder.status}
                    onChange={(e) => {
                      handleStatusChange(viewOrder.id, e.target.value as OrderStatus);
                      setViewOrder((o) => o ? { ...o, status: e.target.value as OrderStatus } : null);
                    }}
                    className="w-full appearance-none pl-4 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}