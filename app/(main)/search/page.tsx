'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { mockProducts, mockCategories } from '@/data/mock-data';
import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebounce(query, 320);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return mockProducts.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [debouncedQuery]);

  const suggestions = ['iPhone', 'MacBook', 'Sony', 'Samsung', 'Gaming', 'Headphones', 'Laptop', 'Apple Watch'];

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Reveal>
            <h1 className="text-3xl font-black text-slate-900 mb-5" style={{ fontFamily: "'Georgia', serif" }}>
              Search Products
            </h1>
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for smartphones, laptops, headphones..."
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-200 focus:border-amber-400 rounded-2xl text-base text-slate-800 placeholder-slate-400 focus:outline-none transition"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Suggestions */}
            {!query && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-slate-400 font-medium self-center">Try:</span>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-full transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!debouncedQuery.trim() ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <Search size={48} className="text-amber-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Start typing to search products</p>
            </motion.div>
          ) : results.length === 0 ? (
            <motion.div key="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20">
              <p className="text-xl font-bold text-slate-700 mb-2">No results for "{debouncedQuery}"</p>
              <p className="text-slate-400 text-sm">Try a different keyword or browse categories</p>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-sm text-slate-500 mb-6">
                <span className="font-bold text-slate-900">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<span className="text-amber-700">{debouncedQuery}</span>"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {results.map((p, i) => (
                  <Reveal key={p.id} delay={i * 0.05}>
                    <ProductCard product={p} index={i} />
                  </Reveal>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}