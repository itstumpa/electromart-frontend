// app/(payment)/payment/cancel/page.tsx
// Reached via SSLCommerz redirect when user CANCELS payment
//   (clicked "go back", closed the payment window, or chose not to proceed)
//   ${CLIENT_URL}/payment/cancel?orderId=xxx
//
// Different from /fail — this is intentional, not an error.
// Warmer, softer tone. No "failure reasons" — user just changed their mind.
// Shows: order preserved + resume + continue shopping.

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  XCircle, ArrowRight, ShoppingBag,
  Clock, MapPin, RefreshCw, HeadphonesIcon,
} from 'lucide-react';
import { mockOrders } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Payment Cancelled — ElectroMart',
};

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

export default async function PaymentCancelPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) redirect('/');

  const order = await fetchOrder(orderId);

  // ── Error state — can't load order ───────────────────────
  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <XCircle size={32} className="text-slate-500" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment Cancelled
        </h1>
        <p className="text-slate-500 text-sm mb-2">
          No problem — you cancelled the payment.
        </p>
        <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-2 inline-block mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Your order is saved. You can complete payment whenever you&apos;re ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/orders"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-amber-200">
            View My Orders <ArrowRight size={15} />
          </Link>
          <Link href="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
            Keep Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Cancel state — order found ────────────────────────────
  return (
    <div className="space-y-4">

      {/* Hero card — softer, no red, uses slate/amber */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center">
        {/* Icon — slate, not red (intentional action, not error) */}
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <XCircle size={40} className="text-slate-500" strokeWidth={1.5} />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Payment Cancelled
        </h1>
        <p className="text-slate-500 text-sm mb-3 leading-relaxed max-w-xs mx-auto">
          No worries — you cancelled before the payment went through.{' '}
          <strong>Nothing was charged.</strong>
        </p>

        {/* Order preserved note */}
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-4 py-2 rounded-full mb-5">
          <Clock size={13} />
          Your order <span className="font-mono">{order.orderNumber}</span> is saved
        </div>

        {/* Primary CTA */}
        <div>
          <Link
            href={`/checkout?retryOrderId=${order.id}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-8 py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
          >
            <RefreshCw size={15} /> Complete Payment
          </Link>
          <p className="text-xs text-slate-400 mt-2">
            Your items and address are still saved
          </p>
        </div>
      </div>

      {/* What happens next info strip */}
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

      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={15} className="text-slate-500" />
          <h2 className="font-black text-slate-900 text-sm">Your Order</h2>
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
                {item.variant && (
                  <p className="text-xs text-slate-400">{item.variant}</p>
                )}
                <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">
                ${item.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="font-black text-slate-900">Order Total</span>
          <span className="text-lg font-black text-amber-700">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
          <MapPin size={11} /> Ship To (Saved)
        </p>
        <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
        <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
        <p className="text-sm text-slate-500">
          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
          {order.shippingAddress.zipCode}
        </p>
      </div>

      {/* Secondary actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/customer/orders"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold py-3 rounded-xl transition-all text-sm"
        >
          View My Orders
        </Link>
        <Link
          href="/products"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-all text-sm"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Support */}
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