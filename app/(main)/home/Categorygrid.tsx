'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mockCategories } from '@/data/mock-data';
import Reveal from '../Utilities/Reveal';
import Image from 'next/image';

export default function CategoryGrid() {
  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-2 block">
              Browse by category
            </span>
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Featured{' '}
              <span className="text-amber-600">Categories</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 shrink-0"
          >
            All Categories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.07} direction="up">
              <Link
                href={`/products?category=${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/60 transition-all duration-300 aspect-4/3 flex flex-col justify-end"
              >
                {/* Image */}
                <div className="absolute inset-0">
                  <Image
                  fill
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-4">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-amber-300 text-xs font-medium mt-0.5">
                    {cat.productCount} Products
                  </p>
                </div>

                {/* Hover amber corner */}
                <motion.div
                  initial={false}
                  className="absolute top-3 right-3 w-8 h-8 bg-amber-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <ArrowRight size={14} className="text-white" />
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}