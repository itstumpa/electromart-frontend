'use client';

import { trackGuestOrder, getGuestOrderTimeline } from '@/src/services/api/order.api';
import type { TimelineEntryDto } from '@/types/order';
import { mapOrderDtoToUi } from '@/lib/order-mappers';
import type { Order } from '@/data/types';
import { getApiErrorMessage } from '@/utils/api-error';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronRight,
  Clock,
  MapPin,
  Package,
  Search,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function GuestTrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [timeline, setTimeline] = useState<TimelineEntryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const [orderRes, timelineRes] = await Promise.all([
        trackGuestOrder(orderId, email.trim()),
        getGuestOrderTimeline(orderId, email.trim()),
      ]);
      const orderData = orderRes.data.data;
      if (orderData) {
        setOrder(mapOrderDtoToUi(orderData));
      }
      const timelineData = timelineRes.data.data;
      setTimeline(timelineData?.timeline ?? []);
    } catch (err) {
      setOrder(null);
      setTimeline([]);
      const msg = getApiErrorMessage(err, 'Order not found or email does not match');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-amber-700" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'Georgia', serif" }}>
              Track Your Order
            </h1>
            <p className="text-sm text-slate-500">
              Enter the email you used to place this order
            </p>
          </div>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
            />
            <button
              onClick={handleTrack}
              disabled={loading}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-black px-6 py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                />
              ) : (
                <>
                  <Search size={16} /> Track
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order details */}
        {searched && !loading && (
          <AnimatePresence mode="wait">
            {order ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* Status card */}
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl">
                      {(() => {
                        const Icon = statusIcons[order.status] ?? Package;
                        return <Icon size={16} className="text-amber-700" />;
                      })()}
                      <span className="text-sm font-bold text-slate-800">{order.status}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                          <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-black text-slate-900">${item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between font-black text-lg">
                    <span>Total</span>
                    <span className="text-amber-700">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Shipping info */}
                {order.shippingAddress && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <MapPin size={12} /> Shipping Address
                    </p>
                    <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {order.shippingAddress.street}, {order.shippingAddress.city}
                    </p>
                  </div>
                )}

                {/* Timeline */}
                {timeline.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 p-6">
                    <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                      <Clock size={14} /> Order Timeline
                    </h3>
                    <div className="space-y-0">
                      {timeline.map((entry, i) => {
                        const Icon = statusIcons[entry.status] ?? Package;
                        const isLast = i === 0;
                        return (
                          <div key={entry.id} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  isLast ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}
                              >
                                <Icon size={14} />
                              </div>
                              {i < timeline.length - 1 && (
                                <div className="w-0.5 flex-1 bg-slate-200 my-1" />
                              )}
                            </div>
                            <div className={`pb-6 ${isLast ? '' : ''}`}>
                              <p className={`text-sm font-bold ${isLast ? 'text-amber-700' : 'text-slate-600'}`}>
                                {entry.status.replace(/_/g, ' ')}
                              </p>
                              {entry.note && (
                                <p className="text-xs text-slate-400 mt-0.5">{entry.note}</p>
                              )}
                              <p className="text-xs text-slate-400 mt-0.5">
                                {new Date(entry.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href="/products"
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl text-sm"
                  >
                    Continue Shopping <ChevronRight size={15} />
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="not-found"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 p-8 text-center"
              >
                <AlertCircle size={40} className="text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">Order not found</p>
                <p className="text-sm text-slate-400 mt-1">
                  No order matches that ID and email combination.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
