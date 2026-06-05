// components/features/testimonials/testimonials-section.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Star, BadgeCheck, ShoppingBag, ArrowRight, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import { getLatestReviews, type ReviewDto } from '@/api/review.api';

/* ── Static fallback data ──────────────────── */
const STATIC_TESTIMONIALS = [
  {
    id: 's1',
    name: 'James Harrington',
    role: 'Software Engineer',
    location: 'Dhaka, BD',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    rating: 5,
    product: 'MacBook Pro M3',
    comment:
      'Ordered on a Tuesday, arrived Thursday. The MacBook Pro was exactly as described — factory sealed, genuine Apple warranty. ElectroMart is now my go-to for all tech purchases.',
    verified: true,
    date: '2 weeks ago',
  },
  {
    id: 's2',
    name: 'Sophia Nakamura',
    role: 'Photographer',
    location: 'Chittagong, BD',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    rating: 5,
    product: 'Sony Alpha A7R V',
    comment:
      'I was nervous spending ৳350,000 online but the customer service team was incredible. They walked me through the purchase, confirmed authenticity, and even helped with setup.',
    verified: true,
    date: '1 month ago',
  },
  {
    id: 's3',
    name: 'Marcus Webb',
    role: 'Music Producer',
    location: 'Sylhet, BD',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    rating: 5,
    product: 'Sony WH-1000XM5',
    comment:
      "The noise-canceling is life-changing in a studio environment. ElectroMart had the best price I could find, shipping was fast, and the product came perfectly packaged.",
    verified: true,
    date: '3 weeks ago',
  },
  {
    id: 's4',
    name: 'Priya Mehta',
    role: 'Student',
    location: 'Rajshahi, BD',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    rating: 5,
    product: 'Samsung Galaxy S24 Ultra',
    comment:
      'First time buying a phone online and I was a bit worried. But the process was smooth from cart to door. The phone is incredible and ELECTRO20 saved me a lot!',
    verified: true,
    date: '5 days ago',
  },
  {
    id: 's5',
    name: 'Daniel Torres',
    role: 'Game Developer',
    location: 'Dhaka, BD',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    rating: 5,
    product: 'PlayStation 5 Slim',
    comment:
      'Got the PS5 Slim within 2 days, controllers included. ElectroMart stock is always up to date unlike other stores. The unboxing condition was pristine.',
    verified: true,
    date: '1 week ago',
  },
];

/* ── Map a real DB review into the testimonial shape ── */
function mapReviewToTestimonial(r: ReviewDto) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(r.createdAt).getTime()) / 86_400_000,
  );
  const dateLabel =
    daysAgo === 0
      ? 'Today'
      : daysAgo === 1
        ? 'Yesterday'
        : daysAgo < 7
          ? `${daysAgo} days ago`
          : daysAgo < 30
            ? `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`
            : `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`;

  return {
    id: r.id,
    name: r.customer?.name ?? 'Verified Customer',
    role: 'Verified Buyer',
    location: 'Bangladesh',
    avatar: '',
    rating: r.rating,
    product: r.product?.name ?? 'ElectroMart Product',
    comment: r.comment,
    verified: true,
    date: dateLabel,
  };
}

type Testimonial = (typeof STATIC_TESTIMONIALS)[0];

/* ── Animations ───────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/* ── Star renderer ────────────────────────────── */
function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-gray-200 text-gray-200',
          )}
        />
      ))}
    </div>
  );
}

