'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, MapPin, ArrowRight, Search } from 'lucide-react';
import { getOrderById, getGuestOrderConfirmation } from '@/src/services/api/order.api';
import { authStorage } from '@/utils/auth-storage';
import { mapOrderDtoToUi } from '@/lib/order-mappers';
import type { Order } from '@/data/types';

export default function OrderConfirmationClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const user = authStorage.getAuthUser();
    const guest = !user;
    setIsGuest(guest);

    // Guest users use public endpoint (no auth required); authenticated users use regular endpoint
    const fetchOrder = guest ? getGuestOrderConfirmation(orderId) : getOrderById(orderId);

    fetchOrder
      .then((res) => {
        if (res.data.data) setOrder(mapOrderDtoToUi(res.data.data));
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return <p className="text-slate-500 text-center py-20">Loading order...</p>;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600 mb-4">Order not found</p>
        <Link href="/dashboard/customer/orders" className="text-amber-600 font-bold">
          View orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-green-100 flex items-center justify-center mx-auto mb-5 shadow-md shadow-green-100">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            Order Confirmed!
          </h1>
          <p className="text-slate-500 text-base">Thank you for your order.</p>
          <div className="inline-flex items-center gap-2 bg-amber-600 text-white font-black px-5 py-2 rounded-xl mt-4 text-sm">
            Order #{order.orderNumber}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-5">
          <h2 className="font-black text-slate-900 mb-5">Items</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50">
                  <Image src={item.productImage} alt={item.productName} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{item.productName}</p>
                  <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-black">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between font-black">
            <span>Total</span>
            <span className="text-amber-700">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mb-2">
            <MapPin size={12} /> Shipping Address
          </p>
          <p className="text-sm font-bold">{order.shippingAddress.fullName}</p>
          <p className="text-sm text-slate-500">
            {order.shippingAddress.street}, {order.shippingAddress.city}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {isGuest ? (
            <Link
              href={`/order/track/${orderId}`}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl text-sm"
            >
              <Search size={15} /> Track Order <ArrowRight size={15} />
            </Link>
          ) : (
            <Link
              href="/dashboard/customer/orders"
              className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl text-sm"
            >
              View My Orders <ArrowRight size={15} />
            </Link>
          )}
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
