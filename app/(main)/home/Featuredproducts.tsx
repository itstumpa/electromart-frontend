'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '@/api/product.api';
import { mapListItemDtoToProduct } from '@/lib/product-mappers';
import type { Product } from '@/data/types';
import Reveal from '../Utilities/Reveal';
import ProductCard from '../Utilities/Productcard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getFeaturedProducts()
      .then((res) => {
        setProducts(res.data.data.map(mapListItemDtoToProduct));
      })
      .catch(() => {
        setProducts([]);
      });
  }, []);

  return (
    <section className="py-1 md:py-5 bg-[#FFFBEB]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">

        <Reveal className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Featured <span className="text-amber-600">Products</span>
            </h2>
          </div>
          <Link
            href="/products?featured=true"
            className="group inline-flex items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 shrink-0"
          >
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-6">
          {products.slice(0, 6).map((product, i) => (
            <Reveal key={product.id} delay={i * 0.08} direction="up">
              <ProductCard product={product} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
