'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { getOrderById } from '@/api/order.api';
import { mapOrderDtoToUi } from '@/lib/order-mappers';
import type { Order } from '@/data/types';

export default function PaymentSuccessClient({ orderId }: { orderId: string }) {
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
    return <p className="text-slate-500 text-sm text-center py-12">Loading order details...</p>;
  }

  if (!order) {
    return (
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
    );
  }

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
