"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, mapCategoriesToListItems } from "@/api/category.api";
import type { CategoryListItem } from "@/types/category";
import Reveal from "../Utilities/Reveal";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(mapCategoriesToListItems(res.data.data));
      })
      .catch(() => {
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      {/* ══ HEADER ══ */}
      <div className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 sm:px-6 py-8 lg:py-14">
          <Reveal>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <LayoutGrid className="h-5 w-5 text-amber-700" />
              </div>
              <h1
                className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                All <span className="text-amber-600">Categories</span>
              </h1>
            </div>
            <p className="text-slate-500 text-base max-w-xl">
              Browse our wide range of product categories and find exactly what
              you&apos;re looking for.
            </p>
          </Reveal>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">Categories</span>
          </div>
        </div>
      </div>

      {/* ══ CATEGORIES GRID ══ */}
      <div className="container mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-4/5 rounded-2xl bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
              <LayoutGrid size={24} className="text-amber-600" />
            </div>
            <p className="text-lg font-bold text-slate-900 mb-1">
              No categories found
            </p>
            <p className="text-slate-500 text-sm">
              Categories will appear here once they are added.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
            {categories.map((cat, i) => (
              <Reveal key={cat.id} delay={i * 0.05} direction="up">
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-white border border-slate-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 block"
                >
                  <div className="relative aspect-4/5 overflow-hidden">
                    <Image
                      fill
                      src={cat.image ?? PLACEHOLDER_IMAGE}
                      alt={cat.name}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                    {/* Hover indicator */}
                    <motion.div
                      initial={false}
                      className="absolute top-4 right-4 w-9 h-9 bg-amber-600 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ArrowRight size={15} className="text-white" />
                    </motion.div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-base leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-amber-300 text-xs font-semibold mt-1">
                      {cat.productCount}{" "}
                      {cat.productCount === 1 ? "Product" : "Products"}
                    </p>
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
