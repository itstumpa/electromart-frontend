"use client";

import { addToCart as addToCartApi, addToGuestCart } from "@/src/services/api/cart.api";
import {
  getWishlist,
  getGuestWishlist,
  removeFromWishlist,
  removeFromGuestWishlist,
} from "@/src/services/api/wishlist.api";
import { authStorage } from "@/utils/auth-storage";
import ConfirmModal from "@/components/dashboard/admin/Confirmmodal";
import type { WishlistItem } from "@/data/types";
import { notifyCartUpdated } from "@/hooks/useCartCount";
import { mapWishlistItemsToUi } from "@/lib/wishlist-mappers";
import { getApiErrorMessage, isUnauthorized } from "@/utils/api-error";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  ShoppingCart,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function WishlistClient() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [added, setAdded] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const loadWishlist = useCallback(async () => {
    try {
      const user = authStorage.getAuthUser();
      const fetch = user ? getWishlist : getGuestWishlist;
      const res = await fetch();
      setItems(mapWishlistItemsToUi(res.data.data ?? []));
    } catch (err) {
      if (!isUnauthorized(err)) {
        toast.error(getApiErrorMessage(err, "Failed to load wishlist"));
      }
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const remove = async (productId: string, itemId: string) => {
    setRemoving(itemId);
    const user = authStorage.getAuthUser();
    const removeFn = user ? removeFromWishlist : removeFromGuestWishlist;
    try {
      await removeFn(productId);
      await loadWishlist();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to remove item"));
    } finally {
      setRemoving(null);
    }
  };

const clearAll = async () => {
  setClearingAll(true);
  const user = authStorage.getAuthUser();
  const removeFn = user ? removeFromWishlist : removeFromGuestWishlist;
  try {
    await Promise.all(items.map((i) => removeFn(i.productId)));
    await loadWishlist();
    toast.success('Wishlist cleared');
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Failed to clear wishlist'));
  } finally {
    setClearingAll(false);
    setShowClearConfirm(false);
  }
};

const addToCart = async (productId: string, itemId: string) => {
  const user = authStorage.getAuthUser();
  const addFn = user ? addToCartApi : addToGuestCart;
  const removeFn = user ? removeFromWishlist : removeFromGuestWishlist;
  try {
    await addFn(productId, 1);
    await removeFn(productId);
    notifyCartUpdated();
    setAdded(itemId);
    setTimeout(() => {
      setAdded(null);
      loadWishlist();
    }, 1800);
  } catch (err) {
    toast.error(getApiErrorMessage(err, 'Failed to add to cart'));
  }
};

  const discount = (item: WishlistItem) =>
    item.originalPrice
      ? Math.round(
          ((item.originalPrice - item.price) / item.originalPrice) * 100,
        )
      : 0;

  return (
    <div className="max-w-4xl min-h-screen mx-auto pt-3 pb-1 md:pb-6 md:pt-6  space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Heart size={16} className="text-amber-600 fill-amber-200" />
          </div>
          <div>
            <h1
              className="text-xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              My Wishlist
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {items.length} saved item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={clearingAll}
              className="flex items-center gap-2 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-500 font-bold text-sm px-4 py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              <Trash size={14} />
              {clearingAll ? "Clearing…" : "Clear All"}
            </button>
            <button
              onClick={() => items.forEach((i) => addToCart(i.productId, i.id))}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-amber-100"
            >
              <ShoppingCart size={14} />
              Add All to Cart
            </button>
          </div>
        )}
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div className="py-16 flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" />
          <p className="text-sm text-slate-400">Loading wishlist…</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && items.length === 0 && (
        <div className="py-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
            <Heart size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-700 font-bold text-base mb-1">
            Your wishlist is empty
          </p>
          <p className="text-slate-400 text-sm mb-6">
            Save items you love to find them later.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            Browse Products <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* ── List ── */}
      {!loading && items.length > 0 && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const disc = discount(item);
              const isAdded = added === item.id;
              const isOut = item.stock === 0;
              const isLow = item.stock > 0 && item.stock <= 10;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: removing === item.id ? 0 : 1,
                    x: removing === item.id ? 40 : 0,
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
                    {isOut && (
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
                      <p className="text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-1">
                        {item.productName}
                      </p>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={
                              i < Math.floor(item.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {item.rating}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {disc > 0 && (
                        <span className="text-[10px] font-black px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg">
                          -{disc}% OFF
                        </span>
                      )}
                      {isLow && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-500 rounded-lg border border-orange-100">
                          Only {item.stock} left
                        </span>
                      )}
                      {isOut && (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-400 rounded-lg">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price + actions */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    {/* Price */}
                    <div className="text-right">
                      <p className="text-base font-black text-slate-900 tabular-nums leading-none">
                        ${item.price.toLocaleString()}
                      </p>
                      {item.originalPrice && (
                        <p className="text-xs text-slate-400 line-through tabular-nums mt-0.5">
                          ${item.originalPrice.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => addToCart(item.productId, item.id)}
                        disabled={isOut}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                          isAdded
                            ? "bg-emerald-500 text-white"
                            : isOut
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                              : "bg-amber-600 hover:bg-amber-700 text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <CheckCircle2 size={12} /> Added
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={12} />
                            <span className="hidden sm:inline ml-1">
                              Add to Cart
                            </span>
                            <span className="sm:hidden ml-1">Add</span>
                          </>
                        )}
                      </button>

                      {/* <button
                        onClick={() => remove(item.productId, item.id)}
                        aria-label="Remove from wishlist"
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <Trash2 size={14} />
                      </button> */}

                      <ConfirmModal
  open={showClearConfirm}
  title="Clear Wishlist?"
  description="This will remove all items from your wishlist. This action cannot be undone."
  confirmLabel="Clear All"
  danger
  onConfirm={clearAll}
  onCancel={() => setShowClearConfirm(false)}
/>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
