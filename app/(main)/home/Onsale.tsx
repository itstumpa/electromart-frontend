// components/features/flash-sale/flash-sale-section.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Flame,
  Clock,
  Zap,
  ShoppingBag,
  Star,
  TrendingDown,
  BadgePercent,
  Heart,
  Eye,
  ChevronRight,
  Timer,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/* ── Sale products data ───────────────────────── */
const saleProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    price: 149999,
    originalPrice: 179999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    rating: 4.9,
    reviews: 2341,
    sold: 847,
    stock: 1000,
    category: 'Smartphones',
    badge: 'HOT DEAL',
    featured: true,
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    slug: 'macbook-air-m3',
    price: 124999,
    originalPrice: 149999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    rating: 4.8,
    reviews: 1892,
    sold: 623,
    stock: 800,
    category: 'Laptops',
    badge: 'BEST SELLER',
    featured: false,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    price: 28999,
    originalPrice: 42999,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    rating: 4.7,
    reviews: 3456,
    sold: 912,
    stock: 1200,
    category: 'Audio',
    badge: '33% OFF',
    featured: false,
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    price: 129999,
    originalPrice: 159999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    rating: 4.6,
    reviews: 1567,
    sold: 534,
    stock: 750,
    category: 'Smartphones',
    badge: 'FLASH DEAL',
    featured: false,
  },
  {
    id: '5',
    name: 'PS5 Slim Console',
    slug: 'ps5-slim-console',
    price: 49999,
    originalPrice: 64999,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
    rating: 4.9,
    reviews: 4521,
    sold: 1890,
    stock: 2000,
    category: 'Gaming',
    badge: '23% OFF',
    featured: false,
  },
  {
    id: '6',
    name: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    price: 79999,
    originalPrice: 99999,
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&q=80',
    rating: 4.8,
    reviews: 987,
    sold: 342,
    stock: 500,
    category: 'Wearables',
    badge: '20% OFF',
    featured: false,
  },
];

/* ── Helpers ──────────────────────────────────── */
function getDiscount(price: number, original: number) {
  return Math.round(((original - price) / original) * 100);
}

function formatPrice(price: number) {
  return `৳${price.toLocaleString()}`;
}

/* ── Countdown hook ───────────────────────────── */
function useCountdown(targetHours: number) {
  const [time, setTime] = useState({
    hours: targetHours,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev.seconds > 0)
          return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0)
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0)
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