/* ── Review Card ──────────────────────────────── */
function ReviewCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="w-85 sm:w-95 mx-2.5 shrink-0">
      <div className="h-full bg-white rounded-2xl border border-border-primary/60 p-6 flex flex-col gap-4 hover:border-primary/30 hover:shadow-md hover:shadow-amber-900/4 transition-all duration-300">
        {/* Header — Avatar + Info */}
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-amber-100 ring-offset-1 shrink-0 bg-amber-100 flex items-center justify-center">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                className="object-cover"
                sizes="44px"
              />
            ) : (
              <span className="text-amber-700 font-black text-lg">
                {testimonial.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-foreground truncate">
                {testimonial.name}
              </p>
              {testimonial.verified && (
                <BadgeCheck
                  size={14}
                  className="text-primary fill-primary/15 shrink-0"
                />
              )}
            </div>
            <p className="text-xs text-foreground-muted truncate">
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
        </div>

        {/* Rating + Product */}
        <div className="flex items-center justify-between gap-3">
          <StarRating rating={testimonial.rating} />
          <span className="text-[11px] font-medium text-foreground-muted bg-surface-secondary px-2.5 py-1 rounded-full truncate max-w-40">
            {testimonial.product}
          </span>
        </div>

        {/* Comment */}
        <div className="relative flex-1">
          <Quote
            size={28}
            className="absolute -top-0.5 -left-0.5 text-amber-200/50 rotate-180"
          />
          <p className="text-[13.5px] leading-relaxed text-foreground-secondary pl-5">
            {testimonial.comment}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border-primary/40">
          {testimonial.verified && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success">
              <BadgeCheck size={11} />
              Verified Purchase
            </span>
          )}
          <span className="text-[11px] text-foreground-muted ml-auto">
            {testimonial.date}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ───────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const [displayList, setDisplayList] = useState<Testimonial[]>(STATIC_TESTIMONIALS);

  // Fetch real reviews on mount and replace static fallbacks if enough exist
  useEffect(() => {
    getLatestReviews(10)
      .then((res) => {
        const real = (res.data?.data ?? []).filter((r) => r.comment?.trim());
        if (real.length >= 3) {
          setDisplayList(real.map(mapReviewToTestimonial));
        } else if (real.length > 0) {
          // Blend: real reviews first, fill remainder with static
          const mapped = real.map(mapReviewToTestimonial);
          const fill = STATIC_TESTIMONIALS.slice(0, 5 - mapped.length);
          setDisplayList([...mapped, ...fill]);
        }
        // < 1 real review → keep static fallback as-is
      })
      .catch(() => {
        // Network error or backend unavailable → keep static
      });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="container mx-auto relative py-16 sm:py-20 bg-linear-to-b from-white via-amber-50/15 to-white overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-amber-100/15 blur-[100px] pointer-events-none" />

      {/* ═══ HEADER ═══ */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-12 sm:mb-14"
        >
          <motion.span
            variants={fadeUp}
            custom={0}
            className="inline-flex items-center gap-1.5 bg-accent-light text-primary text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4"
          >
            <BadgeCheck size={13} />
            Customer Reviews
          </motion.span>

          <motion.h2
            variants={fadeUp}
            custom={1}
            className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-foreground leading-tight tracking-tight"
          >
            What Our Customers{' '}
            <span className="relative inline-block">
              <span className="text-primary">Say</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-1 left-0 right-0 h-0.75 bg-accent/50 rounded-full origin-left"
              />
            </span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-3 text-foreground-secondary max-w-lg mx-auto text-sm sm:text-base"
          >
            Thousands of happy customers trust ElectroMart for genuine products and fast delivery.
          </motion.p>
        </motion.div>
      </div>

      {/* ═══ MARQUEE ROW ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-5 overflow-hidden"
      >
        <Marquee
          speed={30}
          gradient
          gradientColor="white"
          gradientWidth={80}
          pauseOnHover
          className="py-1 overflow-hidden"
        >
          {displayList.map((t) => (
            <ReviewCard key={t.id} testimonial={t} />
          ))}
        </Marquee>
      </motion.div>

      {/* ═══ BOTTOM CTA ═══ */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUp}
          custom={9}
          className="mt-14 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-linear-to-r from-amber-50 via-white to-amber-50 rounded-2xl border border-amber-100/80 px-8 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Stacked avatars — initials from display list */}
              <div className="flex -space-x-2.5">
                {displayList.slice(0, 4).map((t) => (
                  <div
                    key={t.id}
                    className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white bg-amber-100 flex items-center justify-center"
                  >
                    {t.avatar ? (
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" sizes="36px" />
                    ) : (
                      <span className="text-amber-700 font-black text-sm">
                        {t.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full ring-2 ring-white bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                  +50K
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <StarRating rating={5} size={12} />
                  <span className="text-xs font-bold text-foreground ml-1">4.9</span>
                </div>
                <p className="text-xs text-foreground-muted">Trusted by 50,000+ customers</p>
              </div>
            </div>

            <div className="h-px w-full sm:h-10 sm:w-px bg-amber-200/60" />

            <div className="flex items-center gap-3">
              <p className="text-sm font-semibold text-foreground">Ready to join them?</p>
              <Button className="inline-flex items-center gap-2 rounded-xl group py-4 px-3">
                <Link href="/products" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Start Shopping
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}