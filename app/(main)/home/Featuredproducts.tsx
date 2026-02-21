'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/data/mock-data';
import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

export default function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="py-20 bg-[#FFFBEB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">
              Handpicked for you
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Featured <span className="text-amber-600">Products</span>
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="group inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 shrink-0"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08} direction="up">
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}