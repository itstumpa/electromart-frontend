// SERVER COMPONENT
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mockBrands } from '@/data/mock-data';
import Marquee from "react-fast-marquee";


// Extended brands with better imagery and colours for the pill display
const ALL_BRANDS = [
  {
    id: 'brand-1', name: 'Apple', slug: 'apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/814px-Apple_logo_black.svg.png',
    cover: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80',
    productCount: 24, tagline: 'Think Different',
    accentBg: 'bg-slate-900', accentText: 'text-white',
  },
  {
    id: 'brand-2', name: 'Samsung', slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
    productCount: 31, tagline: 'Inspire the World',
    accentBg: 'bg-blue-600', accentText: 'text-white',
  },
  {
    id: 'brand-3', name: 'Sony', slug: 'sony',
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    productCount: 18, tagline: 'Be Moved',
    accentBg: 'bg-slate-800', accentText: 'text-white',
  },
  {
    id: 'brand-4', name: 'Dell', slug: 'dell',
    logo: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=400&q=80',
    productCount: 14, tagline: 'The Power to Do More',
    accentBg: 'bg-blue-700', accentText: 'text-white',
  },
  {
    id: 'brand-5', name: 'LG', slug: 'lg',
    logo: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80',
    productCount: 22, tagline: 'Life\'s Good',
    accentBg: 'bg-red-700', accentText: 'text-white',
  },
  {
    id: 'brand-6', name: 'Bose', slug: 'bose',
    logo: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    cover: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    productCount: 11, tagline: 'Better Sound Through Research',
    accentBg: 'bg-amber-900', accentText: 'text-white',
  },
];

// Marquee brand name list (duplicated for seamless loop)
const MARQUEE_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'LG', 'Bose',
  'Asus', 'Lenovo', 'Microsoft', 'Google', 'OnePlus', 'Razer',
];

export default function TopBrands() {
  return (
    <section className="bg-[#FFFBEB] py-10 sm:py-14 overflow-hidden">
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

        {/* ── Brand cards grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {ALL_BRANDS.map((brand, i) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-50 transition-all duration-300 aspect-square flex flex-col justify-end"
            >
              {/* Cover image fills the card */}
              <Image
                src={brand.cover}
                alt={brand.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/10" />

              {/* Product count pill */}
              <div className="absolute top-2.5 right-2.5 z-10">
                <span className="bg-white/20 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full">
                  {brand.productCount} items
                </span>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 p-3 sm:p-4">
                <p className="text-white font-black text-sm sm:text-base leading-tight">{brand.name}</p>
                <p className="text-white/60 text-[9px] sm:text-[10px] font-medium mt-0.5 hidden sm:block truncate">{brand.tagline}</p>
                <div className="flex items-center gap-1 mt-2">
                  <span className={`text-[9px] font-bold ${brand.accentBg} ${brand.accentText} px-2 py-0.5 rounded-full`}>
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
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-[#FFFBEB] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-[#FFFBEB] to-transparent z-10 pointer-events-none" />

          {/* Scrolling track */}
          <div className="flex overflow-hidden">
            <div
              className="flex shrink-0 gap-3 sm:gap-4 animate-[marquee_22s_linear_infinite]"
              style={{ willChange: 'transform' }}
            >
              {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((name, i) => (
                <div
                  key={i}
                  className="shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-5 py-2 sm:py-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div
              className="flex shrink-0 gap-3 sm:gap-4 animate-[marquee_22s_linear_infinite]"
              style={{ willChange: 'transform' }}
              aria-hidden="true"
            >
              {[...MARQUEE_BRANDS, ...MARQUEE_BRANDS].map((name, i) => (
                <div
                  key={i}
                  className="shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-5 py-2 sm:py-2.5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Marquee>
      </div>
    </section>
  );
}