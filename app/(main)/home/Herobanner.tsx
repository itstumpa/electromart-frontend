'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight, Truck, Zap, Gift,
  Tag, RotateCcw, Star
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getBannersByType } from '@/api/banner.api';
import type { BannerDto } from '@/api/banner.api';
import { getBannerIcon } from '@/lib/banner-icon-map';

// ─── All images: vivid, high-contrast, colorful Unsplash picks ─
const CELLS = [
  {
    id: 'hero',
    label: 'Featured Drop',
    title: 'Premium Electronics,\nAll in One Place',
    href: '/products',
    // Colorful neon flatlay with purple/pink/blue tones
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1400&q=95',
    gradientFrom: 'from-purple-950/85',
    gradientVia: 'via-purple-900/40',
    accentColor: 'text-purple-300',
    ctaBg: 'bg-white hover:bg-purple-50 text-purple-900',
    span: 'hero',
  },
  {
    id: 'v1',
    label: 'TechStore Pro',
    title: 'Smartphones',
    href: '/products?vendor=techstore-pro',
    // Vivid pink/coral iPhone on gradient
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=800&q=90',
    gradientFrom: 'from-rose-950/90',
    gradientVia: 'via-rose-800/30',
    badgeBg: 'bg-rose-500',
    offer: 'Flash Sale',
    offerIcon: Zap,
  },
  {
    id: 'v2',
    label: 'GadgetZone',
    title: 'Audio & Wearables',
    href: '/products?vendor=gadgetzone',
    // Bold lime-yellow headphones
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=90',
    gradientFrom: 'from-yellow-950/90',
    gradientVia: 'via-yellow-800/20',
    badgeBg: 'bg-yellow-500',
    offer: '40% OFF',
    offerIcon: Tag,
  },
  {
    id: 'v3',
    label: 'NovaTech',
    title: 'Gaming Gear',
    href: '/products?vendor=novatech',
    // Cyan/green RGB gaming setup
    image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=800&q=80',
    gradientFrom: 'from-cyan-950/90',
    gradientVia: 'via-cyan-800/20',
    badgeBg: 'bg-cyan-500',
    offer: 'Buy 1 Get 1',
    offerIcon: Gift,
  },
  {
    id: 'v4',
    label: 'PixelHub',
    title: 'Cameras & Drones',
    href: '/products?vendor=pixelhub',
    // Rich cobalt-blue mirrorless camera
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=90',
    gradientFrom: 'from-blue-950/90',
    gradientVia: 'via-blue-800/20',
    badgeBg: 'bg-blue-500',
    offer: 'Free Delivery',
    offerIcon: Truck,
  },
  {
    id: 'v5',
    label: 'PixelHub',
    title: 'Headphones & Speakers',
    href: '/products?vendor=pixelhub',
    // Rich cobalt-blue mirrorless camera
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    gradientFrom: 'from-rose-950/90',
    gradientVia: 'via-rose-800/30',
    badgeBg: 'bg-blue-500',
    offer: 'Free Delivery',
    offerIcon: Truck,
  },
  {
    id: 'v6',
    label: 'PixelHub',
    title: 'Cameras & Drones',
    href: '/products?vendor=pixelhub',
    // Rich cobalt-blue mirrorless camera
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=90',
    gradientFrom: 'from-blue-950/90',
    gradientVia: 'via-blue-800/20',
    badgeBg: 'bg-blue-500',
    offer: 'Free Delivery',
    offerIcon: Truck,
  },
];

const PILLS = [
  { icon: Truck,     label: 'Free Delivery',  sub: 'On orders $99+',   bg: 'bg-emerald-500', shadow: 'shadow-emerald-200' },
  { icon: Zap,       label: 'Flash Sale',      sub: 'Up to 40% OFF',    bg: 'bg-rose-500',    shadow: 'shadow-rose-200' },
  { icon: Gift,      label: 'Buy 1 Get 1',     sub: 'Selected items',   bg: 'bg-violet-600',  shadow: 'shadow-violet-200' },
  { icon: Tag,       label: 'Code ELECTRO20',  sub: '20% off sitewide', bg: 'bg-amber-600',   shadow: 'shadow-amber-200' },
  { icon: RotateCcw, label: 'Free Returns',    sub: '30 day guarantee', bg: 'bg-blue-600',    shadow: 'shadow-blue-200' },
  { icon: Star,      label: '4.8★ Rated',      sub: '50k+ reviews',     bg: 'bg-orange-500',  shadow: 'shadow-orange-200' },
];

