// SERVER COMPONENT — Next.js 15+: params is a Promise, must be awaited
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Package, Truck, MapPin, ArrowRight, Download } from 'lucide-react';
import { mockOrders } from '@/data/mock-data';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return { title: `Order ${id} Confirmed — ElectroMart` };
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;

  // In production: await prisma.order.findUnique({ where: { orderNumber: id } })
  const order = mockOrders.find((o) => o.orderNumber === id) ?? mockOrders[0];

  const steps = [
    { label: 'Order Placed',    done: true,  icon: CheckCircle2, date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) },
    { label: 'Processing',      done: ['processing','shipped','out_for_delivery','delivered'].includes(order.status), icon: Package,  date: '' },
    { label: 'Shipped',         done: ['shipped','out_for_delivery','delivered'].includes(order.status), icon: Truck, date: order.trackingNumber ? 'Track: ' + order.trackingNumber : '' },
    { label: 'Out for Delivery',done: ['out_for_delivery','delivered'].includes(order.status), icon: Truck, date: '' },
    { label: 'Delivered',       done: order.status === 'delivered', icon: CheckCircle2,
      date: order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

        {/* ── Success hero ── */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-5 shadow-md shadow-green-100">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Order Confirmed!
          </h1>
          <p className="text-slate-500 text-base">
            Thank you for your order. We've received it and are getting it ready.
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-600 text-white font-black px-5 py-2 rounded-xl mt-4 text-sm">
            Order #{order.orderNumber}
          </div>
        </div>

        {/* ── Tracking timeline ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="font-black text-slate-900 mb-5">Order Status</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-slate-100" />
            <div className="space-y-6">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 ${
                      step.done ? 'bg-green-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon size={15} />
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-xs text-slate-400 mt-0.5">{step.date}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.estimatedDelivery && order.status !== 'delivered' && (
            <div className="mt-5 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <p className="text-sm font-bold text-amber-800">
                📦 Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          )}
        </div>

        {/* ── Order items ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-5">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-black text-slate-900">Items Ordered</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 px-5 py-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-snug">{item.productName}</p>
                  {item.variant && <p className="text-xs text-slate-400 mt-0.5">{item.variant}</p>}
                  <p className="text-xs text-slate-400">Qty: {item.quantity} · from {item.vendorName}</p>
                </div>
                <p className="text-sm font-black text-slate-900 shrink-0">
                  ${item.total.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          {/* Price summary */}
          <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 space-y-2 text-sm">
            <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            {order.shippingCost > 0 && <div className="flex justify-between text-slate-500"><span>Shipping</span><span>${order.shippingCost.toFixed(2)}</span></div>}
            <div className="flex justify-between text-slate-500"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600 font-semibold"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between font-black text-base text-slate-900 border-t border-slate-200 pt-2">
              <span>Total Paid</span><span className="text-amber-700">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ── Shipping address ── */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <MapPin size={12} /> Shipping To
          </p>
          <p className="text-sm font-bold text-slate-900">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-slate-600">{order.shippingAddress.street}</p>
          <p className="text-sm text-slate-600">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          <p className="text-sm text-slate-400 mt-1">{order.customerPhone}</p>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/customer/orders"
            className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
          >
            Track My Order <ArrowRight size={15} />
          </Link>
          <Link href="/products"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-amber-300 text-slate-700 hover:text-amber-700 font-bold py-3 rounded-xl transition-all text-sm"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Confirmation email note */}
        <p className="text-center text-xs text-slate-400 mt-5">
          A confirmation email was sent to <span className="font-semibold text-slate-600">{order.customerEmail}</span>
        </p>
      </div>
    </div>
  );
}