// app/(payment)/payment/success/page.tsx
// Reached via SSLCommerz/Stripe redirect:
//   ${CLIENT_URL}/payment/success?orderId=xxx
//
// Flow:
//   1. Read orderId from URL searchParams
//   2. Fetch GET /api/v1/orders/:id (server-side, no client JS needed)
//   3. Render full order summary if found
//   4. Render error state with link to orders if fetch fails

import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  CheckCircle2, Package, MapPin,
  CreditCard, ArrowRight,
  Truck, ShoppingBag,
} from 'lucide-react';
import { mockOrders } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Payment Successful — ElectroMart',
};

// ─── Fetch order server-side ─────────────────────────────────
// In production swap mockOrders lookup with:
//
//   const res = await fetch(
//     `${process.env.BACKEND_URL}/api/v1/orders/${orderId}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`,   // read from cookies()
//         'Content-Type': 'application/json',
//       },
//       cache: 'no-store',
//     }
//   );
//   if (!res.ok) return null;
//   const json = await res.json();
//   return json.data;

async function fetchOrder(orderId: string) {
  // MOCK — replace with real fetch above
  await new Promise((r) => setTimeout(r, 0)); // simulate async
  return mockOrders.find((o) => o.id === orderId || o.orderNumber === orderId) ?? null;
}

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  // No orderId in URL → redirect home
  if (!orderId) redirect('/');

  const order = await fetchOrder(orderId);

  // ── Error state ───────────────────────────────────────────
  if (!order) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-5">
          <Package size={30} className="text-yellow-600" />
        </div>
        <h1 className="text-xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Payment received!
        </h1>
        <p className="text-slate-500 text-sm mb-2">
          We couldn&apos;t load your order details right now.
        </p>
        <p className="text-xs text-slate-400 font-mono bg-slate-100 rounded-lg px-3 py-2 inline-block mb-6">
          Order ID: {orderId}
        </p>
        <p className="text-sm text-slate-500 mb-6">
          Your payment was successful. You can track your order from your orders page.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/orders"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md shadow-amber-200">
            View My Orders <ArrowRight size={15} />
          </Link>
          <Link href="/products"
            className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-all">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Hero card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 text-center">
        {/* Animated checkmark */}
        <div className="relative w-20 h-20 mx-auto mb-5">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={40} className="text-green-600" strokeWidth={1.5} />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
        </div>

        <h1
          className="text-2xl sm:text-3xl font-black text-slate-900 mb-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          Payment Successful!
        </h1>
        <p className="text-slate-500 text-sm mb-1">
          Thank you for your order. We&apos;re getting it ready.
        </p>
        <div className="inline-flex items-center gap-2 bg-amber-600 text-white font-black text-sm px-4 py-1.5 rounded-full mt-2">
          {order.orderNumber}
        </div>
      </div>

      {/* Order items */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ShoppingBag size={16} className="text-amber-600" />
          <h2 className="font-black text-slate-900 text-sm">
            Items Ordered ({order.items.length})
          </h2>
        </div>
        <div className="divide-y divide-slate-50">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3 px-5 py-3.5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                {item.variant && (
                  <p className="text-xs text-slate-400">{item.variant}</p>
                )}
                <p className="text-xs text-slate-400">
                  Qty: {item.quantity} · from {item.vendorName}
                </p>
              </div>
              <p className="text-sm font-black text-slate-900 shrink-0">
                ${item.total.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Price breakdown */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.shippingCost > 0 && (
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span>${order.shippingCost.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
            <span>Total Paid</span>
            <span className="text-amber-700">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping + payment info */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
            <MapPin size={12} /> Ship To
          </p>
          <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-slate-500">{order.shippingAddress.street}</p>
          <p className="text-sm text-slate-500">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-xs text-slate-400 mt-1">{order.customerPhone}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2.5">
            <CreditCard size={12} /> Payment
          </p>
          <p className="text-sm font-bold text-slate-900 capitalize">{order.paymentMethod}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            {order.paymentStatus}
          </span>

          {order.estimatedDelivery && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mb-0.5">
                <Truck size={11} /> Estimated Delivery
              </p>
              <p className="text-sm font-bold text-amber-700">
                {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                  weekday: 'long', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation note */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-3.5 flex items-start gap-3">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-[10px] font-black">i</span>
        </div>
        <p className="text-xs text-blue-700 font-medium leading-relaxed">
          A confirmation email has been sent to{' '}
          <span className="font-bold">{order.customerEmail}</span>. You can
          track your order anytime from your dashboard.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard/customer/orders"
          className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
        >
          Track My Order <ArrowRight size={15} />
        </Link>
        <Link
          href="/products"
          className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold py-3.5 rounded-xl transition-all text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}