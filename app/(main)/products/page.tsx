'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
// import { motion } from 'framer-motion';
import {
  SlidersHorizontal, X, ChevronDown, Search,
  Grid3X3, LayoutList,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockProducts, mockCategories, mockBrands,
} from '@/data/mock-data';

import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';
import Image from 'next/image';

// import { useState, useEffect } from 'react';
import { motion, AnimatePresence, } from 'framer-motion';
// import Link from 'next/link';
// import Image from 'next/image';
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
    subtitle: 'Forged in titanium. Powered by A17 Pro chip. With a groundbreaking camera system. Best products in the country, grab now.',
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
    subtitle: 'The most advanced Mac ever. Supercharged by M3 Max for unprecedented performance. Best products in the country, grab now.',
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
    subtitle: 'Industry-leading noise canceling. Crystal clear sound. 30-hour battery life. Best products in the country, grab now.',
    price: '৳34,999',
    originalPrice: '৳42,999',
    discount: '19% OFF',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
    bgGradient: 'from-orange-50/60 via-amber-50 to-yellow-50/40',
  },
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

const sortOptions = [
  { label: 'Newest',        value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Top Rated',     value: 'rating' },
  { label: 'Most Reviews',  value: 'reviews' },
];


  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') ?? '';

  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState(urlCategory);
  const [brand,       setBrand]       = useState('');
  const [minPrice,    setMinPrice]    = useState(0);
  const [maxPrice,    setMaxPrice]    = useState(4000);
  const [minRating,   setMinRating]   = useState(0);
  const [sort,        setSort]        = useState('newest');
  const [view,        setView]        = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brandName.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter(p => p.categoryId === mockCategories.find(c => c.slug === category)?.id || p.categoryName.toLowerCase().replace(/[\s&]+/g, '-') === category);
    if (brand)    list = list.filter(p => p.brandId === brand);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    list = list.filter(p => p.rating >= minRating);
    switch (sort) {
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'reviews':    list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default:           list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [search, category, brand, minPrice, maxPrice, minRating, sort]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setBrand('');
    setMinPrice(0); setMaxPrice(4000); setMinRating(0);
  };
  const hasFilters = search || category || brand || minPrice > 0 || maxPrice < 4000 || minRating > 0;

  /* ── Active category label ── */
  const activeCatLabel = category
    ? mockCategories.find(c => c.slug === category)?.name ?? 'All Products'
    : 'All Products';

  return (
    <>

    <section className="relative overflow-hidden bg-white">
      {/* ── Background ── */}
      <div

        className={cn(
          'absolute inset-0 transition-all duration-1000 bg-linear-to-br',
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
      <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full bg-amber-200/25 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-100 h-100 rounded-full bg-orange-200/20 blur-[80px] pointer-events-none" />

      {/* ── Content ── */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center min-h-[78vh] py-12 md:py-0">
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
                    {slide.title}{" "}                  
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
                  className="text-base sm:text-lg text-foreground-secondary max-w-3xl leading-relaxed"
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
                  <span className="text-2xl sm:text-2xl text-foreground-muted line-through mb-0.5">
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
                      className="rounded-2xl px-4 md:px-8 py-2 md:py-4 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 group"
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
                      className="rounded-2xl px-4 md:px-8 py-2 md:py-4 border-2 border-amber-200 hover:border-primary hover:bg-accent-light transition-all duration-200"
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
                  <p className="text-3xl font-black text-foreground tabular-nums">
                    {customers.toLocaleString()}+
                  </p>
                  <p className="text-lg text-foreground-muted font-medium">
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
                  <p className="text-3xl font-black text-foreground tabular-nums">
                    {products.toLocaleString()}+
                  </p>
                  <p className="text-lg text-foreground-muted font-medium">
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
                        className="h-5 w-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-md text-foreground-muted font-medium">
                    4.9/5 (2.4k reviews)
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ═══ RIGHT COLUMN — 5 cols ═══ */}
<div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
  <div className="relative w-full max-w-md lg:max-w-lg aspect-square">

    {/* Outer decorative ring — solid subtle */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      animate={{ opacity: 0.5, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-[98%] h-[98%] rounded-full border border-amber-200/40" />
    </motion.div>

    {/* Middle decorative ring — dashed rotating */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        className="w-[90%] h-[90%] rounded-full border-2 border-dashed border-amber-300/40"
      />
    </motion.div>

    {/* Glow behind circle */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-amber-300/25 rounded-full blur-[80px] pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-orange-300/15 rounded-full blur-[50px] pointer-events-none" />

    {/* ── THE CIRCLE CONTAINER — this clips the image ── */}
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full h-full rounded-full overflow-hidden "
        >
          {/* Subtle inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-100/40 via-transparent to-white/30 pointer-events-none z-10" />

          {/* Floating image inside circle */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center p-6"
          >
            <div className="relative w-90 h-90 rounded-full overflow-hidden">
              <Image
                src={slide.image}
                alt={`${slide.title} ${slide.highlight}`}
                fill
                className="object-cover drop-shadow-xl"
                priority
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>

    {/* ── Floating card: Top-right — Rating ── */}
    <motion.div
      initial={{ opacity: 0, x: 30, y: -10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="absolute top-4 -right-2 sm:top-6 sm:-right-4 z-20"
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
          <span className="text-lg font-black text-foreground">4.9</span>
          <span className="text-xs text-foreground-muted font-medium">/ 5.0</span>
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
      className="absolute -bottom-2 -left-3 sm:bottom-6 sm:-left-6 z-20"
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
      className="absolute top-[55%] -right-3 sm:-right-8 z-20 hidden sm:block"
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
      className="absolute top-4 left-6 z-20"
    >
      <button className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg shadow-black/[0.06] border border-amber-100/80 flex items-center justify-center text-foreground-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200 group">
        <Heart className="h-4.5 w-4.5 group-hover:scale-110 transition-transform" />
      </button>
    </motion.div>
  </div>
</div>
</div>
</div>
     
    </section>
    
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Reveal>
            <h1
              className="text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {activeCatLabel}
            </h1>
          
          </Reveal>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">{activeCatLabel}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ══ FILTER SIDEBAR (desktop) ══ */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Search */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search</p>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                  >
                    All Categories
                  </button>
                  {mockCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${category === cat.slug ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                    >
                      {cat.name}
                      <span className={`text-xs ${category === cat.slug ? 'text-amber-200' : 'text-slate-400'}`}>
                        {mockProducts.filter(p => p.categoryId === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setBrand('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!brand ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}>
                    All Brands
                  </button>
                  {mockBrands.map(b => (
                    <button key={b.id} onClick={() => setBrand(b.id)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${brand === b.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price Range</p>
                <div className="px-1 space-y-3">
                  <input type="range" min={0} max={4000} step={50} value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>$0</span>
                    <span className="text-amber-700 font-bold">up to ${maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Rating</p>
                <div className="flex flex-col gap-1">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${minRating === r ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                    >
                      {r === 0 ? 'Any Rating' : (
                        <span className="flex items-center gap-1">
                          <Star size={12} className="fill-current" />
                          {r}+ stars
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-amber-400 transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-600" />}
              </button>

              <p className="text-sm text-slate-500 hidden lg:block">
                <span className="font-bold text-slate-900">{filtered.length}</span> results
              </p>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')}
                    className={`p-2 transition-colors ${view === 'grid' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  ><Grid3X3 size={16} /></button>
                  <button onClick={() => setView('list')}
                    className={`p-2 transition-colors ${view === 'list' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  ><LayoutList size={16} /></button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {mockCategories.find(c => c.slug === category)?.name}
                    <button onClick={() => setCategory('')}><X size={11} /></button>
                  </span>
                )}
                {brand && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {mockBrands.find(b => b.id === brand)?.name}
                    <button onClick={() => setBrand('')}><X size={11} /></button>
                  </span>
                )}
                {maxPrice < 4000 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Under ${maxPrice}
                    <button onClick={() => setMaxPrice(4000)}><X size={11} /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {minRating}+ stars
                    <button onClick={() => setMinRating(0)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product grid / list */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <Search size={24} className="text-amber-600" />
                </div>
                <p className="text-lg font-bold text-slate-900 mb-1">No products found</p>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={view === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-5'
                  : 'flex flex-col gap-4'}
              >
                {filtered.map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.04} direction="up">
                    {view === 'grid' ? (
                      <ProductCard product={product} index={i} />
                    ) : (
                      /* List view card */
                      <Link href={`/products/${product.slug}`} className="group block">
                        <div className="flex gap-5 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 p-4 transition-all duration-300">
                          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                            <Image src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {product.originalPrice && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                              <p className="text-xs text-amber-600 font-semibold mb-1">{product.brandName} · {product.categoryName}</p>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2">{product.name}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-slate-900">${product.price.toLocaleString()}</span>
                                {product.originalPrice && <span className="text-sm text-slate-400 line-through">${product.originalPrice.toLocaleString()}</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-xs text-slate-400">({product.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </Reveal>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filters as desktop sidebar */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setCategory('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>All Categories</button>
                  {mockCategories.map(cat => (
                    <button key={cat.id} onClick={() => setCategory(cat.slug)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat.slug ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Brand</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setBrand('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${!brand ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>All Brands</button>
                  {mockBrands.map(b => (
                    <button key={b.id} onClick={() => setBrand(b.id)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${brand === b.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>{b.name}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { clearFilters(); setFiltersOpen(false); }}
                className="w-full py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors"
              >Apply & Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </>
  );
}