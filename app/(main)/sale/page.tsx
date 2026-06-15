"use client";

import { getCategories, mapCategoriesToListItems } from "@/api/category.api";
import { getProducts } from "@/api/product.api";
// import type { Product } from "@/data/types"; 
import { mapListItemDtoToProduct } from "@/lib/product-mappers";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Flame, X, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProductCard from "../Utilities/Productcard";
import Reveal from "../Utilities/Reveal";
import Link from "next/link";
import { Product } from "@/data/types";

const sortOptions = [
  { label: "Biggest Discount", value: "discount" },
  { label: "Price: Low–High", value: "price_asc" },
  { label: "Price: High–Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

export default function SalePage() {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("discount");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    getProducts({ limit: 100, onSale: true})
      .then((res) => setProducts(res.data.data.map(mapListItemDtoToProduct)))
      .catch(() => setProducts([]));
    getCategories()
      .then((res) =>
        setCategories(
          mapCategoriesToListItems(res.data.data).map((c) => ({
            id: c.id,
            name: c.name,
          })),
        ),
      )
      .catch(() => setCategories([]));
  }, []);

  const saleProducts = useMemo(() => {
    let list = products.filter(
      (p) => p.originalPrice && p.originalPrice > p.price,
    );
    if (category) list = list.filter((p) => p.categoryId === category);
    switch (sort) {
      case "discount":
        list.sort((a, b) => {
          const da = ((a.originalPrice! - a.price) / a.originalPrice!) * 100;
          const db = ((b.originalPrice! - b.price) / b.originalPrice!) * 100;
          return db - da;
        });
        break;
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [category, sort, products]);

  const saleCategories = categories.filter((cat) =>
    products.some(
      (p) =>
        p.categoryId === cat.id && p.originalPrice && p.originalPrice > p.price,
    ),
  );

  const totalSavings = saleProducts.reduce(
    (sum, p) => sum + (p.originalPrice! - p.price),
    0,
  );

  return (
    <div className="min-h-screen  bg-[#FFFBEB]">

              {/* Section Header */}
        <Reveal className="flex container mx-auto flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2 pt-10 px-4 sm:px-6 md:px-8">
          <div>
            <h2
              className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Ongoing{' '}
              <span className="text-amber-600">Sales</span>
            </h2>
          </div>
        </Reveal>

      {/* ── Filters ── */}
      <div className=" sticky top-16 z-30">
        <div className="container  mx-auto px-4 sm:px-6 md:px-8 py-3 flex flex-row gap-3 overflow-hidden flex-wrap">
          {/* Category pills */}
          <button
            onClick={() => setCategory("")}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${!category ? "bg-amber-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
          >
            All Sale
          </button>
          {saleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id === category ? "" : cat.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${category === cat.id ? "bg-amber-600 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"}`}
            >
              {cat.name}
            </button>
          ))}

          {/* Sort */}
          <div className="relative ml-auto shrink-0">
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
              size={12}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            <span className="font-bold text-slate-900">
              {saleProducts.length}
            </span>{" "}
            sale items
            {category && (
              <span>
                {" "}
                in{" "}
                <span className="text-amber-700 font-semibold">
                  {saleCategories.find((c) => c.id === category)?.name}
                </span>
              </span>
            )}
          </p>
          {category && (
            <button
              onClick={() => setCategory("")}
              className="flex items-center gap-1 text-xs text-amber-700 font-semibold hover:underline"
            >
              <X size={12} /> Clear filter
            </button>
          )}
        </div>

        {saleProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No sale products in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-5">
            {saleProducts.map((product, i) => (
              <Reveal key={product.id} delay={i * 0.05} direction="up">
                <ProductCard product={product} index={i} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
