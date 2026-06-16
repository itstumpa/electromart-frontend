"use client";

import {
  getCart,
  removeCartItem,
  updateCartItem,
  clearCart,
  applyCartCoupon,
  removeCartCoupon,
} from "@/src/services/api/cart.api";
import ConfirmModal from "@/components/dashboard/admin/Confirmmodal";
import { notifyCartUpdated } from "@/hooks/useCartCount";
import { mapCartItemsToUi } from "@/lib/cart-mappers";
import { getApiErrorMessage, isUnauthorized } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Hash,
  Minus,
  Plus,
  ShoppingCart,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/data/types";

const SPINNER = (
  <div className="w-7 h-7 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
);

export default function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      const res = await getCart();
      const data = res.data.data;
      if (!data) {
        setItems([]);
        setCartTotal(0);
        setDiscountPercent(0);
        setDiscountAmount(0);
        setFinalTotal(0);
        setCouponCode(null);
        return;
      }
      setItems(mapCartItemsToUi(data.items ?? []));
      setCartTotal(data.cartTotal ?? 0);
      setDiscountPercent(data.discountPercent ?? 0);
      setDiscountAmount(data.discountAmount ?? 0);
      setFinalTotal(data.finalTotal ?? 0);
      setCouponCode(data.couponCode ?? null);
    } catch (err) {
      if (!isUnauthorized(err)) {
        toast.error(getApiErrorMessage(err, "Failed to load cart"));
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantity = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1 || newQty > item.stock) return;
    setUpdatingId(item.id);
    try {
      await updateCartItem(item.productId, newQty, item.variantId);
      notifyCartUpdated();
      await loadCart();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to update quantity"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    setRemovingId(item.id);
    try {
      await removeCartItem(item.productId, item.variantId);
      notifyCartUpdated();
      await loadCart();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove item"));
    } finally {
      setRemovingId(null);
    }
  };

  const handleClearAll = async () => {
    setClearingAll(true);
    try {
      await clearCart();
      notifyCartUpdated();
      await loadCart();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to clear cart"));
    } finally {
      setClearingAll(false);
      setShowClearConfirm(false);
    }
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;
    setApplyingCoupon(true);
    try {
      const res = await applyCartCoupon(code);
      const data = res.data.data;
      if (data) {
        setCouponCode(data.couponCode ?? null);
        setDiscountPercent(data.discountPercent ?? 0);
        setDiscountAmount(data.discountAmount ?? 0);
        setFinalTotal(data.finalTotal ?? 0);
        setItems(mapCartItemsToUi(data.items ?? []));
      }
      setCouponInput("");
      toast.success(`Coupon "${code.toUpperCase()}" applied!`);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to apply coupon"));
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await removeCartCoupon();
      const data = res.data.data;
      if (data) {
        setCouponCode(null);
        setDiscountPercent(0);
        setDiscountAmount(0);
        setFinalTotal(data.finalTotal ?? 0);
        setItems(mapCartItemsToUi(data.items ?? []));
      }
      toast.success("Coupon removed");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove coupon"));
    }
  };

  return (
    <div className="max-w-5xl min-h-screen mx-auto pt-3 pb-1 md:pb-6 md:pt-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <ShoppingCart size={16} className="text-amber-600" />
          </div>
          <div>
            <h1
              className="text-xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              My Cart
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={clearingAll}
            className="flex items-center gap-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-500 font-bold text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
          >
            <Trash2 size={14} />
            {clearingAll ? "Clearing…" : "Clear Cart"}
          </button>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="py-16 flex flex-col items-center gap-3">
          {SPINNER}
          <p className="text-sm text-slate-400">Loading cart…</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && items.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
            <ShoppingCart size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-700 font-bold text-base mb-1">
            Your cart is empty
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Add items you love to get started.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Browse Products <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── Cart Content ── */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Items List ── */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const isUpdating = updatingId === item.id;
                const isRemoving = removingId === item.id;
                const outOfStock = item.stock === 0;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isRemoving ? 0 : 1,
                      x: isRemoving ? 40 : 0,
                    }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.28 }}
                    className="group flex items-center gap-4 p-4 bg-white hover:bg-amber-50/40 transition-colors"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="96px"
                      />
                      {outOfStock && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wide text-center px-1">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productSlug}`}>
                        <p className="text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-0.5">
                          {item.productName}
                        </p>
                      </Link>

                      {item.variant && (
                        <p className="text-xs text-slate-400 font-medium mb-1">
                          Variant: {item.variant}
                        </p>
                      )}

                      <p className="text-xs text-slate-400 font-medium mb-2">
                        Vendor: {item.vendorName}
                      </p>

                      {/* Price */}
                      <p className="text-sm font-black text-slate-900 tabular-nums">
                        ${item.price.toLocaleString()}
                      </p>

                      {item.stock <= 10 && item.stock > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-500 rounded-lg border border-orange-100 inline-block mt-1">
                          Only {item.stock} left
                        </span>
                      )}
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5">
                        <button
                          onClick={() => handleQuantity(item, -1)}
                          disabled={item.quantity <= 1 || isUpdating || outOfStock}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800 tabular-nums">
                          {isUpdating ? (
                            <span className="inline-block w-3 h-3 rounded-full border border-amber-600 border-t-transparent animate-spin" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleQuantity(item, 1)}
                          disabled={item.quantity >= item.stock || isUpdating || outOfStock}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-slate-200 disabled:opacity-30 flex items-center justify-center transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Line total */}
                      <p className="text-sm font-black text-slate-900 tabular-nums">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemove(item)}
                        disabled={isRemoving}
                        className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <X size={12} />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* ── Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Coupon */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800">Coupon</h3>
                </div>

                {couponCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5">
                    <div className="flex items-center gap-2">
                      <Hash size={13} className="text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-700 uppercase">
                        {couponCode}
                      </span>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                        -{discountPercent}%
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="flex-1 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all placeholder:text-slate-300"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || applyingCoupon}
                      className="text-xs font-bold bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white disabled:text-slate-400 px-3.5 py-2.5 rounded-xl transition-all active:scale-95"
                    >
                      {applyingCoupon ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={14} className="text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Order Summary
                  </h3>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold text-slate-800 tabular-nums">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Tag size={12} />
                        Discount ({discountPercent}%)
                      </span>
                      <span className="font-semibold text-emerald-600 tabular-nums">
                        -${discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="border-t border-slate-100 pt-2 mt-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-lg font-black text-slate-900 tabular-nums">
                      ${finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 active:scale-[0.97] text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm shadow-amber-100"
                >
                  <CreditCard size={15} />
                  Proceed to Checkout
                </Link>

                <Link
                  href="/products"
                  className="flex items-center justify-center gap-2 w-full text-xs font-bold text-slate-400 hover:text-amber-600 transition-colors"
                >
                  Continue Shopping <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={showClearConfirm}
        title="Clear Cart?"
        description="This will remove all items from your cart. This action cannot be undone."
        confirmLabel="Clear All"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
