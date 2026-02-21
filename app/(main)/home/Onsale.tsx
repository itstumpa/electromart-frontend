'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Flame, Timer, ShoppingBag,
  Star, BadgePercent, Heart, Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Data ─────────────────────────────────────── */
const saleProducts = [
  {
    id: '1', name: 'iPhone 15 Pro Max', slug: 'iphone-15-pro-max',
    price: 149999, originalPrice: 179999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    rating: 4.9, reviews: 2341, sold: 847, stock: 1000,
    category: 'Smartphones', badge: 'HOT DEAL', featured: true,
  },
  {
    id: '2', name: 'MacBook Air M3', slug: 'macbook-air-m3',
    price: 124999, originalPrice: 149999,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    rating: 4.8, reviews: 1892, sold: 623, stock: 800,
    category: 'Laptops', badge: 'BEST SELLER', featured: false,
  },
  {
    id: '3', name: 'Sony WH-1000XM5', slug: 'sony-wh-1000xm5',
    price: 28999, originalPrice: 42999,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    rating: 4.7, reviews: 3456, sold: 912, stock: 1200,
    category: 'Audio', badge: '33% OFF', featured: false,
  },
  {
    id: '4', name: 'Samsung Galaxy S24 Ultra', slug: 'samsung-galaxy-s24-ultra',
    price: 129999, originalPrice: 159999,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    rating: 4.6, reviews: 1567, sold: 534, stock: 750,
    category: 'Smartphones', badge: 'FLASH DEAL', featured: false,
  },
  {
    id: '5', name: 'PS5 Slim Console', slug: 'ps5-slim-console',
    price: 49999, originalPrice: 64999,
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80',
    rating: 4.9, reviews: 4521, sold: 1890, stock: 2000,
    category: 'Gaming', badge: '23% OFF', featured: false,
  },
  {
    id: '6', name: 'Apple Watch Ultra 2', slug: 'apple-watch-ultra-2',
    price: 79999, originalPrice: 99999,
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&q=80',
    rating: 4.8, reviews: 987, sold: 342, stock: 500,
    category: 'Wearables', badge: '20% OFF', featured: false,
  },
];

/* ── Helpers ──────────────────────────────────── */
const getDiscount = (p: number, o: number) => Math.round(((o - p) / o) * 100);
const fmt = (p: number) => `৳${p.toLocaleString()}`;

