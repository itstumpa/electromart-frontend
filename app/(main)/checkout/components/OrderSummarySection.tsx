"use client";

import { Tag } from "lucide-react";
import Image from "next/image";
import type { CartItem } from "@/data/types";

// ─── OrderSummarySection ─────────────────────────────────────
export default function OrderSummarySection({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  discountAmt,
  couponCode,
}: {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discountAmt: number;
  couponCode: string;
}) {
  return (
    <>
      <h3 className="font-black text-slate-900 mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="44px"
              />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                {item.productName}
              </p>
              {item.variant && (
                <p className="text-[10px] text-slate-400">{item.variant}</p>
              )}
            </div>
            <p className="text-xs font-black text-slate-900 shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
        <div className="flex justify-between text-slate-500">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discountAmt > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag size={11} /> {couponCode}
            </span>
            <span className="font-bold">-${discountAmt.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-slate-500">
          <span>Shipping</span>
          <span>
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-500">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-black text-base border-t border-slate-100 pt-2">
          <span>Total</span>
          <span className="text-amber-700">${total.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
}
