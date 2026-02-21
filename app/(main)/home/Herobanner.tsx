// components/features/hero/hero-banner.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Star,
  ChevronRight,
  Play,
  ShoppingBag,
  TrendingUp,
  Award,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* ── Slide data ──────────────────────────────── */
const heroSlides = [
  {
    id: 1,
    badge: 'NEW RELEASE',
    title: 'iPhone 15 Pro',
    highlight: 'Titanium',
    subtitle: 'Forged in titanium. Powered by A17 Pro chip. With a groundbreaking camera system.',
    price: '৳159,999',
    originalPrice: '৳179,999',
    discount: '11% OFF',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    bgGradient: 'from-amber-50 via-orange-50/50 to-yellow-50/30',
  },
  {
    id: 2,
    badge: 'BEST SELLER',
    title: 'MacBook Pro',
    highlight: 'M3 Max',
    subtitle: 'The most advanced Mac ever. Supercharged by M3 Max for unprecedented performance.',
    price: '৳299,999',
    originalPrice: '৳349,999',
    discount: '14% OFF',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    bgGradient: 'from-slate-50 via-amber-50/30 to-orange-50/20',
  },
  {
    id: 3,
    badge: 'TRENDING',
    title: 'Sony WH',
    highlight: '1000XM5',
    subtitle: 'Industry-leading noise canceling. Crystal clear sound. 30-hour battery life.',
    price: '৳34,999',
    originalPrice: '৳42,999',
    discount: '19% OFF',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    bgGradient: 'from-orange-50/60 via-amber-50 to-yellow-50/40',
  },
];

const trustBadges = [
  { icon: Truck, label: 'Free Shipping', desc: 'Orders ৳5,000+' },
  { icon: ShieldCheck, label: 'Genuine Products', desc: '100% Authentic' },
  { icon: RotateCcw, label: 'Easy Returns', desc: '30-Day Policy' },
  { icon: Award, label: 'Warranty', desc: 'Official Coverage' },
];

const floatingProducts = [
  {
    name: 'AirPods Pro',
    price: '৳29,999',
    rating: 4.8,
    reviews: 2340,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=120&q=80',
  },
  {
    name: 'Galaxy Watch 6',
    price: '৳42,999',
    rating: 4.7,
    reviews: 1205,
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=120&q=80',
  },
];

