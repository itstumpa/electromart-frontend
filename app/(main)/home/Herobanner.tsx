'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import {
  ArrowRight, Truck, Zap, Gift,
  Tag, RotateCcw, Star
} from 'lucide-react';

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
    title: 'Cameras & Drones',
    href: '/products?vendor=pixelhub',
    // Rich cobalt-blue mirrorless camera
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=90',
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

  return (
    <section ref={ref} className="bg-[#FFFBEB] py-2 pb-6">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* ── Header ── */}
        <motion.div
          variants={fadeSlide}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="flex items-end justify-between mb-6 sm:mb-8 flex-wrap gap-3"
        >
          
       
        </motion.div>

        {/* ── Bento grid ── */}
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
              src={CELLS[0].image}
              alt="Premium electronics"
              fill
              priority
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
            {/* Deep colorful overlay */}
            <div className={`absolute inset-0 bg-linear-to-t ${CELLS[0].gradientFrom} ${CELLS[0].gradientVia} to-transparent`} />
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
              <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest mb-2 ${CELLS[0].accentColor}`}>
                Featured Collection
              </p>
              <h3 className="text-white text-xl sm:text-3xl font-black leading-tight mb-4" style={{ fontFamily: "'Georgia', serif" }}>
                Premium Electronics,
                <br />
                <span className={CELLS[0].accentColor}>All in One Place</span>
              </h3>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link href="/products" className={`inline-flex items-center gap-2 ${CELLS[0].ctaBg} text-sm font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-colors shadow-2xl`}>
                  Shop Now <ArrowRight size={15} />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ████ 4 VENDOR SMALL CARDS ████ */}
          {CELLS.slice(1).map((cell, i) => {
            const Icon = cell.offerIcon!;
            return (
              <motion.div
                key={cell.id}
                variants={fadeUp}
                className="col-span-2 relative overflow-hidden rounded-2xl sm:rounded-3xl group cursor-pointer"
                style={{ minHeight: 170 }}
              >
                <Image
                  src={cell.image}
                  alt={cell.label}
                  fill
                  className="object-cover transition-transform duration-600 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                />
                {/* Colorful gradient */}
                <div className={`absolute inset-0 bg-linear-to-t ${cell.gradientFrom} ${cell.gradientVia} to-transparent`} />

                {/* Floating offer badge */}
                <motion.div {...bob(i)} className="absolute top-2.5 right-2.5 z-10">
                  <div className={`${cell.badgeBg} text-white flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg text-[9px] sm:text-[10px] font-black border border-white/10`}>
                    <Icon size={10} className="shrink-0 sm:w-3 sm:h-3" />
                    <span className="whitespace-nowrap">{cell.offer}</span>
                  </div>
                </motion.div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10">
                  <p className="text-white/55 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider mb-0.5">{cell.label}</p>
                  <p className="text-white text-xs sm:text-sm font-black leading-tight">{cell.title}</p>
                </div>

                {/* Hover shimmer overlay */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />

                <Link href={cell.href} className="absolute inset-0 z-20" aria-label={`Shop ${cell.label}`} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Offer pills strip ── */}
        <div className="mt-4 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-none pb-1">
            {PILLS.map((pill, i) => {
              const Icon = pill.icon;
              return (
                <motion.div
                  key={pill.label}
                  initial={{ opacity: 0, y: 18, scale: 0.88 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.45, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] as const }}
                  className={`${pill.bg} shrink-0 flex items-center gap-2 sm:gap-2.5 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md ${pill.shadow}`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs font-black whitespace-nowrap leading-tight">{pill.label}</p>
                    <p className="text-[8px] sm:text-[10px] opacity-75 whitespace-nowrap leading-tight hidden sm:block">{pill.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}