// ─── Framer variants ─────────────────────────────────────────
const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const fadeSlide: Variants = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const bob = (i: number) => ({
  animate: {
    y: [0, -8, 0],
    rotate: [0, i % 2 === 0 ? 2 : -2, 0],
    transition: {
      duration: 3.2 + i * 0.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay: i * 0.35,
    },
  },
});

export default function HeroBentoGrid() {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: '-60px' });

  const [heroCells, setHeroCells] = useState<BannerDto[]>([]);
  const [gridCells, setGridCells] = useState<BannerDto[]>([]);
  const [pills, setPills] = useState<BannerDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchBanners = async () => {
      const [heroRes, gridRes, pillRes] = await Promise.allSettled([
        getBannersByType('HOME_HERO_MAIN'),
        getBannersByType('HOME_GRID_CELL'),
        getBannersByType('HOME_PILL'),
      ]);
      if (cancelled) return;
      if (heroRes.status === 'fulfilled' && heroRes.value.data.data.length > 0) {
        setHeroCells(heroRes.value.data.data);
      }
      if (gridRes.status === 'fulfilled' && gridRes.value.data.data.length > 0) {
        setGridCells(gridRes.value.data.data);
      }
      if (pillRes.status === 'fulfilled' && pillRes.value.data.data.length > 0) {
        setPills(pillRes.value.data.data);
      }
      setLoading(false);
    };
    fetchBanners();
    return () => { cancelled = true; };
  }, []);

  const displayHero = heroCells.length > 0 ? heroCells[0] : null;
  const displayGrid = gridCells.length > 0 ? gridCells : null;
  const displayPills = pills.length > 0 ? pills : null;

  return (
    <section ref={ref} className="bg-[#FFFBEB] lg:py-2 md:pb-6">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* ── Header ── */}
        <motion.div
          variants={fadeSlide}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex items-end justify-between mb-2 sm:mb-4 md:mb-6 flex-wrap gap-3"
        >
          
       
        </motion.div>

        {/* ── Bento grid ── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Skeleton hero cell */}
            <div className="col-span-2 lg:col-span-8 lg:row-span-4 rounded-2xl sm:rounded-3xl bg-slate-100 animate-pulse" style={{ minHeight: 340 }} />
            {/* Skeleton grid cells */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="hidden lg:flex col-span-2 rounded-2xl sm:rounded-3xl bg-slate-100 animate-pulse" style={{ minHeight: 170 }} />
            ))}
          </div>
        ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4"
        >

          {/* ████ HERO CELL — big, left, spans 4 cols + 2 rows ████ */}
          <motion.div
            variants={fadeUp}
            className="col-span-2 lg:col-span-8 lg:row-span-4 relative overflow-hidden rounded-2xl sm:rounded-3xl group"
            style={{ minHeight: 340 }}
          >
            <Image
              src={displayHero?.imageUrl ?? CELLS[0].image}
              alt="Premium electronics"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Deep colorful overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${displayHero?.heroGradientFrom ?? CELLS[0].gradientFrom} ${displayHero?.heroGradientVia ?? CELLS[0].gradientVia} to-transparent`} />
            {/* Extra colour wash from bottom */}
            <div className="absolute inset-0 bg-linear-to-tr from-purple-800/40 via-transparent to-pink-700/20" />

            {/* Floating badge 1 — top left */}
            <motion.div {...bob(0)} className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
              <div className="bg-rose-500 text-white flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl shadow-rose-500/40 backdrop-blur-sm border border-white/10">
                <Zap size={13} className="fill-white shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-black leading-tight">Flash Sale</p>
                  <p className="text-[8px] sm:text-[10px] opacity-80 leading-tight hidden sm:block">Up to 40% OFF</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge 2 — top right */}
            <motion.div {...bob(1)} className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
              <div className="bg-emerald-500 text-white flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl shadow-emerald-500/40 backdrop-blur-sm border border-white/10">
                <Truck size={13} className="shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-black leading-tight">Free Delivery</p>
                  <p className="text-[8px] sm:text-[10px] opacity-80 leading-tight hidden sm:block">Orders $99+</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge 3 — middle right (desktop only) */}
            <motion.div {...bob(2)} className="absolute top-4 right-4 sm:top-22 sm:right-6 z-10 hidden sm:block">
              <div className="bg-amber-500 text-white flex items-center gap-2 px-3 py-2 rounded-2xl shadow-xl shadow-amber-500/40 backdrop-blur-sm border border-white/10">
                <Gift size={13} className="shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs font-black leading-tight">Buy 1 Get 1</p>
                  <p className="text-[8px] sm:text-[10px] opacity-80 leading-tight hidden sm:block">Selected items</p>
                </div>
              </div>
            </motion.div>

            {/* Hero bottom text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-10"
            >
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 ${displayHero?.heroAccentColor ?? CELLS[0].accentColor}`}>
                Featured Collection
              </p>
              <h3 className="text-white text-xl sm:text-3xl font-black leading-tight mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                {(displayHero?.heroTitle ?? 'Premium Electronics,\nAll in One Place').split('\n').map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {i === 1 ? <span className={displayHero?.heroAccentColor ?? CELLS[0].accentColor}>{line}</span> : line}
                  </span>
                ))}
              </h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href={displayHero?.heroHref ?? '/products'} className={`inline-flex items-center gap-2 ${displayHero?.heroCtaBg ?? CELLS[0].ctaBg} text-sm font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors shadow-2xl`}>
                  {displayHero?.heroCtaText ?? 'Shop Now'} <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ████ 4 VENDOR SMALL CARDS ████ */}
          {(displayGrid ?? CELLS.slice(1)).map((item, i) => {
            const fallback = CELLS.slice(1)[i] ?? CELLS[1];
            const isApi = 'imageUrl' in item && typeof (item as BannerDto).id === 'string';
            const banner = isApi ? (item as BannerDto) : null;
            const imageUrl = banner?.imageUrl ?? fallback.image;
            const gradientFrom = banner?.gridGradientFrom ?? fallback.gradientFrom;
            const gradientVia = banner?.gridGradientVia ?? fallback.gradientVia;
            const badgeBg = banner?.gridBadgeBg ?? fallback.badgeBg;
            const label = banner?.gridLabel ?? fallback.label;
            const title = banner?.gridTitle ?? fallback.title;
            const href = banner?.gridHref ?? fallback.href;
            const offer = banner?.gridOffer ?? fallback.offer;
            const Icon: LucideIcon = banner?.gridOfferIcon ? getBannerIcon(banner.gridOfferIcon) : (fallback.offerIcon ?? Zap);
            return (
              <motion.div
                key={banner?.id ?? fallback.id}
                variants={fadeUp}
                className="hidden lg:flex col-span-2 relative overflow-hidden rounded-2xl sm:rounded-3xl group cursor-pointer"
                style={{ minHeight: 170 }}
              >
                <Image
                  src={imageUrl}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                />
                {/* Colorful gradient */}
                <div className={`absolute inset-0 bg-linear-to-t ${gradientFrom} ${gradientVia} to-transparent`} />

                {/* Floating offer badge */}
                <motion.div {...bob(i)} className="absolute top-2.5 right-2.5 z-10">
                  <div className={`${badgeBg} text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg text-[9px] sm:text-[10px] font-black border border-white/10`}>
                    <Icon size={10} className="shrink-0 sm:w-3 sm:h-3" />
                    <span className="whitespace-nowrap">{offer}</span>
                  </div>
                </motion.div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                  <p className="text-white/55 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-white text-xs sm:text-sm font-black leading-tight">{title}</p>
                </div>

                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                <Link href={href} className="absolute inset-0 z-20" aria-label={`Shop ${label}`} />
              </motion.div>
            );
          })}
        </motion.div>
        )}

        {/* ── Offer pills strip ── */}
        {loading ? (
          <div className="mt-4 flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="shrink-0 h-12 sm:h-14 w-32 sm:w-36 rounded-xl sm:rounded-2xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
        <div className="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
            {(displayPills ?? PILLS).map((item, i) => {
              const fallbackPill = PILLS[i] ?? PILLS[0];
              const isApi = 'imageUrl' in item && typeof (item as BannerDto).id === 'string';
              const banner = isApi ? (item as BannerDto) : null;
              const Icon: LucideIcon = banner?.pillIcon ? getBannerIcon(banner.pillIcon) : fallbackPill.icon;
              const label = banner?.pillLabel ?? fallbackPill.label;
              const sub = banner?.pillSub ?? fallbackPill.sub;
              const bg = banner?.pillBg ?? fallbackPill.bg;
              const shadow = banner?.pillShadow ?? fallbackPill.shadow;
              return (
                <motion.div
                  key={banner?.id ?? fallbackPill.label}
                  initial={{ opacity: 0, y: 18, scale: 0.88 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
                  className={`${bg} shrink-0 flex items-center gap-2 sm:gap-2.5 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md ${shadow}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-black whitespace-nowrap leading-tight">{label}</p>
                    <p className="text-[8px] sm:text-[10px] opacity-75 whitespace-nowrap leading-tight hidden sm:block">{sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        )}

      </div>
    </section>
  );
}