/* ── Animation variants ──────────────────────── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ── Counter hook ─────────────────────────────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ── Component ────────────────────────────────── */
export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const customers = useCountUp(50000, 2200);
  const products = useCountUp(12000, 2000);

  return (
    <section className="relative overflow-hidden bg-white">
      {/* ── Background ── */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-1000 bg-gradient-to-br',
          slide.bgGradient
        )}
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #92400e 0.8px, transparent 0.8px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-amber-200/25 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-orange-200/20 blur-[80px] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[92vh] py-16 lg:py-0">
          {/* ═══ LEFT COLUMN — 7 cols ═══ */}
          <div className="lg:col-span-7 flex flex-col gap-6 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                variants={stagger}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="flex flex-col gap-5"
              >
                {/* Badge row */}
                <motion.div
                  variants={fadeSlideUp}
                  className="flex items-center gap-3"
                >
                  <span className="inline-flex items-center gap-1.5 bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-lg shadow-primary/25">
                    <Zap size={12} className="fill-white" />
                    {slide.badge}
                  </span>
                  <span className="inline-flex items-center gap-1 bg-error-light text-error text-[11px] font-bold px-2.5 py-1 rounded-full">
                    {slide.discount}
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.div variants={fadeSlideUp}>
                  <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-foreground">
                    {slide.title}
                    <br />
                    <span className="relative inline-block text-primary">
                      {slide.highlight}
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="absolute -bottom-1.5 left-0 right-0 h-1.5 bg-accent/60 rounded-full origin-left"
                      />
                    </span>
                  </h1>
                </motion.div>

                {/* Description */}
                <motion.p
                  variants={fadeSlideUp}
                  className="text-base sm:text-lg text-foreground-secondary max-w-lg leading-relaxed"
                >
                  {slide.subtitle}
                </motion.p>

                {/* Price block */}
                <motion.div
                  variants={fadeSlideUp}
                  className="flex items-end gap-3"
                >
                  <span className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                    {slide.price}
                  </span>
                  <span className="text-lg text-foreground-muted line-through mb-0.5">
                    {slide.originalPrice}
                  </span>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  variants={fadeSlideUp}
                  className="flex flex-wrap items-center gap-3 pt-1"
                >
                  <Link href="/products">
                    <Button
                      size="xl"
                      className="rounded-2xl px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 group"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      Shop Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/products?deal=true">
                    <Button
                      variant="outline"
                      size="xl"
                      className="rounded-2xl px-8 border-2 border-amber-200 hover:border-primary hover:bg-accent-light transition-all duration-200"
                    >
                      <Zap className="h-4 w-4 text-primary" />
                      Today&apos;s Deals
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* ── Slide indicators ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-2 pt-2"
            >
              {heroSlides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-500 cursor-pointer',
                    active === i
                      ? 'w-10 bg-primary'
                      : 'w-4 bg-amber-300/60 hover:bg-amber-400/80'
                  )}
                />
              ))}
              <span className="ml-3 text-xs font-medium text-foreground-muted tabular-nums">
                {String(active + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
              </span>
            </motion.div>

            {/* ── Stats row ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex items-center gap-8 pt-4 border-t border-amber-200/50 mt-2"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground tabular-nums">
                    {customers.toLocaleString()}+
                  </p>
                  <p className="text-xs text-foreground-muted font-medium">
                    Happy Customers
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-amber-200/60" />

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent-light flex items-center justify-center">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground tabular-nums">
                    {products.toLocaleString()}+
                  </p>
                  <p className="text-xs text-foreground-muted font-medium">
                    Products
                  </p>
                </div>
              </div>

              <div className="h-10 w-px bg-amber-200/60 hidden sm:block" />

              <div className="hidden sm:flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-foreground-muted font-medium">
                    4.9/5 (2.4k reviews)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══ RIGHT COLUMN — 5 cols ═══ */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Background ring decoration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[85%] h-[85%] rounded-full border-2 border-dashed border-amber-200/60" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-[95%] h-[95%] rounded-full border border-amber-100/80" />
              </motion.div>

              {/* Glow behind product */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-300/30 rounded-full blur-[80px] pointer-events-none" />

              {/* Main product image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative z-10 flex items-center justify-center aspect-square"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 5,
                      ease: 'easeInOut',
                    }}
                    className="w-[75%] h-[75%] relative"
                  >
                    <Image
                      src={slide.image}
                      alt={`${slide.title} ${slide.highlight}`}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      sizes="(max-width: 768px) 80vw, 40vw"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* ── Floating card: Top-right — Rating ── */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute top-6 -right-2 sm:top-10 sm:-right-4 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/[0.06] p-3.5 border border-amber-100/80 min-w-[140px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black text-foreground">
                      4.9
                    </span>
                    <span className="text-xs text-foreground-muted font-medium">
                      / 5.0
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground-muted mt-0.5">
                    Based on 2,431 reviews
                  </p>
                </div>
              </motion.div>

              {/* ── Floating card: Bottom-left — Product ── */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-2 -left-3 sm:bottom-4 sm:-left-6 z-20"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-black/[0.06] p-3 border border-amber-100/80 flex items-center gap-3 min-w-[200px]">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                    <Image
                      src={floatingProducts[0].image}
                      alt={floatingProducts[0].name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-foreground">
                        {floatingProducts[0].rating}
                      </span>
                      <span className="text-[10px] text-foreground-muted">
                        ({floatingProducts[0].reviews.toLocaleString()})
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground truncate">
                      {floatingProducts[0].name}
                    </p>
                    <p className="text-sm font-black text-primary">
                      {floatingProducts[0].price}
                    </p>
                  </div>
                  <button className="h-9 w-9 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary flex items-center justify-center transition-all duration-200 shrink-0">
                    <ShoppingBag className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>

              {/* ── Floating card: Mid-right — Free shipping ── */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute top-1/2 -right-3 sm:-right-8 z-20 hidden sm:block"
              >
                <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg shadow-black/[0.04] px-3.5 py-2.5 border border-amber-100/80 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-success-light flex items-center justify-center">
                    <Truck className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-none">
                      Free Shipping
                    </p>
                    <p className="text-[10px] text-foreground-muted mt-0.5">
                      On this product
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* ── Floating: Wishlist button ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.5, type: 'spring' }}
                className="absolute top-4 left-4 z-20"
              >
                <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg shadow-black/[0.06] border border-amber-100/80 flex items-center justify-center text-foreground-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200 group">
                  <Heart className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust badges bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative border-t border-amber-100/80 bg-white/60 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustBadges.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 group"
              >
                <div className="h-11 w-11 rounded-xl bg-accent-light group-hover:bg-primary/10 flex items-center justify-center transition-colors duration-300 shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground leading-none">
                    {label}
                  </p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}