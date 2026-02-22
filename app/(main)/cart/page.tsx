'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus, Plus, Trash2, ShoppingBag,
  Tag, ChevronRight, ArrowRight,
  Shield, Truck, RotateCcw, CheckCircle2, X,
} from 'lucide-react';
import { mockCart } from '@/data/mock-data';
import { CartItem } from '@/data/types';
// import type { CartItem } from '@/types';

const VALID_COUPONS: Record<string, number> = {
  ELECTRO20: 20,
  SAVE10:    10,
  NEWUSER15: 15,
};

export default function CartPage() {
  const [items,       setItems]       = useState<CartItem[]>(mockCart.items);
  const [coupon,      setCoupon]      = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [removing,    setRemoving]    = useState<string | null>(null);

  /* ── Calculations ── */
  const subtotal     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountPct  = VALID_COUPONS[coupon] ?? 0;
  const discountAmt  = (subtotal * discountPct) / 100;
  const shipping     = subtotal >= 99 ? 0 : 14.99;
  const tax          = (subtotal - discountAmt) * 0.09;
  const total        = subtotal - discountAmt + shipping + tax;
  const itemCount    = items.reduce((s, i) => s + i.quantity, 0);

  /* ── Handlers ── */
  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = async (id: string) => {
    setRemoving(id);
    await new Promise((r) => setTimeout(r, 350));
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRemoving(null);
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS[code]) {
      setCoupon(code);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try ELECTRO20.');
      setCouponApplied(false);
    }
  };

  const removeCoupon = () => {
    setCoupon('');
    setCouponInput('');
    setCouponApplied(false);
    setCouponError('');
  };

  /* ── Empty cart ── */
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-[#FFFBEB]">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 flex items-center justify-center mb-5">
          <ShoppingBag size={36} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
          Your cart is empty
        </h2>
        <p className="text-slate-500 text-sm mb-7 text-center max-w-xs">
          Looks like you haven&apos;t added anything yet. Start shopping!
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-7 py-3 rounded-xl transition-colors shadow-md shadow-amber-200"
        >
          Browse Products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight size={11} />
            <span className="text-slate-700 font-semibold">Cart</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Shopping Cart
            <span className="ml-3 text-lg font-bold text-amber-600">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ══ Cart items ══ */}
          <div className="lg:col-span-2 space-y-3">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1, height: 'auto' }}
                  animate={{ opacity: removing === item.id ? 0 : 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Product image */}
                    <Link href={`/products/${item.productId}`} className="shrink-0">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-50">
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="112px"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-amber-600 mb-0.5">{item.vendorName}</p>
                        <Link href={`/products/${item.productId}`}>
                          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-amber-700 transition-colors line-clamp-2">
                            {item.productName}
                          </h3>
                        </Link>
                        {item.variant && (
                          <span className="text-xs text-slate-400 mt-1 inline-block bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            {item.variant}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
                        {/* Qty stepper */}
                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-9 text-center text-sm font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Price + remove */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-black text-slate-900 text-base">
                              ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-slate-400">${item.price.toFixed(2)} each</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Low stock warning */}
                  {item.stock <= 10 && (
                    <p className="text-xs text-red-600 font-semibold mt-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                      Only {item.stock} left in stock
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue shopping */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors mt-2"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* ══ Order summary ══ */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="font-black text-slate-900 text-lg mb-5">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} /> Coupon ({coupon})
                    </span>
                    <span className="font-bold">-${discountAmt.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="font-semibold text-green-600">Free</span>
                  ) : (
                    <span className="font-semibold text-slate-900">${shipping.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax (9%)</span>
                  <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Free shipping progress */}
              {shipping > 0 && (
                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <p className="text-xs text-amber-800 font-semibold mb-1.5">
                    Add ${(99 - subtotal).toFixed(2)} more for free shipping
                  </p>
                  <div className="h-1.5 bg-amber-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / 99) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between items-center border-t border-slate-100 mt-4 pt-4">
                <span className="font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-amber-700">${total.toFixed(2)}</span>
              </div>

              {/* Coupon */}
              <div className="mt-5">
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={15} className="text-green-600" />
                      <span className="text-sm font-bold text-green-800">{coupon} applied — {discountPct}% off</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 transition-colors">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      placeholder="Coupon code"
                      className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition placeholder-slate-400"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 font-medium mt-1.5">{couponError}</p>}
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white font-black py-3.5 rounded-xl transition-colors shadow-md shadow-amber-200 text-sm"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
                {[
                  { icon: Shield,    label: 'Secure Payment' },
                  { icon: Truck,     label: 'Fast Delivery' },
                  { icon: RotateCcw, label: '30-Day Return' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <Icon size={16} className="text-amber-600" />
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}