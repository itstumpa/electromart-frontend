// SERVER COMPONENT — pure display, no interactivity needed
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Star, Package, ShieldCheck } from 'lucide-react';
import { mockVendorProfiles } from '@/data/mock-data';

// Extended vendor data with cover images and additional context
const VENDOR_EXTRAS: Record<string, {
  cover: string;
  specialty: string;
  badge: string;
  offers: string;
  since: string;
}> = {
  'vendor-1': {
    cover: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&q=80',
    specialty: 'Apple · Samsung · Sony',
    badge: 'Top Seller',
    offers: 'Free shipping on all orders',
    since: '2019',
  },
  'vendor-2': {
    cover: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80',
    specialty: 'Smart Home · Audio · Wearables',
    badge: 'Trending',
    offers: 'Up to 30% off this week',
    since: '2021',
  },
};

// Extra mock vendors (would come from DB in production)
const EXTRA_VENDORS = [
  {
    id: 'vendor-3', storeName: 'NovaTech Gaming', isApproved: true,
    logo: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=100',
    totalProducts: 56, totalSales: 2100, rating: 4.7,
    extras: {
      cover: 'https://images.unsplash.com/photo-1593640408182-31c228b07f6e?w=600&q=80',
      specialty: 'Gaming · Peripherals · Monitors',
      badge: 'New',
      offers: 'Buy 1 get 1 on accessories',
      since: '2022',
    },
  },
  {
    id: 'vendor-4', storeName: 'PixelHub', isApproved: true,
    logo: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=100',
    totalProducts: 29, totalSales: 980, rating: 4.9,
    extras: {
      cover: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
      specialty: 'Cameras · Lenses · Drones',
      badge: 'Premium',
      offers: '15% off first order',
      since: '2020',
    },
  },
  {
    id: 'vendor-5', storeName: 'AudioSphere', isApproved: true,
    logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100',
    totalProducts: 41, totalSales: 1560, rating: 4.8,
    extras: {
      cover: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      specialty: 'Headphones · Speakers · DACs',
      badge: 'Top Rated',
      offers: 'Free delivery on orders $50+',
      since: '2018',
    },
  },
];

const BADGE_COLORS: Record<string, string> = {
  'Top Seller': 'bg-amber-600 text-white',
  'Trending':   'bg-rose-500 text-white',
  'New':        'bg-green-600 text-white',
  'Premium':    'bg-purple-600 text-white',
  'Top Rated':  'bg-blue-600 text-white',
};

export default function TopVendors() {
  // Build unified vendor list from mock data + extras
  const vendorsFromMock = mockVendorProfiles.filter((v) => v.isApproved).map((v) => ({
    id: v.id,
    storeName: v.storeName,
    logo: v.logo ?? '',
    totalProducts: v.totalProducts,
    totalSales: v.totalSales,
    rating: v.rating,
    extras: VENDOR_EXTRAS[v.id] ?? {
      cover: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600',
      specialty: 'Electronics',
      badge: 'Verified',
      offers: 'Shop now',
      since: '2020',
    },
  }));

  const allVendors = [...vendorsFromMock, ...EXTRA_VENDORS];

  return (
    <section className="bg-white py-6">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Trusted Sellers</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900" style={{ fontFamily: "'Georgia', serif" }}>
              Top Vendors
            </h2>
            <p className="text-slate-400 text-sm mt-1">Verified stores with thousands of happy customers</p>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            All vendors
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Scrollable vendor cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6">
          {allVendors.map((vendor, i) => (
            <Link
              key={vendor.id}
              href={`/products?vendor=${vendor.id}`}
              className="group block bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 overflow-hidden transition-all duration-300"
            >
              {/* Cover image */}
              <div className="relative h-28 sm:h-32 overflow-hidden">
                <Image
                  src={vendor.extras.cover}
                  alt={vendor.storeName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />

                {/* Badge */}
                <span className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-1 rounded-lg ${BADGE_COLORS[vendor.extras.badge] ?? 'bg-slate-700 text-white'}`}>
                  {vendor.extras.badge}
                </span>

                {/* Logo overlapping cover */}
                <div className="absolute -bottom-5 left-4">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                    <Image
                      src={vendor.logo}
                      alt={vendor.storeName}
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
                    {vendor.storeName}
                  </h3>
                  <ShieldCheck size={14} className="text-green-600 shrink-0 mt-0.5" />
                </div>
                <p className="text-xs text-slate-400 font-medium mb-3 leading-tight">{vendor.extras.specialty}</p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs mb-3">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {vendor.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Package size={11} />
                    {vendor.totalProducts} items
                  </span>
                  <span className="text-slate-400">{vendor.totalSales.toLocaleString()} sales</span>
                </div>

                {/* Offer strip */}
                <div className="bg-amber-50 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold text-amber-800 border border-amber-100">
                  🎁 {vendor.extras.offers}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}