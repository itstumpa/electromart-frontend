// components/features/testimonials/testimonials-section.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
  ShoppingBag,
  TrendingUp,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* ── Data ─────────────────────────────────────── */
const testimonials = [
  {
    id: 1,
    name: 'James Harrington',
    role: 'Software Engineer',
    location: 'Dhaka, BD',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    product: 'MacBook Pro M3',
    productImage:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=120&q=80',
    comment:
      'Ordered on a Tuesday, arrived Thursday. The MacBook Pro was exactly as described — factory sealed, genuine Apple warranty. ElectroMart is now my go-to for all tech purchases.',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 2,
    name: 'Sophia Nakamura',
    role: 'Photographer',
    location: 'Chittagong, BD',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    product: 'Sony Alpha A7R V',
    productImage:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&q=80',
    comment:
      'I was nervous spending ৳350,000 online but the customer service team was incredible. They walked me through the purchase, confirmed authenticity, and even helped with setup.',
    verified: true,
    date: '1 month ago',
  },
  {
    id: 3,
    name: 'Marcus Webb',
    role: 'Music Producer',
    location: 'Sylhet, BD',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    product: 'Sony WH-1000XM5',
    productImage:
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=120&q=80',
    comment:
      "The noise-canceling is life-changing in a studio environment. ElectroMart had the best price I could find, shipping was fast, and the product came perfectly packaged.",
    verified: true,
    date: '3 weeks ago',
  },
  {
    id: 4,
    name: 'Priya Mehta',
    role: 'Student',
    location: 'Rajshahi, BD',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    rating: 5,
    product: 'Samsung Galaxy S24 Ultra',
    productImage:
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&q=80',
    comment:
      'First time buying a phone online and I was a bit worried. But the process was smooth from cart to door. The phone is incredible and ELECTRO20 saved me a lot!',
    verified: true,
    date: '5 days ago',
  },
  {
    id: 5,
    name: 'Daniel Torres',
    role: 'Game Developer',
    location: 'Dhaka, BD',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    product: 'PlayStation 5 Slim',
    productImage:
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=120&q=80',
    comment:
      'Got the PS5 Slim within 2 days, controllers included. ElectroMart stock is always up to date unlike other stores. The unboxing condition was pristine.',
    verified: true,
    date: '1 week ago',
  },
  {
    id: 6,
    name: 'Aisha Okafor',
    role: 'UX Designer',
    location: 'Khulna, BD',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    rating: 4,
    product: 'Apple Watch Ultra 2',
    productImage:
      'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=120&q=80',
    comment:
      'Great service overall. The watch came with full Apple warranty. The product and price made it all worth it. Would definitely recommend to friends and family.',
    verified: true,
    date: '2 months ago',
  },
];

const stats = [
  {
    icon: Users,
    value: '50,000+',
    label: 'Happy Customers',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Star,
    value: '4.9/5',
    label: 'Average Rating',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Clock,
    value: '99.2%',
    label: 'On-time Delivery',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: TrendingUp,
    value: '98.7%',
    label: 'Satisfaction Rate',
    color: 'bg-blue-50 text-blue-600',
  },
];

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
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Star renderer ────────────────────────────── */
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200'
          )}
        />
      ))}
    </div>
  );
}

