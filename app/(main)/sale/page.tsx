'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import Link from 'next/link';
import { mockProducts, mockCategories } from '@/data/mock-data';

import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

const sortOptions = [
  { label: 'Biggest Discount', value: 'discount' },
  { label: 'Price: Low–High',  value: 'price_asc' },
  { label: 'Price: High–Low',  value: 'price_desc' },
  { label: 'Top Rated',        value: 'rating' },
];

export default function SalePage() {
  const [category, setCategory] = useState('');
  const [sort, setSort]         = useState('discount');

  const saleProducts = useMemo(() => {
    let list = mockProducts.filter(p => p.originalPrice && p.originalPrice > p.price);
    if (category) list = list.filter(p => p.categoryId === category);
    switch (sort) {
      case 'discount':   list.sort((a, b) => {
        const da = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
        const db = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
        return db - da;
      }); break;
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
    }
    return list;
  }, [category, sort]);

  const saleCategories = mockCategories.filter(cat =>
    mockProducts.some(p => p.categoryId === cat.id && p.originalPrice && p.originalPrice > p.price)
  );

  const totalSavings = saleProducts.reduce((sum, p) => sum + (p.originalPrice! - p.price), 0);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Hero banner ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-900 py-16 sm:py-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/10 blur-[80px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(rgba(217,119,6,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(217,119,6,0.4) 1px,transparent 1px)', backgroundSize: '48px 48px' }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-5"
          >
            <motion.span animate={{ scale: [1, 1.35, 1] }} transition={{ repeat: Infinity, duration: 1.6 }}>
              <Flame size={12} className="fill-amber-400" />
            </motion.span>
            Limited Time Offers
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-black text-white leading-tight mb-3"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Mega <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Sale</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg mb-8 max-w-md mx-auto"
          >
            Up to 40% off top electronics. All products include genuine warranty.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 sm:gap-12"
          >
            {[
              { value: `${saleProducts.length}+`, label: 'Products On Sale' },
              { value: 'Up to 40%', label: 'Max Discount' },
              { value: `$${Math.round(totalSavings).toLocaleString()}+`, label: 'Total Savings Available' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* Coupon */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-3 rounded-2xl"
          >
            <Zap size={16} className="text-amber-400" />
            <span className="text-white text-sm font-medium">Extra 20% off with code</span>
            <span className="bg-amber-600 text-white text-sm font-black px-3 py-1 rounded-lg tracking-widest">ELECTRO20</span>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* Category pills */}
          <button
            onClick={() => setCategory('')}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!category ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
          >
            All Sale
          </button>
          {saleCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id === category ? '' : cat.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${category === cat.id ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
            >
              {cat.name}
            </button>
          ))}

          {/* Sort */}
          <div className="relative ml-auto shrink-0">
            <select
              value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">{saleProducts.length}</span> sale items
            {category && <span> in <span className="text-amber-700 font-semibold">{saleCategories.find(c => c.id === category)?.name}</span></span>}
          </p>
          {category && (
            <button onClick={() => setCategory('')} className="flex items-center gap-1 text-xs text-amber-700 font-semibold hover:underline">
              <X size={12} /> Clear filter
            </button>
          )}
        </div>

        {saleProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No sale products in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {saleProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.05} direction="up">
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}