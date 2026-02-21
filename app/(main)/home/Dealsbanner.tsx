'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Reveal from '../Utilities/Reveal';

export default function DealsBanner() {
  return (
    <section className="py-16 bg-[#FFFBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Reveal direction="none">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 p-1 shadow-2xl shadow-amber-300/30">
            <div className="bg-linear-to-r from-amber-600 via-amber-500 to-yellow-500 rounded-4xl p-10 sm:p-16 relative overflow-hidden">

              {/* Background decorations */}
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-amber-900/20 rounded-full blur-2xl pointer-events-none" />
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Content */}
              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full mb-5"
                  >
                    <Zap size={12} className="fill-white" />
                    LIMITED OFFER — TODAY ONLY
                  </motion.span>
                  <h2
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    Up to{' '}
                    <span className="text-amber-900">40% Off</span>
                    <br />
                    Top Brands
                  </h2>
                  <p className="text-amber-100 text-base sm:text-lg mt-4 max-w-md leading-relaxed">
                    Shop Apple, Samsung, Sony and Dell at prices you won&apos;t find
                    anywhere else. Free shipping included on every order.
                  </p>
                </div>

                {/* Right side */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-end shrink-0">
                  {/* Coupon box */}
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-5 text-center">
                    <p className="text-amber-100 text-xs font-semibold mb-1">Use code</p>
                    <p className="text-white text-2xl font-black tracking-widest">ELECTRO20</p>
                    <p className="text-amber-100 text-xs mt-1">for extra 20% off</p>
                  </div>

                  <Link
                    href="/sale"
                    className="group inline-flex items-center justify-center gap-2 bg-white hover:bg-amber-50 text-amber-700 font-black px-8 py-4 rounded-2xl shadow-xl transition-all duration-200 hover:-translate-y-0.5 text-base"
                  >
                    Shop the Sale
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}