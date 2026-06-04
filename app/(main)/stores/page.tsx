'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Package, ShieldCheck, Search, X } from 'lucide-react';
import Reveal from '../Utilities/Reveal';
import { fetchTopVendorsClient } from '@/lib/api/vendors';
import { TopVendor } from '@/types/vendors';

const BADGE_COLORS: Record<string, string> = {
  'Top Seller': 'bg-amber-600 text-white',
  'Trending':   'bg-rose-500 text-white',
  'New':        'bg-green-600 text-white',
  'Premium':    'bg-purple-600 text-white',
  'Top Rated':  'bg-blue-600 text-white',
};

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&q=80';
const FALLBACK_LOGO  = 'https://images.unsplash.com/photo-1612838320302-4b3b3996e01e?w=100';

const sortOptions = [
        { label: 'All',        value: '' },
  { label: 'Top Sales',  value: 'sales' },
//   { label: 'Top Rated',  value: 'rating' },
//   { label: 'Most Items', value: 'products' },
];

export default function StoresPage() {
  const [vendors, setVendors]   = useState<TopVendor[]>([]);
  const [search, setSearch]     = useState('');
 const [sort, setSort] = useState('');
  const [loading, setLoading]   = useState(true);

useEffect(() => {
  fetchTopVendorsClient()
    .then(setVendors)
    .catch(() => setVendors([]))
    .finally(() => setLoading(false));
}, []);

  // Filter + sort client-side
const filtered = vendors
  .filter((v) =>
    !search ||
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.specialty?.toLowerCase().includes(search.toLowerCase())
  )
  .sort((a, b) => {
    if (sort === 'rating')   return b.rating - a.rating;
    if (sort === 'products') return b.totalProducts - a.totalProducts;
    if (sort === 'sales')    return b.totalSales - a.totalSales;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#FFFBEB]">

      {/* Header */}
      <Reveal className="container mx-auto px-4 sm:px-6 md:px-8 pt-10 pb-4">
        <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
          Trusted Sellers
        </p>
        <h2
          className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          All <span className="text-amber-600">Stores</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          {vendors.length} verified stores with thousands of happy customers
        </p>
      </Reveal>

      {/* Filters bar */}
      <div className="sticky top-16 z-30">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-wrap gap-3 items-center">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search stores..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X size={12} className="text-slate-400" />
              </button>
            )}
          </div>

          {/* Sort pills */}
          <div className="flex gap-2 ml-auto">
            {sortOptions.map((o) => (
              <button
                key={o.value}
                onClick={() => setSort(o.value)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  sort === o.value
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vendor grid */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-6">

        {/* Result count */}
        <p className="text-sm text-slate-500 mb-6">
          <span className="font-bold text-slate-900">{filtered.length}</span> stores found
          {search && (
            <span> for <span className="text-amber-700 font-semibold">&quot;{search}&quot;</span></span>
          )}
        </p>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-100 animate-pulse h-64" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500">No stores found{search ? ` for "${search}"` : ''}.</p>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-sm text-amber-600 font-semibold hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map((vendor, i) => (
              <Reveal key={vendor.id} delay={i * 0.04} direction="up">
                <Link
                  href={`/products?vendor=${vendor.id}`}
                  className="group block bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 overflow-hidden transition-all duration-300"
                >
                  {/* Cover */}
                  <div className="relative h-28 sm:h-32 overflow-hidden">
                    <Image
                      src={vendor.coverImage ?? FALLBACK_COVER}
                      alt={vendor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

                    {vendor.badge && (
                      <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-1 rounded-lg ${BADGE_COLORS[vendor.badge] ?? 'bg-slate-700 text-white'}`}>
                        {vendor.badge}
                      </span>
                    )}

                    <div className="absolute -bottom-5 left-4">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                        <Image
                          src={vendor.logo ?? FALLBACK_LOGO}
                          alt={vendor.name}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-7 pb-4 px-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-black text-slate-900 text-sm leading-tight group-hover:text-amber-700 transition-colors">
                        {vendor.name}
                      </h3>
                      <ShieldCheck size={14} className="text-green-600 shrink-0 mt-0.5" />
                    </div>

                    {vendor.specialty && (
                      <p className="text-xs text-slate-400 font-medium mb-3 leading-tight">
                        {vendor.specialty}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs mb-3 flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        {vendor.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Package size={11} />
                        {vendor.totalProducts} items
                      </span>
                      <span className="text-slate-400">
                        {vendor.totalSales.toLocaleString()} sales
                      </span>
                    </div>

                    {vendor.offers && (
                      <div className="bg-amber-50 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-amber-800 border border-amber-100">
                        🎁 {vendor.offers}
                      </div>
                    )}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}