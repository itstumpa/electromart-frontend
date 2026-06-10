'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  CheckCircle2, Package, ArrowRight, ShoppingBag,
  XCircle, RefreshCw, AlertTriangle, HeadphonesIcon,
  Clock, MapPin,
} from 'lucide-react';
import { getOrderById } from '@/api/order.api';
import { mapOrderDtoToUi } from '@/lib/order-mappers';
import type { Order } from '@/data/types';

type PaymentStatus = 'success' | 'fail' | 'cancel';

const FAILURE_REASONS = [
  { icon: '💳', reason: 'Card declined by your bank' },
  { icon: '💰', reason: 'Insufficient funds' },
  { icon: '🔒', reason: 'Card security check failed' },
  { icon: '🌐', reason: 'Network timeout during payment' },
];

export default function PaymentResultClient({
  status,
  orderId,
}: {
  status: PaymentStatus;
  orderId: string;
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(orderId)
      .then((res) => {
        if (res.data.data) setOrder(mapOrderDtoToUi(res.data.data));
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 text-sm">Loading payment details…</p>
      </div>
    );
  }

  if (!order) {
    return status === 'success' ? (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-5">
          <Package size={30} className="text-yellow-600" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment received!
        </h1>
        <p className="text-slate-500 text-sm mb-2">We couldn&apos;t load your order details right now.</p>
        <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-2 inline-block mb-6">Order ID: {orderId}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/orders" className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm">
            View My Orders <ArrowRight size={15} />
          </Link>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    ) : (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${
          status === 'fail' ? 'bg-red-100' : 'bg-slate-100'
        }`}>
          <XCircle size={32} className={status === 'fail' ? 'text-red-600' : 'text-slate-500'} />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment {status === 'fail' ? 'Failed' : 'Cancelled'}
        </h1>
        <p className="text-slate-500 text-sm mb-2">
          {status === 'fail'
            ? 'Your payment could not be processed.'
            : 'No problem — you cancelled the payment.'}
        </p>
        <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-2 inline-block mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          {status === 'fail'
            ? 'No charges were made. Your order is still saved — you can retry payment from your orders page.'
            : 'Your order is saved. You can complete payment whenever you\'re ready.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/orders"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-amber-200">
            View My Orders <ArrowRight size={15} />
          </Link>
          {status === 'fail' ? (
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
              <HeadphonesIcon size={15} /> Contact Support
            </Link>
          ) : (
            <Link href="/products"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
              Keep Shopping
            </Link>
          )}
        </div>
      </div>
    );
  }

  /* ─── Success View ─────────────────────────────────── */
  if (status === 'success') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={40} className="text-green-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Payment Successful!
          </h1>
          <p className="text-slate-500 text-sm mb-1">Thank you for your order. We&apos;re getting it ready.</p>
          <div className="inline-flex items-center gap-2 bg-amber-600 text-white font-black text-sm px-4 py-1.5 rounded-full mt-2">
            {order.orderNumber}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag size={16} className="text-amber-600" />
            <h2 className="font-black text-slate-900 text-sm">Items Ordered ({order.items.length})</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-slate-900 shrink-0">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-black text-base border-t border-slate-200 pt-2">
              <span>Total Paid</span><span className="text-amber-700">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/customer/orders" className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl text-sm">
            Track My Order <ArrowRight size={15} />
          </Link>
          <Link href="/products" className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Fail View ────────────────────────────────────── */
  if (status === 'fail') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-6 sm:p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
            <XCircle size={40} className="text-red-600" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Payment Failed
          </h1>
          <p className="text-slate-500 text-sm mb-3 leading-relaxed">
            Your payment could not be processed. <strong>No charges were made.</strong>{' '}
            Your order is saved and you can retry.
          </p>
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-bold text-xs px-4 py-1.5 rounded-full mb-5">
            {order.orderNumber}
          </div>
          <div>
            <Link href={`/checkout?retryOrderId=${order.id}`}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm">
              <RefreshCw size={15} /> Try Payment Again
            </Link>
            <p className="text-xs text-slate-400 mt-2">Your cart and order details are preserved</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-red-600" />
            <p className="text-sm font-black text-red-800">Common reasons for payment failure</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {FAILURE_REASONS.map(({ icon, reason }) => (
              <div key={reason} className="flex items-center gap-2 text-xs text-red-700">
                <span>{icon}</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-red-600 mt-3 font-medium">
            Please check with your bank or try a different payment method.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <ShoppingBag size={15} className="text-slate-500" />
            <h2 className="font-black text-slate-900 text-sm">Order Summary</h2>
            <span className="text-xs text-slate-400 ml-auto">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
                <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="44px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-black text-slate-900 shrink-0">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between font-black text-base">
            <span className="text-slate-900">Order Total</span>
            <span className="text-amber-700">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
            <MapPin size={11} /> Shipping Address
          </p>
          <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
          <p className="text-sm text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/customer/orders"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold py-3 rounded-xl transition-all text-sm">
            View My Orders
          </Link>
          <Link href="/contact"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm">
            <HeadphonesIcon size={14} /> Contact Support
          </Link>
        </div>
      </div>
    );
  }

  /* ─── Cancel View ──────────────────────────────────── */
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <XCircle size={40} className="text-slate-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment Cancelled
        </h1>
        <p className="text-slate-500 text-sm mb-3 leading-relaxed max-w-xs mx-auto">
          No worries — you cancelled before the payment went through.{' '}
          <strong>Nothing was charged.</strong>
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-4 py-2 rounded-full mb-5">
          <Clock size={13} />
          Your order <span className="font-mono">{order.orderNumber}</span> is saved
        </div>
        <div>
          <Link href={`/checkout?retryOrderId=${order.id}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm">
            <RefreshCw size={15} /> Complete Payment
          </Link>
          <p className="text-xs text-slate-400 mt-2">Your items and address are still saved</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm font-black text-amber-900 mb-3">What happens to my order?</p>
        <div className="space-y-2">
          {[
            { icon: '🛒', text: 'Your order is saved in a pending state — nothing is lost.' },
            { icon: '⏰', text: 'Pending orders are held for 24 hours before being cancelled automatically.' },
            { icon: '💳', text: 'You can complete payment anytime from your Orders page.' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-start gap-2.5 text-xs text-amber-800">
              <span className="shrink-0 mt-0.5">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={15} className="text-slate-500" />
          <h2 className="font-black text-slate-900 text-sm">Your Order</h2>
          <span className="text-xs text-slate-400 ml-auto">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="divide-y divide-slate-50">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="44px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                {item.variant && <p className="text-xs text-slate-400">{item.variant}</p>}
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">${item.total.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="font-black text-slate-900">Order Total</span>
          <span className="text-lg font-black text-amber-700">${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
          <MapPin size={11} /> Ship To (Saved)
        </p>
        <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
        <p className="text-sm text-slate-500">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/dashboard/customer/orders"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold py-3 rounded-xl transition-all text-sm">
          View My Orders
        </Link>
        <Link href="/products"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm">
          Continue Shopping
        </Link>
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-400">
          Having trouble with payment?{' '}
          <Link href="/contact" className="text-amber-600 font-semibold hover:text-amber-700 inline-flex items-center gap-1">
            <HeadphonesIcon size={11} /> Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
