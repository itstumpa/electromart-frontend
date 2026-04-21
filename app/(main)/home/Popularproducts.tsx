'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, ShoppingCart, Heart, ArrowRight,
  TrendingUp, Eye, CheckCircle2,
} from 'lucide-react';
import { mockProducts } from '@/data/mock-data';

type FilterTab = 'all' | 'sale' | 'bestseller' | 'featured';

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',        label: 'All'        },
  { key: 'sale',       label: 'On Sale'    },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'featured',   label: 'Featured'   },
];

export default function PopularProducts() {
  const [activeTab,    setActiveTab]    = useState<FilterTab>('all');
  const [wishlist,     setWishlist]     = useState<Set<string>>(new Set());
  const [addedToCart,  setAddedToCart]  = useState<string | null>(null);
  const [hoveredId,    setHoveredId]    = useState<string | null>(null);

  const filtered = mockProducts.filter((p) => {
    if (activeTab === 'sale')       return p.originalPrice && p.originalPrice > p.price;
    if (activeTab === 'bestseller') return p.bestseller;
    if (activeTab === 'featured')   return p.featured;
    return true;
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddToCart = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 1800);
  };

  const discountPct = (p: typeof mockProducts[0]) =>
    p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  return (
    <section className="bg-[#FFFBEB] py-10 sm:py-4">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-amber-600" />
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Hot Right Now</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Popular Products
            </h2>
          </div>

          {/* Tab filters */}
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-0.5 self-start sm:self-auto">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={[
                  'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap',
                  activeTab === key
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => {
              const disc    = discountPct(product);
              const inCart  = addedToCart === product.id;
              const inWish  = wishlist.has(product.id);
              const hovered = hoveredId === product.id;

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="bg-white rounded-2xl border border-slate-100 group-hover:border-amber-200 group-hover:shadow-xl group-hover:shadow-amber-100/50 transition-all duration-300 overflow-hidden">

                      {/* Image */}
                      <div className="relative aspect-square bg-slate-50 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                          {disc > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                              -{disc}%
                            </span>
                          )}
                          {product.bestseller && (
                            <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                              🔥 Hot
                            </span>
                          )}
                          {product.stock <= 10 && product.stock > 0 && (
                            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                              Low stock
                            </span>
                          )}
                        </div>

                        {/* Wishlist button */}
                        <button
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className={[
                            'absolute top-2.5 right-2.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm',
                            inWish
                              ? 'bg-red-500 text-white scale-110'
                              : 'bg-white/80 backdrop-blur-sm text-slate-500 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100',
                          ].join(' ')}
                        >
                          <Heart size={14} className={inWish ? 'fill-white' : ''} />
                        </button>

                        {/* Quick view on hover */}
                        <AnimatePresence>
                          {hovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 6 }}
                              className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center gap-1.5 py-2 text-white text-[10px] font-bold"
                            >
                              <Eye size={11} />
                              Quick View
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Info */}
                      <div className="p-3 sm:p-4">
                        <p className="text-[10px] sm:text-xs font-semibold text-amber-600 mb-1">{product.brandName}</p>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">({product.reviewCount.toLocaleString()})</span>
                        </div>

                        {/* Price + cart */}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <span className="text-sm sm:text-base font-black text-slate-900">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5 font-medium">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Add to cart */}
                          <button
                            onClick={(e) => handleAddToCart(product.id, e)}
                            className={[
                              'flex items-center gap-1.5 text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-300',
                              inCart
                                ? 'bg-green-600 text-white shadow-md shadow-green-200 scale-95'
                                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-200',
                            ].join(' ')}
                          >
                            {inCart ? (
                              <><CheckCircle2 size={12} /> Added</>
                            ) : (
                              <><ShoppingCart size={12} /> Add</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* View all CTA */}
        <div className="text-end mt-2 sm:mt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-amber-700 hover:bg-amber-600 hover:text-white font-black px-2 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}