/* ── Animations ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const scaleCard = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Countdown digit block ────────────────────── */
function CountdownBlock({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        {/* Glow behind */}
        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-md" />
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ y: -8, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/50 text-white font-black text-2xl sm:text-3xl w-14 sm:w-16 h-14 sm:h-16 rounded-2xl flex items-center justify-center tabular-nums shadow-lg"
          >
            {/* Shine line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {String(value).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

/* ── Countdown separator ──────────────────────── */
function CountdownSeparator() {
  return (
    <div className="flex flex-col items-center gap-1.5 mb-5">
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="flex flex-col gap-1.5"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
      </motion.div>
    </div>
  );
}

/* ── Stock progress bar ───────────────────────── */
function StockBar({ sold, stock }: { sold: number; stock: number }) {
  const percentage = Math.min((sold / stock) * 100, 100);
  const isAlmostGone = percentage > 75;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400 font-medium">
          <span className="text-white font-bold">{sold}</span> sold
        </span>
        <span
          className={cn(
            'font-semibold',
            isAlmostGone ? 'text-red-400' : 'text-amber-400'
          )}
        >
          {isAlmostGone ? 'Almost Gone!' : `${stock - sold} left`}
        </span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'h-full rounded-full',
            isAlmostGone
              ? 'bg-gradient-to-r from-red-500 to-orange-500'
              : 'bg-gradient-to-r from-amber-500 to-amber-400'
          )}
        />
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────── */
export default function FlashSaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const countdown = useCountdown(5);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const featuredProduct = saleProducts[0];
  const gridProducts = saleProducts.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-900"
    >
      {/* ── Background effects ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Amber glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/[0.07] blur-[100px] rounded-full" />
        {/* Side glows */}
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-amber-500/[0.04] blur-[80px] rounded-full" />
        <div className="absolute bottom-20 -right-32 w-64 h-64 bg-orange-500/[0.04] blur-[80px] rounded-full" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(217,119,6,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,119,6,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══ HEADER ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14"
        >
          {/* Left — Title */}
          <motion.div variants={fadeUp} custom={0} className="space-y-4">
            <motion.div
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2"
            >
              <span className="relative inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Flame size={13} className="fill-amber-400" />
                </motion.span>
                Flash Sale — Limited Time
                {/* Pulse ring */}
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3">
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                  <span className="relative block h-3 w-3 rounded-full bg-red-500" />
                </span>
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Deals That{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                  Won&apos;t Last
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full origin-left"
                />
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-slate-400 text-base sm:text-lg max-w-md"
            >
              Massive discounts on top electronics. Once they&apos;re gone,
              they&apos;re gone. Don&apos;t miss out.
            </motion.p>
          </motion.div>

          {/* Right — Countdown */}
          <motion.div
            variants={fadeUp}
            custom={2}
            className="flex flex-col items-start lg:items-end gap-4"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
              <Timer size={15} className="text-amber-400" />
              Sale ends in
            </div>
            <div className="flex items-center gap-3">
              <CountdownBlock value={countdown.hours} label="Hours" />
              <CountdownSeparator />
              <CountdownBlock value={countdown.minutes} label="Minutes" />
              <CountdownSeparator />
              <CountdownBlock value={countdown.seconds} label="Seconds" />
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ FEATURED DEAL + GRID ═══ */}
        <div className="grid lg:grid-cols-12 gap-5">
          {/* ── Featured product — large card ── */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={scaleCard}
            custom={2}
            className="lg:col-span-5 lg:row-span-2"
          >
            <div className="group relative h-full bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-500">
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/[0.06] group-hover:to-orange-500/[0.04] transition-all duration-700 pointer-events-none" />

              {/* Top badges */}
              <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-red-500/30">
                  <Flame size={11} className="fill-white" />
                  {featuredProduct.badge}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                  -{getDiscount(featuredProduct.price, featuredProduct.originalPrice)}%
                </span>
              </div>

              {/* Wishlist */}
              <button className="absolute top-5 right-5 z-10 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-red-400 hover:bg-white/20 transition-all duration-200">
                <Heart className="h-4.5 w-4.5" />
              </button>

              {/* Image area */}
              <div className="relative pt-16 pb-6 px-8 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-amber-500/[0.06] blur-[60px]" />
                </div>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                  className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72"
                >
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    fill
                    className="object-contain drop-shadow-[0_20px_40px_rgba(217,119,6,0.15)] group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 60vw, 30vw"
                  />
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative px-6 pb-6 space-y-4">
                {/* Category */}
                <span className="text-xs text-amber-400/80 font-semibold uppercase tracking-wider">
                  {featuredProduct.category}
                </span>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight group-hover:text-amber-100 transition-colors">
                  {featuredProduct.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={cn(
                          i < Math.floor(featuredProduct.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-600 text-slate-600'
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-white">
                    {featuredProduct.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({featuredProduct.reviews.toLocaleString()} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {formatPrice(featuredProduct.price)}
                  </span>
                  <span className="text-lg text-slate-500 line-through mb-0.5">
                    {formatPrice(featuredProduct.originalPrice)}
                  </span>
                  <span className="text-sm font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md mb-1">
                    Save {formatPrice(featuredProduct.originalPrice - featuredProduct.price)}
                  </span>
                </div>

                {/* Stock bar */}
                <StockBar
                  sold={featuredProduct.sold}
                  stock={featuredProduct.stock}
                />

                {/* CTA */}
                <Link href={`/products/${featuredProduct.slug}`}>
                  <Button
                    size="lg"
                    className="w-full rounded-2xl mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 group/btn"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    Grab This Deal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ── Product grid — smaller cards ── */}
          {gridProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={scaleCard}
              custom={i + 3}
              className="lg:col-span-7/3"
              style={{
                gridColumn:
                  i < 3
                    ? `${6 + ((i % 3) * 7) / 3}`
                    : `${6 + (((i - 3) % 3) * 7) / 3}`,
              }}
            >
              <div
                className="group relative bg-gradient-to-br from-slate-800/80 to-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/30 transition-all duration-400 h-full"
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/[0.05] group-hover:to-orange-500/[0.03] transition-all duration-500 pointer-events-none" />

                <div className="relative p-4 sm:p-5">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-700/30 overflow-hidden shrink-0 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        sizes="112px"
                      />
                      {/* Discount badge */}
                      <div className="absolute top-1.5 left-1.5">
                        <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          -{getDiscount(product.price, product.originalPrice)}%
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div className="space-y-1.5">
                        {/* Category */}
                        <span className="text-[10px] text-amber-400/70 font-semibold uppercase tracking-wider">
                          {product.category}
                        </span>

                        {/* Name */}
                        <h3 className="text-sm sm:text-base font-bold text-white leading-snug truncate group-hover:text-amber-100 transition-colors">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                size={11}
                                className={cn(
                                  idx < Math.floor(product.rating)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-600 text-slate-600'
                                )}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ({product.reviews.toLocaleString()})
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg sm:text-xl font-black text-white tabular-nums">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      </div>
                    </div>

                    {/* Quick actions — visible on hover */}
                    <div className="hidden sm:flex flex-col gap-2 justify-center">
                      <motion.button
                        initial={false}
                        animate={{
                          opacity: hoveredId === product.id ? 1 : 0,
                          x: hoveredId === product.id ? 0 : 8,
                        }}
                        transition={{ duration: 0.2 }}
                        className="h-9 w-9 rounded-xl bg-primary/20 hover:bg-primary text-amber-400 hover:text-white flex items-center justify-center transition-colors duration-200"
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        initial={false}
                        animate={{
                          opacity: hoveredId === product.id ? 1 : 0,
                          x: hoveredId === product.id ? 0 : 8,
                        }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                        className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-colors duration-200"
                      >
                        <Heart className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Stock bar */}
                  <div className="mt-3.5">
                    <StockBar sold={product.sold} stock={product.stock} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══ BOTTOM CTA BAR ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={10}
          className="mt-12"
        >
          <div className="relative bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/20 rounded-2xl px-6 sm:px-8 py-6 overflow-hidden">
            {/* Background shine */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/30 to-transparent" />

            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <BadgePercent className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-base sm:text-lg font-bold text-white">
                    More deals waiting for you
                  </p>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Package className="h-3.5 w-3.5" />
                    Over 500+ products on sale right now
                  </p>
                </div>
              </div>

              <Link href="/products?deal=true">
                <Button
                  size="lg"
                  className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 group shrink-0 px-8"
                >
                  <Flame className="h-4 w-4" />
                  View All Deals
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}