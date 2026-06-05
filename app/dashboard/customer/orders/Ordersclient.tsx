'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, CheckCircle2, Truck,
  Package, X, MapPin, ChevronDown, Star,
} from 'lucide-react';
import { getMyOrders } from '@/api/order.api';
import { mapOrdersToUi } from '@/lib/order-mappers';
import type { Order, OrderStatus } from '@/data/types';
import { getMyReviews, createProductReview, type ReviewDto } from '@/api/review.api';
import { getApiErrorMessage } from '@/utils/api-error';
import { toast } from 'sonner';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:          { label: 'Pending',         color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  confirmed:        { label: 'Confirmed',        color: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  processing:       { label: 'Processing',       color: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
  shipped:          { label: 'Shipped',          color: 'bg-cyan-100 text-cyan-700',     dot: 'bg-cyan-500' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  delivered:        { label: 'Delivered',        color: 'bg-green-100 text-green-700',   dot: 'bg-green-500' },
  cancelled:        { label: 'Cancelled',        color: 'bg-red-100 text-red-600',       dot: 'bg-red-500' },
  refunded:         { label: 'Refunded',         color: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
};

const TRACKING_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'confirmed',        label: 'Order Confirmed',    icon: CheckCircle2 },
  { status: 'processing',       label: 'Processing',         icon: Package },
  { status: 'shipped',          label: 'Shipped',            icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery',   icon: Truck },
  { status: 'delivered',        label: 'Delivered',          icon: CheckCircle2 },
];

const ORDER_RANK: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3,
  out_for_delivery: 4, delivered: 5, cancelled: -1, refunded: -1,
};

/* ── Inline Write-Review Modal ─────────────────────────────────────────── */
interface WriteReviewModalProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onSuccess: (productId: string) => void;
}

function WriteReviewModal({ productId, productName, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    setSubmitting(true);
    try {
      await createProductReview(productId, { rating, comment: comment.trim() });
      setSubmitted(true);
      toast.success('Review submitted! Thank you.');
      setTimeout(() => {
        onSuccess(productId);
        onClose();
      }, 1200);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to submit review'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 p-6"
      >
        {/* Mobile drag bar */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Write a Review</p>
            <h3 className="font-black text-slate-900 leading-snug max-w-60 truncate">{productName}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <CheckCircle2 size={44} className="mx-auto mb-3 text-green-500" />
            <p className="font-black text-slate-900 text-lg">Thank you!</p>
            <p className="text-sm text-slate-500 mt-1">Your review has been submitted.</p>
          </div>
        ) : (
          <>
            {/* Star picker */}
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Rating</p>
              <div className="flex gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseEnter={() => setHover(i + 1)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(i + 1)}
                    aria-label={`Rate ${i + 1} stars`}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={(hover || rating) > i ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                    />
                  </button>
                ))}
                <span className="ml-2 self-center text-sm font-bold text-slate-700">
                  {(hover || rating)}/5
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Review</p>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none transition"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-bold text-sm py-3 rounded-xl transition-colors"
            >
              {submitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                  />
                  Submitting…
                </>
              ) : (
                <>
                  <Star size={15} />
                  Submit Review
                </>
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ── Order Detail Modal ─────────────────────────────────────────────────── */
interface OrderDetailModalProps {
  order: Order;
  reviewedProductIds: Set<string>;
  onClose: () => void;
  onReviewSuccess: (productId: string) => void;
}

function OrderDetailModal({ order, reviewedProductIds, onClose, onReviewSuccess }: OrderDetailModalProps) {
  const rank = ORDER_RANK[order.status];
  const s    = STATUS_CONFIG[order.status];
  const [reviewTarget, setReviewTarget] = useState<{ productId: string; productName: string } | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        className="relative bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Handle bar (mobile) */}
        <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mt-3 sm:hidden" />

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Order Details</p>
              <h3 className="text-lg font-black text-slate-900">{order.orderNumber}</h3>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Status badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full mb-5 ${s.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          {/* ── Tracking timeline ── */}
          {rank >= 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 mb-5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Order Tracking</p>
              <div className="relative">
                <div className="absolute left-3.5 top-3.5 bottom-3.5 w-0.5 bg-slate-200" />
                <div className="space-y-4">
                  {TRACKING_STEPS.map((step) => {
                    const stepRank = ORDER_RANK[step.status];
                    const done     = rank >= stepRank;
                    const current  = rank === stepRank;
                    const Icon     = step.icon;
                    return (
                      <div key={step.status} className="flex items-center gap-3 relative">
                        <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 z-10 transition-all ${
                          done ? 'bg-green-600 text-white shadow-sm' : 'bg-white border-2 border-slate-200 text-slate-400'
                        } ${current ? 'ring-2 ring-green-300 ring-offset-1' : ''}`}>
                          <Icon size={13} />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</p>
                          {current && order.estimatedDelivery && (
                            <p className="text-xs text-amber-600 font-semibold">
                              ETA: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          )}
                        </div>
                        {current && (
                          <span className="ml-auto text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">Current</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items.map((item) => {
              const alreadyReviewed = reviewedProductIds.has(item.productId);
              return (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                    <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                    {item.variant && <p className="text-xs text-slate-400">{item.variant}</p>}
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <p className="text-sm font-black text-slate-900">${item.total.toFixed(2)}</p>
                    {/* Per-item Write Review button — only for delivered orders */}
                    {order.status === 'delivered' && (
                      alreadyReviewed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <CheckCircle2 size={10} /> Reviewed
                        </span>
                      ) : (
                        <button
                          onClick={() => setReviewTarget({ productId: item.productId, productName: item.productName })}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Star size={10} /> Write Review
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Price summary */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm mb-4">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            {order.shippingCost > 0 && <div className="flex justify-between text-slate-500"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>}
            <div className="flex justify-between text-slate-500"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
              <span>Total</span><span className="text-amber-700">${order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="flex gap-2 text-xs text-slate-500 bg-blue-50 rounded-xl px-4 py-3">
            <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</span>
          </div>
        </div>
      </motion.div>

      {/* Write Review sub-modal */}
      <AnimatePresence>
        {reviewTarget && (
          <WriteReviewModal
            productId={reviewTarget.productId}
            productName={reviewTarget.productName}
            onClose={() => setReviewTarget(null)}
            onSuccess={(pid) => {
              onReviewSuccess(pid);
              setReviewTarget(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main Page Component ───────────────────────────────────────────────── */
export default function CustomerOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  // Set of product IDs the customer has already reviewed
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    getMyOrders({ limit: 50 })
      .then((res) => setOrders(mapOrdersToUi(res.data.data ?? [])))
      .catch(() => setOrders([]));
  }, []);

  // Fetch which products this customer already reviewed
  useEffect(() => {
    getMyReviews()
      .then((res) => {
        const ids = new Set((res.data.data ?? []).map((r: ReviewDto) => r.productId));
        setReviewedProductIds(ids);
      })
      .catch(() => { /* ignore — worst case, all buttons show */ });
  }, []);

  // When a review is successfully submitted, add that productId to the reviewed set
  const handleReviewSuccess = useCallback((productId: string) => {
    setReviewedProductIds((prev) => new Set([...prev, productId]));
  }, []);

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>My Orders</h1>
            <p className="text-sm text-slate-400 mt-0.5">{orders.length} total orders</p>
          </div>
          {/* Filter */}
          <div className="relative">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer">
              <option value="">All Status</option>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((order, i) => {
              const s = STATUS_CONFIG[order.status];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all overflow-hidden"
                >
                  {/* Order header */}
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-100 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <ShoppingBag size={15} className="text-amber-600 shrink-0" />
                      <p className="text-sm font-black text-amber-600">{order.orderNumber}</p>
                      <span className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-sm font-black text-slate-900">${order.total.toFixed(2)}</p>
                      <button onClick={() => setSelected(order)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors">
                        Details
                      </button>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 flex-wrap">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, j) => (
                        <div key={j} className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white bg-slate-100 shrink-0">
                          <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="40px" />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 font-medium truncate">
                        {order.items.map((i) => i.productName).join(' · ')}
                      </p>
                      <p className="text-xs text-slate-400">{order.vendorName} · {order.paymentMethod}</p>
                    </div>
                    {/* Mobile status */}
                    <span className={`sm:hidden inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag size={36} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order detail modal */}
      <AnimatePresence>
        {selected && (
          <OrderDetailModal
            order={selected}
            reviewedProductIds={reviewedProductIds}
            onClose={() => setSelected(null)}
            onReviewSuccess={handleReviewSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}