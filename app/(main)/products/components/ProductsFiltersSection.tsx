"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, Star, X } from "lucide-react";
import type { Brand, Category } from "@/data/types";

/* ── Props ────────────────────────────────────── */
interface FilterControlsProps {
  search: string;
  setSearch: (v: string) => void;
  category: string;
  setCategory: (v: string) => void;
  categories: Category[];
  brand: string;
  setBrand: (v: string) => void;
  brands: Brand[];
  minPrice: number;
  setMinPrice: (v: number) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

/* ── Desktop sidebar ──────────────────────────── */
export function DesktopFiltersSidebar(props: FilterControlsProps) {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-24 space-y-6">
        <FilterControls {...props} showSearch showClear showPrice showRating />
      </div>
    </aside>
  );
}

/* ── Mobile drawer ────────────────────────────── */
export function MobileFiltersDrawer({
  open,
  onClose,
  ...filterProps
}: FilterControlsProps & {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white overflow-y-auto"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-bold text-slate-900">Filters</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 space-y-6">
              <FilterControls {...filterProps} showSearch={false} showPrice={false} showRating={false} showClear={false} />
              <button
                onClick={() => {
                  filterProps.clearFilters();
                  onClose();
                }}
                className="w-full py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors"
              >
                Apply & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ── Shared filter controls ───────────────────── */
function FilterControls({
  search,
  setSearch,
  category,
  setCategory,
  categories,
  brand,
  setBrand,
  brands,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  hasFilters,
  clearFilters,
  showSearch,
  showPrice,
  showRating,
  showClear,
}: FilterControlsProps & {
  showSearch: boolean;
  showPrice: boolean;
  showRating: boolean;
  showClear: boolean;
}) {
  return (
    <>
      {showSearch && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Search
          </p>
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Category */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Category
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setCategory("")}
            className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!category ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.slug)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${category === cat.slug ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
            >
              {cat.name}
              <span
                className={`text-xs ${category === cat.slug ? "text-amber-200" : "text-slate-400"}`}
              >
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
          Brand
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setBrand("")}
            className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${!brand ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
          >
            All Brands
          </button>
          {brands.map((b) => (
            <button
              key={b.id}
              onClick={() => setBrand(b.id)}
              className={`text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${brand === b.id ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {showPrice && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Price Range
          </p>
          <div className="px-1 space-y-3">
            <input
              type="range"
              min={0}
              max={4000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>$0</span>
              <span className="text-amber-700 font-bold">
                up to ${maxPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {showRating && (
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            Min Rating
          </p>
          <div className="flex flex-col gap-1">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${minRating === r ? "bg-amber-600 text-white" : "text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
              >
                {r === 0 ? (
                  "Any Rating"
                ) : (
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-current" />
                    {r}+ stars
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {showClear && hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors"
        >
          <X size={14} /> Clear Filters
        </button>
      )}
    </>
  );
}
