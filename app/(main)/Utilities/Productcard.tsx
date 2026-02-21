'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/types';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 overflow-hidden">

        {/* Image container */}
        <div className="relative overflow-hidden bg-slate-50 aspect-square">
          <Image
          fill
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.bestseller && (
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Bestseller
              </span>
            )}
            {product.featured && !product.bestseller && (
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                Featured
              </span>
            )}
            {discount && discount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
            aria-label="Add to wishlist"
          >
            <Heart size={15} />
          </motion.button>

          {/* Quick add button */}
          <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={(e) => e.preventDefault()}
              className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2.5 rounded-xl shadow-lg transition-colors"
            >
              <ShoppingCart size={15} />
              Add to Cart
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-amber-600 font-semibold mb-1">{product.brandName}</p>
          <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 mb-2 group-hover:text-amber-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-200 text-slate-200'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {product.rating} ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-black text-slate-900">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Stock */}
          {product.stock <= 15 && (
            <p className="text-[11px] text-red-500 font-semibold mt-1.5">
              Only {product.stock} left in stock
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}