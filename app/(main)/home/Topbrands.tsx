'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Marquee from "react-fast-marquee";
import { useEffect, useState } from 'react';
import { getFeaturedBrands } from '@/src/services/api/brand.api';
import type { BrandDto } from '@/types/brand';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400';

export default function TopBrands() {
  const [brands, setBrands] = useState<BrandDto[]>([]);

  useEffect(() => {
    getFeaturedBrands()
      .then((res) => {
        setBrands(res.data.data);
      })
      .catch(() => {
        setBrands([]);
      });
  }, []);

  return (
    <section className="bg-[#FFFBEB] py-6 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Official Partners</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Top Brands
            </h2>
            <p className="text-slate-400 text-sm mt-1">100% authentic, authorized retailer for every brand</p>
          </div>
          <Link href="/products" className="group inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">
            Browse all brands <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {brands.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No featured brands yet.</p>
            <p className="text-slate-400 text-xs mt-1">Featured brands will appear here once marked as featured in admin.</p>
          </div>
        ) : (
          <>
            {/* ── Brand cards grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 mb-8">
              {brands.map((brand, i) => (
                <Link
                  key={brand.id}
                  href={`/products?brand=${brand.slug}`}
                  prefetch={false}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 aspect-square flex flex-col justify-end"
                >
                  {/* Cover image fills the card */}
                  <Image
                    src={brand.logo || PLACEHOLDER_IMAGE}
                    alt={brand.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  {/* Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />

                  {/* Product count pill */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full">
                      {brand._count?.products ?? 0} items
                    </span>
                  </div>

                  {/* Bottom text */}
                  <div className="relative z-10 p-3 sm:p-4">
                    <p className="text-white font-black text-sm sm:text-base leading-tight">{brand.name}</p>
                    {brand.description && (
                      <p className="text-white/60 text-[9px] sm:text-[10px] font-medium mt-0.5 hidden sm:block truncate">{brand.description}</p>
                    )}
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-[9px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                        Official
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Marquee>
              {/* ── Infinite marquee strip ── */}
              <div className="relative">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-linear-to-r from-[#FFFBEB] to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-linear-to-l from-[#FFFBEB] to-transparent z-10 pointer-events-none" />

                {/* Scrolling track */}
                <div className="flex overflow-hidden">
                  <div
                    className="flex shrink-0 gap-3 sm:gap-4 animate-[marquee_22s_linear_infinite]"
                    style={{ willChange: 'transform' }}
                  >
                    {[...brands, ...brands].map((brand, i) => (
                      <div
                        key={`${brand.id}-${i}`}
                        className="shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-5 py-2 sm:py-2.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">{brand.name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Duplicate for seamless loop */}
                  <div
                    className="flex shrink-0 gap-3 sm:gap-4 animate-[marquee_22s_linear_infinite]"
                    style={{ willChange: 'transform' }}
                    aria-hidden="true"
                  >
                    {[...brands, ...brands].map((brand, i) => (
                      <div
                        key={`dup-${brand.id}-${i}`}
                        className="shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-5 py-2 sm:py-2.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">{brand.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Marquee>
          </>
        )}
      </div>
    </section>
  );
}