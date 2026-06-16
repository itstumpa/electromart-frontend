"use client";

import { getProductsByTag, type TagWithProductsDto } from "@/src/services/api/tag.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { motion } from "framer-motion";
import { ArrowLeft, Package, RefreshCw, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  slug: Promise<{ slug: string }>;
}

export default function TagProductsClient({ slug }: Props) {
  const [data, setData] = useState<TagWithProductsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [slugValue, setSlugValue] = useState("");

  useEffect(() => {
    slug.then(({ slug: s }) => setSlugValue(s));
  }, [slug]);

  const fetchData = () => {
    if (!slugValue) return;
    setLoading(true);
    getProductsByTag(slugValue)
      .then((res) => setData(res.data.data ?? null))
      .catch((err) => toast.error(getApiErrorMessage(err, "Failed to load products")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (slugValue) fetchData();
  }, [slugValue]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-slate-200 rounded w-48" />
            <div className="h-8 bg-slate-200 rounded w-64" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 bg-slate-100 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#FFFBEB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <Package size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-semibold">Tag not found</p>
            <Link
              href="/tags"
              className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-amber-600 hover:text-amber-700"
            >
              <ArrowLeft size={14} /> Browse all tags
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const products = data.products.map((pt) => pt.product);

  return (
    <div className="min-h-screen bg-[#FFFBEB]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/tags" className="hover:text-amber-600 transition-colors font-medium">
            Tags
          </Link>
          <span>/</span>
          <span className="text-slate-700 font-bold capitalize">{data.name}</span>
        </div>

        <div className="mb-8">
          <h1
            className="text-2xl sm:text-3xl font-black text-slate-900 capitalize"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {data.name}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} tagged with &ldquo;{data.name}&rdquo;
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <ShoppingBag size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 font-semibold">No products found for this tag</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group block bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="relative aspect-square bg-slate-50 overflow-hidden">
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                        <Package size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-xs text-slate-400 truncate mb-0.5">{product.store.name}</p>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug mb-2">
                      {product.name}
                    </h3>
                    <p className="text-base font-black text-amber-700">
                      ${Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
