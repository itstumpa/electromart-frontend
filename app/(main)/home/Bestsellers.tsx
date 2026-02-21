'use client';

import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { getBestsellerProducts } from '@/data/mock-data';
import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

export default function BestSellers() {
  const products = getBestsellerProducts();

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 tracking-widest uppercase mb-2">
              <Trophy size={12} className="text-amber-500" />
              Favourites
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Best <span className="text-amber-600">Sellers</span>
            </h2>
          </div>
          <Link
            href="/products?bestseller=true"
            className="group inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 shrink-0"
          >
            See All Bestsellers
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {/* Grid with #1, #2... badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08} direction="up">
              <div className="relative">
                {/* Rank badge */}
                <div className="absolute -top-3 -left-3 z-10 w-9 h-9 rounded-full bg-amber-600 text-white text-sm font-black flex items-center justify-center shadow-md shadow-amber-300/40 border-2 border-white">
                  #{i + 1}
                </div>
                <ProductCard product={product} index={i} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}