/* ── Countdown ────────────────────────────────── */
function useCountdown(h: number) {
  const [time, setTime] = useState({ hours: h, minutes: 59, seconds: 59 });
  useEffect(() => {
    const id = setInterval(() => {
      setTime((p) => {
        if (p.seconds > 0) return { ...p, seconds: p.seconds - 1 };
        if (p.minutes > 0) return { ...p, minutes: p.minutes - 1, seconds: 59 };
        if (p.hours > 0) return { hours: p.hours - 1, minutes: 59, seconds: 59 };
        return p;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ── Variants ─────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};
const cardVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Countdown block ──────────────────────────── */
function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500/20 rounded-xl blur-md" />
        <AnimatePresence mode="wait">
          <motion.div
            key={value}
            initial={{ y: -5, opacity: 0, scale: 0.88 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 5, opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/60 rounded-xl flex items-center justify-center text-white font-black text-xl sm:text-2xl tabular-nums shadow-lg"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {String(value).padStart(2, '0')}
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
    </div>
  );
}

function Colon() {
  return (
    <div className="flex flex-col gap-1 mb-5">
      <motion.div
        animate={{ opacity: [1, 0.15, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="flex flex-col gap-1"
      >
        <div className="w-1 h-1 rounded-full bg-amber-500" />
        <div className="w-1 h-1 rounded-full bg-amber-500" />
      </motion.div>
    </div>
  );
}

/* ── Slim stock bar ───────────────────────────── */
function StockBar({ sold, stock }: { sold: number; stock: number }) {
  const pct = Math.min((sold / stock) * 100, 100);
  const hot = pct > 75;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-slate-500">{sold.toLocaleString()} sold</span>
        <span className={cn('font-semibold', hot ? 'text-red-400' : 'text-amber-400')}>
          {hot ? 'Almost gone!' : `${(stock - sold).toLocaleString()} left`}
        </span>
      </div>
      <div className="h-1 bg-slate-700/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('h-full rounded-full', hot
            ? 'bg-gradient-to-r from-red-500 to-orange-400'
            : 'bg-gradient-to-r from-amber-500 to-amber-400')}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════ */
export default function FlashSaleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const countdown = useCountdown(5);
  const [wished, setWished] = useState<Set<string>>(new Set());

  const toggleWish = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setWished((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const featured = saleProducts[0];
  const rest = saleProducts.slice(1);

  return (
    <section
      ref={sectionRef}
      className="relative py-18 overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-900"
    >
      {/* Ambient bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-amber-600/[0.06] blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-500/[0.04] blur-[80px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(217,119,6,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,0.4) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── HEADER ── */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12"
        >
          <motion.div variants={fadeUp} custom={0} className="space-y-3">
            <motion.span
              variants={fadeUp} custom={0}
              className="relative inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full"
            >
              <motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
                <Flame size={12} className="fill-amber-400" />
              </motion.span>
              Flash Sale — Limited Time
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
                <span className="relative block h-3 w-3 rounded-full bg-red-500" />
              </span>
            </motion.span>

            <motion.h2
              variants={fadeUp} custom={1}
              className="text-4xl sm:text-5xl font-extrabold text-white leading-[1.1] tracking-tight"
            >
              Deals That{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                  Won&apos;t Last
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.55, delay: 0.5 }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-orange-500 rounded-full origin-left"
                />
              </span>
            </motion.h2>

            <motion.p variants={fadeUp} custom={2} className="text-slate-400 text-sm max-w-sm">
              Massive discounts on top electronics. Once they&apos;re gone, they&apos;re gone.
            </motion.p>
          </motion.div>

          {/* Countdown */}
          <motion.div variants={fadeUp} custom={2} className="flex flex-col items-start lg:items-end gap-3">
            <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Timer size={13} className="text-amber-400" />
              Sale ends in
            </span>
            <div className="flex items-center gap-2.5">
              <Digit value={countdown.hours} label="HRS" />
              <Colon />
              <Digit value={countdown.minutes} label="MIN" />
              <Colon />
              <Digit value={countdown.seconds} label="SEC" />
            </div>
          </motion.div>
        </motion.div>

        {/* ── PRODUCT LAYOUT: featured left + 5 compact right ── */}
        <div className="grid lg:grid-cols-3 gap-3">

          {/* ── Featured card (spans 2 rows) ── */}
          <motion.div
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            variants={cardVariant} custom={2}
            className="lg:row-span-4"
          >
            <Link href={`/products/${featured.slug}`} className="group block h-full">
              <div className="relative h-full bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-400">
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/[0.03] transition-all duration-500 pointer-events-none" />

                {/* Top row: badge + wishlist */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md shadow-red-500/30">
                    <Flame size={10} className="fill-white" />
                    {featured.badge}
                  </span>
                  <button
                    onClick={(e) => toggleWish(e, featured.id)}
                    className={cn(
                      'w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200',
                      wished.has(featured.id)
                        ? 'bg-red-500/20 border-red-500/40 text-red-400'
                        : 'bg-white/10 border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30'
                    )}
                  >
                    <Heart size={13} className={wished.has(featured.id) ? 'fill-red-400' : ''} />
                  </button>
                </div>

                {/* Discount chip */}
                <div className="absolute top-[52px] left-4 z-10">
                  <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/10">
                    -{getDiscount(featured.price, featured.originalPrice)}% OFF
                  </span>
                </div>

                {/* Image */}
                <div className="relative flex items-center justify-center pt-20 pb-4 px-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-amber-500/[0.06] blur-3xl" />
                  </div>
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    className="relative w-40 h-40 sm:w-48 sm:h-48"
                  >
                    <Image
                      src={featured.image} alt={featured.name} fill
                      className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                      sizes="200px"
                    />
                  </motion.div>
                </div>

                {/* Text content */}
                <div className="px-5 pb-5 space-y-3">
                  <div>
                    <p className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider mb-1">
                      {featured.category}
                    </p>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-100 transition-colors">
                      {featured.name}
                    </h3>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={11}
                          className={i < Math.floor(featured.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">
                      {featured.rating} · {featured.reviews.toLocaleString()} reviews
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-2xl font-black text-white tabular-nums">
                      {fmt(featured.price)}
                    </span>
                    <span className="text-sm text-slate-500 line-through">{fmt(featured.originalPrice)}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">
                      Save {fmt(featured.originalPrice - featured.price)}
                    </span>
                  </div>

                  {/* Stock bar */}
                  <StockBar sold={featured.sold} stock={featured.stock} />

                  {/* CTA */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="group/btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm py-3 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 mt-1"
                  >
                    <ShoppingBag size={14} />
                    Grab This Deal
                    <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ── 5 compact horizontal cards ── */}
          {rest.map((p, i) => (
            <motion.div
              key={p.id}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              variants={cardVariant} custom={i + 3}
            >
              <Link href={`/products/${p.slug}`} className="group block">
                <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-amber-500/35 transition-all duration-300">
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/[0.025] transition-all duration-400 pointer-events-none" />

                  <div className="flex items-center gap-4 p-4">
                    {/* Image */}
                    <div className="relative w-[72px] h-[72px] shrink-0 rounded-xl bg-slate-700/40 overflow-hidden">
                      <Image
                        src={p.image} alt={p.name} fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                        sizes="72px"
                      />
                      <div className="absolute top-1 left-1">
                        <span className="bg-red-500/90 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-[2px] rounded-md leading-none">
                          -{getDiscount(p.price, p.originalPrice)}%
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <p className="text-[10px] text-amber-400/70 font-bold uppercase tracking-wider">{p.category}</p>
                      <h3 className="text-sm font-bold text-white leading-snug truncate group-hover:text-amber-100 transition-colors">
                        {p.name}
                      </h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} size={10}
                              className={idx < Math.floor(p.rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-700 text-slate-700'}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500">({p.reviews.toLocaleString()})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-white tabular-nums">{fmt(p.price)}</span>
                        <span className="text-xs text-slate-500 line-through">{fmt(p.originalPrice)}</span>
                      </div>

                      {/* Stock bar */}
                      <StockBar sold={p.sold} stock={p.stock} />
                    </div>

                    {/* Add-to-cart button — slides in on hover */}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="shrink-0 w-9 h-9 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/20 hover:border-amber-500 text-amber-400 hover:text-white flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
                    >
                      <ShoppingBag size={14} />
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── BOTTOM CTA BAR ── */}
        <motion.div
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp} custom={10}
          className="mt-8"
        >
          <div className="relative bg-amber-500/[0.06] border border-amber-500/20 rounded-2xl px-5 py-4 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/25 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <BadgePercent size={17} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">More deals waiting for you</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Package size={11} />500+ products on sale right now
                  </p>
                </div>
              </div>
              <Link
                href="/products?deal=true"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md shadow-amber-500/15 transition-all duration-300 shrink-0"
              >
                <Flame size={14} />
                View All Deals
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}