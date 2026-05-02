'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Star, CheckCircle2, ArrowRight } from 'lucide-react';
import { mockWishlist } from '@/data/mock-data';
import type { WishlistItem } from '@/data/types';

export default function WishlistClient() {
  const [items,   setItems]   = useState<WishlistItem[]>(mockWishlist);
  const [added,   setAdded]   = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const remove = async (id: string) => {
    setRemoving(id);
    await new Promise((r) => setTimeout(r, 350));
    setItems((prev) => prev.filter((i) => i.id !== id));
    setRemoving(null);
  };

  const addToCart = (id: string) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 1800);
  };

  const discount = (item: WishlistItem) =>
    item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            My Wishlist
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => items.forEach((i) => addToCart(i.id))}
            className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-amber-200"
          >
            <ShoppingCart size={15} /> Add All to Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Heart size={40} className="mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500 font-semibold mb-2">Your wishlist is empty</p>
          <Link href="/products" className="text-sm text-amber-600 font-bold hover:text-amber-700 inline-flex items-center gap-1">
            Browse Products <ArrowRight size={13} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence initial={false}>
            {items.map((item) => {
              const disc    = discount(item);
              const isAdded = added === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1 }}
                  animate={{ opacity: removing === item.id ? 0 : 1, scale: removing === item.id ? 0.95 : 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-50">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-400"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {disc > 0 && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        -{disc}%
                      </span>
                    )}
                    {item.stock <= 10 && item.stock > 0 && (
                      <span className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        Low stock
                      </span>
                    )}
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <span className="bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">Out of Stock</span>
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={() => remove(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl flex items-center justify-center transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug hover:text-amber-700 transition-colors line-clamp-2 mb-2">
                        {item.productName}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={11} className={i < Math.floor(item.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{item.rating}</span>
                    </div>

                    {/* Price + actions */}
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-black text-slate-900">${item.price.toLocaleString()}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-slate-400 line-through ml-1.5">${item.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => remove(item.id)}
                          className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors"
                        >
                          <Heart size={14} className="fill-red-400" />
                        </button>
                        <button
                          onClick={() => addToCart(item.id)}
                          disabled={item.stock === 0}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                            isAdded
                              ? 'bg-green-600 text-white'
                              : 'bg-amber-600 hover:bg-amber-700 text-white disabled:bg-slate-200 disabled:text-slate-400'
                          }`}
                        >
                          {isAdded ? <><CheckCircle2 size={12} /> Added</> : <><ShoppingCart size={12} /> Add</>}
                        </button>
                      </div>
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