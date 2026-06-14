"use client";

import { getCategoryBySlug } from "@/api/category.api";
import { getProducts } from "@/api/product.api";
import type { CategoryDetailDto } from "@/types/category";
import type { Product } from "@/data/types";
import type { ProductsMeta } from "@/types/product";
import { mapListItemDtoToProduct } from "@/lib/product-mappers";
import { ChevronDown, Grid3X3, LayoutList, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "../../Utilities/Productcard";
import Reveal from "../../Utilities/Reveal";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400";

const sortOptions = [
  { value: "createdAt_desc", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
  { value: "name_desc", label: "Name: Z to A" },
];

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<CategoryDetailDto | null>(null);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductsMeta | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [sort, setSort] = useState("createdAt_desc");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  // Fetch category info
  useEffect(() => {
    if (!slug) return;
    setCategoryLoading(true);
    getCategoryBySlug(slug)
      .then((res) => setCategory(res.data.data))
      .catch(() => setCategory(null))
      .finally(() => setCategoryLoading(false));
  }, [slug]);

  // Fetch products — only when category is loaded
  useEffect(() => {
    if (!slug || !category?.id) return;
    setProductsLoading(true);
    const [sortBy, sortOrder] = sort.split("_") as [string, "asc" | "desc"];

    getProducts({ categoryId: category.id, page, limit: 20, sortBy, sortOrder })
      .then((res) => {
        setProducts(res.data.data.map(mapListItemDtoToProduct));
        setMeta(res.data.meta);
      })
      .catch(() => {
        setProducts([]);
        setMeta(null);
      })
      .finally(() => setProductsLoading(false));
  }, [slug, sort, page, category?.id]);

  // Reset page when sort changes
  useEffect(() => {
    setPage(1);
  }, [sort]);

  // Derived
  const sortedProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* ══ CATEGORY HEADER ══ */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-8 lg:py-12">
          <Reveal>
            <div className="flex items-center gap-4">
              {category?.image && (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-amber-50 shrink-0 border border-slate-100">
                  <Image
                    fill
                    src={category.image}
                    alt={category.name}
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              )}
              <div>
                <h1
                  className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {category?.name ?? (
                    <span className="inline-block w-48 h-8 rounded-lg bg-slate-100 animate-pulse" />
                  )}
                </h1>
                {category?.description && (
                  <p className="text-slate-500 text-base mt-2 max-w-2xl">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Reveal>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/categories"
              className="hover:text-amber-600 transition-colors"
            >
              Categories
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">
              {category?.name ?? "..."}
            </span>
          </div>
        </div>
      </div>

      {/* ══ PRODUCTS SECTION ══ */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">
              {meta?.total ?? 0}
            </span>{" "}
            {meta?.total === 1 ? "product" : "products"} in{" "}
            <span className="font-semibold text-slate-700">
              {category?.name ?? "..."}
            </span>
          </p>

          <div className="flex items-center gap-2">
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

        {/* Products grid / list */}
        {productsLoading ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
                : "flex flex-col gap-4"
            }
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-slate-100 animate-pulse ${
                  view === "grid" ? "aspect-4/5" : "h-28"
                }`}
              />
            ))}
          </div>
        ) : sortedProducts.length === 0 && !categoryLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <Search size={24} className="text-amber-600" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">
              No products found
            </p>
            <p className="text-slate-500 text-sm mb-4">
              There are no products in this category yet.
            </p>
            <Link
              href="/categories"
              className="px-5 py-2.5 bg-amber-600 text-white font-semibold text-sm rounded-xl hover:bg-amber-700 transition-colors"
            >
              Browse All Categories
            </Link>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className={
                view === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
                  : "flex flex-col gap-4"
              }
            >
              {sortedProducts.map((product, i) => (
                <Reveal key={product.id} delay={i * 0.04} direction="up">
                  {view === "grid" ? (
                    <ProductCard product={product} index={i} />
                  ) : (
                    <Link
                      href={`/products/${product.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-5 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-50 p-4 transition-all duration-300">
                        <div className="relative w-28 h-28 sm:w-36 sm:h-36 shrink-0 rounded-xl overflow-hidden bg-slate-50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 112px, 144px"
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
                            <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors leading-snug mb-2">
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

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-bold transition-colors ${
                        p === page
                          ? "bg-amber-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-amber-400"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={page === meta.totalPages}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
