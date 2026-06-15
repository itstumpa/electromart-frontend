'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { getProducts } from '@/api/product.api';
import type { Product } from '@/data/types';
import { mapListItemDtoToProduct } from '@/lib/product-mappers';
import ProductCard from '../Utilities/Productcard';

type FilterTab = 'all' | 'sale' | 'bestseller' | 'toprated';

const TABS: { key: FilterTab; label: string }[] = [
  { key: 'all',        label: 'All'         },
  { key: 'sale',       label: 'On Sale'     },
  { key: 'bestseller', label: 'Bestsellers' },
  { key: 'toprated',   label: 'Top Rated'   },
];

export default function PopularProducts() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  useEffect(() => {
    getProducts({ limit: 7, onSale: true })
      .then((res) => setProducts(res.data.data.map(mapListItemDtoToProduct)))
      .catch(() => setProducts([]));
  }, []);

  const filtered = products.filter((p) => {
    if (activeTab === 'sale')       return p.originalPrice && p.originalPrice > p.price;
    if (activeTab === 'bestseller') return p.bestseller;
    if (activeTab === 'toprated')   return p.rating >= 4;
    return true;
  });

  return (
    <section className="bg-[#FFFBEB] py-1 md:py-1 lg:py-3 sm:py-4">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-amber-600" />
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Hot Right Now</p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Popular Products
            </h2>
          </div>

          {/* Tab filters */}
          <div className="flex overflow-x-auto bg-white border border-slate-200 rounded-xl p-1 gap-0.5 self-start sm:self-auto">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={[
                  'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap',
                  activeTab === key
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* View all CTA */}
        <div className="text-end mt-2 sm:mt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-amber-700 hover:bg-amber-600 hover:text-white font-black px-2 py-3 rounded-xl transition-all duration-200 text-sm"
          >
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}