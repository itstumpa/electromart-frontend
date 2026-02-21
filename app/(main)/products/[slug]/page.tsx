'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Heart, Star, ChevronRight,
  Shield, Truck, RotateCcw, Zap, Minus, Plus,
  CheckCircle2, ChevronDown,
} from 'lucide-react';
import Reveal from '../../Utilities/Reveal';
import ProductCard from '../../Utilities/Productcard';
import { getProductBySlug, mockProducts, mockReviews } from '@/data/mock-data';

interface Props { params: { slug: string } }

export default function ProductDetailPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'reviews'>('specs');
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const productReviews = mockReviews.filter(r => r.productId === product.id);
  const related = mockProducts.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link href={`/products?category=${product.categoryName.toLowerCase().replace(/[\s&]+/g, '-')}`} className="hover:text-amber-600 transition-colors">{product.categoryName}</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 font-medium truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Product hero ── */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">

          {/* Images */}
          <div className="flex flex-col gap-4">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="relative aspect-square bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
              {discount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  -{discount}% OFF
                </span>
              )}
              {product.bestseller && (
                <span className="absolute top-4 right-4 bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Bestseller
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    activeImage === i ? 'border-amber-600 shadow-md shadow-amber-200' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-2 bg-white" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{product.brandName}</span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{product.categoryName}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight" style={{ fontFamily: "'Georgia', serif" }}>
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-900">{product.rating}</span>
              <span className="text-sm text-slate-400">({product.reviewCount.toLocaleString()} reviews)</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-4xl font-black text-slate-900">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">${product.originalPrice.toLocaleString()}</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Save ${(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {product.description}
            </p>

            {/* Quantity + CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Qty */}
              <div className="flex items-center gap-0 bg-white border border-slate-200 rounded-xl overflow-hidden w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold text-slate-900">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-11 flex items-center justify-center text-slate-600 hover:bg-amber-50 hover:text-amber-700 transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.97 }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  addedToCart
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : 'bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-300'
                }`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                      <CheckCircle2 size={16} /> Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                      <ShoppingCart size={16} /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Wishlist */}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 ${
                  wishlisted ? 'bg-red-50 border-red-300 text-red-500' : 'border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400'
                }`}
              >
                <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-100">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over $99' },
                { icon: Shield, label: '2yr Warranty', sub: 'Genuine product' },
                { icon: RotateCcw, label: '30-Day Return', sub: 'No questions asked' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1 p-3 bg-amber-50 rounded-xl">
                  <Icon size={18} className="text-amber-700" />
                  <p className="text-xs font-bold text-slate-900">{label}</p>
                  <p className="text-[10px] text-slate-500">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Specs & Reviews tabs ── */}
        <Reveal className="mb-16">
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            {/* Tab bar */}
            <div className="flex border-b border-slate-100">
              {(['specs', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-4 text-sm font-bold capitalize transition-colors ${
                    activeTab === tab ? 'text-amber-600' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'reviews' ? `Reviews (${productReviews.length})` : 'Specifications'}
                  {activeTab === tab && (
                    <motion.span layoutId="tab-line" className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'specs' ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {product.specifications.map(spec => (
                    <div key={spec.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide w-28 shrink-0 pt-0.5">{spec.label}</span>
                      <span className="text-sm text-slate-800 font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : productReviews.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {productReviews.map(review => (
                    <div key={review.id} className="flex gap-4 pb-5 border-b border-slate-100 last:border-0 last:pb-0">
                      <img src={review.customerAvatar} alt={review.customerName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-bold text-slate-900">{review.customerName}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'} />
                            ))}
                          </div>
                          <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm text-center py-8">No reviews yet for this product.</p>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <Reveal>
            <h2 className="text-2xl font-black text-slate-900 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.07}>
                  <ProductCard product={p} index={i} />
                </Reveal>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}