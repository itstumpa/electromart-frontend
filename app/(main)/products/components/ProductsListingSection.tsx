"use client";

import type { Brand, Category, Product } from "@/data/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Grid3X3,
  LayoutList,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "../../Utilities/Productcard";
import Reveal from "../../Utilities/Reveal";

/* ── Sort options ─────────────────────────────── */
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Reviews", value: "reviews" },
];

/* ── Props ────────────────────────────────────── */
interface ProductsListingSectionProps {
  filtered: Product[];
  view: "grid" | "list";
  setView: (v: "grid" | "list") => void;
  sort: string;
  setSort: (v: string) => void;
  hasFilters: boolean;
  category: string;
  setCategory: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  brands: Brand[];
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  categories: Category[];
  setFiltersOpen: (v: boolean) => void;
  clearFilters: () => void;
}

/* ── ProductsListingSection ──────────────────── */
export default function ProductsListingSection({
  filtered,
  view,
  setView,
  sort,
  setSort,
  hasFilters,
  category,
  setCategory,
  brand,
  setBrand,
  brands,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  categories,
  setFiltersOpen,
  clearFilters,
}: ProductsListingSectionProps) {
  return (
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
          {hasFilters && (
            <span className="w-2 h-2 rounded-full bg-amber-600" />
          )}
        </button>

        <p className="text-sm text-slate-500 hidden lg:block">
          <span className="font-bold text-slate-900">
            {filtered.length}
          </span>{" "}
          results
        </p>

        <div className="flex items-center gap-2 ml-auto">
          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* View toggle */}
          <div className="flex bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-amber-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-amber-600 text-white" : "text-slate-500 hover:bg-slate-50"}`}
            >
              <LayoutList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {category && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              {categories.find((c) => c.slug === category)?.name}
              <button onClick={() => setCategory("")}>
                <X size={11} />
              </button>
            </span>
          )}
          {brand && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              {brands.find((b) => b.id === brand)?.name}
              <button onClick={() => setBrand("")}>
                <X size={11} />
              </button>
            </span>
          )}
          {maxPrice < 4000 && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              Under ${maxPrice}
              <button onClick={() => setMaxPrice(4000)}>
                <X size={11} />
              </button>
            </span>
          )}
          {minRating > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-full">
              {minRating}+ stars
              <button onClick={() => setMinRating(0)}>
                <X size={11} />
              </button>
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
          <p className="text-lg font-bold text-slate-900 mb-1">
            No products found
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Try adjusting your filters or search term
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className={
            view === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.04} direction="up">
              {view === "grid" ? (
                <ProductCard product={product} index={i} />
              ) : (
                /* List view card */
                <Link
                  href={`/products/${product.slug}`}
                  className="group block"
                >
                  <div className="flex gap-5 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 p-4 transition-all duration-300">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                      <Image
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.originalPrice && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100,
                          )}
                          %
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                      <div>
                        <p className="text-xs text-amber-600 font-semibold mb-1">
                          {product.brandName} · {product.categoryName}
                        </p>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700  transition-colors leading-snug mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-slate-900">
                            ${product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-slate-400 line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star
                            size={13}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-sm font-semibold text-slate-700">
                            {product.rating}
                          </span>
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
  );
}