/* ── Component ────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  /* Featured testimonial index (first 3 rotate) */
  const [featured, setFeatured] = useState(0);
  const featuredTestimonial = testimonials[featured];

  /* Auto-rotate featured */
  useEffect(() => {
    const timer = setInterval(() => {
      setFeatured((p) => (p + 1) % 3);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const goFeatured = useCallback(
    (dir: 'prev' | 'next') => {
      setFeatured((p) => {
        if (dir === 'next') return (p + 1) % 3;
        return p === 0 ? 2 : p - 1;
      });
    },
    []
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-gradient-to-b from-white via-amber-50/20 to-white overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-amber-100/20 blur-[120px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #92400e 0.8px, transparent 0.8px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══ HEADER ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-2 bg-accent-light text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
          >
            <BadgeCheck size={14} />
            Verified Reviews
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight tracking-tight"
          >
            Loved by{' '}
            <span className="relative inline-block">
              <span className="text-primary">Thousands</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -bottom-1 left-0 right-0 h-1 bg-accent/50 rounded-full origin-left"
              />
            </span>{' '}
            of Customers
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-foreground-secondary mt-4 text-lg max-w-xl mx-auto"
          >
            Real stories from real people. Every review is from a verified
            purchase — no filters, no edits.
          </motion.p>
        </motion.div>

        {/* ═══ STATS STRIP ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i + 1}
              className="relative bg-white rounded-2xl border border-border/80 p-5 text-center group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.04] transition-all duration-300"
            >
              <div
                className={cn(
                  'inline-flex h-11 w-11 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110 duration-300',
                  stat.color
                )}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-foreground-muted font-medium mt-1">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* ═══ FEATURED REVIEW — Large Card ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={3}
          className="mb-14"
        >
          <div className="relative bg-gradient-to-br from-amber-50/80 via-white to-orange-50/40 rounded-3xl border border-amber-100/80 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-200/15 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-200/10 rounded-full blur-[60px] pointer-events-none" />
            <Quote
              size={200}
              className="absolute -top-6 -left-6 text-amber-100/40 pointer-events-none rotate-180"
            />

            <div className="relative grid lg:grid-cols-5 gap-0">
              {/* Left — Content */}
              <div className="lg:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredTestimonial.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    {/* Stars + Verified */}
                    <div className="flex items-center gap-3">
                      <StarRating rating={featuredTestimonial.rating} size={18} />
                      {featuredTestimonial.verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success bg-success-light px-2.5 py-1 rounded-full">
                          <BadgeCheck size={12} />
                          Verified Purchase
                        </span>
                      )}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg sm:text-xl lg:text-2xl text-foreground font-medium leading-relaxed">
                      &ldquo;{featuredTestimonial.comment}&rdquo;
                    </blockquote>

                    {/* Product tag */}
                    <div className="inline-flex items-center gap-2.5 bg-white rounded-xl border border-amber-100 px-4 py-2.5 shadow-sm">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-amber-50 shrink-0">
                        <Image
                          src={featuredTestimonial.productImage}
                          alt={featuredTestimonial.product}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div>
                        <p className="text-[11px] text-foreground-muted font-medium uppercase tracking-wide">
                          Purchased
                        </p>
                        <p className="text-sm font-bold text-foreground leading-none">
                          {featuredTestimonial.product}
                        </p>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t border-amber-100/80">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-200/60 ring-offset-2">
                          <Image
                            src={featuredTestimonial.avatar}
                            alt={featuredTestimonial.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="text-base font-bold text-foreground flex items-center gap-1.5">
                            {featuredTestimonial.name}
                            <BadgeCheck
                              size={15}
                              className="text-primary fill-primary/20"
                            />
                          </p>
                          <p className="text-sm text-foreground-muted">
                            {featuredTestimonial.role} •{' '}
                            {featuredTestimonial.location}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-foreground-muted hidden sm:block">
                        {featuredTestimonial.date}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center gap-3 mt-8">
                  <button
                    onClick={() => goFeatured('prev')}
                    className="h-10 w-10 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 hover:border-primary/40 flex items-center justify-center text-foreground-secondary hover:text-primary transition-all duration-200 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => goFeatured('next')}
                    className="h-10 w-10 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 hover:border-primary/40 flex items-center justify-center text-foreground-secondary hover:text-primary transition-all duration-200 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="flex items-center gap-1.5 ml-2">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setFeatured(i)}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-500 cursor-pointer',
                          featured === i
                            ? 'w-8 bg-primary'
                            : 'w-3 bg-amber-300/50 hover:bg-amber-400/70'
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — Large avatar / visual */}
              <div className="lg:col-span-2 hidden lg:flex items-center justify-center p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredTestimonial.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative"
                  >
                    {/* Decorative ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-200/50 scale-110" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/20 blur-2xl scale-125" />

                    <div className="relative w-56 h-56 xl:w-64 xl:h-64 rounded-full overflow-hidden ring-4 ring-white shadow-2xl shadow-amber-900/10">
                      <Image
                        src={featuredTestimonial.avatar}
                        alt={featuredTestimonial.name}
                        fill
                        className="object-cover"
                        sizes="256px"
                      />
                    </div>

                    {/* Floating rating badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-amber-100 px-4 py-2 flex items-center gap-2"
                    >
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-black text-foreground">
                        {featuredTestimonial.rating}.0
                      </span>
                      <span className="text-xs text-foreground-muted">
                        rating
                      </span>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ REVIEW GRID — Remaining cards ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.slice(3).map((t, i) => (
            <motion.div
              key={t.id}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={scaleCard}
              custom={i + 5}
            >
              <div className="group relative bg-white rounded-2xl border border-border/80 p-6 flex flex-col gap-4 h-full hover:border-primary/30 hover:shadow-xl hover:shadow-primary/[0.04] transition-all duration-300">
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-50/0 via-amber-50/0 to-amber-50/0 group-hover:from-amber-50/50 group-hover:via-transparent group-hover:to-orange-50/30 transition-all duration-500 pointer-events-none" />

                <div className="relative space-y-4 flex-1 flex flex-col">
                  {/* Top row — Stars + Date */}
                  <div className="flex items-center justify-between">
                    <StarRating rating={t.rating} />
                    <span className="text-[11px] text-foreground-muted font-medium">
                      {t.date}
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-foreground-secondary leading-relaxed flex-1">
                    &ldquo;{t.comment}&rdquo;
                  </p>

                  {/* Product tag */}
                  <div className="flex items-center gap-2.5 bg-background-alt rounded-xl px-3 py-2.5 border border-border-light">
                    <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-amber-50 shrink-0">
                      <Image
                        src={t.productImage}
                        alt={t.product}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-foreground-muted font-medium uppercase tracking-wide">
                        Purchased
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">
                        {t.product}
                      </p>
                    </div>
                    {t.verified && (
                      <BadgeCheck size={16} className="text-success shrink-0" />
                    )}
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border-light">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-amber-100 ring-offset-1 shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {t.role} • {t.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══ BOTTOM CTA ═══ */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={9}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl border border-amber-100/80 px-8 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Stacked avatars */}
              <div className="flex -space-x-2.5">
                {testimonials.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white"
                  >
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full ring-2 ring-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                  +50K
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <StarRating rating={5} size={12} />
                  <span className="text-xs font-bold text-foreground ml-1">
                    4.9
                  </span>
                </div>
                <p className="text-xs text-foreground-muted">
                  Trusted by 50,000+ customers
                </p>
              </div>
            </div>

            <div className="h-px w-full sm:h-10 sm:w-px bg-amber-200/60" />

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-foreground">
                Ready to join them?
              </p>
              <Button size="md" className="rounded-xl group">
                <ShoppingBag className="h-4 w-4" />
                Start Shopping
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}