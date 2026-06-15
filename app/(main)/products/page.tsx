"use client";

import { getBrands } from "@/api/brand.api";
import { getCategories, mapCategoriesToListItems } from "@/api/category.api";
import { getProducts, searchProducts } from "@/api/product.api";
import type { Brand, Category, Product } from "@/data/types";
import { mapListItemDtoToProduct } from "@/lib/product-mappers";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Reveal from "../Utilities/Reveal";
import ProductsHeroSection from "./components/ProductsHeroSection";
import {
  DesktopFiltersSidebar,
  MobileFiltersDrawer,
} from "./components/ProductsFiltersSection";
import ProductsListingSection from "./components/ProductsListingSection";

/* ── Component ────────────────────────────────── */
export default function HeroBanner() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "";
  const urlVendor = searchParams.get("vendor") ?? "";

  /* ── Filter state ── */
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(urlCategory);
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  const [vendor, setVendor] = useState(urlVendor);

  useEffect(() => {
    setVendor(urlVendor);
  }, [urlVendor]);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [productList, setProductList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  /* ── Fetch categories ── */
  useEffect(() => {
    getCategories()
      .then((res) => {
        const apiCats = mapCategoriesToListItems(res.data.data);
        setCategories(
          apiCats.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: "",
            image: c.image ?? "",
            parentId: null,
            productCount: c.productCount,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        );
      })
      .catch(() => {
        setCategories([]);
      });
  }, []);

  /* ── Fetch brands ── */
  useEffect(() => {
    getBrands()
      .then((res) => {
        const apiBrands = res.data.data;
        setBrands(
          apiBrands.map((b) => ({
            id: b.id,
            name: b.name,
            slug: b.slug,
            logo: b.logo ?? "",
            productCount: b._count?.products ?? 0,
            createdAt: b.createdAt,
          })),
        );
      })
      .catch(() => {
        setBrands([]);
      });
  }, []);

  /* ── Fetch / search products ── */
  useEffect(() => {
    const categoryId = category
      ? categories.find((c) => c.slug === category)?.id
      : undefined;
    const sortBy =
      sort === "price_asc" || sort === "price_desc"
        ? "price"
        : sort === "rating"
          ? "rating"
          : sort === "reviews"
            ? "reviewCount"
            : "createdAt";
    const sortOrder =
      sort === "price_asc" ? "asc" : sort === "price_desc" ? "desc" : "desc";

    const query = search.trim()
      ? {
          q: search.trim(),
          categoryId,
          storeId: vendor || undefined,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 4000 ? maxPrice : undefined,
          limit: 100,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc",
        }
      : {
          categoryId,
          storeId: vendor || undefined,
          search: search.trim() || undefined,
          minPrice: minPrice > 0 ? minPrice : undefined,
          maxPrice: maxPrice < 4000 ? maxPrice : undefined,
          limit: 100,
          sortBy,
          sortOrder: sortOrder as "asc" | "desc",
        };

    const fetchProducts = search.trim()
      ? searchProducts(query)
      : getProducts(query);

    fetchProducts
      .then((res) => {
        const list = res.data.data.map(mapListItemDtoToProduct);
        let filtered = list;
        if (brand) filtered = filtered.filter((p) => p.brandId === brand);
        if (minRating > 0)
          filtered = filtered.filter((p) => p.rating >= minRating);
        setProductList(filtered);
      })
      .catch((err) => {
        console.error("PRODUCT FETCH ERROR:", err?.message || err);
        setProductList([]);
      });
  }, [search, category, vendor, brand, minPrice, maxPrice, minRating, sort, categories]);

  const filtered = productList;

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setMinPrice(0);
    setMaxPrice(4000);
    setMinRating(0);
  };

  const hasFilters: boolean = !!(search || category || brand || minPrice > 0 || maxPrice < 4000 || minRating > 0);

  const activeCatLabel = category
    ? (categories.find((c) => c.slug === category)?.name ?? "All Products")
    : "All Products";

  return (
    <>
      <ProductsHeroSection />

      <div className="min-h-screen bg-[#FFFBEB]">
        {/* ── Page header ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 py-4 lg:py-10">
            <Reveal>
              <h1
                className="text-4xl font-black text-slate-900 tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {activeCatLabel}
              </h1>
            </Reveal>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-3">
              <Link href="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-600 font-medium">
                {activeCatLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-8">
            {/* ══ FILTER SIDEBAR (desktop) ══ */}
            <DesktopFiltersSidebar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
              brand={brand}
              setBrand={setBrand}
              brands={brands}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              hasFilters={hasFilters}
              clearFilters={clearFilters}
            />

            {/* ══ MAIN CONTENT ══ */}
            <ProductsListingSection
              filtered={filtered}
              view={view}
              setView={setView}
              sort={sort}
              setSort={setSort}
              hasFilters={hasFilters}
              category={category}
              setCategory={setCategory}
              brand={brand}
              setBrand={setBrand}
              brands={brands}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minRating={minRating}
              setMinRating={setMinRating}
              categories={categories}
              setFiltersOpen={setFiltersOpen}
              clearFilters={clearFilters}
            />
          </div>
        </div>

        {/* ── Mobile filters drawer ── */}
        <MobileFiltersDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          categories={categories}
          brand={brand}
          setBrand={setBrand}
          brands={brands}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          minRating={minRating}
          setMinRating={setMinRating}
          hasFilters={hasFilters}
          clearFilters={clearFilters}
        />
      </div>
    </>
  );
}
