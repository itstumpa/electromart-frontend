// app/(payment)/payment/fail/page.tsx
// Reached via SSLCommerz redirect when payment attempt FAILS
//   (card declined, bank error, network timeout, insufficient funds)
//   ${CLIENT_URL}/payment/fail?orderId=xxx
//
// Different from /cancel — user DID attempt payment but it failed.
// Shows: what went wrong + retry button + order summary + support link.

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  XCircle, RefreshCw, ArrowRight,
  HeadphonesIcon, ShoppingBag, AlertTriangle,
  MapPin,
} from 'lucide-react';
import { mockOrders } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Payment Failed — ElectroMart',
};

// ─── Common failure reasons ──────────────────────────────────
const FAILURE_REASONS = [
  { icon: '💳', reason: 'Card declined by your bank' },
  { icon: '💰', reason: 'Insufficient funds' },
  { icon: '🔒', reason: 'Card security check failed' },
  { icon: '🌐', reason: 'Network timeout during payment' },
];

async function fetchOrder(orderId: string) {
  // MOCK — replace with:
  // const res = await fetch(
  //   `${process.env.BACKEND_URL}/api/v1/orders/${orderId}`,
  //   { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
  // );
  // if (!res.ok) return null;
  // return (await res.json()).data;
  await new Promise((r) => setTimeout(r, 0));
  return mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId) ?? null;
}

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentFailPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) redirect('/');

  const order = await fetchOrder(orderId);

  // ── Error state — can't load order ───────────────────────
  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-red-600" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment Failed
        </h1>
        <p className="text-slate-500 text-sm mb-2">
          Your payment could not be processed.
        </p>
        <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-2 inline-block mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          No charges were made. Your order is still saved — you can retry payment from your orders page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/orders"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-amber-200">
            View My Orders <ArrowRight size={15} />
          </Link>
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
            <HeadphonesIcon size={15} /> Contact Support
          </Link>
        </div>
      </div>
    );
  }

  // ── Fail state — order found ──────────────────────────────
  return (
    <div className="space-y-4">

      {/* Hero card */}
      <div className="bg-white rounded-3xl border border-red-100 shadow-xl p-6 sm:p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-5">
          <XCircle size={40} className="text-red-600" strokeWidth={1.5} />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Payment Failed
        </h1>
        <p className="text-slate-500 text-sm mb-3 leading-relaxed">
          Your payment could not be processed. <strong>No charges were made.</strong>{' '}
          Your order is saved and you can retry.
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-bold text-xs px-4 py-1.5 rounded-full mb-5">
          {order.orderNumber}
        </div>

        {/* Retry CTA — primary action */}
        <div>
          <Link
            href={`/checkout?retryOrderId=${order.id}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
          >
            <RefreshCw size={15} /> Try Payment Again
          </Link>
          <p className="text-xs text-slate-400 mt-2">
            Your cart and order details are preserved
          </p>
        </div>
      </div>

      {/* Common failure reasons */}
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

      {/* Order summary — so they know what they were buying */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={15} className="text-slate-500" />
          <h2 className="font-black text-slate-900 text-sm">Order Summary</h2>
          <span className="text-xs text-slate-400 ml-auto">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="divide-y divide-slate-50">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="44px"
                />
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

      {/* Shipping address */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
          <MapPin size={11} /> Shipping Address
        </p>
        <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
        <p className="text-sm text-slate-500">
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
        </p>
      </div>

      {/* Secondary actions */}
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