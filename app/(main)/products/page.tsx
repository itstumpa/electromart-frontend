'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal, X, ChevronDown, Search,
  Grid3X3, LayoutList, Star,
} from 'lucide-react';
import Link from 'next/link';
import {
  mockProducts, mockCategories, mockBrands,
} from '@/data/mock-data';

import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

const sortOptions = [
  { label: 'Newest',        value: 'newest' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
  { label: 'Top Rated',     value: 'rating' },
  { label: 'Most Reviews',  value: 'reviews' },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') ?? '';

  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState(urlCategory);
  const [brand,       setBrand]       = useState('');
  const [minPrice,    setMinPrice]    = useState(0);
  const [maxPrice,    setMaxPrice]    = useState(4000);
  const [minRating,   setMinRating]   = useState(0);
  const [sort,        setSort]        = useState('newest');
  const [view,        setView]        = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let list = [...mockProducts];
    if (search)   list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brandName.toLowerCase().includes(search.toLowerCase()));
    if (category) list = list.filter(p => p.categoryId === mockCategories.find(c => c.slug === category)?.id || p.categoryName.toLowerCase().replace(/[\s&]+/g, '-') === category);
    if (brand)    list = list.filter(p => p.brandId === brand);
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);
    list = list.filter(p => p.rating >= minRating);
    switch (sort) {
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'reviews':    list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default:           list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [search, category, brand, minPrice, maxPrice, minRating, sort]);

  const clearFilters = () => {
    setSearch(''); setCategory(''); setBrand('');
    setMinPrice(0); setMaxPrice(4000); setMinRating(0);
  };
  const hasFilters = search || category || brand || minPrice > 0 || maxPrice < 4000 || minRating > 0;

  /* ── Active category label ── */
  const activeCatLabel = category
    ? mockCategories.find(c => c.slug === category)?.name ?? 'All Products'
    : 'All Products';

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* ── Page header ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <Reveal>
            <p className="text-xs font-bold text-amber-600 tracking-widest uppercase mb-1">
              ElectroMart Store
            </p>
            <h1
              className="text-4xl font-black text-slate-900 tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {activeCatLabel}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
            </p>
          </Reveal>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
            <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">{activeCatLabel}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* ══ FILTER SIDEBAR (desktop) ══ */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Search */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Search</p>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Product name..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setCategory('')}
                    className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                  >
                    All Categories
                  </button>
                  {mockCategories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.slug)}
                      className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${category === cat.slug ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                    >
                      {cat.name}
                      <span className={`text-xs ${category === cat.slug ? 'text-amber-200' : 'text-slate-400'}`}>
                        {mockProducts.filter(p => p.categoryId === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Brand</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setBrand('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!brand ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}>
                    All Brands
                  </button>
                  {mockBrands.map(b => (
                    <button key={b.id} onClick={() => setBrand(b.id)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${brand === b.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Price Range</p>
                <div className="px-1 space-y-3">
                  <input type="range" min={0} max={4000} step={50} value={maxPrice}
                    onChange={e => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-amber-600"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-medium">
                    <span>$0</span>
                    <span className="text-amber-700 font-bold">up to ${maxPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Min Rating</p>
                <div className="flex flex-col gap-1">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${minRating === r ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'}`}
                    >
                      {r === 0 ? 'Any Rating' : (
                        <span className="flex items-center gap-1">
                          <Star size={12} className="fill-current" />
                          {r}+ stars
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {hasFilters && (
                <button onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors"
                >
                  <X size={14} /> Clear Filters
                </button>
              )}
            </div>
          </aside>

          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-amber-400 transition-colors"
              >
                <SlidersHorizontal size={15} />
                Filters
                {hasFilters && <span className="w-2 h-2 rounded-full bg-amber-600" />}
              </button>

              <p className="text-sm text-slate-500 hidden lg:block">
                <span className="font-bold text-slate-900">{filtered.length}</span> results
              </p>

              <div className="flex items-center gap-2 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setView('grid')}
                    className={`p-2 transition-colors ${view === 'grid' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  ><Grid3X3 size={16} /></button>
                  <button onClick={() => setView('list')}
                    className={`p-2 transition-colors ${view === 'list' ? 'bg-amber-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  ><LayoutList size={16} /></button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {category && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {mockCategories.find(c => c.slug === category)?.name}
                    <button onClick={() => setCategory('')}><X size={11} /></button>
                  </span>
                )}
                {brand && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {mockBrands.find(b => b.id === brand)?.name}
                    <button onClick={() => setBrand('')}><X size={11} /></button>
                  </span>
                )}
                {maxPrice < 4000 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    Under ${maxPrice}
                    <button onClick={() => setMaxPrice(4000)}><X size={11} /></button>
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {minRating}+ stars
                    <button onClick={() => setMinRating(0)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Product grid / list */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <Search size={24} className="text-amber-600" />
                </div>
                <p className="text-lg font-bold text-slate-900 mb-1">No products found</p>
                <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div
                layout
                className={view === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'
                  : 'flex flex-col gap-4'}
              >
                {filtered.map((product, i) => (
                  <Reveal key={product.id} delay={i * 0.04} direction="up">
                    {view === 'grid' ? (
                      <ProductCard product={product} index={i} />
                    ) : (
                      /* List view card */
                      <Link href={`/products/${product.slug}`} className="group block">
                        <div className="flex gap-5 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 p-4 transition-all duration-300">
                          <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            {product.originalPrice && (
                              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <div>
                              <p className="text-xs text-amber-600 font-semibold mb-1">{product.brandName} · {product.categoryName}</p>
                              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2">{product.name}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-black text-slate-900">${product.price.toLocaleString()}</span>
                                {product.originalPrice && <span className="text-sm text-slate-400 line-through">${product.originalPrice.toLocaleString()}</span>}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star size={13} className="fill-amber-400 text-amber-400" />
                                <span className="text-sm font-semibold text-slate-700">{product.rating}</span>
                                <span className="text-xs text-slate-400">({product.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </Reveal>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ── */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="p-2 rounded-lg hover:bg-slate-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="p-4 space-y-6">
              {/* Same filters as desktop sidebar */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setCategory('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>All Categories</button>
                  {mockCategories.map(cat => (
                    <button key={cat.id} onClick={() => setCategory(cat.slug)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat.slug ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Brand</p>
                <div className="flex flex-col gap-1">
                  <button onClick={() => setBrand('')} className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${!brand ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>All Brands</button>
                  {mockBrands.map(b => (
                    <button key={b.id} onClick={() => setBrand(b.id)} className={`text-left px-3 py-2 rounded-xl text-sm font-medium ${brand === b.id ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-amber-50'}`}>{b.name}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => { clearFilters(); setFiltersOpen(false); }}
                className="w-full py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors"
              >Apply & Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}