// components/top-vendors.tsx
import { fetchTopVendors } from "@/lib/api/vendors";
import { ArrowRight, Package, ShieldCheck, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { getTopVendors } from '@/data/mock-data';

const BADGE_COLORS: Record<string, string> = {
  "Top Seller": "bg-amber-600 text-white",
  Trending: "bg-rose-500 text-white",
  New: "bg-green-600 text-white",
  Premium: "bg-purple-600 text-white",
  "Top Rated": "bg-blue-600 text-white",
};

const FALLBACK_COVER =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80";
const FALLBACK_LOGO =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80";

const vendors = await fetchTopVendors();

console.dir(vendors[0], { depth: null });

export default async function TopVendors() {
  const vendors = await fetchTopVendors();

  return (
    <section className="bg-white md:py-2 lg:py-6">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-7 flex-wrap gap-3">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
              Trusted Sellers
            </p>
            <h2
              className="text-2xl sm:text-3xl font-black text-slate-900"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Top Stores
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Verified stores with thousands of happy customers
            </p>
          </div>
          <Link
            href="/stores"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
          >
            All Stores
            <ArrowRight
              size={15}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Vendor cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
          {vendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/products?vendor=${vendor.id}`}
              prefetch={false}
              className="group block bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 overflow-hidden transition-all duration-300"
            >
              {/* Cover */}
              <div className="relative h-28 sm:h-32 overflow-hidden">
                <Image
                  src={
                    typeof vendor.coverImage === "string" && vendor.coverImage
                      ? vendor.coverImage
                      : FALLBACK_COVER
                  }
                  alt={vendor.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

                {vendor.badge && (
                  <span
                    className={`absolute top-2.5 right-2.5 text-[10px] font-black px-2 py-1 rounded-lg ${BADGE_COLORS[vendor.badge] ?? "bg-slate-700 text-white"}`}
                  >
                    {vendor.badge}
                  </span>
                )}

                <div className="absolute -bottom-5 left-4">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
                   <Image
  src={
    typeof vendor.logo === "string" && vendor.logo !== "[object Object]" && vendor.logo.trim() !== ""
      ? vendor.logo
      : FALLBACK_LOGO
  }
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
                  <ShieldCheck
                    size={14}
                    className="text-green-600 shrink-0 mt-0.5"
                  />
                </div>

                {vendor.specialty && (
                  <p className="text-xs text-slate-400 font-medium mb-3 leading-tight">
                    {vendor.specialty}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs mb-3">
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
          ))}
        </div>
      </div>
    </section>
  );
}
