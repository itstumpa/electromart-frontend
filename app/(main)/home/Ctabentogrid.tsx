'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, ArrowRight, Smartphone, Mail,
  CheckCircle2, Zap, TrendingUp, Shield, Users,
} from 'lucide-react';

export default function CTABentoGrid() {
  const [email,     setEmail]     = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.includes('@')) return;
    await new Promise((r) => setTimeout(r, 800));
    setSubscribed(true);
  };

  return (
    <section className="bg-white py-10 sm:py-14">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">More from ElectroMart</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
            Grow With Us
          </h2>
        </motion.div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* ██ Vendor signup — big card ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 min-h-[280px] flex flex-col justify-between"
          >
            {/* Background texture */}
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            {/* Glow blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-600 text-white text-xs font-black px-3 py-1.5 rounded-full mb-5 shadow-lg shadow-amber-600/30">
                <Zap size={12} className="fill-white" />
                JOIN AS A VENDOR — FREE
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                Start selling on<br />
                <span className="text-amber-400">ElectroMart</span> today
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-md">
                Join 200+ verified vendors. List your products, reach thousands of buyers, and grow your business — zero listing fees to get started.
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 sm:gap-6 mb-7">
                {[
                  { icon: Users,     value: '3,800+',  label: 'Active buyers' },
                  { icon: TrendingUp, value: '$142k',  label: 'Monthly sales' },
                  { icon: Shield,    value: '100%',    label: 'Secure payouts' },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon size={16} className="text-amber-400 shrink-0" />
                    <div>
                      <p className="text-white font-black text-sm leading-tight">{value}</p>
                      <p className="text-slate-500 text-[10px] font-medium">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/register?role=vendor"
                className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white font-black text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-600/30"
              >
                <Store size={16} />
                Open your store
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Decorative product stack */}
            <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8 hidden sm:flex flex-col gap-2 opacity-60">
              {[
                'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=80',
                'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=80',
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80',
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10"
                  style={{ transform: `rotate(${i % 2 === 0 ? '3' : '-3'}deg) translateX(${i * 4}px)` }}
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="48px" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right column: stacked 2 cards ── */}
          <div className="flex flex-col gap-4">

            {/* ██ App download card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-amber-700 p-5 sm:p-6 flex-1 min-h-[130px] flex flex-col justify-between"
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Smartphone size={18} className="text-white/80" />
                  <p className="text-white font-black text-sm">ElectroMart App</p>
                </div>
                <p className="text-white/80 text-xs leading-relaxed mb-4">
                  Shop faster, track orders live, get exclusive app-only deals.
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['App Store', 'Google Play'].map((store) => (
                    <Link
                      key={store}
                      href="#"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border border-white/20"
                    >
                      {store}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ██ Newsletter card ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-3xl bg-slate-50 border border-slate-200 p-5 sm:p-6 flex-1 min-h-[130px] flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 mb-3">
                <Mail size={16} className="text-amber-600" />
                <p className="font-black text-slate-900 text-sm">Newsletter</p>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-3">
                Weekly deals, new arrivals, tech reviews. No spam.
              </p>
              <AnimatePresence mode="wait">
                {subscribed ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-green-700 bg-green-100 rounded-xl px-3 py-2"
                  >
                    <CheckCircle2 size={14} />
                    <span className="text-xs font-bold">You're subscribed!</span>
                  </motion.div>
                ) : (
                  <motion.div key="form" className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      placeholder="your@email.com"
                      className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                    />
                    <button
                      onClick={handleSubscribe}
                      className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                    >
                      Join
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}